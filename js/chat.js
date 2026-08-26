const potenciais = [
  "Pequeno",
  "Médio",
  "Grande"
];

const urgencias = [
  "🔵 Pesquisando",
  "🟢 Próximos meses",
  "🟡 Próximas semanas",
  "🔴 Urgente"
];

// Categorias atualizadas conforme a nova estrutura da ProtoNest
const categorias = [
  "Automação Industrial",
  "IoT",
  "Assistência Técnica",
  "IA e Visão Computacional",
  "MVP e Prototipagem",
  "Outros"
];

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyGbXj0yuCjQoc6ytfdQsHDdTT3KwZ6f2k2F5np1f83M6wMEfzwfRpSA1ytNZhE2miu8Q/exec";

// Mantém a ordem exata de todas as colunas exigidas pela sua planilha de produção
const campos = [
  "nome",
  "empresa",
  "whatsapp",
  "categoria",
  "necessidade",
  "urgencia",
  "potencial"
];

// Fluxo completo com a saudação personalizada do personagem Proton
const perguntas = {
  saudacao: "Oi! Eu sou o Próton, o assistente virtual da ProtoNest, e vou te fazer algumas perguntas rápidas para nos ajudar no contato.",
  nome: "Para começar, qual é o seu nome?",
  empresa: "Qual o nome da empresa?",
  whatsapp: "Qual seu WhatsApp (com DDD)?",
  categoria: "Qual a categoria da sua necessidade?",
  necessidade: "Conte um pouco mais sobre sua necessidade específica.",
  urgencia: "Qual a urgência desse projeto?",
  potencial: "Qual o porte estimado do projeto?"
};

let etapa = 0;
let lead = {};

// Injeta a estrutura HTML com design escuro moderno e o robô no topo
document.body.insertAdjacentHTML("beforeend", `
<div class="chat-overlay"></div>
<div class="chat-btn" style="background: #1f2937; box-shadow: 0 4px 12px rgba(0,0,0,0.5);">
  <span class="desktop-chat">Atendimento</span>
  <span class="mobile-chat">Atendimento</span>
</div>
<div class="chat-window" style="background: #1e1e1e; border: 1px solid #333333;">
  <div class="chat-header" style="display: flex; justify-content: space-between; align-items: center; background: #111111; border-bottom: 1px solid #333333;">
    <span>🤖 ProtoNest Assistente</span>
    <div style="display: flex; align-items: center; gap: 15px;">
      <span id="chatSkipBtn" style="font-size: 12px; background: rgba(255, 255, 255, 0.1); padding: 4px 8px; border-radius: 4px; cursor: pointer; text-transform: uppercase; color: #a0aec0;">Não responder</span>
      <span class="chat-close" style="cursor: pointer; font-size: 18px; font-weight: bold; color: #a0aec0;">✖</span>
    </div>
  </div>
  <div class="chat-messages" style="background: #141414; display: flex; flex-direction: column;"></div>
  <div class="chat-input" style="border-top: 1px solid #333333; background: #111111;">
    <input type="text" id="chatInput" placeholder="Digite sua resposta..." style="background: #262626; color: #ffffff; border: 1px solid #444444; border-radius: 4px; padding: 10px;">
    <button id="sendBtn" style="background: #5897fb; color: white;">Enviar</button>
  </div>
</div>
`);

const btn = document.querySelector(".chat-btn");
const janela = document.querySelector(".chat-window");
const mensagens = document.querySelector(".chat-messages");
const fechar = document.querySelector(".chat-close");
const pular = document.getElementById("chatSkipBtn");
const overlay = document.querySelector(".chat-overlay");

function fecharChat() {
  overlay.style.display = "none";
  janela.style.display = "none";
  etapa = 0;
  lead = {};
  mensagens.innerHTML = "";
}

fechar.onclick = fecharChat;
pular.onclick = fecharChat;

// Função para iniciar a conversa exibindo a introdução antes do campo Nome
function iniciarConversa() {
  if (mensagens.innerHTML === "") {
    bot(perguntas.saudacao);
    setTimeout(() => {
      bot(perguntas.nome);
    }, 600);
  }
}

