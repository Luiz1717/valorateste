# 🦜 Aves & Trilhas — Ecoturismo 4.0
### Projeto VALORA · Protótipo Funcional · Junho/2026

---

## 📁 Estrutura de Pastas

```
valora/
│
├── index.html                  # HTML principal (SPA mobile-first)
│
├── src/
│   ├── main.js                 # ⭐ Ponto de entrada — inicializa tudo
│   │
│   ├── data/                   # Dados do catálogo
│   │   ├── fotos.js            # 5 fotos em base64 (enviadas pela equipe)
│   │   ├── aves.js             # Catálogo das 5 aves + funções de status
│   │   └── trilhas.js          # 3 trilhas + 15 questões de quiz
│   │
│   ├── modules/                # Módulos funcionais
│   │   ├── ui.js               # Toast, navegação SPA, scroll fade-in
│   │   ├── aves.js             # Galeria de aves + Modal detalhado
│   │   ├── camera.js           # Câmera IA (Claude Vision API + fallback)
│   │   ├── registros.js        # Sistema de registros (localStorage)
│   │   ├── trilhas.js          # Trilhas + Engine do Quiz
│   │   └── mapa.js             # Mapa GPS (Leaflet + Overpass API)
│   │
│   └── styles/                 # Estilos CSS modularizados
│       ├── variables.css       # Design tokens (cores, fontes, espaçamentos)
│       ├── base.css            # Reset, utilitários, animações
│       └── components.css      # Todos os componentes UI
│
├── docs/                       # Documentação
│   └── README.md               # Este arquivo
│
└── .vscode/
    ├── settings.json           # Configurações do VS Code
    └── extensions.json         # Extensões recomendadas
```

---

## 🚀 Como Executar

### Opção 1 — Live Server (recomendado)
1. Instalar extensão **Live Server** no VS Code
2. Clicar com botão direito em `index.html` → **"Open with Live Server"**
3. Acessar `http://127.0.0.1:5500`

### Opção 2 — Python
```bash
python3 -m http.server 8080
# Acessar: http://localhost:8080
```

### Opção 3 — Node.js
```bash
npx serve .
# Acessar: http://localhost:3000
```

