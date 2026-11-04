// Gera o index.html: a apresentação em sequência (uma ideia por tela, feita para o celular).
// Chamado por construir.js. Para refazer tudo: node apresentacao/construir.js
const fs = require('fs');
const path = require('path');
const pasta = __dirname;

const tela = (img, alt, extra) => `<div class="celular mini"><img src="img/${img}" alt="${alt}"${extra || ''}></div>`;

// Cada passo: { id, etiqueta, titulo, texto (html), visual (html), tipo }
const PASSOS = [
  { id: 'capa', tipo: 'capa',
    visual: `<img class="logo-capa" src="img/logo.png" alt="Pilão">`,
    titulo: `Pilão Tarefas`, destaque: `Nenhuma demanda esquecida.`,
    texto: `Uma apresentação rápida, de uns <b>5 minutos</b>, feita para ver no celular. Toque em <b>Continuar</b> para avançar.` },

  { id: 'problema', etiqueta: 'O problema', titulo: `Você já passou por isso?`,
    texto: `Você pede um relatório para <b>amanhã, 10h</b>. Aí:`,
    visual: `<ol class="linha"><li class="ruim"><b>A impressora falha</b><span>Quem ia fazer percebe, mas você já foi embora.</span></li><li class="ruim"><b>Ninguém lembra</b><span>A tarefa não está escrita em lugar nenhum.</span></li><li class="ruim"><b>A reunião começa sem o relatório</b><span>Só aí vem a pergunta: "cadê?".</span></li></ol>`,
    fecho: `Não é falta de vontade. É falta de <b>ver</b>.` },

  { id: 'solucao', etiqueta: 'A solução', titulo: `Agora, com o Pilão Tarefas`,
    texto: `A mesma história, só que com tudo à vista:`,
    visual: `<ol class="linha"><li class="bom"><b>Tarefa criada com prazo e responsável</b><span>A Ana recebe o aviso na hora.</span></li><li class="bom"><b>A Ana trava e explica o motivo</b><span>"Impressora sem toner." Fica em vermelho no seu painel.</span></li><li class="bom"><b>Você resolve e ela conclui</b><span>Tudo registrado, antes das 10h.</span></li></ol>` },

  { id: 'passar', etiqueta: '1 · Passar a tarefa', titulo: `Criar leva meio minuto`,
    texto: `Título, responsável e prazo em <b>botões</b> (Hoje, Amanhã, Em 2 dias…) ou no calendário. Se quiser, uma lista de <b>"como fica pronto"</b>.`,
    visual: tela('m_05_nova_tarefa.png', 'Formulário de nova tarefa no celular') },

  { id: 'acompanhar', etiqueta: '2 · Acompanhar', titulo: `Tudo num quadro`,
    texto: `Quatro colunas: <b>A fazer</b>, <b>Fazendo</b>, <b>Travada</b> e <b>Concluída</b>. O prazo avisa sozinho: 🟢 no prazo, 🟡 vence em menos de 24h, 🔴 atrasada.`,
    visual: tela('m_03_quadro.png', 'Quadro de tarefas no celular') },

  { id: 'travou', etiqueta: '3 · O mais importante', titulo: `Travou? Fica à vista`,
    texto: `Quem trava uma tarefa <b>precisa escrever o motivo</b>. Ela vira vermelha no seu painel e você recebe o aviso. Nada se perde no meio do caminho.`,
    visual: tela('m_04_tarefa_travada.png', 'Tarefa travada com o motivo e a conversa') },

  { id: 'quiz', tipo: 'quiz', etiqueta: 'Sua vez', titulo: `Teste rápido`,
    texto: `Uma funcionária não consegue avançar porque o sistema caiu. O que ela deve fazer?`,
    opcoes: ['Esperar o sistema voltar, sem avisar ninguém', 'Marcar a tarefa como Travada e escrever o motivo', 'Mandar uma mensagem no WhatsApp e esquecer'],
    certa: 1,
    acerto: `Isso mesmo! Travada com motivo deixa o problema à vista, em vermelho, no painel do dono.`,
    dica: `Quase. Pense no que deixa o problema <b>visível</b> para o dono.` },

  { id: 'equipe', etiqueta: '4 · A equipe', titulo: `Cada um vê só o que é seu`,
    texto: `O <b>"Meu dia"</b> mostra o que está atrasado, o que vence hoje e quantas tarefas a pessoa está fazendo (no máximo <b>3</b>, para terminar uma antes de começar outra). A tarefa só conclui com o checklist todo marcado. No celular, é só <b>segurar e arrastar</b> o cartão.`,
    visual: tela('m_11_meu_dia.png', 'Tela Meu dia no celular') },

  { id: 'avisos', etiqueta: '5 · Avisos', titulo: `O aviso chega no celular`,
    texto: `Tarefa nova, comentário, tarefa travada ou prazo vencendo: o aviso chega por <b>e-mail</b> (o Gmail já avisa no celular) e pelo <b>sininho</b> dentro do app. O selo <b>NOVO</b> só some quando a pessoa abre a tarefa.`,
    visual: tela('m_14_email.png', 'E-mail de nova tarefa') },

  { id: 'papeis', etiqueta: '6 · Quem pode o quê', titulo: `Dois papéis, regras claras`,
    visual: `<div class="duas"><div class="caixa"><h3>👑 Dono</h3><ul><li>Cria e acompanha tudo</li><li>Cadastra a equipe</li><li>Resolve as travadas</li></ul></div><div class="caixa"><h3>👤 Equipe</h3><ul><li>Vê só as suas tarefas</li><li>Muda o status e comenta</li><li>Trava com motivo</li></ul></div></div>`,
    fecho: `Ninguém vê a senha de ninguém. As regras valem no servidor, não só na tela.` },

  { id: 'acesso', etiqueta: '7 · Primeiro acesso', titulo: `Do link ao uso em 2 minutos`,
    texto: `<ol class="numerada"><li>O dono cadastra a pessoa e o app gera uma <b>senha provisória</b>, com mensagem pronta para o WhatsApp.</li><li>A pessoa abre o link e entra.</li><li>Cria a <b>própria senha</b>. Nem o dono vê.</li><li>Põe o app na <b>tela inicial</b> do celular, e ele abre com um toque.</li></ol>`,
    visual: tela('m_10_trocar_senha.png', 'Tela de criar a própria senha') },

  { id: 'limites', etiqueta: 'Com honestidade', titulo: `O que você precisa saber`,
    visual: `<ul class="fatos"><li><b>R$ 0</b><span>de mensalidade</span></li><li><b>1 a 2 s</b><span>por ação (normal nesse tipo de app)</span></li><li><b>100</b><span>e-mails por dia, numa conta Google comum</span></li><li><b>~20</b><span>pessoas: feito para equipes pequenas</span></li></ul>`,
    fecho: `Os dados ficam numa planilha do Google na conta da empresa. Você pode abrir e fazer cópia quando quiser.` },

  { id: 'fim', tipo: 'fim', etiqueta: 'Você viu tudo', titulo: `Agora é a sua vez`,
    texto: `Experimente o app de verdade, com uma equipe de mentira. Crie tarefas, mude de coluna e trave uma. <b>Nada do que você fizer é guardado.</b>` }
];

