import { A11yModule } from '@angular/cdk/a11y';
import * as i1$1 from '@angular/cdk/overlay';
import { Overlay, OverlayConfig, OverlayModule } from '@angular/cdk/overlay';
import { ComponentPortal, CdkPortalOutlet, PortalModule } from '@angular/cdk/portal';
import { DOCUMENT, CommonModule } from '@angular/common';
import * as i0 from '@angular/core';
import { EventEmitter, booleanAttribute, Component, ViewEncapsulation, ChangeDetectionStrategy, Inject, Input, Output, Optional, Injectable, Directive, ElementRef, ViewChild, inject, Injector, afterNextRender, InjectionToken, forwardRef, Attribute, ContentChild, NgModule } from '@angular/core';
import { MatButton, MatIconButton, MatButtonModule } from '@angular/material/button';
import { UP_ARROW, DOWN_ARROW, ENTER, PAGE_DOWN, PAGE_UP, END, HOME, RIGHT_ARROW, LEFT_ARROW, ESCAPE, hasModifierKey } from '@angular/cdk/keycodes';
import * as i1 from '@ng-matero/extensions/core';
import { MTX_DATETIME_FORMATS } from '@ng-matero/extensions/core';
import { normalizePassiveListenerOptions, _getFocusedElementPierceShadowDom } from '@angular/cdk/platform';
import { trigger, transition, animate, keyframes, style, state } from '@angular/animations';
import { coerceNumberProperty, coerceStringArray } from '@angular/cdk/coercion';
import { Subject, Subscription, merge, of } from 'rxjs';
import { take, filter } from 'rxjs/operators';
import * as i3 from '@angular/cdk/bidi';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, Validators } from '@angular/forms';
import { MAT_INPUT_VALUE_ACCESSOR } from '@angular/material/input';
import * as i2 from '@angular/material/form-field';

var MtxDatetimepickerFilterType;
(function (MtxDatetimepickerFilterType) {
    MtxDatetimepickerFilterType[MtxDatetimepickerFilterType["DATE"] = 0] = "DATE";
    MtxDatetimepickerFilterType[MtxDatetimepickerFilterType["HOUR"] = 1] = "HOUR";
    MtxDatetimepickerFilterType[MtxDatetimepickerFilterType["MINUTE"] = 2] = "MINUTE";
})(MtxDatetimepickerFilterType || (MtxDatetimepickerFilterType = {}));

const activeEventOptions = normalizePassiveListenerOptions({ passive: false });
const CLOCK_RADIUS = 50;
const CLOCK_INNER_RADIUS = 27.5;
const CLOCK_OUTER_RADIUS = 41.25;
const CLOCK_TICK_RADIUS = 7.0833;
/**
 * A clock that is used as part of the datetimepicker.
 * @docs-private
 */
class MtxClock {
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

/**
 * Animations used by the Material datepicker.
 * @docs-private
 */
const mtxDatetimepickerAnimations = {
    /** Transforms the height of the datepicker's calendar. */
    transformPanel: trigger('transformPanel', [
        transition('void => enter-dropdown', animate('120ms cubic-bezier(0, 0, 0.2, 1)', keyframes([
            style({ opacity: 0, transform: 'scale(1, 0.8)' }),
            style({ opacity: 1, transform: 'scale(1, 1)' }),
        ]))),
        transition('void => enter-dialog', animate('150ms cubic-bezier(0, 0, 0.2, 1)', keyframes([
            style({ opacity: 0, transform: 'scale(0.7)' }),
            style({ transform: 'none', opacity: 1 }),
        ]))),
        transition('* => void', animate('100ms linear', style({ opacity: 0 }))),
    ]),
    /** Fades in the content of the calendar. */
    fadeInCalendar: trigger('fadeInCalendar', [
        state('void', style({ opacity: 0 })),
        state('enter', style({ opacity: 1 })),
        // TODO(crisbeto): this animation should be removed since it isn't quite on spec, but we
        // need to keep it until #12440 gets in, otherwise the exit animation will look glitchy.
        transition('void => *', animate('120ms 100ms cubic-bezier(0.55, 0, 0.55, 0.2)')),
    ]),
    slideCalendar: trigger('slideCalendar', [
        transition('* => left', [
            animate(180, keyframes([
                style({ transform: 'translateX(100%)', offset: 0.5 }),
                style({ transform: 'translateX(-100%)', offset: 0.51 }),
                style({ transform: 'translateX(0)', offset: 1 }),
            ])),
        ]),
        transition('* => right', [
            animate(180, keyframes([
                style({ transform: 'translateX(-100%)', offset: 0.5 }),
                style({ transform: 'translateX(100%)', offset: 0.51 }),
                style({ transform: 'translateX(0)', offset: 1 }),
            ])),
        ]),
    ]),
};

/** @docs-private */
function createMissingDateImplError(provider) {
    return Error(`MtxDatetimepicker: No provider found for ${provider}. You must add one of the following ` +
        `to your app config: provideNativeDatetimeAdapter, provideDateFnsDatetimeAdapter,` +
        `provideLuxonDatetimeAdapter, provideMomentDatetimeAdapter, or provide a ` +
        `custom implementation.`);
}

/**
 * An internal class that represents the data corresponding to a single calendar cell.
 * @docs-private
 */
class MtxCalendarCell {
    constructor(value, displayValue, ariaLabel, enabled) {
        this.value = value;
        this.displayValue = displayValue;
        this.ariaLabel = ariaLabel;
        this.enabled = enabled;
    }
}
/**
 * An internal component used to display calendar data in a table.
 * @docs-private
 */
class MtxCalendarBody {
    constructor() {
        /** The number of columns in the table. */
        this.numCols = 7;
        /** Whether to allow selection of disabled cells. */
        this.allowDisabledSelection = false;
        /** The cell number of the active cell in the table. */
        this.activeCell = 0;
        /** Emits when a new value is selected. */
        this.selectedValueChange = new EventEmitter();
    }
    /** The number of blank cells to put at the beginning for the first row. */
    get _firstRowOffset() {
        return this.rows && this.rows.length && this.rows[0].length
            ? this.numCols - this.rows[0].length
            : 0;
    }
    _cellClicked(cell) {
        if (!this.allowDisabledSelection && !cell.enabled) {
            return;
        }
        this.selectedValueChange.emit(cell.value);
    }
    _isActiveCell(rowIndex, colIndex) {
        let cellNumber = rowIndex * this.numCols + colIndex;
        // Account for the fact that the first row may not have as many cells.
        if (rowIndex) {
            cellNumber -= this._firstRowOffset;
        }
        return cellNumber === this.activeCell;
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxCalendarBody, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    /** @nocollapse */ static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.0.1", type: MtxCalendarBody, isStandalone: true, selector: "[mtx-calendar-body]", inputs: { label: "label", rows: "rows", todayValue: "todayValue", selectedValue: "selectedValue", labelMinRequiredCells: "labelMinRequiredCells", numCols: "numCols", allowDisabledSelection: "allowDisabledSelection", activeCell: "activeCell" }, outputs: { selectedValueChange: "selectedValueChange" }, host: { classAttribute: "mtx-calendar-body" }, exportAs: ["mtxCalendarBody"], ngImport: i0, template: "<!--\n  If there's not enough space in the first row, create a separate label row. We mark this row as\n  aria-hidden because we don't want it to be read out as one of the weeks in the month.\n-->\n@if (_firstRowOffset < labelMinRequiredCells) {\n  <tr aria-hidden=\"true\">\n    <td class=\"mtx-calendar-body-label\" [attr.colspan]=\"numCols\">{{ label }}</td>\n  </tr>\n}\n\n<!-- Create the first row separately so we can include a special spacer cell. -->\n@for (row of rows; track row; let rowIndex = $index) {\n  <tr role=\"row\">\n    <!--\n      We mark this cell as aria-hidden so it doesn't get read out as one of the days in the week.\n    -->\n    @if (rowIndex === 0 && _firstRowOffset) {\n      <td\n        class=\"mtx-calendar-body-label\" [attr.colspan]=\"_firstRowOffset\" aria-hidden=\"true\">\n        {{ _firstRowOffset >= labelMinRequiredCells ? label : '' }}\n      </td>\n    }\n    @for (item of row; track item; let colIndex = $index) {\n      <td\n        role=\"gridcell\"\n        class=\"mtx-calendar-body-cell\"\n        [class.mtx-calendar-body-active]=\"_isActiveCell(rowIndex, colIndex)\"\n        [class.mtx-calendar-body-disabled]=\"!item.enabled\"\n        [tabindex]=\"_isActiveCell(rowIndex, colIndex) ? 0 : -1\"\n        [attr.data-mat-row]=\"rowIndex\"\n        [attr.data-mat-col]=\"colIndex\"\n        [attr.aria-label]=\"item.ariaLabel\"\n        [attr.aria-disabled]=\"!item.enabled || null\"\n        (click)=\"_cellClicked(item)\">\n        <div class=\"mtx-calendar-body-cell-content\"\n          [class.mtx-calendar-body-selected]=\"selectedValue === item.value\"\n          [class.mtx-calendar-body-today]=\"todayValue === item.value\"\n          [attr.aria-selected]=\"selectedValue === item.value\">\n          {{ item.displayValue }}\n        </div>\n      </td>\n    }\n  </tr>\n}\n", styles: [".mtx-calendar-body{min-width:224px}.mtx-calendar-body-today:not(.mtx-calendar-body-selected){border-color:var(--mtx-datetimepicker-calendar-date-today-outline-color)}.mtx-calendar-body-label{height:0;line-height:0;text-align:left;padding:7.1428571429% 4.7142857143%;font-size:var(--mtx-datetimepicker-calendar-body-label-text-size);font-weight:var(--mtx-datetimepicker-calendar-body-label-text-weight);color:var(--mtx-datetimepicker-calendar-body-label-text-color)}[dir=rtl] .mtx-calendar-body-label{text-align:right}.mtx-calendar-body-cell{position:relative;width:14.2857142857%;height:0;line-height:0;padding:7.1428571429% 0;text-align:center;outline:none;cursor:pointer}.mtx-calendar-body-disabled{cursor:default;pointer-events:none}.mtx-calendar-body-disabled>.mtx-calendar-body-cell-content:not(.mtx-calendar-body-selected){color:var(--mtx-datetimepicker-calendar-date-disabled-state-text-color)}.mtx-calendar-body-disabled>.mtx-calendar-body-today:not(.mtx-calendar-body-selected){border-color:var(--mtx-datetimepicker-calendar-date-disabled-state-text-color)}.mtx-calendar-body-cell-content{position:absolute;top:5%;left:5%;display:flex;align-items:center;justify-content:center;box-sizing:border-box;width:90%;height:90%;border:1px solid transparent;border-radius:999px;color:var(--mtx-datetimepicker-calendar-date-text-color);border-color:var(--mtx-datetimepicker-calendar-date-outline-color)}.mtx-calendar-body-active>.mtx-calendar-body-cell-content:not(.mtx-calendar-body-selected){background-color:var(--mtx-datetimepicker-calendar-date-focus-state-background-color)}@media (hover: hover){.mtx-calendar-body-cell:not(.mtx-calendar-body-disabled):hover>.mtx-calendar-body-cell-content:not(.mtx-calendar-body-selected){background-color:var(--mtx-datetimepicker-calendar-date-hover-state-background-color)}}.mtx-calendar-body-selected{background-color:var(--mtx-datetimepicker-calendar-date-selected-state-background-color);color:var(--mtx-datetimepicker-calendar-date-selected-state-text-color)}.mtx-calendar-body-disabled>.mtx-calendar-body-selected{background-color:var(--mtx-datetimepicker-calendar-date-selected-disabled-state-background-color)}.mtx-calendar-body-selected.mtx-calendar-body-today{box-shadow:inset 0 0 0 1px var(--mtx-datetimepicker-calendar-date-today-selected-state-outline-color)}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxCalendarBody, decorators: [{
            type: Component,
            args: [{ selector: '[mtx-calendar-body]', host: {
                        class: 'mtx-calendar-body',
                    }, exportAs: 'mtxCalendarBody', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, standalone: true, template: "<!--\n  If there's not enough space in the first row, create a separate label row. We mark this row as\n  aria-hidden because we don't want it to be read out as one of the weeks in the month.\n-->\n@if (_firstRowOffset < labelMinRequiredCells) {\n  <tr aria-hidden=\"true\">\n    <td class=\"mtx-calendar-body-label\" [attr.colspan]=\"numCols\">{{ label }}</td>\n  </tr>\n}\n\n<!-- Create the first row separately so we can include a special spacer cell. -->\n@for (row of rows; track row; let rowIndex = $index) {\n  <tr role=\"row\">\n    <!--\n      We mark this cell as aria-hidden so it doesn't get read out as one of the days in the week.\n    -->\n    @if (rowIndex === 0 && _firstRowOffset) {\n      <td\n        class=\"mtx-calendar-body-label\" [attr.colspan]=\"_firstRowOffset\" aria-hidden=\"true\">\n        {{ _firstRowOffset >= labelMinRequiredCells ? label : '' }}\n      </td>\n    }\n    @for (item of row; track item; let colIndex = $index) {\n      <td\n        role=\"gridcell\"\n        class=\"mtx-calendar-body-cell\"\n        [class.mtx-calendar-body-active]=\"_isActiveCell(rowIndex, colIndex)\"\n        [class.mtx-calendar-body-disabled]=\"!item.enabled\"\n        [tabindex]=\"_isActiveCell(rowIndex, colIndex) ? 0 : -1\"\n        [attr.data-mat-row]=\"rowIndex\"\n        [attr.data-mat-col]=\"colIndex\"\n        [attr.aria-label]=\"item.ariaLabel\"\n        [attr.aria-disabled]=\"!item.enabled || null\"\n        (click)=\"_cellClicked(item)\">\n        <div class=\"mtx-calendar-body-cell-content\"\n          [class.mtx-calendar-body-selected]=\"selectedValue === item.value\"\n          [class.mtx-calendar-body-today]=\"todayValue === item.value\"\n          [attr.aria-selected]=\"selectedValue === item.value\">\n          {{ item.displayValue }}\n        </div>\n      </td>\n    }\n  </tr>\n}\n", styles: [".mtx-calendar-body{min-width:224px}.mtx-calendar-body-today:not(.mtx-calendar-body-selected){border-color:var(--mtx-datetimepicker-calendar-date-today-outline-color)}.mtx-calendar-body-label{height:0;line-height:0;text-align:left;padding:7.1428571429% 4.7142857143%;font-size:var(--mtx-datetimepicker-calendar-body-label-text-size);font-weight:var(--mtx-datetimepicker-calendar-body-label-text-weight);color:var(--mtx-datetimepicker-calendar-body-label-text-color)}[dir=rtl] .mtx-calendar-body-label{text-align:right}.mtx-calendar-body-cell{position:relative;width:14.2857142857%;height:0;line-height:0;padding:7.1428571429% 0;text-align:center;outline:none;cursor:pointer}.mtx-calendar-body-disabled{cursor:default;pointer-events:none}.mtx-calendar-body-disabled>.mtx-calendar-body-cell-content:not(.mtx-calendar-body-selected){color:var(--mtx-datetimepicker-calendar-date-disabled-state-text-color)}.mtx-calendar-body-disabled>.mtx-calendar-body-today:not(.mtx-calendar-body-selected){border-color:var(--mtx-datetimepicker-calendar-date-disabled-state-text-color)}.mtx-calendar-body-cell-content{position:absolute;top:5%;left:5%;display:flex;align-items:center;justify-content:center;box-sizing:border-box;width:90%;height:90%;border:1px solid transparent;border-radius:999px;color:var(--mtx-datetimepicker-calendar-date-text-color);border-color:var(--mtx-datetimepicker-calendar-date-outline-color)}.mtx-calendar-body-active>.mtx-calendar-body-cell-content:not(.mtx-calendar-body-selected){background-color:var(--mtx-datetimepicker-calendar-date-focus-state-background-color)}@media (hover: hover){.mtx-calendar-body-cell:not(.mtx-calendar-body-disabled):hover>.mtx-calendar-body-cell-content:not(.mtx-calendar-body-selected){background-color:var(--mtx-datetimepicker-calendar-date-hover-state-background-color)}}.mtx-calendar-body-selected{background-color:var(--mtx-datetimepicker-calendar-date-selected-state-background-color);color:var(--mtx-datetimepicker-calendar-date-selected-state-text-color)}.mtx-calendar-body-disabled>.mtx-calendar-body-selected{background-color:var(--mtx-datetimepicker-calendar-date-selected-disabled-state-background-color)}.mtx-calendar-body-selected.mtx-calendar-body-today{box-shadow:inset 0 0 0 1px var(--mtx-datetimepicker-calendar-date-today-selected-state-outline-color)}\n"] }]
        }], propDecorators: { label: [{
                type: Input
            }], rows: [{
                type: Input
            }], todayValue: [{
                type: Input
            }], selectedValue: [{
                type: Input
            }], labelMinRequiredCells: [{
                type: Input
            }], numCols: [{
                type: Input
            }], allowDisabledSelection: [{
                type: Input
            }], activeCell: [{
                type: Input
            }], selectedValueChange: [{
                type: Output
            }] } });

const DAYS_PER_WEEK = 7;
/**
 * An internal component used to display a single month in the datetimepicker.
 * @docs-private
 */
class MtxMonthView {
    constructor(_adapter, _dateFormats) {
        this._adapter = _adapter;
        this._dateFormats = _dateFormats;
        this.type = 'date';
        /** Emits when a new date is selected. */
        this.selectedChange = new EventEmitter();
        /** Emits when any date is selected. */
        this._userSelection = new EventEmitter();
        if (!this._adapter) {
            throw createMissingDateImplError('DatetimeAdapter');
        }
        if (!this._dateFormats) {
            throw createMissingDateImplError('MTX_DATETIME_FORMATS');
        }
        const firstDayOfWeek = this._adapter.getFirstDayOfWeek();
        const narrowWeekdays = this._adapter.getDayOfWeekNames('narrow');
        const longWeekdays = this._adapter.getDayOfWeekNames('long');
        // Rotate the labels for days of the week based on the configured first day of the week.
        const weekdays = longWeekdays.map((long, i) => {
            return { long, narrow: narrowWeekdays[i] };
        });
        this._weekdays = weekdays.slice(firstDayOfWeek).concat(weekdays.slice(0, firstDayOfWeek));
        this._activeDate = this._adapter.today();
    }
    /**
     * The date to display in this month view (everything other than the month and year is ignored).
     */
    get activeDate() {
        return this._activeDate;
    }
    set activeDate(value) {
        const oldActiveDate = this._activeDate;
        this._activeDate = value || this._adapter.today();
        if (oldActiveDate &&
            this._activeDate &&
            !this._adapter.sameMonthAndYear(oldActiveDate, this._activeDate)) {
            this._init();
            if (this._adapter.isInNextMonth(oldActiveDate, this._activeDate)) {
                this.calendarState('right');
            }
            else {
                this.calendarState('left');
            }
        }
    }
    /** The currently selected date. */
    get selected() {
        return this._selected;
    }
    set selected(value) {
        this._selected = value;
        this._selectedDate = this._getDateInCurrentMonth(this.selected);
    }
    ngAfterContentInit() {
        this._init();
    }
    /** Handles when a new date is selected. */
    _dateSelected(date) {
        this.selectedChange.emit(this._adapter.createDatetime(this._adapter.getYear(this.activeDate), this._adapter.getMonth(this.activeDate), date, this._adapter.getHour(this.activeDate), this._adapter.getMinute(this.activeDate)));
        if (this.type === 'date') {
            this._userSelection.emit();
        }
    }
    _calendarStateDone() {
        this._calendarState = '';
    }
    /** Initializes this month view. */
    _init() {
        this._selectedDate = this._getDateInCurrentMonth(this.selected);
        this._todayDate = this._getDateInCurrentMonth(this._adapter.today());
        const firstOfMonth = this._adapter.createDatetime(this._adapter.getYear(this.activeDate), this._adapter.getMonth(this.activeDate), 1, this._adapter.getHour(this.activeDate), this._adapter.getMinute(this.activeDate));
        this._firstWeekOffset =
            (DAYS_PER_WEEK +
                this._adapter.getDayOfWeek(firstOfMonth) -
                this._adapter.getFirstDayOfWeek()) %
                DAYS_PER_WEEK;
        this._createWeekCells();
    }
    /** Creates MdCalendarCells for the dates in this month. */
    _createWeekCells() {
        const daysInMonth = this._adapter.getNumDaysInMonth(this.activeDate);
        const dateNames = this._adapter.getDateNames();
        this._weeks = [[]];
        for (let i = 0, cell = this._firstWeekOffset; i < daysInMonth; i++, cell++) {
            if (cell === DAYS_PER_WEEK) {
                this._weeks.push([]);
                cell = 0;
            }
            const date = this._adapter.createDatetime(this._adapter.getYear(this.activeDate), this._adapter.getMonth(this.activeDate), i + 1, this._adapter.getHour(this.activeDate), this._adapter.getMinute(this.activeDate));
            const enabled = !this.dateFilter || this.dateFilter(date);
            const ariaLabel = this._adapter.format(date, this._dateFormats.display.dateA11yLabel);
            this._weeks[this._weeks.length - 1].push(new MtxCalendarCell(i + 1, dateNames[i], ariaLabel, enabled));
        }
    }
    /**
     * Gets the date in this month that the given Date falls on.
     * Returns null if the given Date is in another month.
     */
    _getDateInCurrentMonth(date) {
        return this._adapter.sameMonthAndYear(date, this.activeDate)
            ? this._adapter.getDate(date)
            : null;
    }
    calendarState(direction) {
        this._calendarState = direction;
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxMonthView, deps: [{ token: i1.DatetimeAdapter, optional: true }, { token: MTX_DATETIME_FORMATS, optional: true }], target: i0.ɵɵFactoryTarget.Component }); }
    /** @nocollapse */ static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.0.1", type: MtxMonthView, isStandalone: true, selector: "mtx-month-view", inputs: { type: "type", dateFilter: "dateFilter", activeDate: "activeDate", selected: "selected" }, outputs: { selectedChange: "selectedChange", _userSelection: "_userSelection" }, exportAs: ["mtxMonthView"], ngImport: i0, template: "<table class=\"mtx-calendar-table\" role=\"grid\">\n  <thead class=\"mtx-calendar-table-header\">\n    <tr>\n      @for (day of _weekdays; track day) {\n        <th [attr.aria-label]=\"day.long\">{{day.narrow}}</th>\n      }\n    </tr>\n  </thead>\n  <tbody mtx-calendar-body\n    (@slideCalendar.done)=\"_calendarStateDone()\"\n    [@slideCalendar]=\"_calendarState\"\n    [rows]=\"_weeks\"\n    [todayValue]=\"_todayDate!\"\n    [activeCell]=\"_adapter.getDate(activeDate) - 1\"\n    [selectedValue]=\"_selectedDate!\"\n    (selectedValueChange)=\"_dateSelected($event)\"></tbody>\n</table>\n", dependencies: [{ kind: "component", type: MtxCalendarBody, selector: "[mtx-calendar-body]", inputs: ["label", "rows", "todayValue", "selectedValue", "labelMinRequiredCells", "numCols", "allowDisabledSelection", "activeCell"], outputs: ["selectedValueChange"], exportAs: ["mtxCalendarBody"] }], animations: [mtxDatetimepickerAnimations.slideCalendar], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxMonthView, decorators: [{
            type: Component,
            args: [{ selector: 'mtx-month-view', exportAs: 'mtxMonthView', animations: [mtxDatetimepickerAnimations.slideCalendar], encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, standalone: true, imports: [MtxCalendarBody], template: "<table class=\"mtx-calendar-table\" role=\"grid\">\n  <thead class=\"mtx-calendar-table-header\">\n    <tr>\n      @for (day of _weekdays; track day) {\n        <th [attr.aria-label]=\"day.long\">{{day.narrow}}</th>\n      }\n    </tr>\n  </thead>\n  <tbody mtx-calendar-body\n    (@slideCalendar.done)=\"_calendarStateDone()\"\n    [@slideCalendar]=\"_calendarState\"\n    [rows]=\"_weeks\"\n    [todayValue]=\"_todayDate!\"\n    [activeCell]=\"_adapter.getDate(activeDate) - 1\"\n    [selectedValue]=\"_selectedDate!\"\n    (selectedValueChange)=\"_dateSelected($event)\"></tbody>\n</table>\n" }]
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

const yearsPerPage = 24;
const yearsPerRow = 4;
/**
 * An internal component used to display multiple years in the datetimepicker.
 * @docs-private
 */
class MtxMultiYearView {
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
    /** The date to display in this multi year view */
    get activeDate() {
        return this._activeDate;
    }
    set activeDate(value) {
        const oldActiveDate = this._activeDate;
        this._activeDate = value || this._adapter.today();
        if (oldActiveDate &&
            this._activeDate &&
            !isSameMultiYearView(this._adapter, oldActiveDate, this._activeDate, this.minDate, this.maxDate)) {
            this._init();
        }
    }
    /** The currently selected date. */
    get selected() {
        return this._selected;
    }
    set selected(value) {
        this._selected = value;
        this._selectedYear = this._selected && this._adapter.getYear(this._selected);
    }
    /** The minimum selectable date. */
    get minDate() {
        return this._minDate;
    }
    set minDate(value) {
        this._minDate = this._getValidDateOrNull(this._adapter.deserialize(value));
    }
    /** The maximum selectable date. */
    get maxDate() {
        return this._maxDate;
    }
    set maxDate(value) {
        this._maxDate = this._getValidDateOrNull(this._adapter.deserialize(value));
    }
    ngAfterContentInit() {
        this._init();
    }
    /** Handles when a new year is selected. */
    _yearSelected(year) {
        const month = this._adapter.getMonth(this.activeDate);
        const normalizedDate = this._adapter.createDatetime(year, month, 1, 0, 0);
        this.selectedChange.emit(this._adapter.createDatetime(year, month, Math.min(this._adapter.getDate(this.activeDate), this._adapter.getNumDaysInMonth(normalizedDate)), this._adapter.getHour(this.activeDate), this._adapter.getMinute(this.activeDate)));
        if (this.type === 'year') {
            this._userSelection.emit();
        }
    }
    _getActiveCell() {
        return getActiveOffset(this._adapter, this.activeDate, this.minDate, this.maxDate);
    }
    _calendarStateDone() {
        this._calendarState = '';
    }
    /** Initializes this year view. */
    _init() {
        this._todayYear = this._adapter.getYear(this._adapter.today());
        this._yearLabel = this._adapter.getYearName(this.activeDate);
        const activeYear = this._adapter.getYear(this.activeDate);
        const minYearOfPage = activeYear - getActiveOffset(this._adapter, this.activeDate, this.minDate, this.maxDate);
        this._years = [];
        for (let i = 0, row = []; i < yearsPerPage; i++) {
            row.push(minYearOfPage + i);
            if (row.length === yearsPerRow) {
                this._years.push(row.map(year => this._createCellForYear(year)));
                row = [];
            }
        }
    }
    /** Creates an MtxCalendarCell for the given year. */
    _createCellForYear(year) {
        const yearName = this._adapter.getYearName(this._adapter.createDate(year, 0, 1));
        return new MtxCalendarCell(year, yearName, yearName, this._shouldEnableYear(year));
    }
    /** Whether the given year is enabled. */
    _shouldEnableYear(year) {
        // disable if the year is greater than maxDate lower than minDate
        if (year === undefined ||
            year === null ||
            (this.maxDate && year > this._adapter.getYear(this.maxDate)) ||
            (this.minDate && year < this._adapter.getYear(this.minDate))) {
            return false;
        }
        // enable if it reaches here and there's no filter defined
        if (!this.dateFilter) {
            return true;
        }
        const firstOfYear = this._adapter.createDate(year, 0, 1);
        // If any date in the year is enabled count the year as enabled.
        for (let date = firstOfYear; this._adapter.getYear(date) === year; date = this._adapter.addCalendarDays(date, 1)) {
            if (this.dateFilter(date)) {
                return true;
            }
        }
        return false;
    }
    /**
     * Gets the year in this years range that the given Date falls on.
     * Returns null if the given Date is not in this range.
     */
    _getYearInCurrentRange(date) {
        const year = this._adapter.getYear(date);
        return this._isInRange(year) ? year : null;
    }
    /**
     * Validate if the current year is in the current range
     * Returns true if is in range else returns false
     */
    _isInRange(year) {
        return true;
    }
    /**
     * @param obj The object to check.
     * @returns The given object if it is both a date instance and valid, otherwise null.
     */
    _getValidDateOrNull(obj) {
        return this._adapter.isDateInstance(obj) && this._adapter.isValid(obj) ? obj : null;
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxMultiYearView, deps: [{ token: i1.DatetimeAdapter, optional: true }, { token: MTX_DATETIME_FORMATS, optional: true }], target: i0.ɵɵFactoryTarget.Component }); }
    /** @nocollapse */ static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.0.1", type: MtxMultiYearView, isStandalone: true, selector: "mtx-multi-year-view", inputs: { type: "type", dateFilter: "dateFilter", activeDate: "activeDate", selected: "selected", minDate: "minDate", maxDate: "maxDate" }, outputs: { selectedChange: "selectedChange", _userSelection: "_userSelection" }, exportAs: ["mtxMultiYearView"], ngImport: i0, template: "<table class=\"mtx-calendar-table\" role=\"grid\">\n  <thead class=\"mtx-calendar-table-header\"></thead>\n  <tbody mtx-calendar-body\n         (@slideCalendar.done)=\"_calendarStateDone()\"\n         [@slideCalendar]=\"_calendarState\"\n         [todayValue]=\"_todayYear\"\n         [rows]=\"_years\"\n         [numCols]=\"4\"\n         [activeCell]=\"_getActiveCell()\"\n         [allowDisabledSelection]=\"true\"\n         [selectedValue]=\"_selectedYear!\"\n         (selectedValueChange)=\"_yearSelected($event)\"></tbody>\n</table>\n", dependencies: [{ kind: "component", type: MtxCalendarBody, selector: "[mtx-calendar-body]", inputs: ["label", "rows", "todayValue", "selectedValue", "labelMinRequiredCells", "numCols", "allowDisabledSelection", "activeCell"], outputs: ["selectedValueChange"], exportAs: ["mtxCalendarBody"] }], animations: [mtxDatetimepickerAnimations.slideCalendar], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxMultiYearView, decorators: [{
            type: Component,
            args: [{ selector: 'mtx-multi-year-view', exportAs: 'mtxMultiYearView', animations: [mtxDatetimepickerAnimations.slideCalendar], encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, standalone: true, imports: [MtxCalendarBody], template: "<table class=\"mtx-calendar-table\" role=\"grid\">\n  <thead class=\"mtx-calendar-table-header\"></thead>\n  <tbody mtx-calendar-body\n         (@slideCalendar.done)=\"_calendarStateDone()\"\n         [@slideCalendar]=\"_calendarState\"\n         [todayValue]=\"_todayYear\"\n         [rows]=\"_years\"\n         [numCols]=\"4\"\n         [activeCell]=\"_getActiveCell()\"\n         [allowDisabledSelection]=\"true\"\n         [selectedValue]=\"_selectedYear!\"\n         (selectedValueChange)=\"_yearSelected($event)\"></tbody>\n</table>\n" }]
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
            }], minDate: [{
                type: Input
            }], maxDate: [{
                type: Input
            }] } });
