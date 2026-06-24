
import { useState, useEffect, useRef, version } from 'react';

import { motion, PresenceContext, useAnimation } from 'framer-motion';
import { VERSAO_ATUAL, DEFAULT_SAVE, processarSave } from './Versionamento';
import { DEFAULT_ASCENSAO, DEFAULT_MELHORIAS, DEFAULT_VINHO, DEFAULT_CONSTRUCOES, DEFAULT_DOURADO, DEFAULT_CONQUISTAS } from './DEFAULT';
import { b_novato, b_guerreiro, b_mago, b_ladino, b_pugilista, b_bardo, b_paladino, b_druida, b_cacador, b_necromante } from './DEFAULT';
import { useAvisosPersistentes, useMostrarAviso, formatarNumero } from './Utilitarios';
import { obterNovasConquistas, checkConquista } from './CONQUISTAS';

// TESTES
import {
  calcularValorClick,
  atualizarDanoConstrucoes,
  obterUpgradesDisponiveis,
  processarCompraUpgrade
} from './UPGRADES';

// ICONS
import logo from './logo.svg';
import './App.css';
import dado from './d20.png';
import dodo from './dodo.png';
import galho from './galho.png';
import espada from './espada.png';
import arco from './arco.png';
import cajado from './cajado.png';
import pata from './pata.png';
import ritual1 from './ritual.png';

//Icons Distritos

import ordem from './Ordem.png';
import ray from './Ray.png';
import reli from './Reli.png';
import asc from './Ascensao.png';


