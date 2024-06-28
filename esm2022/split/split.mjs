import { ChangeDetectionStrategy, Component, EventEmitter, Inject, InjectionToken, Input, Optional, Output, ViewChildren, ViewEncapsulation, booleanAttribute, } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { getAreaMaxSize, getAreaMinSize, getElementPixelSize, getGutterSideAbsorptionCapacity, getInputPositiveNumber, getPointFromEvent, isUserSizesValid, updateAreaSize, } from './utils';
import * as i0 from "@angular/core";
/** Injection token that can be used to specify default split options. */
export const MTX_SPLIT_DEFAULT_OPTIONS = new InjectionToken('mtx-split-default-options');
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
export class MtxSplit {
    /** The split direction. */
    get direction() {
        return this._direction;
    }
    set direction(v) {
        this._direction = v === 'vertical' ? 'vertical' : 'horizontal';
        this.renderer.addClass(this.elRef.nativeElement, `mtx-split-${this._direction}`);
        this.renderer.removeClass(this.elRef.nativeElement, `mtx-split-${this._direction === 'vertical' ? 'horizontal' : 'vertical'}`);
        this.build(false, false);
    }
    /** The unit you want to specify area sizes. */
    get unit() {
        return this._unit;
    }
    set unit(v) {
        this._unit = v === 'pixel' ? 'pixel' : 'percent';
        this.renderer.addClass(this.elRef.nativeElement, `mtx-split-${this._unit}`);
        this.renderer.removeClass(this.elRef.nativeElement, `mtx-split-${this._unit === 'pixel' ? 'percent' : 'pixel'}`);
        this.build(false, true);
    }
    /** Gutters's size (dragging elements) in pixels. */
    get gutterSize() {
        return this._gutterSize;
    }
    set gutterSize(v) {
        this._gutterSize = getInputPositiveNumber(v, 4);
        this.build(false, false);
    }
    /** Gutter step while moving in pixels. */
    get gutterStep() {
        return this._gutterStep;
    }
    set gutterStep(v) {
        this._gutterStep = getInputPositiveNumber(v, 1);
    }
    /** Add transition when toggling visibility using `visible` or `size` changes. */
    get useTransition() {
        return this._useTransition;
    }
    set useTransition(v) {
        if (this._useTransition) {
            this.renderer.addClass(this.elRef.nativeElement, 'mtx-split-transition');
        }
        else {
            this.renderer.removeClass(this.elRef.nativeElement, 'mtx-split-transition');
        }
    }
    /**
     * Disable the dragging feature (remove cursor/image on gutters).
     * `gutterClick`/`gutterDblClick` still emits.
     */
    get disabled() {
        return this._disabled;
    }
    set disabled(v) {
        if (this._disabled) {
            this.renderer.addClass(this.elRef.nativeElement, 'mtx-split-disabled');
        }
        else {
            this.renderer.removeClass(this.elRef.nativeElement, 'mtx-split-disabled');
        }
    }
    /** Indicates the directionality of the areas. */
    get dir() {
        return this._dir;
    }
    set dir(v) {
        this._dir = v === 'rtl' ? 'rtl' : 'ltr';
        this.renderer.setAttribute(this.elRef.nativeElement, 'dir', this._dir);
    }
    /**
     * Milliseconds to detect a double click on a gutter. Set it around 300-500ms if
     * you want to use `gutterDblClick` event.
     */
    get gutterDblClickDuration() {
        return this._gutterDblClickDuration;
    }
    set gutterDblClickDuration(v) {
        this._gutterDblClickDuration = getInputPositiveNumber(v, 0);
    }
    /**
     * Event emitted when transition ends (could be triggered from `visible` or `size` changes).
     * Only if `useTransition` equals true.
     */
    get transitionEnd() {
        return new Observable(subscriber => (this.transitionEndSubscriber = subscriber)).pipe(debounceTime(20));
    }
    constructor(ngZone, elRef, cdRef, renderer, _defaultOptions) {
        this.ngZone = ngZone;
        this.elRef = elRef;
        this.cdRef = cdRef;
        this.renderer = renderer;
        this._defaultOptions = _defaultOptions;
        this._direction = 'horizontal';
        this._unit = 'percent';
        this._gutterSize = 4;
        this._gutterStep = 1;
        /** Set to true if you want to limit gutter move to adjacent areas only. */
        this.restrictMove = false;
        this._useTransition = false;
        this._disabled = false;
        this._dir = 'ltr';
        this._gutterDblClickDuration = 0;
        /** Event emitted when drag starts. */
        this.dragStart = new EventEmitter(false);
        /** Event emitted when drag ends. */
        this.dragEnd = new EventEmitter(false);
        /** Event emitted when user clicks on a gutter. */
        this.gutterClick = new EventEmitter(false);
        /** Event emitted when user double clicks on a gutter. */
        this.gutterDblClick = new EventEmitter(false);
        this.dragProgressSubject = new Subject();
        this.dragProgress$ = this.dragProgressSubject.asObservable();
        this.isDragging = false;
        this.dragListeners = [];
        this.snapshot = null;
        this.startPoint = null;
        this.endPoint = null;
        this.displayedAreas = [];
        this.hidedAreas = [];
        this._clickTimeout = null;
        this.color = _defaultOptions?.color ?? 'primary';
        this.direction = _defaultOptions?.direction ?? 'horizontal';
        this.dir = _defaultOptions?.dir ?? 'ltr';
        this.unit = _defaultOptions?.unit ?? 'percent';
        this.gutterDblClickDuration = _defaultOptions?.gutterDblClickDuration ?? 0;
        this.gutterSize = _defaultOptions?.gutterSize ?? 4;
        this.gutterStep = _defaultOptions?.gutterStep ?? 1;
        this.restrictMove = _defaultOptions?.restrictMove ?? false;
        this.useTransition = _defaultOptions?.useTransition ?? false;
    }
    ngAfterViewInit() {
        this.ngZone.runOutsideAngular(() => {
            // To avoid transition at first rendering
            setTimeout(() => this.renderer.addClass(this.elRef.nativeElement, 'mtx-split-init'));
        });
    }
    getNbGutters() {
        return this.displayedAreas.length === 0 ? 0 : this.displayedAreas.length - 1;
    }
    addArea(component) {
        const newArea = {
            component,
            order: 0,
            size: 0,
            minSize: null,
            maxSize: null,
        };
        if (component.visible === true) {
            this.displayedAreas.push(newArea);
            this.build(true, true);
        }
        else {
            this.hidedAreas.push(newArea);
        }
    }
    removeArea(component) {
        if (this.displayedAreas.some(a => a.component === component)) {
            const area = this.displayedAreas.find(a => a.component === component);
            this.displayedAreas.splice(this.displayedAreas.indexOf(area), 1);
            this.build(true, true);
        }
        else if (this.hidedAreas.some(a => a.component === component)) {
            const area = this.hidedAreas.find(a => a.component === component);
            this.hidedAreas.splice(this.hidedAreas.indexOf(area), 1);
        }
    }
    updateArea(component, resetOrders, resetSizes) {
        if (component.visible === true) {
            this.build(resetOrders, resetSizes);
        }
    }
    showArea(component) {
        const area = this.hidedAreas.find(a => a.component === component);
        if (area === undefined) {
            return;
        }
        const areas = this.hidedAreas.splice(this.hidedAreas.indexOf(area), 1);
        this.displayedAreas.push(...areas);
        this.build(true, true);
    }
    hideArea(comp) {
        const area = this.displayedAreas.find(a => a.component === comp);
        if (area === undefined) {
            return;
        }
        const areas = this.displayedAreas.splice(this.displayedAreas.indexOf(area), 1);
        areas.forEach(_area => {
            _area.order = 0;
            _area.size = 0;
        });
        this.hidedAreas.push(...areas);
        this.build(true, true);
    }
    getVisibleAreaSizes() {
        return this.displayedAreas.map(a => (a.size === null ? '*' : a.size));
    }
    setVisibleAreaSizes(sizes) {
        if (sizes.length !== this.displayedAreas.length) {
            return false;
        }
        const formatedSizes = sizes.map(s => getInputPositiveNumber(s, null));
        const isValid = isUserSizesValid(this.unit, formatedSizes);
        if (isValid === false) {
            return false;
        }
        this.displayedAreas.forEach((area, i) => (area.component.size = formatedSizes[i]));
        this.build(false, true);
        return true;
    }
    build(resetOrders, resetSizes) {
        this.stopDragging();
        // ¤ AREAS ORDER
        if (resetOrders === true) {
            // If user provided 'order' for each area, use it to sort them.
            if (this.displayedAreas.every(a => a.component.order !== null)) {
                this.displayedAreas.sort((a, b) => a.component.order - b.component.order);
            }
            // Then set real order with multiples of 2, numbers between will be used by gutters.
            this.displayedAreas.forEach((area, i) => {
                area.order = i * 2;
                area.component.setStyleOrder(area.order);
            });
        }
        // ¤ AREAS SIZE
        if (resetSizes === true) {
            const useUserSizes = isUserSizesValid(this.unit, this.displayedAreas.map(a => a.component.size));
            switch (this.unit) {
                case 'percent': {
                    const defaultSize = 100 / this.displayedAreas.length;
                    this.displayedAreas.forEach(area => {
                        area.size = useUserSizes ? area.component.size : defaultSize;
                        area.minSize = getAreaMinSize(area);
                        area.maxSize = getAreaMaxSize(area);
                    });
                    break;
                }
                case 'pixel': {
                    if (useUserSizes) {
                        this.displayedAreas.forEach(area => {
                            area.size = area.component.size;
                            area.minSize = getAreaMinSize(area);
                            area.maxSize = getAreaMaxSize(area);
                        });
                    }
                    else {
                        const wildcardSizeAreas = this.displayedAreas.filter(a => a.component.size === null);
                        // No wildcard area > Need to select one arbitrarily > first
                        if (wildcardSizeAreas.length === 0 && this.displayedAreas.length > 0) {
                            this.displayedAreas.forEach((area, i) => {
                                area.size = i === 0 ? null : area.component.size;
                                area.minSize = i === 0 ? null : getAreaMinSize(area);
                                area.maxSize = i === 0 ? null : getAreaMaxSize(area);
                            });
                        }
                        // More than one wildcard area > Need to keep only one arbitrarly > first
                        else if (wildcardSizeAreas.length > 1) {
                            let alreadyGotOne = false;
                            this.displayedAreas.forEach(area => {
                                if (area.component.size === null) {
                                    if (alreadyGotOne === false) {
                                        area.size = null;
                                        area.minSize = null;
                                        area.maxSize = null;
                                        alreadyGotOne = true;
                                    }
                                    else {
                                        area.size = 100;
                                        area.minSize = null;
                                        area.maxSize = null;
                                    }
                                }
                                else {
                                    area.size = area.component.size;
                                    area.minSize = getAreaMinSize(area);
                                    area.maxSize = getAreaMaxSize(area);
                                }
                            });
                        }
                    }
                    break;
                }
            }
        }
        this.refreshStyleSizes();
        this.cdRef.markForCheck();
    }
    refreshStyleSizes() {
        ///////////////////////////////////////////
        // PERCENT MODE
        if (this.unit === 'percent') {
            // Only one area > flex-basis 100%
            if (this.displayedAreas.length === 1) {
                this.displayedAreas[0].component.setStyleFlex(0, 0, `100%`, false, false);
            }
            // Multiple areas > use each percent basis
            else {
                const sumGutterSize = this.getNbGutters() * this.gutterSize;
                this.displayedAreas.forEach(area => {
                    area.component.setStyleFlex(0, 0, `calc( ${area.size}% - ${(area.size / 100) * sumGutterSize}px )`, area.minSize !== null && area.minSize === area.size ? true : false, area.maxSize !== null && area.maxSize === area.size ? true : false);
                });
            }
        }
        ///////////////////////////////////////////
        // PIXEL MODE
        else if (this.unit === 'pixel') {
            this.displayedAreas.forEach(area => {
                // Area with wildcard size
                if (area.size === null) {
                    if (this.displayedAreas.length === 1) {
                        area.component.setStyleFlex(1, 1, `100%`, false, false);
                    }
                    else {
                        area.component.setStyleFlex(1, 1, `auto`, false, false);
                    }
                }
                // Area with pixel size
                else {
                    // Only one area > flex-basis 100%
                    if (this.displayedAreas.length === 1) {
                        area.component.setStyleFlex(0, 0, `100%`, false, false);
                    }
                    // Multiple areas > use each pixel basis
                    else {
                        area.component.setStyleFlex(0, 0, `${area.size}px`, area.minSize !== null && area.minSize === area.size ? true : false, area.maxSize !== null && area.maxSize === area.size ? true : false);
                    }
                }
            });
        }
    }
    clickGutter(event, gutterNum) {
        const tempPoint = getPointFromEvent(event);
        // Be sure mouseup/touchend happened at same point as mousedown/touchstart to trigger click/dblclick
        if (this.startPoint && this.startPoint.x === tempPoint.x && this.startPoint.y === tempPoint.y) {
            // If timeout in progress and new click > clearTimeout & dblClickEvent
            if (this._clickTimeout !== null) {
                window.clearTimeout(this._clickTimeout);
                this._clickTimeout = null;
                this.notify('dblclick', gutterNum);
                this.stopDragging();
            }
            // Else start timeout to call clickEvent at end
            else {
                this._clickTimeout = window.setTimeout(() => {
                    this._clickTimeout = null;
                    this.notify('click', gutterNum);
                    this.stopDragging();
                }, this.gutterDblClickDuration);
            }
        }
    }
    startDragging(event, gutterOrder, gutterNum) {
        event.preventDefault();
        event.stopPropagation();
        this.startPoint = getPointFromEvent(event);
        if (this.startPoint === null || this.disabled === true) {
            return;
        }
        this.snapshot = {
            gutterNum,
            lastSteppedOffset: 0,
            allAreasSizePixel: getElementPixelSize(this.elRef, this.direction) - this.getNbGutters() * this.gutterSize,
            allInvolvedAreasSizePercent: 100,
            areasBeforeGutter: [],
            areasAfterGutter: [],
        };
        this.displayedAreas.forEach(area => {
            const areaSnapshot = {
                area,
                sizePixelAtStart: getElementPixelSize(area.component.elRef, this.direction),
                sizePercentAtStart: (this.unit === 'percent' ? area.size : -1), // If pixel mode, anyway, will not be used.
            };
            if (area.order < gutterOrder) {
                if (this.restrictMove === true) {
                    this.snapshot.areasBeforeGutter = [areaSnapshot];
                }
                else {
                    this.snapshot.areasBeforeGutter.unshift(areaSnapshot);
                }
            }
            else if (area.order > gutterOrder) {
                if (this.restrictMove === true) {
                    if (this.snapshot.areasAfterGutter.length === 0) {
                        this.snapshot.areasAfterGutter = [areaSnapshot];
                    }
                }
                else {
                    this.snapshot.areasAfterGutter.push(areaSnapshot);
                }
            }
        });
        this.snapshot.allInvolvedAreasSizePercent = [
            ...this.snapshot.areasBeforeGutter,
            ...this.snapshot.areasAfterGutter,
        ].reduce((t, a) => t + a.sizePercentAtStart, 0);
        if (this.snapshot.areasBeforeGutter.length === 0 ||
            this.snapshot.areasAfterGutter.length === 0) {
            return;
        }
        this.dragListeners.push(this.renderer.listen('document', 'mouseup', this.stopDragging.bind(this)));
        this.dragListeners.push(this.renderer.listen('document', 'touchend', this.stopDragging.bind(this)));
        this.dragListeners.push(this.renderer.listen('document', 'touchcancel', this.stopDragging.bind(this)));
        this.ngZone.runOutsideAngular(() => {
            this.dragListeners.push(this.renderer.listen('document', 'mousemove', this.dragEvent.bind(this)));
            this.dragListeners.push(this.renderer.listen('document', 'touchmove', this.dragEvent.bind(this)));
        });
        this.displayedAreas.forEach(area => area.component.lockEvents());
        this.isDragging = true;
        this.renderer.addClass(this.elRef.nativeElement, 'mtx-dragging');
        this.renderer.addClass(this.gutterEls.toArray()[this.snapshot.gutterNum - 1].nativeElement, 'mtx-dragged');
        this.notify('start', this.snapshot.gutterNum);
    }
    dragEvent(event) {
        event.preventDefault();
        event.stopPropagation();
        if (this._clickTimeout !== null) {
            window.clearTimeout(this._clickTimeout);
            this._clickTimeout = null;
        }
        if (this.isDragging === false) {
            return;
        }
        this.endPoint = getPointFromEvent(event);
        if (this.endPoint === null) {
            return;
        }
        // Calculate steppedOffset
        let offset = this.direction === 'horizontal'
            ? this.startPoint.x - this.endPoint.x
            : this.startPoint.y - this.endPoint.y;
        if (this.dir === 'rtl' && this.direction === 'horizontal') {
            offset = -offset;
        }
        const steppedOffset = Math.round(offset / this.gutterStep) * this.gutterStep;
        if (steppedOffset === this.snapshot.lastSteppedOffset) {
            return;
        }
        this.snapshot.lastSteppedOffset = steppedOffset;
        // Need to know if each gutter side areas could reacts to steppedOffset
        let areasBefore = getGutterSideAbsorptionCapacity(this.unit, this.snapshot.areasBeforeGutter, -steppedOffset, this.snapshot.allAreasSizePixel);
        let areasAfter = getGutterSideAbsorptionCapacity(this.unit, this.snapshot.areasAfterGutter, steppedOffset, this.snapshot.allAreasSizePixel);
        // Each gutter side areas can't absorb all offset
        if (areasBefore.remain !== 0 && areasAfter.remain !== 0) {
            if (Math.abs(areasBefore.remain) === Math.abs(areasAfter.remain)) {
                /** */
            }
            else if (Math.abs(areasBefore.remain) > Math.abs(areasAfter.remain)) {
                areasAfter = getGutterSideAbsorptionCapacity(this.unit, this.snapshot.areasAfterGutter, steppedOffset + areasBefore.remain, this.snapshot.allAreasSizePixel);
            }
            else {
                areasBefore = getGutterSideAbsorptionCapacity(this.unit, this.snapshot.areasBeforeGutter, -(steppedOffset - areasAfter.remain), this.snapshot.allAreasSizePixel);
            }
        }
        // Areas before gutter can't absorbs all offset > need to recalculate sizes for areas after gutter.
        else if (areasBefore.remain !== 0) {
            areasAfter = getGutterSideAbsorptionCapacity(this.unit, this.snapshot.areasAfterGutter, steppedOffset + areasBefore.remain, this.snapshot.allAreasSizePixel);
        }
        // Areas after gutter can't absorbs all offset > need to recalculate sizes for areas before gutter.
        else if (areasAfter.remain !== 0) {
            areasBefore = getGutterSideAbsorptionCapacity(this.unit, this.snapshot.areasBeforeGutter, -(steppedOffset - areasAfter.remain), this.snapshot.allAreasSizePixel);
        }
        if (this.unit === 'percent') {
            // Hack because of browser messing up with sizes using calc(X% - Ypx) -> el.getBoundingClientRect()
            // If not there, playing with gutters makes total going down to 99.99875% then 99.99286%, 99.98986%,..
            const all = [...areasBefore.list, ...areasAfter.list];
            const areaToReset = all.find(a => a.percentAfterAbsorption !== 0 &&
                a.percentAfterAbsorption !== a.areaSnapshot.area.minSize &&
                a.percentAfterAbsorption !== a.areaSnapshot.area.maxSize);
            if (areaToReset) {
                areaToReset.percentAfterAbsorption =
                    this.snapshot.allInvolvedAreasSizePercent -
                        all
                            .filter(a => a !== areaToReset)
                            .reduce((total, a) => total + a.percentAfterAbsorption, 0);
            }
        }
        // Now we know areas could absorb steppedOffset, time to really update sizes
        areasBefore.list.forEach(item => updateAreaSize(this.unit, item));
        areasAfter.list.forEach(item => updateAreaSize(this.unit, item));
        this.refreshStyleSizes();
        this.notify('progress', this.snapshot.gutterNum);
    }
    stopDragging(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        if (this.isDragging === false) {
            return;
        }
        this.displayedAreas.forEach(area => area.component.unlockEvents());
        while (this.dragListeners.length > 0) {
            const fct = this.dragListeners.pop();
            if (fct) {
                fct();
            }
        }
        // Warning: Have to be before "notify('end')"
        // because "notify('end')"" can be linked to "[size]='x'" > "build()" > "stopDragging()"
        this.isDragging = false;
        // If moved from starting point, notify end
        if (this.endPoint &&
            (this.startPoint.x !== this.endPoint.x ||
                this.startPoint.y !== this.endPoint.y)) {
            this.notify('end', this.snapshot.gutterNum);
        }
        this.renderer.removeClass(this.elRef.nativeElement, 'mtx-dragging');
        this.renderer.removeClass(this.gutterEls.toArray()[this.snapshot.gutterNum - 1].nativeElement, 'mtx-dragged');
        this.snapshot = null;
        // Needed to let (click)="clickGutter(...)" event run and verify if mouse moved or not
        this.ngZone.runOutsideAngular(() => {
            setTimeout(() => {
                this.startPoint = null;
                this.endPoint = null;
            });
        });
    }
    notify(type, gutterNum) {
        const sizes = this.getVisibleAreaSizes();
        if (type === 'start') {
            this.dragStart.emit({ gutterNum, sizes });
        }
        else if (type === 'end') {
            this.dragEnd.emit({ gutterNum, sizes });
        }
        else if (type === 'click') {
            this.gutterClick.emit({ gutterNum, sizes });
        }
        else if (type === 'dblclick') {
            this.gutterDblClick.emit({ gutterNum, sizes });
        }
        else if (type === 'transitionEnd') {
            if (this.transitionEndSubscriber) {
                this.ngZone.run(() => this.transitionEndSubscriber.next(sizes));
            }
        }
        else if (type === 'progress') {
            // Stay outside zone to allow users do what they want about change detection mechanism.
            this.dragProgressSubject.next({ gutterNum, sizes });
        }
    }
    ngOnDestroy() {
        this.stopDragging();
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxSplit, deps: [{ token: i0.NgZone }, { token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: i0.Renderer2 }, { token: MTX_SPLIT_DEFAULT_OPTIONS, optional: true }], target: i0.ɵɵFactoryTarget.Component }); }
    /** @nocollapse */ static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.0.1", type: MtxSplit, isStandalone: true, selector: "mtx-split", inputs: { color: "color", direction: "direction", unit: "unit", gutterSize: "gutterSize", gutterStep: "gutterStep", restrictMove: ["restrictMove", "restrictMove", booleanAttribute], useTransition: ["useTransition", "useTransition", booleanAttribute], disabled: ["disabled", "disabled", booleanAttribute], dir: "dir", gutterDblClickDuration: "gutterDblClickDuration" }, outputs: { dragStart: "dragStart", dragEnd: "dragEnd", gutterClick: "gutterClick", gutterDblClick: "gutterDblClick", transitionEnd: "transitionEnd" }, host: { classAttribute: "mtx-split" }, viewQueries: [{ propertyName: "gutterEls", predicate: ["gutterEls"], descendants: true }], exportAs: ["mtxSplit"], ngImport: i0, template: "<ng-content></ng-content>\r\n@for (area of displayedAreas; track area; let index = $index; let last = $last) {\r\n  @if (!last) {\r\n    <div #gutterEls class=\"mtx-split-gutter\" [class]=\"color ? 'mat-' + color : ''\"\r\n      [style.flex-basis.px]=\"gutterSize\"\r\n      [style.order]=\"index * 2 + 1\"\r\n      (mousedown)=\"startDragging($event, index * 2 + 1, index + 1)\"\r\n      (touchstart)=\"startDragging($event, index * 2 + 1, index + 1)\"\r\n      (mouseup)=\"clickGutter($event, index + 1)\"\r\n      (touchend)=\"clickGutter($event, index + 1)\">\r\n      <div class=\"mtx-split-gutter-handle\"></div>\r\n    </div>\r\n  }\r\n}\r\n", styles: [".mtx-split{display:flex;flex-wrap:nowrap;justify-content:flex-start;align-items:stretch;overflow:hidden;width:100%;height:100%}.mtx-split>.mtx-split-gutter{position:relative;display:flex;flex-grow:0;flex-shrink:0;align-items:center;justify-content:center;background-color:var(--mtx-split-gutter-background-color)}.mtx-split>.mtx-split-gutter:hover{background-color:var(--mtx-split-gutter-hover-state-background-color)}.mtx-split>.mtx-split-gutter>.mtx-split-gutter-handle{position:absolute;opacity:0}.mtx-split>.mtx-split-pane{flex-grow:0;flex-shrink:0;overflow:hidden auto}.mtx-split>.mtx-split-pane.mtx-split-pane-hidden{flex:0 1 0!important;overflow:hidden hidden}.mtx-split.mtx-split-horizontal{flex-direction:row}.mtx-split.mtx-split-horizontal>.mtx-split-gutter{flex-direction:row;height:100%;cursor:col-resize}.mtx-split.mtx-split-horizontal>.mtx-split-gutter>.mtx-split-gutter-handle{width:8px;height:100%;left:-2px;right:2px}.mtx-split.mtx-split-horizontal>.mtx-split-pane{height:100%}.mtx-split.mtx-split-vertical{flex-direction:column}.mtx-split.mtx-split-vertical>.mtx-split-gutter{flex-direction:column;width:100%;cursor:row-resize}.mtx-split.mtx-split-vertical>.mtx-split-gutter>.mtx-split-gutter-handle{width:100%;height:8px;top:-2px;bottom:2px}.mtx-split.mtx-split-vertical>.mtx-split-pane{width:100%}.mtx-split.mtx-split-vertical>.mtx-split-pane.mtx-split-pane-hidden{max-width:0}.mtx-split.mtx-split-disabled>.mtx-split-gutter{cursor:default}.mtx-split.mtx-split-disabled>.mtx-split-gutter .mtx-split-gutter-handle{background-image:none}.mtx-split.mtx-split-transition.mtx-split-init:not(.mtx-dragging)>.mtx-split-gutter,.mtx-split.mtx-split-transition.mtx-split-init:not(.mtx-dragging)>.mtx-split-pane{transition:flex-basis .3s}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxSplit, decorators: [{
            type: Component,
            args: [{ selector: 'mtx-split', exportAs: 'mtxSplit', host: {
                        class: 'mtx-split',
                    }, encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, standalone: true, template: "<ng-content></ng-content>\r\n@for (area of displayedAreas; track area; let index = $index; let last = $last) {\r\n  @if (!last) {\r\n    <div #gutterEls class=\"mtx-split-gutter\" [class]=\"color ? 'mat-' + color : ''\"\r\n      [style.flex-basis.px]=\"gutterSize\"\r\n      [style.order]=\"index * 2 + 1\"\r\n      (mousedown)=\"startDragging($event, index * 2 + 1, index + 1)\"\r\n      (touchstart)=\"startDragging($event, index * 2 + 1, index + 1)\"\r\n      (mouseup)=\"clickGutter($event, index + 1)\"\r\n      (touchend)=\"clickGutter($event, index + 1)\">\r\n      <div class=\"mtx-split-gutter-handle\"></div>\r\n    </div>\r\n  }\r\n}\r\n", styles: [".mtx-split{display:flex;flex-wrap:nowrap;justify-content:flex-start;align-items:stretch;overflow:hidden;width:100%;height:100%}.mtx-split>.mtx-split-gutter{position:relative;display:flex;flex-grow:0;flex-shrink:0;align-items:center;justify-content:center;background-color:var(--mtx-split-gutter-background-color)}.mtx-split>.mtx-split-gutter:hover{background-color:var(--mtx-split-gutter-hover-state-background-color)}.mtx-split>.mtx-split-gutter>.mtx-split-gutter-handle{position:absolute;opacity:0}.mtx-split>.mtx-split-pane{flex-grow:0;flex-shrink:0;overflow:hidden auto}.mtx-split>.mtx-split-pane.mtx-split-pane-hidden{flex:0 1 0!important;overflow:hidden hidden}.mtx-split.mtx-split-horizontal{flex-direction:row}.mtx-split.mtx-split-horizontal>.mtx-split-gutter{flex-direction:row;height:100%;cursor:col-resize}.mtx-split.mtx-split-horizontal>.mtx-split-gutter>.mtx-split-gutter-handle{width:8px;height:100%;left:-2px;right:2px}.mtx-split.mtx-split-horizontal>.mtx-split-pane{height:100%}.mtx-split.mtx-split-vertical{flex-direction:column}.mtx-split.mtx-split-vertical>.mtx-split-gutter{flex-direction:column;width:100%;cursor:row-resize}.mtx-split.mtx-split-vertical>.mtx-split-gutter>.mtx-split-gutter-handle{width:100%;height:8px;top:-2px;bottom:2px}.mtx-split.mtx-split-vertical>.mtx-split-pane{width:100%}.mtx-split.mtx-split-vertical>.mtx-split-pane.mtx-split-pane-hidden{max-width:0}.mtx-split.mtx-split-disabled>.mtx-split-gutter{cursor:default}.mtx-split.mtx-split-disabled>.mtx-split-gutter .mtx-split-gutter-handle{background-image:none}.mtx-split.mtx-split-transition.mtx-split-init:not(.mtx-dragging)>.mtx-split-gutter,.mtx-split.mtx-split-transition.mtx-split-init:not(.mtx-dragging)>.mtx-split-pane{transition:flex-basis .3s}\n"] }]
        }], ctorParameters: () => [{ type: i0.NgZone }, { type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: i0.Renderer2 }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MTX_SPLIT_DEFAULT_OPTIONS]
                }] }], propDecorators: { color: [{
                type: Input
            }], direction: [{
                type: Input
            }], unit: [{
                type: Input
            }], gutterSize: [{
                type: Input
            }], gutterStep: [{
                type: Input
            }], restrictMove: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], useTransition: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], disabled: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], dir: [{
                type: Input
            }], gutterDblClickDuration: [{
                type: Input
            }], dragStart: [{
                type: Output
            }], dragEnd: [{
                type: Output
            }], gutterClick: [{
                type: Output
            }], gutterDblClick: [{
                type: Output
            }], transitionEnd: [{
                type: Output
            }], gutterEls: [{
                type: ViewChildren,
                args: ['gutterEls']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BsaXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9leHRlbnNpb25zL3NwbGl0L3NwbGl0LnRzIiwiLi4vLi4vLi4vLi4vcHJvamVjdHMvZXh0ZW5zaW9ucy9zcGxpdC9zcGxpdC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFFTCx1QkFBdUIsRUFFdkIsU0FBUyxFQUVULFlBQVksRUFDWixNQUFNLEVBQ04sY0FBYyxFQUNkLEtBQUssRUFHTCxRQUFRLEVBQ1IsTUFBTSxFQUdOLFlBQVksRUFDWixpQkFBaUIsRUFDakIsZ0JBQWdCLEdBQ2pCLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFjLE1BQU0sTUFBTSxDQUFDO0FBQ3ZELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQVk5QyxPQUFPLEVBQ0wsY0FBYyxFQUNkLGNBQWMsRUFDZCxtQkFBbUIsRUFDbkIsK0JBQStCLEVBQy9CLHNCQUFzQixFQUN0QixpQkFBaUIsRUFDakIsZ0JBQWdCLEVBQ2hCLGNBQWMsR0FDZixNQUFNLFNBQVMsQ0FBQzs7QUFFakIseUVBQXlFO0FBQ3pFLE1BQU0sQ0FBQyxNQUFNLHlCQUF5QixHQUFHLElBQUksY0FBYyxDQUN6RCwyQkFBMkIsQ0FDNUIsQ0FBQztBQUVGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBNEJHO0FBY0gsTUFBTSxPQUFPLFFBQVE7SUFHbkIsMkJBQTJCO0lBQzNCLElBQ0ksU0FBUztRQUNYLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztJQUN6QixDQUFDO0lBQ0QsSUFBSSxTQUFTLENBQUMsQ0FBNEI7UUFDeEMsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQztRQUUvRCxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsRUFBRSxhQUFhLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO1FBQ2pGLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUN2QixJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsRUFDeEIsYUFBYSxJQUFJLENBQUMsVUFBVSxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FDMUUsQ0FBQztRQUVGLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQzNCLENBQUM7SUFHRCwrQ0FBK0M7SUFDL0MsSUFDSSxJQUFJO1FBQ04sT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3BCLENBQUM7SUFDRCxJQUFJLElBQUksQ0FBQyxDQUFzQjtRQUM3QixJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1FBRWpELElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFFLGFBQWEsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDNUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQ3ZCLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUN4QixhQUFhLElBQUksQ0FBQyxLQUFLLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUM1RCxDQUFDO1FBRUYsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDMUIsQ0FBQztJQUdELG9EQUFvRDtJQUNwRCxJQUNJLFVBQVU7UUFDWixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDMUIsQ0FBQztJQUNELElBQUksVUFBVSxDQUFDLENBQVM7UUFDdEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxzQkFBc0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFaEQsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDM0IsQ0FBQztJQUdELDBDQUEwQztJQUMxQyxJQUNJLFVBQVU7UUFDWixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDMUIsQ0FBQztJQUNELElBQUksVUFBVSxDQUFDLENBQVM7UUFDdEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxzQkFBc0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQU1ELGlGQUFpRjtJQUNqRixJQUNJLGFBQWE7UUFDZixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUM7SUFDN0IsQ0FBQztJQUNELElBQUksYUFBYSxDQUFDLENBQVU7UUFDMUIsSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDeEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUUsc0JBQXNCLENBQUMsQ0FBQztRQUMzRSxDQUFDO2FBQU0sQ0FBQztZQUNOLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFFLHNCQUFzQixDQUFDLENBQUM7UUFDOUUsQ0FBQztJQUNILENBQUM7SUFHRDs7O09BR0c7SUFDSCxJQUNJLFFBQVE7UUFDVixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7SUFDeEIsQ0FBQztJQUNELElBQUksUUFBUSxDQUFDLENBQVU7UUFDckIsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDbkIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztRQUN6RSxDQUFDO2FBQU0sQ0FBQztZQUNOLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFFLG9CQUFvQixDQUFDLENBQUM7UUFDNUUsQ0FBQztJQUNILENBQUM7SUFHRCxpREFBaUQ7SUFDakQsSUFDSSxHQUFHO1FBQ0wsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ25CLENBQUM7SUFDRCxJQUFJLEdBQUcsQ0FBQyxDQUFnQjtRQUN0QixJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBRXhDLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDekUsQ0FBQztJQUdEOzs7T0FHRztJQUNILElBQ0ksc0JBQXNCO1FBQ3hCLE9BQU8sSUFBSSxDQUFDLHVCQUF1QixDQUFDO0lBQ3RDLENBQUM7SUFDRCxJQUFJLHNCQUFzQixDQUFDLENBQVM7UUFDbEMsSUFBSSxDQUFDLHVCQUF1QixHQUFHLHNCQUFzQixDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUM5RCxDQUFDO0lBV0Q7OztPQUdHO0lBQ0gsSUFDSSxhQUFhO1FBQ2YsT0FBTyxJQUFJLFVBQVUsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLHVCQUF1QixHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUNuRixZQUFZLENBQU0sRUFBRSxDQUFDLENBQ3RCLENBQUM7SUFDSixDQUFDO0lBaUJELFlBQ1UsTUFBYyxFQUNkLEtBQWlCLEVBQ2pCLEtBQXdCLEVBQ3hCLFFBQW1CLEVBR2pCLGVBQXdDO1FBTjFDLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZCxVQUFLLEdBQUwsS0FBSyxDQUFZO1FBQ2pCLFVBQUssR0FBTCxLQUFLLENBQW1CO1FBQ3hCLGFBQVEsR0FBUixRQUFRLENBQVc7UUFHakIsb0JBQWUsR0FBZixlQUFlLENBQXlCO1FBOUk1QyxlQUFVLEdBQThCLFlBQVksQ0FBQztRQWtCckQsVUFBSyxHQUF3QixTQUFTLENBQUM7UUFZdkMsZ0JBQVcsR0FBRyxDQUFDLENBQUM7UUFVaEIsZ0JBQVcsR0FBRyxDQUFDLENBQUM7UUFFeEIsMkVBQTJFO1FBQ25DLGlCQUFZLEdBQUcsS0FBSyxDQUFDO1FBY3JELG1CQUFjLEdBQUcsS0FBSyxDQUFDO1FBaUJ2QixjQUFTLEdBQUcsS0FBSyxDQUFDO1FBWWxCLFNBQUksR0FBa0IsS0FBSyxDQUFDO1FBYTVCLDRCQUF1QixHQUFHLENBQUMsQ0FBQztRQUVwQyxzQ0FBc0M7UUFDNUIsY0FBUyxHQUFHLElBQUksWUFBWSxDQUFxQixLQUFLLENBQUMsQ0FBQztRQUNsRSxvQ0FBb0M7UUFDMUIsWUFBTyxHQUFHLElBQUksWUFBWSxDQUFxQixLQUFLLENBQUMsQ0FBQztRQUNoRSxrREFBa0Q7UUFDeEMsZ0JBQVcsR0FBRyxJQUFJLFlBQVksQ0FBcUIsS0FBSyxDQUFDLENBQUM7UUFDcEUseURBQXlEO1FBQy9DLG1CQUFjLEdBQUcsSUFBSSxZQUFZLENBQXFCLEtBQUssQ0FBQyxDQUFDO1FBYS9ELHdCQUFtQixHQUFnQyxJQUFJLE9BQU8sRUFBRSxDQUFDO1FBQ3pFLGtCQUFhLEdBQW1DLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUVoRixlQUFVLEdBQUcsS0FBSyxDQUFDO1FBQ25CLGtCQUFhLEdBQXNCLEVBQUUsQ0FBQztRQUN0QyxhQUFRLEdBQTRCLElBQUksQ0FBQztRQUN6QyxlQUFVLEdBQXlCLElBQUksQ0FBQztRQUN4QyxhQUFRLEdBQXlCLElBQUksQ0FBQztRQUU5QixtQkFBYyxHQUF3QixFQUFFLENBQUM7UUFDeEMsZUFBVSxHQUF3QixFQUFFLENBQUM7UUEwUXRELGtCQUFhLEdBQWtCLElBQUksQ0FBQztRQTdQbEMsSUFBSSxDQUFDLEtBQUssR0FBRyxlQUFlLEVBQUUsS0FBSyxJQUFJLFNBQVMsQ0FBQztRQUNqRCxJQUFJLENBQUMsU0FBUyxHQUFHLGVBQWUsRUFBRSxTQUFTLElBQUksWUFBWSxDQUFDO1FBQzVELElBQUksQ0FBQyxHQUFHLEdBQUcsZUFBZSxFQUFFLEdBQUcsSUFBSSxLQUFLLENBQUM7UUFDekMsSUFBSSxDQUFDLElBQUksR0FBRyxlQUFlLEVBQUUsSUFBSSxJQUFJLFNBQVMsQ0FBQztRQUMvQyxJQUFJLENBQUMsc0JBQXNCLEdBQUcsZUFBZSxFQUFFLHNCQUFzQixJQUFJLENBQUMsQ0FBQztRQUMzRSxJQUFJLENBQUMsVUFBVSxHQUFHLGVBQWUsRUFBRSxVQUFVLElBQUksQ0FBQyxDQUFDO1FBQ25ELElBQUksQ0FBQyxVQUFVLEdBQUcsZUFBZSxFQUFFLFVBQVUsSUFBSSxDQUFDLENBQUM7UUFDbkQsSUFBSSxDQUFDLFlBQVksR0FBRyxlQUFlLEVBQUUsWUFBWSxJQUFJLEtBQUssQ0FBQztRQUMzRCxJQUFJLENBQUMsYUFBYSxHQUFHLGVBQWUsRUFBRSxhQUFhLElBQUksS0FBSyxDQUFDO0lBQy9ELENBQUM7SUFFRCxlQUFlO1FBQ2IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUU7WUFDakMseUNBQXlDO1lBQ3pDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7UUFDdkYsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU8sWUFBWTtRQUNsQixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDL0UsQ0FBQztJQUVELE9BQU8sQ0FBQyxTQUF1QjtRQUM3QixNQUFNLE9BQU8sR0FBaUI7WUFDNUIsU0FBUztZQUNULEtBQUssRUFBRSxDQUFDO1lBQ1IsSUFBSSxFQUFFLENBQUM7WUFDUCxPQUFPLEVBQUUsSUFBSTtZQUNiLE9BQU8sRUFBRSxJQUFJO1NBQ2QsQ0FBQztRQUVGLElBQUksU0FBUyxDQUFDLE9BQU8sS0FBSyxJQUFJLEVBQUUsQ0FBQztZQUMvQixJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUVsQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN6QixDQUFDO2FBQU0sQ0FBQztZQUNOLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2hDLENBQUM7SUFDSCxDQUFDO0lBRUQsVUFBVSxDQUFDLFNBQXVCO1FBQ2hDLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxLQUFLLFNBQVMsQ0FBQyxFQUFFLENBQUM7WUFDN0QsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxLQUFLLFNBQVMsQ0FBaUIsQ0FBQztZQUN0RixJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUVqRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN6QixDQUFDO2FBQU0sSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLEtBQUssU0FBUyxDQUFDLEVBQUUsQ0FBQztZQUNoRSxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLEtBQUssU0FBUyxDQUFpQixDQUFDO1lBQ2xGLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzNELENBQUM7SUFDSCxDQUFDO0lBRUQsVUFBVSxDQUFDLFNBQXVCLEVBQUUsV0FBb0IsRUFBRSxVQUFtQjtRQUMzRSxJQUFJLFNBQVMsQ0FBQyxPQUFPLEtBQUssSUFBSSxFQUFFLENBQUM7WUFDL0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDdEMsQ0FBQztJQUNILENBQUM7SUFFRCxRQUFRLENBQUMsU0FBdUI7UUFDOUIsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxLQUFLLFNBQVMsQ0FBQyxDQUFDO1FBQ2xFLElBQUksSUFBSSxLQUFLLFNBQVMsRUFBRSxDQUFDO1lBQ3ZCLE9BQU87UUFDVCxDQUFDO1FBRUQsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDdkUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQztRQUVuQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN6QixDQUFDO0lBRUQsUUFBUSxDQUFDLElBQWtCO1FBQ3pCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsS0FBSyxJQUFJLENBQUMsQ0FBQztRQUNqRSxJQUFJLElBQUksS0FBSyxTQUFTLEVBQUUsQ0FBQztZQUN2QixPQUFPO1FBQ1QsQ0FBQztRQUVELE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQy9FLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDcEIsS0FBSyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7WUFDaEIsS0FBSyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7UUFDakIsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDO1FBRS9CLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3pCLENBQUM7SUFFRCxtQkFBbUI7UUFDakIsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDeEUsQ0FBQztJQUVELG1CQUFtQixDQUFDLEtBQThCO1FBQ2hELElBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ2hELE9BQU8sS0FBSyxDQUFDO1FBQ2YsQ0FBQztRQUVELE1BQU0sYUFBYSxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQWEsQ0FBQztRQUNsRixNQUFNLE9BQU8sR0FBRyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBRTNELElBQUksT0FBTyxLQUFLLEtBQUssRUFBRSxDQUFDO1lBQ3RCLE9BQU8sS0FBSyxDQUFDO1FBQ2YsQ0FBQztRQUVELElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRW5GLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3hCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVPLEtBQUssQ0FBQyxXQUFvQixFQUFFLFVBQW1CO1FBQ3JELElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUVwQixnQkFBZ0I7UUFFaEIsSUFBSSxXQUFXLEtBQUssSUFBSSxFQUFFLENBQUM7WUFDekIsK0RBQStEO1lBQy9ELElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUMsRUFBRSxDQUFDO2dCQUMvRCxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FDdEIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBRSxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQWdCLEdBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFnQixDQUN4RSxDQUFDO1lBQ0osQ0FBQztZQUVELG9GQUFvRjtZQUNwRixJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDdEMsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNuQixJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDM0MsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO1FBRUQsZUFBZTtRQUVmLElBQUksVUFBVSxLQUFLLElBQUksRUFBRSxDQUFDO1lBQ3hCLE1BQU0sWUFBWSxHQUFHLGdCQUFnQixDQUNuQyxJQUFJLENBQUMsSUFBSSxFQUNULElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQWEsQ0FDM0QsQ0FBQztZQUVGLFFBQVEsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNsQixLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7b0JBQ2YsTUFBTSxXQUFXLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDO29CQUVyRCxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTt3QkFDakMsSUFBSSxDQUFDLElBQUksR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUM7d0JBQ3pFLElBQUksQ0FBQyxPQUFPLEdBQUcsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNwQyxJQUFJLENBQUMsT0FBTyxHQUFHLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDdEMsQ0FBQyxDQUFDLENBQUM7b0JBQ0gsTUFBTTtnQkFDUixDQUFDO2dCQUNELEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQztvQkFDYixJQUFJLFlBQVksRUFBRSxDQUFDO3dCQUNqQixJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTs0QkFDakMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQzs0QkFDaEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7NEJBQ3BDLElBQUksQ0FBQyxPQUFPLEdBQUcsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO3dCQUN0QyxDQUFDLENBQUMsQ0FBQztvQkFDTCxDQUFDO3lCQUFNLENBQUM7d0JBQ04sTUFBTSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxDQUFDO3dCQUVyRiw0REFBNEQ7d0JBQzVELElBQUksaUJBQWlCLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQzs0QkFDckUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0NBQ3RDLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQztnQ0FDakQsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQ0FDckQsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQzs0QkFDdkQsQ0FBQyxDQUFDLENBQUM7d0JBQ0wsQ0FBQzt3QkFDRCx5RUFBeUU7NkJBQ3BFLElBQUksaUJBQWlCLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDOzRCQUN0QyxJQUFJLGFBQWEsR0FBRyxLQUFLLENBQUM7NEJBQzFCLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO2dDQUNqQyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxLQUFLLElBQUksRUFBRSxDQUFDO29DQUNqQyxJQUFJLGFBQWEsS0FBSyxLQUFLLEVBQUUsQ0FBQzt3Q0FDNUIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7d0NBQ2pCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO3dDQUNwQixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQzt3Q0FDcEIsYUFBYSxHQUFHLElBQUksQ0FBQztvQ0FDdkIsQ0FBQzt5Q0FBTSxDQUFDO3dDQUNOLElBQUksQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDO3dDQUNoQixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQzt3Q0FDcEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7b0NBQ3RCLENBQUM7Z0NBQ0gsQ0FBQztxQ0FBTSxDQUFDO29DQUNOLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7b0NBQ2hDLElBQUksQ0FBQyxPQUFPLEdBQUcsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO29DQUNwQyxJQUFJLENBQUMsT0FBTyxHQUFHLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQ0FDdEMsQ0FBQzs0QkFDSCxDQUFDLENBQUMsQ0FBQzt3QkFDTCxDQUFDO29CQUNILENBQUM7b0JBQ0QsTUFBTTtnQkFDUixDQUFDO1lBQ0gsQ0FBQztRQUNILENBQUM7UUFFRCxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztRQUN6QixJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQzVCLENBQUM7SUFFTyxpQkFBaUI7UUFDdkIsMkNBQTJDO1FBQzNDLGVBQWU7UUFDZixJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssU0FBUyxFQUFFLENBQUM7WUFDNUIsa0NBQWtDO1lBQ2xDLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLENBQUM7Z0JBQ3JDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDNUUsQ0FBQztZQUNELDBDQUEwQztpQkFDckMsQ0FBQztnQkFDSixNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztnQkFFNUQsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7b0JBQ2pDLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUN6QixDQUFDLEVBQ0QsQ0FBQyxFQUNELFNBQVMsSUFBSSxDQUFDLElBQUksT0FBTyxDQUFFLElBQUksQ0FBQyxJQUFlLEdBQUcsR0FBRyxDQUFDLEdBQUcsYUFBYSxNQUFNLEVBQzVFLElBQUksQ0FBQyxPQUFPLEtBQUssSUFBSSxJQUFJLElBQUksQ0FBQyxPQUFPLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQ2xFLElBQUksQ0FBQyxPQUFPLEtBQUssSUFBSSxJQUFJLElBQUksQ0FBQyxPQUFPLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQ25FLENBQUM7Z0JBQ0osQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDO1FBQ0gsQ0FBQztRQUNELDJDQUEyQztRQUMzQyxhQUFhO2FBQ1IsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLE9BQU8sRUFBRSxDQUFDO1lBQy9CLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUNqQywwQkFBMEI7Z0JBQzFCLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxJQUFJLEVBQUUsQ0FBQztvQkFDdkIsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUUsQ0FBQzt3QkFDckMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO29CQUMxRCxDQUFDO3lCQUFNLENBQUM7d0JBQ04sSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO29CQUMxRCxDQUFDO2dCQUNILENBQUM7Z0JBQ0QsdUJBQXVCO3FCQUNsQixDQUFDO29CQUNKLGtDQUFrQztvQkFDbEMsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUUsQ0FBQzt3QkFDckMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO29CQUMxRCxDQUFDO29CQUNELHdDQUF3Qzt5QkFDbkMsQ0FBQzt3QkFDSixJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FDekIsQ0FBQyxFQUNELENBQUMsRUFDRCxHQUFHLElBQUksQ0FBQyxJQUFJLElBQUksRUFDaEIsSUFBSSxDQUFDLE9BQU8sS0FBSyxJQUFJLElBQUksSUFBSSxDQUFDLE9BQU8sS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFDbEUsSUFBSSxDQUFDLE9BQU8sS0FBSyxJQUFJLElBQUksSUFBSSxDQUFDLE9BQU8sS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FDbkUsQ0FBQztvQkFDSixDQUFDO2dCQUNILENBQUM7WUFDSCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7SUFDSCxDQUFDO0lBSUQsV0FBVyxDQUFDLEtBQThCLEVBQUUsU0FBaUI7UUFDM0QsTUFBTSxTQUFTLEdBQUcsaUJBQWlCLENBQUMsS0FBSyxDQUFrQixDQUFDO1FBRTVELG9HQUFvRztRQUNwRyxJQUFJLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEtBQUssU0FBUyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsS0FBSyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDOUYsc0VBQXNFO1lBQ3RFLElBQUksSUFBSSxDQUFDLGFBQWEsS0FBSyxJQUFJLEVBQUUsQ0FBQztnQkFDaEMsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQ3hDLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO2dCQUMxQixJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxTQUFTLENBQUMsQ0FBQztnQkFDbkMsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQ3RCLENBQUM7WUFDRCwrQ0FBK0M7aUJBQzFDLENBQUM7Z0JBQ0osSUFBSSxDQUFDLGFBQWEsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRTtvQkFDMUMsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7b0JBQzFCLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDO29CQUNoQyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7Z0JBQ3RCLENBQUMsRUFBRSxJQUFJLENBQUMsc0JBQXNCLENBQUMsQ0FBQztZQUNsQyxDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7SUFFRCxhQUFhLENBQUMsS0FBOEIsRUFBRSxXQUFtQixFQUFFLFNBQWlCO1FBQ2xGLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUN2QixLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7UUFFeEIsSUFBSSxDQUFDLFVBQVUsR0FBRyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMzQyxJQUFJLElBQUksQ0FBQyxVQUFVLEtBQUssSUFBSSxJQUFJLElBQUksQ0FBQyxRQUFRLEtBQUssSUFBSSxFQUFFLENBQUM7WUFDdkQsT0FBTztRQUNULENBQUM7UUFFRCxJQUFJLENBQUMsUUFBUSxHQUFHO1lBQ2QsU0FBUztZQUNULGlCQUFpQixFQUFFLENBQUM7WUFDcEIsaUJBQWlCLEVBQ2YsbUJBQW1CLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsSUFBSSxDQUFDLFlBQVksRUFBRSxHQUFHLElBQUksQ0FBQyxVQUFVO1lBQ3pGLDJCQUEyQixFQUFFLEdBQUc7WUFDaEMsaUJBQWlCLEVBQUUsRUFBRTtZQUNyQixnQkFBZ0IsRUFBRSxFQUFFO1NBQ3JCLENBQUM7UUFFRixJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNqQyxNQUFNLFlBQVksR0FBeUI7Z0JBQ3pDLElBQUk7Z0JBQ0osZ0JBQWdCLEVBQUUsbUJBQW1CLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQztnQkFDM0Usa0JBQWtCLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQVcsRUFBRSwyQ0FBMkM7YUFDdEgsQ0FBQztZQUVGLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxXQUFXLEVBQUUsQ0FBQztnQkFDN0IsSUFBSSxJQUFJLENBQUMsWUFBWSxLQUFLLElBQUksRUFBRSxDQUFDO29CQUM5QixJQUFJLENBQUMsUUFBNkIsQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUN6RSxDQUFDO3FCQUFNLENBQUM7b0JBQ0wsSUFBSSxDQUFDLFFBQTZCLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUM5RSxDQUFDO1lBQ0gsQ0FBQztpQkFBTSxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsV0FBVyxFQUFFLENBQUM7Z0JBQ3BDLElBQUksSUFBSSxDQUFDLFlBQVksS0FBSyxJQUFJLEVBQUUsQ0FBQztvQkFDL0IsSUFBSyxJQUFJLENBQUMsUUFBNkIsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLENBQUM7d0JBQ3JFLElBQUksQ0FBQyxRQUE2QixDQUFDLGdCQUFnQixHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7b0JBQ3hFLENBQUM7Z0JBQ0gsQ0FBQztxQkFBTSxDQUFDO29CQUNMLElBQUksQ0FBQyxRQUE2QixDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztnQkFDMUUsQ0FBQztZQUNILENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxRQUFRLENBQUMsMkJBQTJCLEdBQUc7WUFDMUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGlCQUFpQjtZQUNsQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWdCO1NBQ2xDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUVoRCxJQUNFLElBQUksQ0FBQyxRQUFRLENBQUMsaUJBQWlCLENBQUMsTUFBTSxLQUFLLENBQUM7WUFDNUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUMzQyxDQUFDO1lBQ0QsT0FBTztRQUNULENBQUM7UUFFRCxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FDckIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUMxRSxDQUFDO1FBQ0YsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQ3JCLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxVQUFVLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FDM0UsQ0FBQztRQUNGLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUNyQixJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsYUFBYSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQzlFLENBQUM7UUFFRixJQUFJLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRTtZQUNqQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FDckIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLFdBQVcsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUN6RSxDQUFDO1lBQ0YsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQ3JCLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxXQUFXLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FDekUsQ0FBQztRQUNKLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7UUFFakUsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7UUFDdkIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFDakUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQ3BCLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLENBQUMsYUFBYSxFQUNuRSxhQUFhLENBQ2QsQ0FBQztRQUVGLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVPLFNBQVMsQ0FBQyxLQUE4QjtRQUM5QyxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDdkIsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBRXhCLElBQUksSUFBSSxDQUFDLGFBQWEsS0FBSyxJQUFJLEVBQUUsQ0FBQztZQUNoQyxNQUFNLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUN4QyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztRQUM1QixDQUFDO1FBRUQsSUFBSSxJQUFJLENBQUMsVUFBVSxLQUFLLEtBQUssRUFBRSxDQUFDO1lBQzlCLE9BQU87UUFDVCxDQUFDO1FBRUQsSUFBSSxDQUFDLFFBQVEsR0FBRyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN6QyxJQUFJLElBQUksQ0FBQyxRQUFRLEtBQUssSUFBSSxFQUFFLENBQUM7WUFDM0IsT0FBTztRQUNULENBQUM7UUFFRCwwQkFBMEI7UUFFMUIsSUFBSSxNQUFNLEdBQ1IsSUFBSSxDQUFDLFNBQVMsS0FBSyxZQUFZO1lBQzdCLENBQUMsQ0FBRSxJQUFJLENBQUMsVUFBNEIsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3hELENBQUMsQ0FBRSxJQUFJLENBQUMsVUFBNEIsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDN0QsSUFBSSxJQUFJLENBQUMsR0FBRyxLQUFLLEtBQUssSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLFlBQVksRUFBRSxDQUFDO1lBQzFELE1BQU0sR0FBRyxDQUFDLE1BQU0sQ0FBQztRQUNuQixDQUFDO1FBQ0QsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7UUFFN0UsSUFBSSxhQUFhLEtBQU0sSUFBSSxDQUFDLFFBQTZCLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztZQUM1RSxPQUFPO1FBQ1QsQ0FBQztRQUVBLElBQUksQ0FBQyxRQUE2QixDQUFDLGlCQUFpQixHQUFHLGFBQWEsQ0FBQztRQUV0RSx1RUFBdUU7UUFFdkUsSUFBSSxXQUFXLEdBQUcsK0JBQStCLENBQy9DLElBQUksQ0FBQyxJQUFJLEVBQ1IsSUFBSSxDQUFDLFFBQTZCLENBQUMsaUJBQWlCLEVBQ3JELENBQUMsYUFBYSxFQUNiLElBQUksQ0FBQyxRQUE2QixDQUFDLGlCQUFpQixDQUN0RCxDQUFDO1FBQ0YsSUFBSSxVQUFVLEdBQUcsK0JBQStCLENBQzlDLElBQUksQ0FBQyxJQUFJLEVBQ1IsSUFBSSxDQUFDLFFBQTZCLENBQUMsZ0JBQWdCLEVBQ3BELGFBQWEsRUFDWixJQUFJLENBQUMsUUFBNkIsQ0FBQyxpQkFBaUIsQ0FDdEQsQ0FBQztRQUVGLGlEQUFpRDtRQUNqRCxJQUFJLFdBQVcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLFVBQVUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLENBQUM7WUFDeEQsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO2dCQUNqRSxNQUFNO1lBQ1IsQ0FBQztpQkFBTSxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7Z0JBQ3RFLFVBQVUsR0FBRywrQkFBK0IsQ0FDMUMsSUFBSSxDQUFDLElBQUksRUFDUixJQUFJLENBQUMsUUFBNkIsQ0FBQyxnQkFBZ0IsRUFDcEQsYUFBYSxHQUFHLFdBQVcsQ0FBQyxNQUFNLEVBQ2pDLElBQUksQ0FBQyxRQUE2QixDQUFDLGlCQUFpQixDQUN0RCxDQUFDO1lBQ0osQ0FBQztpQkFBTSxDQUFDO2dCQUNOLFdBQVcsR0FBRywrQkFBK0IsQ0FDM0MsSUFBSSxDQUFDLElBQUksRUFDUixJQUFJLENBQUMsUUFBNkIsQ0FBQyxpQkFBaUIsRUFDckQsQ0FBQyxDQUFDLGFBQWEsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQ25DLElBQUksQ0FBQyxRQUE2QixDQUFDLGlCQUFpQixDQUN0RCxDQUFDO1lBQ0osQ0FBQztRQUNILENBQUM7UUFDRCxtR0FBbUc7YUFDOUYsSUFBSSxXQUFXLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRSxDQUFDO1lBQ2xDLFVBQVUsR0FBRywrQkFBK0IsQ0FDMUMsSUFBSSxDQUFDLElBQUksRUFDUixJQUFJLENBQUMsUUFBNkIsQ0FBQyxnQkFBZ0IsRUFDcEQsYUFBYSxHQUFHLFdBQVcsQ0FBQyxNQUFNLEVBQ2pDLElBQUksQ0FBQyxRQUE2QixDQUFDLGlCQUFpQixDQUN0RCxDQUFDO1FBQ0osQ0FBQztRQUNELG1HQUFtRzthQUM5RixJQUFJLFVBQVUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLENBQUM7WUFDakMsV0FBVyxHQUFHLCtCQUErQixDQUMzQyxJQUFJLENBQUMsSUFBSSxFQUNSLElBQUksQ0FBQyxRQUE2QixDQUFDLGlCQUFpQixFQUNyRCxDQUFDLENBQUMsYUFBYSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsRUFDbkMsSUFBSSxDQUFDLFFBQTZCLENBQUMsaUJBQWlCLENBQ3RELENBQUM7UUFDSixDQUFDO1FBRUQsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLFNBQVMsRUFBRSxDQUFDO1lBQzVCLG1HQUFtRztZQUNuRyxzR0FBc0c7WUFDdEcsTUFBTSxHQUFHLEdBQUcsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDdEQsTUFBTSxXQUFXLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FDMUIsQ0FBQyxDQUFDLEVBQUUsQ0FDRixDQUFDLENBQUMsc0JBQXNCLEtBQUssQ0FBQztnQkFDOUIsQ0FBQyxDQUFDLHNCQUFzQixLQUFLLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLE9BQU87Z0JBQ3hELENBQUMsQ0FBQyxzQkFBc0IsS0FBSyxDQUFDLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQzNELENBQUM7WUFFRixJQUFJLFdBQVcsRUFBRSxDQUFDO2dCQUNoQixXQUFXLENBQUMsc0JBQXNCO29CQUMvQixJQUFJLENBQUMsUUFBNkIsQ0FBQywyQkFBMkI7d0JBQy9ELEdBQUc7NkJBQ0EsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLFdBQVcsQ0FBQzs2QkFDOUIsTUFBTSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxzQkFBc0IsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNqRSxDQUFDO1FBQ0gsQ0FBQztRQUVELDRFQUE0RTtRQUU1RSxXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDbEUsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBRWpFLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFHLElBQUksQ0FBQyxRQUE2QixDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3pFLENBQUM7SUFFTyxZQUFZLENBQUMsS0FBYTtRQUNoQyxJQUFJLEtBQUssRUFBRSxDQUFDO1lBQ1YsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ3ZCLEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUMxQixDQUFDO1FBRUQsSUFBSSxJQUFJLENBQUMsVUFBVSxLQUFLLEtBQUssRUFBRSxDQUFDO1lBQzlCLE9BQU87UUFDVCxDQUFDO1FBRUQsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUM7UUFFbkUsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQztZQUNyQyxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ3JDLElBQUksR0FBRyxFQUFFLENBQUM7Z0JBQ1IsR0FBRyxFQUFFLENBQUM7WUFDUixDQUFDO1FBQ0gsQ0FBQztRQUVELDZDQUE2QztRQUM3Qyx3RkFBd0Y7UUFDeEYsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7UUFFeEIsMkNBQTJDO1FBQzNDLElBQ0UsSUFBSSxDQUFDLFFBQVE7WUFDYixDQUFFLElBQUksQ0FBQyxVQUE0QixDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ3RELElBQUksQ0FBQyxVQUE0QixDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUMzRCxDQUFDO1lBQ0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUcsSUFBSSxDQUFDLFFBQTZCLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDcEUsQ0FBQztRQUVELElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBQ3BFLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUN2QixJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxDQUFFLElBQUksQ0FBQyxRQUE2QixDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsQ0FBQyxhQUFhLEVBQ3pGLGFBQWEsQ0FDZCxDQUFDO1FBQ0YsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFFckIsc0ZBQXNGO1FBQ3RGLElBQUksQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFO1lBQ2pDLFVBQVUsQ0FBQyxHQUFHLEVBQUU7Z0JBQ2QsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7Z0JBQ3ZCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1lBQ3ZCLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsTUFBTSxDQUNKLElBQTJFLEVBQzNFLFNBQWlCO1FBRWpCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1FBRXpDLElBQUksSUFBSSxLQUFLLE9BQU8sRUFBRSxDQUFDO1lBQ3JCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDNUMsQ0FBQzthQUFNLElBQUksSUFBSSxLQUFLLEtBQUssRUFBRSxDQUFDO1lBQzFCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDMUMsQ0FBQzthQUFNLElBQUksSUFBSSxLQUFLLE9BQU8sRUFBRSxDQUFDO1lBQzVCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDOUMsQ0FBQzthQUFNLElBQUksSUFBSSxLQUFLLFVBQVUsRUFBRSxDQUFDO1lBQy9CLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDakQsQ0FBQzthQUFNLElBQUksSUFBSSxLQUFLLGVBQWUsRUFBRSxDQUFDO1lBQ3BDLElBQUksSUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUM7Z0JBQ2pDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNsRSxDQUFDO1FBQ0gsQ0FBQzthQUFNLElBQUksSUFBSSxLQUFLLFVBQVUsRUFBRSxDQUFDO1lBQy9CLHVGQUF1RjtZQUN2RixJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDdEQsQ0FBQztJQUNILENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ3RCLENBQUM7aUlBL3NCVSxRQUFRLDRIQWdLVCx5QkFBeUI7cUhBaEt4QixRQUFRLGdOQThEQyxnQkFBZ0IscURBR2hCLGdCQUFnQixzQ0FpQmhCLGdCQUFnQiw0WUM5S3RDLDBvQkFjQTs7MkZEOEVhLFFBQVE7a0JBWnBCLFNBQVM7K0JBQ0UsV0FBVyxZQUNYLFVBQVUsUUFDZDt3QkFDSixLQUFLLEVBQUUsV0FBVztxQkFDbkIsaUJBQ2MsaUJBQWlCLENBQUMsSUFBSSxtQkFDcEIsdUJBQXVCLENBQUMsTUFBTSxjQUduQyxJQUFJOzswQkFpS2IsUUFBUTs7MEJBQ1IsTUFBTTsyQkFBQyx5QkFBeUI7eUNBL0oxQixLQUFLO3NCQUFiLEtBQUs7Z0JBSUYsU0FBUztzQkFEWixLQUFLO2dCQW1CRixJQUFJO3NCQURQLEtBQUs7Z0JBbUJGLFVBQVU7c0JBRGIsS0FBSztnQkFhRixVQUFVO3NCQURiLEtBQUs7Z0JBVWtDLFlBQVk7c0JBQW5ELEtBQUs7dUJBQUMsRUFBRSxTQUFTLEVBQUUsZ0JBQWdCLEVBQUU7Z0JBSWxDLGFBQWE7c0JBRGhCLEtBQUs7dUJBQUMsRUFBRSxTQUFTLEVBQUUsZ0JBQWdCLEVBQUU7Z0JBa0JsQyxRQUFRO3NCQURYLEtBQUs7dUJBQUMsRUFBRSxTQUFTLEVBQUUsZ0JBQWdCLEVBQUU7Z0JBZWxDLEdBQUc7c0JBRE4sS0FBSztnQkFnQkYsc0JBQXNCO3NCQUR6QixLQUFLO2dCQVVJLFNBQVM7c0JBQWxCLE1BQU07Z0JBRUcsT0FBTztzQkFBaEIsTUFBTTtnQkFFRyxXQUFXO3NCQUFwQixNQUFNO2dCQUVHLGNBQWM7c0JBQXZCLE1BQU07Z0JBTUgsYUFBYTtzQkFEaEIsTUFBTTtnQkFvQjRCLFNBQVM7c0JBQTNDLFlBQVk7dUJBQUMsV0FBVyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEluamVjdCxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uRGVzdHJveSxcbiAgT3B0aW9uYWwsXG4gIE91dHB1dCxcbiAgUXVlcnlMaXN0LFxuICBSZW5kZXJlcjIsXG4gIFZpZXdDaGlsZHJlbixcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIGJvb2xlYW5BdHRyaWJ1dGUsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgVGhlbWVQYWxldHRlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBTdWJqZWN0LCBTdWJzY3JpYmVyIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBkZWJvdW5jZVRpbWUgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7XG4gIE10eFNwbGl0QXJlYSxcbiAgTXR4U3BsaXRBcmVhU25hcHNob3QsXG4gIE10eFNwbGl0RGVmYXVsdE9wdGlvbnMsXG4gIE10eFNwbGl0T3V0cHV0QXJlYVNpemVzLFxuICBNdHhTcGxpdE91dHB1dERhdGEsXG4gIE10eFNwbGl0UG9pbnQsXG4gIE10eFNwbGl0U25hcHNob3QsXG59IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBNdHhTcGxpdFBhbmUgfSBmcm9tICcuL3NwbGl0LXBhbmUnO1xuaW1wb3J0IHtcbiAgZ2V0QXJlYU1heFNpemUsXG4gIGdldEFyZWFNaW5TaXplLFxuICBnZXRFbGVtZW50UGl4ZWxTaXplLFxuICBnZXRHdXR0ZXJTaWRlQWJzb3JwdGlvbkNhcGFjaXR5LFxuICBnZXRJbnB1dFBvc2l0aXZlTnVtYmVyLFxuICBnZXRQb2ludEZyb21FdmVudCxcbiAgaXNVc2VyU2l6ZXNWYWxpZCxcbiAgdXBkYXRlQXJlYVNpemUsXG59IGZyb20gJy4vdXRpbHMnO1xuXG4vKiogSW5qZWN0aW9uIHRva2VuIHRoYXQgY2FuIGJlIHVzZWQgdG8gc3BlY2lmeSBkZWZhdWx0IHNwbGl0IG9wdGlvbnMuICovXG5leHBvcnQgY29uc3QgTVRYX1NQTElUX0RFRkFVTFRfT1BUSU9OUyA9IG5ldyBJbmplY3Rpb25Ub2tlbjxNdHhTcGxpdERlZmF1bHRPcHRpb25zPihcbiAgJ210eC1zcGxpdC1kZWZhdWx0LW9wdGlvbnMnXG4pO1xuXG4vKipcbiAqIG10eC1zcGxpdFxuICpcbiAqXG4gKiAgUEVSQ0VOVCBNT0RFIChbdW5pdF09XCIncGVyY2VudCdcIilcbiAqICBfX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXG4gKiB8ICAgICAgIEEgICAgICAgW2cxXSAgICAgICBCICAgICAgIFtnMl0gICAgICAgQyAgICAgICBbZzNdICAgICAgIEQgICAgICAgW2c0XSAgICAgICBFICAgICAgIHxcbiAqIHwtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tfFxuICogfCAgICAgICAyMCAgICAgICAgICAgICAgICAgMzAgICAgICAgICAgICAgICAgIDIwICAgICAgICAgICAgICAgICAxNSAgICAgICAgICAgICAgICAgMTUgICAgICB8IDwtLSBbc2l6ZV09XCJ4XCJcbiAqIHwgICAgICAgICAgICAgICAxMHB4ICAgICAgICAgICAgICAgMTBweCAgICAgICAgICAgICAgIDEwcHggICAgICAgICAgICAgICAxMHB4ICAgICAgICAgICAgICAgfCA8LS0gW2d1dHRlclNpemVdPVwiMTBcIlxuICogfGNhbGMoMjAlIC0gOHB4KSAgICBjYWxjKDMwJSAtIDEycHgpICAgY2FsYygyMCUgLSA4cHgpICAgIGNhbGMoMTUlIC0gNnB4KSAgICBjYWxjKDE1JSAtIDZweCl8IDwtLSBDU1MgZmxleC1iYXNpcyBwcm9wZXJ0eSAod2l0aCBmbGV4LWdyb3cmc2hyaW5rIGF0IDApXG4gKiB8ICAgICAxNTJweCAgICAgICAgICAgICAgMjI4cHggICAgICAgICAgICAgIDE1MnB4ICAgICAgICAgICAgICAxMTRweCAgICAgICAgICAgICAgMTE0cHggICAgIHwgPC0tIGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoXG4gKiB8X19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX3xcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgODAwcHggICAgICAgICA8LS0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGhcbiAqICBmbGV4LWJhc2lzID0gY2FsYyggeyBhcmVhLnNpemUgfSUgLSB7IGFyZWEuc2l6ZS8xMDAgKiBuYkd1dHRlcipndXR0ZXJTaXplIH1weCApO1xuICpcbiAqXG4gKiAgUElYRUwgTU9ERSAoW3VuaXRdPVwiJ3BpeGVsJ1wiKVxuICogIF9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19cbiAqIHwgICAgICAgQSAgICAgICBbZzFdICAgICAgIEIgICAgICAgW2cyXSAgICAgICBDICAgICAgIFtnM10gICAgICAgRCAgICAgICBbZzRdICAgICAgIEUgICAgICAgfFxuICogfC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS18XG4gKiB8ICAgICAgMTAwICAgICAgICAgICAgICAgIDI1MCAgICAgICAgICAgICAgICAgKiAgICAgICAgICAgICAgICAgMTUwICAgICAgICAgICAgICAgIDEwMCAgICAgIHwgPC0tIFtzaXplXT1cInlcIlxuICogfCAgICAgICAgICAgICAgIDEwcHggICAgICAgICAgICAgICAxMHB4ICAgICAgICAgICAgICAgMTBweCAgICAgICAgICAgICAgIDEwcHggICAgICAgICAgICAgICB8IDwtLSBbZ3V0dGVyU2l6ZV09XCIxMFwiXG4gKiB8ICAgMCAwIDEwMHB4ICAgICAgICAgIDAgMCAyNTBweCAgICAgICAgICAgMSAxIGF1dG8gICAgICAgICAgMCAwIDE1MHB4ICAgICAgICAgIDAgMCAxMDBweCAgIHwgPC0tIENTUyBmbGV4IHByb3BlcnR5IChmbGV4LWdyb3cvZmxleC1zaHJpbmsvZmxleC1iYXNpcylcbiAqIHwgICAgIDEwMHB4ICAgICAgICAgICAgICAyNTBweCAgICAgICAgICAgICAgMjAwcHggICAgICAgICAgICAgIDE1MHB4ICAgICAgICAgICAgICAxMDBweCAgICAgfCA8LS0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGhcbiAqIHxfX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19ffFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA4MDBweCAgICAgICAgIDwtLSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aFxuICpcbiAqL1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtdHgtc3BsaXQnLFxuICBleHBvcnRBczogJ210eFNwbGl0JyxcbiAgaG9zdDoge1xuICAgIGNsYXNzOiAnbXR4LXNwbGl0JyxcbiAgfSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIHN0eWxlVXJsOiAnLi9zcGxpdC5zY3NzJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3NwbGl0Lmh0bWwnLFxuICBzdGFuZGFsb25lOiB0cnVlLFxufSlcbmV4cG9ydCBjbGFzcyBNdHhTcGxpdCBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG4gIEBJbnB1dCgpIGNvbG9yOiBUaGVtZVBhbGV0dGU7XG5cbiAgLyoqIFRoZSBzcGxpdCBkaXJlY3Rpb24uICovXG4gIEBJbnB1dCgpXG4gIGdldCBkaXJlY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX2RpcmVjdGlvbjtcbiAgfVxuICBzZXQgZGlyZWN0aW9uKHY6ICdob3Jpem9udGFsJyB8ICd2ZXJ0aWNhbCcpIHtcbiAgICB0aGlzLl9kaXJlY3Rpb24gPSB2ID09PSAndmVydGljYWwnID8gJ3ZlcnRpY2FsJyA6ICdob3Jpem9udGFsJztcblxuICAgIHRoaXMucmVuZGVyZXIuYWRkQ2xhc3ModGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50LCBgbXR4LXNwbGl0LSR7dGhpcy5fZGlyZWN0aW9ufWApO1xuICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2xhc3MoXG4gICAgICB0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQsXG4gICAgICBgbXR4LXNwbGl0LSR7dGhpcy5fZGlyZWN0aW9uID09PSAndmVydGljYWwnID8gJ2hvcml6b250YWwnIDogJ3ZlcnRpY2FsJ31gXG4gICAgKTtcblxuICAgIHRoaXMuYnVpbGQoZmFsc2UsIGZhbHNlKTtcbiAgfVxuICBwcml2YXRlIF9kaXJlY3Rpb246ICdob3Jpem9udGFsJyB8ICd2ZXJ0aWNhbCcgPSAnaG9yaXpvbnRhbCc7XG5cbiAgLyoqIFRoZSB1bml0IHlvdSB3YW50IHRvIHNwZWNpZnkgYXJlYSBzaXplcy4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHVuaXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3VuaXQ7XG4gIH1cbiAgc2V0IHVuaXQodjogJ3BlcmNlbnQnIHwgJ3BpeGVsJykge1xuICAgIHRoaXMuX3VuaXQgPSB2ID09PSAncGl4ZWwnID8gJ3BpeGVsJyA6ICdwZXJjZW50JztcblxuICAgIHRoaXMucmVuZGVyZXIuYWRkQ2xhc3ModGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50LCBgbXR4LXNwbGl0LSR7dGhpcy5fdW5pdH1gKTtcbiAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUNsYXNzKFxuICAgICAgdGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50LFxuICAgICAgYG10eC1zcGxpdC0ke3RoaXMuX3VuaXQgPT09ICdwaXhlbCcgPyAncGVyY2VudCcgOiAncGl4ZWwnfWBcbiAgICApO1xuXG4gICAgdGhpcy5idWlsZChmYWxzZSwgdHJ1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfdW5pdDogJ3BlcmNlbnQnIHwgJ3BpeGVsJyA9ICdwZXJjZW50JztcblxuICAvKiogR3V0dGVycydzIHNpemUgKGRyYWdnaW5nIGVsZW1lbnRzKSBpbiBwaXhlbHMuICovXG4gIEBJbnB1dCgpXG4gIGdldCBndXR0ZXJTaXplKCkge1xuICAgIHJldHVybiB0aGlzLl9ndXR0ZXJTaXplO1xuICB9XG4gIHNldCBndXR0ZXJTaXplKHY6IG51bWJlcikge1xuICAgIHRoaXMuX2d1dHRlclNpemUgPSBnZXRJbnB1dFBvc2l0aXZlTnVtYmVyKHYsIDQpO1xuXG4gICAgdGhpcy5idWlsZChmYWxzZSwgZmFsc2UpO1xuICB9XG4gIHByaXZhdGUgX2d1dHRlclNpemUgPSA0O1xuXG4gIC8qKiBHdXR0ZXIgc3RlcCB3aGlsZSBtb3ZpbmcgaW4gcGl4ZWxzLiAqL1xuICBASW5wdXQoKVxuICBnZXQgZ3V0dGVyU3RlcCgpIHtcbiAgICByZXR1cm4gdGhpcy5fZ3V0dGVyU3RlcDtcbiAgfVxuICBzZXQgZ3V0dGVyU3RlcCh2OiBudW1iZXIpIHtcbiAgICB0aGlzLl9ndXR0ZXJTdGVwID0gZ2V0SW5wdXRQb3NpdGl2ZU51bWJlcih2LCAxKTtcbiAgfVxuICBwcml2YXRlIF9ndXR0ZXJTdGVwID0gMTtcblxuICAvKiogU2V0IHRvIHRydWUgaWYgeW91IHdhbnQgdG8gbGltaXQgZ3V0dGVyIG1vdmUgdG8gYWRqYWNlbnQgYXJlYXMgb25seS4gKi9cbiAgQElucHV0KHsgdHJhbnNmb3JtOiBib29sZWFuQXR0cmlidXRlIH0pIHJlc3RyaWN0TW92ZSA9IGZhbHNlO1xuXG4gIC8qKiBBZGQgdHJhbnNpdGlvbiB3aGVuIHRvZ2dsaW5nIHZpc2liaWxpdHkgdXNpbmcgYHZpc2libGVgIG9yIGBzaXplYCBjaGFuZ2VzLiAqL1xuICBASW5wdXQoeyB0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGUgfSlcbiAgZ2V0IHVzZVRyYW5zaXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX3VzZVRyYW5zaXRpb247XG4gIH1cbiAgc2V0IHVzZVRyYW5zaXRpb24odjogYm9vbGVhbikge1xuICAgIGlmICh0aGlzLl91c2VUcmFuc2l0aW9uKSB7XG4gICAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKHRoaXMuZWxSZWYubmF0aXZlRWxlbWVudCwgJ210eC1zcGxpdC10cmFuc2l0aW9uJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2xhc3ModGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50LCAnbXR4LXNwbGl0LXRyYW5zaXRpb24nKTtcbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBfdXNlVHJhbnNpdGlvbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBEaXNhYmxlIHRoZSBkcmFnZ2luZyBmZWF0dXJlIChyZW1vdmUgY3Vyc29yL2ltYWdlIG9uIGd1dHRlcnMpLlxuICAgKiBgZ3V0dGVyQ2xpY2tgL2BndXR0ZXJEYmxDbGlja2Agc3RpbGwgZW1pdHMuXG4gICAqL1xuICBASW5wdXQoeyB0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGUgfSlcbiAgZ2V0IGRpc2FibGVkKCkge1xuICAgIHJldHVybiB0aGlzLl9kaXNhYmxlZDtcbiAgfVxuICBzZXQgZGlzYWJsZWQodjogYm9vbGVhbikge1xuICAgIGlmICh0aGlzLl9kaXNhYmxlZCkge1xuICAgICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyh0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQsICdtdHgtc3BsaXQtZGlzYWJsZWQnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVDbGFzcyh0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQsICdtdHgtc3BsaXQtZGlzYWJsZWQnKTtcbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBfZGlzYWJsZWQgPSBmYWxzZTtcblxuICAvKiogSW5kaWNhdGVzIHRoZSBkaXJlY3Rpb25hbGl0eSBvZiB0aGUgYXJlYXMuICovXG4gIEBJbnB1dCgpXG4gIGdldCBkaXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2RpcjtcbiAgfVxuICBzZXQgZGlyKHY6ICdsdHInIHwgJ3J0bCcpIHtcbiAgICB0aGlzLl9kaXIgPSB2ID09PSAncnRsJyA/ICdydGwnIDogJ2x0cic7XG5cbiAgICB0aGlzLnJlbmRlcmVyLnNldEF0dHJpYnV0ZSh0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQsICdkaXInLCB0aGlzLl9kaXIpO1xuICB9XG4gIHByaXZhdGUgX2RpcjogJ2x0cicgfCAncnRsJyA9ICdsdHInO1xuXG4gIC8qKlxuICAgKiBNaWxsaXNlY29uZHMgdG8gZGV0ZWN0IGEgZG91YmxlIGNsaWNrIG9uIGEgZ3V0dGVyLiBTZXQgaXQgYXJvdW5kIDMwMC01MDBtcyBpZlxuICAgKiB5b3Ugd2FudCB0byB1c2UgYGd1dHRlckRibENsaWNrYCBldmVudC5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCBndXR0ZXJEYmxDbGlja0R1cmF0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9ndXR0ZXJEYmxDbGlja0R1cmF0aW9uO1xuICB9XG4gIHNldCBndXR0ZXJEYmxDbGlja0R1cmF0aW9uKHY6IG51bWJlcikge1xuICAgIHRoaXMuX2d1dHRlckRibENsaWNrRHVyYXRpb24gPSBnZXRJbnB1dFBvc2l0aXZlTnVtYmVyKHYsIDApO1xuICB9XG4gIHByaXZhdGUgX2d1dHRlckRibENsaWNrRHVyYXRpb24gPSAwO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gZHJhZyBzdGFydHMuICovXG4gIEBPdXRwdXQoKSBkcmFnU3RhcnQgPSBuZXcgRXZlbnRFbWl0dGVyPE10eFNwbGl0T3V0cHV0RGF0YT4oZmFsc2UpO1xuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIGRyYWcgZW5kcy4gKi9cbiAgQE91dHB1dCgpIGRyYWdFbmQgPSBuZXcgRXZlbnRFbWl0dGVyPE10eFNwbGl0T3V0cHV0RGF0YT4oZmFsc2UpO1xuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHVzZXIgY2xpY2tzIG9uIGEgZ3V0dGVyLiAqL1xuICBAT3V0cHV0KCkgZ3V0dGVyQ2xpY2sgPSBuZXcgRXZlbnRFbWl0dGVyPE10eFNwbGl0T3V0cHV0RGF0YT4oZmFsc2UpO1xuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHVzZXIgZG91YmxlIGNsaWNrcyBvbiBhIGd1dHRlci4gKi9cbiAgQE91dHB1dCgpIGd1dHRlckRibENsaWNrID0gbmV3IEV2ZW50RW1pdHRlcjxNdHhTcGxpdE91dHB1dERhdGE+KGZhbHNlKTtcbiAgLyoqXG4gICAqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0cmFuc2l0aW9uIGVuZHMgKGNvdWxkIGJlIHRyaWdnZXJlZCBmcm9tIGB2aXNpYmxlYCBvciBgc2l6ZWAgY2hhbmdlcykuXG4gICAqIE9ubHkgaWYgYHVzZVRyYW5zaXRpb25gIGVxdWFscyB0cnVlLlxuICAgKi9cbiAgQE91dHB1dCgpXG4gIGdldCB0cmFuc2l0aW9uRW5kKCk6IE9ic2VydmFibGU8TXR4U3BsaXRPdXRwdXRBcmVhU2l6ZXM+IHtcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGUoc3Vic2NyaWJlciA9PiAodGhpcy50cmFuc2l0aW9uRW5kU3Vic2NyaWJlciA9IHN1YnNjcmliZXIpKS5waXBlKFxuICAgICAgZGVib3VuY2VUaW1lPGFueT4oMjApXG4gICAgKTtcbiAgfVxuICBwcml2YXRlIHRyYW5zaXRpb25FbmRTdWJzY3JpYmVyITogU3Vic2NyaWJlcjxNdHhTcGxpdE91dHB1dEFyZWFTaXplcz47XG5cbiAgcHJpdmF0ZSBkcmFnUHJvZ3Jlc3NTdWJqZWN0OiBTdWJqZWN0PE10eFNwbGl0T3V0cHV0RGF0YT4gPSBuZXcgU3ViamVjdCgpO1xuICBkcmFnUHJvZ3Jlc3MkOiBPYnNlcnZhYmxlPE10eFNwbGl0T3V0cHV0RGF0YT4gPSB0aGlzLmRyYWdQcm9ncmVzc1N1YmplY3QuYXNPYnNlcnZhYmxlKCk7XG5cbiAgcHJpdmF0ZSBpc0RyYWdnaW5nID0gZmFsc2U7XG4gIHByaXZhdGUgZHJhZ0xpc3RlbmVyczogQXJyYXk8KCkgPT4gdm9pZD4gPSBbXTtcbiAgcHJpdmF0ZSBzbmFwc2hvdDogTXR4U3BsaXRTbmFwc2hvdCB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIHN0YXJ0UG9pbnQ6IE10eFNwbGl0UG9pbnQgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBlbmRQb2ludDogTXR4U3BsaXRQb2ludCB8IG51bGwgPSBudWxsO1xuXG4gIHB1YmxpYyByZWFkb25seSBkaXNwbGF5ZWRBcmVhczogQXJyYXk8TXR4U3BsaXRBcmVhPiA9IFtdO1xuICBwcml2YXRlIHJlYWRvbmx5IGhpZGVkQXJlYXM6IEFycmF5PE10eFNwbGl0QXJlYT4gPSBbXTtcblxuICBAVmlld0NoaWxkcmVuKCdndXR0ZXJFbHMnKSBwcml2YXRlIGd1dHRlckVscyE6IFF1ZXJ5TGlzdDxFbGVtZW50UmVmPjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIG5nWm9uZTogTmdab25lLFxuICAgIHByaXZhdGUgZWxSZWY6IEVsZW1lbnRSZWYsXG4gICAgcHJpdmF0ZSBjZFJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIEBPcHRpb25hbCgpXG4gICAgQEluamVjdChNVFhfU1BMSVRfREVGQVVMVF9PUFRJT05TKVxuICAgIHByb3RlY3RlZCBfZGVmYXVsdE9wdGlvbnM/OiBNdHhTcGxpdERlZmF1bHRPcHRpb25zXG4gICkge1xuICAgIHRoaXMuY29sb3IgPSBfZGVmYXVsdE9wdGlvbnM/LmNvbG9yID8/ICdwcmltYXJ5JztcbiAgICB0aGlzLmRpcmVjdGlvbiA9IF9kZWZhdWx0T3B0aW9ucz8uZGlyZWN0aW9uID8/ICdob3Jpem9udGFsJztcbiAgICB0aGlzLmRpciA9IF9kZWZhdWx0T3B0aW9ucz8uZGlyID8/ICdsdHInO1xuICAgIHRoaXMudW5pdCA9IF9kZWZhdWx0T3B0aW9ucz8udW5pdCA/PyAncGVyY2VudCc7XG4gICAgdGhpcy5ndXR0ZXJEYmxDbGlja0R1cmF0aW9uID0gX2RlZmF1bHRPcHRpb25zPy5ndXR0ZXJEYmxDbGlja0R1cmF0aW9uID8/IDA7XG4gICAgdGhpcy5ndXR0ZXJTaXplID0gX2RlZmF1bHRPcHRpb25zPy5ndXR0ZXJTaXplID8/IDQ7XG4gICAgdGhpcy5ndXR0ZXJTdGVwID0gX2RlZmF1bHRPcHRpb25zPy5ndXR0ZXJTdGVwID8/IDE7XG4gICAgdGhpcy5yZXN0cmljdE1vdmUgPSBfZGVmYXVsdE9wdGlvbnM/LnJlc3RyaWN0TW92ZSA/PyBmYWxzZTtcbiAgICB0aGlzLnVzZVRyYW5zaXRpb24gPSBfZGVmYXVsdE9wdGlvbnM/LnVzZVRyYW5zaXRpb24gPz8gZmFsc2U7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgdGhpcy5uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgLy8gVG8gYXZvaWQgdHJhbnNpdGlvbiBhdCBmaXJzdCByZW5kZXJpbmdcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5yZW5kZXJlci5hZGRDbGFzcyh0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQsICdtdHgtc3BsaXQtaW5pdCcpKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0TmJHdXR0ZXJzKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuZGlzcGxheWVkQXJlYXMubGVuZ3RoID09PSAwID8gMCA6IHRoaXMuZGlzcGxheWVkQXJlYXMubGVuZ3RoIC0gMTtcbiAgfVxuXG4gIGFkZEFyZWEoY29tcG9uZW50OiBNdHhTcGxpdFBhbmUpOiB2b2lkIHtcbiAgICBjb25zdCBuZXdBcmVhOiBNdHhTcGxpdEFyZWEgPSB7XG4gICAgICBjb21wb25lbnQsXG4gICAgICBvcmRlcjogMCxcbiAgICAgIHNpemU6IDAsXG4gICAgICBtaW5TaXplOiBudWxsLFxuICAgICAgbWF4U2l6ZTogbnVsbCxcbiAgICB9O1xuXG4gICAgaWYgKGNvbXBvbmVudC52aXNpYmxlID09PSB0cnVlKSB7XG4gICAgICB0aGlzLmRpc3BsYXllZEFyZWFzLnB1c2gobmV3QXJlYSk7XG5cbiAgICAgIHRoaXMuYnVpbGQodHJ1ZSwgdHJ1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaGlkZWRBcmVhcy5wdXNoKG5ld0FyZWEpO1xuICAgIH1cbiAgfVxuXG4gIHJlbW92ZUFyZWEoY29tcG9uZW50OiBNdHhTcGxpdFBhbmUpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5kaXNwbGF5ZWRBcmVhcy5zb21lKGEgPT4gYS5jb21wb25lbnQgPT09IGNvbXBvbmVudCkpIHtcbiAgICAgIGNvbnN0IGFyZWEgPSB0aGlzLmRpc3BsYXllZEFyZWFzLmZpbmQoYSA9PiBhLmNvbXBvbmVudCA9PT0gY29tcG9uZW50KSBhcyBNdHhTcGxpdEFyZWE7XG4gICAgICB0aGlzLmRpc3BsYXllZEFyZWFzLnNwbGljZSh0aGlzLmRpc3BsYXllZEFyZWFzLmluZGV4T2YoYXJlYSksIDEpO1xuXG4gICAgICB0aGlzLmJ1aWxkKHRydWUsIHRydWUpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5oaWRlZEFyZWFzLnNvbWUoYSA9PiBhLmNvbXBvbmVudCA9PT0gY29tcG9uZW50KSkge1xuICAgICAgY29uc3QgYXJlYSA9IHRoaXMuaGlkZWRBcmVhcy5maW5kKGEgPT4gYS5jb21wb25lbnQgPT09IGNvbXBvbmVudCkgYXMgTXR4U3BsaXRBcmVhO1xuICAgICAgdGhpcy5oaWRlZEFyZWFzLnNwbGljZSh0aGlzLmhpZGVkQXJlYXMuaW5kZXhPZihhcmVhKSwgMSk7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlQXJlYShjb21wb25lbnQ6IE10eFNwbGl0UGFuZSwgcmVzZXRPcmRlcnM6IGJvb2xlYW4sIHJlc2V0U2l6ZXM6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBpZiAoY29tcG9uZW50LnZpc2libGUgPT09IHRydWUpIHtcbiAgICAgIHRoaXMuYnVpbGQocmVzZXRPcmRlcnMsIHJlc2V0U2l6ZXMpO1xuICAgIH1cbiAgfVxuXG4gIHNob3dBcmVhKGNvbXBvbmVudDogTXR4U3BsaXRQYW5lKTogdm9pZCB7XG4gICAgY29uc3QgYXJlYSA9IHRoaXMuaGlkZWRBcmVhcy5maW5kKGEgPT4gYS5jb21wb25lbnQgPT09IGNvbXBvbmVudCk7XG4gICAgaWYgKGFyZWEgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGFyZWFzID0gdGhpcy5oaWRlZEFyZWFzLnNwbGljZSh0aGlzLmhpZGVkQXJlYXMuaW5kZXhPZihhcmVhKSwgMSk7XG4gICAgdGhpcy5kaXNwbGF5ZWRBcmVhcy5wdXNoKC4uLmFyZWFzKTtcblxuICAgIHRoaXMuYnVpbGQodHJ1ZSwgdHJ1ZSk7XG4gIH1cblxuICBoaWRlQXJlYShjb21wOiBNdHhTcGxpdFBhbmUpOiB2b2lkIHtcbiAgICBjb25zdCBhcmVhID0gdGhpcy5kaXNwbGF5ZWRBcmVhcy5maW5kKGEgPT4gYS5jb21wb25lbnQgPT09IGNvbXApO1xuICAgIGlmIChhcmVhID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBhcmVhcyA9IHRoaXMuZGlzcGxheWVkQXJlYXMuc3BsaWNlKHRoaXMuZGlzcGxheWVkQXJlYXMuaW5kZXhPZihhcmVhKSwgMSk7XG4gICAgYXJlYXMuZm9yRWFjaChfYXJlYSA9PiB7XG4gICAgICBfYXJlYS5vcmRlciA9IDA7XG4gICAgICBfYXJlYS5zaXplID0gMDtcbiAgICB9KTtcbiAgICB0aGlzLmhpZGVkQXJlYXMucHVzaCguLi5hcmVhcyk7XG5cbiAgICB0aGlzLmJ1aWxkKHRydWUsIHRydWUpO1xuICB9XG5cbiAgZ2V0VmlzaWJsZUFyZWFTaXplcygpOiBNdHhTcGxpdE91dHB1dEFyZWFTaXplcyB7XG4gICAgcmV0dXJuIHRoaXMuZGlzcGxheWVkQXJlYXMubWFwKGEgPT4gKGEuc2l6ZSA9PT0gbnVsbCA/ICcqJyA6IGEuc2l6ZSkpO1xuICB9XG5cbiAgc2V0VmlzaWJsZUFyZWFTaXplcyhzaXplczogTXR4U3BsaXRPdXRwdXRBcmVhU2l6ZXMpOiBib29sZWFuIHtcbiAgICBpZiAoc2l6ZXMubGVuZ3RoICE9PSB0aGlzLmRpc3BsYXllZEFyZWFzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IGZvcm1hdGVkU2l6ZXMgPSBzaXplcy5tYXAocyA9PiBnZXRJbnB1dFBvc2l0aXZlTnVtYmVyKHMsIG51bGwpKSBhcyBudW1iZXJbXTtcbiAgICBjb25zdCBpc1ZhbGlkID0gaXNVc2VyU2l6ZXNWYWxpZCh0aGlzLnVuaXQsIGZvcm1hdGVkU2l6ZXMpO1xuXG4gICAgaWYgKGlzVmFsaWQgPT09IGZhbHNlKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdGhpcy5kaXNwbGF5ZWRBcmVhcy5mb3JFYWNoKChhcmVhLCBpKSA9PiAoYXJlYS5jb21wb25lbnQuc2l6ZSA9IGZvcm1hdGVkU2l6ZXNbaV0pKTtcblxuICAgIHRoaXMuYnVpbGQoZmFsc2UsIHRydWUpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcHJpdmF0ZSBidWlsZChyZXNldE9yZGVyczogYm9vbGVhbiwgcmVzZXRTaXplczogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuc3RvcERyYWdnaW5nKCk7XG5cbiAgICAvLyDCpCBBUkVBUyBPUkRFUlxuXG4gICAgaWYgKHJlc2V0T3JkZXJzID09PSB0cnVlKSB7XG4gICAgICAvLyBJZiB1c2VyIHByb3ZpZGVkICdvcmRlcicgZm9yIGVhY2ggYXJlYSwgdXNlIGl0IHRvIHNvcnQgdGhlbS5cbiAgICAgIGlmICh0aGlzLmRpc3BsYXllZEFyZWFzLmV2ZXJ5KGEgPT4gYS5jb21wb25lbnQub3JkZXIgIT09IG51bGwpKSB7XG4gICAgICAgIHRoaXMuZGlzcGxheWVkQXJlYXMuc29ydChcbiAgICAgICAgICAoYSwgYikgPT4gKGEuY29tcG9uZW50Lm9yZGVyIGFzIG51bWJlcikgLSAoYi5jb21wb25lbnQub3JkZXIgYXMgbnVtYmVyKVxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICAvLyBUaGVuIHNldCByZWFsIG9yZGVyIHdpdGggbXVsdGlwbGVzIG9mIDIsIG51bWJlcnMgYmV0d2VlbiB3aWxsIGJlIHVzZWQgYnkgZ3V0dGVycy5cbiAgICAgIHRoaXMuZGlzcGxheWVkQXJlYXMuZm9yRWFjaCgoYXJlYSwgaSkgPT4ge1xuICAgICAgICBhcmVhLm9yZGVyID0gaSAqIDI7XG4gICAgICAgIGFyZWEuY29tcG9uZW50LnNldFN0eWxlT3JkZXIoYXJlYS5vcmRlcik7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyDCpCBBUkVBUyBTSVpFXG5cbiAgICBpZiAocmVzZXRTaXplcyA9PT0gdHJ1ZSkge1xuICAgICAgY29uc3QgdXNlVXNlclNpemVzID0gaXNVc2VyU2l6ZXNWYWxpZChcbiAgICAgICAgdGhpcy51bml0LFxuICAgICAgICB0aGlzLmRpc3BsYXllZEFyZWFzLm1hcChhID0+IGEuY29tcG9uZW50LnNpemUpIGFzIG51bWJlcltdXG4gICAgICApO1xuXG4gICAgICBzd2l0Y2ggKHRoaXMudW5pdCkge1xuICAgICAgICBjYXNlICdwZXJjZW50Jzoge1xuICAgICAgICAgIGNvbnN0IGRlZmF1bHRTaXplID0gMTAwIC8gdGhpcy5kaXNwbGF5ZWRBcmVhcy5sZW5ndGg7XG5cbiAgICAgICAgICB0aGlzLmRpc3BsYXllZEFyZWFzLmZvckVhY2goYXJlYSA9PiB7XG4gICAgICAgICAgICBhcmVhLnNpemUgPSB1c2VVc2VyU2l6ZXMgPyAoYXJlYS5jb21wb25lbnQuc2l6ZSBhcyBudW1iZXIpIDogZGVmYXVsdFNpemU7XG4gICAgICAgICAgICBhcmVhLm1pblNpemUgPSBnZXRBcmVhTWluU2l6ZShhcmVhKTtcbiAgICAgICAgICAgIGFyZWEubWF4U2l6ZSA9IGdldEFyZWFNYXhTaXplKGFyZWEpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGNhc2UgJ3BpeGVsJzoge1xuICAgICAgICAgIGlmICh1c2VVc2VyU2l6ZXMpIHtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheWVkQXJlYXMuZm9yRWFjaChhcmVhID0+IHtcbiAgICAgICAgICAgICAgYXJlYS5zaXplID0gYXJlYS5jb21wb25lbnQuc2l6ZTtcbiAgICAgICAgICAgICAgYXJlYS5taW5TaXplID0gZ2V0QXJlYU1pblNpemUoYXJlYSk7XG4gICAgICAgICAgICAgIGFyZWEubWF4U2l6ZSA9IGdldEFyZWFNYXhTaXplKGFyZWEpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHdpbGRjYXJkU2l6ZUFyZWFzID0gdGhpcy5kaXNwbGF5ZWRBcmVhcy5maWx0ZXIoYSA9PiBhLmNvbXBvbmVudC5zaXplID09PSBudWxsKTtcblxuICAgICAgICAgICAgLy8gTm8gd2lsZGNhcmQgYXJlYSA+IE5lZWQgdG8gc2VsZWN0IG9uZSBhcmJpdHJhcmlseSA+IGZpcnN0XG4gICAgICAgICAgICBpZiAod2lsZGNhcmRTaXplQXJlYXMubGVuZ3RoID09PSAwICYmIHRoaXMuZGlzcGxheWVkQXJlYXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICB0aGlzLmRpc3BsYXllZEFyZWFzLmZvckVhY2goKGFyZWEsIGkpID0+IHtcbiAgICAgICAgICAgICAgICBhcmVhLnNpemUgPSBpID09PSAwID8gbnVsbCA6IGFyZWEuY29tcG9uZW50LnNpemU7XG4gICAgICAgICAgICAgICAgYXJlYS5taW5TaXplID0gaSA9PT0gMCA/IG51bGwgOiBnZXRBcmVhTWluU2l6ZShhcmVhKTtcbiAgICAgICAgICAgICAgICBhcmVhLm1heFNpemUgPSBpID09PSAwID8gbnVsbCA6IGdldEFyZWFNYXhTaXplKGFyZWEpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIE1vcmUgdGhhbiBvbmUgd2lsZGNhcmQgYXJlYSA+IE5lZWQgdG8ga2VlcCBvbmx5IG9uZSBhcmJpdHJhcmx5ID4gZmlyc3RcbiAgICAgICAgICAgIGVsc2UgaWYgKHdpbGRjYXJkU2l6ZUFyZWFzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgbGV0IGFscmVhZHlHb3RPbmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5ZWRBcmVhcy5mb3JFYWNoKGFyZWEgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChhcmVhLmNvbXBvbmVudC5zaXplID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICBpZiAoYWxyZWFkeUdvdE9uZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgYXJlYS5zaXplID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgYXJlYS5taW5TaXplID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgYXJlYS5tYXhTaXplID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgYWxyZWFkeUdvdE9uZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBhcmVhLnNpemUgPSAxMDA7XG4gICAgICAgICAgICAgICAgICAgIGFyZWEubWluU2l6ZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIGFyZWEubWF4U2l6ZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGFyZWEuc2l6ZSA9IGFyZWEuY29tcG9uZW50LnNpemU7XG4gICAgICAgICAgICAgICAgICBhcmVhLm1pblNpemUgPSBnZXRBcmVhTWluU2l6ZShhcmVhKTtcbiAgICAgICAgICAgICAgICAgIGFyZWEubWF4U2l6ZSA9IGdldEFyZWFNYXhTaXplKGFyZWEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5yZWZyZXNoU3R5bGVTaXplcygpO1xuICAgIHRoaXMuY2RSZWYubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICBwcml2YXRlIHJlZnJlc2hTdHlsZVNpemVzKCk6IHZvaWQge1xuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAvLyBQRVJDRU5UIE1PREVcbiAgICBpZiAodGhpcy51bml0ID09PSAncGVyY2VudCcpIHtcbiAgICAgIC8vIE9ubHkgb25lIGFyZWEgPiBmbGV4LWJhc2lzIDEwMCVcbiAgICAgIGlmICh0aGlzLmRpc3BsYXllZEFyZWFzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICB0aGlzLmRpc3BsYXllZEFyZWFzWzBdLmNvbXBvbmVudC5zZXRTdHlsZUZsZXgoMCwgMCwgYDEwMCVgLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgfVxuICAgICAgLy8gTXVsdGlwbGUgYXJlYXMgPiB1c2UgZWFjaCBwZXJjZW50IGJhc2lzXG4gICAgICBlbHNlIHtcbiAgICAgICAgY29uc3Qgc3VtR3V0dGVyU2l6ZSA9IHRoaXMuZ2V0TmJHdXR0ZXJzKCkgKiB0aGlzLmd1dHRlclNpemU7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5ZWRBcmVhcy5mb3JFYWNoKGFyZWEgPT4ge1xuICAgICAgICAgIGFyZWEuY29tcG9uZW50LnNldFN0eWxlRmxleChcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgYGNhbGMoICR7YXJlYS5zaXplfSUgLSAkeygoYXJlYS5zaXplIGFzIG51bWJlcikgLyAxMDApICogc3VtR3V0dGVyU2l6ZX1weCApYCxcbiAgICAgICAgICAgIGFyZWEubWluU2l6ZSAhPT0gbnVsbCAmJiBhcmVhLm1pblNpemUgPT09IGFyZWEuc2l6ZSA/IHRydWUgOiBmYWxzZSxcbiAgICAgICAgICAgIGFyZWEubWF4U2l6ZSAhPT0gbnVsbCAmJiBhcmVhLm1heFNpemUgPT09IGFyZWEuc2l6ZSA/IHRydWUgOiBmYWxzZVxuICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8gUElYRUwgTU9ERVxuICAgIGVsc2UgaWYgKHRoaXMudW5pdCA9PT0gJ3BpeGVsJykge1xuICAgICAgdGhpcy5kaXNwbGF5ZWRBcmVhcy5mb3JFYWNoKGFyZWEgPT4ge1xuICAgICAgICAvLyBBcmVhIHdpdGggd2lsZGNhcmQgc2l6ZVxuICAgICAgICBpZiAoYXJlYS5zaXplID09PSBudWxsKSB7XG4gICAgICAgICAgaWYgKHRoaXMuZGlzcGxheWVkQXJlYXMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICBhcmVhLmNvbXBvbmVudC5zZXRTdHlsZUZsZXgoMSwgMSwgYDEwMCVgLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhcmVhLmNvbXBvbmVudC5zZXRTdHlsZUZsZXgoMSwgMSwgYGF1dG9gLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBBcmVhIHdpdGggcGl4ZWwgc2l6ZVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAvLyBPbmx5IG9uZSBhcmVhID4gZmxleC1iYXNpcyAxMDAlXG4gICAgICAgICAgaWYgKHRoaXMuZGlzcGxheWVkQXJlYXMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICBhcmVhLmNvbXBvbmVudC5zZXRTdHlsZUZsZXgoMCwgMCwgYDEwMCVgLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBNdWx0aXBsZSBhcmVhcyA+IHVzZSBlYWNoIHBpeGVsIGJhc2lzXG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBhcmVhLmNvbXBvbmVudC5zZXRTdHlsZUZsZXgoXG4gICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgIGAke2FyZWEuc2l6ZX1weGAsXG4gICAgICAgICAgICAgIGFyZWEubWluU2l6ZSAhPT0gbnVsbCAmJiBhcmVhLm1pblNpemUgPT09IGFyZWEuc2l6ZSA/IHRydWUgOiBmYWxzZSxcbiAgICAgICAgICAgICAgYXJlYS5tYXhTaXplICE9PSBudWxsICYmIGFyZWEubWF4U2l6ZSA9PT0gYXJlYS5zaXplID8gdHJ1ZSA6IGZhbHNlXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgX2NsaWNrVGltZW91dDogbnVtYmVyIHwgbnVsbCA9IG51bGw7XG5cbiAgY2xpY2tHdXR0ZXIoZXZlbnQ6IE1vdXNlRXZlbnQgfCBUb3VjaEV2ZW50LCBndXR0ZXJOdW06IG51bWJlcik6IHZvaWQge1xuICAgIGNvbnN0IHRlbXBQb2ludCA9IGdldFBvaW50RnJvbUV2ZW50KGV2ZW50KSBhcyBNdHhTcGxpdFBvaW50O1xuXG4gICAgLy8gQmUgc3VyZSBtb3VzZXVwL3RvdWNoZW5kIGhhcHBlbmVkIGF0IHNhbWUgcG9pbnQgYXMgbW91c2Vkb3duL3RvdWNoc3RhcnQgdG8gdHJpZ2dlciBjbGljay9kYmxjbGlja1xuICAgIGlmICh0aGlzLnN0YXJ0UG9pbnQgJiYgdGhpcy5zdGFydFBvaW50LnggPT09IHRlbXBQb2ludC54ICYmIHRoaXMuc3RhcnRQb2ludC55ID09PSB0ZW1wUG9pbnQueSkge1xuICAgICAgLy8gSWYgdGltZW91dCBpbiBwcm9ncmVzcyBhbmQgbmV3IGNsaWNrID4gY2xlYXJUaW1lb3V0ICYgZGJsQ2xpY2tFdmVudFxuICAgICAgaWYgKHRoaXMuX2NsaWNrVGltZW91dCAhPT0gbnVsbCkge1xuICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHRoaXMuX2NsaWNrVGltZW91dCk7XG4gICAgICAgIHRoaXMuX2NsaWNrVGltZW91dCA9IG51bGw7XG4gICAgICAgIHRoaXMubm90aWZ5KCdkYmxjbGljaycsIGd1dHRlck51bSk7XG4gICAgICAgIHRoaXMuc3RvcERyYWdnaW5nKCk7XG4gICAgICB9XG4gICAgICAvLyBFbHNlIHN0YXJ0IHRpbWVvdXQgdG8gY2FsbCBjbGlja0V2ZW50IGF0IGVuZFxuICAgICAgZWxzZSB7XG4gICAgICAgIHRoaXMuX2NsaWNrVGltZW91dCA9IHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICB0aGlzLl9jbGlja1RpbWVvdXQgPSBudWxsO1xuICAgICAgICAgIHRoaXMubm90aWZ5KCdjbGljaycsIGd1dHRlck51bSk7XG4gICAgICAgICAgdGhpcy5zdG9wRHJhZ2dpbmcoKTtcbiAgICAgICAgfSwgdGhpcy5ndXR0ZXJEYmxDbGlja0R1cmF0aW9uKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzdGFydERyYWdnaW5nKGV2ZW50OiBNb3VzZUV2ZW50IHwgVG91Y2hFdmVudCwgZ3V0dGVyT3JkZXI6IG51bWJlciwgZ3V0dGVyTnVtOiBudW1iZXIpOiB2b2lkIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgdGhpcy5zdGFydFBvaW50ID0gZ2V0UG9pbnRGcm9tRXZlbnQoZXZlbnQpO1xuICAgIGlmICh0aGlzLnN0YXJ0UG9pbnQgPT09IG51bGwgfHwgdGhpcy5kaXNhYmxlZCA9PT0gdHJ1ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuc25hcHNob3QgPSB7XG4gICAgICBndXR0ZXJOdW0sXG4gICAgICBsYXN0U3RlcHBlZE9mZnNldDogMCxcbiAgICAgIGFsbEFyZWFzU2l6ZVBpeGVsOlxuICAgICAgICBnZXRFbGVtZW50UGl4ZWxTaXplKHRoaXMuZWxSZWYsIHRoaXMuZGlyZWN0aW9uKSAtIHRoaXMuZ2V0TmJHdXR0ZXJzKCkgKiB0aGlzLmd1dHRlclNpemUsXG4gICAgICBhbGxJbnZvbHZlZEFyZWFzU2l6ZVBlcmNlbnQ6IDEwMCxcbiAgICAgIGFyZWFzQmVmb3JlR3V0dGVyOiBbXSxcbiAgICAgIGFyZWFzQWZ0ZXJHdXR0ZXI6IFtdLFxuICAgIH07XG5cbiAgICB0aGlzLmRpc3BsYXllZEFyZWFzLmZvckVhY2goYXJlYSA9PiB7XG4gICAgICBjb25zdCBhcmVhU25hcHNob3Q6IE10eFNwbGl0QXJlYVNuYXBzaG90ID0ge1xuICAgICAgICBhcmVhLFxuICAgICAgICBzaXplUGl4ZWxBdFN0YXJ0OiBnZXRFbGVtZW50UGl4ZWxTaXplKGFyZWEuY29tcG9uZW50LmVsUmVmLCB0aGlzLmRpcmVjdGlvbiksXG4gICAgICAgIHNpemVQZXJjZW50QXRTdGFydDogKHRoaXMudW5pdCA9PT0gJ3BlcmNlbnQnID8gYXJlYS5zaXplIDogLTEpIGFzIG51bWJlciwgLy8gSWYgcGl4ZWwgbW9kZSwgYW55d2F5LCB3aWxsIG5vdCBiZSB1c2VkLlxuICAgICAgfTtcblxuICAgICAgaWYgKGFyZWEub3JkZXIgPCBndXR0ZXJPcmRlcikge1xuICAgICAgICBpZiAodGhpcy5yZXN0cmljdE1vdmUgPT09IHRydWUpIHtcbiAgICAgICAgICAodGhpcy5zbmFwc2hvdCBhcyBNdHhTcGxpdFNuYXBzaG90KS5hcmVhc0JlZm9yZUd1dHRlciA9IFthcmVhU25hcHNob3RdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICh0aGlzLnNuYXBzaG90IGFzIE10eFNwbGl0U25hcHNob3QpLmFyZWFzQmVmb3JlR3V0dGVyLnVuc2hpZnQoYXJlYVNuYXBzaG90KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChhcmVhLm9yZGVyID4gZ3V0dGVyT3JkZXIpIHtcbiAgICAgICAgaWYgKHRoaXMucmVzdHJpY3RNb3ZlID09PSB0cnVlKSB7XG4gICAgICAgICAgaWYgKCh0aGlzLnNuYXBzaG90IGFzIE10eFNwbGl0U25hcHNob3QpLmFyZWFzQWZ0ZXJHdXR0ZXIubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAodGhpcy5zbmFwc2hvdCBhcyBNdHhTcGxpdFNuYXBzaG90KS5hcmVhc0FmdGVyR3V0dGVyID0gW2FyZWFTbmFwc2hvdF07XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICh0aGlzLnNuYXBzaG90IGFzIE10eFNwbGl0U25hcHNob3QpLmFyZWFzQWZ0ZXJHdXR0ZXIucHVzaChhcmVhU25hcHNob3QpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLnNuYXBzaG90LmFsbEludm9sdmVkQXJlYXNTaXplUGVyY2VudCA9IFtcbiAgICAgIC4uLnRoaXMuc25hcHNob3QuYXJlYXNCZWZvcmVHdXR0ZXIsXG4gICAgICAuLi50aGlzLnNuYXBzaG90LmFyZWFzQWZ0ZXJHdXR0ZXIsXG4gICAgXS5yZWR1Y2UoKHQsIGEpID0+IHQgKyBhLnNpemVQZXJjZW50QXRTdGFydCwgMCk7XG5cbiAgICBpZiAoXG4gICAgICB0aGlzLnNuYXBzaG90LmFyZWFzQmVmb3JlR3V0dGVyLmxlbmd0aCA9PT0gMCB8fFxuICAgICAgdGhpcy5zbmFwc2hvdC5hcmVhc0FmdGVyR3V0dGVyLmxlbmd0aCA9PT0gMFxuICAgICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuZHJhZ0xpc3RlbmVycy5wdXNoKFxuICAgICAgdGhpcy5yZW5kZXJlci5saXN0ZW4oJ2RvY3VtZW50JywgJ21vdXNldXAnLCB0aGlzLnN0b3BEcmFnZ2luZy5iaW5kKHRoaXMpKVxuICAgICk7XG4gICAgdGhpcy5kcmFnTGlzdGVuZXJzLnB1c2goXG4gICAgICB0aGlzLnJlbmRlcmVyLmxpc3RlbignZG9jdW1lbnQnLCAndG91Y2hlbmQnLCB0aGlzLnN0b3BEcmFnZ2luZy5iaW5kKHRoaXMpKVxuICAgICk7XG4gICAgdGhpcy5kcmFnTGlzdGVuZXJzLnB1c2goXG4gICAgICB0aGlzLnJlbmRlcmVyLmxpc3RlbignZG9jdW1lbnQnLCAndG91Y2hjYW5jZWwnLCB0aGlzLnN0b3BEcmFnZ2luZy5iaW5kKHRoaXMpKVxuICAgICk7XG5cbiAgICB0aGlzLm5nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICB0aGlzLmRyYWdMaXN0ZW5lcnMucHVzaChcbiAgICAgICAgdGhpcy5yZW5kZXJlci5saXN0ZW4oJ2RvY3VtZW50JywgJ21vdXNlbW92ZScsIHRoaXMuZHJhZ0V2ZW50LmJpbmQodGhpcykpXG4gICAgICApO1xuICAgICAgdGhpcy5kcmFnTGlzdGVuZXJzLnB1c2goXG4gICAgICAgIHRoaXMucmVuZGVyZXIubGlzdGVuKCdkb2N1bWVudCcsICd0b3VjaG1vdmUnLCB0aGlzLmRyYWdFdmVudC5iaW5kKHRoaXMpKVxuICAgICAgKTtcbiAgICB9KTtcblxuICAgIHRoaXMuZGlzcGxheWVkQXJlYXMuZm9yRWFjaChhcmVhID0+IGFyZWEuY29tcG9uZW50LmxvY2tFdmVudHMoKSk7XG5cbiAgICB0aGlzLmlzRHJhZ2dpbmcgPSB0cnVlO1xuICAgIHRoaXMucmVuZGVyZXIuYWRkQ2xhc3ModGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50LCAnbXR4LWRyYWdnaW5nJyk7XG4gICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyhcbiAgICAgIHRoaXMuZ3V0dGVyRWxzLnRvQXJyYXkoKVt0aGlzLnNuYXBzaG90Lmd1dHRlck51bSAtIDFdLm5hdGl2ZUVsZW1lbnQsXG4gICAgICAnbXR4LWRyYWdnZWQnXG4gICAgKTtcblxuICAgIHRoaXMubm90aWZ5KCdzdGFydCcsIHRoaXMuc25hcHNob3QuZ3V0dGVyTnVtKTtcbiAgfVxuXG4gIHByaXZhdGUgZHJhZ0V2ZW50KGV2ZW50OiBNb3VzZUV2ZW50IHwgVG91Y2hFdmVudCk6IHZvaWQge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICBpZiAodGhpcy5fY2xpY2tUaW1lb3V0ICE9PSBudWxsKSB7XG4gICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHRoaXMuX2NsaWNrVGltZW91dCk7XG4gICAgICB0aGlzLl9jbGlja1RpbWVvdXQgPSBudWxsO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmlzRHJhZ2dpbmcgPT09IGZhbHNlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5lbmRQb2ludCA9IGdldFBvaW50RnJvbUV2ZW50KGV2ZW50KTtcbiAgICBpZiAodGhpcy5lbmRQb2ludCA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIENhbGN1bGF0ZSBzdGVwcGVkT2Zmc2V0XG5cbiAgICBsZXQgb2Zmc2V0ID1cbiAgICAgIHRoaXMuZGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCdcbiAgICAgICAgPyAodGhpcy5zdGFydFBvaW50IGFzIE10eFNwbGl0UG9pbnQpLnggLSB0aGlzLmVuZFBvaW50LnhcbiAgICAgICAgOiAodGhpcy5zdGFydFBvaW50IGFzIE10eFNwbGl0UG9pbnQpLnkgLSB0aGlzLmVuZFBvaW50Lnk7XG4gICAgaWYgKHRoaXMuZGlyID09PSAncnRsJyAmJiB0aGlzLmRpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgICBvZmZzZXQgPSAtb2Zmc2V0O1xuICAgIH1cbiAgICBjb25zdCBzdGVwcGVkT2Zmc2V0ID0gTWF0aC5yb3VuZChvZmZzZXQgLyB0aGlzLmd1dHRlclN0ZXApICogdGhpcy5ndXR0ZXJTdGVwO1xuXG4gICAgaWYgKHN0ZXBwZWRPZmZzZXQgPT09ICh0aGlzLnNuYXBzaG90IGFzIE10eFNwbGl0U25hcHNob3QpLmxhc3RTdGVwcGVkT2Zmc2V0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgKHRoaXMuc25hcHNob3QgYXMgTXR4U3BsaXRTbmFwc2hvdCkubGFzdFN0ZXBwZWRPZmZzZXQgPSBzdGVwcGVkT2Zmc2V0O1xuXG4gICAgLy8gTmVlZCB0byBrbm93IGlmIGVhY2ggZ3V0dGVyIHNpZGUgYXJlYXMgY291bGQgcmVhY3RzIHRvIHN0ZXBwZWRPZmZzZXRcblxuICAgIGxldCBhcmVhc0JlZm9yZSA9IGdldEd1dHRlclNpZGVBYnNvcnB0aW9uQ2FwYWNpdHkoXG4gICAgICB0aGlzLnVuaXQsXG4gICAgICAodGhpcy5zbmFwc2hvdCBhcyBNdHhTcGxpdFNuYXBzaG90KS5hcmVhc0JlZm9yZUd1dHRlcixcbiAgICAgIC1zdGVwcGVkT2Zmc2V0LFxuICAgICAgKHRoaXMuc25hcHNob3QgYXMgTXR4U3BsaXRTbmFwc2hvdCkuYWxsQXJlYXNTaXplUGl4ZWxcbiAgICApO1xuICAgIGxldCBhcmVhc0FmdGVyID0gZ2V0R3V0dGVyU2lkZUFic29ycHRpb25DYXBhY2l0eShcbiAgICAgIHRoaXMudW5pdCxcbiAgICAgICh0aGlzLnNuYXBzaG90IGFzIE10eFNwbGl0U25hcHNob3QpLmFyZWFzQWZ0ZXJHdXR0ZXIsXG4gICAgICBzdGVwcGVkT2Zmc2V0LFxuICAgICAgKHRoaXMuc25hcHNob3QgYXMgTXR4U3BsaXRTbmFwc2hvdCkuYWxsQXJlYXNTaXplUGl4ZWxcbiAgICApO1xuXG4gICAgLy8gRWFjaCBndXR0ZXIgc2lkZSBhcmVhcyBjYW4ndCBhYnNvcmIgYWxsIG9mZnNldFxuICAgIGlmIChhcmVhc0JlZm9yZS5yZW1haW4gIT09IDAgJiYgYXJlYXNBZnRlci5yZW1haW4gIT09IDApIHtcbiAgICAgIGlmIChNYXRoLmFicyhhcmVhc0JlZm9yZS5yZW1haW4pID09PSBNYXRoLmFicyhhcmVhc0FmdGVyLnJlbWFpbikpIHtcbiAgICAgICAgLyoqICovXG4gICAgICB9IGVsc2UgaWYgKE1hdGguYWJzKGFyZWFzQmVmb3JlLnJlbWFpbikgPiBNYXRoLmFicyhhcmVhc0FmdGVyLnJlbWFpbikpIHtcbiAgICAgICAgYXJlYXNBZnRlciA9IGdldEd1dHRlclNpZGVBYnNvcnB0aW9uQ2FwYWNpdHkoXG4gICAgICAgICAgdGhpcy51bml0LFxuICAgICAgICAgICh0aGlzLnNuYXBzaG90IGFzIE10eFNwbGl0U25hcHNob3QpLmFyZWFzQWZ0ZXJHdXR0ZXIsXG4gICAgICAgICAgc3RlcHBlZE9mZnNldCArIGFyZWFzQmVmb3JlLnJlbWFpbixcbiAgICAgICAgICAodGhpcy5zbmFwc2hvdCBhcyBNdHhTcGxpdFNuYXBzaG90KS5hbGxBcmVhc1NpemVQaXhlbFxuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXJlYXNCZWZvcmUgPSBnZXRHdXR0ZXJTaWRlQWJzb3JwdGlvbkNhcGFjaXR5KFxuICAgICAgICAgIHRoaXMudW5pdCxcbiAgICAgICAgICAodGhpcy5zbmFwc2hvdCBhcyBNdHhTcGxpdFNuYXBzaG90KS5hcmVhc0JlZm9yZUd1dHRlcixcbiAgICAgICAgICAtKHN0ZXBwZWRPZmZzZXQgLSBhcmVhc0FmdGVyLnJlbWFpbiksXG4gICAgICAgICAgKHRoaXMuc25hcHNob3QgYXMgTXR4U3BsaXRTbmFwc2hvdCkuYWxsQXJlYXNTaXplUGl4ZWxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gQXJlYXMgYmVmb3JlIGd1dHRlciBjYW4ndCBhYnNvcmJzIGFsbCBvZmZzZXQgPiBuZWVkIHRvIHJlY2FsY3VsYXRlIHNpemVzIGZvciBhcmVhcyBhZnRlciBndXR0ZXIuXG4gICAgZWxzZSBpZiAoYXJlYXNCZWZvcmUucmVtYWluICE9PSAwKSB7XG4gICAgICBhcmVhc0FmdGVyID0gZ2V0R3V0dGVyU2lkZUFic29ycHRpb25DYXBhY2l0eShcbiAgICAgICAgdGhpcy51bml0LFxuICAgICAgICAodGhpcy5zbmFwc2hvdCBhcyBNdHhTcGxpdFNuYXBzaG90KS5hcmVhc0FmdGVyR3V0dGVyLFxuICAgICAgICBzdGVwcGVkT2Zmc2V0ICsgYXJlYXNCZWZvcmUucmVtYWluLFxuICAgICAgICAodGhpcy5zbmFwc2hvdCBhcyBNdHhTcGxpdFNuYXBzaG90KS5hbGxBcmVhc1NpemVQaXhlbFxuICAgICAgKTtcbiAgICB9XG4gICAgLy8gQXJlYXMgYWZ0ZXIgZ3V0dGVyIGNhbid0IGFic29yYnMgYWxsIG9mZnNldCA+IG5lZWQgdG8gcmVjYWxjdWxhdGUgc2l6ZXMgZm9yIGFyZWFzIGJlZm9yZSBndXR0ZXIuXG4gICAgZWxzZSBpZiAoYXJlYXNBZnRlci5yZW1haW4gIT09IDApIHtcbiAgICAgIGFyZWFzQmVmb3JlID0gZ2V0R3V0dGVyU2lkZUFic29ycHRpb25DYXBhY2l0eShcbiAgICAgICAgdGhpcy51bml0LFxuICAgICAgICAodGhpcy5zbmFwc2hvdCBhcyBNdHhTcGxpdFNuYXBzaG90KS5hcmVhc0JlZm9yZUd1dHRlcixcbiAgICAgICAgLShzdGVwcGVkT2Zmc2V0IC0gYXJlYXNBZnRlci5yZW1haW4pLFxuICAgICAgICAodGhpcy5zbmFwc2hvdCBhcyBNdHhTcGxpdFNuYXBzaG90KS5hbGxBcmVhc1NpemVQaXhlbFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy51bml0ID09PSAncGVyY2VudCcpIHtcbiAgICAgIC8vIEhhY2sgYmVjYXVzZSBvZiBicm93c2VyIG1lc3NpbmcgdXAgd2l0aCBzaXplcyB1c2luZyBjYWxjKFglIC0gWXB4KSAtPiBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgICAgLy8gSWYgbm90IHRoZXJlLCBwbGF5aW5nIHdpdGggZ3V0dGVycyBtYWtlcyB0b3RhbCBnb2luZyBkb3duIHRvIDk5Ljk5ODc1JSB0aGVuIDk5Ljk5Mjg2JSwgOTkuOTg5ODYlLC4uXG4gICAgICBjb25zdCBhbGwgPSBbLi4uYXJlYXNCZWZvcmUubGlzdCwgLi4uYXJlYXNBZnRlci5saXN0XTtcbiAgICAgIGNvbnN0IGFyZWFUb1Jlc2V0ID0gYWxsLmZpbmQoXG4gICAgICAgIGEgPT5cbiAgICAgICAgICBhLnBlcmNlbnRBZnRlckFic29ycHRpb24gIT09IDAgJiZcbiAgICAgICAgICBhLnBlcmNlbnRBZnRlckFic29ycHRpb24gIT09IGEuYXJlYVNuYXBzaG90LmFyZWEubWluU2l6ZSAmJlxuICAgICAgICAgIGEucGVyY2VudEFmdGVyQWJzb3JwdGlvbiAhPT0gYS5hcmVhU25hcHNob3QuYXJlYS5tYXhTaXplXG4gICAgICApO1xuXG4gICAgICBpZiAoYXJlYVRvUmVzZXQpIHtcbiAgICAgICAgYXJlYVRvUmVzZXQucGVyY2VudEFmdGVyQWJzb3JwdGlvbiA9XG4gICAgICAgICAgKHRoaXMuc25hcHNob3QgYXMgTXR4U3BsaXRTbmFwc2hvdCkuYWxsSW52b2x2ZWRBcmVhc1NpemVQZXJjZW50IC1cbiAgICAgICAgICBhbGxcbiAgICAgICAgICAgIC5maWx0ZXIoYSA9PiBhICE9PSBhcmVhVG9SZXNldClcbiAgICAgICAgICAgIC5yZWR1Y2UoKHRvdGFsLCBhKSA9PiB0b3RhbCArIGEucGVyY2VudEFmdGVyQWJzb3JwdGlvbiwgMCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gTm93IHdlIGtub3cgYXJlYXMgY291bGQgYWJzb3JiIHN0ZXBwZWRPZmZzZXQsIHRpbWUgdG8gcmVhbGx5IHVwZGF0ZSBzaXplc1xuXG4gICAgYXJlYXNCZWZvcmUubGlzdC5mb3JFYWNoKGl0ZW0gPT4gdXBkYXRlQXJlYVNpemUodGhpcy51bml0LCBpdGVtKSk7XG4gICAgYXJlYXNBZnRlci5saXN0LmZvckVhY2goaXRlbSA9PiB1cGRhdGVBcmVhU2l6ZSh0aGlzLnVuaXQsIGl0ZW0pKTtcblxuICAgIHRoaXMucmVmcmVzaFN0eWxlU2l6ZXMoKTtcbiAgICB0aGlzLm5vdGlmeSgncHJvZ3Jlc3MnLCAodGhpcy5zbmFwc2hvdCBhcyBNdHhTcGxpdFNuYXBzaG90KS5ndXR0ZXJOdW0pO1xuICB9XG5cbiAgcHJpdmF0ZSBzdG9wRHJhZ2dpbmcoZXZlbnQ/OiBFdmVudCk6IHZvaWQge1xuICAgIGlmIChldmVudCkge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmlzRHJhZ2dpbmcgPT09IGZhbHNlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5kaXNwbGF5ZWRBcmVhcy5mb3JFYWNoKGFyZWEgPT4gYXJlYS5jb21wb25lbnQudW5sb2NrRXZlbnRzKCkpO1xuXG4gICAgd2hpbGUgKHRoaXMuZHJhZ0xpc3RlbmVycy5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCBmY3QgPSB0aGlzLmRyYWdMaXN0ZW5lcnMucG9wKCk7XG4gICAgICBpZiAoZmN0KSB7XG4gICAgICAgIGZjdCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFdhcm5pbmc6IEhhdmUgdG8gYmUgYmVmb3JlIFwibm90aWZ5KCdlbmQnKVwiXG4gICAgLy8gYmVjYXVzZSBcIm5vdGlmeSgnZW5kJylcIlwiIGNhbiBiZSBsaW5rZWQgdG8gXCJbc2l6ZV09J3gnXCIgPiBcImJ1aWxkKClcIiA+IFwic3RvcERyYWdnaW5nKClcIlxuICAgIHRoaXMuaXNEcmFnZ2luZyA9IGZhbHNlO1xuXG4gICAgLy8gSWYgbW92ZWQgZnJvbSBzdGFydGluZyBwb2ludCwgbm90aWZ5IGVuZFxuICAgIGlmIChcbiAgICAgIHRoaXMuZW5kUG9pbnQgJiZcbiAgICAgICgodGhpcy5zdGFydFBvaW50IGFzIE10eFNwbGl0UG9pbnQpLnggIT09IHRoaXMuZW5kUG9pbnQueCB8fFxuICAgICAgICAodGhpcy5zdGFydFBvaW50IGFzIE10eFNwbGl0UG9pbnQpLnkgIT09IHRoaXMuZW5kUG9pbnQueSlcbiAgICApIHtcbiAgICAgIHRoaXMubm90aWZ5KCdlbmQnLCAodGhpcy5zbmFwc2hvdCBhcyBNdHhTcGxpdFNuYXBzaG90KS5ndXR0ZXJOdW0pO1xuICAgIH1cblxuICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2xhc3ModGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50LCAnbXR4LWRyYWdnaW5nJyk7XG4gICAgdGhpcy5yZW5kZXJlci5yZW1vdmVDbGFzcyhcbiAgICAgIHRoaXMuZ3V0dGVyRWxzLnRvQXJyYXkoKVsodGhpcy5zbmFwc2hvdCBhcyBNdHhTcGxpdFNuYXBzaG90KS5ndXR0ZXJOdW0gLSAxXS5uYXRpdmVFbGVtZW50LFxuICAgICAgJ210eC1kcmFnZ2VkJ1xuICAgICk7XG4gICAgdGhpcy5zbmFwc2hvdCA9IG51bGw7XG5cbiAgICAvLyBOZWVkZWQgdG8gbGV0IChjbGljayk9XCJjbGlja0d1dHRlciguLi4pXCIgZXZlbnQgcnVuIGFuZCB2ZXJpZnkgaWYgbW91c2UgbW92ZWQgb3Igbm90XG4gICAgdGhpcy5uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMuc3RhcnRQb2ludCA9IG51bGw7XG4gICAgICAgIHRoaXMuZW5kUG9pbnQgPSBudWxsO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBub3RpZnkoXG4gICAgdHlwZTogJ3N0YXJ0JyB8ICdwcm9ncmVzcycgfCAnZW5kJyB8ICdjbGljaycgfCAnZGJsY2xpY2snIHwgJ3RyYW5zaXRpb25FbmQnLFxuICAgIGd1dHRlck51bTogbnVtYmVyXG4gICk6IHZvaWQge1xuICAgIGNvbnN0IHNpemVzID0gdGhpcy5nZXRWaXNpYmxlQXJlYVNpemVzKCk7XG5cbiAgICBpZiAodHlwZSA9PT0gJ3N0YXJ0Jykge1xuICAgICAgdGhpcy5kcmFnU3RhcnQuZW1pdCh7IGd1dHRlck51bSwgc2l6ZXMgfSk7XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSAnZW5kJykge1xuICAgICAgdGhpcy5kcmFnRW5kLmVtaXQoeyBndXR0ZXJOdW0sIHNpemVzIH0pO1xuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ2NsaWNrJykge1xuICAgICAgdGhpcy5ndXR0ZXJDbGljay5lbWl0KHsgZ3V0dGVyTnVtLCBzaXplcyB9KTtcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdkYmxjbGljaycpIHtcbiAgICAgIHRoaXMuZ3V0dGVyRGJsQ2xpY2suZW1pdCh7IGd1dHRlck51bSwgc2l6ZXMgfSk7XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSAndHJhbnNpdGlvbkVuZCcpIHtcbiAgICAgIGlmICh0aGlzLnRyYW5zaXRpb25FbmRTdWJzY3JpYmVyKSB7XG4gICAgICAgIHRoaXMubmdab25lLnJ1bigoKSA9PiB0aGlzLnRyYW5zaXRpb25FbmRTdWJzY3JpYmVyLm5leHQoc2l6ZXMpKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdwcm9ncmVzcycpIHtcbiAgICAgIC8vIFN0YXkgb3V0c2lkZSB6b25lIHRvIGFsbG93IHVzZXJzIGRvIHdoYXQgdGhleSB3YW50IGFib3V0IGNoYW5nZSBkZXRlY3Rpb24gbWVjaGFuaXNtLlxuICAgICAgdGhpcy5kcmFnUHJvZ3Jlc3NTdWJqZWN0Lm5leHQoeyBndXR0ZXJOdW0sIHNpemVzIH0pO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuc3RvcERyYWdnaW5nKCk7XG4gIH1cbn1cbiIsIjxuZy1jb250ZW50PjwvbmctY29udGVudD5cclxuQGZvciAoYXJlYSBvZiBkaXNwbGF5ZWRBcmVhczsgdHJhY2sgYXJlYTsgbGV0IGluZGV4ID0gJGluZGV4OyBsZXQgbGFzdCA9ICRsYXN0KSB7XHJcbiAgQGlmICghbGFzdCkge1xyXG4gICAgPGRpdiAjZ3V0dGVyRWxzIGNsYXNzPVwibXR4LXNwbGl0LWd1dHRlclwiIFtjbGFzc109XCJjb2xvciA/ICdtYXQtJyArIGNvbG9yIDogJydcIlxyXG4gICAgICBbc3R5bGUuZmxleC1iYXNpcy5weF09XCJndXR0ZXJTaXplXCJcclxuICAgICAgW3N0eWxlLm9yZGVyXT1cImluZGV4ICogMiArIDFcIlxyXG4gICAgICAobW91c2Vkb3duKT1cInN0YXJ0RHJhZ2dpbmcoJGV2ZW50LCBpbmRleCAqIDIgKyAxLCBpbmRleCArIDEpXCJcclxuICAgICAgKHRvdWNoc3RhcnQpPVwic3RhcnREcmFnZ2luZygkZXZlbnQsIGluZGV4ICogMiArIDEsIGluZGV4ICsgMSlcIlxyXG4gICAgICAobW91c2V1cCk9XCJjbGlja0d1dHRlcigkZXZlbnQsIGluZGV4ICsgMSlcIlxyXG4gICAgICAodG91Y2hlbmQpPVwiY2xpY2tHdXR0ZXIoJGV2ZW50LCBpbmRleCArIDEpXCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJtdHgtc3BsaXQtZ3V0dGVyLWhhbmRsZVwiPjwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgfVxyXG59XHJcbiJdfQ==