function isSameMultiYearView(dateAdapter, date1, date2, minDate, maxDate) {
    const year1 = dateAdapter.getYear(date1);
    const year2 = dateAdapter.getYear(date2);
    const startingYear = getStartingYear(dateAdapter, minDate, maxDate);
    return (Math.floor((year1 - startingYear) / yearsPerPage) ===
        Math.floor((year2 - startingYear) / yearsPerPage));
}
/**
 * When the multi-year view is first opened, the active year will be in view.
 * So we compute how many years are between the active year and the *slot* where our
 * "startingYear" will render when paged into view.
 */
function getActiveOffset(dateAdapter, activeDate, minDate, maxDate) {
    const activeYear = dateAdapter.getYear(activeDate);
    return euclideanModulo(activeYear - getStartingYear(dateAdapter, minDate, maxDate), yearsPerPage);
}
/**
 * We pick a "starting" year such that either the maximum year would be at the end
 * or the minimum year would be at the beginning of a page.
 */
function getStartingYear(dateAdapter, minDate, maxDate) {
    let startingYear = 0;
    if (maxDate) {
        const maxYear = dateAdapter.getYear(maxDate);
        startingYear = maxYear - yearsPerPage + 1;
    }
    else if (minDate) {
        startingYear = dateAdapter.getYear(minDate);
    }
    return startingYear;
}
/** Gets remainder that is non-negative, even if first number is negative */
function euclideanModulo(a, b) {
    return ((a % b) + b) % b;
}

class MtxDatetimepickerIntl {
    constructor() {
        /**
         * Stream to emit from when labels are changed. Use this to notify components when the labels have
         * changed after initialization.
         */
        this.changes = new Subject();
        /** A label for the calendar popup (used by screen readers). */
        this.calendarLabel = 'Calendar';
        /** A label for the button used to open the calendar popup (used by screen readers). */
        this.openCalendarLabel = 'Open calendar';
        /** Label for the button used to close the calendar popup. */
        this.closeCalendarLabel = 'Close calendar';
        /** A label for the previous month button (used by screen readers). */
        this.prevMonthLabel = 'Previous month';
        /** A label for the next month button (used by screen readers). */
        this.nextMonthLabel = 'Next month';
        /** A label for the previous year button (used by screen readers). */
        this.prevYearLabel = 'Previous year';
        /** A label for the next year button (used by screen readers). */
        this.nextYearLabel = 'Next year';
        /** A label for the previous multi-year button (used by screen readers). */
        this.prevMultiYearLabel = 'Previous 24 years';
        /** A label for the next multi-year button (used by screen readers). */
        this.nextMultiYearLabel = 'Next 24 years';
        /** A label for the 'switch to month view' button (used by screen readers). */
        this.switchToMonthViewLabel = 'Choose date';
        /** A label for the 'switch to year view' button (used by screen readers). */
        this.switchToYearViewLabel = 'Choose month';
        /** A label for the 'switch to multi-year view' button (used by screen readers). */
        this.switchToMultiYearViewLabel = 'Choose month and year';
        /** A label for the first date of a range of dates (used by screen readers). */
        this.startDateLabel = 'Start date';
        /** A label for the last date of a range of dates (used by screen readers). */
        this.endDateLabel = 'End date';
        /** A label for the 'switch to clock hour view' button (used by screen readers). */
        this.switchToClockHourViewLabel = 'Choose hour';
        /** A label for the 'switch to clock minute view' button (used by screen readers). */
        this.switchToClockMinuteViewLabel = 'Choose minute';
        /** Label used for ok button within the manual time input. */
        this.okLabel = 'OK';
        /** Label used for cancel button within the manual time input. */
        this.cancelLabel = 'Cancel';
    }
    /** Formats a range of years (used for visuals). */
    formatYearRange(start, end) {
        return `${start} \u2013 ${end}`;
    }
    /** Formats a label for a range of years (used by screen readers). */
    formatYearRangeLabel(start, end) {
        return `${start} to ${end}`;
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxDatetimepickerIntl, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxDatetimepickerIntl, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxDatetimepickerIntl, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });

