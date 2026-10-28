/**
 * ESLint rule: no-barrel-import
 *
 * Enforces direct imports from impact-ui for better tree shaking.
 * Provides auto-fix to convert barrel imports to direct imports.
 *
 * @example
 * // Bad
 * import { Button, Input } from 'impact-ui';
 * import { Button, Input } from '@impactsmartsuite/impact-ui';
 *
 * // Good
 * import { Button } from 'impact-ui/Button';
 * import { Input } from 'impact-ui/Input';
 */

const SCOPED_BARREL = '@impactsmartsuite/impact-ui';
const LEGACY_BARREL = 'impact-ui';

const path = require('path');

function mapSubpathFromLookup(targetPath, barrelPrefix) {
  return targetPath.replace(/^impact-ui(?=\/|$)/, barrelPrefix);
}
const { buildExportLookup, getComponentNames } = require('../../codemods/component-map');

// Build the export lookup once at module load time
const exportLookup = buildExportLookup();
const componentNames = getComponentNames();

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Enforce direct imports from impact-ui sub-paths for better tree shaking',
      category: 'Best Practices',
      recommended: true,
      url: 'https://github.com/impactanalytics/impact-ui/blob/main/MIGRATION_GUIDE.md',
    },
    fixable: 'code',
    hasSuggestions: true,
    schema: [
      {
        type: 'object',
        properties: {
          // Allow users to specify additional component mappings
          additionalComponents: {
            type: 'object',
            additionalProperties: {
              type: 'string',
            },
          },
          // Allow ignoring certain imports
          ignoreImports: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      avoidBarrelImport:
        'Avoid barrel imports from "{{barrel}}". Import from "{{barrel}}/{{component}}" instead for better tree shaking. This can reduce your bundle size significantly.',
      unknownExport:
        'Unknown export "{{name}}" from {{barrel}}. Verify this export exists in the current version.',
      namespaceImport:
        'Namespace imports (import * as ...) prevent tree shaking. Import specific components instead.',
    },
  },

  create(context) {
    const options = context.options[0] || {};
    const additionalComponents = options.additionalComponents || {};
    const ignoreImports = new Set(options.ignoreImports || []);

    // Merge additional components with default lookup
    const lookup = { ...exportLookup, ...additionalComponents };

    return {
      ImportDeclaration(node) {
        const src = node.source.value;
        const barrelPrefix =
          src === SCOPED_BARREL ? SCOPED_BARREL : src === LEGACY_BARREL ? LEGACY_BARREL : null;
        // Only barrel roots (not sub-paths like 'impact-ui/Button')
        if (!barrelPrefix) {
          return;
        }

        const specifiers = node.specifiers;

        // Check for namespace imports
        const namespaceSpecifier = specifiers.find(
          (s) => s.type === 'ImportNamespaceSpecifier'
        );

        if (namespaceSpecifier) {
          context.report({
            node: namespaceSpecifier,
            messageId: 'namespaceImport',
          });
          return;
        }

        // Get named imports only
        const namedImports = specifiers.filter(
          (s) => s.type === 'ImportSpecifier'
        );

        // Skip if no named imports
        if (namedImports.length === 0) {
          return;
        }

        // Check if all imports should be ignored
        const filteredImports = namedImports.filter(
          (spec) => !ignoreImports.has(spec.imported.name)
        );

        if (filteredImports.length === 0) {
          return;
        }

        // Group imports by target path
        const groupedImports = {};
        const unknownImports = [];

        filteredImports.forEach((spec) => {
          const importedName = spec.imported.name;
          const targetPath = lookup[importedName];

          if (targetPath) {
            if (!groupedImports[targetPath]) {
              groupedImports[targetPath] = [];
            }
            groupedImports[targetPath].push(spec);
          } else {
            unknownImports.push(spec);
          }
        });

        // Get the first component name for the error message
        const firstComponentPath = Object.keys(groupedImports)[0] || '';
        const firstComponent = firstComponentPath.split('/').pop() || 'Component';

        // Report the main error with auto-fix
        context.report({
          node,
          messageId: 'avoidBarrelImport',
          data: { barrel: barrelPrefix, component: firstComponent },
          fix(fixer) {
            const sourceCode = context.getSourceCode
              ? context.getSourceCode()
              : context.sourceCode;

            // Build new import statements
            const newImports = [];

            // Add grouped imports (known components)
            Object.entries(groupedImports).forEach(([targetPath, specs]) => {
              const importSpecifiers = specs
                .map((spec) => {
                  const imported = spec.imported.name;
                  const local = spec.local.name;
                  return imported === local
                    ? imported
                    : `${imported} as ${local}`;
                })
                .join(', ');

              const mappedPath = mapSubpathFromLookup(targetPath, barrelPrefix);
              newImports.push(`import { ${importSpecifiers} } from '${mappedPath}';`);
            });

            // Keep unknown imports in barrel (if any)
            if (unknownImports.length > 0) {
              const unknownSpecifiers = unknownImports
                .map((spec) => {
                  const imported = spec.imported.name;
                  const local = spec.local.name;
                  return imported === local
                    ? imported
                    : `${imported} as ${local}`;
                })
                .join(', ');
              newImports.push(`import { ${unknownSpecifiers} } from '${barrelPrefix}';`);
            }

            // Add imports that were in ignore list back to barrel import
            const ignoredSpecs = namedImports.filter((spec) =>
              ignoreImports.has(spec.imported.name)
            );
            if (ignoredSpecs.length > 0) {
              const ignoredSpecifiers = ignoredSpecs
                .map((spec) => {
                  const imported = spec.imported.name;
                  const local = spec.local.name;
                  return imported === local
                    ? imported
                    : `${imported} as ${local}`;
                })
                .join(', ');
              newImports.push(`import { ${ignoredSpecifiers} } from '${barrelPrefix}';`);
            }

            return fixer.replaceText(node, newImports.join('\n'));
          },
        });

        // Report warnings for unknown exports
        unknownImports.forEach((spec) => {
          context.report({
            node: spec,
            messageId: 'unknownExport',
            data: { name: spec.imported.name, barrel: barrelPrefix },
          });
        });
      },
    };
  },
};
