// Monta as páginas da apresentação (menu e rodapé iguais em todas). Uso: node apresentacao/construir.js
const fs = require('fs');
const path = require('path');
const pasta = __dirname;

const PAGINAS = [
  ['resumo.html', 'Resumo'], ['problema.html', 'Problema'], ['metodo.html', 'Método'], ['acesso.html', '1º acesso'],
  ['papeis.html', 'Papéis'], ['funcionalidades.html', 'Tour'], ['dia-a-dia.html', 'Rotina'],
  ['limites.html', 'Limites'], ['demo.html', 'Experimente'], ['duvidas.html', 'Dúvidas']
];

const ICONES = {
  alvo: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
  olho: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  alerta: '<path d="M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
  sino: '<path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0"/>',
  lista: '<path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"/>',
  cadeado: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/>',
  relogio: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  gente: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6M16 4.8a3.5 3.5 0 010 6.4M21.5 20c0-2.7-1.5-4.6-4-5.5"/>',
  celular: '<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M11 18h2"/>',
  moeda: '<circle cx="12" cy="12" r="9"/><path d="M14.8 9.2c-.5-1-1.5-1.5-2.8-1.5-1.6 0-2.8.8-2.8 2.1 0 3 5.8 1.4 5.8 4.4 0 1.3-1.2 2.2-3 2.2-1.4 0-2.5-.6-3-1.7M12 6v1.7M12 16.3V18"/>',
  check: '<path d="M20 6L9 17l-5-5"/>',
  foco: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>'
};
const icone = (n, cor) => `<div class="icone ${cor || ''}"><svg viewBox="0 0 24 24">${ICONES[n]}</svg></div>`;
const celular = (img, alt) => `<div class="celular"><img src="img/${img}" alt="${alt}" loading="lazy"></div>`;
const notebook = (img, alt, marcas) => `<div class="notebook moldura"><div class="tela moldura"><img src="img/${img}" alt="${alt}" loading="lazy">${(marcas || []).map((m, i) => `<span class="marca-num" style="left:${m[0]}%;top:${m[1]}%">${i + 1}</span>`).join('')}</div><div class="base"></div></div>`;