function pad(num, size) {
    num = String(num);
    while (num.length < size)
        num = '0' + num;
    return num;
}
class MtxTimeInput {
    set timeInterval(value) {
        this._interval = coerceNumberProperty(value);
    }
    set timeMin(value) {
        this._min = coerceNumberProperty(value);
    }
    set timeMax(value) {
        this._max = coerceNumberProperty(value);
    }
    set timeValue(value) {
        this._value = coerceNumberProperty(value);
        if (!this.hasFocus) {
            this.writeValue(this._value);
        }
        this.writePlaceholder(this._value);
    }
    constructor(element, cdr) {
        this.element = element;
        this.cdr = cdr;
        this._interval = 1;
        this._min = 0;
        this._max = Infinity;
        this.timeValueChanged = new EventEmitter();
        this.keyDownListener = this.keyDownHandler.bind(this);
        this.keyPressListener = this.keyPressHandler.bind(this);
        this.inputEventListener = this.inputChangedHandler.bind(this);
        this.inputElement.addEventListener('keydown', this.keyDownListener, {
            passive: true,
        });
        // Do not passive since we want to be able to preventDefault()
        this.inputElement.addEventListener('keypress', this.keyPressListener);
        this.inputElement.addEventListener('input', this.inputEventListener, {
            passive: true,
        });
    }
    get hasFocus() {
        return this.element.nativeElement && this.element?.nativeElement === document?.activeElement;
    }
    get inputElement() {
        return this.element.nativeElement;
    }
    // We look here at the placeholder value, because we write '' into the value on focus
    // placeholder should always be up to date with "currentValue"
    get valid() {
        // At the start _value is undefined therefore this would result in not valid and
        // make a ugly warning border afterwards we can safely check
        if (this._value) {
            const currentValue = String(this.inputElement.value);
            // It can be that currentValue is empty due to we removing the value on focus,
            // if that is the case we should check previous value which should be in the placeholder
            if (currentValue.length) {
                return this._value == this.inputElement.value;
            }
            else {
                return this._value == this.inputElement.placeholder;
            }
        }
        return true;
    }
    get invalid() {
        return !this.valid;
    }
    blur() {
        this.writeValue(this._value);
        this.writePlaceholder(this._value);
        this.timeValueChanged.emit(this._value);
    }
    focus() {
        this.writeValue('');
    }
    /**
     * Write value to inputElement
     * @param value NumberInput
     */
    writeValue(value) {
        if (value !== '') {
            this.inputElement.value = pad(value, 2);
        }
        else {
            this.inputElement.value = '';
        }
        this.cdr.markForCheck();
    }
    /**
     * Writes value to placeholder
     * @param value NumberInput
     */
    writePlaceholder(value) {
        this.inputElement.placeholder = pad(value, 2);
        this.cdr.markForCheck();
    }
    keyDownHandler(event) {
        if (String(this.inputElement.value).length > 0) {
            let value = null;
            if (event.keyCode === UP_ARROW) {
                value = coerceNumberProperty(this._value);
                value += this._interval;
                event.stopPropagation();
            }
            else if (event.keyCode === DOWN_ARROW) {
                value = coerceNumberProperty(this._value);
                value -= this._interval;
                event.stopPropagation();
            }
            // if value has changed
            if (typeof value === 'number') {
                this.writeValue(value);
                this.writePlaceholder(value);
                this.clampInputValue();
                this.timeValueChanged.emit(this._value);
            }
        }
    }
    /**
     * Prevent non number inputs in the inputElement with the exception of Enter/BackSpace
     * @param event KeyboardEvent
     */
    keyPressHandler(event) {
        const key = event?.key ?? null;
        if (isNaN(Number(key)) && key !== 'Enter') {
            event.preventDefault();
        }
    }
    inputChangedHandler() {
        this.clampInputValue();
        this.timeValueChanged.emit(this._value);
    }
    clampInputValue() {
        if (this.inputElement?.value === '') {
            return;
        }
        const value = coerceNumberProperty(this.inputElement?.value ?? null);
        // if this._min === 0, we should allow 0
        if (value || (this._min === 0 && value === 0)) {
            const clampedValue = Math.min(Math.max(value, this._min), this._max);
            if (clampedValue !== value) {
                this.writeValue(clampedValue);
                this.writePlaceholder(clampedValue);
            }
            this._value = clampedValue;
        }
    }
    /**
     * Remove event listeners on destruction
     */
    ngOnDestroy() {
        this.inputElement.removeEventListener('keydown', this.keyDownListener);
        this.inputElement.removeEventListener('keypress', this.keyPressListener);
        this.inputElement.removeEventListener('input', this.inputEventListener);
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxTimeInput, deps: [{ token: i0.ElementRef }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    /** @nocollapse */ static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.0.1", type: MtxTimeInput, isStandalone: true, selector: "input.mtx-time-input", inputs: { timeInterval: "timeInterval", timeMin: "timeMin", timeMax: "timeMax", timeValue: "timeValue" }, outputs: { timeValueChanged: "timeValueChanged" }, host: { listeners: { "blur": "blur($event)", "focus": "focus($event)" } }, exportAs: ["mtxTimeInput"], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxTimeInput, decorators: [{
            type: Directive,
            args: [{
                    selector: 'input.mtx-time-input',
                    host: {
                        '(blur)': 'blur($event)',
                        '(focus)': 'focus($event)',
                    },
                    exportAs: 'mtxTimeInput',
                    standalone: true,
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i0.ChangeDetectorRef }], propDecorators: { timeInterval: [{
                type: Input,
                args: ['timeInterval']
            }], timeMin: [{
                type: Input,
                args: ['timeMin']
            }], timeMax: [{
                type: Input,
                args: ['timeMax']
            }], timeValue: [{
                type: Input,
                args: ['timeValue']
            }], timeValueChanged: [{
                type: Output
            }] } });
class MtxTime {
    /**
     * The date to display in this clock view.
     */
    get activeDate() {
        return this._activeDate;
    }
    set activeDate(value) {
        this._activeDate = this._adapter.clampDate(value, this.minDate, this.maxDate);
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
    get clockView() {
        return this._clockView;
    }
    set clockView(value) {
        this._clockView = value;
    }
    get isHourView() {
        return this._clockView === 'hour';
    }
    get isMinuteView() {
        return this._clockView === 'hour';
    }
    get hour() {
        if (!this.activeDate) {
            if (this.twelvehour) {
                return '12';
            }
            else {
                return '00';
            }
        }
        const hour = Number(this._adapter.getHour(this.activeDate));
        if (!this.twelvehour) {
            return this.prefixWithZero(hour);
        }
        if (hour === 0) {
            return '12';
        }
        else {
            return this.prefixWithZero(hour > 12 ? hour - 12 : hour);
        }
    }
    get minute() {
        if (this.activeDate) {
            return this.prefixWithZero(this._adapter.getMinute(this.activeDate));
        }
        return '00';
    }
    prefixWithZero(value) {
        if (value < 10) {
            return '0' + String(value);
        }
        return String(value);
    }
    constructor(_adapter, _changeDetectorRef, _datetimepickerIntl) {
        this._adapter = _adapter;
        this._changeDetectorRef = _changeDetectorRef;
        this._datetimepickerIntl = _datetimepickerIntl;
        /** Emits when the currently selected date changes. */
        this.selectedChange = new EventEmitter();
        /** Emits when any date changes. */
        this.activeDateChange = new EventEmitter();
        /** Emits when any date is selected. */
        this._userSelection = new EventEmitter();
        /** Emits when AM/PM button are clicked. */
        this.ampmChange = new EventEmitter();
        /** Emits when AM/PM button are clicked. */
        this.clockViewChange = new EventEmitter();
        /** Step over minutes. */
        this.interval = 1;
        /** Whether the clock uses 12 hour format. */
        this.twelvehour = false;
        /** Whether the time is now in AM or PM. */
        this.AMPM = 'AM';
        this.timeInput = 'dial';
        /** Whether the clock is in hour view. */
        this._clockView = 'hour';
        this.datetimepickerIntlChangesSubscription = this._datetimepickerIntl.changes.subscribe(() => {
            this._changeDetectorRef.detectChanges();
        });
    }
    ngOnChanges(changes) {
        // when clockView changes by input we should focus the correct input
        if (changes.clockView) {
            if (changes.clockView.currentValue !== changes.clockView.previousValue) {
                this.focusInputElement();
            }
        }
    }
    ngAfterViewInit() {
        this.focusInputElement();
    }
    focusInputElement() {
        if (this.clockView === 'hour') {
            if (this.hourInputElement) {
                this.hourInputElement.nativeElement.focus();
            }
        }
        else {
            if (this.minuteInputElement) {
                this.minuteInputElement.nativeElement.focus();
            }
        }
    }
    handleHourInputChange(value) {
        const hour = coerceNumberProperty(value);
        if (hour || hour === 0) {
            const newValue = this._adapter.createDatetime(this._adapter.getYear(this.activeDate), this._adapter.getMonth(this.activeDate), this._adapter.getDate(this.activeDate), this.updateHourForAmPm(hour), this._adapter.getMinute(this.activeDate));
            this._activeDate = this._adapter.clampDate(newValue, this.minDate, this.maxDate);
            this.activeDateChange.emit(this.activeDate);
            // If previously we did set [mtxValue]="13" and the input changed to 6, and the clamping
            // will make it "13" again then the hourInputDirective will not have been updated
            // since "13" === "13" same reference so no change detected by directly setting it within
            // this handler, we handle this usecase
            if (this.hourInputDirective) {
                this.hourInputDirective.timeValue = this.hour;
            }
        }
    }
    updateHourForAmPm(value) {
        if (!this.twelvehour) {
            return value;
        }
        // value should be between 1-12
        if (this.AMPM === 'AM') {
            if (value === 0 || value === 12) {
                return 0;
            }
            return value;
        }
        // PM
        else {
            if (value === 0 || value === 12) {
                return 12;
            }
            // other cases, we should add 12 to the value aka 3:00 PM = 3 + 12 = 15:00
            return value + 12;
        }
    }
    handleMinuteInputChange(value) {
        const minute = coerceNumberProperty(value);
        if (minute || minute === 0) {
            const newValue = this._adapter.createDatetime(this._adapter.getYear(this.activeDate), this._adapter.getMonth(this.activeDate), this._adapter.getDate(this.activeDate), this._adapter.getHour(this._activeDate), minute);
            this._activeDate = this._adapter.clampDate(newValue, this.minDate, this.maxDate);
            this.activeDateChange.emit(this.activeDate);
            // If previously we did set [mtxValue]="40" and the input changed to 30, and the clamping
            // will make it "40" again then the minuteInputDirective will not have been updated
            // since "40" === "40" same reference so no change detected by directly setting it within
            // this handler, we handle this usecase
            if (this.minuteInputDirective) {
                this.minuteInputDirective.timeValue = this.minute;
            }
        }
    }
    handleFocus(clockView) {
        this.clockView = clockView;
        this.clockViewChange.emit(clockView);
    }
    _timeSelected(date) {
        if (this.clockView === 'hour') {
            this.clockView = 'minute';
        }
        this._activeDate = this.selected = date;
    }
    _onActiveDateChange(date) {
        this._activeDate = date;
        this.activeDateChange.emit(date);
    }
    handleOk() {
        if (this._selected) {
            this.selectedChange.emit(this._selected);
        }
        this._userSelection.emit();
    }
    handleCancel() {
        this._userSelection.emit();
    }
    ngOnDestroy() {
        if (this.datetimepickerIntlChangesSubscription) {
            this.datetimepickerIntlChangesSubscription.unsubscribe();
        }
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxTime, deps: [{ token: i1.DatetimeAdapter }, { token: i0.ChangeDetectorRef }, { token: MtxDatetimepickerIntl }], target: i0.ɵɵFactoryTarget.Component }); }
    /** @nocollapse */ static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.0.1", type: MtxTime, isStandalone: true, selector: "mtx-time", inputs: { dateFilter: "dateFilter", interval: "interval", twelvehour: ["twelvehour", "twelvehour", booleanAttribute], AMPM: "AMPM", timeInput: "timeInput", activeDate: "activeDate", selected: "selected", minDate: "minDate", maxDate: "maxDate", clockView: "clockView" }, outputs: { selectedChange: "selectedChange", activeDateChange: "activeDateChange", _userSelection: "_userSelection", ampmChange: "ampmChange", clockViewChange: "clockViewChange" }, host: { classAttribute: "mtx-time" }, viewQueries: [{ propertyName: "hourInputElement", first: true, predicate: ["hourInput"], descendants: true, read: (ElementRef) }, { propertyName: "hourInputDirective", first: true, predicate: ["hourInput"], descendants: true, read: MtxTimeInput }, { propertyName: "minuteInputElement", first: true, predicate: ["minuteInput"], descendants: true, read: (ElementRef) }, { propertyName: "minuteInputDirective", first: true, predicate: ["minuteInput"], descendants: true, read: MtxTimeInput }], exportAs: ["mtxTime"], usesOnChanges: true, ngImport: i0, template: "<div class=\"mtx-time-input-wrapper\">\n  <div class=\"mtx-time-input-inner\">\n    <input class=\"mtx-time-input\"\n      [class.mtx-time-input-active]=\"clockView === 'hour'\"\n      [class.mtx-time-input-warning]=\"!hourInput.valid\"\n      #hourInput=\"mtxTimeInput\"\n      type=\"text\"\n      inputmode=\"numeric\"\n      maxlength=\"2\"\n      [timeMin]=\"twelvehour ? 1 : 0\"\n      [timeMax]=\"twelvehour ? 12 : 23\"\n      [timeValue]=\"hour\"\n      (timeValueChanged)=\"handleHourInputChange($event)\"\n      (focus)=\"handleFocus('hour')\" />\n\n    <div class=\"mtx-time-seperator\">:</div>\n\n    <input class=\"mtx-time-input\"\n      [class.mtx-time-input-active]=\"clockView === 'minute'\"\n      [class.mtx-time-input-warning]=\"!minuteInput.valid\"\n      #minuteInput=\"mtxTimeInput\"\n      type=\"text\"\n      inputmode=\"numeric\"\n      maxlength=\"2\"\n      [timeMin]=\"0\"\n      [timeMax]=\"59\"\n      [timeValue]=\"minute\"\n      (timeValueChanged)=\"handleMinuteInputChange($event)\"\n      [timeInterval]=\"interval\"\n      (focus)=\"handleFocus('minute')\" />\n\n    @if (twelvehour) {\n      <div class=\"mtx-time-ampm\">\n        <button mat-button type=\"button\" class=\"mtx-time-am\"\n          [class.mtx-time-ampm-active]=\"AMPM === 'AM'\" aria-label=\"AM\"\n          (keydown)=\"$event.stopPropagation()\"\n        (click)=\"ampmChange.emit('AM')\">AM</button>\n        <button mat-button type=\"button\" class=\"mtx-time-pm\"\n          [class.mtx-time-ampm-active]=\"AMPM === 'PM'\" aria-label=\"PM\"\n          (keydown)=\"$event.stopPropagation()\"\n        (click)=\"ampmChange.emit('PM')\">PM</button>\n      </div>\n    }\n  </div>\n</div>\n\n@if (timeInput !== 'input') {\n  <mtx-clock (selectedChange)=\"_timeSelected($event)\"\n    (activeDateChange)=\"_onActiveDateChange($event)\"\n    [AMPM]=\"AMPM\"\n    [dateFilter]=\"dateFilter\"\n    [interval]=\"interval\"\n    [maxDate]=\"maxDate\"\n    [minDate]=\"minDate\"\n    [selected]=\"selected\"\n    [startView]=\"clockView\"\n    [twelvehour]=\"twelvehour\">\n  </mtx-clock>\n}\n\n<div class=\"mtx-time-button-wrapper\">\n  <button class=\"mtx-time-cancel-button\" mat-button type=\"button\" (click)=\"handleCancel()\">\n    {{ _datetimepickerIntl.cancelLabel }}\n  </button>\n  <button class=\"mtx-time-ok-button\" mat-button type=\"button\" (click)=\"handleOk()\"\n    [disabled]=\"minuteInputDirective?.invalid || hourInputDirective?.invalid\">\n    {{ _datetimepickerIntl.okLabel }}\n  </button>\n</div>\n", styles: [".mtx-time{display:block;outline:none;-webkit-user-select:none;user-select:none}.mtx-time-input-wrapper{padding:8px 0;text-align:center}.mtx-time-input-inner{display:inline-flex;height:56px}.mtx-time-input{box-sizing:border-box;width:72px;height:100%;padding:0;font-size:36px;text-align:center;border:2px solid transparent;appearance:none;outline:none;border-radius:var(--mtx-datetimepicker-selector-container-shape);background-color:var(--mtx-datetimepicker-time-input-background-color);color:var(--mtx-datetimepicker-time-input-text-color)}.mtx-time-input.mtx-time-input-active{background-color:var(--mtx-datetimepicker-time-input-active-state-background-color);color:var(--mtx-datetimepicker-time-input-active-state-text-color)}.mtx-time-input.mtx-time-input-active:focus{border-color:var(--mtx-datetimepicker-time-input-focus-state-outline-color);background-color:var(--mtx-datetimepicker-time-input-focus-state-background-color)}.mtx-time-input.mtx-time-input-active:focus::placeholder{color:var(--mtx-datetimepicker-time-input-focus-state-placeholder-text-color)}.mtx-time-input.mtx-time-input-warning{border-color:var(--mtx-datetimepicker-time-input-warn-state-outline-color)}.mtx-time-seperator{display:inline-flex;justify-content:center;align-items:center;width:24px;font-size:36px}.mtx-time-ampm{display:inline-flex;flex-direction:column;margin-left:12px}[dir=rtl] .mtx-time-ampm{margin-left:auto;margin-right:12px}.mtx-time-ampm .mtx-time-am,.mtx-time-ampm .mtx-time-pm{--mdc-text-button-label-text-weight: 400;--mdc-text-button-label-text-color: var(--mtx-datetimepicker-time-ampm-text-color);--mdc-text-button-container-shape: var(--mtx-datetimepicker-selector-container-shape);border-color:var(--mtx-datetimepicker-time-ampm-outline-color);flex:1;width:40px;min-width:auto;border-width:1px;border-style:solid}.mtx-time-ampm .mtx-time-am.mtx-time-ampm-active,.mtx-time-ampm .mtx-time-pm.mtx-time-ampm-active{--mdc-text-button-label-text-weight: 500;--mdc-text-button-label-text-color: var(--mtx-datetimepicker-time-ampm-selected-state-text-color);background-color:var(--mtx-datetimepicker-time-ampm-selected-state-background-color)}.mtx-time-ampm .mtx-time-am .mat-mdc-button-touch-target,.mtx-time-ampm .mtx-time-pm .mat-mdc-button-touch-target{height:100%}.mtx-time-ampm .mtx-time-am{border-bottom-left-radius:0;border-bottom-right-radius:0}.mtx-time-ampm .mtx-time-pm{border-top-left-radius:0;border-top-right-radius:0;border-top-width:0}.mtx-time-button-wrapper{display:flex;justify-content:flex-end;padding-top:8px}.mtx-time-button-wrapper .mat-mdc-button-base+.mat-mdc-button-base{margin-left:8px}[dir=rtl] .mtx-time-button-wrapper .mat-mdc-button-base+.mat-mdc-button-base{margin-left:0;margin-right:8px}\n"], dependencies: [{ kind: "component", type: MatButton, selector: "    button[mat-button], button[mat-raised-button], button[mat-flat-button],    button[mat-stroked-button]  ", exportAs: ["matButton"] }, { kind: "component", type: MtxClock, selector: "mtx-clock", inputs: ["dateFilter", "interval", "twelvehour", "AMPM", "activeDate", "selected", "minDate", "maxDate", "startView"], outputs: ["selectedChange", "activeDateChange", "_userSelection"], exportAs: ["mtxClock"] }, { kind: "directive", type: MtxTimeInput, selector: "input.mtx-time-input", inputs: ["timeInterval", "timeMin", "timeMax", "timeValue"], outputs: ["timeValueChanged"], exportAs: ["mtxTimeInput"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxTime, decorators: [{
            type: Component,
            args: [{ selector: 'mtx-time', exportAs: 'mtxTime', host: {
                        class: 'mtx-time',
                    }, encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, standalone: true, imports: [MatButton, MtxClock, MtxTimeInput], template: "<div class=\"mtx-time-input-wrapper\">\n  <div class=\"mtx-time-input-inner\">\n    <input class=\"mtx-time-input\"\n      [class.mtx-time-input-active]=\"clockView === 'hour'\"\n      [class.mtx-time-input-warning]=\"!hourInput.valid\"\n      #hourInput=\"mtxTimeInput\"\n      type=\"text\"\n      inputmode=\"numeric\"\n      maxlength=\"2\"\n      [timeMin]=\"twelvehour ? 1 : 0\"\n      [timeMax]=\"twelvehour ? 12 : 23\"\n      [timeValue]=\"hour\"\n      (timeValueChanged)=\"handleHourInputChange($event)\"\n      (focus)=\"handleFocus('hour')\" />\n\n    <div class=\"mtx-time-seperator\">:</div>\n\n    <input class=\"mtx-time-input\"\n      [class.mtx-time-input-active]=\"clockView === 'minute'\"\n      [class.mtx-time-input-warning]=\"!minuteInput.valid\"\n      #minuteInput=\"mtxTimeInput\"\n      type=\"text\"\n      inputmode=\"numeric\"\n      maxlength=\"2\"\n      [timeMin]=\"0\"\n      [timeMax]=\"59\"\n      [timeValue]=\"minute\"\n      (timeValueChanged)=\"handleMinuteInputChange($event)\"\n      [timeInterval]=\"interval\"\n      (focus)=\"handleFocus('minute')\" />\n\n    @if (twelvehour) {\n      <div class=\"mtx-time-ampm\">\n        <button mat-button type=\"button\" class=\"mtx-time-am\"\n          [class.mtx-time-ampm-active]=\"AMPM === 'AM'\" aria-label=\"AM\"\n          (keydown)=\"$event.stopPropagation()\"\n        (click)=\"ampmChange.emit('AM')\">AM</button>\n        <button mat-button type=\"button\" class=\"mtx-time-pm\"\n          [class.mtx-time-ampm-active]=\"AMPM === 'PM'\" aria-label=\"PM\"\n          (keydown)=\"$event.stopPropagation()\"\n        (click)=\"ampmChange.emit('PM')\">PM</button>\n      </div>\n    }\n  </div>\n</div>\n\n@if (timeInput !== 'input') {\n  <mtx-clock (selectedChange)=\"_timeSelected($event)\"\n    (activeDateChange)=\"_onActiveDateChange($event)\"\n    [AMPM]=\"AMPM\"\n    [dateFilter]=\"dateFilter\"\n    [interval]=\"interval\"\n    [maxDate]=\"maxDate\"\n    [minDate]=\"minDate\"\n    [selected]=\"selected\"\n    [startView]=\"clockView\"\n    [twelvehour]=\"twelvehour\">\n  </mtx-clock>\n}\n\n<div class=\"mtx-time-button-wrapper\">\n  <button class=\"mtx-time-cancel-button\" mat-button type=\"button\" (click)=\"handleCancel()\">\n    {{ _datetimepickerIntl.cancelLabel }}\n  </button>\n  <button class=\"mtx-time-ok-button\" mat-button type=\"button\" (click)=\"handleOk()\"\n    [disabled]=\"minuteInputDirective?.invalid || hourInputDirective?.invalid\">\n    {{ _datetimepickerIntl.okLabel }}\n  </button>\n</div>\n", styles: [".mtx-time{display:block;outline:none;-webkit-user-select:none;user-select:none}.mtx-time-input-wrapper{padding:8px 0;text-align:center}.mtx-time-input-inner{display:inline-flex;height:56px}.mtx-time-input{box-sizing:border-box;width:72px;height:100%;padding:0;font-size:36px;text-align:center;border:2px solid transparent;appearance:none;outline:none;border-radius:var(--mtx-datetimepicker-selector-container-shape);background-color:var(--mtx-datetimepicker-time-input-background-color);color:var(--mtx-datetimepicker-time-input-text-color)}.mtx-time-input.mtx-time-input-active{background-color:var(--mtx-datetimepicker-time-input-active-state-background-color);color:var(--mtx-datetimepicker-time-input-active-state-text-color)}.mtx-time-input.mtx-time-input-active:focus{border-color:var(--mtx-datetimepicker-time-input-focus-state-outline-color);background-color:var(--mtx-datetimepicker-time-input-focus-state-background-color)}.mtx-time-input.mtx-time-input-active:focus::placeholder{color:var(--mtx-datetimepicker-time-input-focus-state-placeholder-text-color)}.mtx-time-input.mtx-time-input-warning{border-color:var(--mtx-datetimepicker-time-input-warn-state-outline-color)}.mtx-time-seperator{display:inline-flex;justify-content:center;align-items:center;width:24px;font-size:36px}.mtx-time-ampm{display:inline-flex;flex-direction:column;margin-left:12px}[dir=rtl] .mtx-time-ampm{margin-left:auto;margin-right:12px}.mtx-time-ampm .mtx-time-am,.mtx-time-ampm .mtx-time-pm{--mdc-text-button-label-text-weight: 400;--mdc-text-button-label-text-color: var(--mtx-datetimepicker-time-ampm-text-color);--mdc-text-button-container-shape: var(--mtx-datetimepicker-selector-container-shape);border-color:var(--mtx-datetimepicker-time-ampm-outline-color);flex:1;width:40px;min-width:auto;border-width:1px;border-style:solid}.mtx-time-ampm .mtx-time-am.mtx-time-ampm-active,.mtx-time-ampm .mtx-time-pm.mtx-time-ampm-active{--mdc-text-button-label-text-weight: 500;--mdc-text-button-label-text-color: var(--mtx-datetimepicker-time-ampm-selected-state-text-color);background-color:var(--mtx-datetimepicker-time-ampm-selected-state-background-color)}.mtx-time-ampm .mtx-time-am .mat-mdc-button-touch-target,.mtx-time-ampm .mtx-time-pm .mat-mdc-button-touch-target{height:100%}.mtx-time-ampm .mtx-time-am{border-bottom-left-radius:0;border-bottom-right-radius:0}.mtx-time-ampm .mtx-time-pm{border-top-left-radius:0;border-top-right-radius:0;border-top-width:0}.mtx-time-button-wrapper{display:flex;justify-content:flex-end;padding-top:8px}.mtx-time-button-wrapper .mat-mdc-button-base+.mat-mdc-button-base{margin-left:8px}[dir=rtl] .mtx-time-button-wrapper .mat-mdc-button-base+.mat-mdc-button-base{margin-left:0;margin-right:8px}\n"] }]
        }], ctorParameters: () => [{ type: i1.DatetimeAdapter }, { type: i0.ChangeDetectorRef }, { type: MtxDatetimepickerIntl }], propDecorators: { selectedChange: [{
                type: Output
            }], activeDateChange: [{
                type: Output
            }], _userSelection: [{
                type: Output
            }], ampmChange: [{
                type: Output
            }], clockViewChange: [{
                type: Output
            }], dateFilter: [{
                type: Input
            }], interval: [{
                type: Input
            }], hourInputElement: [{
                type: ViewChild,
                args: ['hourInput', { read: (ElementRef) }]
            }], hourInputDirective: [{
                type: ViewChild,
                args: ['hourInput', { read: MtxTimeInput }]
            }], minuteInputElement: [{
                type: ViewChild,
                args: ['minuteInput', { read: (ElementRef) }]
            }], minuteInputDirective: [{
                type: ViewChild,
                args: ['minuteInput', { read: MtxTimeInput }]
            }], twelvehour: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], AMPM: [{
                type: Input
            }], timeInput: [{
                type: Input
            }], activeDate: [{
                type: Input
            }], selected: [{
                type: Input
            }], minDate: [{
                type: Input
            }], maxDate: [{
                type: Input
            }], clockView: [{
                type: Input
            }] } });

/**
 * An internal component used to display a single year in the datetimepicker.
 * @docs-private
 */
class MtxYearView {
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

/**
 * A calendar that is used as part of the datetimepicker.
 * @docs-private
 */
class MtxCalendar {
    constructor(_elementRef, _intl, _ngZone, _adapter, _dateFormats, _changeDetectorRef) {
        this._elementRef = _elementRef;
        this._intl = _intl;
        this._ngZone = _ngZone;
        this._adapter = _adapter;
        this._dateFormats = _dateFormats;
        /** Whether to show multi-year view. */
        this.multiYearSelector = false;
        /** Whether the clock uses 12 hour format. */
        this.twelvehour = false;
        /** Whether the calendar should be started in month or year view. */
        this.startView = 'month';
        /** Step over minutes. */
        this.timeInterval = 1;
        /** Prevent user to select same date time */
        this.preventSameDateTimeSelection = false;
        /** Emits when the currently selected date changes. */
        this.selectedChange = new EventEmitter();
        /** Emits when the view has been changed. */
        this.viewChanged = new EventEmitter();
        this._userSelection = new EventEmitter();
        this._clockView = 'hour';
        this._injector = inject(Injector);
        this._type = 'date';
        /**
         * Whether the calendar is in time mode. In time mode the calendar clock gets time input elements
         * rather then just clock. When touchUi is enabled this will be disabled
         */
        this.timeInput = 'dial';
        /** Date filter for the month and year views. */
        this._dateFilterForViews = (date) => {
            return (!!date &&
                (!this.dateFilter || this.dateFilter(date, MtxDatetimepickerFilterType.DATE)) &&
                (!this.minDate || this._adapter.compareDate(date, this.minDate) >= 0) &&
                (!this.maxDate || this._adapter.compareDate(date, this.maxDate) <= 0));
        };
        if (!this._adapter) {
            throw createMissingDateImplError('DatetimeAdapter');
        }
        if (!this._dateFormats) {
            throw createMissingDateImplError('MTX_DATETIME_FORMATS');
        }
        this._intlChanges = _intl.changes.subscribe(() => _changeDetectorRef.markForCheck());
    }
    /** The display type of datetimepicker. */
    get type() {
        return this._type;
    }
    set type(value) {
        this._type = value || 'date';
        if (this.type === 'year') {
            this.multiYearSelector = true;
        }
    }
    /** A date representing the period (month or year) to start the calendar in. */
    get startAt() {
        return this._startAt;
    }
    set startAt(value) {
        this._startAt = this._adapter.getValidDateOrNull(value);
    }
    /** The currently selected date. */
    get selected() {
        return this._selected;
    }
    set selected(value) {
        this._selected = this._adapter.getValidDateOrNull(value);
    }
    /** The minimum selectable date. */
    get minDate() {
        return this._minDate;
    }
    set minDate(value) {
        this._minDate = this._adapter.getValidDateOrNull(value);
    }
    /** The maximum selectable date. */
    get maxDate() {
        return this._maxDate;
    }
    set maxDate(value) {
        this._maxDate = this._adapter.getValidDateOrNull(value);
    }
    /**
     * The current active date. This determines which time period is shown and which date is
     * highlighted when using keyboard navigation.
     */
    get _activeDate() {
        return this._clampedActiveDate;
    }
    set _activeDate(value) {
        const oldActiveDate = this._clampedActiveDate;
        this._clampedActiveDate = this._adapter.clampDate(value, this.minDate, this.maxDate);
        // whenever active date changed, and possibly got clamped we should adjust the am/pm setting
        this._selectAMPM(this._clampedActiveDate);
        if (oldActiveDate &&
            this._clampedActiveDate &&
            this.currentView === 'month' &&
            !this._adapter.sameMonthAndYear(oldActiveDate, this._clampedActiveDate)) {
            if (this._adapter.isInNextMonth(oldActiveDate, this._clampedActiveDate)) {
                this.calendarState('right');
            }
            else {
                this.calendarState('left');
            }
        }
    }
    /** Whether the calendar is in month view. */
    get currentView() {
        return this._currentView;
    }
    set currentView(view) {
        this._currentView = view;
        this.viewChanged.emit(view);
    }
    get _yearPeriodText() {
        if (this.currentView === 'multi-year') {
            // The offset from the active year to the "slot" for the starting year is the
            // *actual* first rendered year in the multi-year view, and the last year is
            // just yearsPerPage - 1 away.
            const activeYear = this._adapter.getYear(this._activeDate);
            const minYearOfPage = activeYear - getActiveOffset(this._adapter, this._activeDate, this.minDate, this.maxDate);
            const maxYearOfPage = minYearOfPage + yearsPerPage - 1;
            const minYearName = this._adapter.getYearName(this._adapter.createDate(minYearOfPage, 0, 1));
            const maxYearName = this._adapter.getYearName(this._adapter.createDate(maxYearOfPage, 0, 1));
            return this._intl.formatYearRange(minYearName, maxYearName);
        }
        return this.currentView === 'month'
            ? this._adapter.getMonthNames('long')[this._adapter.getMonth(this._activeDate)]
            : this._adapter.getYearName(this._activeDate);
    }
    get _yearButtonText() {
        return this._adapter.getYearName(this._activeDate);
    }
    get _yearButtonLabel() {
        return this.multiYearSelector
            ? this._intl.switchToMultiYearViewLabel
            : this._intl.switchToYearViewLabel;
    }
    get _dateButtonText() {
        switch (this.type) {
            case 'month':
                return this._adapter.getMonthNames('long')[this._adapter.getMonth(this._activeDate)];
            default:
                return this._adapter.format(this._activeDate, this._dateFormats.display.popupHeaderDateLabel);
        }
    }
    get _dateButtonLabel() {
        return this._intl.switchToMonthViewLabel;
    }
    get _hoursButtonText() {
        let hour = this._adapter.getHour(this._activeDate);
        if (this.twelvehour) {
            if (hour === 0) {
                hour = 24;
            }
            hour = hour > 12 ? hour - 12 : hour;
        }
        return this._2digit(hour);
    }
    get _hourButtonLabel() {
        return this._intl.switchToClockHourViewLabel;
    }
    get _minutesButtonText() {
        return this._2digit(this._adapter.getMinute(this._activeDate));
    }
    get _minuteButtonLabel() {
        return this._intl.switchToClockMinuteViewLabel;
    }
    get _prevButtonLabel() {
        switch (this._currentView) {
            case 'month':
                return this._intl.prevMonthLabel;
            case 'year':
                return this._intl.prevYearLabel;
            case 'multi-year':
                return this._intl.prevMultiYearLabel;
            default:
                return '';
        }
    }
    get _nextButtonLabel() {
        switch (this._currentView) {
            case 'month':
                return this._intl.nextMonthLabel;
            case 'year':
                return this._intl.nextYearLabel;
            case 'multi-year':
                return this._intl.nextMultiYearLabel;
            default:
                return '';
        }
    }
    _userSelected() {
        this._userSelection.emit();
    }
    ngAfterContentInit() {
        if (this.headerComponent) {
            this._calendarHeaderPortal = new ComponentPortal(this.headerComponent);
        }
        this._activeDate = this.startAt || this._adapter.today();
        this._selectAMPM(this._activeDate);
        if (this.type === 'year') {
            this.currentView = 'multi-year';
        }
        else if (this.type === 'month') {
            this.currentView = 'year';
        }
        else if (this.type === 'time') {
            this.currentView = this.timeInput === 'input' ? 'month' : 'clock';
        }
        else {
            this.currentView = this.startView || 'month';
        }
    }
    ngOnDestroy() {
        this._intlChanges.unsubscribe();
    }
    /** Handles date selection in the month view. */
    _dateSelected(date) {
        if (this.type === 'date') {
            if (!this._adapter.sameDate(date, this.selected) || !this.preventSameDateTimeSelection) {
                this.selectedChange.emit(date);
            }
        }
        else {
            this._activeDate = date;
            this.currentView = this.timeInput === 'input' ? 'month' : 'clock';
        }
    }
    /** Handles month selection in the year view. */
    _monthSelected(month) {
        if (this.type === 'month') {
            if (!this._adapter.sameMonthAndYear(month, this.selected) ||
                !this.preventSameDateTimeSelection) {
                this.selectedChange.emit(this._adapter.getFirstDateOfMonth(month));
            }
        }
        else {
            this._activeDate = month;
            this.currentView = 'month';
            this._clockView = 'hour';
        }
    }
    /** Handles year selection in the multi year view. */
    _yearSelected(year) {
        if (this.type === 'year') {
            if (!this._adapter.sameYear(year, this.selected) || !this.preventSameDateTimeSelection) {
                const normalizedDate = this._adapter.createDatetime(this._adapter.getYear(year), 0, 1, 0, 0);
                this.selectedChange.emit(normalizedDate);
            }
        }
        else {
            this._activeDate = year;
            this.currentView = 'year';
        }
    }
    _timeSelected(date) {
        this._activeDate = this._updateDate(date);
        if (!this._adapter.sameDatetime(date, this.selected) || !this.preventSameDateTimeSelection) {
            this.selectedChange.emit(date);
        }
    }
    _dialTimeSelected(date) {
        if (this._clockView !== 'minute') {
            this._activeDate = this._updateDate(date);
            this._clockView = 'minute';
        }
        else {
            if (!this._adapter.sameDatetime(date, this.selected) || !this.preventSameDateTimeSelection) {
                this.selectedChange.emit(date);
            }
        }
    }
    _onActiveDateChange(date) {
        this._activeDate = date;
    }
    _updateDate(date) {
        if (this.twelvehour) {
            const HOUR = this._adapter.getHour(date);
            if (HOUR === 12) {
                if (this._AMPM === 'AM') {
                    return this._adapter.addCalendarHours(date, -12);
                }
            }
            else if (this._AMPM === 'PM') {
                return this._adapter.addCalendarHours(date, 12);
            }
        }
        return date;
    }
    _selectAMPM(date) {
        const hour = this._adapter.getHour(date);
        if (hour > 11) {
            this._AMPM = 'PM';
        }
        else {
            this._AMPM = 'AM';
        }
    }
    _ampmClicked(source) {
        this._currentView = this.timeInput === 'input' ? 'month' : 'clock';
        if (source === this._AMPM) {
            return;
        }
        // if AMPM changed from PM to AM substract 12 hours
        const currentHour = this._adapter.getHour(this._activeDate);
        let newHourValue;
        if (source === 'AM') {
            newHourValue = currentHour >= 12 ? this._adapter.getHour(this._activeDate) - 12 : 12;
        }
        // otherwise add 12 hours
        else {
            newHourValue = (currentHour + 12) % 24;
        }
        const newActiveDate = this._adapter.clampDate(this._adapter.createDatetime(this._adapter.getYear(this._activeDate), this._adapter.getMonth(this._activeDate), this._adapter.getDate(this._activeDate), newHourValue, this._adapter.getMinute(this._activeDate)), this.minDate, this.maxDate);
        // only if our clamped date is not changed, we know we can apply the newActiveDate to the
        // activeDate
        if (this._adapter.getHour(newActiveDate) === newHourValue) {
            this._activeDate = newActiveDate;
            this._AMPM = source;
        }
    }
    _yearClicked() {
        if (this.type === 'year' || this.multiYearSelector) {
            this.currentView = 'multi-year';
            return;
        }
        this.currentView = 'year';
    }
    _dateClicked() {
        if (this.type !== 'month') {
            this.currentView = 'month';
        }
    }
    _hoursClicked() {
        this.currentView = this.timeInput === 'input' ? 'month' : 'clock';
        this._clockView = 'hour';
    }
    _minutesClicked() {
        this.currentView = this.timeInput === 'input' ? 'month' : 'clock';
        this._clockView = 'minute';
    }
    /** Handles user clicks on the previous button. */
    _previousClicked() {
        this._activeDate =
            this.currentView === 'month'
                ? this._adapter.addCalendarMonths(this._activeDate, -1)
                : this._adapter.addCalendarYears(this._activeDate, this.currentView === 'year' ? -1 : -yearsPerPage);
    }
    /** Handles user clicks on the next button. */
    _nextClicked() {
        this._activeDate =
            this.currentView === 'month'
                ? this._adapter.addCalendarMonths(this._activeDate, 1)
                : this._adapter.addCalendarYears(this._activeDate, this.currentView === 'year' ? 1 : yearsPerPage);
    }
    /** Whether the previous period button is enabled. */
    _previousEnabled() {
        if (!this.minDate) {
            return true;
        }
        return !this.minDate || !this._isSameView(this._activeDate, this.minDate);
    }
    /** Whether the next period button is enabled. */
    _nextEnabled() {
        return !this.maxDate || !this._isSameView(this._activeDate, this.maxDate);
    }
    /** Handles keydown events on the calendar body. */
    _handleCalendarBodyKeydown(event) {
        // TODO(mmalerba): We currently allow keyboard navigation to disabled dates, but just prevent
        // disabled ones from being selected. This may not be ideal, we should look into whether
        // navigation should skip over disabled dates, and if so, how to implement that efficiently.
        if (this.currentView === 'month') {
            this._handleCalendarBodyKeydownInMonthView(event);
        }
        else if (this.currentView === 'year') {
            this._handleCalendarBodyKeydownInYearView(event);
        }
        else if (this.currentView === 'multi-year') {
            this._handleCalendarBodyKeydownInMultiYearView(event);
        }
        else {
            this._handleCalendarBodyKeydownInClockView(event);
        }
    }
    _focusActiveCell() {
        afterNextRender(() => {
            this._elementRef.nativeElement.focus();
        }, { injector: this._injector });
    }
    _calendarStateDone() {
        this._calendarState = '';
    }
    /** Whether the two dates represent the same view in the current view mode (month or year). */
    _isSameView(date1, date2) {
        if (this.currentView === 'month') {
            return (this._adapter.getYear(date1) === this._adapter.getYear(date2) &&
                this._adapter.getMonth(date1) === this._adapter.getMonth(date2));
        }
        if (this.currentView === 'year') {
            return this._adapter.getYear(date1) === this._adapter.getYear(date2);
        }
        // Otherwise we are in 'multi-year' view.
        return isSameMultiYearView(this._adapter, date1, date2, this.minDate, this.maxDate);
    }
    /** Handles keydown events on the calendar body when calendar is in month view. */
    _handleCalendarBodyKeydownInMonthView(event) {
        switch (event.keyCode) {
            case LEFT_ARROW:
                this._activeDate = this._adapter.addCalendarDays(this._activeDate, -1);
                break;
            case RIGHT_ARROW:
                this._activeDate = this._adapter.addCalendarDays(this._activeDate, 1);
                break;
            case UP_ARROW:
                this._activeDate = this._adapter.addCalendarDays(this._activeDate, -7);
                break;
            case DOWN_ARROW:
                this._activeDate = this._adapter.addCalendarDays(this._activeDate, 7);
                break;
            case HOME:
                this._activeDate = this._adapter.addCalendarDays(this._activeDate, 1 - this._adapter.getDate(this._activeDate));
                break;
            case END:
                this._activeDate = this._adapter.addCalendarDays(this._activeDate, this._adapter.getNumDaysInMonth(this._activeDate) -
                    this._adapter.getDate(this._activeDate));
                break;
            case PAGE_UP:
                this._activeDate = event.altKey
                    ? this._adapter.addCalendarYears(this._activeDate, -1)
                    : this._adapter.addCalendarMonths(this._activeDate, -1);
                break;
            case PAGE_DOWN:
                this._activeDate = event.altKey
                    ? this._adapter.addCalendarYears(this._activeDate, 1)
                    : this._adapter.addCalendarMonths(this._activeDate, 1);
                break;
            case ENTER:
                if (this._dateFilterForViews(this._activeDate)) {
                    this._dateSelected(this._activeDate);
                    // Prevent unexpected default actions such as form submission.
                    event.preventDefault();
                }
                return;
            default:
                // Don't prevent default or focus active cell on keys that we don't explicitly handle.
                return;
        }
        // Prevent unexpected default actions such as form submission.
        event.preventDefault();
    }
    /** Handles keydown events on the calendar body when calendar is in year view. */
    _handleCalendarBodyKeydownInYearView(event) {
        switch (event.keyCode) {
            case LEFT_ARROW:
                this._activeDate = this._adapter.addCalendarMonths(this._activeDate, -1);
                break;
            case RIGHT_ARROW:
                this._activeDate = this._adapter.addCalendarMonths(this._activeDate, 1);
                break;
            case UP_ARROW:
                this._activeDate = this._prevMonthInSameCol(this._activeDate);
                break;
            case DOWN_ARROW:
                this._activeDate = this._nextMonthInSameCol(this._activeDate);
                break;
            case HOME:
                this._activeDate = this._adapter.addCalendarMonths(this._activeDate, -this._adapter.getMonth(this._activeDate));
                break;
            case END:
                this._activeDate = this._adapter.addCalendarMonths(this._activeDate, 11 - this._adapter.getMonth(this._activeDate));
                break;
            case PAGE_UP:
                this._activeDate = this._adapter.addCalendarYears(this._activeDate, event.altKey ? -10 : -1);
                break;
            case PAGE_DOWN:
                this._activeDate = this._adapter.addCalendarYears(this._activeDate, event.altKey ? 10 : 1);
                break;
            case ENTER:
                this._monthSelected(this._activeDate);
                break;
            default:
                // Don't prevent default or focus active cell on keys that we don't explicitly handle.
                return;
        }
        // Prevent unexpected default actions such as form submission.
        event.preventDefault();
    }
    /** Handles keydown events on the calendar body when calendar is in multi-year view. */
    _handleCalendarBodyKeydownInMultiYearView(event) {
        switch (event.keyCode) {
            case LEFT_ARROW:
                this._activeDate = this._adapter.addCalendarYears(this._activeDate, -1);
                break;
            case RIGHT_ARROW:
                this._activeDate = this._adapter.addCalendarYears(this._activeDate, 1);
                break;
            case UP_ARROW:
                this._activeDate = this._adapter.addCalendarYears(this._activeDate, -yearsPerRow);
                break;
            case DOWN_ARROW:
                this._activeDate = this._adapter.addCalendarYears(this._activeDate, yearsPerRow);
                break;
            case HOME:
                this._activeDate = this._adapter.addCalendarYears(this._activeDate, -getActiveOffset(this._adapter, this._activeDate, this.minDate, this.maxDate));
                break;
            case END:
                this._activeDate = this._adapter.addCalendarYears(this._activeDate, yearsPerPage -
                    getActiveOffset(this._adapter, this._activeDate, this.minDate, this.maxDate) -
                    1);
                break;
            case PAGE_UP:
                this._activeDate = this._adapter.addCalendarYears(this._activeDate, event.altKey ? -yearsPerPage * 10 : -yearsPerPage);
                break;
            case PAGE_DOWN:
                this._activeDate = this._adapter.addCalendarYears(this._activeDate, event.altKey ? yearsPerPage * 10 : yearsPerPage);
                break;
            case ENTER:
                this._yearSelected(this._activeDate);
                break;
            default:
                // Don't prevent default or focus active cell on keys that we don't explicitly handle.
                return;
        }
    }
    /** Handles keydown events on the calendar body when calendar is in month view. */
    _handleCalendarBodyKeydownInClockView(event) {
        switch (event.keyCode) {
            case UP_ARROW:
                this._activeDate =
                    this._clockView === 'hour'
                        ? this._adapter.addCalendarHours(this._activeDate, 1)
                        : this._adapter.addCalendarMinutes(this._activeDate, this.timeInterval);
                break;
            case DOWN_ARROW:
                this._activeDate =
                    this._clockView === 'hour'
                        ? this._adapter.addCalendarHours(this._activeDate, -1)
                        : this._adapter.addCalendarMinutes(this._activeDate, -this.timeInterval);
                break;
            case ENTER:
                // TODO: Validate what this line does.
                if (this.timeInput !== 'dial') {
                    this._dialTimeSelected(this._activeDate);
                }
                return;
            default:
                // Don't prevent default or focus active cell on keys that we don't explicitly handle.
                return;
        }
        // Prevent unexpected default actions such as form submission.
        event.preventDefault();
    }
    /**
     * Determine the date for the month that comes before the given month in the same column in the
     * calendar table.
     */
    _prevMonthInSameCol(date) {
        // Determine how many months to jump forward given that there are 2 empty slots at the beginning
        // of each year.
        const increment = this._adapter.getMonth(date) <= 4 ? -5 : this._adapter.getMonth(date) >= 7 ? -7 : -12;
        return this._adapter.addCalendarMonths(date, increment);
    }
    /**
     * Determine the date for the month that comes after the given month in the same column in the
     * calendar table.
     */
    _nextMonthInSameCol(date) {
        // Determine how many months to jump forward given that there are 2 empty slots at the beginning
        // of each year.
        const increment = this._adapter.getMonth(date) <= 4 ? 7 : this._adapter.getMonth(date) >= 7 ? 5 : 12;
        return this._adapter.addCalendarMonths(date, increment);
    }
    calendarState(direction) {
        this._calendarState = direction;
    }
    _2digit(n) {
        return ('00' + n).slice(-2);
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxCalendar, deps: [{ token: i0.ElementRef }, { token: MtxDatetimepickerIntl }, { token: i0.NgZone }, { token: i1.DatetimeAdapter, optional: true }, { token: MTX_DATETIME_FORMATS, optional: true }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component }); }
    /** @nocollapse */ static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.0.1", type: MtxCalendar, isStandalone: true, selector: "mtx-calendar", inputs: { multiYearSelector: ["multiYearSelector", "multiYearSelector", booleanAttribute], twelvehour: ["twelvehour", "twelvehour", booleanAttribute], startView: "startView", timeInterval: "timeInterval", dateFilter: "dateFilter", preventSameDateTimeSelection: "preventSameDateTimeSelection", headerComponent: "headerComponent", type: "type", startAt: "startAt", timeInput: "timeInput", selected: "selected", minDate: "minDate", maxDate: "maxDate" }, outputs: { selectedChange: "selectedChange", viewChanged: "viewChanged", _userSelection: "_userSelection" }, host: { attributes: { "tabindex": "0" }, listeners: { "keydown": "_handleCalendarBodyKeydown($event)" }, properties: { "class.mtx-calendar-with-time-input": "timeInput === \"both\"", "class.mtx-calendar-with-time-input-only": "timeInput === \"input\" && type.endsWith(\"time\")" }, classAttribute: "mtx-calendar" }, exportAs: ["mtxCalendar"], ngImport: i0, template: "<div class=\"mtx-calendar-header\">\n  @if (_calendarHeaderPortal) {\n  <ng-template [cdkPortalOutlet]=\"_calendarHeaderPortal\"></ng-template>\n  } @else { @if (type !== 'time') {\n  <button\n    mat-button\n    type=\"button\"\n    class=\"mtx-calendar-header-year\"\n    [class.active]=\"currentView === 'year' || currentView === 'multi-year'\"\n    [attr.aria-label]=\"_yearButtonLabel\"\n    (click)=\"_yearClicked()\"\n  >\n    <span>{{ _yearButtonText }}</span>\n    @if (multiYearSelector || type === 'year') {\n    <svg\n      class=\"mtx-calendar-header-year-dropdown\"\n      matButtonIcon\n      iconPositionEnd\n      width=\"24\"\n      height=\"24\"\n      viewBox=\"0 0 24 24\"\n      fill=\"currentColor\"\n    >\n      <path d=\"M7,10L12,15L17,10H7Z\" />\n    </svg>\n    }\n  </button>\n  } @if (type !== 'year') {\n  <div class=\"mtx-calendar-header-date-time\">\n    @if (type !== 'time') {\n    <button\n      mat-button\n      type=\"button\"\n      class=\"mtx-calendar-header-date\"\n      [class.active]=\"currentView === 'month'\"\n      [class.not-clickable]=\"type === 'month'\"\n      [attr.aria-label]=\"_dateButtonLabel\"\n      (click)=\"_dateClicked()\"\n    >\n      {{ _dateButtonText }}\n    </button>\n    } @if (type.endsWith('time')) {\n    <span class=\"mtx-calendar-header-time\" [class.active]=\"currentView === 'clock'\">\n      <span class=\"mtx-calendar-header-hour-minute-container\">\n        <button\n          mat-button\n          type=\"button\"\n          class=\"mtx-calendar-header-hours\"\n          [class.active]=\"_clockView === 'hour'\"\n          [attr.aria-label]=\"_hourButtonLabel\"\n          (click)=\"_hoursClicked()\"\n        >\n          {{ _hoursButtonText }}\n        </button>\n        <span class=\"mtx-calendar-header-hour-minute-separator\">:</span>\n        <button\n          mat-button\n          type=\"button\"\n          class=\"mtx-calendar-header-minutes\"\n          [class.active]=\"_clockView === 'minute'\"\n          [attr.aria-label]=\"_minuteButtonLabel\"\n          (click)=\"_minutesClicked()\"\n        >\n          {{ _minutesButtonText }}\n        </button>\n      </span>\n      @if (twelvehour) {\n      <span class=\"mtx-calendar-header-ampm-container\">\n        <button\n          mat-button\n          type=\"button\"\n          class=\"mtx-calendar-header-ampm\"\n          [class.active]=\"_AMPM === 'AM'\"\n          aria-label=\"AM\"\n          (click)=\"_ampmClicked('AM')\"\n        >\n          AM\n        </button>\n        <button\n          mat-button\n          type=\"button\"\n          class=\"mtx-calendar-header-ampm\"\n          [class.active]=\"_AMPM === 'PM'\"\n          aria-label=\"PM\"\n          (click)=\"_ampmClicked('PM')\"\n        >\n          PM\n        </button>\n      </span>\n      }\n    </span>\n    }\n  </div>\n  } }\n</div>\n\n<div\n  class=\"mtx-calendar-content\"\n  [class.mtx-calendar-inline-input-content]=\"timeInput === 'input' && type.endsWith('time')\"\n>\n  @if (currentView === 'month' || currentView === 'year' || currentView === 'multi-year') {\n  <div class=\"mtx-month-content\">\n    <div class=\"mtx-calendar-controls\">\n      <button\n        mat-icon-button\n        type=\"button\"\n        class=\"mtx-calendar-previous-button\"\n        [class.disabled]=\"!_previousEnabled()\"\n        [attr.aria-disabled]=\"!_previousEnabled()\"\n        [attr.aria-label]=\"_prevButtonLabel\"\n        (click)=\"_previousClicked()\"\n      >\n        <svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\">\n          <path d=\"M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z\" />\n        </svg>\n      </button>\n      <div\n        class=\"mtx-calendar-period-button\"\n        [@slideCalendar]=\"_calendarState\"\n        (@slideCalendar.done)=\"_calendarStateDone()\"\n      >\n        <strong>{{ _yearPeriodText }}</strong>\n      </div>\n      <button\n        mat-icon-button\n        type=\"button\"\n        class=\"mtx-calendar-next-button\"\n        [class.disabled]=\"!_nextEnabled()\"\n        [attr.aria-disabled]=\"!_nextEnabled()\"\n        [attr.aria-label]=\"_nextButtonLabel\"\n        (click)=\"_nextClicked()\"\n      >\n        <svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\">\n          <path d=\"M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z\" />\n        </svg>\n      </button>\n    </div>\n  </div>\n  } @switch (currentView) { @case ('month') {\n  <mtx-month-view\n    (_userSelection)=\"_userSelected()\"\n    (selectedChange)=\"_dateSelected($event)\"\n    [activeDate]=\"_activeDate\"\n    [dateFilter]=\"_dateFilterForViews\"\n    [selected]=\"selected!\"\n    [type]=\"type\"\n  >\n  </mtx-month-view>\n  @if(timeInput === \"input\" && type.endsWith(\"time\")) {\n  <mtx-time\n    style=\"position: absolute; bottom: 8px; right: 8px; width: 100%\"\n    (_userSelection)=\"_userSelected()\"\n    (activeDateChange)=\"_onActiveDateChange($event)\"\n    (selectedChange)=\"_timeSelected($event)\"\n    [timeInput]=\"timeInput\"\n    [AMPM]=\"_AMPM\"\n    (ampmChange)=\"_ampmClicked($event)\"\n    [clockView]=\"_clockView\"\n    (clockViewChange)=\"_clockView = $event\"\n    [twelvehour]=\"twelvehour\"\n    [dateFilter]=\"dateFilter\"\n    [interval]=\"timeInterval\"\n    [maxDate]=\"maxDate\"\n    [minDate]=\"minDate\"\n    [selected]=\"_activeDate\"\n  >\n  </mtx-time>\n  } } @case ('year') {\n  <mtx-year-view\n    (_userSelection)=\"_userSelected()\"\n    (selectedChange)=\"_monthSelected($event)\"\n    [activeDate]=\"_activeDate\"\n    [dateFilter]=\"_dateFilterForViews\"\n    [selected]=\"selected!\"\n    [type]=\"type\"\n  >\n  </mtx-year-view>\n  } @case ('multi-year') {\n  <mtx-multi-year-view\n    (_userSelection)=\"_userSelected()\"\n    (selectedChange)=\"_yearSelected($event)\"\n    [activeDate]=\"_activeDate\"\n    [dateFilter]=\"_dateFilterForViews\"\n    [maxDate]=\"maxDate\"\n    [minDate]=\"minDate\"\n    [selected]=\"selected!\"\n    [type]=\"type\"\n  >\n  </mtx-multi-year-view>\n  } @default { @if (timeInput === \"both\") {\n  <mtx-time\n    (_userSelection)=\"_userSelected()\"\n    (activeDateChange)=\"_onActiveDateChange($event)\"\n    (selectedChange)=\"_timeSelected($event)\"\n    [AMPM]=\"_AMPM\"\n    (ampmChange)=\"_ampmClicked($event)\"\n    [clockView]=\"_clockView\"\n    (clockViewChange)=\"_clockView = $event\"\n    [twelvehour]=\"twelvehour\"\n    [timeInput]=\"timeInput\"\n    [dateFilter]=\"dateFilter\"\n    [interval]=\"timeInterval\"\n    [maxDate]=\"maxDate\"\n    [minDate]=\"minDate\"\n    [selected]=\"_activeDate\"\n  >\n  </mtx-time>\n  } @else {\n  <mtx-clock\n    (_userSelection)=\"_userSelected()\"\n    (activeDateChange)=\"_onActiveDateChange($event)\"\n    (selectedChange)=\"_dialTimeSelected($event)\"\n    [AMPM]=\"_AMPM\"\n    [dateFilter]=\"dateFilter\"\n    [interval]=\"timeInterval\"\n    [maxDate]=\"maxDate\"\n    [minDate]=\"minDate\"\n    [selected]=\"_activeDate\"\n    [startView]=\"_clockView\"\n    [twelvehour]=\"twelvehour\"\n  >\n  </mtx-clock>\n  } } }\n</div>\n", styles: [".mtx-calendar{display:block;outline:none;font-family:var(--mtx-datetimepicker-calendar-text-font);font-size:var(--mtx-datetimepicker-calendar-text-size)}.mtx-calendar-header{box-sizing:border-box;padding:8px;border-bottom:1px solid var(--mtx-datetimepicker-calendar-header-divider-color);border-top-left-radius:var(--mtx-datetimepicker-container-shape);border-top-right-radius:var(--mtx-datetimepicker-container-shape);background-color:var(--mtx-datetimepicker-calendar-header-background-color);color:var(--mtx-datetimepicker-calendar-header-text-color);--mdc-text-button-container-shape: var(--mtx-datetimepicker-selector-container-shape)}.mtx-calendar-header .mtx-calendar-header-year,.mtx-calendar-header .mtx-calendar-header-date,.mtx-calendar-header .mtx-calendar-header-hours,.mtx-calendar-header .mtx-calendar-header-minutes,.mtx-calendar-header .mtx-calendar-header-ampm{height:auto;min-width:auto;padding:0 4px;text-align:inherit;line-height:inherit;color:inherit;font-size:inherit;font-weight:inherit;letter-spacing:normal;white-space:normal;word-break:break-word}.mtx-calendar-header .mtx-calendar-header-year .mat-mdc-button-touch-target,.mtx-calendar-header .mtx-calendar-header-date .mat-mdc-button-touch-target,.mtx-calendar-header .mtx-calendar-header-hours .mat-mdc-button-touch-target,.mtx-calendar-header .mtx-calendar-header-minutes .mat-mdc-button-touch-target,.mtx-calendar-header .mtx-calendar-header-ampm .mat-mdc-button-touch-target{height:100%}.mtx-calendar-header .mtx-calendar-header-year{line-height:24px}.mtx-calendar-header-date-time{font-size:24px;line-height:36px}.mtx-calendar-header-year:not(.active),.mtx-calendar-header-date:not(.active),.mtx-calendar-header-hours:not(.active),.mtx-calendar-header-minutes:not(.active),.mtx-calendar-header-ampm:not(.active){opacity:.6}.mtx-calendar-header-year.not-clickable,.mtx-calendar-header-date.not-clickable,.mtx-calendar-header-hours.not-clickable,.mtx-calendar-header-minutes.not-clickable,.mtx-calendar-header-ampm.not-clickable{cursor:initial}.mtx-calendar-header-time{display:inline-flex}.mtx-calendar-header-time:not(.active){opacity:.6}.mtx-calendar-header-time:not(.active) .mtx-calendar-header-hours,.mtx-calendar-header-time:not(.active) .mtx-calendar-header-minutes,.mtx-calendar-header-time:not(.active) .mtx-calendar-header-ampm{opacity:1}.mtx-calendar-header-hour-minute-separator{display:inline-block;width:8px;text-align:center}.mtx-calendar-header-ampm-container{display:inline-flex;flex-direction:column;line-height:18px;font-size:12px}[mode=landscape] .mtx-calendar{display:flex}[mode=landscape] .mtx-calendar .mtx-calendar-header{width:144px;min-width:144px;padding:16px 8px;border-bottom-width:0;border-top-right-radius:0;border-bottom-right-radius:0;border-right:1px solid var(--mtx-datetimepicker-calendar-header-divider-color);border-top-left-radius:var(--mtx-datetimepicker-container-shape);border-bottom-left-radius:var(--mtx-datetimepicker-container-shape)}[dir=rtl] [mode=landscape] .mtx-calendar .mtx-calendar-header{border-top-left-radius:0;border-bottom-left-radius:0;border-right-width:0;border-left:1px solid var(--mtx-datetimepicker-calendar-header-divider-color);border-top-right-radius:var(--mtx-datetimepicker-container-shape);border-bottom-right-radius:var(--mtx-datetimepicker-container-shape)}[mode=landscape] .mtx-calendar .mtx-calendar-header-year+.mtx-calendar-header-date-time,[mode=landscape] .mtx-calendar .mtx-calendar-header-date+.mtx-calendar-header-time{margin-top:4px}[mode=landscape] .mtx-calendar .mtx-calendar-header-date-time{font-size:28px}[mode=landscape] .mtx-calendar .mtx-calendar-header-time{display:flex;flex-direction:column}[mode=landscape] .mtx-calendar .mtx-calendar-header-time .mtx-calendar-header-hours,[mode=landscape] .mtx-calendar .mtx-calendar-header-time .mtx-calendar-header-minutes,[mode=landscape] .mtx-calendar .mtx-calendar-header-time .mtx-calendar-header-ampm{width:40px;text-align:center}[mode=landscape] .mtx-calendar .mtx-calendar-header-ampm-container{flex-direction:row;font-size:20px}[mode=landscape] .mtx-calendar .mtx-calendar-header-ampm{padding:4px}[mode=landscape] .mtx-calendar .mtx-calendar-header-ampm+.mtx-calendar-header-ampm{margin:0 8px}@media all and (orientation: landscape){[mode=auto] .mtx-calendar{display:flex}[mode=auto] .mtx-calendar .mtx-calendar-header{width:144px;min-width:144px;padding:16px 8px;border-bottom-width:0;border-top-right-radius:0;border-bottom-right-radius:0;border-right:1px solid var(--mtx-datetimepicker-calendar-header-divider-color);border-top-left-radius:var(--mtx-datetimepicker-container-shape);border-bottom-left-radius:var(--mtx-datetimepicker-container-shape)}[dir=rtl] [mode=auto] .mtx-calendar .mtx-calendar-header{border-top-left-radius:0;border-bottom-left-radius:0;border-right-width:0;border-left:1px solid var(--mtx-datetimepicker-calendar-header-divider-color);border-top-right-radius:var(--mtx-datetimepicker-container-shape);border-bottom-right-radius:var(--mtx-datetimepicker-container-shape)}[mode=auto] .mtx-calendar .mtx-calendar-header-year+.mtx-calendar-header-date-time,[mode=auto] .mtx-calendar .mtx-calendar-header-date+.mtx-calendar-header-time{margin-top:4px}[mode=auto] .mtx-calendar .mtx-calendar-header-date-time{font-size:28px}[mode=auto] .mtx-calendar .mtx-calendar-header-time{display:flex;flex-direction:column}[mode=auto] .mtx-calendar .mtx-calendar-header-time .mtx-calendar-header-hours,[mode=auto] .mtx-calendar .mtx-calendar-header-time .mtx-calendar-header-minutes,[mode=auto] .mtx-calendar .mtx-calendar-header-time .mtx-calendar-header-ampm{width:40px;text-align:center}[mode=auto] .mtx-calendar .mtx-calendar-header-ampm-container{flex-direction:row;font-size:20px}[mode=auto] .mtx-calendar .mtx-calendar-header-ampm{padding:4px}[mode=auto] .mtx-calendar .mtx-calendar-header-ampm+.mtx-calendar-header-ampm{margin:0 8px}}.mtx-calendar-content{width:100%;padding:8px;outline:none;box-sizing:border-box;overflow:hidden;position:relative}@media all and (orientation: portrait){.mtx-calendar-inline-input-content{height:447px}}.mtx-calendar-controls{display:flex;align-items:center;justify-content:space-between;margin:0 calc(4.7142857143% - 16px)}.mtx-calendar-controls .mat-icon-button:hover .mat-button-focus-overlay{opacity:.04}.mtx-calendar-period-button{display:inline-block;height:40px;line-height:40px;outline:none;border:0;background:transparent;box-sizing:border-box;font-size:var(--mtx-datetimepicker-calendar-period-button-text-size);font-weight:var(--mtx-datetimepicker-calendar-period-button-text-weight)}.mtx-calendar-previous-button.disabled,.mtx-calendar-next-button.disabled{pointer-events:none;color:var(--mtx-datetimepicker-calendar-date-disabled-state-text-color)}.mtx-calendar-previous-button svg,.mtx-calendar-next-button svg{fill:currentColor;vertical-align:top}[dir=rtl] .mtx-calendar-previous-button svg,[dir=rtl] .mtx-calendar-next-button svg{transform:rotate(180deg)}.mtx-calendar-table{border-spacing:0;border-collapse:collapse;width:100%}.mtx-calendar-table-header th{text-align:center;padding:8px 0;color:var(--mtx-datetimepicker-calendar-table-header-text-color);font-size:var(--mtx-datetimepicker-calendar-table-header-text-size);font-weight:var(--mtx-datetimepicker-calendar-table-header-text-weight)}\n"], dependencies: [{ kind: "directive", type: CdkPortalOutlet, selector: "[cdkPortalOutlet]", inputs: ["cdkPortalOutlet"], outputs: ["attached"], exportAs: ["cdkPortalOutlet"] }, { kind: "component", type: MatButton, selector: "    button[mat-button], button[mat-raised-button], button[mat-flat-button],    button[mat-stroked-button]  ", exportAs: ["matButton"] }, { kind: "component", type: MatIconButton, selector: "button[mat-icon-button]", exportAs: ["matButton"] }, { kind: "component", type: MtxMonthView, selector: "mtx-month-view", inputs: ["type", "dateFilter", "activeDate", "selected"], outputs: ["selectedChange", "_userSelection"], exportAs: ["mtxMonthView"] }, { kind: "component", type: MtxYearView, selector: "mtx-year-view", inputs: ["type", "dateFilter", "activeDate", "selected"], outputs: ["selectedChange", "_userSelection"], exportAs: ["mtxYearView"] }, { kind: "component", type: MtxMultiYearView, selector: "mtx-multi-year-view", inputs: ["type", "dateFilter", "activeDate", "selected", "minDate", "maxDate"], outputs: ["selectedChange", "_userSelection"], exportAs: ["mtxMultiYearView"] }, { kind: "component", type: MtxTime, selector: "mtx-time", inputs: ["dateFilter", "interval", "twelvehour", "AMPM", "timeInput", "activeDate", "selected", "minDate", "maxDate", "clockView"], outputs: ["selectedChange", "activeDateChange", "_userSelection", "ampmChange", "clockViewChange"], exportAs: ["mtxTime"] }, { kind: "component", type: MtxClock, selector: "mtx-clock", inputs: ["dateFilter", "interval", "twelvehour", "AMPM", "activeDate", "selected", "minDate", "maxDate", "startView"], outputs: ["selectedChange", "activeDateChange", "_userSelection"], exportAs: ["mtxClock"] }], animations: [mtxDatetimepickerAnimations.slideCalendar], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxCalendar, decorators: [{
            type: Component,
            args: [{ selector: 'mtx-calendar', host: {
                        'class': 'mtx-calendar',
                        '[class.mtx-calendar-with-time-input]': 'timeInput === "both"',
                        '[class.mtx-calendar-with-time-input-only]': 'timeInput === "input" && type.endsWith("time")',
                        'tabindex': '0',
                        '(keydown)': '_handleCalendarBodyKeydown($event)',
                    }, exportAs: 'mtxCalendar', animations: [mtxDatetimepickerAnimations.slideCalendar], encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, standalone: true, imports: [
                        CdkPortalOutlet,
                        MatButton,
                        MatIconButton,
                        MtxMonthView,
                        MtxYearView,
                        MtxMultiYearView,
                        MtxTime,
                        MtxClock,
                    ], template: "<div class=\"mtx-calendar-header\">\n  @if (_calendarHeaderPortal) {\n  <ng-template [cdkPortalOutlet]=\"_calendarHeaderPortal\"></ng-template>\n  } @else { @if (type !== 'time') {\n  <button\n    mat-button\n    type=\"button\"\n    class=\"mtx-calendar-header-year\"\n    [class.active]=\"currentView === 'year' || currentView === 'multi-year'\"\n    [attr.aria-label]=\"_yearButtonLabel\"\n    (click)=\"_yearClicked()\"\n  >\n    <span>{{ _yearButtonText }}</span>\n    @if (multiYearSelector || type === 'year') {\n    <svg\n      class=\"mtx-calendar-header-year-dropdown\"\n      matButtonIcon\n      iconPositionEnd\n      width=\"24\"\n      height=\"24\"\n      viewBox=\"0 0 24 24\"\n      fill=\"currentColor\"\n    >\n      <path d=\"M7,10L12,15L17,10H7Z\" />\n    </svg>\n    }\n  </button>\n  } @if (type !== 'year') {\n  <div class=\"mtx-calendar-header-date-time\">\n    @if (type !== 'time') {\n    <button\n      mat-button\n      type=\"button\"\n      class=\"mtx-calendar-header-date\"\n      [class.active]=\"currentView === 'month'\"\n      [class.not-clickable]=\"type === 'month'\"\n      [attr.aria-label]=\"_dateButtonLabel\"\n      (click)=\"_dateClicked()\"\n    >\n      {{ _dateButtonText }}\n    </button>\n    } @if (type.endsWith('time')) {\n    <span class=\"mtx-calendar-header-time\" [class.active]=\"currentView === 'clock'\">\n      <span class=\"mtx-calendar-header-hour-minute-container\">\n        <button\n          mat-button\n          type=\"button\"\n          class=\"mtx-calendar-header-hours\"\n          [class.active]=\"_clockView === 'hour'\"\n          [attr.aria-label]=\"_hourButtonLabel\"\n          (click)=\"_hoursClicked()\"\n        >\n          {{ _hoursButtonText }}\n        </button>\n        <span class=\"mtx-calendar-header-hour-minute-separator\">:</span>\n        <button\n          mat-button\n          type=\"button\"\n          class=\"mtx-calendar-header-minutes\"\n          [class.active]=\"_clockView === 'minute'\"\n          [attr.aria-label]=\"_minuteButtonLabel\"\n          (click)=\"_minutesClicked()\"\n        >\n          {{ _minutesButtonText }}\n        </button>\n      </span>\n      @if (twelvehour) {\n      <span class=\"mtx-calendar-header-ampm-container\">\n        <button\n          mat-button\n          type=\"button\"\n          class=\"mtx-calendar-header-ampm\"\n          [class.active]=\"_AMPM === 'AM'\"\n          aria-label=\"AM\"\n          (click)=\"_ampmClicked('AM')\"\n        >\n          AM\n        </button>\n        <button\n          mat-button\n          type=\"button\"\n          class=\"mtx-calendar-header-ampm\"\n          [class.active]=\"_AMPM === 'PM'\"\n          aria-label=\"PM\"\n          (click)=\"_ampmClicked('PM')\"\n        >\n          PM\n        </button>\n      </span>\n      }\n    </span>\n    }\n  </div>\n  } }\n</div>\n\n<div\n  class=\"mtx-calendar-content\"\n  [class.mtx-calendar-inline-input-content]=\"timeInput === 'input' && type.endsWith('time')\"\n>\n  @if (currentView === 'month' || currentView === 'year' || currentView === 'multi-year') {\n  <div class=\"mtx-month-content\">\n    <div class=\"mtx-calendar-controls\">\n      <button\n        mat-icon-button\n        type=\"button\"\n        class=\"mtx-calendar-previous-button\"\n        [class.disabled]=\"!_previousEnabled()\"\n        [attr.aria-disabled]=\"!_previousEnabled()\"\n        [attr.aria-label]=\"_prevButtonLabel\"\n        (click)=\"_previousClicked()\"\n      >\n        <svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\">\n          <path d=\"M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z\" />\n        </svg>\n      </button>\n      <div\n        class=\"mtx-calendar-period-button\"\n        [@slideCalendar]=\"_calendarState\"\n        (@slideCalendar.done)=\"_calendarStateDone()\"\n      >\n        <strong>{{ _yearPeriodText }}</strong>\n      </div>\n      <button\n        mat-icon-button\n        type=\"button\"\n        class=\"mtx-calendar-next-button\"\n        [class.disabled]=\"!_nextEnabled()\"\n        [attr.aria-disabled]=\"!_nextEnabled()\"\n        [attr.aria-label]=\"_nextButtonLabel\"\n        (click)=\"_nextClicked()\"\n      >\n        <svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\">\n          <path d=\"M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z\" />\n        </svg>\n      </button>\n    </div>\n  </div>\n  } @switch (currentView) { @case ('month') {\n  <mtx-month-view\n    (_userSelection)=\"_userSelected()\"\n    (selectedChange)=\"_dateSelected($event)\"\n    [activeDate]=\"_activeDate\"\n    [dateFilter]=\"_dateFilterForViews\"\n    [selected]=\"selected!\"\n    [type]=\"type\"\n  >\n  </mtx-month-view>\n  @if(timeInput === \"input\" && type.endsWith(\"time\")) {\n  <mtx-time\n    style=\"position: absolute; bottom: 8px; right: 8px; width: 100%\"\n    (_userSelection)=\"_userSelected()\"\n    (activeDateChange)=\"_onActiveDateChange($event)\"\n    (selectedChange)=\"_timeSelected($event)\"\n    [timeInput]=\"timeInput\"\n    [AMPM]=\"_AMPM\"\n    (ampmChange)=\"_ampmClicked($event)\"\n    [clockView]=\"_clockView\"\n    (clockViewChange)=\"_clockView = $event\"\n    [twelvehour]=\"twelvehour\"\n    [dateFilter]=\"dateFilter\"\n    [interval]=\"timeInterval\"\n    [maxDate]=\"maxDate\"\n    [minDate]=\"minDate\"\n    [selected]=\"_activeDate\"\n  >\n  </mtx-time>\n  } } @case ('year') {\n  <mtx-year-view\n    (_userSelection)=\"_userSelected()\"\n    (selectedChange)=\"_monthSelected($event)\"\n    [activeDate]=\"_activeDate\"\n    [dateFilter]=\"_dateFilterForViews\"\n    [selected]=\"selected!\"\n    [type]=\"type\"\n  >\n  </mtx-year-view>\n  } @case ('multi-year') {\n  <mtx-multi-year-view\n    (_userSelection)=\"_userSelected()\"\n    (selectedChange)=\"_yearSelected($event)\"\n    [activeDate]=\"_activeDate\"\n    [dateFilter]=\"_dateFilterForViews\"\n    [maxDate]=\"maxDate\"\n    [minDate]=\"minDate\"\n    [selected]=\"selected!\"\n    [type]=\"type\"\n  >\n  </mtx-multi-year-view>\n  } @default { @if (timeInput === \"both\") {\n  <mtx-time\n    (_userSelection)=\"_userSelected()\"\n    (activeDateChange)=\"_onActiveDateChange($event)\"\n    (selectedChange)=\"_timeSelected($event)\"\n    [AMPM]=\"_AMPM\"\n    (ampmChange)=\"_ampmClicked($event)\"\n    [clockView]=\"_clockView\"\n    (clockViewChange)=\"_clockView = $event\"\n    [twelvehour]=\"twelvehour\"\n    [timeInput]=\"timeInput\"\n    [dateFilter]=\"dateFilter\"\n    [interval]=\"timeInterval\"\n    [maxDate]=\"maxDate\"\n    [minDate]=\"minDate\"\n    [selected]=\"_activeDate\"\n  >\n  </mtx-time>\n  } @else {\n  <mtx-clock\n    (_userSelection)=\"_userSelected()\"\n    (activeDateChange)=\"_onActiveDateChange($event)\"\n    (selectedChange)=\"_dialTimeSelected($event)\"\n    [AMPM]=\"_AMPM\"\n    [dateFilter]=\"dateFilter\"\n    [interval]=\"timeInterval\"\n    [maxDate]=\"maxDate\"\n    [minDate]=\"minDate\"\n    [selected]=\"_activeDate\"\n    [startView]=\"_clockView\"\n    [twelvehour]=\"twelvehour\"\n  >\n  </mtx-clock>\n  } } }\n</div>\n", styles: [".mtx-calendar{display:block;outline:none;font-family:var(--mtx-datetimepicker-calendar-text-font);font-size:var(--mtx-datetimepicker-calendar-text-size)}.mtx-calendar-header{box-sizing:border-box;padding:8px;border-bottom:1px solid var(--mtx-datetimepicker-calendar-header-divider-color);border-top-left-radius:var(--mtx-datetimepicker-container-shape);border-top-right-radius:var(--mtx-datetimepicker-container-shape);background-color:var(--mtx-datetimepicker-calendar-header-background-color);color:var(--mtx-datetimepicker-calendar-header-text-color);--mdc-text-button-container-shape: var(--mtx-datetimepicker-selector-container-shape)}.mtx-calendar-header .mtx-calendar-header-year,.mtx-calendar-header .mtx-calendar-header-date,.mtx-calendar-header .mtx-calendar-header-hours,.mtx-calendar-header .mtx-calendar-header-minutes,.mtx-calendar-header .mtx-calendar-header-ampm{height:auto;min-width:auto;padding:0 4px;text-align:inherit;line-height:inherit;color:inherit;font-size:inherit;font-weight:inherit;letter-spacing:normal;white-space:normal;word-break:break-word}.mtx-calendar-header .mtx-calendar-header-year .mat-mdc-button-touch-target,.mtx-calendar-header .mtx-calendar-header-date .mat-mdc-button-touch-target,.mtx-calendar-header .mtx-calendar-header-hours .mat-mdc-button-touch-target,.mtx-calendar-header .mtx-calendar-header-minutes .mat-mdc-button-touch-target,.mtx-calendar-header .mtx-calendar-header-ampm .mat-mdc-button-touch-target{height:100%}.mtx-calendar-header .mtx-calendar-header-year{line-height:24px}.mtx-calendar-header-date-time{font-size:24px;line-height:36px}.mtx-calendar-header-year:not(.active),.mtx-calendar-header-date:not(.active),.mtx-calendar-header-hours:not(.active),.mtx-calendar-header-minutes:not(.active),.mtx-calendar-header-ampm:not(.active){opacity:.6}.mtx-calendar-header-year.not-clickable,.mtx-calendar-header-date.not-clickable,.mtx-calendar-header-hours.not-clickable,.mtx-calendar-header-minutes.not-clickable,.mtx-calendar-header-ampm.not-clickable{cursor:initial}.mtx-calendar-header-time{display:inline-flex}.mtx-calendar-header-time:not(.active){opacity:.6}.mtx-calendar-header-time:not(.active) .mtx-calendar-header-hours,.mtx-calendar-header-time:not(.active) .mtx-calendar-header-minutes,.mtx-calendar-header-time:not(.active) .mtx-calendar-header-ampm{opacity:1}.mtx-calendar-header-hour-minute-separator{display:inline-block;width:8px;text-align:center}.mtx-calendar-header-ampm-container{display:inline-flex;flex-direction:column;line-height:18px;font-size:12px}[mode=landscape] .mtx-calendar{display:flex}[mode=landscape] .mtx-calendar .mtx-calendar-header{width:144px;min-width:144px;padding:16px 8px;border-bottom-width:0;border-top-right-radius:0;border-bottom-right-radius:0;border-right:1px solid var(--mtx-datetimepicker-calendar-header-divider-color);border-top-left-radius:var(--mtx-datetimepicker-container-shape);border-bottom-left-radius:var(--mtx-datetimepicker-container-shape)}[dir=rtl] [mode=landscape] .mtx-calendar .mtx-calendar-header{border-top-left-radius:0;border-bottom-left-radius:0;border-right-width:0;border-left:1px solid var(--mtx-datetimepicker-calendar-header-divider-color);border-top-right-radius:var(--mtx-datetimepicker-container-shape);border-bottom-right-radius:var(--mtx-datetimepicker-container-shape)}[mode=landscape] .mtx-calendar .mtx-calendar-header-year+.mtx-calendar-header-date-time,[mode=landscape] .mtx-calendar .mtx-calendar-header-date+.mtx-calendar-header-time{margin-top:4px}[mode=landscape] .mtx-calendar .mtx-calendar-header-date-time{font-size:28px}[mode=landscape] .mtx-calendar .mtx-calendar-header-time{display:flex;flex-direction:column}[mode=landscape] .mtx-calendar .mtx-calendar-header-time .mtx-calendar-header-hours,[mode=landscape] .mtx-calendar .mtx-calendar-header-time .mtx-calendar-header-minutes,[mode=landscape] .mtx-calendar .mtx-calendar-header-time .mtx-calendar-header-ampm{width:40px;text-align:center}[mode=landscape] .mtx-calendar .mtx-calendar-header-ampm-container{flex-direction:row;font-size:20px}[mode=landscape] .mtx-calendar .mtx-calendar-header-ampm{padding:4px}[mode=landscape] .mtx-calendar .mtx-calendar-header-ampm+.mtx-calendar-header-ampm{margin:0 8px}@media all and (orientation: landscape){[mode=auto] .mtx-calendar{display:flex}[mode=auto] .mtx-calendar .mtx-calendar-header{width:144px;min-width:144px;padding:16px 8px;border-bottom-width:0;border-top-right-radius:0;border-bottom-right-radius:0;border-right:1px solid var(--mtx-datetimepicker-calendar-header-divider-color);border-top-left-radius:var(--mtx-datetimepicker-container-shape);border-bottom-left-radius:var(--mtx-datetimepicker-container-shape)}[dir=rtl] [mode=auto] .mtx-calendar .mtx-calendar-header{border-top-left-radius:0;border-bottom-left-radius:0;border-right-width:0;border-left:1px solid var(--mtx-datetimepicker-calendar-header-divider-color);border-top-right-radius:var(--mtx-datetimepicker-container-shape);border-bottom-right-radius:var(--mtx-datetimepicker-container-shape)}[mode=auto] .mtx-calendar .mtx-calendar-header-year+.mtx-calendar-header-date-time,[mode=auto] .mtx-calendar .mtx-calendar-header-date+.mtx-calendar-header-time{margin-top:4px}[mode=auto] .mtx-calendar .mtx-calendar-header-date-time{font-size:28px}[mode=auto] .mtx-calendar .mtx-calendar-header-time{display:flex;flex-direction:column}[mode=auto] .mtx-calendar .mtx-calendar-header-time .mtx-calendar-header-hours,[mode=auto] .mtx-calendar .mtx-calendar-header-time .mtx-calendar-header-minutes,[mode=auto] .mtx-calendar .mtx-calendar-header-time .mtx-calendar-header-ampm{width:40px;text-align:center}[mode=auto] .mtx-calendar .mtx-calendar-header-ampm-container{flex-direction:row;font-size:20px}[mode=auto] .mtx-calendar .mtx-calendar-header-ampm{padding:4px}[mode=auto] .mtx-calendar .mtx-calendar-header-ampm+.mtx-calendar-header-ampm{margin:0 8px}}.mtx-calendar-content{width:100%;padding:8px;outline:none;box-sizing:border-box;overflow:hidden;position:relative}@media all and (orientation: portrait){.mtx-calendar-inline-input-content{height:447px}}.mtx-calendar-controls{display:flex;align-items:center;justify-content:space-between;margin:0 calc(4.7142857143% - 16px)}.mtx-calendar-controls .mat-icon-button:hover .mat-button-focus-overlay{opacity:.04}.mtx-calendar-period-button{display:inline-block;height:40px;line-height:40px;outline:none;border:0;background:transparent;box-sizing:border-box;font-size:var(--mtx-datetimepicker-calendar-period-button-text-size);font-weight:var(--mtx-datetimepicker-calendar-period-button-text-weight)}.mtx-calendar-previous-button.disabled,.mtx-calendar-next-button.disabled{pointer-events:none;color:var(--mtx-datetimepicker-calendar-date-disabled-state-text-color)}.mtx-calendar-previous-button svg,.mtx-calendar-next-button svg{fill:currentColor;vertical-align:top}[dir=rtl] .mtx-calendar-previous-button svg,[dir=rtl] .mtx-calendar-next-button svg{transform:rotate(180deg)}.mtx-calendar-table{border-spacing:0;border-collapse:collapse;width:100%}.mtx-calendar-table-header th{text-align:center;padding:8px 0;color:var(--mtx-datetimepicker-calendar-table-header-text-color);font-size:var(--mtx-datetimepicker-calendar-table-header-text-size);font-weight:var(--mtx-datetimepicker-calendar-table-header-text-weight)}\n"] }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: MtxDatetimepickerIntl }, { type: i0.NgZone }, { type: i1.DatetimeAdapter, decorators: [{
                    type: Optional
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MTX_DATETIME_FORMATS]
                }] }, { type: i0.ChangeDetectorRef }], propDecorators: { multiYearSelector: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], twelvehour: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], startView: [{
                type: Input
            }], timeInterval: [{
                type: Input
            }], dateFilter: [{
                type: Input
            }], preventSameDateTimeSelection: [{
                type: Input
            }], headerComponent: [{
                type: Input
            }], selectedChange: [{
                type: Output
            }], viewChanged: [{
                type: Output
            }], _userSelection: [{
                type: Output
            }], type: [{
                type: Input
            }], startAt: [{
                type: Input
            }], timeInput: [{
                type: Input
            }], selected: [{
                type: Input
            }], minDate: [{
                type: Input
            }], maxDate: [{
                type: Input
            }] } });

