// ============================================================
//  MÓDULO: modules/trilhas.js
//  Renderização das trilhas + Engine do Quiz
//  3 trilhas · 5 questões cada · 15 questões totais
// ============================================================

import { TRILHAS } from '../data/trilhas.js';
import { AVES } from '../data/aves.js';
import { abrirModal } from './aves.js';
import { mostrarView, bnavShow, ir, reobs } from './ui.js';

// ── Estado do Quiz ───────────────────────────────────────────
let trilhaAtual   = null;  // Trilha sendo respondida
let questaoIdx    = 0;     // Índice da questão atual
let pontuacao     = 0;     // Acertos acumulados
let jaRespondeu   = false; // Evita duplo-clique
let tempoInicio   = 0;     // Timestamp de início

/**
 * Renderiza os cards das trilhas no elemento #trailList
 */
export function renderTrilhas() {
  const container = document.getElementById('trailList');
  if (!container) return;

  container.innerHTML = '';

  TRILHAS.forEach((trilha, ti) => {
    // Chips de aves da trilha
    const chips = trilha.aves.map(ai => {
      const ave = AVES[ai];
      return `
        <div class="bird-chip" onclick="window.__abrirModal(${ai})" role="button" aria-label="${ave.n}">
          <img src="${ave.img}" alt="${ave.n}">
          <p class="bird-chip-name">${ave.n}</p>
        </div>`;
    }).join('');

    // Fatos práticos
    const fatos = trilha.fatos.map(f => `<div class="trail-fact">${f}</div>`).join('');

    const card = document.createElement('div');
    card.className = `trail-card ${trilha.lv} fi`;
    card.id = `trail-${trilha.id}`;
    card.innerHTML = `
      <div class="trail-bar"></div>

      <div class="trail-top" onclick="window.__toggleTrilha('${trilha.id}')">
        <div class="trail-thumb">
          <img src="${trilha.foto}" alt="${trilha.n}">
        </div>
        <div>
          <p class="trail-name">${trilha.n}</p>
          <div class="trail-meta">
            <span>📍 ${trilha.km} km</span>
            <span>⏱ ${trilha.t}</span>
            <span>🦜 ${trilha.sp} sp.</span>
          </div>
        </div>
        <div class="trail-right">
          <span class="trail-lvl">${trilha.lvn}</span>
          <svg class="trail-arrow" width="16" height="16" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </div>
      </div>

      <div class="trail-expand">
        <div class="trail-photo">
          <img src="${trilha.foto}" alt="${trilha.n}">
          <span class="trail-photo-cap">${trilha.cap}</span>
        </div>
        <p class="trail-desc">${trilha.desc}</p>
        <div class="trail-facts">${fatos}</div>
        <p class="birds-title">Aves desta trilha</p>
        <div class="birds-scroll">${chips}</div>
        <button class="btn btn-dark btn-block btn-quiz"
                onclick="iniciarQuiz(${ti})"
                style="margin-top:4px;display:flex;align-items:center;justify-content:center;gap:8px">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2.5">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01"/>
          </svg>
          Fazer Quiz (${trilha.quiz.length} questões)
        </button>
      </div>
    `;

    container.appendChild(card);
  });

  reobs();
}

/**
 * Abre/fecha o acordeão de uma trilha
 * @param {string} id - id da trilha
 */
export function toggleTrilha(id) {
  const card = document.getElementById(`trail-${id}`);
  if (!card) return;

  const estaAberto = card.classList.contains('open');

  // Fechar todas
  document.querySelectorAll('.trail-card').forEach(c => c.classList.remove('open'));

  // Abrir esta se estava fechada
  if (!estaAberto) {
    card.classList.add('open');
    setTimeout(() => card.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 150);
  }
}

// ── Quiz Engine ──────────────────────────────────────────────

/**
 * Inicia o quiz de uma trilha
 * @param {number} i - Índice da trilha em TRILHAS[]
 */
export function iniciarQuiz(i) {
  trilhaAtual  = TRILHAS[i];
  questaoIdx   = 0;
  pontuacao    = 0;
  jaRespondeu  = false;
  tempoInicio  = Date.now();

  document.getElementById('quizTrailName').textContent = trilhaAtual.n;

  mostrarView('quiz-view');
  bnavShow(false);
  window.scrollTo(0, 0);

  renderQuestao();
}

/**
 * Renderiza a questão atual
 */
function renderQuestao() {
  const questao = trilhaAtual.quiz[questaoIdx];
  const total   = trilhaAtual.quiz.length;

  jaRespondeu = false;

  // Atualizar progresso
  document.getElementById('qpLabel').textContent = `Questão ${questaoIdx + 1} de ${total}`;
  document.getElementById('qpPts').textContent   = `${pontuacao} ponto${pontuacao !== 1 ? 's' : ''}`;
  document.getElementById('qpFill').style.width  = `${(questaoIdx / total) * 100}%`;

  // Letras das alternativas
  const letras = ['A', 'B', 'C', 'D'];

  const opcoesHTML = questao.ops.map((opcao, i) => `
    <button class="q-option" onclick="window.__responder(${i})">
      <span class="q-letter">${letras[i]}</span>
      ${opcao}
    </button>
  `).join('');

  document.getElementById('quizBody').innerHTML = `
    <div class="q-card">
      <p class="q-num">Questão ${questaoIdx + 1} / ${total}</p>
      <div class="q-img">
        <img src="${questao.img}" alt="${questao.cap}">
      </div>
      <p class="q-caption">${questao.cap}</p>
      <p class="q-text">${questao.q}</p>
      <div class="q-options">${opcoesHTML}</div>
      <div class="q-feedback" id="qFeedback"></div>
    </div>
    <button class="btn-next" id="btnProximo" onclick="window.__proximaQuestao()">
      ${questaoIdx + 1 < total ? 'Próxima questão →' : 'Ver resultado 🏆'}
    </button>
  `;
}

