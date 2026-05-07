// ============================================================
//  MÓDULO: modules/mapa.js
//  Mapa GPS com Trilhas Reais do Brasil
//  Libs: Leaflet.js (CDN) + OpenStreetMap tiles
//  APIs: Overpass API (trilhas OSM) + Nominatim (geocodificação)
// ============================================================

import { mostrarView, bnavShow, voltarHome } from './ui.js';

// ── Estado do módulo ─────────────────────────────────────────
let mapa          = null;   // Instância Leaflet
let marcadorEu    = null;   // Marcador da posição GPS
let circuloEu     = null;   // Círculo de precisão GPS
let watchGPS      = null;   // ID do watchPosition
let camadasTrilha = [];     // Polylines no mapa
let trilhasOSM    = [];     // Lista das trilhas encontradas
let carregando    = false;  // Lock para evitar chamadas paralelas

// ── Constantes ───────────────────────────────────────────────
const RAIO_BUSCA_KM = 15;
const MAX_TRILHAS   = 25;
const CENTER_PADRAO = [-15.7942, -47.8825]; // Brasília (fallback GPS negado)

// ── DOM helpers ──────────────────────────────────────────────
const $ = id => document.getElementById(id);

/**
 * Abre a view do mapa
 */
export function abrirMapa() {
  mostrarView('map-view');
  bnavShow(false);

  document.querySelectorAll('.bnav-btn').forEach(b => b.classList.remove('on'));
  $('btnMapa')?.classList.add('on');

  // Duplo rAF garante que o DOM está pintado antes de inicializar Leaflet
  requestAnimationFrame(() =>
    requestAnimationFrame(() => inicializarMapa())
  );
}

/**
 * Inicializa o mapa Leaflet (chamado uma única vez)
 */
function inicializarMapa() {
  if (mapa) {
    mapa.invalidateSize(true);
    return;
  }

  // Criar instância Leaflet
  mapa = L.map('leaflet-map', {
    center: CENTER_PADRAO,
    zoom: 5,
    zoomControl: true,
    attributionControl: true,
  });

  // Tiles OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(mapa);

  // Forçar recálculo de tamanho (evita tiles em branco)
  mapa.invalidateSize(true);

  setStatus('loading', 'Buscando localização GPS...');
  pedirGPS();
}

/**
 * Solicita localização via Geolocation API
 */
function pedirGPS() {
  if (!navigator.geolocation) {
    setStatus('err', 'GPS não disponível — use a busca por cidade');
    buscarTrilhas(...CENTER_PADRAO);
    return;
  }

  navigator.geolocation.getCurrentPosition(
    pos => {
      const { latitude: lat, longitude: lng, accuracy: acc } = pos.coords;

      mapa.setView([lat, lng], 13);
      mapa.invalidateSize(true);

      atualizarMarcadorEu(lat, lng, acc);
      setStatus('loading', '📍 Localizado! Buscando trilhas próximas...');
      buscarTrilhas(lat, lng);

      // Continuar rastreando posição
      if (watchGPS) navigator.geolocation.clearWatch(watchGPS);
      watchGPS = navigator.geolocation.watchPosition(
        p => atualizarMarcadorEu(p.coords.latitude, p.coords.longitude, p.coords.accuracy),
        () => {},
        { enableHighAccuracy: true, maximumAge: 10000 }
      );
    },
    err => {
      const mensagens = {
        1: 'GPS negado pelo usuário',
        2: 'Sinal GPS fraco',
        3: 'GPS não respondeu',
      };
      setStatus('err', `${mensagens[err.code] ?? 'GPS falhou'} — busque uma cidade`);
      mapa.setView(CENTER_PADRAO, 5);
      mapa.invalidateSize(true);
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
}

/**
 * Cria ou atualiza o marcador da posição do usuário
 */
function atualizarMarcadorEu(lat, lng, acc = 30) {
  const pos = [lat, lng];

  if (!marcadorEu) {
    marcadorEu = L.marker(pos, {
      icon: L.divIcon({
        html: '<div style="width:20px;height:20px;background:#2979FF;border:3px solid white;border-radius:50%;box-shadow:0 0 0 6px rgba(41,121,255,.22)"></div>',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        className: '',
      }),
      zIndexOffset: 1000,
    }).addTo(mapa).bindPopup('<b>📍 Você está aqui</b>');

    circuloEu = L.circle(pos, {
      radius: acc,
      color: '#2979FF',
      fillColor: '#2979FF',
      fillOpacity: .08,
      weight: 1.5,
    }).addTo(mapa);
  } else {
    marcadorEu.setLatLng(pos);
    circuloEu.setLatLng(pos).setRadius(acc);
  }
}

/**
 * Busca trilhas via Overpass API
 * @param {number} lat
 * @param {number} lng
 * @param {number} [raioM=15000] - Raio em metros
 */
async function buscarTrilhas(lat, lng, raioM = RAIO_BUSCA_KM * 1000) {
  if (carregando) return;
  carregando = true;

  setStatus('loading', `Buscando trilhas em ${raioM / 1000} km...`);
  limparTrilhas();

  const query = `
    [out:json][timeout:25];
    (
      way["highway"="path"]["foot"!="no"](around:${raioM},${lat},${lng});
      way["highway"="footway"]["access"!="private"](around:${raioM},${lat},${lng});
      way["highway"="track"]["foot"!="no"](around:${raioM},${lat},${lng});
      relation["route"="hiking"](around:${raioM},${lat},${lng});
      way["route"="hiking"](around:${raioM},${lat},${lng});
    );
    out geom;
  `.trim();

  try {
    const res = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'data=' + encodeURIComponent(query),
    });

    if (!res.ok) throw new Error(`Overpass ${res.status}`);

    const { elements } = await res.json();
    renderizarTrilhasOSM(elements, lat, lng);

  } catch (err) {
    console.error('[mapa.js]', err);
    setStatus('err', 'Erro ao buscar trilhas. Verifique a conexão.');
    $('trailResults').innerHTML = '<div class="tri-empty">❌ Erro. Toque em "Buscar Aqui" para tentar novamente.</div>';
  } finally {
    carregando = false;
  }
}

