import { CdkTrapFocus } from '@angular/cdk/a11y';
import { ESCAPE, hasModifierKey } from '@angular/cdk/keycodes';
import { ChangeDetectionStrategy, Component, ContentChild, EventEmitter, Inject, InjectionToken, Input, Output, TemplateRef, ViewChild, ViewEncapsulation, booleanAttribute, } from '@angular/core';
import { Subject } from 'rxjs';
import { transformPopover } from './popover-animations';
import { MTX_POPOVER_CONTENT } from './popover-content';
import { throwMtxPopoverInvalidPositionEnd, throwMtxPopoverInvalidPositionStart, } from './popover-errors';
import * as i0 from "@angular/core";
/** Injection token to be used to override the default options for `mtx-popover`. */
export const MTX_POPOVER_DEFAULT_OPTIONS = new InjectionToken('mtx-popover-default-options', {
    providedIn: 'root',
    factory: MTX_POPOVER_DEFAULT_OPTIONS_FACTORY,
});
/** @docs-private */
export function MTX_POPOVER_DEFAULT_OPTIONS_FACTORY() {
    return {
        backdropClass: 'cdk-overlay-transparent-backdrop',
    };
}
let popoverPanelUid = 0;
export class MtxPopover {
    /** Popover's position. */
    get position() {
        return this._position;
    }
    set position(value) {
        if (!['before', 'after', 'above', 'below'].includes(value[0])) {
            throwMtxPopoverInvalidPositionStart();
        }
        if (!['before', 'after', 'above', 'below', 'center'].includes(value[1])) {
            throwMtxPopoverInvalidPositionEnd();
        }
        this._position = value;
        this.setPositionClasses();
    }
    /** Popover-panel's elevation (0~24). */
    get elevation() {
        return Math.max(0, Math.min(Math.round(this._elevation), 24));
    }
    set elevation(value) {
        this._elevation = value;
    }
    /**
     * This method takes classes set on the host mtx-popover element and applies them on the
     * popover template that displays in the overlay container. Otherwise, it's difficult
     * to style the containing popover from outside the component.
     * @param classes list of class names
     */
    set panelClass(classes) {
        const previousPanelClass = this._previousPanelClass;
        const newClassList = { ...this._classList };
        if (previousPanelClass && previousPanelClass.length) {
            previousPanelClass.split(' ').forEach((className) => {
                newClassList[className] = false;
            });
        }
        this._previousPanelClass = classes;
        if (classes && classes.length) {
            classes.split(' ').forEach((className) => {
                newClassList[className] = true;
            });
            this._elementRef.nativeElement.className = '';
            this.setPositionClasses();
        }
        this._classList = newClassList;
    }
    /**
     * This method takes classes set on the host mtx-popover element and applies them on the
     * popover template that displays in the overlay container. Otherwise, it's difficult
     * to style the containing popover from outside the component.
     * @deprecated Use `panelClass` instead.
     * @breaking-change 8.0.0
     */
    get classList() {
        return this.panelClass;
    }
    set classList(classes) {
        this.panelClass = classes;
    }
    constructor(_elementRef, _unusedNgZone, _defaultOptions) {
        this._elementRef = _elementRef;
        this._unusedNgZone = _unusedNgZone;
        this._defaultOptions = _defaultOptions;
        this._elevationPrefix = 'mat-elevation-z';
        /** Config object to be passed into the popover's class. */
        this._classList = {};
        /** Current state of the panel animation. */
        this._panelAnimationState = 'void';
        /** Emits whenever an animation on the popover completes. */
        this._animationDone = new Subject();
        /** Whether the popover is animating. */
        this._isAnimating = false;
        /** Closing disabled on popover */
        this.closeDisabled = false;
        /** Class or list of classes to be added to the overlay panel. */
        this.overlayPanelClass = this._defaultOptions.overlayPanelClass || '';
        /** Class to be added to the backdrop element. */
        this.backdropClass = this._defaultOptions.backdropClass;
        /** Popover's trigger event. */
        this.triggerEvent = this._defaultOptions.triggerEvent ?? 'hover';
        /** Popover's enter delay. */
        this.enterDelay = this._defaultOptions.enterDelay ?? 100;
        /** Popover's leave delay. */
        this.leaveDelay = this._defaultOptions.leaveDelay ?? 100;
        this._position = this._defaultOptions.position ?? ['below', 'after'];
        /** Popover-panel's X offset. */
        this.xOffset = this._defaultOptions.xOffset ?? 0;
        /** Popover-panel's Y offset. */
        this.yOffset = this._defaultOptions.yOffset ?? 0;
        /** Popover-arrow's width. */
        this.arrowWidth = this._defaultOptions.arrowWidth ?? 16;
        /** Popover-arrow's height. */
        this.arrowHeight = this._defaultOptions.arrowHeight ?? 16;
        /** Popover-arrow's X offset. */
        this.arrowOffsetX = this._defaultOptions.arrowOffsetX ?? 20;
        /** Popover-arrow's Y offset. */
        this.arrowOffsetY = this._defaultOptions.arrowOffsetY ?? 20;
        /** Whether the popover arrow should be hidden. */
        this.hideArrow = this._defaultOptions.hideArrow ?? false;
        /** Whether popover can be closed when click the popover-panel. */
        this.closeOnPanelClick = this._defaultOptions.closeOnPanelClick ?? false;
        /** Whether popover can be closed when click the backdrop. */
        this.closeOnBackdropClick = this._defaultOptions.closeOnBackdropClick ?? true;
        /** Whether enable focus trap using `cdkTrapFocus`. */
        this.focusTrapEnabled = this._defaultOptions.focusTrapEnabled ?? false;
        /** Whether enable focus trap auto capture using `cdkTrapFocusAutoCapture`. */
        this.focusTrapAutoCaptureEnabled = this._defaultOptions.focusTrapAutoCaptureEnabled ?? false;
        /** Whether the popover has a backdrop. It will always be false if the trigger event is hover. */
        this.hasBackdrop = this._defaultOptions.hasBackdrop;
        this._elevation = this._defaultOptions.elevation ?? 8;
        /** Event emitted when the popover is closed. */
        this.closed = new EventEmitter();
        this.panelId = `mtx-popover-panel-${popoverPanelUid++}`;
    }
    ngOnInit() {
        this.setPositionClasses();
    }
    ngOnDestroy() {
        this.closed.complete();
    }
    /** Handle a keyboard event from the popover, delegating to the appropriate action. */
    _handleKeydown(event) {
        const keyCode = event.keyCode;
        switch (keyCode) {
            case ESCAPE:
                if (!hasModifierKey(event)) {
                    event.preventDefault();
                    this.closed.emit('keydown');
                }
                break;
        }
    }
    /** Close popover on click if `closeOnPanelClick` is true. */
    _handleClick() {
        if (this.closeOnPanelClick) {
            this.closed.emit('click');
        }
    }
    /** Disables close of popover when leaving trigger element and mouse over the popover. */
    _handleMouseOver() {
        if (this.triggerEvent === 'hover') {
            this.closeDisabled = true;
        }
    }
    /** Enables close of popover when mouse leaving popover element. */
    _handleMouseLeave() {
        if (this.triggerEvent === 'hover') {
            setTimeout(() => {
                this.closeDisabled = false;
                this.closed.emit();
            }, this.leaveDelay);
        }
    }
    /** Sets the current styles for the popover to allow for dynamically changing settings. */
    setCurrentStyles(pos = this.position) {
        const left = pos[1] === 'after'
            ? `${this.arrowOffsetX - this.arrowWidth / 2}px`
            : pos[1] === 'center'
                ? `calc(50% - ${this.arrowWidth / 2}px)`
                : '';
        const right = pos[1] === 'before' ? `${this.arrowOffsetX - this.arrowWidth / 2}px` : '';
        const bottom = pos[1] === 'above'
            ? `${this.arrowOffsetY - this.arrowHeight / 2}px`
            : pos[1] === 'center'
                ? `calc(50% - ${this.arrowHeight / 2}px)`
                : '';
        const top = pos[1] === 'below' ? `${this.arrowOffsetY - this.arrowHeight / 2}px` : '';
        this.arrowStyles =
            pos[0] === 'above' || pos[0] === 'below'
                ? {
                    left: this.direction === 'ltr' ? left : right,
                    right: this.direction === 'ltr' ? right : left,
                }
                : { top, bottom };
    }
    /**
     * It's necessary to set position-based classes to ensure the popover panel animation
     * folds out from the correct direction.
     */
    setPositionClasses(pos = this.position) {
        this._classList['mtx-popover-before-above'] = pos[0] === 'before' && pos[1] === 'above';
        this._classList['mtx-popover-before-center'] = pos[0] === 'before' && pos[1] === 'center';
        this._classList['mtx-popover-before-below'] = pos[0] === 'before' && pos[1] === 'below';
        this._classList['mtx-popover-after-above'] = pos[0] === 'after' && pos[1] === 'above';
        this._classList['mtx-popover-after-center'] = pos[0] === 'after' && pos[1] === 'center';
        this._classList['mtx-popover-after-below'] = pos[0] === 'after' && pos[1] === 'below';
        this._classList['mtx-popover-above-before'] = pos[0] === 'above' && pos[1] === 'before';
        this._classList['mtx-popover-above-center'] = pos[0] === 'above' && pos[1] === 'center';
        this._classList['mtx-popover-above-after'] = pos[0] === 'above' && pos[1] === 'after';
        this._classList['mtx-popover-below-before'] = pos[0] === 'below' && pos[1] === 'before';
        this._classList['mtx-popover-below-center'] = pos[0] === 'below' && pos[1] === 'center';
        this._classList['mtx-popover-below-after'] = pos[0] === 'below' && pos[1] === 'after';
    }
    /** Sets the popover-panel's elevation. */
    setElevation() {
        const newElevation = `${this._elevationPrefix}${this.elevation}`;
        if (this._previousElevation) {
            this._classList[this._previousElevation] = false;
        }
        this._classList[newElevation] = true;
        this._previousElevation = newElevation;
    }
    /** Starts the enter animation. */
    _startAnimation() {
        // @breaking-change 8.0.0 Combine with _resetAnimation.
        this._panelAnimationState = 'enter';
    }
    /** Resets the panel animation to its initial state. */
    _resetAnimation() {
        // @breaking-change 8.0.0 Combine with _startAnimation.
        this._panelAnimationState = 'void';
    }
    /** Callback that is invoked when the panel animation completes. */
    _onAnimationDone(event) {
        this._animationDone.next(event);
        this._isAnimating = false;
    }
    _onAnimationStart(event) {
        this._isAnimating = true;
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxPopover, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: MTX_POPOVER_DEFAULT_OPTIONS }], target: i0.ɵɵFactoryTarget.Component }); }
    /** @nocollapse */ static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.0.1", type: MtxPopover, isStandalone: true, selector: "mtx-popover", inputs: { backdropClass: "backdropClass", ariaLabel: ["aria-label", "ariaLabel"], ariaLabelledby: ["aria-labelledby", "ariaLabelledby"], ariaDescribedby: ["aria-describedby", "ariaDescribedby"], triggerEvent: "triggerEvent", enterDelay: "enterDelay", leaveDelay: "leaveDelay", position: "position", xOffset: "xOffset", yOffset: "yOffset", arrowWidth: "arrowWidth", arrowHeight: "arrowHeight", arrowOffsetX: "arrowOffsetX", arrowOffsetY: "arrowOffsetY", hideArrow: ["hideArrow", "hideArrow", booleanAttribute], closeOnPanelClick: ["closeOnPanelClick", "closeOnPanelClick", booleanAttribute], closeOnBackdropClick: ["closeOnBackdropClick", "closeOnBackdropClick", booleanAttribute], focusTrapEnabled: ["focusTrapEnabled", "focusTrapEnabled", booleanAttribute], focusTrapAutoCaptureEnabled: ["focusTrapAutoCaptureEnabled", "focusTrapAutoCaptureEnabled", booleanAttribute], hasBackdrop: ["hasBackdrop", "hasBackdrop", booleanAttribute], elevation: "elevation", panelClass: ["class", "panelClass"], classList: "classList" }, outputs: { closed: "closed" }, queries: [{ propertyName: "lazyContent", first: true, predicate: MTX_POPOVER_CONTENT, descendants: true }], viewQueries: [{ propertyName: "templateRef", first: true, predicate: TemplateRef, descendants: true }], exportAs: ["mtxPopover"], ngImport: i0, template: "<ng-template>\n  <div\n    [id]=\"panelId\"\n    class=\"mtx-popover-panel\"\n    [class]=\"_classList\"\n    [class.mtx-popover-panel-without-arrow]=\"hideArrow\"\n    (keydown)=\"_handleKeydown($event)\"\n    (click)=\"_handleClick()\"\n    (mouseover)=\"_handleMouseOver()\"\n    (mouseleave)=\"_handleMouseLeave()\"\n    [@transformPopover]=\"_panelAnimationState\"\n    (@transformPopover.start)=\"_onAnimationStart($event)\"\n    (@transformPopover.done)=\"_onAnimationDone($event)\"\n    tabindex=\"-1\"\n    role=\"dialog\"\n    [attr.aria-label]=\"ariaLabel || null\"\n    [attr.aria-labelledby]=\"ariaLabelledby || null\"\n    [attr.aria-describedby]=\"ariaDescribedby || null\"\n    [cdkTrapFocus]=\"focusTrapEnabled\"\n    [cdkTrapFocusAutoCapture]=\"focusTrapAutoCaptureEnabled\">\n    <div class=\"mtx-popover-content\">\n      <ng-content></ng-content>\n    </div>\n    @if (!hideArrow) {\n      <div class=\"mtx-popover-direction-arrow\" [style]=\"arrowStyles\"></div>\n    }\n  </div>\n</ng-template>\n", styles: [".mtx-popover-panel{position:relative;max-height:calc(100vh - 48px);padding:8px;font-size:inherit;outline:0;border-radius:var(--mtx-popover-container-shape);background-color:var(--mtx-popover-background-color);color:var(--mtx-popover-text-color)}.mtx-popover-panel[class*=mtx-popover-below]{margin-top:calc(.5em + 2px)}.mtx-popover-panel[class*=mtx-popover-above]{margin-bottom:calc(.5em + 2px)}.mtx-popover-panel[class*=mtx-popover-before]{margin-right:calc(.5em + 2px)}[dir=rtl] .mtx-popover-panel[class*=mtx-popover-before]{margin-right:auto;margin-left:calc(.5em + 2px)}.mtx-popover-panel[class*=mtx-popover-after]{margin-left:calc(.5em + 2px)}[dir=rtl] .mtx-popover-panel[class*=mtx-popover-after]{margin-left:auto;margin-right:calc(.5em + 2px)}.mtx-popover-panel.mtx-popover-panel-without-arrow{margin:0}.mtx-popover-direction-arrow{position:absolute}.mtx-popover-direction-arrow:before,.mtx-popover-direction-arrow:after{position:absolute;display:inline-block;content:\"\";border-width:.5em;border-style:solid}.mtx-popover-direction-arrow:before{border-color:var(--mtx-popover-outline-color)}.mtx-popover-direction-arrow:after{border-width:calc(.5em - 1px);border-color:var(--mtx-popover-background-color)}[class*=mtx-popover-below] .mtx-popover-direction-arrow,[class*=mtx-popover-above] .mtx-popover-direction-arrow{width:1em}[class*=mtx-popover-below] .mtx-popover-direction-arrow:before,[class*=mtx-popover-below] .mtx-popover-direction-arrow:after,[class*=mtx-popover-above] .mtx-popover-direction-arrow:before,[class*=mtx-popover-above] .mtx-popover-direction-arrow:after{border-left-color:transparent;border-right-color:transparent}[class*=mtx-popover-below] .mtx-popover-direction-arrow:after,[class*=mtx-popover-above] .mtx-popover-direction-arrow:after{left:1px}[dir=rtl] [class*=mtx-popover-below] .mtx-popover-direction-arrow:after,[dir=rtl] [class*=mtx-popover-above] .mtx-popover-direction-arrow:after{right:1px;left:auto}[class*=mtx-popover-below] .mtx-popover-direction-arrow{top:0}[class*=mtx-popover-below] .mtx-popover-direction-arrow:before,[class*=mtx-popover-below] .mtx-popover-direction-arrow:after{bottom:0;border-top-width:0}[class*=mtx-popover-above] .mtx-popover-direction-arrow{bottom:0}[class*=mtx-popover-above] .mtx-popover-direction-arrow:before,[class*=mtx-popover-above] .mtx-popover-direction-arrow:after{top:0;border-bottom-width:0}[class*=mtx-popover-before] .mtx-popover-direction-arrow,[class*=mtx-popover-after] .mtx-popover-direction-arrow{height:1em}[class*=mtx-popover-before] .mtx-popover-direction-arrow:before,[class*=mtx-popover-before] .mtx-popover-direction-arrow:after,[class*=mtx-popover-after] .mtx-popover-direction-arrow:before,[class*=mtx-popover-after] .mtx-popover-direction-arrow:after{border-top-color:transparent;border-bottom-color:transparent}[class*=mtx-popover-before] .mtx-popover-direction-arrow:after,[class*=mtx-popover-after] .mtx-popover-direction-arrow:after{top:1px}[class*=mtx-popover-before] .mtx-popover-direction-arrow{right:0}[class*=mtx-popover-before] .mtx-popover-direction-arrow:before,[class*=mtx-popover-before] .mtx-popover-direction-arrow:after{left:0;border-right-width:0}[dir=rtl] [class*=mtx-popover-before] .mtx-popover-direction-arrow{right:auto;left:0}[dir=rtl] [class*=mtx-popover-before] .mtx-popover-direction-arrow:before,[dir=rtl] [class*=mtx-popover-before] .mtx-popover-direction-arrow:after{left:auto;right:0;border-left-width:0}[dir=rtl] [class*=mtx-popover-before] .mtx-popover-direction-arrow:before{border-right-width:.5em}[dir=rtl] [class*=mtx-popover-before] .mtx-popover-direction-arrow:after{border-right-width:calc(.5em - 1px)}[class*=mtx-popover-after] .mtx-popover-direction-arrow{left:0}[class*=mtx-popover-after] .mtx-popover-direction-arrow:before,[class*=mtx-popover-after] .mtx-popover-direction-arrow:after{right:0;border-left-width:0}[dir=rtl] [class*=mtx-popover-after] .mtx-popover-direction-arrow{left:auto;right:0}[dir=rtl] [class*=mtx-popover-after] .mtx-popover-direction-arrow:before,[dir=rtl] [class*=mtx-popover-after] .mtx-popover-direction-arrow:after{right:auto;left:0;border-right-width:0}[dir=rtl] [class*=mtx-popover-after] .mtx-popover-direction-arrow:before{border-left-width:.5em}[dir=rtl] [class*=mtx-popover-after] .mtx-popover-direction-arrow:after{border-left-width:calc(.5em - 1px)}\n"], dependencies: [{ kind: "directive", type: CdkTrapFocus, selector: "[cdkTrapFocus]", inputs: ["cdkTrapFocus", "cdkTrapFocusAutoCapture"], exportAs: ["cdkTrapFocus"] }], animations: [transformPopover], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxPopover, decorators: [{
            type: Component,
            args: [{ selector: 'mtx-popover', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, animations: [transformPopover], exportAs: 'mtxPopover', standalone: true, imports: [CdkTrapFocus], template: "<ng-template>\n  <div\n    [id]=\"panelId\"\n    class=\"mtx-popover-panel\"\n    [class]=\"_classList\"\n    [class.mtx-popover-panel-without-arrow]=\"hideArrow\"\n    (keydown)=\"_handleKeydown($event)\"\n    (click)=\"_handleClick()\"\n    (mouseover)=\"_handleMouseOver()\"\n    (mouseleave)=\"_handleMouseLeave()\"\n    [@transformPopover]=\"_panelAnimationState\"\n    (@transformPopover.start)=\"_onAnimationStart($event)\"\n    (@transformPopover.done)=\"_onAnimationDone($event)\"\n    tabindex=\"-1\"\n    role=\"dialog\"\n    [attr.aria-label]=\"ariaLabel || null\"\n    [attr.aria-labelledby]=\"ariaLabelledby || null\"\n    [attr.aria-describedby]=\"ariaDescribedby || null\"\n    [cdkTrapFocus]=\"focusTrapEnabled\"\n    [cdkTrapFocusAutoCapture]=\"focusTrapAutoCaptureEnabled\">\n    <div class=\"mtx-popover-content\">\n      <ng-content></ng-content>\n    </div>\n    @if (!hideArrow) {\n      <div class=\"mtx-popover-direction-arrow\" [style]=\"arrowStyles\"></div>\n    }\n  </div>\n</ng-template>\n", styles: [".mtx-popover-panel{position:relative;max-height:calc(100vh - 48px);padding:8px;font-size:inherit;outline:0;border-radius:var(--mtx-popover-container-shape);background-color:var(--mtx-popover-background-color);color:var(--mtx-popover-text-color)}.mtx-popover-panel[class*=mtx-popover-below]{margin-top:calc(.5em + 2px)}.mtx-popover-panel[class*=mtx-popover-above]{margin-bottom:calc(.5em + 2px)}.mtx-popover-panel[class*=mtx-popover-before]{margin-right:calc(.5em + 2px)}[dir=rtl] .mtx-popover-panel[class*=mtx-popover-before]{margin-right:auto;margin-left:calc(.5em + 2px)}.mtx-popover-panel[class*=mtx-popover-after]{margin-left:calc(.5em + 2px)}[dir=rtl] .mtx-popover-panel[class*=mtx-popover-after]{margin-left:auto;margin-right:calc(.5em + 2px)}.mtx-popover-panel.mtx-popover-panel-without-arrow{margin:0}.mtx-popover-direction-arrow{position:absolute}.mtx-popover-direction-arrow:before,.mtx-popover-direction-arrow:after{position:absolute;display:inline-block;content:\"\";border-width:.5em;border-style:solid}.mtx-popover-direction-arrow:before{border-color:var(--mtx-popover-outline-color)}.mtx-popover-direction-arrow:after{border-width:calc(.5em - 1px);border-color:var(--mtx-popover-background-color)}[class*=mtx-popover-below] .mtx-popover-direction-arrow,[class*=mtx-popover-above] .mtx-popover-direction-arrow{width:1em}[class*=mtx-popover-below] .mtx-popover-direction-arrow:before,[class*=mtx-popover-below] .mtx-popover-direction-arrow:after,[class*=mtx-popover-above] .mtx-popover-direction-arrow:before,[class*=mtx-popover-above] .mtx-popover-direction-arrow:after{border-left-color:transparent;border-right-color:transparent}[class*=mtx-popover-below] .mtx-popover-direction-arrow:after,[class*=mtx-popover-above] .mtx-popover-direction-arrow:after{left:1px}[dir=rtl] [class*=mtx-popover-below] .mtx-popover-direction-arrow:after,[dir=rtl] [class*=mtx-popover-above] .mtx-popover-direction-arrow:after{right:1px;left:auto}[class*=mtx-popover-below] .mtx-popover-direction-arrow{top:0}[class*=mtx-popover-below] .mtx-popover-direction-arrow:before,[class*=mtx-popover-below] .mtx-popover-direction-arrow:after{bottom:0;border-top-width:0}[class*=mtx-popover-above] .mtx-popover-direction-arrow{bottom:0}[class*=mtx-popover-above] .mtx-popover-direction-arrow:before,[class*=mtx-popover-above] .mtx-popover-direction-arrow:after{top:0;border-bottom-width:0}[class*=mtx-popover-before] .mtx-popover-direction-arrow,[class*=mtx-popover-after] .mtx-popover-direction-arrow{height:1em}[class*=mtx-popover-before] .mtx-popover-direction-arrow:before,[class*=mtx-popover-before] .mtx-popover-direction-arrow:after,[class*=mtx-popover-after] .mtx-popover-direction-arrow:before,[class*=mtx-popover-after] .mtx-popover-direction-arrow:after{border-top-color:transparent;border-bottom-color:transparent}[class*=mtx-popover-before] .mtx-popover-direction-arrow:after,[class*=mtx-popover-after] .mtx-popover-direction-arrow:after{top:1px}[class*=mtx-popover-before] .mtx-popover-direction-arrow{right:0}[class*=mtx-popover-before] .mtx-popover-direction-arrow:before,[class*=mtx-popover-before] .mtx-popover-direction-arrow:after{left:0;border-right-width:0}[dir=rtl] [class*=mtx-popover-before] .mtx-popover-direction-arrow{right:auto;left:0}[dir=rtl] [class*=mtx-popover-before] .mtx-popover-direction-arrow:before,[dir=rtl] [class*=mtx-popover-before] .mtx-popover-direction-arrow:after{left:auto;right:0;border-left-width:0}[dir=rtl] [class*=mtx-popover-before] .mtx-popover-direction-arrow:before{border-right-width:.5em}[dir=rtl] [class*=mtx-popover-before] .mtx-popover-direction-arrow:after{border-right-width:calc(.5em - 1px)}[class*=mtx-popover-after] .mtx-popover-direction-arrow{left:0}[class*=mtx-popover-after] .mtx-popover-direction-arrow:before,[class*=mtx-popover-after] .mtx-popover-direction-arrow:after{right:0;border-left-width:0}[dir=rtl] [class*=mtx-popover-after] .mtx-popover-direction-arrow{left:auto;right:0}[dir=rtl] [class*=mtx-popover-after] .mtx-popover-direction-arrow:before,[dir=rtl] [class*=mtx-popover-after] .mtx-popover-direction-arrow:after{right:auto;left:0;border-right-width:0}[dir=rtl] [class*=mtx-popover-after] .mtx-popover-direction-arrow:before{border-left-width:.5em}[dir=rtl] [class*=mtx-popover-after] .mtx-popover-direction-arrow:after{border-left-width:calc(.5em - 1px)}\n"] }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i0.NgZone }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MTX_POPOVER_DEFAULT_OPTIONS]
                }] }], propDecorators: { backdropClass: [{
                type: Input
            }], ariaLabel: [{
                type: Input,
                args: ['aria-label']
            }], ariaLabelledby: [{
                type: Input,
                args: ['aria-labelledby']
            }], ariaDescribedby: [{
                type: Input,
                args: ['aria-describedby']
            }], triggerEvent: [{
                type: Input
            }], enterDelay: [{
                type: Input
            }], leaveDelay: [{
                type: Input
            }], position: [{
                type: Input
            }], xOffset: [{
                type: Input
            }], yOffset: [{
                type: Input
            }], arrowWidth: [{
                type: Input
            }], arrowHeight: [{
                type: Input
            }], arrowOffsetX: [{
                type: Input
            }], arrowOffsetY: [{
                type: Input
            }], hideArrow: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], closeOnPanelClick: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], closeOnBackdropClick: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], focusTrapEnabled: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], focusTrapAutoCaptureEnabled: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], hasBackdrop: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], elevation: [{
                type: Input
            }], panelClass: [{
                type: Input,
                args: ['class']
            }], classList: [{
                type: Input
            }], closed: [{
                type: Output
            }], templateRef: [{
                type: ViewChild,
                args: [TemplateRef]
            }], lazyContent: [{
                type: ContentChild,
                args: [MTX_POPOVER_CONTENT]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wb3Zlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2V4dGVuc2lvbnMvcG9wb3Zlci9wb3BvdmVyLnRzIiwiLi4vLi4vLi4vLi4vcHJvamVjdHMvZXh0ZW5zaW9ucy9wb3BvdmVyL3BvcG92ZXIuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFFakQsT0FBTyxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUMvRCxPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFDVCxZQUFZLEVBRVosWUFBWSxFQUNaLE1BQU0sRUFDTixjQUFjLEVBQ2QsS0FBSyxFQUlMLE1BQU0sRUFDTixXQUFXLEVBQ1gsU0FBUyxFQUNULGlCQUFpQixFQUNqQixnQkFBZ0IsR0FDakIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUUvQixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUN4RCxPQUFPLEVBQUUsbUJBQW1CLEVBQXFCLE1BQU0sbUJBQW1CLENBQUM7QUFDM0UsT0FBTyxFQUNMLGlDQUFpQyxFQUNqQyxtQ0FBbUMsR0FDcEMsTUFBTSxrQkFBa0IsQ0FBQzs7QUFJMUIsb0ZBQW9GO0FBQ3BGLE1BQU0sQ0FBQyxNQUFNLDJCQUEyQixHQUFHLElBQUksY0FBYyxDQUMzRCw2QkFBNkIsRUFDN0I7SUFDRSxVQUFVLEVBQUUsTUFBTTtJQUNsQixPQUFPLEVBQUUsbUNBQW1DO0NBQzdDLENBQ0YsQ0FBQztBQUVGLG9CQUFvQjtBQUNwQixNQUFNLFVBQVUsbUNBQW1DO0lBQ2pELE9BQU87UUFDTCxhQUFhLEVBQUUsa0NBQWtDO0tBQ2xELENBQUM7QUFDSixDQUFDO0FBRUQsSUFBSSxlQUFlLEdBQUcsQ0FBQyxDQUFDO0FBYXhCLE1BQU0sT0FBTyxVQUFVO0lBaURyQiwwQkFBMEI7SUFDMUIsSUFDSSxRQUFRO1FBQ1YsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQ3hCLENBQUM7SUFDRCxJQUFJLFFBQVEsQ0FBQyxLQUF5QjtRQUNwQyxJQUFJLENBQUMsQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUM5RCxtQ0FBbUMsRUFBRSxDQUFDO1FBQ3hDLENBQUM7UUFDRCxJQUFJLENBQUMsQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDeEUsaUNBQWlDLEVBQUUsQ0FBQztRQUN0QyxDQUFDO1FBQ0QsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7UUFDdkIsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7SUFDNUIsQ0FBQztJQTZDRCx3Q0FBd0M7SUFDeEMsSUFDSSxTQUFTO1FBQ1gsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDaEUsQ0FBQztJQUNELElBQUksU0FBUyxDQUFDLEtBQWE7UUFDekIsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7SUFDMUIsQ0FBQztJQUdEOzs7OztPQUtHO0lBQ0gsSUFDSSxVQUFVLENBQUMsT0FBZTtRQUM1QixNQUFNLGtCQUFrQixHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQztRQUNwRCxNQUFNLFlBQVksR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBRTVDLElBQUksa0JBQWtCLElBQUksa0JBQWtCLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDcEQsa0JBQWtCLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQWlCLEVBQUUsRUFBRTtnQkFDMUQsWUFBWSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEtBQUssQ0FBQztZQUNsQyxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7UUFFRCxJQUFJLENBQUMsbUJBQW1CLEdBQUcsT0FBTyxDQUFDO1FBRW5DLElBQUksT0FBTyxJQUFJLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUM5QixPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQWlCLEVBQUUsRUFBRTtnQkFDL0MsWUFBWSxDQUFDLFNBQVMsQ0FBQyxHQUFHLElBQUksQ0FBQztZQUNqQyxDQUFDLENBQUMsQ0FBQztZQUVILElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7WUFFOUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7UUFDNUIsQ0FBQztRQUVELElBQUksQ0FBQyxVQUFVLEdBQUcsWUFBWSxDQUFDO0lBQ2pDLENBQUM7SUFHRDs7Ozs7O09BTUc7SUFDSCxJQUNJLFNBQVM7UUFDWCxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDekIsQ0FBQztJQUNELElBQUksU0FBUyxDQUFDLE9BQWU7UUFDM0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUM7SUFDNUIsQ0FBQztJQWdCRCxZQUNVLFdBQXVCLEVBQ3ZCLGFBQXFCLEVBQ2dCLGVBQXlDO1FBRjlFLGdCQUFXLEdBQVgsV0FBVyxDQUFZO1FBQ3ZCLGtCQUFhLEdBQWIsYUFBYSxDQUFRO1FBQ2dCLG9CQUFlLEdBQWYsZUFBZSxDQUEwQjtRQXJMaEYscUJBQWdCLEdBQUcsaUJBQWlCLENBQUM7UUFFN0MsMkRBQTJEO1FBQzNELGVBQVUsR0FBK0IsRUFBRSxDQUFDO1FBRTVDLDRDQUE0QztRQUM1Qyx5QkFBb0IsR0FBcUIsTUFBTSxDQUFDO1FBRWhELDREQUE0RDtRQUNuRCxtQkFBYyxHQUFHLElBQUksT0FBTyxFQUFrQixDQUFDO1FBRXhELHdDQUF3QztRQUN4QyxpQkFBWSxHQUFHLEtBQUssQ0FBQztRQUVyQixrQ0FBa0M7UUFDbEMsa0JBQWEsR0FBRyxLQUFLLENBQUM7UUFRdEIsaUVBQWlFO1FBQ2pFLHNCQUFpQixHQUFzQixJQUFJLENBQUMsZUFBZSxDQUFDLGlCQUFpQixJQUFJLEVBQUUsQ0FBQztRQUVwRixpREFBaUQ7UUFDeEMsa0JBQWEsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLGFBQWEsQ0FBQztRQVc1RCwrQkFBK0I7UUFDdEIsaUJBQVksR0FBMkIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxZQUFZLElBQUksT0FBTyxDQUFDO1FBRTdGLDZCQUE2QjtRQUNwQixlQUFVLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLElBQUksR0FBRyxDQUFDO1FBRTdELDZCQUE2QjtRQUNwQixlQUFVLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLElBQUksR0FBRyxDQUFDO1FBaUJyRCxjQUFTLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLElBQUksQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFeEUsZ0NBQWdDO1FBQ3ZCLFlBQU8sR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sSUFBSSxDQUFDLENBQUM7UUFFckQsZ0NBQWdDO1FBQ3ZCLFlBQU8sR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sSUFBSSxDQUFDLENBQUM7UUFFckQsNkJBQTZCO1FBQ3BCLGVBQVUsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsSUFBSSxFQUFFLENBQUM7UUFFNUQsOEJBQThCO1FBQ3JCLGdCQUFXLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLElBQUksRUFBRSxDQUFDO1FBRTlELGdDQUFnQztRQUN2QixpQkFBWSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsWUFBWSxJQUFJLEVBQUUsQ0FBQztRQUVoRSxnQ0FBZ0M7UUFDdkIsaUJBQVksR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLFlBQVksSUFBSSxFQUFFLENBQUM7UUFFaEUsa0RBQWtEO1FBRWxELGNBQVMsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLFNBQVMsSUFBSSxLQUFLLENBQUM7UUFFcEQsa0VBQWtFO1FBRWxFLHNCQUFpQixHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsaUJBQWlCLElBQUksS0FBSyxDQUFDO1FBRXBFLDZEQUE2RDtRQUU3RCx5QkFBb0IsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLG9CQUFvQixJQUFJLElBQUksQ0FBQztRQUV6RSxzREFBc0Q7UUFFdEQscUJBQWdCLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxnQkFBZ0IsSUFBSSxLQUFLLENBQUM7UUFFbEUsOEVBQThFO1FBRTlFLGdDQUEyQixHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsMkJBQTJCLElBQUksS0FBSyxDQUFDO1FBRXhGLGlHQUFpRztRQUVqRyxnQkFBVyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDO1FBVXZDLGVBQVUsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLFNBQVMsSUFBSSxDQUFDLENBQUM7UUFrRHpELGdEQUFnRDtRQUN0QyxXQUFNLEdBQUcsSUFBSSxZQUFZLEVBQXNCLENBQUM7UUFXakQsWUFBTyxHQUFHLHFCQUFxQixlQUFlLEVBQUUsRUFBRSxDQUFDO0lBTXpELENBQUM7SUFFSixRQUFRO1FBQ04sSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7SUFDNUIsQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3pCLENBQUM7SUFFRCxzRkFBc0Y7SUFDdEYsY0FBYyxDQUFDLEtBQW9CO1FBQ2pDLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7UUFFOUIsUUFBUSxPQUFPLEVBQUUsQ0FBQztZQUNoQixLQUFLLE1BQU07Z0JBQ1QsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO29CQUMzQixLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7b0JBQ3ZCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUM5QixDQUFDO2dCQUNELE1BQU07UUFDVixDQUFDO0lBQ0gsQ0FBQztJQUVELDZEQUE2RDtJQUM3RCxZQUFZO1FBQ1YsSUFBSSxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztZQUMzQixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM1QixDQUFDO0lBQ0gsQ0FBQztJQUVELHlGQUF5RjtJQUN6RixnQkFBZ0I7UUFDZCxJQUFJLElBQUksQ0FBQyxZQUFZLEtBQUssT0FBTyxFQUFFLENBQUM7WUFDbEMsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7UUFDNUIsQ0FBQztJQUNILENBQUM7SUFFRCxtRUFBbUU7SUFDbkUsaUJBQWlCO1FBQ2YsSUFBSSxJQUFJLENBQUMsWUFBWSxLQUFLLE9BQU8sRUFBRSxDQUFDO1lBQ2xDLFVBQVUsQ0FBQyxHQUFHLEVBQUU7Z0JBQ2QsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7Z0JBQzNCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDckIsQ0FBQyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN0QixDQUFDO0lBQ0gsQ0FBQztJQUVELDBGQUEwRjtJQUMxRixnQkFBZ0IsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLFFBQVE7UUFDbEMsTUFBTSxJQUFJLEdBQ1IsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLE9BQU87WUFDaEIsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsSUFBSTtZQUNoRCxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLFFBQVE7Z0JBQ25CLENBQUMsQ0FBQyxjQUFjLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxLQUFLO2dCQUN4QyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQ1gsTUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUV4RixNQUFNLE1BQU0sR0FDVixHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssT0FBTztZQUNoQixDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxJQUFJO1lBQ2pELENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssUUFBUTtnQkFDbkIsQ0FBQyxDQUFDLGNBQWMsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLEtBQUs7Z0JBQ3pDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDWCxNQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBRXRGLElBQUksQ0FBQyxXQUFXO1lBQ2QsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLE9BQU8sSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssT0FBTztnQkFDdEMsQ0FBQyxDQUFDO29CQUNFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLO29CQUM3QyxLQUFLLEVBQUUsSUFBSSxDQUFDLFNBQVMsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSTtpQkFDL0M7Z0JBQ0gsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxDQUFDO0lBQ3hCLENBQUM7SUFFRDs7O09BR0c7SUFDSCxrQkFBa0IsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLFFBQVE7UUFDcEMsSUFBSSxDQUFDLFVBQVUsQ0FBQywwQkFBMEIsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxRQUFRLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLE9BQU8sQ0FBQztRQUN4RixJQUFJLENBQUMsVUFBVSxDQUFDLDJCQUEyQixDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLFFBQVEsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssUUFBUSxDQUFDO1FBQzFGLElBQUksQ0FBQyxVQUFVLENBQUMsMEJBQTBCLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssUUFBUSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxPQUFPLENBQUM7UUFDeEYsSUFBSSxDQUFDLFVBQVUsQ0FBQyx5QkFBeUIsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxPQUFPLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLE9BQU8sQ0FBQztRQUN0RixJQUFJLENBQUMsVUFBVSxDQUFDLDBCQUEwQixDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLE9BQU8sSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssUUFBUSxDQUFDO1FBQ3hGLElBQUksQ0FBQyxVQUFVLENBQUMseUJBQXlCLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssT0FBTyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxPQUFPLENBQUM7UUFDdEYsSUFBSSxDQUFDLFVBQVUsQ0FBQywwQkFBMEIsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxPQUFPLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLFFBQVEsQ0FBQztRQUN4RixJQUFJLENBQUMsVUFBVSxDQUFDLDBCQUEwQixDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLE9BQU8sSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssUUFBUSxDQUFDO1FBQ3hGLElBQUksQ0FBQyxVQUFVLENBQUMseUJBQXlCLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssT0FBTyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxPQUFPLENBQUM7UUFDdEYsSUFBSSxDQUFDLFVBQVUsQ0FBQywwQkFBMEIsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxPQUFPLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLFFBQVEsQ0FBQztRQUN4RixJQUFJLENBQUMsVUFBVSxDQUFDLDBCQUEwQixDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLE9BQU8sSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssUUFBUSxDQUFDO1FBQ3hGLElBQUksQ0FBQyxVQUFVLENBQUMseUJBQXlCLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssT0FBTyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxPQUFPLENBQUM7SUFDeEYsQ0FBQztJQUVELDBDQUEwQztJQUMxQyxZQUFZO1FBQ1YsTUFBTSxZQUFZLEdBQUcsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBRWpFLElBQUksSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7WUFDNUIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsR0FBRyxLQUFLLENBQUM7UUFDbkQsQ0FBQztRQUVELElBQUksQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ3JDLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxZQUFZLENBQUM7SUFDekMsQ0FBQztJQUVELGtDQUFrQztJQUNsQyxlQUFlO1FBQ2IsdURBQXVEO1FBQ3ZELElBQUksQ0FBQyxvQkFBb0IsR0FBRyxPQUFPLENBQUM7SUFDdEMsQ0FBQztJQUVELHVEQUF1RDtJQUN2RCxlQUFlO1FBQ2IsdURBQXVEO1FBQ3ZELElBQUksQ0FBQyxvQkFBb0IsR0FBRyxNQUFNLENBQUM7SUFDckMsQ0FBQztJQUVELG1FQUFtRTtJQUNuRSxnQkFBZ0IsQ0FBQyxLQUFxQjtRQUNwQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNoQyxJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztJQUM1QixDQUFDO0lBRUQsaUJBQWlCLENBQUMsS0FBcUI7UUFDckMsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7SUFDM0IsQ0FBQztpSUF0VFUsVUFBVSxrRUF1TFgsMkJBQTJCO3FIQXZMMUIsVUFBVSwwaEJBcUZELGdCQUFnQixpRUFJaEIsZ0JBQWdCLDBFQUloQixnQkFBZ0IsOERBSWhCLGdCQUFnQiwrRkFJaEIsZ0JBQWdCLCtDQUloQixnQkFBZ0IsMExBdUV0QixtQkFBbUIsNkZBTnRCLFdBQVcsMEVDeE94Qiw2L0JBNEJBLHF5SURnQ1ksWUFBWSw4SEFIVixDQUFDLGdCQUFnQixDQUFDOzsyRkFLbkIsVUFBVTtrQkFYdEIsU0FBUzsrQkFDRSxhQUFhLG1CQUdOLHVCQUF1QixDQUFDLE1BQU0saUJBQ2hDLGlCQUFpQixDQUFDLElBQUksY0FDekIsQ0FBQyxnQkFBZ0IsQ0FBQyxZQUNwQixZQUFZLGNBQ1YsSUFBSSxXQUNQLENBQUMsWUFBWSxDQUFDOzswQkF5THBCLE1BQU07MkJBQUMsMkJBQTJCO3lDQTFKNUIsYUFBYTtzQkFBckIsS0FBSztnQkFHZSxTQUFTO3NCQUE3QixLQUFLO3VCQUFDLFlBQVk7Z0JBR08sY0FBYztzQkFBdkMsS0FBSzt1QkFBQyxpQkFBaUI7Z0JBR0csZUFBZTtzQkFBekMsS0FBSzt1QkFBQyxrQkFBa0I7Z0JBR2hCLFlBQVk7c0JBQXBCLEtBQUs7Z0JBR0csVUFBVTtzQkFBbEIsS0FBSztnQkFHRyxVQUFVO3NCQUFsQixLQUFLO2dCQUlGLFFBQVE7c0JBRFgsS0FBSztnQkFpQkcsT0FBTztzQkFBZixLQUFLO2dCQUdHLE9BQU87c0JBQWYsS0FBSztnQkFHRyxVQUFVO3NCQUFsQixLQUFLO2dCQUdHLFdBQVc7c0JBQW5CLEtBQUs7Z0JBR0csWUFBWTtzQkFBcEIsS0FBSztnQkFHRyxZQUFZO3NCQUFwQixLQUFLO2dCQUlOLFNBQVM7c0JBRFIsS0FBSzt1QkFBQyxFQUFFLFNBQVMsRUFBRSxnQkFBZ0IsRUFBRTtnQkFLdEMsaUJBQWlCO3NCQURoQixLQUFLO3VCQUFDLEVBQUUsU0FBUyxFQUFFLGdCQUFnQixFQUFFO2dCQUt0QyxvQkFBb0I7c0JBRG5CLEtBQUs7dUJBQUMsRUFBRSxTQUFTLEVBQUUsZ0JBQWdCLEVBQUU7Z0JBS3RDLGdCQUFnQjtzQkFEZixLQUFLO3VCQUFDLEVBQUUsU0FBUyxFQUFFLGdCQUFnQixFQUFFO2dCQUt0QywyQkFBMkI7c0JBRDFCLEtBQUs7dUJBQUMsRUFBRSxTQUFTLEVBQUUsZ0JBQWdCLEVBQUU7Z0JBS3RDLFdBQVc7c0JBRFYsS0FBSzt1QkFBQyxFQUFFLFNBQVMsRUFBRSxnQkFBZ0IsRUFBRTtnQkFLbEMsU0FBUztzQkFEWixLQUFLO2dCQWdCRixVQUFVO3NCQURiLEtBQUs7dUJBQUMsT0FBTztnQkFtQ1YsU0FBUztzQkFEWixLQUFLO2dCQVNJLE1BQU07c0JBQWYsTUFBTTtnQkFHaUIsV0FBVztzQkFBbEMsU0FBUzt1QkFBQyxXQUFXO2dCQU1hLFdBQVc7c0JBQTdDLFlBQVk7dUJBQUMsbUJBQW1CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQW5pbWF0aW9uRXZlbnQgfSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcbmltcG9ydCB7IENka1RyYXBGb2N1cyB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7IERpcmVjdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7IEVTQ0FQRSwgaGFzTW9kaWZpZXJLZXkgfSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEluamVjdCxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIFRlbXBsYXRlUmVmLFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBib29sZWFuQXR0cmlidXRlLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgdHJhbnNmb3JtUG9wb3ZlciB9IGZyb20gJy4vcG9wb3Zlci1hbmltYXRpb25zJztcbmltcG9ydCB7IE1UWF9QT1BPVkVSX0NPTlRFTlQsIE10eFBvcG92ZXJDb250ZW50IH0gZnJvbSAnLi9wb3BvdmVyLWNvbnRlbnQnO1xuaW1wb3J0IHtcbiAgdGhyb3dNdHhQb3BvdmVySW52YWxpZFBvc2l0aW9uRW5kLFxuICB0aHJvd010eFBvcG92ZXJJbnZhbGlkUG9zaXRpb25TdGFydCxcbn0gZnJvbSAnLi9wb3BvdmVyLWVycm9ycyc7XG5pbXBvcnQgeyBNdHhQb3BvdmVyRGVmYXVsdE9wdGlvbnMsIE10eFBvcG92ZXJQYW5lbCB9IGZyb20gJy4vcG9wb3Zlci1pbnRlcmZhY2VzJztcbmltcG9ydCB7IE10eFBvcG92ZXJQb3NpdGlvbiwgTXR4UG9wb3ZlclRyaWdnZXJFdmVudCwgUG9wb3ZlckNsb3NlUmVhc29uIH0gZnJvbSAnLi9wb3BvdmVyLXR5cGVzJztcblxuLyoqIEluamVjdGlvbiB0b2tlbiB0byBiZSB1c2VkIHRvIG92ZXJyaWRlIHRoZSBkZWZhdWx0IG9wdGlvbnMgZm9yIGBtdHgtcG9wb3ZlcmAuICovXG5leHBvcnQgY29uc3QgTVRYX1BPUE9WRVJfREVGQVVMVF9PUFRJT05TID0gbmV3IEluamVjdGlvblRva2VuPE10eFBvcG92ZXJEZWZhdWx0T3B0aW9ucz4oXG4gICdtdHgtcG9wb3Zlci1kZWZhdWx0LW9wdGlvbnMnLFxuICB7XG4gICAgcHJvdmlkZWRJbjogJ3Jvb3QnLFxuICAgIGZhY3Rvcnk6IE1UWF9QT1BPVkVSX0RFRkFVTFRfT1BUSU9OU19GQUNUT1JZLFxuICB9XG4pO1xuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIE1UWF9QT1BPVkVSX0RFRkFVTFRfT1BUSU9OU19GQUNUT1JZKCk6IE10eFBvcG92ZXJEZWZhdWx0T3B0aW9ucyB7XG4gIHJldHVybiB7XG4gICAgYmFja2Ryb3BDbGFzczogJ2Nkay1vdmVybGF5LXRyYW5zcGFyZW50LWJhY2tkcm9wJyxcbiAgfTtcbn1cblxubGV0IHBvcG92ZXJQYW5lbFVpZCA9IDA7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ210eC1wb3BvdmVyJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3BvcG92ZXIuaHRtbCcsXG4gIHN0eWxlVXJsOiAnLi9wb3BvdmVyLnNjc3MnLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgYW5pbWF0aW9uczogW3RyYW5zZm9ybVBvcG92ZXJdLFxuICBleHBvcnRBczogJ210eFBvcG92ZXInLFxuICBzdGFuZGFsb25lOiB0cnVlLFxuICBpbXBvcnRzOiBbQ2RrVHJhcEZvY3VzXSxcbn0pXG5leHBvcnQgY2xhc3MgTXR4UG9wb3ZlciBpbXBsZW1lbnRzIE10eFBvcG92ZXJQYW5lbCwgT25Jbml0LCBPbkRlc3Ryb3kge1xuICBwcml2YXRlIF9wcmV2aW91c0VsZXZhdGlvbj86IHN0cmluZztcbiAgcHJpdmF0ZSBfZWxldmF0aW9uUHJlZml4ID0gJ21hdC1lbGV2YXRpb24teic7XG5cbiAgLyoqIENvbmZpZyBvYmplY3QgdG8gYmUgcGFzc2VkIGludG8gdGhlIHBvcG92ZXIncyBjbGFzcy4gKi9cbiAgX2NsYXNzTGlzdDogeyBba2V5OiBzdHJpbmddOiBib29sZWFuIH0gPSB7fTtcblxuICAvKiogQ3VycmVudCBzdGF0ZSBvZiB0aGUgcGFuZWwgYW5pbWF0aW9uLiAqL1xuICBfcGFuZWxBbmltYXRpb25TdGF0ZTogJ3ZvaWQnIHwgJ2VudGVyJyA9ICd2b2lkJztcblxuICAvKiogRW1pdHMgd2hlbmV2ZXIgYW4gYW5pbWF0aW9uIG9uIHRoZSBwb3BvdmVyIGNvbXBsZXRlcy4gKi9cbiAgcmVhZG9ubHkgX2FuaW1hdGlvbkRvbmUgPSBuZXcgU3ViamVjdDxBbmltYXRpb25FdmVudD4oKTtcblxuICAvKiogV2hldGhlciB0aGUgcG9wb3ZlciBpcyBhbmltYXRpbmcuICovXG4gIF9pc0FuaW1hdGluZyA9IGZhbHNlO1xuXG4gIC8qKiBDbG9zaW5nIGRpc2FibGVkIG9uIHBvcG92ZXIgKi9cbiAgY2xvc2VEaXNhYmxlZCA9IGZhbHNlO1xuXG4gIC8qKiBDb25maWcgb2JqZWN0IHRvIGJlIHBhc3NlZCBpbnRvIHRoZSBwb3BvdmVyJ3MgYXJyb3cgc3R5bGUgKi9cbiAgYXJyb3dTdHlsZXM/OiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPjtcblxuICAvKiogTGF5b3V0IGRpcmVjdGlvbiBvZiB0aGUgcG9wb3Zlci4gKi9cbiAgZGlyZWN0aW9uPzogRGlyZWN0aW9uO1xuXG4gIC8qKiBDbGFzcyBvciBsaXN0IG9mIGNsYXNzZXMgdG8gYmUgYWRkZWQgdG8gdGhlIG92ZXJsYXkgcGFuZWwuICovXG4gIG92ZXJsYXlQYW5lbENsYXNzOiBzdHJpbmcgfCBzdHJpbmdbXSA9IHRoaXMuX2RlZmF1bHRPcHRpb25zLm92ZXJsYXlQYW5lbENsYXNzIHx8ICcnO1xuXG4gIC8qKiBDbGFzcyB0byBiZSBhZGRlZCB0byB0aGUgYmFja2Ryb3AgZWxlbWVudC4gKi9cbiAgQElucHV0KCkgYmFja2Ryb3BDbGFzcyA9IHRoaXMuX2RlZmF1bHRPcHRpb25zLmJhY2tkcm9wQ2xhc3M7XG5cbiAgLyoqIGFyaWEtbGFiZWwgZm9yIHRoZSBwb3BvdmVyIHBhbmVsLiAqL1xuICBASW5wdXQoJ2FyaWEtbGFiZWwnKSBhcmlhTGFiZWw/OiBzdHJpbmc7XG5cbiAgLyoqIGFyaWEtbGFiZWxsZWRieSBmb3IgdGhlIHBvcG92ZXIgcGFuZWwuICovXG4gIEBJbnB1dCgnYXJpYS1sYWJlbGxlZGJ5JykgYXJpYUxhYmVsbGVkYnk/OiBzdHJpbmc7XG5cbiAgLyoqIGFyaWEtZGVzY3JpYmVkYnkgZm9yIHRoZSBwb3BvdmVyIHBhbmVsLiAqL1xuICBASW5wdXQoJ2FyaWEtZGVzY3JpYmVkYnknKSBhcmlhRGVzY3JpYmVkYnk/OiBzdHJpbmc7XG5cbiAgLyoqIFBvcG92ZXIncyB0cmlnZ2VyIGV2ZW50LiAqL1xuICBASW5wdXQoKSB0cmlnZ2VyRXZlbnQ6IE10eFBvcG92ZXJUcmlnZ2VyRXZlbnQgPSB0aGlzLl9kZWZhdWx0T3B0aW9ucy50cmlnZ2VyRXZlbnQgPz8gJ2hvdmVyJztcblxuICAvKiogUG9wb3ZlcidzIGVudGVyIGRlbGF5LiAqL1xuICBASW5wdXQoKSBlbnRlckRlbGF5ID0gdGhpcy5fZGVmYXVsdE9wdGlvbnMuZW50ZXJEZWxheSA/PyAxMDA7XG5cbiAgLyoqIFBvcG92ZXIncyBsZWF2ZSBkZWxheS4gKi9cbiAgQElucHV0KCkgbGVhdmVEZWxheSA9IHRoaXMuX2RlZmF1bHRPcHRpb25zLmxlYXZlRGVsYXkgPz8gMTAwO1xuXG4gIC8qKiBQb3BvdmVyJ3MgcG9zaXRpb24uICovXG4gIEBJbnB1dCgpXG4gIGdldCBwb3NpdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fcG9zaXRpb247XG4gIH1cbiAgc2V0IHBvc2l0aW9uKHZhbHVlOiBNdHhQb3BvdmVyUG9zaXRpb24pIHtcbiAgICBpZiAoIVsnYmVmb3JlJywgJ2FmdGVyJywgJ2Fib3ZlJywgJ2JlbG93J10uaW5jbHVkZXModmFsdWVbMF0pKSB7XG4gICAgICB0aHJvd010eFBvcG92ZXJJbnZhbGlkUG9zaXRpb25TdGFydCgpO1xuICAgIH1cbiAgICBpZiAoIVsnYmVmb3JlJywgJ2FmdGVyJywgJ2Fib3ZlJywgJ2JlbG93JywgJ2NlbnRlciddLmluY2x1ZGVzKHZhbHVlWzFdKSkge1xuICAgICAgdGhyb3dNdHhQb3BvdmVySW52YWxpZFBvc2l0aW9uRW5kKCk7XG4gICAgfVxuICAgIHRoaXMuX3Bvc2l0aW9uID0gdmFsdWU7XG4gICAgdGhpcy5zZXRQb3NpdGlvbkNsYXNzZXMoKTtcbiAgfVxuICBwcml2YXRlIF9wb3NpdGlvbiA9IHRoaXMuX2RlZmF1bHRPcHRpb25zLnBvc2l0aW9uID8/IFsnYmVsb3cnLCAnYWZ0ZXInXTtcblxuICAvKiogUG9wb3Zlci1wYW5lbCdzIFggb2Zmc2V0LiAqL1xuICBASW5wdXQoKSB4T2Zmc2V0ID0gdGhpcy5fZGVmYXVsdE9wdGlvbnMueE9mZnNldCA/PyAwO1xuXG4gIC8qKiBQb3BvdmVyLXBhbmVsJ3MgWSBvZmZzZXQuICovXG4gIEBJbnB1dCgpIHlPZmZzZXQgPSB0aGlzLl9kZWZhdWx0T3B0aW9ucy55T2Zmc2V0ID8/IDA7XG5cbiAgLyoqIFBvcG92ZXItYXJyb3cncyB3aWR0aC4gKi9cbiAgQElucHV0KCkgYXJyb3dXaWR0aCA9IHRoaXMuX2RlZmF1bHRPcHRpb25zLmFycm93V2lkdGggPz8gMTY7XG5cbiAgLyoqIFBvcG92ZXItYXJyb3cncyBoZWlnaHQuICovXG4gIEBJbnB1dCgpIGFycm93SGVpZ2h0ID0gdGhpcy5fZGVmYXVsdE9wdGlvbnMuYXJyb3dIZWlnaHQgPz8gMTY7XG5cbiAgLyoqIFBvcG92ZXItYXJyb3cncyBYIG9mZnNldC4gKi9cbiAgQElucHV0KCkgYXJyb3dPZmZzZXRYID0gdGhpcy5fZGVmYXVsdE9wdGlvbnMuYXJyb3dPZmZzZXRYID8/IDIwO1xuXG4gIC8qKiBQb3BvdmVyLWFycm93J3MgWSBvZmZzZXQuICovXG4gIEBJbnB1dCgpIGFycm93T2Zmc2V0WSA9IHRoaXMuX2RlZmF1bHRPcHRpb25zLmFycm93T2Zmc2V0WSA/PyAyMDtcblxuICAvKiogV2hldGhlciB0aGUgcG9wb3ZlciBhcnJvdyBzaG91bGQgYmUgaGlkZGVuLiAqL1xuICBASW5wdXQoeyB0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGUgfSlcbiAgaGlkZUFycm93ID0gdGhpcy5fZGVmYXVsdE9wdGlvbnMuaGlkZUFycm93ID8/IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHBvcG92ZXIgY2FuIGJlIGNsb3NlZCB3aGVuIGNsaWNrIHRoZSBwb3BvdmVyLXBhbmVsLiAqL1xuICBASW5wdXQoeyB0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGUgfSlcbiAgY2xvc2VPblBhbmVsQ2xpY2sgPSB0aGlzLl9kZWZhdWx0T3B0aW9ucy5jbG9zZU9uUGFuZWxDbGljayA/PyBmYWxzZTtcblxuICAvKiogV2hldGhlciBwb3BvdmVyIGNhbiBiZSBjbG9zZWQgd2hlbiBjbGljayB0aGUgYmFja2Ryb3AuICovXG4gIEBJbnB1dCh7IHRyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZSB9KVxuICBjbG9zZU9uQmFja2Ryb3BDbGljayA9IHRoaXMuX2RlZmF1bHRPcHRpb25zLmNsb3NlT25CYWNrZHJvcENsaWNrID8/IHRydWU7XG5cbiAgLyoqIFdoZXRoZXIgZW5hYmxlIGZvY3VzIHRyYXAgdXNpbmcgYGNka1RyYXBGb2N1c2AuICovXG4gIEBJbnB1dCh7IHRyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZSB9KVxuICBmb2N1c1RyYXBFbmFibGVkID0gdGhpcy5fZGVmYXVsdE9wdGlvbnMuZm9jdXNUcmFwRW5hYmxlZCA/PyBmYWxzZTtcblxuICAvKiogV2hldGhlciBlbmFibGUgZm9jdXMgdHJhcCBhdXRvIGNhcHR1cmUgdXNpbmcgYGNka1RyYXBGb2N1c0F1dG9DYXB0dXJlYC4gKi9cbiAgQElucHV0KHsgdHJhbnNmb3JtOiBib29sZWFuQXR0cmlidXRlIH0pXG4gIGZvY3VzVHJhcEF1dG9DYXB0dXJlRW5hYmxlZCA9IHRoaXMuX2RlZmF1bHRPcHRpb25zLmZvY3VzVHJhcEF1dG9DYXB0dXJlRW5hYmxlZCA/PyBmYWxzZTtcblxuICAvKiogV2hldGhlciB0aGUgcG9wb3ZlciBoYXMgYSBiYWNrZHJvcC4gSXQgd2lsbCBhbHdheXMgYmUgZmFsc2UgaWYgdGhlIHRyaWdnZXIgZXZlbnQgaXMgaG92ZXIuICovXG4gIEBJbnB1dCh7IHRyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZSB9KVxuICBoYXNCYWNrZHJvcCA9IHRoaXMuX2RlZmF1bHRPcHRpb25zLmhhc0JhY2tkcm9wO1xuXG4gIC8qKiBQb3BvdmVyLXBhbmVsJ3MgZWxldmF0aW9uICgwfjI0KS4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGVsZXZhdGlvbigpOiBudW1iZXIge1xuICAgIHJldHVybiBNYXRoLm1heCgwLCBNYXRoLm1pbihNYXRoLnJvdW5kKHRoaXMuX2VsZXZhdGlvbiksIDI0KSk7XG4gIH1cbiAgc2V0IGVsZXZhdGlvbih2YWx1ZTogbnVtYmVyKSB7XG4gICAgdGhpcy5fZWxldmF0aW9uID0gdmFsdWU7XG4gIH1cbiAgcHJpdmF0ZSBfZWxldmF0aW9uID0gdGhpcy5fZGVmYXVsdE9wdGlvbnMuZWxldmF0aW9uID8/IDg7XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIHRha2VzIGNsYXNzZXMgc2V0IG9uIHRoZSBob3N0IG10eC1wb3BvdmVyIGVsZW1lbnQgYW5kIGFwcGxpZXMgdGhlbSBvbiB0aGVcbiAgICogcG9wb3ZlciB0ZW1wbGF0ZSB0aGF0IGRpc3BsYXlzIGluIHRoZSBvdmVybGF5IGNvbnRhaW5lci4gT3RoZXJ3aXNlLCBpdCdzIGRpZmZpY3VsdFxuICAgKiB0byBzdHlsZSB0aGUgY29udGFpbmluZyBwb3BvdmVyIGZyb20gb3V0c2lkZSB0aGUgY29tcG9uZW50LlxuICAgKiBAcGFyYW0gY2xhc3NlcyBsaXN0IG9mIGNsYXNzIG5hbWVzXG4gICAqL1xuICBASW5wdXQoJ2NsYXNzJylcbiAgc2V0IHBhbmVsQ2xhc3MoY2xhc3Nlczogc3RyaW5nKSB7XG4gICAgY29uc3QgcHJldmlvdXNQYW5lbENsYXNzID0gdGhpcy5fcHJldmlvdXNQYW5lbENsYXNzO1xuICAgIGNvbnN0IG5ld0NsYXNzTGlzdCA9IHsgLi4udGhpcy5fY2xhc3NMaXN0IH07XG5cbiAgICBpZiAocHJldmlvdXNQYW5lbENsYXNzICYmIHByZXZpb3VzUGFuZWxDbGFzcy5sZW5ndGgpIHtcbiAgICAgIHByZXZpb3VzUGFuZWxDbGFzcy5zcGxpdCgnICcpLmZvckVhY2goKGNsYXNzTmFtZTogc3RyaW5nKSA9PiB7XG4gICAgICAgIG5ld0NsYXNzTGlzdFtjbGFzc05hbWVdID0gZmFsc2U7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLl9wcmV2aW91c1BhbmVsQ2xhc3MgPSBjbGFzc2VzO1xuXG4gICAgaWYgKGNsYXNzZXMgJiYgY2xhc3Nlcy5sZW5ndGgpIHtcbiAgICAgIGNsYXNzZXMuc3BsaXQoJyAnKS5mb3JFYWNoKChjbGFzc05hbWU6IHN0cmluZykgPT4ge1xuICAgICAgICBuZXdDbGFzc0xpc3RbY2xhc3NOYW1lXSA9IHRydWU7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNsYXNzTmFtZSA9ICcnO1xuXG4gICAgICB0aGlzLnNldFBvc2l0aW9uQ2xhc3NlcygpO1xuICAgIH1cblxuICAgIHRoaXMuX2NsYXNzTGlzdCA9IG5ld0NsYXNzTGlzdDtcbiAgfVxuICBwcml2YXRlIF9wcmV2aW91c1BhbmVsQ2xhc3M/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIHRha2VzIGNsYXNzZXMgc2V0IG9uIHRoZSBob3N0IG10eC1wb3BvdmVyIGVsZW1lbnQgYW5kIGFwcGxpZXMgdGhlbSBvbiB0aGVcbiAgICogcG9wb3ZlciB0ZW1wbGF0ZSB0aGF0IGRpc3BsYXlzIGluIHRoZSBvdmVybGF5IGNvbnRhaW5lci4gT3RoZXJ3aXNlLCBpdCdzIGRpZmZpY3VsdFxuICAgKiB0byBzdHlsZSB0aGUgY29udGFpbmluZyBwb3BvdmVyIGZyb20gb3V0c2lkZSB0aGUgY29tcG9uZW50LlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYHBhbmVsQ2xhc3NgIGluc3RlYWQuXG4gICAqIEBicmVha2luZy1jaGFuZ2UgOC4wLjBcbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCBjbGFzc0xpc3QoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5wYW5lbENsYXNzO1xuICB9XG4gIHNldCBjbGFzc0xpc3QoY2xhc3Nlczogc3RyaW5nKSB7XG4gICAgdGhpcy5wYW5lbENsYXNzID0gY2xhc3NlcztcbiAgfVxuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIHBvcG92ZXIgaXMgY2xvc2VkLiAqL1xuICBAT3V0cHV0KCkgY2xvc2VkID0gbmV3IEV2ZW50RW1pdHRlcjxQb3BvdmVyQ2xvc2VSZWFzb24+KCk7XG5cbiAgLyoqIEBkb2NzLXByaXZhdGUgKi9cbiAgQFZpZXdDaGlsZChUZW1wbGF0ZVJlZikgdGVtcGxhdGVSZWYhOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIC8qKlxuICAgKiBQb3BvdmVyIGNvbnRlbnQgdGhhdCB3aWxsIGJlIHJlbmRlcmVkIGxhemlseS5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgQENvbnRlbnRDaGlsZChNVFhfUE9QT1ZFUl9DT05URU5UKSBsYXp5Q29udGVudD86IE10eFBvcG92ZXJDb250ZW50O1xuXG4gIHJlYWRvbmx5IHBhbmVsSWQgPSBgbXR4LXBvcG92ZXItcGFuZWwtJHtwb3BvdmVyUGFuZWxVaWQrK31gO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgcHJpdmF0ZSBfdW51c2VkTmdab25lOiBOZ1pvbmUsXG4gICAgQEluamVjdChNVFhfUE9QT1ZFUl9ERUZBVUxUX09QVElPTlMpIHByaXZhdGUgX2RlZmF1bHRPcHRpb25zOiBNdHhQb3BvdmVyRGVmYXVsdE9wdGlvbnNcbiAgKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuc2V0UG9zaXRpb25DbGFzc2VzKCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLmNsb3NlZC5jb21wbGV0ZSgpO1xuICB9XG5cbiAgLyoqIEhhbmRsZSBhIGtleWJvYXJkIGV2ZW50IGZyb20gdGhlIHBvcG92ZXIsIGRlbGVnYXRpbmcgdG8gdGhlIGFwcHJvcHJpYXRlIGFjdGlvbi4gKi9cbiAgX2hhbmRsZUtleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICBjb25zdCBrZXlDb2RlID0gZXZlbnQua2V5Q29kZTtcblxuICAgIHN3aXRjaCAoa2V5Q29kZSkge1xuICAgICAgY2FzZSBFU0NBUEU6XG4gICAgICAgIGlmICghaGFzTW9kaWZpZXJLZXkoZXZlbnQpKSB7XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICB0aGlzLmNsb3NlZC5lbWl0KCdrZXlkb3duJyk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgLyoqIENsb3NlIHBvcG92ZXIgb24gY2xpY2sgaWYgYGNsb3NlT25QYW5lbENsaWNrYCBpcyB0cnVlLiAqL1xuICBfaGFuZGxlQ2xpY2soKSB7XG4gICAgaWYgKHRoaXMuY2xvc2VPblBhbmVsQ2xpY2spIHtcbiAgICAgIHRoaXMuY2xvc2VkLmVtaXQoJ2NsaWNrJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqIERpc2FibGVzIGNsb3NlIG9mIHBvcG92ZXIgd2hlbiBsZWF2aW5nIHRyaWdnZXIgZWxlbWVudCBhbmQgbW91c2Ugb3ZlciB0aGUgcG9wb3Zlci4gKi9cbiAgX2hhbmRsZU1vdXNlT3ZlcigpIHtcbiAgICBpZiAodGhpcy50cmlnZ2VyRXZlbnQgPT09ICdob3ZlcicpIHtcbiAgICAgIHRoaXMuY2xvc2VEaXNhYmxlZCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgLyoqIEVuYWJsZXMgY2xvc2Ugb2YgcG9wb3ZlciB3aGVuIG1vdXNlIGxlYXZpbmcgcG9wb3ZlciBlbGVtZW50LiAqL1xuICBfaGFuZGxlTW91c2VMZWF2ZSgpIHtcbiAgICBpZiAodGhpcy50cmlnZ2VyRXZlbnQgPT09ICdob3ZlcicpIHtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLmNsb3NlRGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jbG9zZWQuZW1pdCgpO1xuICAgICAgfSwgdGhpcy5sZWF2ZURlbGF5KTtcbiAgICB9XG4gIH1cblxuICAvKiogU2V0cyB0aGUgY3VycmVudCBzdHlsZXMgZm9yIHRoZSBwb3BvdmVyIHRvIGFsbG93IGZvciBkeW5hbWljYWxseSBjaGFuZ2luZyBzZXR0aW5ncy4gKi9cbiAgc2V0Q3VycmVudFN0eWxlcyhwb3MgPSB0aGlzLnBvc2l0aW9uKSB7XG4gICAgY29uc3QgbGVmdCA9XG4gICAgICBwb3NbMV0gPT09ICdhZnRlcidcbiAgICAgICAgPyBgJHt0aGlzLmFycm93T2Zmc2V0WCAtIHRoaXMuYXJyb3dXaWR0aCAvIDJ9cHhgXG4gICAgICAgIDogcG9zWzFdID09PSAnY2VudGVyJ1xuICAgICAgICAgID8gYGNhbGMoNTAlIC0gJHt0aGlzLmFycm93V2lkdGggLyAyfXB4KWBcbiAgICAgICAgICA6ICcnO1xuICAgIGNvbnN0IHJpZ2h0ID0gcG9zWzFdID09PSAnYmVmb3JlJyA/IGAke3RoaXMuYXJyb3dPZmZzZXRYIC0gdGhpcy5hcnJvd1dpZHRoIC8gMn1weGAgOiAnJztcblxuICAgIGNvbnN0IGJvdHRvbSA9XG4gICAgICBwb3NbMV0gPT09ICdhYm92ZSdcbiAgICAgICAgPyBgJHt0aGlzLmFycm93T2Zmc2V0WSAtIHRoaXMuYXJyb3dIZWlnaHQgLyAyfXB4YFxuICAgICAgICA6IHBvc1sxXSA9PT0gJ2NlbnRlcidcbiAgICAgICAgICA/IGBjYWxjKDUwJSAtICR7dGhpcy5hcnJvd0hlaWdodCAvIDJ9cHgpYFxuICAgICAgICAgIDogJyc7XG4gICAgY29uc3QgdG9wID0gcG9zWzFdID09PSAnYmVsb3cnID8gYCR7dGhpcy5hcnJvd09mZnNldFkgLSB0aGlzLmFycm93SGVpZ2h0IC8gMn1weGAgOiAnJztcblxuICAgIHRoaXMuYXJyb3dTdHlsZXMgPVxuICAgICAgcG9zWzBdID09PSAnYWJvdmUnIHx8IHBvc1swXSA9PT0gJ2JlbG93J1xuICAgICAgICA/IHtcbiAgICAgICAgICAgIGxlZnQ6IHRoaXMuZGlyZWN0aW9uID09PSAnbHRyJyA/IGxlZnQgOiByaWdodCxcbiAgICAgICAgICAgIHJpZ2h0OiB0aGlzLmRpcmVjdGlvbiA9PT0gJ2x0cicgPyByaWdodCA6IGxlZnQsXG4gICAgICAgICAgfVxuICAgICAgICA6IHsgdG9wLCBib3R0b20gfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJdCdzIG5lY2Vzc2FyeSB0byBzZXQgcG9zaXRpb24tYmFzZWQgY2xhc3NlcyB0byBlbnN1cmUgdGhlIHBvcG92ZXIgcGFuZWwgYW5pbWF0aW9uXG4gICAqIGZvbGRzIG91dCBmcm9tIHRoZSBjb3JyZWN0IGRpcmVjdGlvbi5cbiAgICovXG4gIHNldFBvc2l0aW9uQ2xhc3Nlcyhwb3MgPSB0aGlzLnBvc2l0aW9uKTogdm9pZCB7XG4gICAgdGhpcy5fY2xhc3NMaXN0WydtdHgtcG9wb3Zlci1iZWZvcmUtYWJvdmUnXSA9IHBvc1swXSA9PT0gJ2JlZm9yZScgJiYgcG9zWzFdID09PSAnYWJvdmUnO1xuICAgIHRoaXMuX2NsYXNzTGlzdFsnbXR4LXBvcG92ZXItYmVmb3JlLWNlbnRlciddID0gcG9zWzBdID09PSAnYmVmb3JlJyAmJiBwb3NbMV0gPT09ICdjZW50ZXInO1xuICAgIHRoaXMuX2NsYXNzTGlzdFsnbXR4LXBvcG92ZXItYmVmb3JlLWJlbG93J10gPSBwb3NbMF0gPT09ICdiZWZvcmUnICYmIHBvc1sxXSA9PT0gJ2JlbG93JztcbiAgICB0aGlzLl9jbGFzc0xpc3RbJ210eC1wb3BvdmVyLWFmdGVyLWFib3ZlJ10gPSBwb3NbMF0gPT09ICdhZnRlcicgJiYgcG9zWzFdID09PSAnYWJvdmUnO1xuICAgIHRoaXMuX2NsYXNzTGlzdFsnbXR4LXBvcG92ZXItYWZ0ZXItY2VudGVyJ10gPSBwb3NbMF0gPT09ICdhZnRlcicgJiYgcG9zWzFdID09PSAnY2VudGVyJztcbiAgICB0aGlzLl9jbGFzc0xpc3RbJ210eC1wb3BvdmVyLWFmdGVyLWJlbG93J10gPSBwb3NbMF0gPT09ICdhZnRlcicgJiYgcG9zWzFdID09PSAnYmVsb3cnO1xuICAgIHRoaXMuX2NsYXNzTGlzdFsnbXR4LXBvcG92ZXItYWJvdmUtYmVmb3JlJ10gPSBwb3NbMF0gPT09ICdhYm92ZScgJiYgcG9zWzFdID09PSAnYmVmb3JlJztcbiAgICB0aGlzLl9jbGFzc0xpc3RbJ210eC1wb3BvdmVyLWFib3ZlLWNlbnRlciddID0gcG9zWzBdID09PSAnYWJvdmUnICYmIHBvc1sxXSA9PT0gJ2NlbnRlcic7XG4gICAgdGhpcy5fY2xhc3NMaXN0WydtdHgtcG9wb3Zlci1hYm92ZS1hZnRlciddID0gcG9zWzBdID09PSAnYWJvdmUnICYmIHBvc1sxXSA9PT0gJ2FmdGVyJztcbiAgICB0aGlzLl9jbGFzc0xpc3RbJ210eC1wb3BvdmVyLWJlbG93LWJlZm9yZSddID0gcG9zWzBdID09PSAnYmVsb3cnICYmIHBvc1sxXSA9PT0gJ2JlZm9yZSc7XG4gICAgdGhpcy5fY2xhc3NMaXN0WydtdHgtcG9wb3Zlci1iZWxvdy1jZW50ZXInXSA9IHBvc1swXSA9PT0gJ2JlbG93JyAmJiBwb3NbMV0gPT09ICdjZW50ZXInO1xuICAgIHRoaXMuX2NsYXNzTGlzdFsnbXR4LXBvcG92ZXItYmVsb3ctYWZ0ZXInXSA9IHBvc1swXSA9PT0gJ2JlbG93JyAmJiBwb3NbMV0gPT09ICdhZnRlcic7XG4gIH1cblxuICAvKiogU2V0cyB0aGUgcG9wb3Zlci1wYW5lbCdzIGVsZXZhdGlvbi4gKi9cbiAgc2V0RWxldmF0aW9uKCk6IHZvaWQge1xuICAgIGNvbnN0IG5ld0VsZXZhdGlvbiA9IGAke3RoaXMuX2VsZXZhdGlvblByZWZpeH0ke3RoaXMuZWxldmF0aW9ufWA7XG5cbiAgICBpZiAodGhpcy5fcHJldmlvdXNFbGV2YXRpb24pIHtcbiAgICAgIHRoaXMuX2NsYXNzTGlzdFt0aGlzLl9wcmV2aW91c0VsZXZhdGlvbl0gPSBmYWxzZTtcbiAgICB9XG5cbiAgICB0aGlzLl9jbGFzc0xpc3RbbmV3RWxldmF0aW9uXSA9IHRydWU7XG4gICAgdGhpcy5fcHJldmlvdXNFbGV2YXRpb24gPSBuZXdFbGV2YXRpb247XG4gIH1cblxuICAvKiogU3RhcnRzIHRoZSBlbnRlciBhbmltYXRpb24uICovXG4gIF9zdGFydEFuaW1hdGlvbigpIHtcbiAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDguMC4wIENvbWJpbmUgd2l0aCBfcmVzZXRBbmltYXRpb24uXG4gICAgdGhpcy5fcGFuZWxBbmltYXRpb25TdGF0ZSA9ICdlbnRlcic7XG4gIH1cblxuICAvKiogUmVzZXRzIHRoZSBwYW5lbCBhbmltYXRpb24gdG8gaXRzIGluaXRpYWwgc3RhdGUuICovXG4gIF9yZXNldEFuaW1hdGlvbigpIHtcbiAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDguMC4wIENvbWJpbmUgd2l0aCBfc3RhcnRBbmltYXRpb24uXG4gICAgdGhpcy5fcGFuZWxBbmltYXRpb25TdGF0ZSA9ICd2b2lkJztcbiAgfVxuXG4gIC8qKiBDYWxsYmFjayB0aGF0IGlzIGludm9rZWQgd2hlbiB0aGUgcGFuZWwgYW5pbWF0aW9uIGNvbXBsZXRlcy4gKi9cbiAgX29uQW5pbWF0aW9uRG9uZShldmVudDogQW5pbWF0aW9uRXZlbnQpIHtcbiAgICB0aGlzLl9hbmltYXRpb25Eb25lLm5leHQoZXZlbnQpO1xuICAgIHRoaXMuX2lzQW5pbWF0aW5nID0gZmFsc2U7XG4gIH1cblxuICBfb25BbmltYXRpb25TdGFydChldmVudDogQW5pbWF0aW9uRXZlbnQpIHtcbiAgICB0aGlzLl9pc0FuaW1hdGluZyA9IHRydWU7XG4gIH1cbn1cbiIsIjxuZy10ZW1wbGF0ZT5cbiAgPGRpdlxuICAgIFtpZF09XCJwYW5lbElkXCJcbiAgICBjbGFzcz1cIm10eC1wb3BvdmVyLXBhbmVsXCJcbiAgICBbY2xhc3NdPVwiX2NsYXNzTGlzdFwiXG4gICAgW2NsYXNzLm10eC1wb3BvdmVyLXBhbmVsLXdpdGhvdXQtYXJyb3ddPVwiaGlkZUFycm93XCJcbiAgICAoa2V5ZG93bik9XCJfaGFuZGxlS2V5ZG93bigkZXZlbnQpXCJcbiAgICAoY2xpY2spPVwiX2hhbmRsZUNsaWNrKClcIlxuICAgIChtb3VzZW92ZXIpPVwiX2hhbmRsZU1vdXNlT3ZlcigpXCJcbiAgICAobW91c2VsZWF2ZSk9XCJfaGFuZGxlTW91c2VMZWF2ZSgpXCJcbiAgICBbQHRyYW5zZm9ybVBvcG92ZXJdPVwiX3BhbmVsQW5pbWF0aW9uU3RhdGVcIlxuICAgIChAdHJhbnNmb3JtUG9wb3Zlci5zdGFydCk9XCJfb25BbmltYXRpb25TdGFydCgkZXZlbnQpXCJcbiAgICAoQHRyYW5zZm9ybVBvcG92ZXIuZG9uZSk9XCJfb25BbmltYXRpb25Eb25lKCRldmVudClcIlxuICAgIHRhYmluZGV4PVwiLTFcIlxuICAgIHJvbGU9XCJkaWFsb2dcIlxuICAgIFthdHRyLmFyaWEtbGFiZWxdPVwiYXJpYUxhYmVsIHx8IG51bGxcIlxuICAgIFthdHRyLmFyaWEtbGFiZWxsZWRieV09XCJhcmlhTGFiZWxsZWRieSB8fCBudWxsXCJcbiAgICBbYXR0ci5hcmlhLWRlc2NyaWJlZGJ5XT1cImFyaWFEZXNjcmliZWRieSB8fCBudWxsXCJcbiAgICBbY2RrVHJhcEZvY3VzXT1cImZvY3VzVHJhcEVuYWJsZWRcIlxuICAgIFtjZGtUcmFwRm9jdXNBdXRvQ2FwdHVyZV09XCJmb2N1c1RyYXBBdXRvQ2FwdHVyZUVuYWJsZWRcIj5cbiAgICA8ZGl2IGNsYXNzPVwibXR4LXBvcG92ZXItY29udGVudFwiPlxuICAgICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICAgIDwvZGl2PlxuICAgIEBpZiAoIWhpZGVBcnJvdykge1xuICAgICAgPGRpdiBjbGFzcz1cIm10eC1wb3BvdmVyLWRpcmVjdGlvbi1hcnJvd1wiIFtzdHlsZV09XCJhcnJvd1N0eWxlc1wiPjwvZGl2PlxuICAgIH1cbiAgPC9kaXY+XG48L25nLXRlbXBsYXRlPlxuIl19