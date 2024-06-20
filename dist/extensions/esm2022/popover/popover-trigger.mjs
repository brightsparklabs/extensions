import { isFakeMousedownFromScreenReader } from '@angular/cdk/a11y';
import { ENTER, SPACE } from '@angular/cdk/keycodes';
import { Overlay, OverlayConfig, } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Directive, EventEmitter, Inject, InjectionToken, Input, Optional, Output, inject, } from '@angular/core';
import { merge, of as observableOf, Subscription } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';
import { MtxPopover } from './popover';
import { throwMtxPopoverMissingError } from './popover-errors';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/overlay";
import * as i2 from "@angular/cdk/bidi";
import * as i3 from "@angular/cdk/a11y";
/** Injection token that determines the scroll handling while the popover is open. */
export const MTX_POPOVER_SCROLL_STRATEGY = new InjectionToken('mtx-popover-scroll-strategy', {
    providedIn: 'root',
    factory: () => {
        const overlay = inject(Overlay);
        return () => overlay.scrollStrategies.reposition();
    },
});
/** @docs-private */
export function MTX_POPOVER_SCROLL_STRATEGY_FACTORY(overlay) {
    return () => overlay.scrollStrategies.reposition();
}
/** @docs-private */
export const MTX_POPOVER_SCROLL_STRATEGY_FACTORY_PROVIDER = {
    provide: MTX_POPOVER_SCROLL_STRATEGY,
    deps: [Overlay],
    useFactory: MTX_POPOVER_SCROLL_STRATEGY_FACTORY,
};
/**
 * This directive is intended to be used in conjunction with an `mtx-popover` tag. It is
 * responsible for toggling the display of the provided popover instance.
 */
