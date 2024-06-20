import { ElementRef } from '@angular/core';
import {
  MtxSplitArea,
  MtxSplitPoint,
  MtxSplitAreaSnapshot,
  MtxSplitSideAbsorptionCapacity,
  MtxSplitAreaAbsorptionCapacity,
} from './interfaces';
export declare function getPointFromEvent(event: MouseEvent | TouchEvent): MtxSplitPoint | null;
export declare function getElementPixelSize(
  elRef: ElementRef,
  direction: 'horizontal' | 'vertical'
): number;
export declare function getInputPositiveNumber<T>(v: any, defaultValue: T): number | T;
export declare function isUserSizesValid(
  unit: 'percent' | 'pixel',
  sizes: Array<number>
): boolean | number | void;
export declare function getAreaMinSize(a: MtxSplitArea): null | number;
export declare function getAreaMaxSize(a: MtxSplitArea): null | number;
export declare function getGutterSideAbsorptionCapacity(
  unit: 'percent' | 'pixel',
  sideAreas: Array<MtxSplitAreaSnapshot>,
  pixels: number,
  allAreasSizePixel: number
): MtxSplitSideAbsorptionCapacity;
export declare function getAreaAbsorptionCapacity(
  unit: 'percent' | 'pixel',
  areaSnapshot: MtxSplitAreaSnapshot,
  pixels: number,
  allAreasSizePixel: number
): MtxSplitAreaAbsorptionCapacity | void;
export declare function getAreaAbsorptionCapacityPercent(
  areaSnapshot: MtxSplitAreaSnapshot,
  pixels: number,
  allAreasSizePixel: number
): MtxSplitAreaAbsorptionCapacity | void;
export declare function getAreaAbsorptionCapacityPixel(
  areaSnapshot: MtxSplitAreaSnapshot,
  pixels: number,
  containerSizePixel: number
): MtxSplitAreaAbsorptionCapacity | void;
export declare function updateAreaSize(
  unit: 'percent' | 'pixel',
  item: MtxSplitAreaAbsorptionCapacity
): void;
