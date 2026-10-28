import { defineConfig, transformWithEsbuild, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve, relative, dirname } from 'node:path';

const sourceRoot = resolve(__dirname, 'src');
const aliases = Object.fromEntries(
  ['app', 'pages', 'modules', 'shared', 'config', 'mocks', 'assets', 'design-system', 'tests'].map((name) => [
    `@${name}`, resolve(sourceRoot, name),
  ]),
);

// Keep every CSS Module class exactly as deployed. The ?hash files are the css-loader
// export maps recovered from the app's public source maps; the corresponding .css is editable.
const cssClassMaps = new Map<string, Record<string, string>>();
function visit(dir: string) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const file = resolve(dir, entry.name);
    if (entry.isDirectory()) visit(file);
    else if (/\.module\.css\?/.test(entry.name)) {
      const code = readFileSync(file, 'utf8');
      const match = code.match(/export default (\{.*\});?\s*$/s);
      if (match) cssClassMaps.set(file.split('?')[0], JSON.parse(match[1]));
    }
    else if (entry.name.endsWith('.module.css.exports.json')) {
      // Portable handoffs avoid '?' in file names, which Windows cannot extract.
      cssClassMaps.set(file.slice(0, -'.exports.json'.length), JSON.parse(readFileSync(file, 'utf8')));
    }
  }
}
visit(sourceRoot);

const privateLocalEnv = loadEnv('development', __dirname, 'APP_');
const assetUrls: Record<string, string> = JSON.parse(readFileSync(resolve(__dirname, 'public/vendor/url-map.json'), 'utf8'));
function localizeAssetUrls(code: string, id: string) {
  let next = code;
  for (const [remote, local] of Object.entries(assetUrls)) {
    if (remote.startsWith('http')) next = next.split(remote).join(local);
  }
  next = next.replace(/https:\/\/impact-kit(?:\.devs)?\.iaproducts\.ai\/api\/v1\/files\/uploads\/impact-ui\/prod\/icons(?=\/|['"`])/g, '/vendor');
  if (id.endsWith('/utils/assetBase.js')) {
    next = next.replace('return `${base}/${path}`;', "return '/vendor/' + (path.startsWith('icons/') ? path.slice(6) : path);");
  }
  return next;
}
const deployedUiImports = [...new Set([...readFileSync(resolve(sourceRoot, 'shared/components/vendor/impact-ui.ts'), 'utf8').matchAll(/from ['"](impact-ui\/[^'"]+)['"]/g)].map((m) => m[1]))];
const localEnv = {
  APP_API_BASE_URL: '/api',
  APP_GO_API_BASE_URL: '/agentic-assort-go/api',
  APP_AGENT_API_BASE_URL: '/api/assort-agent',
  APP_DEFAULT_LOCALE: 'en',
  APP_ENV: 'development',
  CLIENT: '',
  APP_USER_EMAIL: 'qa@impactanalytics.co',
  APP_AG_GRID_LICENSE_KEY: privateLocalEnv.APP_AG_GRID_LICENSE_KEY ?? '',
  APP_HIGHCHARTS_LICENSE_KEY: privateLocalEnv.APP_HIGHCHARTS_LICENSE_KEY ?? '',
  APP_POSTHOG_KEY: '',
  APP_POSTHOG_HOST: '',
  APP_USE_MOCKS: 'true',
  APP_LOCAL_IRIS_MODE: (process.env.APP_LOCAL_IRIS_MODE ?? privateLocalEnv.APP_LOCAL_IRIS_MODE) === 'sample' ? 'sample' : 'connection-error',
};

export default defineConfig({
  plugins: [
    {
      name: 'local-deployed-asset-urls',
      enforce: 'pre',
      transform(code, id) {
        if (!/\.(?:[jt]sx?|json|css)(?:\?|$)/.test(id)) return;
        const next = localizeAssetUrls(code, id);
        return next === code ? undefined : { code: next, map: null };
      },
    },
    {
      name: 'recovered-jsx-bootstrap',
      enforce: 'pre',
      async transform(code, id) {
        if (id === resolve(sourceRoot, 'app/bootstrap.js')) {
          return transformWithEsbuild(code, id, { loader: 'jsx', jsx: 'automatic' });
        }
      },
    },
    react(),
  ],
  resolve: { alias: aliases, dedupe: ['react', 'react-dom', 'highcharts', 'ag-grid-community'] },
  define: Object.fromEntries(Object.entries(localEnv).map(([key, value]) => [`process.env.${key}`, JSON.stringify(value)])),
  css: {
    modules: {
      generateScopedName(name, filename) {
        const mapped = cssClassMaps.get(filename)?.[name];
        return mapped?.split(' ')[0] ?? `local_${relative(sourceRoot, filename).replace(/\W/g, '_')}_${name}`;
      },
    },
  },
  optimizeDeps: {
    include: deployedUiImports,
    esbuildOptions: {
      loader: { '.js': 'jsx' },
      plugins: [{
        name: 'prebundle-local-deployed-assets',
        setup(build) {
          build.onLoad({ filter: /[\/]vendor[\/]impact-ui[\/]dist[\/].*\.js$/ }, (args) => ({
            contents: localizeAssetUrls(readFileSync(args.path, 'utf8'), args.path),
            loader: 'js',
            resolveDir: dirname(args.path),
          }));
        },
      }],
    },
  },
  build: { sourcemap: true, outDir: 'dist', chunkSizeWarningLimit: 10000 },
  server: { host: '127.0.0.1', port: 5173, strictPort: true },
});
