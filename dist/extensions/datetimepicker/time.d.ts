import { NumberInput } from '@angular/cdk/coercion';
import {
  AfterViewInit,
  ChangeDetectorRef,
  ElementRef,
  EventEmitter,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { SubscriptionLike } from 'rxjs';
import { DatetimeAdapter } from '@ng-matero/extensions/core';
import { MtxClockView } from './clock';
import { MtxDatetimepickerFilterType } from './datetimepicker-filtertype';
import { MtxDatetimepickerIntl } from './datetimepicker-intl';
import { MtxAMPM, MtxTimeView } from './datetimepicker-types';
import * as i0 from '@angular/core';
export declare class MtxTimeInput implements OnDestroy {
  private element;
  private cdr;
  set timeInterval(value: NumberInput);
  private _interval;
  set timeMin(value: NumberInput);
  private _min;
  set timeMax(value: NumberInput);
  private _max;
  set timeValue(value: NumberInput);
  timeValueChanged: EventEmitter<NumberInput>;
  private _value;
  private keyDownListener;
  private keyPressListener;
  private inputEventListener;
  constructor(element: ElementRef, cdr: ChangeDetectorRef);
  get hasFocus(): any;
  get inputElement(): HTMLInputElement;
  get valid(): boolean;
  get invalid(): boolean;
  blur(): void;
  focus(): void;
  /**
   * Write value to inputElement
   * @param value NumberInput
   */
  writeValue(value: NumberInput): void;
  /**
   * Writes value to placeholder
   * @param value NumberInput
   */
  writePlaceholder(value: NumberInput): void;
  keyDownHandler(event: KeyboardEvent): void;
  /**
   * Prevent non number inputs in the inputElement with the exception of Enter/BackSpace
   * @param event KeyboardEvent
   */
  keyPressHandler(event: KeyboardEvent): void;
  inputChangedHandler(): void;
  clampInputValue(): void;
  /**
   * Remove event listeners on destruction
   */
  ngOnDestroy(): void;
  static ɵfac: i0.ɵɵFactoryDeclaration<MtxTimeInput, never>;
  static ɵdir: i0.ɵɵDirectiveDeclaration<
    MtxTimeInput,
    'input.mtx-time-input',
    ['mtxTimeInput'],
    {
      timeInterval: { alias: 'timeInterval'; required: false };
      timeMin: { alias: 'timeMin'; required: false };
      timeMax: { alias: 'timeMax'; required: false };
      timeValue: { alias: 'timeValue'; required: false };
    },
    { timeValueChanged: 'timeValueChanged' },
    never,
    never,
    true,
    never
  >;
}
export declare class MtxTime<D> implements OnChanges, AfterViewInit, OnDestroy {
  private _adapter;
  private _changeDetectorRef;
  protected _datetimepickerIntl: MtxDatetimepickerIntl;
  /** Emits when the currently selected date changes. */
  readonly selectedChange: EventEmitter<D>;
  /** Emits when any date changes. */
  readonly activeDateChange: EventEmitter<D>;
  /** Emits when any date is selected. */
  readonly _userSelection: EventEmitter<void>;
  /** Emits when AM/PM button are clicked. */
  readonly ampmChange: EventEmitter<MtxAMPM>;
  /** Emits when AM/PM button are clicked. */
  readonly clockViewChange: EventEmitter<MtxClockView>;
  /** A function used to filter which dates are selectable. */
  dateFilter: (date: D, type: MtxDatetimepickerFilterType) => boolean;
  /** Step over minutes. */
  interval: number;
  protected hourInputElement: ElementRef<HTMLInputElement> | undefined;
  protected hourInputDirective: MtxTimeInput | undefined;
  protected minuteInputElement: ElementRef<HTMLInputElement> | undefined;
  protected minuteInputDirective: MtxTimeInput | undefined;
  datetimepickerIntlChangesSubscription: SubscriptionLike;
  /** Whether the clock uses 12 hour format. */
  twelvehour: boolean;
  /** Whether the time is now in AM or PM. */
  AMPM: MtxAMPM;
  timeInput: MtxTimeView;
  /**
   * The date to display in this clock view.
   */
  get activeDate(): D;
  set activeDate(value: D);
  private _activeDate;
  /** The currently selected date. */
  get selected(): D | null;
  set selected(value: D | null);
  private _selected;
  /** The minimum selectable date. */
  get minDate(): D | null;
  set minDate(value: D | null);
  private _minDate;
  /** The maximum selectable date. */
  get maxDate(): D | null;
  set maxDate(value: D | null);
  private _maxDate;
  /** Whether the clock should be started in hour or minute view. */
  get clockView(): MtxClockView;
  set clockView(value: MtxClockView);
  /** Whether the clock is in hour view. */
  private _clockView;
  get isHourView(): boolean;
  get isMinuteView(): boolean;
  get hour(): string;
  get minute(): string;
  prefixWithZero(value: number): string;
  constructor(
    _adapter: DatetimeAdapter<D>,
    _changeDetectorRef: ChangeDetectorRef,
    _datetimepickerIntl: MtxDatetimepickerIntl
  );
  ngOnChanges(changes: SimpleChanges): void;
  ngAfterViewInit(): void;
  focusInputElement(): void;
  handleHourInputChange(value: NumberInput): void;
  updateHourForAmPm(value: number): number;
  handleMinuteInputChange(value: NumberInput): void;
  handleFocus(clockView: MtxClockView): void;
  _timeSelected(date: D): void;
  _onActiveDateChange(date: D): void;
  handleOk(): void;
  handleCancel(): void;
  ngOnDestroy(): void;
  static ɵfac: i0.ɵɵFactoryDeclaration<MtxTime<any>, never>;
  static ɵcmp: i0.ɵɵComponentDeclaration<
    MtxTime<any>,
    'mtx-time',
    ['mtxTime'],
    {
      dateFilter: { alias: 'dateFilter'; required: false };
      interval: { alias: 'interval'; required: false };
      twelvehour: { alias: 'twelvehour'; required: false };
      AMPM: { alias: 'AMPM'; required: false };
      timeInput: { alias: 'timeInput'; required: false };
      activeDate: { alias: 'activeDate'; required: false };
      selected: { alias: 'selected'; required: false };
      minDate: { alias: 'minDate'; required: false };
      maxDate: { alias: 'maxDate'; required: false };
      clockView: { alias: 'clockView'; required: false };
    },
    {
      selectedChange: 'selectedChange';
      activeDateChange: 'activeDateChange';
      _userSelection: '_userSelection';
      ampmChange: 'ampmChange';
      clockViewChange: 'clockViewChange';
    },
    never,
    never,
    true,
    never
  >;
  static ngAcceptInputType_twelvehour: unknown;
}
