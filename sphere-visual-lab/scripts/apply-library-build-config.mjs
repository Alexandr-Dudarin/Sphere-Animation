import { readFile, writeFile } from 'node:fs/promises';

const packageJsonPath = new URL('../package.json', import.meta.url);
const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'));

packageJson.scripts = {
  ...packageJson.scripts,
  'build:lib':
    'vite build --config vite.lib.config.ts && tsc -p tsconfig.lib.json && node scripts/verify-library-output.mjs',
  'build:all': 'npm run build && npm run build:lib',
  'check:all': 'npm test && npm run build && npm run build:lib',
};

const existingFiles = Array.isArray(packageJson.files) ? packageJson.files : [];
packageJson.files = [...new Set([...existingFiles, 'dist-lib'])];

packageJson.main = './dist-lib/index.js';
packageJson.module = './dist-lib/index.js';
packageJson.types = './dist-lib/types/index.d.ts';
packageJson.exports = {
  ...(typeof packageJson.exports === 'object' && packageJson.exports !== null
    ? packageJson.exports
    : {}),
  '.': {
    types: './dist-lib/types/index.d.ts',
    import: './dist-lib/index.js',
    default: './dist-lib/index.js',
  },
  './style.css': './dist-lib/style.css',
};

const cssSideEffect = '**/*.css';
if (Array.isArray(packageJson.sideEffects)) {
  packageJson.sideEffects = [...new Set([...packageJson.sideEffects, cssSideEffect])];
} else if (packageJson.sideEffects === undefined || packageJson.sideEffects === false) {
  packageJson.sideEffects = [cssSideEffect];
}

await writeFile(
  packageJsonPath,
  `${JSON.stringify(packageJson, null, 2)}\n`,
  'utf8',
);

console.log('package.json updated for the separate library build.');
console.log('The existing app build and private flag were preserved.');
