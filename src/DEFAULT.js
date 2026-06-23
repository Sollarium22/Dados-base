import logo from './logo.svg';
import './App.css';
import dado from './d20.png';
import dodo from './dodo.png';
import galho from './galho.png';
import espada from './espada.png';
import arco from './arco.png';
import cajado from './cajado.png';
import pata from './pata.png';



//Icons Distritos

import ordem from './Ordem.png';
import ray from './Ray.png';
import reli from './Reli.png';
import asc from './Ascensao.png';

  const b_novato = 0.5;
  const b_guerreiro = 1;
  const b_mago = 100_000;
  const b_medico = 15;




export const DEFAULT_CONSTRUCOES = [
    { nome: "Novato", preco: 15, dps: b_novato, quantidade: 0, quantidadeGratis: 0, icone: galho, descricao: "Ele...era...o FrostBite...", assin: "- Chris...pré depressão" },
    { nome: "Guerreiro", preco: 100, dps: b_guerreiro, quantidade: 0, icone: espada, descricao: "Um Guerreiro nao muito habilidoso...bem...ele sabe usar a espada pra fazer um churrasco" },
    { nome: "Mago", preco: 10, dps: b_mago, quantidade: 0, icone: cajado, descricao: "Um Mago que se gaba de poder lançar magia sem ter que ler nada...só ignoremos o fato dele saber só 1 magia...envelhecer vinhos" },
    { nome: "Medico de Campo", preco: 2000, dps: b_medico, quantidade: 0, icone: cajado, descricao: "ENTÃO SÓ SE MATA", assin: "- Leandrinho do Grau" },
    { nome: "Pugilista", preco: 2000, dps: b_mago, quantidade: 0, icone: cajado, descricao: "VEM PRA CIMA, EU TANKO", assin: "- Jurandir  (spoiler, ele nao tanka)" },
    //{ nome: "Lo testador", preco: 10000000000000000, dps: 101000000000, quantidade: 0, icone: dado, descricao:"ABSOLUTA", assin: "SIM"}, 
  ]

export  const DEFAULT_MELHORIAS = [
    { nome: "Afiação", preco: "10", efeito: "duplicarClick", comprado: false, id: "click1", icone: dodo, descricao: "Uma pedra de amolar fodasse para vc só usar pra ajudar um pouco" },
    { nome: "Mochila de Equipamentos", preco: "10", efeito: "duplicarDado", comprado: false, id: "dados1", icone: dodo },
    { nome: "Espada Nova", preco: "10", efeito: "duplicarDado", comprado: false, id: "dados2", icone: dodo },

    { nome: "Mega espada", preco: "10", efeito: "clickDps", comprado: false, id: "clickDps1", icone: dodo, descricao: "Sua espada propria agora da 1% de seu DPS" },

    { nome: "Cores", preco: "10", efeito: "10porcento", comprado: false, id: "contagemRay1", icone: ray, descricao: "Quem sabe q merda pode rolar aqui" },
  ]

export  const DEFAULT_VINHO = { desbloqueado: false, level: 1, creditos: 0, mercado: 1 }

