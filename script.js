// Opções possíveis do jogo em um array
const opcoes = ["pedra", "papel", "tesoura"];

// Estado atual da partida
let pontosJogador = 0;
let pontosPc = 0;
let empates = 0;
let sequenciaAtual = 0;
let partidaEncerrada = false;

// Lista (array) com o histórico das jogadas
const historico = [];

// Carrega o recorde salvo no navegador (localStorage)
let recorde = Number(localStorage.getItem("ppt_recorde")) || 0;

// Elementos da página
const inputMeta = document.querySelector("#meta");
const erroMeta = document.querySelector("#erro-meta");
const elJogador = document.querySelector("#pontos-jogador");
const elEmpate = document.querySelector("#pontos-empate");
const elPc = document.querySelector("#pontos-pc");
const elRecorde = document.querySelector("#recorde");
const elResultado = document.querySelector("#resultado");
const elListaHistorico = document.querySelector("#lista-historico");
const elSemHistorico = document.querySelector("#sem-historico");
const botoesJogada = document.querySelectorAll(".btn-jogada");
const btnReiniciar = document.querySelector("#btn-reiniciar");
const btnZerarRecorde = document.querySelector("#btn-zerar-recorde");

elRecorde.textContent = recorde;

// Valida o campo "Meta de vitórias" (campo vazio, letra ou fora de 1..10)
function lerMetaValida() {
  const texto = inputMeta.value.trim();
  inputMeta.classList.remove("campo-erro");
  erroMeta.textContent = "";

  if (texto === "") {
    inputMeta.classList.add("campo-erro");
    erroMeta.textContent = "Digite uma meta de vitórias (ex.: 3).";
    inputMeta.focus();
    return null;
  }

  const numero = Number(texto);
  if (Number.isNaN(numero) || !Number.isInteger(numero) || numero < 1 || numero > 10) {
    inputMeta.classList.add("campo-erro");
    erroMeta.textContent = "Use um número inteiro de 1 a 10.";
    inputMeta.focus();
    return null;
  }

  return numero;
}

// Atualiza os números na tela
function atualizarPlacar() {
  elJogador.textContent = pontosJogador;
  elEmpate.textContent = empates;
  elPc.textContent = pontosPc;
  elRecorde.textContent = recorde;
}

// Desenha o histórico na página usando um laço for
function mostrarHistorico() {
  if (historico.length === 0) {
    elSemHistorico.hidden = false;
    elListaHistorico.textContent = "";
    return;
  }

  elSemHistorico.hidden = true;
  elListaHistorico.textContent = "";

  for (let i = historico.length - 1; i >= 0; i--) {
    const item = historico[i];
    const li = document.createElement("li");
    li.textContent =
      "Rodada " + item.rodada + ": você jogou " + item.jogador +
      " × PC jogou " + item.computador + " → " + item.desfecho;
    elListaHistorico.append(li);
  }
}

// Executa uma rodada quando o jogador clica em Pedra, Papel ou Tesoura
function jogar(escolhaJogador) {
  if (partidaEncerrada) {
    elResultado.className = "resultado";
    elResultado.textContent = "Partida encerrada! Clique em \"Nova partida\" para jogar de novo.";
    return;
  }

  const meta = lerMetaValida();
  if (meta === null) {
    return;
  }

  // Sorteia a jogada do computador usando o array de opções
  const indice = Math.floor(Math.random() * opcoes.length);
  const escolhaPc = opcoes[indice];

  let desfecho = "";
  elResultado.classList.remove("vitoria", "derrota", "empate");

  if (escolhaJogador === escolhaPc) {
    empates++;
    desfecho = "Empate";
    elResultado.classList.add("empate");
    elResultado.textContent = "Empate! Os dois escolheram " + escolhaJogador + ".";
  } else if (
    (escolhaJogador === "pedra" && escolhaPc === "tesoura") ||
    (escolhaJogador === "papel" && escolhaPc === "pedra") ||
    (escolhaJogador === "tesoura" && escolhaPc === "papel")
  ) {
    pontosJogador++;
    sequenciaAtual++;
    desfecho = "Vitória";
    elResultado.classList.add("vitoria");
    elResultado.textContent = "Você ganhou! " + escolhaJogador + " vence " + escolhaPc + ".";

    // Atualiza o recorde no localStorage se bateu a marca anterior
    if (sequenciaAtual > recorde) {
      recorde = sequenciaAtual;
      localStorage.setItem("ppt_recorde", String(recorde));
    }
  } else {
    pontosPc++;
    sequenciaAtual = 0;
    desfecho = "Derrota";
    elResultado.classList.add("derrota");
    elResultado.textContent = "Você perdeu! " + escolhaPc + " vence " + escolhaJogador + ".";
  }

  // Guarda a rodada no array de histórico
  historico.push({
    rodada: historico.length + 1,
    jogador: escolhaJogador,
    computador: escolhaPc,
    desfecho: desfecho
  });

  atualizarPlacar();
  mostrarHistorico();

  // Confere se alguém atingiu a meta da partida
  if (pontosJogador >= meta) {
    partidaEncerrada = true;
    elResultado.textContent = "🏆 Fim de jogo: você venceu a partida por " + pontosJogador + " a " + pontosPc + "!";
  } else if (pontosPc >= meta) {
    partidaEncerrada = true;
    elResultado.textContent = "💻 Fim de jogo: o computador venceu por " + pontosPc + " a " + pontosJogador + ".";
  }
}

// Conecta o evento de clique nos três botões de jogada
for (const botao of botoesJogada) {
  botao.addEventListener("click", function () {
    jogar(botao.dataset.jogada);
  });
}

// Reinicia apenas a partida atual
btnReiniciar.addEventListener("click", function () {
  pontosJogador = 0;
  pontosPc = 0;
  empates = 0;
  partidaEncerrada = false;
  historico.length = 0;
  elResultado.className = "resultado";
  elResultado.textContent = "Nova partida iniciada! Escolha sua jogada.";
  atualizarPlacar();
  mostrarHistorico();
});

// Zera o recorde salvo no localStorage
btnZerarRecorde.addEventListener("click", function () {
  recorde = 0;
  sequenciaAtual = 0;
  localStorage.removeItem("ppt_recorde");
  atualizarPlacar();
});
