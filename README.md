# REHAB Clinic Club

Landing page institucional da mentoria empresarial para proprietários e gestores de clínicas. Implementada na base Astro existente, com saída estática e JavaScript apenas para interações. A configuração Vercel foi preservada.

## Executar

Requer Node.js >= 22.12.0.

```sh
npm ci
npm run dev
npm run check
npm run build
npm run preview
```

Não há configuração de ESLint nem suíte de testes na base original. `check` executa a verificação Astro/TypeScript.

## Conteúdo e estrutura

- `src/data/content.ts`: textos editáveis, pilares, jornada, mentoras, recursos e contato.
- `src/components/`: Header, Hero, Manifesto, Method, Journey, Mentors, Tools, CTA, LeadForm e Footer.
- `src/scripts/main.ts`: navegação, método por teclado, animações, máscara e integração do formulário.
- `src/styles/global.css`: identidade, fontes locais e regras responsivas.
- `public/brand/`: logos oficiais copiados dos arquivos da REHAB, padrão institucional e imagem social.
- `public/fonts/`: Aviano Contrast Regular e Raleway Light/Bold, encontradas na biblioteca local do usuário.
- `/privacidade` e `/termos`: páginas provisórias claramente identificadas; precisam de conteúdo institucional aprovado.

A metodologia de setembro de 2026 e o branding book são as fontes do conteúdo. Fotografias das mentoras não foram fornecidas: as áreas de foto estão identificadas, sem imagens de pessoas fictícias. A composição de abertura usa exclusivamente os elementos oficiais da marca.

A paleta prioriza o manual. Champagne não foi usado devido à divergência entre HEX e RGB no documento.

## Configuração antes da publicação

Copie `.env.example` para o ambiente apropriado e configure:

- `SITE_URL`: domínio HTTPS definitivo. Habilita canonical e URLs oficiais de Open Graph e sitemap. Sem domínio, o sitemap fica vazio.
- `PUBLIC_CONTACT_EMAIL`: contato institucional aprovado; omitido enquanto vazio.
- `PUBLIC_LEAD_ENDPOINT`: endpoint HTTPS para cadastro. Não incluir tokens ou segredos.
- `PUBLIC_PRIVACY_APPROVED=true`: habilitar somente após substituir e aprovar a política de privacidade. O formulário fica indisponível se essa flag não estiver ativa, mesmo com endpoint configurado.

Substituir os placeholders das fotos por imagens oficiais otimizadas e atualizar o HTML com dimensões e textos alternativos. Confirmar os direitos de uso web da Aviano antes de publicar. Substituir também os Termos de Uso e conferir os textos institucionais.

Nenhuma publicação ou mudança de infraestrutura foi realizada nesta implementação.

## Contrato da integração de leads

Requisição `POST`, `Content-Type: application/json`, cabeçalho `Idempotency-Key` (UUID estável para tentativas com o mesmo conteúdo). Em integração externa, habilitar CORS para a origem do site e os dois cabeçalhos.

```json
{
  "name": "Nome informado",
  "clinic": "Clínica informada",
  "email": "email informado",
  "phone": "DDD e número, apenas dígitos",
  "challenge": "Opção selecionada",
  "consent": true,
  "consentText": "Texto exibido ao usuário",
  "source": "Origem e caminho da página, sem query string",
  "utm": { "utm_source": "valor opcional" },
  "submittedAt": "Data ISO"
}
```

Sucesso exige HTTP 2xx e JSON `{ "success": true }`. Não existe resposta simulada. Falhas, timeouts e respostas sem confirmação mantêm o formulário preenchido. Nenhum dado pessoal é salvo em storage, registrado em console ou enviado a analytics. Os parâmetros UTM são lidos e enviados apenas após o consentimento; não se coleta referrer com possíveis dados pessoais.

O backend deve validar e limitar os campos, confirmar consentimento, proteger contra spam/abuso, aplicar idempotência, registrar a versão aprovada da política e encaminhar dados ao CRM com segurança. As validações no navegador não substituem as validações no servidor.

O evento DOM `rehab:lead-confirmed` é emitido sem dados pessoais somente após a confirmação do backend. Integrações futuras de analytics devem aplicar o consentimento específico adequado; nenhum tracker foi instalado.

## QA