btn.onclick = () => {
  overlay.style.display = "block";
  janela.style.display = "flex";
  iniciarConversa();
};

// GATILHO AUTOMÁTICO: Abre sozinho 1 segundo após o carregamento da página
window.addEventListener("load", () => {
  setTimeout(() => {
    overlay.style.display = "block";
    janela.style.display = "flex";
    iniciarConversa();
  }, 1000);
});

function bot(msg) {
  mensagens.innerHTML += `<div class="bot" style="background: #262626; border: 1px solid #3a3a3a; color: #ffffff; padding: 10px; border-radius: 8px; margin-bottom: 10px; line-height: 1.5; align-self: flex-start; max-width: 85%;">${msg}</div>`;
  mensagens.scrollTop = mensagens.scrollHeight;
}

function user(msg) {
  mensagens.innerHTML += `<div class="user" style="background: #5897fb; color: white; padding: 10px; border-radius: 8px; margin-bottom: 10px; text-align: left; line-height: 1.5; align-self: flex-end; max-width: 85%; margin-left: auto;">${msg}</div>`;
  mensagens.scrollTop = mensagens.scrollHeight;
}

function mostrarBotoes(lista) {
  let html = '<div class="opcoes" style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; margin-bottom: 10px;">';
  lista.forEach(item => {
    html += `<button class="opcao-btn" style="background: #2d3748; color: white; border: 1px solid #4a5568; padding: 8px 12px; border-radius: 20px; cursor: pointer; font-size: 12px; transition: .2s;">${item}</button>`;
  });
  html += '</div>';
  mensagens.innerHTML += html;

  document.querySelectorAll(".opcao-btn").forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll(".opcoes").forEach(op => op.remove());
      document.getElementById("chatInput").value = btn.innerText;
      enviar();
    };
  });
}

document.getElementById("sendBtn").onclick = enviar;
document.getElementById("chatInput").addEventListener("keypress", e => {
  if (e.key === "Enter") enviar();
});

function enviar() {
  const input = document.getElementById("chatInput");
  const valor = input.value.trim();
  if (!valor) return;

  user(valor);
  lead[campos[etapa]] = valor;
  input.value = "";
  etapa++;

  if (etapa < campos.length) {
    bot(perguntas[campos[etapa]]);
    if (campos[etapa] === "categoria") mostrarBotoes(categorias);
    if (campos[etapa] === "urgencia") mostrarBotoes(urgencias);
    if (campos[etapa] === "potencial") mostrarBotoes(potenciais);
  } else {
    finalizar();
  }
}

function calcularScore() {
  let score = 0;
  const urgencia = (lead.urgencia || "").toLowerCase();
  const potencial = (lead.potencial || "").toLowerCase();

  if (urgencia.includes("urgente")) score += 50;
  else if (urgencia.includes("seman")) score += 30;
  else if (urgencia.includes("mes")) score += 15;

  if (potencial.includes("grande")) score += 50;
  else if (potencial.includes("médio") || potencial.includes("medio")) score += 30;
  else if (potencial.includes("pequeno")) score += 10;

  return score;
}

function classificar(score) {
  if (score >= 80) return "Quente";
  if (score >= 50) return "Morno";
  return "Frio";
}

async function finalizar() {
  lead.dataHora = new Date().toLocaleString("pt-BR");
  lead.score = calcularScore();
  lead.classificacao = classificar(lead.score);

  bot("Processando seus dados de contato...");

  // Envio estável em JSON que mantém compatibilidade direta com seu Apps Script
  fetch(SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(lead)
  }).catch(err => console.log("Erro enviado:", err));

  bot(`
✅ Solicitação recebida com sucesso.
Obrigado pelas informações, ${lead.nome}.

Nossa equipe analisará sua necessidade e entrará em contato em breve através dos canais informados.

ProtoNest Automação
Soluções Inteligentes para Indústria e Agro.
  `);

  setTimeout(() => {
    fecharChat();
  }, 4000);
}

const input = document.getElementById("chatInput");
input.addEventListener("focus", () => {
  setTimeout(() => mensagens.scrollTop = mensagens.scrollHeight, 300);
});
