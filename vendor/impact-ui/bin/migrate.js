#!/usr/bin/env node

/**
 * impact-ui Migration CLI Tool
 *
 * Transforms barrel imports to direct imports for tree shaking optimization.
 *
 * Usage:
 *   npx impact-ui-migrate ./src
 *   npx impact-ui-migrate ./src --dry
 *   npx impact-ui-migrate ./src --extensions tsx,ts
 */

const { execSync, spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

/**
 * Print styled header
 */
function printHeader() {
  console.log(`
${colors.cyan}╔═══════════════════════════════════════════════════════════════╗
║                  ${colors.bright}impact-ui Migration Tool${colors.reset}${colors.cyan}                     ║
╠═══════════════════════════════════════════════════════════════╣
║  Transforms barrel imports to direct imports for tree shaking  ║
╚═══════════════════════════════════════════════════════════════╝${colors.reset}
`);
}

/**
 * Print help message
 */
function printHelp() {
  printHeader();
  console.log(`
${colors.bright}Usage:${colors.reset}
  npx impact-ui-migrate <target-path> [options]

${colors.bright}Arguments:${colors.reset}
  <target-path>     Path to the directory or file to transform

${colors.bright}Options:${colors.reset}
  --dry             Run without making changes (preview mode)
  --extensions      File extensions to transform (default: tsx,ts,jsx,js)
  --verbose         Show detailed output
  --help, -h        Show this help message

${colors.bright}Examples:${colors.reset}
  ${colors.dim}# Migrate all files in src directory${colors.reset}
  npx impact-ui-migrate ./src

  ${colors.dim}# Preview changes without applying them${colors.reset}
  npx impact-ui-migrate ./src --dry

  ${colors.dim}# Migrate only TypeScript files${colors.reset}
  npx impact-ui-migrate ./src --extensions tsx,ts

  ${colors.dim}# Migrate a specific file${colors.reset}
  npx impact-ui-migrate ./src/components/MyComponent.tsx

${colors.bright}What it does:${colors.reset}
  ${colors.red}Before:${colors.reset}
    import { Button, Input, Card } from 'impact-ui';

  ${colors.green}After:${colors.reset}
    import { Button } from 'impact-ui/Button';
    import { Input } from 'impact-ui/Input';
    import { Card } from 'impact-ui/Card';

${colors.bright}Benefits:${colors.reset}
  - Enables tree shaking for smaller bundle sizes
  - Only imports the components you use
  - Can reduce bundle size by up to 80%

${colors.bright}More info:${colors.reset}
  See MIGRATION_GUIDE.md for detailed documentation.
`);
}

/**
 * Parse command line arguments
 * @param {string[]} args - Command line arguments
 * @returns {object} Parsed arguments
 */
function parseArgs(args) {
  const result = {
    targetPath: null,
    isDryRun: false,
    extensions: 'tsx,ts,jsx,js',
    verbose: false,
    showHelp: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--help' || arg === '-h') {
      result.showHelp = true;
    } else if (arg === '--dry') {
      result.isDryRun = true;
    } else if (arg === '--verbose' || arg === '-v') {
      result.verbose = true;
    } else if (arg === '--extensions' || arg === '-e') {
      result.extensions = args[++i] || result.extensions;
    } else if (arg.startsWith('--extensions=')) {
      result.extensions = arg.split('=')[1];
    } else if (!arg.startsWith('-')) {
      result.targetPath = arg;
    }
  }

  return result;
}

/**
 * Check if jscodeshift is available
 * @returns {boolean} True if jscodeshift is available
 */
