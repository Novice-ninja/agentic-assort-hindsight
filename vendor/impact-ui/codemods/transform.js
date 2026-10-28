/**
 * jscodeshift transform for migrating impact-ui barrel imports to direct imports
 *
 * Usage:
 *   npx jscodeshift -t ./codemods/transform.js ./src --extensions=tsx,ts,jsx,js
 *
 * Before:
 *   import { Button, Input, Card } from 'impact-ui';
 *   import { Button, Input, Card } from '@impactsmartsuite/impact-ui';
 *
 * After:
 *   import { Button } from 'impact-ui/Button';
 *   import { Button } from 'impact-ui/Button';
 */

const { buildExportLookup } = require('./component-map');

const BARREL_SOURCES = ['impact-ui', '@impactsmartsuite/impact-ui'];

function rewriteTargetPath(componentMapPath, barrelSource) {
  return componentMapPath.replace(/^impact-ui(?=\/|$)/, barrelSource);
}

// Build the export lookup once at module load time
const exportLookup = buildExportLookup();

/**
 * Main transformer function
 * @param {object} fileInfo - Information about the file being transformed
 * @param {object} api - jscodeshift API
 * @param {object} options - Transform options
 * @returns {string|null} - Transformed source or null if no changes
 */
module.exports = function transformer(fileInfo, api, options) {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);
  let hasChanges = false;

  root
    .find(j.ImportDeclaration)
    .filter((path) => BARREL_SOURCES.includes(path.node.source.value))
    .forEach((path) => {
      const barrelSource = path.node.source.value;
      const specifiers = path.node.specifiers;

      const namedSpecifiers = specifiers.filter(
        (s) => s.type === 'ImportSpecifier'
      );
      const defaultSpecifier = specifiers.find(
        (s) => s.type === 'ImportDefaultSpecifier'
      );
      const namespaceSpecifier = specifiers.find(
        (s) => s.type === 'ImportNamespaceSpecifier'
      );

      if (namespaceSpecifier) {
        console.warn(
          `Warning: Cannot migrate namespace import in ${fileInfo.path}. ` +
            `Please manually update: import * as ... from "${barrelSource}"`
        );
        return;
      }

      if (namedSpecifiers.length === 0) {
        return;
      }

      const groupedImports = {};
      const unknownImports = [];

      namedSpecifiers.forEach((spec) => {
        const importedName = spec.imported.name;
        const localName = spec.local.name;
        const targetPath = exportLookup[importedName];

        if (targetPath) {
          if (!groupedImports[targetPath]) {
            groupedImports[targetPath] = [];
          }
          groupedImports[targetPath].push({ importedName, localName });
        } else {
          unknownImports.push(spec);
        }
      });

      const newImports = [];

      Object.entries(groupedImports).forEach(([targetPath, imports]) => {
        const mappedPath = rewriteTargetPath(targetPath, barrelSource);
        const newSpecifiers = imports.map(({ importedName, localName }) => {
          if (importedName === localName) {
            return j.importSpecifier(j.identifier(importedName));
          }
          return j.importSpecifier(
            j.identifier(importedName),
            j.identifier(localName)
          );
        });
        newImports.push(j.importDeclaration(newSpecifiers, j.literal(mappedPath)));
      });

      if (unknownImports.length > 0) {
        const unknownNames = unknownImports.map((s) => s.imported.name).join(', ');
        console.warn(
          `Warning: Unknown imports in ${fileInfo.path}: ${unknownNames}. ` +
            'These will remain as barrel imports. Please check if they exist in the package.'
        );
        newImports.push(
          j.importDeclaration(unknownImports, j.literal(barrelSource))
        );
      }

      if (defaultSpecifier) {
        console.warn(
          `Warning: Default import found in ${fileInfo.path}. ` +
            'The library does not have a default export. Please check your import.'
        );
      }

      if (newImports.length > 0) {
        j(path).replaceWith(newImports);
        hasChanges = true;
      }
    });

  if (hasChanges) {
    return root.toSource({
      quote: 'single',
      trailingComma: true,
    });
  }

  return null;
};

module.exports.parser = 'tsx';
