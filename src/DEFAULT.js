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

  export const b_novato = 0.5;
  export const b_guerreiro = 1;
  export const b_mago = 5;
  export const b_medico = 15;
  export const b_ladino = 450;  
  export const b_pugilista = 1000;       
  export const b_bardo = 3_200;         // Custo: 85.000 (Rendimento de ~3.7% por segundo)
  export const b_paladino = 22_000;     // Custo: 450.000 (Rendimento de ~4.8% por segundo)
  export const b_druida = 150_000;      // Custo: 2.500.000 (Rendimento de ~6% por segundo)
  export const b_cacador = 1_350_000;   // Custo: 18.000.000 (Rendimento de ~7.5% por segundo)
  export const b_necromante = 11_000_000; 




export const DEFAULT_CONSTRUCOES = [
    { nome: "Novato", preco: 15, dps: b_novato, quantidade: 0, quantidadeGratis: 0, icone: galho, descricao: "Ele...era...o FrostBite...", assin: "- Chris...pré depressão" },
    { nome: "Guerreiro", preco: 100, dps: b_guerreiro, quantidade: 0, icone: espada, descricao: "Um Guerreiro nao muito habilidoso...bem...ele sabe usar a espada pra fazer um churrasco" },
    { nome: "Mago", preco: 1000, dps: b_mago, quantidade: 0, icone: cajado, descricao: "Um Mago que se gaba de poder lançar magia sem ter que ler nada...só ignoremos o fato dele saber só 1 magia...envelhecer vinhos" },
    { nome: "Medico de Campo", preco: 2000, dps: b_medico, quantidade: 0, icone: cajado, descricao: "ENTÃO SÓ SE MATA", assin: "- Leandrinho do Grau" },
    { nome: "Pugilista", preco: 5000, dps: b_mago, quantidade: 0, icone: cajado, descricao: "VEM PRA CIMA, EU TANKO", assin: "- Jurandir  (spoiler, ele nao tanka)" },
    { 
      nome: "Ladino", 
      preco: 15_000, 
      dps: b_ladino, // Lembre-se de declarar essa variável de dano base no topo do arquivo
      quantidade: 0, 
      icone: cajado, // Certifique-se de importar o ícone correspondente
      descricao: "Sumiu com as moças da taverna, com o ouro do grupo e misteriosamente aumentou o DPS.", 
      assin: "- Guarda da Cidade (furioso)" 
    },
    { 
      nome: "Bardo", 
      preco: 85_000, 
      dps: b_bardo, 
      quantidade: 0, 
      icone: cajado, 
      descricao: "Tenta seduzir absolutamente qualquer coisa que se mova. O dado rolou 1, agora ele é casado com um golem de pedra.", 
      assin: "- Narrador cansado" 
    },
    { 
      nome: "Paladino", 
      preco: 450_000, 
      dps: b_paladino, 
      quantidade: 0, 
      icone: cajado, 
      descricao: "Brilha tanto que serve de lâmpada para o santuário. Fala de honra a cada 3 segundos e ninguém mais aguenta.", 
      assin: "- O resto da party" 
    },
    { 
      nome: "Druida", 
      preco: 2_500_000, 
      dps: b_druida, 
      quantidade: 0, 
      icone: cajado, 
      descricao: "Se transformou em um urso no meio do combate. O problema é que ele esqueceu como volta a ser humano.", 
      assin: "- Biólogo do Reino" 
    },
    { 
      nome: "Caçador", 
      preco: 18_000_000, 
      dps: b_cacador, 
      quantidade: 0, 
      icone: cajado, 
      descricao: "Diz que a culpa da flecha ter acertado o Guerreiro foi do vento, mesmo jogando em uma caverna fechada.", 
      assin: "- Legolas da Shopee" 
    },
    { 
      nome: "Necromante", 
      preco: 120_000_000, 
      dps: b_necromante, 
      quantidade: 0, 
      icone: cajado, 
      descricao: "Não é das trevas, ele só quer amigos que não reclamem de carregar as malas dele na masmorra.", 
      assin: "- Coveiro terceirizado" 
    },
    //{ nome: "Lo testador", preco: 10000000000000000, dps: 101000000000, quantidade: 0, icone: dado, descricao:"ABSOLUTA", assin: "SIM"}, 
  ]

