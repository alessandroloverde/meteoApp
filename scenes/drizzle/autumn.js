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
const hot = {
  base: {
    // Shared ground for all hot times — fill while authoring.
    terrain: {
      1: { a: '#eec666', c: '#8f5027', d: '#9c672f' },
      2: { a: '#a86814', b: '#f4cd85' },
      3: { a: '#ea984a', b: '#8f5941' },
      4: { a: '#deba83', b: '#b18b52' },
      5: { a: '#dab485', b: '#9b7e69' },
    },
    bush: {
      1: { a: '#a6693b', b: '#d79451' },
      2: { a: '#845238', b: '#e1a968' },
      3: { a: '#9e5f15', b: '#facc7e' },
    },
    foliage: {
      1: { a: '#b06253', b: '#67270f' },
      2: { a: '#a96a7c', b: '#7b3322' },
      3: { a: '#f7b044', b: '#5a1504' },
      4: { a: '#a0a65e', b: '#b25d1e' },
      5: { a: '#d99856', b: '#924c1b' },
    },
    trunks: {
      a: '#524639',
      b: '#8e7559',
    },
    buildings: {
      wall: '#bd9c7d',
      window: '#b19270',
      windowOpacity: 0.9,
      windowGlowFilter: 'none',
      church: '#d0af90',
    },
    overlays: {
      building: {
        color: '#808080',
        opacity: 0,
        blend: 'soft-light',
      },
    },
    grades: {
      afternoonColor: {
        pane: 'color',
        bg: 'radial-gradient(farthest-corner, red, blue)',
        opacity: 0.5,
        blend: 'lighten',
      },
      evening: {
        pane: 'evening',
        bg: 'radial-gradient(#605151, #10134ac4)',
        opacity: 0.65,
        blend: 'hard-light',
      },
    },
  },

  morning: {
    sky: {
      stops: {
        0: '#e9d7be',
        1: '#a6aa97',
        2: '#6d9396',
        3: '#5c8486',
      },
    },
    clouds: {
      bottom: { opacity: 0.5 },
    },
    smallClouds: {
      1: { a: '#b9c9c8', b: '#9eafaf', c: '#8c9d97' },
      2: { a: '#b9c9c8', b: '#9eafaf', c: '#8c9d97' },
      3: { a: '#b9c9c8', b: '#9eafaf', c: '#8c9d97' },
      4: { a: '#b9c9c8', b: '#9eafaf', c: '#8c9d97' },
    },
    moon: {
      top: '91%',
      left: '50%',
    },
    sunGlow: {
      opacity: 1,
    },
  },

  afternoon: {
    sky: {
      stops: {
        0: '#f7dec1',
        1: '#e2c393',
        2: '#a2bebf',
        3: '#98b2c9',
      },
    },
    clouds: {
      bottom: { opacity: 0.5 },
    },
    smallClouds: {
      1: { a: '#eccca3', b: '#d9ae78', c: '#d2a979' },
      2: { a: '#eccca3', b: '#d9ae78', c: '#d2a979' },
      3: { a: '#eccca3', b: '#d9ae78', c: '#d2a979' },
      4: { a: '#eccca3', b: '#d9ae78', c: '#d2a979' },
    },
    grade: 'afternoonColor',
  },

  evening: {
    sky: {
      stops: {
        0: '#f5e4c5',
        1: '#eead8e',
        2: '#c1958f',
        3: '#6d6385',
      },
    },
    clouds: {
      bottom: { opacity: 0.64 },
    },
    buildings: {
      wall: '#3b2c39',
      church: '#433340',
    },
    grade: 'evening',
  },

  night: {
    sky: {
      stops: {
        0: '#5e5a6f',
        1: '#3c384b',
        2: '#3a3549',
        3: '#1d2240',
      },
    },
    clouds: {
      bottom: { opacity: 0.25 },
    },
    smallClouds: {
      1: { a: '#5d587e', b: '#3f4265', c: '#29304c' },
      2: { a: '#5d587e', b: '#3f4265', c: '#29304c' },
      3: { a: '#5d587e', b: '#3f4265', c: '#29304c' },
      4: { a: '#5d587e', b: '#3f4265', c: '#29304c' },
    },
    buildings: {
      wall: '#3b2c39',
      church: '#433340',
    },
    trunks: {
      a: '#2a2229',
      b: '#373342',
    },
    overlays: {
      terrain: {
        color: '#280f22',
        opacity: 0.65,
        blend: 'darken',
      },
      bush: {
        color: '#280f22',
        opacity: 0.65,
        blend: 'darken',
      },
      foliage: {
        color: '#280f22',
        opacity: 0.65,
        blend: 'darken',
      },
    },
  },
}

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
  hot,
  // cold / mild — add here when porting off legacy
}
