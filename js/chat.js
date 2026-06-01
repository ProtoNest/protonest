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


const categorias = [
"Automação Industrial",
"IoT",
"Assistência Técnica",
"IA e Visão Computacional",
"MVP e Prototipagem",
"Outros"
];


const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyGbXj0yuCjQoc6ytfdQsHDdTT3KwZ6f2k2F5np1f83M6wMEfzwfRpSA1ytNZhE2miu8Q/exec";

const campos = [
"nome",
"empresa",
"cidade",
"whatsapp",
"email",
"categoria",
"necessidade",
"urgencia",
"potencial"
];

const perguntas = {
nome:"Olá, seja bem-vindo à Protonest Automação. Qual seu nome?",
empresa:"Qual o nome da empresa?",
cidade:"Qual sua cidade?",
whatsapp:"Qual seu WhatsApp?",
email:"Qual seu e-mail? (Opcional)",
categoria:"Qual a categoria da necessidade?",
necessidade:"Conte um pouco mais sobre sua necessidade.",
urgencia:"Qual a urgência? (pesquisando, meses, semanas, urgente)",
potencial:"Qual o porte do projeto? (pequeno, medio, grande)"
};

let etapa = 0;
let lead = {};

document.body.insertAdjacentHTML("beforeend",`

<div class="chat-overlay"></div>


<div class="chat-btn">

<span class="desktop-chat">
💬 Consultor
</span>

<span class="mobile-chat">
💬
</span>

</div>


<div class="chat-window">

<div class="chat-header">

<span>ProtoNest Automação</span>

<span class="chat-close">✖</span>

</div>

<div class="chat-messages"></div>

<div class="chat-input">
<input type="text" id="chatInput">
<button id="sendBtn">Enviar</button>
</div>

</div>

`);

const btn=document.querySelector(".chat-btn");
const janela=document.querySelector(".chat-window");
const mensagens=document.querySelector(".chat-messages");
const fechar = document.querySelector(".chat-close");
const overlay = document.querySelector(".chat-overlay");

fechar.onclick = () => {

overlay.style.display = "none";
janela.style.display = "none";

etapa = 0;
lead = {};

mensagens.innerHTML = "";

};


btn.onclick=()=>{

overlay.style.display="block";
janela.style.display="flex";

if(mensagens.innerHTML===""){
bot(perguntas.nome);
}

};

function bot(msg){
mensagens.innerHTML+=`<div class="bot">${msg}</div>`;
mensagens.scrollTop=mensagens.scrollHeight;
}

function user(msg){
mensagens.innerHTML+=`<div class="user">${msg}</div>`;
mensagens.scrollTop=mensagens.scrollHeight;
}

function mostrarBotoes(lista){

let html = '<div class="opcoes">';

lista.forEach(item => {

html += `
<button class="opcao-btn">
${item}
</button>
`;

});

html += '</div>';

mensagens.innerHTML += html;

document.querySelectorAll(".opcao-btn").forEach(btn=>{

btn.onclick=()=>{

document.querySelectorAll(".opcoes").forEach(op=>{
op.remove();
});

document.getElementById("chatInput").value =
btn.innerText;

enviar();

};

});

}
document.getElementById("sendBtn").onclick=enviar;

document.getElementById("chatInput").addEventListener("keypress",e=>{
if(e.key==="Enter") enviar();
});

function enviar(){

const input=document.getElementById("chatInput");

const valor=input.value.trim();

if(!valor) return;

user(valor);

lead[campos[etapa]]=valor;

input.value="";

etapa++;

if(etapa<campos.length){

bot(perguntas[campos[etapa]]);

if(campos[etapa] === "categoria"){

mostrarBotoes(categorias);

}

if(campos[etapa] === "urgencia"){

mostrarBotoes(urgencias);

}

if(campos[etapa] === "potencial"){

mostrarBotoes(potenciais);

}
  
  


}else{

finalizar();

}

}

function calcularScore(){

let score = 0;

if(lead.urgencia.includes("Urgente"))
score += 50;

if(lead.urgencia.includes("Semanas"))
score += 30;

if(lead.urgencia.includes("Meses"))
score += 15;

if(lead.potencial.includes("Grande"))
score += 50;

if(lead.potencial.includes("Médio"))
score += 30;

if(lead.potencial.includes("Pequeno"))
score += 10;

return score;

}

function classificar(score){

if(score >= 80)
return "Quente";

if(score >= 50)
return "Morno";

return "Frio";

}

async function finalizar(){

lead.score=calcularScore();

lead.classificacao=classificar(lead.score);

bot("Obrigado. Gerando resumo...");

await fetch(SCRIPT_URL,{
method:"POST",
mode:"no-cors",
headers:{
"Content-Type":"text/plain"
},
body:JSON.stringify(lead)
});

bot(`
✅ Solicitação recebida com sucesso.
Obrigado pelas informações. Sr(a): 
${lead.nome}, ${lead.empresa}

Nossa equipe analisará sua necessidade e entrará em contato em breve através dos canais informados.

ProtoNest Automação
Soluções Inteligentes para Indústria e Agro.
`);

}

