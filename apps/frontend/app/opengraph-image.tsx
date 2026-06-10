import { ImageResponse } from "next/og";

/**
 * OG image gerada em runtime (convenção opengraph-image do App Router).
 * Substitui o antigo /og-image.png, que nunca existiu no repositório —
 * sem isso, compartilhamentos em WhatsApp/redes saíam sem imagem.
 */

export const alt = "MelhorSabor — O alimento é o código-fonte da sua performance";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(180deg, #fffaf3 0%, #ffe8d6 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: 28,
              background: "#f47b3a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 56,
            }}
          >
            🍳
          </div>
          <span style={{ fontSize: 64, fontWeight: 700, color: "#1f2937" }}>
            MelhorSabor
          </span>
        </div>
        <div
          style={{
            fontSize: 44,
            color: "#1f2937",
            textAlign: "center",
            maxWidth: 900,
            lineHeight: 1.25,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          O alimento é o código-fonte da sua performance.
        </div>
        <div
          style={{
            marginTop: 36,
            fontSize: 26,
            color: "#7a6f69",
          }}
        >
          Receitas com IA · Comunidade · Diagnóstico gratuito
        </div>
      </div>
    ),
    size
  );
}
