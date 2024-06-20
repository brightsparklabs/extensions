import { ElementRef, NgZone, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { MtxSplit } from './split';
import * as i0 from '@angular/core';
export declare class MtxSplitPane implements OnInit, OnDestroy {
  private ngZone;
  elRef: ElementRef;
  private renderer;
  private split;
  /**
   * Order of the area. Used to maintain the order of areas when toggling their visibility.
   * Toggling area visibility without specifying an `order` leads to weird behavior.
   */
  get order(): number | null;
  set order(v: number | null);
  private _order;
  /**
   * Size of the area in selected unit (percent/pixel).
   * - Percent: All areas sizes should equal to `100`, If not, all areas will have the same size.
   * - Pixel: An area with wildcard size (`size="*"`) is mandatory (only one) and
   *   can't have `visible="false"` or `minSize`/`maxSize`/`lockSize` properties.
   */
  get size(): number | null;
  set size(v: number | null);
  private _size;
  /** Minimum pixel or percent size, should be equal to or smaller than provided `size`. */
  get minSize(): number | null;
  set minSize(v: number | null);
  private _minSize;
  /** Maximum pixel or percent size, should be equal to or larger than provided `size`. */
  get maxSize(): number | null;
  set maxSize(v: number | null);
  private _maxSize;
  /** Lock area size, same as `minSize`=`maxSize`=`size`. */
  get lockSize(): boolean;
  set lockSize(v: boolean);
  private _lockSize;
  /** Hide area visually but still present in the DOM, use `ngIf` to completely remove it. */
  get visible(): boolean;
  set visible(v: boolean);
  private _visible;
  private transitionListener;
  private readonly lockListeners;
  constructor(ngZone: NgZone, elRef: ElementRef, renderer: Renderer2, split: MtxSplit);
  ngOnInit(): void;
  setStyleOrder(value: number): void;
  setStyleFlex(grow: number, shrink: number, basis: string, isMin: boolean, isMax: boolean): void;
  lockEvents(): void;
  unlockEvents(): void;
  ngOnDestroy(): void;
  static ɵfac: i0.ɵɵFactoryDeclaration<MtxSplitPane, never>;
  static ɵdir: i0.ɵɵDirectiveDeclaration<
    MtxSplitPane,
    'mtx-split-pane, [mtx-split-pane]',
    ['mtxSplitPane'],
    {
      order: { alias: 'order'; required: false };
      size: { alias: 'size'; required: false };
      minSize: { alias: 'minSize'; required: false };
      maxSize: { alias: 'maxSize'; required: false };
      lockSize: { alias: 'lockSize'; required: false };
      visible: { alias: 'visible'; required: false };
    },
    {},
    never,
    never,
    true,
    never
  >;
  static ngAcceptInputType_lockSize: unknown;
  static ngAcceptInputType_visible: unknown;
}
