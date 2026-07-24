import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const packagePath = resolve(root, 'package.json');
const gitignorePath = resolve(root, '.gitignore');

const packageJson = JSON.parse(await readFile(packagePath, 'utf8'));

packageJson.scripts = {
  ...packageJson.scripts,
  'test:e2e': 'npm run build && playwright test',
  'test:e2e:headed': 'npm run build && playwright test --headed',
  'test:e2e:ui': 'npm run build && playwright test --ui',
  'test:e2e:debug': 'npm run build && playwright test --debug',
  'test:e2e:report': 'playwright show-report',
};

await writeFile(
  packagePath,
  `${JSON.stringify(packageJson, null, 2)}\n`,
  'utf8',
);

const ignoreEntries = [
  'playwright-report/',
  'test-results/',
  'blob-report/',
];

let gitignore = await readFile(gitignorePath, 'utf8');
const missingEntries = ignoreEntries.filter(
  (entry) => !gitignore.split(/\r?\n/u).includes(entry),
);

if (missingEntries.length > 0) {
  const normalized = gitignore.endsWith('\n') ? gitignore : `${gitignore}\n`;
  gitignore = `${normalized}\n# Playwright\n${missingEntries.join('\n')}\n`;
  await writeFile(gitignorePath, gitignore, 'utf8');
}

console.log('Playwright scripts and .gitignore entries were added.');
