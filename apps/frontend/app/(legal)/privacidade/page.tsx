import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Como o MelhorSabor coleta, usa e protege seus dados pessoais — LGPD.",
  robots: { index: false, follow: false },
};

export default function PrivacidadePage() {
  return (
    <article className="prose prose-gray max-w-none">
      <p className="text-sm text-gray-400 mb-2">Versão provisória · 07 de junho de 2026</p>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Política de Privacidade
      </h1>
      <p className="text-gray-500 mb-8">
        Esta Política descreve como o MelhorSabor coleta, usa, armazena e
        protege seus dados pessoais, em conformidade com a{" "}
        <strong>Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018)</strong>.
      </p>

      <Section title="1. Controlador dos Dados">
        <p>
          O controlador dos seus dados pessoais é o{" "}
          <strong>MelhorSabor</strong> (melhorsabor.com.br). Para exercer seus
          direitos ou tirar dúvidas, contate nosso encarregado (DPO) pelo
          e-mail:{" "}
          <a href="mailto:privacidade@melhorsabor.com.br">
            privacidade@melhorsabor.com.br
          </a>
          .
        </p>
      </Section>

      <Section title="2. Dados Coletados">
        <p>Coletamos os seguintes dados:</p>
        <ul>
          <li>
            <strong>Lista de espera:</strong> endereço de e-mail fornecido
            voluntariamente;
          </li>
          <li>
            <strong>Dados de uso:</strong> páginas visitadas, tempo de sessão,
            eventos de interação (coletados de forma anonimizada via analytics);
          </li>
          <li>
            <strong>Dados técnicos:</strong> tipo de dispositivo, navegador,
            sistema operacional, endereço IP anonimizado (hash SHA-256).
          </li>
        </ul>
        <p>
          <strong>Não coletamos</strong> dados sensíveis como origem racial,
          convicção religiosa, dado genético ou biométrico nesta fase.
        </p>
      </Section>

      <Section title="3. Finalidade do Tratamento">
        <table className="w-full text-sm border-collapse border border-gray-200 mb-4">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-200 px-3 py-2 text-left">Dado</th>
              <th className="border border-gray-200 px-3 py-2 text-left">Finalidade</th>
              <th className="border border-gray-200 px-3 py-2 text-left">Base Legal (LGPD)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-200 px-3 py-2">E-mail</td>
              <td className="border border-gray-200 px-3 py-2">Comunicação sobre o lançamento</td>
              <td className="border border-gray-200 px-3 py-2">Consentimento (art. 7º, I)</td>
            </tr>
            <tr>
              <td className="border border-gray-200 px-3 py-2">Dados de uso</td>
              <td className="border border-gray-200 px-3 py-2">Melhoria da plataforma</td>
              <td className="border border-gray-200 px-3 py-2">Legítimo interesse (art. 7º, IX)</td>
            </tr>
            <tr>
              <td className="border border-gray-200 px-3 py-2">IP anonimizado</td>
              <td className="border border-gray-200 px-3 py-2">Segurança e prevenção de fraudes</td>
              <td className="border border-gray-200 px-3 py-2">Legítimo interesse (art. 7º, IX)</td>
            </tr>
          </tbody>
        </table>
      </Section>

      <Section title="4. Compartilhamento de Dados">
        <p>
          Seus dados podem ser compartilhados com prestadores de serviço que
          atuam como operadores sob nossas instruções:
        </p>
        <ul>
          <li>
            <strong>Supabase Inc.</strong> — armazenamento de dados (servidores
            na AWS us-east-1, podendo ser migrado para região brasileira);
          </li>
          <li>
            <strong>Vercel Inc.</strong> — hospedagem do frontend;
          </li>
          <li>
            <strong>PostHog Inc.</strong> (quando ativado) — analytics de uso
            anonimizado.
          </li>
        </ul>
        <p>
          <strong>Não vendemos</strong> dados pessoais a terceiros. Qualquer
          transferência internacional observa as salvaguardas previstas na LGPD
          (art. 33).
        </p>
      </Section>

      <Section title="5. Retenção de Dados">
        <p>
          Mantemos seu e-mail enquanto você não solicitar a exclusão ou até 12
          meses após o lançamento da plataforma, o que ocorrer primeiro. Dados
          de uso anonimizados podem ser retidos por até 24 meses para fins
          estatísticos.
        </p>
      </Section>

      <Section title="6. Seus Direitos (LGPD art. 18)">
        <p>Você tem direito a:</p>
        <ul>
          <li>Confirmar se tratamos seus dados;</li>
          <li>Acessar os dados que temos sobre você;</li>
          <li>Corrigir dados incompletos, inexatos ou desatualizados;</li>
          <li>
            Solicitar a <strong>exclusão</strong> dos seus dados (direito ao
            esquecimento);
          </li>
          <li>Revogar o consentimento a qualquer momento;</li>
          <li>
            Portabilidade dos dados para outro serviço, quando aplicável.
          </li>
        </ul>
        <p>
          Para exercer qualquer direito, envie e-mail para{" "}
          <a href="mailto:privacidade@melhorsabor.com.br">
            privacidade@melhorsabor.com.br
          </a>{" "}
          com o assunto <em>&ldquo;Direitos LGPD&rdquo;</em>. Responderemos em até 15 dias
          corridos.
        </p>
      </Section>

      <Section title="7. Cookies e Tecnologias Similares">
        <p>
          Utilizamos cookies estritamente necessários para o funcionamento da
          plataforma. Cookies analíticos (PostHog, Analytics) são opcionais e
          ativados apenas com seu consentimento, via banner de cookies exibido
          na primeira visita.
        </p>
        <p>
          Você pode gerenciar ou desativar cookies nas configurações do seu
          navegador a qualquer momento.
        </p>
      </Section>

      <Section title="8. Segurança">
        <p>
          Adotamos medidas técnicas e organizacionais para proteger seus dados:
          criptografia em trânsito (TLS 1.3), controle de acesso baseado em
          funções (RLS no Supabase), e nenhum armazenamento de IP em texto
          claro.
        </p>
        <p>
          Em caso de incidente de segurança que possa afetar seus direitos,
          notificaremos a ANPD e os titulares afetados no prazo legal.
        </p>
      </Section>

      <Section title="9. Alterações nesta Política">
        <p>
          Podemos atualizar esta Política periodicamente. Notificaremos por
          e-mail os usuários cadastrados sobre alterações materiais. A data da
          última revisão está indicada no topo desta página.
        </p>
      </Section>

      <Section title="10. Contato e DPO">
        <p>
          Encarregado de Proteção de Dados (DPO):{" "}
          <a href="mailto:privacidade@melhorsabor.com.br">
            privacidade@melhorsabor.com.br
          </a>
          <br />
          Plataforma: melhorsabor.com.br
          <br />
          Autoridade Nacional de Proteção de Dados:{" "}
          <a
            href="https://www.gov.br/anpd"
            target="_blank"
            rel="noopener noreferrer"
          >
            gov.br/anpd
          </a>
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