/**
 * Renderiza as trilhas OSM no mapa e na lista
 */
function renderizarTrilhasOSM(elements, uLat, uLng) {
  limparTrilhas();

  const ways = elements.filter(e => e.type === 'way' && e.geometry?.length > 1);

  if (!ways.length) {
    setStatus('ok', 'Nenhuma trilha cadastrada aqui.');
    $('trailResults').innerHTML = `
      <div class="tri-empty">
        🌱 Nenhuma trilha cadastrada nesta área no OpenStreetMap.<br><br>
        💡 Tente buscar: <strong>Chapada Diamantina</strong>, <strong>Serra dos Órgãos</strong>, <strong>Ilha do Mel</strong>
      </div>`;
    return;
  }

  const listagem = [];

  ways.forEach(way => {
    const coords = way.geometry.map(n => [n.lat, n.lon]);
    const tags   = way.tags ?? {};
    const nome   = tags.name ?? tags['name:pt'] ?? `Caminho #${way.id}`;
    const tipo   = tags.highway ?? tags.route ?? 'caminho';

    // Definir cor conforme tipo
    let cor = '#2E7D32', espessura = 3;
    if (tags.route === 'hiking' || tags.sac_scale) { cor = '#1565C0'; espessura = 4; }
    if (tags.highway === 'track')                   { cor = '#F57F17'; }

    const linha = L.polyline(coords, {
      color: cor, weight: espessura,
      opacity: .82, lineJoin: 'round', lineCap: 'round',
    }).addTo(mapa);

    linha.bindPopup(`
      <div style="font-family:sans-serif;min-width:140px">
        <b>${nome}</b><br>
        <span style="font-size:11px;color:#555">${tipo}${tags.sac_scale ? ' · ' + tags.sac_scale.replace(/_/g, ' ') : ''}</span>
        <br><span style="font-size:11px;color:#888">~${calcularDistancia(coords)}</span>
      </div>`);

    camadasTrilha.push(linha);

    const meio       = Math.floor(coords.length / 2);
    const distanciaEu = haversine(uLat, uLng, coords[meio][0], coords[meio][1]);

    listagem.push({
      nome, tipo, cor, linha,
      dist: calcularDistancia(coords),
      distEu: distanciaEu,
    });
  });

  // Ordenar por proximidade ao usuário
  listagem.sort((a, b) => a.distEu - b.distEu);
  trilhasOSM = listagem.slice(0, MAX_TRILHAS);

  setStatus('ok', `Trilhas encontradas nesta área!`, `✅ ${listagem.length}`);

  // Renderizar lista
  $('trailResults').innerHTML = trilhasOSM.map((t, i) => `
    <div class="trail-result-item" id="tri-${i}" onclick="window.__focarTrilha(${i})">
      <p class="tri-name">${t.nome}</p>
      <div class="tri-meta">
        <span style="color:${t.cor}">⬤</span>
        <span>${t.tipo}</span>
        <span>~${t.dist}</span>
        <span>${t.distEu < 1 ? Math.round(t.distEu * 1000) + 'm' : t.distEu.toFixed(1) + 'km'} de você</span>
      </div>
    </div>`).join('');

  // Ajustar bounds do mapa
  if (camadasTrilha.length) {
    try {
      mapa.fitBounds(L.featureGroup(camadasTrilha).getBounds(), { padding: [25, 25] });
    } catch { /* bounds inválidos */ }
  }
}

