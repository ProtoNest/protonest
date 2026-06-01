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

<div class="chat-btn">💬 Consultor Técnico</div>

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

btn.onclick=()=>{

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

}else{

finalizar();

}

}

function calcularScore(){

let score=0;

if(lead.urgencia.toLowerCase().includes("urgente"))
score+=30;

if(lead.urgencia.toLowerCase().includes("semana"))
score+=20;

if(lead.urgencia.toLowerCase().includes("mes"))
score+=10;

if(lead.potencial.toLowerCase().includes("grande"))
score+=40;

if(lead.potencial.toLowerCase().includes("medio"))
score+=20;

if(lead.potencial.toLowerCase().includes("pequeno"))
score+=10;

return score;

}

function classificar(score){

if(score<=25) return "Gelado";

if(score<=50) return "Frio";

if(score<=75) return "Morno";

return "Quente";

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
Resumo:

Nome: ${lead.nome}

Empresa: ${lead.empresa}

Categoria: ${lead.categoria}

Classificação: ${lead.classificacao}

Score: ${lead.score}

Nossa equipe entrará em contato em breve.
`);

}

