"use client";

import { useActionState, useEffect, useRef } from "react";
import { joinWaitlist, type WaitlistState } from "@/app/actions/waitlist";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

const initialState: WaitlistState = { status: "idle" };

export function WaitlistForm() {
  const [state, action, isPending] = useActionState(joinWaitlist, initialState);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      if (inputRef.current) inputRef.current.value = "";
    }
  }, [state]);

  return (
    <div id="waitlist" className="w-full max-w-md">
      <form action={action} className="flex flex-col sm:flex-row gap-3">
        <input
          ref={inputRef}
          type="email"
          name="email"
          required
          placeholder="seu@email.com"
          disabled={isPending}
          className="flex-1 px-5 py-3.5 rounded-full border border-gray-200 bg-white text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent shadow-sm disabled:opacity-60 transition"
        />
        <Button
          type="submit"
          disabled={isPending}
          size="lg"
          className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-white px-7 py-3.5 text-sm rounded-full font-semibold shadow-md disabled:opacity-60 transition whitespace-nowrap"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Enviando…
            </>
          ) : (
            "Entrar na lista"
          )}
        </Button>
      </form>

      {state.status === "success" && (
        <p className="mt-3 flex items-center gap-2 text-sm text-green-700 font-medium">
          <CheckCircle className="w-4 h-4 shrink-0" />
          {state.message}
        </p>
      )}

      {state.status === "error" && (
        <p className="mt-3 flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {state.message}
        </p>
      )}
    </div>
  );
}
