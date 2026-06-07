"use server";

import { createServerClient } from "@/lib/supabase";
import { z } from "zod";

const WaitlistSchema = z.object({
  email: z.string().email("E-mail inválido"),
});

export type WaitlistState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

export async function joinWaitlist(
  _prev: WaitlistState,
  formData: FormData
): Promise<WaitlistState> {
  const raw = { email: formData.get("email") };
  const parsed = WaitlistSchema.safeParse(raw);

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "E-mail inválido" };
  }

  const { email } = parsed.data;

  try {
    const client = createServerClient();

    // Verifica duplicata
    const { data: existing } = await client
      .from("waitlist_emails")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existing) {
      return {
        status: "success",
        message: "Você já está na lista! Avisaremos em breve. 🎉",
      };
    }

    const { error } = await client.from("waitlist_emails").insert({
      email,
      source: "landing_hero",
    });

    if (error) throw error;

    return {
      status: "success",
      message: "Perfeito! Você está na lista de espera. 🌿",
    };
  } catch (err) {
    console.error("[waitlist] erro ao inserir:", err);
    return {
      status: "error",
      message: "Algo deu errado. Tente novamente em instantes.",
    };
  }
}
