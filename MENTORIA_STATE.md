# MENTORIA_STATE — Eimah 3D

## Projeto

- Nome: Eimah 3D
- Tipo: site institucional/vitrine (HTML + CSS + JS, sem framework)
- Pasta: `workspace\eimah3d`
- Fase atual: layout base entregue — aguardando conteúdo real do Instagram

## Decisões

- Direção visual: **B — loja limpa** (fundo claro, catálogo em grid, vídeo em bloco)
- Paleta extraída da logomarca: laranja `#FFA000`/`#F59E0B` + ciano `#00B8D4`
- Tema: claro por padrão, escuro opcional, persistido em `localStorage` (`eimah-theme`)
- Navegação: Quem somos · Catálogo · Pedido · Contato (logo leva à home)
- Home: hero com vídeo (`assets/video/hero.mp4`), carrossel de 3 destaques, última postagem do Instagram
- Catálogo: 9 cards com botão de pedido via WhatsApp
- Pedido: formulário com upload + descrição → resumo no WhatsApp
- Contato: formulário → `mailto:eimah3d@gmail.com`; WhatsApp `+55 85 99625-3954`

## Pendências (conteúdo real)

- Instagram bloqueia leitura sem login: bio, textos e produtos reais ainda NÃO importados
  - `quem-somos.html`: texto provisório
  - `catalogo.html`: 9 produtos provisórios (nomes/descrições/imagens)
  - `index.html`: card do Instagram aponta para o perfil, não para a última publicação
- Adicionar vídeo em `assets/video/hero.mp4` (poster SVG já cobre a ausência)
- Substituir SVGs ilustrativos por fotos reais dos produtos

## Limitações técnicas aceitas

- Site estático não envia arquivos nem e-mail por conta própria:
  - pedido abre o WhatsApp com resumo; arquivos são anexados manualmente;
  - contato abre o app de e-mail via `mailto`.
- Para envio real de arquivos/e-mail: backend próprio, Formspree/Netlify Forms ou API de e-mail.

## Evidências de validação

- `node --check js/main.js`: OK
- Validação de HTML: tags balanceadas, ids únicos, labels ligados, referências locais OK
- Edge headless (360/768/1440 px): sem overflow horizontal em todas as 5 páginas
- Interações testadas: tema alterna/persiste, menu mobile abre/fecha (Esc), carrossel avança e atualiza dots,
  formulário de pedido inválido → erro, válido → WhatsApp com resumo, upload lista arquivo, contato inválido → erro
