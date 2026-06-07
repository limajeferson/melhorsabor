import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description: "Termos e condições de uso da plataforma MelhorSabor.",
  robots: { index: false, follow: false },
};

export default function TermosPage() {
  return (
    <article className="prose prose-gray max-w-none">
      <p className="text-sm text-gray-400 mb-2">Versão provisória · 07 de junho de 2026</p>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">Termos de Uso</h1>
      <p className="text-gray-500 mb-8">
        Ao utilizar a plataforma MelhorSabor, você concorda com os termos
        descritos neste documento. Leia-os com atenção.
      </p>

      <Section title="1. Sobre a Plataforma">
        <p>
          O MelhorSabor (<strong>melhorsabor.com.br</strong>) é uma plataforma
          digital de receitas com inteligência artificial, voltada à promoção da
          saúde, nutrição e bem-estar. A plataforma está em fase de
          pré-lançamento (<em>beta fechado</em>).
        </p>
      </Section>

      <Section title="2. Cadastro e Lista de Espera">
        <p>
          Ao cadastrar seu e-mail na lista de espera, você autoriza o
          MelhorSabor a entrar em contato com informações sobre o lançamento,
          novidades e funcionalidades da plataforma. Não compartilharemos seu
          e-mail com terceiros para fins comerciais sem seu consentimento
          expresso.
        </p>
      </Section>

      <Section title="3. Uso Aceitável">
        <p>É proibido ao usuário:</p>
        <ul>
          <li>Utilizar a plataforma para fins ilegais ou fraudulentos;</li>
          <li>
            Tentar obter acesso não autorizado a sistemas, dados ou contas de
            outros usuários;
          </li>
          <li>
            Publicar conteúdo ofensivo, discriminatório ou que viole direitos de
            terceiros;
          </li>
          <li>
            Reproduzir, distribuir ou explorar comercialmente conteúdo da
            plataforma sem autorização prévia e por escrito.
          </li>
        </ul>
      </Section>

      <Section title="4. Propriedade Intelectual">
        <p>
          Todo o conteúdo da plataforma — textos, imagens, logotipos, código e
          receitas exclusivas — é de propriedade do MelhorSabor ou de seus
          parceiros licenciantes, protegido pelas leis brasileiras de direitos
          autorais (Lei nº 9.610/98).
        </p>
        <p>
          Receitas publicadas por criadores parceiros permanecem de propriedade
          dos respectivos autores; ao publicá-las na plataforma, o criador
          concede ao MelhorSabor licença não exclusiva de uso para fins de
          exibição e distribuição.
        </p>
      </Section>

      <Section title="5. Limitação de Responsabilidade">
        <p>
          O conteúdo nutricional e de receitas disponível na plataforma tem
          caráter <strong>informativo</strong> e não substitui a orientação de
          nutricionista, médico ou outro profissional de saúde habilitado.
        </p>
        <p>
          O MelhorSabor não se responsabiliza por decisões alimentares tomadas
          exclusivamente com base no conteúdo da plataforma.
        </p>
      </Section>

      <Section title="6. Modificações">
        <p>
          Estes Termos podem ser atualizados periodicamente. Notificaremos
          usuários cadastrados sobre alterações relevantes por e-mail ou
          notificação na plataforma. O uso continuado após a atualização implica
          aceitação dos novos termos.
        </p>
      </Section>

      <Section title="7. Lei Aplicável e Foro">
        <p>
          Estes Termos são regidos pelas leis da República Federativa do Brasil.
          Fica eleito o foro da Comarca de São Paulo/SP para dirimir quaisquer
          controvérsias, com renúncia expressa a qualquer outro, por mais
          privilegiado que seja.
        </p>
      </Section>

      <Section title="8. Contato">
        <p>
          Para dúvidas ou solicitações relacionadas a estes Termos, entre em
          contato pelo e-mail:{" "}
          <a href="mailto:contato@melhorsabor.com.br">
            contato@melhorsabor.com.br
          </a>
          .
        </p>
      </Section>
    </article>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-3">{title}</h2>
      <div className="text-gray-600 leading-relaxed space-y-3">{children}</div>
    </section>
  );
}