function checkJscodeshift() {
  try {
    execSync('npx jscodeshift --version', { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Count files that will be processed
 * @param {string} targetPath - Target path
 * @param {string} extensions - File extensions
 * @returns {number} Number of files
 */
function countFiles(targetPath, extensions) {
  const extArray = extensions.split(',').map((e) => e.trim());
  let count = 0;

  function walkDir(dir) {
    if (!fs.existsSync(dir)) return;

    const stat = fs.statSync(dir);
    if (stat.isFile()) {
      const ext = path.extname(dir).slice(1);
      if (extArray.includes(ext)) count++;
      return;
    }

    if (!stat.isDirectory()) return;

    const files = fs.readdirSync(dir);
    for (const file of files) {
      // Skip node_modules and hidden directories
      if (file === 'node_modules' || file.startsWith('.')) continue;
      walkDir(path.join(dir, file));
    }
  }

  walkDir(targetPath);
  return count;
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);
  const options = parseArgs(args);

  // Show help if requested or no arguments
  if (options.showHelp || args.length === 0) {
    printHelp();
    process.exit(0);
  }

  // Validate target path
  if (!options.targetPath) {
    console.error(`${colors.red}Error: Please provide a target path${colors.reset}`);
    console.log('\nRun with --help for usage information.');
    process.exit(1);
  }

  // Resolve paths
  const transformPath = path.resolve(__dirname, '../codemods/transform.js');
  const absoluteTargetPath = path.resolve(process.cwd(), options.targetPath);

  // Check if transform file exists
  if (!fs.existsSync(transformPath)) {
    console.error(
      `${colors.red}Error: Transform file not found at ${transformPath}${colors.reset}`
    );
    console.error('This might indicate a corrupted impact-ui installation.');
    console.error('Try reinstalling: npm install impact-ui');
    process.exit(1);
  }

  // Check if target exists
  if (!fs.existsSync(absoluteTargetPath)) {
    console.error(`${colors.red}Error: Path does not exist: ${absoluteTargetPath}${colors.reset}`);
    process.exit(1);
  }

  printHeader();

  // Count files to process
  const fileCount = countFiles(absoluteTargetPath, options.extensions);

  console.log(`${colors.bright}Configuration:${colors.reset}`);
  console.log(`  Target:      ${colors.cyan}${absoluteTargetPath}${colors.reset}`);
  console.log(`  Extensions:  ${colors.cyan}${options.extensions}${colors.reset}`);
  console.log(`  Files:       ${colors.cyan}~${fileCount} files to scan${colors.reset}`);
  console.log(
    `  Mode:        ${options.isDryRun ? `${colors.yellow}Dry run (no changes)${colors.reset}` : `${colors.green}Live${colors.reset}`}`
  );
  console.log('');

  // Check for jscodeshift
  if (!checkJscodeshift()) {
    console.log(`${colors.yellow}Installing jscodeshift...${colors.reset}`);
  }

  console.log(`${colors.bright}Running migration...${colors.reset}\n`);

  // Build jscodeshift command arguments
  const jscodeshiftArgs = [
    'jscodeshift',
    '-t',
    transformPath,
    absoluteTargetPath,
    `--extensions=${options.extensions}`,
    '--parser=tsx',
    '--ignore-pattern=**/node_modules/**',
    '--ignore-pattern=**/*.test.*',
    '--ignore-pattern=**/*.spec.*',
    '--ignore-pattern=**/*.stories.*',
  ];

  if (options.isDryRun) {
    jscodeshiftArgs.push('--dry');
  }

  if (options.verbose) {
    jscodeshiftArgs.push('--verbose=2');
  }

  try {
    const result = spawnSync('npx', jscodeshiftArgs, {
      stdio: 'inherit',
      shell: true,
    });

    if (result.status !== 0) {
      console.error(`\n${colors.red}Migration encountered errors.${colors.reset}`);
      process.exit(result.status || 1);
    }

    console.log(`\n${colors.green}${colors.bright}Migration complete!${colors.reset}\n`);

    if (options.isDryRun) {
      console.log(`${colors.yellow}This was a dry run. No files were changed.${colors.reset}`);
      console.log('Run without --dry to apply the changes.\n');
    } else {
      console.log(`${colors.bright}Next steps:${colors.reset}`);
      console.log(`  1. Review changes: ${colors.cyan}git diff${colors.reset}`);
      console.log(`  2. Run your tests: ${colors.cyan}npm test${colors.reset}`);
      console.log(`  3. Add ESLint rule to prevent regression:`);
      console.log(`     ${colors.dim}// .eslintrc.js${colors.reset}`);
      console.log(`     ${colors.cyan}plugins: ['impact-ui'],${colors.reset}`);
      console.log(
        `     ${colors.cyan}rules: { 'impact-ui/no-barrel-import': 'error' }${colors.reset}`
      );
      console.log('');
    }
  } catch (error) {
    console.error(`\n${colors.red}Migration failed: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

// Run main function
main();