function pagina(arquivo, titulo, corpo, extraHead) {
  const menu = PAGINAS.map(p => `<a href="${p[0]}"${p[0] === arquivo ? ' class="atual"' : ''}>${p[1]}</a>`).join('');
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${titulo} · Pilão Tarefas</title>
<meta name="robots" content="noindex,nofollow">
<meta name="description" content="Pilão Tarefas: passe a tarefa, acompanhe o andamento e veja na hora o que travou.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700;800&display=swap">
<link rel="stylesheet" href="assets/estilo.css">
${extraHead || ''}
</head>
<body>
<header class="topo"><div class="contida">
  <a class="marca" href="resumo.html"><img src="img/logo.png" alt="Pilão"><span>Pilão Tarefas</span></a>
  <button class="botao-menu" aria-label="Abrir menu">☰ Menu</button>
  <nav class="menu">${menu}</nav>
</div></header>
${corpo}
<footer class="rodape"><div class="contida">
  <div style="display:flex;gap:16px;align-items:center"><img src="img/logo.png" alt="Pilão"><div><b style="color:#fff">Pilão Tarefas</b><br>Nenhuma demanda esquecida.</div></div>
  <div>Feito sob medida para a Tempero Pilão · <a href="slides.html" style="color:#F5B93B">Ver em modo slides</a> · <a href="javascript:window.print()" style="color:#F5B93B">Salvar em PDF</a></div>
</div></footer>
<script src="assets/script.js"></script>
</body>
</html>
`;
}

const paginas = {};

// ================= INÍCIO =================
paginas['resumo.html'] = ['Resumo', `
<section class="capa">
  <div class="fundo-cartoes"></div>
  <div class="contida">
    <div>
      <span class="etiqueta">Para a Tempero Pilão</span>
      <h1>Pilão Tarefas:<br><span class="grad-texto">nenhuma demanda esquecida.</span></h1>
      <p class="lead">Passe a tarefa com prazo, acompanhe o andamento e veja na hora o que travou e por quê. Simples de usar, funciona no celular e custa <b>R$ 0</b> por mês.</p>
      <div class="botoes">
        <a class="botao primario" href="funcionalidades.html">Ver como funciona</a>
        <a class="botao contorno" href="demo.html">Experimente agora</a>
      </div>
    </div>
    <div class="flutua">${notebook('d_03_quadro.png', 'Quadro de tarefas do Pilão Tarefas com quatro colunas')}</div>
  </div>
</section>

<section class="secao">
  <div class="contida centro">
    <h2 class="revela">Três coisas que resolvem o problema</h2>
    <p class="sub revela">Do jeito que você pediu: passar a demanda e conseguir acompanhar se foi feita.</p>
    <div class="grade c3" style="margin-top:34px;text-align:left">
      <div class="cartao revela">${icone('alvo')}<h3>Delegar com prazo</h3><p>Título, responsável, data e hora, prioridade e uma lista de "como fica pronto". Ninguém precisa adivinhar o que você quis dizer.</p></div>
      <div class="cartao revela atraso1">${icone('olho', 'verde')}<h3>Acompanhar sem perguntar</h3><p>Você abre o painel e vê o que está a fazer, fazendo, travado e concluído. Sem mensagem de "e aquilo, saiu?".</p></div>
      <div class="cartao revela atraso2">${icone('alerta', 'escuro')}<h3>Travou? Fica à vista</h3><p>Quem trava uma tarefa precisa explicar o motivo. Ela fica em vermelho no seu painel até alguém resolver.</p></div>
    </div>
  </div>
</section>

<section class="secao branca">
  <div class="contida">
    <div class="grade c2" style="align-items:center;gap:56px">
      <div class="revela">
        <h2>No bolso de cada pessoa da equipe</h2>
        <p class="sub" style="margin-bottom:18px">Funciona no navegador do celular, sem baixar nada. Cada funcionário vê só as tarefas dele, o que vence hoje e o que está atrasado.</p>
        <ul class="lista-ok"><li>Aviso de tarefa nova e de comentário, dentro do app e por e-mail</li><li>Marcador "novo" que só some quando a pessoa abre a tarefa</li><li>Arrastar a tarefa de coluna com o dedo</li></ul>
      </div>
      <div class="revela atraso1">${celular('m_11_meu_dia.png', 'Tela Meu dia no celular')}</div>
    </div>
  </div>
</section>

<section class="secao">
  <div class="contida">
    <div class="numeros">
      <div class="revela"><b data-alvo="4">0</b><span>colunas: a fazer, fazendo, travada e concluída</span></div>
      <div class="revela atraso1"><b data-alvo="3">0</b><span>tarefas ao mesmo tempo por pessoa, no máximo</span></div>
      <div class="revela atraso2"><b data-alvo="5">0</b><span>pessoas na equipe, com folga para mais</span></div>
      <div class="revela atraso3"><b data-alvo="0" data-prefixo="R$ ">0</b><span>de mensalidade</span></div>
    </div>
  </div>
</section>

<section class="secao escura centro">
  <div class="contida estreita">
    <h2 class="revela">Quer ver funcionando?</h2>
    <p class="sub revela">A demonstração abre aqui mesmo, com uma equipe de mentira. Dá para criar tarefa, mudar de coluna e comentar sem estragar nada.</p>
    <a class="botao primario revela" href="demo.html">Experimentar agora</a>
  </div>
</section>`];

// ================= PROBLEMA =================
paginas['problema.html'] = ['O problema', `
<section class="cabecalho-pagina"><div class="contida"><span class="etiqueta">O problema</span><h1>Quando a demanda se perde no caminho</h1><p>A história que motivou tudo isso: uma tarefa simples, um imprevisto e ninguém lembrando de cobrar.</p></div></section>

<section class="secao">
  <div class="contida">
    <div class="versus">
      <div class="coluna-versus sem revela">
        <h3>😕 Sem o app</h3>
        <ul class="tempo">
          <li><time>Terça · 17h</time><b>"Preciso do relatório de clientes até amanhã, 10h."</b><p>Dito de passagem, ou num áudio no WhatsApp que se mistura com outras 30 mensagens.</p></li>
          <li class="ruim"><time>Terça · 18h</time><b>A impressora falha.</b><p>Quem ia fazer percebe o problema, mas o chefe já saiu e a mensagem não é respondida.</p></li>
          <li class="ruim"><time>Quarta · 8h</time><b>Ninguém lembra.</b><p>A tarefa não está escrita em lugar nenhum. O chefe acha que está tudo certo.</p></li>
          <li class="ruim"><time>Quarta · 10h</time><b>A reunião começa sem o relatório.</b><p>Só aí aparece a pergunta: "Cadê?". E a resposta é longa.</p></li>
        </ul>
      </div>
      <div class="coluna-versus com revela atraso1">
        <h3>😀 Com o Pilão Tarefas</h3>
        <ul class="tempo">
          <li><time>Terça · 17h</time><b>Tarefa criada com prazo e responsável.</b><p>Prazo: quarta, 10h. Checklist: "relatório impresso" e "enviado por e-mail". A Ana recebe o aviso na hora.</p></li>
          <li class="bom"><time>Terça · 18h</time><b>A Ana trava a tarefa e explica o motivo.</b><p>"Impressora sem toner." O chefe é avisado e a tarefa fica em vermelho no painel dele.</p></li>
          <li class="bom"><time>Terça · 18h10</time><b>O chefe resolve na conversa da tarefa.</b><p>"Imprime na sala ao lado." Tudo registrado ali, sem se perder no WhatsApp.</p></li>
          <li class="bom"><time>Quarta · 9h40</time><b>Concluída antes do prazo. 🎉</b><p>Todos os itens do checklist marcados, e o chefe só precisou olhar o painel.</p></li>
        </ul>
      </div>
    </div>
  </div>
</section>

<section class="secao branca">
  <div class="contida estreita centro">
    <h2 class="revela">A ideia central</h2>
    <p class="sub revela">Uma demanda só some quando ninguém consegue <b>ver</b> que ela existe. O Pilão Tarefas deixa tudo à vista: o que foi pedido, para quando, quem está fazendo e, principalmente, o que está <b>impedido</b>.</p>
    <a class="botao primario revela" href="metodo.html">Como organizamos o trabalho →</a>
  </div>
</section>`];

// ================= MÉTODO =================
paginas['metodo.html'] = ['Método', `
<section class="cabecalho-pagina"><div class="contida"><span class="etiqueta">Método</span><h1>Como organizamos o trabalho</h1><p>Seis ideias simples, vindas de métodos que grandes empresas usam, explicadas sem complicação.</p></div></section>

<section class="secao escura">
  <div class="contida">
    <h2 class="revela">1 · Quadro Kanban: o trabalho à vista</h2>
    <p class="sub revela">Cada tarefa é um cartão. Ele anda da esquerda para a direita conforme o trabalho avança. Olhou o quadro, entendeu a situação.</p>
    <div class="kanban-demo revela" style="margin-top:28px">
      <div class="kcol" style="--c:#9A9186"><h4>A fazer <span>2</span></h4><div class="kcard">Orçamento de embalagens</div><div class="kcard anda">Relatório de clientes</div></div>
      <div class="kcol" style="--c:#E8A317"><h4>Fazendo <span>1</span></h4><div class="kcard">Conferir estoque de cominho</div></div>
      <div class="kcol" style="--c:#C0392B"><h4>Travada <span>1</span></h4><div class="kcard" style="border-left-color:#C0392B">Etiquetas · impressora sem toner</div></div>
      <div class="kcol" style="--c:#6B8E4E"><h4>Concluída <span>1</span></h4><div class="kcard" style="border-left-color:#6B8E4E">Fechar o caixa da semana</div></div>
    </div>
  </div>
</section>

<section class="secao">
  <div class="contida">
    <div class="grade c2" style="gap:26px">
      <div class="cartao revela"><div class="regra"><div class="emoji">✋</div><div><h3>2 · Limite de 3 em andamento</h3><p>Cada pessoa pode ter no máximo <b>3 tarefas</b> em "Fazendo". Quem tenta começar a quarta recebe o aviso: <i>"Termine uma antes de começar outra."</i> Fazer tudo ao mesmo tempo é a forma mais rápida de não terminar nada. O limite pode ser mudado.</p></div></div></div>
      <div class="cartao revela atraso1"><div class="regra"><div class="emoji">🚧</div><div><h3>3 · Bloqueio visível</h3><p>Se algo impede de continuar (sistema fora do ar, impressora sem toner, falta uma informação), a pessoa marca <b>Travada</b> e escreve o motivo. Sem motivo, o app não deixa. A tarefa fica em vermelho no painel do dono.</p></div></div></div>
      <div class="cartao revela"><div class="regra"><div class="emoji">🔥</div><div><h3>4 · Prioridades claras</h3><p>Três níveis: <b>🔥 Urgente</b>, <b>⭐ Importante</b> e <b>Normal</b>. Cada cartão tem uma faixa colorida, então dá para ver o que pede atenção primeiro.</p></div></div></div>
      <div class="cartao revela atraso1"><div class="regra"><div class="emoji">✅</div><div><h3>5 · Definição de pronto</h3><p>Cada tarefa pode ter uma lista de "como fica pronto" (ex.: relatório impresso, enviado por e-mail). A tarefa <b>só pode ser concluída com todos os itens marcados</b>. Acabou o "acho que terminei".</p></div></div></div>
    </div>
    <div class="cartao revela" style="margin-top:26px"><div class="regra"><div class="emoji">☀️</div><div><h3>6 · Meu dia: o foco de hoje</h3><p>Cada funcionário abre o app e vê só o essencial: o que está <b>atrasado</b>, o que <b>vence hoje</b>, quantas tarefas está fazendo agora (de 3) e se tem algo travado. Sem se perder no meio de tudo.</p></div></div></div>
  </div>
</section>

<section class="secao branca">
  <div class="contida">
    <div class="grade c2" style="align-items:center;gap:56px">
      <div class="revela"><h2>Prazo que se explica sozinho</h2><p class="sub">As cores avisam antes de virar problema:</p>
        <ul class="lista-ok"><li>🟢 <b>No prazo</b>: tem tempo de sobra</li><li>🟡 <b>Vence em menos de 24 horas</b>: já dá para olhar</li><li>🔴 <b>Atrasada</b>: com a contagem "atrasada há 5h"</li></ul></div>
      <div class="revela atraso1">${celular('m_03_quadro.png', 'Quadro de tarefas no celular com prazos coloridos')}</div>
    </div>
  </div>
</section>`];

// ================= ACESSO =================
paginas['acesso.html'] = ['Primeiro acesso', `
<section class="cabecalho-pagina"><div class="contida"><span class="etiqueta">Primeiro acesso</span><h1>Do link ao uso em 2 minutos</h1><p>Passo a passo para cada pessoa da equipe. O chefe cadastra, a pessoa entra e cria a própria senha.</p></div></section>

<section class="secao">
  <div class="contida"><div class="trilha">
    <div class="etapa revela"><div class="n">1</div><div><h3>O chefe cadastra a pessoa</h3><p>Em <b>Usuários → Novo usuário</b>, o chefe digita nome e e-mail. O app gera uma <b>senha provisória</b> e já monta uma mensagem pronta para mandar no WhatsApp. A senha aparece só uma vez.</p></div>${celular('m_09_senha_provisoria.png', 'Janela com a senha provisória e a mensagem pronta')}</div>
    <div class="etapa revela"><div class="n">2</div><div><h3>A pessoa abre o link e entra</h3><p>Abre o endereço que o chefe mandou, digita o e-mail e a senha provisória. Só entram pessoas cadastradas pelo chefe. O e-mail pode ser de qualquer provedor (Gmail, Outlook, etc.).</p></div>${celular('m_01_login.png', 'Tela de login')}</div>
    <div class="etapa revela"><div class="n">3</div><div><h3>Cria a própria senha</h3><p>No primeiro acesso o app pede uma senha nova: pelo menos 8 caracteres, com letras e números. <b>Nem o chefe vê essa senha.</b> Se esquecer, o chefe gera outra provisória.</p></div>${celular('m_10_trocar_senha.png', 'Tela de criar a própria senha')}</div>
    <div class="etapa revela"><div class="n">4</div><div><h3>Põe o app na tela inicial do celular</h3>
      <p><b>Android (Chrome):</b> toque nos três pontinhos <b>⋮</b> → <b>Adicionar à tela inicial</b> (ou <b>Instalar app</b>).</p>
      <p><b>iPhone (Safari):</b> toque no botão <b>Compartilhar</b> (quadrado com seta) → <b>Adicionar à Tela de Início</b>.</p>
      <p>Pronto: ele passa a abrir com um toque, como qualquer outro aplicativo.</p></div>${celular('m_02_painel.png', 'Painel')}</div>
  </div></div>
</section>

<section class="secao branca"><div class="contida estreita centro">
  <h2 class="revela">Boas práticas de senha</h2>
  <p class="sub revela">Senha só sua, nunca compartilhada. Em computador de uso comum, clique em <b>Sair</b> ao terminar. Depois de 5 erros seguidos, o acesso fica bloqueado por 15 minutos, para proteger a conta.</p>
</div></section>`];

// ================= PAPÉIS =================
paginas['papeis.html'] = ['Quem pode o quê', `
<section class="cabecalho-pagina"><div class="contida"><span class="etiqueta">Papéis</span><h1>Quem pode o quê</h1><p>Dois papéis: o dono organiza e acompanha; a equipe executa e avisa. A regra vale no servidor, não só na tela.</p></div></section>

<section class="secao">
  <div class="contida">
    <table class="tabela revela">
      <thead><tr><th>O que a pessoa pode fazer</th><th class="s">👑 Dono</th><th class="s">👤 Equipe</th></tr></thead>
      <tbody>
        <tr><td>Ver todas as tarefas e o painel geral</td><td class="s sim">✓</td><td class="s nao">✕</td></tr>
        <tr><td>Ver as tarefas que são dela</td><td class="s sim">✓</td><td class="s sim">✓</td></tr>
        <tr><td>Criar, editar, arquivar e excluir tarefas</td><td class="s sim">✓</td><td class="s nao">✕</td></tr>
        <tr><td>Definir responsável, prazo e prioridade</td><td class="s sim">✓</td><td class="s nao">✕</td></tr>
        <tr><td>Mudar o status das tarefas</td><td class="s sim">✓ (todas)</td><td class="s sim">✓ (as suas)</td></tr>
        <tr><td>Marcar como travada (motivo obrigatório)</td><td class="s sim">✓</td><td class="s sim">✓</td></tr>
        <tr><td>Marcar itens do checklist</td><td class="s sim">✓</td><td class="s sim">✓</td></tr>
        <tr><td>Comentar na tarefa</td><td class="s sim">✓</td><td class="s sim">✓ (nas suas)</td></tr>
        <tr><td>Cadastrar, desativar e redefinir senha de usuários</td><td class="s sim">✓</td><td class="s nao">✕</td></tr>
        <tr><td>Trocar a própria senha</td><td class="s sim">✓</td><td class="s sim">✓</td></tr>
        <tr><td>Ver a senha de alguém</td><td class="s nao">✕</td><td class="s nao">✕</td></tr>
        <tr><td>Abrir a planilha de dados</td><td class="s sim">✓</td><td class="s nao">✕</td></tr>
      </tbody>
    </table>
  </div>
</section>

<section class="secao branca">
  <div class="contida">
    <h2 class="centro revela">Combinados da equipe</h2>
    <div class="grade c2" style="margin-top:28px">
      <div class="cartao deve revela"><h3>✅ Deve fazer</h3><ul class="lista-ok">
        <li><b>Dono:</b> escrever tarefas claras (o quê, para quando e como fica pronto)</li>
        <li><b>Dono:</b> olhar as travadas todo dia e responder aos comentários</li>
        <li><b>Equipe:</b> atualizar o status na hora em que ele muda</li>
        <li><b>Equipe:</b> marcar Travada assim que algo impedir, com o motivo claro</li>
        <li><b>Equipe:</b> abrir as tarefas "novas" no mesmo dia e usar o checklist</li>
        <li><b>Todos:</b> manter a senha só sua e sair em computador compartilhado</li></ul></div>
      <div class="cartao naodeve revela atraso1"><h3>❌ Não deve fazer</h3><ul class="lista-no">
        <li>Deixar tarefa em "Fazendo" sem estar fazendo</li>
        <li>Resolver por WhatsApp e não registrar no app</li>
        <li>Compartilhar o login com outra pessoa</li>
        <li>Editar a planilha à mão (só o dono, e só em emergência)</li>
        <li>Mandar arquivos grandes pelo app (use um link do Drive no comentário)</li></ul></div>
    </div>
  </div>
</section>`];

// ================= TOUR =================
paginas['funcionalidades.html'] = ['Tour', `
<section class="cabecalho-pagina"><div class="contida"><span class="etiqueta">Tour</span><h1>Tudo o que o app faz</h1><p>Uma volta por cada tela, com as telas reais da demonstração.</p></div></section>

<section class="secao"><div class="contida">

  <div class="passo revela"><div><span class="selo">Painel do dono</span><h2>Tudo num olhar</h2>
    <p>Quatro contadores (abertas, travadas, atrasadas e concluídas na semana) e a lista <b>"Precisa da sua atenção"</b>, com as travadas e as atrasadas primeiro.</p>
    <ul class="lista-ok"><li>Cartão vermelho = algo precisa de você</li><li>Selo <b>NOVO</b> nas tarefas com novidade</li></ul></div>
    <div>${notebook('d_02_painel.png', 'Painel do dono com contadores')}</div></div>

  <div class="passo inverso revela"><div><span class="selo">Quadro</span><h2>As quatro colunas</h2>
    <ol class="legenda"><li><b>Filtros</b>por responsável, status, prioridade ou "só atrasadas"</li><li><b>Selo NOVO</b>até a pessoa abrir a tarefa</li><li><b>Tarefa travada</b>com o motivo em destaque</li><li><b>Nova tarefa</b>botão grande, sempre à mão</li></ol>
    <p>No computador, arraste o cartão com o mouse. <b>No celular, segure o cartão e arraste com o dedo</b> (ou use os botões dentro da tarefa).</p></div>
    <div>${notebook('d_03_quadro.png', 'Quadro com quatro colunas', [[8, 27], [6.6, 40], [62, 66], [92, 17.5]])}</div></div>

  <div class="passo revela"><div><span class="selo">Nova tarefa</span><h2>Criar leva meio minuto</h2>
    <p>Título, detalhes, responsável e <b>prazo com botões</b> (Hoje, Amanhã, Em 2 dias, Próxima segunda) ou calendário próprio. Prioridade e checklist são opcionais.</p></div>
    <div class="duas-imagens">${celular('m_05_nova_tarefa.png', 'Formulário de nova tarefa')}${celular('m_06_calendario.png', 'Calendário para escolher o prazo')}</div></div>

  <div class="passo inverso revela"><div><span class="selo">Conversa e histórico</span><h2>Cada tarefa tem a sua conversa</h2>
    <ol class="legenda"><li><b>Motivo da trava</b>sempre visível no topo</li><li><b>Histórico automático</b>quem criou, quem mudou de status, quem travou, com data e hora</li><li><b>Comentários</b>a pessoa certa recebe o aviso</li><li><b>Mudar status</b>quatro botões, e travar pede o motivo</li></ol></div>
    <div>${notebook('d_04_tarefa_travada.png', 'Detalhe de uma tarefa travada com a conversa', [[50, 28], [50, 39], [50, 50], [50, 71]])}</div></div>

  <div class="passo revela"><div><span class="selo">Meu dia (equipe)</span><h2>O foco de hoje</h2>
    <p>O funcionário abre o app e vê: atrasadas, vencem hoje, quantas está fazendo agora (de 3) e se há algo travado. Embaixo, as tarefas que precisam de atenção.</p></div>
    <div class="duas-imagens">${celular('m_11_meu_dia.png', 'Tela Meu dia')}${celular('m_12_quadro_equipe.png', 'Quadro da equipe no celular')}</div></div>

  <div class="passo inverso revela"><div><span class="selo">E-mails automáticos</span><h2>O aviso chega no Gmail</h2>
    <p>Quando uma tarefa é atribuída, o responsável recebe um e-mail com prazo, prioridade e botão para abrir o app. Funciona também para comentários, tarefas travadas e prazos vencendo (o chefe escolhe quais avisos ligar). Como o Gmail avisa no celular, não precisa de nada a mais.</p></div>
    <div>${celular('m_14_email.png', 'E-mail de nova tarefa')}</div></div>

  <div class="passo revela"><div><span class="selo">Usuários (dono)</span><h2>Equipe sob controle</h2>
    <p>Cadastrar, editar, <b>desativar</b> (a pessoa é desconectada na hora) e redefinir senha. O app garante que sempre exista pelo menos um dono ativo.</p></div>
    <div>${notebook('d_07_usuarios.png', 'Lista de usuários')}</div></div>

  <div class="passo inverso revela"><div><span class="selo">Ajuda</span><h2>Um guia dentro do app</h2>
    <p>Explica as colunas, o limite de 3, o que fazer ao travar e como pôr o app na tela inicial. Quem esquece como se usa não precisa perguntar.</p></div>
    <div>${celular('m_13_ajuda.png', 'Tela de ajuda')}</div></div>

</div></section>`];

// ================= DIA A DIA =================
paginas['dia-a-dia.html'] = ['Dia a dia', `
<section class="cabecalho-pagina"><div class="contida"><span class="etiqueta">Rotina</span><h1>Como usar no dia a dia</h1><p>O app funciona melhor com um hábito curto e constante. Esta é a rotina recomendada.</p></div></section>

<section class="secao">
  <div class="contida">
    <div class="grade c3">
      <div class="cartao revela">${icone('relogio')}<h3>☀️ Daily de 5 minutos</h3><p>Todo dia, em pé, no mesmo horário. Com o quadro aberto, cada pessoa responde só a três perguntas:</p>
        <ol><li>O que terminei?</li><li>O que vou fazer hoje?</li><li>Tem algo travado?</li></ol><p>Se tiver, o dono resolve ali mesmo e já registra no app.</p></div>
      <div class="cartao revela atraso1">${icone('foco', 'verde')}<h3>👑 Rotina do dono</h3><ol><li>Abrir o <b>Painel</b>: olhar as travadas primeiro.</li><li>Responder os comentários novos.</li><li>Criar as tarefas do dia, com prazo e "como fica pronto".</li><li>No fim do dia, olhar o que ficou atrasado e reorganizar.</li></ol></div>
      <div class="cartao revela atraso2">${icone('check', 'escuro')}<h3>👤 Rotina do funcionário</h3><ol><li>Abrir o <b>Meu dia</b>.</li><li>Abrir as tarefas com selo NOVO.</li><li>Mudar o status <b>na hora</b> em que muda.</li><li>Travou? Marcar Travada e escrever o motivo.</li><li>Marcar o checklist e concluir.</li></ol></div>
    </div>
  </div>
</section>

<section class="secao branca">
  <div class="contida estreita">
    <h2 class="centro revela">Exemplo de uma tarefa bem escrita</h2>
    <div class="grade c2" style="margin-top:26px">
      <div class="cartao revela" style="border-top:6px solid var(--paprica)"><h3>❌ Assim, não</h3><p style="font-size:1.1rem">"Relatório de clientes."</p><p style="color:var(--cinza)">Para quando? Em que formato? Quem recebe?</p></div>
      <div class="cartao revela atraso1" style="border-top:6px solid var(--louro)"><h3>✅ Assim, sim</h3><p style="font-size:1.1rem"><b>"Relatório de clientes para amanhã até 10h"</b></p><p style="color:var(--cinza)">Detalhes: lista dos clientes ativos do mês, em PDF.<br>Checklist: ☐ Relatório impresso ☐ Enviado por e-mail<br>Prazo: amanhã, 10h · Prioridade: Urgente</p></div>
    </div>
  </div>
</section>`];

// ================= LIMITES =================
paginas['limites.html'] = ['Limites', `
<section class="cabecalho-pagina"><div class="contida"><span class="etiqueta">Transparência</span><h1>Limites e cuidados</h1><p>O app é gratuito porque usa as ferramentas do Google. Por isso tem alguns limites, e é melhor saber deles desde já.</p></div></section>

<section class="secao">
  <div class="contida">
    <div class="grade c2">
      <div class="cartao revela">${icone('moeda')}<h3>Custo: R$ 0</h3><p>Funciona com uma conta Google comum. Não há mensalidade nem licença por usuário.</p></div>
      <div class="cartao revela atraso1">${icone('sino', 'verde')}<h3>E-mails saem da conta do dono</h3><p>Uma conta Google comum envia até <b>100 destinatários por dia</b> (segundo a documentação oficial do Google). Para uma equipe de 5 pessoas, sobra bastante. O chefe pode desligar os avisos de que não precisa.</p></div>
      <div class="cartao revela">${icone('relogio', 'escuro')}<h3>Cada ação leva 1 a 2 segundos</h3><p>É o tempo normal desse tipo de app. A tela já responde na hora e confirma por trás, mas a primeira abertura do dia pode levar um pouco mais.</p></div>
      <div class="cartao revela atraso1">${icone('celular')}<h3>Sem notificação "push" no celular</h3><p>O aviso chega pelo Gmail, que já notifica o celular. Dentro do app, o contador no sininho se atualiza sozinho a cada 30 segundos.</p></div>
      <div class="cartao revela">${icone('cadeado', 'verde')}<h3>Aviso do Google na primeira vez</h3><p>Quem instala (o dono) vê <i>"O Google não verificou este app"</i>. É normal para apps próprios: clica em <b>Avançado → Acessar</b>. Os funcionários nunca veem essa tela.</p></div>
      <div class="cartao revela atraso1">${icone('gente', 'escuro')}<h3>Feito para equipes pequenas</h3><p>Confortável até cerca de 20 pessoas e alguns milhares de tarefas. Se a empresa crescer muito, o caminho é migrar para uma plataforma paga, e os dados podem ser levados.</p></div>
    </div>
    <div class="aviso revela" style="margin-top:30px"><b>Sessão:</b> depois de algumas horas sem usar, o app pede para entrar de novo. É por segurança. <b>Faixa do Google:</b> aparece uma faixinha no topo ("aplicativo criado por um usuário do Google Apps Script"). Também é normal.</div>
  </div>
</section>

<section class="secao branca"><div class="contida estreita centro">
  <h2 class="revela">Os dados são da empresa</h2>
  <p class="sub revela">Tudo fica numa planilha do Google na conta da empresa. Dá para abrir, exportar e fazer cópia de segurança quando quiser.</p>
</div></section>`];

// ================= DEMO =================
paginas['demo.html'] = ['Experimente', `
<section class="cabecalho-pagina"><div class="contida"><span class="etiqueta">Demonstração</span><h1>Experimente agora</h1><p>É o app de verdade, com uma equipe de mentira. Crie tarefas, mude de coluna e comente à vontade: nada é guardado.</p></div></section>
<section class="secao"><div class="contida">
  <div class="aparelhos"><button class="ativo" data-aparelho="celular">📱 Celular</button><button data-aparelho="pc">💻 Computador</button></div>
  <div class="palco" id="palco"><div class="moldura-demo"><iframe src="demo-app/index.html" title="Demonstração do Pilão Tarefas" loading="lazy"></iframe></div></div>
  <div class="grade c3" style="margin-top:20px">
    <div class="cartao"><h3>👑 Ver como Dono</h3><p>Use o botão <b>"Dono"</b> na faixa escura da demonstração. Crie uma tarefa, olhe o painel e as travadas.</p></div>
    <div class="cartao"><h3>👤 Ver como Equipe</h3><p>Troque para <b>Ana, Bruno ou Rafael</b>. Mude uma tarefa de coluna e tente travar sem escrever o motivo.</p></div>
    <div class="cartao"><h3>🔄 Recomeçar</h3><p>Recarregue a página (F5) para voltar aos dados originais.</p></div>
  </div>
  <p class="centro" style="margin-top:24px"><a href="demo-app/index.html" target="_blank">Abrir a demonstração em tela cheia</a></p>
</div></section>`];

// ================= DÚVIDAS =================
const PERGUNTAS = [
  { p: 'Uma pessoa não consegue avançar numa tarefa porque o sistema caiu. O que ela deve fazer?', o: ['Esperar o sistema voltar sem avisar', 'Marcar a tarefa como Travada e escrever o motivo', 'Mandar mensagem no WhatsApp e esquecer'], c: 1, e: 'Travada com motivo deixa o problema à vista, em vermelho, no painel do dono.' },
  { p: 'Quantas tarefas cada pessoa pode ter ao mesmo tempo em "Fazendo"?', o: ['No máximo 3', 'Quantas quiser', 'Só 1'], c: 0, e: 'O limite de 3 ajuda a terminar uma tarefa antes de começar outra.' },
  { p: 'O que é preciso para marcar uma tarefa como Concluída?', o: ['Só clicar em Concluída', 'Todos os itens do checklist marcados', 'Pedir autorização por e-mail'], c: 1, e: 'Se a tarefa tem checklist, todos os itens precisam estar marcados. Isso é a "definição de pronto".' },
  { p: 'O selo NOVO numa tarefa some quando...', o: ['Passa 1 hora', 'A pessoa abre a tarefa', 'O dono apaga'], c: 1, e: 'Ele só some quando você abre a tarefa, então ninguém perde uma novidade sem querer.' },
  { p: 'Um funcionário esqueceu a senha. Quem resolve?', o: ['O dono, gerando uma nova senha provisória', 'Ele mesmo, pela planilha', 'Não tem solução'], c: 0, e: 'O dono gera uma senha provisória em Usuários, e a pessoa cria a própria senha ao entrar.' }
];
paginas['duvidas.html'] = ['Dúvidas', `
<section class="cabecalho-pagina"><div class="contida"><span class="etiqueta">Dúvidas</span><h1>Perguntas frequentes</h1><p>As dúvidas mais comuns e a resposta curta para cada uma.</p></div></section>

<section class="secao"><div class="contida estreita">
  <details open><summary>Esqueci a senha. E agora?</summary><div>Peça ao dono. Em <b>Usuários</b> ele escolhe a pessoa e gera uma nova senha provisória, que é entregue por mensagem. No próximo acesso você cria uma senha nova. Se o acesso estiver bloqueado por muitas tentativas, isso também é desfeito.</div></details>
  <details><summary>O app está lento. O que fazer?</summary><div>Cada ação leva de 1 a 2 segundos, e isso é normal. Se estiver bem mais lento, aperte <b>Atualizar</b> ou recarregue a página (F5). Se a internet do celular estiver fraca, tente o Wi-Fi.</div></details>
  <details><summary>Não recebi o e-mail de aviso.</summary><div>Olhe a caixa de spam. Lembre que o dono escolhe quais avisos ficam ligados (nova tarefa e comentário vêm ligados; tarefa travada e prazo precisam ser ligados). Dentro do app, o sininho sempre avisa as novidades.</div></details>
  <details><summary>Posso usar no computador da empresa?</summary><div>Pode, com qualquer navegador. Em computador compartilhado, clique em <b>Sair</b> ao terminar.</div></details>
  <details><summary>Preciso baixar algum aplicativo?</summary><div>Não. Abre no navegador do celular e do computador. Se quiser, dá para pôr um atalho na tela inicial (veja a página "Primeiro acesso").</div></details>
  <details><summary>Quanto custa?</summary><div>O app não tem mensalidade nem licença por usuário. Usa as ferramentas gratuitas do Google. Condições de suporte e de mudanças são combinadas à parte com quem desenvolveu.</div></details>
  <details><summary>E se eu desativar um funcionário?</summary><div>Ele é desconectado na hora e não consegue mais entrar. As tarefas e o histórico dele continuam guardados.</div></details>
  <details><summary>Quem vê as minhas tarefas?</summary><div>Funcionário vê só as dele. O dono vê todas. Ninguém vê a senha de ninguém.</div></details>
  <details><summary>Posso ter mais de um dono?</summary><div>Sim. O app só não permite ficar sem nenhum dono ativo.</div></details>
  <details><summary>Os dados ficam seguros?</summary><div>Ficam numa planilha do Google na conta da empresa. As senhas são guardadas de forma protegida (nem o dono as vê), e as permissões são conferidas no servidor.</div></details>
</div></section>

<section class="secao branca"><div class="contida">
  <h2 class="centro revela">Você já sabe usar o Pilão Tarefas?</h2>
  <p class="sub centro revela" style="margin:0 auto 28px">Cinco perguntas rápidas, só por diversão.</p>
  <div class="quiz revela" id="quiz"></div>
</div></section>
<script>window.PERGUNTAS = ${JSON.stringify(PERGUNTAS)};</script>`];

// ================= SLIDES =================
const SLIDES = [
  ['capa', `<img src="img/logo.png" alt="Pilão" style="height:120px;margin:0 auto 20px"><h1>Pilão Tarefas</h1><p class="grande grad-texto" style="font:700 clamp(1.4rem,3.4vw,2.4rem) var(--titulo)">Nenhuma demanda esquecida.</p><p class="peq">Use as setas ← → do teclado, ou deslize a tela</p>`],
  ['problema', `<h2>O problema</h2><ul class="topicos"><li>A tarefa é passada de boca ou por áudio</li><li>Algo trava: sistema, impressora, falta de informação</li><li>Ninguém lembra de cobrar, e a demanda se perde</li></ul>`],
  ['solucao', `<h2>A solução</h2><p class="grande">Um quadro onde cada tarefa tem <b>prazo</b>, <b>responsável</b> e <b>status</b>, e onde o que está travado fica <b>à vista</b>.</p>`],
  ['quadro', `<h2>O quadro</h2><div class="img-slide">${notebook('d_03_quadro.png', 'Quadro')}</div>`],
  ['metodo', `<h2>Como organizamos</h2><ul class="topicos"><li><b>Kanban:</b> o trabalho à vista</li><li><b>Limite de 3</b> tarefas em andamento por pessoa</li><li><b>Travada</b> sempre com motivo</li><li><b>Pronto</b> só com o checklist completo</li></ul>`],
  ['celular', `<h2>No celular de cada um</h2><div class="img-slide dois">${celular('m_11_meu_dia.png', 'Meu dia')}${celular('m_03_quadro.png', 'Quadro')}</div>`],
  ['travada', `<h2>Travou? Fica à vista</h2><div class="img-slide">${notebook('d_04_tarefa_travada.png', 'Tarefa travada')}</div>`],
  ['papeis', `<h2>Quem pode o quê</h2><div class="dois-col"><div><h3>👑 Dono</h3><ul class="topicos pequeno"><li>Cria e acompanha tudo</li><li>Cadastra a equipe</li></ul></div><div><h3>👤 Equipe</h3><ul class="topicos pequeno"><li>Vê e atualiza as suas tarefas</li><li>Trava com motivo e comenta</li></ul></div></div>`],
  ['limites', `<h2>Limites, com honestidade</h2><ul class="topicos"><li>R$ 0 de mensalidade</li><li>Até 100 e-mails por dia (conta comum)</li><li>Cada ação leva 1 a 2 segundos</li><li>Pensado para equipes pequenas</li></ul>`],
  ['fim', `<h2>Vamos começar?</h2><p class="grande">Cadastrar a equipe, entrar pela primeira vez e combinar a <b>daily de 5 minutos</b>.</p><p class="peq"><a href="demo.html" style="color:#F5B93B">Abrir a demonstração</a></p>`]
];
const slidesHtml = `<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><script>if(!localStorage.getItem("pilao_apresentacao_ok"))location.replace("index.html")</script><meta name="viewport" content="width=device-width, initial-scale=1"><title>Slides · Pilão Tarefas</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Poppins:wght@600;700;800&display=swap">
<link rel="stylesheet" href="assets/estilo.css">
<style>
body{overflow:hidden;background:#2D2A26;color:#fff;font-size:clamp(16px,2vw,24px)}
.slide{position:fixed;inset:0;display:none;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:4vh 7vw;background:radial-gradient(900px 500px at 85% -10%,rgba(232,163,23,.3),transparent 60%),radial-gradient(700px 500px at -10% 110%,rgba(192,57,43,.4),transparent 60%),#2D2A26;animation:entra .5s ease}
.slide.ativo{display:flex}
@keyframes entra{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:none}}
.slide h1{font-size:clamp(2.6rem,8vw,6rem)}.slide h2{font-size:clamp(2rem,5vw,3.6rem);margin-bottom:.6em}
.grande{font-size:clamp(1.3rem,3vw,2.2rem);max-width:30em}.peq{font-size:.8rem;color:#CFC6B8}
.topicos{list-style:none;padding:0;margin:0;text-align:left;font-size:clamp(1.2rem,2.8vw,2rem)}.topicos li{padding:.45em 0 .45em 1.6em;position:relative}.topicos li::before{content:"●";position:absolute;left:0;color:var(--acafrao)}
.topicos.pequeno{font-size:clamp(1rem,2.2vw,1.5rem)}
.dois-col{display:flex;gap:6vw;text-align:left;flex-wrap:wrap;justify-content:center}
.img-slide{width:min(100%,900px);max-height:68vh;display:flex;justify-content:center}.img-slide .notebook{max-width:880px}.img-slide.dois{gap:3vw}.img-slide .celular{width:min(30vh,230px)}
.img-slide .celular img{max-height:52vh;object-fit:cover;object-position:top}
.nav-slides{position:fixed;bottom:14px;left:50%;transform:translateX(-50%);display:flex;gap:12px;align-items:center;z-index:10;color:#CFC6B8;font:600 .85rem var(--fonte)}
.nav-slides button{background:rgba(255,255,255,.14);border:0;color:#fff;width:42px;height:42px;border-radius:50%;font-size:1.2rem;cursor:pointer}
.sair{position:fixed;top:14px;right:16px;z-index:10;color:#CFC6B8;font:600 .85rem var(--fonte)}
</style></head><body>
${SLIDES.map((s, i) => `<section class="slide${i === 0 ? ' ativo' : ''}" id="${s[0]}">${s[1]}</section>`).join('\n')}
<a class="sair" href="resumo.html">✕ Sair dos slides</a>
<div class="nav-slides"><button id="ant" aria-label="Anterior">‹</button><span id="pos"></span><button id="prox" aria-label="Próximo">›</button></div>
<script>
(function(){var s=[].slice.call(document.querySelectorAll('.slide')),i=0,pos=document.getElementById('pos');
function ir(n){i=Math.max(0,Math.min(s.length-1,n));s.forEach(function(x,k){x.classList.toggle('ativo',k===i)});pos.textContent=(i+1)+' / '+s.length;history.replaceState(null,'','#'+(i+1))}
document.getElementById('ant').onclick=function(){ir(i-1)};document.getElementById('prox').onclick=function(){ir(i+1)};
document.addEventListener('keydown',function(e){if(['ArrowRight','PageDown',' ','Enter'].indexOf(e.key)>-1){e.preventDefault();ir(i+1)}else if(['ArrowLeft','PageUp','Backspace'].indexOf(e.key)>-1){e.preventDefault();ir(i-1)}else if(e.key==='Home')ir(0);else if(e.key==='End')ir(s.length-1)});
var x0=null;document.addEventListener('touchstart',function(e){x0=e.touches[0].clientX},{passive:true});document.addEventListener('touchend',function(e){if(x0===null)return;var d=e.changedTouches[0].clientX-x0;if(Math.abs(d)>50)ir(i+(d<0?1:-1));x0=null});
ir(Number((location.hash||'#1').slice(1))-1||0);})();
</script></body></html>
`;

// ================= GRAVA TUDO =================
Object.keys(paginas).forEach(arq => {
  const [titulo, corpo] = paginas[arq];
  fs.writeFileSync(path.join(pasta, arq), pagina(arq, titulo, corpo));
});
fs.writeFileSync(path.join(pasta, 'slides.html'), slidesHtml);

// a demonstração vai junto, para a pasta "apresentacao" poder ser publicada sozinha
fs.mkdirSync(path.join(pasta, 'demo-app'), { recursive: true });
const demoHtml = fs.readFileSync(path.join(pasta, '..', 'demo', 'index.html'), 'utf8');
fs.writeFileSync(path.join(pasta, 'demo-app', 'index.html'), demoHtml.replace('<head>', () => '<head>\n<meta name="robots" content="noindex,nofollow">\n<script>if(!localStorage.getItem("pilao_apresentacao_ok"))location.replace("../index.html")</script>'));
require('./construir_sequencia.js');
console.log('Apresentação gerada: ' + Object.keys(paginas).length + ' páginas + slides.html + demo-app/');
