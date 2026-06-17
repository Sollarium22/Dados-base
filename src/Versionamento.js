

// VERSIONAMENTO DE SAVE

export const VERSAO_ATUAL = 1;

export const DEFAULT_SAVE = {
    version: VERSAO_ATUAL,
    construcoes: [
        { nome: "Novato", quantidade: 0 },
        { nome: "Guerreiro", quantidade: 0 },
        { nome: "Mago", quantidade: 0 },
        { nome: "Medico de Campo", quantidade: 0 },
        { nome: "Pugilista", quantidade: 0 }
    ],
    upgrade: [
        { id: "click1", comprado: false },
        { id: "dados1", comprado: false },
        { id: "dados2", comprado: false }
    ],
        vinho: { desbloqueado: false, level: 1, creditos: 0, mercado: 1 }
};

const migracoes = {
  // Exemplo futuro:
  // 1: (save) => { return { ...save, version: 2, novaPropriedade: 0 } }
};

// Evita bugs: Se você atualizar preços/descrições/ícones no código, 
// o save recupera apenas a quantidade comprada e preserva os novos dados visuais.
function normalizeConstrucoes(saved = [], defaults) {
  return defaults.map(def => {
    const found = saved.find(s => s.nome === def.nome);
    return {
      ...def,
      quantidade: found ? (found.quantidade ?? 0) : 0
      // O preço real deve ser recalculado dinamicamente no jogo baseado na quantidade,
    };
  });
}


function normalizeUpgrades(saved = [], defaults) {
  return defaults.map(def => {
    const found = saved.find(s => s.id === def.id);
    return {
      ...def,
      comprado: found ? (found.comprado ?? false) : false
    };
  });
}

// Junta a lógica de ler o objeto bruto, rodar migrações e normalizar propriedades
export function processarSave(saveCarregado, defaultsConstrucoes, defaultsUpgrades) {
  let currentVersion = saveCarregado.version ?? 0;

  // 1. Roda a esteira de migrações passo a passo
  while (currentVersion < VERSAO_ATUAL) {
    const migration = migracoes[currentVersion];
    if (!migration) {
      // Se não há migração registrada para este ponto, força a atualização do número
      saveCarregado.version = VERSAO_ATUAL;
      break;
    }
    saveCarregado = migration(saveCarregado);
    currentVersion = saveCarregado.version;
  }
  
   // 2. Normaliza para evitar problemas com ícones/descrições atualizadas
  return {
    version: VERSAO_ATUAL,
    contagem: saveCarregado.contagem ?? DEFAULT_SAVE.contagem,
    click: saveCarregado.click ?? DEFAULT_SAVE.click,
    vinho: { ...DEFAULT_SAVE.vinho, ...saveCarregado.vinho },
    construcoes: normalizeConstrucoes(saveCarregado.construcoes, defaultsConstrucoes),
    upgrade: normalizeUpgrades(saveCarregado.upgrade, defaultsUpgrades)
  };
}