# Migrating to impact-ui v4.0

## npm packages

The UI library and MCP server are published as unscoped npm packages:

- `impact-ui`
- `impact-ui-mcp-server`

Authenticate against the default registry (`https://registry.npmjs.org/`) if you need to publish:

```bash
npm login
```

For automation, use a granular access token with **read/publish** as appropriate and configure `~/.npmrc` or environment-based auth (for example `//registry.npmjs.org/:_authToken=${NPM_TOKEN}`). Do not commit tokens.

**Install:**

```bash
npm install impact-ui
```

**Imports** (same subpath style as before, with the scoped package name):

```tsx
import { Button, Badge } from 'impact-ui';
import { Button } from 'impact-ui/Button';
```

---

## Quick Start: Tree Shaking Migration (2 minutes)

Version 4.0 introduces **tree shaking support** for significantly smaller bundle sizes. Follow these steps to migrate:

### Step 1: Update the Package

```bash
npm install impact-ui@latest
```

### Step 2: Run Automatic Migration

```bash
npx impact-ui-migrate ./src
```

This will automatically transform all your barrel imports to direct imports:

**Before:**
```tsx
import { Button, Input, Card, Alert } from 'impact-ui';
```

**After:**
```tsx
import { Button } from 'impact-ui/Button';
import { Input } from 'impact-ui/Input';
import { Card } from 'impact-ui/Card';
import { Alert } from 'impact-ui/Alert';
```

### Step 3: Verify Changes

```bash
git diff          # Review the changes
npm test          # Run your tests
npm run build     # Verify the build works
```

### Step 4: (Recommended) Add ESLint Rule

Prevent future barrel imports by adding the ESLint rule:

```javascript
// .eslintrc.js
module.exports = {
  plugins: ['impact-ui'],
  rules: {
    'impact-ui/no-barrel-import': 'error'
  }
};

// Or use the recommended config
module.exports = {
  extends: ['plugin:impact-ui/recommended']
};
```

Then run auto-fix for any violations:

```bash
npx eslint --fix ./src
```

---

## Migration CLI Options

```bash
# Basic usage
npx impact-ui-migrate ./src

# Preview changes without applying (dry run)
npx impact-ui-migrate ./src --dry

# Migrate only TypeScript files
npx impact-ui-migrate ./src --extensions tsx,ts

# Migrate a specific file
npx impact-ui-migrate ./src/components/MyComponent.tsx

# Show detailed output
npx impact-ui-migrate ./src --verbose

# Show help
npx impact-ui-migrate --help
```

---

## ESLint Plugin Configuration

### Basic Setup

```javascript
// .eslintrc.js
module.exports = {
  plugins: ['impact-ui'],
  rules: {
    'impact-ui/no-barrel-import': 'error'
  }
};
```

### Using Recommended Config

```javascript
// .eslintrc.js
module.exports = {
  extends: ['plugin:impact-ui/recommended']
};
```

### Available Configs

| Config | Description |
|--------|-------------|
| `plugin:impact-ui/recommended` | Enforces direct imports as errors |
| `plugin:impact-ui/warning` | Shows warnings (for gradual migration) |
| `plugin:impact-ui/strict` | Strict mode with no exceptions |

### ESLint Flat Config (eslint.config.js)

```javascript
// eslint.config.js
import impactUI from 'impact-ui/eslint-plugin';

export default [
  impactUI.configs['flat/recommended'],
  // ... your other configs
];
```

### Rule Options

```javascript
// .eslintrc.js
module.exports = {
  rules: {
    'impact-ui/no-barrel-import': ['error', {
      // Ignore specific imports (keep them as barrel imports)
      ignoreImports: ['someUtilFunction'],
      
      // Add custom component mappings
      additionalComponents: {
        'CustomComponent': 'impact-ui/CustomComponent'
      }
    }]
  }
};
```

---

## Bundle Size Impact

| Import Style | Bundle Size | Tree Shaking |
|--------------|-------------|--------------|
| Barrel import (`from 'impact-ui'`) | ~450KB | No |
| Direct import (`from 'impact-ui/Button'`) | ~15-50KB* | Yes |

*Actual size depends on components used

---

## TypeScript Support

impact-ui now ships with TypeScript definitions. No changes required for JS users.

### For TypeScript Users:

```typescript
import { Button, ButtonProps } from 'impact-ui/Button';

const MyButton: React.FC = () => {
  const handleClick: ButtonProps['onClick'] = (e) => {
    // Fully typed event
  };
  
  return <Button onClick={handleClick}>Click</Button>;
};
```

### TypeScript Configuration

Ensure your `tsconfig.json` has the correct module resolution:

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler"  // or "node16" / "nodenext"
  }
}
```

---

## Breaking Changes

### Removed
- PropTypes (replaced with TypeScript interfaces)

### Changed
- Build output now uses Vite (bundle size reduced ~20%)
- CSS import path remains the same: `import 'impact-ui/styles'`
- Package now exports ESM by default with CJS fallback
- Module type is now "module" (ESM)
- **Recommended**: Use direct imports for tree shaking

---

## Accessibility Improvements

All components now meet WCAG 2.1 Level AA standards. Components include:
- Proper ARIA attributes
- Keyboard navigation support
- Focus management
- Screen reader compatibility

---

## Available Components

All components support direct imports:

```tsx
import { Accordion } from 'impact-ui/Accordion';
import { Alert } from 'impact-ui/Alert';
import { Avatar } from 'impact-ui/Avatar';
import { Badge } from 'impact-ui/Badge';
import { Button } from 'impact-ui/Button';
import { Card } from 'impact-ui/Card';
import { Checkbox } from 'impact-ui/Checkbox';
import { Chips } from 'impact-ui/Chips';
import { Input } from 'impact-ui/Input';
import { Switch } from 'impact-ui/Switch';
import { Tag } from 'impact-ui/Tag';
import { Tooltip } from 'impact-ui/Tooltip';

// Utils and types
import { /* utils */ } from 'impact-ui/utils';
import type { /* types */ } from 'impact-ui/types';

// Styles (import once in your app entry)
import 'impact-ui/styles';
```

---

## Troubleshooting

### Unknown export warning during migration

If you see warnings about unknown exports:
1. Check the export exists in your version of impact-ui
2. Verify the spelling is correct
3. The unknown exports will remain as barrel imports

### ESLint rule not working

1. Ensure the plugin is installed: `npm install impact-ui`
2. Restart your IDE/editor
3. Check ESLint is configured correctly

### TypeScript errors after migration

Ensure your `tsconfig.json` has:
```json
{
  "compilerOptions": {
    "moduleResolution": "bundler"
  }
}
```

### Build errors

If you encounter build errors after migration:
1. Clear your build cache: `rm -rf node_modules/.cache`
2. Reinstall dependencies: `npm install`
3. Try rebuilding: `npm run build`

---

## Compatibility

- React 17.0.0 - 19.x
- Node.js 16+
- TypeScript 5.0+ (for TypeScript users)
- ESLint 8.x or 9.x (for ESLint plugin)

---

## Support

For issues or questions, please file an issue on the project repository.
