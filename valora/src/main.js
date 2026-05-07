// ============================================================
//  ENTRADA: main.js
//  Ponto de entrada da aplicação — Projeto VALORA
//  Inicializa todos os módulos na ordem correta
// ============================================================

// ── Módulos de UI ─────────────────────────────────────────────
import { initNav, reobs, mostrarToast, voltarHome, ir } from './modules/ui.js';

// ── Módulos de renderização ───────────────────────────────────
import { renderAves, fecharModal }    from './modules/aves.js';
import { renderTrilhas, iniciarQuiz } from './modules/trilhas.js';
import { renderRegistros }            from './modules/registros.js';

// ── Módulos de funcionalidade ─────────────────────────────────
import {
  abrirCamera,
  abrirGaleria,
  processarFoto,
  confirmarRegistro,
  resetCamera,
} from './modules/camera.js';

import {
  abrirMapa,
  fecharMapa,
  irParaMim,
  buscarAqui,
  buscarCidade,
  focarTrilha,
} from './modules/mapa.js';

// ── Inicialização ─────────────────────────────────────────────

/**
 * Inicializa a aplicação quando o DOM estiver pronto
 */
function init() {
  console.log('[VALORA] Inicializando Aves & Trilhas...');

  // 1. Configurar navegação inferior
  initNav();

  // 2. Renderizar conteúdo inicial
  renderAves();
  renderTrilhas();
  renderRegistros();

  // 3. Registrar elementos no observer de scroll
  reobs();

  // 4. Vincular eventos globais (para onclick inline no HTML)
  vincularEventos();

  console.log('[VALORA] App pronto ✅');
}

/**
 * Vincula funções dos módulos ao escopo global
 * Necessário para onclick inline no HTML e para o quiz
 */
function vincularEventos() {
  // Câmera / IA
  window.abrirCamera       = abrirCamera;
  window.abrirGaleria      = abrirGaleria;
  window.processarFoto     = processarFoto;
  window.confirmarRegistro = confirmarRegistro;
  window.resetCamera       = resetCamera;

  // Mapa
  window.abrirMapa   = abrirMapa;
  window.fecharMapa  = fecharMapa;
  window.irParaMim   = irParaMim;
  window.buscarAqui  = buscarAqui;
  window.buscarCidade = buscarCidade;
  window.focarTrilha  = focarTrilha;

  // Modal de ave
  window.fecharModal  = fecharModal;

  // Quiz
  window.iniciarQuiz  = iniciarQuiz;

  // UI
  window.ir           = ir;
  window.voltarHome   = voltarHome;
  window.mostrarToast = mostrarToast;

  // Input de busca do mapa — tecla Enter
  document.getElementById('mapSearch')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') buscarCidade();
  });
}

// ── Executar quando DOM estiver pronto ────────────────────────
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init(); // DOM já carregado
}
