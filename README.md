# Site Apex Engine Parts — versão estática (HTML/CSS/JS)

Site novo, reconstruído a partir do backup do WordPress antigo, sem depender de WordPress, banco de dados ou PHP. É só HTML, CSS e um pouco de JavaScript — abre em qualquer navegador e pode ser hospedado em qualquer lugar.

## Estrutura de arquivos

```
apex-site/
├── index.html                    → Home
├── quem-somos.html
├── linhas-de-produtos.html
├── suporte-tecnico.html
├── inmetro.html
├── contato.html
├── politica-de-privacidade.html
├── css/style.css                 → todo o visual do site (cores, fontes, layout)
├── js/script.js                  → menu mobile, carrossel do banner, formulário
└── assets/
    ├── img/                      → logo, banners, fotos
    ├── img/produtos/             → fotos das linhas de produtos
    └── docs/                     → PDFs de manuais técnicos (25 arquivos)
```

## Como editar

Cada página é um arquivo `.html` separado — abra no bloco de notas, VS Code, ou qualquer editor de texto e mude o texto diretamente. Não precisa de build, compilação nem terminal.

- **Mudar um texto**: procure o texto no arquivo `.html` da página e edite direto.
- **Trocar uma imagem**: substitua o arquivo dentro de `assets/img/` mantendo o mesmo nome, ou troque o nome no `src="..."` da tag `<img>`.
- **Mudar uma cor**: quase todas as cores do site estão centralizadas no topo do arquivo `css/style.css`, dentro de `:root { ... }`. Por exemplo, `--red: #e10707;` é o vermelho da marca — mude aqui e atualiza o site inteiro.
- **Adicionar/remover um item de menu**: o menu de navegação se repete no topo de cada arquivo `.html` (bloco `<nav class="main-nav">`) — edite em todas as páginas para manter consistência.

## Fontes

As fontes (Oswald, IBM Plex Sans, IBM Plex Mono) estão salvas localmente em `assets/fonts/` e carregadas via `@font-face` no `css/style.css`. O site **não depende de internet nem do Google Fonts** para exibir a tipografia corretamente — funciona 100% offline ou em qualquer servidor, mesmo sem acesso externo.

## Sobre o formulário de contato

Como o site é 100% estático (sem servidor por trás), o formulário da página `contato.html` abre o programa de e-mail do visitante com a mensagem pronta para envio (via `mailto:`). Isso funciona sem nenhuma configuração, mas depende do visitante ter um cliente de e-mail configurado no computador/celular.

Se no futuro vocês quiserem que o formulário envie e-mails diretamente (sem abrir o cliente de e-mail do visitante), é possível integrar um serviço como **Formspree**, **EmailJS** ou **Web3Forms** — todos têm planos gratuitos e não exigem servidor próprio. Posso ajudar a configurar isso quando vocês decidirem qual usar.

## Como publicar o site

Qualquer serviço de hospedagem de arquivos estáticos funciona. Os mais simples:

- **Netlify** ou **Vercel**: arraste a pasta inteira no painel deles e o site vai ao ar em segundos (grátis).
- **GitHub Pages**: suba os arquivos num repositório e ative o Pages nas configurações.
- **Hospedagem tradicional (cPanel/FTP)**: envie todos os arquivos para a pasta `public_html` (ou equivalente) do seu domínio.

Não é necessário banco de dados, PHP ou qualquer instalação — é só copiar os arquivos.

## O que foi migrado do site antigo

- ✅ 7 páginas institucionais (Home, Quem Somos, Linhas de Produtos, Suporte Técnico, INMETRO, Contato, Política de Privacidade)
- ✅ Todos os textos originais
- ✅ Logo, banners e fotos de produtos
- ✅ 25 PDFs de manuais técnicos de motores
- ✅ Dados de contato, endereço e mapa
- ❌ Blog (28 posts antigos de 2012–2022) — não incluído, por decisão do cliente
- ❌ Formulário com envio automático de e-mail — substituído por link `mailto:` (ver seção acima)