export const DEFAULT_ASCENSAO = {
    desbloqueado: false,
    prestigio: 0,
    prestigioTotal: 0,

    distritoBase: {
      icone: dado,
      aberto: false,
      upgrades: [
        { nome: "Comeaço", preco: 1, efeito: "ascensao", id: "ascensaodps", comprado: false, descricao: "Você ganha 1% de dps por nivel de prestigio", icone: "🌟", preRequisito: null, x: 0, y: -140, angulo: -90 }, // Fica 140px acima do centro do distrito 
        {
          id: "upgradeSim",
          nome: "Sim (Bifurcação 1)",
          preco: 1,
          comprado: false,
          descricao: "É um teste do lado esquerdo",
          icone: "✨",
          preRequisito: "ascensaodps", // Só aparece se o "Começo" for comprado!
          x: -60, y: -220, // Move para cima e um pouco para a esquerda
          angulo: -135
        },
        {
          id: "upgradeNao",
          nome: "Não (Bifurcação 2)",
          preco: 1,
          comprado: false,
          descricao: "É um teste do lado direito",
          icone: "🔥",
          preRequisito: "ascensaodps", // Também depende do "Começo"! Cria a divisão em 2.
          x: 60, y: -220, // Move para cima e um pouco para a direita
          angulo: -45
        },

      ]
    },

    // 2. DISTRITO ASCENSÃO (Cresce para a Direita)
    distritoAscensao: {
      icone: asc,
      aberto: false,
      upgrades: [
        {
          id: "ascensao1",
          nome: "Tempo",
          preco: 1,
          efeito: "duplicarClick",
          comprado: false,
          descricao: "Você duplica seu Click",
          icone: "⏳",
          preRequisito: null,
          x: 110, y: -80,    // Move para cima e para a direita
          angulo: -40
        },
        {
          id: "ascensaoBifurcada1",
          nome: "Novo Upgrade Foda",
          preco: 2,
          comprado: false,
          descricao: "Bifurcação de teste",
          icone: "⚡",
          preRequisito: "ascensao1", // Trava a dependência no ID do upgrade "Tempo"
          x: 190, y: -140,          // Afasta o X e o Y um pouco mais do centro
          angulo: -40
        },
        {
          id: "ascensaoBifurcada2",
          nome: "Novo Upgrade Foda",
          preco: 2,
          comprado: false,
          descricao: "Bifurcação de teste",
          icone: "⚡",
          preRequisito: "ascensao1", // Trava a dependência no ID do upgrade "Tempo"
          x: 190, y: -80,          // Afasta o X e o Y um pouco mais do centro
          angulo: 7
        }
      ]
    },

    // 3. DISTRITO ORDEM (Cresce para Baixo/Direita)
    distritoOrdem: {
      icone: ordem,
      aberto: false,
      upgrades: [
        {
          id: "ordem1",
          nome: "Novato Transcendido",
          preco: 1,
          efeito: "novatoGratis",
          comprado: false,
          descricao: "Você Ganha 10 novatos gratis",
          icone: "👥",
          preRequisito: null,
          x: 90, y: 100,      // Move para baixo e para a direita
          angulo: 45
        }
      ]
    },

    // 4. DISTRITO RELÍQUIAS (Cresce para Baixo/Esquerda)
    distritoReliquias: {
      icone: reli,
      aberto: false,
      upgrades: [
        {
          id: "reliquia1",
          nome: "Relogio de bolso",
          preco: 1,
          efeito: "1porcento",
          comprado: false,
          descricao: "Algo de sua propria alma, seu reflexo, aumenta 1% do cps base",
          icone: "🔮",
          preRequisito: null,
          x: -90, y: 100,     // Move para baixo e para a esquerda
          angulo: 135
        }
      ]
    },

    // 5. DISTRITO RAYBOOM (Cresce para a Esquerda)
    distritoRayboom: {
      icone: ray,
      aberto: false,
      upgrades: [
        {
          id: "rayboom1",
          nome: "Flor Magica",
          preco: 1,
          efeito: "caixaRayboom",
          comprado: false,
          descricao: "Uma pequena flor que lhe da poderes...interessante",
          icone: "🌸",
          preRequisito: null,
          x: -110, y: -80,   // Move para cima e para a esquerda
          angulo: -140
        }
      ]
    },
  }

export const DEFAULT_DOURADO = [
    {
    chave: "sorte_pequena",
    nome: "Flecha temporal",
    efeito: "DPS",
    mult: 3,        // Transformado em número para cálculos
    duracao: 111,   // Transformado em número para cálculos
    peso: 4         // Transformado em número para cálculos
  },
  {
    chave: "sorte_media",
    nome: "Imortalidade",
    efeito: "DPS",
    mult: 7,
    duracao: 30, 
    peso: 5
  },
  {
    chave: "sorte_grande_sonhos", // Nome único para não sobrescrever
    nome: "Sonhos lucidos",
    efeito: "DPS",
    mult: 77,
    duracao: 11,
    peso: 3
  },
  {
    chave: "sorte_grande_odio",  // Nome único para não sobrescrever
    nome: "Ódio Incontrolavel",
    efeito: "Click",
    mult: 777,
    duracao: 11,
    peso: 10
  },
  {
    chave: "lucky",
    nome: "LAZER BEAM",
    efeito: "Instantaneo",
    peso: 4
  }
]