/** Used to generate a unique ID for each datetimepicker instance. */
let datetimepickerUid = 0;
/** Injection token that determines the scroll handling while the calendar is open. */
const MTX_DATETIMEPICKER_SCROLL_STRATEGY = new InjectionToken('mtx-datetimepicker-scroll-strategy', {
    providedIn: 'root',
    factory: () => {
        const overlay = inject(Overlay);
        return () => overlay.scrollStrategies.reposition();
    },
});
function MTX_DATETIMEPICKER_SCROLL_STRATEGY_FACTORY(overlay) {
    return () => overlay.scrollStrategies.reposition();
}
const MTX_DATETIMEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER = {
    provide: MTX_DATETIMEPICKER_SCROLL_STRATEGY,
    deps: [Overlay],
    useFactory: MTX_DATETIMEPICKER_SCROLL_STRATEGY_FACTORY,
};
/**
 * Component used as the content for the datetimepicker dialog and popup. We use this instead of
 * using MtxCalendar directly as the content so we can control the initial focus. This also gives us
 * a place to put additional features of the popup that are not part of the calendar itself in the
 * future. (e.g. confirmation buttons).
 * @docs-private
 */
class MtxDatetimepickerContent {
    constructor(_changeDetectorRef) {
        this._changeDetectorRef = _changeDetectorRef;
        /** Emits when an animation has finished. */
        this._animationDone = new Subject();
        /** Id of the label for the `role="dialog"` element. */
        this._dialogLabelId = null;
    }
    ngOnInit() {
        this._animationState = this.datetimepicker.touchUi ? 'enter-dialog' : 'enter-dropdown';
    }
    ngAfterContentInit() {
        this._calendar._focusActiveCell();
    }
    _startExitAnimation() {
        this._animationState = 'void';
        this._changeDetectorRef.markForCheck();
    }
    ngOnDestroy() {
        this._animationDone.complete();
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxDatetimepickerContent, deps: [{ token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component }); }
    /** @nocollapse */ static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.0.1", type: MtxDatetimepickerContent, isStandalone: true, selector: "mtx-datetimepicker-content", inputs: { color: "color" }, host: { listeners: { "@transformPanel.done": "_animationDone.next()" }, properties: { "class": "color ? \"mat-\" + color : \"\"", "class.mtx-datetimepicker-content-touch": "datetimepicker?.touchUi", "attr.mode": "datetimepicker.mode", "@transformPanel": "_animationState" }, classAttribute: "mtx-datetimepicker-content" }, viewQueries: [{ propertyName: "_calendar", first: true, predicate: MtxCalendar, descendants: true, static: true }], ngImport: i0, template: "<div cdkTrapFocus\n     role=\"dialog\"\n     [attr.aria-modal]=\"true\"\n     [attr.aria-labelledby]=\"_dialogLabelId ?? undefined\"\n     [attr.mode]=\"datetimepicker.mode\"\n     class=\"mtx-datetimepicker-content-container\">\n  <mtx-calendar [id]=\"datetimepicker.id\"\n                [class]=\"datetimepicker.panelClass\"\n                [attr.mode]=\"datetimepicker.mode\"\n                [type]=\"datetimepicker.type\"\n                [startAt]=\"datetimepicker.startAt\"\n                [startView]=\"datetimepicker.startView\"\n                [maxDate]=\"datetimepicker._maxDate\"\n                [minDate]=\"datetimepicker._minDate\"\n                [dateFilter]=\"datetimepicker._dateFilter\"\n                [multiYearSelector]=\"datetimepicker.multiYearSelector\"\n                [preventSameDateTimeSelection]=\"datetimepicker.preventSameDateTimeSelection\"\n                [headerComponent]=\"datetimepicker.calendarHeaderComponent\"\n                [timeInterval]=\"datetimepicker.timeInterval\"\n                [twelvehour]=\"datetimepicker.twelvehour\"\n                [selected]=\"datetimepicker._selected\"\n                [timeInput]=\"datetimepicker.timeInput\"\n                (selectedChange)=\"datetimepicker._select($event)\"\n                (viewChanged)=\"datetimepicker._viewChanged($event)\"\n                (_userSelection)=\"datetimepicker.close()\"\n                [@fadeInCalendar]=\"'enter'\">\n  </mtx-calendar>\n</div>\n", styles: [".mtx-datetimepicker-content{display:block;border-radius:var(--mtx-datetimepicker-container-shape);background-color:var(--mtx-datetimepicker-container-background-color);box-shadow:var(--mtx-datetimepicker-container-elevation-shadow);color:var(--mtx-datetimepicker-container-text-color)}.mtx-datetimepicker-content-container{display:flex;flex-direction:column;justify-content:space-between}.mtx-datetimepicker-content .mtx-calendar{width:296px;height:424px}.mtx-datetimepicker-content .mtx-calendar.mtx-calendar-with-time-input{height:490px}.mtx-datetimepicker-content .mtx-calendar.mtx-calendar-with-time-input-only{height:526px}.mtx-datetimepicker-content[mode=landscape] .mtx-calendar{width:432px;height:328px}.mtx-datetimepicker-content[mode=landscape] .mtx-calendar.mtx-calendar-with-time-input{height:404px}.mtx-datetimepicker-content[mode=landscape] .mtx-calendar.mtx-calendar-with-time-input-only{height:440px}@media all and (orientation: landscape){.mtx-datetimepicker-content[mode=auto] .mtx-calendar{width:432px;height:328px}.mtx-datetimepicker-content[mode=auto] .mtx-calendar.mtx-calendar-with-time-input{height:404px}.mtx-datetimepicker-content[mode=auto] .mtx-calendar.mtx-calendar-with-time-input-only{height:440px}}.mtx-datetimepicker-content-touch{display:block;max-height:80vh;box-shadow:var(--mtx-datetimepicker-container-touch-elevation-shadow);border-radius:var(--mtx-datetimepicker-container-touch-shape);position:relative;overflow:visible}.mtx-datetimepicker-content-touch .mtx-datetimepicker-content-container{min-height:300px;max-height:850px;min-width:250px;max-width:750px}.mtx-datetimepicker-content-touch .mtx-calendar{width:100%;height:auto}@media all and (orientation: landscape){.mtx-datetimepicker-content-touch .mtx-datetimepicker-content-container[mode=auto],.mtx-datetimepicker-content-touch .mtx-datetimepicker-content-container[mode=landscape]{width:120vh;height:80vh}.mtx-datetimepicker-content-touch .mtx-datetimepicker-content-container[mode=auto] .mtx-calendar,.mtx-datetimepicker-content-touch .mtx-datetimepicker-content-container[mode=landscape] .mtx-calendar{width:auto;height:100%}.mtx-datetimepicker-content-touch .mtx-datetimepicker-content-container[mode=portrait]{width:64vh;height:90vh}.mtx-datetimepicker-content-touch .mtx-datetimepicker-content-container[mode=portrait] .mtx-calendar{width:100%;height:auto}}@media all and (orientation: portrait){.mtx-datetimepicker-content-touch .mtx-datetimepicker-content-container[mode=auto],.mtx-datetimepicker-content-touch .mtx-datetimepicker-content-container[mode=portrait]{width:80vw;height:120vw}.mtx-datetimepicker-content-touch .mtx-datetimepicker-content-container[mode=auto] .mtx-calendar,.mtx-datetimepicker-content-touch .mtx-datetimepicker-content-container[mode=portrait] .mtx-calendar{width:100%;height:auto}.mtx-datetimepicker-content-touch .mtx-datetimepicker-content-container[mode=landscape]{width:90vw;height:64vw}.mtx-datetimepicker-content-touch .mtx-datetimepicker-content-container[mode=landscape] .mtx-calendar{width:auto;height:100%}.mtx-datetimepicker-content-touch .mtx-datetimepicker-content-container-with-actions{height:135vw}}\n"], dependencies: [{ kind: "component", type: MtxCalendar, selector: "mtx-calendar", inputs: ["multiYearSelector", "twelvehour", "startView", "timeInterval", "dateFilter", "preventSameDateTimeSelection", "headerComponent", "type", "startAt", "timeInput", "selected", "minDate", "maxDate"], outputs: ["selectedChange", "viewChanged", "_userSelection"], exportAs: ["mtxCalendar"] }], animations: [
            mtxDatetimepickerAnimations.transformPanel,
            mtxDatetimepickerAnimations.fadeInCalendar,
        ], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxDatetimepickerContent, decorators: [{
            type: Component,
            args: [{ selector: 'mtx-datetimepicker-content', host: {
                        'class': 'mtx-datetimepicker-content',
                        '[class]': 'color ? "mat-" + color : ""',
                        '[class.mtx-datetimepicker-content-touch]': 'datetimepicker?.touchUi',
                        '[attr.mode]': 'datetimepicker.mode',
                        '[@transformPanel]': '_animationState',
                        '(@transformPanel.done)': '_animationDone.next()',
                    }, animations: [
                        mtxDatetimepickerAnimations.transformPanel,
                        mtxDatetimepickerAnimations.fadeInCalendar,
                    ], encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, standalone: true, imports: [MtxCalendar, CdkPortalOutlet], template: "<div cdkTrapFocus\n     role=\"dialog\"\n     [attr.aria-modal]=\"true\"\n     [attr.aria-labelledby]=\"_dialogLabelId ?? undefined\"\n     [attr.mode]=\"datetimepicker.mode\"\n     class=\"mtx-datetimepicker-content-container\">\n  <mtx-calendar [id]=\"datetimepicker.id\"\n                [class]=\"datetimepicker.panelClass\"\n                [attr.mode]=\"datetimepicker.mode\"\n                [type]=\"datetimepicker.type\"\n                [startAt]=\"datetimepicker.startAt\"\n                [startView]=\"datetimepicker.startView\"\n                [maxDate]=\"datetimepicker._maxDate\"\n                [minDate]=\"datetimepicker._minDate\"\n                [dateFilter]=\"datetimepicker._dateFilter\"\n                [multiYearSelector]=\"datetimepicker.multiYearSelector\"\n                [preventSameDateTimeSelection]=\"datetimepicker.preventSameDateTimeSelection\"\n                [headerComponent]=\"datetimepicker.calendarHeaderComponent\"\n                [timeInterval]=\"datetimepicker.timeInterval\"\n                [twelvehour]=\"datetimepicker.twelvehour\"\n                [selected]=\"datetimepicker._selected\"\n                [timeInput]=\"datetimepicker.timeInput\"\n                (selectedChange)=\"datetimepicker._select($event)\"\n                (viewChanged)=\"datetimepicker._viewChanged($event)\"\n                (_userSelection)=\"datetimepicker.close()\"\n                [@fadeInCalendar]=\"'enter'\">\n  </mtx-calendar>\n</div>\n", styles: [".mtx-datetimepicker-content{display:block;border-radius:var(--mtx-datetimepicker-container-shape);background-color:var(--mtx-datetimepicker-container-background-color);box-shadow:var(--mtx-datetimepicker-container-elevation-shadow);color:var(--mtx-datetimepicker-container-text-color)}.mtx-datetimepicker-content-container{display:flex;flex-direction:column;justify-content:space-between}.mtx-datetimepicker-content .mtx-calendar{width:296px;height:424px}.mtx-datetimepicker-content .mtx-calendar.mtx-calendar-with-time-input{height:490px}.mtx-datetimepicker-content .mtx-calendar.mtx-calendar-with-time-input-only{height:526px}.mtx-datetimepicker-content[mode=landscape] .mtx-calendar{width:432px;height:328px}.mtx-datetimepicker-content[mode=landscape] .mtx-calendar.mtx-calendar-with-time-input{height:404px}.mtx-datetimepicker-content[mode=landscape] .mtx-calendar.mtx-calendar-with-time-input-only{height:440px}@media all and (orientation: landscape){.mtx-datetimepicker-content[mode=auto] .mtx-calendar{width:432px;height:328px}.mtx-datetimepicker-content[mode=auto] .mtx-calendar.mtx-calendar-with-time-input{height:404px}.mtx-datetimepicker-content[mode=auto] .mtx-calendar.mtx-calendar-with-time-input-only{height:440px}}.mtx-datetimepicker-content-touch{display:block;max-height:80vh;box-shadow:var(--mtx-datetimepicker-container-touch-elevation-shadow);border-radius:var(--mtx-datetimepicker-container-touch-shape);position:relative;overflow:visible}.mtx-datetimepicker-content-touch .mtx-datetimepicker-content-container{min-height:300px;max-height:850px;min-width:250px;max-width:750px}.mtx-datetimepicker-content-touch .mtx-calendar{width:100%;height:auto}@media all and (orientation: landscape){.mtx-datetimepicker-content-touch .mtx-datetimepicker-content-container[mode=auto],.mtx-datetimepicker-content-touch .mtx-datetimepicker-content-container[mode=landscape]{width:120vh;height:80vh}.mtx-datetimepicker-content-touch .mtx-datetimepicker-content-container[mode=auto] .mtx-calendar,.mtx-datetimepicker-content-touch .mtx-datetimepicker-content-container[mode=landscape] .mtx-calendar{width:auto;height:100%}.mtx-datetimepicker-content-touch .mtx-datetimepicker-content-container[mode=portrait]{width:64vh;height:90vh}.mtx-datetimepicker-content-touch .mtx-datetimepicker-content-container[mode=portrait] .mtx-calendar{width:100%;height:auto}}@media all and (orientation: portrait){.mtx-datetimepicker-content-touch .mtx-datetimepicker-content-container[mode=auto],.mtx-datetimepicker-content-touch .mtx-datetimepicker-content-container[mode=portrait]{width:80vw;height:120vw}.mtx-datetimepicker-content-touch .mtx-datetimepicker-content-container[mode=auto] .mtx-calendar,.mtx-datetimepicker-content-touch .mtx-datetimepicker-content-container[mode=portrait] .mtx-calendar{width:100%;height:auto}.mtx-datetimepicker-content-touch .mtx-datetimepicker-content-container[mode=landscape]{width:90vw;height:64vw}.mtx-datetimepicker-content-touch .mtx-datetimepicker-content-container[mode=landscape] .mtx-calendar{width:auto;height:100%}.mtx-datetimepicker-content-touch .mtx-datetimepicker-content-container-with-actions{height:135vw}}\n"] }]
        }], ctorParameters: () => [{ type: i0.ChangeDetectorRef }], propDecorators: { _calendar: [{
                type: ViewChild,
                args: [MtxCalendar, { static: true }]
            }], color: [{
                type: Input
            }] } });