> ⚠️ **Importante:** Abrir `index.html` diretamente no browser (file://) **não funciona**
> porque os módulos ES6 (`type="module"`) precisam de servidor HTTP.

---

## 🧩 Módulos — Detalhes

### `src/data/fotos.js`
Armazena as 5 fotos das aves em pasta diretamente no código.

```js
export const FOTOS = {
  arara:   'src/assets/images/araraazul.jpg',
  beija:   'src/assets/images/beijaflor.jpg',
  pomba:   'src/assets/images/pomba.jpg',
  gaviao:  'src/assets/images/gaviao.jpg',
  tainara: 'src/assets/images/tainara.jpg',
  hero:    'src/assets/images/araraazul.jpg',
};
```

### `src/data/aves.js`
Catálogo das 5 aves com todos os dados científicos.

```js
export const AVES = [
  {
    id: 'arara-azul',
    n: 'Arara-azul',
    sci: 'Anodorhynchus hyacinthinus',
    st: 'vu',           // lc | nt | vu | cr | ew
    img: FOTOS.arara,   // base64
    perigo: '...',      // alerta vermelho
    desc: '...',        // descrição completa
    // ...
  }
];
```

### `src/modules/camera.js`
Integração com **Claude Vision API** para identificar aves por foto.

**Fluxo:**
```
processarFoto() → identificarComIA() → Claude API
                                     ↓
                              exibirResultado()
                                     ↓
                          confirmarRegistro() → localStorage
```

**Fallback:** Se a API estiver offline, `identificarLocal()` escolhe
uma ave aleatória do catálogo local.

### `src/modules/mapa.js`
Mapa GPS com trilhas reais via **Overpass API** (OpenStreetMap).

**APIs utilizadas:**
- `Leaflet.js` — renderização do mapa
- `Overpass API` — busca de trilhas reais por GPS
- `Nominatim` — geocodificação de cidades

**Fix crítico Leaflet em SPA:**
```js
// Duplo requestAnimationFrame garante DOM pintado antes do Leaflet
requestAnimationFrame(() =>
  requestAnimationFrame(() => inicializarMapa())
);
```

### `src/modules/registros.js`
Persiste avistamentos no `localStorage` do browser.
- Chave: `'aves_registros'`
- Máximo: 50 registros (FIFO)
- Cada registro inclui: foto base64, data, hora, confiança da IA

---

## 🦜 As 5 Aves Catalogadas

| # | Nome Popular | Nome Científico | Status IUCN |
|---|---|---|---|
| 1 | Arara-azul | *Anodorhynchus hyacinthinus* | 🟡 Vulnerável (VU) |
| 2 | Beija-flor-tesoura | *Eupetomena macroura* | 🟢 Pouco Preocupante (LC) |
| 3 | Pomba-galega | *Patagioenas speciosa* | 🟢 Pouco Preocupante (LC) |
| 4 | Gavião-pombo-pequeno | *Leucopternis lacernulatus* | 🟢 Pouco Preocupante (LC) |
| 5 | Tangará-dançarino | *Chiroxiphia caudata* | 🟢 Pouco Preocupante (LC) |

Fonte: WikiAves · CBRO 2021 · IUCN 2024 · ICMBio

---

## 🗺️ Trilhas com Quiz

| Trilha | Nível | Distância | Questões |
|---|---|---|---|
| Cachoeira das Antas | 🟢 Fácil | 3,2 km | 5 |
| Pico da Onça Pintada | 🟡 Médio | 7,8 km | 5 |
| Brejo dos Beija-flores | 🟢 Fácil | 2,1 km | 5 |

---

## 📦 Bibliotecas Externas

| Biblioteca | Versão | Uso |
|---|---|---|
| Leaflet.js | 1.9.4 | Mapa interativo |
| Lora + DM Sans | latest | Tipografia (Google Fonts) |
| VLibras | latest | Acessibilidade Libras |
| Anthropic API | — | Claude Vision (identificação IA) |
| Overpass API | — | Trilhas reais (OpenStreetMap) |
| Nominatim | — | Geocodificação de cidades |

---

## 🔧 VS Code — Extensões Recomendadas

- **Live Server** — servidor local com hot-reload
- **Prettier** — formatação automática de código
- **ESLint** — análise estática de JavaScript
- **Auto Rename Tag** — renomear tags HTML pareadas
- **Material Icon Theme** — ícones de arquivo

Instalar todas de uma vez:
```
Extensions: Show Recommended Extensions
```

---

## 👥 Divisão da Equipe

| Membro | Módulo | Arquivos |
|---|---|---|
| **@Luiz** | Trilhas + Mapa | `mapa.js`, `trilhas.js`, `data/trilhas.js` |
| **Outro membro** | Aves + Câmera + Registros | `aves.js`, `camera.js`, `registros.js`, `data/aves.js` |
| **Compartilhado** | CSS + HTML + Dados | `styles/`, `index.html`, `data/fotos.js` |

---

## 📅 Cronograma — Entrega Junho/2026

- [x] Protótipo HTML único funcional
- [x] 5 aves com fotos reais e dados WikiAves
- [x] IA na câmera (Claude Vision API)
- [x] Mapa GPS com trilhas reais (OpenStreetMap)
- [x] Quiz educativo (3 trilhas × 5 questões)
- [x] Sistema de registros (localStorage)
- [x] VLibras acessibilidade
- [ ] Refatoração em módulos VS Code ← **estamos aqui**
- [ ] Integração com banco SQLite
- [ ] Dados QGis (trilhas georeferenciadas)
- [ ] Testes e validação
- [ ] Apresentação final

---

*Aves & Trilhas · Ecoturismo 4.0 · Projeto VALORA · © 2026*
