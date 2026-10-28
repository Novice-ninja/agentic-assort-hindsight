/** Render the actual symbol button; inspect vendor close-button props independently. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const esbuild = require('esbuild');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const parser = require('@babel/parser');
const root = path.resolve(__dirname, '../..');
fs.mkdirSync(path.join(root, '.local'), { recursive: true });
const directory = fs.mkdtempSync(path.join(root, '.local/iris-labels-'));
const checks = [];
const check = (name, fn) => { fn(); checks.push({ name, pass: true }); };
(async () => {
  try {
    const outfile = path.join(directory, 'button.cjs');
    await esbuild.build({ absWorkingDir: root, entryPoints: ['src/modules/hindsight/components/cells/AiInsightButton.tsx'], outfile, bundle: true, packages: 'external', platform: 'node', format: 'cjs', logLevel: 'silent', plugins: [{ name: 'isolate-visual-assets', setup(build) {
      build.onResolve({ filter: /\.module\.css$|\.svg$/ }, args => ({ path: args.path, namespace: 'iris-label' }));
      build.onLoad({ filter: /.*/, namespace: 'iris-label' }, args => ({ loader: 'js', contents: args.path.endsWith('.css') ? 'export default {button:"existing-button",icons:"existing-icons"};' : 'export default "local-icon.svg";' }));
    } }] });
    const { AiInsightButton } = require(outfile);
    for (const label of [undefined, '', '   ']) {
      check(`Empty label ${JSON.stringify(label)} receives meaningful aria-label and title`, () => {
        const html = renderToStaticMarkup(React.createElement(AiInsightButton, { label }));
        assert(html.includes('aria-label="Ask Iris about this item"'));
        assert(html.includes('title="Ask Iris about this item"'));
        assert(html.includes('class="existing-button"'));
      });
    }
    check('An injected empty tooltip aria-label cannot erase the item-specific accessible name', () => {
      const html = renderToStaticMarkup(React.createElement(AiInsightButton, { label: 'Ask Iris about Northport', 'aria-label': undefined }));
      assert(html.includes('aria-label="Ask Iris about Northport"'));
      assert(html.includes('title="Ask Iris about Northport"'));
    });
    check('An explicit title is retained while the accessible name remains item-specific', () => {
      const html = renderToStaticMarkup(React.createElement(AiInsightButton, { label: 'Ask Iris about Northport', title: 'Review this product' }));
      assert(html.includes('title="Review this product"'));
      assert(html.includes('aria-label="Ask Iris about Northport"'));
    });
    for (const filename of ['chatbotModuleMenu.js', 'chatBotLandingScreen.js']) {
      const source = fs.readFileSync(path.join(root, 'vendor/impact-ui/dist/components/Chatbot', filename), 'utf8');
      const tree = parser.parse(source, { sourceType: 'module' });
      const buttons = [];
      function visit(node) {
        if (!node || typeof node !== 'object') return;
        if (node.type === 'ObjectExpression' && node.properties.some(prop => prop.key?.name === 'onClick' && prop.value?.name === 'onClose')) buttons.push(node);
        for (const value of Object.values(node)) if (Array.isArray(value)) value.forEach(visit); else if (value && typeof value === 'object') visit(value);
      }
      visit(tree);
      check(`${filename}: the actual close-control props provide both aria-label and title`, () => {
        assert(buttons.length > 0);
        for (const button of buttons) for (const name of ['aria-label', 'title']) {
          const property = button.properties.find(prop => (prop.key?.value ?? prop.key?.name) === name);
          assert.equal(property?.value?.value, 'Close Iris chat');
        }
      });
    }
    fs.writeFileSync(path.join(__dirname, 'priority-iris-label-checks.json'), JSON.stringify({ kind: 'Actual symbol-button SSR and vendor close-control AST checks; browser verification separate', passed: checks.length, checks }, null, 2) + '\n');
    console.log(`${checks.length} Iris accessible-label checks passed.`);
  } finally { fs.rmSync(directory, { recursive: true, force: true }); }
})().catch(error => { console.error(error); process.exitCode = 1; });
