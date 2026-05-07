// ============================================================
//  MÓDULO: data/trilhas.js
//  Trilhas ecológicas com quiz — Projeto VALORA
//  3 trilhas · 5 questões cada · 15 questões totais
// ============================================================

import { FOTOS } from './fotos.js';

/**
 * @typedef {Object} Questao
 * @property {string} q    - Enunciado da pergunta
 * @property {string} img  - Foto ilustrativa (base64)
 * @property {string} cap  - Legenda da foto
 * @property {string[]} ops - 4 alternativas (A, B, C, D)
 * @property {number} c    - Índice da alternativa correta (0–3)
 * @property {string} exp  - Explicação após a resposta
 */

/**
 * @typedef {Object} Trilha
 * @property {string}   id    - Identificador único
 * @property {string}   n     - Nome da trilha
 * @property {string}   lv    - Classe de nível: lv-f | lv-m | lv-d
 * @property {string}   lvn   - Nome do nível: Fácil | Médio | Difícil
 * @property {string}   km    - Distância em km
 * @property {string}   t     - Tempo estimado
 * @property {number}   sp    - Nº de espécies de aves observadas
 * @property {string}   foto  - Foto de capa (base64)
 * @property {string}   cap   - Legenda da foto
 * @property {string}   desc  - Descrição da trilha
 * @property {string[]} fatos - Informações práticas
 * @property {number[]} aves  - Índices das aves em AVES[] para mostrar nos chips
 * @property {Questao[]} quiz - 5 questões educativas
 */

