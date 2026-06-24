



export function checkConquista(conquista, state) {
  if (!state || !state.construcoes) return false;
  if (conquista.check) return conquista.check(state);

  switch (conquista.tipo) {
    case 'contagemTotal':
      return state.contagemTotal >= conquista.quantidade;
    case 'dps':
      return state.DPS >= conquista.quantidade;
    case 'construcao':
      return (state.construcoes?.find(c => c.nome === conquista.parametro?.nome)?.quantidade ?? 0) >= conquista.quantidade;
    case 'valorClick':
      return state.click >= conquista.quantidade;
    default:
      return false;
  }
}

// 2. Função pura que analisa toda a lista de conquistas e devolve apenas as recém-conquistadas
export function obterNovasConquistas(listaConquistas, jogoEstado) {
  return listaConquistas.filter(c => !c.obtido && checkConquista(c, jogoEstado));
}