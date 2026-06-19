

// VERSIONAMENTO DE SAVE

export const VERSAO_ATUAL = 1.31;

export const DEFAULT_SAVE = {
    version: VERSAO_ATUAL,
    construcoes: [
        { nome: "Novato", quantidade: 0 },
        { nome: "Guerreiro", quantidade: 0 },
        { nome: "Mago", quantidade: 0 },
        { nome: "Medico de Campo", quantidade: 0 },
        { nome: "Pugilista", quantidade: 0 },
        // { nome: "Lo testador", quantidade: 0 } <---- demonstração
    ],
    upgrade: [
        { id: "click1", comprado: false },
        { id: "dados1", comprado: false },
        { id: "dados2", comprado: false },
        { id: "clickDps1", comprado: false},
        
        //ascensao
        { id: "contagemRay1", comprado: false},
    ],
    vinho: { desbloqueado: false, level: 1, creditos: 0, mercado: 1 },

    ascensao: {
        desbloqueado: false,
        prestigio: 0,
        prestigioTotal: 0,

        distritoBase: {
            aberto: false,
            upgrades: [
                { id: "ascensaodps", comprado: false },
                { id: "upgradeSim", comprado: false },
                { id: "upgradeNao", comprado: false, },
            ]
        },

        distritoAscensao: {
            aberto: false,
            upgrades: [
                { id: "ascensao1", comprado: false,},
                { id: "ascensaoBifurcada1", comprado: false,   },
                {id: "ascensaoBifurcada2", comprado: false, }
            ]
        },
        distritoOrdem: {
            aberto: false,
            upgrades: [
                { id: "ordem1", comprado: false }
            ]
        },
        distritoReliquias: {
            aberto: false,
            upgrades: [
                {  id: "reliquia1",  comprado: false,  }
            ]
        },
        distritoRayboom: {
            aberto: false,
            upgrades: [
                {  id: "rayboom1",comprado: false, }
            ]
        }
    },
};

const migracoes = {
    // Exemplo futuro:
    // 1: (save) => { return { ...save, version: 2, novaPropriedade: 0 } }
    0: (saveAntigo) => {
        console.log("Migrando save da versao 0 para versao 1");

        return {
            ...saveAntigo,
            version: 1,
            //construcoes: construcoesAtualizadas
        }
    },

    1: (saveAntigo) => {
        console.log("Migrando save da versao 1 para versao 1.1");

        // const construcoesAtualizadas = [
        //     ...saveAntigo.construcoes,
        //     { nome: "Lo testador", quantidade: 0 }
        // ]
        return {
            ...saveAntigo,
            version: 1.1,
            //construcoes: construcoesAtualizadas
        }


    },
    1.1: (saveAntigo) => {
        console.log("Migrando save da versao 1.1 para versao 1.2");
        return {
            ...saveAntigo,
            version: 1.2,
            ascensao: { desbloqueado: false, prestigio: 0, prestigioTotal: 0 },
            contagemTotal: 0,
        }
    },
    1.2: (saveAntigo) => {
        console.log("Migrando save da versao 1.2 para versao 1.3")

        const ascensaoAtt1 = {
            ...saveAntigo.ascensao,  //
            //se for garantir que existe: prestigioTotal: saveAntigo.ascensao?.prestigioTotal ?? 0,

            distritoBase: {
                aberto: false,
                upgrades: [
                    { id: "ascensaodps", comprado: false }
                ]
            },

            distritoAscensao: {
                aberto: false,
                upgrades: [
                    { id: "ascensao1", comprado: false }
                ]
            },
            distritoOrdem: {
                aberto: false,
                upgrades: [
                    { id: "ordem1", comprado: false }
                ]
            },
            distritoReliquias: {
                aberto: false,
            },
            distritoRayboom: {
                aberto: false,
            }

        }
        return {
            ...saveAntigo,
            version: 1.3,
            ascensao: ascensaoAtt1
        }
    },
    1.3: (saveAntigo) => {
        console.log("Migrando da versao 1.3 para 1.31")
        const upgradeAtt1 = [
            ...saveAntigo.upgrade,
            { id: "clickDps1", comprado: false},
        
        //ascensao
            { id: "contagemRay1", comprado: false},

        ]

        const ascensaoAtt2 = {
            ...saveAntigo.ascensao,  //
            //se for garantir que existe: prestigioTotal: saveAntigo.ascensao?.prestigioTotal ?? 0,

             distritoBase: {
            aberto: false,
            upgrades: [
                { id: "ascensaodps", comprado: false },
                { id: "upgradeSim", comprado: false },
                { id: "upgradeNao", comprado: false, },
            ]
        },

        distritoAscensao: {
            aberto: false,
            upgrades: [
                { id: "ascensao1", comprado: false,},
                { id: "ascensaoBifurcada1", comprado: false,   },
                {id: "ascensaoBifurcada2", comprado: false, }
            ]
        },
        distritoOrdem: {
            aberto: false,
            upgrades: [
                { id: "ordem1", comprado: false }
            ]
        },
        distritoReliquias: {
            aberto: false,
            upgrades: [
                {  id: "reliquia1",  comprado: false,  }
            ]
        },
        distritoRayboom: {
            aberto: false,
            upgrades: [
                {  id: "rayboom1",comprado: false, }
            ]
        }

        }
        return {
            ...saveAntigo,
            version: 1.31,
            ascensao: ascensaoAtt2,
            upgrade: upgradeAtt1
        }
    }

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
    let iterations = 0;

    // 1. Roda a esteira de migrações passo a passo
    while (currentVersion < VERSAO_ATUAL && iterations < 50) {
        iterations++;

        const migration = migracoes[currentVersion];
        if (!migration) {
            saveCarregado.version = VERSAO_ATUAL;
            break;
        }

        saveCarregado = migration(saveCarregado);
        currentVersion = saveCarregado.version;
    }

    if (iterations >= 50) {
        console.error("Loop de migração detectado e interrompido por segurança!");
        saveCarregado.version = VERSAO_ATUAL; // Força para não travar o jogo
    }

    // 2. Normaliza para evitar problemas com ícones/descrições atualizadas
    return {
        version: VERSAO_ATUAL,
        contagem: saveCarregado.contagem ?? DEFAULT_SAVE.contagem,
        contagemTotal: saveCarregado.contagemTotal ?? DEFAULT_SAVE.contagemTotal,
        click: saveCarregado.click ?? DEFAULT_SAVE.click,
        vinho: { ...DEFAULT_SAVE.vinho, ...saveCarregado.vinho },
        construcoes: normalizeConstrucoes(saveCarregado.construcoes, defaultsConstrucoes),
        upgrade: normalizeUpgrades(saveCarregado.upgrade, defaultsUpgrades),
        ascensao: { ...DEFAULT_SAVE.ascensao, ...saveCarregado.ascensao }
    };
}