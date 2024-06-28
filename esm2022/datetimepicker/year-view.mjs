import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, Optional, Output, ViewEncapsulation, } from '@angular/core';
import { MTX_DATETIME_FORMATS, } from '@ng-matero/extensions/core';
import { MtxCalendarBody, MtxCalendarCell } from './calendar-body';
import { mtxDatetimepickerAnimations } from './datetimepicker-animations';
import { createMissingDateImplError } from './datetimepicker-errors';
import * as i0 from "@angular/core";
import * as i1 from "@ng-matero/extensions/core";
/**
 * An internal component used to display a single year in the datetimepicker.
 * @docs-private
 */
export class MtxYearView {
    constructor(_adapter, _dateFormats) {
        this._adapter = _adapter;
        this._dateFormats = _dateFormats;
        this.type = 'date';
        /** Emits when a new month is selected. */
        this.selectedChange = new EventEmitter();
        /** Emits when any date is selected. */
        this._userSelection = new EventEmitter();
        if (!this._adapter) {
            throw createMissingDateImplError('DatetimeAdapter');
        }
        if (!this._dateFormats) {
            throw createMissingDateImplError('MTX_DATETIME_FORMATS');
        }
        this._activeDate = this._adapter.today();
    }
    /** The date to display in this year view (everything other than the year is ignored). */
    get activeDate() {
        return this._activeDate;
    }
    set activeDate(value) {
        const oldActiveDate = this._activeDate;
        this._activeDate = value || this._adapter.today();
        if (oldActiveDate &&
            this._activeDate &&
            !this._adapter.sameYear(oldActiveDate, this._activeDate)) {
            this._init();
            // if (oldActiveDate < this._activeDate) {
            //  this.calendarState('right');
            // } else {
            //  this.calendarState('left');
            // }
        }
    }
    /** The currently selected date. */
    get selected() {
        return this._selected;
    }
    set selected(value) {
        this._selected = value;
        this._selectedMonth = this._getMonthInCurrentYear(this.selected);
    }
    ngAfterContentInit() {
        this._init();
    }
    /** Handles when a new month is selected. */
    _monthSelected(month) {
        const normalizedDate = this._adapter.createDatetime(this._adapter.getYear(this.activeDate), month, 1, 0, 0);
        this.selectedChange.emit(this._adapter.createDatetime(this._adapter.getYear(this.activeDate), month, Math.min(this._adapter.getDate(this.activeDate), this._adapter.getNumDaysInMonth(normalizedDate)), this._adapter.getHour(this.activeDate), this._adapter.getMinute(this.activeDate)));
        if (this.type === 'month') {
            this._userSelection.emit();
        }
    }
    _calendarStateDone() {
        this._calendarState = '';
    }
    /** Initializes this month view. */
    _init() {
        this._selectedMonth = this._getMonthInCurrentYear(this.selected);
        this._todayMonth = this._getMonthInCurrentYear(this._adapter.today());
        this._yearLabel = this._adapter.getYearName(this.activeDate);
        const monthNames = this._adapter.getMonthNames('short');
        // First row of months only contains 5 elements so we can fit the year label on the same row.
        this._months = [
            [0, 1, 2, 3],
            [4, 5, 6, 7],
            [8, 9, 10, 11],
        ].map(row => row.map(month => this._createCellForMonth(month, monthNames[month])));
    }
    /**
     * Gets the month in this year that the given Date falls on.
     * Returns null if the given Date is in another year.
     */
    _getMonthInCurrentYear(date) {
        return this._adapter.sameYear(date, this.activeDate) ? this._adapter.getMonth(date) : null;
    }
    /** Creates an MdCalendarCell for the given month. */
    _createCellForMonth(month, monthName) {
        const ariaLabel = this._adapter.format(this._adapter.createDatetime(this._adapter.getYear(this.activeDate), month, 1, this._adapter.getHour(this.activeDate), this._adapter.getMinute(this.activeDate)), this._dateFormats.display.monthYearA11yLabel);
        return new MtxCalendarCell(month, monthName.toLocaleUpperCase(), ariaLabel, this._isMonthEnabled(month));
    }
    // private calendarState(direction: string): void {
    //   this._calendarState = direction;
    // }
    /** Whether the given month is enabled. */
    _isMonthEnabled(month) {
        if (!this.dateFilter) {
            return true;
        }
        const firstOfMonth = this._adapter.createDatetime(this._adapter.getYear(this.activeDate), month, 1, this._adapter.getHour(this.activeDate), this._adapter.getMinute(this.activeDate));
        // If any date in the month is enabled count the month as enabled.
        for (let date = firstOfMonth; this._adapter.getMonth(date) === month; date = this._adapter.addCalendarDays(date, 1)) {
            if (this.dateFilter(date)) {
                return true;
            }
        }
        return false;
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxYearView, deps: [{ token: i1.DatetimeAdapter, optional: true }, { token: MTX_DATETIME_FORMATS, optional: true }], target: i0.ɵɵFactoryTarget.Component }); }
    /** @nocollapse */ static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.0.1", type: MtxYearView, isStandalone: true, selector: "mtx-year-view", inputs: { type: "type", dateFilter: "dateFilter", activeDate: "activeDate", selected: "selected" }, outputs: { selectedChange: "selectedChange", _userSelection: "_userSelection" }, exportAs: ["mtxYearView"], ngImport: i0, template: "<table class=\"mtx-calendar-table\" role=\"grid\">\n  <thead class=\"mtx-calendar-table-header\"></thead>\n  <tbody mtx-calendar-body\n         (@slideCalendar.done)=\"_calendarStateDone()\"\n         [@slideCalendar]=\"_calendarState\"\n         [label]=\"_yearLabel\"\n         [rows]=\"_months\"\n         [todayValue]=\"_todayMonth!\"\n         [labelMinRequiredCells]=\"2\"\n         [numCols]=\"4\"\n         [activeCell]=\"_adapter.getMonth(activeDate)\"\n         [selectedValue]=\"_selectedMonth!\"\n         (selectedValueChange)=\"_monthSelected($event)\"\n         [allowDisabledSelection]=\"true\"></tbody>\n</table>\n", dependencies: [{ kind: "component", type: MtxCalendarBody, selector: "[mtx-calendar-body]", inputs: ["label", "rows", "todayValue", "selectedValue", "labelMinRequiredCells", "numCols", "allowDisabledSelection", "activeCell"], outputs: ["selectedValueChange"], exportAs: ["mtxCalendarBody"] }], animations: [mtxDatetimepickerAnimations.slideCalendar], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxYearView, decorators: [{
            type: Component,
            args: [{ selector: 'mtx-year-view', exportAs: 'mtxYearView', animations: [mtxDatetimepickerAnimations.slideCalendar], encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, standalone: true, imports: [MtxCalendarBody], template: "<table class=\"mtx-calendar-table\" role=\"grid\">\n  <thead class=\"mtx-calendar-table-header\"></thead>\n  <tbody mtx-calendar-body\n         (@slideCalendar.done)=\"_calendarStateDone()\"\n         [@slideCalendar]=\"_calendarState\"\n         [label]=\"_yearLabel\"\n         [rows]=\"_months\"\n         [todayValue]=\"_todayMonth!\"\n         [labelMinRequiredCells]=\"2\"\n         [numCols]=\"4\"\n         [activeCell]=\"_adapter.getMonth(activeDate)\"\n         [selectedValue]=\"_selectedMonth!\"\n         (selectedValueChange)=\"_monthSelected($event)\"\n         [allowDisabledSelection]=\"true\"></tbody>\n</table>\n" }]
        }], ctorParameters: () => [{ type: i1.DatetimeAdapter, decorators: [{
                    type: Optional
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MTX_DATETIME_FORMATS]
                }] }], propDecorators: { type: [{
                type: Input
            }], dateFilter: [{
                type: Input
            }], selectedChange: [{
                type: Output
            }], _userSelection: [{
                type: Output
            }], activeDate: [{
                type: Input
            }], selected: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieWVhci12aWV3LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvZXh0ZW5zaW9ucy9kYXRldGltZXBpY2tlci95ZWFyLXZpZXcudHMiLCIuLi8uLi8uLi8uLi9wcm9qZWN0cy9leHRlbnNpb25zL2RhdGV0aW1lcGlja2VyL3llYXItdmlldy5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFFTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUNULFlBQVksRUFDWixNQUFNLEVBQ04sS0FBSyxFQUNMLFFBQVEsRUFDUixNQUFNLEVBQ04saUJBQWlCLEdBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFFTCxvQkFBb0IsR0FFckIsTUFBTSw0QkFBNEIsQ0FBQztBQUNwQyxPQUFPLEVBQUUsZUFBZSxFQUFFLGVBQWUsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ25FLE9BQU8sRUFBRSwyQkFBMkIsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQzFFLE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxNQUFNLHlCQUF5QixDQUFDOzs7QUFHckU7OztHQUdHO0FBV0gsTUFBTSxPQUFPLFdBQVc7SUE2QnRCLFlBQ3FCLFFBQTRCLEVBQ0csWUFBZ0M7UUFEL0QsYUFBUSxHQUFSLFFBQVEsQ0FBb0I7UUFDRyxpQkFBWSxHQUFaLFlBQVksQ0FBb0I7UUE5QjNFLFNBQUksR0FBMEIsTUFBTSxDQUFDO1FBSzlDLDBDQUEwQztRQUNoQyxtQkFBYyxHQUFHLElBQUksWUFBWSxFQUFLLENBQUM7UUFFakQsdUNBQXVDO1FBQ3BCLG1CQUFjLEdBQUcsSUFBSSxZQUFZLEVBQVEsQ0FBQztRQXVCM0QsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNuQixNQUFNLDBCQUEwQixDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDdEQsQ0FBQztRQUVELElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7WUFD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O0lBQ2YsQ0FBQztpSUE5TFUsV0FBVyxpRUErQkEsb0JBQW9CO3FIQS9CL0IsV0FBVyx5UkNuQ3hCLHluQkFlQSw0Q0RrQlksZUFBZSx5UEFKYixDQUFDLDJCQUEyQixDQUFDLGFBQWEsQ0FBQzs7MkZBTTVDLFdBQVc7a0JBVnZCLFNBQVM7K0JBQ0UsZUFBZSxZQUVmLGFBQWEsY0FDWCxDQUFDLDJCQUEyQixDQUFDLGFBQWEsQ0FBQyxpQkFDeEMsaUJBQWlCLENBQUMsSUFBSSxtQkFDcEIsdUJBQXVCLENBQUMsTUFBTSxjQUNuQyxJQUFJLFdBQ1AsQ0FBQyxlQUFlLENBQUM7OzBCQWdDdkIsUUFBUTs7MEJBQ1IsUUFBUTs7MEJBQUksTUFBTTsyQkFBQyxvQkFBb0I7eUNBOUJqQyxJQUFJO3NCQUFaLEtBQUs7Z0JBR0csVUFBVTtzQkFBbEIsS0FBSztnQkFHSSxjQUFjO3NCQUF2QixNQUFNO2dCQUdZLGNBQWM7c0JBQWhDLE1BQU07Z0JBc0NILFVBQVU7c0JBRGIsS0FBSztnQkEwQkYsUUFBUTtzQkFEWCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbXBvbmVudCxcbiAgRXZlbnRFbWl0dGVyLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBPcHRpb25hbCxcbiAgT3V0cHV0LFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBEYXRldGltZUFkYXB0ZXIsXG4gIE1UWF9EQVRFVElNRV9GT1JNQVRTLFxuICBNdHhEYXRldGltZUZvcm1hdHMsXG59IGZyb20gJ0BuZy1tYXRlcm8vZXh0ZW5zaW9ucy9jb3JlJztcbmltcG9ydCB7IE10eENhbGVuZGFyQm9keSwgTXR4Q2FsZW5kYXJDZWxsIH0gZnJvbSAnLi9jYWxlbmRhci1ib2R5JztcbmltcG9ydCB7IG10eERhdGV0aW1lcGlja2VyQW5pbWF0aW9ucyB9IGZyb20gJy4vZGF0ZXRpbWVwaWNrZXItYW5pbWF0aW9ucyc7XG5pbXBvcnQgeyBjcmVhdGVNaXNzaW5nRGF0ZUltcGxFcnJvciB9IGZyb20gJy4vZGF0ZXRpbWVwaWNrZXItZXJyb3JzJztcbmltcG9ydCB7IE10eERhdGV0aW1lcGlja2VyVHlwZSB9IGZyb20gJy4vZGF0ZXRpbWVwaWNrZXItdHlwZXMnO1xuXG4vKipcbiAqIEFuIGludGVybmFsIGNvbXBvbmVudCB1c2VkIHRvIGRpc3BsYXkgYSBzaW5nbGUgeWVhciBpbiB0aGUgZGF0ZXRpbWVwaWNrZXIuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ210eC15ZWFyLXZpZXcnLFxuICB0ZW1wbGF0ZVVybDogJ3llYXItdmlldy5odG1sJyxcbiAgZXhwb3J0QXM6ICdtdHhZZWFyVmlldycsXG4gIGFuaW1hdGlvbnM6IFttdHhEYXRldGltZXBpY2tlckFuaW1hdGlvbnMuc2xpZGVDYWxlbmRhcl0sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBzdGFuZGFsb25lOiB0cnVlLFxuICBpbXBvcnRzOiBbTXR4Q2FsZW5kYXJCb2R5XSxcbn0pXG5leHBvcnQgY2xhc3MgTXR4WWVhclZpZXc8RD4gaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0IHtcbiAgQElucHV0KCkgdHlwZTogTXR4RGF0ZXRpbWVwaWNrZXJUeXBlID0gJ2RhdGUnO1xuXG4gIC8qKiBBIGZ1bmN0aW9uIHVzZWQgdG8gZmlsdGVyIHdoaWNoIGRhdGVzIGFyZSBzZWxlY3RhYmxlLiAqL1xuICBASW5wdXQoKSBkYXRlRmlsdGVyITogKGRhdGU6IEQpID0+IGJvb2xlYW47XG5cbiAgLyoqIEVtaXRzIHdoZW4gYSBuZXcgbW9udGggaXMgc2VsZWN0ZWQuICovXG4gIEBPdXRwdXQoKSBzZWxlY3RlZENoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8RD4oKTtcblxuICAvKiogRW1pdHMgd2hlbiBhbnkgZGF0ZSBpcyBzZWxlY3RlZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IF91c2VyU2VsZWN0aW9uID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIC8qKiBHcmlkIG9mIGNhbGVuZGFyIGNlbGxzIHJlcHJlc2VudGluZyB0aGUgbW9udGhzIG9mIHRoZSB5ZWFyLiAqL1xuICBfbW9udGhzITogTXR4Q2FsZW5kYXJDZWxsW11bXTtcblxuICAvKiogVGhlIGxhYmVsIGZvciB0aGlzIHllYXIgKGUuZy4gXCIyMDE3XCIpLiAqL1xuICBfeWVhckxhYmVsITogc3RyaW5nO1xuXG4gIC8qKiBUaGUgbW9udGggaW4gdGhpcyB5ZWFyIHRoYXQgdG9kYXkgZmFsbHMgb24uIE51bGwgaWYgdG9kYXkgaXMgaW4gYSBkaWZmZXJlbnQgeWVhci4gKi9cbiAgX3RvZGF5TW9udGghOiBudW1iZXIgfCBudWxsO1xuXG4gIC8qKlxuICAgKiBUaGUgbW9udGggaW4gdGhpcyB5ZWFyIHRoYXQgdGhlIHNlbGVjdGVkIERhdGUgZmFsbHMgb24uXG4gICAqIE51bGwgaWYgdGhlIHNlbGVjdGVkIERhdGUgaXMgaW4gYSBkaWZmZXJlbnQgeWVhci5cbiAgICovXG4gIF9zZWxlY3RlZE1vbnRoITogbnVtYmVyIHwgbnVsbDtcblxuICBfY2FsZW5kYXJTdGF0ZSE6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihcbiAgICBAT3B0aW9uYWwoKSBwdWJsaWMgX2FkYXB0ZXI6IERhdGV0aW1lQWRhcHRlcjxEPixcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1UWF9EQVRFVElNRV9GT1JNQVRTKSBwcml2YXRlIF9kYXRlRm9ybWF0czogTXR4RGF0ZXRpbWVGb3JtYXRzXG4gICkge1xuICAgIGlmICghdGhpcy5fYWRhcHRlcikge1xuICAgICAgdGhyb3cgY3JlYXRlTWlzc2luZ0RhdGVJbXBsRXJyb3IoJ0RhdGV0aW1lQWRhcHRlcicpO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5fZGF0ZUZvcm1hdHMpIHtcbiAgICAgIHRocm93IGNyZWF0ZU1pc3NpbmdEYXRlSW1wbEVycm9yKCdNVFhfREFURVRJTUVfRk9STUFUUycpO1xuICAgIH1cblxuICAgIHRoaXMuX2FjdGl2ZURhdGUgPSB0aGlzLl9hZGFwdGVyLnRvZGF5KCk7XG4gIH1cblxuICBwcml2YXRlIF9hY3RpdmVEYXRlOiBEO1xuXG4gIC8qKiBUaGUgZGF0ZSB0byBkaXNwbGF5IGluIHRoaXMgeWVhciB2aWV3IChldmVyeXRoaW5nIG90aGVyIHRoYW4gdGhlIHllYXIgaXMgaWdub3JlZCkuICovXG4gIEBJbnB1dCgpXG4gIGdldCBhY3RpdmVEYXRlKCk6IEQge1xuICAgIHJldHVybiB0aGlzLl9hY3RpdmVEYXRlO1xuICB9XG5cbiAgc2V0IGFjdGl2ZURhdGUodmFsdWU6IEQpIHtcbiAgICBjb25zdCBvbGRBY3RpdmVEYXRlID0gdGhpcy5fYWN0aXZlRGF0ZTtcbiAgICB0aGlzLl9hY3RpdmVEYXRlID0gdmFsdWUgfHwgdGhpcy5fYWRhcHRlci50b2RheSgpO1xuICAgIGlmIChcbiAgICAgIG9sZEFjdGl2ZURhdGUgJiZcbiAgICAgIHRoaXMuX2FjdGl2ZURhdGUgJiZcbiAgICAgICF0aGlzLl9hZGFwdGVyLnNhbWVZZWFyKG9sZEFjdGl2ZURhdGUsIHRoaXMuX2FjdGl2ZURhdGUpXG4gICAgKSB7XG4gICAgICB0aGlzLl9pbml0KCk7XG4gICAgICAvLyBpZiAob2xkQWN0aXZlRGF0ZSA8IHRoaXMuX2FjdGl2ZURhdGUpIHtcbiAgICAgIC8vICB0aGlzLmNhbGVuZGFyU3RhdGUoJ3JpZ2h0Jyk7XG4gICAgICAvLyB9IGVsc2Uge1xuICAgICAgLy8gIHRoaXMuY2FsZW5kYXJTdGF0ZSgnbGVmdCcpO1xuICAgICAgLy8gfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX3NlbGVjdGVkITogRDtcblxuICAvKiogVGhlIGN1cnJlbnRseSBzZWxlY3RlZCBkYXRlLiAqL1xuICBASW5wdXQoKVxuICBnZXQgc2VsZWN0ZWQoKTogRCB7XG4gICAgcmV0dXJuIHRoaXMuX3NlbGVjdGVkO1xuICB9XG5cbiAgc2V0IHNlbGVjdGVkKHZhbHVlOiBEKSB7XG4gICAgdGhpcy5fc2VsZWN0ZWQgPSB2YWx1ZTtcbiAgICB0aGlzLl9zZWxlY3RlZE1vbnRoID0gdGhpcy5fZ2V0TW9udGhJbkN1cnJlbnRZZWFyKHRoaXMuc2VsZWN0ZWQpO1xuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIHRoaXMuX2luaXQoKTtcbiAgfVxuXG4gIC8qKiBIYW5kbGVzIHdoZW4gYSBuZXcgbW9udGggaXMgc2VsZWN0ZWQuICovXG4gIF9tb250aFNlbGVjdGVkKG1vbnRoOiBudW1iZXIpIHtcbiAgICBjb25zdCBub3JtYWxpemVkRGF0ZSA9IHRoaXMuX2FkYXB0ZXIuY3JlYXRlRGF0ZXRpbWUoXG4gICAgICB0aGlzLl9hZGFwdGVyLmdldFllYXIodGhpcy5hY3RpdmVEYXRlKSxcbiAgICAgIG1vbnRoLFxuICAgICAgMSxcbiAgICAgIDAsXG4gICAgICAwXG4gICAgKTtcblxuICAgIHRoaXMuc2VsZWN0ZWRDaGFuZ2UuZW1pdChcbiAgICAgIHRoaXMuX2FkYXB0ZXIuY3JlYXRlRGF0ZXRpbWUoXG4gICAgICAgIHRoaXMuX2FkYXB0ZXIuZ2V0WWVhcih0aGlzLmFjdGl2ZURhdGUpLFxuICAgICAgICBtb250aCxcbiAgICAgICAgTWF0aC5taW4oXG4gICAgICAgICAgdGhpcy5fYWRhcHRlci5nZXREYXRlKHRoaXMuYWN0aXZlRGF0ZSksXG4gICAgICAgICAgdGhpcy5fYWRhcHRlci5nZXROdW1EYXlzSW5Nb250aChub3JtYWxpemVkRGF0ZSlcbiAgICAgICAgKSxcbiAgICAgICAgdGhpcy5fYWRhcHRlci5nZXRIb3VyKHRoaXMuYWN0aXZlRGF0ZSksXG4gICAgICAgIHRoaXMuX2FkYXB0ZXIuZ2V0TWludXRlKHRoaXMuYWN0aXZlRGF0ZSlcbiAgICAgIClcbiAgICApO1xuICAgIGlmICh0aGlzLnR5cGUgPT09ICdtb250aCcpIHtcbiAgICAgIHRoaXMuX3VzZXJTZWxlY3Rpb24uZW1pdCgpO1xuICAgIH1cbiAgfVxuXG4gIF9jYWxlbmRhclN0YXRlRG9uZSgpIHtcbiAgICB0aGlzLl9jYWxlbmRhclN0YXRlID0gJyc7XG4gIH1cblxuICAvKiogSW5pdGlhbGl6ZXMgdGhpcyBtb250aCB2aWV3LiAqL1xuICBwcml2YXRlIF9pbml0KCkge1xuICAgIHRoaXMuX3NlbGVjdGVkTW9udGggPSB0aGlzLl9nZXRNb250aEluQ3VycmVudFllYXIodGhpcy5zZWxlY3RlZCk7XG4gICAgdGhpcy5fdG9kYXlNb250aCA9IHRoaXMuX2dldE1vbnRoSW5DdXJyZW50WWVhcih0aGlzLl9hZGFwdGVyLnRvZGF5KCkpO1xuICAgIHRoaXMuX3llYXJMYWJlbCA9IHRoaXMuX2FkYXB0ZXIuZ2V0WWVhck5hbWUodGhpcy5hY3RpdmVEYXRlKTtcblxuICAgIGNvbnN0IG1vbnRoTmFtZXMgPSB0aGlzLl9hZGFwdGVyLmdldE1vbnRoTmFtZXMoJ3Nob3J0Jyk7XG4gICAgLy8gRmlyc3Qgcm93IG9mIG1vbnRocyBvbmx5IGNvbnRhaW5zIDUgZWxlbWVudHMgc28gd2UgY2FuIGZpdCB0aGUgeWVhciBsYWJlbCBvbiB0aGUgc2FtZSByb3cuXG4gICAgdGhpcy5fbW9udGhzID0gW1xuICAgICAgWzAsIDEsIDIsIDNdLFxuICAgICAgWzQsIDUsIDYsIDddLFxuICAgICAgWzgsIDksIDEwLCAxMV0sXG4gICAgXS5tYXAocm93ID0+IHJvdy5tYXAobW9udGggPT4gdGhpcy5fY3JlYXRlQ2VsbEZvck1vbnRoKG1vbnRoLCBtb250aE5hbWVzW21vbnRoXSkpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBtb250aCBpbiB0aGlzIHllYXIgdGhhdCB0aGUgZ2l2ZW4gRGF0ZSBmYWxscyBvbi5cbiAgICogUmV0dXJucyBudWxsIGlmIHRoZSBnaXZlbiBEYXRlIGlzIGluIGFub3RoZXIgeWVhci5cbiAgICovXG4gIHByaXZhdGUgX2dldE1vbnRoSW5DdXJyZW50WWVhcihkYXRlOiBEKSB7XG4gICAgcmV0dXJuIHRoaXMuX2FkYXB0ZXIuc2FtZVllYXIoZGF0ZSwgdGhpcy5hY3RpdmVEYXRlKSA/IHRoaXMuX2FkYXB0ZXIuZ2V0TW9udGgoZGF0ZSkgOiBudWxsO1xuICB9XG5cbiAgLyoqIENyZWF0ZXMgYW4gTWRDYWxlbmRhckNlbGwgZm9yIHRoZSBnaXZlbiBtb250aC4gKi9cbiAgcHJpdmF0ZSBfY3JlYXRlQ2VsbEZvck1vbnRoKG1vbnRoOiBudW1iZXIsIG1vbnRoTmFtZTogc3RyaW5nKSB7XG4gICAgY29uc3QgYXJpYUxhYmVsID0gdGhpcy5fYWRhcHRlci5mb3JtYXQoXG4gICAgICB0aGlzLl9hZGFwdGVyLmNyZWF0ZURhdGV0aW1lKFxuICAgICAgICB0aGlzLl9hZGFwdGVyLmdldFllYXIodGhpcy5hY3RpdmVEYXRlKSxcbiAgICAgICAgbW9udGgsXG4gICAgICAgIDEsXG4gICAgICAgIHRoaXMuX2FkYXB0ZXIuZ2V0SG91cih0aGlzLmFjdGl2ZURhdGUpLFxuICAgICAgICB0aGlzLl9hZGFwdGVyLmdldE1pbnV0ZSh0aGlzLmFjdGl2ZURhdGUpXG4gICAgICApLFxuICAgICAgdGhpcy5fZGF0ZUZvcm1hdHMuZGlzcGxheS5tb250aFllYXJBMTF5TGFiZWxcbiAgICApO1xuICAgIHJldHVybiBuZXcgTXR4Q2FsZW5kYXJDZWxsKFxuICAgICAgbW9udGgsXG4gICAgICBtb250aE5hbWUudG9Mb2NhbGVVcHBlckNhc2UoKSxcbiAgICAgIGFyaWFMYWJlbCxcbiAgICAgIHRoaXMuX2lzTW9udGhFbmFibGVkKG1vbnRoKVxuICAgICk7XG4gIH1cblxuICAvLyBwcml2YXRlIGNhbGVuZGFyU3RhdGUoZGlyZWN0aW9uOiBzdHJpbmcpOiB2b2lkIHtcbiAgLy8gICB0aGlzLl9jYWxlbmRhclN0YXRlID0gZGlyZWN0aW9uO1xuICAvLyB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGdpdmVuIG1vbnRoIGlzIGVuYWJsZWQuICovXG4gIHByaXZhdGUgX2lzTW9udGhFbmFibGVkKG1vbnRoOiBudW1iZXIpIHtcbiAgICBpZiAoIXRoaXMuZGF0ZUZpbHRlcikge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgY29uc3QgZmlyc3RPZk1vbnRoID0gdGhpcy5fYWRhcHRlci5jcmVhdGVEYXRldGltZShcbiAgICAgIHRoaXMuX2FkYXB0ZXIuZ2V0WWVhcih0aGlzLmFjdGl2ZURhdGUpLFxuICAgICAgbW9udGgsXG4gICAgICAxLFxuICAgICAgdGhpcy5fYWRhcHRlci5nZXRIb3VyKHRoaXMuYWN0aXZlRGF0ZSksXG4gICAgICB0aGlzLl9hZGFwdGVyLmdldE1pbnV0ZSh0aGlzLmFjdGl2ZURhdGUpXG4gICAgKTtcblxuICAgIC8vIElmIGFueSBkYXRlIGluIHRoZSBtb250aCBpcyBlbmFibGVkIGNvdW50IHRoZSBtb250aCBhcyBlbmFibGVkLlxuICAgIGZvciAoXG4gICAgICBsZXQgZGF0ZSA9IGZpcnN0T2ZNb250aDtcbiAgICAgIHRoaXMuX2FkYXB0ZXIuZ2V0TW9udGgoZGF0ZSkgPT09IG1vbnRoO1xuICAgICAgZGF0ZSA9IHRoaXMuX2FkYXB0ZXIuYWRkQ2FsZW5kYXJEYXlzKGRhdGUsIDEpXG4gICAgKSB7XG4gICAgICBpZiAodGhpcy5kYXRlRmlsdGVyKGRhdGUpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuIiwiPHRhYmxlIGNsYXNzPVwibXR4LWNhbGVuZGFyLXRhYmxlXCIgcm9sZT1cImdyaWRcIj5cbiAgPHRoZWFkIGNsYXNzPVwibXR4LWNhbGVuZGFyLXRhYmxlLWhlYWRlclwiPjwvdGhlYWQ+XG4gIDx0Ym9keSBtdHgtY2FsZW5kYXItYm9keVxuICAgICAgICAgKEBzbGlkZUNhbGVuZGFyLmRvbmUpPVwiX2NhbGVuZGFyU3RhdGVEb25lKClcIlxuICAgICAgICAgW0BzbGlkZUNhbGVuZGFyXT1cIl9jYWxlbmRhclN0YXRlXCJcbiAgICAgICAgIFtsYWJlbF09XCJfeWVhckxhYmVsXCJcbiAgICAgICAgIFtyb3dzXT1cIl9tb250aHNcIlxuICAgICAgICAgW3RvZGF5VmFsdWVdPVwiX3RvZGF5TW9udGghXCJcbiAgICAgICAgIFtsYWJlbE1pblJlcXVpcmVkQ2VsbHNdPVwiMlwiXG4gICAgICAgICBbbnVtQ29sc109XCI0XCJcbiAgICAgICAgIFthY3RpdmVDZWxsXT1cIl9hZGFwdGVyLmdldE1vbnRoKGFjdGl2ZURhdGUpXCJcbiAgICAgICAgIFtzZWxlY3RlZFZhbHVlXT1cIl9zZWxlY3RlZE1vbnRoIVwiXG4gICAgICAgICAoc2VsZWN0ZWRWYWx1ZUNoYW5nZSk9XCJfbW9udGhTZWxlY3RlZCgkZXZlbnQpXCJcbiAgICAgICAgIFthbGxvd0Rpc2FibGVkU2VsZWN0aW9uXT1cInRydWVcIj48L3Rib2R5PlxuPC90YWJsZT5cbiJdfQ==