class MtxDatetimepicker {
    /** Classes to be passed to the date picker panel. */
    get panelClass() {
        return this._panelClass;
    }
    set panelClass(value) {
        this._panelClass = coerceStringArray(value);
    }
    /** Whether the calendar is open. */
    get opened() {
        return this._opened;
    }
    set opened(value) {
        value ? this.open() : this.close();
    }
    /** Color palette to use on the datetimepicker's calendar. */
    get color() {
        return (this._color ||
            (this.datetimepickerInput ? this.datetimepickerInput.getThemePalette() : undefined));
    }
    set color(value) {
        this._color = value;
        console.log(value);
    }
    constructor(_overlay, _viewContainerRef, _scrollStrategy, _dateAdapter, _dir) {
        this._overlay = _overlay;
        this._viewContainerRef = _viewContainerRef;
        this._scrollStrategy = _scrollStrategy;
        this._dateAdapter = _dateAdapter;
        this._dir = _dir;
        this._document = inject(DOCUMENT);
        this._injector = inject(Injector);
        /** Whether to show multi-year view. */
        this.multiYearSelector = false;
        /** Whether the clock uses 12 hour format. */
        this.twelvehour = false;
        /** The view that the calendar should start in. */
        this.startView = 'month';
        /** The display mode of datetimepicker. */
        this.mode = 'auto';
        /** Step over minutes. */
        this.timeInterval = 1;
        /** Prevent user to select same date time */
        this.preventSameDateTimeSelection = false;
        /**
         * Emits new selected date when selected date changes.
         * @deprecated Switch to the `dateChange` and `dateInput` binding on the input element.
         */
        this.selectedChanged = new EventEmitter();
        /** Emits when the datetimepicker has been opened. */
        this.openedStream = new EventEmitter();
        /** Emits when the datetimepicker has been closed. */
        this.closedStream = new EventEmitter();
        /** Emits when the view has been changed. */
        this.viewChanged = new EventEmitter();
        this._opened = false;
        /** The id for the datetimepicker calendar. */
        this.id = `mtx-datetimepicker-${datetimepickerUid++}`;
        /** Emits when the datetimepicker is disabled. */
        this._disabledChange = new Subject();
        this._validSelected = null;
        /** The element that was focused before the datetimepicker was opened. */
        this._focusedElementBeforeOpen = null;
        /** Unique class that will be added to the backdrop so that the test harnesses can look it up. */
        this._backdropHarnessClass = `${this.id}-backdrop`;
        this._inputStateChanges = Subscription.EMPTY;
        this._type = 'datetime';
        /**
         * Whether the calendar UI is in touch mode. In touch mode the calendar opens in a dialog rather
         * than a popup and elements have more padding to allow for bigger touch targets.
         */
        this.touchUi = false;
        /**
         * Whether the calendar is in time mode. In time mode the calendar clock gets time input
         * elements rather then just clock. When `touchUi` is enabled this will be disabled.
         */
        this.timeInput = 'dial';
        /** Preferred position of the datetimepicker in the X axis. */
        this.xPosition = 'start';
        /** Preferred position of the datetimepicker in the Y axis. */
        this.yPosition = 'below';
        /**
         * Whether to restore focus to the previously-focused element when the panel is closed.
         * Note that automatic focus restoration is an accessibility feature and it is recommended that
         * you provide your own equivalent, if you decide to turn it off.
         */
        this.restoreFocus = true;
        if (!this._dateAdapter) {
            throw createMissingDateImplError('DateAdapter');
        }
    }
    /** The date to open the calendar to initially. */
    get startAt() {
        // If an explicit startAt is set we start there, otherwise we start at whatever the currently
        // selected value is.
        return this._startAt || (this.datetimepickerInput ? this.datetimepickerInput.value : null);
    }
    set startAt(date) {
        this._startAt = this._dateAdapter.getValidDateOrNull(date);
    }
    /** The display type of datetimepicker. */
    get type() {
        return this._type;
    }
    set type(value) {
        this._type = value || 'datetime';
    }
    /** Whether the datetimepicker pop-up should be disabled. */
    get disabled() {
        return this._disabled === undefined && this.datetimepickerInput
            ? this.datetimepickerInput.disabled
            : !!this._disabled;
    }
    set disabled(value) {
        if (value !== this._disabled) {
            this._disabled = value;
            this._disabledChange.next(value);
        }
    }
    /** The currently selected date. */
    get _selected() {
        return this._validSelected;
    }
    set _selected(value) {
        this._validSelected = value;
    }
    /** The minimum selectable date. */
    get _minDate() {
        return this.datetimepickerInput && this.datetimepickerInput.min;
    }
    /** The maximum selectable date. */
    get _maxDate() {
        return this.datetimepickerInput && this.datetimepickerInput.max;
    }
    get _dateFilter() {
        return this.datetimepickerInput && this.datetimepickerInput._dateFilter;
    }
    _viewChanged(type) {
        this.viewChanged.emit(type);
    }
    ngOnDestroy() {
        this._destroyOverlay();
        this.close();
        this._inputStateChanges.unsubscribe();
        this._disabledChange.complete();
    }
    /** Selects the given date */
    _select(date) {
        const oldValue = this._selected;
        this._selected = date;
        if (!this._dateAdapter.sameDatetime(oldValue, this._selected)) {
            this.selectedChanged.emit(date);
        }
    }
    /**
     * Register an input with this datetimepicker.
     * @param input The datetimepicker input to register with this datetimepicker.
     */
    _registerInput(input) {
        if (this.datetimepickerInput) {
            throw Error('A MtxDatetimepicker can only be associated with a single input.');
        }
        this.datetimepickerInput = input;
        this._inputStateChanges = this.datetimepickerInput._valueChange.subscribe((value) => (this._selected = value));
    }
    /** Open the calendar. */
    open() {
        if (this._opened || this.disabled) {
            return;
        }
        if (!this.datetimepickerInput) {
            throw Error('Attempted to open an MtxDatetimepicker with no associated input.');
        }
        this._focusedElementBeforeOpen = _getFocusedElementPierceShadowDom();
        this._openOverlay();
        this._opened = true;
        this.openedStream.emit();
    }
    /** Close the calendar. */
    close() {
        if (!this._opened) {
            return;
        }
        const canRestoreFocus = this.restoreFocus &&
            this._focusedElementBeforeOpen &&
            typeof this._focusedElementBeforeOpen.focus === 'function';
        const completeClose = () => {
            // The `_opened` could've been reset already if
            // we got two events in quick succession.
            if (this._opened) {
                this._opened = false;
                this.closedStream.emit();
            }
        };
        if (this._componentRef) {
            const { instance, location } = this._componentRef;
            instance._startExitAnimation();
            instance._animationDone.pipe(take(1)).subscribe(() => {
                const activeElement = this._document.activeElement;
                // Since we restore focus after the exit animation, we have to check that
                // the user didn't move focus themselves inside the `close` handler.
                if (canRestoreFocus &&
                    (!activeElement ||
                        activeElement === this._document.activeElement ||
                        location.nativeElement.contains(activeElement))) {
                    this._focusedElementBeforeOpen.focus();
                }
                this._focusedElementBeforeOpen = null;
                this._destroyOverlay();
            });
        }
        if (canRestoreFocus) {
            // Because IE moves focus asynchronously, we can't count on it being restored before we've
            // marked the datepicker as closed. If the event fires out of sequence and the element that
            // we're refocusing opens the datepicker on focus, the user could be stuck with not being
            // able to close the calendar at all. We work around it by making the logic, that marks
            // the datepicker as closed, async as well.
            setTimeout(completeClose);
        }
        else {
            completeClose();
        }
    }
    /**
     * Forwards relevant values from the datetimepicker to the
     * datetimepicker content inside the overlay.
     */
    _forwardContentValues(instance) {
        instance.datetimepicker = this;
        instance.color = this.color;
        instance._dialogLabelId = this.datetimepickerInput.getOverlayLabelId();
    }
    /** Opens the overlay with the calendar. */
    _openOverlay() {
        this._destroyOverlay();
        const isDialog = this.touchUi;
        const labelId = this.datetimepickerInput.getOverlayLabelId();
        const portal = new ComponentPortal(MtxDatetimepickerContent, this._viewContainerRef);
        const overlayRef = (this._overlayRef = this._overlay.create(new OverlayConfig({
            positionStrategy: isDialog ? this._getDialogStrategy() : this._getDropdownStrategy(),
            hasBackdrop: true,
            backdropClass: [
                isDialog ? 'cdk-overlay-dark-backdrop' : 'mat-overlay-transparent-backdrop',
                this._backdropHarnessClass,
            ],
            direction: this._dir,
            scrollStrategy: isDialog ? this._overlay.scrollStrategies.block() : this._scrollStrategy(),
            panelClass: `mtx-datetimepicker-${isDialog ? 'dialog' : 'popup'}`,
        })));
        const overlayElement = overlayRef.overlayElement;
        overlayElement.setAttribute('role', 'dialog');
        if (labelId) {
            overlayElement.setAttribute('aria-labelledby', labelId);
        }
        if (isDialog) {
            overlayElement.setAttribute('aria-modal', 'true');
        }
        this._getCloseStream(overlayRef).subscribe(event => {
            if (event) {
                event.preventDefault();
            }
            this.close();
        });
        this._componentRef = overlayRef.attach(portal);
        this._forwardContentValues(this._componentRef.instance);
        // Update the position once the calendar has rendered. Only relevant in dropdown mode.
        if (!isDialog) {
            afterNextRender(() => {
                overlayRef.updatePosition();
            }, { injector: this._injector });
        }
    }
    /** Destroys the current overlay. */
    _destroyOverlay() {
        if (this._overlayRef) {
            this._overlayRef.dispose();
            this._overlayRef = this._componentRef = null;
        }
    }
    /** Gets a position strategy that will open the calendar as a dropdown. */
    _getDialogStrategy() {
        return this._overlay.position().global().centerHorizontally().centerVertically();
    }
    /** Gets a position strategy that will open the calendar as a dropdown. */
    _getDropdownStrategy() {
        const strategy = this._overlay
            .position()
            .flexibleConnectedTo(this.datetimepickerInput.getConnectedOverlayOrigin())
            .withTransformOriginOn('.mtx-datetimepicker-content')
            .withFlexibleDimensions(false)
            .withViewportMargin(8)
            .withLockedPosition();
        return this._setConnectedPositions(strategy);
    }
    /**
     * Sets the positions of the datetimepicker in dropdown mode based on the current configuration.
     */
    _setConnectedPositions(strategy) {
        const primaryX = this.xPosition === 'end' ? 'end' : 'start';
        const secondaryX = primaryX === 'start' ? 'end' : 'start';
        const primaryY = this.yPosition === 'above' ? 'bottom' : 'top';
        const secondaryY = primaryY === 'top' ? 'bottom' : 'top';
        return strategy.withPositions([
            {
                originX: primaryX,
                originY: secondaryY,
                overlayX: primaryX,
                overlayY: primaryY,
            },
            {
                originX: primaryX,
                originY: primaryY,
                overlayX: primaryX,
                overlayY: secondaryY,
            },
            {
                originX: secondaryX,
                originY: secondaryY,
                overlayX: secondaryX,
                overlayY: primaryY,
            },
            {
                originX: secondaryX,
                originY: primaryY,
                overlayX: secondaryX,
                overlayY: secondaryY,
            },
        ]);
    }
    /** Gets an observable that will emit when the overlay is supposed to be closed. */
    _getCloseStream(overlayRef) {
        return merge(overlayRef.backdropClick(), overlayRef.detachments(), overlayRef.keydownEvents().pipe(filter(event => {
            // Closing on alt + up is only valid when there's an input associated with the
            // datetimepicker.
            return ((event.keyCode === ESCAPE && !hasModifierKey(event)) ||
                (this.datetimepickerInput &&
                    hasModifierKey(event, 'altKey') &&
                    event.keyCode === UP_ARROW));
        })));
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxDatetimepicker, deps: [{ token: i1$1.Overlay }, { token: i0.ViewContainerRef }, { token: MTX_DATETIMEPICKER_SCROLL_STRATEGY }, { token: i1.DatetimeAdapter, optional: true }, { token: i3.Directionality, optional: true }], target: i0.ɵɵFactoryTarget.Component }); }
    /** @nocollapse */ static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "16.1.0", version: "18.0.1", type: MtxDatetimepicker, isStandalone: true, selector: "mtx-datetimepicker", inputs: { multiYearSelector: ["multiYearSelector", "multiYearSelector", booleanAttribute], twelvehour: ["twelvehour", "twelvehour", booleanAttribute], startView: "startView", mode: "mode", timeInterval: "timeInterval", preventSameDateTimeSelection: ["preventSameDateTimeSelection", "preventSameDateTimeSelection", booleanAttribute], calendarHeaderComponent: "calendarHeaderComponent", panelClass: "panelClass", opened: ["opened", "opened", booleanAttribute], color: "color", startAt: "startAt", type: "type", touchUi: ["touchUi", "touchUi", booleanAttribute], timeInput: "timeInput", disabled: ["disabled", "disabled", booleanAttribute], xPosition: "xPosition", yPosition: "yPosition", restoreFocus: ["restoreFocus", "restoreFocus", booleanAttribute] }, outputs: { selectedChanged: "selectedChanged", openedStream: "opened", closedStream: "closed", viewChanged: "viewChanged" }, exportAs: ["mtxDatetimepicker"], ngImport: i0, template: '', isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxDatetimepicker, decorators: [{
            type: Component,
            args: [{
                    selector: 'mtx-datetimepicker',
                    exportAs: 'mtxDatetimepicker',
                    template: '',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    preserveWhitespaces: false,
                    standalone: true,
                }]
        }], ctorParameters: () => [{ type: i1$1.Overlay }, { type: i0.ViewContainerRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MTX_DATETIMEPICKER_SCROLL_STRATEGY]
                }] }, { type: i1.DatetimeAdapter, decorators: [{
                    type: Optional
                }] }, { type: i3.Directionality, decorators: [{
                    type: Optional
                }] }], propDecorators: { multiYearSelector: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], twelvehour: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], startView: [{
                type: Input
            }], mode: [{
                type: Input
            }], timeInterval: [{
                type: Input
            }], preventSameDateTimeSelection: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], calendarHeaderComponent: [{
                type: Input
            }], selectedChanged: [{
                type: Output
            }], openedStream: [{
                type: Output,
                args: ['opened']
            }], closedStream: [{
                type: Output,
                args: ['closed']
            }], viewChanged: [{
                type: Output
            }], panelClass: [{
                type: Input
            }], opened: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], color: [{
                type: Input
            }], startAt: [{
                type: Input
            }], type: [{
                type: Input
            }], touchUi: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], timeInput: [{
                type: Input
            }], disabled: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], xPosition: [{
                type: Input
            }], yPosition: [{
                type: Input
            }], restoreFocus: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }] } });

