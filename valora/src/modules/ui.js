// ============================================================
//  MÓDULO: modules/ui.js
//  Utilitários de Interface
//  Responsabilidade: navegação SPA, toast, scroll fade-in
// ============================================================

// ── Toast ────────────────────────────────────────────────────
let toastTimer = null;

/**
 * Exibe uma notificação toast temporária
 * @param {string} msg     - Mensagem a exibir
 * @param {number} [ms=3200] - Duração em milissegundos
 */
export function mostrarToast(msg, ms = 3200) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = msg;
  toast.classList.add('show');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), ms);
}

// ── Navegação SPA ─────────────────────────────────────────────

/**
 * Alterna a view ativa (oculta todas, exibe a target)
 * @param {string} id - ID do elemento .view a ativar
 */
export function mostrarView(id) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('on'));
  document.getElementById(id)?.classList.add('on');
}

/**
 * Mostra ou oculta a bottom navigation bar
 * @param {boolean} mostrar
 */
export function bnavShow(mostrar) {
  const nav = document.getElementById('bnav');
  if (nav) nav.style.display = mostrar ? 'flex' : 'none';
}

/**
 * Volta para a home view e navega para a seção de Trilhas
 */
export function voltarHome() {
  mostrarView('vh');
  bnavShow(true);

  document.querySelectorAll('.bnav-btn').forEach(b => b.classList.remove('on'));
  document.querySelector('.bnav-btn[data-s="trilhas"]')?.classList.add('on');

  setTimeout(() => ir('trilhas'), 100);
}

/**
 * Scroll suave para um elemento pelo ID
 * @param {string} id - ID do elemento alvo
 */
export function ir(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

// ── Scroll Fade-In (IntersectionObserver) ────────────────────

const scrollObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('vis');
      }
    });
  },
  { threshold: 0.07 }
);

/**
 * Registra todos os elementos .fi no observer de scroll
 * Deve ser chamada após qualquer renderização de novos elementos
 */
export function reobs() {
  document.querySelectorAll('.fi').forEach(el => scrollObserver.observe(el));
}

// ── Bottom Nav ────────────────────────────────────────────────

/**
 * Configura os cliques da bottom navigation bar
 * Deve ser chamado no init da aplicação
 */
export function initNav() {
  document.querySelectorAll('.bnav-btn[data-s]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.bnav-btn').forEach(b => b.classList.remove('on'));
      btn.classList.add('on');
      ir(btn.dataset.s);
    });
  });
}

// ── Expor globalmente para uso em onclick inline ──────────────
window.__voltarHome = voltarHome;
window.__ir         = ir;
