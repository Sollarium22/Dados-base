import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import dado from './d4.png'
import dodo from './dodo.png'


function App() {

  const [contagem, setContagem] = useState(0); // total de dados
  const [DPS, setDps] = useState(0); // total de Dados por segundo Dps
  const [preco, setPreco] = useState(15);// preco
  const [construcoes, setConstrucoes] = useState([
  {nome: "dado", preco: 15, dps: 0.2,  quantidade: 0, icone: dodo},
  {nome: "jogador", preco: 100,dps: 1,  quantidade: 0, icone: dodo},
  {nome: "mestre", preco: 1000,dps: 5,  quantidade: 0, icone: dodo}
  ]
 
  )

  function contarDado(){
    setContagem(contagem + 1);

  }

  useEffect(() =>{
    const timer = setInterval(() =>{
      const producao = construcoes.reduce((soma, c) => soma + c.dps * c.quantidade, 0)
      setDps(producao);
      setContagem((atual) => atual + producao/10);
    }, 100); //a cada 1 segundo roda aqui
    return() => clearInterval(timer);//limpa o timer
  }, [construcoes]);

  function comprarConstrucao(indice) {
    setConstrucoes((anterior) =>
      anterior.map((c, i) => {
        if (contagem >= c.preco && i == indice) {
          setContagem(contagem - c.preco);
          return  {
            ...c,
            quantidade: c.quantidade+1,
            preco: Math.floor(c.preco*1.2)
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
        <h2>Total de numeros: {Math.floor(contagem)}</h2>
        <h3>DPS: {DPS.toFixed(1)}</h3>
        <button id="dado" onClick={contarDado}><img src={dado} className="App-logo" alt="logo"style={{cursor: "pointer"}}/> </button>
         
      </header>
   
    <div class="menu-lateral">
        <button id="nerd" onClick={comprarConstrucao} style={{cursor: "pointer"}}>Nerd -  preço: {preco}</button>
        
    {construcoes.map((c, i) => 
      <button onClick={() => comprarConstrucao(i)}> <img src={c.icone}></img> {c.nome} preço: {c.preco} Quantidade: {c.quantidade} </button>
    )}
    
    </div>

    </div>
  );
}

export default App;
