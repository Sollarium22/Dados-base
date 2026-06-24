//UTILITARIOS PARA ORGANIZAR MELHOR

import { useState } from "react";
// FORMATAR NUMERO
 export function formatarNumero(num) {
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

// AVISOS



// AVISOS PERSISTENTEs

export function useAvisosPersistentes() {
  const [avisosPersistentes, setAvisosPersistentes] = useState([]);

  function mostrarAvisoPersistente(texto, icone = null) {
    setAvisosPersistentes(prev => [
      ...prev, 
      { texto, icone, id: Date.now() + Math.random() }
    ]);
  }

  function fecharAvisoPersistente(id) {
    setAvisosPersistentes(prev => prev.filter(a => a.id !== id));
  }

  function limparAvisosPersistentes() {
    setAvisosPersistentes([]);
  }

  // Retorna o estado e as funções para que o seu App.js possa usá-los
  return {
    avisosPersistentes,
    mostrarAvisoPersistente,
    fecharAvisoPersistente,
    limparAvisosPersistentes
  };
}

export function useMostrarAviso(){
  const[aviso, setAviso] = useState([]);

  function mostrarAviso(texto){
    setAviso({texto, id: Date.now()})
  }
  return {
    mostrarAviso,
  }
}