const total = PASSOS.length;
const htmlPasso = (p, i) => {
  const cab = p.etiqueta ? `<span class="etiqueta">${p.etiqueta}</span>` : '';
  let corpo = '';
  if (p.tipo === 'capa') {
    corpo = `${p.visual}<h1>${p.titulo}</h1><p class="destaque grad-texto">${p.destaque}</p><p>${p.texto}</p>`;
  } else if (p.tipo === 'quiz') {
    corpo = `${cab}<h2>${p.titulo}</h2><p>${p.texto}</p><div class="opcoes">${p.opcoes.map((o, k) => `<button class="opcao" data-k="${k}">${o}</button>`).join('')}</div><div class="retorno" id="retorno" role="status"></div>`;
  } else if (p.tipo === 'fim') {
    corpo = `${cab}<h2>${p.titulo}</h2><p>${p.texto}</p>
      <div class="acoes-fim"><a class="botao primario grande" href="demo-app/index.html">📱 Experimentar o app</a>
      <a class="botao claro" href="resumo.html">📋 Ver o resumo completo</a>
      <a class="botao contorno" href="slides.html">🖥️ Modo slides (para reunião)</a>
      <button class="botao contorno" id="rever">↺ Rever do começo</button></div>`;
  } else {
    corpo = `${cab}<h2>${p.titulo}</h2>${p.texto ? `<p>${p.texto}</p>` : ''}${p.visual ? `<div class="visual">${p.visual}</div>` : ''}${p.fecho ? `<p class="fecho">${p.fecho}</p>` : ''}`;
  }
  return `<section class="passo-seq${p.tipo ? ' t-' + p.tipo : ''}" data-i="${i}" data-id="${p.id}" aria-label="Passo ${i + 1} de ${total}"${i === 0 ? '' : ' hidden'}><div class="miolo">${corpo}</div></section>`;
};

const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex,nofollow">
<meta name="theme-color" content="#2D2A26">
<title>Pilão Tarefas · Apresentação</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700;800&display=swap">
<link rel="stylesheet" href="assets/estilo.css">
<link rel="stylesheet" href="assets/sequencia.css">
</head>
<body class="seq">
<header class="topo-seq">
  <img src="img/logo.png" alt="Pilão">
  <div class="progresso" role="progressbar" aria-valuemin="1" aria-valuemax="${total}" aria-valuenow="1"><i id="barra"></i></div>
  <span id="contagem">1 / ${total}</span>
</header>
<main id="palco-seq">
${PASSOS.map(htmlPasso).join('\n')}
</main>
<footer class="rodape-seq">
  <button class="botao contorno" id="voltar" aria-label="Voltar" disabled>‹ Voltar</button>
  <button class="botao primario" id="avancar">Continuar ›</button>
</footer>
<script>window.TOTAL_PASSOS = ${total}; window.INDICE_QUIZ = ${PASSOS.findIndex(p => p.tipo === 'quiz')}; window.QUIZ = ${JSON.stringify({ certa: PASSOS.find(p => p.tipo === 'quiz').certa, acerto: PASSOS.find(p => p.tipo === 'quiz').acerto, dica: PASSOS.find(p => p.tipo === 'quiz').dica })};</script>
<script src="assets/sequencia.js"></script>
</body>
</html>
`;
fs.writeFileSync(path.join(pasta, 'index.html'), html);
console.log('Sequência gerada: ' + total + ' passos (index.html)');
