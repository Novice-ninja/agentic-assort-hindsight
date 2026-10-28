#!/usr/bin/env node

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

function parseArgs(argv) {
  const options = {
    targetPath: './src',
    reportPath: './IMAGE_MIGRATION_REPORT.md',
    extensions: 'tsx,ts,jsx,js,mjs,cjs',
    dry: false,
    verbose: false,
    help: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') options.help = true;
    else if (arg === '--dry') options.dry = true;
    else if (arg === '--verbose' || arg === '-v') options.verbose = true;
    else if (arg === '--target' && argv[i + 1]) options.targetPath = argv[++i];
    else if (arg.startsWith('--target=')) options.targetPath = arg.split('=')[1];
    else if (arg === '--report' && argv[i + 1]) options.reportPath = argv[++i];
    else if (arg.startsWith('--report=')) options.reportPath = arg.split('=')[1];
    else if (arg === '--extensions' && argv[i + 1]) options.extensions = argv[++i];
    else if (arg.startsWith('--extensions=')) options.extensions = arg.split('=')[1];
    else if (!arg.startsWith('-')) options.targetPath = arg;
  }

  return options;
}

function printHelp() {
  console.log(`
Usage:
  node ./bin/migrate-image-paths.cjs [target] [options]

Options:
  --report <path>        Migration report path (default: ./IMAGE_MIGRATION_REPORT.md)
  --extensions <list>    Comma-separated file extensions (default: tsx,ts,jsx,js,mjs,cjs)
  --dry                  Dry-run mode (no file writes)
  --verbose              Verbose jscodeshift output
  --help, -h             Show help
`);
}

function parseReport(reportContent) {
  const mappings = [];
  const regex = /`(src\/assets\/[^`]+)`\s*->\s*`(src\/assets\/webp\/[^`]+)`/g;
  let match = regex.exec(reportContent);
  while (match) {
    const from = match[1].replace(/^src\//, '');
    const to = match[2].replace(/^src\//, '');
    mappings.push({ oldPath: from, newPath: to });
    match = regex.exec(reportContent);
  }
  return mappings;
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printHelp();
    process.exit(0);
  }

  const projectRoot = path.resolve(__dirname, '..');
  const reportPath = path.resolve(projectRoot, options.reportPath);
  const targetPath = path.resolve(projectRoot, options.targetPath);
  const transformPath = path.resolve(projectRoot, 'codemods/image-paths-transform.js');

  if (!fs.existsSync(reportPath)) {
    console.error(`Report not found: ${reportPath}`);
    process.exit(1);
  }
  if (!fs.existsSync(targetPath)) {
    console.error(`Target path not found: ${targetPath}`);
    process.exit(1);
  }
  if (!fs.existsSync(transformPath)) {
    console.error(`Transform not found: ${transformPath}`);
    process.exit(1);
  }

  const reportContent = fs.readFileSync(reportPath, 'utf8');
  const mappings = parseReport(reportContent);
  if (mappings.length === 0) {
    console.error('No mappings found in IMAGE_MIGRATION_REPORT.md');
    process.exit(1);
  }

  const tempMapFile = path.join(os.tmpdir(), `image-path-map-${Date.now()}.json`);
  fs.writeFileSync(tempMapFile, JSON.stringify(mappings), 'utf8');

  const args = [
    'jscodeshift',
    '-t',
    transformPath,
    targetPath,
    `--extensions=${options.extensions}`,
    '--parser=tsx',
    '--ignore-pattern=**/node_modules/**',
    '--ignore-pattern=**/*.test.*',
    '--ignore-pattern=**/*.spec.*',
    '--ignore-pattern=**/*.stories.*',
    `--mapFile=${tempMapFile}`,
  ];

  if (options.dry) args.push('--dry');
  if (options.verbose) args.push('--verbose=2');

  console.log(`Applying ${mappings.length} image-path mappings...`);
  const result = spawnSync('npx', args, { stdio: 'inherit', shell: true });

  try {
    fs.unlinkSync(tempMapFile);
  } catch {
    // ignore
  }

  process.exit(result.status || 0);
}

main();

