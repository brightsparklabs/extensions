import { coerceStringArray } from '@angular/cdk/coercion';
import { ESCAPE, hasModifierKey, UP_ARROW } from '@angular/cdk/keycodes';
import { Overlay, OverlayConfig, } from '@angular/cdk/overlay';
import { _getFocusedElementPierceShadowDom } from '@angular/cdk/platform';
import { CdkPortalOutlet, ComponentPortal } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import { afterNextRender, booleanAttribute, ChangeDetectionStrategy, Component, EventEmitter, inject, Inject, InjectionToken, Injector, Input, Optional, Output, ViewChild, ViewEncapsulation, } from '@angular/core';
import { merge, Subject, Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { MtxCalendar } from './calendar';
import { mtxDatetimepickerAnimations } from './datetimepicker-animations';
import { createMissingDateImplError } from './datetimepicker-errors';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/overlay";
import * as i2 from "@ng-matero/extensions/core";
import * as i3 from "@angular/cdk/bidi";
/** Used to generate a unique ID for each datetimepicker instance. */
let datetimepickerUid = 0;
/** Injection token that determines the scroll handling while the calendar is open. */
export const MTX_DATETIMEPICKER_SCROLL_STRATEGY = new InjectionToken('mtx-datetimepicker-scroll-strategy', {
    providedIn: 'root',
    factory: () => {
        const overlay = inject(Overlay);
        return () => overlay.scrollStrategies.reposition();
    },
});
export function MTX_DATETIMEPICKER_SCROLL_STRATEGY_FACTORY(overlay) {
    return () => overlay.scrollStrategies.reposition();
}
export const MTX_DATETIMEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER = {
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
export class MtxDatetimepickerContent {
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
export class MtxDatetimepicker {
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
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxDatetimepicker, deps: [{ token: i1.Overlay }, { token: i0.ViewContainerRef }, { token: MTX_DATETIMEPICKER_SCROLL_STRATEGY }, { token: i2.DatetimeAdapter, optional: true }, { token: i3.Directionality, optional: true }], target: i0.ɵɵFactoryTarget.Component }); }
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
        }], ctorParameters: () => [{ type: i1.Overlay }, { type: i0.ViewContainerRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MTX_DATETIMEPICKER_SCROLL_STRATEGY]
                }] }, { type: i2.DatetimeAdapter, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXRpbWVwaWNrZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9leHRlbnNpb25zL2RhdGV0aW1lcGlja2VyL2RhdGV0aW1lcGlja2VyLnRzIiwiLi4vLi4vLi4vLi4vcHJvamVjdHMvZXh0ZW5zaW9ucy9kYXRldGltZXBpY2tlci9kYXRldGltZXBpY2tlci1jb250ZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDMUQsT0FBTyxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUUsUUFBUSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDekUsT0FBTyxFQUVMLE9BQU8sRUFDUCxhQUFhLEdBR2QsTUFBTSxzQkFBc0IsQ0FBQztBQUM5QixPQUFPLEVBQUUsaUNBQWlDLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUMxRSxPQUFPLEVBQUUsZUFBZSxFQUFFLGVBQWUsRUFBaUIsTUFBTSxxQkFBcUIsQ0FBQztBQUN0RixPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDM0MsT0FBTyxFQUVMLGVBQWUsRUFDZixnQkFBZ0IsRUFDaEIsdUJBQXVCLEVBRXZCLFNBQVMsRUFFVCxZQUFZLEVBQ1osTUFBTSxFQUNOLE1BQU0sRUFDTixjQUFjLEVBQ2QsUUFBUSxFQUNSLEtBQUssRUFHTCxRQUFRLEVBQ1IsTUFBTSxFQUNOLFNBQVMsRUFFVCxpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ3BELE9BQU8sRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFHOUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLFlBQVksQ0FBQztBQUN6QyxPQUFPLEVBQUUsMkJBQTJCLEVBQUUs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QUFDLFFBQVE7Z0JBR04sV0FBVztzQkFBcEIsTUFBTTtnQkFJSCxVQUFVO3NCQURiLEtBQUs7Z0JBV0YsTUFBTTtzQkFEVCxLQUFLO3VCQUFDLEVBQUUsU0FBUyxFQUFFLGdCQUFnQixFQUFFO2dCQWNsQyxLQUFLO3NCQURSLEtBQUs7Z0JBaURGLE9BQU87c0JBRFYsS0FBSztnQkFhRixJQUFJO3NCQURQLEtBQUs7Z0JBYWtDLE9BQU87c0JBQTlDLEtBQUs7dUJBQUMsRUFBRSxTQUFTLEVBQUUsZ0JBQWdCLEVBQUU7Z0JBTTdCLFNBQVM7c0JBQWpCLEtBQUs7Z0JBSUYsUUFBUTtzQkFEWCxLQUFLO3VCQUFDLEVBQUUsU0FBUyxFQUFFLGdCQUFnQixFQUFFO2dCQWdCdEMsU0FBUztzQkFEUixLQUFLO2dCQUtOLFNBQVM7c0JBRFIsS0FBSztnQkFRa0MsWUFBWTtzQkFBbkQsS0FBSzt1QkFBQyxFQUFFLFNBQVMsRUFBRSxnQkFBZ0IsRUFBRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGlvbmFsaXR5IH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2JpZGknO1xuaW1wb3J0IHsgY29lcmNlU3RyaW5nQXJyYXkgfSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHsgRVNDQVBFLCBoYXNNb2RpZmllcktleSwgVVBfQVJST1cgfSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHtcbiAgRmxleGlibGVDb25uZWN0ZWRQb3NpdGlvblN0cmF0ZWd5LFxuICBPdmVybGF5LFxuICBPdmVybGF5Q29uZmlnLFxuICBPdmVybGF5UmVmLFxuICBTY3JvbGxTdHJhdGVneSxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHsgX2dldEZvY3VzZWRFbGVtZW50UGllcmNlU2hhZG93RG9tIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcbmltcG9ydCB7IENka1BvcnRhbE91dGxldCwgQ29tcG9uZW50UG9ydGFsLCBDb21wb25lbnRUeXBlIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5pbXBvcnQgeyBET0NVTUVOVCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICBBZnRlckNvbnRlbnRJbml0LFxuICBhZnRlck5leHRSZW5kZXIsXG4gIGJvb2xlYW5BdHRyaWJ1dGUsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBDb21wb25lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgaW5qZWN0LFxuICBJbmplY3QsXG4gIEluamVjdGlvblRva2VuLFxuICBJbmplY3RvcixcbiAgSW5wdXQsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPcHRpb25hbCxcbiAgT3V0cHV0LFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdDb250YWluZXJSZWYsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFRoZW1lUGFsZXR0ZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHsgbWVyZ2UsIFN1YmplY3QsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgZmlsdGVyLCB0YWtlIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBEYXRldGltZUFkYXB0ZXIgfSBmcm9tICdAbmctbWF0ZXJvL2V4dGVuc2lvbnMvY29yZSc7XG5pbXBvcnQgeyBNdHhDYWxlbmRhciB9IGZyb20gJy4vY2FsZW5kYXInO1xuaW1wb3J0IHsgbXR4RGF0ZXRpbWVwaWNrZXJBbmltYXRpb25zIH0gZnJvbSAnLi9kYXRldGltZXBpY2tlci1hbmltYXRpb25zJztcbmltcG9ydCB7IGNyZWF0ZU1pc3NpbmdEYXRlSW1wbEVycm9yIH0gZnJvbSAnLi9kYXRldGltZXBpY2tlci1lcnJvcnMnO1xuaW1wb3J0IHsgTXR4RGF0ZXRpbWVwaWNrZXJGaWx0ZXJUeXBlIH0gZnJvbSAnLi9kYXRldGltZXBpY2tlci1maWx0ZXJ0eXBlJztcbmltcG9ydCB7IE10eERhdGV0aW1lcGlja2VySW5wdXQgfSBmcm9tICcuL2RhdGV0aW1lcGlja2VyLWlucHV0JztcbmltcG9ydCB7IE10eENhbGVuZGFyVmlldywgTXR4RGF0ZXRpbWVwaWNrZXJUeXBlLCBNdHhUaW1lVmlldyB9IGZyb20gJy4vZGF0ZXRpbWVwaWNrZXItdHlwZXMnO1xuXG4vKiogVXNlZCB0byBnZW5lcmF0ZSBhIHVuaXF1ZSBJRCBmb3IgZWFjaCBkYXRldGltZXBpY2tlciBpbnN0YW5jZS4gKi9cbmxldCBkYXRldGltZXBpY2tlclVpZCA9IDA7XG5cbi8qKiBQb3NzaWJsZSBtb2RlcyBmb3IgZGF0ZXRpbWVwaWNrZXIgZHJvcGRvd24gZGlzcGxheS4gKi9cbmV4cG9ydCB0eXBlIE10eERhdGV0aW1lcGlja2VyTW9kZSA9ICdhdXRvJyB8ICdwb3J0cmFpdCcgfCAnbGFuZHNjYXBlJztcblxuLyoqIFBvc3NpYmxlIHBvc2l0aW9ucyBmb3IgdGhlIGRhdGV0aW1lcGlja2VyIGRyb3Bkb3duIGFsb25nIHRoZSBYIGF4aXMuICovXG5leHBvcnQgdHlwZSBEYXRldGltZXBpY2tlckRyb3Bkb3duUG9zaXRpb25YID0gJ3N0YXJ0JyB8ICdlbmQnO1xuXG4vKiogUG9zc2libGUgcG9zaXRpb25zIGZvciB0aGUgZGF0ZXRpbWVwaWNrZXIgZHJvcGRvd24gYWxvbmcgdGhlIFkgYXhpcy4gKi9cbmV4cG9ydCB0eXBlIERhdGV0aW1lcGlja2VyRHJvcGRvd25Qb3NpdGlvblkgPSAnYWJvdmUnIHwgJ2JlbG93JztcblxuLyoqIEluamVjdGlvbiB0b2tlbiB0aGF0IGRldGVybWluZXMgdGhlIHNjcm9sbCBoYW5kbGluZyB3aGlsZSB0aGUgY2FsZW5kYXIgaXMgb3Blbi4gKi9cbmV4cG9ydCBjb25zdCBNVFhfREFURVRJTUVQSUNLRVJfU0NST0xMX1NUUkFURUdZID0gbmV3IEluamVjdGlvblRva2VuPCgpID0+IFNjcm9sbFN0cmF0ZWd5PihcbiAgJ210eC1kYXRldGltZXBpY2tlci1zY3JvbGwtc3RyYXRlZ3knLFxuICB7XG4gICAgcHJvdmlkZWRJbjogJ3Jvb3QnLFxuICAgIGZhY3Rvcnk6ICgpID0+IHtcbiAgICAgIGNvbnN0IG92ZXJsYXkgPSBpbmplY3QoT3ZlcmxheSk7XG4gICAgICByZXR1cm4gKCkgPT4gb3ZlcmxheS5zY3JvbGxTdHJhdGVnaWVzLnJlcG9zaXRpb24oKTtcbiAgICB9LFxuICB9XG4pO1xuXG5leHBvcnQgZnVuY3Rpb24gTVRYX0RBVEVUSU1FUElDS0VSX1NDUk9MTF9TVFJBVEVHWV9GQUNUT1JZKG92ZXJsYXk6IE92ZXJsYXkpOiAoKSA9PiBTY3JvbGxTdHJhdGVneSB7XG4gIHJldHVybiAoKSA9PiBvdmVybGF5LnNjcm9sbFN0cmF0ZWdpZXMucmVwb3NpdGlvbigpO1xufVxuXG5leHBvcnQgY29uc3QgTVRYX0RBVEVUSU1FUElDS0VSX1NDUk9MTF9TVFJBVEVHWV9GQUNUT1JZX1BST1ZJREVSID0ge1xuICBwcm92aWRlOiBNVFhfREFURVRJTUVQSUNLRVJfU0NST0xMX1NUUkFURUdZLFxuICBkZXBzOiBbT3ZlcmxheV0sXG4gIHVzZUZhY3Rvcnk6IE1UWF9EQVRFVElNRVBJQ0tFUl9TQ1JPTExfU1RSQVRFR1lfRkFDVE9SWSxcbn07XG5cbi8qKlxuICogQ29tcG9uZW50IHVzZWQgYXMgdGhlIGNvbnRlbnQgZm9yIHRoZSBkYXRldGltZXBpY2tlciBkaWFsb2cgYW5kIHBvcHVwLiBXZSB1c2UgdGhpcyBpbnN0ZWFkIG9mXG4gKiB1c2luZyBNdHhDYWxlbmRhciBkaXJlY3RseSBhcyB0aGUgY29udGVudCBzbyB3ZSBjYW4gY29udHJvbCB0aGUgaW5pdGlhbCBmb2N1cy4gVGhpcyBhbHNvIGdpdmVzIHVzXG4gKiBhIHBsYWNlIHRvIHB1dCBhZGRpdGlvbmFsIGZlYXR1cmVzIG9mIHRoZSBwb3B1cCB0aGF0IGFyZSBub3QgcGFydCBvZiB0aGUgY2FsZW5kYXIgaXRzZWxmIGluIHRoZVxuICogZnV0dXJlLiAoZS5nLiBjb25maXJtYXRpb24gYnV0dG9ucykuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ210eC1kYXRldGltZXBpY2tlci1jb250ZW50JyxcbiAgdGVtcGxhdGVVcmw6ICdkYXRldGltZXBpY2tlci1jb250ZW50Lmh0bWwnLFxuICBzdHlsZVVybDogJ2RhdGV0aW1lcGlja2VyLWNvbnRlbnQuc2NzcycsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbXR4LWRhdGV0aW1lcGlja2VyLWNvbnRlbnQnLFxuICAgICdbY2xhc3NdJzogJ2NvbG9yID8gXCJtYXQtXCIgKyBjb2xvciA6IFwiXCInLFxuICAgICdbY2xhc3MubXR4LWRhdGV0aW1lcGlja2VyLWNvbnRlbnQtdG91Y2hdJzogJ2RhdGV0aW1lcGlja2VyPy50b3VjaFVpJyxcbiAgICAnW2F0dHIubW9kZV0nOiAnZGF0ZXRpbWVwaWNrZXIubW9kZScsXG4gICAgJ1tAdHJhbnNmb3JtUGFuZWxdJzogJ19hbmltYXRpb25TdGF0ZScsXG4gICAgJyhAdHJhbnNmb3JtUGFuZWwuZG9uZSknOiAnX2FuaW1hdGlvbkRvbmUubmV4dCgpJyxcbiAgfSxcbiAgYW5pbWF0aW9uczogW1xuICAgIG10eERhdGV0aW1lcGlja2VyQW5pbWF0aW9ucy50cmFuc2Zvcm1QYW5lbCxcbiAgICBtdHhEYXRldGltZXBpY2tlckFuaW1hdGlvbnMuZmFkZUluQ2FsZW5kYXIsXG4gIF0sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBzdGFuZGFsb25lOiB0cnVlLFxuICBpbXBvcnRzOiBbTXR4Q2FsZW5kYXIsIENka1BvcnRhbE91dGxldF0sXG59KVxuZXhwb3J0IGNsYXNzIE10eERhdGV0aW1lcGlja2VyQ29udGVudDxEPiBpbXBsZW1lbnRzIE9uSW5pdCwgQWZ0ZXJDb250ZW50SW5pdCwgT25EZXN0cm95IHtcbiAgQFZpZXdDaGlsZChNdHhDYWxlbmRhciwgeyBzdGF0aWM6IHRydWUgfSkgX2NhbGVuZGFyITogTXR4Q2FsZW5kYXI8RD47XG5cbiAgQElucHV0KCkgY29sb3I6IFRoZW1lUGFsZXR0ZTtcblxuICBkYXRldGltZXBpY2tlciE6IE10eERhdGV0aW1lcGlja2VyPEQ+O1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBkYXRldGltZXBpY2tlciBpcyBhYm92ZSBvciBiZWxvdyB0aGUgaW5wdXQuICovXG4gIF9pc0Fib3ZlITogYm9vbGVhbjtcblxuICAvKiogQ3VycmVudCBzdGF0ZSBvZiB0aGUgYW5pbWF0aW9uLiAqL1xuICBfYW5pbWF0aW9uU3RhdGUhOiAnZW50ZXItZHJvcGRvd24nIHwgJ2VudGVyLWRpYWxvZycgfCAndm9pZCc7XG5cbiAgLyoqIEVtaXRzIHdoZW4gYW4gYW5pbWF0aW9uIGhhcyBmaW5pc2hlZC4gKi9cbiAgcmVhZG9ubHkgX2FuaW1hdGlvbkRvbmUgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKiBJZCBvZiB0aGUgbGFiZWwgZm9yIHRoZSBgcm9sZT1cImRpYWxvZ1wiYCBlbGVtZW50LiAqL1xuICBfZGlhbG9nTGFiZWxJZDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuX2FuaW1hdGlvblN0YXRlID0gdGhpcy5kYXRldGltZXBpY2tlci50b3VjaFVpID8gJ2VudGVyLWRpYWxvZycgOiAnZW50ZXItZHJvcGRvd24nO1xuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIHRoaXMuX2NhbGVuZGFyLl9mb2N1c0FjdGl2ZUNlbGwoKTtcbiAgfVxuXG4gIF9zdGFydEV4aXRBbmltYXRpb24oKSB7XG4gICAgdGhpcy5fYW5pbWF0aW9uU3RhdGUgPSAndm9pZCc7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9hbmltYXRpb25Eb25lLmNvbXBsZXRlKCk7XG4gIH1cbn1cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbXR4LWRhdGV0aW1lcGlja2VyJyxcbiAgZXhwb3J0QXM6ICdtdHhEYXRldGltZXBpY2tlcicsXG4gIHRlbXBsYXRlOiAnJyxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIHByZXNlcnZlV2hpdGVzcGFjZXM6IGZhbHNlLFxuICBzdGFuZGFsb25lOiB0cnVlLFxufSlcbmV4cG9ydCBjbGFzcyBNdHhEYXRldGltZXBpY2tlcjxEPiBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgX2RvY3VtZW50ID0gaW5qZWN0KERPQ1VNRU5UKTtcblxuICBwcml2YXRlIF9pbmplY3RvciA9IGluamVjdChJbmplY3Rvcik7XG5cbiAgLyoqIFdoZXRoZXIgdG8gc2hvdyBtdWx0aS15ZWFyIHZpZXcuICovXG4gIEBJbnB1dCh7IHRyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZSB9KSBtdWx0aVllYXJTZWxlY3RvciA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBjbG9jayB1c2VzIDEyIGhvdXIgZm9ybWF0LiAqL1xuICBASW5wdXQoeyB0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGUgfSkgdHdlbHZlaG91ciA9IGZhbHNlO1xuXG4gIC8qKiBUaGUgdmlldyB0aGF0IHRoZSBjYWxlbmRhciBzaG91bGQgc3RhcnQgaW4uICovXG4gIEBJbnB1dCgpIHN0YXJ0VmlldzogTXR4Q2FsZW5kYXJWaWV3ID0gJ21vbnRoJztcblxuICAvKiogVGhlIGRpc3BsYXkgbW9kZSBvZiBkYXRldGltZXBpY2tlci4gKi9cbiAgQElucHV0KCkgbW9kZTogTXR4RGF0ZXRpbWVwaWNrZXJNb2RlID0gJ2F1dG8nO1xuXG4gIC8qKiBTdGVwIG92ZXIgbWludXRlcy4gKi9cbiAgQElucHV0KCkgdGltZUludGVydmFsOiBudW1iZXIgPSAxO1xuXG4gIC8qKiBQcmV2ZW50IHVzZXIgdG8gc2VsZWN0IHNhbWUgZGF0ZSB0aW1lICovXG4gIEBJbnB1dCh7IHRyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZSB9KSBwcmV2ZW50U2FtZURhdGVUaW1lU2VsZWN0aW9uID0gZmFsc2U7XG5cbiAgLyoqIElucHV0IGZvciBhIGN1c3RvbSBoZWFkZXIgY29tcG9uZW50ICovXG4gIEBJbnB1dCgpIGNhbGVuZGFySGVhZGVyQ29tcG9uZW50ITogQ29tcG9uZW50VHlwZTxhbnk+O1xuXG4gIC8qKlxuICAgKiBFbWl0cyBuZXcgc2VsZWN0ZWQgZGF0ZSB3aGVuIHNlbGVjdGVkIGRhdGUgY2hhbmdlcy5cbiAgICogQGRlcHJlY2F0ZWQgU3dpdGNoIHRvIHRoZSBgZGF0ZUNoYW5nZWAgYW5kIGBkYXRlSW5wdXRgIGJpbmRpbmcgb24gdGhlIGlucHV0IGVsZW1lbnQuXG4gICAqL1xuICBAT3V0cHV0KCkgc2VsZWN0ZWRDaGFuZ2VkID0gbmV3IEV2ZW50RW1pdHRlcjxEPigpO1xuXG4gIC8qKiBFbWl0cyB3aGVuIHRoZSBkYXRldGltZXBpY2tlciBoYXMgYmVlbiBvcGVuZWQuICovXG4gIEBPdXRwdXQoJ29wZW5lZCcpIG9wZW5lZFN0cmVhbTogRXZlbnRFbWl0dGVyPHZvaWQ+ID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIC8qKiBFbWl0cyB3aGVuIHRoZSBkYXRldGltZXBpY2tlciBoYXMgYmVlbiBjbG9zZWQuICovXG4gIEBPdXRwdXQoJ2Nsb3NlZCcpIGNsb3NlZFN0cmVhbTogRXZlbnRFbWl0dGVyPHZvaWQ+ID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIC8qKiBFbWl0cyB3aGVuIHRoZSB2aWV3IGhhcyBiZWVuIGNoYW5nZWQuICovXG4gIEBPdXRwdXQoKSB2aWV3Q2hhbmdlZDogRXZlbnRFbWl0dGVyPE10eENhbGVuZGFyVmlldz4gPSBuZXcgRXZlbnRFbWl0dGVyPE10eENhbGVuZGFyVmlldz4oKTtcblxuICAvKiogQ2xhc3NlcyB0byBiZSBwYXNzZWQgdG8gdGhlIGRhdGUgcGlja2VyIHBhbmVsLiAqL1xuICBASW5wdXQoKVxuICBnZXQgcGFuZWxDbGFzcygpOiBzdHJpbmcgfCBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIHRoaXMuX3BhbmVsQ2xhc3M7XG4gIH1cbiAgc2V0IHBhbmVsQ2xhc3ModmFsdWU6IHN0cmluZyB8IHN0cmluZ1tdKSB7XG4gICAgdGhpcy5fcGFuZWxDbGFzcyA9IGNvZXJjZVN0cmluZ0FycmF5KHZhbHVlKTtcbiAgfVxuICBwcml2YXRlIF9wYW5lbENsYXNzITogc3RyaW5nW107XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNhbGVuZGFyIGlzIG9wZW4uICovXG4gIEBJbnB1dCh7IHRyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZSB9KVxuICBnZXQgb3BlbmVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9vcGVuZWQ7XG4gIH1cbiAgc2V0IG9wZW5lZCh2YWx1ZTogYm9vbGVhbikge1xuICAgIHZhbHVlID8gdGhpcy5vcGVuKCkgOiB0aGlzLmNsb3NlKCk7XG4gIH1cbiAgcHJpdmF0ZSBfb3BlbmVkID0gZmFsc2U7XG5cbiAgLyoqIFRoZSBpZCBmb3IgdGhlIGRhdGV0aW1lcGlja2VyIGNhbGVuZGFyLiAqL1xuICBpZCA9IGBtdHgtZGF0ZXRpbWVwaWNrZXItJHtkYXRldGltZXBpY2tlclVpZCsrfWA7XG5cbiAgLyoqIENvbG9yIHBhbGV0dGUgdG8gdXNlIG9uIHRoZSBkYXRldGltZXBpY2tlcidzIGNhbGVuZGFyLiAqL1xuICBASW5wdXQoKVxuICBnZXQgY29sb3IoKTogVGhlbWVQYWxldHRlIHtcbiAgICByZXR1cm4gKFxuICAgICAgdGhpcy5fY29sb3IgfHxcbiAgICAgICh0aGlzLmRhdGV0aW1lcGlja2VySW5wdXQgPyB0aGlzLmRhdGV0aW1lcGlja2VySW5wdXQuZ2V0VGhlbWVQYWxldHRlKCkgOiB1bmRlZmluZWQpXG4gICAgKTtcbiAgfVxuICBzZXQgY29sb3IodmFsdWU6IFRoZW1lUGFsZXR0ZSkge1xuICAgIHRoaXMuX2NvbG9yID0gdmFsdWU7XG4gICAgY29uc29sZS5sb2codmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX2NvbG9yOiBUaGVtZVBhbGV0dGU7XG5cbiAgLyoqIFRoZSBpbnB1dCBlbGVtZW50IHRoaXMgZGF0ZXRpbWVwaWNrZXIgaXMgYXNzb2NpYXRlZCB3aXRoLiAqL1xuICBkYXRldGltZXBpY2tlcklucHV0ITogTXR4RGF0ZXRpbWVwaWNrZXJJbnB1dDxEPjtcblxuICAvKiogRW1pdHMgd2hlbiB0aGUgZGF0ZXRpbWVwaWNrZXIgaXMgZGlzYWJsZWQuICovXG4gIF9kaXNhYmxlZENoYW5nZSA9IG5ldyBTdWJqZWN0PGJvb2xlYW4+KCk7XG5cbiAgcHJpdmF0ZSBfdmFsaWRTZWxlY3RlZDogRCB8IG51bGwgPSBudWxsO1xuXG4gIC8qKiBBIHJlZmVyZW5jZSB0byB0aGUgb3ZlcmxheSBpbnRvIHdoaWNoIHdlJ3ZlIHJlbmRlcmVkIHRoZSBjYWxlbmRhci4gKi9cbiAgcHJpdmF0ZSBfb3ZlcmxheVJlZiE6IE92ZXJsYXlSZWYgfCBudWxsO1xuXG4gIC8qKiBSZWZlcmVuY2UgdG8gdGhlIGNvbXBvbmVudCBpbnN0YW5jZSByZW5kZXJlZCBpbiB0aGUgb3ZlcmxheS4gKi9cbiAgcHJpdmF0ZSBfY29tcG9uZW50UmVmITogQ29tcG9uZW50UmVmPE10eERhdGV0aW1lcGlja2VyQ29udGVudDxEPj4gfCBudWxsO1xuXG4gIC8qKiBUaGUgZWxlbWVudCB0aGF0IHdhcyBmb2N1c2VkIGJlZm9yZSB0aGUgZGF0ZXRpbWVwaWNrZXIgd2FzIG9wZW5lZC4gKi9cbiAgcHJpdmF0ZSBfZm9jdXNlZEVsZW1lbnRCZWZvcmVPcGVuOiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuXG4gIC8qKiBVbmlxdWUgY2xhc3MgdGhhdCB3aWxsIGJlIGFkZGVkIHRvIHRoZSBiYWNrZHJvcCBzbyB0aGF0IHRoZSB0ZXN0IGhhcm5lc3NlcyBjYW4gbG9vayBpdCB1cC4gKi9cbiAgcHJpdmF0ZSBfYmFja2Ryb3BIYXJuZXNzQ2xhc3MgPSBgJHt0aGlzLmlkfS1iYWNrZHJvcGA7XG5cbiAgcHJpdmF0ZSBfaW5wdXRTdGF0ZUNoYW5nZXMgPSBTdWJzY3JpcHRpb24uRU1QVFk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfb3ZlcmxheTogT3ZlcmxheSxcbiAgICBwcml2YXRlIF92aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgIEBJbmplY3QoTVRYX0RBVEVUSU1FUElDS0VSX1NDUk9MTF9TVFJBVEVHWSkgcHJpdmF0ZSBfc2Nyb2xsU3RyYXRlZ3k6IGFueSxcbiAgICBAT3B0aW9uYWwoKSBwcml2YXRlIF9kYXRlQWRhcHRlcjogRGF0ZXRpbWVBZGFwdGVyPEQ+LFxuICAgIEBPcHRpb25hbCgpIHByaXZhdGUgX2RpcjogRGlyZWN0aW9uYWxpdHlcbiAgKSB7XG4gICAgaWYgKCF0aGlzLl9kYXRlQWRhcHRlcikge1xuICAgICAgdGhyb3cgY3JlYXRlTWlzc2luZ0RhdGVJbXBsRXJyb3IoJ0RhdGVBZGFwdGVyJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFRoZSBkYXRlIHRvIG9wZW4gdGhlIGNhbGVuZGFyIHRvIGluaXRpYWxseS4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHN0YXJ0QXQoKTogRCB8IG51bGwge1xuICAgIC8vIElmIGFuIGV4cGxpY2l0IHN0YXJ0QXQgaXMgc2V0IHdlIHN0YXJ0IHRoZXJlLCBvdGhlcndpc2Ugd2Ugc3RhcnQgYXQgd2hhdGV2ZXIgdGhlIGN1cnJlbnRseVxuICAgIC8vIHNlbGVjdGVkIHZhbHVlIGlzLlxuICAgIHJldHVybiB0aGlzLl9zdGFydEF0IHx8ICh0aGlzLmRhdGV0aW1lcGlja2VySW5wdXQgPyB0aGlzLmRhdGV0aW1lcGlja2VySW5wdXQudmFsdWUgOiBudWxsKTtcbiAgfVxuICBzZXQgc3RhcnRBdChkYXRlOiBEIHwgbnVsbCkge1xuICAgIHRoaXMuX3N0YXJ0QXQgPSB0aGlzLl9kYXRlQWRhcHRlci5nZXRWYWxpZERhdGVPck51bGwoZGF0ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfc3RhcnRBdCE6IEQgfCBudWxsO1xuXG4gIC8qKiBUaGUgZGlzcGxheSB0eXBlIG9mIGRhdGV0aW1lcGlja2VyLiAqL1xuICBASW5wdXQoKVxuICBnZXQgdHlwZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fdHlwZTtcbiAgfVxuICBzZXQgdHlwZSh2YWx1ZTogTXR4RGF0ZXRpbWVwaWNrZXJUeXBlKSB7XG4gICAgdGhpcy5fdHlwZSA9IHZhbHVlIHx8ICdkYXRldGltZSc7XG4gIH1cbiAgcHJpdmF0ZSBfdHlwZTogTXR4RGF0ZXRpbWVwaWNrZXJUeXBlID0gJ2RhdGV0aW1lJztcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgY2FsZW5kYXIgVUkgaXMgaW4gdG91Y2ggbW9kZS4gSW4gdG91Y2ggbW9kZSB0aGUgY2FsZW5kYXIgb3BlbnMgaW4gYSBkaWFsb2cgcmF0aGVyXG4gICAqIHRoYW4gYSBwb3B1cCBhbmQgZWxlbWVudHMgaGF2ZSBtb3JlIHBhZGRpbmcgdG8gYWxsb3cgZm9yIGJpZ2dlciB0b3VjaCB0YXJnZXRzLlxuICAgKi9cbiAgQElucHV0KHsgdHJhbnNmb3JtOiBib29sZWFuQXR0cmlidXRlIH0pIHRvdWNoVWkgPSBmYWxzZTtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgY2FsZW5kYXIgaXMgaW4gdGltZSBtb2RlLiBJbiB0aW1lIG1vZGUgdGhlIGNhbGVuZGFyIGNsb2NrIGdldHMgdGltZSBpbnB1dFxuICAgKiBlbGVtZW50cyByYXRoZXIgdGhlbiBqdXN0IGNsb2NrLiBXaGVuIGB0b3VjaFVpYCBpcyBlbmFibGVkIHRoaXMgd2lsbCBiZSBkaXNhYmxlZC5cbiAgICovXG4gIEBJbnB1dCgpIHRpbWVJbnB1dDogTXR4VGltZVZpZXcgPSAnZGlhbCc7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGRhdGV0aW1lcGlja2VyIHBvcC11cCBzaG91bGQgYmUgZGlzYWJsZWQuICovXG4gIEBJbnB1dCh7IHRyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZSB9KVxuICBnZXQgZGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2Rpc2FibGVkID09PSB1bmRlZmluZWQgJiYgdGhpcy5kYXRldGltZXBpY2tlcklucHV0XG4gICAgICA/IHRoaXMuZGF0ZXRpbWVwaWNrZXJJbnB1dC5kaXNhYmxlZFxuICAgICAgOiAhIXRoaXMuX2Rpc2FibGVkO1xuICB9XG4gIHNldCBkaXNhYmxlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgIGlmICh2YWx1ZSAhPT0gdGhpcy5fZGlzYWJsZWQpIHtcbiAgICAgIHRoaXMuX2Rpc2FibGVkID0gdmFsdWU7XG4gICAgICB0aGlzLl9kaXNhYmxlZENoYW5nZS5uZXh0KHZhbHVlKTtcbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBfZGlzYWJsZWQhOiBib29sZWFuO1xuXG4gIC8qKiBQcmVmZXJyZWQgcG9zaXRpb24gb2YgdGhlIGRhdGV0aW1lcGlja2VyIGluIHRoZSBYIGF4aXMuICovXG4gIEBJbnB1dCgpXG4gIHhQb3NpdGlvbjogRGF0ZXRpbWVwaWNrZXJEcm9wZG93blBvc2l0aW9uWCA9ICdzdGFydCc7XG5cbiAgLyoqIFByZWZlcnJlZCBwb3NpdGlvbiBvZiB0aGUgZGF0ZXRpbWVwaWNrZXIgaW4gdGhlIFkgYXhpcy4gKi9cbiAgQElucHV0KClcbiAgeVBvc2l0aW9uOiBEYXRldGltZXBpY2tlckRyb3Bkb3duUG9zaXRpb25ZID0gJ2JlbG93JztcblxuICAvKipcbiAgICogV2hldGhlciB0byByZXN0b3JlIGZvY3VzIHRvIHRoZSBwcmV2aW91c2x5LWZvY3VzZWQgZWxlbWVudCB3aGVuIHRoZSBwYW5lbCBpcyBjbG9zZWQuXG4gICAqIE5vdGUgdGhhdCBhdXRvbWF0aWMgZm9jdXMgcmVzdG9yYXRpb24gaXMgYW4gYWNjZXNzaWJpbGl0eSBmZWF0dXJlIGFuZCBpdCBpcyByZWNvbW1lbmRlZCB0aGF0XG4gICAqIHlvdSBwcm92aWRlIHlvdXIgb3duIGVxdWl2YWxlbnQsIGlmIHlvdSBkZWNpZGUgdG8gdHVybiBpdCBvZmYuXG4gICAqL1xuICBASW5wdXQoeyB0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGUgfSkgcmVzdG9yZUZvY3VzID0gdHJ1ZTtcblxuICAvKiogVGhlIGN1cnJlbnRseSBzZWxlY3RlZCBkYXRlLiAqL1xuICBnZXQgX3NlbGVjdGVkKCk6IEQgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5fdmFsaWRTZWxlY3RlZDtcbiAgfVxuXG4gIHNldCBfc2VsZWN0ZWQodmFsdWU6IEQgfCBudWxsKSB7XG4gICAgdGhpcy5fdmFsaWRTZWxlY3RlZCA9IHZhbHVlO1xuICB9XG5cbiAgLyoqIFRoZSBtaW5pbXVtIHNlbGVjdGFibGUgZGF0ZS4gKi9cbiAgZ2V0IF9taW5EYXRlKCk6IEQgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5kYXRldGltZXBpY2tlcklucHV0ICYmIHRoaXMuZGF0ZXRpbWVwaWNrZXJJbnB1dC5taW47XG4gIH1cblxuICAvKiogVGhlIG1heGltdW0gc2VsZWN0YWJsZSBkYXRlLiAqL1xuICBnZXQgX21heERhdGUoKTogRCB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLmRhdGV0aW1lcGlja2VySW5wdXQgJiYgdGhpcy5kYXRldGltZXBpY2tlcklucHV0Lm1heDtcbiAgfVxuXG4gIGdldCBfZGF0ZUZpbHRlcigpOiAoZGF0ZTogRCB8IG51bGwsIHR5cGU6IE10eERhdGV0aW1lcGlja2VyRmlsdGVyVHlwZSkgPT4gYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuZGF0ZXRpbWVwaWNrZXJJbnB1dCAmJiB0aGlzLmRhdGV0aW1lcGlja2VySW5wdXQuX2RhdGVGaWx0ZXI7XG4gIH1cblxuICBfdmlld0NoYW5nZWQodHlwZTogTXR4Q2FsZW5kYXJWaWV3KTogdm9pZCB7XG4gICAgdGhpcy52aWV3Q2hhbmdlZC5lbWl0KHR5cGUpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fZGVzdHJveU92ZXJsYXkoKTtcbiAgICB0aGlzLmNsb3NlKCk7XG4gICAgdGhpcy5faW5wdXRTdGF0ZUNoYW5nZXMudW5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLl9kaXNhYmxlZENoYW5nZS5jb21wbGV0ZSgpO1xuICB9XG5cbiAgLyoqIFNlbGVjdHMgdGhlIGdpdmVuIGRhdGUgKi9cbiAgX3NlbGVjdChkYXRlOiBEKTogdm9pZCB7XG4gICAgY29uc3Qgb2xkVmFsdWUgPSB0aGlzLl9zZWxlY3RlZDtcbiAgICB0aGlzLl9zZWxlY3RlZCA9IGRhdGU7XG4gICAgaWYgKCF0aGlzLl9kYXRlQWRhcHRlci5zYW1lRGF0ZXRpbWUob2xkVmFsdWUsIHRoaXMuX3NlbGVjdGVkKSkge1xuICAgICAgdGhpcy5zZWxlY3RlZENoYW5nZWQuZW1pdChkYXRlKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIgYW4gaW5wdXQgd2l0aCB0aGlzIGRhdGV0aW1lcGlja2VyLlxuICAgKiBAcGFyYW0gaW5wdXQgVGhlIGRhdGV0aW1lcGlja2VyIGlucHV0IHRvIHJlZ2lzdGVyIHdpdGggdGhpcyBkYXRldGltZXBpY2tlci5cbiAgICovXG4gIF9yZWdpc3RlcklucHV0KGlucHV0OiBNdHhEYXRldGltZXBpY2tlcklucHV0PEQ+KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZGF0ZXRpbWVwaWNrZXJJbnB1dCkge1xuICAgICAgdGhyb3cgRXJyb3IoJ0EgTXR4RGF0ZXRpbWVwaWNrZXIgY2FuIG9ubHkgYmUgYXNzb2NpYXRlZCB3aXRoIGEgc2luZ2xlIGlucHV0LicpO1xuICAgIH1cbiAgICB0aGlzLmRhdGV0aW1lcGlja2VySW5wdXQgPSBpbnB1dDtcbiAgICB0aGlzLl9pbnB1dFN0YXRlQ2hhbmdlcyA9IHRoaXMuZGF0ZXRpbWVwaWNrZXJJbnB1dC5fdmFsdWVDaGFuZ2Uuc3Vic2NyaWJlKFxuICAgICAgKHZhbHVlOiBEIHwgbnVsbCkgPT4gKHRoaXMuX3NlbGVjdGVkID0gdmFsdWUpXG4gICAgKTtcbiAgfVxuXG4gIC8qKiBPcGVuIHRoZSBjYWxlbmRhci4gKi9cbiAgb3BlbigpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fb3BlbmVkIHx8IHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCF0aGlzLmRhdGV0aW1lcGlja2VySW5wdXQpIHtcbiAgICAgIHRocm93IEVycm9yKCdBdHRlbXB0ZWQgdG8gb3BlbiBhbiBNdHhEYXRldGltZXBpY2tlciB3aXRoIG5vIGFzc29jaWF0ZWQgaW5wdXQuJyk7XG4gICAgfVxuXG4gICAgdGhpcy5fZm9jdXNlZEVsZW1lbnRCZWZvcmVPcGVuID0gX2dldEZvY3VzZWRFbGVtZW50UGllcmNlU2hhZG93RG9tKCk7XG4gICAgdGhpcy5fb3Blbk92ZXJsYXkoKTtcbiAgICB0aGlzLl9vcGVuZWQgPSB0cnVlO1xuICAgIHRoaXMub3BlbmVkU3RyZWFtLmVtaXQoKTtcbiAgfVxuXG4gIC8qKiBDbG9zZSB0aGUgY2FsZW5kYXIuICovXG4gIGNsb3NlKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5fb3BlbmVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgY2FuUmVzdG9yZUZvY3VzID1cbiAgICAgIHRoaXMucmVzdG9yZUZvY3VzICYmXG4gICAgICB0aGlzLl9mb2N1c2VkRWxlbWVudEJlZm9yZU9wZW4gJiZcbiAgICAgIHR5cGVvZiB0aGlzLl9mb2N1c2VkRWxlbWVudEJlZm9yZU9wZW4uZm9jdXMgPT09ICdmdW5jdGlvbic7XG5cbiAgICBjb25zdCBjb21wbGV0ZUNsb3NlID0gKCkgPT4ge1xuICAgICAgLy8gVGhlIGBfb3BlbmVkYCBjb3VsZCd2ZSBiZWVuIHJlc2V0IGFscmVhZHkgaWZcbiAgICAgIC8vIHdlIGdvdCB0d28gZXZlbnRzIGluIHF1aWNrIHN1Y2Nlc3Npb24uXG4gICAgICBpZiAodGhpcy5fb3BlbmVkKSB7XG4gICAgICAgIHRoaXMuX29wZW5lZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmNsb3NlZFN0cmVhbS5lbWl0KCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGlmICh0aGlzLl9jb21wb25lbnRSZWYpIHtcbiAgICAgIGNvbnN0IHsgaW5zdGFuY2UsIGxvY2F0aW9uIH0gPSB0aGlzLl9jb21wb25lbnRSZWY7XG4gICAgICBpbnN0YW5jZS5fc3RhcnRFeGl0QW5pbWF0aW9uKCk7XG4gICAgICBpbnN0YW5jZS5fYW5pbWF0aW9uRG9uZS5waXBlKHRha2UoMSkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIGNvbnN0IGFjdGl2ZUVsZW1lbnQgPSB0aGlzLl9kb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuXG4gICAgICAgIC8vIFNpbmNlIHdlIHJlc3RvcmUgZm9jdXMgYWZ0ZXIgdGhlIGV4aXQgYW5pbWF0aW9uLCB3ZSBoYXZlIHRvIGNoZWNrIHRoYXRcbiAgICAgICAgLy8gdGhlIHVzZXIgZGlkbid0IG1vdmUgZm9jdXMgdGhlbXNlbHZlcyBpbnNpZGUgdGhlIGBjbG9zZWAgaGFuZGxlci5cbiAgICAgICAgaWYgKFxuICAgICAgICAgIGNhblJlc3RvcmVGb2N1cyAmJlxuICAgICAgICAgICghYWN0aXZlRWxlbWVudCB8fFxuICAgICAgICAgICAgYWN0aXZlRWxlbWVudCA9PT0gdGhpcy5fZG9jdW1lbnQuYWN0aXZlRWxlbWVudCB8fFxuICAgICAgICAgICAgbG9jYXRpb24ubmF0aXZlRWxlbWVudC5jb250YWlucyhhY3RpdmVFbGVtZW50KSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgdGhpcy5fZm9jdXNlZEVsZW1lbnRCZWZvcmVPcGVuIS5mb2N1cygpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fZm9jdXNlZEVsZW1lbnRCZWZvcmVPcGVuID0gbnVsbDtcbiAgICAgICAgdGhpcy5fZGVzdHJveU92ZXJsYXkoKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChjYW5SZXN0b3JlRm9jdXMpIHtcbiAgICAgIC8vIEJlY2F1c2UgSUUgbW92ZXMgZm9jdXMgYXN5bmNocm9ub3VzbHksIHdlIGNhbid0IGNvdW50IG9uIGl0IGJlaW5nIHJlc3RvcmVkIGJlZm9yZSB3ZSd2ZVxuICAgICAgLy8gbWFya2VkIHRoZSBkYXRlcGlja2VyIGFzIGNsb3NlZC4gSWYgdGhlIGV2ZW50IGZpcmVzIG91dCBvZiBzZXF1ZW5jZSBhbmQgdGhlIGVsZW1lbnQgdGhhdFxuICAgICAgLy8gd2UncmUgcmVmb2N1c2luZyBvcGVucyB0aGUgZGF0ZXBpY2tlciBvbiBmb2N1cywgdGhlIHVzZXIgY291bGQgYmUgc3R1Y2sgd2l0aCBub3QgYmVpbmdcbiAgICAgIC8vIGFibGUgdG8gY2xvc2UgdGhlIGNhbGVuZGFyIGF0IGFsbC4gV2Ugd29yayBhcm91bmQgaXQgYnkgbWFraW5nIHRoZSBsb2dpYywgdGhhdCBtYXJrc1xuICAgICAgLy8gdGhlIGRhdGVwaWNrZXIgYXMgY2xvc2VkLCBhc3luYyBhcyB3ZWxsLlxuICAgICAgc2V0VGltZW91dChjb21wbGV0ZUNsb3NlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29tcGxldGVDbG9zZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBGb3J3YXJkcyByZWxldmFudCB2YWx1ZXMgZnJvbSB0aGUgZGF0ZXRpbWVwaWNrZXIgdG8gdGhlXG4gICAqIGRhdGV0aW1lcGlja2VyIGNvbnRlbnQgaW5zaWRlIHRoZSBvdmVybGF5LlxuICAgKi9cbiAgcHJvdGVjdGVkIF9mb3J3YXJkQ29udGVudFZhbHVlcyhpbnN0YW5jZTogTXR4RGF0ZXRpbWVwaWNrZXJDb250ZW50PEQ+KSB7XG4gICAgaW5zdGFuY2UuZGF0ZXRpbWVwaWNrZXIgPSB0aGlzO1xuICAgIGluc3RhbmNlLmNvbG9yID0gdGhpcy5jb2xvcjtcbiAgICBpbnN0YW5jZS5fZGlhbG9nTGFiZWxJZCA9IHRoaXMuZGF0ZXRpbWVwaWNrZXJJbnB1dC5nZXRPdmVybGF5TGFiZWxJZCgpO1xuICB9XG5cbiAgLyoqIE9wZW5zIHRoZSBvdmVybGF5IHdpdGggdGhlIGNhbGVuZGFyLiAqL1xuICBwcml2YXRlIF9vcGVuT3ZlcmxheSgpOiB2b2lkIHtcbiAgICB0aGlzLl9kZXN0cm95T3ZlcmxheSgpO1xuXG4gICAgY29uc3QgaXNEaWFsb2cgPSB0aGlzLnRvdWNoVWk7XG4gICAgY29uc3QgbGFiZWxJZCA9IHRoaXMuZGF0ZXRpbWVwaWNrZXJJbnB1dC5nZXRPdmVybGF5TGFiZWxJZCgpO1xuXG4gICAgY29uc3QgcG9ydGFsID0gbmV3IENvbXBvbmVudFBvcnRhbDxNdHhEYXRldGltZXBpY2tlckNvbnRlbnQ8RD4+KFxuICAgICAgTXR4RGF0ZXRpbWVwaWNrZXJDb250ZW50LFxuICAgICAgdGhpcy5fdmlld0NvbnRhaW5lclJlZlxuICAgICk7XG4gICAgY29uc3Qgb3ZlcmxheVJlZiA9ICh0aGlzLl9vdmVybGF5UmVmID0gdGhpcy5fb3ZlcmxheS5jcmVhdGUoXG4gICAgICBuZXcgT3ZlcmxheUNvbmZpZyh7XG4gICAgICAgIHBvc2l0aW9uU3RyYXRlZ3k6IGlzRGlhbG9nID8gdGhpcy5fZ2V0RGlhbG9nU3RyYXRlZ3koKSA6IHRoaXMuX2dldERyb3Bkb3duU3RyYXRlZ3koKSxcbiAgICAgICAgaGFzQmFja2Ryb3A6IHRydWUsXG4gICAgICAgIGJhY2tkcm9wQ2xhc3M6IFtcbiAgICAgICAgICBpc0RpYWxvZyA/ICdjZGstb3ZlcmxheS1kYXJrLWJhY2tkcm9wJyA6ICdtYXQtb3ZlcmxheS10cmFuc3BhcmVudC1iYWNrZHJvcCcsXG4gICAgICAgICAgdGhpcy5fYmFja2Ryb3BIYXJuZXNzQ2xhc3MsXG4gICAgICAgIF0sXG4gICAgICAgIGRpcmVjdGlvbjogdGhpcy5fZGlyLFxuICAgICAgICBzY3JvbGxTdHJhdGVneTogaXNEaWFsb2cgPyB0aGlzLl9vdmVybGF5LnNjcm9sbFN0cmF0ZWdpZXMuYmxvY2soKSA6IHRoaXMuX3Njcm9sbFN0cmF0ZWd5KCksXG4gICAgICAgIHBhbmVsQ2xhc3M6IGBtdHgtZGF0ZXRpbWVwaWNrZXItJHtpc0RpYWxvZyA/ICdkaWFsb2cnIDogJ3BvcHVwJ31gLFxuICAgICAgfSlcbiAgICApKTtcblxuICAgIGNvbnN0IG92ZXJsYXlFbGVtZW50ID0gb3ZlcmxheVJlZi5vdmVybGF5RWxlbWVudDtcbiAgICBvdmVybGF5RWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAnZGlhbG9nJyk7XG5cbiAgICBpZiAobGFiZWxJZCkge1xuICAgICAgb3ZlcmxheUVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsbGVkYnknLCBsYWJlbElkKTtcbiAgICB9XG5cbiAgICBpZiAoaXNEaWFsb2cpIHtcbiAgICAgIG92ZXJsYXlFbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1tb2RhbCcsICd0cnVlJyk7XG4gICAgfVxuXG4gICAgdGhpcy5fZ2V0Q2xvc2VTdHJlYW0ob3ZlcmxheVJlZikuc3Vic2NyaWJlKGV2ZW50ID0+IHtcbiAgICAgIGlmIChldmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfVxuICAgICAgdGhpcy5jbG9zZSgpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5fY29tcG9uZW50UmVmID0gb3ZlcmxheVJlZi5hdHRhY2gocG9ydGFsKTtcbiAgICB0aGlzLl9mb3J3YXJkQ29udGVudFZhbHVlcyh0aGlzLl9jb21wb25lbnRSZWYuaW5zdGFuY2UpO1xuXG4gICAgLy8gVXBkYXRlIHRoZSBwb3NpdGlvbiBvbmNlIHRoZSBjYWxlbmRhciBoYXMgcmVuZGVyZWQuIE9ubHkgcmVsZXZhbnQgaW4gZHJvcGRvd24gbW9kZS5cbiAgICBpZiAoIWlzRGlhbG9nKSB7XG4gICAgICBhZnRlck5leHRSZW5kZXIoXG4gICAgICAgICgpID0+IHtcbiAgICAgICAgICBvdmVybGF5UmVmLnVwZGF0ZVBvc2l0aW9uKCk7XG4gICAgICAgIH0sXG4gICAgICAgIHsgaW5qZWN0b3I6IHRoaXMuX2luamVjdG9yIH1cbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgLyoqIERlc3Ryb3lzIHRoZSBjdXJyZW50IG92ZXJsYXkuICovXG4gIHByaXZhdGUgX2Rlc3Ryb3lPdmVybGF5KCkge1xuICAgIGlmICh0aGlzLl9vdmVybGF5UmVmKSB7XG4gICAgICB0aGlzLl9vdmVybGF5UmVmLmRpc3Bvc2UoKTtcbiAgICAgIHRoaXMuX292ZXJsYXlSZWYgPSB0aGlzLl9jb21wb25lbnRSZWYgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBHZXRzIGEgcG9zaXRpb24gc3RyYXRlZ3kgdGhhdCB3aWxsIG9wZW4gdGhlIGNhbGVuZGFyIGFzIGEgZHJvcGRvd24uICovXG4gIHByaXZhdGUgX2dldERpYWxvZ1N0cmF0ZWd5KCkge1xuICAgIHJldHVybiB0aGlzLl9vdmVybGF5LnBvc2l0aW9uKCkuZ2xvYmFsKCkuY2VudGVySG9yaXpvbnRhbGx5KCkuY2VudGVyVmVydGljYWxseSgpO1xuICB9XG5cbiAgLyoqIEdldHMgYSBwb3NpdGlvbiBzdHJhdGVneSB0aGF0IHdpbGwgb3BlbiB0aGUgY2FsZW5kYXIgYXMgYSBkcm9wZG93bi4gKi9cbiAgcHJpdmF0ZSBfZ2V0RHJvcGRvd25TdHJhdGVneSgpIHtcbiAgICBjb25zdCBzdHJhdGVneSA9IHRoaXMuX292ZXJsYXlcbiAgICAgIC5wb3NpdGlvbigpXG4gICAgICAuZmxleGlibGVDb25uZWN0ZWRUbyh0aGlzLmRhdGV0aW1lcGlja2VySW5wdXQuZ2V0Q29ubmVjdGVkT3ZlcmxheU9yaWdpbigpKVxuICAgICAgLndpdGhUcmFuc2Zvcm1PcmlnaW5PbignLm10eC1kYXRldGltZXBpY2tlci1jb250ZW50JylcbiAgICAgIC53aXRoRmxleGlibGVEaW1lbnNpb25zKGZhbHNlKVxuICAgICAgLndpdGhWaWV3cG9ydE1hcmdpbig4KVxuICAgICAgLndpdGhMb2NrZWRQb3NpdGlvbigpO1xuXG4gICAgcmV0dXJuIHRoaXMuX3NldENvbm5lY3RlZFBvc2l0aW9ucyhzdHJhdGVneSk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgcG9zaXRpb25zIG9mIHRoZSBkYXRldGltZXBpY2tlciBpbiBkcm9wZG93biBtb2RlIGJhc2VkIG9uIHRoZSBjdXJyZW50IGNvbmZpZ3VyYXRpb24uXG4gICAqL1xuICBwcml2YXRlIF9zZXRDb25uZWN0ZWRQb3NpdGlvbnMoc3RyYXRlZ3k6IEZsZXhpYmxlQ29ubmVjdGVkUG9zaXRpb25TdHJhdGVneSkge1xuICAgIGNvbnN0IHByaW1hcnlYID0gdGhpcy54UG9zaXRpb24gPT09ICdlbmQnID8gJ2VuZCcgOiAnc3RhcnQnO1xuICAgIGNvbnN0IHNlY29uZGFyeVggPSBwcmltYXJ5WCA9PT0gJ3N0YXJ0JyA/ICdlbmQnIDogJ3N0YXJ0JztcbiAgICBjb25zdCBwcmltYXJ5WSA9IHRoaXMueVBvc2l0aW9uID09PSAnYWJvdmUnID8gJ2JvdHRvbScgOiAndG9wJztcbiAgICBjb25zdCBzZWNvbmRhcnlZID0gcHJpbWFyeVkgPT09ICd0b3AnID8gJ2JvdHRvbScgOiAndG9wJztcblxuICAgIHJldHVybiBzdHJhdGVneS53aXRoUG9zaXRpb25zKFtcbiAgICAgIHtcbiAgICAgICAgb3JpZ2luWDogcHJpbWFyeVgsXG4gICAgICAgIG9yaWdpblk6IHNlY29uZGFyeVksXG4gICAgICAgIG92ZXJsYXlYOiBwcmltYXJ5WCxcbiAgICAgICAgb3ZlcmxheVk6IHByaW1hcnlZLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgb3JpZ2luWDogcHJpbWFyeVgsXG4gICAgICAgIG9yaWdpblk6IHByaW1hcnlZLFxuICAgICAgICBvdmVybGF5WDogcHJpbWFyeVgsXG4gICAgICAgIG92ZXJsYXlZOiBzZWNvbmRhcnlZLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgb3JpZ2luWDogc2Vjb25kYXJ5WCxcbiAgICAgICAgb3JpZ2luWTogc2Vjb25kYXJ5WSxcbiAgICAgICAgb3ZlcmxheVg6IHNlY29uZGFyeVgsXG4gICAgICAgIG92ZXJsYXlZOiBwcmltYXJ5WSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG9yaWdpblg6IHNlY29uZGFyeVgsXG4gICAgICAgIG9yaWdpblk6IHByaW1hcnlZLFxuICAgICAgICBvdmVybGF5WDogc2Vjb25kYXJ5WCxcbiAgICAgICAgb3ZlcmxheVk6IHNlY29uZGFyeVksXG4gICAgICB9LFxuICAgIF0pO1xuICB9XG5cbiAgLyoqIEdldHMgYW4gb2JzZXJ2YWJsZSB0aGF0IHdpbGwgZW1pdCB3aGVuIHRoZSBvdmVybGF5IGlzIHN1cHBvc2VkIHRvIGJlIGNsb3NlZC4gKi9cbiAgcHJpdmF0ZSBfZ2V0Q2xvc2VTdHJlYW0ob3ZlcmxheVJlZjogT3ZlcmxheVJlZikge1xuICAgIHJldHVybiBtZXJnZShcbiAgICAgIG92ZXJsYXlSZWYuYmFja2Ryb3BDbGljaygpLFxuICAgICAgb3ZlcmxheVJlZi5kZXRhY2htZW50cygpLFxuICAgICAgb3ZlcmxheVJlZi5rZXlkb3duRXZlbnRzKCkucGlwZShcbiAgICAgICAgZmlsdGVyKGV2ZW50ID0+IHtcbiAgICAgICAgICAvLyBDbG9zaW5nIG9uIGFsdCArIHVwIGlzIG9ubHkgdmFsaWQgd2hlbiB0aGVyZSdzIGFuIGlucHV0IGFzc29jaWF0ZWQgd2l0aCB0aGVcbiAgICAgICAgICAvLyBkYXRldGltZXBpY2tlci5cbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgKGV2ZW50LmtleUNvZGUgPT09IEVTQ0FQRSAmJiAhaGFzTW9kaWZpZXJLZXkoZXZlbnQpKSB8fFxuICAgICAgICAgICAgKHRoaXMuZGF0ZXRpbWVwaWNrZXJJbnB1dCAmJlxuICAgICAgICAgICAgICBoYXNNb2RpZmllcktleShldmVudCwgJ2FsdEtleScpICYmXG4gICAgICAgICAgICAgIGV2ZW50LmtleUNvZGUgPT09IFVQX0FSUk9XKVxuICAgICAgICAgICk7XG4gICAgICAgIH0pXG4gICAgICApXG4gICAgKTtcbiAgfVxufVxuIiwiPGRpdiBjZGtUcmFwRm9jdXNcbiAgICAgcm9sZT1cImRpYWxvZ1wiXG4gICAgIFthdHRyLmFyaWEtbW9kYWxdPVwidHJ1ZVwiXG4gICAgIFthdHRyLmFyaWEtbGFiZWxsZWRieV09XCJfZGlhbG9nTGFiZWxJZCA/PyB1bmRlZmluZWRcIlxuICAgICBbYXR0ci5tb2RlXT1cImRhdGV0aW1lcGlja2VyLm1vZGVcIlxuICAgICBjbGFzcz1cIm10eC1kYXRldGltZXBpY2tlci1jb250ZW50LWNvbnRhaW5lclwiPlxuICA8bXR4LWNhbGVuZGFyIFtpZF09XCJkYXRldGltZXBpY2tlci5pZFwiXG4gICAgICAgICAgICAgICAgW2NsYXNzXT1cImRhdGV0aW1lcGlja2VyLnBhbmVsQ2xhc3NcIlxuICAgICAgICAgICAgICAgIFthdHRyLm1vZGVdPVwiZGF0ZXRpbWVwaWNrZXIubW9kZVwiXG4gICAgICAgICAgICAgICAgW3R5cGVdPVwiZGF0ZXRpbWVwaWNrZXIudHlwZVwiXG4gICAgICAgICAgICAgICAgW3N0YXJ0QXRdPVwiZGF0ZXRpbWVwaWNrZXIuc3RhcnRBdFwiXG4gICAgICAgICAgICAgICAgW3N0YXJ0Vmlld109XCJkYXRldGltZXBpY2tlci5zdGFydFZpZXdcIlxuICAgICAgICAgICAgICAgIFttYXhEYXRlXT1cImRhdGV0aW1lcGlja2VyLl9tYXhEYXRlXCJcbiAgICAgICAgICAgICAgICBbbWluRGF0ZV09XCJkYXRldGltZXBpY2tlci5fbWluRGF0ZVwiXG4gICAgICAgICAgICAgICAgW2RhdGVGaWx0ZXJdPVwiZGF0ZXRpbWVwaWNrZXIuX2RhdGVGaWx0ZXJcIlxuICAgICAgICAgICAgICAgIFttdWx0aVllYXJTZWxlY3Rvcl09XCJkYXRldGltZXBpY2tlci5tdWx0aVllYXJTZWxlY3RvclwiXG4gICAgICAgICAgICAgICAgW3ByZXZlbnRTYW1lRGF0ZVRpbWVTZWxlY3Rpb25dPVwiZGF0ZXRpbWVwaWNrZXIucHJldmVudFNhbWVEYXRlVGltZVNlbGVjdGlvblwiXG4gICAgICAgICAgICAgICAgW2hlYWRlckNvbXBvbmVudF09XCJkYXRldGltZXBpY2tlci5jYWxlbmRhckhlYWRlckNvbXBvbmVudFwiXG4gICAgICAgICAgICAgICAgW3RpbWVJbnRlcnZhbF09XCJkYXRldGltZXBpY2tlci50aW1lSW50ZXJ2YWxcIlxuICAgICAgICAgICAgICAgIFt0d2VsdmVob3VyXT1cImRhdGV0aW1lcGlja2VyLnR3ZWx2ZWhvdXJcIlxuICAgICAgICAgICAgICAgIFtzZWxlY3RlZF09XCJkYXRldGltZXBpY2tlci5fc2VsZWN0ZWRcIlxuICAgICAgICAgICAgICAgIFt0aW1lSW5wdXRdPVwiZGF0ZXRpbWVwaWNrZXIudGltZUlucHV0XCJcbiAgICAgICAgICAgICAgICAoc2VsZWN0ZWRDaGFuZ2UpPVwiZGF0ZXRpbWVwaWNrZXIuX3NlbGVjdCgkZXZlbnQpXCJcbiAgICAgICAgICAgICAgICAodmlld0NoYW5nZWQpPVwiZGF0ZXRpbWVwaWNrZXIuX3ZpZXdDaGFuZ2VkKCRldmVudClcIlxuICAgICAgICAgICAgICAgIChfdXNlclNlbGVjdGlvbik9XCJkYXRldGltZXBpY2tlci5jbG9zZSgpXCJcbiAgICAgICAgICAgICAgICBbQGZhZGVJbkNhbGVuZGFyXT1cIidlbnRlcidcIj5cbiAgPC9tdHgtY2FsZW5kYXI+XG48L2Rpdj5cbiJdfQ==