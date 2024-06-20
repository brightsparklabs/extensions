import { ComponentType, Portal } from '@angular/cdk/portal';
import {
  AfterContentInit,
  ChangeDetectorRef,
  ElementRef,
  EventEmitter,
  NgZone,
  OnDestroy,
} from '@angular/core';
import { DatetimeAdapter, MtxDatetimeFormats } from '@ng-matero/extensions/core';
import { MtxClockView } from './clock';
import { MtxDatetimepickerFilterType } from './datetimepicker-filtertype';
import { MtxDatetimepickerIntl } from './datetimepicker-intl';
import {
  MtxAMPM,
  MtxCalendarView,
  MtxDatetimepickerType,
  MtxTimeView,
} from './datetimepicker-types';
import * as i0 from '@angular/core';
/**
 * A calendar that is used as part of the datetimepicker.
 * @docs-private
 */
export declare class MtxCalendar<D> implements AfterContentInit, OnDestroy {
  private _elementRef;
  private _intl;
  private _ngZone;
  private _adapter;
  private _dateFormats;
  /** Whether to show multi-year view. */
  multiYearSelector: boolean;
  /** Whether the clock uses 12 hour format. */
  twelvehour: boolean;
  /** Whether the calendar should be started in month or year view. */
  startView: MtxCalendarView;
  /** Step over minutes. */
  timeInterval: number;
  /** A function used to filter which dates are selectable. */
  dateFilter: (date: D, type: MtxDatetimepickerFilterType) => boolean;
  /** Prevent user to select same date time */
  preventSameDateTimeSelection: boolean;
  /** Input for custom header component */
  headerComponent: ComponentType<any>;
  /** Emits when the currently selected date changes. */
  selectedChange: EventEmitter<D>;
  /** Emits when the view has been changed. */
  viewChanged: EventEmitter<MtxCalendarView>;
  _userSelection: EventEmitter<void>;
  _AMPM: MtxAMPM;
  _clockView: MtxClockView;
  _calendarState: string;
  /** A portal containing the header component. */
  _calendarHeaderPortal: Portal<any>;
  private _intlChanges;
  private _clampedActiveDate;
  private _injector;
  constructor(
    _elementRef: ElementRef,
    _intl: MtxDatetimepickerIntl,
    _ngZone: NgZone,
    _adapter: DatetimeAdapter<D>,
    _dateFormats: MtxDatetimeFormats,
    _changeDetectorRef: ChangeDetectorRef
  );
  /** The display type of datetimepicker. */
  get type(): MtxDatetimepickerType;
  set type(value: MtxDatetimepickerType);
  private _type;
  /** A date representing the period (month or year) to start the calendar in. */
  get startAt(): D | null;
  set startAt(value: D | null);
  private _startAt;
  /**
   * Whether the calendar is in time mode. In time mode the calendar clock gets time input elements
   * rather then just clock. When touchUi is enabled this will be disabled
   */
  timeInput: MtxTimeView;
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
  /**
   * The current active date. This determines which time period is shown and which date is
   * highlighted when using keyboard navigation.
   */
  get _activeDate(): D;
  set _activeDate(value: D);
  /** Whether the calendar is in month view. */
  get currentView(): MtxCalendarView;
  set currentView(view: MtxCalendarView);
  private _currentView;
  get _yearPeriodText(): string;
  get _yearButtonText(): string;
  get _yearButtonLabel(): string;
  get _dateButtonText(): string;
  get _dateButtonLabel(): string;
  get _hoursButtonText(): string;
  get _hourButtonLabel(): string;
  get _minutesButtonText(): string;
  get _minuteButtonLabel(): string;
  get _prevButtonLabel(): string;
  get _nextButtonLabel(): string;
  /** Date filter for the month and year views. */
  _dateFilterForViews: (date: D) => boolean;
  _userSelected(): void;
  ngAfterContentInit(): void;
  ngOnDestroy(): void;
  /** Handles date selection in the month view. */
  _dateSelected(date: D): void;
  /** Handles month selection in the year view. */
  _monthSelected(month: D): void;
  /** Handles year selection in the multi year view. */
  _yearSelected(year: D): void;
  _timeSelected(date: D): void;
  _dialTimeSelected(date: D): void;
  _onActiveDateChange(date: D): void;
  _updateDate(date: D): D;
  _selectAMPM(date: D): void;
  _ampmClicked(source: MtxAMPM): void;
  _yearClicked(): void;
  _dateClicked(): void;
  _hoursClicked(): void;
  _minutesClicked(): void;
  /** Handles user clicks on the previous button. */
  _previousClicked(): void;
  /** Handles user clicks on the next button. */
  _nextClicked(): void;
  /** Whether the previous period button is enabled. */
  _previousEnabled(): boolean;
  /** Whether the next period button is enabled. */
  _nextEnabled(): boolean;
  /** Handles keydown events on the calendar body. */
  _handleCalendarBodyKeydown(event: KeyboardEvent): void;
  _focusActiveCell(): void;
  _calendarStateDone(): void;
  /** Whether the two dates represent the same view in the current view mode (month or year). */
  private _isSameView;
  /** Handles keydown events on the calendar body when calendar is in month view. */
  private _handleCalendarBodyKeydownInMonthView;
  /** Handles keydown events on the calendar body when calendar is in year view. */
  private _handleCalendarBodyKeydownInYearView;
  /** Handles keydown events on the calendar body when calendar is in multi-year view. */
  private _handleCalendarBodyKeydownInMultiYearView;
  /** Handles keydown events on the calendar body when calendar is in month view. */
  private _handleCalendarBodyKeydownInClockView;
  /**
   * Determine the date for the month that comes before the given month in the same column in the
   * calendar table.
   */
  private _prevMonthInSameCol;
  /**
   * Determine the date for the month that comes after the given month in the same column in the
   * calendar table.
   */
  private _nextMonthInSameCol;
  private calendarState;
  private _2digit;
  static ɵfac: i0.ɵɵFactoryDeclaration<
    MtxCalendar<any>,
    [null, null, null, { optional: true }, { optional: true }, null]
  >;
  static ɵcmp: i0.ɵɵComponentDeclaration<
    MtxCalendar<any>,
    'mtx-calendar',
    ['mtxCalendar'],
    {
      multiYearSelector: { alias: 'multiYearSelector'; required: false };
      twelvehour: { alias: 'twelvehour'; required: false };
      startView: { alias: 'startView'; required: false };
      timeInterval: { alias: 'timeInterval'; required: false };
      dateFilter: { alias: 'dateFilter'; required: false };
      preventSameDateTimeSelection: { alias: 'preventSameDateTimeSelection'; required: false };
      headerComponent: { alias: 'headerComponent'; required: false };
      type: { alias: 'type'; required: false };
      startAt: { alias: 'startAt'; required: false };
      timeInput: { alias: 'timeInput'; required: false };
      selected: { alias: 'selected'; required: false };
      minDate: { alias: 'minDate'; required: false };
      maxDate: { alias: 'maxDate'; required: false };
    },
    {
      selectedChange: 'selectedChange';
      viewChanged: 'viewChanged';
      _userSelection: '_userSelection';
    },
    never,
    never,
    true,
    never
  >;
  static ngAcceptInputType_multiYearSelector: unknown;
  static ngAcceptInputType_twelvehour: unknown;
}
