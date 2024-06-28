import { normalizePassiveListenerOptions } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, Output, ViewEncapsulation, booleanAttribute, } from '@angular/core';
import { MtxDatetimepickerFilterType } from './datetimepicker-filtertype';
import * as i0 from "@angular/core";
import * as i1 from "@ng-matero/extensions/core";
const activeEventOptions = normalizePassiveListenerOptions({ passive: false });
export const CLOCK_RADIUS = 50;
export const CLOCK_INNER_RADIUS = 27.5;
export const CLOCK_OUTER_RADIUS = 41.25;
export const CLOCK_TICK_RADIUS = 7.0833;
/**
 * A clock that is used as part of the datetimepicker.
 * @docs-private
 */
export class MtxClock {
    constructor(_elementRef, _adapter, _changeDetectorRef, _document) {
        this._elementRef = _elementRef;
        this._adapter = _adapter;
        this._changeDetectorRef = _changeDetectorRef;
        this._document = _document;
        /** Step over minutes. */
        this.interval = 1;
        /** Whether the clock uses 12 hour format. */
        this.twelvehour = false;
        /** Whether the time is now in AM or PM. */
        this.AMPM = 'AM';
        /** Emits when the currently selected date changes. */
        this.selectedChange = new EventEmitter();
        /** Emits when any date is activated. */
        this.activeDateChange = new EventEmitter();
        /** Emits when any date is selected. */
        this._userSelection = new EventEmitter();
        /** Whether the clock is in hour view. */
        this._hourView = true;
        this._hours = [];
        this._minutes = [];
        this._timeChanged = false;
        /** Called when the user has put their pointer down on the clock. */
        this._pointerDown = (event) => {
            this._timeChanged = false;
            this.setTime(event);
            this._bindGlobalEvents(event);
        };
        /**
         * Called when the user has moved their pointer after
         * starting to drag. Bound on the document level.
         */
        this._pointerMove = (event) => {
            if (event.cancelable) {
                event.preventDefault();
            }
            this.setTime(event);
        };
        /** Called when the user has lifted their pointer. Bound on the document level. */
        this._pointerUp = (event) => {
            if (event.cancelable) {
                event.preventDefault();
            }
            this._removeGlobalEvents();
            if (this._timeChanged) {
                this.selectedChange.emit(this.activeDate);
                if (!this._hourView) {
                    this._userSelection.emit();
                }
            }
        };
    }
    /**
     * The date to display in this clock view.
     */
    get activeDate() {
        return this._activeDate;
    }
    set activeDate(value) {
        const oldActiveDate = this._activeDate;
        this._activeDate = this._adapter.clampDate(value, this.minDate, this.maxDate);
        if (!this._adapter.sameMinute(oldActiveDate, this._activeDate)) {
            this._init();
        }
    }
    /** The currently selected date. */
    get selected() {
        return this._selected;
    }
    set selected(value) {
        this._selected = this._adapter.getValidDateOrNull(this._adapter.deserialize(value));
        if (this._selected) {
            this.activeDate = this._selected;
        }
    }
    /** The minimum selectable date. */
    get minDate() {
        return this._minDate;
    }
    set minDate(value) {
        this._minDate = this._adapter.getValidDateOrNull(this._adapter.deserialize(value));
    }
    /** The maximum selectable date. */
    get maxDate() {
        return this._maxDate;
    }
    set maxDate(value) {
        this._maxDate = this._adapter.getValidDateOrNull(this._adapter.deserialize(value));
    }
    /** Whether the clock should be started in hour or minute view. */
    set startView(value) {
        this._hourView = value !== 'minute';
    }
    get _hand() {
        const hour = this._adapter.getHour(this.activeDate);
        this._selectedHour = hour;
        this._selectedMinute = this._adapter.getMinute(this.activeDate);
        let deg = 0;
        let radius = CLOCK_OUTER_RADIUS;
        if (this._hourView) {
            const outer = this._selectedHour > 0 && this._selectedHour < 13;
            radius = outer ? CLOCK_OUTER_RADIUS : CLOCK_INNER_RADIUS;
            if (this.twelvehour) {
                radius = CLOCK_OUTER_RADIUS;
            }
            deg = Math.round(this._selectedHour * (360 / (24 / 2)));
        }
        else {
            deg = Math.round(this._selectedMinute * (360 / 60));
        }
        return {
            height: `${radius}%`,
            marginTop: `${50 - radius}%`,
            transform: `rotate(${deg}deg)`,
        };
    }
    ngAfterContentInit() {
        this.activeDate = this._activeDate || this._adapter.today();
        this._init();
    }
    ngOnDestroy() {
        this._removeGlobalEvents();
    }
    ngOnChanges() {
        this._init();
    }
    /** Binds our global move and end events. */
    _bindGlobalEvents(triggerEvent) {
        // Note that we bind the events to the `document`, because it allows us to capture
        // drag cancel events where the user's pointer is outside the browser window.
        const document = this._document;
        const isTouch = isTouchEvent(triggerEvent);
        const moveEventName = isTouch ? 'touchmove' : 'mousemove';
        const endEventName = isTouch ? 'touchend' : 'mouseup';
        document.addEventListener(moveEventName, this._pointerMove, activeEventOptions);
        document.addEventListener(endEventName, this._pointerUp, activeEventOptions);
        if (isTouch) {
            document.addEventListener('touchcancel', this._pointerUp, activeEventOptions);
        }
    }
    /** Removes any global event listeners that we may have added. */
    _removeGlobalEvents() {
        const document = this._document;
        document.removeEventListener('mousemove', this._pointerMove, activeEventOptions);
        document.removeEventListener('mouseup', this._pointerUp, activeEventOptions);
        document.removeEventListener('touchmove', this._pointerMove, activeEventOptions);
        document.removeEventListener('touchend', this._pointerUp, activeEventOptions);
        document.removeEventListener('touchcancel', this._pointerUp, activeEventOptions);
    }
    /** Initializes this clock view. */
    _init() {
        this._hours.length = 0;
        this._minutes.length = 0;
        const hourNames = this._adapter.getHourNames();
        const minuteNames = this._adapter.getMinuteNames();
        if (this.twelvehour) {
            const hours = [];
            for (let i = 0; i < hourNames.length; i++) {
                const radian = (i / 6) * Math.PI;
                const radius = CLOCK_OUTER_RADIUS;
                const hour = i;
                const date = this._adapter.createDatetime(this._adapter.getYear(this.activeDate), this._adapter.getMonth(this.activeDate), this._adapter.getDate(this.activeDate), hour, 0);
                // Check if the date is enabled, no need to respect the minute setting here
                const enabled = (!this.minDate ||
                    this._adapter.compareDatetime(date, this.minDate, false) >= 0) &&
                    (!this.maxDate ||
                        this._adapter.compareDatetime(date, this.maxDate, false) <= 0) &&
                    (!this.dateFilter || this.dateFilter(date, MtxDatetimepickerFilterType.HOUR));
                // display value for twelvehour clock should be from 1-12 not including 0 and not above 12
                hours.push({
                    value: i,
                    displayValue: i % 12 === 0 ? '12' : hourNames[i % 12],
                    enabled,
                    top: CLOCK_RADIUS - Math.cos(radian) * radius - CLOCK_TICK_RADIUS,
                    left: CLOCK_RADIUS + Math.sin(radian) * radius - CLOCK_TICK_RADIUS,
                });
            }
            // filter out AM or PM hours based on AMPM
            if (this.AMPM === 'AM') {
                this._hours = hours.filter(x => x.value < 12);
            }
            else {
                this._hours = hours.filter(x => x.value >= 12);
            }
        }
        else {
            for (let i = 0; i < hourNames.length; i++) {
                const radian = (i / 6) * Math.PI;
                const outer = i > 0 && i < 13;
                const radius = outer ? CLOCK_OUTER_RADIUS : CLOCK_INNER_RADIUS;
                const date = this._adapter.createDatetime(this._adapter.getYear(this.activeDate), this._adapter.getMonth(this.activeDate), this._adapter.getDate(this.activeDate), i, 0);
                // Check if the date is enabled, no need to respect the minute setting here
                const enabled = (!this.minDate ||
                    this._adapter.compareDatetime(date, this.minDate, false) >= 0) &&
                    (!this.maxDate ||
                        this._adapter.compareDatetime(date, this.maxDate, false) <= 0) &&
                    (!this.dateFilter || this.dateFilter(date, MtxDatetimepickerFilterType.HOUR));
                this._hours.push({
                    value: i,
                    displayValue: i === 0 ? '00' : hourNames[i],
                    enabled,
                    top: CLOCK_RADIUS - Math.cos(radian) * radius - CLOCK_TICK_RADIUS,
                    left: CLOCK_RADIUS + Math.sin(radian) * radius - CLOCK_TICK_RADIUS,
                    fontSize: i > 0 && i < 13 ? '' : '80%',
                });
            }
        }
        for (let i = 0; i < minuteNames.length; i += 5) {
            const radian = (i / 30) * Math.PI;
            const date = this._adapter.createDatetime(this._adapter.getYear(this.activeDate), this._adapter.getMonth(this.activeDate), this._adapter.getDate(this.activeDate), this._adapter.getHour(this.activeDate), i);
            const enabled = (!this.minDate || this._adapter.compareDatetime(date, this.minDate) >= 0) &&
                (!this.maxDate || this._adapter.compareDatetime(date, this.maxDate) <= 0) &&
                (!this.dateFilter || this.dateFilter(date, MtxDatetimepickerFilterType.MINUTE));
            this._minutes.push({
                value: i,
                displayValue: i === 0 ? '00' : minuteNames[i],
                enabled,
                top: CLOCK_RADIUS - Math.cos(radian) * CLOCK_OUTER_RADIUS - CLOCK_TICK_RADIUS,
                left: CLOCK_RADIUS + Math.sin(radian) * CLOCK_OUTER_RADIUS - CLOCK_TICK_RADIUS,
            });
        }
    }
    /**
     * Set Time
     * @param event
     */
    setTime(event) {
        const trigger = this._elementRef.nativeElement;
        const triggerRect = trigger.getBoundingClientRect();
        const width = trigger.offsetWidth;
        const height = trigger.offsetHeight;
        const { pageX, pageY } = getPointerPositionOnPage(event);
        const x = width / 2 - (pageX - triggerRect.left - window.pageXOffset);
        const y = height / 2 - (pageY - triggerRect.top - window.pageYOffset);
        let radian = Math.atan2(-x, y);
        const unit = Math.PI / (this._hourView ? 6 : this.interval ? 30 / this.interval : 30);
        const z = Math.sqrt(x * x + y * y);
        const outer = this._hourView &&
            z > (width * (CLOCK_OUTER_RADIUS / 100) + width * (CLOCK_INNER_RADIUS / 100)) / 2;
        if (radian < 0) {
            radian = Math.PI * 2 + radian;
        }
        let value = Math.round(radian / unit);
        let date;
        if (this._hourView) {
            if (this.twelvehour) {
                if (this.AMPM === 'AM') {
                    value = value === 0 ? 12 : value;
                }
                else {
                    // if we chosen 12 in PM, the value should be 0 for 0:00,
                    // else we can safely add 12 to the final value
                    value = value === 12 ? 0 : value + 12;
                }
            }
            else {
                if (value === 12) {
                    value = 0;
                }
                value = outer ? (value === 0 ? 12 : value) : value === 0 ? 0 : value + 12;
            }
            date = this._adapter.createDatetime(this._adapter.getYear(this.activeDate), this._adapter.getMonth(this.activeDate), this._adapter.getDate(this.activeDate), value, this._adapter.getMinute(this.activeDate));
        }
        else {
            if (this.interval) {
                value *= this.interval;
            }
            if (value === 60) {
                value = 0;
            }
            date = this._adapter.createDatetime(this._adapter.getYear(this.activeDate), this._adapter.getMonth(this.activeDate), this._adapter.getDate(this.activeDate), this._adapter.getHour(this.activeDate), value);
        }
        // if there is a dateFilter, check if the date is allowed if it is not then do not set/emit new date
        // https://github.com/ng-matero/extensions/issues/244
        if (this.dateFilter &&
            !this.dateFilter(date, this._hourView ? MtxDatetimepickerFilterType.HOUR : MtxDatetimepickerFilterType.MINUTE)) {
            return;
        }
        this._timeChanged = true;
        this.activeDate = date;
        this._changeDetectorRef.markForCheck();
        this.activeDateChange.emit(this.activeDate);
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxClock, deps: [{ token: i0.ElementRef }, { token: i1.DatetimeAdapter }, { token: i0.ChangeDetectorRef }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Component }); }
    /** @nocollapse */ static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.0.1", type: MtxClock, isStandalone: true, selector: "mtx-clock", inputs: { dateFilter: "dateFilter", interval: "interval", twelvehour: ["twelvehour", "twelvehour", booleanAttribute], AMPM: "AMPM", activeDate: "activeDate", selected: "selected", minDate: "minDate", maxDate: "maxDate", startView: "startView" }, outputs: { selectedChange: "selectedChange", activeDateChange: "activeDateChange", _userSelection: "_userSelection" }, host: { attributes: { "role": "clock" }, listeners: { "mousedown": "_pointerDown($event)", "touchstart": "_pointerDown($event)" }, classAttribute: "mtx-clock" }, exportAs: ["mtxClock"], usesOnChanges: true, ngImport: i0, template: "<div class=\"mtx-clock-wrapper\">\n  <div class=\"mtx-clock-center\"></div>\n  <div class=\"mtx-clock-hand\" [style]=\"_hand\"></div>\n  <div class=\"mtx-clock-hours\" [class.active]=\"_hourView\">\n    @for (item of _hours; track item.value) {\n      <div\n        class=\"mtx-clock-cell\"\n        [class.mtx-clock-cell-disabled]=\"!item.enabled\"\n        [class.mtx-clock-cell-selected]=\"_selectedHour === item.value\"\n        [style.fontSize]=\"item.fontSize\"\n        [style.left]=\"item.left+'%'\"\n        [style.top]=\"item.top+'%'\">{{ item.displayValue }}</div>\n    }\n  </div>\n  <div class=\"mtx-clock-minutes\" [class.active]=\"!_hourView\">\n    @for (item of _minutes; track item.value) {\n      <div\n        class=\"mtx-clock-cell\"\n        [class.mtx-clock-cell-disabled]=\"!item.enabled\"\n        [class.mtx-clock-cell-selected]=\"_selectedMinute === item.value\"\n        [style.left]=\"item.left+'%'\"\n        [style.top]=\"item.top+'%'\">{{ item.displayValue }}</div>\n    }\n  </div>\n</div>\n", styles: [".mtx-clock{position:relative;display:block;min-width:224px;margin:12px;box-sizing:border-box;-webkit-user-select:none;user-select:none;touch-action:none;font-size:var(--mtx-datetimepicker-clock-text-size)}.mtx-clock-wrapper{position:relative;width:100%;height:0;padding-top:100%;border-radius:50%;background-color:var(--mtx-datetimepicker-clock-dial-background-color)}.mtx-clock-center{position:absolute;top:50%;left:50%;width:3%;height:3%;margin:-1.5%;border-radius:50%;background-color:var(--mtx-datetimepicker-clock-hand-background-color)}.mtx-clock-hand{position:absolute;inset:0;width:2px;margin:0 auto;transform-origin:bottom;background-color:var(--mtx-datetimepicker-clock-hand-background-color)}.mtx-clock-hand:before{content:\"\";position:absolute;top:-4px;left:-3px;width:8px;height:8px;border-radius:50%;background-color:var(--mtx-datetimepicker-clock-hand-background-color)}.mtx-clock-hours,.mtx-clock-minutes{position:absolute;top:0;left:0;width:100%;height:100%;opacity:0;visibility:hidden;transition:.35s;transform:scale(1.2)}.mtx-clock-hours.active,.mtx-clock-minutes.active{opacity:1;visibility:visible;transform:scale(1)}.mtx-clock-minutes{transform:scale(.8)}.mtx-clock-cell{position:absolute;display:flex;width:14.1666%;height:14.1666%;justify-content:center;box-sizing:border-box;border-radius:50%;align-items:center;cursor:pointer;color:var(--mtx-datetimepicker-clock-cell-text-color)}.mtx-clock-cell.mtx-clock-cell-selected{color:#fff;background-color:var(--mtx-datetimepicker-clock-hand-background-color)}.mtx-clock-cell:not(.mtx-clock-cell-selected,.mtx-clock-cell-disabled):hover{background-color:var(--mtx-datetimepicker-clock-cell-hover-state-background-color)}.mtx-clock-cell.mtx-clock-cell-disabled{pointer-events:none;color:var(--mtx-datetimepicker-clock-cell-disabled-state-text-color)}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxClock, decorators: [{
            type: Component,
            args: [{ selector: 'mtx-clock', host: {
                        'role': 'clock',
                        'class': 'mtx-clock',
                        '(mousedown)': '_pointerDown($event)',
                        '(touchstart)': '_pointerDown($event)',
                    }, exportAs: 'mtxClock', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, standalone: true, template: "<div class=\"mtx-clock-wrapper\">\n  <div class=\"mtx-clock-center\"></div>\n  <div class=\"mtx-clock-hand\" [style]=\"_hand\"></div>\n  <div class=\"mtx-clock-hours\" [class.active]=\"_hourView\">\n    @for (item of _hours; track item.value) {\n      <div\n        class=\"mtx-clock-cell\"\n        [class.mtx-clock-cell-disabled]=\"!item.enabled\"\n        [class.mtx-clock-cell-selected]=\"_selectedHour === item.value\"\n        [style.fontSize]=\"item.fontSize\"\n        [style.left]=\"item.left+'%'\"\n        [style.top]=\"item.top+'%'\">{{ item.displayValue }}</div>\n    }\n  </div>\n  <div class=\"mtx-clock-minutes\" [class.active]=\"!_hourView\">\n    @for (item of _minutes; track item.value) {\n      <div\n        class=\"mtx-clock-cell\"\n        [class.mtx-clock-cell-disabled]=\"!item.enabled\"\n        [class.mtx-clock-cell-selected]=\"_selectedMinute === item.value\"\n        [style.left]=\"item.left+'%'\"\n        [style.top]=\"item.top+'%'\">{{ item.displayValue }}</div>\n    }\n  </div>\n</div>\n", styles: [".mtx-clock{position:relative;display:block;min-width:224px;margin:12px;box-sizing:border-box;-webkit-user-select:none;user-select:none;touch-action:none;font-size:var(--mtx-datetimepicker-clock-text-size)}.mtx-clock-wrapper{position:relative;width:100%;height:0;padding-top:100%;border-radius:50%;background-color:var(--mtx-datetimepicker-clock-dial-background-color)}.mtx-clock-center{position:absolute;top:50%;left:50%;width:3%;height:3%;margin:-1.5%;border-radius:50%;background-color:var(--mtx-datetimepicker-clock-hand-background-color)}.mtx-clock-hand{position:absolute;inset:0;width:2px;margin:0 auto;transform-origin:bottom;background-color:var(--mtx-datetimepicker-clock-hand-background-color)}.mtx-clock-hand:before{content:\"\";position:absolute;top:-4px;left:-3px;width:8px;height:8px;border-radius:50%;background-color:var(--mtx-datetimepicker-clock-hand-background-color)}.mtx-clock-hours,.mtx-clock-minutes{position:absolute;top:0;left:0;width:100%;height:100%;opacity:0;visibility:hidden;transition:.35s;transform:scale(1.2)}.mtx-clock-hours.active,.mtx-clock-minutes.active{opacity:1;visibility:visible;transform:scale(1)}.mtx-clock-minutes{transform:scale(.8)}.mtx-clock-cell{position:absolute;display:flex;width:14.1666%;height:14.1666%;justify-content:center;box-sizing:border-box;border-radius:50%;align-items:center;cursor:pointer;color:var(--mtx-datetimepicker-clock-cell-text-color)}.mtx-clock-cell.mtx-clock-cell-selected{color:#fff;background-color:var(--mtx-datetimepicker-clock-hand-background-color)}.mtx-clock-cell:not(.mtx-clock-cell-selected,.mtx-clock-cell-disabled):hover{background-color:var(--mtx-datetimepicker-clock-cell-hover-state-background-color)}.mtx-clock-cell.mtx-clock-cell-disabled{pointer-events:none;color:var(--mtx-datetimepicker-clock-cell-disabled-state-text-color)}\n"] }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i1.DatetimeAdapter }, { type: i0.ChangeDetectorRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }], propDecorators: { dateFilter: [{
                type: Input
            }], interval: [{
                type: Input
            }], twelvehour: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], AMPM: [{
                type: Input
            }], selectedChange: [{
                type: Output
            }], activeDateChange: [{
                type: Output
            }], _userSelection: [{
                type: Output
            }], activeDate: [{
                type: Input
            }], selected: [{
                type: Input
            }], minDate: [{
                type: Input
            }], maxDate: [{
                type: Input
            }], startView: [{
                type: Input
            }] } });
