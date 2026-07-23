import { execFileSync } from 'node:child_process';
import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, join, resolve } from 'node:path';

const npmCommand = 'npm';
const projectRoot = process.cwd();
const rootPackagePath = resolve(projectRoot, 'package.json');

function quoteWindowsArgument(value) {
  if (!/[\s"&|<>^()%!]/.test(value)) {
    return value;
  }

  return `"${value.replaceAll('"', '""')}"`;
}

function run(command, args, cwd, options = {}) {
  console.log(`\n> ${command} ${args.join(' ')}`);

  const stdio = options.capture
    ? ['ignore', 'pipe', 'inherit']
    : 'inherit';
  const encoding = options.capture ? 'utf8' : undefined;

  if (process.platform === 'win32') {
    const commandLine = [command, ...args]
      .map(quoteWindowsArgument)
      .join(' ');

    return execFileSync(
      process.env.ComSpec || 'cmd.exe',
      ['/d', '/s', '/c', commandLine],
      {
        cwd,
        stdio,
        encoding,
        windowsHide: true,
      },
    );
  }

  return execFileSync(command, args, {
    cwd,
    stdio,
    encoding,
  });
}

const rootPackage = JSON.parse(await readFile(rootPackagePath, 'utf8'));
const packageName = rootPackage.name;

if (!packageName) {
  throw new Error('package.json does not contain a package name.');
}

if (!rootPackage.exports?.['.'] || !rootPackage.exports?.['./style.css']) {
  throw new Error(
    'package.json is missing the public library exports. Run the library setup first.',
  );
}

run(npmCommand, ['run', 'build:lib'], projectRoot);

const tempRoot = await mkdtemp(join(tmpdir(), 'sphere-visual-consumer-'));
const packageDir = join(tempRoot, 'package');
const consumerDir = join(tempRoot, 'consumer');
const srcDir = join(consumerDir, 'src');

await mkdir(packageDir, { recursive: true });
await mkdir(srcDir, { recursive: true });

const packOutput = run(
  npmCommand,
  ['pack', '--json', '--pack-destination', packageDir],
  projectRoot,
  { capture: true },
);

const packResult = JSON.parse(packOutput);
const tarballName = packResult[0]?.filename;

if (!tarballName) {
  throw new Error('npm pack did not return a tarball filename.');
}

const tarballPath = join(packageDir, tarballName).replaceAll('\\', '/');

const requiredRuntimePackages = [
  'react',
  'react-dom',
  'three',
  '@react-three/fiber',
  '@react-three/drei',
];

const requiredDevPackages = [
  'vite',
  'typescript',
  '@vitejs/plugin-react',
  '@types/react',
  '@types/react-dom',
  '@types/node',
];

function getVersion(packageNameToRead) {
  return (
    rootPackage.dependencies?.[packageNameToRead] ??
    rootPackage.devDependencies?.[packageNameToRead] ??
    rootPackage.peerDependencies?.[packageNameToRead]
  );
}

const dependencies = Object.fromEntries(
  requiredRuntimePackages.map((dependencyName) => {
    const version = getVersion(dependencyName);

    if (!version) {
      throw new Error(
        `The root package does not declare the required dependency: ${dependencyName}`,
      );
    }

    return [dependencyName, version];
  }),
);

dependencies[packageName] = `file:${tarballPath}`;

const devDependencies = Object.fromEntries(
  requiredDevPackages.map((dependencyName) => {
    const version = getVersion(dependencyName);

    if (!version) {
      throw new Error(
        `The root package does not declare the required dev dependency: ${dependencyName}`,
      );
    }

    return [dependencyName, version];
  }),
);

const consumerPackage = {
  name: 'sphere-visual-consumer-smoke',
  private: true,
  version: '0.0.0',
  type: 'module',
  scripts: {
    build: 'tsc --noEmit && vite build',
    dev: 'vite --host 127.0.0.1',
  },
  dependencies,
  devDependencies,
};

await writeFile(
  join(consumerDir, 'package.json'),
  `${JSON.stringify(consumerPackage, null, 2)}\n`,
  'utf8',
);

await writeFile(
  join(consumerDir, 'index.html'),
  `<!doctype html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>Sphere Visual consumer smoke test</title>\n  </head>\n  <body>\n    <div id="root"></div>\n    <script type="module" src="/src/main.tsx"></script>\n  </body>\n</html>\n`,
  'utf8',
);

await writeFile(
  join(consumerDir, 'tsconfig.json'),
  `${JSON.stringify(
    {
      compilerOptions: {
        target: 'ES2023',
        useDefineForClassFields: true,
        lib: ['ES2023', 'DOM', 'DOM.Iterable'],
        allowJs: false,
        skipLibCheck: true,
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        strict: true,
        forceConsistentCasingInFileNames: true,
        module: 'ESNext',
        moduleResolution: 'Bundler',
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        jsx: 'react-jsx',
        types: ['vite/client'],
      },
      include: ['src'],
    },
    null,
    2,
  )}\n`,
  'utf8',
);

await writeFile(
  join(consumerDir, 'vite.config.ts'),
  `import react from '@vitejs/plugin-react';\nimport { defineConfig } from 'vite';\n\nexport default defineConfig({\n  plugins: [react()],\n});\n`,
  'utf8',
);

await writeFile(
  join(srcDir, 'main.tsx'),
  `import { StrictMode } from 'react';\nimport { createRoot } from 'react-dom/client';\nimport '${packageName}/style.css';\nimport './styles.css';\nimport App from './App';\n\ncreateRoot(document.getElementById('root')!).render(\n  <StrictMode>\n    <App />\n  </StrictMode>,\n);\n`,
  'utf8',
);

await writeFile(
  join(srcDir, 'App.tsx'),
  `import { OrbitalVisual, SphereVisual } from '${packageName}';\n\nexport default function App() {\n  return (\n    <main className="page">\n      <header className="hero">\n        <p className="eyebrow">Consumer smoke test</p>\n        <h1>Public package imports</h1>\n        <p>Both visuals below are imported only from the packed library.</p>\n      </header>\n\n      <section className="grid">\n        <article className="card">\n          <h2>SphereVisual</h2>\n          <div className="visualStage">\n            <SphereVisual\n              size={340}\n              preset="glass-petal"\n              mode="thinking"\n              quality="medium"\n              background="transparent"\n            />\n          </div>\n        </article>\n\n        <article className="card">\n          <h2>OrbitalVisual</h2>\n          <div className="visualStage">\n            <OrbitalVisual\n              size={340}\n              preset="portal-gate"\n              quality="medium"\n              background="transparent"\n            />\n          </div>\n        </article>\n      </section>\n    </main>\n  );\n}\n`,
  'utf8',
);

await writeFile(
  join(srcDir, 'styles.css'),
  `:root {\n  font-family: Inter, ui-sans-serif, system-ui, sans-serif;\n  color: #eef5ff;\n  background: #050812;\n  font-synthesis: none;\n  text-rendering: optimizeLegibility;\n}\n\n* {\n  box-sizing: border-box;\n}\n\nbody {\n  min-width: 320px;\n  min-height: 100vh;\n  margin: 0;\n  background:\n    radial-gradient(circle at 24% 20%, rgba(72, 91, 255, 0.18), transparent 36%),\n    radial-gradient(circle at 78% 12%, rgba(86, 226, 255, 0.14), transparent 34%),\n    #050812;\n}\n\nbutton,\ninput,\ntextarea,\nselect {\n  font: inherit;\n}\n\n.page {\n  width: min(1120px, calc(100% - 32px));\n  margin: 0 auto;\n  padding: 64px 0 80px;\n}\n\n.hero {\n  max-width: 720px;\n  margin-bottom: 36px;\n}\n\n.eyebrow {\n  margin: 0 0 8px;\n  color: #7ee8ff;\n  font-size: 0.78rem;\n  font-weight: 700;\n  letter-spacing: 0.16em;\n  text-transform: uppercase;\n}\n\nh1,\nh2,\np {\n  margin-top: 0;\n}\n\nh1 {\n  margin-bottom: 12px;\n  font-size: clamp(2rem, 6vw, 4rem);\n  line-height: 0.98;\n}\n\n.hero p:last-child {\n  color: rgba(238, 245, 255, 0.72);\n}\n\n.grid {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 24px;\n}\n\n.card {\n  min-width: 0;\n  padding: 24px;\n  border: 1px solid rgba(150, 195, 255, 0.18);\n  border-radius: 24px;\n  background: rgba(10, 16, 34, 0.72);\n  box-shadow: 0 28px 70px rgba(0, 0, 0, 0.32);\n  backdrop-filter: blur(20px);\n}\n\n.card h2 {\n  margin-bottom: 16px;\n  font-size: 1rem;\n  letter-spacing: 0.04em;\n}\n\n.visualStage {\n  display: grid;\n  min-height: 390px;\n  place-items: center;\n  overflow: hidden;\n  border-radius: 18px;\n  background: radial-gradient(circle, rgba(32, 68, 134, 0.18), transparent 66%);\n}\n\n@media (max-width: 780px) {\n  .page {\n    padding-top: 40px;\n  }\n\n  .grid {\n    grid-template-columns: 1fr;\n  }\n\n  .visualStage {\n    min-height: 360px;\n  }\n}\n`,
  'utf8',
);

run(npmCommand, ['install', '--no-audit', '--no-fund'], consumerDir);
run(npmCommand, ['run', 'build'], consumerDir);

console.log('\nConsumer smoke test passed.');
console.log(`Packed library: ${basename(tarballPath)}`);
console.log(`Temporary consumer project: ${consumerDir}`);
console.log('The consumer compiled using package-level imports only.');
console.log(`To inspect it manually, run:\n  cd "${consumerDir}"\n  npm run dev`);
