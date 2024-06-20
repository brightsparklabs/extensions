import { ThemePalette } from '@angular/material/core';
import { MtxSplitPane } from './split-pane';
export interface MtxSplitPoint {
  x: number;
  y: number;
}
export interface MtxSplitArea {
  component: MtxSplitPane;
  order: number;
  size: number | null;
  minSize: number | null;
  maxSize: number | null;
}
export interface MtxSplitSnapshot {
  gutterNum: number;
  allAreasSizePixel: number;
  allInvolvedAreasSizePercent: number;
  lastSteppedOffset: number;
  areasBeforeGutter: Array<MtxSplitAreaSnapshot>;
  areasAfterGutter: Array<MtxSplitAreaSnapshot>;
}
export interface MtxSplitAreaSnapshot {
  area: MtxSplitArea;
  sizePixelAtStart: number;
  sizePercentAtStart: number;
}
export interface MtxSplitSideAbsorptionCapacity {
  remain: number;
  list: Array<MtxSplitAreaAbsorptionCapacity>;
}
export interface MtxSplitAreaAbsorptionCapacity {
  areaSnapshot: MtxSplitAreaSnapshot;
  pixelAbsorb: number;
  percentAfterAbsorption: number;
  pixelRemain: number;
}
export interface MtxSplitOutputData {
  gutterNum: number;
  sizes: MtxSplitOutputAreaSizes;
}
export type MtxSplitOutputAreaSizes = Array<number | '*'>;
export interface MtxSplitDefaultOptions {
  color?: ThemePalette;
  dir?: 'ltr' | 'rtl';
  direction?: 'horizontal' | 'vertical';
  unit?: 'percent' | 'pixel';
  gutterDblClickDuration?: number;
  gutterSize?: number;
  gutterStep?: number;
  restrictMove?: boolean;
  useTransition?: boolean;
}
