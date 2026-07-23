export interface PreviewPalette {
  core: string;
  glow: string;
  accent: string;
}

export interface VisualCatalogOption<T extends string> {
  value: T;
  label: string;
}
