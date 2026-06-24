

export function clickPorDps(upgrade, ascensao) {
  let total = 0;

  total += upgrade.filter(m => m.efeito === 'clickDps' && m.comprado).length * 0.02;

  Object.values(ascensao).forEach(distrito => {
    if (!distrito?.upgrades) return;

    distrito.upgrades.forEach(u => {
      if (u.comprado && u.efeito === 'clickDps') {
        total += 0.01;
      }
    });
  });

  return total;
}


export function calcularValorClick(upgrade, ascensao, dpsTotal, buff) {
  // 1. Garante que se o dpsTotal vier quebrado ou undefined, ele vire 0 automaticamente
  const dpsSeguro = dpsTotal || 0;

  const mult_click = upgrade.filter(u => u.efeito === "duplicarClick" && u.comprado).length;
  const clickBaseFinal = 2 ** mult_click;

  const percentual = clickPorDps(upgrade, ascensao);
  
  // 2. Usando a variável segura corrigida
  const bonusPorDps = dpsSeguro * percentual; 

  const clickSemBuff = clickBaseFinal + bonusPorDps;
  
    console.log(percentual)
  const now = Date.now();
  const clickBuff = buff.find(b => b.tipo === "Click" && b.expira > now);

  return clickBuff ? clickSemBuff * clickBuff.mult : clickSemBuff;
}


export function atualizarDanoConstrucoes(upgrade, construcoes, danosBases) {
  const mults = {
    "Novato": upgrade.filter(u => u.efeito === "duplicarDado" && u.comprado).length,
    "Guerreiro": upgrade.filter(u => u.efeito === "duplicarGuerreiro" && u.comprado).length,
    "Ladino": upgrade.filter(u => u.efeito === "duplicarLadino" && u.comprado).length,
    "Bardo": upgrade.filter(u => u.efeito === "duplicarBardo" && u.comprado).length,
    "Paladino": upgrade.filter(u => u.efeito === "duplicarPaladino" && u.comprado).length,
    "Druida": upgrade.filter(u => u.efeito === "duplicarDruida" && u.comprado).length,
    "Caçador": upgrade.filter(u => u.efeito === "duplicarCacador" && u.comprado).length,
    "Necromante": upgrade.filter(u => u.efeito === "duplicarNecromante" && u.comprado).length,
  };

  return construcoes.map((c) => {
    if (mults[c.nome] !== undefined) {
      const dpsBaseOriginal = danosBases[c.nome] || 0;
      const dpsCalculado = dpsBaseOriginal * (2 ** mults[c.nome]);
      return { ...c, dps: dpsCalculado };
    }
    return c;
  });
}

export function obterUpgradesDisponiveis(upgrade, construcoes, contagemTotal, ascensao) {
  const contagemDado = construcoes.find((c) => c.nome === "Novato")?.quantidade || 0;
  const qtdGuerreiro = construcoes.find((c) => c.nome === "Guerreiro")?.quantidade || 0;
  const qtdLadino = construcoes.find((c) => c.nome === "Ladino")?.quantidade || 0;
  const qtdBardo = construcoes.find((c) => c.nome === "Bardo")?.quantidade || 0;
  const qtdPaladino = construcoes.find((c) => c.nome === "Paladino")?.quantidade || 0;
  const qtdDruida = construcoes.find((c) => c.nome === "Druida")?.quantidade || 0;
  const qtdCacador = construcoes.find((c) => c.nome === "Caçador")?.quantidade || 0;
  const qtdNecromante = construcoes.find((c) => c.nome === "Necromante")?.quantidade || 0;

  return upgrade
    .map((u, i) => ({ ...u, indiceOriginal: i }))
    .filter(u => {
      if (u.comprado) return false;

      if (u.id === "click1" && contagemTotal < 10) return false;
      if (u.id === "dados1" && contagemDado < 1) return false;
      if (u.id === "dados2" && contagemDado < 10) return false;
      if (u.id === "guerreiro1" && qtdGuerreiro < 10) return false;

      if (u.id === "up_ladino1" && qtdLadino < 10) return false;
      if (u.id === "up_bardo1" && qtdBardo < 10) return false;
      if (u.id === "up_paladino1" && qtdPaladino < 10) return false;
      if (u.id === "up_druida1" && qtdDruida < 10) return false;
      if (u.id === "up_cacador1" && qtdCacador < 10) return false;
      if (u.id === "up_necro1" && qtdNecromante < 10) return false;

      const caixaRayboomAtivo = ascensao?.distritoRayboom?.upgrades?.some(up => up.id === "rayboom1" && up.comprado);
      if (u.id === "contagemRay1" && !caixaRayboomAtivo) return false;

      return true;
    });
}



export function processarCompraUpgrade(listaUpgrades, indiceOriginal, contagemAtual) {
  const itemAlvo = listaUpgrades[indiceOriginal];
  
  // Se o jogador não tem contagem suficiente ou o item já foi comprado, cancela
  if (!itemAlvo || contagemAtual < itemAlvo.preco || itemAlvo.comprado) {
    return null;
  }

  

  const novaLista = listaUpgrades.map((u, idx) => {
    if (idx === indiceOriginal) {
      return { ...u, comprado: true };
    }
    return u;
  });
  

  return {
    novosUpgrades: novaLista,
    novaContagem: contagemAtual - itemAlvo.preco
  };
}