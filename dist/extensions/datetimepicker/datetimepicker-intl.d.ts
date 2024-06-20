import { Subject } from 'rxjs';
import * as i0 from '@angular/core';
export declare class MtxDatetimepickerIntl {
  /**
   * Stream to emit from when labels are changed. Use this to notify components when the labels have
   * changed after initialization.
   */
  readonly changes: Subject<void>;
  /** A label for the calendar popup (used by screen readers). */
  calendarLabel: string;
  /** A label for the button used to open the calendar popup (used by screen readers). */
  openCalendarLabel: string;
  /** Label for the button used to close the calendar popup. */
  closeCalendarLabel: string;
  /** A label for the previous month button (used by screen readers). */
  prevMonthLabel: string;
  /** A label for the next month button (used by screen readers). */
  nextMonthLabel: string;
  /** A label for the previous year button (used by screen readers). */
  prevYearLabel: string;
  /** A label for the next year button (used by screen readers). */
  nextYearLabel: string;
  /** A label for the previous multi-year button (used by screen readers). */
  prevMultiYearLabel: string;
  /** A label for the next multi-year button (used by screen readers). */
  nextMultiYearLabel: string;
  /** A label for the 'switch to month view' button (used by screen readers). */
  switchToMonthViewLabel: string;
  /** A label for the 'switch to year view' button (used by screen readers). */
  switchToYearViewLabel: string;
  /** A label for the 'switch to multi-year view' button (used by screen readers). */
  switchToMultiYearViewLabel: string;
  /** A label for the first date of a range of dates (used by screen readers). */
  startDateLabel: string;
  /** A label for the last date of a range of dates (used by screen readers). */
  endDateLabel: string;
  /** Formats a range of years (used for visuals). */
  formatYearRange(start: string, end: string): string;
  /** Formats a label for a range of years (used by screen readers). */
  formatYearRangeLabel(start: string, end: string): string;
  /** A label for the 'switch to clock hour view' button (used by screen readers). */
  switchToClockHourViewLabel: string;
  /** A label for the 'switch to clock minute view' button (used by screen readers). */
  switchToClockMinuteViewLabel: string;
  /** Label used for ok button within the manual time input. */
  okLabel: string;
  /** Label used for cancel button within the manual time input. */
  cancelLabel: string;
  static ɵfac: i0.ɵɵFactoryDeclaration<MtxDatetimepickerIntl, never>;
  static ɵprov: i0.ɵɵInjectableDeclaration<MtxDatetimepickerIntl>;
}
