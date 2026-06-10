/**
 * POST /api/webhooks/mercadopago
 *
 * Recebe notificações do Mercado Pago (IPN/Webhooks) e atualiza o status
 * de assinatura do usuário no Supabase.
 *
 * Segurança em duas camadas:
 *  1. x-signature (HMAC-SHA256) validada quando MERCADOPAGO_WEBHOOK_SECRET
 *     está configurada (painel MP → Webhooks → assinatura secreta).
 *  2. O status do pagamento é sempre re-consultado na API do MP — nunca
 *     confiamos no payload recebido.
 *
 * Documentação: https://www.mercadopago.com.br/developers/pt/docs/notifications/webhooks
 */

import { createHmac, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";

interface MpPaymentResponse {
  id: number;
  status: string;
  external_reference: string;
  transaction_amount: number;
  payer: { email: string };
}

/**
 * Valida o header x-signature ("ts=...,v1=...") conforme manifesto do MP:
 * "id:[data.id];request-id:[x-request-id];ts:[ts];"
 */
function isValidSignature(req: NextRequest, dataId: string, secret: string): boolean {
  const signature = req.headers.get("x-signature") ?? "";
  const requestId = req.headers.get("x-request-id") ?? "";

  const parts = Object.fromEntries(
    signature.split(",").map((p) => p.trim().split("=") as [string, string])
  );
  const ts = parts.ts;
  const v1 = parts.v1;
  if (!ts || !v1) return false;

  const manifest = `id:${dataId.toLowerCase()};request-id:${requestId};ts:${ts};`;
  const expected = createHmac("sha256", secret).update(manifest).digest("hex");

  try {
    return timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(v1, "hex"));
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      type?: string;
      action?: string;
      data?: { id?: string };
    };

    // MP envia notifications de tipo "payment"
    if (body.type !== "payment" || !body.data?.id) {
      return NextResponse.json({ ok: true });
    }

    const paymentId = body.data.id;

    const webhookSecret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
    if (webhookSecret) {
      // O manifesto usa o data.id da query string quando presente
      const dataId = req.nextUrl.searchParams.get("data.id") ?? paymentId;
      if (!isValidSignature(req, dataId, webhookSecret)) {
        console.error("[MP Webhook] Assinatura inválida para payment:", paymentId);
        return NextResponse.json({ error: "Assinatura inválida." }, { status: 401 });
      }
    }

    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!accessToken) {
      return NextResponse.json({ ok: true });
    }

    // Busca detalhes do pagamento na API do MP
    const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!mpRes.ok) {
      console.error("[MP Webhook] Erro ao buscar pagamento:", paymentId);
      return NextResponse.json({ error: "Não foi possível verificar pagamento." }, { status: 502 });
    }

    const payment = (await mpRes.json()) as MpPaymentResponse;
    const externalRef = payment.external_reference ?? "";

    // external_reference = "userId::planId"
    const [userId, planId] = externalRef.split("::");
    if (!userId || !planId) {
      console.error("[MP Webhook] external_reference inválido:", externalRef);
      return NextResponse.json({ ok: true });
    }

    const sb = createServerClient();

    if (payment.status === "approved") {
      await sb.from("user_profiles").update({
        subscription_status: "active",
        selected_plan: planId,
        mp_payment_id: String(payment.id),
        subscribed_at: new Date().toISOString(),
      }).eq("id", userId);
    } else if (["rejected", "cancelled"].includes(payment.status)) {
      await sb.from("user_profiles").update({
        subscription_status: "free",
        mp_payment_id: String(payment.id),
      }).eq("id", userId);
    }
    // status "pending" → não altera (aguarda confirmação)

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[MP Webhook] Erro inesperado:", err);
    // Retorna 200 para o MP não reenviar
    return NextResponse.json({ ok: true });
  }
}