export class MtxPopoverTrigger {
    /** References the popover instance that the trigger is associated with. */
    get popover() {
        return this._popover;
    }
    set popover(popover) {
        if (popover === this._popover) {
            return;
        }
        this._popover = popover;
        this._popoverCloseSubscription.unsubscribe();
        if (popover) {
            this._popoverCloseSubscription = popover.closed.subscribe((reason) => {
                this._destroyPopover(reason);
            });
        }
    }
    constructor(_overlay, _elementRef, _viewContainerRef, scrollStrategy, _dir, _changeDetectorRef, _focusMonitor) {
        this._overlay = _overlay;
        this._elementRef = _elementRef;
        this._viewContainerRef = _viewContainerRef;
        this._dir = _dir;
        this._changeDetectorRef = _changeDetectorRef;
        this._focusMonitor = _focusMonitor;
        this._overlayRef = null;
        this._popoverOpen = false;
        this._halt = false;
        this._positionSubscription = Subscription.EMPTY;
        this._popoverCloseSubscription = Subscription.EMPTY;
        this._closingActionsSubscription = Subscription.EMPTY;
        // Tracking input type is necessary so it's possible to only auto-focus
        // the first item of the list when the popover is opened via the keyboard
        this._openedBy = undefined;
        /** Event emitted when the associated popover is opened. */
        this.popoverOpened = new EventEmitter();
        /** Event emitted when the associated popover is closed. */
        this.popoverClosed = new EventEmitter();
        this._scrollStrategy = scrollStrategy;
    }
    ngAfterContentInit() {
        this._checkPopover();
        this._setCurrentConfig();
    }
    ngOnDestroy() {
        if (this._overlayRef) {
            this._overlayRef.dispose();
            this._overlayRef = null;
        }
        this._positionSubscription.unsubscribe();
        this._popoverCloseSubscription.unsubscribe();
        this._closingActionsSubscription.unsubscribe();
    }
    _setCurrentConfig() {
        if (this.triggerEvent) {
            this.popover.triggerEvent = this.triggerEvent;
        }
        this.popover.setCurrentStyles();
    }
    /** Whether the popover is open. */
    get popoverOpen() {
        return this._popoverOpen;
    }
    /** The text direction of the containing app. */
    get dir() {
        return this._dir && this._dir.value === 'rtl' ? 'rtl' : 'ltr';
    }
    /** Handles mouse click on the trigger. */
    _handleClick(event) {
        if (this.popover.triggerEvent === 'click') {
            this.togglePopover();
        }
    }
    /** Handles mouse enter on the trigger. */
    _handleMouseEnter(event) {
        this._halt = false;
        if (this.popover.triggerEvent === 'hover') {
            this._mouseoverTimer = setTimeout(() => {
                this.openPopover();
            }, this.popover.enterDelay);
        }
    }
    /** Handles mouse leave on the trigger. */
    _handleMouseLeave(event) {
        if (this.popover.triggerEvent === 'hover') {
            if (this._mouseoverTimer) {
                clearTimeout(this._mouseoverTimer);
                this._mouseoverTimer = null;
            }
            if (this._popoverOpen) {
                setTimeout(() => {
                    if (!this.popover.closeDisabled) {
                        this.closePopover();
                    }
                }, this.popover.leaveDelay);
            }
            else {
                this._halt = true;
            }
        }
    }
    /** Handles mouse presses on the trigger. */
    _handleMousedown(event) {
        if (!isFakeMousedownFromScreenReader(event)) {
            // Since right or middle button clicks won't trigger the `click` event,
            // we shouldn't consider the popover as opened by mouse in those cases.
            this._openedBy = event.button === 0 ? 'mouse' : undefined;
        }
    }
    /** Handles key presses on the trigger. */
    _handleKeydown(event) {
        const keyCode = event.keyCode;
        // Pressing enter on the trigger will trigger the click handler later.
        if (keyCode === ENTER || keyCode === SPACE) {
            this._openedBy = 'keyboard';
        }
    }
    /** Toggles the popover between the open and closed states. */
    togglePopover() {
        return this._popoverOpen ? this.closePopover() : this.openPopover();
    }
    /** Opens the popover. */
    openPopover() {
        if (this._popoverOpen || this._halt) {
            return;
        }
        this._checkPopover();
        const overlayRef = this._createOverlay();
        const overlayConfig = overlayRef.getConfig();
        this._setPosition(overlayConfig.positionStrategy);
        if (this.popover.triggerEvent === 'click') {
            overlayConfig.hasBackdrop = this.popover.hasBackdrop ?? true;
        }
        overlayRef.attach(this._getPortal());
        if (this.popover.lazyContent) {
            this.popover.lazyContent.attach(this.popoverData);
        }
        this._closingActionsSubscription = this._popoverClosingActions().subscribe(() => this.closePopover());
        this._initPopover();
        if (this.popover instanceof MtxPopover) {
            this.popover._startAnimation();
        }
    }
    /** Closes the popover. */
    closePopover() {
        this.popover.closed.emit();
    }
    /**
     * Focuses the popover trigger.
     * @param origin Source of the popover trigger's focus.
     */
    focus(origin, options) {
        if (this._focusMonitor && origin) {
            this._focusMonitor.focusVia(this._elementRef, origin, options);
        }
        else {
            this._elementRef.nativeElement.focus(options);
        }
    }
    /** Removes the popover from the DOM. */
    _destroyPopover(reason) {
        if (!this._overlayRef || !this.popoverOpen) {
            return;
        }
        // Clear the timeout for hover event.
        if (this._mouseoverTimer) {
            clearTimeout(this._mouseoverTimer);
            this._mouseoverTimer = null;
        }
        const popover = this.popover;
        this._closingActionsSubscription.unsubscribe();
        this._overlayRef.detach();
        this._openedBy = undefined;
        if (popover instanceof MtxPopover) {
            popover._resetAnimation();
            if (popover.lazyContent) {
                // Wait for the exit animation to finish before detaching the content.
                popover._animationDone
                    .pipe(filter(event => event.toState === 'void'), take(1), 
                // Interrupt if the content got re-attached.
                takeUntil(popover.lazyContent._attached))
                    .subscribe({
                    next: () => popover.lazyContent.detach(),
                    // No matter whether the content got re-attached, reset the popover.
                    complete: () => this._setIsPopoverOpen(false),
                });
            }
            else {
                this._setIsPopoverOpen(false);
            }
        }
        else {
            this._setIsPopoverOpen(false);
            popover.lazyContent?.detach();
        }
    }
    /**
     * This method sets the popover state to open.
     */
    _initPopover() {
        this.popover.direction = this.dir;
        this.popover.setElevation();
        this._setIsPopoverOpen(true);
    }
    // set state rather than toggle to support triggers sharing a popover
    _setIsPopoverOpen(isOpen) {
        if (isOpen !== this._popoverOpen) {
            this._popoverOpen = isOpen;
            this._popoverOpen ? this.popoverOpened.emit() : this.popoverClosed.emit();
            this._changeDetectorRef.markForCheck();
        }
    }
    /**
     * This method checks that a valid instance of MdPopover has been passed into
     * `mtxPopoverTriggerFor`. If not, an exception is thrown.
     */
    _checkPopover() {
        if (!this.popover) {
            throwMtxPopoverMissingError();
        }
    }
    /**
     * This method creates the overlay from the provided popover's template and saves its
     * OverlayRef so that it can be attached to the DOM when openPopover is called.
     */
    _createOverlay() {
        if (!this._overlayRef) {
            const config = this._getOverlayConfig();
            this._subscribeToPositions(config.positionStrategy);
            this._overlayRef = this._overlay.create(config);
        }
        else {
            const overlayConfig = this._overlayRef.getConfig();
            const positionStrategy = overlayConfig.positionStrategy;
            positionStrategy.setOrigin(this._getTargetElement());
        }
        return this._overlayRef;
    }
    /**
     * This method builds the configuration object needed to create the overlay, the OverlayConfig.
     * @returns OverlayConfig
     */
    _getOverlayConfig() {
        return new OverlayConfig({
            positionStrategy: this._overlay
                .position()
                .flexibleConnectedTo(this._getTargetElement())
                .withLockedPosition()
                .withGrowAfterOpen()
                .withTransformOriginOn('.mtx-popover-panel'),
            backdropClass: this.popover.backdropClass || 'cdk-overlay-transparent-backdrop',
            panelClass: this.popover.overlayPanelClass,
            scrollStrategy: this._scrollStrategy(),
            direction: this._dir,
        });
    }
    _getTargetElement() {
        if (this.targetElement) {
            return this.targetElement.elementRef;
        }
        return this._elementRef;
    }
    /**
     * Listens to changes in the position of the overlay and sets the correct classes
     * on the popover based on the new position. This ensures the animation origin is always
     * correct, even if a fallback position is used for the overlay.
     */
    _subscribeToPositions(position) {
        this._positionSubscription = position.positionChanges.subscribe(change => {
            const posX = change.connectionPair.overlayX === 'start'
                ? 'after'
                : change.connectionPair.overlayX === 'end'
                    ? 'before'
                    : 'center';
            const posY = change.connectionPair.overlayY === 'top'
                ? 'below'
                : change.connectionPair.overlayY === 'bottom'
                    ? 'above'
                    : 'center';
            const pos = this.popover.position[0] === 'above' || this.popover.position[0] === 'below'
                ? [posY, posX]
                : [posX, posY];
            // required for ChangeDetectionStrategy.OnPush
            this._changeDetectorRef.markForCheck();
            this.popover.setCurrentStyles(pos);
            this.popover.setPositionClasses(pos);
        });
    }
    /**
     * Sets the appropriate positions on a position strategy
     * so the overlay connects with the trigger correctly.
     * @param positionStrategy Strategy whose position to update.
     */
    _setPosition(positionStrategy) {
        const [originX, origin2ndX, origin3rdX] = this.popover.position[0] === 'before' || this.popover.position[1] === 'after'
            ? ['start', 'center', 'end']
            : this.popover.position[0] === 'after' || this.popover.position[1] === 'before'
                ? ['end', 'center', 'start']
                : ['center', 'start', 'end'];
        const [originY, origin2ndY, origin3rdY] = this.popover.position[0] === 'above' || this.popover.position[1] === 'below'
            ? ['top', 'center', 'bottom']
            : this.popover.position[0] === 'below' || this.popover.position[1] === 'above'
                ? ['bottom', 'center', 'top']
                : ['center', 'top', 'bottom'];
        const [overlayX, overlayFallbackX] = this.popover.position[0] === 'below' || this.popover.position[0] === 'above'
            ? [originX, originX]
            : this.popover.position[0] === 'before'
                ? ['end', 'start']
                : ['start', 'end'];
        const [overlayY, overlayFallbackY] = this.popover.position[0] === 'before' || this.popover.position[0] === 'after'
            ? [originY, originY]
            : this.popover.position[0] === 'below'
                ? ['top', 'bottom']
                : ['bottom', 'top'];
        const originFallbackX = overlayX;
        const originFallbackY = overlayY;
        const offsetX = this.popover.xOffset && !isNaN(Number(this.popover.xOffset))
            ? Number(this.dir === 'ltr' ? this.popover.xOffset : -this.popover.xOffset)
            : 0;
        const offsetY = this.popover.yOffset && !isNaN(Number(this.popover.yOffset))
            ? Number(this.popover.yOffset)
            : 0;
        let positions = [{ originX, originY, overlayX, overlayY }];
        if (this.popover.position[0] === 'above' || this.popover.position[0] === 'below') {
            positions = [
                { originX, originY, overlayX, overlayY, offsetY },
                { originX: origin2ndX, originY, overlayX: origin2ndX, overlayY, offsetY },
                { originX: origin3rdX, originY, overlayX: origin3rdX, overlayY, offsetY },
                {
                    originX,
                    originY: originFallbackY,
                    overlayX,
                    overlayY: overlayFallbackY,
                    offsetY: -offsetY,
                },
                {
                    originX: origin2ndX,
                    originY: originFallbackY,
                    overlayX: origin2ndX,
                    overlayY: overlayFallbackY,
                    offsetY: -offsetY,
                },
                {
                    originX: origin3rdX,
                    originY: originFallbackY,
                    overlayX: origin3rdX,
                    overlayY: overlayFallbackY,
                    offsetY: -offsetY,
                },
            ];
        }
        if (this.popover.position[0] === 'before' || this.popover.position[0] === 'after') {
            positions = [
                { originX, originY, overlayX, overlayY, offsetX },
                { originX, originY: origin2ndY, overlayX, overlayY: origin2ndY, offsetX },
                { originX, originY: origin3rdY, overlayX, overlayY: origin3rdY, offsetX },
                {
                    originX: originFallbackX,
                    originY,
                    overlayX: overlayFallbackX,
                    overlayY,
                    offsetX: -offsetX,
                },
                {
                    originX: originFallbackX,
                    originY: origin2ndY,
                    overlayX: overlayFallbackX,
                    overlayY: origin2ndY,
                    offsetX: -offsetX,
                },
                {
                    originX: originFallbackX,
                    originY: origin3rdY,
                    overlayX: overlayFallbackX,
                    overlayY: origin3rdY,
                    offsetX: -offsetX,
                },
            ];
        }
        positionStrategy
            .withPositions(positions)
            .withDefaultOffsetX(offsetX)
            .withDefaultOffsetY(offsetY);
    }
    /** Returns a stream that emits whenever an action that should close the popover occurs. */
    _popoverClosingActions() {
        const backdrop = this.popover.triggerEvent === 'click' && this.popover.closeOnBackdropClick === true
            ? this._overlayRef.backdropClick()
            : observableOf();
        const detachments = this._overlayRef.detachments();
        return merge(backdrop, detachments);
    }
    /** Gets the portal that should be attached to the overlay. */
    _getPortal() {
        // Note that we can avoid this check by keeping the portal on the popover panel.
        // While it would be cleaner, we'd have to introduce another required method on
        // `MtxPopoverPanel`, making it harder to consume.
        if (!this._portal || this._portal.templateRef !== this.popover.templateRef) {
            this._portal = new TemplatePortal(this.popover.templateRef, this._viewContainerRef);
        }
        return this._portal;
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxPopoverTrigger, deps: [{ token: i1.Overlay }, { token: i0.ElementRef }, { token: i0.ViewContainerRef }, { token: MTX_POPOVER_SCROLL_STRATEGY }, { token: i2.Directionality, optional: true }, { token: i0.ChangeDetectorRef }, { token: i3.FocusMonitor }], target: i0.ɵɵFactoryTarget.Directive }); }
    /** @nocollapse */ static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.0.1", type: MtxPopoverTrigger, isStandalone: true, selector: "[mtx-popover-trigger-for], [mtxPopoverTriggerFor]", inputs: { popover: ["mtxPopoverTriggerFor", "popover"], popoverData: ["mtxPopoverTriggerData", "popoverData"], targetElement: ["mtxPopoverTargetAt", "targetElement"], triggerEvent: ["mtxPopoverTriggerOn", "triggerEvent"] }, outputs: { popoverOpened: "popoverOpened", popoverClosed: "popoverClosed" }, host: { attributes: { "aria-haspopup": "true" }, listeners: { "click": "_handleClick($event)", "mouseenter": "_handleMouseEnter($event)", "mouseleave": "_handleMouseLeave($event)", "mousedown": "_handleMousedown($event)", "keydown": "_handleKeydown($event)" }, properties: { "attr.aria-expanded": "popoverOpen", "attr.aria-controls": "popoverOpen ? popover.panelId : null" } }, exportAs: ["mtxPopoverTrigger"], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxPopoverTrigger, decorators: [{
            type: Directive,
            args: [{
                    selector: '[mtx-popover-trigger-for], [mtxPopoverTriggerFor]',
                    exportAs: 'mtxPopoverTrigger',
                    host: {
                        'aria-haspopup': 'true',
                        '[attr.aria-expanded]': 'popoverOpen',
                        '[attr.aria-controls]': 'popoverOpen ? popover.panelId : null',
                        '(click)': '_handleClick($event)',
                        '(mouseenter)': '_handleMouseEnter($event)',
                        '(mouseleave)': '_handleMouseLeave($event)',
                        '(mousedown)': '_handleMousedown($event)',
                        '(keydown)': '_handleKeydown($event)',
                    },
                    standalone: true,
                }]
        }], ctorParameters: () => [{ type: i1.Overlay }, { type: i0.ElementRef }, { type: i0.ViewContainerRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MTX_POPOVER_SCROLL_STRATEGY]
                }] }, { type: i2.Directionality, decorators: [{
                    type: Optional
                }] }, { type: i0.ChangeDetectorRef }, { type: i3.FocusMonitor }], propDecorators: { popover: [{
                type: Input,
                args: ['mtxPopoverTriggerFor']
            }], popoverData: [{
                type: Input,
                args: ['mtxPopoverTriggerData']
            }], targetElement: [{
                type: Input,
                args: ['mtxPopoverTargetAt']
            }], triggerEvent: [{
                type: Input,
                args: ['mtxPopoverTriggerOn']
            }], popoverOpened: [{
                type: Output
            }], popoverClosed: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wb3Zlci10cmlnZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvZXh0ZW5zaW9ucy9wb3BvdmVyL3BvcG92ZXItdHJpZ2dlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQTZCLCtCQUErQixFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFFL0YsT0FBTyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUNyRCxPQUFPLEVBSUwsT0FBTyxFQUNQLGFBQWEsR0FJZCxNQUFNLHNCQUFzQixDQUFDO0FBQzlCLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUNyRCxPQUFPLEVBR0wsU0FBUyxFQUVULFlBQVksRUFDWixNQUFNLEVBQ04sY0FBYyxFQUNkLEtBQUssRUFFTCxRQUFRLEVBQ1IsTUFBTSxFQUVOLE1BQU0sR0FDUCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsS0FBSyxFQUFFLEVBQUUsSUFBSSxZQUFZLEVBQUUsWUFBWSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQy9ELE9BQU8sRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3pELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFDdkMsT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0sa0JBQWtCLENBQUM7Ozs7O0FBVS9ELHFGQUFxRjtBQUNyRixNQUFNLENBQUMsTUFBTSwyQkFBMkIsR0FBRyxJQUFJLGNBQWMsQ0FDM0QsNkJBQTZCLEVBQzdCO0lBQ0UsVUFBVSxFQUFFLE1BQU07SUFDbEIsT0FBTyxFQUFFLEdBQUcsRUFBRTtRQUNaLE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNoQyxPQUFPLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFV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LCBGb2N1c09yaWdpbiwgaXNGYWtlTW91c2Vkb3duRnJvbVNjcmVlblJlYWRlciB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7IERpcmVjdGlvbiwgRGlyZWN0aW9uYWxpdHkgfSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQgeyBFTlRFUiwgU1BBQ0UgfSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHtcbiAgQ29ubmVjdGVkUG9zaXRpb24sXG4gIEZsZXhpYmxlQ29ubmVjdGVkUG9zaXRpb25TdHJhdGVneSxcbiAgSG9yaXpvbnRhbENvbm5lY3Rpb25Qb3MsXG4gIE92ZXJsYXksXG4gIE92ZXJsYXlDb25maWcsXG4gIE92ZXJsYXlSZWYsXG4gIFNjcm9sbFN0cmF0ZWd5LFxuICBWZXJ0aWNhbENvbm5lY3Rpb25Qb3MsXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7IFRlbXBsYXRlUG9ydGFsIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5pbXBvcnQge1xuICBBZnRlckNvbnRlbnRJbml0LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEluamVjdCxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIElucHV0LFxuICBPbkRlc3Ryb3ksXG4gIE9wdGlvbmFsLFxuICBPdXRwdXQsXG4gIFZpZXdDb250YWluZXJSZWYsXG4gIGluamVjdCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBtZXJnZSwgb2YgYXMgb2JzZXJ2YWJsZU9mLCBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGZpbHRlciwgdGFrZSwgdGFrZVVudGlsIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgTXR4UG9wb3ZlciB9IGZyb20gJy4vcG9wb3Zlcic7XG5pbXBvcnQgeyB0aHJvd010eFBvcG92ZXJNaXNzaW5nRXJyb3IgfSBmcm9tICcuL3BvcG92ZXItZXJyb3JzJztcbmltcG9ydCB7IE10eFBvcG92ZXJQYW5lbCB9IGZyb20gJy4vcG9wb3Zlci1pbnRlcmZhY2VzJztcbmltcG9ydCB7IE10eFBvcG92ZXJUYXJnZXQgfSBmcm9tICcuL3BvcG92ZXItdGFyZ2V0JztcbmltcG9ydCB7XG4gIE10eFBvcG92ZXJQb3NpdGlvbixcbiAgTXR4UG9wb3ZlclBvc2l0aW9uU3RhcnQsXG4gIE10eFBvcG92ZXJUcmlnZ2VyRXZlbnQsXG4gIFBvcG92ZXJDbG9zZVJlYXNvbixcbn0gZnJvbSAnLi9wb3BvdmVyLXR5cGVzJztcblxuLyoqIEluamVjdGlvbiB0b2tlbiB0aGF0IGRldGVybWluZXMgdGhlIHNjcm9sbCBoYW5kbGluZyB3aGlsZSB0aGUgcG9wb3ZlciBpcyBvcGVuLiAqL1xuZXhwb3J0IGNvbnN0IE1UWF9QT1BPVkVSX1NDUk9MTF9TVFJBVEVHWSA9IG5ldyBJbmplY3Rpb25Ub2tlbjwoKSA9PiBTY3JvbGxTdHJhdGVneT4oXG4gICdtdHgtcG9wb3Zlci1zY3JvbGwtc3RyYXRlZ3knLFxuICB7XG4gICAgcHJvdmlkZWRJbjogJ3Jvb3QnLFxuICAgIGZhY3Rvcnk6ICgpID0+IHtcbiAgICAgIGNvbnN0IG92ZXJsYXkgPSBpbmplY3QoT3ZlcmxheSk7XG4gICAgICByZXR1cm4gKCkgPT4gb3ZlcmxheS5zY3JvbGxTdHJhdGVnaWVzLnJlcG9zaXRpb24oKTtcbiAgICB9LFxuICB9XG4pO1xuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIE1UWF9QT1BPVkVSX1NDUk9MTF9TVFJBVEVHWV9GQUNUT1JZKG92ZXJsYXk6IE92ZXJsYXkpOiAoKSA9PiBTY3JvbGxTdHJhdGVneSB7XG4gIHJldHVybiAoKSA9PiBvdmVybGF5LnNjcm9sbFN0cmF0ZWdpZXMucmVwb3NpdGlvbigpO1xufVxuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGNvbnN0IE1UWF9QT1BPVkVSX1NDUk9MTF9TVFJBVEVHWV9GQUNUT1JZX1BST1ZJREVSID0ge1xuICBwcm92aWRlOiBNVFhfUE9QT1ZFUl9TQ1JPTExfU1RSQVRFR1ksXG4gIGRlcHM6IFtPdmVybGF5XSxcbiAgdXNlRmFjdG9yeTogTVRYX1BPUE9WRVJfU0NST0xMX1NUUkFURUdZX0ZBQ1RPUlksXG59O1xuXG4vKipcbiAqIFRoaXMgZGlyZWN0aXZlIGlzIGludGVuZGVkIHRvIGJlIHVzZWQgaW4gY29uanVuY3Rpb24gd2l0aCBhbiBgbXR4LXBvcG92ZXJgIHRhZy4gSXQgaXNcbiAqIHJlc3BvbnNpYmxlIGZvciB0b2dnbGluZyB0aGUgZGlzcGxheSBvZiB0aGUgcHJvdmlkZWQgcG9wb3ZlciBpbnN0YW5jZS5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW210eC1wb3BvdmVyLXRyaWdnZXItZm9yXSwgW210eFBvcG92ZXJUcmlnZ2VyRm9yXScsXG4gIGV4cG9ydEFzOiAnbXR4UG9wb3ZlclRyaWdnZXInLFxuICBob3N0OiB7XG4gICAgJ2FyaWEtaGFzcG9wdXAnOiAndHJ1ZScsXG4gICAgJ1thdHRyLmFyaWEtZXhwYW5kZWRdJzogJ3BvcG92ZXJPcGVuJyxcbiAgICAnW2F0dHIuYXJpYS1jb250cm9sc10nOiAncG9wb3Zlck9wZW4gPyBwb3BvdmVyLnBhbmVsSWQgOiBudWxsJyxcbiAgICAnKGNsaWNrKSc6ICdfaGFuZGxlQ2xpY2soJGV2ZW50KScsXG4gICAgJyhtb3VzZWVudGVyKSc6ICdfaGFuZGxlTW91c2VFbnRlcigkZXZlbnQpJyxcbiAgICAnKG1vdXNlbGVhdmUpJzogJ19oYW5kbGVNb3VzZUxlYXZlKCRldmVudCknLFxuICAgICcobW91c2Vkb3duKSc6ICdfaGFuZGxlTW91c2Vkb3duKCRldmVudCknLFxuICAgICcoa2V5ZG93biknOiAnX2hhbmRsZUtleWRvd24oJGV2ZW50KScsXG4gIH0sXG4gIHN0YW5kYWxvbmU6IHRydWUsXG59KVxuZXhwb3J0IGNsYXNzIE10eFBvcG92ZXJUcmlnZ2VyIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCwgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBfcG9ydGFsPzogVGVtcGxhdGVQb3J0YWw7XG4gIHByaXZhdGUgX292ZXJsYXlSZWY6IE92ZXJsYXlSZWYgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBfcG9wb3Zlck9wZW4gPSBmYWxzZTtcbiAgcHJpdmF0ZSBfaGFsdCA9IGZhbHNlO1xuICBwcml2YXRlIF9wb3NpdGlvblN1YnNjcmlwdGlvbiA9IFN1YnNjcmlwdGlvbi5FTVBUWTtcbiAgcHJpdmF0ZSBfcG9wb3ZlckNsb3NlU3Vic2NyaXB0aW9uID0gU3Vic2NyaXB0aW9uLkVNUFRZO1xuICBwcml2YXRlIF9jbG9zaW5nQWN0aW9uc1N1YnNjcmlwdGlvbiA9IFN1YnNjcmlwdGlvbi5FTVBUWTtcbiAgcHJpdmF0ZSBfc2Nyb2xsU3RyYXRlZ3khOiAoKSA9PiBTY3JvbGxTdHJhdGVneTtcbiAgcHJpdmF0ZSBfbW91c2VvdmVyVGltZXI6IGFueTtcblxuICAvLyBUcmFja2luZyBpbnB1dCB0eXBlIGlzIG5lY2Vzc2FyeSBzbyBpdCdzIHBvc3NpYmxlIHRvIG9ubHkgYXV0by1mb2N1c1xuICAvLyB0aGUgZmlyc3QgaXRlbSBvZiB0aGUgbGlzdCB3aGVuIHRoZSBwb3BvdmVyIGlzIG9wZW5lZCB2aWEgdGhlIGtleWJvYXJkXG4gIF9vcGVuZWRCeTogRXhjbHVkZTxGb2N1c09yaWdpbiwgJ3Byb2dyYW0nIHwgbnVsbD4gfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG5cbiAgLyoqIFJlZmVyZW5jZXMgdGhlIHBvcG92ZXIgaW5zdGFuY2UgdGhhdCB0aGUgdHJpZ2dlciBpcyBhc3NvY2lhdGVkIHdpdGguICovXG4gIEBJbnB1dCgnbXR4UG9wb3ZlclRyaWdnZXJGb3InKVxuICBnZXQgcG9wb3ZlcigpIHtcbiAgICByZXR1cm4gdGhpcy5fcG9wb3ZlcjtcbiAgfVxuICBzZXQgcG9wb3Zlcihwb3BvdmVyOiBNdHhQb3BvdmVyUGFuZWwpIHtcbiAgICBpZiAocG9wb3ZlciA9PT0gdGhpcy5fcG9wb3Zlcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX3BvcG92ZXIgPSBwb3BvdmVyO1xuICAgIHRoaXMuX3BvcG92ZXJDbG9zZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuXG4gICAgaWYgKHBvcG92ZXIpIHtcbiAgICAgIHRoaXMuX3BvcG92ZXJDbG9zZVN1YnNjcmlwdGlvbiA9IHBvcG92ZXIuY2xvc2VkLnN1YnNjcmliZSgocmVhc29uOiBQb3BvdmVyQ2xvc2VSZWFzb24pID0+IHtcbiAgICAgICAgdGhpcy5fZGVzdHJveVBvcG92ZXIocmVhc29uKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICBwcml2YXRlIF9wb3BvdmVyITogTXR4UG9wb3ZlclBhbmVsO1xuXG4gIC8qKiBEYXRhIHRvIGJlIHBhc3NlZCBhbG9uZyB0byBhbnkgbGF6aWx5LXJlbmRlcmVkIGNvbnRlbnQuICovXG4gIEBJbnB1dCgnbXR4UG9wb3ZlclRyaWdnZXJEYXRhJykgcG9wb3ZlckRhdGE6IGFueTtcblxuICAvKiogUmVmZXJlbmNlcyB0aGUgcG9wb3ZlciB0YXJnZXQgaW5zdGFuY2UgdGhhdCB0aGUgdHJpZ2dlciBpcyBhc3NvY2lhdGVkIHdpdGguICovXG4gIEBJbnB1dCgnbXR4UG9wb3ZlclRhcmdldEF0JykgdGFyZ2V0RWxlbWVudD86IE10eFBvcG92ZXJUYXJnZXQ7XG5cbiAgLyoqIFBvcG92ZXIgdHJpZ2dlciBldmVudCAqL1xuICBASW5wdXQoJ210eFBvcG92ZXJUcmlnZ2VyT24nKSB0cmlnZ2VyRXZlbnQ/OiBNdHhQb3BvdmVyVHJpZ2dlckV2ZW50O1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIGFzc29jaWF0ZWQgcG9wb3ZlciBpcyBvcGVuZWQuICovXG4gIEBPdXRwdXQoKSBwb3BvdmVyT3BlbmVkID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIGFzc29jaWF0ZWQgcG9wb3ZlciBpcyBjbG9zZWQuICovXG4gIEBPdXRwdXQoKSBwb3BvdmVyQ2xvc2VkID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX292ZXJsYXk6IE92ZXJsYXksXG4gICAgcHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgcHJpdmF0ZSBfdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZixcbiAgICBASW5qZWN0KE1UWF9QT1BPVkVSX1NDUk9MTF9TVFJBVEVHWSkgc2Nyb2xsU3RyYXRlZ3k6IGFueSxcbiAgICBAT3B0aW9uYWwoKSBwcml2YXRlIF9kaXI6IERpcmVjdGlvbmFsaXR5LFxuICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcml2YXRlIF9mb2N1c01vbml0b3I/OiBGb2N1c01vbml0b3JcbiAgKSB7XG4gICAgdGhpcy5fc2Nyb2xsU3RyYXRlZ3kgPSBzY3JvbGxTdHJhdGVneTtcbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICB0aGlzLl9jaGVja1BvcG92ZXIoKTtcbiAgICB0aGlzLl9zZXRDdXJyZW50Q29uZmlnKCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5fb3ZlcmxheVJlZikge1xuICAgICAgdGhpcy5fb3ZlcmxheVJlZi5kaXNwb3NlKCk7XG4gICAgICB0aGlzLl9vdmVybGF5UmVmID0gbnVsbDtcbiAgICB9XG5cbiAgICB0aGlzLl9wb3NpdGlvblN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIHRoaXMuX3BvcG92ZXJDbG9zZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIHRoaXMuX2Nsb3NpbmdBY3Rpb25zU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICBwcml2YXRlIF9zZXRDdXJyZW50Q29uZmlnKCkge1xuICAgIGlmICh0aGlzLnRyaWdnZXJFdmVudCkge1xuICAgICAgdGhpcy5wb3BvdmVyLnRyaWdnZXJFdmVudCA9IHRoaXMudHJpZ2dlckV2ZW50O1xuICAgIH1cblxuICAgIHRoaXMucG9wb3Zlci5zZXRDdXJyZW50U3R5bGVzKCk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgcG9wb3ZlciBpcyBvcGVuLiAqL1xuICBnZXQgcG9wb3Zlck9wZW4oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3BvcG92ZXJPcGVuO1xuICB9XG5cbiAgLyoqIFRoZSB0ZXh0IGRpcmVjdGlvbiBvZiB0aGUgY29udGFpbmluZyBhcHAuICovXG4gIGdldCBkaXIoKTogRGlyZWN0aW9uIHtcbiAgICByZXR1cm4gdGhpcy5fZGlyICYmIHRoaXMuX2Rpci52YWx1ZSA9PT0gJ3J0bCcgPyAncnRsJyA6ICdsdHInO1xuICB9XG5cbiAgLyoqIEhhbmRsZXMgbW91c2UgY2xpY2sgb24gdGhlIHRyaWdnZXIuICovXG4gIF9oYW5kbGVDbGljayhldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnBvcG92ZXIudHJpZ2dlckV2ZW50ID09PSAnY2xpY2snKSB7XG4gICAgICB0aGlzLnRvZ2dsZVBvcG92ZXIoKTtcbiAgICB9XG4gIH1cblxuICAvKiogSGFuZGxlcyBtb3VzZSBlbnRlciBvbiB0aGUgdHJpZ2dlci4gKi9cbiAgX2hhbmRsZU1vdXNlRW50ZXIoZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICB0aGlzLl9oYWx0ID0gZmFsc2U7XG5cbiAgICBpZiAodGhpcy5wb3BvdmVyLnRyaWdnZXJFdmVudCA9PT0gJ2hvdmVyJykge1xuICAgICAgdGhpcy5fbW91c2VvdmVyVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5vcGVuUG9wb3ZlcigpO1xuICAgICAgfSwgdGhpcy5wb3BvdmVyLmVudGVyRGVsYXkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBIYW5kbGVzIG1vdXNlIGxlYXZlIG9uIHRoZSB0cmlnZ2VyLiAqL1xuICBfaGFuZGxlTW91c2VMZWF2ZShldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnBvcG92ZXIudHJpZ2dlckV2ZW50ID09PSAnaG92ZXInKSB7XG4gICAgICBpZiAodGhpcy5fbW91c2VvdmVyVGltZXIpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX21vdXNlb3ZlclRpbWVyKTtcbiAgICAgICAgdGhpcy5fbW91c2VvdmVyVGltZXIgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5fcG9wb3Zlck9wZW4pIHtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgaWYgKCF0aGlzLnBvcG92ZXIuY2xvc2VEaXNhYmxlZCkge1xuICAgICAgICAgICAgdGhpcy5jbG9zZVBvcG92ZXIoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHRoaXMucG9wb3Zlci5sZWF2ZURlbGF5KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2hhbHQgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBIYW5kbGVzIG1vdXNlIHByZXNzZXMgb24gdGhlIHRyaWdnZXIuICovXG4gIF9oYW5kbGVNb3VzZWRvd24oZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAoIWlzRmFrZU1vdXNlZG93bkZyb21TY3JlZW5SZWFkZXIoZXZlbnQpKSB7XG4gICAgICAvLyBTaW5jZSByaWdodCBvciBtaWRkbGUgYnV0dG9uIGNsaWNrcyB3b24ndCB0cmlnZ2VyIHRoZSBgY2xpY2tgIGV2ZW50LFxuICAgICAgLy8gd2Ugc2hvdWxkbid0IGNvbnNpZGVyIHRoZSBwb3BvdmVyIGFzIG9wZW5lZCBieSBtb3VzZSBpbiB0aG9zZSBjYXNlcy5cbiAgICAgIHRoaXMuX29wZW5lZEJ5ID0gZXZlbnQuYnV0dG9uID09PSAwID8gJ21vdXNlJyA6IHVuZGVmaW5lZDtcbiAgICB9XG4gIH1cblxuICAvKiogSGFuZGxlcyBrZXkgcHJlc3NlcyBvbiB0aGUgdHJpZ2dlci4gKi9cbiAgX2hhbmRsZUtleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkIHtcbiAgICBjb25zdCBrZXlDb2RlID0gZXZlbnQua2V5Q29kZTtcblxuICAgIC8vIFByZXNzaW5nIGVudGVyIG9uIHRoZSB0cmlnZ2VyIHdpbGwgdHJpZ2dlciB0aGUgY2xpY2sgaGFuZGxlciBsYXRlci5cbiAgICBpZiAoa2V5Q29kZSA9PT0gRU5URVIgfHwga2V5Q29kZSA9PT0gU1BBQ0UpIHtcbiAgICAgIHRoaXMuX29wZW5lZEJ5ID0gJ2tleWJvYXJkJztcbiAgICB9XG4gIH1cblxuICAvKiogVG9nZ2xlcyB0aGUgcG9wb3ZlciBiZXR3ZWVuIHRoZSBvcGVuIGFuZCBjbG9zZWQgc3RhdGVzLiAqL1xuICB0b2dnbGVQb3BvdmVyKCk6IHZvaWQge1xuICAgIHJldHVybiB0aGlzLl9wb3BvdmVyT3BlbiA/IHRoaXMuY2xvc2VQb3BvdmVyKCkgOiB0aGlzLm9wZW5Qb3BvdmVyKCk7XG4gIH1cblxuICAvKiogT3BlbnMgdGhlIHBvcG92ZXIuICovXG4gIG9wZW5Qb3BvdmVyKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9wb3BvdmVyT3BlbiB8fCB0aGlzLl9oYWx0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5fY2hlY2tQb3BvdmVyKCk7XG5cbiAgICBjb25zdCBvdmVybGF5UmVmID0gdGhpcy5fY3JlYXRlT3ZlcmxheSgpO1xuICAgIGNvbnN0IG92ZXJsYXlDb25maWcgPSBvdmVybGF5UmVmLmdldENvbmZpZygpO1xuXG4gICAgdGhpcy5fc2V0UG9zaXRpb24ob3ZlcmxheUNvbmZpZy5wb3NpdGlvblN0cmF0ZWd5IGFzIEZsZXhpYmxlQ29ubmVjdGVkUG9zaXRpb25TdHJhdGVneSk7XG4gICAgaWYgKHRoaXMucG9wb3Zlci50cmlnZ2VyRXZlbnQgPT09ICdjbGljaycpIHtcbiAgICAgIG92ZXJsYXlDb25maWcuaGFzQmFja2Ryb3AgPSB0aGlzLnBvcG92ZXIuaGFzQmFja2Ryb3AgPz8gdHJ1ZTtcbiAgICB9XG4gICAgb3ZlcmxheVJlZi5hdHRhY2godGhpcy5fZ2V0UG9ydGFsKCkpO1xuXG4gICAgaWYgKHRoaXMucG9wb3Zlci5sYXp5Q29udGVudCkge1xuICAgICAgdGhpcy5wb3BvdmVyLmxhenlDb250ZW50LmF0dGFjaCh0aGlzLnBvcG92ZXJEYXRhKTtcbiAgICB9XG5cbiAgICB0aGlzLl9jbG9zaW5nQWN0aW9uc1N1YnNjcmlwdGlvbiA9IHRoaXMuX3BvcG92ZXJDbG9zaW5nQWN0aW9ucygpLnN1YnNjcmliZSgoKSA9PlxuICAgICAgdGhpcy5jbG9zZVBvcG92ZXIoKVxuICAgICk7XG4gICAgdGhpcy5faW5pdFBvcG92ZXIoKTtcblxuICAgIGlmICh0aGlzLnBvcG92ZXIgaW5zdGFuY2VvZiBNdHhQb3BvdmVyKSB7XG4gICAgICB0aGlzLnBvcG92ZXIuX3N0YXJ0QW5pbWF0aW9uKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIENsb3NlcyB0aGUgcG9wb3Zlci4gKi9cbiAgY2xvc2VQb3BvdmVyKCk6IHZvaWQge1xuICAgIHRoaXMucG9wb3Zlci5jbG9zZWQuZW1pdCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEZvY3VzZXMgdGhlIHBvcG92ZXIgdHJpZ2dlci5cbiAgICogQHBhcmFtIG9yaWdpbiBTb3VyY2Ugb2YgdGhlIHBvcG92ZXIgdHJpZ2dlcidzIGZvY3VzLlxuICAgKi9cbiAgZm9jdXMob3JpZ2luPzogRm9jdXNPcmlnaW4sIG9wdGlvbnM/OiBGb2N1c09wdGlvbnMpIHtcbiAgICBpZiAodGhpcy5fZm9jdXNNb25pdG9yICYmIG9yaWdpbikge1xuICAgICAgdGhpcy5fZm9jdXNNb25pdG9yLmZvY3VzVmlhKHRoaXMuX2VsZW1lbnRSZWYsIG9yaWdpbiwgb3B0aW9ucyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5mb2N1cyhvcHRpb25zKTtcbiAgICB9XG4gIH1cblxuICAvKiogUmVtb3ZlcyB0aGUgcG9wb3ZlciBmcm9tIHRoZSBET00uICovXG4gIHByaXZhdGUgX2Rlc3Ryb3lQb3BvdmVyKHJlYXNvbjogUG9wb3ZlckNsb3NlUmVhc29uKSB7XG4gICAgaWYgKCF0aGlzLl9vdmVybGF5UmVmIHx8ICF0aGlzLnBvcG92ZXJPcGVuKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gQ2xlYXIgdGhlIHRpbWVvdXQgZm9yIGhvdmVyIGV2ZW50LlxuICAgIGlmICh0aGlzLl9tb3VzZW92ZXJUaW1lcikge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX21vdXNlb3ZlclRpbWVyKTtcbiAgICAgIHRoaXMuX21vdXNlb3ZlclRpbWVyID0gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBwb3BvdmVyID0gdGhpcy5wb3BvdmVyO1xuICAgIHRoaXMuX2Nsb3NpbmdBY3Rpb25zU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgdGhpcy5fb3ZlcmxheVJlZi5kZXRhY2goKTtcblxuICAgIHRoaXMuX29wZW5lZEJ5ID0gdW5kZWZpbmVkO1xuXG4gICAgaWYgKHBvcG92ZXIgaW5zdGFuY2VvZiBNdHhQb3BvdmVyKSB7XG4gICAgICBwb3BvdmVyLl9yZXNldEFuaW1hdGlvbigpO1xuXG4gICAgICBpZiAocG9wb3Zlci5sYXp5Q29udGVudCkge1xuICAgICAgICAvLyBXYWl0IGZvciB0aGUgZXhpdCBhbmltYXRpb24gdG8gZmluaXNoIGJlZm9yZSBkZXRhY2hpbmcgdGhlIGNvbnRlbnQuXG4gICAgICAgIHBvcG92ZXIuX2FuaW1hdGlvbkRvbmVcbiAgICAgICAgICAucGlwZShcbiAgICAgICAgICAgIGZpbHRlcihldmVudCA9PiBldmVudC50b1N0YXRlID09PSAndm9pZCcpLFxuICAgICAgICAgICAgdGFrZSgxKSxcbiAgICAgICAgICAgIC8vIEludGVycnVwdCBpZiB0aGUgY29udGVudCBnb3QgcmUtYXR0YWNoZWQuXG4gICAgICAgICAgICB0YWtlVW50aWwocG9wb3Zlci5sYXp5Q29udGVudC5fYXR0YWNoZWQpXG4gICAgICAgICAgKVxuICAgICAgICAgIC5zdWJzY3JpYmUoe1xuICAgICAgICAgICAgbmV4dDogKCkgPT4gcG9wb3Zlci5sYXp5Q29udGVudCEuZGV0YWNoKCksXG4gICAgICAgICAgICAvLyBObyBtYXR0ZXIgd2hldGhlciB0aGUgY29udGVudCBnb3QgcmUtYXR0YWNoZWQsIHJlc2V0IHRoZSBwb3BvdmVyLlxuICAgICAgICAgICAgY29tcGxldGU6ICgpID0+IHRoaXMuX3NldElzUG9wb3Zlck9wZW4oZmFsc2UpLFxuICAgICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fc2V0SXNQb3BvdmVyT3BlbihmYWxzZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3NldElzUG9wb3Zlck9wZW4oZmFsc2UpO1xuICAgICAgcG9wb3Zlci5sYXp5Q29udGVudD8uZGV0YWNoKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIHNldHMgdGhlIHBvcG92ZXIgc3RhdGUgdG8gb3Blbi5cbiAgICovXG4gIHByaXZhdGUgX2luaXRQb3BvdmVyKCk6IHZvaWQge1xuICAgIHRoaXMucG9wb3Zlci5kaXJlY3Rpb24gPSB0aGlzLmRpcjtcbiAgICB0aGlzLnBvcG92ZXIuc2V0RWxldmF0aW9uKCk7XG4gICAgdGhpcy5fc2V0SXNQb3BvdmVyT3Blbih0cnVlKTtcbiAgfVxuXG4gIC8vIHNldCBzdGF0ZSByYXRoZXIgdGhhbiB0b2dnbGUgdG8gc3VwcG9ydCB0cmlnZ2VycyBzaGFyaW5nIGEgcG9wb3ZlclxuICBwcml2YXRlIF9zZXRJc1BvcG92ZXJPcGVuKGlzT3BlbjogYm9vbGVhbik6IHZvaWQge1xuICAgIGlmIChpc09wZW4gIT09IHRoaXMuX3BvcG92ZXJPcGVuKSB7XG4gICAgICB0aGlzLl9wb3BvdmVyT3BlbiA9IGlzT3BlbjtcbiAgICAgIHRoaXMuX3BvcG92ZXJPcGVuID8gdGhpcy5wb3BvdmVyT3BlbmVkLmVtaXQoKSA6IHRoaXMucG9wb3ZlckNsb3NlZC5lbWl0KCk7XG5cbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCBjaGVja3MgdGhhdCBhIHZhbGlkIGluc3RhbmNlIG9mIE1kUG9wb3ZlciBoYXMgYmVlbiBwYXNzZWQgaW50b1xuICAgKiBgbXR4UG9wb3ZlclRyaWdnZXJGb3JgLiBJZiBub3QsIGFuIGV4Y2VwdGlvbiBpcyB0aHJvd24uXG4gICAqL1xuICBwcml2YXRlIF9jaGVja1BvcG92ZXIoKSB7XG4gICAgaWYgKCF0aGlzLnBvcG92ZXIpIHtcbiAgICAgIHRocm93TXR4UG9wb3Zlck1pc3NpbmdFcnJvcigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCBjcmVhdGVzIHRoZSBvdmVybGF5IGZyb20gdGhlIHByb3ZpZGVkIHBvcG92ZXIncyB0ZW1wbGF0ZSBhbmQgc2F2ZXMgaXRzXG4gICAqIE92ZXJsYXlSZWYgc28gdGhhdCBpdCBjYW4gYmUgYXR0YWNoZWQgdG8gdGhlIERPTSB3aGVuIG9wZW5Qb3BvdmVyIGlzIGNhbGxlZC5cbiAgICovXG4gIHByaXZhdGUgX2NyZWF0ZU92ZXJsYXkoKTogT3ZlcmxheVJlZiB7XG4gICAgaWYgKCF0aGlzLl9vdmVybGF5UmVmKSB7XG4gICAgICBjb25zdCBjb25maWcgPSB0aGlzLl9nZXRPdmVybGF5Q29uZmlnKCk7XG4gICAgICB0aGlzLl9zdWJzY3JpYmVUb1Bvc2l0aW9ucyhjb25maWcucG9zaXRpb25TdHJhdGVneSBhcyBGbGV4aWJsZUNvbm5lY3RlZFBvc2l0aW9uU3RyYXRlZ3kpO1xuICAgICAgdGhpcy5fb3ZlcmxheVJlZiA9IHRoaXMuX292ZXJsYXkuY3JlYXRlKGNvbmZpZyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IG92ZXJsYXlDb25maWcgPSB0aGlzLl9vdmVybGF5UmVmLmdldENvbmZpZygpO1xuICAgICAgY29uc3QgcG9zaXRpb25TdHJhdGVneSA9IG92ZXJsYXlDb25maWcucG9zaXRpb25TdHJhdGVneSBhcyBGbGV4aWJsZUNvbm5lY3RlZFBvc2l0aW9uU3RyYXRlZ3k7XG4gICAgICBwb3NpdGlvblN0cmF0ZWd5LnNldE9yaWdpbih0aGlzLl9nZXRUYXJnZXRFbGVtZW50KCkpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9vdmVybGF5UmVmO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIGJ1aWxkcyB0aGUgY29uZmlndXJhdGlvbiBvYmplY3QgbmVlZGVkIHRvIGNyZWF0ZSB0aGUgb3ZlcmxheSwgdGhlIE92ZXJsYXlDb25maWcuXG4gICAqIEByZXR1cm5zIE92ZXJsYXlDb25maWdcbiAgICovXG4gIHByaXZhdGUgX2dldE92ZXJsYXlDb25maWcoKTogT3ZlcmxheUNvbmZpZyB7XG4gICAgcmV0dXJuIG5ldyBPdmVybGF5Q29uZmlnKHtcbiAgICAgIHBvc2l0aW9uU3RyYXRlZ3k6IHRoaXMuX292ZXJsYXlcbiAgICAgICAgLnBvc2l0aW9uKClcbiAgICAgICAgLmZsZXhpYmxlQ29ubmVjdGVkVG8odGhpcy5fZ2V0VGFyZ2V0RWxlbWVudCgpKVxuICAgICAgICAud2l0aExvY2tlZFBvc2l0aW9uKClcbiAgICAgICAgLndpdGhHcm93QWZ0ZXJPcGVuKClcbiAgICAgICAgLndpdGhUcmFuc2Zvcm1PcmlnaW5PbignLm10eC1wb3BvdmVyLXBhbmVsJyksXG4gICAgICBiYWNrZHJvcENsYXNzOiB0aGlzLnBvcG92ZXIuYmFja2Ryb3BDbGFzcyB8fCAnY2RrLW92ZXJsYXktdHJhbnNwYXJlbnQtYmFja2Ryb3AnLFxuICAgICAgcGFuZWxDbGFzczogdGhpcy5wb3BvdmVyLm92ZXJsYXlQYW5lbENsYXNzLFxuICAgICAgc2Nyb2xsU3RyYXRlZ3k6IHRoaXMuX3Njcm9sbFN0cmF0ZWd5KCksXG4gICAgICBkaXJlY3Rpb246IHRoaXMuX2RpcixcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX2dldFRhcmdldEVsZW1lbnQoKTogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4ge1xuICAgIGlmICh0aGlzLnRhcmdldEVsZW1lbnQpIHtcbiAgICAgIHJldHVybiB0aGlzLnRhcmdldEVsZW1lbnQuZWxlbWVudFJlZjtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fZWxlbWVudFJlZjtcbiAgfVxuXG4gIC8qKlxuICAgKiBMaXN0ZW5zIHRvIGNoYW5nZXMgaW4gdGhlIHBvc2l0aW9uIG9mIHRoZSBvdmVybGF5IGFuZCBzZXRzIHRoZSBjb3JyZWN0IGNsYXNzZXNcbiAgICogb24gdGhlIHBvcG92ZXIgYmFzZWQgb24gdGhlIG5ldyBwb3NpdGlvbi4gVGhpcyBlbnN1cmVzIHRoZSBhbmltYXRpb24gb3JpZ2luIGlzIGFsd2F5c1xuICAgKiBjb3JyZWN0LCBldmVuIGlmIGEgZmFsbGJhY2sgcG9zaXRpb24gaXMgdXNlZCBmb3IgdGhlIG92ZXJsYXkuXG4gICAqL1xuICBwcml2YXRlIF9zdWJzY3JpYmVUb1Bvc2l0aW9ucyhwb3NpdGlvbjogRmxleGlibGVDb25uZWN0ZWRQb3NpdGlvblN0cmF0ZWd5KTogdm9pZCB7XG4gICAgdGhpcy5fcG9zaXRpb25TdWJzY3JpcHRpb24gPSBwb3NpdGlvbi5wb3NpdGlvbkNoYW5nZXMuc3Vic2NyaWJlKGNoYW5nZSA9PiB7XG4gICAgICBjb25zdCBwb3NYID1cbiAgICAgICAgY2hhbmdlLmNvbm5lY3Rpb25QYWlyLm92ZXJsYXlYID09PSAnc3RhcnQnXG4gICAgICAgICAgPyAnYWZ0ZXInXG4gICAgICAgICAgOiBjaGFuZ2UuY29ubmVjdGlvblBhaXIub3ZlcmxheVggPT09ICdlbmQnXG4gICAgICAgICAgICA/ICdiZWZvcmUnXG4gICAgICAgICAgICA6ICdjZW50ZXInO1xuICAgICAgY29uc3QgcG9zWSA9XG4gICAgICAgIGNoYW5nZS5jb25uZWN0aW9uUGFpci5vdmVybGF5WSA9PT0gJ3RvcCdcbiAgICAgICAgICA/ICdiZWxvdydcbiAgICAgICAgICA6IGNoYW5nZS5jb25uZWN0aW9uUGFpci5vdmVybGF5WSA9PT0gJ2JvdHRvbSdcbiAgICAgICAgICAgID8gJ2Fib3ZlJ1xuICAgICAgICAgICAgOiAnY2VudGVyJztcblxuICAgICAgY29uc3QgcG9zOiBNdHhQb3BvdmVyUG9zaXRpb24gPVxuICAgICAgICB0aGlzLnBvcG92ZXIucG9zaXRpb25bMF0gPT09ICdhYm92ZScgfHwgdGhpcy5wb3BvdmVyLnBvc2l0aW9uWzBdID09PSAnYmVsb3cnXG4gICAgICAgICAgPyBbcG9zWSBhcyBNdHhQb3BvdmVyUG9zaXRpb25TdGFydCwgcG9zWF1cbiAgICAgICAgICA6IFtwb3NYIGFzIE10eFBvcG92ZXJQb3NpdGlvblN0YXJ0LCBwb3NZXTtcblxuICAgICAgLy8gcmVxdWlyZWQgZm9yIENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG5cbiAgICAgIHRoaXMucG9wb3Zlci5zZXRDdXJyZW50U3R5bGVzKHBvcyk7XG4gICAgICB0aGlzLnBvcG92ZXIuc2V0UG9zaXRpb25DbGFzc2VzKHBvcyk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgYXBwcm9wcmlhdGUgcG9zaXRpb25zIG9uIGEgcG9zaXRpb24gc3RyYXRlZ3lcbiAgICogc28gdGhlIG92ZXJsYXkgY29ubmVjdHMgd2l0aCB0aGUgdHJpZ2dlciBjb3JyZWN0bHkuXG4gICAqIEBwYXJhbSBwb3NpdGlvblN0cmF0ZWd5IFN0cmF0ZWd5IHdob3NlIHBvc2l0aW9uIHRvIHVwZGF0ZS5cbiAgICovXG4gIHByaXZhdGUgX3NldFBvc2l0aW9uKHBvc2l0aW9uU3RyYXRlZ3k6IEZsZXhpYmxlQ29ubmVjdGVkUG9zaXRpb25TdHJhdGVneSkge1xuICAgIGNvbnN0IFtvcmlnaW5YLCBvcmlnaW4ybmRYLCBvcmlnaW4zcmRYXTogSG9yaXpvbnRhbENvbm5lY3Rpb25Qb3NbXSA9XG4gICAgICB0aGlzLnBvcG92ZXIucG9zaXRpb25bMF0gPT09ICdiZWZvcmUnIHx8IHRoaXMucG9wb3Zlci5wb3NpdGlvblsxXSA9PT0gJ2FmdGVyJ1xuICAgICAgICA/IFsnc3RhcnQnLCAnY2VudGVyJywgJ2VuZCddXG4gICAgICAgIDogdGhpcy5wb3BvdmVyLnBvc2l0aW9uWzBdID09PSAnYWZ0ZXInIHx8IHRoaXMucG9wb3Zlci5wb3NpdGlvblsxXSA9PT0gJ2JlZm9yZSdcbiAgICAgICAgICA/IFsnZW5kJywgJ2NlbnRlcicsICdzdGFydCddXG4gICAgICAgICAgOiBbJ2NlbnRlcicsICdzdGFydCcsICdlbmQnXTtcblxuICAgIGNvbnN0IFtvcmlnaW5ZLCBvcmlnaW4ybmRZLCBvcmlnaW4zcmRZXTogVmVydGljYWxDb25uZWN0aW9uUG9zW10gPVxuICAgICAgdGhpcy5wb3BvdmVyLnBvc2l0aW9uWzBdID09PSAnYWJvdmUnIHx8IHRoaXMucG9wb3Zlci5wb3NpdGlvblsxXSA9PT0gJ2JlbG93J1xuICAgICAgICA/IFsndG9wJywgJ2NlbnRlcicsICdib3R0b20nXVxuICAgICAgICA6IHRoaXMucG9wb3Zlci5wb3NpdGlvblswXSA9PT0gJ2JlbG93JyB8fCB0aGlzLnBvcG92ZXIucG9zaXRpb25bMV0gPT09ICdhYm92ZSdcbiAgICAgICAgICA/IFsnYm90dG9tJywgJ2NlbnRlcicsICd0b3AnXVxuICAgICAgICAgIDogWydjZW50ZXInLCAndG9wJywgJ2JvdHRvbSddO1xuXG4gICAgY29uc3QgW292ZXJsYXlYLCBvdmVybGF5RmFsbGJhY2tYXTogSG9yaXpvbnRhbENvbm5lY3Rpb25Qb3NbXSA9XG4gICAgICB0aGlzLnBvcG92ZXIucG9zaXRpb25bMF0gPT09ICdiZWxvdycgfHwgdGhpcy5wb3BvdmVyLnBvc2l0aW9uWzBdID09PSAnYWJvdmUnXG4gICAgICAgID8gW29yaWdpblgsIG9yaWdpblhdXG4gICAgICAgIDogdGhpcy5wb3BvdmVyLnBvc2l0aW9uWzBdID09PSAnYmVmb3JlJ1xuICAgICAgICAgID8gWydlbmQnLCAnc3RhcnQnXVxuICAgICAgICAgIDogWydzdGFydCcsICdlbmQnXTtcblxuICAgIGNvbnN0IFtvdmVybGF5WSwgb3ZlcmxheUZhbGxiYWNrWV06IFZlcnRpY2FsQ29ubmVjdGlvblBvc1tdID1cbiAgICAgIHRoaXMucG9wb3Zlci5wb3NpdGlvblswXSA9PT0gJ2JlZm9yZScgfHwgdGhpcy5wb3BvdmVyLnBvc2l0aW9uWzBdID09PSAnYWZ0ZXInXG4gICAgICAgID8gW29yaWdpblksIG9yaWdpblldXG4gICAgICAgIDogdGhpcy5wb3BvdmVyLnBvc2l0aW9uWzBdID09PSAnYmVsb3cnXG4gICAgICAgICAgPyBbJ3RvcCcsICdib3R0b20nXVxuICAgICAgICAgIDogWydib3R0b20nLCAndG9wJ107XG5cbiAgICBjb25zdCBvcmlnaW5GYWxsYmFja1ggPSBvdmVybGF5WDtcbiAgICBjb25zdCBvcmlnaW5GYWxsYmFja1kgPSBvdmVybGF5WTtcblxuICAgIGNvbnN0IG9mZnNldFggPVxuICAgICAgdGhpcy5wb3BvdmVyLnhPZmZzZXQgJiYgIWlzTmFOKE51bWJlcih0aGlzLnBvcG92ZXIueE9mZnNldCkpXG4gICAgICAgID8gTnVtYmVyKHRoaXMuZGlyID09PSAnbHRyJyA/IHRoaXMucG9wb3Zlci54T2Zmc2V0IDogLXRoaXMucG9wb3Zlci54T2Zmc2V0KVxuICAgICAgICA6IDA7XG4gICAgY29uc3Qgb2Zmc2V0WSA9XG4gICAgICB0aGlzLnBvcG92ZXIueU9mZnNldCAmJiAhaXNOYU4oTnVtYmVyKHRoaXMucG9wb3Zlci55T2Zmc2V0KSlcbiAgICAgICAgPyBOdW1iZXIodGhpcy5wb3BvdmVyLnlPZmZzZXQpXG4gICAgICAgIDogMDtcblxuICAgIGxldCBwb3NpdGlvbnM6IENvbm5lY3RlZFBvc2l0aW9uW10gPSBbeyBvcmlnaW5YLCBvcmlnaW5ZLCBvdmVybGF5WCwgb3ZlcmxheVkgfV07XG5cbiAgICBpZiAodGhpcy5wb3BvdmVyLnBvc2l0aW9uWzBdID09PSAnYWJvdmUnIHx8IHRoaXMucG9wb3Zlci5wb3NpdGlvblswXSA9PT0gJ2JlbG93Jykge1xuICAgICAgcG9zaXRpb25zID0gW1xuICAgICAgICB7IG9yaWdpblgsIG9yaWdpblksIG92ZXJsYXlYLCBvdmVybGF5WSwgb2Zmc2V0WSB9LFxuICAgICAgICB7IG9yaWdpblg6IG9yaWdpbjJuZFgsIG9yaWdpblksIG92ZXJsYXlYOiBvcmlnaW4ybmRYLCBvdmVybGF5WSwgb2Zmc2V0WSB9LFxuICAgICAgICB7IG9yaWdpblg6IG9yaWdpbjNyZFgsIG9yaWdpblksIG92ZXJsYXlYOiBvcmlnaW4zcmRYLCBvdmVybGF5WSwgb2Zmc2V0WSB9LFxuICAgICAgICB7XG4gICAgICAgICAgb3JpZ2luWCxcbiAgICAgICAgICBvcmlnaW5ZOiBvcmlnaW5GYWxsYmFja1ksXG4gICAgICAgICAgb3ZlcmxheVgsXG4gICAgICAgICAgb3ZlcmxheVk6IG92ZXJsYXlGYWxsYmFja1ksXG4gICAgICAgICAgb2Zmc2V0WTogLW9mZnNldFksXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBvcmlnaW5YOiBvcmlnaW4ybmRYLFxuICAgICAgICAgIG9yaWdpblk6IG9yaWdpbkZhbGxiYWNrWSxcbiAgICAgICAgICBvdmVybGF5WDogb3JpZ2luMm5kWCxcbiAgICAgICAgICBvdmVybGF5WTogb3ZlcmxheUZhbGxiYWNrWSxcbiAgICAgICAgICBvZmZzZXRZOiAtb2Zmc2V0WSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIG9yaWdpblg6IG9yaWdpbjNyZFgsXG4gICAgICAgICAgb3JpZ2luWTogb3JpZ2luRmFsbGJhY2tZLFxuICAgICAgICAgIG92ZXJsYXlYOiBvcmlnaW4zcmRYLFxuICAgICAgICAgIG92ZXJsYXlZOiBvdmVybGF5RmFsbGJhY2tZLFxuICAgICAgICAgIG9mZnNldFk6IC1vZmZzZXRZLFxuICAgICAgICB9LFxuICAgICAgXTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wb3BvdmVyLnBvc2l0aW9uWzBdID09PSAnYmVmb3JlJyB8fCB0aGlzLnBvcG92ZXIucG9zaXRpb25bMF0gPT09ICdhZnRlcicpIHtcbiAgICAgIHBvc2l0aW9ucyA9IFtcbiAgICAgICAgeyBvcmlnaW5YLCBvcmlnaW5ZLCBvdmVybGF5WCwgb3ZlcmxheVksIG9mZnNldFggfSxcbiAgICAgICAgeyBvcmlnaW5YLCBvcmlnaW5ZOiBvcmlnaW4ybmRZLCBvdmVybGF5WCwgb3ZlcmxheVk6IG9yaWdpbjJuZFksIG9mZnNldFggfSxcbiAgICAgICAgeyBvcmlnaW5YLCBvcmlnaW5ZOiBvcmlnaW4zcmRZLCBvdmVybGF5WCwgb3ZlcmxheVk6IG9yaWdpbjNyZFksIG9mZnNldFggfSxcbiAgICAgICAge1xuICAgICAgICAgIG9yaWdpblg6IG9yaWdpbkZhbGxiYWNrWCxcbiAgICAgICAgICBvcmlnaW5ZLFxuICAgICAgICAgIG92ZXJsYXlYOiBvdmVybGF5RmFsbGJhY2tYLFxuICAgICAgICAgIG92ZXJsYXlZLFxuICAgICAgICAgIG9mZnNldFg6IC1vZmZzZXRYLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgb3JpZ2luWDogb3JpZ2luRmFsbGJhY2tYLFxuICAgICAgICAgIG9yaWdpblk6IG9yaWdpbjJuZFksXG4gICAgICAgICAgb3ZlcmxheVg6IG92ZXJsYXlGYWxsYmFja1gsXG4gICAgICAgICAgb3ZlcmxheVk6IG9yaWdpbjJuZFksXG4gICAgICAgICAgb2Zmc2V0WDogLW9mZnNldFgsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBvcmlnaW5YOiBvcmlnaW5GYWxsYmFja1gsXG4gICAgICAgICAgb3JpZ2luWTogb3JpZ2luM3JkWSxcbiAgICAgICAgICBvdmVybGF5WDogb3ZlcmxheUZhbGxiYWNrWCxcbiAgICAgICAgICBvdmVybGF5WTogb3JpZ2luM3JkWSxcbiAgICAgICAgICBvZmZzZXRYOiAtb2Zmc2V0WCxcbiAgICAgICAgfSxcbiAgICAgIF07XG4gICAgfVxuXG4gICAgcG9zaXRpb25TdHJhdGVneVxuICAgICAgLndpdGhQb3NpdGlvbnMocG9zaXRpb25zKVxuICAgICAgLndpdGhEZWZhdWx0T2Zmc2V0WChvZmZzZXRYKVxuICAgICAgLndpdGhEZWZhdWx0T2Zmc2V0WShvZmZzZXRZKTtcbiAgfVxuXG4gIC8qKiBSZXR1cm5zIGEgc3RyZWFtIHRoYXQgZW1pdHMgd2hlbmV2ZXIgYW4gYWN0aW9uIHRoYXQgc2hvdWxkIGNsb3NlIHRoZSBwb3BvdmVyIG9jY3Vycy4gKi9cbiAgcHJpdmF0ZSBfcG9wb3ZlckNsb3NpbmdBY3Rpb25zKCkge1xuICAgIGNvbnN0IGJhY2tkcm9wID1cbiAgICAgIHRoaXMucG9wb3Zlci50cmlnZ2VyRXZlbnQgPT09ICdjbGljaycgJiYgdGhpcy5wb3BvdmVyLmNsb3NlT25CYWNrZHJvcENsaWNrID09PSB0cnVlXG4gICAgICAgID8gdGhpcy5fb3ZlcmxheVJlZiEuYmFja2Ryb3BDbGljaygpXG4gICAgICAgIDogb2JzZXJ2YWJsZU9mKCk7XG4gICAgY29uc3QgZGV0YWNobWVudHMgPSB0aGlzLl9vdmVybGF5UmVmIS5kZXRhY2htZW50cygpO1xuICAgIHJldHVybiBtZXJnZShiYWNrZHJvcCwgZGV0YWNobWVudHMpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHBvcnRhbCB0aGF0IHNob3VsZCBiZSBhdHRhY2hlZCB0byB0aGUgb3ZlcmxheS4gKi9cbiAgcHJpdmF0ZSBfZ2V0UG9ydGFsKCk6IFRlbXBsYXRlUG9ydGFsIHtcbiAgICAvLyBOb3RlIHRoYXQgd2UgY2FuIGF2b2lkIHRoaXMgY2hlY2sgYnkga2VlcGluZyB0aGUgcG9ydGFsIG9uIHRoZSBwb3BvdmVyIHBhbmVsLlxuICAgIC8vIFdoaWxlIGl0IHdvdWxkIGJlIGNsZWFuZXIsIHdlJ2QgaGF2ZSB0byBpbnRyb2R1Y2UgYW5vdGhlciByZXF1aXJlZCBtZXRob2Qgb25cbiAgICAvLyBgTXR4UG9wb3ZlclBhbmVsYCwgbWFraW5nIGl0IGhhcmRlciB0byBjb25zdW1lLlxuICAgIGlmICghdGhpcy5fcG9ydGFsIHx8IHRoaXMuX3BvcnRhbC50ZW1wbGF0ZVJlZiAhPT0gdGhpcy5wb3BvdmVyLnRlbXBsYXRlUmVmKSB7XG4gICAgICB0aGlzLl9wb3J0YWwgPSBuZXcgVGVtcGxhdGVQb3J0YWwodGhpcy5wb3BvdmVyLnRlbXBsYXRlUmVmLCB0aGlzLl92aWV3Q29udGFpbmVyUmVmKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fcG9ydGFsO1xuICB9XG59XG4iXX0=