function App() {

  // ... dentro do seu componente:
  const mapaRef = useRef(null);
  const [estaArrastando, setEstaArrastando] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  // Força a centralização milimétrica perfeita assim que a tela abre
  useEffect(() => {
    if (mapaRef.current) {
      // 1000px é o centro do mapa de 2000px. Subtraímos metade da tela do jogador para focar no meio.
      mapaRef.current.scrollLeft = 1000 - (window.innerWidth / 2);
      mapaRef.current.scrollTop = 1100 - (window.innerHeight / 2);
    }
  }, []);

  const iniciarArrasto = (e) => {
    setEstaArrastando(true);
    setStartX(e.pageX - mapaRef.current.offsetLeft);
    setStartY(e.pageY - mapaRef.current.offsetTop);
    setScrollLeft(mapaRef.current.scrollLeft);
    setScrollTop(mapaRef.current.scrollTop);
  };

  const pararArrasto = () => {
    setEstaArrastando(false);
  };

  const arrastando = (e) => {
    if (!estaArrastando) return;
    e.preventDefault();

    const x = e.pageX - mapaRef.current.offsetLeft;
    const walkX = (x - startX) * 1.5; // Altere 1.5 para aumentar/diminuir a velocidade do arrasto

    const y = e.pageY - mapaRef.current.offsetTop;
    const walkY = (y - startY) * 1.5;

    mapaRef.current.scrollLeft = scrollLeft - walkX;
    mapaRef.current.scrollTop = scrollTop - walkY;
  };


  //TESTE seguir MOUSE

  const botoesComPopup = document.querySelectorAll('.secao-construcao button, .secao-upgrade button');

  botoesComPopup.forEach(botao => {
    const popup = botao.querySelector('.popup-info');
    if (!popup) return;

    botao.addEventListener('mouseenter', () => {
      // Pega a posição exata do botão na tela atual
      const rect = botao.getBoundingClientRect();

      // Alinha o pop-up à esquerda do botão (subtraindo a largura dele + margem)
      popup.style.left = `${rect.left - 255}px`; // 220px de largura + 15px de distância
      popup.style.top = `${rect.top - 10}px`;
      popup.style.display = 'block';
    });

    botao.addEventListener('mouseleave', () => {
      popup.style.display = 'none';
    });
  });



  // FUNCAO PARA CALCULAR O PRECO ATUAL DE CADA CONSTRUCAO

  function getPrecoAtual(precoBase, quantidade) {
    return Math.floor(precoBase * Math.pow(1.2, quantidade));
  }

  //tudo
  const [contagem, setContagem] = useState(0); // total de dados
  const [DPS, setDps] = useState(0); // total de Dados por segundo Dps
  const [click, setClick] = useState(1); // clic
  const [construcoes, setConstrucoes] = useState(DEFAULT_CONSTRUCOES);
  const [upgrade, setUpgrade] = useState(DEFAULT_MELHORIAS);
  const [conquistas, setConquistas] = useState(DEFAULT_CONQUISTAS);

  const [contagemTotal, setContagemTotal] = useState(0)// TODOS JA CONSEGUIDOS
  const [ritual, setRitual] = useState(null);
  const [buff, setBuff] = useState([]);
  const [aviso, setAviso] = useState(false);

  // ==============================AVISOS================================================

  // =============================SIMPLIFICADOR DE NUMEROS================================
  

  // ============================MINIGAMES==================================
  const [vinho, setVinho] = useState(DEFAULT_VINHO)



  useEffect(() => {
    const vinheiro = construcoes.find(c => c.nome === "Mago");
    if (vinheiro && vinheiro.quantidade >= 1) {
      setVinho(prev =>
        prev.desbloqueado ? prev : { ...prev, desbloqueado: true }

      );

    }
  }, [construcoes])



  // ------------------------------------ASCENCAO--------------------------------------


  const [ascensao, setAscensao] = useState(DEFAULT_ASCENSAO)

  const [telaAtual, setTelaAtual] = useState("jogo"); //Telas: jogo, ascensao, pilares, conquistas,

  useEffect(() => {
    const pilar = contagem;
    if (pilar && pilar >= 1_000_000_000) {
      setAscensao(prev =>
        prev.desbloqueado ? prev : { ...prev, desbloqueado: true }
      );
    }
  })


  //------------------------------------------------------------------------------------------
  //os numeros que surgem do cookie
  const [numeirinhos, setNumeirinhos] = useState([]);
  const [HistoricoVinho, setHistoricoVinho] = useState([]);

  function contarDado() {
    const valorDoCliqueSeguro = Number(click) && !isNaN(click) ? click : 1;

    setContagem((atual) => atual + valorDoCliqueSeguro);
    setContagemTotal((atual) => atual + valorDoCliqueSeguro);

    // setContagem((anterior) => anterior + clickRef.current);
    // setContagemTotal((anterior) => anterior + clickRef.current);

  }



  // ===================================== SAVES===================================
  // Referencias
  const contagemRef = useRef(contagem);
  const contagemTotalRef = useRef(contagemTotal);
  const clickRef = useRef(click);
  const construcoesRef = useRef(construcoes);
  const upgradeRef = useRef(upgrade);
  const vinhoRef = useRef(vinho)
  const ascensaoRef = useRef(ascensao)

  // Sincronia de referencias
  useEffect(() => { contagemRef.current = contagem; }, [contagem]);
  useEffect(() => { contagemTotalRef.current = contagemTotal; }, [contagemTotal]);
  useEffect(() => { clickRef.current = click; }, [click]);
  useEffect(() => { construcoesRef.current = construcoes; }, [construcoes]);
  useEffect(() => { upgradeRef.current = upgrade }, [upgrade]);
  useEffect(() => { vinhoRef.current = vinho }, [vinho]);
  useEffect(() => { ascensaoRef.current = ascensao }, [ascensao]);

  //SAVES
  useEffect(() => {
    const salvamento = localStorage.getItem("QuickSave")

    if (salvamento) {
      try {
        const dadosBrutos = JSON.parse(salvamento);

        const saveSeguro = processarSave(dadosBrutos, construcoes, upgrade)

        setContagem(saveSeguro.contagem ?? 0);
        setContagemTotal(saveSeguro.contagemTotal ?? 0);
        setClick(saveSeguro.click ?? []);
        setConstrucoes(saveSeguro.construcoes ?? []);
        setUpgrade(saveSeguro.upgrade ?? []);
        setVinho(saveSeguro.vinho ?? []);
        setAscensao(saveSeguro.ascensao ?? []);

      } catch (e) {
        console.error("Falha ao processar o auto-save", e)
      }

    }
  }, [])

  //PERIODICO
  useEffect(() => {
    const autoSave = setInterval(() => {
      const saveData = {
        version: VERSAO_ATUAL,
        contagem: contagemRef.current,
        contagemTotal: contagemTotalRef.current,
        click: clickRef.current,
        vinho: vinhoRef.current,
        ascensao: ascensaoRef.current,

        //aplicacao pratica: apenas a quantidade / se é comprad e id
        construcoes: construcoesRef.current.map(c => ({ nome: c.nome, quantidade: c.quantidade })),
        upgrade: upgradeRef.current.map(u => ({ id: u.id, comprado: u.comprado }))
      };
      localStorage.setItem("QuickSave", JSON.stringify(saveData));
      console.log(saveData);
    }, 60000);
    return () => clearInterval(autoSave);
  }, []);

  function exportarSave() {
    const saveData = {
      version: VERSAO_ATUAL,
      contagem: contagemRef.current,
      contagemTotal: contagemTotalRef.current,
      click: clickRef.current,
      vinho: vinhoRef.current,
      ascensao: ascensaoRef.current,
      //aplicacao pratica: apenas a quantidade / se é comprad e id
      construcoes: construcoesRef.current.map(c => ({ nome: c.nome, quantidade: c.quantidade })),
      upgrade: upgradeRef.current.map(u => ({ id: u.id, comprado: u.comprado }))
    }
    const saveTexto = JSON.stringify(saveData);

    const saveEncriptado = encodeURIComponent(saveTexto)

    navigator.clipboard.writeText(saveEncriptado)
      .then(() => mostrarAviso("Salvamento copiado com sucesso!"))
      .catch(() => alert("Erro ao copiar o save"));
  }

  //importando
  function importarSave() {
    const inputImportar = prompt("Coloque o save Abaixo:");
    if (!inputImportar) return;



    try {
      const decodeSave = decodeURIComponent(inputImportar);
      const dadosBrutos = JSON.parse(decodeSave);

      const saveSeguro = processarSave(dadosBrutos, construcoes, upgrade);

      setContagem(saveSeguro.contagem);
      setContagemTotal(saveSeguro.contagemTotal);
      setClick(saveSeguro.click);
      setConstrucoes(saveSeguro.construcoes);
      setUpgrade(saveSeguro.upgrade);
      setVinho(saveSeguro.vinho);
      setAscensao(saveSeguro.ascensao);

    } catch (e) {
      alert("Erro ao carregar o save" + e);
    }

  }
  // ==================================RITUAIS=====================================

  function spawnRitual() {
    const padding = 80;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const x = Math.random() * (width - padding * 2) + padding;
    const y = Math.random() * (height - padding * 2) + padding;

    const duration = 15000;

    setRitual({
      x,
      y,
      expiresAt: Date.now() + duration
    })
  }

  useEffect(() => {
    const intervalo = setInterval(() => {
      if (Math.random() < 0.25) {
        spawnRitual()

      }
    }, 30000);
    return () => clearInterval(intervalo);
  }, [])

  useEffect(() => {
    if (!ritual) return;

    const timeOut = setTimeout(() => {
      setRitual(null);
    }, ritual.expiresAt - Date.now());
  })


  function efeitoRitual() {
    setRitual(null);
    const efeito = rollEfeito();
    if (!efeito) return;

    mostrarAviso(`RITUAL ${efeito.nome}`);

    // Se no objeto estiver "Instantaneo", encerra aqui
    if (efeito.efeito === "Instantaneo" || efeito.efeito === "instantaneo") {
      contagemInstantanea(efeito.nome);
      return;
    }

    setBuff(prev => [
      ...prev,
      {
        nome: efeito.nome,
        tipo: efeito.efeito, // Mudamos aqui para pegar o .efeito ("DPS", "Click") e salvar como tipo
        mult: Number(efeito.mult), // Garante que seja um número para a multiplicação
        expira: Date.now() + Number(efeito.duracao) * 1000
      }
    ]);
  }

  function rollEfeito() {
    const pesoTotal = DEFAULT_DOURADO.reduce((s, e) => s + Number(e.peso), 0);
    let roll = Math.random() * pesoTotal;

    for (const efeito of DEFAULT_DOURADO) {
      if (roll < Number(efeito.peso)) return efeito;
      roll -= Number(efeito.peso);
    }

  }

  function DPSBuffado(baseDps, buff) {
    const now = Date.now();

    return buff.reduce((dps, b) => {
      if (b.expira < now) return dps;

      if (b.tipo === "DPS") {
        console.log("Aplicando multiplicador: " + b.mult);
        return dps * b.mult;
      }


      return dps;
    }, baseDps);
  }

  function contagemInstantanea() {
    const ganhoMinutos = DPS * 60 * 30;

    const ganhoBanco = contagem * 0.1;

    const ganho = Math.max(ganhoMinutos, ganhoBanco);

    setContagem(v => v + ganho);
    setContagemTotal(v => v + ganho);
    mostrarAviso("Você ganhou " + ganho);
  }

  // =====================================EFEITO DE UPGRADES/COMPRAS==========================================

  
  //USEFECT DE UPGRADES
  useEffect(() => {

    const danosBases = {
      "Novato": b_novato, "Guerreiro": b_guerreiro, "Ladino": b_ladino,
      "Bardo": b_bardo, "Paladino": b_paladino, "Druida": b_druida,
      "Caçador": b_cacador, "Necromante": b_necromante
    };

    const clickCalculado = calcularValorClick(upgrade, ascensao, DPS, buff);
    setClick(clickCalculado);

    setConstrucoes((anterior) => atualizarDanoConstrucoes(upgrade, anterior, danosBases));



  }, [upgrade, DPS, buff])

  //UPGRADES ASCENSAO:
  useEffect(() => {
    const novatoGratis = ascensao.distritoOrdem.upgrades.filter(u => u.efeito === "novatoGratis" && u.comprado).length;

    setConstrucoes(anterior =>
      anterior.map(c =>
        c.nome === "Novato"
          ? {
            ...c,
            quantidadeGratis: novatoGratis * 10
          }
          : c
      )
    );

  }, [ascensao])

  //DPS DA CONSTRUCAO
  function dpsConstrucao(c) {
    return c.dps;
  }

  // TEMPO DO JOGO E CONSTRUCOES
  useEffect(() => {
    let lastUpdate = Date.now();

    const timer = setInterval(() => {
      const now = Date.now();
      const deltaSeconds = (now - lastUpdate) / 1000;
      lastUpdate = now;

      // CORREÇÃO 2: Garante que se c.dps não existir, o código use o dano base padrão para não gerar undefined
      const producaoBase = construcoes.reduce((soma, c) => {
        const quantidadeTotal = c.quantidade + (c.quantidadeGratis || 0);
        const dpsRealDaConstrucao = Number(c.dps) || 0; // Alinhado com o dps dinâmico que o UPGRADES.js gera
        return soma + (dpsRealDaConstrucao * quantidadeTotal);
      }, 0);

      // Multiplicadores de por cento
      const multiplicador1Porcento = upgrade.filter(u => u.efeito === "1porcento" && u.comprado).length;
      const multiplicador2Porcento = upgrade.filter(u => u.efeito === "2porcento" && u.comprado).length;
      const multiplicador5Porcento = upgrade.filter(u => u.efeito === "5porcento" && u.comprado).length;
      const multiplicador10Porcento = upgrade.filter(u => u.efeito === "10porcento" && u.comprado).length;

      const multiplicadorBasico = 1 + multiplicador1Porcento * 0.01 + multiplicador2Porcento * 0.02 + multiplicador5Porcento * 0.05 + multiplicador10Porcento * 0.10;

      // CORREÇÃO 1: Checa o tamanho do array (.length > 0) e valida se prestigioTotal é um número válido
      const dspAscensaoAtivo = ascensao.distritoBase.upgrades.filter(u => u.efeito === "ascensaodps" && u.comprado);
      const multiplicadorPrestigio = dspAscensaoAtivo ? 1 + ascensao.prestigioTotal * 0.01 : 1



      const producao = DPSBuffado(producaoBase * multiplicadorBasico * multiplicadorPrestigio, buff);

      // SEGURO: Se por qualquer motivo a produção virar NaN, mude para 0 para não quebrar o texto da tela
      const producaoSegura = Number(producao) && !isNaN(producao) ? producao : 0;

      setDps(producaoSegura);

      setContagem((atual) => {
        // Se o estado atual já estiver corrompido com NaN do passado, força voltar para 0
        const atualSeguro = isNaN(atual) ? 0 : atual;
        return atualSeguro + (deltaSeconds * producaoSegura);
      });

      setContagemTotal((atual) => {
        const atualSeguro = isNaN(atual) ? 0 : atual;
        return atualSeguro + (deltaSeconds * producaoSegura);
      });
    }, 100);

    return () => clearInterval(timer);
  }, [construcoes, upgrade, buff, ascensao]);


  function comprarUpgrade(indiceOriginal) {
    // 1. Usamos o callback (atual) para garantir o valor mais real da contagem no momento exato do clique
    setContagem((contagemAtual) => {

      // Executa a validação do arquivo UPGRADES.js passando o valor mais recente
      const resultado = processarCompraUpgrade(upgrade, indiceOriginal, contagemAtual);

      if (resultado) {
        // 2. Se a compra for válida, atualiza os upgrades e retorna o saldo deduzido
        setUpgrade(resultado.novosUpgrades);
        return resultado.novaContagem;
      }

      // 3. Se não tiver saldo ou o upgrade já foi comprado, mantém a contagem exatamente como estava
      return contagemAtual;
    });
  }

  const listaExibicaoLoja = obterUpgradesDisponiveis(upgrade, construcoes, contagemTotal, ascensao);

  //FUNCAO DE COMPRAR CONSTRUCAO
  function comprarConstrucao(indice) {
    setConstrucoes((anterior) => {
      const novo = anterior.map((c, i) => {
        const precoAtual = getPrecoAtual(c.preco, c.quantidade);

        if (contagem >= precoAtual && i === indice) {
          setContagem(contagem - precoAtual);
          return {
            ...c,
            quantidade: c.quantidade + 1
          }
        }
        return c;
      });
      return novo
    });
  };

  // MINI GAME PARTE 2
  const VINHO_BASE = 100000;
  const valorAtualVinho = Math.floor(
    VINHO_BASE * vinho.mercado)
    ;

  const precoVinhoCredito = Math.floor(100000 * Math.pow(1.2, vinho.level))


  //FUNCAO COMPRAR MINIGAME LE DOUGLES
  function comprarVinhoLevel() {
    if (contagem >= precoVinhoCredito) {
      setContagem(prev => prev - precoVinhoCredito);
      setVinho(prev => ({
        ...prev,
        level: prev.level + 1
      }));
    }
  };
  //ok

  useEffect(() => {
    if (!vinho.desbloqueado || vinho.level === 0) return;

    const timer = setInterval(() => {
      setVinho(prev => ({
        ...prev,
        creditos: prev.creditos + prev.level * 0.0003
      }));
    }, 100)


    return () => clearInterval(timer);
  }, [vinho.desbloqueado, vinho.level]);
  //ok


  function venderVinho() {
    const moedaInteiras = Math.floor(vinho.creditos);
    if (moedaInteiras < 1) return;

    const ganhoVinho = moedaInteiras * valorAtualVinho;

    setContagem(c => c + ganhoVinho);
    setContagemTotal(c => c + ganhoVinho);
    setVinho(prev => ({
      ...prev,
      creditos: prev.creditos - moedaInteiras
    }));
    //daria pra mostrar um aviso aqui e pá
  }

  //MERCADO DE ACOES DE VINHOS
  useEffect(() => {
    if (!vinho.desbloqueado) return;

    const timer = setInterval(() => {

      const mudanca = (Math.random() - 0.5) * 0.2;
      let novoMercado = vinho.mercado + mudanca;

      novoMercado = Math.max(0.01, Math.min(100, novoMercado))

      setVinho(prev => {

        return {
          ...prev,
          mercado: Number(novoMercado.toFixed(2))
        }
      })

      let valor = novoMercado * VINHO_BASE;
      //setando historico
      setHistoricoVinho(h => {
        const novo = [...h, valor];
        return novo.slice(-30);
      });
    }, 30000);

    return () => clearInterval(timer);

  }, [vinho.desbloqueado]);


  function GraficoVinho({ dados }) {
    const width = 250;
    const height = 120;
    const padding = 10;

    if (dados.length < 2) return null;


    const min = Math.min(...dados);
    const max = Math.max(...dados);
    const range = max - min || 1;

    const color = dados[dados.length - 1] >= dados[dados.length - 2] ? "#4caf50" : "#f44336";


    const points = dados.map((value, i) => ({
      x: (i / (dados.length - 1)) * width,
      y: height - ((value - min) / range) * height,
      value
    }));

    const labels = [
      { value: max, y: 12 },
      { value: (max + min) / 2, y: height / 2 },
      { value: min, y: height - 4 }
    ]

    return (
      <svg width={width + 40} height={height} style={{ background: "white", borderRadius: 6 }}>

        {labels.map((l, i) => (
          <text
            key={i}
            x={2}
            y={l.y}
            fill="#aaa"
            fontSize="10"
          >
            {formatarNumero(l.value)}
          </text>
        ))}

        {points.slice(1).map((p, i) => {
          const prev = points[i];
          const color = p.value >= prev.value ? "#4caf50" : "#f44336";

          return (
            <line
              key={i}
              x1={prev.x + 40}
              y1={prev.y}
              x2={p.x + 40}
              y2={p.y}
              stroke={color}
              strokeWidth="2"
            />
          );
        })}


      </svg>
    )
  }

  // ========================ASCENCAO PARTE 2=========================

  const PRIMEIRO_PRESTIGIO = 1_000_000_000;

  function calcularPrestigio(c) {
    return Math.floor(Math.sqrt(c / PRIMEIRO_PRESTIGIO));
  }

  const prestigioTotalV = calcularPrestigio(contagemTotal)
  const prestigioPossivel = prestigioTotalV - ascensao.prestigioTotal;

  // BARRA DE PROGRESSO: <-- isto esta confuso arrumar adiante

  const contagemAtual = contagemTotal;
  const contagemPrestigioAtual = PRIMEIRO_PRESTIGIO * (prestigioTotalV ** 2);
  const contagemProximoPrestigio = PRIMEIRO_PRESTIGIO * ((prestigioTotalV + 1) ** 2);

  const progresso = (contagemAtual - contagemPrestigioAtual) / (contagemProximoPrestigio - contagemPrestigioAtual);
  const progressoPorcentagem = Math.min(Math.max(progresso, 0), 1);

  function ascender() {
    setTelaAtual("pilares");
    setContagem(0);
    setClick(0);
    setConstrucoes(DEFAULT_CONSTRUCOES);
    setUpgrade(DEFAULT_MELHORIAS);
    setVinho(DEFAULT_VINHO)


    setAscensao(prev => ({
      ...prev,
      desbloqueado: true,
      prestigio: prev.prestigio + prestigioPossivel,
      prestigioTotal: prev.prestigioTotal + prestigioPossivel,
      //TERMINAR
    }))
  }

  function comprarUpgradeAscensao(distrito, index) {
    setAscensao(prev => {
      const upgradeAs = prev[distrito]?.upgrades[index];
      if (!upgradeAs) return prev;

      // CORRIGIDO: Puxa o prestígio atual direto do estado do jogo (prev)
      const prestigioAtual = Number(prev.prestigio) || 0;
      const preco = Number(upgradeAs.preco) || 0;

      if (upgradeAs.comprado || prestigioAtual < preco) return prev;

      return {
        ...prev,
        prestigio: prestigioAtual - preco,
        [distrito]: {
          ...prev[distrito],
          upgrades: prev[distrito].upgrades.map((u, i) =>
            i === index ? { ...u, comprado: true } : u
          )
        }
      };
    });
  }


  //=================ANIMACAO DADO=========================
  const controls = useAnimation();
  const Clicar = (e) => {
    //pega o horario atual
    const id = Date.now();
    //posicao do mouse
    const x = e.clientX - 20;
    const y = e.clientY - 20;
    //seta o id, e posicoes
    setNumeirinhos((prev) => [...prev, { id, x, y }]);

    //faz a animacao no cookie quando clica
    controls.start({
      scale: [1, 0.9, 1.1, 1], //faz ele aumentar e diminuir
      transition: { duration: 0.3, ease: "easeOut" } // faz ele faer isto em 0.3 segundos
    });
    contarDado(); // conta o dados
    setTimeout(() => {
      setNumeirinhos((prev) => prev.filter((t) => t.id !== id)); // faz os numeirinhos sumirem
    }, 1000) // define para eles ficarem por 1 segundo
  };

  //================AVISOS ====================

  const {
    avisosPersistentes,
    mostrarAvisoPersistente,
    fecharAvisoPersistente,
    limparAvisosPersistentes
  } = useAvisosPersistentes();

  const {
    mostrarAviso
  } = useMostrarAviso();

  //===================CONQUISTAS=============================

  // MONITOR ÚNICO DE CONQUISTAS E NOTIFICAÇÕES
  useEffect(() => {
    // 1. Monta o objeto com os estados atuais do jogo (certifique-se se usa dps ou DPS no seu state)
    const estado = { contagemTotal, DPS: DPS, construcoes, click };

    // 2. Filtra apenas as conquistas que o jogador acabou de ganhar neste milissegundo
    const novasConquistas = conquistas.filter(c => !c.obtido && checkConquista(c, estado));

    if (novasConquistas.length === 0) return;

    // 3. Dispara os alertas na tela com o título e o ícone de troféu
    novasConquistas.forEach(c => {
      mostrarAvisoPersistente(`Conquista Desbloqueada: ${c.nome}`, "🏆");
    });

    // 4. Salva de forma permanente no estado mudando obtido para true
    const idsObtidos = new Set(novasConquistas.map(c => c.id));
    setConquistas(prev => prev.map(c =>
      idsObtidos.has(c.id) ? { ...c, obtido: true } : c
    ));

  }, [contagemTotal, DPS, construcoes, click]); 

  // =============================================HTML=========================================
  return (
    <div className="App">

      {/* AVISOS PERSISTENTES */}

      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 20, /* Subi um pouco para desgrudar do rodapé */
          display: "flex",
          flexDirection: "column-reverse",
          alignItems: "center",
          gap: "10px",
          zIndex: 9998,
          pointerEvents: "none"
        }}
      >
        {(() => {
          const MAX_VISIVEIS = 3;
          const visiveis = avisosPersistentes.slice(0, MAX_VISIVEIS);
          const esperando = avisosPersistentes.length - visiveis.length;

          return (
            <>
              {visiveis.map(a => (
                <div
                  key={a.id}
                  onClick={() => fecharAvisoPersistente(a.id)}
                  style={{
                    pointerEvents: "auto",
                    background: "rgba(28, 17, 36, 0.95)", /* Roxo escuro ocultista */
                    color: "#d1cbd4", /* Texto claro padrão do CSS */
                    fontFamily: "'Georgia', 'Times New Roman', serif",

                    /* Borda roxa com um detalhe vermelho imitando o corte do dado */
                    border: "2px solid #5a2c85",
                    borderLeft: "6px solid #ff3344",
                    borderRadius: "4px",

                    padding: "12px 40px 12px 18px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    maxWidth: "600px",
                    minWidth: "300px",
                    position: "relative",

                    /* Sombra projetada pesada com brilho místico */
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.7), 0 0 10px rgba(160, 78, 246, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    letterSpacing: "0.5px"
                  }}
                  title="Clique para fechar"
                >
                  {a.icone && <span style={{ fontSize: "18px" }}>{a.icone}</span>}
                  <span>{a.texto}</span>

                  {/* O '✕' de fechar agora usa o vermelho do dado */}
                  <span style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: "18px",
                    color: "#ff3344",
                    fontWeight: "bold"
                  }}>✕</span>
                </div>
              ))}

              {(avisosPersistentes.length >= 2 || esperando > 0) && (
                <button
                  onClick={limparAvisosPersistentes}
                  style={{
                    pointerEvents: "auto",
                    background: "#0e0a12", /* Fundo idêntico ao botão de estatísticas */
                    color: "#d1cbd4",
                    fontFamily: "'Georgia', 'Times New Roman', serif",
                    textTransform: "uppercase",
                    letterSpacing: "1px",

                    border: "2px solid #5a2c85",
                    borderRadius: "4px",
                    padding: "6px 14px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.6)",
                    transition: "all 0.2s ease"
                  }}
                  // Efeito visual simulado de hover via título para guiar o jogador
                  title="Limpa todas as notificações ativas"
                >
                  {esperando > 0
                    ? `Limpar notificações (+${esperando} na fila)`
                    : `Limpar notificações`}
                </button>
              )}
            </>
          );
        })()}
      </div>


      {/* Avisos gerais */}
      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 18,
          pointerEvents: "none",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
        }}
      >
        {aviso && (
          <motion.div
            key={aviso.id}
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 0, y: -30 }}
            transition={{ duration: 3.0 }}
            style={{
              position: "absolute",
              width: "100%",
              textAlign: "center",
              fontSize: "20px",
              fontWeight: "bold",
              pointerEvents: "none",
            }}
          >
            {aviso.texto}
          </motion.div>
        )}
      </div>




      {ritual && telaAtual !== "pilares" && (
        <div
          onClick={efeitoRitual}
          style={{
            position: 'fixed',
            left: ritual.x,
            top: ritual.y,
            bottom: 18,
            //pointerEvents: "none",
            display: 'flex',
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <img src={ritual1} style={{ height: "150px", width: "150px" }} />
        </div>
      )}

      {telaAtual !== "pilares" && (
        <div className="jogo">
          <div class="lado-esquerdo">

            <button
              className="botao-estatisticas"
              onClick={() => setTelaAtual("menu")}
            >
              Estatísticas
            </button>
            {telaAtual === "menu" && (
              <div className="overlay-estatisticas">
                <div className="conteudo-estatisticas">
                  <h2>Estatísticas do Santuário</h2>

                  <div className="lista-estatisticas">
                    {/* Substituído 'state.click' pela sua variável/estado direto */}
                    <p>Valor do Clique: <strong>{click}</strong></p>
                    <p>Total Acumulado: <strong>{Math.floor(contagemTotal)}</strong></p>
                    <p>DPS Atual: <strong>{DPS}</strong></p>
                  </div>

                  <h2>Conquistas</h2>
                  <div className="grade-conquistas">
                    {conquistas.map((conquista) => {
                      // Uma conquista é considerada ganha se ela já foi salva como TRUE no estado
                      const desbloqueada = conquista.obtido;

                      return (
                        <div
                          key={conquista.id}
                          className={`quadrado-conquista ${desbloqueada ? 'desbloqueado' : ''}`}
                          title={desbloqueada ? `${conquista.nome} - ${conquista.descricao}` : "Bloqueado"}
                        >
                          <span style={{ fontSize: '22px' }}>{desbloqueada ? "👁️" : "🔒"}</span>
                        </div>
                      );
                    })}
                  </div>

                  <button className="botao-fechar"
                    onClick={() => setTelaAtual("jogo")}
                  >
                    Voltar ao Jogo
                  </button>
                </div>
              </div>
            )}

            {/*LE DOUGLES*/}
            {vinho.desbloqueado && telaAtual === "jogo" && (
              <div className='secao-le-dougles'>
                <h2> Le Dougles </h2>

                <p>Créditos: {vinho.creditos.toFixed(3)}</p>
                <p>Level: {vinho.level}</p>

                <button
                  onClick={comprarVinhoLevel}
                  disabled={contagem < precoVinhoCredito}
                >
                  Fetilizante <br />
                  Preço: {precoVinhoCredito}
                </button>

                <p>
                  Valor: {" "}
                  <strong>
                    {valorAtualVinho.toLocaleString()} Coisos
                  </strong>
                </p>
                <GraficoVinho dados={HistoricoVinho} /> <br />

                <button onClick={venderVinho}>
                  Vender Vinho
                </button>
              </div>
            )}
            {/*ENTRADA POP*/}
            {telaAtual === "jogo" && ascensao.desbloqueado && (
              <div className='secao-ascensao'>
                <h2>Pilares da Criação</h2>
                <p> Os pilares observam </p>

                <div className='barra-prestigio-box'>
                  <div className='barra-prestigio-header'>
                    <span>Prestigio ao Ascender</span>
                    <strong>+ {prestigioPossivel}</strong>
                  </div>

                  <div className='barra-prestigio-fora'>
                    <div className='barra-prestigio-dentro'
                      style={{ width: `${progressoPorcentagem * 100}%` }} />
                  </div>
                  <div className='prestigio-info'>

                    {formatarNumero(contagemProximoPrestigio - contagemTotal)} até o proximo nivel
                  </div>
                </div>



                <button className='portao-ascensao'
                  onClick={() => setTelaAtual("ascensao")}>
                  Entrar nos pilares
                </button>
              </div>
            )}
            {/** ENTRADA ASCENSAO */}
            {telaAtual === "ascensao" && (
              <div className='secao-ascensao'>
                <h2>Pilares da Criação</h2>
                <p> Os pilares observaam </p>


                <button className='portao-ascensao'
                  onClick={() => setTelaAtual("jogo")}>
                  Sair nos pilares
                </button>
              </div>
            )}



            {/** JANELA DE FAZER KABOOM */}
            {telaAtual === "ascensao" && (
              <div className="overlay-ascensao">
                <div className="janela-ascensao">

                  {/* Botão de Voltar no topo superior */}
                  <button className="botao-voltar-ascensao" onClick={() => setTelaAtual("jogo")}>
                    ← Voltar
                  </button>

                  {/* Conteúdo Central */}
                  <h2 className="titulo-ascensao">Pilares da Criação</h2>

                  <div className="painel-prestigio">
                    <span>Prestígio Atual</span>
                    <strong>{ascensao.prestigio}</strong>
                  </div>
                  <button className='botao-ascender' onClick={() => ascender()}>
                    Fazer Kaboom
                  </button>


                </div>
              </div>
            )}

            {/* Janela ESTATISTICAS */}




          </div>

          {/* DADO*/}


          <div class="secao-dado">

            <h1>Buxas Clicker</h1>
            <h2>Total de numeros: {formatarNumero(contagem)}</h2>
            {/* <h2>Total REAL DE DAOS: {formatarNumero(contagemTotal)}</h2> */}

            {/* <h2>Total click dps {formatarNumero(clickPorDps(upgrade, ascensao))}</h2> */}

            <h3>DPS: {DPS.toFixed(1)}</h3>
            <motion.img
              id="dadoP"
              src={dado}
              onClick={Clicar}
              animate={controls}
              WhileHover={{
                scale: 1.1,
                filter: "brightness(1.1)",
                transition: { duration: 0.3, repeat: Infinity, repeatType: "reverse" },
              }}

              style={{ width: "300px", cursor: "pointer", borderRadius: "0%", userSelect: "none", }}
            />

            {numeirinhos.map((text) => (
              <motion.div
                key={text.id}
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 0, y: -50 }}
                transition={{ duration: 1, ease: "easeOut" }}
                style={{
                  position: "absolute",
                  left: text.x,
                  top: text.y,
                  transform: "translate(-50%, -50%)",
                  color: "#fff",
                  fontSize: "20px",
                  fontWeight: "bold",
                  textShadow: "0 0 5px black",
                  pointerEvents: "none",
                }}
              >
                +{formatarNumero(click)}
              </motion.div>
            ))}



            <div className="save-actions">
              <button className="btn-export" onClick={exportarSave}>Exportar</button>
              <button className="btn-import" onClick={importarSave}>Importar</button>
              <button className="btn-reset" onClick={() => {
                localStorage.removeItem("QuickSave");
                window.location.reload();
              }}>Resetar</button>
            </div>

            <p>Versao: {VERSAO_ATUAL}</p>
          </div>


          {/*LADO DIREITO*/}
          {telaAtual === "jogo" && (

            <div class="lado-direito">

              <div className="secao-upgrade">
                <h2>Upgrades</h2>
                {listaExibicaoLoja.map((u, i) => (
                  <button
                    key={i}
                    className="botao-upgrade"
                    onClick={() => comprarUpgrade(u.indiceOriginal)}
                    disabled={contagem < u.preco}
                    style={{
                      opacity: contagem < u.preco ? 0.4 : 1,
                      cursor: contagem < u.preco ? "not-allowed" : "pointer",
                    }}
                  >
                    <img src={u.icone} alt={u.nome} />
                    <div className="info-texto">
                      <span className="nome-item">{u.nome}</span>
                      <span className="preco-item">Preço: {u.preco}</span>
                      <span className="qtd-item">Qtd: {u.quantidade}</span>
                    </div>

                    {/* Caixa flutuante (popup) do Upgrade */}
                    <div className="popup-info">
                      <strong>{u.nome}</strong>
                      <p> Preço:{formatarNumero(u.preco)}</p> <br />
                      <p>{u.descricao || "Um artefato antigo imbuído de poder profano."}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div class="secao-construcao">
                <h2>Construções</h2>
                {construcoes.map((c, i) => (
                  <button key={i} className="botao-construcao" onClick={() => comprarConstrucao(i)}>
                    <img src={c.icone} alt={c.nome} /> <br />
                    {c.nome} <br />
                    preço: {formatarNumero(getPrecoAtual(c.preco, c.quantidade))} <br />
                    Quantidade: {c.quantidade + (c.quantidadeGratis || 0)} <br />
                    {/* Caixa flutuante (popup) com informações extras */}
                    <div className="popup-info">
                      <strong>{c.nome}</strong>
                      <p>{c.descricao || "Um artefato antigo imbuído de poder profano."}</p> <br />
                      <p>{c.assin || "- O Narrador"}</p>
                    </div>
                  </button>
                ))}

              </div>

            </div>
          )}

        </div>
      )}

      {telaAtual === "pilares" && (
        <div className="overlay-ascensao-tela-cheia">
          <div className="janela-ascensao-tela-cheia">

            <div className="cabecalho-ascensao-topo fixado">
              <h2 className="titulo-ascensao-compacto">Pilares da Criação</h2>
              <div className="painel-prestigio-ultra-compacto">
                <span>Prestígio Atual</span>
                <strong>{ascensao.prestigio}</strong>
              </div>
            </div>

            <div className={`espaco-arrastavel-container ${estaArrastando ? 'arrastando' : ''}`}
              ref={mapaRef}
              onMouseDown={iniciarArrasto}
              onMouseLeave={pararArrasto}
              onMouseUp={pararArrasto}
              onMouseMove={arrastando}
            >
              <div className="mapa-conteudo-gigante">

                {/* ======================================================== */}
                {/* RENDERIZAÇÃO AUTOMÁTICA DA ÁRVORE CÓSMICA */}
                {/* ======================================================== */}
                {[
                  { id: 'distritoBase', nome: 'Distrito Base', aberto: ascensao.distritoBase.aberto, upgrades: ascensao.distritoBase.upgrades, cx: 1000, cy: 450, direcaoUp: 'cima', icone: ascensao.distritoBase.icone },
                  { id: 'distritoRayboom', nome: 'Distrito Rayboom', aberto: ascensao.distritoRayboom.aberto, upgrades: ascensao.distritoRayboom.upgrades, cx: 780, cy: 650, direcaoUp: 'esquerda', icone: ascensao.distritoRayboom.icone },
                  { id: 'distritoAscensao', nome: 'Distrito Ascensão', aberto: ascensao.distritoAscensao.aberto, upgrades: ascensao.distritoAscensao.upgrades, cx: 1220, cy: 650, direcaoUp: 'direita', icone: ascensao.distritoAscensao.icone },
                  { id: 'distritoReliquias', nome: 'Distrito Relíquias', aberto: ascensao.distritoReliquias.aberto, upgrades: ascensao.distritoReliquias.upgrades, cx: 880, cy: 870, direcaoUp: 'baixo-esquerda', icone: ascensao.distritoReliquias.icone },
                  { id: 'distritoOrdem', nome: 'Distrito Ordem', aberto: ascensao.distritoOrdem.aberto, upgrades: ascensao.distritoOrdem.upgrades, cx: 1120, cy: 870, direcaoUp: 'baixo-direita', icone: ascensao.distritoOrdem.icone }
                ].map((distrito) => {

                  return (
                    <div key={distrito.id}>

                      {/* 1. RENDERIZA O CARD DO DISTRITO */}
                      {!distrito.aberto && (
                        <div
                          className="distrito-box item-arvore-dinamico"
                          style={{ top: `${distrito.cy}px`, left: `${distrito.cx}px` }}
                        >
                          <img src={distrito.icone} alt={distrito.nome} className="imagem-distrito-circular" />
                          <span className="legenda-distrito-oculta">{distrito.nome}</span>
                        </div>
                      )}

                      {/* 2. LOOP AUTOMÁTICO DE UPGRADES DO DISTRITO COM PRÉ-REQUISITO E BIFURCAÇÃO */}
                      {!distrito.aberto && distrito.upgrades && distrito.upgrades.map((upgrade, index) => {

                        // 1. CHECAGEM DE PRÉ-REQUISITO:
                        if (upgrade.preRequisito) {
                          const upgradePai = distrito.upgrades.find(up => up.id === upgrade.preRequisito);
                          if (!upgradePai || !upgradePai.comprado) return null;
                        }

                        // O restante do seu código matemático de X, Y e o clique de compra continuam iguaizinhos...
                        const upX = distrito.cx + upgrade.x;
                        const upY = distrito.cy + upgrade.y;

                        // 3. CÁLCULO AUTOMÁTICO DO TAMANHO DA LINHA:
                        // Se for o primeiro item (sem pai), a linha conecta no distrito. 
                        // Se for uma bifurcação, calcula a distância exata até o upgrade pai usando Pitágoras.
                        let tamanhoLinha = 65; // Padrão para o primeiro nodo ligado ao distrito

                        if (upgrade.preRequisito) {
                          const upgradePai = distrito.upgrades.find(up => up.id === upgrade.preRequisito);
                          if (upgradePai) {
                            const dx = upgrade.x - upgradePai.x;
                            const dy = upgrade.y - upgradePai.y;
                            tamanhoLinha = Math.sqrt(dx * dx + dy * dy) - 20; // Deduz o raio da bolinha para não sobrepor
                          }
                        }

                        return (
                          <div
                            key={upgrade.id}
                            className={`upgrade-nodo-dinamico ${upgrade.comprado ? 'adquirido' : ''}`}
                            style={{ top: `${upY}px`, left: `${upX}px` }}
                          >
                            {/* Linha pontilhada cósmica */}
                            <div
                              className="linha-pontilhada-conectar-dinamica"
                              style={{
                                width: `${tamanhoLinha}px`,
                                transform: `rotate(${upgrade.angulo + 180}deg)`,
                                top: '23px',
                                left: '23px'
                              }}
                            />

                            {/* ADICIONADO O ONCLICK AQUI: Compra o upgrade ao clicar na bolinha mística */}
                            <div
                              className="upgrade-icone-circulo"
                              onClick={() => comprarUpgradeAscensao(distrito.id, index)}
                            >
                              {upgrade.icone || '✨'}
                            </div>

                            {/* Tooltip flutuante */}
                            <span className="tooltip-up-cookies">
                              <strong>{upgrade.nome}</strong>
                              <p>{upgrade.descricao}</p>
                              <small>Preço: {upgrade.preco} Prestígio</small>
                            </span>
                          </div>
                        );
                      })}

                    </div>
                  );
                })}

              </div>


              <div className="controles-inferiores-fixos">
                <button className="botao-transcender" onClick={() => setTelaAtual("jogo")}>
                  Transcender
                </button>

              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default App;