const MAT_DATETIMEPICKER_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MtxDatetimepickerInput),
    multi: true,
};
const MAT_DATETIMEPICKER_VALIDATORS = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => MtxDatetimepickerInput),
    multi: true,
};
/**
 * An event used for datetimepicker input and change events. We don't always have access to a native
 * input or change event because the event may have been triggered by the user clicking on the
 * calendar popup. For consistency, we always use MtxDatetimepickerInputEvent instead.
 */
class MtxDatetimepickerInputEvent {
    constructor(target, targetElement) {
        this.target = target;
        this.targetElement = targetElement;
        this.value = this.target.value;
    }
}
/** Directive used to connect an input to a MtxDatetimepicker. */
class MtxDatetimepickerInput {
    constructor(_elementRef, _dateAdapter, _dateFormats, _formField) {
        this._elementRef = _elementRef;
        this._dateAdapter = _dateAdapter;
        this._dateFormats = _dateFormats;
        this._formField = _formField;
        /** Emits when a `change` event is fired on this `<input>`. */
        this.dateChange = new EventEmitter();
        /** Emits when an `input` event is fired on this `<input>`. */
        this.dateInput = new EventEmitter();
        /** Emits when the value changes (either due to user input or programmatic change). */
        this._valueChange = new EventEmitter();
        /** Emits when the disabled state has changed */
        this._disabledChange = new EventEmitter();
        this._datetimepickerSubscription = Subscription.EMPTY;
        this._localeSubscription = Subscription.EMPTY;
        /** Whether the last value set on the input was valid. */
        this._lastValueValid = false;
        this._onTouched = () => { };
        this._cvaOnChange = () => { };
        this._validatorOnChange = () => { };
        /** The form control validator for whether the input parses. */
        this._parseValidator = () => {
            return this._lastValueValid
                ? null
                : { mtxDatetimepickerParse: { text: this._elementRef.nativeElement.value } };
        };
        /** The form control validator for the min date. */
        this._minValidator = (control) => {
            const controlValue = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(control.value));
            return !this.min ||
                !controlValue ||
                this._dateAdapter.compareDatetime(this.min, controlValue) <= 0
                ? null
                : { mtxDatetimepickerMin: { min: this.min, actual: controlValue } };
        };
        /** The form control validator for the max date. */
        this._maxValidator = (control) => {
            const controlValue = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(control.value));
            return !this.max ||
                !controlValue ||
                this._dateAdapter.compareDatetime(this.max, controlValue) >= 0
                ? null
                : { mtxDatetimepickerMax: { max: this.max, actual: controlValue } };
        };
        /** The form control validator for the date filter. */
        this._filterValidator = (control) => {
            const controlValue = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(control.value));
            return !this._dateFilter ||
                !controlValue ||
                this._dateFilter(controlValue, MtxDatetimepickerFilterType.DATE)
                ? null
                : { mtxDatetimepickerFilter: true };
        };
        /** The combined form control validator for this input. */
        this._validator = Validators.compose([
            this._parseValidator,
            this._minValidator,
            this._maxValidator,
            this._filterValidator,
        ]);
        if (!this._dateAdapter) {
            throw createMissingDateImplError('DatetimeAdapter');
        }
        if (!this._dateFormats) {
            throw createMissingDateImplError('MTX_DATETIME_FORMATS');
        }
        // Update the displayed date when the locale changes.
        this._localeSubscription = _dateAdapter.localeChanges.subscribe(() => {
            this.value = this._dateAdapter.deserialize(this.value);
        });
    }
    /** The datetimepicker that this input is associated with. */
    set mtxDatetimepicker(value) {
        this.registerDatetimepicker(value);
    }
    set mtxDatetimepickerFilter(filter) {
        this._dateFilter = filter;
        this._validatorOnChange();
    }
    /** The value of the input. */
    get value() {
        return this._value;
    }
    set value(value) {
        value = this._dateAdapter.deserialize(value);
        this._lastValueValid = !value || this._dateAdapter.isValid(value);
        value = this._dateAdapter.getValidDateOrNull(value);
        const oldDate = this.value;
        this._value = value;
        this._formatValue(value);
        // use timeout to ensure the datetimepicker is instantiated and we get the correct format
        setTimeout(() => {
            if (!this._dateAdapter.sameDatetime(oldDate, value)) {
                this._valueChange.emit(value);
            }
        });
    }
    /** The minimum valid date. */
    get min() {
        return this._min;
    }
    set min(value) {
        this._min = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));
        this._validatorOnChange();
    }
    /** The maximum valid date. */
    get max() {
        return this._max;
    }
    set max(value) {
        this._max = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));
        this._validatorOnChange();
    }
    /** Whether the datetimepicker-input is disabled. */
    get disabled() {
        return !!this._disabled;
    }
    set disabled(value) {
        if (this._disabled !== value) {
            this._disabled = value;
            this._disabledChange.emit(value);
        }
    }
    ngAfterContentInit() {
        if (this._datetimepicker) {
            this._datetimepickerSubscription = this._datetimepicker.selectedChanged.subscribe((selected) => {
                this.value = selected;
                this._cvaOnChange(selected);
                this._onTouched();
                this.dateInput.emit(new MtxDatetimepickerInputEvent(this, this._elementRef.nativeElement));
                this.dateChange.emit(new MtxDatetimepickerInputEvent(this, this._elementRef.nativeElement));
            });
        }
    }
    ngOnDestroy() {
        this._datetimepickerSubscription.unsubscribe();
        this._localeSubscription.unsubscribe();
        this._valueChange.complete();
        this._disabledChange.complete();
    }
    registerOnValidatorChange(fn) {
        this._validatorOnChange = fn;
    }
    validate(c) {
        return this._validator ? this._validator(c) : null;
    }
    /**
     * Gets the element that the datetimepicker popup should be connected to.
     * @return The element to connect the popup to.
     */
    getConnectedOverlayOrigin() {
        return this._formField ? this._formField.getConnectedOverlayOrigin() : this._elementRef;
    }
    /** Gets the ID of an element that should be used a description for the calendar overlay. */
    getOverlayLabelId() {
        if (this._formField) {
            return this._formField.getLabelId();
        }
        return this._elementRef.nativeElement.getAttribute('aria-labelledby');
    }
    // Implemented as part of ControlValueAccessor
    writeValue(value) {
        this.value = value;
    }
    // Implemented as part of ControlValueAccessor
    registerOnChange(fn) {
        this._cvaOnChange = fn;
    }
    // Implemented as part of ControlValueAccessor
    registerOnTouched(fn) {
        this._onTouched = fn;
    }
    // Implemented as part of ControlValueAccessor
    setDisabledState(disabled) {
        this.disabled = disabled;
    }
    _onKeydown(event) {
        if (event.altKey && event.keyCode === DOWN_ARROW) {
            this._datetimepicker.open();
            event.preventDefault();
        }
    }
    _onInput(value) {
        let date = this._dateAdapter.parse(value, this.getParseFormat());
        this._lastValueValid = !date || this._dateAdapter.isValid(date);
        date = this._dateAdapter.getValidDateOrNull(date);
        this._value = date;
        this._cvaOnChange(date);
        this._valueChange.emit(date);
        this.dateInput.emit(new MtxDatetimepickerInputEvent(this, this._elementRef.nativeElement));
    }
    _onChange() {
        this.dateChange.emit(new MtxDatetimepickerInputEvent(this, this._elementRef.nativeElement));
    }
    /** Handles blur events on the input. */
    _onBlur() {
        // Reformat the input only if we have a valid value.
        if (this.value) {
            this._formatValue(this.value);
        }
        this._onTouched();
    }
    registerDatetimepicker(value) {
        if (value) {
            this._datetimepicker = value;
            this._datetimepicker._registerInput(this);
        }
    }
    getDisplayFormat() {
        switch (this._datetimepicker.type) {
            case 'date':
                return this._dateFormats.display.dateInput;
            case 'datetime':
                return this._dateFormats.display.datetimeInput;
            case 'time':
                return this._dateFormats.display.timeInput;
            case 'month':
                return this._dateFormats.display.monthInput;
            case 'year':
                return this._dateFormats.display.yearInput;
        }
    }
    getParseFormat() {
        let parseFormat;
        switch (this._datetimepicker.type) {
            case 'date':
                parseFormat = this._dateFormats.parse.dateInput;
                break;
            case 'datetime':
                parseFormat = this._dateFormats.parse.datetimeInput;
                break;
            case 'time':
                parseFormat = this._dateFormats.parse.timeInput;
                break;
            case 'month':
                parseFormat = this._dateFormats.parse.monthInput;
                break;
            case 'year':
                parseFormat = this._dateFormats.parse.yearInput;
                break;
        }
        if (!parseFormat) {
            parseFormat = this._dateFormats.parse.dateInput;
        }
        return parseFormat;
    }
    /** Formats a value and sets it on the input element. */
    _formatValue(value) {
        this._elementRef.nativeElement.value = value
            ? this._dateAdapter.format(value, this.getDisplayFormat())
            : '';
    }
    /** Returns the palette used by the input's form field, if any. */
    getThemePalette() {
        return this._formField ? this._formField.color : undefined;
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxDatetimepickerInput, deps: [{ token: i0.ElementRef }, { token: i1.DatetimeAdapter, optional: true }, { token: MTX_DATETIME_FORMATS, optional: true }, { token: i2.MatFormField, optional: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    /** @nocollapse */ static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "16.1.0", version: "18.0.1", type: MtxDatetimepickerInput, isStandalone: true, selector: "input[mtxDatetimepicker]", inputs: { mtxDatetimepicker: "mtxDatetimepicker", mtxDatetimepickerFilter: "mtxDatetimepickerFilter", value: "value", min: "min", max: "max", disabled: ["disabled", "disabled", booleanAttribute] }, outputs: { dateChange: "dateChange", dateInput: "dateInput" }, host: { listeners: { "input": "_onInput($event.target.value)", "change": "_onChange()", "blur": "_onBlur()", "keydown": "_onKeydown($event)" }, properties: { "attr.aria-haspopup": "true", "attr.aria-owns": "(_datetimepicker?.opened && _datetimepicker.id) || null", "attr.min": "min ? _dateAdapter.toIso8601(min) : null", "attr.max": "max ? _dateAdapter.toIso8601(max) : null", "disabled": "disabled" } }, providers: [
            MAT_DATETIMEPICKER_VALUE_ACCESSOR,
            MAT_DATETIMEPICKER_VALIDATORS,
            { provide: MAT_INPUT_VALUE_ACCESSOR, useExisting: MtxDatetimepickerInput },
        ], exportAs: ["mtxDatetimepickerInput"], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxDatetimepickerInput, decorators: [{
            type: Directive,
            args: [{
                    selector: 'input[mtxDatetimepicker]',
                    providers: [
                        MAT_DATETIMEPICKER_VALUE_ACCESSOR,
                        MAT_DATETIMEPICKER_VALIDATORS,
                        { provide: MAT_INPUT_VALUE_ACCESSOR, useExisting: MtxDatetimepickerInput },
                    ],
                    host: {
                        '[attr.aria-haspopup]': 'true',
                        '[attr.aria-owns]': '(_datetimepicker?.opened && _datetimepicker.id) || null',
                        '[attr.min]': 'min ? _dateAdapter.toIso8601(min) : null',
                        '[attr.max]': 'max ? _dateAdapter.toIso8601(max) : null',
                        '[disabled]': 'disabled',
                        '(input)': '_onInput($event.target.value)',
                        '(change)': '_onChange()',
                        '(blur)': '_onBlur()',
                        '(keydown)': '_onKeydown($event)',
                    },
                    exportAs: 'mtxDatetimepickerInput',
                    standalone: true,
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i1.DatetimeAdapter, decorators: [{
                    type: Optional
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MTX_DATETIME_FORMATS]
                }] }, { type: i2.MatFormField, decorators: [{
                    type: Optional
                }] }], propDecorators: { dateChange: [{
                type: Output
            }], dateInput: [{
                type: Output
            }], mtxDatetimepicker: [{
                type: Input
            }], mtxDatetimepickerFilter: [{
                type: Input
            }], value: [{
                type: Input
            }], min: [{
                type: Input
            }], max: [{
                type: Input
            }], disabled: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }] } });

