/**
 * eslint-plugin-impact-ui
 *
 * ESLint plugin for enforcing best practices when using impact-ui library.
 *
 * Installation:
 *   npm install eslint-plugin-impact-ui --save-dev
 *
 * Usage in .eslintrc.js:
 *   module.exports = {
 *     plugins: ['impact-ui'],
 *     rules: {
 *       'impact-ui/no-barrel-import': 'error'
 *     }
 *   };
 *
 * Or use the recommended config:
 *   module.exports = {
 *     extends: ['plugin:impact-ui/recommended']
 *   };
 */

const noBarrelImport = require('./rules/no-barrel-import');
const pkg = require('../package.json');

// Plugin definition
const plugin = {
  meta: {
    name: 'eslint-plugin-impact-ui',
    version: pkg.version,
  },

  rules: {
    'no-barrel-import': noBarrelImport,
  },

  configs: {
    // Recommended config - enforces all rules as errors
    recommended: {
      plugins: ['impact-ui'],
      rules: {
        'impact-ui/no-barrel-import': 'error',
      },
    },

    // Strict config - same as recommended but with no exceptions
    strict: {
      plugins: ['impact-ui'],
      rules: {
        'impact-ui/no-barrel-import': [
          'error',
          {
            ignoreImports: [],
          },
        ],
      },
    },

    // Warning config - for gradual migration
    warning: {
      plugins: ['impact-ui'],
      rules: {
        'impact-ui/no-barrel-import': 'warn',
      },
    },
  },

  // Processors (if needed in the future)
  processors: {},
};

// For ESLint flat config (eslint.config.js) compatibility
plugin.configs['flat/recommended'] = {
  plugins: {
    'impact-ui': plugin,
  },
  rules: {
    'impact-ui/no-barrel-import': 'error',
  },
};

plugin.configs['flat/warning'] = {
  plugins: {
    'impact-ui': plugin,
  },
  rules: {
    'impact-ui/no-barrel-import': 'warn',
  },
};

module.exports = plugin;
