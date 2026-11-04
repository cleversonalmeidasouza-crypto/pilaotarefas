/* Apresentação em sequência: só avança um passo por vez, não tem menu e libera a demonstração no fim. */
(function () {
  var passos = [].slice.call(document.querySelectorAll('.passo-seq'));
  var total = window.TOTAL_PASSOS, quiz = window.INDICE_QUIZ;
  var barra = document.getElementById('barra'), contagem = document.getElementById('contagem');
  var avancar = document.getElementById('avancar'), voltar = document.getElementById('voltar');
  var rodape = document.querySelector('.rodape-seq');
  var progresso = document.querySelector('.progresso');
  var CHAVE = 'pilao_apresentacao_passo', CHAVE_MAX = 'pilao_apresentacao_max', LIBERADO = 'pilao_apresentacao_ok';

  function ler(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }
  function gravar(k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* segue sem guardar */ } }
  function liberar() { try { localStorage.setItem(LIBERADO, '1'); } catch (e) { /* segue */ } }

  var atual = Math.min(Number(ler(CHAVE)) || 0, total - 1);
  var maximo = Math.max(Number(ler(CHAVE_MAX)) || 0, atual);
  var quizOk = maximo > quiz;   // quem já passou do teste não precisa repetir

  function mostrar(i, voltando) {
    atual = Math.max(0, Math.min(total - 1, i));
    passos.forEach(function (p, k) {
      p.hidden = k !== atual;
      p.classList.toggle('volta', !!voltando);
    });
    if (atual > maximo) maximo = atual;
    gravar(CHAVE, atual); gravar(CHAVE_MAX, maximo);
    barra.style.width = ((atual + 1) / total * 100) + '%';
    contagem.textContent = (atual + 1) + ' / ' + total;
    progresso.setAttribute('aria-valuenow', atual + 1);
    voltar.disabled = atual === 0;
    var ultimo = atual === total - 1;
    rodape.classList.toggle('escondido', ultimo);
    if (ultimo) liberar();
    avancar.disabled = atual === quiz && !quizOk;
    avancar.textContent = atual === 0 ? 'Começar ›' : 'Continuar ›';
    passos[atual].scrollTop = 0;
    var t = passos[atual].querySelector('h1,h2'); if (t) { t.setAttribute('tabindex', '-1'); t.focus({ preventScroll: true }); }
  }

  function proximo() { if (!avancar.disabled && atual < total - 1) mostrar(atual + 1, false); }
  function anterior() { if (atual > 0) mostrar(atual - 1, true); }
  avancar.addEventListener('click', proximo);
  voltar.addEventListener('click', anterior);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); proximo(); }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); anterior(); }
  });

  // deslizar o dedo: para a esquerda avança, para a direita volta (só movimento claramente horizontal)
  var x0 = null, y0 = null;
  document.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
  document.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
    x0 = null;
    if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.8) { if (dx < 0) proximo(); else anterior(); }
  });

  // teste: só continua quando acertar
  var opcoes = [].slice.call(document.querySelectorAll('.opcao'));
  var retorno = document.getElementById('retorno');
  opcoes.forEach(function (b) {
    b.addEventListener('click', function () {
      if (quizOk) return;
      var k = Number(b.dataset.k);
      if (k === window.QUIZ.certa) {
        quizOk = true;
        opcoes.forEach(function (x) { x.disabled = true; });
        b.classList.add('certa');
        retorno.innerHTML = '✅ ' + window.QUIZ.acerto;
        avancar.disabled = false;
      } else {
        b.classList.add('errada'); b.disabled = true;
        retorno.innerHTML = '🤔 ' + window.QUIZ.dica;
      }
    });
  });
  if (quizOk) {
    opcoes.forEach(function (x, k) { x.disabled = true; if (k === window.QUIZ.certa) x.classList.add('certa'); });
    retorno.innerHTML = '✅ ' + window.QUIZ.acerto;
  }

  var rever = document.getElementById('rever');
  if (rever) rever.addEventListener('click', function () { quizOk = false; maximo = 0; opcoes.forEach(function (x) { x.disabled = false; x.classList.remove('certa', 'errada'); }); retorno.innerHTML = ''; mostrar(0, true); });

  mostrar(atual, false);
})();
