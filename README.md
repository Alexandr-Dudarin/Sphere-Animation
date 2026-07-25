# Sphere Visual Lab

[![CI](https://github.com/Alexandr-Dudarin/Sphere-Animation/actions/workflows/ci.yml/badge.svg)](https://github.com/Alexandr-Dudarin/Sphere-Animation/actions/workflows/ci.yml)

[Живое демо](https://sphere-visual-lab.vercel.app/) · [Документация библиотеки](./sphere-visual-lab/README.md)

Переиспользуемая библиотека анимированных WebGL-визуалов для React, Three.js и React Three Fiber.

Проект включает две визуальные системы:

- **SphereVisual** — стеклянные светящиеся сферы с лепестковой структурой;
- **OrbitalVisual** — атомы, кольцевые планеты, механические ядра и энергетические порталы.

Исходный пакет находится в каталоге [`sphere-visual-lab`](./sphere-visual-lab). Там же размещены инструкция по установке, примеры интеграции, список props и пресетов, команды сборки и подготовка npm-релиза `0.1.0`.

## Локальный запуск

```bash
cd sphere-visual-lab
npm install
npm run dev -- --host 127.0.0.1 --port 5173
```

## Текущий статус

- живое демо опубликовано на Vercel;
- library-сборка формирует JavaScript, CSS и TypeScript-декларации;
- настроены unit/component tests, Playwright E2E и consumer package smoke test;
- добавлены npm-метаданные и MIT License;
- следующий этап — финальная проверка архива и публикация версии `0.1.0`.

## Лицензия

Проект распространяется по лицензии [MIT](./LICENSE).
