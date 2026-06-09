import logo from './logo.svg';
import './App.css';
import { useState, useEffect, useRef } from 'react';
import dado from './d4.png';
import dodo from './dodo.png';
import { motion, useAnimation} from 'framer-motion';


function App() {
  const b_novato = 0.5;
  const b_guerreiro = 1;
  const b_arqueiro = 2;
  const b_mago = 5;
  const b_druida = 10;
  
  const [contagem, setContagem] = useState(0); // total de dados
  const [DPS, setDps] = useState(0); // total de Dados por segundo Dps
  const [click, setClick] = useState(1); // clic
  const [preco, setPreco] = useState(15);// preco
  const [construcoes, setConstrucoes] = useState([ //CONSTRUCOES
  {nome: "Novato", preco: 15, dps: b_novato,  quantidade: 0, icone: dodo},
  {nome: "Guerreiro", preco: 100,dps: b_guerreiro,  quantidade: 0, icone: dodo},
  {nome: "Arqueiro", preco: 1000,dps: b_arqueiro,  quantidade: 0, icone: dodo},
  {nome: "Mago", preco: 2000,dps: b_mago,  quantidade: 0, icone: dodo},
  {nome: "Druida", preco: 5000,dps: b_druida,  quantidade: 0, icone: dodo},
  ]);

    //lista de upgrades
    const [upgrade, setUpgrade] = useState([
    {nome: "Afiação" , preco:"10" , efeito:"duplicarClick" , comprado: false , id: "click1"},
    {nome: "Mochila de Equipamentos" , preco:"10" , efeito:"duplicarDado" , comprado: false , id: "dados1"},
    {nome: "Espada Nova", preco:"10" , efeito:"duplicarDado" , comprado: false, id: "dados2"}
    ])
  


  //os numeros que surgem do cookie
  const [numeirinhos, setNumeirinhos] = useState([]);

  function contarDado(){
    setContagem(contagem + click);

  }
  // ===================================== SAVES=================================== ARRUMAR AQUI
  // Referencias
  const contagemRef = useRef(contagem);
  const clickRef = useRef(click);
  const construcoesRef = useRef(construcoes);
  const upgradeRef = useRef(upgrade);

  // Sincronia de referencias
  useEffect(() => { contagemRef.current = contagem;}, [contagem]);
  useEffect(() => { clickRef.current = click;}, [click]);
  useEffect(() => { construcoesRef.current = construcoes;}, [construcoes]);
  useEffect(() => { upgradeRef.current = upgrade}, [upgrade]);
  

  //SAVES
  useEffect(()=> {
    const autoSave = setInterval (() => {
      const saveData = {
        contagem: contagemRef.current,
        click: clickRef.current,
        construcoes: construcoesRef.current,
        upgrade: upgradeRef.current,
      };
      localStorage.setItem("QuickSave", JSON.stringify(saveData));
      console.log(saveData);
    }, 60000);
    return () => clearInterval(autoSave);
  }, []);


  useEffect(() => {
    const salvamento = localStorage.getItem("QuickSave")
    
    if(salvamento){
      const dadosS = JSON.parse(salvamento); 

      setContagem(dadosS.contagem ?? 0);
      setClick(dadosS.click ?? []);
      setConstrucoes(dadosS.construcoes ?? []);
      setUpgrade(dadosS.upgrade ?? []);
    }  
  }, [])

  function exportarSave(){
    const saveData = {
      contagem: contagemRef.current,
        click: clickRef.current,
        construcoes: construcoesRef.current,
        upgrade: upgradeRef.current,
    }
    const saveTexto = JSON.stringify(saveData);

    const saveEncriptado = encodeURIComponent(saveTexto)

    navigator.clipboard.writeText(saveEncriptado).catch(() => {});
 
    alert("Salvamento copiado");
  }

  function importarSave(){
    const inputImportar = prompt("Coloque o save Abaixo:");

    const decodeSave = decodeURIComponent(inputImportar);

    try{
      const dadosS = JSON.parse(decodeSave); 

      setContagem(dadosS.contagem ?? 0);
      setClick(dadosS.click ?? []);
      setConstrucoes(dadosS.construcoes ?? []);
      setUpgrade(dadosS.upgrade ?? []);

    } catch {
      alert("Erro ao carregar o save");
    }


  }

  // =====================================EFEITO DE UPGRADES==========================================

    


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
          if(c.nome === "Novato"){
          return { ...c, dps: novoDado}
          }
          return c;
        })
      )

    }, [upgrade])
    
   

  // TEMPO DO JOGO
  useEffect(() =>{
    const timer = setInterval(() =>{
      const producao = construcoes.reduce((soma, c) => soma + c.dps * c.quantidade, 0)
      setDps(producao);
      setContagem((atual) => atual + producao/10);
    }, 100); //a cada 1 segundo roda aqui
    return() => clearInterval(timer);//limpa o timer
  }, [construcoes]);



