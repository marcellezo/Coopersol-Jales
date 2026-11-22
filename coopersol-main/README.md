# Site Coopersol Jales

Site institucional da **Coopersol** (Cooperativa de Trabalho Regional Solidária de Catadores de Resíduos Sólidos de Jales/SP), feito como trabalho de curricularização do curso de Sistemas para Internet da **FATEC Jales**.

O site mostra quem é a cooperativa, em que dia a coleta seletiva passa em cada bairro, o que separar e o que não é coletado, onde entregar o reciclável, fotos e vídeo da sede e a prestação de contas. Também tem um formulário de contato.

## Tecnologias

- **HTML5** semântico
- **CSS3** com **Flexbox** e **CSS Grid**
- **JavaScript** puro (sem bibliotecas), em `assets/js/main.js`: tamanho do texto e alto contraste salvos no navegador, carrossel com setas, bolinhas e rolagem suave, e busca de bairro no cronograma
- O site **continua funcionando sem JavaScript**: o menu do celular é só CSS, o cronograma aparece completo e o carrossel funciona ao deslizar
- **VLibras**, o tradutor para Libras do Governo Federal
- Fontes do Google Fonts: **Nunito** (títulos) e **Inter** (texto)

## Estrutura de pastas

```
coopersol-site/
├── index.html              Página inicial
├── formulario.html         Página do formulário de contato
├── README.md
└── assets/
    ├── js/
    │   └── main.js         Acessibilidade, carrossel e busca de bairro
    ├── css/
    │   ├── base.css        Cores, fontes e componentes usados em todas as telas
    │   ├── mobile.css      Celular: até 767px
    │   ├── tablet.css      Tablet: de 768px a 1023px
    │   └── desktop.css     Computador: a partir de 1024px
    ├── img/
    │   ├── logo.svg        Símbolo da Coopersol (versão Selo escuro)
    │   ├── prefeitura-jales.jpg   Logo da Prefeitura de Jales (parceira)
    │   └── galeria/        Fotos da sede (placas de veículos borradas)
    └── video/
        ├── coopersol-prefeitura.mp4   Vídeo da Prefeitura de Jales (540p, ~14 MB)
        └── poster.jpg                 Imagem exibida antes do play
```

Os CSS de cada tela são carregados com o atributo `media` no `<link>`, então o navegador só aplica o arquivo da largura atual:

```html
<link rel="stylesheet" href="assets/css/base.css">
<link rel="stylesheet" href="assets/css/mobile.css"  media="(max-width: 767px)">
<link rel="stylesheet" href="assets/css/tablet.css"  media="(min-width: 768px) and (max-width: 1023px)">
<link rel="stylesheet" href="assets/css/desktop.css" media="(min-width: 1024px)">
```

## Seções da página inicial

1. **Coleta**: busca de bairro, cronograma de segunda a sexta (manhã e tarde), sábado até o meio-dia e ponto de entrega na sede
2. **Como separar**: destaque sobre separação correta, 6 tipos de material (papel, plástico, metal, vidro, lixo eletrônico e óleo de cozinha), **o que não coletamos** e dicas
3. **Quem somos**: história (Acoserge em 2007, Coopersol em março de 2011), pilares e parceria com a Prefeitura
4. **Galeria**: vídeo + carrossel de fotos
5. **Transparência**: prestação de contas
6. **Empresas e parceiros**

## Onde usamos Flexbox e onde usamos Grid

