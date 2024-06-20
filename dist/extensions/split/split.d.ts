import {
  AfterViewInit,
  ChangeDetectorRef,
  ElementRef,
  EventEmitter,
  InjectionToken,
  NgZone,
  OnDestroy,
  Renderer2,
} from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { Observable } from 'rxjs';
import {
  MtxSplitArea,
  MtxSplitDefaultOptions,
  MtxSplitOutputAreaSizes,
  MtxSplitOutputData,
} from './interfaces';
import { MtxSplitPane } from './split-pane';
import * as i0 from '@angular/core';
/** Injection token that can be used to specify default split options. */
export declare const MTX_SPLIT_DEFAULT_OPTIONS: InjectionToken<MtxSplitDefaultOptions>;
/**
 * mtx-split
 *
 *
 *  PERCENT MODE ([unit]="'percent'")
 *  ___________________________________________________________________________________________
 * |       A       [g1]       B       [g2]       C       [g3]       D       [g4]       E       |
 * |-------------------------------------------------------------------------------------------|
 * |       20                 30                 20                 15                 15      | <-- [size]="x"
 * |               10px               10px               10px               10px               | <-- [gutterSize]="10"
 * |calc(20% - 8px)    calc(30% - 12px)   calc(20% - 8px)    calc(15% - 6px)    calc(15% - 6px)| <-- CSS flex-basis property (with flex-grow&shrink at 0)
 * |     152px              228px              152px              114px              114px     | <-- el.getBoundingClientRect().width
 * |___________________________________________________________________________________________|
 *                                                                                 800px         <-- el.getBoundingClientRect().width
 *  flex-basis = calc( { area.size }% - { area.size/100 * nbGutter*gutterSize }px );
 *
 *
 *  PIXEL MODE ([unit]="'pixel'")
 *  ___________________________________________________________________________________________
 * |       A       [g1]       B       [g2]       C       [g3]       D       [g4]       E       |
 * |-------------------------------------------------------------------------------------------|
 * |      100                250                 *                 150                100      | <-- [size]="y"
 * |               10px               10px               10px               10px               | <-- [gutterSize]="10"
 * |   0 0 100px          0 0 250px           1 1 auto          0 0 150px          0 0 100px   | <-- CSS flex property (flex-grow/flex-shrink/flex-basis)
 * |     100px              250px              200px              150px              100px     | <-- el.getBoundingClientRect().width
 * |___________________________________________________________________________________________|
 *                                                                                 800px         <-- el.getBoundingClientRect().width
 *
 */
