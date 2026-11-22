/* =========================================================
   COOPERSOL — main.js
   1. Acessibilidade: tamanho do texto (A− A A+) e alto contraste,
      salvos no navegador para valer em todas as páginas
   2. Carrossel de fotos: setas, bolinhas e rolagem suave
   3. Busca de bairro no cronograma da coleta
   4. VLibras (tradutor para Libras do Governo Federal)
   O site continua funcionando sem JavaScript: os recursos abaixo só melhoram a experiência.
   ========================================================= */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduzMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. ACESSIBILIDADE ---------- */
  var CHAVE = 'coopersol-a11y';
  var ESCALAS = [100, 112.5, 125, 137.5];       // % do tamanho de fonte base
  var estado = { fonte: 0, contraste: false };

  try {
    var salvo = JSON.parse(localStorage.getItem(CHAVE) || '{}');
    if (typeof salvo.fonte === 'number') estado.fonte = Math.max(0, Math.min(ESCALAS.length - 1, salvo.fonte));
    estado.contraste = !!salvo.contraste;
  } catch (e) { /* navegador sem localStorage: usa o padrão */ }

  function salvar() {
    try { localStorage.setItem(CHAVE, JSON.stringify(estado)); } catch (e) { /* ignora */ }
  }

  function avisar(texto) {
    var aviso = document.getElementById('a11y-aviso');
    if (aviso) aviso.textContent = texto;
  }

  function aplicar() {
    root.style.fontSize = estado.fonte ? ESCALAS[estado.fonte] + '%' : '';
    root.classList.toggle('alto-contraste', estado.contraste);
    document.querySelectorAll('[data-a11y="contraste"]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(estado.contraste));
    });
    document.querySelectorAll('[data-a11y="menos"]').forEach(function (b) { b.disabled = estado.fonte === 0; });
    document.querySelectorAll('[data-a11y="mais"]').forEach(function (b) { b.disabled = estado.fonte === ESCALAS.length - 1; });
  }

  document.addEventListener('click', function (e) {
    var botao = e.target.closest('[data-a11y]');
    if (!botao) return;
    var acao = botao.getAttribute('data-a11y');

    if (acao === 'mais') estado.fonte = Math.min(ESCALAS.length - 1, estado.fonte + 1);
    if (acao === 'menos') estado.fonte = Math.max(0, estado.fonte - 1);
    if (acao === 'normal') estado.fonte = 0;
    if (acao === 'contraste') estado.contraste = !estado.contraste;

    aplicar();
    salvar();

    if (acao === 'contraste') {
      avisar(estado.contraste ? 'Alto contraste ativado' : 'Alto contraste desativado');
    } else {
      avisar('Tamanho do texto: ' + ESCALAS[estado.fonte] + '%');
    }
  });

  aplicar();

  /* ---------- 2. CARROSSEL ---------- */
  document.querySelectorAll('.carrossel-moldura').forEach(function (moldura) {
    var lista = moldura.querySelector('.carrossel');
    var slides = Array.prototype.slice.call(lista.querySelectorAll('.slide'));
    var anterior = moldura.querySelector('.carrossel__seta--anterior');
    var proxima = moldura.querySelector('.carrossel__seta--proxima');
    var pontos = moldura.parentElement.querySelector('.carrossel__pontos');
    var aviso = document.getElementById('carrossel-aviso');
    var atual = 0;
    if (!slides.length) return;

    // cria uma bolinha por foto
    slides.forEach(function (slide, i) {
      var legenda = slide.querySelector('figcaption');
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'carrossel__ponto';
      b.setAttribute('aria-label', 'Foto ' + (i + 1) + ' de ' + slides.length +
        (legenda ? ': ' + legenda.textContent.trim() : ''));
      b.addEventListener('click', function () { irPara(i); });
      pontos.appendChild(b);
    });

    anterior.hidden = false;
    proxima.hidden = false;
    pontos.hidden = false;

    function irPara(i) {
      i = Math.max(0, Math.min(slides.length - 1, i));
      lista.scrollTo({
        left: slides[i].offsetLeft - lista.offsetLeft,
        behavior: reduzMovimento ? 'auto' : 'smooth'
      });
    }

    function marcar(i) {
      if (i === atual && slides[i].classList.contains('ativo')) return;
      atual = i;
      slides.forEach(function (s, k) {
        s.classList.toggle('ativo', k === i);
      });
      pontos.querySelectorAll('.carrossel__ponto').forEach(function (p, k) {
        p.setAttribute('aria-current', k === i ? 'true' : 'false');
      });
      anterior.disabled = i === 0;
      proxima.disabled = i === slides.length - 1;
      if (aviso) aviso.textContent = 'Foto ' + (i + 1) + ' de ' + slides.length;
    }

    // descobre qual foto está mais à esquerda enquanto rola
    var agendado = false;
    lista.addEventListener('scroll', function () {
      if (agendado) return;
      agendado = true;
      window.requestAnimationFrame(function () {
        agendado = false;
        var x = lista.scrollLeft;
        var maisPerto = 0, menorDist = Infinity;
        slides.forEach(function (s, k) {
          var d = Math.abs(s.offsetLeft - lista.offsetLeft - x);
          if (d < menorDist) { menorDist = d; maisPerto = k; }
        });
        // no fim da rolagem, marca a última foto
        if (x + lista.clientWidth >= lista.scrollWidth - 4) maisPerto = slides.length - 1;
        marcar(maisPerto);
      });
    }, { passive: true });

    anterior.addEventListener('click', function () { irPara(atual - 1); });
    proxima.addEventListener('click', function () { irPara(atual + 1); });

    // setas do teclado com o foco no carrossel: uma foto por vez, com rolagem suave
    lista.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); irPara(atual + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); irPara(atual - 1); }
      if (e.key === 'Home') { e.preventDefault(); irPara(0); }
      if (e.key === 'End') { e.preventDefault(); irPara(slides.length - 1); }
    });

    marcar(0);
    if (aviso) aviso.textContent = '';
  });

  /* ---------- 3. BUSCA DE BAIRRO ---------- */
  var busca = document.querySelector('.busca');
  var campo = document.getElementById('busca-bairro');
  var resultado = document.getElementById('busca-resultado');

  if (busca && campo) {
    busca.hidden = false;

    // ignora acentos e maiúsculas: "arapua" acha "Jardim Arapuã"
    var normalizar = function (t) {
      return t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
    };

    var itens = Array.prototype.slice.call(document.querySelectorAll('.dias .bairros li'));
    var dias = Array.prototype.slice.call(document.querySelectorAll('.dias .dia[data-dia]'));
    var temporizador;

    var filtrar = function () {
      var termo = normalizar(campo.value);
      var achados = [];

      itens.forEach(function (li) {
        var bate = termo.length >= 2 && normalizar(li.textContent).indexOf(termo) !== -1;
        li.classList.toggle('achado', bate);
        if (bate) {
          var card = li.closest('.dia');
          var quando = card.hasAttribute('data-a-confirmar')
            ? 'dia a confirmar pelo WhatsApp'
            : card.getAttribute('data-dia') + ' de ' + li.closest('.turno').getAttribute('data-turno').toLowerCase();
          achados.push({ bairro: li.textContent.trim(), quando: quando });
        }
      });

      var buscando = termo.length >= 2;
      dias.forEach(function (d) {
        var primeiro = d.querySelector('.achado');
        d.classList.toggle('sem-resultado', buscando && !primeiro);
        // rola a lista do card até o bairro encontrado
        var corpo = d.querySelector('.dia__corpo');
        if (corpo) {
          corpo.scrollTo({
            top: primeiro ? Math.max(0, primeiro.offsetTop - 8) : 0,
            behavior: reduzMovimento ? 'auto' : 'smooth'
          });
        }
      });

      if (!buscando) {
        resultado.textContent = '';
      } else if (!achados.length) {
        resultado.innerHTML = 'Não encontramos esse bairro. Confirme pelo ' +
          '<a href="https://wa.me/5517996198406">WhatsApp (17) 99619-8406</a>.';
      } else {
        var unicos = [];
        achados.forEach(function (a) {
          var t = a.bairro + ': ' + a.quando;
          if (unicos.indexOf(t) === -1) unicos.push(t);
        });
        resultado.textContent = (unicos.length > 4 ? unicos.length + ' resultados. ' : '') +
          unicos.slice(0, 4).join(' · ') + (unicos.length > 4 ? ' …' : '');
      }
    };

    campo.addEventListener('input', function () {
      clearTimeout(temporizador);
      temporizador = setTimeout(filtrar, 150);
    });
  }

  /* ---------- 4. VLIBRAS ---------- */
  window.addEventListener('load', function () {
    if (window.VLibras && window.VLibras.Widget) {
      try { new window.VLibras.Widget('https://vlibras.gov.br/app'); } catch (e) { /* sem conexão */ }
    }
  });
})();
