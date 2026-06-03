import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import dado from './d4.png'


function App() {

  const [contagem, setContagem] = useState(0); // total de dados
  const [DPS, setDps] = useState(0); // total de Dados por segundo Dps
  const [preco, setPreco] = useState(15);// preco
  const [construcoes, setConstrucoes] = useState([
  {nome: "dado", preco: 15, dps: 0.2,  quantidade: 0},
  {nome: "jogador", preco: 100,dps: 1,  quantidade: 0},
  {nome: "mestre", preco: 1000,dps: 5,  quantidade: 0}
  ]
 
  )

  function contarDado(){
    setContagem(contagem + 1);

  }

  useEffect(() =>{
    const timer = setInterval(() =>{
      setContagem((atual) => atual + DPS)
    }, 1000); //a cada 1 segundo roda aqui
    return() => clearInterval(timer);
  }, [DPS]);

  function comprarConstrucao(indice) {
    setConstrucoes((anterior) =>
      anterior.map((c, i) => {
        if (contagem >= c.preco && i == indice) {
          setContagem(contagem - c.preco);
          return  {
            ...c,
            quantidade: c.quantidade+1,
            preco: Math.floor(preco*1.2)
          }
        }
        return c;
      }
      )
    )
  }



  return (
    <div className="App">
      <header className="App-header">
        <h1>Dado Clicker</h1>
        <h2>Total de numeros: {contagem}</h2>
        <h3>DPS: {DPS}</h3>
        <button id="dado" onClick={contarDado}><img src={dado} className="App-logo" alt="logo"style={{cursor: "pointer"}}/> </button>
         
      </header>
   
    <div class="menu-lateral">
        <button id="nerd" onClick={comprarConstrucao} style={{cursor: "pointer"}}>Nerd -  preço: {preco}</button>
        
    {construcoes.map((c, i) => 
      <button> Comprar {c.nome}
      </button>
    )}
    
    </div>

    </div>
  );
}

export default App;
