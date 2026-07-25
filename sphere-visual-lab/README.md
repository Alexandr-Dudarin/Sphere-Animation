# Sphere Visual Lab

[![CI](https://github.com/Alexandr-Dudarin/Sphere-Animation/actions/workflows/ci.yml/badge.svg)](https://github.com/Alexandr-Dudarin/Sphere-Animation/actions/workflows/ci.yml)

[Живое демо](https://sphere-visual-lab.vercel.app/) · [Репозиторий](https://github.com/Alexandr-Dudarin/Sphere-Animation)

Переиспользуемая библиотека анимированных WebGL-визуалов для React, Three.js и React Three Fiber.

В библиотеке две визуальные системы:

- **SphereVisual** — стеклянные светящиеся сферы с лепестковой структурой, интерактивной реакцией на курсор и несколькими режимами анимации;
- **OrbitalVisual** — атомные системы, кольцевые планеты, механические ядра и энергетические порталы.

Демонстрационная витрина позволяет переключать пресеты, размер, качество, интенсивность свечения, скорость и фон. Сами компоненты отделены от demo-слоя и могут использоваться внутри других React-проектов.

## Установка

```bash
npm install sphere-visual-lab three @react-three/fiber @react-three/drei
```

Проект-потребитель должен использовать React 19 и React DOM 19.

Поддерживаемые peer dependencies:

```text
react: ^19.0.0
react-dom: ^19.0.0
three: ^0.184.0
@react-three/fiber: ^9.6.0
@react-three/drei: ^10.7.7
```

## Быстрый старт

Подключите стили пакета один раз в точке входа приложения:

```tsx
import 'sphere-visual-lab/style.css';
```

Затем используйте нужный компонент:

```tsx
import { OrbitalVisual, SphereVisual } from 'sphere-visual-lab';
import 'sphere-visual-lab/style.css';

export function VisualExample() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        gap: 24,
        background: '#050812',
      }}
    >
      <SphereVisual
        size={420}
        preset="glass-petal"
        mode="thinking"
        quality="high"
        glowIntensity="high"
        background="transparent"
      />

      <OrbitalVisual
        size={420}
        preset="portal-gate"
        quality="high"
        glowIntensity="high"
        background="transparent"
      />
    </div>
  );
}
```

Фоны `studio`, `space` и `tech` относятся только к демонстрационной витрине. Компоненты библиотеки поддерживают собственный тёмный фон или прозрачность и могут размещаться поверх дизайна родительского проекта.

## Размер компонента и размер визуала

`width` и `height` задают размеры контейнера сцены. `size` управляет внутренним масштабом самого объекта.

```tsx
<div style={{ width: '100%', maxWidth: 560, aspectRatio: '1' }}>
  <OrbitalVisual
    width="100%"
    height="100%"
    size={420}
    preset="atomic-orb-violet"
    background="transparent"
  />
</div>
```

Так контейнер может адаптироваться к layout страницы, а сам визуал сохраняет управляемый масштаб и центрирование.

## SphereVisual

```tsx
<SphereVisual
  size={420}
  preset="thinking-blue"
  mode="thinking"
  quality="high"
  interactive
  glowIntensity="high"
  speed={1.1}
  background="transparent"
  renderer="three"
/>
```

### Основные props SphereVisual

| Prop | Тип | Значение по умолчанию | Назначение |
| --- | --- | --- | --- |
| `size` | `number` | `420` | Внутренний масштаб визуала и размер контейнера, если `width`/`height` не заданы |
| `width` | `number \| string` | `size` | Ширина контейнера сцены |
| `height` | `number \| string` | `size` | Высота контейнера сцены |
| `preset` | `SpherePresetName` | `glass-petal` | Внешний вид и палитра сферы |
| `mode` | `idle \| thinking \| searching` | `thinking` | Характер и темп анимации |
| `quality` | `low \| medium \| high` | `high` | Детализация сцены |
| `interactive` | `boolean` | `true` | Реакция на движение указателя |
| `glowIntensity` | `low \| medium \| high` | `high` | Интенсивность свечения |
| `speed` | `number` | `1.1` | Множитель скорости анимации |
| `background` | `transparent \| dark` | `dark` | Фон корневого контейнера |
| `renderer` | `three \| css` | `three` | WebGL-рендерер или облегчённый CSS-вариант |
| `frameloop` | `always \| demand \| never` | `always` | Режим обновления React Three Fiber |
| `className` | `string` | — | Дополнительный CSS-класс корневого контейнера |

### Пресеты SphereVisual

```text
glass-petal
soft-ai
thinking-blue
searching-violet
calm-pearl
neon-core
bio-glow
prism-bloom
```

Каталог и готовые опции доступны через публичный API:

```tsx
import {
  spherePresetCatalog,
  spherePresetNames,
  spherePresetOptions,
} from 'sphere-visual-lab';
```

## OrbitalVisual

```tsx
<OrbitalVisual
  size={420}
  preset="ring-planet-ice"
  quality="high"
  glowIntensity="medium"
  speed={1}
  background="transparent"
/>
```

### Основные props OrbitalVisual

| Prop | Тип | Значение по умолчанию | Назначение |
| --- | --- | --- | --- |
| `size` | `number` | `420` | Внутренний масштаб визуала и размер контейнера, если `width`/`height` не заданы |
| `width` | `number \| string` | `size` | Ширина контейнера сцены |
| `height` | `number \| string` | `size` | Высота контейнера сцены |
| `preset` | `OrbitalPresetName` | `atomic-orb` | Семейство, палитра и конфигурация объекта |
| `quality` | `low \| medium \| high` | `medium` | Детализация сцены |
| `glowIntensity` | `low \| medium \| high` | `medium` | Интенсивность свечения |
| `speed` | `number` | `1` | Множитель скорости анимации |
| `background` | `transparent \| dark` | `dark` | Фон корневого контейнера |
| `frameloop` | `always \| demand \| never` | `always` | Режим обновления React Three Fiber |
| `className` | `string` | — | Дополнительный CSS-класс корневого контейнера |

### Атомные системы

```text
atomic-orb
atomic-orb-no-electrons
atomic-orb-more-electrons
atomic-orb-white
atomic-orb-violet
```

### Кольцевые планеты

```text
ring-planet
ring-planet-stardust
ring-planet-sand
ring-planet-sand-stardust
ring-planet-ice
ring-planet-eclipse
```

### Механические ядра

```text
gyro-core
gyro-core-precision
gyro-core-reactor
gyro-core-amber
```

### Энергетические порталы

```text
portal-gate
portal-gate-violet
portal-gate-ember
```

Каталог orbital-объектов и функции для работы с пресетами также экспортируются:

```tsx
import {
  getOrbitalObjectById,
  getOrbitalObjectIdForPreset,
  getOrbitalPresetOptions,
  orbitalObjectCatalog,
  orbitalObjectOptions,
  orbitalPresetNames,
} from 'sphere-visual-lab';
```

## Публичные TypeScript-типы

Библиотека поставляется с декларациями TypeScript. Среди экспортируемых типов:

```text
SphereVisualProps
SpherePresetName
SphereMode
SphereQuality
SphereBackground
SphereRendererType
OrbitalVisualProps
OrbitalPresetName
OrbitalQuality
OrbitalBackground
OrbitalObjectId
OrbitalPresetCatalogItem
```

## Ключевые инженерные решения

### Библиотека отделена от демо

`SphereVisual` и `OrbitalVisual` не зависят от панелей управления, карточек и demo-фонов. Публичная точка входа находится в `src/index.ts`.

### Мини-карточки не создают отдельные WebGL-сцены

Для карточек пресетов используются лёгкие CSS-превью. Полноценная Three.js-сцена работает только в основной области выбранного объекта, поэтому витрина не создаёт десятки параллельных WebGL-контекстов.

### Orbital-код вынесен в отдельный chunk демо

Orbital-рендереры загружаются отдельно от начального кода демонстрационной страницы. Sphere доступна сразу, а Orbital подготавливается без возврата всего кода в первоначальный бандл.

### WebGL-рендер приостанавливается вне viewport

Удалённая от viewport Orbital-сцена переводится из постоянного `frameloop="always"` в `frameloop="demand"`. Сглаживание реакции Sphere на указатель также прекращает обновления после достижения целевого положения.

### Пакет проверяется как внешний потребитель

Library-сборка упаковывается через `npm pack`, устанавливается во временный чистый React/Vite-проект и проходит TypeScript-проверку и production build только через публичные импорты пакета.

## Стек

- React 19;
- TypeScript;
- Vite;
- Three.js;
- React Three Fiber;
- Drei;
- Vitest и Testing Library;
- Playwright;
- GitHub Actions.

## Что реализовано

- отдельные каталоги и пресеты Sphere и Orbital;
- настройка размера, качества, свечения, скорости и фона;
- адаптивная витрина для ноутбуков, планшетов и телефонов;
- сохранение demo-настроек в `localStorage`;
- публичный API через `src/index.ts`;
- отдельная library-сборка с JavaScript, CSS и TypeScript-декларациями;
- consumer smoke test с установкой `.tgz` в чистый React/Vite-проект;
- разделение demo-бандла и отдельный Orbital chunk;
- прогрев Orbital-сцены и пауза WebGL-рендера вне viewport;
- 47 unit- и component-тестов;
- 10 E2E-сценариев Playwright;
- CI после push и pull request.

## Локальный запуск репозитория

```bash
git clone https://github.com/Alexandr-Dudarin/Sphere-Animation.git
cd Sphere-Animation/sphere-visual-lab
npm install
npm run dev -- --host 127.0.0.1 --port 5173
```

Локальный адрес:

```text
http://127.0.0.1:5173
```

## Сборки и проверки

```bash
npm test
npm run build
npm run build:lib
npm run check:all
npm run test:e2e
npm run consumer:smoke
npm run pack:dry-run
```

### Демо-сборка

```text
dist/
```

### Library-сборка

```text
dist-lib/
  index.js
  index.js.map
  style.css
  types/
```

Перед `npm pack` и `npm publish` автоматически выполняется `prepack`, который заново собирает библиотеку и проверяет обязательные выходные файлы.

## Содержимое npm-пакета

Поле `files` ограничивает публикацию каталогом `dist-lib`. npm дополнительно включает обязательные служебные файлы пакета: `package.json`, `README.md` и `LICENSE`.

Основные публичные пути:

```text
sphere-visual-lab
sphere-visual-lab/style.css
```

## Структура исходного проекта

```text
src/
  components/
    SphereVisual/
    OrbitalVisual/
  demo/
  shared/
  app/
  index.ts
```

- `components` — переиспользуемые визуальные компоненты;
- `demo` — витрина, панели, карточки и demo-фоны;
- `shared` — общие стили, UI-компоненты и утилиты;
- `src/index.ts` — публичная точка входа библиотеки.

## Ближайшие этапы

1. Проверить содержимое архива через `npm pack --dry-run`.
2. Повторно пройти CI, E2E и consumer smoke test.
3. Опубликовать первую npm-версию `0.1.0`.
4. Подготовить отдельную английскую версию документации.
5. Позже усилить hover-анимации CSS-превью и добавить отдельный блок связи в демо.

## Лицензия

Проект распространяется по лицензии [MIT](./LICENSE).
