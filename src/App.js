import logo from './logo.svg';
import './App.css';
import { useState, useEffect, useRef, version } from 'react';
import dado from './d20.png';
import dodo from './dodo.png';
import { motion, PresenceContext, useAnimation } from 'framer-motion';
import { VERSAO_ATUAL, DEFAULT_SAVE, processarSave } from './Versionamento';

// ICONS

import galho from './galho.png';
import espada from './espada.png';
import arco from './arco.png';
import cajado from './cajado.png';
import pata from './pata.png';

//Icons dados


function App() {
  const b_novato = 0.5;
  const b_guerreiro = 1;
  const b_mago = 50000;
  const b_medico = 15;


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


 
  const [preco, setPreco] = useState(15);// preco
  const DEFAULT_CONSTRUCOES = [
    { nome: "Novato", preco: 15, dps: b_novato, quantidade: 0, icone: galho, descricao: "Ele...era...o FrostBite...", assin: "- Chris...pré depressão" },
    { nome: "Guerreiro", preco: 100, dps: b_guerreiro, quantidade: 0, icone: espada, descricao: "Um Guerreiro nao muito habilidoso...bem...ele sabe usar a espada pra fazer um churrasco" },
    { nome: "Mago", preco: 10, dps: b_mago, quantidade: 0, icone: cajado, descricao: "Um Mago que se gaba de poder lançar magia sem ter que ler nada...só ignoremos o fato dele saber só 1 magia...envelhecer vinhos" },
    { nome: "Medico de Campo", preco: 2000, dps: b_medico, quantidade: 0, icone: cajado, descricao: "ENTÃO SÓ SE MATA", assin: "- Leandrinho do Grau" },
    { nome: "Pugilista", preco: 2000, dps: b_mago, quantidade: 0, icone: cajado, descricao: "VEM PRA CIMA, EU TANKO", assin: "- Jurandir  (spoiler, ele nao tanka)" },
    //{ nome: "Lo testador", preco: 10000000000000000, dps: 101000000000, quantidade: 0, icone: dado, descricao:"ABSOLUTA", assin: "SIM"}, 
  ]

  const DEFAULT_MELHORIAS = [
    { nome: "Afiação", preco: "10", efeito: "duplicarClick", comprado: false, id: "click1", icone: dodo, descricao: "Uma pedra de amolar fodasse para vc só usar pra ajudar um pouco" },
    { nome: "Mochila de Equipamentos", preco: "10", efeito: "duplicarDado", comprado: false, id: "dados1", icone: dodo },
    { nome: "Espada Nova", preco: "10", efeito: "duplicarDado", comprado: false, id: "dados2", icone: dodo }
  ] 

  // FUNCAO PARA CALCULAR O PRECO ATUAL DE CADA CONSTRUCAO

  function getPrecoAtual(precoBase, quantidade){
    return Math.floor(precoBase * Math.pow(1.2, quantidade));
  }

  //tudo
  const [contagem, setContagem] = useState(0); // total de dados
  const [DPS, setDps] = useState(0); // total de Dados por segundo Dps
  const [click, setClick] = useState(1); // clic
  const [construcoes, setConstrucoes] = useState(DEFAULT_CONSTRUCOES);
  const [upgrade, setUpgrade] = useState(DEFAULT_MELHORIAS);

  const [contagemTotal, setContagemTotal] = useState(0)// TODOS JA CONSEGUIDOS
  // =============================SIMPLIFICADOR DE NUMEROS================================
  function formatarNumero(num) {
    if (num < 1000000) return Math.floor(num).toLocaleString('pt-BR'); // Mantém normal até 999.999

    // Sufixos no plural e no singular emparelhados por índice
    const sufixosPlural = ["", " Mil", " Milhões", " Bilhões", " Trilhões", " Quatrilhões", " Quintilhões", " Sextilhões"];
    const sufixosSingular = ["", " Mil", " Milhão", " Bilhão", " Trilhão", " Quatrilhão", " Quintilhão", " Sextilhão"];

    // Encontra a "casa" do número (2 = milhão, 3 = bilhão, etc.)
    const i = Math.floor(Math.log10(num) / 3);

    // Calcula o valor reduzido (ex: 1.250.000 vira 1.25)
    const valorReduzido = num / Math.pow(10, i * 3);

    // Se a parte inteira do número for exatamente 1, usa o singular. Caso contrário, plural.
    const sufixoCorreto = Math.floor(valorReduzido) === 1 ? sufixosSingular[i] : sufixosPlural[i];

    // Retorna com 3 casas decimais e o sufixo correto
    return valorReduzido.toFixed(3) + sufixoCorreto;
  }

  // ============================MINIGAMES==================================
  const [vinho, setVinho] = useState({
    desbloqueado: false,
    level: 1,
    creditos: 0,
    mercado: 1
  })

  useEffect(() => {
    const vinheiro = construcoes.find(c => c.nome === "Mago");
    if (vinheiro && vinheiro.quantidade >= 1) {
      setVinho(prev =>
        prev.desbloqueado ? prev : { ...prev, desbloqueado: true }

      );

    }
  }, [construcoes])

    // ------------------------------------ASCENCAO--------------------------------------
  const [ascensao, setAscensao] = useState({
    desbloqueado: true,
    prestigio: 0
  })

  const [telaAtual, setTelaAtual] = useState("jogo"); //Telas: jogo, ascensao, conquistas

  

//------------------------------------------------------------------------------------------
  //os numeros que surgem do cookie
  const [numeirinhos, setNumeirinhos] = useState([]);
  const [HistoricoVinho, setHistoricoVinho] = useState([]);

  function contarDado() {
    setContagem((anterior) => anterior + clickRef.current);
    setContagemTotal((anterior) => anterior + clickRef.current);
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

      } catch (e){
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
        construcoes: construcoesRef.current.map(c => ({nome: c.nome, quantidade: c.quantidade})),
        upgrade: upgradeRef.current.map(u => ({ id: u.id, comprado: u.comprado}))  
      };
      localStorage.setItem("QuickSave", JSON.stringify(saveData));
      console.log(saveData);
    }, 1000);
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
      construcoes: construcoesRef.current.map(c => ({nome: c.nome, quantidade: c.quantidade})),
      upgrade: upgradeRef.current.map(u => ({ id: u.id, comprado: u.comprado})) 
    }
    const saveTexto = JSON.stringify(saveData);

    const saveEncriptado = encodeURIComponent(saveTexto)

    navigator.clipboard.writeText(saveEncriptado)
    .then(() => alert("Salvamento copiado com sucesso!"))
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

      setContagem(saveSeguro.contagem );
      setContagemTotal(saveSeguro.contagemTotal );
      setClick(saveSeguro.click );
      setConstrucoes(saveSeguro.construcoes );
      setUpgrade(saveSeguro.upgrade );
      setVinho(saveSeguro.vinho);
      setAscensao(saveSeguro.ascensao);

    } catch {
      alert("Erro ao carregar o save");
    }

  }

  // =====================================EFEITO DE UPGRADES/COMPRAS==========================================

  useEffect(() => {

    //Multiplicadores comparar quantos tem
    const multiplicador = upgrade.filter(u => u.efeito === "duplicarClick" && u.comprado).length;
    const mult_dado = upgrade.filter(u => u.efeito === "duplicarDado" && u.comprado).length;

    // calculo de multiplicador
    const novoClick = 1 * (2 ** multiplicador);
    const novoDado = b_novato * (2 ** mult_dado);
    setClick(novoClick);



    setConstrucoes((anterior) =>
      anterior.map((c) => {
        if (c.nome === "Novato") {
          return { ...c, dps: novoDado }
        }
        return c;
      })
    )

  }, [upgrade])


  // TEMPO DO JOGO
  useEffect(() => {
    const timer = setInterval(() => {
      const producao = construcoes.reduce((soma, c) => soma + c.dps * c.quantidade, 0)
      setDps(producao);
      setContagem((atual) => atual + producao / 10);
      setContagemTotal((atual) => atual + producao / 10);
    }, 100); //a cada 1 segundo roda aqui
    return () => clearInterval(timer);//limpa o timer
  }, [construcoes]);


  function comprarUpgrade(indice) {
    setUpgrade((anterior) => {
      const novo = anterior.map((u, i) => {
        if (contagem >= u.preco && i === indice && !u.comprado) {
          setContagem(contagem - u.preco);

          return {
            ...u,
            comprado: true
          };
        }
        return u;
      });
      return novo
    });
  };

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

      const mudanca = (Math.random() - 0.5)*0.2;
      let novoMercado = vinho.mercado + mudanca;

      novoMercado = Math.max(0.01, Math.min(100, novoMercado))

      setVinho(prev => {

        return {
          ...prev,
          mercado: Number(novoMercado.toFixed(2))
        }})

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

    const color = dados[dados.length -1] >= dados[dados.length-2] ? "#4caf50" : "#f44336";


    const points = dados.map((value, i) => ({
      x: (i / (dados.length - 1)) * width,
      y: height - ((value - min) / range) * height,
     value
    }));

    const labels = [
      { value: max, y: 12 },
      { value: (max+min) / 2, y: height / 2},
      { value: min, y: height-4}
    ]

    return (
      <svg width={width + 40 } height={height} style={{ background: "white", borderRadius: 6 }}>

        {labels.map((l,i) => (
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

        {points.slice(1).map((p,i) => {
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

  // ASCENCAO PARTE 2

  const PRIMEIRO_PRESTIGIO = 1_000_000;

  function calcularPrestigio(c) {
    return Math.floor(Math.sqrt(c / PRIMEIRO_PRESTIGIO));
  }

  const prestigioPossivel = calcularPrestigio(contagemTotal);

  // BARRA DE PROGRESSO:

  const contagemAtual = contagemTotal;
  const contagemPrestigioAtual = PRIMEIRO_PRESTIGIO * (prestigioPossivel ** 2);
  const contagemProximoPrestigio = PRIMEIRO_PRESTIGIO * ((prestigioPossivel + 1) ** 2);

  const progresso = (contagemAtual - contagemPrestigioAtual) / (contagemProximoPrestigio - contagemPrestigioAtual);
  const progressoPorcentagem = Math.min(Math.max(progresso, 0), 1);


  //================================== BASE DE UPGRADES ==================
  const contagemDado = construcoes.find((c) => c.nome === "Novato")?.quantidade || 0;
  //APARECER UPRGADES
  const upgradeDisponiveis = upgrade.
    map((u, i) => ({ ...u, indiceOriginal: i }))
    .filter(u => {
      if (u.comprado) return false;

      if (u.id === "click1" && contagem < 10) return false;
      if (u.id === "dados1" && contagemDado < 1) return false;
      if (u.id === "dados2" && contagemDado < 10) return false;

      return true;
    });

  //lista de comprados:
  const upgradeComprados = upgrade.filter((u) => u.comprado)

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
 

  // =============================================HTML=========================================
  return (
    <div className="App">
      <div className="jogo">
        <div class="lado-esquerdo">

          
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
              <GraficoVinho dados={HistoricoVinho} /> <br/>

              <button onClick={venderVinho}>
                Vender Vinho
              </button>
            </div>
          )}

          {telaAtual === "jogo" && (
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
                  style={{ width: `${progressoPorcentagem * 100}%`}}/> 
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
          {telaAtual === "ascensao" && (
             <div className='secao-ascensao'>
              <h2>Pilares da Criação</h2> 
              <p> Os pilares observam </p>


              <button className='portao-ascensao'
                onClick={() => setTelaAtual("jogo")}>
                Sair nos pilares
              </button>
            </div>
          )}

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
        <strong>0</strong>
      </div>

    </div>
  </div>
)}

        </div>
      
     
     


        {/* DADO*/ }
      {telaAtual == "jogo" && (
        
        <div class="secao-dado">

          <h1>Buxas Clicker</h1>
          <h2>Total de numeros: {formatarNumero(contagem)}</h2>
          <h2>Total REAL DE DAOS: {formatarNumero(contagemTotal)}</h2>
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


        </div>
      
      )}

      {telaAtual === "jogo" && (

        <div class="lado-direito">

          <div className="secao-upgrade">
            <h2>Upgrades</h2>
            {upgradeDisponiveis.map((u, i) => (
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
                preço: {formatarNumero(c.preco)} <br />
                Quantidade: {c.quantidade} <br />
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

    </div>
  );
}

export default App;
