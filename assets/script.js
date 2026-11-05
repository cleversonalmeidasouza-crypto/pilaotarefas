/* Pilão Tarefas · apresentação: menu, animações ao rolar, contadores, quiz e demonstração. */
(function () {
  // as páginas de consulta só abrem depois de terminar a sequência da apresentação
  try { if (!localStorage.getItem('pilao_apresentacao_ok')) { location.replace('index.html'); return; } } catch (e) { /* sem armazenamento: deixa abrir */ }

  // menu no celular
  var botao = document.querySelector('.botao-menu');
  var menu = document.querySelector('.menu');
  if (botao && menu) botao.addEventListener('click', function () { menu.classList.toggle('aberto'); });

  // animação ao rolar (se o navegador não suportar, mostra tudo)
  var itens = document.querySelectorAll('.revela');
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (lista) {
      lista.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('visivel'); obs.unobserve(e.target); } });
    }, { threshold: 0.12 });
    itens.forEach(function (el) { obs.observe(el); });
  } else {
    itens.forEach(function (el) { el.classList.add('visivel'); });
  }

  // contadores animados: <b data-alvo="3" data-prefixo="R$ " data-sufixo="">0</b>
  var contadores = document.querySelectorAll('[data-alvo]');
  function animar(el) {
    var alvo = Number(el.dataset.alvo), prefixo = el.dataset.prefixo || '', sufixo = el.dataset.sufixo || '';
    var ini = performance.now(), dur = 1400;
    (function passo(t) {
      var p = Math.min(1, (t - ini) / dur);
      el.textContent = prefixo + Math.round(alvo * (1 - Math.pow(1 - p, 3))) + sufixo;
      if (p < 1) requestAnimationFrame(passo);
    })(ini);
  }
  if ('IntersectionObserver' in window) {
    var obs2 = new IntersectionObserver(function (lista) {
      lista.forEach(function (e) { if (e.isIntersecting) { animar(e.target); obs2.unobserve(e.target); } });
    }, { threshold: 0.6 });
    contadores.forEach(function (el) { obs2.observe(el); });
  } else {
    contadores.forEach(function (el) { el.textContent = (el.dataset.prefixo || '') + el.dataset.alvo + (el.dataset.sufixo || ''); });
  }

  // cartões que sobem no fundo da capa
  var fundo = document.querySelector('.fundo-cartoes');
  if (fundo) {
    for (var i = 0; i < 14; i++) {
      var c = document.createElement('i');
      c.style.left = (3 + i * 7) % 96 + '%';
      c.style.animationDuration = (16 + (i * 5) % 14) + 's';
      c.style.animationDelay = '-' + ((i * 3) % 18) + 's';
      fundo.appendChild(c);
    }
  }

  // demonstração: celular ou computador
  var palco = document.getElementById('palco');
  document.querySelectorAll('.aparelhos button').forEach(function (b) {
    b.addEventListener('click', function () {
      document.querySelectorAll('.aparelhos button').forEach(function (x) { x.classList.remove('ativo'); });
      b.classList.add('ativo');
      palco.classList.toggle('pc', b.dataset.aparelho === 'pc');
    });
  });

  // perguntas abertas na impressão
  window.addEventListener('beforeprint', function () { document.querySelectorAll('details').forEach(function (d) { d.open = true; }); });

  // quiz
  var quiz = document.getElementById('quiz');
  if (quiz && window.PERGUNTAS) {
    var atual = 0, acertos = 0;
    var desenhar = function () {
      var q = window.PERGUNTAS[atual];
      quiz.innerHTML = '<div class="barra"><i style="width:' + (atual / window.PERGUNTAS.length * 100) + '%"></i></div>' +
        '<p class="selo" style="font-weight:700;color:var(--paprica);margin:0 0 6px">Pergunta ' + (atual + 1) + ' de ' + window.PERGUNTAS.length + '</p>' +
        '<h3>' + q.p + '</h3>' + q.o.map(function (t, i) { return '<button class="opcao" data-i="' + i + '">' + t + '</button>'; }).join('') +
        '<div class="explica" id="explica"></div><div style="text-align:right;margin-top:14px"><button class="botao primario" id="proxima" style="display:none">' + (atual === window.PERGUNTAS.length - 1 ? 'Ver resultado' : 'Próxima') + '</button></div>';
      quiz.querySelectorAll('.opcao').forEach(function (b) {
        b.addEventListener('click', function () {
          var i = Number(b.dataset.i), certo = i === q.c;
          if (certo) acertos++;
          quiz.querySelectorAll('.opcao').forEach(function (x, n) { x.disabled = true; if (n === q.c) x.classList.add('certa'); });
          if (!certo) b.classList.add('errada');
          var ex = document.getElementById('explica');
          ex.style.display = 'block'; ex.innerHTML = (certo ? '<b>Isso mesmo!</b> ' : '<b>Quase.</b> ') + q.e;
          document.getElementById('proxima').style.display = 'inline-flex';
        });
      });
      document.getElementById('proxima').addEventListener('click', function () { atual++; if (atual < window.PERGUNTAS.length) desenhar(); else fim(); });
    };
    var fim = function () {
      var n = window.PERGUNTAS.length;
      var msg = acertos === n ? 'Você já é craque no Pilão Tarefas! 🎉' : (acertos >= n - 1 ? 'Quase perfeito. Só revisar uma coisinha.' : 'Vale dar mais uma olhada nas páginas "Método" e "Dia a dia".');
      quiz.innerHTML = '<div class="barra"><i style="width:100%"></i></div><h3 class="centro">Você acertou ' + acertos + ' de ' + n + '</h3><p class="centro">' + msg + '</p><div class="centro"><button class="botao primario" id="de-novo">Fazer de novo</button></div>';
      document.getElementById('de-novo').addEventListener('click', function () { atual = 0; acertos = 0; desenhar(); });
    };
    desenhar();
  }
})();
