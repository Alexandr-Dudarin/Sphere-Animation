import type { SphereMode, SpherePresetName } from '../SphereVisual.types';
import type { PreviewPalette, VisualCatalogOption } from '../../../shared/catalog/visualCatalog.types';
export interface SpherePresetCatalogItem {
    preset: SpherePresetName;
    mode: SphereMode;
    title: string;
    selectLabel: string;
    text: string;
    palette: PreviewPalette;
}
export declare const spherePresetCatalog: readonly SpherePresetCatalogItem[];
export declare const spherePresetNames: readonly SpherePresetName[];
export declare const spherePresetOptions: readonly VisualCatalogOption<SpherePresetName>[];
//# sourceMappingURL=sphereCatalog.d.ts.map