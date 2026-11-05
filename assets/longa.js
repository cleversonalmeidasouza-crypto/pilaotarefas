/* Apresentação em página longa: animações ao rolar, contadores, progresso, teste e liberação da demonstração. */
(function () {
  var LIBERADO = 'pilao_apresentacao_ok';
  var reduzir = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // aparecer ao rolar
  var itens = [].slice.call(document.querySelectorAll('.revela'));
  if ('IntersectionObserver' in window && !reduzir) {
    var obs = new IntersectionObserver(function (lista) {
      lista.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('visivel'); obs.unobserve(e.target); } });
    }, { threshold: 0.12 });
    itens.forEach(function (el) { obs.observe(el); });
  } else {
    itens.forEach(function (el) { el.classList.add('visivel'); });
  }

  // contadores animados
  var contadores = [].slice.call(document.querySelectorAll('[data-alvo]')).filter(function (el) { return el.tagName === 'B'; });
  function contar(el) {
    var alvo = Number(el.dataset.alvo), pre = el.dataset.prefixo || '', suf = el.dataset.sufixo || '', ini = performance.now();
    (function passo(t) {
      var p = Math.min(1, (t - ini) / 1300);
      el.textContent = pre + Math.round(alvo * (1 - Math.pow(1 - p, 3))) + suf;
      if (p < 1) requestAnimationFrame(passo);
    })(ini);
  }
  if ('IntersectionObserver' in window && !reduzir) {
    var obs2 = new IntersectionObserver(function (lista) {
      lista.forEach(function (e) { if (e.isIntersecting) { contar(e.target); obs2.unobserve(e.target); } });
    }, { threshold: 0.6 });
    contadores.forEach(function (el) { obs2.observe(el); });
  } else {
    contadores.forEach(function (el) { el.textContent = (el.dataset.prefixo || '') + el.dataset.alvo + (el.dataset.sufixo || ''); });
  }

  // cartões que sobem no fundo da capa
  var fundo = document.querySelector('.fundo-cartoes');
  if (fundo && !reduzir) {
    for (var i = 0; i < 14; i++) {
      var c = document.createElement('i');
      c.style.left = (3 + i * 7) % 96 + '%';
      c.style.animationDuration = (16 + (i * 5) % 14) + 's';
      c.style.animationDelay = '-' + ((i * 3) % 18) + 's';
      fundo.appendChild(c);
    }
  }

  // progresso da leitura, movimento da capa e ponto ativo
  var prog = document.getElementById('lg-prog');
  var pontos = [].slice.call(document.querySelectorAll('.lg-pontos span'));
  var secoes = pontos.map(function (p) { return document.getElementById(p.dataset.alvo); });
  var raiz = document.documentElement;
  var ticking = false;
  function atualizar() {
    ticking = false;
    var max = raiz.scrollHeight - innerHeight;
    var y = window.pageYOffset;
    if (prog) prog.style.width = (max > 0 ? Math.min(100, y / max * 100) : 0) + '%';
    document.body.style.setProperty('--rolou', Math.min(1, y / 500));
    var ativo = 0;
    secoes.forEach(function (s, k) { if (s && s.getBoundingClientRect().top < innerHeight * 0.45) ativo = k; });
    pontos.forEach(function (p, k) { p.classList.toggle('ativo', k === ativo); });
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(atualizar); } }, { passive: true });
  window.addEventListener('resize', atualizar);
  atualizar();

  // demonstração: só abre depois que a pessoa chega ao final da página
  var liberou = false;
  function liberar() {
    if (liberou) return;
    liberou = true;
    try { localStorage.setItem(LIBERADO, '1'); } catch (e) { /* segue */ }
    var frame = document.getElementById('demo-frame');
    if (frame && !frame.getAttribute('src')) frame.setAttribute('src', 'demo-app/index.html');
  }
  var final = document.getElementById('final');
  if (final && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (lista, o) { lista.forEach(function (e) { if (e.isIntersecting) { liberar(); o.disconnect(); } }); }, { threshold: 0, rootMargin: '0px 0px -35% 0px' }).observe(final);
  } else if (final) { liberar(); }

  // celular ou computador na demonstração
  var palco = document.getElementById('palco');
  [].slice.call(document.querySelectorAll('.aparelhos button')).forEach(function (b) {
    b.addEventListener('click', function () {
      [].slice.call(document.querySelectorAll('.aparelhos button')).forEach(function (x) { x.classList.remove('ativo'); });
      b.classList.add('ativo');
      palco.classList.toggle('pc', b.dataset.aparelho === 'pc');
    });
  });

  // teste rápido
  var quiz = document.getElementById('quiz');
  if (quiz && window.PERGUNTAS) {
    var atual = 0, acertos = 0, P = window.PERGUNTAS;
    var desenhar = function () {
      var q = P[atual];
      quiz.innerHTML = '<div class="barra"><i style="width:' + (atual / P.length * 100) + '%"></i></div>' +
        '<p style="font-weight:700;color:var(--paprica);margin:0 0 6px;text-align:left">Pergunta ' + (atual + 1) + ' de ' + P.length + '</p>' +
        '<h3 style="text-align:left">' + q.p + '</h3>' + q.o.map(function (t, i) { return '<button class="opcao" data-i="' + i + '">' + t + '</button>'; }).join('') +
        '<div class="explica" id="explica" style="text-align:left"></div><div style="text-align:right;margin-top:14px"><button class="botao primario" id="proxima" style="display:none">' + (atual === P.length - 1 ? 'Ver resultado' : 'Próxima') + '</button></div>';
      [].slice.call(quiz.querySelectorAll('.opcao')).forEach(function (b) {
        b.addEventListener('click', function () {
          var certo = Number(b.dataset.i) === q.c;
          if (certo) acertos++;
          [].slice.call(quiz.querySelectorAll('.opcao')).forEach(function (x, n) { x.disabled = true; if (n === q.c) x.classList.add('certa'); });
          if (!certo) b.classList.add('errada');
          var ex = document.getElementById('explica');
          ex.style.display = 'block'; ex.innerHTML = (certo ? '<b>Isso mesmo!</b> ' : '<b>Quase.</b> ') + q.e;
          document.getElementById('proxima').style.display = 'inline-flex';
        });
      });
      document.getElementById('proxima').addEventListener('click', function () { atual++; if (atual < P.length) desenhar(); else fim(); });
    };
    var fim = function () {
      var msg = acertos === P.length ? 'Você já é craque no Pilão Tarefas! 🎉' : 'Vale rolar para cima e rever as partes do método e da rotina.';
      quiz.innerHTML = '<div class="barra"><i style="width:100%"></i></div><h3 class="centro">Você acertou ' + acertos + ' de ' + P.length + '</h3><p class="centro">' + msg + '</p><div class="centro"><button class="botao primario" id="de-novo">Fazer de novo</button></div>';
      document.getElementById('de-novo').addEventListener('click', function () { atual = 0; acertos = 0; desenhar(); });
    };
    desenhar();
  }
})();
