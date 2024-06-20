import { ChangeDetectorRef } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import * as i0 from '@angular/core';
export type MtxLoaderType = 'spinner' | 'progressbar';
export declare class MtxLoader {
  private _changeDetectorRef;
  /** The loader's type. Can be `spinner` or `progressbar` */
  type: MtxLoaderType;
  /** Theme color palette for the component. */
  color: ThemePalette;
  /** Mode of the progress circle or the progress bar. */
  mode: ProgressSpinnerMode | ProgressBarMode;
  /** Stroke width of the spinner loader. */
  strokeWidth: number;
  /** The diameter of the spinner loader (will set width and height of svg). */
  diameter: number;
  /** Buffer value of the progressbar loader. */
  bufferValue: number;
  /** Value of the progress circle or the progress bar. */
  value: number;
  /** Whether the loader is loading. */
  loading: boolean;
  /** Whether the loader has a backdrop. */
  hasBackdrop: boolean;
  constructor(_changeDetectorRef: ChangeDetectorRef);
  static ɵfac: i0.ɵɵFactoryDeclaration<MtxLoader, never>;
  static ɵcmp: i0.ɵɵComponentDeclaration<
    MtxLoader,
    'mtx-loader',
    ['mtxLoader'],
    {
      type: { alias: 'type'; required: false };
      color: { alias: 'color'; required: false };
      mode: { alias: 'mode'; required: false };
      strokeWidth: { alias: 'strokeWidth'; required: false };
      diameter: { alias: 'diameter'; required: false };
      bufferValue: { alias: 'bufferValue'; required: false };
      value: { alias: 'value'; required: false };
      loading: { alias: 'loading'; required: false };
      hasBackdrop: { alias: 'hasBackdrop'; required: false };
    },
    {},
    never,
    ['*'],
    true,
    never
  >;
  static ngAcceptInputType_loading: unknown;
  static ngAcceptInputType_hasBackdrop: unknown;
}