export declare class MtxSplit implements AfterViewInit, OnDestroy {
  private ngZone;
  private elRef;
  private cdRef;
  private renderer;
  protected _defaultOptions?: MtxSplitDefaultOptions | undefined;
  color: ThemePalette;
  /** The split direction. */
  get direction(): 'horizontal' | 'vertical';
  set direction(v: 'horizontal' | 'vertical');
  private _direction;
  /** The unit you want to specify area sizes. */
  get unit(): 'percent' | 'pixel';
  set unit(v: 'percent' | 'pixel');
  private _unit;
  /** Gutters's size (dragging elements) in pixels. */
  get gutterSize(): number;
  set gutterSize(v: number);
  private _gutterSize;
  /** Gutter step while moving in pixels. */
  get gutterStep(): number;
  set gutterStep(v: number);
  private _gutterStep;
  /** Set to true if you want to limit gutter move to adjacent areas only. */
  restrictMove: boolean;
  /** Add transition when toggling visibility using `visible` or `size` changes. */
  get useTransition(): boolean;
  set useTransition(v: boolean);
  private _useTransition;
  /**
   * Disable the dragging feature (remove cursor/image on gutters).
   * `gutterClick`/`gutterDblClick` still emits.
   */
  get disabled(): boolean;
  set disabled(v: boolean);
  private _disabled;
  /** Indicates the directionality of the areas. */
  get dir(): 'ltr' | 'rtl';
  set dir(v: 'ltr' | 'rtl');
  private _dir;
  /**
   * Milliseconds to detect a double click on a gutter. Set it around 300-500ms if
   * you want to use `gutterDblClick` event.
   */
  get gutterDblClickDuration(): number;
  set gutterDblClickDuration(v: number);
  private _gutterDblClickDuration;
  /** Event emitted when drag starts. */
  dragStart: EventEmitter<MtxSplitOutputData>;
  /** Event emitted when drag ends. */
  dragEnd: EventEmitter<MtxSplitOutputData>;
  /** Event emitted when user clicks on a gutter. */
  gutterClick: EventEmitter<MtxSplitOutputData>;
  /** Event emitted when user double clicks on a gutter. */
  gutterDblClick: EventEmitter<MtxSplitOutputData>;
  /**
   * Event emitted when transition ends (could be triggered from `visible` or `size` changes).
   * Only if `useTransition` equals true.
   */
  get transitionEnd(): Observable<MtxSplitOutputAreaSizes>;
  private transitionEndSubscriber;
  private dragProgressSubject;
  dragProgress$: Observable<MtxSplitOutputData>;
  private isDragging;
  private dragListeners;
  private snapshot;
  private startPoint;
  private endPoint;
  readonly displayedAreas: Array<MtxSplitArea>;
  private readonly hidedAreas;
  private gutterEls;
  constructor(
    ngZone: NgZone,
    elRef: ElementRef,
    cdRef: ChangeDetectorRef,
    renderer: Renderer2,
    _defaultOptions?: MtxSplitDefaultOptions | undefined
  );
  ngAfterViewInit(): void;
  private getNbGutters;
  addArea(component: MtxSplitPane): void;
  removeArea(component: MtxSplitPane): void;
  updateArea(component: MtxSplitPane, resetOrders: boolean, resetSizes: boolean): void;
  showArea(component: MtxSplitPane): void;
  hideArea(comp: MtxSplitPane): void;
  getVisibleAreaSizes(): MtxSplitOutputAreaSizes;
  setVisibleAreaSizes(sizes: MtxSplitOutputAreaSizes): boolean;
  private build;
  private refreshStyleSizes;
  _clickTimeout: number | null;
  clickGutter(event: MouseEvent | TouchEvent, gutterNum: number): void;
  startDragging(event: MouseEvent | TouchEvent, gutterOrder: number, gutterNum: number): void;
  private dragEvent;
  private stopDragging;
  notify(
    type: 'start' | 'progress' | 'end' | 'click' | 'dblclick' | 'transitionEnd',
    gutterNum: number
  ): void;
  ngOnDestroy(): void;
  static ɵfac: i0.ɵɵFactoryDeclaration<MtxSplit, [null, null, null, null, { optional: true }]>;
  static ɵcmp: i0.ɵɵComponentDeclaration<
    MtxSplit,
    'mtx-split',
    ['mtxSplit'],
    {
      color: { alias: 'color'; required: false };
      direction: { alias: 'direction'; required: false };
      unit: { alias: 'unit'; required: false };
      gutterSize: { alias: 'gutterSize'; required: false };
      gutterStep: { alias: 'gutterStep'; required: false };
      restrictMove: { alias: 'restrictMove'; required: false };
      useTransition: { alias: 'useTransition'; required: false };
      disabled: { alias: 'disabled'; required: false };
      dir: { alias: 'dir'; required: false };
      gutterDblClickDuration: { alias: 'gutterDblClickDuration'; required: false };
    },
    {
      dragStart: 'dragStart';
      dragEnd: 'dragEnd';
      gutterClick: 'gutterClick';
      gutterDblClick: 'gutterDblClick';
      transitionEnd: 'transitionEnd';
    },
    never,
    ['*'],
    true,
    never
  >;
  static ngAcceptInputType_restrictMove: unknown;
  static ngAcceptInputType_useTransition: unknown;
  static ngAcceptInputType_disabled: unknown;
}