/** Returns whether an event is a touch event. */
function isTouchEvent(event) {
    // This function is called for every pixel that the user has dragged so we need it to be
    // as fast as possible. Since we only bind mouse events and touch events, we can assume
    // that if the event's name starts with `t`, it's a touch event.
    return event.type[0] === 't';
}
/** Gets the coordinates of a touch or mouse event relative to the document. */
function getPointerPositionOnPage(event) {
    let point;
    if (isTouchEvent(event)) {
        // `touches` will be empty for start/end events so we have to fall back to `changedTouches`.
        point = event.touches[0] || event.changedTouches[0];
    }
    else {
        point = event;
    }
    return point;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xvY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9leHRlbnNpb25zL2RhdGV0aW1lcGlja2VyL2Nsb2NrLnRzIiwiLi4vLi4vLi4vLi4vcHJvamVjdHMvZXh0ZW5zaW9ucy9kYXRldGltZXBpY2tlci9jbG9jay5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSwrQkFBK0IsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ3hFLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMzQyxPQUFPLEVBRUwsdUJBQXVCLEVBRXZCLFNBQVMsRUFFVCxZQUFZLEVBQ1osTUFBTSxFQUNOLEtBQUssRUFHTCxNQUFNLEVBQ04saUJBQWlCLEVBQ2pCLGdCQUFnQixHQUNqQixNQUFNLGVBQWUsQ0FBQztBQUd2QixPQUFPLEVBQUUsMkJBQTJCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQzs7O0FBRzFFLE1BQU0sa0JBQWtCLEdBQUcsK0JBQStCLENBQUMsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztBQUUvRSxNQUFNLENBQUMsTUFBTSxZQUFZLEdBQUcsRUFBRSxDQUFDO0FBQy9CLE1BQU0sQ0FBQyxNQUFNLGtCQUFrQixHQUFHLElBQUksQ0FBQztBQUN2QyxNQUFNLENBQUMsTUFBTSxrQkFBa0IsR0FBRyxLQUFLLENBQUM7QUFDeEMsTUFBTSxDQUFDLE1BQU0saUJBQWlCLEdBQUcsTUFBTSxDQUFDO0FBS3hDOzs7R0FHRztBQWdCSCxNQUFNLE9BQU8sUUFBUTtJQW1DbkIsWUFDVSxXQUF1QixFQUN2QixRQUE0QixFQUM1QixrQkFBcUMsRUFDbkIsU0FBYztRQUhoQyxnQkFBVyxHQUFYLFdBQVcsQ0FBWTtRQUN2QixhQUFRLEdBQVIsUUFBUSxDQUFvQjtRQUM1Qix1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW1CO1FBQ25CLGNBQVMsR0FBVCxTQUFTLENBQUs7UUFuQzFD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QUFDLEVBQUUsQ0FBQztRQUN4Qiw0RkFBNEY7UUFDNUYsS0FBSyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN0RCxDQUFDO1NBQU0sQ0FBQztRQUNOLEtBQUssR0FBRyxLQUFLLENBQUM7SUFDaEIsQ0FBQztJQUVELE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IG5vcm1hbGl6ZVBhc3NpdmVMaXN0ZW5lck9wdGlvbnMgfSBmcm9tICdAYW5ndWxhci9jZGsvcGxhdGZvcm0nO1xuaW1wb3J0IHsgRE9DVU1FTlQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgT25DaGFuZ2VzLFxuICBPbkRlc3Ryb3ksXG4gIE91dHB1dCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIGJvb2xlYW5BdHRyaWJ1dGUsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBEYXRldGltZUFkYXB0ZXIgfSBmcm9tICdAbmctbWF0ZXJvL2V4dGVuc2lvbnMvY29yZSc7XG5pbXBvcnQgeyBNdHhEYXRldGltZXBpY2tlckZpbHRlclR5cGUgfSBmcm9tICcuL2RhdGV0aW1lcGlja2VyLWZpbHRlcnR5cGUnO1xuaW1wb3J0IHsgTXR4QU1QTSB9IGZyb20gJy4vZGF0ZXRpbWVwaWNrZXItdHlwZXMnO1xuXG5jb25zdCBhY3RpdmVFdmVudE9wdGlvbnMgPSBub3JtYWxpemVQYXNzaXZlTGlzdGVuZXJPcHRpb25zKHsgcGFzc2l2ZTogZmFsc2UgfSk7XG5cbmV4cG9ydCBjb25zdCBDTE9DS19SQURJVVMgPSA1MDtcbmV4cG9ydCBjb25zdCBDTE9DS19JTk5FUl9SQURJVVMgPSAyNy41O1xuZXhwb3J0IGNvbnN0IENMT0NLX09VVEVSX1JBRElVUyA9IDQxLjI1O1xuZXhwb3J0IGNvbnN0IENMT0NLX1RJQ0tfUkFESVVTID0gNy4wODMzO1xuXG4vKiogUG9zc2libGUgdmlld3MgZm9yIGRhdGV0aW1lcGlja2VyIGNsb2NrLiAqL1xuZXhwb3J0IHR5cGUgTXR4Q2xvY2tWaWV3ID0gJ2hvdXInIHwgJ21pbnV0ZSc7XG5cbi8qKlxuICogQSBjbG9jayB0aGF0IGlzIHVzZWQgYXMgcGFydCBvZiB0aGUgZGF0ZXRpbWVwaWNrZXIuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ210eC1jbG9jaycsXG4gIHRlbXBsYXRlVXJsOiAnY2xvY2suaHRtbCcsXG4gIHN0eWxlVXJsOiAnY2xvY2suc2NzcycsXG4gIGhvc3Q6IHtcbiAgICAncm9sZSc6ICdjbG9jaycsXG4gICAgJ2NsYXNzJzogJ210eC1jbG9jaycsXG4gICAgJyhtb3VzZWRvd24pJzogJ19wb2ludGVyRG93bigkZXZlbnQpJyxcbiAgICAnKHRvdWNoc3RhcnQpJzogJ19wb2ludGVyRG93bigkZXZlbnQpJyxcbiAgfSxcbiAgZXhwb3J0QXM6ICdtdHhDbG9jaycsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBzdGFuZGFsb25lOiB0cnVlLFxufSlcbmV4cG9ydCBjbGFzcyBNdHhDbG9jazxEPiBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQsIE9uRGVzdHJveSwgT25DaGFuZ2VzIHtcbiAgLyoqIEEgZnVuY3Rpb24gdXNlZCB0byBmaWx0ZXIgd2hpY2ggZGF0ZXMgYXJlIHNlbGVjdGFibGUuICovXG4gIEBJbnB1dCgpIGRhdGVGaWx0ZXIhOiAoZGF0ZTogRCwgdHlwZTogTXR4RGF0ZXRpbWVwaWNrZXJGaWx0ZXJUeXBlKSA9PiBib29sZWFuO1xuXG4gIC8qKiBTdGVwIG92ZXIgbWludXRlcy4gKi9cbiAgQElucHV0KCkgaW50ZXJ2YWw6IG51bWJlciA9IDE7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNsb2NrIHVzZXMgMTIgaG91ciBmb3JtYXQuICovXG4gIEBJbnB1dCh7IHRyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZSB9KSB0d2VsdmVob3VyOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHRpbWUgaXMgbm93IGluIEFNIG9yIFBNLiAqL1xuICBASW5wdXQoKSBBTVBNOiBNdHhBTVBNID0gJ0FNJztcblxuICAvKiogRW1pdHMgd2hlbiB0aGUgY3VycmVudGx5IHNlbGVjdGVkIGRhdGUgY2hhbmdlcy4gKi9cbiAgQE91dHB1dCgpIHNlbGVjdGVkQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxEPigpO1xuXG4gIC8qKiBFbWl0cyB3aGVuIGFueSBkYXRlIGlzIGFjdGl2YXRlZC4gKi9cbiAgQE91dHB1dCgpIGFjdGl2ZURhdGVDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPEQ+KCk7XG5cbiAgLyoqIEVtaXRzIHdoZW4gYW55IGRhdGUgaXMgc2VsZWN0ZWQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBfdXNlclNlbGVjdGlvbiA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcblxuICAvKiogV2hldGhlciB0aGUgY2xvY2sgaXMgaW4gaG91ciB2aWV3LiAqL1xuICBfaG91clZpZXc6IGJvb2xlYW4gPSB0cnVlO1xuXG4gIF9ob3VyczogYW55W10gPSBbXTtcblxuICBfbWludXRlczogYW55W10gPSBbXTtcblxuICBfc2VsZWN0ZWRIb3VyITogbnVtYmVyO1xuXG4gIF9zZWxlY3RlZE1pbnV0ZSE6IG51bWJlcjtcblxuICBwcml2YXRlIF90aW1lQ2hhbmdlZCA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgcHJpdmF0ZSBfYWRhcHRlcjogRGF0ZXRpbWVBZGFwdGVyPEQ+LFxuICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIF9kb2N1bWVudDogYW55XG4gICkge31cblxuICAvKipcbiAgICogVGhlIGRhdGUgdG8gZGlzcGxheSBpbiB0aGlzIGNsb2NrIHZpZXcuXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgYWN0aXZlRGF0ZSgpOiBEIHtcbiAgICByZXR1cm4gdGhpcy5fYWN0aXZlRGF0ZTtcbiAgfVxuICBzZXQgYWN0aXZlRGF0ZSh2YWx1ZTogRCkge1xuICAgIGNvbnN0IG9sZEFjdGl2ZURhdGUgPSB0aGlzLl9hY3RpdmVEYXRlO1xuICAgIHRoaXMuX2FjdGl2ZURhdGUgPSB0aGlzLl9hZGFwdGVyLmNsYW1wRGF0ZSh2YWx1ZSwgdGhpcy5taW5EYXRlLCB0aGlzLm1heERhdGUpO1xuICAgIGlmICghdGhpcy5fYWRhcHRlci5zYW1lTWludXRlKG9sZEFjdGl2ZURhdGUsIHRoaXMuX2FjdGl2ZURhdGUpKSB7XG4gICAgICB0aGlzLl9pbml0KCk7XG4gICAgfVxuICB9XG4gIHByaXZhdGUgX2FjdGl2ZURhdGUhOiBEO1xuXG4gIC8qKiBUaGUgY3VycmVudGx5IHNlbGVjdGVkIGRhdGUuICovXG4gIEBJbnB1dCgpXG4gIGdldCBzZWxlY3RlZCgpOiBEIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuX3NlbGVjdGVkO1xuICB9XG4gIHNldCBzZWxlY3RlZCh2YWx1ZTogRCB8IG51bGwpIHtcbiAgICB0aGlzLl9zZWxlY3RlZCA9IHRoaXMuX2FkYXB0ZXIuZ2V0VmFsaWREYXRlT3JOdWxsKHRoaXMuX2FkYXB0ZXIuZGVzZXJpYWxpemUodmFsdWUpKTtcbiAgICBpZiAodGhpcy5fc2VsZWN0ZWQpIHtcbiAgICAgIHRoaXMuYWN0aXZlRGF0ZSA9IHRoaXMuX3NlbGVjdGVkO1xuICAgIH1cbiAgfVxuICBwcml2YXRlIF9zZWxlY3RlZCE6IEQgfCBudWxsO1xuXG4gIC8qKiBUaGUgbWluaW11bSBzZWxlY3RhYmxlIGRhdGUuICovXG4gIEBJbnB1dCgpXG4gIGdldCBtaW5EYXRlKCk6IEQgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5fbWluRGF0ZTtcbiAgfVxuICBzZXQgbWluRGF0ZSh2YWx1ZTogRCB8IG51bGwpIHtcbiAgICB0aGlzLl9taW5EYXRlID0gdGhpcy5fYWRhcHRlci5nZXRWYWxpZERhdGVPck51bGwodGhpcy5fYWRhcHRlci5kZXNlcmlhbGl6ZSh2YWx1ZSkpO1xuICB9XG4gIHByaXZhdGUgX21pbkRhdGUhOiBEIHwgbnVsbDtcblxuICAvKiogVGhlIG1heGltdW0gc2VsZWN0YWJsZSBkYXRlLiAqL1xuICBASW5wdXQoKVxuICBnZXQgbWF4RGF0ZSgpOiBEIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuX21heERhdGU7XG4gIH1cbiAgc2V0IG1heERhdGUodmFsdWU6IEQgfCBudWxsKSB7XG4gICAgdGhpcy5fbWF4RGF0ZSA9IHRoaXMuX2FkYXB0ZXIuZ2V0VmFsaWREYXRlT3JOdWxsKHRoaXMuX2FkYXB0ZXIuZGVzZXJpYWxpemUodmFsdWUpKTtcbiAgfVxuICBwcml2YXRlIF9tYXhEYXRlITogRCB8IG51bGw7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNsb2NrIHNob3VsZCBiZSBzdGFydGVkIGluIGhvdXIgb3IgbWludXRlIHZpZXcuICovXG4gIEBJbnB1dCgpXG4gIHNldCBzdGFydFZpZXcodmFsdWU6IE10eENsb2NrVmlldykge1xuICAgIHRoaXMuX2hvdXJWaWV3ID0gdmFsdWUgIT09ICdtaW51dGUnO1xuICB9XG5cbiAgZ2V0IF9oYW5kKCkge1xuICAgIGNvbnN0IGhvdXIgPSB0aGlzLl9hZGFwdGVyLmdldEhvdXIodGhpcy5hY3RpdmVEYXRlKTtcbiAgICB0aGlzLl9zZWxlY3RlZEhvdXIgPSBob3VyO1xuICAgIHRoaXMuX3NlbGVjdGVkTWludXRlID0gdGhpcy5fYWRhcHRlci5nZXRNaW51dGUodGhpcy5hY3RpdmVEYXRlKTtcbiAgICBsZXQgZGVnID0gMDtcbiAgICBsZXQgcmFkaXVzID0gQ0xPQ0tfT1VURVJfUkFESVVTO1xuICAgIGlmICh0aGlzLl9ob3VyVmlldykge1xuICAgICAgY29uc3Qgb3V0ZXIgPSB0aGlzLl9zZWxlY3RlZEhvdXIgPiAwICYmIHRoaXMuX3NlbGVjdGVkSG91ciA8IDEzO1xuICAgICAgcmFkaXVzID0gb3V0ZXIgPyBDTE9DS19PVVRFUl9SQURJVVMgOiBDTE9DS19JTk5FUl9SQURJVVM7XG4gICAgICBpZiAodGhpcy50d2VsdmVob3VyKSB7XG4gICAgICAgIHJhZGl1cyA9IENMT0NLX09VVEVSX1JBRElVUztcbiAgICAgIH1cbiAgICAgIGRlZyA9IE1hdGgucm91bmQodGhpcy5fc2VsZWN0ZWRIb3VyICogKDM2MCAvICgyNCAvIDIpKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlZyA9IE1hdGgucm91bmQodGhpcy5fc2VsZWN0ZWRNaW51dGUgKiAoMzYwIC8gNjApKTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIGhlaWdodDogYCR7cmFkaXVzfSVgLFxuICAgICAgbWFyZ2luVG9wOiBgJHs1MCAtIHJhZGl1c30lYCxcbiAgICAgIHRyYW5zZm9ybTogYHJvdGF0ZSgke2RlZ31kZWcpYCxcbiAgICB9O1xuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIHRoaXMuYWN0aXZlRGF0ZSA9IHRoaXMuX2FjdGl2ZURhdGUgfHwgdGhpcy5fYWRhcHRlci50b2RheSgpO1xuICAgIHRoaXMuX2luaXQoKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX3JlbW92ZUdsb2JhbEV2ZW50cygpO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoKTogdm9pZCB7XG4gICAgdGhpcy5faW5pdCgpO1xuICB9XG5cbiAgLyoqIENhbGxlZCB3aGVuIHRoZSB1c2VyIGhhcyBwdXQgdGhlaXIgcG9pbnRlciBkb3duIG9uIHRoZSBjbG9jay4gKi9cbiAgcHJpdmF0ZSBfcG9pbnRlckRvd24gPSAoZXZlbnQ6IFRvdWNoRXZlbnQgfCBNb3VzZUV2ZW50KSA9PiB7XG4gICAgdGhpcy5fdGltZUNoYW5nZWQgPSBmYWxzZTtcbiAgICB0aGlzLnNldFRpbWUoZXZlbnQpO1xuICAgIHRoaXMuX2JpbmRHbG9iYWxFdmVudHMoZXZlbnQpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgdXNlciBoYXMgbW92ZWQgdGhlaXIgcG9pbnRlciBhZnRlclxuICAgKiBzdGFydGluZyB0byBkcmFnLiBCb3VuZCBvbiB0aGUgZG9jdW1lbnQgbGV2ZWwuXG4gICAqL1xuICBwcml2YXRlIF9wb2ludGVyTW92ZSA9IChldmVudDogVG91Y2hFdmVudCB8IE1vdXNlRXZlbnQpID0+IHtcbiAgICBpZiAoZXZlbnQuY2FuY2VsYWJsZSkge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG4gICAgdGhpcy5zZXRUaW1lKGV2ZW50KTtcbiAgfTtcblxuICAvKiogQ2FsbGVkIHdoZW4gdGhlIHVzZXIgaGFzIGxpZnRlZCB0aGVpciBwb2ludGVyLiBCb3VuZCBvbiB0aGUgZG9jdW1lbnQgbGV2ZWwuICovXG4gIHByaXZhdGUgX3BvaW50ZXJVcCA9IChldmVudDogVG91Y2hFdmVudCB8IE1vdXNlRXZlbnQpID0+IHtcbiAgICBpZiAoZXZlbnQuY2FuY2VsYWJsZSkge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG4gICAgdGhpcy5fcmVtb3ZlR2xvYmFsRXZlbnRzKCk7XG5cbiAgICBpZiAodGhpcy5fdGltZUNoYW5nZWQpIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWRDaGFuZ2UuZW1pdCh0aGlzLmFjdGl2ZURhdGUpO1xuICAgICAgaWYgKCF0aGlzLl9ob3VyVmlldykge1xuICAgICAgICB0aGlzLl91c2VyU2VsZWN0aW9uLmVtaXQoKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgLyoqIEJpbmRzIG91ciBnbG9iYWwgbW92ZSBhbmQgZW5kIGV2ZW50cy4gKi9cbiAgcHJpdmF0ZSBfYmluZEdsb2JhbEV2ZW50cyh0cmlnZ2VyRXZlbnQ6IFRvdWNoRXZlbnQgfCBNb3VzZUV2ZW50KSB7XG4gICAgLy8gTm90ZSB0aGF0IHdlIGJpbmQgdGhlIGV2ZW50cyB0byB0aGUgYGRvY3VtZW50YCwgYmVjYXVzZSBpdCBhbGxvd3MgdXMgdG8gY2FwdHVyZVxuICAgIC8vIGRyYWcgY2FuY2VsIGV2ZW50cyB3aGVyZSB0aGUgdXNlcidzIHBvaW50ZXIgaXMgb3V0c2lkZSB0aGUgYnJvd3NlciB3aW5kb3cuXG4gICAgY29uc3QgZG9jdW1lbnQgPSB0aGlzLl9kb2N1bWVudDtcbiAgICBjb25zdCBpc1RvdWNoID0gaXNUb3VjaEV2ZW50KHRyaWdnZXJFdmVudCk7XG4gICAgY29uc3QgbW92ZUV2ZW50TmFtZSA9IGlzVG91Y2ggPyAndG91Y2htb3ZlJyA6ICdtb3VzZW1vdmUnO1xuICAgIGNvbnN0IGVuZEV2ZW50TmFtZSA9IGlzVG91Y2ggPyAndG91Y2hlbmQnIDogJ21vdXNldXAnO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIobW92ZUV2ZW50TmFtZSwgdGhpcy5fcG9pbnRlck1vdmUsIGFjdGl2ZUV2ZW50T3B0aW9ucyk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihlbmRFdmVudE5hbWUsIHRoaXMuX3BvaW50ZXJVcCwgYWN0aXZlRXZlbnRPcHRpb25zKTtcblxuICAgIGlmIChpc1RvdWNoKSB7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGNhbmNlbCcsIHRoaXMuX3BvaW50ZXJVcCwgYWN0aXZlRXZlbnRPcHRpb25zKTtcbiAgICB9XG4gIH1cblxuICAvKiogUmVtb3ZlcyBhbnkgZ2xvYmFsIGV2ZW50IGxpc3RlbmVycyB0aGF0IHdlIG1heSBoYXZlIGFkZGVkLiAqL1xuICBwcml2YXRlIF9yZW1vdmVHbG9iYWxFdmVudHMoKSB7XG4gICAgY29uc3QgZG9jdW1lbnQgPSB0aGlzLl9kb2N1bWVudDtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLl9wb2ludGVyTW92ZSwgYWN0aXZlRXZlbnRPcHRpb25zKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5fcG9pbnRlclVwLCBhY3RpdmVFdmVudE9wdGlvbnMpO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHRoaXMuX3BvaW50ZXJNb3ZlLCBhY3RpdmVFdmVudE9wdGlvbnMpO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdGhpcy5fcG9pbnRlclVwLCBhY3RpdmVFdmVudE9wdGlvbnMpO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoY2FuY2VsJywgdGhpcy5fcG9pbnRlclVwLCBhY3RpdmVFdmVudE9wdGlvbnMpO1xuICB9XG5cbiAgLyoqIEluaXRpYWxpemVzIHRoaXMgY2xvY2sgdmlldy4gKi9cbiAgcHJpdmF0ZSBfaW5pdCgpIHtcbiAgICB0aGlzLl9ob3Vycy5sZW5ndGggPSAwO1xuICAgIHRoaXMuX21pbnV0ZXMubGVuZ3RoID0gMDtcblxuICAgIGNvbnN0IGhvdXJOYW1lcyA9IHRoaXMuX2FkYXB0ZXIuZ2V0SG91ck5hbWVzKCk7XG4gICAgY29uc3QgbWludXRlTmFtZXMgPSB0aGlzLl9hZGFwdGVyLmdldE1pbnV0ZU5hbWVzKCk7XG4gICAgaWYgKHRoaXMudHdlbHZlaG91cikge1xuICAgICAgY29uc3QgaG91cnMgPSBbXTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaG91ck5hbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHJhZGlhbiA9IChpIC8gNikgKiBNYXRoLlBJO1xuICAgICAgICBjb25zdCByYWRpdXMgPSBDTE9DS19PVVRFUl9SQURJVVM7XG5cbiAgICAgICAgY29uc3QgaG91ciA9IGk7XG4gICAgICAgIGNvbnN0IGRhdGUgPSB0aGlzLl9hZGFwdGVyLmNyZWF0ZURhdGV0aW1lKFxuICAgICAgICAgIHRoaXMuX2FkYXB0ZXIuZ2V0WWVhcih0aGlzLmFjdGl2ZURhdGUpLFxuICAgICAgICAgIHRoaXMuX2FkYXB0ZXIuZ2V0TW9udGgodGhpcy5hY3RpdmVEYXRlKSxcbiAgICAgICAgICB0aGlzLl9hZGFwdGVyLmdldERhdGUodGhpcy5hY3RpdmVEYXRlKSxcbiAgICAgICAgICBob3VyLFxuICAgICAgICAgIDBcbiAgICAgICAgKTtcblxuICAgICAgICAvLyBDaGVjayBpZiB0aGUgZGF0ZSBpcyBlbmFibGVkLCBubyBuZWVkIHRvIHJlc3BlY3QgdGhlIG1pbnV0ZSBzZXR0aW5nIGhlcmVcbiAgICAgICAgY29uc3QgZW5hYmxlZCA9XG4gICAgICAgICAgKCF0aGlzLm1pbkRhdGUgfHxcbiAgICAgICAgICAgICh0aGlzLl9hZGFwdGVyLmNvbXBhcmVEYXRldGltZShkYXRlLCB0aGlzLm1pbkRhdGUsIGZhbHNlKSBhcyBudW1iZXIpID49IDApICYmXG4gICAgICAgICAgKCF0aGlzLm1heERhdGUgfHxcbiAgICAgICAgICAgICh0aGlzLl9hZGFwdGVyLmNvbXBhcmVEYXRldGltZShkYXRlLCB0aGlzLm1heERhdGUsIGZhbHNlKSBhcyBudW1iZXIpIDw9IDApICYmXG4gICAgICAgICAgKCF0aGlzLmRhdGVGaWx0ZXIgfHwgdGhpcy5kYXRlRmlsdGVyKGRhdGUsIE10eERhdGV0aW1lcGlja2VyRmlsdGVyVHlwZS5IT1VSKSk7XG5cbiAgICAgICAgLy8gZGlzcGxheSB2YWx1ZSBmb3IgdHdlbHZlaG91ciBjbG9jayBzaG91bGQgYmUgZnJvbSAxLTEyIG5vdCBpbmNsdWRpbmcgMCBhbmQgbm90IGFib3ZlIDEyXG4gICAgICAgIGhvdXJzLnB1c2goe1xuICAgICAgICAgIHZhbHVlOiBpLFxuICAgICAgICAgIGRpc3BsYXlWYWx1ZTogaSAlIDEyID09PSAwID8gJzEyJyA6IGhvdXJOYW1lc1tpICUgMTJdLFxuICAgICAgICAgIGVuYWJsZWQsXG4gICAgICAgICAgdG9wOiBDTE9DS19SQURJVVMgLSBNYXRoLmNvcyhyYWRpYW4pICogcmFkaXVzIC0gQ0xPQ0tfVElDS19SQURJVVMsXG4gICAgICAgICAgbGVmdDogQ0xPQ0tfUkFESVVTICsgTWF0aC5zaW4ocmFkaWFuKSAqIHJhZGl1cyAtIENMT0NLX1RJQ0tfUkFESVVTLFxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgLy8gZmlsdGVyIG91dCBBTSBvciBQTSBob3VycyBiYXNlZCBvbiBBTVBNXG4gICAgICBpZiAodGhpcy5BTVBNID09PSAnQU0nKSB7XG4gICAgICAgIHRoaXMuX2hvdXJzID0gaG91cnMuZmlsdGVyKHggPT4geC52YWx1ZSA8IDEyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2hvdXJzID0gaG91cnMuZmlsdGVyKHggPT4geC52YWx1ZSA+PSAxMik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaG91ck5hbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHJhZGlhbiA9IChpIC8gNikgKiBNYXRoLlBJO1xuICAgICAgICBjb25zdCBvdXRlciA9IGkgPiAwICYmIGkgPCAxMztcbiAgICAgICAgY29uc3QgcmFkaXVzID0gb3V0ZXIgPyBDTE9DS19PVVRFUl9SQURJVVMgOiBDTE9DS19JTk5FUl9SQURJVVM7XG4gICAgICAgIGNvbnN0IGRhdGUgPSB0aGlzLl9hZGFwdGVyLmNyZWF0ZURhdGV0aW1lKFxuICAgICAgICAgIHRoaXMuX2FkYXB0ZXIuZ2V0WWVhcih0aGlzLmFjdGl2ZURhdGUpLFxuICAgICAgICAgIHRoaXMuX2FkYXB0ZXIuZ2V0TW9udGgodGhpcy5hY3RpdmVEYXRlKSxcbiAgICAgICAgICB0aGlzLl9hZGFwdGVyLmdldERhdGUodGhpcy5hY3RpdmVEYXRlKSxcbiAgICAgICAgICBpLFxuICAgICAgICAgIDBcbiAgICAgICAgKTtcblxuICAgICAgICAvLyBDaGVjayBpZiB0aGUgZGF0ZSBpcyBlbmFibGVkLCBubyBuZWVkIHRvIHJlc3BlY3QgdGhlIG1pbnV0ZSBzZXR0aW5nIGhlcmVcbiAgICAgICAgY29uc3QgZW5hYmxlZCA9XG4gICAgICAgICAgKCF0aGlzLm1pbkRhdGUgfHxcbiAgICAgICAgICAgICh0aGlzLl9hZGFwdGVyLmNvbXBhcmVEYXRldGltZShkYXRlLCB0aGlzLm1pbkRhdGUsIGZhbHNlKSBhcyBudW1iZXIpID49IDApICYmXG4gICAgICAgICAgKCF0aGlzLm1heERhdGUgfHxcbiAgICAgICAgICAgICh0aGlzLl9hZGFwdGVyLmNvbXBhcmVEYXRldGltZShkYXRlLCB0aGlzLm1heERhdGUsIGZhbHNlKSBhcyBudW1iZXIpIDw9IDApICYmXG4gICAgICAgICAgKCF0aGlzLmRhdGVGaWx0ZXIgfHwgdGhpcy5kYXRlRmlsdGVyKGRhdGUsIE10eERhdGV0aW1lcGlja2VyRmlsdGVyVHlwZS5IT1VSKSk7XG5cbiAgICAgICAgdGhpcy5faG91cnMucHVzaCh7XG4gICAgICAgICAgdmFsdWU6IGksXG4gICAgICAgICAgZGlzcGxheVZhbHVlOiBpID09PSAwID8gJzAwJyA6IGhvdXJOYW1lc1tpXSxcbiAgICAgICAgICBlbmFibGVkLFxuICAgICAgICAgIHRvcDogQ0xPQ0tfUkFESVVTIC0gTWF0aC5jb3MocmFkaWFuKSAqIHJhZGl1cyAtIENMT0NLX1RJQ0tfUkFESVVTLFxuICAgICAgICAgIGxlZnQ6IENMT0NLX1JBRElVUyArIE1hdGguc2luKHJhZGlhbikgKiByYWRpdXMgLSBDTE9DS19USUNLX1JBRElVUyxcbiAgICAgICAgICBmb250U2l6ZTogaSA+IDAgJiYgaSA8IDEzID8gJycgOiAnODAlJyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtaW51dGVOYW1lcy5sZW5ndGg7IGkgKz0gNSkge1xuICAgICAgY29uc3QgcmFkaWFuID0gKGkgLyAzMCkgKiBNYXRoLlBJO1xuICAgICAgY29uc3QgZGF0ZSA9IHRoaXMuX2FkYXB0ZXIuY3JlYXRlRGF0ZXRpbWUoXG4gICAgICAgIHRoaXMuX2FkYXB0ZXIuZ2V0WWVhcih0aGlzLmFjdGl2ZURhdGUpLFxuICAgICAgICB0aGlzLl9hZGFwdGVyLmdldE1vbnRoKHRoaXMuYWN0aXZlRGF0ZSksXG4gICAgICAgIHRoaXMuX2FkYXB0ZXIuZ2V0RGF0ZSh0aGlzLmFjdGl2ZURhdGUpLFxuICAgICAgICB0aGlzLl9hZGFwdGVyLmdldEhvdXIodGhpcy5hY3RpdmVEYXRlKSxcbiAgICAgICAgaVxuICAgICAgKTtcbiAgICAgIGNvbnN0IGVuYWJsZWQgPVxuICAgICAgICAoIXRoaXMubWluRGF0ZSB8fCAodGhpcy5fYWRhcHRlci5jb21wYXJlRGF0ZXRpbWUoZGF0ZSwgdGhpcy5taW5EYXRlKSBhcyBudW1iZXIpID49IDApICYmXG4gICAgICAgICghdGhpcy5tYXhEYXRlIHx8ICh0aGlzLl9hZGFwdGVyLmNvbXBhcmVEYXRldGltZShkYXRlLCB0aGlzLm1heERhdGUpIGFzIG51bWJlcikgPD0gMCkgJiZcbiAgICAgICAgKCF0aGlzLmRhdGVGaWx0ZXIgfHwgdGhpcy5kYXRlRmlsdGVyKGRhdGUsIE10eERhdGV0aW1lcGlja2VyRmlsdGVyVHlwZS5NSU5VVEUpKTtcbiAgICAgIHRoaXMuX21pbnV0ZXMucHVzaCh7XG4gICAgICAgIHZhbHVlOiBpLFxuICAgICAgICBkaXNwbGF5VmFsdWU6IGkgPT09IDAgPyAnMDAnIDogbWludXRlTmFtZXNbaV0sXG4gICAgICAgIGVuYWJsZWQsXG4gICAgICAgIHRvcDogQ0xPQ0tfUkFESVVTIC0gTWF0aC5jb3MocmFkaWFuKSAqIENMT0NLX09VVEVSX1JBRElVUyAtIENMT0NLX1RJQ0tfUkFESVVTLFxuICAgICAgICBsZWZ0OiBDTE9DS19SQURJVVMgKyBNYXRoLnNpbihyYWRpYW4pICogQ0xPQ0tfT1VURVJfUkFESVVTIC0gQ0xPQ0tfVElDS19SQURJVVMsXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0IFRpbWVcbiAgICogQHBhcmFtIGV2ZW50XG4gICAqL1xuICBwcml2YXRlIHNldFRpbWUoZXZlbnQ6IFRvdWNoRXZlbnQgfCBNb3VzZUV2ZW50KSB7XG4gICAgY29uc3QgdHJpZ2dlciA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICBjb25zdCB0cmlnZ2VyUmVjdCA9IHRyaWdnZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3Qgd2lkdGggPSB0cmlnZ2VyLm9mZnNldFdpZHRoO1xuICAgIGNvbnN0IGhlaWdodCA9IHRyaWdnZXIub2Zmc2V0SGVpZ2h0O1xuICAgIGNvbnN0IHsgcGFnZVgsIHBhZ2VZIH0gPSBnZXRQb2ludGVyUG9zaXRpb25PblBhZ2UoZXZlbnQpO1xuICAgIGNvbnN0IHggPSB3aWR0aCAvIDIgLSAocGFnZVggLSB0cmlnZ2VyUmVjdC5sZWZ0IC0gd2luZG93LnBhZ2VYT2Zmc2V0KTtcbiAgICBjb25zdCB5ID0gaGVpZ2h0IC8gMiAtIChwYWdlWSAtIHRyaWdnZXJSZWN0LnRvcCAtIHdpbmRvdy5wYWdlWU9mZnNldCk7XG5cbiAgICBsZXQgcmFkaWFuID0gTWF0aC5hdGFuMigteCwgeSk7XG4gICAgY29uc3QgdW5pdCA9IE1hdGguUEkgLyAodGhpcy5faG91clZpZXcgPyA2IDogdGhpcy5pbnRlcnZhbCA/IDMwIC8gdGhpcy5pbnRlcnZhbCA6IDMwKTtcbiAgICBjb25zdCB6ID0gTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkpO1xuICAgIGNvbnN0IG91dGVyID1cbiAgICAgIHRoaXMuX2hvdXJWaWV3ICYmXG4gICAgICB6ID4gKHdpZHRoICogKENMT0NLX09VVEVSX1JBRElVUyAvIDEwMCkgKyB3aWR0aCAqIChDTE9DS19JTk5FUl9SQURJVVMgLyAxMDApKSAvIDI7XG5cbiAgICBpZiAocmFkaWFuIDwgMCkge1xuICAgICAgcmFkaWFuID0gTWF0aC5QSSAqIDIgKyByYWRpYW47XG4gICAgfVxuICAgIGxldCB2YWx1ZSA9IE1hdGgucm91bmQocmFkaWFuIC8gdW5pdCk7XG5cbiAgICBsZXQgZGF0ZTtcbiAgICBpZiAodGhpcy5faG91clZpZXcpIHtcbiAgICAgIGlmICh0aGlzLnR3ZWx2ZWhvdXIpIHtcbiAgICAgICAgaWYgKHRoaXMuQU1QTSA9PT0gJ0FNJykge1xuICAgICAgICAgIHZhbHVlID0gdmFsdWUgPT09IDAgPyAxMiA6IHZhbHVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIGlmIHdlIGNob3NlbiAxMiBpbiBQTSwgdGhlIHZhbHVlIHNob3VsZCBiZSAwIGZvciAwOjAwLFxuICAgICAgICAgIC8vIGVsc2Ugd2UgY2FuIHNhZmVseSBhZGQgMTIgdG8gdGhlIGZpbmFsIHZhbHVlXG4gICAgICAgICAgdmFsdWUgPSB2YWx1ZSA9PT0gMTIgPyAwIDogdmFsdWUgKyAxMjtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHZhbHVlID09PSAxMikge1xuICAgICAgICAgIHZhbHVlID0gMDtcbiAgICAgICAgfVxuICAgICAgICB2YWx1ZSA9IG91dGVyID8gKHZhbHVlID09PSAwID8gMTIgOiB2YWx1ZSkgOiB2YWx1ZSA9PT0gMCA/IDAgOiB2YWx1ZSArIDEyO1xuICAgICAgfVxuXG4gICAgICBkYXRlID0gdGhpcy5fYWRhcHRlci5jcmVhdGVEYXRldGltZShcbiAgICAgICAgdGhpcy5fYWRhcHRlci5nZXRZZWFyKHRoaXMuYWN0aXZlRGF0ZSksXG4gICAgICAgIHRoaXMuX2FkYXB0ZXIuZ2V0TW9udGgodGhpcy5hY3RpdmVEYXRlKSxcbiAgICAgICAgdGhpcy5fYWRhcHRlci5nZXREYXRlKHRoaXMuYWN0aXZlRGF0ZSksXG4gICAgICAgIHZhbHVlLFxuICAgICAgICB0aGlzLl9hZGFwdGVyLmdldE1pbnV0ZSh0aGlzLmFjdGl2ZURhdGUpXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy5pbnRlcnZhbCkge1xuICAgICAgICB2YWx1ZSAqPSB0aGlzLmludGVydmFsO1xuICAgICAgfVxuICAgICAgaWYgKHZhbHVlID09PSA2MCkge1xuICAgICAgICB2YWx1ZSA9IDA7XG4gICAgICB9XG4gICAgICBkYXRlID0gdGhpcy5fYWRhcHRlci5jcmVhdGVEYXRldGltZShcbiAgICAgICAgdGhpcy5fYWRhcHRlci5nZXRZZWFyKHRoaXMuYWN0aXZlRGF0ZSksXG4gICAgICAgIHRoaXMuX2FkYXB0ZXIuZ2V0TW9udGgodGhpcy5hY3RpdmVEYXRlKSxcbiAgICAgICAgdGhpcy5fYWRhcHRlci5nZXREYXRlKHRoaXMuYWN0aXZlRGF0ZSksXG4gICAgICAgIHRoaXMuX2FkYXB0ZXIuZ2V0SG91cih0aGlzLmFjdGl2ZURhdGUpLFxuICAgICAgICB2YWx1ZVxuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBpZiB0aGVyZSBpcyBhIGRhdGVGaWx0ZXIsIGNoZWNrIGlmIHRoZSBkYXRlIGlzIGFsbG93ZWQgaWYgaXQgaXMgbm90IHRoZW4gZG8gbm90IHNldC9lbWl0IG5ldyBkYXRlXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL25nLW1hdGVyby9leHRlbnNpb25zL2lzc3Vlcy8yNDRcbiAgICBpZiAoXG4gICAgICB0aGlzLmRhdGVGaWx0ZXIgJiZcbiAgICAgICF0aGlzLmRhdGVGaWx0ZXIoXG4gICAgICAgIGRhdGUsXG4gICAgICAgIHRoaXMuX2hvdXJWaWV3ID8gTXR4RGF0ZXRpbWVwaWNrZXJGaWx0ZXJUeXBlLkhPVVIgOiBNdHhEYXRldGltZXBpY2tlckZpbHRlclR5cGUuTUlOVVRFXG4gICAgICApXG4gICAgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5fdGltZUNoYW5nZWQgPSB0cnVlO1xuICAgIHRoaXMuYWN0aXZlRGF0ZSA9IGRhdGU7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgdGhpcy5hY3RpdmVEYXRlQ2hhbmdlLmVtaXQodGhpcy5hY3RpdmVEYXRlKTtcbiAgfVxufVxuXG4vKiogUmV0dXJucyB3aGV0aGVyIGFuIGV2ZW50IGlzIGEgdG91Y2ggZXZlbnQuICovXG5mdW5jdGlvbiBpc1RvdWNoRXZlbnQoZXZlbnQ6IE1vdXNlRXZlbnQgfCBUb3VjaEV2ZW50KTogZXZlbnQgaXMgVG91Y2hFdmVudCB7XG4gIC8vIFRoaXMgZnVuY3Rpb24gaXMgY2FsbGVkIGZvciBldmVyeSBwaXhlbCB0aGF0IHRoZSB1c2VyIGhhcyBkcmFnZ2VkIHNvIHdlIG5lZWQgaXQgdG8gYmVcbiAgLy8gYXMgZmFzdCBhcyBwb3NzaWJsZS4gU2luY2Ugd2Ugb25seSBiaW5kIG1vdXNlIGV2ZW50cyBhbmQgdG91Y2ggZXZlbnRzLCB3ZSBjYW4gYXNzdW1lXG4gIC8vIHRoYXQgaWYgdGhlIGV2ZW50J3MgbmFtZSBzdGFydHMgd2l0aCBgdGAsIGl0J3MgYSB0b3VjaCBldmVudC5cbiAgcmV0dXJuIGV2ZW50LnR5cGVbMF0gPT09ICd0Jztcbn1cblxuLyoqIEdldHMgdGhlIGNvb3JkaW5hdGVzIG9mIGEgdG91Y2ggb3IgbW91c2UgZXZlbnQgcmVsYXRpdmUgdG8gdGhlIGRvY3VtZW50LiAqL1xuZnVuY3Rpb24gZ2V0UG9pbnRlclBvc2l0aW9uT25QYWdlKGV2ZW50OiBNb3VzZUV2ZW50IHwgVG91Y2hFdmVudCkge1xuICBsZXQgcG9pbnQ6IHsgcGFnZVg6IG51bWJlcjsgcGFnZVk6IG51bWJlciB9O1xuXG4gIGlmIChpc1RvdWNoRXZlbnQoZXZlbnQpKSB7XG4gICAgLy8gYHRvdWNoZXNgIHdpbGwgYmUgZW1wdHkgZm9yIHN0YXJ0L2VuZCBldmVudHMgc28gd2UgaGF2ZSB0byBmYWxsIGJhY2sgdG8gYGNoYW5nZWRUb3VjaGVzYC5cbiAgICBwb2ludCA9IGV2ZW50LnRvdWNoZXNbMF0gfHwgZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF07XG4gIH0gZWxzZSB7XG4gICAgcG9pbnQgPSBldmVudDtcbiAgfVxuXG4gIHJldHVybiBwb2ludDtcbn1cbiIsIjxkaXYgY2xhc3M9XCJtdHgtY2xvY2std3JhcHBlclwiPlxuICA8ZGl2IGNsYXNzPVwibXR4LWNsb2NrLWNlbnRlclwiPjwvZGl2PlxuICA8ZGl2IGNsYXNzPVwibXR4LWNsb2NrLWhhbmRcIiBbc3R5bGVdPVwiX2hhbmRcIj48L2Rpdj5cbiAgPGRpdiBjbGFzcz1cIm10eC1jbG9jay1ob3Vyc1wiIFtjbGFzcy5hY3RpdmVdPVwiX2hvdXJWaWV3XCI+XG4gICAgQGZvciAoaXRlbSBvZiBfaG91cnM7IHRyYWNrIGl0ZW0udmFsdWUpIHtcbiAgICAgIDxkaXZcbiAgICAgICAgY2xhc3M9XCJtdHgtY2xvY2stY2VsbFwiXG4gICAgICAgIFtjbGFzcy5tdHgtY2xvY2stY2VsbC1kaXNhYmxlZF09XCIhaXRlbS5lbmFibGVkXCJcbiAgICAgICAgW2NsYXNzLm10eC1jbG9jay1jZWxsLXNlbGVjdGVkXT1cIl9zZWxlY3RlZEhvdXIgPT09IGl0ZW0udmFsdWVcIlxuICAgICAgICBbc3R5bGUuZm9udFNpemVdPVwiaXRlbS5mb250U2l6ZVwiXG4gICAgICAgIFtzdHlsZS5sZWZ0XT1cIml0ZW0ubGVmdCsnJSdcIlxuICAgICAgICBbc3R5bGUudG9wXT1cIml0ZW0udG9wKyclJ1wiPnt7IGl0ZW0uZGlzcGxheVZhbHVlIH19PC9kaXY+XG4gICAgfVxuICA8L2Rpdj5cbiAgPGRpdiBjbGFzcz1cIm10eC1jbG9jay1taW51dGVzXCIgW2NsYXNzLmFjdGl2ZV09XCIhX2hvdXJWaWV3XCI+XG4gICAgQGZvciAoaXRlbSBvZiBfbWludXRlczsgdHJhY2sgaXRlbS52YWx1ZSkge1xuICAgICAgPGRpdlxuICAgICAgICBjbGFzcz1cIm10eC1jbG9jay1jZWxsXCJcbiAgICAgICAgW2NsYXNzLm10eC1jbG9jay1jZWxsLWRpc2FibGVkXT1cIiFpdGVtLmVuYWJsZWRcIlxuICAgICAgICBbY2xhc3MubXR4LWNsb2NrLWNlbGwtc2VsZWN0ZWRdPVwiX3NlbGVjdGVkTWludXRlID09PSBpdGVtLnZhbHVlXCJcbiAgICAgICAgW3N0eWxlLmxlZnRdPVwiaXRlbS5sZWZ0KyclJ1wiXG4gICAgICAgIFtzdHlsZS50b3BdPVwiaXRlbS50b3ArJyUnXCI+e3sgaXRlbS5kaXNwbGF5VmFsdWUgfX08L2Rpdj5cbiAgICB9XG4gIDwvZGl2PlxuPC9kaXY+XG4iXX0=