Validar navegação desktop/mobile, teclado no método (Tab, Enter, setas, Home, End), accordion mobile, menu (incluindo Escape), formulário, movimento reduzido e páginas legais. Sem endpoint real, o fluxo de entrega de leads permanece pendente de teste integrado.

### Verificação realizada nesta implementação

- `npm run check`: zero erros, avisos ou hints.
- `npm run build`: compilação estática concluída.
- Navegador: desktop (1440px), tablet (1024px) e mobile (390px e 320px), sem largura de conteúdo excedente.
- Menu mobile e accordion confirmados; seleção do diagrama por clique e setas do teclado confirmada.
- Formulário vazio indica os seis campos inválidos; formulário preenchido informa indisponibilidade sem simular sucesso.
- Uma única H1, sem IDs duplicados, assets locais faltantes, imagens quebradas ou âncoras inválidas na página inicial.
- Console do navegador sem erros observados.
- Fluxo real de envio/CRM e medições de Core Web Vitals permanecem pendentes.

## Efeitos de movimento

`src/scripts/motion.ts` adiciona entrada dos títulos por palavras, leitura progressiva da frase institucional e parallax em camadas decorativas. O CSS inclui hover nos CTAs, navegação, jornada, mentoras e recursos. A composição de abertura responde discretamente ao ponteiro em dispositivos com mouse.

A rolagem continua nativa. As atualizações são agrupadas por `requestAnimationFrame`, sem loop contínuo em repouso. Em mobile, a intensidade do parallax é reduzida; com `prefers-reduced-motion`, os deslocamentos e as animações de texto são desativados, inclusive ao mudar a preferência durante a sessão. Os textos originais continuam presentes nos headings e acessíveis à seleção e aos leitores de tela.

O método REHAB possui uma sequência de rolagem no desktop: as cinco letras partem de uma linha horizontal e seguem trajetórias curvas até formar o diagrama circular oficial. O movimento é reversível, conserva seleção e teclado e revela os anéis e o logotipo ao longo da formação. Em mobile é mantido o accordion; com movimento reduzido, o diagrama desktop aparece pronto, sem a sequência.

## Adaptação da copy da mentoria — 26/10/2026

Conteúdo comercial adaptado do documento fornecido pelo usuário, `Copy página Mentoria - Rehab.pdf` (8 páginas). Atualizados hero, situações da clínica, programa (12 meses, encontros online semanais, WhatsApp com as mentoras, networking e dois encontros presenciais por ano), biografias, público, manifesto e aplicação. A duração da experiência de Vanessa e Bárbara segue o novo documento.

A seção O método REHAB, seu título, os dados dos cinco pilares, o componente e os módulos de animação foram preservados. A seção 03 usa a timeline existente para explicar o programa; a seção 05 usa a lista expansível e seu efeito de progressão para apresentar o público. Os depoimentos do PDF são placeholders e não foram publicados como relatos reais. As fotos e a integração de envio continuam pendentes.

## Ícones

Interface padronizada com Material Symbols Outlined (a família do catálogo https://www.shadcn.io/icons/material-symbols), peso 100, sem preenchimento. Componente reutilizável `src/components/Icon.astro`, com ícones decorativos ocultos da árvore de acessibilidade. Google Fonts entrega somente os sete glifos utilizados (add, arrow_back, arrow_downward, arrow_outward, arrow_upward, close, menu). Não foi adicionada dependência React. As letras REHAB e o logotipo continuam sendo elementos oficiais da marca, sem substituição por ícones.

### Leitura dos pilares por rolagem

Após formar o círculo e alinhá-lo à esquerda, a rolagem passa automaticamente por R, E, H, A e B. Cada letra é destacada e seu texto entra com uma transição; rolar para cima reverte a sequência. Clique e teclado continuam como navegação complementar. Em mobile, os cinco textos iniciam abertos e o item em leitura recebe destaque. Com movimento reduzido no desktop, todos os textos ficam disponíveis em uma sequência estática, sem exigir cliques.

A órbita do método inclui uma linha de tempo SVG com marcador: a linha percorre o círculo de acordo com a rolagem e alcança E, H, A e B nos mesmos limites que trocam o texto. Na leitura de B, completa o retorno a R; a rolagem reversa recua o traço. O indicador é decorativo, não recebe foco e fica desativado com movimento reduzido.
