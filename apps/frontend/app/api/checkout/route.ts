/**
 * POST /api/checkout
 *
 * Cria uma preferência de pagamento no Mercado Pago (Checkout Pro) e retorna
 * a URL de redirecionamento (init_point) para o browser.
 *
 * Body: { planId: string; userId: string; userEmail: string }
 * Response: { init_point: string } | { error: string }
 */

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

// Mapeamento de preços por planId (em centavos → R$)
const PLAN_PRICES: Record<string, { title: string; price: number; months: number }> = {
  mensal:      { title: "MelhorSabor Mensal",      price: 47,  months: 1  },
  trimestral:  { title: "MelhorSabor Trimestral",  price: 139, months: 3  },
  semestral:   { title: "MelhorSabor Semestral",   price: 276, months: 6  },
  anual:       { title: "MelhorSabor Anual",       price: 477, months: 12 },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      planId: string;
      userId: string;
      userEmail: string;
    };
    const { planId, userId, userEmail } = body;

    if (!planId || !userId || !userEmail) {
      return NextResponse.json({ error: "Dados incompletos." }, { status: 400 });
    }

    const plan = PLAN_PRICES[planId];
    if (!plan) {
      return NextResponse.json({ error: "Plano inválido." }, { status: 400 });
    }

    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!accessToken) {
      // Modo sandbox sem token configurado — retorna URL de mock para desenvolvimento
      return NextResponse.json({
        init_point: `/planos?status=sandbox&plan=${planId}`,
        sandbox: true,
      });
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://melhorsabor.com.br";

    const preference = {
      items: [
        {
          id: planId,
          title: plan.title,
          quantity: 1,
          unit_price: plan.price,
          currency_id: "BRL",
        },
      ],
      payer: { email: userEmail },
      back_urls: {
        success: `${baseUrl}/planos?status=approved&plan=${planId}`,
        failure: `${baseUrl}/planos?status=rejected&plan=${planId}`,
        pending: `${baseUrl}/planos?status=pending&plan=${planId}`,
      },
      auto_return: "approved" as const,
      notification_url: `${baseUrl}/api/webhooks/mercadopago`,
      external_reference: `${userId}::${planId}`,
      statement_descriptor: "MELHORSABOR",
    };

    const mpRes = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(preference),
    });

    if (!mpRes.ok) {
      const errText = await mpRes.text();
      console.error("[MP Checkout] Erro na API:", errText);
      return NextResponse.json({ error: "Erro ao criar preferência de pagamento." }, { status: 502 });
    }

    const data = (await mpRes.json()) as { id: string; init_point: string; sandbox_init_point: string };

    // Salva mp_preference_id no perfil para rastreabilidade
    try {
      const sb = createServerClient();
      await sb.from("user_profiles").update({
        mp_preference_id: data.id,
        selected_plan: planId,
      }).eq("id", userId);
    } catch {
      // Não bloqueia o checkout se falhar aqui
    }

    // Em ambiente de teste/sandbox o MP retorna sandbox_init_point
    const isSandbox = accessToken.startsWith("TEST-");
    const redirectUrl = isSandbox ? data.sandbox_init_point : data.init_point;

    return NextResponse.json({ init_point: redirectUrl });
  } catch (err) {
    console.error("[MP Checkout] Erro inesperado:", err);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
