/**
 * Drizzle → Autumn — v2 authoring tree.
 *
 * Shape per temp:
 *   { base, morning?, afternoon?, evening?, night? }
 *
 * `base`     — shared terrain / bushes / foliage / trunks / daylight buildings / grades menu
 * time leaf  — sky, clouds, moon, sunGlow, sparse object overrides, overlays?, grade?
 *
 * Resolved pack = deepMerge(base, timeLeaf). Inspector edits the emitted CSS vars.
 *
 * Legacy: cold + mild remain in paint library + _theme.scss until ported.
 */

/** @type {Record<string, unknown>} */
const warm = {
  base: {
    // Shared ground for all warm times — fill while authoring.
    terrain: {
      1: { a: '#d9a451', c: '#945c32', d: '#be8430', blend: 'overlay' },
      2: { a: '#9b5639', b: '#d08d52' },
      3: { a: '#d5b980', b: '#be9562' },
      4: { a: '#d8c08f', b: '#ae8a62' },
      5: { a: '#decfba', b: '#808080' },
    },
    bush: {
      1: { a: '#a3673e', b: '#c5924a' },
      2: { a: '#8c3a2f', b: '#b76634' },
      3: { a: '#935e3b', b: '#df9a02' },
    },
    foliage: {
      1: { a: '#ec9a72', b: '#93483c' },
      2: { a: '#7a943f', b: '#a85c4a' },
      3: { a: '#d19757', b: '#a15c2e' },
      4: { a: '#b9c82e', b: '#833e3e' },
      5: { a: '#d39960', b: '#935a31' },
    },
    trunks: {
      a: '#706860',
      b: '#4f4338',
    },
    buildings: {
      wall: '#aa967e',
      roof: '#953737',
      window: '#a48561',
      windowOpacity: 0.9,
      windowGlowFilter: 'none',
      church: '#a59580',
    },
    // Named grades for this temp — time leaves pick with `grade: 'key'` or omit.
    grades: {
      afternoonColor: {
        pane: 'color',
        bg: 'radial-gradient(circle farthest-side, #dfd0b7, #588ba6)',
        opacity: 0.4,
        blend: 'color-burn',
      },
      evening: {
        pane: 'evening',
        bg: 'radial-gradient(circle farthest-side, #faedfa, #116fa0)',
        opacity: 0.5,
        blend: 'multiply',
      },
    },
  },

  morning: {
    sky: {
      stops: {
        0: '#f2dfa3',
        1: '#d2d7d0',
        2: '#b7ccd1',
        3: '#829aab',
      },
    },
    clouds: {
      bottom: { opacity: 0.75 },
    },
    moon: {
      top: '91%',
      left: '50%',
    },
    sunGlow: {
      opacity: 1,
    },
    smallClouds: {
      1: { a: '#e7f0f5', b: '#b3c4cd', c: '#889fab' },
      2: { a: '#cedce3', b: '#b3c4cd', c: '#889fab' },
      3: { a: '#d8dbdd', b: '#b3c4cd', c: '#889fab' },
      4: { a: '#d9e4e9', b: '#a1b4bd', c: '#95a2a9' },
    },
  },

  afternoon: {
    // Sky copied from morning
    sky: {
      stops: {
        0: '#f2dfa3',
        1: '#d2d7d0',
        2: '#b7ccd1',
        3: '#829aab',
      },
    },
    grade: 'afternoonColor',
  },

  evening: {
    sky: {
      stops: {
        0: '#f3d1ae',
        1: '#d9a49a',
        2: '#ae737e',
        3: '#653b4e',
      },
    },
    clouds: {
      bottom: { opacity: 0.5 },
    },
    smallClouds: {
      1: { a: '#d5d5e4', b: '#b2b3c3', c: '#898594' },
      2: { a: '#d5d5e4', b: '#b2b3c3', c: '#898594' },
      3: { a: '#d5d5e4', b: '#b2b3c3', c: '#898594' },
      4: { a: '#d5d5e4', b: '#b2b3c3', c: '#898594' },
    },
    grade: 'evening',
  },

  night: {
    terrain: {
      1: { a: '#998d5c', c: '#35372b', d: '#5f4528', blend: 'overlay' },
      2: { a: '#6d4b31', b: '#8c7259' },
      3: { a: '#908d5c', b: '#484a41' },
      4: { a: '#634733', b: '#846d56' },
      5: { a: '#42373e', b: '#7a6b71' },
    },
    buildings: {
      wall: '#5b555a',
      roof: '#953737',
      window: '#e0c19d',
      windowOpacity: 0.9,
      windowGlowFilter: 'none',
      church: '#716674',
    },
    overlays: {
      bush: {
        color: '#5b5943',
        opacity: 0.5,
        blend: 'darken',
      },
      foliage: {
        color: '#5b5943',
        opacity: 0.5,
        blend: 'darken',
      },
    },
    sky: {
      stops: {
        0: '#d1b4ae',
        1: '#6c6472',
        2: '#3c404b',
        3: '#11161c',
      },
    },
    clouds: {
      bottom: { opacity: 0.5 },
    },
    smallClouds: {
      1: { a: '#cbc8d8', b: '#8f92a4', c: '#6d688e' },
      2: { a: '#cbc8d8', b: '#8f92a4', c: '#6d688e' },
      3: { a: '#cbc8d8', b: '#8f92a4', c: '#6d688e' },
      4: { a: '#cbc8d8', b: '#8f92a4', c: '#6d688e' },
    },
    moon: {
      filter: 'grayscale(0.5) blur(10px)',
    },
    // grade: 'haze',
  },
}

export default {
  warm,
  // cold / mild — add here when porting off legacy
}