function comprarUpgrade(indice) {
    setUpgrade((anterior) => {
      const novo = anterior.map((u, i) => { 
        if (contagem >= u.preco && i === indice && !u.comprado) {
          setContagem(contagem - u.preco);
          
          return  {
            ...u,
            comprado: true
          };
        }
        return u;
      });
      return novo
    });
  };
 


  function comprarConstrucao(indice) {
    setConstrucoes((anterior) => {
      const novo = anterior.map((c, i) => { 
        if (contagem >= c.preco && i == indice) {
          setContagem(contagem - c.preco);
          return  {
            ...c,
            quantidade: c.quantidade+1,
            preco: Math.floor(c.preco*1.2)
          }
        }
        return c;
      });
      return novo
    });
  };
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
      setNumeirinhos((prev) => [...prev, {id,x,y}]);

      //faz a animacao no cookie quando clica
      controls.start({
      scale: [1, 0.9, 1.1, 1], //faz ele aumentar e diminuir
      transition: { duration: 0.3, ease: "easeOut"} // faz ele faer isto em 0.3 segundos
    });
    contarDado(); // conta o dados
    setTimeout(() => {
      setNumeirinhos((prev) => prev.filter((t) => t.id !== id)); // faz os numeirinhos sumirem
    }, 1000) // define para eles ficarem por 1 segundo
    };




// HTML
  return (
    <div className="App">
      <div className="jogo">
        <div class="secao-dado">

          <h1>Dado Clicker</h1>
          <h2>Total de numeros: {Math.floor(contagem)}</h2>
          <h3>DPS: {DPS.toFixed(1)}</h3>
          <motion.img
            id="dadoP"
            src={dado}
            onClick={Clicar}
            animate={controls}
            WhileHover={{
              scale: 1.1,
              filter: "brightness(1.1)",
              transition: {duration: 0.3, repeat: Infinity, repeatType: "reverse"},
            }}

            style={{ width: "400px", cursor: "pointer", borderRadius: "50%", userSelect: "none",}}
          /> 
          
            {numeirinhos.map((text) => (
              <motion.div
                key={text.id}
                initial={{opacity: 1, y: 0}}
                animate={{opacity: 0, y: -50}}
                transition={{ duration: 1, ease: "easeOut"}}
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
                  +{click}
            </motion.div>
          ))}

          <button onClick={exportarSave}>
            Exportar Save
          </button>

          <button onClick={importarSave}>
            Importar Save
          </button>


           <button onClick={() => {
            localStorage.removeItem("QuickSave");
            window.location.reload();
          }}> Resetar </button>



         </div>


      <div class="lado-direito">
        
        <div class="secao-upgrade">
          <h2>Upgrades</h2>
          {upgradeDisponiveis.map((u, i) => 
         <button onClick={() => comprarUpgrade(u.indiceOriginal)} disabled={contagem < u.preco}
            style={{
              opacity: contagem < u.preco ? 0.6 : 1,
              cursor: contagem < u.preco ? "not-allowed" : "pointer",
              marginBottom: "8px",
            }}
         > 
            <img src={u.icone}></img> <br /> 
            {u.nome} <br /> 
            preço: {u.preco} <br />
            Quantidade: {u.quantidade} <br />
          </button>
          )}
        </div>
   
        <div class="secao-construcao">
          <h2>Construções</h2>
          {construcoes.map((c, i) => 
         <button onClick={() => comprarConstrucao(i)}> 
            <img src={c.icone}></img> <br /> 
            {c.nome} <br /> 
            preço: {c.preco} <br />
            Quantidade: {c.quantidade} <br />
          </button>
          )}
        </div>
      </div>
      

    </div>
    </div>
  );
}

export default App;
