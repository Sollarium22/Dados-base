import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import dado from './d4.png'
import dodo from './dodo.png'


function App() {

  const [contagem, setContagem] = useState(1010); // total de dados
  const [DPS, setDps] = useState(0); // total de Dados por segundo Dps
  const [click, setClick] = useState(1); // clic
  const [preco, setPreco] = useState(15);// preco
  const [construcoes, setConstrucoes] = useState([
  {nome: "Dado", preco: 15, dps: 0.5,  quantidade: 0, icone: dodo},
  {nome: "jogador", preco: 100,dps: 1,  quantidade: 0, icone: dodo},
  {nome: "mesa", preco: 100,dps: 1,  quantidade: 0, icone: dodo},
  {nome: "mestre", preco: 1000,dps: 5,  quantidade: 0, icone: dodo}
  ]);

  const [upgrade, setUpgrade] = useState([
    {nome: "Resina" , preco:"10" , efeito:"duplicarClick" , comprado: false , id: "click1"},
    {nome: "Dados metalicos" , preco:"10" , efeito:"duplicarDado" , comprado: false , id: "dados1"},
    {nome: "Dados Cromados", preco:"10" , efeito:"duplicarDado" , comprado: false, id: "dados2"}

  ])

  function contarDado(){
    setContagem(contagem + click);

  }

  // EFEITO DE UPGRADES
    useEffect(() => {
      const multiplicador = upgrade.filter(u => u.efeito === "duplicarClick" && u.comprado).length;
      const novoClick = 1 * (2 ** multiplicador);
      setClick(novoClick);

      const mult_dado = upgrade.filter(u => u.efeito === "duplicarDado" && u.comprado).length;
      const novoDado = 0.5 * (2 ** mult_dado);
      setConstrucoes((anterior) =>
        anterior.map((c) => {
          if(c.nome === "Dado"){
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

    const contagemDado = construcoes.find((c) => c.nome === "Dado")?.quantidade || 0;
    //APARECER UPRGADES
    const upgradeDisponiveis = upgrade.
    map((u, i) => ({ ...u, indiceOriginal: i }))
    .filter(u => {
      if (u.comprado) return false;

      if (u.id === "click1" && contagem < 100) return false;
      if (u.id === "dados1" && contagemDado < 1) return false;
      if (u.id === "dados2" && contagemDado < 10) return false;

      return true;
    });

     //lista de comprados:
    const upgradeComprados = upgrade.filter((u) => u.comprado)




  return (
    <div className="App">
      <div className="jogo">
        <div class="secao-dado">
          <h1>Dado Clicker</h1>
          <h2>Total de numeros: {Math.floor(contagem)}</h2>
          <h3>DPS: {DPS.toFixed(1)}</h3>
        <button id="dado" onClick={contarDado}><img src={dado} className="App-logo" alt="logo"style={{cursor: "pointer"}}/> </button>
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