/** Can be used to override the icon of a `mtxDatetimepickerToggle`. */
class MtxDatetimepickerToggleIcon {
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxDatetimepickerToggleIcon, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    /** @nocollapse */ static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.0.1", type: MtxDatetimepickerToggleIcon, isStandalone: true, selector: "[mtxDatetimepickerToggleIcon]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxDatetimepickerToggleIcon, decorators: [{
            type: Directive,
            args: [{
                    selector: '[mtxDatetimepickerToggleIcon]',
                    standalone: true,
                }]
        }] });
class MtxDatetimepickerToggle {
    /** Whether the toggle button is disabled. */
    get disabled() {
        return this._disabled === undefined ? this.datetimepicker.disabled : !!this._disabled;
    }
    set disabled(value) {
        this._disabled = value;
    }
    constructor(_intl, _changeDetectorRef, defaultTabIndex) {
        this._intl = _intl;
        this._changeDetectorRef = _changeDetectorRef;
        this._stateChanges = Subscription.EMPTY;
        const parsedTabIndex = Number(defaultTabIndex);
        this.tabIndex = parsedTabIndex || parsedTabIndex === 0 ? parsedTabIndex : null;
    }
    ngOnChanges(changes) {
        if (changes.datetimepicker) {
            this._watchStateChanges();
        }
    }
    ngOnDestroy() {
        this._stateChanges.unsubscribe();
    }
    ngAfterContentInit() {
        this._watchStateChanges();
    }
    _open(event) {
        if (this.datetimepicker && !this.disabled) {
            this.datetimepicker.open();
            event.stopPropagation();
        }
    }
    _watchStateChanges() {
        const datetimepickerDisabled = this.datetimepicker
            ? this.datetimepicker._disabledChange
            : of();
        const inputDisabled = this.datetimepicker && this.datetimepicker.datetimepickerInput
            ? this.datetimepicker.datetimepickerInput._disabledChange
            : of();
        const datetimepickerToggled = this.datetimepicker
            ? merge(this.datetimepicker.openedStream, this.datetimepicker.closedStream)
            : of();
        this._stateChanges.unsubscribe();
        this._stateChanges = merge(this._intl.changes, datetimepickerDisabled, inputDisabled, datetimepickerToggled).subscribe(() => this._changeDetectorRef.markForCheck());
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxDatetimepickerToggle, deps: [{ token: MtxDatetimepickerIntl }, { token: i0.ChangeDetectorRef }, { token: 'tabindex', attribute: true }], target: i0.ɵɵFactoryTarget.Component }); }
    /** @nocollapse */ static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.0.1", type: MtxDatetimepickerToggle, isStandalone: true, selector: "mtx-datetimepicker-toggle", inputs: { datetimepicker: ["for", "datetimepicker"], tabIndex: "tabIndex", ariaLabel: ["aria-label", "ariaLabel"], disabled: ["disabled", "disabled", booleanAttribute], disableRipple: ["disableRipple", "disableRipple", booleanAttribute] }, host: { listeners: { "click": "_open($event)" }, properties: { "attr.tabindex": "null", "class.mtx-datetimepicker-toggle-active": "datetimepicker && datetimepicker.opened", "class.mat-accent": "datetimepicker && datetimepicker.color === \"accent\"", "class.mat-warn": "datetimepicker && datetimepicker.color === \"warn\"", "attr.data-mtx-calendar": "datetimepicker ? datetimepicker.id : null" }, classAttribute: "mtx-datetimepicker-toggle" }, queries: [{ propertyName: "_customIcon", first: true, predicate: MtxDatetimepickerToggleIcon, descendants: true }], viewQueries: [{ propertyName: "_button", first: true, predicate: ["button"], descendants: true }], exportAs: ["mtxDatetimepickerToggle"], usesOnChanges: true, ngImport: i0, template: "<button #button\n  mat-icon-button\n  type=\"button\"\n  [attr.aria-haspopup]=\"datetimepicker ? 'dialog' : null\"\n  [attr.aria-label]=\"ariaLabel || _intl.openCalendarLabel\"\n  [attr.tabindex]=\"disabled ? -1 : tabIndex\"\n  [disabled]=\"disabled\"\n  [disableRipple]=\"disableRipple\">\n\n  @if (!_customIcon) {\n    @switch (datetimepicker.type) {\n      @case ('time') {\n        <svg\n          class=\"mtx-datetimepicker-toggle-default-icon\"\n          viewBox=\"0 0 24 24\"\n          width=\"24px\"\n          height=\"24px\"\n          fill=\"currentColor\"\n          focusable=\"false\">\n          <path d=\"M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z\" />\n        </svg>\n      }\n      @case ('datetime') {\n        <svg\n          class=\"mtx-datetimepicker-toggle-default-icon\"\n          viewBox=\"0 0 24 24\"\n          width=\"24px\"\n          height=\"24px\"\n          fill=\"currentColor\"\n          focusable=\"false\">\n          <path d=\"M15,13H16.5V15.82L18.94,17.23L18.19,18.53L15,16.69V13M19,8H5V19H9.67C9.24,18.09 9,17.07 9,16A7,7 0 0,1 16,9C17.07,9 18.09,9.24 19,9.67V8M5,21C3.89,21 3,20.1 3,19V5C3,3.89 3.89,3 5,3H6V1H8V3H16V1H18V3H19A2,2 0 0,1 21,5V11.1C22.24,12.36 23,14.09 23,16A7,7 0 0,1 16,23C14.09,23 12.36,22.24 11.1,21H5M16,11.15A4.85,4.85 0 0,0 11.15,16C11.15,18.68 13.32,20.85 16,20.85A4.85,4.85 0 0,0 20.85,16C20.85,13.32 18.68,11.15 16,11.15Z\" />\n        </svg>\n      }\n      @default {\n        <svg\n          class=\"mtx-datetimepicker-toggle-default-icon\"\n          viewBox=\"0 0 24 24\"\n          width=\"24px\"\n          height=\"24px\"\n          fill=\"currentColor\"\n          focusable=\"false\">\n          <path d=\"M0 0h24v24H0z\" fill=\"none\" />\n          <path d=\"M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z\" />\n        </svg>\n      }\n    }\n  }\n\n  <ng-content select=\"[mtxDatetimepickerToggleIcon]\"></ng-content>\n</button>\n", styles: [".mtx-datetimepicker-toggle{pointer-events:auto;color:var(--mtx-datetimepicker-toggle-icon-color)}.mtx-datetimepicker-toggle-active{color:var(--mtx-datetimepicker-toggle-active-state-icon-color)}.cdk-high-contrast-active .mtx-datetimepicker-toggle-default-icon{color:CanvasText}\n"], dependencies: [{ kind: "component", type: MatIconButton, selector: "button[mat-icon-button]", exportAs: ["matButton"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxDatetimepickerToggle, decorators: [{
            type: Component,
            args: [{ selector: 'mtx-datetimepicker-toggle', host: {
                        'class': 'mtx-datetimepicker-toggle',
                        '[attr.tabindex]': 'null',
                        '[class.mtx-datetimepicker-toggle-active]': 'datetimepicker && datetimepicker.opened',
                        '[class.mat-accent]': 'datetimepicker && datetimepicker.color === "accent"',
                        '[class.mat-warn]': 'datetimepicker && datetimepicker.color === "warn"',
                        // Used by the test harness to tie this toggle to its datetimepicker.
                        '[attr.data-mtx-calendar]': 'datetimepicker ? datetimepicker.id : null',
                        // Bind the `click` on the host, rather than the inner `button`, so that we can call
                        // `stopPropagation` on it without affecting the user's `click` handlers. We need to stop
                        // it so that the input doesn't get focused automatically by the form field (See #21836).
                        '(click)': '_open($event)',
                    }, exportAs: 'mtxDatetimepickerToggle', encapsulation: ViewEncapsulation.None, preserveWhitespaces: false, changeDetection: ChangeDetectionStrategy.OnPush, standalone: true, imports: [MatIconButton], template: "<button #button\n  mat-icon-button\n  type=\"button\"\n  [attr.aria-haspopup]=\"datetimepicker ? 'dialog' : null\"\n  [attr.aria-label]=\"ariaLabel || _intl.openCalendarLabel\"\n  [attr.tabindex]=\"disabled ? -1 : tabIndex\"\n  [disabled]=\"disabled\"\n  [disableRipple]=\"disableRipple\">\n\n  @if (!_customIcon) {\n    @switch (datetimepicker.type) {\n      @case ('time') {\n        <svg\n          class=\"mtx-datetimepicker-toggle-default-icon\"\n          viewBox=\"0 0 24 24\"\n          width=\"24px\"\n          height=\"24px\"\n          fill=\"currentColor\"\n          focusable=\"false\">\n          <path d=\"M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z\" />\n        </svg>\n      }\n      @case ('datetime') {\n        <svg\n          class=\"mtx-datetimepicker-toggle-default-icon\"\n          viewBox=\"0 0 24 24\"\n          width=\"24px\"\n          height=\"24px\"\n          fill=\"currentColor\"\n          focusable=\"false\">\n          <path d=\"M15,13H16.5V15.82L18.94,17.23L18.19,18.53L15,16.69V13M19,8H5V19H9.67C9.24,18.09 9,17.07 9,16A7,7 0 0,1 16,9C17.07,9 18.09,9.24 19,9.67V8M5,21C3.89,21 3,20.1 3,19V5C3,3.89 3.89,3 5,3H6V1H8V3H16V1H18V3H19A2,2 0 0,1 21,5V11.1C22.24,12.36 23,14.09 23,16A7,7 0 0,1 16,23C14.09,23 12.36,22.24 11.1,21H5M16,11.15A4.85,4.85 0 0,0 11.15,16C11.15,18.68 13.32,20.85 16,20.85A4.85,4.85 0 0,0 20.85,16C20.85,13.32 18.68,11.15 16,11.15Z\" />\n        </svg>\n      }\n      @default {\n        <svg\n          class=\"mtx-datetimepicker-toggle-default-icon\"\n          viewBox=\"0 0 24 24\"\n          width=\"24px\"\n          height=\"24px\"\n          fill=\"currentColor\"\n          focusable=\"false\">\n          <path d=\"M0 0h24v24H0z\" fill=\"none\" />\n          <path d=\"M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z\" />\n        </svg>\n      }\n    }\n  }\n\n  <ng-content select=\"[mtxDatetimepickerToggleIcon]\"></ng-content>\n</button>\n", styles: [".mtx-datetimepicker-toggle{pointer-events:auto;color:var(--mtx-datetimepicker-toggle-icon-color)}.mtx-datetimepicker-toggle-active{color:var(--mtx-datetimepicker-toggle-active-state-icon-color)}.cdk-high-contrast-active .mtx-datetimepicker-toggle-default-icon{color:CanvasText}\n"] }]
        }], ctorParameters: () => [{ type: MtxDatetimepickerIntl }, { type: i0.ChangeDetectorRef }, { type: undefined, decorators: [{
                    type: Attribute,
                    args: ['tabindex']
                }] }], propDecorators: { datetimepicker: [{
                type: Input,
                args: ['for']
            }], tabIndex: [{
                type: Input
            }], ariaLabel: [{
                type: Input,
                args: ['aria-label']
            }], disabled: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], disableRipple: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], _customIcon: [{
                type: ContentChild,
                args: [MtxDatetimepickerToggleIcon]
            }], _button: [{
                type: ViewChild,
                args: ['button']
            }] } });

