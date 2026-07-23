import type { VisualCatalogOption } from '../../../shared/catalog/visualCatalog.types';
export type OrbitalPreviewKind = 'atom' | 'planet' | 'gyro' | 'portal';
export declare const orbitalObjectCatalog: readonly [{
    readonly id: "atomic-orb";
    readonly title: "Atomic Orb";
    readonly selectLabel: "atomic-orb — атомные системы";
    readonly eyebrow: "Orbital family 01";
    readonly description: "Светящиеся атомные системы с энергетическими орбитами, ядром и настраиваемыми электронами.";
    readonly defaultPreset: "atomic-orb";
    readonly presets: readonly [{
        readonly preset: "atomic-orb";
        readonly title: "atomic-orb";
        readonly selectLabel: "atomic-orb — базовый атом";
        readonly text: "Базовый атомный пресет: симметричные орбиты, яркое ядро и читаемые электроны.";
        readonly previewKind: "atom";
        readonly palette: {
            readonly core: "#ffffff";
            readonly glow: "#75e9ff";
            readonly accent: "#3f8fff";
        };
    }, {
        readonly preset: "atomic-orb-no-electrons";
        readonly title: "atomic-orb-no-electrons";
        readonly selectLabel: "atomic-orb-no-electrons — без электронов";
        readonly text: "Тот же базовый атом, но без электронов — более чистый и графичный orbital-вариант.";
        readonly previewKind: "atom";
        readonly palette: {
            readonly core: "#effcff";
            readonly glow: "#70dcff";
            readonly accent: "#3976df";
        };
    }, {
        readonly preset: "atomic-orb-more-electrons";
        readonly title: "atomic-orb-more-electrons";
        readonly selectLabel: "atomic-orb-more-electrons — больше электронов";
        readonly text: "Версия с заметно большим количеством электронов и более активным визуальным ритмом.";
        readonly previewKind: "atom";
        readonly palette: {
            readonly core: "#ffffff";
            readonly glow: "#8cf4ff";
            readonly accent: "#4f91ff";
        };
    }, {
        readonly preset: "atomic-orb-white";
        readonly title: "atomic-orb-white";
        readonly selectLabel: "atomic-orb-white — белый вариант";
        readonly text: "Более белый и холодный вариант атома — светлый, аккуратный и почти crystalline по настроению.";
        readonly previewKind: "atom";
        readonly palette: {
            readonly core: "#ffffff";
            readonly glow: "#e5f7ff";
            readonly accent: "#7fbce2";
        };
    }, {
        readonly preset: "atomic-orb-violet";
        readonly title: "atomic-orb-violet";
        readonly selectLabel: "atomic-orb-violet — фиолетовый вариант";
        readonly text: "Фиолетовый вариант атома с более мягким sci-fi / tech-art характером.";
        readonly previewKind: "atom";
        readonly palette: {
            readonly core: "#fff8ff";
            readonly glow: "#e092ff";
            readonly accent: "#725dff";
        };
    }];
}, {
    readonly id: "ring-planet";
    readonly title: "Ring Planet";
    readonly selectLabel: "ring-planet — кольцевые планеты";
    readonly eyebrow: "Orbital family 02";
    readonly description: "Кольцевые планеты с отдельным планетарным ядром, слоями колец и декоративной звёздной пылью.";
    readonly defaultPreset: "ring-planet";
    readonly presets: readonly [{
        readonly preset: "ring-planet";
        readonly title: "ring-planet";
        readonly selectLabel: "ring-planet — сдержанная планета";
        readonly text: "Сдержанная планета без частиц: крупное ядро, читаемые кольца и более спокойный космический характер.";
        readonly previewKind: "planet";
        readonly palette: {
            readonly core: "#4ea7ff";
            readonly glow: "#2d72ff";
            readonly accent: "#173f9e";
        };
    }, {
        readonly preset: "ring-planet-stardust";
        readonly title: "ring-planet-stardust";
        readonly selectLabel: "ring-planet-stardust — планета со звёздной пылью";
        readonly text: "Декоративная версия планеты с мерцающей пылью на передней и задней частях колец.";
        readonly previewKind: "planet";
        readonly palette: {
            readonly core: "#58b0ff";
            readonly glow: "#7edfff";
            readonly accent: "#2857d1";
        };
    }, {
        readonly preset: "ring-planet-sand";
        readonly title: "ring-planet-sand";
        readonly selectLabel: "ring-planet-sand — песочная планета";
        readonly text: "Тёплая песочно-карамельная планета без частиц — спокойный и более премиальный вариант.";
        readonly previewKind: "planet";
        readonly palette: {
            readonly core: "#d89442";
            readonly glow: "#bd6c2f";
            readonly accent: "#6b321d";
        };
    }, {
        readonly preset: "ring-planet-sand-stardust";
        readonly title: "ring-planet-sand-stardust";
        readonly selectLabel: "ring-planet-sand-stardust — песочная планета с пылью";
        readonly text: "Песочная планета с редкой кремово-золотистой пылью и более медленным движением.";
        readonly previewKind: "planet";
        readonly palette: {
            readonly core: "#e4a04d";
            readonly glow: "#ffd58a";
            readonly accent: "#7d4325";
        };
    }, {
        readonly preset: "ring-planet-ice";
        readonly title: "ring-planet-ice";
        readonly selectLabel: "ring-planet-ice — ледяная планета";
        readonly text: "Ледяная версия с меньшим ядром, более широкими тонкими кольцами и редкой холодной пылью.";
        readonly previewKind: "planet";
        readonly palette: {
            readonly core: "#b8eaff";
            readonly glow: "#61cfff";
            readonly accent: "#28678f";
        };
    }, {
        readonly preset: "ring-planet-eclipse";
        readonly title: "ring-planet-eclipse";
        readonly selectLabel: "ring-planet-eclipse — затмение";
        readonly text: "Тёмная драматичная планета с близкими бронзовыми кольцами и редкими янтарными искрами.";
        readonly previewKind: "planet";
        readonly palette: {
            readonly core: "#8b3a1d";
            readonly glow: "#f1722d";
            readonly accent: "#32150f";
        };
    }];
}, {
    readonly id: "gyro-core";
    readonly title: "Gyro Core";
    readonly selectLabel: "gyro-core — механические ядра";
    readonly eyebrow: "Orbital family 03";
    readonly description: "Механические ядра с сегментированными кольцами, световыми дорожками и независимой пространственной хореографией.";
    readonly defaultPreset: "gyro-core";
    readonly presets: readonly [{
        readonly preset: "gyro-core";
        readonly title: "gyro-core";
        readonly selectLabel: "gyro-core — базовое гироскопическое ядро";
        readonly text: "Базовое механическое ядро: три сегментированных кольца в разных плоскостях, холодные световые дорожки и независимое контрвращение.";
        readonly previewKind: "gyro";
        readonly palette: {
            readonly core: "#eaffff";
            readonly glow: "#64efff";
            readonly accent: "#1b6977";
        };
    }, {
        readonly preset: "gyro-core-precision";
        readonly title: "gyro-core-precision";
        readonly selectLabel: "gyro-core-precision — ледяное ядро";
        readonly text: "Ледяной вариант: более тонкие кольца, мягкое бело-голубое ядро и спокойная механическая хореография.";
        readonly previewKind: "gyro";
        readonly palette: {
            readonly core: "#f3fcff";
            readonly glow: "#9fe8ff";
            readonly accent: "#6e91a8";
        };
    }, {
        readonly preset: "gyro-core-reactor";
        readonly title: "gyro-core-reactor";
        readonly selectLabel: "gyro-core-reactor — реакторное ядро";
        readonly text: "Активный реакторный вариант: увеличенное фиолетово-лазурное ядро, яркие дорожки и более энергичное движение.";
        readonly previewKind: "gyro";
        readonly palette: {
            readonly core: "#eee5ff";
            readonly glow: "#68e9ff";
            readonly accent: "#764cb2";
        };
    }, {
        readonly preset: "gyro-core-amber";
        readonly title: "gyro-core-amber";
        readonly selectLabel: "gyro-core-amber — янтарное ядро";
        readonly text: "Тёплый механический вариант: бронзовые кольца, янтарное ядро и более тяжёлое, размеренное вращение.";
        readonly previewKind: "gyro";
        readonly palette: {
            readonly core: "#ffe1ad";
            readonly glow: "#f4a348";
            readonly accent: "#75472b";
        };
    }];
}, {
    readonly id: "portal-gate";
    readonly title: "Portal Gate";
    readonly selectLabel: "portal-gate — энергетические порталы";
    readonly eyebrow: "Orbital family 04";
    readonly description: "Энергетические порталы с объёмной сегментированной рамой, независимыми кольцами и процедурной мембраной.";
    readonly defaultPreset: "portal-gate";
    readonly presets: readonly [{
        readonly preset: "portal-gate";
        readonly title: "portal-gate";
        readonly selectLabel: "portal-gate — базовый энергетический портал";
        readonly text: "Базовый холодный портал: сегментированные концентрические кольца, живая энергетическая мембрана и независимое вращение слоёв.";
        readonly previewKind: "portal";
        readonly palette: {
            readonly core: "#efffff";
            readonly glow: "#4ee1ff";
            readonly accent: "#2d5bd6";
        };
    }, {
        readonly preset: "portal-gate-violet";
        readonly title: "portal-gate-violet";
        readonly selectLabel: "portal-gate-violet — фиолетовый портал";
        readonly text: "Более активный фиолетово-лазурный портал с усиленной турбулентностью мембраны и более быстрым движением колец.";
        readonly previewKind: "portal";
        readonly palette: {
            readonly core: "#fff5ff";
            readonly glow: "#b969ff";
            readonly accent: "#454fe8";
        };
    }, {
        readonly preset: "portal-gate-ember";
        readonly title: "portal-gate-ember";
        readonly selectLabel: "portal-gate-ember — янтарный портал";
        readonly text: "Тёплый тяжёлый вариант: массивные янтарно-бронзовые сегменты, более медленное вращение и огненная энергетическая глубина.";
        readonly previewKind: "portal";
        readonly palette: {
            readonly core: "#fff0c2";
            readonly glow: "#ff9234";
            readonly accent: "#8e3020";
        };
    }];
}];
export type OrbitalObjectCatalogItem = (typeof orbitalObjectCatalog)[number];
export type OrbitalPresetCatalogItem = OrbitalObjectCatalogItem['presets'][number];
export type OrbitalObjectId = OrbitalObjectCatalogItem['id'];
export type OrbitalPresetName = OrbitalPresetCatalogItem['preset'];
export declare const orbitalPresetNames: readonly OrbitalPresetName[];
export declare const orbitalObjectOptions: readonly VisualCatalogOption<OrbitalObjectId>[];
export declare function getOrbitalObjectById(objectId: OrbitalObjectId): {
    readonly id: "atomic-orb";
    readonly title: "Atomic Orb";
    readonly selectLabel: "atomic-orb — атомные системы";
    readonly eyebrow: "Orbital family 01";
    readonly description: "Светящиеся атомные системы с энергетическими орбитами, ядром и настраиваемыми электронами.";
    readonly defaultPreset: "atomic-orb";
    readonly presets: readonly [{
        readonly preset: "atomic-orb";
        readonly title: "atomic-orb";
        readonly selectLabel: "atomic-orb — базовый атом";
        readonly text: "Базовый атомный пресет: симметричные орбиты, яркое ядро и читаемые электроны.";
        readonly previewKind: "atom";
        readonly palette: {
            readonly core: "#ffffff";
            readonly glow: "#75e9ff";
            readonly accent: "#3f8fff";
        };
    }, {
        readonly preset: "atomic-orb-no-electrons";
        readonly title: "atomic-orb-no-electrons";
        readonly selectLabel: "atomic-orb-no-electrons — без электронов";
        readonly text: "Тот же базовый атом, но без электронов — более чистый и графичный orbital-вариант.";
        readonly previewKind: "atom";
        readonly palette: {
            readonly core: "#effcff";
            readonly glow: "#70dcff";
            readonly accent: "#3976df";
        };
    }, {
        readonly preset: "atomic-orb-more-electrons";
        readonly title: "atomic-orb-more-electrons";
        readonly selectLabel: "atomic-orb-more-electrons — больше электронов";
        readonly text: "Версия с заметно большим количеством электронов и более активным визуальным ритмом.";
        readonly previewKind: "atom";
        readonly palette: {
            readonly core: "#ffffff";
            readonly glow: "#8cf4ff";
            readonly accent: "#4f91ff";
        };
    }, {
        readonly preset: "atomic-orb-white";
        readonly title: "atomic-orb-white";
        readonly selectLabel: "atomic-orb-white — белый вариант";
        readonly text: "Более белый и холодный вариант атома — светлый, аккуратный и почти crystalline по настроению.";
        readonly previewKind: "atom";
        readonly palette: {
            readonly core: "#ffffff";
            readonly glow: "#e5f7ff";
            readonly accent: "#7fbce2";
        };
    }, {
        readonly preset: "atomic-orb-violet";
        readonly title: "atomic-orb-violet";
        readonly selectLabel: "atomic-orb-violet — фиолетовый вариант";
        readonly text: "Фиолетовый вариант атома с более мягким sci-fi / tech-art характером.";
        readonly previewKind: "atom";
        readonly palette: {
            readonly core: "#fff8ff";
            readonly glow: "#e092ff";
            readonly accent: "#725dff";
        };
    }];
} | {
    readonly id: "ring-planet";
    readonly title: "Ring Planet";
    readonly selectLabel: "ring-planet — кольцевые планеты";
    readonly eyebrow: "Orbital family 02";
    readonly description: "Кольцевые планеты с отдельным планетарным ядром, слоями колец и декоративной звёздной пылью.";
    readonly defaultPreset: "ring-planet";
    readonly presets: readonly [{
        readonly preset: "ring-planet";
        readonly title: "ring-planet";
        readonly selectLabel: "ring-planet — сдержанная планета";
        readonly text: "Сдержанная планета без частиц: крупное ядро, читаемые кольца и более спокойный космический характер.";
        readonly previewKind: "planet";
        readonly palette: {
            readonly core: "#4ea7ff";
            readonly glow: "#2d72ff";
            readonly accent: "#173f9e";
        };
    }, {
        readonly preset: "ring-planet-stardust";
        readonly title: "ring-planet-stardust";
        readonly selectLabel: "ring-planet-stardust — планета со звёздной пылью";
        readonly text: "Декоративная версия планеты с мерцающей пылью на передней и задней частях колец.";
        readonly previewKind: "planet";
        readonly palette: {
            readonly core: "#58b0ff";
            readonly glow: "#7edfff";
            readonly accent: "#2857d1";
        };
    }, {
        readonly preset: "ring-planet-sand";
        readonly title: "ring-planet-sand";
        readonly selectLabel: "ring-planet-sand — песочная планета";
        readonly text: "Тёплая песочно-карамельная планета без частиц — спокойный и более премиальный вариант.";
        readonly previewKind: "planet";
        readonly palette: {
            readonly core: "#d89442";
            readonly glow: "#bd6c2f";
            readonly accent: "#6b321d";
        };
    }, {
        readonly preset: "ring-planet-sand-stardust";
        readonly title: "ring-planet-sand-stardust";
        readonly selectLabel: "ring-planet-sand-stardust — песочная планета с пылью";
        readonly text: "Песочная планета с редкой кремово-золотистой пылью и более медленным движением.";
        readonly previewKind: "planet";
        readonly palette: {
            readonly core: "#e4a04d";
            readonly glow: "#ffd58a";
            readonly accent: "#7d4325";
        };
    }, {
        readonly preset: "ring-planet-ice";
        readonly title: "ring-planet-ice";
        readonly selectLabel: "ring-planet-ice — ледяная планета";
        readonly text: "Ледяная версия с меньшим ядром, более широкими тонкими кольцами и редкой холодной пылью.";
        readonly previewKind: "planet";
        readonly palette: {
            readonly core: "#b8eaff";
            readonly glow: "#61cfff";
            readonly accent: "#28678f";
        };
    }, {
        readonly preset: "ring-planet-eclipse";
        readonly title: "ring-planet-eclipse";
        readonly selectLabel: "ring-planet-eclipse — затмение";
        readonly text: "Тёмная драматичная планета с близкими бронзовыми кольцами и редкими янтарными искрами.";
        readonly previewKind: "planet";
        readonly palette: {
            readonly core: "#8b3a1d";
            readonly glow: "#f1722d";
            readonly accent: "#32150f";
        };
    }];
} | {
    readonly id: "gyro-core";
    readonly title: "Gyro Core";
    readonly selectLabel: "gyro-core — механические ядра";
    readonly eyebrow: "Orbital family 03";
    readonly description: "Механические ядра с сегментированными кольцами, световыми дорожками и независимой пространственной хореографией.";
    readonly defaultPreset: "gyro-core";
    readonly presets: readonly [{
        readonly preset: "gyro-core";
        readonly title: "gyro-core";
        readonly selectLabel: "gyro-core — базовое гироскопическое ядро";
        readonly text: "Базовое механическое ядро: три сегментированных кольца в разных плоскостях, холодные световые дорожки и независимое контрвращение.";
        readonly previewKind: "gyro";
        readonly palette: {
            readonly core: "#eaffff";
            readonly glow: "#64efff";
            readonly accent: "#1b6977";
        };
    }, {
        readonly preset: "gyro-core-precision";
        readonly title: "gyro-core-precision";
        readonly selectLabel: "gyro-core-precision — ледяное ядро";
        readonly text: "Ледяной вариант: более тонкие кольца, мягкое бело-голубое ядро и спокойная механическая хореография.";
        readonly previewKind: "gyro";
        readonly palette: {
            readonly core: "#f3fcff";
            readonly glow: "#9fe8ff";
            readonly accent: "#6e91a8";
        };
    }, {
        readonly preset: "gyro-core-reactor";
        readonly title: "gyro-core-reactor";
        readonly selectLabel: "gyro-core-reactor — реакторное ядро";
        readonly text: "Активный реакторный вариант: увеличенное фиолетово-лазурное ядро, яркие дорожки и более энергичное движение.";
        readonly previewKind: "gyro";
        readonly palette: {
            readonly core: "#eee5ff";
            readonly glow: "#68e9ff";
            readonly accent: "#764cb2";
        };
    }, {
        readonly preset: "gyro-core-amber";
        readonly title: "gyro-core-amber";
        readonly selectLabel: "gyro-core-amber — янтарное ядро";
        readonly text: "Тёплый механический вариант: бронзовые кольца, янтарное ядро и более тяжёлое, размеренное вращение.";
        readonly previewKind: "gyro";
        readonly palette: {
            readonly core: "#ffe1ad";
            readonly glow: "#f4a348";
            readonly accent: "#75472b";
        };
    }];
} | {
    readonly id: "portal-gate";
    readonly title: "Portal Gate";
    readonly selectLabel: "portal-gate — энергетические порталы";
    readonly eyebrow: "Orbital family 04";
    readonly description: "Энергетические порталы с объёмной сегментированной рамой, независимыми кольцами и процедурной мембраной.";
    readonly defaultPreset: "portal-gate";
    readonly presets: readonly [{
        readonly preset: "portal-gate";
        readonly title: "portal-gate";
        readonly selectLabel: "portal-gate — базовый энергетический портал";
        readonly text: "Базовый холодный портал: сегментированные концентрические кольца, живая энергетическая мембрана и независимое вращение слоёв.";
        readonly previewKind: "portal";
        readonly palette: {
            readonly core: "#efffff";
            readonly glow: "#4ee1ff";
            readonly accent: "#2d5bd6";
        };
    }, {
        readonly preset: "portal-gate-violet";
        readonly title: "portal-gate-violet";
        readonly selectLabel: "portal-gate-violet — фиолетовый портал";
        readonly text: "Более активный фиолетово-лазурный портал с усиленной турбулентностью мембраны и более быстрым движением колец.";
        readonly previewKind: "portal";
        readonly palette: {
            readonly core: "#fff5ff";
            readonly glow: "#b969ff";
            readonly accent: "#454fe8";
        };
    }, {
        readonly preset: "portal-gate-ember";
        readonly title: "portal-gate-ember";
        readonly selectLabel: "portal-gate-ember — янтарный портал";
        readonly text: "Тёплый тяжёлый вариант: массивные янтарно-бронзовые сегменты, более медленное вращение и огненная энергетическая глубина.";
        readonly previewKind: "portal";
        readonly palette: {
            readonly core: "#fff0c2";
            readonly glow: "#ff9234";
            readonly accent: "#8e3020";
        };
    }];
};
export declare function getOrbitalObjectIdForPreset(preset: OrbitalPresetName): OrbitalObjectId;
export declare function getOrbitalPresetOptions(objectId: OrbitalObjectId): readonly VisualCatalogOption<OrbitalPresetName>[];
//# sourceMappingURL=orbitalCatalog.d.ts.map