| Parte do site | Layout | Celular | Tablet | Computador |
| --- | --- | --- | --- | --- |
| Barra de acessibilidade | Flexbox | atalho + botões | em linha | em linha |
| Cabeçalho e menu | Flexbox | menu sanduíche | em linha | em linha |
| Hero (chamada principal) | Flexbox | 1 coluna | texto + logo | texto + logo |
| Números da cooperativa | **Grid** | 2 colunas | 4 colunas | 4 colunas |
| Cronograma da coleta | **Grid** | 1 coluna | 2 colunas | 3 colunas |
| Ponto de entrega | **Grid** | foto em cima | foto + texto | foto + texto |
| Cards de materiais | **Grid** | 2 colunas | 3 colunas | 3 colunas |
| O que não coletamos | **Grid** | 2 colunas | 3 colunas | 3 colunas |
| Dicas de separação | Flexbox | 1 coluna | 2 colunas | 4 colunas |
| Quem somos + linha do tempo | Flexbox | 1 coluna | 2 colunas | 2 colunas |
| Galeria (vídeo + fotos) | **Grid** | vídeo em cima | 240px + carrossel | 300px + carrossel |
| Carrossel de fotos | Flexbox + scroll-snap + JS | 1 foto | 1 foto | 1 foto e meia |
| Prestação de contas | **Grid** | 1 coluna | 2 colunas | 4 colunas |
| Formulário + cartão lateral | **Grid** | 1 coluna | 1 coluna | 2 colunas (2fr / 1fr) |
| Campos do formulário | **Grid** | 1 coluna | 2 colunas | 2 colunas |
| Rodapé | **Grid** | 1 coluna | 2 colunas | 3 colunas (2fr 1fr 1fr) |

## Acessibilidade

O site é público e ligado à Prefeitura, então segue as recomendações do **eMAG** (Modelo de Acessibilidade em Governo Eletrônico) e da **WCAG 2.1 nível AA**:

- **Barra de acessibilidade** no topo das duas páginas:
  - atalhos de teclado **Alt+1** (conteúdo), **Alt+2** (menu) e **Alt+3** (rodapé), com `accesskey`
  - **A− / A / A+**: diminui, volta ao normal ou aumenta o texto em 4 níveis (100% a 137,5%); como o site usa `rem`, tudo cresce junto
  - **Alto contraste**: fundo preto, texto branco e links amarelos (classe `alto-contraste` no `<html>`)
  - as escolhas ficam salvas no navegador (`localStorage`) e valem para as duas páginas; um script pequeno no `<head>` aplica antes de a página aparecer, para não "piscar"
  - um aviso para leitor de tela (`aria-live`) fala o que mudou
- **VLibras**: o botão azul de Libras na lateral traduz o texto da página para a Língua Brasileira de Sinais
- Link **"Pular para o conteúdo"**, que aparece ao apertar Tab
- **Foco visível** (contorno amarelo) em links, botões, vídeo e carrossel
- **Contraste**: as cores dos cards de materiais foram escurecidas para passar no mínimo de 4,5:1
- **Textos alternativos** descritivos em todas as fotos e `figcaption` em cada uma
- **Vídeo** com legendas na própria imagem, descrição ligada por `aria-describedby` e `preload="none"`, para não gastar dados de quem não der play
- **Carrossel** navegável pelo teclado: Tab até ele e use as setas (← →), Home e End; as bolinhas têm área de toque de 28px
- `prefers-reduced-motion`: quem pede menos movimento no sistema não vê animações
- HTML semântico, títulos em ordem, `lang="pt-BR"`, `aria-label` nas regiões

Resultado do Google Lighthouse (computador, 13/11/2026), nas duas páginas: **Acessibilidade 100**, SEO 100, Desempenho 100 e Boas práticas 96.

### Carrossel

A base é CSS: `display: flex` + `overflow-x: auto` + `scroll-snap-type: x mandatory`, então cada foto "encaixa" ao deslizar, mesmo sem JavaScript. O `main.js` acrescenta as setas, as bolinhas e a rolagem suave (`scrollTo` com `behavior: 'smooth'`). A foto em destaque fica nítida e as vizinhas ficam mais claras. Quem pede menos movimento no sistema (`prefers-reduced-motion`) vê a troca sem animação.

### Busca de bairro

O campo "Digite o nome do seu bairro" ignora acentos e maiúsculas (digitar "arapua" acha "Jardim Arapuã"). Ele destaca o bairro em amarelo, apaga os dias em que o bairro não aparece e escreve o dia e o turno embaixo do campo. Sem JavaScript, o campo fica escondido e a lista completa continua visível.

