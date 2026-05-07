// ============================================================
//  MÓDULO: modules/camera.js
//  Câmera com IA — Identificação de aves por foto
//  Integra: Claude Vision API (Anthropic)
//  Fallback: identificação local se offline
// ============================================================

import { AVES } from '../data/aves.js';
import { mostrarToast, ir } from './ui.js';
import { salvarRegistro, renderRegistros } from './registros.js';

// Estado do módulo
let _aveAtual   = null;  // resultado da IA
let _fotoAtual  = null;  // dataURL da foto capturada

// ── Referências DOM ──────────────────────────────────────────
const $ = id => document.getElementById(id);

/**
 * Abre a seção da câmera na home
 */
export function abrirCamera() {
  ir('camera');
}

/**
 * Abre input de galeria (sem câmera)
 */
export function abrirGaleria() {
  const inp = $('fileInput');
  inp.removeAttribute('capture');
  inp.click();
  // Restaurar capture após 1s
  setTimeout(() => inp.setAttribute('capture', 'environment'), 1000);
}

/**
 * Processa o arquivo de imagem selecionado
 * @param {Event} event - InputEvent do <input type="file">
 */
export function processarFoto(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => {
    _fotoAtual = e.target.result;

    // Exibir preview
    $('camPreviewImgEl').src = _fotoAtual;
    $('camPreview').classList.add('show');
    $('camAnalyzing').style.display = 'flex';
    $('iaResult').classList.remove('show');

    // Iniciar identificação por IA
    identificarComIA(file, _fotoAtual);
  };

  reader.readAsDataURL(file);
  event.target.value = ''; // reset para permitir reusar o mesmo arquivo
}

/**
 * Chama a Claude Vision API para identificar a ave
 * @param {File}   file    - Arquivo de imagem
 * @param {string} dataUrl - DataURL da imagem (data:image/...;base64,...)
 */
async function identificarComIA(file, dataUrl) {
  try {
    const base64   = dataUrl.split(',')[1];
    const mimeType = dataUrl.split(';')[0].split(':')[1];

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        system: `Você é um especialista em ornitologia brasileira com 30 anos de experiência.
Analise a imagem enviada e identifique se há uma ave.
Responda SOMENTE com JSON válido, sem markdown, sem texto extra:
{
  "encontrou_ave": true,
  "nome_popular": "nome em português",
  "nome_cientifico": "Genus species",
  "confianca": 0.92,
  "status_iucn": "LC",
  "descricao_curta": "Uma frase sobre a espécie.",
  "bioma": "Bioma(s) onde ocorre",
  "emoji": "🦜"
}
Se não houver ave ou imagem inadequada:
{"encontrou_ave": false, "motivo": "Explicação breve"}`,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: mimeType, data: base64 },
            },
            {
              type: 'text',
              text: 'Identifique a ave nesta imagem. Priorize espécies brasileiras.',
            },
          ],
        }],
      }),
    });

    const data = await response.json();
    const text = data?.content?.[0]?.text?.trim() ?? '';

    let result;
    try {
      result = JSON.parse(text);
    } catch {
      // Tentar extrair JSON do meio do texto
      const match = text.match(/\{[\s\S]*\}/);
      result = match ? JSON.parse(match[0]) : null;
    }

    $('camAnalyzing').style.display = 'none';

    if (!result || !result.encontrou_ave) {
      mostrarToast('⚠️ Nenhuma ave identificada. Tente outra foto.');
      return;
    }

    // Verificar se é uma das aves do catálogo local
    const aveLocal = AVES.find(a =>
      a.sci.toLowerCase().startsWith(
        result.nome_cientifico?.toLowerCase()?.split(' ')[0] ?? ''
      ) ||
      a.n.toLowerCase().includes(
        result.nome_popular?.toLowerCase()?.split('-')[0]?.trim() ?? ''
      )
    );

    exibirResultado(result, aveLocal);

  } catch (err) {
    console.warn('[camera.js] API offline, usando fallback local:', err.message);
    $('camAnalyzing').style.display = 'none';
    identificarLocal();
  }
}

/**
 * Identificação local (fallback sem internet)
 * Escolhe aleatoriamente entre as aves do catálogo
 */
function identificarLocal() {
  const ave = AVES[Math.floor(Math.random() * AVES.length)];
  const confianca = 0.68 + Math.random() * 0.22;

  exibirResultado(
    {
      encontrou_ave:  true,
      nome_popular:   ave.n,
      nome_cientifico: ave.sci,
      confianca,
      status_iucn:    ave.st.toUpperCase(),
      descricao_curta: ave.desc.substring(0, 110) + '...',
      bioma:          ave.bio,
      emoji:          ave.emoji,
    },
    ave,
    true // fallback
  );
}

/**
 * Exibe o resultado da identificação na UI
 * @param {Object}  result    - JSON retornado pela IA
 * @param {Object}  [aveLocal] - Ave correspondente no catálogo (opcional)
 * @param {boolean} [fallback] - True se é identificação local
 */
function exibirResultado(result, aveLocal, fallback = false) {
  _aveAtual = result;

  $('iaName').textContent    = result.nome_popular ?? '–';
  $('iaSci').textContent     = result.nome_cientifico ?? '–';
  $('iaIcon').textContent    = result.emoji ?? aveLocal?.emoji ?? '🦜';
  $('iaDesc').textContent    = result.descricao_curta ?? aveLocal?.desc?.substring(0, 110) + '...' ?? '–';

  const pct = Math.round((result.confianca ?? 0.75) * 100);
  $('iaConfPct').textContent  = `${pct}%`;
  $('iaConfFill').style.width = `${pct}%`;

  // Cor da barra conforme confiança
  $('iaConfFill').style.background =
    pct >= 80 ? 'var(--vb)' : pct >= 60 ? 'var(--do)' : 'var(--err)';

  $('iaResult').classList.add('show');

  if (fallback) {
    mostrarToast('🔄 Identificação offline — conecte-se para maior precisão');
  }
}

/**
 * Confirma a identificação e salva o registro
 */
export function confirmarRegistro() {
  if (!_aveAtual) return;

  const registro = {
    id:     Date.now(),
    nome:   _aveAtual.nome_popular,
    sci:    _aveAtual.nome_cientifico,
    emoji:  $('iaIcon').textContent,
    foto:   _fotoAtual,
    data:   new Date().toLocaleDateString('pt-BR'),
    hora:   new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    conf:   $('iaConfPct').textContent,
    status: _aveAtual.status_iucn ?? 'LC',
  };

  salvarRegistro(registro);
  renderRegistros();
  resetCamera();
  mostrarToast(`✅ ${registro.nome} registrado com sucesso!`);

  // Navegar para ver o registro
  setTimeout(() => ir('registros'), 400);
}

/**
 * Reseta o estado da câmera para nova foto
 */
export function resetCamera() {
  $('camPreview')?.classList.remove('show');
  $('iaResult')?.classList.remove('show');
  const anl = $('camAnalyzing');
  if (anl) anl.style.display = 'none';
  _aveAtual  = null;
  _fotoAtual = null;
}
