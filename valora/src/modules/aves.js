// ============================================================
//  MÓDULO: modules/aves.js
//  Galeria de aves + Modal detalhado
//  Responsabilidade: renderizar cards, abrir/fechar modal
// ============================================================

import { AVES, statusClass, statusEmoji, statusBg, statusTc } from '../data/aves.js';
import { reobs } from './ui.js';

/**
 * Renderiza o grid de cards de aves no elemento #avesGrid
 * As fotos são base64 aplicadas direto no src — sem fetch externo
 */
export function renderAves() {
  const grid = document.getElementById('avesGrid');
  if (!grid) return;

  grid.innerHTML = '';

  AVES.forEach((ave, i) => {
    const card = document.createElement('div');
    card.className = 'ave-card fi';
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Ver detalhes de ${ave.n}`);
    card.onclick = () => abrirModal(i);

    card.innerHTML = `
      <div class="ave-img-wrap">
        <img
          src="${ave.img}"
          alt="${ave.n} — ${ave.sci}"
          style="width:100%;height:100%;object-fit:cover;display:block"
        >
        <span class="ave-status ${statusClass(ave.st)}">${ave.stxt.split(' ')[0]}</span>
      </div>
      <div class="ave-info">
        <p class="ave-name">${ave.n}</p>
        <p class="ave-sci">${ave.sci}</p>
        <p class="ave-bio">${ave.bio}</p>
      </div>
    `;

    grid.appendChild(card);
  });

  // Registrar novos elementos no observer de scroll fade-in
  reobs();
}

/**
 * Abre o modal com detalhes completos da ave
 * @param {number} i - Índice da ave em AVES[]
 */
export function abrirModal(i) {
  const ave = AVES[i];
  if (!ave) return;

  const overlay = document.getElementById('aveOverlay');
  const box     = document.getElementById('aveModal');
  if (!overlay || !box) return;

  box.innerHTML = `
    <div style="position:relative">
      <div class="modal-photo">
        <img src="${ave.img}" alt="${ave.n}">
        <span class="modal-credit">📷 Foto: Equipe VALORA · 📖 WikiAves · CBRO 2021</span>
      </div>
      <button class="modal-close-btn" onclick="window.__fecharModal()" aria-label="Fechar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <div class="modal-body">
      <p class="modal-name">${ave.n}</p>
      <p class="modal-sci">${ave.sci}</p>
      <p class="modal-nomes">${ave.nomes}</p>

      <span class="modal-status-badge" style="background:${statusBg(ave.st)};color:${statusTc(ave.st)}">
        ${statusEmoji(ave.st)} ${ave.stxt}
      </span>

      <div class="modal-perigo">${ave.perigo}</div>

      <div class="modal-facts">
        <div class="modal-fact">
          <p class="modal-fact-label">Bioma</p>
          <p class="modal-fact-value" style="font-size:10.5px">${ave.bio}</p>
        </div>
        <div class="modal-fact">
          <p class="modal-fact-label">Tamanho</p>
          <p class="modal-fact-value">${ave.tam}</p>
        </div>
        <div class="modal-fact">
          <p class="modal-fact-label">Peso</p>
          <p class="modal-fact-value">${ave.peso}</p>
        </div>
        <div class="modal-fact">
          <p class="modal-fact-label">Dieta</p>
          <p class="modal-fact-value" style="font-size:11px">${ave.diet}</p>
        </div>
      </div>

      <p class="modal-desc">${ave.desc}</p>
    </div>
  `;

  overlay.classList.add('on');
  document.body.style.overflow = 'hidden';
}

/**
 * Fecha o modal de ave
 * @param {MouseEvent} [e] - Se fornecido, só fecha se clicou no overlay
 */
export function fecharModal(e) {
  if (e && e.target !== document.getElementById('aveOverlay')) return;
  document.getElementById('aveOverlay')?.classList.remove('on');
  document.body.style.overflow = '';
}

// Expor globalmente para uso no onclick inline do botão fechar
window.__fecharModal = fecharModal;
