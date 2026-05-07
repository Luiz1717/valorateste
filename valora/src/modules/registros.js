// ============================================================
//  MÓDULO: modules/registros.js
//  Sistema de Registros de Avistamentos
//  Persistência: localStorage ('aves_registros')
//  Capacidade: 50 registros (FIFO — mais antigo removido)
// ============================================================

const STORAGE_KEY = 'aves_registros';
const MAX_REGISTROS = 50;

/**
 * @typedef {Object} Registro
 * @property {number} id     - Timestamp único (Date.now())
 * @property {string} nome   - Nome popular da ave
 * @property {string} sci    - Nome científico
 * @property {string} emoji  - Emoji representativo
 * @property {string} foto   - DataURL da foto capturada
 * @property {string} data   - Data formatada pt-BR
 * @property {string} hora   - Hora HH:MM
 * @property {string} conf   - Confiança da IA (ex: "87%")
 * @property {string} status - Status IUCN (ex: "LC", "VU")
 */

/**
 * Salva um novo registro no localStorage
 * @param {Registro} registro
 */
export function salvarRegistro(registro) {
  const lista = carregarRegistros();
  lista.unshift(registro);

  // Manter máximo de MAX_REGISTROS (remover os mais antigos)
  if (lista.length > MAX_REGISTROS) {
    lista.splice(MAX_REGISTROS);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
}

/**
 * Carrega todos os registros do localStorage
 * @returns {Registro[]}
 */
export function carregarRegistros() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
}

/**
 * Remove um registro pelo id
 * @param {number} id
 */
export function removerRegistro(id) {
  const lista = carregarRegistros().filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
  renderRegistros();
}

/**
 * Remove todos os registros
 */
export function limparRegistros() {
  localStorage.removeItem(STORAGE_KEY);
  renderRegistros();
}

/**
 * Renderiza a lista de avistamentos no elemento #regList
 */
export function renderRegistros() {
  const container = document.getElementById('regList');
  if (!container) return;

  const lista = carregarRegistros();

  if (!lista.length) {
    container.innerHTML = `
      <div class="reg-empty">
        📷 Você ainda não tem registros.<br>
        Use a <strong>câmera IA</strong> acima para identificar e registrar aves!
      </div>`;
    return;
  }

  container.innerHTML = lista.map(r => `
    <div class="reg-item">
      <div class="reg-photo">
        ${r.foto
          ? `<img src="${r.foto}" alt="${r.nome}">`
          : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:24px">${r.emoji ?? '🦜'}</div>`
        }
      </div>
      <div style="flex:1;min-width:0">
        <p class="reg-name">${r.nome}</p>
        <div class="reg-meta">
          <span>📅 ${r.data} ${r.hora}</span>
          <span>🤖 ${r.conf}</span>
        </div>
        <p style="font-size:10.5px;color:rgba(24,40,26,.4);font-style:italic;margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${r.sci}</p>
      </div>
      <button
        onclick="window.__removerRegistro(${r.id})"
        aria-label="Remover registro de ${r.nome}"
        style="background:none;border:none;cursor:pointer;color:rgba(24,40,26,.3);font-size:18px;padding:4px;flex-shrink:0"
        title="Remover"
      >🗑️</button>
    </div>
  `).join('');
}

// Expor globalmente para uso no onclick inline
window.__removerRegistro = removerRegistro;
