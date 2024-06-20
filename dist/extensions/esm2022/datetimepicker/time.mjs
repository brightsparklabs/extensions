import { coerceNumberProperty } from '@angular/cdk/coercion';
import { DOWN_ARROW, UP_ARROW } from '@angular/cdk/keycodes';
import { booleanAttribute, ChangeDetectionStrategy, Component, Directive, ElementRef, EventEmitter, Input, Output, ViewChild, ViewEncapsulation, } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MtxClock } from './clock';
import * as i0 from "@angular/core";
import * as i1 from "@ng-matero/extensions/core";
import * as i2 from "./datetimepicker-intl";
function pad(num, size) {
    num = String(num);
    while (num.length < size)
        num = '0' + num;
    return num;
}
export class MtxTimeInput {
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
export class MtxTime {
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
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxTime, deps: [{ token: i1.DatetimeAdapter }, { token: i0.ChangeDetectorRef }, { token: i2.MtxDatetimepickerIntl }], target: i0.ɵɵFactoryTarget.Component }); }
    /** @nocollapse */ static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.0.1", type: MtxTime, isStandalone: true, selector: "mtx-time", inputs: { dateFilter: "dateFilter", interval: "interval", twelvehour: ["twelvehour", "twelvehour", booleanAttribute], AMPM: "AMPM", timeInput: "timeInput", activeDate: "activeDate", selected: "selected", minDate: "minDate", maxDate: "maxDate", clockView: "clockView" }, outputs: { selectedChange: "selectedChange", activeDateChange: "activeDateChange", _userSelection: "_userSelection", ampmChange: "ampmChange", clockViewChange: "clockViewChange" }, host: { classAttribute: "mtx-time" }, viewQueries: [{ propertyName: "hourInputElement", first: true, predicate: ["hourInput"], descendants: true, read: (ElementRef) }, { propertyName: "hourInputDirective", first: true, predicate: ["hourInput"], descendants: true, read: MtxTimeInput }, { propertyName: "minuteInputElement", first: true, predicate: ["minuteInput"], descendants: true, read: (ElementRef) }, { propertyName: "minuteInputDirective", first: true, predicate: ["minuteInput"], descendants: true, read: MtxTimeInput }], exportAs: ["mtxTime"], usesOnChanges: true, ngImport: i0, template: "<div class=\"mtx-time-input-wrapper\">\n  <div class=\"mtx-time-input-inner\">\n    <input class=\"mtx-time-input\"\n      [class.mtx-time-input-active]=\"clockView === 'hour'\"\n      [class.mtx-time-input-warning]=\"!hourInput.valid\"\n      #hourInput=\"mtxTimeInput\"\n      type=\"text\"\n      inputmode=\"numeric\"\n      maxlength=\"2\"\n      [timeMin]=\"twelvehour ? 1 : 0\"\n      [timeMax]=\"twelvehour ? 12 : 23\"\n      [timeValue]=\"hour\"\n      (timeValueChanged)=\"handleHourInputChange($event)\"\n      (focus)=\"handleFocus('hour')\" />\n\n    <div class=\"mtx-time-seperator\">:</div>\n\n    <input class=\"mtx-time-input\"\n      [class.mtx-time-input-active]=\"clockView === 'minute'\"\n      [class.mtx-time-input-warning]=\"!minuteInput.valid\"\n      #minuteInput=\"mtxTimeInput\"\n      type=\"text\"\n      inputmode=\"numeric\"\n      maxlength=\"2\"\n      [timeMin]=\"0\"\n      [timeMax]=\"59\"\n      [timeValue]=\"minute\"\n      (timeValueChanged)=\"handleMinuteInputChange($event)\"\n      [timeInterval]=\"interval\"\n      (focus)=\"handleFocus('minute')\" />\n\n    @if (twelvehour) {\n      <div class=\"mtx-time-ampm\">\n        <button mat-button type=\"button\" class=\"mtx-time-am\"\n          [class.mtx-time-ampm-active]=\"AMPM === 'AM'\" aria-label=\"AM\"\n          (keydown)=\"$event.stopPropagation()\"\n        (click)=\"ampmChange.emit('AM')\">AM</button>\n        <button mat-button type=\"button\" class=\"mtx-time-pm\"\n          [class.mtx-time-ampm-active]=\"AMPM === 'PM'\" aria-label=\"PM\"\n          (keydown)=\"$event.stopPropagation()\"\n        (click)=\"ampmChange.emit('PM')\">PM</button>\n      </div>\n    }\n  </div>\n</div>\n\n@if (timeInput !== 'input') {\n  <mtx-clock (selectedChange)=\"_timeSelected($event)\"\n    (activeDateChange)=\"_onActiveDateChange($event)\"\n    [AMPM]=\"AMPM\"\n    [dateFilter]=\"dateFilter\"\n    [interval]=\"interval\"\n    [maxDate]=\"maxDate\"\n    [minDate]=\"minDate\"\n    [selected]=\"selected\"\n    [startView]=\"clockView\"\n    [twelvehour]=\"twelvehour\">\n  </mtx-clock>\n}\n\n<div class=\"mtx-time-button-wrapper\">\n  <button class=\"mtx-time-cancel-button\" mat-button type=\"button\" (click)=\"handleCancel()\">\n    {{ _datetimepickerIntl.cancelLabel }}\n  </button>\n  <button class=\"mtx-time-ok-button\" mat-button type=\"button\" (click)=\"handleOk()\"\n    [disabled]=\"minuteInputDirective?.invalid || hourInputDirective?.invalid\">\n    {{ _datetimepickerIntl.okLabel }}\n  </button>\n</div>\n", styles: [".mtx-time{display:block;outline:none;-webkit-user-select:none;user-select:none}.mtx-time-input-wrapper{padding:8px 0;text-align:center}.mtx-time-input-inner{display:inline-flex;height:56px}.mtx-time-input{box-sizing:border-box;width:72px;height:100%;padding:0;font-size:36px;text-align:center;border:2px solid transparent;appearance:none;outline:none;border-radius:var(--mtx-datetimepicker-selector-container-shape);background-color:var(--mtx-datetimepicker-time-input-background-color);color:var(--mtx-datetimepicker-time-input-text-color)}.mtx-time-input.mtx-time-input-active{background-color:var(--mtx-datetimepicker-time-input-active-state-background-color);color:var(--mtx-datetimepicker-time-input-active-state-text-color)}.mtx-time-input.mtx-time-input-active:focus{border-color:var(--mtx-datetimepicker-time-input-focus-state-outline-color);background-color:var(--mtx-datetimepicker-time-input-focus-state-background-color)}.mtx-time-input.mtx-time-input-active:focus::placeholder{color:var(--mtx-datetimepicker-time-input-focus-state-placeholder-text-color)}.mtx-time-input.mtx-time-input-warning{border-color:var(--mtx-datetimepicker-time-input-warn-state-outline-color)}.mtx-time-seperator{display:inline-flex;justify-content:center;align-items:center;width:24px;font-size:36px}.mtx-time-ampm{display:inline-flex;flex-direction:column;margin-left:12px}[dir=rtl] .mtx-time-ampm{margin-left:auto;margin-right:12px}.mtx-time-ampm .mtx-time-am,.mtx-time-ampm .mtx-time-pm{--mdc-text-button-label-text-weight: 400;--mdc-text-button-label-text-color: var(--mtx-datetimepicker-time-ampm-text-color);--mdc-text-button-container-shape: var(--mtx-datetimepicker-selector-container-shape);border-color:var(--mtx-datetimepicker-time-ampm-outline-color);flex:1;width:40px;min-width:auto;border-width:1px;border-style:solid}.mtx-time-ampm .mtx-time-am.mtx-time-ampm-active,.mtx-time-ampm .mtx-time-pm.mtx-time-ampm-active{--mdc-text-button-label-text-weight: 500;--mdc-text-button-label-text-color: var(--mtx-datetimepicker-time-ampm-selected-state-text-color);background-color:var(--mtx-datetimepicker-time-ampm-selected-state-background-color)}.mtx-time-ampm .mtx-time-am .mat-mdc-button-touch-target,.mtx-time-ampm .mtx-time-pm .mat-mdc-button-touch-target{height:100%}.mtx-time-ampm .mtx-time-am{border-bottom-left-radius:0;border-bottom-right-radius:0}.mtx-time-ampm .mtx-time-pm{border-top-left-radius:0;border-top-right-radius:0;border-top-width:0}.mtx-time-button-wrapper{display:flex;justify-content:flex-end;padding-top:8px}.mtx-time-button-wrapper .mat-mdc-button-base+.mat-mdc-button-base{margin-left:8px}[dir=rtl] .mtx-time-button-wrapper .mat-mdc-button-base+.mat-mdc-button-base{margin-left:0;margin-right:8px}\n"], dependencies: [{ kind: "component", type: MatButton, selector: "    button[mat-button], button[mat-raised-button], button[mat-flat-button],    button[mat-stroked-button]  ", exportAs: ["matButton"] }, { kind: "component", type: MtxClock, selector: "mtx-clock", inputs: ["dateFilter", "interval", "twelvehour", "AMPM", "activeDate", "selected", "minDate", "maxDate", "startView"], outputs: ["selectedChange", "activeDateChange", "_userSelection"], exportAs: ["mtxClock"] }, { kind: "directive", type: MtxTimeInput, selector: "input.mtx-time-input", inputs: ["timeInterval", "timeMin", "timeMax", "timeValue"], outputs: ["timeValueChanged"], exportAs: ["mtxTimeInput"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxTime, decorators: [{
            type: Component,
            args: [{ selector: 'mtx-time', exportAs: 'mtxTime', host: {
                        class: 'mtx-time',
                    }, encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, standalone: true, imports: [MatButton, MtxClock, MtxTimeInput], template: "<div class=\"mtx-time-input-wrapper\">\n  <div class=\"mtx-time-input-inner\">\n    <input class=\"mtx-time-input\"\n      [class.mtx-time-input-active]=\"clockView === 'hour'\"\n      [class.mtx-time-input-warning]=\"!hourInput.valid\"\n      #hourInput=\"mtxTimeInput\"\n      type=\"text\"\n      inputmode=\"numeric\"\n      maxlength=\"2\"\n      [timeMin]=\"twelvehour ? 1 : 0\"\n      [timeMax]=\"twelvehour ? 12 : 23\"\n      [timeValue]=\"hour\"\n      (timeValueChanged)=\"handleHourInputChange($event)\"\n      (focus)=\"handleFocus('hour')\" />\n\n    <div class=\"mtx-time-seperator\">:</div>\n\n    <input class=\"mtx-time-input\"\n      [class.mtx-time-input-active]=\"clockView === 'minute'\"\n      [class.mtx-time-input-warning]=\"!minuteInput.valid\"\n      #minuteInput=\"mtxTimeInput\"\n      type=\"text\"\n      inputmode=\"numeric\"\n      maxlength=\"2\"\n      [timeMin]=\"0\"\n      [timeMax]=\"59\"\n      [timeValue]=\"minute\"\n      (timeValueChanged)=\"handleMinuteInputChange($event)\"\n      [timeInterval]=\"interval\"\n      (focus)=\"handleFocus('minute')\" />\n\n    @if (twelvehour) {\n      <div class=\"mtx-time-ampm\">\n        <button mat-button type=\"button\" class=\"mtx-time-am\"\n          [class.mtx-time-ampm-active]=\"AMPM === 'AM'\" aria-label=\"AM\"\n          (keydown)=\"$event.stopPropagation()\"\n        (click)=\"ampmChange.emit('AM')\">AM</button>\n        <button mat-button type=\"button\" class=\"mtx-time-pm\"\n          [class.mtx-time-ampm-active]=\"AMPM === 'PM'\" aria-label=\"PM\"\n          (keydown)=\"$event.stopPropagation()\"\n        (click)=\"ampmChange.emit('PM')\">PM</button>\n      </div>\n    }\n  </div>\n</div>\n\n@if (timeInput !== 'input') {\n  <mtx-clock (selectedChange)=\"_timeSelected($event)\"\n    (activeDateChange)=\"_onActiveDateChange($event)\"\n    [AMPM]=\"AMPM\"\n    [dateFilter]=\"dateFilter\"\n    [interval]=\"interval\"\n    [maxDate]=\"maxDate\"\n    [minDate]=\"minDate\"\n    [selected]=\"selected\"\n    [startView]=\"clockView\"\n    [twelvehour]=\"twelvehour\">\n  </mtx-clock>\n}\n\n<div class=\"mtx-time-button-wrapper\">\n  <button class=\"mtx-time-cancel-button\" mat-button type=\"button\" (click)=\"handleCancel()\">\n    {{ _datetimepickerIntl.cancelLabel }}\n  </button>\n  <button class=\"mtx-time-ok-button\" mat-button type=\"button\" (click)=\"handleOk()\"\n    [disabled]=\"minuteInputDirective?.invalid || hourInputDirective?.invalid\">\n    {{ _datetimepickerIntl.okLabel }}\n  </button>\n</div>\n", styles: [".mtx-time{display:block;outline:none;-webkit-user-select:none;user-select:none}.mtx-time-input-wrapper{padding:8px 0;text-align:center}.mtx-time-input-inner{display:inline-flex;height:56px}.mtx-time-input{box-sizing:border-box;width:72px;height:100%;padding:0;font-size:36px;text-align:center;border:2px solid transparent;appearance:none;outline:none;border-radius:var(--mtx-datetimepicker-selector-container-shape);background-color:var(--mtx-datetimepicker-time-input-background-color);color:var(--mtx-datetimepicker-time-input-text-color)}.mtx-time-input.mtx-time-input-active{background-color:var(--mtx-datetimepicker-time-input-active-state-background-color);color:var(--mtx-datetimepicker-time-input-active-state-text-color)}.mtx-time-input.mtx-time-input-active:focus{border-color:var(--mtx-datetimepicker-time-input-focus-state-outline-color);background-color:var(--mtx-datetimepicker-time-input-focus-state-background-color)}.mtx-time-input.mtx-time-input-active:focus::placeholder{color:var(--mtx-datetimepicker-time-input-focus-state-placeholder-text-color)}.mtx-time-input.mtx-time-input-warning{border-color:var(--mtx-datetimepicker-time-input-warn-state-outline-color)}.mtx-time-seperator{display:inline-flex;justify-content:center;align-items:center;width:24px;font-size:36px}.mtx-time-ampm{display:inline-flex;flex-direction:column;margin-left:12px}[dir=rtl] .mtx-time-ampm{margin-left:auto;margin-right:12px}.mtx-time-ampm .mtx-time-am,.mtx-time-ampm .mtx-time-pm{--mdc-text-button-label-text-weight: 400;--mdc-text-button-label-text-color: var(--mtx-datetimepicker-time-ampm-text-color);--mdc-text-button-container-shape: var(--mtx-datetimepicker-selector-container-shape);border-color:var(--mtx-datetimepicker-time-ampm-outline-color);flex:1;width:40px;min-width:auto;border-width:1px;border-style:solid}.mtx-time-ampm .mtx-time-am.mtx-time-ampm-active,.mtx-time-ampm .mtx-time-pm.mtx-time-ampm-active{--mdc-text-button-label-text-weight: 500;--mdc-text-button-label-text-color: var(--mtx-datetimepicker-time-ampm-selected-state-text-color);background-color:var(--mtx-datetimepicker-time-ampm-selected-state-background-color)}.mtx-time-ampm .mtx-time-am .mat-mdc-button-touch-target,.mtx-time-ampm .mtx-time-pm .mat-mdc-button-touch-target{height:100%}.mtx-time-ampm .mtx-time-am{border-bottom-left-radius:0;border-bottom-right-radius:0}.mtx-time-ampm .mtx-time-pm{border-top-left-radius:0;border-top-right-radius:0;border-top-width:0}.mtx-time-button-wrapper{display:flex;justify-content:flex-end;padding-top:8px}.mtx-time-button-wrapper .mat-mdc-button-base+.mat-mdc-button-base{margin-left:8px}[dir=rtl] .mtx-time-button-wrapper .mat-mdc-button-base+.mat-mdc-button-base{margin-left:0;margin-right:8px}\n"] }]
        }], ctorParameters: () => [{ type: i1.DatetimeAdapter }, { type: i0.ChangeDetectorRef }, { type: i2.MtxDatetimepickerIntl }], propDecorators: { selectedChange: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2V4dGVuc2lvbnMvZGF0ZXRpbWVwaWNrZXIvdGltZS50cyIsIi4uLy4uLy4uLy4uL3Byb2plY3RzL2V4dGVuc2lvbnMvZGF0ZXRpbWVwaWNrZXIvdGltZS5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxvQkFBb0IsRUFBZSxNQUFNLHVCQUF1QixDQUFDO0FBQzFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDN0QsT0FBTyxFQUVMLGdCQUFnQixFQUNoQix1QkFBdUIsRUFFdkIsU0FBUyxFQUNULFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLEtBQUssRUFHTCxNQUFNLEVBRU4sU0FBUyxFQUNULGlCQUFpQixHQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFJckQsT0FBTyxFQUFFLFFBQVEsRUFBZ0IsTUFBTSxTQUFTLENBQUM7Ozs7QUFLakQsU0FBUyxHQUFHLENBQUMsR0FBZ0IsRUFBRSxJQUFZO0lBQ3pDLEdBQUcsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDbEIsT0FBTyxHQUFHLENBQUMsTUFBTSxHQUFHLElBQUk7UUFBRSxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQztJQUMxQyxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUM7QUFXRCxNQUFNLE9BQU8sWUFBWTtJQUN2QixJQUNJLFlBQVksQ0FBQyxLQUFrQjtRQUNqQyxJQUFJLENBQUMsU0FBUyxHQUFHLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFHRCxJQUNJLE9BQU8sQ0FBQyxLQUFrQjtRQUM1QixJQUFJLENBQUMsSUFBSSxHQUFHLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzFDLENB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RUcsU0FBUztzQkFBakIsS0FBSztnQkFNRixVQUFVO3NCQURiLEtBQUs7Z0JBV0YsUUFBUTtzQkFEWCxLQUFLO2dCQWNGLE9BQU87c0JBRFYsS0FBSztnQkFZRixPQUFPO3NCQURWLEtBQUs7Z0JBV0YsU0FBUztzQkFEWixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY29lcmNlTnVtYmVyUHJvcGVydHksIE51bWJlcklucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7IERPV05fQVJST1csIFVQX0FSUk9XIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcbmltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIGJvb2xlYW5BdHRyaWJ1dGUsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPdXRwdXQsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTWF0QnV0dG9uIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvYnV0dG9uJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbkxpa2UgfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgRGF0ZXRpbWVBZGFwdGVyIH0gZnJvbSAnQG5nLW1hdGVyby9leHRlbnNpb25zL2NvcmUnO1xuaW1wb3J0IHsgTXR4Q2xvY2ssIE10eENsb2NrVmlldyB9IGZyb20gJy4vY2xvY2snO1xuaW1wb3J0IHsgTXR4RGF0ZXRpbWVwaWNrZXJGaWx0ZXJUeXBlIH0gZnJvbSAnLi9kYXRldGltZXBpY2tlci1maWx0ZXJ0eXBlJztcbmltcG9ydCB7IE10eERhdGV0aW1lcGlja2VySW50bCB9IGZyb20gJy4vZGF0ZXRpbWVwaWNrZXItaW50bCc7XG5pbXBvcnQgeyBNdHhBTVBNLCBNdHhUaW1lVmlldyB9IGZyb20gJy4vZGF0ZXRpbWVwaWNrZXItdHlwZXMnO1xuXG5mdW5jdGlvbiBwYWQobnVtOiBOdW1iZXJJbnB1dCwgc2l6ZTogbnVtYmVyKSB7XG4gIG51bSA9IFN0cmluZyhudW0pO1xuICB3aGlsZSAobnVtLmxlbmd0aCA8IHNpemUpIG51bSA9ICcwJyArIG51bTtcbiAgcmV0dXJuIG51bTtcbn1cblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnaW5wdXQubXR4LXRpbWUtaW5wdXQnLFxuICBob3N0OiB7XG4gICAgJyhibHVyKSc6ICdibHVyKCRldmVudCknLFxuICAgICcoZm9jdXMpJzogJ2ZvY3VzKCRldmVudCknLFxuICB9LFxuICBleHBvcnRBczogJ210eFRpbWVJbnB1dCcsXG4gIHN0YW5kYWxvbmU6IHRydWUsXG59KVxuZXhwb3J0IGNsYXNzIE10eFRpbWVJbnB1dCBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIEBJbnB1dCgndGltZUludGVydmFsJylcbiAgc2V0IHRpbWVJbnRlcnZhbCh2YWx1ZTogTnVtYmVySW5wdXQpIHtcbiAgICB0aGlzLl9pbnRlcnZhbCA9IGNvZXJjZU51bWJlclByb3BlcnR5KHZhbHVlKTtcbiAgfVxuICBwcml2YXRlIF9pbnRlcnZhbDogbnVtYmVyID0gMTtcblxuICBASW5wdXQoJ3RpbWVNaW4nKVxuICBzZXQgdGltZU1pbih2YWx1ZTogTnVtYmVySW5wdXQpIHtcbiAgICB0aGlzLl9taW4gPSBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfbWluID0gMDtcblxuICBASW5wdXQoJ3RpbWVNYXgnKVxuICBzZXQgdGltZU1heCh2YWx1ZTogTnVtYmVySW5wdXQpIHtcbiAgICB0aGlzLl9tYXggPSBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfbWF4ID0gSW5maW5pdHk7XG5cbiAgQElucHV0KCd0aW1lVmFsdWUnKVxuICBzZXQgdGltZVZhbHVlKHZhbHVlOiBOdW1iZXJJbnB1dCkge1xuICAgIHRoaXMuX3ZhbHVlID0gY29lcmNlTnVtYmVyUHJvcGVydHkodmFsdWUpO1xuICAgIGlmICghdGhpcy5oYXNGb2N1cykge1xuICAgICAgdGhpcy53cml0ZVZhbHVlKHRoaXMuX3ZhbHVlKTtcbiAgICB9XG4gICAgdGhpcy53cml0ZVBsYWNlaG9sZGVyKHRoaXMuX3ZhbHVlKTtcbiAgfVxuXG4gIEBPdXRwdXQoKSB0aW1lVmFsdWVDaGFuZ2VkID0gbmV3IEV2ZW50RW1pdHRlcjxOdW1iZXJJbnB1dD4oKTtcblxuICBwcml2YXRlIF92YWx1ZTogTnVtYmVySW5wdXQ7XG5cbiAgcHJpdmF0ZSBrZXlEb3duTGlzdGVuZXIgPSB0aGlzLmtleURvd25IYW5kbGVyLmJpbmQodGhpcyk7XG4gIHByaXZhdGUga2V5UHJlc3NMaXN0ZW5lciA9IHRoaXMua2V5UHJlc3NIYW5kbGVyLmJpbmQodGhpcyk7XG4gIHByaXZhdGUgaW5wdXRFdmVudExpc3RlbmVyID0gdGhpcy5pbnB1dENoYW5nZWRIYW5kbGVyLmJpbmQodGhpcyk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBlbGVtZW50OiBFbGVtZW50UmVmLFxuICAgIHByaXZhdGUgY2RyOiBDaGFuZ2VEZXRlY3RvclJlZlxuICApIHtcbiAgICB0aGlzLmlucHV0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5rZXlEb3duTGlzdGVuZXIsIHtcbiAgICAgIHBhc3NpdmU6IHRydWUsXG4gICAgfSk7XG5cbiAgICAvLyBEbyBub3QgcGFzc2l2ZSBzaW5jZSB3ZSB3YW50IHRvIGJlIGFibGUgdG8gcHJldmVudERlZmF1bHQoKVxuICAgIHRoaXMuaW5wdXRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXByZXNzJywgdGhpcy5rZXlQcmVzc0xpc3RlbmVyKTtcbiAgICB0aGlzLmlucHV0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIHRoaXMuaW5wdXRFdmVudExpc3RlbmVyLCB7XG4gICAgICBwYXNzaXZlOiB0cnVlLFxuICAgIH0pO1xuICB9XG5cbiAgZ2V0IGhhc0ZvY3VzKCkge1xuICAgIHJldHVybiB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudCAmJiB0aGlzLmVsZW1lbnQ/Lm5hdGl2ZUVsZW1lbnQgPT09IGRvY3VtZW50Py5hY3RpdmVFbGVtZW50O1xuICB9XG5cbiAgZ2V0IGlucHV0RWxlbWVudCgpIHtcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgfVxuXG4gIC8vIFdlIGxvb2sgaGVyZSBhdCB0aGUgcGxhY2Vob2xkZXIgdmFsdWUsIGJlY2F1c2Ugd2Ugd3JpdGUgJycgaW50byB0aGUgdmFsdWUgb24gZm9jdXNcbiAgLy8gcGxhY2Vob2xkZXIgc2hvdWxkIGFsd2F5cyBiZSB1cCB0byBkYXRlIHdpdGggXCJjdXJyZW50VmFsdWVcIlxuICBnZXQgdmFsaWQoKSB7XG4gICAgLy8gQXQgdGhlIHN0YXJ0IF92YWx1ZSBpcyB1bmRlZmluZWQgdGhlcmVmb3JlIHRoaXMgd291bGQgcmVzdWx0IGluIG5vdCB2YWxpZCBhbmRcbiAgICAvLyBtYWtlIGEgdWdseSB3YXJuaW5nIGJvcmRlciBhZnRlcndhcmRzIHdlIGNhbiBzYWZlbHkgY2hlY2tcbiAgICBpZiAodGhpcy5fdmFsdWUpIHtcbiAgICAgIGNvbnN0IGN1cnJlbnRWYWx1ZSA9IFN0cmluZyh0aGlzLmlucHV0RWxlbWVudC52YWx1ZSk7XG5cbiAgICAgIC8vIEl0IGNhbiBiZSB0aGF0IGN1cnJlbnRWYWx1ZSBpcyBlbXB0eSBkdWUgdG8gd2UgcmVtb3ZpbmcgdGhlIHZhbHVlIG9uIGZvY3VzLFxuICAgICAgLy8gaWYgdGhhdCBpcyB0aGUgY2FzZSB3ZSBzaG91bGQgY2hlY2sgcHJldmlvdXMgdmFsdWUgd2hpY2ggc2hvdWxkIGJlIGluIHRoZSBwbGFjZWhvbGRlclxuICAgICAgaWYgKGN1cnJlbnRWYWx1ZS5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbHVlID09IHRoaXMuaW5wdXRFbGVtZW50LnZhbHVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbHVlID09IHRoaXMuaW5wdXRFbGVtZW50LnBsYWNlaG9sZGVyO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGdldCBpbnZhbGlkKCkge1xuICAgIHJldHVybiAhdGhpcy52YWxpZDtcbiAgfVxuXG4gIGJsdXIoKSB7XG4gICAgdGhpcy53cml0ZVZhbHVlKHRoaXMuX3ZhbHVlKTtcbiAgICB0aGlzLndyaXRlUGxhY2Vob2xkZXIodGhpcy5fdmFsdWUpO1xuICAgIHRoaXMudGltZVZhbHVlQ2hhbmdlZC5lbWl0KHRoaXMuX3ZhbHVlKTtcbiAgfVxuXG4gIGZvY3VzKCkge1xuICAgIHRoaXMud3JpdGVWYWx1ZSgnJyk7XG4gIH1cblxuICAvKipcbiAgICogV3JpdGUgdmFsdWUgdG8gaW5wdXRFbGVtZW50XG4gICAqIEBwYXJhbSB2YWx1ZSBOdW1iZXJJbnB1dFxuICAgKi9cbiAgd3JpdGVWYWx1ZSh2YWx1ZTogTnVtYmVySW5wdXQpIHtcbiAgICBpZiAodmFsdWUgIT09ICcnKSB7XG4gICAgICB0aGlzLmlucHV0RWxlbWVudC52YWx1ZSA9IHBhZCh2YWx1ZSwgMik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaW5wdXRFbGVtZW50LnZhbHVlID0gJyc7XG4gICAgfVxuICAgIHRoaXMuY2RyLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFdyaXRlcyB2YWx1ZSB0byBwbGFjZWhvbGRlclxuICAgKiBAcGFyYW0gdmFsdWUgTnVtYmVySW5wdXRcbiAgICovXG4gIHdyaXRlUGxhY2Vob2xkZXIodmFsdWU6IE51bWJlcklucHV0KSB7XG4gICAgdGhpcy5pbnB1dEVsZW1lbnQucGxhY2Vob2xkZXIgPSBwYWQodmFsdWUsIDIpO1xuICAgIHRoaXMuY2RyLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAga2V5RG93bkhhbmRsZXIoZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICBpZiAoU3RyaW5nKHRoaXMuaW5wdXRFbGVtZW50LnZhbHVlKS5sZW5ndGggPiAwKSB7XG4gICAgICBsZXQgdmFsdWU6IG51bWJlciB8IG51bGwgPSBudWxsO1xuICAgICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IFVQX0FSUk9XKSB7XG4gICAgICAgIHZhbHVlID0gY29lcmNlTnVtYmVyUHJvcGVydHkodGhpcy5fdmFsdWUpO1xuICAgICAgICB2YWx1ZSArPSB0aGlzLl9pbnRlcnZhbDtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICB9IGVsc2UgaWYgKGV2ZW50LmtleUNvZGUgPT09IERPV05fQVJST1cpIHtcbiAgICAgICAgdmFsdWUgPSBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh0aGlzLl92YWx1ZSk7XG4gICAgICAgIHZhbHVlIC09IHRoaXMuX2ludGVydmFsO1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIH1cblxuICAgICAgLy8gaWYgdmFsdWUgaGFzIGNoYW5nZWRcbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgICAgIHRoaXMud3JpdGVWYWx1ZSh2YWx1ZSk7XG4gICAgICAgIHRoaXMud3JpdGVQbGFjZWhvbGRlcih2YWx1ZSk7XG4gICAgICAgIHRoaXMuY2xhbXBJbnB1dFZhbHVlKCk7XG4gICAgICAgIHRoaXMudGltZVZhbHVlQ2hhbmdlZC5lbWl0KHRoaXMuX3ZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUHJldmVudCBub24gbnVtYmVyIGlucHV0cyBpbiB0aGUgaW5wdXRFbGVtZW50IHdpdGggdGhlIGV4Y2VwdGlvbiBvZiBFbnRlci9CYWNrU3BhY2VcbiAgICogQHBhcmFtIGV2ZW50IEtleWJvYXJkRXZlbnRcbiAgICovXG4gIGtleVByZXNzSGFuZGxlcihldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgIGNvbnN0IGtleSA9IGV2ZW50Py5rZXkgPz8gbnVsbDtcbiAgICBpZiAoaXNOYU4oTnVtYmVyKGtleSkpICYmIGtleSAhPT0gJ0VudGVyJykge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG4gIH1cblxuICBpbnB1dENoYW5nZWRIYW5kbGVyKCkge1xuICAgIHRoaXMuY2xhbXBJbnB1dFZhbHVlKCk7XG4gICAgdGhpcy50aW1lVmFsdWVDaGFuZ2VkLmVtaXQodGhpcy5fdmFsdWUpO1xuICB9XG5cbiAgY2xhbXBJbnB1dFZhbHVlKCkge1xuICAgIGlmICh0aGlzLmlucHV0RWxlbWVudD8udmFsdWUgPT09ICcnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgdmFsdWUgPSBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh0aGlzLmlucHV0RWxlbWVudD8udmFsdWUgPz8gbnVsbCk7XG4gICAgLy8gaWYgdGhpcy5fbWluID09PSAwLCB3ZSBzaG91bGQgYWxsb3cgMFxuICAgIGlmICh2YWx1ZSB8fCAodGhpcy5fbWluID09PSAwICYmIHZhbHVlID09PSAwKSkge1xuICAgICAgY29uc3QgY2xhbXBlZFZhbHVlID0gTWF0aC5taW4oTWF0aC5tYXgodmFsdWUsIHRoaXMuX21pbiksIHRoaXMuX21heCk7XG4gICAgICBpZiAoY2xhbXBlZFZhbHVlICE9PSB2YWx1ZSkge1xuICAgICAgICB0aGlzLndyaXRlVmFsdWUoY2xhbXBlZFZhbHVlKTtcbiAgICAgICAgdGhpcy53cml0ZVBsYWNlaG9sZGVyKGNsYW1wZWRWYWx1ZSk7XG4gICAgICB9XG4gICAgICB0aGlzLl92YWx1ZSA9IGNsYW1wZWRWYWx1ZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGV2ZW50IGxpc3RlbmVycyBvbiBkZXN0cnVjdGlvblxuICAgKi9cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5pbnB1dEVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMua2V5RG93bkxpc3RlbmVyKTtcbiAgICB0aGlzLmlucHV0RWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlwcmVzcycsIHRoaXMua2V5UHJlc3NMaXN0ZW5lcik7XG4gICAgdGhpcy5pbnB1dEVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignaW5wdXQnLCB0aGlzLmlucHV0RXZlbnRMaXN0ZW5lcik7XG4gIH1cbn1cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbXR4LXRpbWUnLFxuICB0ZW1wbGF0ZVVybDogJ3RpbWUuaHRtbCcsXG4gIHN0eWxlVXJsOiAndGltZS5zY3NzJyxcbiAgZXhwb3J0QXM6ICdtdHhUaW1lJyxcbiAgaG9zdDoge1xuICAgIGNsYXNzOiAnbXR4LXRpbWUnLFxuICB9LFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbiAgaW1wb3J0czogW01hdEJ1dHRvbiwgTXR4Q2xvY2ssIE10eFRpbWVJbnB1dF0sXG59KVxuZXhwb3J0IGNsYXNzIE10eFRpbWU8RD4gaW1wbGVtZW50cyBPbkNoYW5nZXMsIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG4gIC8qKiBFbWl0cyB3aGVuIHRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgZGF0ZSBjaGFuZ2VzLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgc2VsZWN0ZWRDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPEQ+KCk7XG5cbiAgLyoqIEVtaXRzIHdoZW4gYW55IGRhdGUgY2hhbmdlcy4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGFjdGl2ZURhdGVDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPEQ+KCk7XG5cbiAgLyoqIEVtaXRzIHdoZW4gYW55IGRhdGUgaXMgc2VsZWN0ZWQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBfdXNlclNlbGVjdGlvbiA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcblxuICAvKiogRW1pdHMgd2hlbiBBTS9QTSBidXR0b24gYXJlIGNsaWNrZWQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBhbXBtQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxNdHhBTVBNPigpO1xuXG4gIC8qKiBFbWl0cyB3aGVuIEFNL1BNIGJ1dHRvbiBhcmUgY2xpY2tlZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGNsb2NrVmlld0NoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8TXR4Q2xvY2tWaWV3PigpO1xuXG4gIC8qKiBBIGZ1bmN0aW9uIHVzZWQgdG8gZmlsdGVyIHdoaWNoIGRhdGVzIGFyZSBzZWxlY3RhYmxlLiAqL1xuICBASW5wdXQoKSBkYXRlRmlsdGVyITogKGRhdGU6IEQsIHR5cGU6IE10eERhdGV0aW1lcGlja2VyRmlsdGVyVHlwZSkgPT4gYm9vbGVhbjtcblxuICAvKiogU3RlcCBvdmVyIG1pbnV0ZXMuICovXG4gIEBJbnB1dCgpIGludGVydmFsOiBudW1iZXIgPSAxO1xuXG4gIEBWaWV3Q2hpbGQoJ2hvdXJJbnB1dCcsIHsgcmVhZDogRWxlbWVudFJlZjxIVE1MSW5wdXRFbGVtZW50PiB9KVxuICBwcm90ZWN0ZWQgaG91cklucHV0RWxlbWVudDogRWxlbWVudFJlZjxIVE1MSW5wdXRFbGVtZW50PiB8IHVuZGVmaW5lZDtcblxuICBAVmlld0NoaWxkKCdob3VySW5wdXQnLCB7IHJlYWQ6IE10eFRpbWVJbnB1dCB9KVxuICBwcm90ZWN0ZWQgaG91cklucHV0RGlyZWN0aXZlOiBNdHhUaW1lSW5wdXQgfCB1bmRlZmluZWQ7XG5cbiAgQFZpZXdDaGlsZCgnbWludXRlSW5wdXQnLCB7IHJlYWQ6IEVsZW1lbnRSZWY8SFRNTElucHV0RWxlbWVudD4gfSlcbiAgcHJvdGVjdGVkIG1pbnV0ZUlucHV0RWxlbWVudDogRWxlbWVudFJlZjxIVE1MSW5wdXRFbGVtZW50PiB8IHVuZGVmaW5lZDtcblxuICBAVmlld0NoaWxkKCdtaW51dGVJbnB1dCcsIHsgcmVhZDogTXR4VGltZUlucHV0IH0pXG4gIHByb3RlY3RlZCBtaW51dGVJbnB1dERpcmVjdGl2ZTogTXR4VGltZUlucHV0IHwgdW5kZWZpbmVkO1xuXG4gIGRhdGV0aW1lcGlja2VySW50bENoYW5nZXNTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbkxpa2U7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNsb2NrIHVzZXMgMTIgaG91ciBmb3JtYXQuICovXG4gIEBJbnB1dCh7IHRyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZSB9KSB0d2VsdmVob3VyID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHRpbWUgaXMgbm93IGluIEFNIG9yIFBNLiAqL1xuICBASW5wdXQoKSBBTVBNOiBNdHhBTVBNID0gJ0FNJztcblxuICBASW5wdXQoKSB0aW1lSW5wdXQ6IE10eFRpbWVWaWV3ID0gJ2RpYWwnO1xuXG4gIC8qKlxuICAgKiBUaGUgZGF0ZSB0byBkaXNwbGF5IGluIHRoaXMgY2xvY2sgdmlldy5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCBhY3RpdmVEYXRlKCk6IEQge1xuICAgIHJldHVybiB0aGlzLl9hY3RpdmVEYXRlO1xuICB9XG4gIHNldCBhY3RpdmVEYXRlKHZhbHVlOiBEKSB7XG4gICAgdGhpcy5fYWN0aXZlRGF0ZSA9IHRoaXMuX2FkYXB0ZXIuY2xhbXBEYXRlKHZhbHVlLCB0aGlzLm1pbkRhdGUsIHRoaXMubWF4RGF0ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfYWN0aXZlRGF0ZSE6IEQ7XG5cbiAgLyoqIFRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgZGF0ZS4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHNlbGVjdGVkKCk6IEQgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5fc2VsZWN0ZWQ7XG4gIH1cbiAgc2V0IHNlbGVjdGVkKHZhbHVlOiBEIHwgbnVsbCkge1xuICAgIHRoaXMuX3NlbGVjdGVkID0gdGhpcy5fYWRhcHRlci5nZXRWYWxpZERhdGVPck51bGwodGhpcy5fYWRhcHRlci5kZXNlcmlhbGl6ZSh2YWx1ZSkpO1xuICAgIGlmICh0aGlzLl9zZWxlY3RlZCkge1xuICAgICAgdGhpcy5hY3RpdmVEYXRlID0gdGhpcy5fc2VsZWN0ZWQ7XG4gICAgfVxuICB9XG4gIHByaXZhdGUgX3NlbGVjdGVkITogRCB8IG51bGw7XG5cbiAgLyoqIFRoZSBtaW5pbXVtIHNlbGVjdGFibGUgZGF0ZS4gKi9cbiAgQElucHV0KClcbiAgZ2V0IG1pbkRhdGUoKTogRCB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLl9taW5EYXRlO1xuICB9XG5cbiAgc2V0IG1pbkRhdGUodmFsdWU6IEQgfCBudWxsKSB7XG4gICAgdGhpcy5fbWluRGF0ZSA9IHRoaXMuX2FkYXB0ZXIuZ2V0VmFsaWREYXRlT3JOdWxsKHRoaXMuX2FkYXB0ZXIuZGVzZXJpYWxpemUodmFsdWUpKTtcbiAgfVxuICBwcml2YXRlIF9taW5EYXRlITogRCB8IG51bGw7XG5cbiAgLyoqIFRoZSBtYXhpbXVtIHNlbGVjdGFibGUgZGF0ZS4gKi9cbiAgQElucHV0KClcbiAgZ2V0IG1heERhdGUoKTogRCB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLl9tYXhEYXRlO1xuICB9XG4gIHNldCBtYXhEYXRlKHZhbHVlOiBEIHwgbnVsbCkge1xuICAgIHRoaXMuX21heERhdGUgPSB0aGlzLl9hZGFwdGVyLmdldFZhbGlkRGF0ZU9yTnVsbCh0aGlzLl9hZGFwdGVyLmRlc2VyaWFsaXplKHZhbHVlKSk7XG4gIH1cbiAgcHJpdmF0ZSBfbWF4RGF0ZSE6IEQgfCBudWxsO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBjbG9jayBzaG91bGQgYmUgc3RhcnRlZCBpbiBob3VyIG9yIG1pbnV0ZSB2aWV3LiAqL1xuICBASW5wdXQoKVxuICBnZXQgY2xvY2tWaWV3KCkge1xuICAgIHJldHVybiB0aGlzLl9jbG9ja1ZpZXc7XG4gIH1cbiAgc2V0IGNsb2NrVmlldyh2YWx1ZTogTXR4Q2xvY2tWaWV3KSB7XG4gICAgdGhpcy5fY2xvY2tWaWV3ID0gdmFsdWU7XG4gIH1cbiAgLyoqIFdoZXRoZXIgdGhlIGNsb2NrIGlzIGluIGhvdXIgdmlldy4gKi9cbiAgcHJpdmF0ZSBfY2xvY2tWaWV3OiBNdHhDbG9ja1ZpZXcgPSAnaG91cic7XG5cbiAgZ2V0IGlzSG91clZpZXcoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Nsb2NrVmlldyA9PT0gJ2hvdXInO1xuICB9XG5cbiAgZ2V0IGlzTWludXRlVmlldygpIHtcbiAgICByZXR1cm4gdGhpcy5fY2xvY2tWaWV3ID09PSAnaG91cic7XG4gIH1cblxuICBnZXQgaG91cigpIHtcbiAgICBpZiAoIXRoaXMuYWN0aXZlRGF0ZSkge1xuICAgICAgaWYgKHRoaXMudHdlbHZlaG91cikge1xuICAgICAgICByZXR1cm4gJzEyJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiAnMDAnO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGhvdXIgPSBOdW1iZXIodGhpcy5fYWRhcHRlci5nZXRIb3VyKHRoaXMuYWN0aXZlRGF0ZSkpO1xuICAgIGlmICghdGhpcy50d2VsdmVob3VyKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcmVmaXhXaXRoWmVybyhob3VyKTtcbiAgICB9XG5cbiAgICBpZiAoaG91ciA9PT0gMCkge1xuICAgICAgcmV0dXJuICcxMic7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLnByZWZpeFdpdGhaZXJvKGhvdXIgPiAxMiA/IGhvdXIgLSAxMiA6IGhvdXIpO1xuICAgIH1cbiAgfVxuXG4gIGdldCBtaW51dGUoKSB7XG4gICAgaWYgKHRoaXMuYWN0aXZlRGF0ZSkge1xuICAgICAgcmV0dXJuIHRoaXMucHJlZml4V2l0aFplcm8odGhpcy5fYWRhcHRlci5nZXRNaW51dGUodGhpcy5hY3RpdmVEYXRlKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuICcwMCc7XG4gIH1cblxuICBwcmVmaXhXaXRoWmVybyh2YWx1ZTogbnVtYmVyKSB7XG4gICAgaWYgKHZhbHVlIDwgMTApIHtcbiAgICAgIHJldHVybiAnMCcgKyBTdHJpbmcodmFsdWUpO1xuICAgIH1cblxuICAgIHJldHVybiBTdHJpbmcodmFsdWUpO1xuICB9XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfYWRhcHRlcjogRGF0ZXRpbWVBZGFwdGVyPEQ+LFxuICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcm90ZWN0ZWQgX2RhdGV0aW1lcGlja2VySW50bDogTXR4RGF0ZXRpbWVwaWNrZXJJbnRsXG4gICkge1xuICAgIHRoaXMuZGF0ZXRpbWVwaWNrZXJJbnRsQ2hhbmdlc1N1YnNjcmlwdGlvbiA9IHRoaXMuX2RhdGV0aW1lcGlja2VySW50bC5jaGFuZ2VzLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgfSk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgLy8gd2hlbiBjbG9ja1ZpZXcgY2hhbmdlcyBieSBpbnB1dCB3ZSBzaG91bGQgZm9jdXMgdGhlIGNvcnJlY3QgaW5wdXRcbiAgICBpZiAoY2hhbmdlcy5jbG9ja1ZpZXcpIHtcbiAgICAgIGlmIChjaGFuZ2VzLmNsb2NrVmlldy5jdXJyZW50VmFsdWUgIT09IGNoYW5nZXMuY2xvY2tWaWV3LnByZXZpb3VzVmFsdWUpIHtcbiAgICAgICAgdGhpcy5mb2N1c0lucHV0RWxlbWVudCgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLmZvY3VzSW5wdXRFbGVtZW50KCk7XG4gIH1cblxuICBmb2N1c0lucHV0RWxlbWVudCgpIHtcbiAgICBpZiAodGhpcy5jbG9ja1ZpZXcgPT09ICdob3VyJykge1xuICAgICAgaWYgKHRoaXMuaG91cklucHV0RWxlbWVudCkge1xuICAgICAgICB0aGlzLmhvdXJJbnB1dEVsZW1lbnQubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy5taW51dGVJbnB1dEVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy5taW51dGVJbnB1dEVsZW1lbnQubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZUhvdXJJbnB1dENoYW5nZSh2YWx1ZTogTnVtYmVySW5wdXQpIHtcbiAgICBjb25zdCBob3VyID0gY29lcmNlTnVtYmVyUHJvcGVydHkodmFsdWUpO1xuICAgIGlmIChob3VyIHx8IGhvdXIgPT09IDApIHtcbiAgICAgIGNvbnN0IG5ld1ZhbHVlID0gdGhpcy5fYWRhcHRlci5jcmVhdGVEYXRldGltZShcbiAgICAgICAgdGhpcy5fYWRhcHRlci5nZXRZZWFyKHRoaXMuYWN0aXZlRGF0ZSksXG4gICAgICAgIHRoaXMuX2FkYXB0ZXIuZ2V0TW9udGgodGhpcy5hY3RpdmVEYXRlKSxcbiAgICAgICAgdGhpcy5fYWRhcHRlci5nZXREYXRlKHRoaXMuYWN0aXZlRGF0ZSksXG4gICAgICAgIHRoaXMudXBkYXRlSG91ckZvckFtUG0oaG91ciksXG4gICAgICAgIHRoaXMuX2FkYXB0ZXIuZ2V0TWludXRlKHRoaXMuYWN0aXZlRGF0ZSlcbiAgICAgICk7XG5cbiAgICAgIHRoaXMuX2FjdGl2ZURhdGUgPSB0aGlzLl9hZGFwdGVyLmNsYW1wRGF0ZShuZXdWYWx1ZSwgdGhpcy5taW5EYXRlLCB0aGlzLm1heERhdGUpO1xuICAgICAgdGhpcy5hY3RpdmVEYXRlQ2hhbmdlLmVtaXQodGhpcy5hY3RpdmVEYXRlKTtcblxuICAgICAgLy8gSWYgcHJldmlvdXNseSB3ZSBkaWQgc2V0IFttdHhWYWx1ZV09XCIxM1wiIGFuZCB0aGUgaW5wdXQgY2hhbmdlZCB0byA2LCBhbmQgdGhlIGNsYW1waW5nXG4gICAgICAvLyB3aWxsIG1ha2UgaXQgXCIxM1wiIGFnYWluIHRoZW4gdGhlIGhvdXJJbnB1dERpcmVjdGl2ZSB3aWxsIG5vdCBoYXZlIGJlZW4gdXBkYXRlZFxuICAgICAgLy8gc2luY2UgXCIxM1wiID09PSBcIjEzXCIgc2FtZSByZWZlcmVuY2Ugc28gbm8gY2hhbmdlIGRldGVjdGVkIGJ5IGRpcmVjdGx5IHNldHRpbmcgaXQgd2l0aGluXG4gICAgICAvLyB0aGlzIGhhbmRsZXIsIHdlIGhhbmRsZSB0aGlzIHVzZWNhc2VcbiAgICAgIGlmICh0aGlzLmhvdXJJbnB1dERpcmVjdGl2ZSkge1xuICAgICAgICB0aGlzLmhvdXJJbnB1dERpcmVjdGl2ZS50aW1lVmFsdWUgPSB0aGlzLmhvdXI7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlSG91ckZvckFtUG0odmFsdWU6IG51bWJlcikge1xuICAgIGlmICghdGhpcy50d2VsdmVob3VyKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgLy8gdmFsdWUgc2hvdWxkIGJlIGJldHdlZW4gMS0xMlxuICAgIGlmICh0aGlzLkFNUE0gPT09ICdBTScpIHtcbiAgICAgIGlmICh2YWx1ZSA9PT0gMCB8fCB2YWx1ZSA9PT0gMTIpIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgICB9XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuICAgIC8vIFBNXG4gICAgZWxzZSB7XG4gICAgICBpZiAodmFsdWUgPT09IDAgfHwgdmFsdWUgPT09IDEyKSB7XG4gICAgICAgIHJldHVybiAxMjtcbiAgICAgIH1cblxuICAgICAgLy8gb3RoZXIgY2FzZXMsIHdlIHNob3VsZCBhZGQgMTIgdG8gdGhlIHZhbHVlIGFrYSAzOjAwIFBNID0gMyArIDEyID0gMTU6MDBcbiAgICAgIHJldHVybiB2YWx1ZSArIDEyO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZU1pbnV0ZUlucHV0Q2hhbmdlKHZhbHVlOiBOdW1iZXJJbnB1dCkge1xuICAgIGNvbnN0IG1pbnV0ZSA9IGNvZXJjZU51bWJlclByb3BlcnR5KHZhbHVlKTtcbiAgICBpZiAobWludXRlIHx8IG1pbnV0ZSA9PT0gMCkge1xuICAgICAgY29uc3QgbmV3VmFsdWUgPSB0aGlzLl9hZGFwdGVyLmNyZWF0ZURhdGV0aW1lKFxuICAgICAgICB0aGlzLl9hZGFwdGVyLmdldFllYXIodGhpcy5hY3RpdmVEYXRlKSxcbiAgICAgICAgdGhpcy5fYWRhcHRlci5nZXRNb250aCh0aGlzLmFjdGl2ZURhdGUpLFxuICAgICAgICB0aGlzLl9hZGFwdGVyLmdldERhdGUodGhpcy5hY3RpdmVEYXRlKSxcbiAgICAgICAgdGhpcy5fYWRhcHRlci5nZXRIb3VyKHRoaXMuX2FjdGl2ZURhdGUpLFxuICAgICAgICBtaW51dGVcbiAgICAgICk7XG4gICAgICB0aGlzLl9hY3RpdmVEYXRlID0gdGhpcy5fYWRhcHRlci5jbGFtcERhdGUobmV3VmFsdWUsIHRoaXMubWluRGF0ZSwgdGhpcy5tYXhEYXRlKTtcbiAgICAgIHRoaXMuYWN0aXZlRGF0ZUNoYW5nZS5lbWl0KHRoaXMuYWN0aXZlRGF0ZSk7XG5cbiAgICAgIC8vIElmIHByZXZpb3VzbHkgd2UgZGlkIHNldCBbbXR4VmFsdWVdPVwiNDBcIiBhbmQgdGhlIGlucHV0IGNoYW5nZWQgdG8gMzAsIGFuZCB0aGUgY2xhbXBpbmdcbiAgICAgIC8vIHdpbGwgbWFrZSBpdCBcIjQwXCIgYWdhaW4gdGhlbiB0aGUgbWludXRlSW5wdXREaXJlY3RpdmUgd2lsbCBub3QgaGF2ZSBiZWVuIHVwZGF0ZWRcbiAgICAgIC8vIHNpbmNlIFwiNDBcIiA9PT0gXCI0MFwiIHNhbWUgcmVmZXJlbmNlIHNvIG5vIGNoYW5nZSBkZXRlY3RlZCBieSBkaXJlY3RseSBzZXR0aW5nIGl0IHdpdGhpblxuICAgICAgLy8gdGhpcyBoYW5kbGVyLCB3ZSBoYW5kbGUgdGhpcyB1c2VjYXNlXG4gICAgICBpZiAodGhpcy5taW51dGVJbnB1dERpcmVjdGl2ZSkge1xuICAgICAgICB0aGlzLm1pbnV0ZUlucHV0RGlyZWN0aXZlLnRpbWVWYWx1ZSA9IHRoaXMubWludXRlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZUZvY3VzKGNsb2NrVmlldzogTXR4Q2xvY2tWaWV3KSB7XG4gICAgdGhpcy5jbG9ja1ZpZXcgPSBjbG9ja1ZpZXc7XG4gICAgdGhpcy5jbG9ja1ZpZXdDaGFuZ2UuZW1pdChjbG9ja1ZpZXcpO1xuICB9XG5cbiAgX3RpbWVTZWxlY3RlZChkYXRlOiBEKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuY2xvY2tWaWV3ID09PSAnaG91cicpIHtcbiAgICAgIHRoaXMuY2xvY2tWaWV3ID0gJ21pbnV0ZSc7XG4gICAgfVxuICAgIHRoaXMuX2FjdGl2ZURhdGUgPSB0aGlzLnNlbGVjdGVkID0gZGF0ZTtcbiAgfVxuXG4gIF9vbkFjdGl2ZURhdGVDaGFuZ2UoZGF0ZTogRCkge1xuICAgIHRoaXMuX2FjdGl2ZURhdGUgPSBkYXRlO1xuICAgIHRoaXMuYWN0aXZlRGF0ZUNoYW5nZS5lbWl0KGRhdGUpO1xuICB9XG5cbiAgaGFuZGxlT2soKSB7XG4gICAgaWYgKHRoaXMuX3NlbGVjdGVkKSB7XG4gICAgICB0aGlzLnNlbGVjdGVkQ2hhbmdlLmVtaXQodGhpcy5fc2VsZWN0ZWQpO1xuICAgIH1cbiAgICB0aGlzLl91c2VyU2VsZWN0aW9uLmVtaXQoKTtcbiAgfVxuXG4gIGhhbmRsZUNhbmNlbCgpIHtcbiAgICB0aGlzLl91c2VyU2VsZWN0aW9uLmVtaXQoKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmRhdGV0aW1lcGlja2VySW50bENoYW5nZXNTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMuZGF0ZXRpbWVwaWNrZXJJbnRsQ2hhbmdlc1N1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgfVxufVxuIiwiPGRpdiBjbGFzcz1cIm10eC10aW1lLWlucHV0LXdyYXBwZXJcIj5cbiAgPGRpdiBjbGFzcz1cIm10eC10aW1lLWlucHV0LWlubmVyXCI+XG4gICAgPGlucHV0IGNsYXNzPVwibXR4LXRpbWUtaW5wdXRcIlxuICAgICAgW2NsYXNzLm10eC10aW1lLWlucHV0LWFjdGl2ZV09XCJjbG9ja1ZpZXcgPT09ICdob3VyJ1wiXG4gICAgICBbY2xhc3MubXR4LXRpbWUtaW5wdXQtd2FybmluZ109XCIhaG91cklucHV0LnZhbGlkXCJcbiAgICAgICNob3VySW5wdXQ9XCJtdHhUaW1lSW5wdXRcIlxuICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgaW5wdXRtb2RlPVwibnVtZXJpY1wiXG4gICAgICBtYXhsZW5ndGg9XCIyXCJcbiAgICAgIFt0aW1lTWluXT1cInR3ZWx2ZWhvdXIgPyAxIDogMFwiXG4gICAgICBbdGltZU1heF09XCJ0d2VsdmVob3VyID8gMTIgOiAyM1wiXG4gICAgICBbdGltZVZhbHVlXT1cImhvdXJcIlxuICAgICAgKHRpbWVWYWx1ZUNoYW5nZWQpPVwiaGFuZGxlSG91cklucHV0Q2hhbmdlKCRldmVudClcIlxuICAgICAgKGZvY3VzKT1cImhhbmRsZUZvY3VzKCdob3VyJylcIiAvPlxuXG4gICAgPGRpdiBjbGFzcz1cIm10eC10aW1lLXNlcGVyYXRvclwiPjo8L2Rpdj5cblxuICAgIDxpbnB1dCBjbGFzcz1cIm10eC10aW1lLWlucHV0XCJcbiAgICAgIFtjbGFzcy5tdHgtdGltZS1pbnB1dC1hY3RpdmVdPVwiY2xvY2tWaWV3ID09PSAnbWludXRlJ1wiXG4gICAgICBbY2xhc3MubXR4LXRpbWUtaW5wdXQtd2FybmluZ109XCIhbWludXRlSW5wdXQudmFsaWRcIlxuICAgICAgI21pbnV0ZUlucHV0PVwibXR4VGltZUlucHV0XCJcbiAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgIGlucHV0bW9kZT1cIm51bWVyaWNcIlxuICAgICAgbWF4bGVuZ3RoPVwiMlwiXG4gICAgICBbdGltZU1pbl09XCIwXCJcbiAgICAgIFt0aW1lTWF4XT1cIjU5XCJcbiAgICAgIFt0aW1lVmFsdWVdPVwibWludXRlXCJcbiAgICAgICh0aW1lVmFsdWVDaGFuZ2VkKT1cImhhbmRsZU1pbnV0ZUlucHV0Q2hhbmdlKCRldmVudClcIlxuICAgICAgW3RpbWVJbnRlcnZhbF09XCJpbnRlcnZhbFwiXG4gICAgICAoZm9jdXMpPVwiaGFuZGxlRm9jdXMoJ21pbnV0ZScpXCIgLz5cblxuICAgIEBpZiAodHdlbHZlaG91cikge1xuICAgICAgPGRpdiBjbGFzcz1cIm10eC10aW1lLWFtcG1cIj5cbiAgICAgICAgPGJ1dHRvbiBtYXQtYnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cIm10eC10aW1lLWFtXCJcbiAgICAgICAgICBbY2xhc3MubXR4LXRpbWUtYW1wbS1hY3RpdmVdPVwiQU1QTSA9PT0gJ0FNJ1wiIGFyaWEtbGFiZWw9XCJBTVwiXG4gICAgICAgICAgKGtleWRvd24pPVwiJGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXCJcbiAgICAgICAgKGNsaWNrKT1cImFtcG1DaGFuZ2UuZW1pdCgnQU0nKVwiPkFNPC9idXR0b24+XG4gICAgICAgIDxidXR0b24gbWF0LWJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJtdHgtdGltZS1wbVwiXG4gICAgICAgICAgW2NsYXNzLm10eC10aW1lLWFtcG0tYWN0aXZlXT1cIkFNUE0gPT09ICdQTSdcIiBhcmlhLWxhYmVsPVwiUE1cIlxuICAgICAgICAgIChrZXlkb3duKT1cIiRldmVudC5zdG9wUHJvcGFnYXRpb24oKVwiXG4gICAgICAgIChjbGljayk9XCJhbXBtQ2hhbmdlLmVtaXQoJ1BNJylcIj5QTTwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgfVxuICA8L2Rpdj5cbjwvZGl2PlxuXG5AaWYgKHRpbWVJbnB1dCAhPT0gJ2lucHV0Jykge1xuICA8bXR4LWNsb2NrIChzZWxlY3RlZENoYW5nZSk9XCJfdGltZVNlbGVjdGVkKCRldmVudClcIlxuICAgIChhY3RpdmVEYXRlQ2hhbmdlKT1cIl9vbkFjdGl2ZURhdGVDaGFuZ2UoJGV2ZW50KVwiXG4gICAgW0FNUE1dPVwiQU1QTVwiXG4gICAgW2RhdGVGaWx0ZXJdPVwiZGF0ZUZpbHRlclwiXG4gICAgW2ludGVydmFsXT1cImludGVydmFsXCJcbiAgICBbbWF4RGF0ZV09XCJtYXhEYXRlXCJcbiAgICBbbWluRGF0ZV09XCJtaW5EYXRlXCJcbiAgICBbc2VsZWN0ZWRdPVwic2VsZWN0ZWRcIlxuICAgIFtzdGFydFZpZXddPVwiY2xvY2tWaWV3XCJcbiAgICBbdHdlbHZlaG91cl09XCJ0d2VsdmVob3VyXCI+XG4gIDwvbXR4LWNsb2NrPlxufVxuXG48ZGl2IGNsYXNzPVwibXR4LXRpbWUtYnV0dG9uLXdyYXBwZXJcIj5cbiAgPGJ1dHRvbiBjbGFzcz1cIm10eC10aW1lLWNhbmNlbC1idXR0b25cIiBtYXQtYnV0dG9uIHR5cGU9XCJidXR0b25cIiAoY2xpY2spPVwiaGFuZGxlQ2FuY2VsKClcIj5cbiAgICB7eyBfZGF0ZXRpbWVwaWNrZXJJbnRsLmNhbmNlbExhYmVsIH19XG4gIDwvYnV0dG9uPlxuICA8YnV0dG9uIGNsYXNzPVwibXR4LXRpbWUtb2stYnV0dG9uXCIgbWF0LWJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgKGNsaWNrKT1cImhhbmRsZU9rKClcIlxuICAgIFtkaXNhYmxlZF09XCJtaW51dGVJbnB1dERpcmVjdGl2ZT8uaW52YWxpZCB8fCBob3VySW5wdXREaXJlY3RpdmU/LmludmFsaWRcIj5cbiAgICB7eyBfZGF0ZXRpbWVwaWNrZXJJbnRsLm9rTGFiZWwgfX1cbiAgPC9idXR0b24+XG48L2Rpdj5cbiJdfQ==