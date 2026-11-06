/* Página de novidades: aparecer ao rolar, barra de progresso e cartões do fundo da capa. */
(function () {
  var reduzir = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var itens = [].slice.call(document.querySelectorAll('.revela'));
  if ('IntersectionObserver' in window && !reduzir) {
    var obs = new IntersectionObserver(function (lista) {
      lista.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('visivel'); obs.unobserve(e.target); } });
    }, { threshold: 0.12 });
    itens.forEach(function (el) { obs.observe(el); });
  } else {
    itens.forEach(function (el) { el.classList.add('visivel'); });
  }
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
  var prog = document.getElementById('lg-prog');
  var raiz = document.documentElement, ticking = false;
  function atualizar() {
    ticking = false;
    var max = raiz.scrollHeight - innerHeight;
    if (prog) prog.style.width = (max > 0 ? Math.min(100, window.pageYOffset / max * 100) : 0) + '%';
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(atualizar); } }, { passive: true });
  atualizar();
})();