/** @type {Trilha[]} */
export const TRILHAS = [
  {
    id: 'cachoeira',
    n: 'Cachoeira das Antas',
    lv: 'lv-f',
    lvn: 'Fácil',
    km: '3,2',
    t: '1h30',
    sp: 12,
    foto: FOTOS.arara,
    cap: 'Mata ciliar e córrego',
    desc: 'Trilha às margens de um córrego pela mata ciliar. Ideal para iniciantes e famílias — a cachoeira ao final é habitat de várias aves aquáticas e anfíbios.',
    fatos: [
      '🌊 Córrego permanente',
      '🌡️ Sombra total',
      '🐸 Anfíbios: 8 sp.',
      '📸 5 pontos de foto',
    ],
    aves: [0, 1, 2, 3],
    quiz: [
      {
        q: 'Qual a principal ameaça à Arara-azul segundo a IUCN?',
        img: FOTOS.arara,
        cap: 'Arara-azul — Anodorhynchus hyacinthinus (VU)',
        ops: [
          'Excesso de chuvas no Pantanal',
          'Tráfico ilegal e perda de habitat de palmeirais',
          'Temperatura muito elevada',
          'Predadores naturais abundantes',
        ],
        c: 1,
        exp: 'A arara-azul sofre principalmente com o tráfico ilegal e a destruição dos palmeirais de acuri e bocaiúva, sua principal fonte de alimento. O Projeto Arara Azul conseguiu elevar a população de ~2.500 para mais de 6.500 indivíduos.',
      },
      {
        q: 'O beija-flor bate as asas aproximadamente quantas vezes por segundo?',
        img: FOTOS.beija,
        cap: 'Beija-flor-tesoura — polinizador essencial',
        ops: [
          '5 a 10 vezes',
          '15 a 20 vezes',
          'Até 40 vezes',
          'Mais de 100 vezes',
        ],
        c: 2,
        exp: 'O beija-flor bate as asas até 40 vezes por segundo, permitindo pairar no ar com precisão enquanto se alimenta de néctar. Essa frequência é tão alta que o bater das asas produz o zumbido característico que dá nome à ave.',
      },
      {
        q: 'O que é "mata ciliar" e por que é protegida por lei?',
        img: FOTOS.pomba,
        cap: 'Pomba-galega em ambiente de mata ciliar',
        ops: [
          'Vegetação ornamental plantada em cidades',
          'Vegetação nativa às margens de rios, protegida pelo Código Florestal',
          'Tipo de alga aquática que purifica rios',
          'Floresta plantada de eucaliptos',
        ],
        c: 1,
        exp: 'Mata ciliar é a vegetação nativa que ocorre naturalmente às margens de rios e córregos. É protegida pelo Código Florestal (Lei 12.651/2012) como Área de Preservação Permanente (APP). Largura varia de 30 a 500 m conforme o tamanho do curso d\'água.',
      },
      {
        q: 'Qual o status de conservação da Arara-azul na classificação IUCN?',
        img: FOTOS.arara,
        cap: 'Badge de status de conservação — IUCN',
        ops: [
          'Pouco Preocupante (LC)',
          'Quase Ameaçado (NT)',
          'Vulnerável (VU)',
          'Criticamente Ameaçado (CR)',
        ],
        c: 2,
        exp: 'A Arara-azul está classificada como Vulnerável (VU) pela IUCN. Embora sua população tenha crescido graças ao trabalho do Instituto Arara Azul, ainda enfrenta ameaças sérias do tráfico e do desmatamento.',
      },
      {
        q: 'Qual ave realiza danças de acasalamento coletivas em "lek" na Mata Atlântica?',
        img: FOTOS.tainara,
        cap: 'Tangará-dançarino — endêmico da Mata Atlântica',
        ops: [
          'Arara-azul',
          'Beija-flor-tesoura',
          'Pomba-galega',
          'Tangará-dançarino',
        ],
        c: 3,
        exp: 'O tangará-dançarino é endêmico da Mata Atlântica. Os machos realizam danças colaborativas sincronizadas em "lek" — arenas de exibição — para atrair as fêmeas. Machos jovens levam anos aprendendo a dançar com machos mais velhos.',
      },
    ],
  },
  {
    id: 'pico',
    n: 'Pico da Onça Pintada',
    lv: 'lv-m',
    lvn: 'Médio',
    km: '7,8',
    t: '4h',
    sp: 28,
    foto: FOTOS.gaviao,
    cap: 'Vista panorâmica — área de aves de rapina',
    desc: 'Trilha de altitude com vistas panorâmicas. Homenagem a registros históricos de onça-pintada. Excelente para observação de gaviões e aves de rapina.',
    fatos: [
      '⛰️ Altitude: 1.240 m',
      '🌧️ Levar capa de chuva',
      '🦅 Raptores: 7 sp.',
      '🧭 GPS recomendado',
    ],
    aves: [3, 4, 0, 1],
    quiz: [
      {
        q: 'O gavião-pombo-pequeno é encontrado principalmente em qual tipo de ambiente?',
        img: FOTOS.gaviao,
        cap: 'Gavião-pombo-pequeno — Leucopternis lacernulatus',
        ops: [
          'Ambientes urbanos e praças',
          'Áreas de mata densa e florestas tropicais',
          'Praias e litoral',
          'Campos abertos e pastagens',
        ],
        c: 1,
        exp: 'O gavião-pombo-pequeno habita principalmente áreas de mata densa. Utiliza a cobertura florestal para emboscadas e caça de pequenos pássaros e mamíferos. É dependente de florestas contínuas e extensas para sua sobrevivência.',
      },
      {
        q: 'O tangará-dançarino pertence a qual bioma brasileiro?',
        img: FOTOS.tainara,
        cap: 'Tangará-dançarino — espécie endêmica',
        ops: [
          'Amazônia',
          'Pantanal',
          'Mata Atlântica',
          'Caatinga',
        ],
        c: 2,
        exp: 'O tangará-dançarino é endêmico da Mata Atlântica — bioma que hoje possui apenas 12 a 16% de sua cobertura original. Por isso, a conservação de espécies endêmicas como o tangará depende diretamente da preservação dos fragmentos florestais restantes.',
      },
      {
        q: 'O que significa "espécie endêmica"?',
        img: FOTOS.tainara,
        cap: 'Tangará — exemplo de espécie endêmica',
        ops: [
          'Espécie muito abundante e comum',
          'Espécie introduzida por humanos',
          'Espécie que ocorre exclusivamente em uma região geográfica',
          'Espécie migratória que viaja longas distâncias',
        ],
        c: 2,
        exp: 'Espécie endêmica é aquela que ocorre naturalmente apenas em uma região geográfica específica. Destruir o habitat único de uma espécie endêmica leva inevitavelmente à extinção global da espécie. O Brasil possui mais de 750 espécies de aves endêmicas!',
      },
      {
        q: 'Qual o principal impacto do desmatamento sobre as aves de rapina florestais?',
        img: FOTOS.gaviao,
        cap: 'Habitat florestal — essencial para gaviões',
        ops: [
          'Aumenta a disponibilidade de alimento',
          'Reduz o território disponível para caça e nidificação',
          'Não tem impacto significativo',
          'Melhora a visibilidade para caça',
        ],
        c: 1,
        exp: 'O desmatamento reduz drasticamente o território disponível para caça e nidificação das aves de rapina florestais, fragmentando populações e ameaçando a sobrevivência das espécies. Gaviões florestais precisam de extensas áreas de mata contínua.',
      },
      {
        q: 'Ao avistar uma ave rara durante uma trilha, qual é a atitude correta?',
        img: FOTOS.gaviao,
        cap: 'Birdwatching ético — observação à distância',
        ops: [
          'Aproximar-se ao máximo para fotografar com mais detalhes',
          'Observar com binóculos à distância segura sem perturbar',
          'Fazer barulho para que a ave se movimente',
          'Capturar o animal para identificação próxima',
        ],
        c: 1,
        exp: 'A observação ética de aves exige distância segura, movimentos suaves e silêncio. Perturbação pode fazer a ave abandonar o ninho ou filhotes, causando danos sérios à reprodução. Use binóculos e câmera com zoom — essa é a regra de ouro do birdwatching.',
      },
    ],
  },
  {
    id: 'brejo',
    n: 'Brejo dos Beija-flores',
    lv: 'lv-f',
    lvn: 'Fácil',
    km: '2,1',
    t: '1h',
    sp: 19,
    foto: FOTOS.beija,
    cap: 'Área úmida com flores nativas',
    desc: 'Área úmida com grande concentração de beija-flores e pombas. Trilha curta e plana, perfeita para crianças e idosos. O amanhecer é o melhor horário.',
    fatos: [
      '🌅 Melhor ao amanhecer',
      '🌺 Flores nativas: 30+ sp.',
      '💧 Brejo permanente',
      '♿ Parcialmente acessível',
    ],
    aves: [1, 2, 4, 0],
    quiz: [
      {
        q: 'Qual é a principal fonte de alimento dos beija-flores?',
        img: FOTOS.beija,
        cap: 'Beija-flor alimentando-se de néctar',
        ops: [
          'Insetos e larvas do solo',
          'Néctar das flores',
          'Sementes e grãos',
          'Pequenos peixes',
        ],
        c: 1,
        exp: 'Os beija-flores se alimentam principalmente de néctar das flores, sendo polinizadores essenciais de centenas de plantas nativas. Ao visitar as flores para se alimentar, transferem pólen de uma para outra — serviço ecológico fundamental para a reprodução das plantas.',
      },
      {
        q: 'Qual é o status de conservação do beija-flor-tesoura segundo a IUCN?',
        img: FOTOS.beija,
        cap: 'Beija-flor-tesoura (Eupetomena macroura)',
        ops: [
          'Vulnerável (VU)',
          'Em Perigo (EN)',
          'Pouco Preocupante (LC)',
          'Criticamente Ameaçado (CR)',
        ],
        c: 2,
        exp: 'O beija-flor-tesoura possui status "Pouco Preocupante" (LC) na IUCN. Porém, algumas espécies do grupo de beija-flores sofrem com o desmatamento e a perda de plantas nativas que produzem o néctar essencial à sua alimentação.',
      },
      {
        q: 'O que as pombas como a pomba-galega comem principalmente?',
        img: FOTOS.pomba,
        cap: 'Pomba-galega — ave granívora',
        ops: [
          'Néctar e pólen de flores',
          'Sementes e pequenos grãos',
          'Insetos e besouros',
          'Pequenos roedores',
        ],
        c: 1,
        exp: 'Pombas como a pomba-galega são granívoras — alimentam-se principalmente de sementes e pequenos grãos. São importantes dispersoras de sementes de plantas nativas, contribuindo para a regeneração das florestas.',
      },
      {
        q: 'Por que áreas úmidas como brejos são ecossistemas tão importantes?',
        img: FOTOS.beija,
        cap: 'Área úmida — biodiversidade excepcional',
        ops: [
          'Apenas pela beleza estética',
          'Filtram água, regulam cheias e hospedam altíssima biodiversidade',
          'Por facilitarem a construção de estradas',
          'Por serem fáceis de acessar e visitar',
        ],
        c: 1,
        exp: 'Áreas úmidas filtram poluentes, amortecem enchentes, estocam carbono e hospedam cerca de 40% de todas as espécies do planeta. São os ecossistemas mais produtivos e também os mais ameaçados do mundo.',
      },
      {
        q: 'Qual a melhor hora do dia para observar aves em campo?',
        img: FOTOS.tainara,
        cap: 'Observação de aves ao amanhecer',
        ops: [
          'Meio-dia, com sol forte',
          'À noite, com lanterna',
          'Ao amanhecer, entre 5h e 9h',
          'À tarde, após o calor do dia',
        ],
        c: 2,
        exp: 'O amanhecer é o melhor horário porque as aves estão mais ativas buscando alimento, cantando e delimitando território. O "dawn chorus" (coro do amanhecer) é quando a diversidade sonora e visual é máxima — até 3x mais espécies ativas do que no meio do dia.',
      },
    ],
  },
];
