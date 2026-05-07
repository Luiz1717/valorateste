// ============================================================
//  MÓDULO: data/fotos.js
//  Caminhos das fotos das 5 aves — Projeto VALORA
//  📁 Arquivos em: src/assets/images/
//
//  Para trocar uma foto no VS Code:
//  1. Coloque o novo arquivo .jpg em src/assets/images/
//  2. Use o mesmo nome de arquivo listado abaixo
// ============================================================

/**
 * @typedef {Object} FotosMap
 * @property {string} arara   - Arara-azul (araraazul.jpg)
 * @property {string} beija   - Beija-flor-tesoura (beijaflor.jpg)
 * @property {string} pomba   - Pomba-galega (pomba.jpg)
 * @property {string} gaviao  - Gavião-pombo-pequeno (gaviao.jpg)
 * @property {string} tainara - Tangará-dançarino (tainara.jpg)
 * @property {string} hero    - Foto de fundo do hero
 */

/** @type {FotosMap} */
export const FOTOS = {
  arara:   'src/assets/images/araraazul.jpg',
  beija:   'src/assets/images/beijaflor.jpg',
  pomba:   'src/assets/images/pomba.jpg',
  gaviao:  'src/assets/images/gaviao.jpg',
  tainara: 'src/assets/images/tainara.jpg',
  hero:    'src/assets/images/araraazul.jpg',
};
