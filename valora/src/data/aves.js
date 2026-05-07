// ============================================================
//  MÓDULO: data/aves.js
//  Catálogo de 5 aves reais — Projeto VALORA
//  Fonte: WikiAves · CBRO 2021 · IUCN 2024 · ICMBio
//  Fotos: enviadas pela equipe VALORA (base64 embutido)
// ============================================================

import { FOTOS } from './fotos.js';

/**
 * @typedef {Object} Ave
 * @property {string} id          - Identificador único
 * @property {string} n           - Nome popular principal
 * @property {string} sci         - Nome científico (binomial)
 * @property {string} nomes       - Outros nomes populares
 * @property {string} img         - Foto em base64 (data:image/jpeg;base64,...)
 * @property {'lc'|'nt'|'vu'|'cr'|'ew'} st - Status IUCN código
 * @property {string} stxt        - Status IUCN texto completo
 * @property {string} bio         - Biomas onde ocorre
 * @property {string} tam         - Tamanho (comprimento)
 * @property {string} peso        - Faixa de peso
 * @property {string} diet        - Tipo de alimentação
 * @property {string} perigo      - Alerta de conservação
 * @property {string} desc        - Descrição completa
 * @property {string} emoji       - Emoji representativo (fallback)
 */

/** @type {Ave[]} */
export const AVES = [
  {
    id: 'arara-azul',
    n: 'Arara-azul',
    sci: 'Anodorhynchus hyacinthinus',
    nomes: 'Também chamada: araruna, arara-hiacinta, arara-preta, arara-jacinto',
    img: FOTOS.arara,
    st: 'vu',
    stxt: 'Vulnerável (IUCN VU)',
    bio: '🌵 Pantanal · Cerrado · Amazônia',
    tam: '95–100 cm',
    peso: '1,2–1,7 kg',
    diet: 'Granívoro — castanhas de acuri e bocaiúva',
    perigo: '🔴 VULNERÁVEL (IUCN VU). Ameaçada pela perda de habitat (desmatamento de palmeirais) e tráfico ilegal. Nos anos 1980 restavam apenas ~2.500 indivíduos. O Instituto Arara Azul elevou a população para mais de 6.500 atualmente.',
    desc: 'O maior psitacídeo do mundo, com plumagem azul-cobalto intensa e bico forte adaptado para partir castanhas duras. Ave de grande porte encontrada principalmente no Pantanal e Cerrado brasileiro. Casais são fiéis por toda a vida e compartilham os cuidados com os filhotes. Listada no Anexo I da CITES.',
    emoji: '💙',
  },
  {
    id: 'beija-flor',
    n: 'Beija-flor-tesoura',
    sci: 'Eupetomena macroura',
    nomes: 'Também chamado: tesourinha, beija-flor-de-rabo-forcado',
    img: FOTOS.beija,
    st: 'lc',
    stxt: 'Pouco Preocupante (IUCN LC)',
    bio: '🌺 Cerrado · Mata Atlântica',
    tam: '16–18 cm',
    peso: '7–9 g',
    diet: 'Nectarívoro — néctar de flores e pequenos insetos',
    perigo: '⚠️ POUCO PREOCUPANTE. Algumas espécies sofrem com desmatamento e perda de habitat. Bate as asas até 40 vezes por segundo — qualquer alteração nas plantas com néctar impacta diretamente sua sobrevivência.',
    desc: 'Pequena ave conhecida pela velocidade das asas e capacidade única de pairar no ar. Alimenta-se principalmente de néctar das flores, sendo polinizador essencial de centenas de plantas nativas. Consome o equivalente ao próprio peso em néctar por dia. Pode voar para trás — comportamento único entre as aves.',
    emoji: '🌺',
  },
  {
    id: 'pomba-galega',
    n: 'Pomba-galega',
    sci: 'Patagioenas speciosa',
    nomes: 'Também chamada: pomba-trocal, pomba-do-campo, pomba-verdadeira',
    img: FOTOS.pomba,
    st: 'lc',
    stxt: 'Pouco Preocupante (IUCN LC)',
    bio: '🌳 Mata Atlântica · Cerrado · Áreas urbanas',
    tam: '28–35 cm',
    peso: '150–300 g',
    diet: 'Granívoro — sementes, pequenos grãos e frutos',
    perigo: '⚠️ POUCO PREOCUPANTE. Não apresenta risco elevado de extinção atualmente. Altamente adaptada a ambientes urbanos e rurais. Espécie oportunista que se beneficiou da expansão agrícola.',
    desc: 'Ave comum em áreas urbanas e rurais, conhecida pela excepcional capacidade de adaptação em diferentes ambientes. Alimenta-se de sementes e pequenos grãos. Constrói ninhos simples em arbustos e árvores. Sua voz característica é um dos sons mais familiares do campo brasileiro.',
    emoji: '🕊️',
  },
  {
    id: 'gaviao-pombo',
    n: 'Gavião-pombo-pequeno',
    sci: 'Leucopternis lacernulatus',
    nomes: 'Também chamado: gavião-pombo, gavião-branco, gavião-de-manto',
    img: FOTOS.gaviao,
    st: 'lc',
    stxt: 'Pouco Preocupante (IUCN LC)',
    bio: '🌳 Mata Atlântica · Florestas tropicais',
    tam: '38–46 cm',
    peso: '350–550 g',
    diet: 'Carnívoro — pequenos pássaros, mamíferos e répteis',
    perigo: '⚠️ POUCO PREOCUPANTE, porém sofre com a destruição contínua das florestas brasileiras. Depende de áreas florestadas extensas para caça e nidificação. O desmatamento da Mata Atlântica reduz progressivamente seu habitat.',
    desc: 'Ave de rapina encontrada em áreas de mata densa. Possui voo rápido e excelente visão, capturando principalmente pequenos pássaros e mamíferos no interior da floresta. Pertence ao grupo dos gaviões-pombos, especialistas em áreas florestadas. Utiliza a floresta como cobertura para emboscadas.',
    emoji: '🦅',
  },
  {
    id: 'tangara',
    n: 'Tangará-dançarino',
    sci: 'Chiroxiphia caudata',
    nomes: 'Também chamado: dançador, tangará-do-sul, tangará-de-rabo-de-arame',
    img: FOTOS.tainara,
    st: 'lc',
    stxt: 'Pouco Preocupante (IUCN LC)',
    bio: '🌳 Mata Atlântica · Florestas tropicais',
    tam: '13–14 cm',
    peso: '17–19 g',
    diet: 'Frugívoro — pequenos frutos e artrópodes',
    perigo: '⚠️ POUCO PREOCUPANTE, porém algumas espécies do grupo sofrem com a perda da Mata Atlântica. Espécie endêmica que depende do interior florestal — não sobrevive em bordas ou fragmentos pequenos.',
    desc: 'Pequena ave colorida muito conhecida pelas danças de acasalamento elaboradas. Vive principalmente em regiões de Mata Atlântica e florestas tropicais. Os machos realizam danças colaborativas sincronizadas em "lek" para atrair fêmeas. Endêmico da Mata Atlântica do sul do Brasil.',
    emoji: '💃',
  },
];