export  const DEFAULT_MELHORIAS = [
    { nome: "Afiação", preco: "10", efeito: "duplicarClick", comprado: false, id: "click1", icone: dodo, descricao: "Uma pedra de amolar fodasse para vc só usar pra ajudar um pouco" },
    { nome: "Mochila de Equipamentos", preco: "10", efeito: "duplicarDado", comprado: false, id: "dados1", icone: dodo },
    { nome: "Espada Nova", preco: "10", efeito: "duplicarDado", comprado: false, id: "dados2", icone: dodo },

    { nome: "Mega espada", preco: "10", efeito: "clickDps", comprado: false, id: "clickDps1", icone: dodo, descricao: "Sua espada propria agora da 1% de seu DPS" },

    { nome: "Cores", preco: "10", efeito: "10porcento", comprado: false, id: "contagemRay1", icone: ray, descricao: "Quem sabe q merda pode rolar aqui" },
  

    { 
    nome: "Luvas de Veludo", 
    preco: 25_000, 
    efeito: "duplicarLadino", 
    comprado: false, 
    id: "up_ladino1", 
    icone: dodo, 
    descricao: "Garante passos mais silenciosos. Dobra o DPS dos Ladinos." 
  },
  { 
    nome: "Alaude de Cordas de Aço", 
    preco: 150_000, 
    efeito: "duplicarBardo", 
    comprado: false, 
    id: "up_bardo1", 
    icone: dodo, 
    descricao: "O som fica tão alto que dobra o DPS dos Bardos (e a dor de cabeça da guilda)." 
  },
  { 
    nome: "Polidor de Armadura", 
    preco: 900_000, 
    efeito: "duplicarPaladino", 
    comprado: false, 
    id: "up_paladino1", 
    icone: dodo, 
    descricao: "O brilho ofusca tanto os monstros que dobra o DPS dos Paladinos." 
  },
  { 
    nome: "Adubo Orgânico Ritualístico", 
    preco: 5_000_000, 
    efeito: "duplicarDruida", 
    comprado: false, 
    id: "up_druida1", 
    icone: dodo, 
    descricao: "A conexão com a natureza triplica. Dobra o DPS dos Druidas." 
  },
  { 
    nome: "Mira Holográfica de Madeira", 
    preco: 36_000_000, 
    efeito: "duplicarCacador", 
    comprado: false, 
    id: "up_cacador1", 
    icone: dodo, 
    descricao: "Eles ainda erram, mas agora com estilo. Dobra o DPS dos Caçadores." 
  },
  { 
    nome: "Diploma em Medicina Legal", 
    preco: 250_000_000, 
    efeito: "duplicarNecromante", 
    comprado: false, 
    id: "up_necro1", 
    icone: dodo, 
    descricao: "Para que reviver os mortos se você pode fazê-los trabalhar com eficiência? Dobra o DPS dos Necromantes." 
  }
  
  
  
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

export const DEFAULT_CONQUISTAS = [
  //Click
   {
    nome: "Crítico Decisivo", 
    tipo: 'valorClick', 
    quantidade: 20, 
    id: 'click2', 
    obtido: false, 
    descricao: "Seu clique agora bate como um 20 natural modificado. O mestre chorou no escudo."
  },
  {
    nome: "Tendinite Divina", 
    tipo: 'valorClick', 
    quantidade: 100, 
    id: 'click3', 
    obtido: false, 
    descricao: "Você transcendeu o mouse. Seu dedo virou um artefato místico lendário +5."
  },

  {
    nome: "Click de duas mãos", 
    tipo: 'valorClick', 
    quantidade: 50, 
    id: 'click4', 
    obtido: false, 
    descricao: "Você equipou o mouse com as duas mãos para rolar o dano máximo. Totalmente ilegal."
  },
  {
    nome: "Furto de Dados", 
    tipo: 'valorClick', 
    quantidade: 250, 
    id: 'click5', 
    obtido: false, 
    descricao: "Seu clique rouba a alma dos monstros antes mesmo do mestre narrar a iniciativa."
  },
  {
    nome: "Mouse de Adamantium", 
    tipo: 'valorClick', 
    quantidade: 1_000, 
    id: 'click6', 
    obtido: false, 
    descricao: "Seu clique gera tanta energia que o ferreiro do reino quer usar seu mouse como bigorna."
  },

  // {nome: "Click fortinho", tipo:'valorClick',quantidade: 10 ,id:'click1', obtido:false, descricao: "Faça 1000 com apenas 1 click"},
 

  //Total
  {nome: "O primeiro", tipo:'contagemTotal',quantidade: 1, id:'bater1', obtido:false, descricao: "Voce Rolou o dado pela primeira vez...boa sorte"},
  {nome: "Uau...isso da um combate", quantidade: 1_000,tipo:'contagemTotal', id:'bater2', obtido:false, descricao: "Obtenha 1000"},
   {
    nome: "Síndrome do Dragão", 
    tipo: 'contagemTotal', 
    quantidade: 100_000, 
    id: 'total_acumula', 
    obtido: false, 
    descricao: "Acumulou ouro suficiente para dormir em cima dele e ignorar a campanha principal."
  },
  {
    nome: "Capitalismo de Campanha", 
    tipo: 'contagemTotal', 
    quantidade: 1_000_000, 
    id: 'total_milhao', 
    obtido: false, 
    descricao: "Parabéns, você comprou a taverna, a guilda, o reino e provavelmente o próprio mestre do jogo."
  },
  
  //CPS
  {nome: "Matando Devagarinho", tipo:'dps',quantidade:1, id:'dps1', obtido:false, descricao: "Voce consegue agora acertar 1 inimigo por segundo...parabens...eu acho..."},
  {
    nome: "Combo de Monge", 
    tipo: 'dps', 
    quantidade: 100, 
    id: 'dps_monge', 
    obtido: false, 
    descricao: "Cem atualizações por segundo. Você está batendo tão rápido que o turno virou tempo real."
  },
  {
    nome: "Metagaming Puro", 
    tipo: 'dps', 
    quantidade: 10_000, 
    id: 'dps_meta', 
    obtido: false, 
    descricao: "Seu DPS quebrou a matemática do sistema. O mestre desistiu e foi jogar videogame."
  },


  // Construcoes
  {nome: "Novato...é...só isso", tipo:'construcao', parametro:{nome: "Novato"}, quantidade: 1, id:'novato1', obtido:false, descricao: "Um novato...que fica ai...(ele nao sabe usar a ficha...)"},
  {nome: "4 Pugilistas 4 braços...não pera... a conta nao bate", tipo:'construcao', parametro:{nome: "Pugilista"}, quantidade: 4, id:'pugilista1', obtido:false, descricao: "Um novato...que fica ai...(ele nao sabe usar a ficha...)"},
  {nome: "Onde está minha carteira?", tipo: 'construcao', parametro: { nome: "Ladino" }, quantidade: 1, id: 'const_ladino_1', obtido: false,  descricao: "Recrutou um Ladino. Seu DPS subiu, mas você jurava que tinha mais moedas guardadas..."},
  {nome: "Toca Raul!", tipo: 'construcao', parametro: { nome: "Bardo" }, quantidade: 5, id: 'const_bardo_5', obtido: false, descricao: "Cinco bardos tocando a mesma música ao mesmo tempo. Os monstros estão morrendo de dor de cabeça."},
  {nome: "Zoológico Incremental", tipo: 'construcao',  parametro: { nome: "Druida" },  quantidade: 10,    id: 'const_druida_10',   obtido: false,  descricao: "Dez druidas transformados em guaxinins. Eles não atacam, mas reviram o lixo dos monstros com maestria."},

  // Quantidade de construcoes
  {nome: "Uma party...é...uma party", id:"const_total_5", obtido: false, descricao: "Tenha 5 pessoas em sua party",
    check: (s) => s.construcoes?.reduce((soma, c) => soma + c.quantidade, 0) >= 5 },
]