/**
 * Destaca uma trilha no mapa ao clicar na lista
 * @param {number} i - Índice em trilhasOSM[]
 */
export function focarTrilha(i) {
  document.querySelectorAll('.trail-result-item').forEach(el => el.classList.remove('sel'));
  $(`tri-${i}`)?.classList.add('sel');

  const trilha = trilhasOSM[i];
  if (!trilha?.linha) return;

  trilha.linha.setStyle({ weight: 7, opacity: 1 });
  try {
    mapa.fitBounds(trilha.linha.getBounds(), { padding: [40, 40] });
  } catch { /* bounds inválidos */ }
  trilha.linha.openPopup();

  // Restaurar estilo após 3.5s
  setTimeout(() => trilha.linha.setStyle({ weight: 4, opacity: .82 }), 3500);
}

/** Centraliza o mapa na posição GPS do usuário */
export function irParaMim() {
  if (marcadorEu) {
    mapa.setView(marcadorEu.getLatLng(), 15);
    marcadorEu.openPopup();
  } else {
    pedirGPS();
  }
}

/** Recarrega trilhas no centro atual do mapa */
export function buscarAqui() {
  const centro = mapa.getCenter();
  buscarTrilhas(centro.lat, centro.lng);
}

/** Busca por cidade/região via Nominatim */
export async function buscarCidade() {
  const query = $('mapSearch')?.value?.trim();
  if (!query) return;

  setStatus('loading', `Buscando "${query}"...`);

  try {
    const res  = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query + ', Brasil')}&format=json&limit=1&countrycodes=br`,
      { headers: { 'Accept-Language': 'pt-BR' } }
    );
    const data = await res.json();

    if (!data.length) {
      setStatus('err', `"${query}" não encontrado. Tente outro nome.`);
      return;
    }

    const { lat, lon } = data[0];
    mapa.setView([+lat, +lon], 12);
    mapa.invalidateSize(true);
    buscarTrilhas(+lat, +lon);

  } catch {
    setStatus('err', 'Erro na busca. Verifique a conexão.');
  }
}

/** Fecha o mapa e volta para home */
export function fecharMapa() {
  if (watchGPS) {
    navigator.geolocation.clearWatch(watchGPS);
    watchGPS = null;
  }
  voltarHome();
}

// ── Helpers ──────────────────────────────────────────────────

function limparTrilhas() {
  camadasTrilha.forEach(l => { try { mapa.removeLayer(l); } catch { } });
  camadasTrilha = [];
  trilhasOSM    = [];
}

function setStatus(tipo, msg, contagem = '') {
  const dot = $('statusDot');
  const txt = $('statusMsg');
  const cnt = $('statusCount');
  if (dot) dot.className = `status-dot ${tipo === 'loading' ? 'loading' : tipo}`;
  if (txt) txt.textContent = msg;
  if (cnt) cnt.textContent = contagem;
}

function calcularDistancia(coords) {
  if (coords.length < 2) return '0m';
  let dist = 0;
  for (let i = 1; i < coords.length; i++) {
    dist += haversine(coords[i-1][0], coords[i-1][1], coords[i][0], coords[i][1]);
  }
  return dist < 1 ? Math.round(dist * 1000) + 'm' : dist.toFixed(1) + 'km';
}

/**
 * Fórmula de Haversine — distância entre dois pontos GPS em km
 */
function haversine(lat1, lon1, lat2, lon2) {
  const R    = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180)
    * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ── Exposições globais ───────────────────────────────────────
window.__focarTrilha = focarTrilha;
