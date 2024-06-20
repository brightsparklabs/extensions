import { ElementRef, OnChanges, Renderer2, SimpleChanges, ViewContainerRef } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import * as i0 from '@angular/core';
export declare class MatButtonLoading implements OnChanges {
  private _elementRef;
  private _viewContainerRef;
  private _renderer;
  private spinner;
  loading: boolean;
  disabled: boolean;
  color: ThemePalette;
  constructor(
    _elementRef: ElementRef<HTMLButtonElement>,
    _viewContainerRef: ViewContainerRef,
    _renderer: Renderer2
  );
  ngOnChanges(changes: SimpleChanges): void;
  private createSpinner;
  private destroySpinner;
  static ɵfac: i0.ɵɵFactoryDeclaration<MatButtonLoading, never>;
  static ɵdir: i0.ɵɵDirectiveDeclaration<
    MatButtonLoading,
    '[mat-button][loading],             [mat-raised-button][loading],             [mat-stroked-button][loading],             [mat-flat-button][loading],             [mat-icon-button][loading],             [mat-fab][loading],             [mat-mini-fab][loading]',
    never,
    {
      loading: { alias: 'loading'; required: false };
      disabled: { alias: 'disabled'; required: false };
      color: { alias: 'color'; required: false };
    },
    {},
    never,
    never,
    true,
    never
  >;
  static ngAcceptInputType_loading: unknown;
  static ngAcceptInputType_disabled: unknown;
}
