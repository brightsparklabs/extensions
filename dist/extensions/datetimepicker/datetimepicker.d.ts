import { Directionality } from '@angular/cdk/bidi';
import { Overlay, ScrollStrategy } from '@angular/cdk/overlay';
import { ComponentType } from '@angular/cdk/portal';
import {
  AfterContentInit,
  ChangeDetectorRef,
  EventEmitter,
  InjectionToken,
  OnDestroy,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { Subject } from 'rxjs';
import { DatetimeAdapter } from '@ng-matero/extensions/core';
import { MtxCalendar } from './calendar';
import { MtxDatetimepickerFilterType } from './datetimepicker-filtertype';
import { MtxDatetimepickerInput } from './datetimepicker-input';
import { MtxCalendarView, MtxDatetimepickerType, MtxTimeView } from './datetimepicker-types';
import * as i0 from '@angular/core';
/** Possible modes for datetimepicker dropdown display. */
export type MtxDatetimepickerMode = 'auto' | 'portrait' | 'landscape';
/** Possible positions for the datetimepicker dropdown along the X axis. */
export type DatetimepickerDropdownPositionX = 'start' | 'end';
/** Possible positions for the datetimepicker dropdown along the Y axis. */
export type DatetimepickerDropdownPositionY = 'above' | 'below';
/** Injection token that determines the scroll handling while the calendar is open. */
export declare const MTX_DATETIMEPICKER_SCROLL_STRATEGY: InjectionToken<() => ScrollStrategy>;
export declare function MTX_DATETIMEPICKER_SCROLL_STRATEGY_FACTORY(
  overlay: Overlay
): () => ScrollStrategy;
export declare const MTX_DATETIMEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER: {
  provide: InjectionToken<() => ScrollStrategy>;
  deps: (typeof Overlay)[];
  useFactory: typeof MTX_DATETIMEPICKER_SCROLL_STRATEGY_FACTORY;
};
/**
 * Component used as the content for the datetimepicker dialog and popup. We use this instead of
 * using MtxCalendar directly as the content so we can control the initial focus. This also gives us
 * a place to put additional features of the popup that are not part of the calendar itself in the
 * future. (e.g. confirmation buttons).
 * @docs-private
 */
export declare class MtxDatetimepickerContent<D> implements OnInit, AfterContentInit, OnDestroy {
  private _changeDetectorRef;
  _calendar: MtxCalendar<D>;
  color: ThemePalette;
  datetimepicker: MtxDatetimepicker<D>;
  /** Whether the datetimepicker is above or below the input. */
  _isAbove: boolean;
  /** Current state of the animation. */
  _animationState: 'enter-dropdown' | 'enter-dialog' | 'void';
  /** Emits when an animation has finished. */
  readonly _animationDone: Subject<void>;
  /** Id of the label for the `role="dialog"` element. */
  _dialogLabelId: string | null;
  constructor(_changeDetectorRef: ChangeDetectorRef);
  ngOnInit(): void;
  ngAfterContentInit(): void;
  _startExitAnimation(): void;
  ngOnDestroy(): void;
  static ɵfac: i0.ɵɵFactoryDeclaration<MtxDatetimepickerContent<any>, never>;
  static ɵcmp: i0.ɵɵComponentDeclaration<
    MtxDatetimepickerContent<any>,
    'mtx-datetimepicker-content',
    never,
    { color: { alias: 'color'; required: false } },
    {},
    never,
    never,
    true,
    never
  >;
}
export declare class MtxDatetimepicker<D> implements OnDestroy {
  private _overlay;
  private _viewContainerRef;
  private _scrollStrategy;
  private _dateAdapter;
  private _dir;
  private _document;
  private _injector;
  /** Whether to show multi-year view. */
  multiYearSelector: boolean;
  /** Whether the clock uses 12 hour format. */
  twelvehour: boolean;
  /** The view that the calendar should start in. */
  startView: MtxCalendarView;
  /** The display mode of datetimepicker. */
  mode: MtxDatetimepickerMode;
  /** Step over minutes. */
  timeInterval: number;
  /** Prevent user to select same date time */
  preventSameDateTimeSelection: boolean;
  /** Input for a custom header component */
  calendarHeaderComponent: ComponentType<any>;
  /**
   * Emits new selected date when selected date changes.
   * @deprecated Switch to the `dateChange` and `dateInput` binding on the input element.
   */
  selectedChanged: EventEmitter<D>;
  /** Emits when the datetimepicker has been opened. */
  openedStream: EventEmitter<void>;
  /** Emits when the datetimepicker has been closed. */
  closedStream: EventEmitter<void>;
  /** Emits when the view has been changed. */
  viewChanged: EventEmitter<MtxCalendarView>;
  /** Classes to be passed to the date picker panel. */
  get panelClass(): string | string[];
  set panelClass(value: string | string[]);
  private _panelClass;
  /** Whether the calendar is open. */
  get opened(): boolean;
  set opened(value: boolean);
  private _opened;
  /** The id for the datetimepicker calendar. */
  id: string;
  /** Color palette to use on the datetimepicker's calendar. */
  get color(): ThemePalette;
  set color(value: ThemePalette);
  private _color;
  /** The input element this datetimepicker is associated with. */
  datetimepickerInput: MtxDatetimepickerInput<D>;
  /** Emits when the datetimepicker is disabled. */
  _disabledChange: Subject<boolean>;
  private _validSelected;
  /** A reference to the overlay into which we've rendered the calendar. */
  private _overlayRef;
  /** Reference to the component instance rendered in the overlay. */
  private _componentRef;
  /** The element that was focused before the datetimepicker was opened. */
  private _focusedElementBeforeOpen;
  /** Unique class that will be added to the backdrop so that the test harnesses can look it up. */
  private _backdropHarnessClass;
  private _inputStateChanges;
  constructor(
    _overlay: Overlay,
    _viewContainerRef: ViewContainerRef,
    _scrollStrategy: any,
    _dateAdapter: DatetimeAdapter<D>,
    _dir: Directionality
  );
  /** The date to open the calendar to initially. */
  get startAt(): D | null;
  set startAt(date: D | null);
  private _startAt;
  /** The display type of datetimepicker. */
  get type(): MtxDatetimepickerType;
  set type(value: MtxDatetimepickerType);
  private _type;
  /**
   * Whether the calendar UI is in touch mode. In touch mode the calendar opens in a dialog rather
   * than a popup and elements have more padding to allow for bigger touch targets.
   */
  touchUi: boolean;
  /**
   * Whether the calendar is in time mode. In time mode the calendar clock gets time input
   * elements rather then just clock. When `touchUi` is enabled this will be disabled.
   */
  timeInput: MtxTimeView;
  /** Whether the datetimepicker pop-up should be disabled. */
  get disabled(): boolean;
  set disabled(value: boolean);
  private _disabled;
  /** Preferred position of the datetimepicker in the X axis. */
  xPosition: DatetimepickerDropdownPositionX;
  /** Preferred position of the datetimepicker in the Y axis. */
  yPosition: DatetimepickerDropdownPositionY;
  /**
   * Whether to restore focus to the previously-focused element when the panel is closed.
   * Note that automatic focus restoration is an accessibility feature and it is recommended that
   * you provide your own equivalent, if you decide to turn it off.
   */
  restoreFocus: boolean;
  /** The currently selected date. */
  get _selected(): D | null;
  set _selected(value: D | null);
  /** The minimum selectable date. */
  get _minDate(): D | null;
  /** The maximum selectable date. */
  get _maxDate(): D | null;
  get _dateFilter(): (date: D | null, type: MtxDatetimepickerFilterType) => boolean;
  _viewChanged(type: MtxCalendarView): void;
  ngOnDestroy(): void;
  /** Selects the given date */
  _select(date: D): void;
  /**
   * Register an input with this datetimepicker.
   * @param input The datetimepicker input to register with this datetimepicker.
   */
  _registerInput(input: MtxDatetimepickerInput<D>): void;
  /** Open the calendar. */
  open(): void;
  /** Close the calendar. */
  close(): void;
  /**
   * Forwards relevant values from the datetimepicker to the
   * datetimepicker content inside the overlay.
   */
  protected _forwardContentValues(instance: MtxDatetimepickerContent<D>): void;
  /** Opens the overlay with the calendar. */
  private _openOverlay;
  /** Destroys the current overlay. */
  private _destroyOverlay;
  /** Gets a position strategy that will open the calendar as a dropdown. */
  private _getDialogStrategy;
  /** Gets a position strategy that will open the calendar as a dropdown. */
  private _getDropdownStrategy;
  /**
   * Sets the positions of the datetimepicker in dropdown mode based on the current configuration.
   */
  private _setConnectedPositions;
  /** Gets an observable that will emit when the overlay is supposed to be closed. */
  private _getCloseStream;
  static ɵfac: i0.ɵɵFactoryDeclaration<
    MtxDatetimepicker<any>,
    [null, null, null, { optional: true }, { optional: true }]
  >;
  static ɵcmp: i0.ɵɵComponentDeclaration<
    MtxDatetimepicker<any>,
    'mtx-datetimepicker',
    ['mtxDatetimepicker'],
    {
      multiYearSelector: { alias: 'multiYearSelector'; required: false };
      twelvehour: { alias: 'twelvehour'; required: false };
      startView: { alias: 'startView'; required: false };
      mode: { alias: 'mode'; required: false };
      timeInterval: { alias: 'timeInterval'; required: false };
      preventSameDateTimeSelection: { alias: 'preventSameDateTimeSelection'; required: false };
      calendarHeaderComponent: { alias: 'calendarHeaderComponent'; required: false };
      panelClass: { alias: 'panelClass'; required: false };
      opened: { alias: 'opened'; required: false };
      color: { alias: 'color'; required: false };
      startAt: { alias: 'startAt'; required: false };
      type: { alias: 'type'; required: false };
      touchUi: { alias: 'touchUi'; required: false };
      timeInput: { alias: 'timeInput'; required: false };
      disabled: { alias: 'disabled'; required: false };
      xPosition: { alias: 'xPosition'; required: false };
      yPosition: { alias: 'yPosition'; required: false };
      restoreFocus: { alias: 'restoreFocus'; required: false };
    },
    {
      selectedChanged: 'selectedChanged';
      openedStream: 'opened';
      closedStream: 'closed';
      viewChanged: 'viewChanged';
    },
    never,
    never,
    true,
    never
  >;
  static ngAcceptInputType_multiYearSelector: unknown;
  static ngAcceptInputType_twelvehour: unknown;
  static ngAcceptInputType_preventSameDateTimeSelection: unknown;
  static ngAcceptInputType_opened: unknown;
  static ngAcceptInputType_touchUi: unknown;
  static ngAcceptInputType_disabled: unknown;
  static ngAcceptInputType_restoreFocus: unknown;
}