/**
 * Processa a resposta do usuário
 * @param {number} idx - Índice da alternativa escolhida (0–3)
 */
export function responder(idx) {
  if (jaRespondeu) return;
  jaRespondeu = true;

  const questao = trilhaAtual.quiz[questaoIdx];

  // Bloquear todos os botões
  document.querySelectorAll('.q-option').forEach(btn => {
    btn.style.pointerEvents = 'none';
  });

  const opcoes   = document.querySelectorAll('.q-option');
  const feedback = document.getElementById('qFeedback');
  const letras   = ['A', 'B', 'C', 'D'];

  if (idx === questao.c) {
    // Correta
    opcoes[idx].classList.add('correct');
    opcoes[idx].querySelector('.q-letter').textContent = '✓';
    pontuacao++;
    feedback.className = 'q-feedback show ok';
    feedback.innerHTML = `✅ <strong>Correto!</strong> ${questao.exp}`;
  } else {
    // Errada
    opcoes[idx].classList.add('wrong');
    opcoes[questao.c].classList.add('revealed');
    opcoes[idx].querySelector('.q-letter').textContent    = '✗';
    opcoes[questao.c].querySelector('.q-letter').textContent = '✓';
    feedback.className = 'q-feedback show bad';
    feedback.innerHTML = `❌ <strong>Quase!</strong> ${questao.exp}`;
  }

  // Atualizar placar
  document.getElementById('qpPts').textContent = `${pontuacao} ponto${pontuacao !== 1 ? 's' : ''}`;

  // Mostrar botão de próxima
  document.getElementById('btnProximo').classList.add('show');
}

/**
 * Avança para a próxima questão ou exibe resultado
 */
export function proximaQuestao() {
  questaoIdx++;

  if (questaoIdx < trilhaAtual.quiz.length) {
    renderQuestao();
    window.scrollTo(0, 0);
  } else {
    exibirResultado();
  }
}

/**
 * Exibe a tela de resultado do quiz
 */
function exibirResultado() {
  const total      = trilhaAtual.quiz.length;
  const pct        = Math.round((pontuacao / total) * 100);
  const tempoSeg   = Math.round((Date.now() - tempoInicio) / 1000);
  const minutos    = Math.floor(tempoSeg / 60);
  const segundos   = tempoSeg % 60;

  // Determinar mensagem
  let emoji, titulo, subtitulo;
  if (pct === 100) {
    emoji = '🏆'; titulo = 'Perfeito!';
    subtitulo = 'Você domina o ecossistema desta trilha. Um guardião da natureza!';
  } else if (pct >= 80) {
    emoji = '🌿'; titulo = 'Muito bem!';
    subtitulo = 'Ótimo conhecimento sobre biodiversidade. Continue explorando!';
  } else if (pct >= 60) {
    emoji = '🦜'; titulo = 'Bom resultado!';
    subtitulo = 'Você conhece bastante o ecossistema. Mais visitas deixarão você expert!';
  } else {
    emoji = '🌱'; titulo = 'Continue aprendendo!';
    subtitulo = 'Releia as explicações e refaça o quiz. A natureza tem muito a ensinar!';
  }

  document.getElementById('qpFill').style.width = '100%';
  document.getElementById('quizBody').innerHTML = `
    <div class="result-wrap show">
      <div class="result-ring"
           style="background:conic-gradient(#82C060 ${pct * 3.6}deg, rgba(242,237,224,.1) 0)">
        <div class="result-inner">
          <span class="result-score">${pontuacao}<span>/${total}</span></span>
        </div>
      </div>

      <div class="result-emoji">${emoji}</div>
      <p class="result-title">${titulo}</p>
      <p class="result-subtitle">${subtitulo}</p>

      <div class="result-table">
        <div class="result-row">
          <span class="result-label">Trilha</span>
          <span class="result-value">${trilhaAtual.n}</span>
        </div>
        <div class="result-row">
          <span class="result-label">Acertos</span>
          <span class="result-value">${pontuacao}/${total} (${pct}%)</span>
        </div>
        <div class="result-row">
          <span class="result-label">Tempo</span>
          <span class="result-value">${minutos > 0 ? minutos + 'min ' : ''}${segundos}s</span>
        </div>
        <div class="result-row">
          <span class="result-label">Nível</span>
          <span class="result-value">${trilhaAtual.lvn}</span>
        </div>
      </div>

      <button class="btn btn-accent btn-block"
              style="margin-bottom:10px"
              onclick="window.__refazerQuiz()">
        🔄 Refazer Quiz
      </button>
      <button class="btn btn-ghost btn-block"
              onclick="window.__voltarHome()">
        ← Voltar às Trilhas
      </button>
    </div>
  `;

  window.scrollTo(0, 0);
}

// ── Exposições globais ───────────────────────────────────────
window.__toggleTrilha    = toggleTrilha;
window.__abrirModal      = abrirModal;
window.__responder       = responder;
window.__proximaQuestao  = proximaQuestao;
window.__refazerQuiz     = () => iniciarQuiz(TRILHAS.findIndex(t => t.id === trilhaAtual.id));