/**
 * Retorna classe CSS do badge de status IUCN
 * @param {'lc'|'nt'|'vu'|'cr'|'ew'} st
 * @returns {string}
 */
export function statusClass(st) {
  const map = { lc: 's-lc', nt: 's-nt', vu: 's-vu', cr: 's-cr', ew: 's-ew' };
  return map[st] || 's-lc';
}

/**
 * Retorna emoji de status IUCN
 * @param {'lc'|'nt'|'vu'|'cr'|'ew'} st
 * @returns {string}
 */
export function statusEmoji(st) {
  const map = { lc: '🟢', nt: '🟡', vu: '🟡', cr: '🔴', ew: '🔴' };
  return map[st] || '🟢';
}

/**
 * Retorna cor de fundo para badge de status
 * @param {'lc'|'nt'|'vu'|'cr'|'ew'} st
 * @returns {string}
 */
export function statusBg(st) {
  const map = {
    lc: 'rgba(34,136,68,.18)',
    nt: 'rgba(184,144,46,.18)',
    vu: 'rgba(184,144,46,.18)',
    cr: 'rgba(176,48,32,.18)',
    ew: 'rgba(100,0,0,.20)',
  };
  return map[st] || 'rgba(34,136,68,.18)';
}

/**
 * Retorna cor de texto para badge de status
 * @param {'lc'|'nt'|'vu'|'cr'|'ew'} st
 * @returns {string}
 */
export function statusTc(st) {
  const map = {
    lc: '#1a6630',
    nt: '#7a5a10',
    vu: '#7a5a10',
    cr: '#7a2010',
    ew: '#600000',
  };
  return map[st] || '#1a6630';
}