class MtxDatetimepickerModule {
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxDatetimepickerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    /** @nocollapse */ static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.0.1", ngImport: i0, type: MtxDatetimepickerModule, imports: [CommonModule,
            OverlayModule,
            A11yModule,
            PortalModule,
            MatButtonModule,
            MtxCalendar,
            MtxCalendarBody,
            MtxClock,
            MtxTime,
            MtxTimeInput,
            MtxDatetimepicker,
            MtxDatetimepickerToggle,
            MtxDatetimepickerToggleIcon,
            MtxDatetimepickerInput,
            MtxDatetimepickerContent,
            MtxMonthView,
            MtxYearView,
            MtxMultiYearView], exports: [MtxCalendar,
            MtxCalendarBody,
            MtxClock,
            MtxTime,
            MtxDatetimepicker,
            MtxDatetimepickerToggle,
            MtxDatetimepickerToggleIcon,
            MtxDatetimepickerInput,
            MtxDatetimepickerContent,
            MtxMonthView,
            MtxYearView,
            MtxMultiYearView] }); }
    /** @nocollapse */ static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxDatetimepickerModule, providers: [MTX_DATETIMEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER], imports: [CommonModule,
            OverlayModule,
            A11yModule,
            PortalModule,
            MatButtonModule,
            MtxCalendar,
            MtxTime,
            MtxDatetimepickerToggle,
            MtxDatetimepickerContent] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxDatetimepickerModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        OverlayModule,
                        A11yModule,
                        PortalModule,
                        MatButtonModule,
                        MtxCalendar,
                        MtxCalendarBody,
                        MtxClock,
                        MtxTime,
                        MtxTimeInput,
                        MtxDatetimepicker,
                        MtxDatetimepickerToggle,
                        MtxDatetimepickerToggleIcon,
                        MtxDatetimepickerInput,
                        MtxDatetimepickerContent,
                        MtxMonthView,
                        MtxYearView,
                        MtxMultiYearView,
                    ],
                    exports: [
                        MtxCalendar,
                        MtxCalendarBody,
                        MtxClock,
                        MtxTime,
                        MtxDatetimepicker,
                        MtxDatetimepickerToggle,
                        MtxDatetimepickerToggleIcon,
                        MtxDatetimepickerInput,
                        MtxDatetimepickerContent,
                        MtxMonthView,
                        MtxYearView,
                        MtxMultiYearView,
                    ],
                    providers: [MTX_DATETIMEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER],
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { CLOCK_INNER_RADIUS, CLOCK_OUTER_RADIUS, CLOCK_RADIUS, CLOCK_TICK_RADIUS, MAT_DATETIMEPICKER_VALIDATORS, MAT_DATETIMEPICKER_VALUE_ACCESSOR, MTX_DATETIMEPICKER_SCROLL_STRATEGY, MTX_DATETIMEPICKER_SCROLL_STRATEGY_FACTORY, MTX_DATETIMEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER, MtxCalendar, MtxCalendarBody, MtxCalendarCell, MtxClock, MtxDatetimepicker, MtxDatetimepickerContent, MtxDatetimepickerFilterType, MtxDatetimepickerInput, MtxDatetimepickerInputEvent, MtxDatetimepickerIntl, MtxDatetimepickerModule, MtxDatetimepickerToggle, MtxDatetimepickerToggleIcon, MtxMonthView, MtxMultiYearView, MtxTime, MtxTimeInput, MtxYearView, getActiveOffset, isSameMultiYearView, mtxDatetimepickerAnimations, yearsPerPage, yearsPerRow };
//# sourceMappingURL=mtxDatetimepicker.mjs.map