## Prestação de contas: como publicar um documento

1. Crie a pasta `assets/docs/` e coloque o PDF nela (ex.: `balanco-2026.pdf`).
2. No `index.html`, na seção `#transparencia`, troque o selo
   `<span class="status">Em breve</span>` do documento por:
   ```html
   <a class="botao botao--verde" href="assets/docs/balanco-2026.pdf">Abrir PDF</a>
   ```

## Atualizar o cronograma

Cada dia é um `<article class="dia" data-dia="...">` no `index.html`, com uma lista `<ul class="bairros">` por turno. Para incluir ou tirar um bairro, basta adicionar ou apagar um `<li>`; a busca já passa a encontrá-lo.

## Formulário: como o envio funciona

Hoje o formulário usa `action="mailto:..."`, que abre o programa de e-mail do visitante com a mensagem preenchida.

Para receber as mensagens direto na caixa de entrada, sem JavaScript, basta trocar o `action`:

```html
<!-- Formspree: crie um formulário em formspree.io e cole o endereço gerado -->
<form action="https://formspree.io/f/SEU_CODIGO" method="post">

<!-- Netlify Forms: se o site for publicado no Netlify -->
<form name="contato" method="post" data-netlify="true">
```

## Como abrir

Abra o arquivo `index.html` no navegador. Não precisa instalar nada.

Para publicar de graça, envie a pasta para o **GitHub Pages** ou arraste para o **Netlify Drop**.

## Paleta e fontes

| Cor | Hex | Uso |
| --- | --- | --- |
| Verde Coopersol | `#2E7D32` | Cor principal, botões |
| Verde Mata | `#1B4332` | Títulos, rodapé |
| Amarelo Sol | `#F9A825` | Destaques |
| Papel | `#F7F5EF` | Fundo |
| Grafite | `#1F2A24` | Texto |

As cores dos materiais (papel azul, plástico vermelho, metal amarelo, vidro verde) seguem o padrão nacional das lixeiras (Resolução CONAMA 275/2001) e aparecem só no guia de separação.

## Dados confirmados com a cooperativa (13/11/2026)

- Coleta **somente em Jales**, de **segunda a sexta** (manhã e tarde) e no **sábado até o meio-dia**
- Cronograma por bairro enviado pelo Sandro, nas artes da Coopersol com a Prefeitura
- WhatsApp **(17) 99619-8406**
- Início em **2007** como associação de catadores (**Acoserge**); a Coopersol começou em **março de 2011**
- A população também pode **levar o reciclável até a sede**
- Coletam papel, plástico, metal, vidro, **lixo eletrônico (inclusive baterias)** e **óleo de cozinha**
- **Não coletam**: lâmpadas fluorescentes, isopor, pneus, copos descartáveis, vidro quebrado e louça, **pilhas**
- Parceria com a **Prefeitura de Jales** (logo no site)
- Sede: **Rodovia Victório Prandi, 767 – Córrego do Marimbondo, Jales/SP**; o link "Ver no mapa" usa as coordenadas exatas do galpão (-20.307562, -50.548875), porque o cadastro da Coopersol no Google aponta para o lugar errado

## Ainda falta confirmar

- [ ] **Perfil do Instagram**: o link está como `https://www.instagram.com/PERFIL_DA_COOPERSOL/` nas duas páginas (procure por `TROCAR` no código)
- [ ] Se a mudança de sede foi mesmo em **2020** (Sandro vai conferir; está na linha do tempo da seção Quem somos)
- [ ] Quais bairros a coleta de sábado atende
- [ ] Horário para entregar material na sede
- [ ] Número atual de cooperados (o site usa "+20")
- [ ] Autorização da Prefeitura para usar o vídeo e dos cooperados para aparecerem nas fotos
- [ ] E-mail da cooperativa usado no formulário
- [ ] Documentos da prestação de contas

## Equipe

Projeto de curricularização · FATEC Jales · 2026

---

© 2026 Coopersol Jales. Todos os direitos reservados.
