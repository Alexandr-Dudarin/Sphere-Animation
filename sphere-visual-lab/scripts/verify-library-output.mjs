import { access, readFile, stat } from 'node:fs/promises';
import { constants } from 'node:fs';
import { resolve } from 'node:path';

const requiredFiles = [
  ['dist-lib/index.js', 'JavaScript entry'],
  ['dist-lib/style.css', 'library stylesheet'],
  ['dist-lib/types/index.d.ts', 'TypeScript declarations'],
];

let hasErrors = false;

for (const [relativePath, label] of requiredFiles) {
  const absolutePath = resolve(relativePath);

  try {
    await access(absolutePath, constants.R_OK);
    const fileStats = await stat(absolutePath);
    const sizeKb = (fileStats.size / 1024).toFixed(2);
    console.log(`✓ ${label}: ${relativePath} (${sizeKb} kB)`);
  } catch {
    hasErrors = true;
    console.error(`✗ Missing ${label}: ${relativePath}`);
  }
}

if (!hasErrors) {
  const entrySource = await readFile(resolve('dist-lib/index.js'), 'utf8');
  const forbiddenDemoMarkers = ['DemoPage', 'OrbitalPlaygroundPanel', 'SpherePlaygroundPanel'];
  const bundledDemoMarkers = forbiddenDemoMarkers.filter((marker) =>
    entrySource.includes(marker),
  );

  if (bundledDemoMarkers.length > 0) {
    hasErrors = true;
    console.error(
      `✗ Demo-only code appears in the library bundle: ${bundledDemoMarkers.join(', ')}`,
    );
  } else {
    console.log('✓ No known demo-only components were found in the library entry.');
  }
}

if (hasErrors) {
  process.exitCode = 1;
} else {
  console.log('Library output verification passed.');
}
