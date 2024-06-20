import { Directive, Injector, } from '@angular/core';
import { ComponentPortal } from '@angular/cdk/portal';
import { merge, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { HEADER_ROW_SELECTOR } from './selectors';
import { ResizeRef } from './resize-ref';
import { closest } from './polyfill';
import * as i0 from "@angular/core";
const OVERLAY_ACTIVE_CLASS = 'cdk-resizable-overlay-thumb-active';
/**
 * Base class for Resizable directives which are applied to column headers to make those columns
 * resizable.
 */
export class Resizable {
    constructor() {
        this.isResizable = true;
        this.minWidthPxInternal = 0;
        this.maxWidthPxInternal = Number.MAX_SAFE_INTEGER;
        this.destroyed = new Subject();
        this._viewInitialized = false;
        this._isDestroyed = false;
    }
    /** The minimum width to allow the column to be sized to. */
    get minWidthPx() {
        return this.minWidthPxInternal;
    }
    set minWidthPx(value) {
        if (value) {
            this.minWidthPxInternal = value;
        }
        this.columnResize.setResized();
        if (this.elementRef.nativeElement && this._viewInitialized) {
            this._applyMinWidthPx();
        }
    }
    /** The maximum width to allow the column to be sized to. */
    get maxWidthPx() {
        return this.maxWidthPxInternal;
    }
    set maxWidthPx(value) {
        if (value) {
            this.maxWidthPxInternal = value;
        }
        this.columnResize.setResized();
        if (this.elementRef.nativeElement && this._viewInitialized) {
            this._applyMaxWidthPx();
        }
    }
    ngAfterViewInit() {
        if (this.isResizable) {
            this._listenForRowHoverEvents();
            this._listenForResizeEvents();
            this._appendInlineHandle();
            this.styleScheduler.scheduleEnd(() => {
                if (this._isDestroyed)
                    return;
                this._viewInitialized = true;
                this._applyMinWidthPx();
                this._applyMaxWidthPx();
            });
        }
    }
    ngOnDestroy() {
        this._isDestroyed = true;
        this.destroyed.next();
        this.destroyed.complete();
        this.inlineHandle?.remove();
        this.overlayRef?.dispose();
    }
    _createOverlayForHandle() {
        // Use of overlays allows us to properly capture click events spanning parts
        // of two table cells and is also useful for displaying a resize thumb
        // over both cells and extending it down the table as needed.
        const isRtl = this.directionality.value === 'rtl';
        const positionStrategy = this.overlay
            .position()
            .flexibleConnectedTo(this.elementRef.nativeElement)
            .withFlexibleDimensions(false)
            .withGrowAfterOpen(false)
            .withPush(false)
            .withDefaultOffsetX(isRtl ? 1 : 0)
            .withPositions([
            {
                originX: isRtl ? 'start' : 'end',
                originY: 'top',
                overlayX: 'center',
                overlayY: 'top',
            },
        ]);
        return this.overlay.create({
            // Always position the overlay based on left-indexed coordinates.
            direction: 'ltr',
            disposeOnNavigation: true,
            positionStrategy,
            scrollStrategy: this.overlay.scrollStrategies.reposition(),
            width: '16px',
        });
    }
    _listenForRowHoverEvents() {
        const element = this.elementRef.nativeElement;
        const takeUntilDestroyed = takeUntil(this.destroyed);
        this.eventDispatcher
            .resizeOverlayVisibleForHeaderRow(closest(element, HEADER_ROW_SELECTOR))
            .pipe(takeUntilDestroyed)
            .subscribe(hoveringRow => {
            if (hoveringRow) {
                if (!this.overlayRef) {
                    this.overlayRef = this._createOverlayForHandle();
                }
                this._showHandleOverlay();
            }
            else if (this.overlayRef) {
                // todo - can't detach during an active resize - need to work that out
                this.overlayRef.detach();
            }
        });
    }
    _listenForResizeEvents() {
        const takeUntilDestroyed = takeUntil(this.destroyed);
        merge(this.resizeNotifier.resizeCanceled, this.resizeNotifier.triggerResize)
            .pipe(takeUntilDestroyed, filter(columnSize => columnSize.columnId === this.columnDef.name))
            .subscribe(({ size, previousSize, completeImmediately }) => {
            this.elementRef.nativeElement.classList.add(OVERLAY_ACTIVE_CLASS);
            this._applySize(size, previousSize);
            if (completeImmediately) {
                this._completeResizeOperation();
            }
        });
        merge(this.resizeNotifier.resizeCanceled, this.resizeNotifier.resizeCompleted)
            .pipe(takeUntilDestroyed)
            .subscribe(columnSize => {
            this._cleanUpAfterResize(columnSize);
        });
    }
    _completeResizeOperation() {
        this.ngZone.run(() => {
            this.resizeNotifier.resizeCompleted.next({
                columnId: this.columnDef.name,
                size: this.elementRef.nativeElement.offsetWidth,
            });
        });
    }
    _cleanUpAfterResize(columnSize) {
        this.elementRef.nativeElement.classList.remove(OVERLAY_ACTIVE_CLASS);
        if (this.overlayRef && this.overlayRef.hasAttached()) {
            this._updateOverlayHandleHeight();
            this.overlayRef.updatePosition();
            if (columnSize.columnId === this.columnDef.name) {
                this.inlineHandle.focus();
            }
        }
    }
    _createHandlePortal() {
        const injector = Injector.create({
            parent: this.injector,
            providers: [
                {
                    provide: ResizeRef,
                    useValue: new ResizeRef(this.elementRef, this.overlayRef, this.minWidthPx, this.maxWidthPx),
                },
            ],
        });
        return new ComponentPortal(this.getOverlayHandleComponentType(), this.viewContainerRef, injector);
    }
    _showHandleOverlay() {
        this._updateOverlayHandleHeight();
        this.overlayRef.attach(this._createHandlePortal());
        // Needed to ensure that all of the lifecycle hooks inside the overlay run immediately.
        this.changeDetectorRef.markForCheck();
    }
    _updateOverlayHandleHeight() {
        this.overlayRef.updateSize({ height: this.elementRef.nativeElement.offsetHeight });
    }
    _applySize(sizeInPixels, previousSize) {
        const sizeToApply = Math.min(Math.max(sizeInPixels, this.minWidthPx, 0), this.maxWidthPx);
        this.resizeStrategy.applyColumnSize(this.columnDef.cssClassFriendlyName, this.elementRef.nativeElement, sizeToApply, previousSize);
    }
    _applyMinWidthPx() {
        this.resizeStrategy.applyMinColumnSize(this.columnDef.cssClassFriendlyName, this.elementRef.nativeElement, this.minWidthPx);
    }
    _applyMaxWidthPx() {
        this.resizeStrategy.applyMaxColumnSize(this.columnDef.cssClassFriendlyName, this.elementRef.nativeElement, this.maxWidthPx);
    }
    _appendInlineHandle() {
        this.styleScheduler.schedule(() => {
            this.inlineHandle = this.document.createElement('div');
            this.inlineHandle.tabIndex = 0;
            this.inlineHandle.className = this.getInlineHandleCssClassName();
            // TODO: Apply correct aria role (probably slider) after a11y spec questions resolved.
            this.elementRef.nativeElement.appendChild(this.inlineHandle);
        });
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: Resizable, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    /** @nocollapse */ static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.0.1", type: Resizable, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: Resizable, decorators: [{
            type: Directive
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzaXphYmxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvZXh0ZW5zaW9ucy9jb2x1bW4tcmVzaXplL3Jlc2l6YWJsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBRUwsU0FBUyxFQUVULFFBQVEsR0FNVCxNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFHdEQsT0FBTyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDdEMsT0FBTyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUVuRCxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFLbEQsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUV6QyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sWUFBWSxDQUFDOztBQUVyQyxNQUFNLG9CQUFvQixHQUFHLG9DQUFvQyxDQUFDO0FBRWxFOzs7R0FHRztBQUVILE1BQU0sT0FBZ0IsU0FBUztJQUQvQjtRQUlZLGdCQUFXLEdBQUcsSUFBSSxDQUFDO1FBRW5CLHVCQUFrQixHQUFXLENBQUMsQ0FBQztRQUMvQix1QkFBa0IsR0FBVyxNQUFNLENBQUMsZ0JBQWdCLENBQUM7UUFJNUMsY0FBUyxHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7UUFpQjNDLHFCQUFnQixHQUFHLEtBQUssQ0FBQztRQUN6QixpQkFBWSxHQUFHLEtBQUssQ0FBQztLQXVPOUI7SUFyT0MsNERBQTREO0lBQzVELElBQUksVUFBVTtRQUNaLE9BQU8sSUFBSSxDQUFDLGtCQUFrQixDQUFDO0lBQ2pDLENBQUM7SUFDRCxJQUFJLFVBQVUsQ0FBQyxLQUFhO1FBQzFCLElBQUksS0FBSyxFQUFFLENBQUM7WUFDVixJQUFJLENBQUMsa0JBQWtCLEdBQUcsS0FBSyxDQUFDO1FB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LENBQUM7SUFDTCxDQUFDO2lJQWxRbUIsU0FBUztxSEFBVCxTQUFTOzsyRkFBVCxTQUFTO2tCQUQ5QixTQUFTIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBJbmplY3RvcixcbiAgTmdab25lLFxuICBPbkRlc3Ryb3ksXG4gIFR5cGUsXG4gIFZpZXdDb250YWluZXJSZWYsXG4gIENoYW5nZURldGVjdG9yUmVmLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IERpcmVjdGlvbmFsaXR5IH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2JpZGknO1xuaW1wb3J0IHsgQ29tcG9uZW50UG9ydGFsIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5pbXBvcnQgeyBPdmVybGF5LCBPdmVybGF5UmVmIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHsgQ2RrQ29sdW1uRGVmLCBfQ29hbGVzY2VkU3R5bGVTY2hlZHVsZXIgfSBmcm9tICdAYW5ndWxhci9jZGsvdGFibGUnO1xuaW1wb3J0IHsgbWVyZ2UsIFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGZpbHRlciwgdGFrZVVudGlsIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBIRUFERVJfUk9XX1NFTEVDVE9SIH0gZnJvbSAnLi9zZWxlY3RvcnMnO1xuaW1wb3J0IHsgUmVzaXplT3ZlcmxheUhhbmRsZSB9IGZyb20gJy4vb3ZlcmxheS1oYW5kbGUnO1xuaW1wb3J0IHsgQ29sdW1uUmVzaXplIH0gZnJvbSAnLi9jb2x1bW4tcmVzaXplJztcbmltcG9ydCB7IENvbHVtblNpemVBY3Rpb24sIENvbHVtblJlc2l6ZU5vdGlmaWVyU291cmNlIH0gZnJvbSAnLi9jb2x1bW4tcmVzaXplLW5vdGlmaWVyJztcbmltcG9ydCB7IEhlYWRlclJvd0V2ZW50RGlzcGF0Y2hlciB9IGZyb20gJy4vZXZlbnQtZGlzcGF0Y2hlcic7XG5pbXBvcnQgeyBSZXNpemVSZWYgfSBmcm9tICcuL3Jlc2l6ZS1yZWYnO1xuaW1wb3J0IHsgUmVzaXplU3RyYXRlZ3kgfSBmcm9tICcuL3Jlc2l6ZS1zdHJhdGVneSc7XG5pbXBvcnQgeyBjbG9zZXN0IH0gZnJvbSAnLi9wb2x5ZmlsbCc7XG5cbmNvbnN0IE9WRVJMQVlfQUNUSVZFX0NMQVNTID0gJ2Nkay1yZXNpemFibGUtb3ZlcmxheS10aHVtYi1hY3RpdmUnO1xuXG4vKipcbiAqIEJhc2UgY2xhc3MgZm9yIFJlc2l6YWJsZSBkaXJlY3RpdmVzIHdoaWNoIGFyZSBhcHBsaWVkIHRvIGNvbHVtbiBoZWFkZXJzIHRvIG1ha2UgdGhvc2UgY29sdW1uc1xuICogcmVzaXphYmxlLlxuICovXG5ARGlyZWN0aXZlKClcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBSZXNpemFibGU8SGFuZGxlQ29tcG9uZW50IGV4dGVuZHMgUmVzaXplT3ZlcmxheUhhbmRsZT5cbiAgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3lcbntcbiAgcHJvdGVjdGVkIGlzUmVzaXphYmxlID0gdHJ1ZTtcblxuICBwcm90ZWN0ZWQgbWluV2lkdGhQeEludGVybmFsOiBudW1iZXIgPSAwO1xuICBwcm90ZWN0ZWQgbWF4V2lkdGhQeEludGVybmFsOiBudW1iZXIgPSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcblxuICBwcm90ZWN0ZWQgaW5saW5lSGFuZGxlPzogSFRNTEVsZW1lbnQ7XG4gIHByb3RlY3RlZCBvdmVybGF5UmVmPzogT3ZlcmxheVJlZjtcbiAgcHJvdGVjdGVkIHJlYWRvbmx5IGRlc3Ryb3llZCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgcHJvdGVjdGVkIGFic3RyYWN0IHJlYWRvbmx5IGNvbHVtbkRlZjogQ2RrQ29sdW1uRGVmO1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgcmVhZG9ubHkgY29sdW1uUmVzaXplOiBDb2x1bW5SZXNpemU7XG4gIHByb3RlY3RlZCBhYnN0cmFjdCByZWFkb25seSBkaXJlY3Rpb25hbGl0eTogRGlyZWN0aW9uYWxpdHk7XG4gIHByb3RlY3RlZCBhYnN0cmFjdCByZWFkb25seSBkb2N1bWVudDogRG9jdW1lbnQ7XG4gIHByb3RlY3RlZCBhYnN0cmFjdCByZWFkb25seSBlbGVtZW50UmVmOiBFbGVtZW50UmVmO1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgcmVhZG9ubHkgZXZlbnREaXNwYXRjaGVyOiBIZWFkZXJSb3dFdmVudERpc3BhdGNoZXI7XG4gIHByb3RlY3RlZCBhYnN0cmFjdCByZWFkb25seSBpbmplY3RvcjogSW5qZWN0b3I7XG4gIHByb3RlY3RlZCBhYnN0cmFjdCByZWFkb25seSBuZ1pvbmU6IE5nWm9uZTtcbiAgcHJvdGVjdGVkIGFic3RyYWN0IHJlYWRvbmx5IG92ZXJsYXk6IE92ZXJsYXk7XG4gIHByb3RlY3RlZCBhYnN0cmFjdCByZWFkb25seSByZXNpemVOb3RpZmllcjogQ29sdW1uUmVzaXplTm90aWZpZXJTb3VyY2U7XG4gIHByb3RlY3RlZCBhYnN0cmFjdCByZWFkb25seSByZXNpemVTdHJhdGVneTogUmVzaXplU3RyYXRlZ3k7XG4gIHByb3RlY3RlZCBhYnN0cmFjdCByZWFkb25seSBzdHlsZVNjaGVkdWxlcjogX0NvYWxlc2NlZFN0eWxlU2NoZWR1bGVyO1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgcmVhZG9ubHkgdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZjtcbiAgcHJvdGVjdGVkIGFic3RyYWN0IHJlYWRvbmx5IGNoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZjtcblxuICBwcml2YXRlIF92aWV3SW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgcHJpdmF0ZSBfaXNEZXN0cm95ZWQgPSBmYWxzZTtcblxuICAvKiogVGhlIG1pbmltdW0gd2lkdGggdG8gYWxsb3cgdGhlIGNvbHVtbiB0byBiZSBzaXplZCB0by4gKi9cbiAgZ2V0IG1pbldpZHRoUHgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5taW5XaWR0aFB4SW50ZXJuYWw7XG4gIH1cbiAgc2V0IG1pbldpZHRoUHgodmFsdWU6IG51bWJlcikge1xuICAgIGlmICh2YWx1ZSkge1xuICAgICAgdGhpcy5taW5XaWR0aFB4SW50ZXJuYWwgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICB0aGlzLmNvbHVtblJlc2l6ZS5zZXRSZXNpemVkKCk7XG4gICAgaWYgKHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50ICYmIHRoaXMuX3ZpZXdJbml0aWFsaXplZCkge1xuICAgICAgdGhpcy5fYXBwbHlNaW5XaWR0aFB4KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFRoZSBtYXhpbXVtIHdpZHRoIHRvIGFsbG93IHRoZSBjb2x1bW4gdG8gYmUgc2l6ZWQgdG8uICovXG4gIGdldCBtYXhXaWR0aFB4KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMubWF4V2lkdGhQeEludGVybmFsO1xuICB9XG4gIHNldCBtYXhXaWR0aFB4KHZhbHVlOiBudW1iZXIpIHtcbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIHRoaXMubWF4V2lkdGhQeEludGVybmFsID0gdmFsdWU7XG4gICAgfVxuXG4gICAgdGhpcy5jb2x1bW5SZXNpemUuc2V0UmVzaXplZCgpO1xuICAgIGlmICh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCAmJiB0aGlzLl92aWV3SW5pdGlhbGl6ZWQpIHtcbiAgICAgIHRoaXMuX2FwcGx5TWF4V2lkdGhQeCgpO1xuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICBpZiAodGhpcy5pc1Jlc2l6YWJsZSkge1xuICAgICAgdGhpcy5fbGlzdGVuRm9yUm93SG92ZXJFdmVudHMoKTtcbiAgICAgIHRoaXMuX2xpc3RlbkZvclJlc2l6ZUV2ZW50cygpO1xuICAgICAgdGhpcy5fYXBwZW5kSW5saW5lSGFuZGxlKCk7XG5cbiAgICAgIHRoaXMuc3R5bGVTY2hlZHVsZXIuc2NoZWR1bGVFbmQoKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5faXNEZXN0cm95ZWQpIHJldHVybjtcbiAgICAgICAgdGhpcy5fdmlld0luaXRpYWxpemVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fYXBwbHlNaW5XaWR0aFB4KCk7XG4gICAgICAgIHRoaXMuX2FwcGx5TWF4V2lkdGhQeCgpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5faXNEZXN0cm95ZWQgPSB0cnVlO1xuICAgIHRoaXMuZGVzdHJveWVkLm5leHQoKTtcbiAgICB0aGlzLmRlc3Ryb3llZC5jb21wbGV0ZSgpO1xuICAgIHRoaXMuaW5saW5lSGFuZGxlPy5yZW1vdmUoKTtcbiAgICB0aGlzLm92ZXJsYXlSZWY/LmRpc3Bvc2UoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBhYnN0cmFjdCBnZXRJbmxpbmVIYW5kbGVDc3NDbGFzc05hbWUoKTogc3RyaW5nO1xuXG4gIHByb3RlY3RlZCBhYnN0cmFjdCBnZXRPdmVybGF5SGFuZGxlQ29tcG9uZW50VHlwZSgpOiBUeXBlPEhhbmRsZUNvbXBvbmVudD47XG5cbiAgcHJpdmF0ZSBfY3JlYXRlT3ZlcmxheUZvckhhbmRsZSgpOiBPdmVybGF5UmVmIHtcbiAgICAvLyBVc2Ugb2Ygb3ZlcmxheXMgYWxsb3dzIHVzIHRvIHByb3Blcmx5IGNhcHR1cmUgY2xpY2sgZXZlbnRzIHNwYW5uaW5nIHBhcnRzXG4gICAgLy8gb2YgdHdvIHRhYmxlIGNlbGxzIGFuZCBpcyBhbHNvIHVzZWZ1bCBmb3IgZGlzcGxheWluZyBhIHJlc2l6ZSB0aHVtYlxuICAgIC8vIG92ZXIgYm90aCBjZWxscyBhbmQgZXh0ZW5kaW5nIGl0IGRvd24gdGhlIHRhYmxlIGFzIG5lZWRlZC5cblxuICAgIGNvbnN0IGlzUnRsID0gdGhpcy5kaXJlY3Rpb25hbGl0eS52YWx1ZSA9PT0gJ3J0bCc7XG4gICAgY29uc3QgcG9zaXRpb25TdHJhdGVneSA9IHRoaXMub3ZlcmxheVxuICAgICAgLnBvc2l0aW9uKClcbiAgICAgIC5mbGV4aWJsZUNvbm5lY3RlZFRvKHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KVxuICAgICAgLndpdGhGbGV4aWJsZURpbWVuc2lvbnMoZmFsc2UpXG4gICAgICAud2l0aEdyb3dBZnRlck9wZW4oZmFsc2UpXG4gICAgICAud2l0aFB1c2goZmFsc2UpXG4gICAgICAud2l0aERlZmF1bHRPZmZzZXRYKGlzUnRsID8gMSA6IDApXG4gICAgICAud2l0aFBvc2l0aW9ucyhbXG4gICAgICAgIHtcbiAgICAgICAgICBvcmlnaW5YOiBpc1J0bCA/ICdzdGFydCcgOiAnZW5kJyxcbiAgICAgICAgICBvcmlnaW5ZOiAndG9wJyxcbiAgICAgICAgICBvdmVybGF5WDogJ2NlbnRlcicsXG4gICAgICAgICAgb3ZlcmxheVk6ICd0b3AnLFxuICAgICAgICB9LFxuICAgICAgXSk7XG5cbiAgICByZXR1cm4gdGhpcy5vdmVybGF5LmNyZWF0ZSh7XG4gICAgICAvLyBBbHdheXMgcG9zaXRpb24gdGhlIG92ZXJsYXkgYmFzZWQgb24gbGVmdC1pbmRleGVkIGNvb3JkaW5hdGVzLlxuICAgICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICAgIGRpc3Bvc2VPbk5hdmlnYXRpb246IHRydWUsXG4gICAgICBwb3NpdGlvblN0cmF0ZWd5LFxuICAgICAgc2Nyb2xsU3RyYXRlZ3k6IHRoaXMub3ZlcmxheS5zY3JvbGxTdHJhdGVnaWVzLnJlcG9zaXRpb24oKSxcbiAgICAgIHdpZHRoOiAnMTZweCcsXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF9saXN0ZW5Gb3JSb3dIb3ZlckV2ZW50cygpOiB2b2lkIHtcbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgY29uc3QgdGFrZVVudGlsRGVzdHJveWVkID0gdGFrZVVudGlsPGJvb2xlYW4+KHRoaXMuZGVzdHJveWVkKTtcblxuICAgIHRoaXMuZXZlbnREaXNwYXRjaGVyXG4gICAgICAucmVzaXplT3ZlcmxheVZpc2libGVGb3JIZWFkZXJSb3coY2xvc2VzdChlbGVtZW50LCBIRUFERVJfUk9XX1NFTEVDVE9SKSEpXG4gICAgICAucGlwZSh0YWtlVW50aWxEZXN0cm95ZWQpXG4gICAgICAuc3Vic2NyaWJlKGhvdmVyaW5nUm93ID0+IHtcbiAgICAgICAgaWYgKGhvdmVyaW5nUm93KSB7XG4gICAgICAgICAgaWYgKCF0aGlzLm92ZXJsYXlSZWYpIHtcbiAgICAgICAgICAgIHRoaXMub3ZlcmxheVJlZiA9IHRoaXMuX2NyZWF0ZU92ZXJsYXlGb3JIYW5kbGUoKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLl9zaG93SGFuZGxlT3ZlcmxheSgpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMub3ZlcmxheVJlZikge1xuICAgICAgICAgIC8vIHRvZG8gLSBjYW4ndCBkZXRhY2ggZHVyaW5nIGFuIGFjdGl2ZSByZXNpemUgLSBuZWVkIHRvIHdvcmsgdGhhdCBvdXRcbiAgICAgICAgICB0aGlzLm92ZXJsYXlSZWYuZGV0YWNoKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfbGlzdGVuRm9yUmVzaXplRXZlbnRzKCkge1xuICAgIGNvbnN0IHRha2VVbnRpbERlc3Ryb3llZCA9IHRha2VVbnRpbDxDb2x1bW5TaXplQWN0aW9uPih0aGlzLmRlc3Ryb3llZCk7XG5cbiAgICBtZXJnZSh0aGlzLnJlc2l6ZU5vdGlmaWVyLnJlc2l6ZUNhbmNlbGVkLCB0aGlzLnJlc2l6ZU5vdGlmaWVyLnRyaWdnZXJSZXNpemUpXG4gICAgICAucGlwZShcbiAgICAgICAgdGFrZVVudGlsRGVzdHJveWVkLFxuICAgICAgICBmaWx0ZXIoY29sdW1uU2l6ZSA9PiBjb2x1bW5TaXplLmNvbHVtbklkID09PSB0aGlzLmNvbHVtbkRlZi5uYW1lKVxuICAgICAgKVxuICAgICAgLnN1YnNjcmliZSgoeyBzaXplLCBwcmV2aW91c1NpemUsIGNvbXBsZXRlSW1tZWRpYXRlbHkgfSkgPT4ge1xuICAgICAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jbGFzc0xpc3QuYWRkKE9WRVJMQVlfQUNUSVZFX0NMQVNTKTtcbiAgICAgICAgdGhpcy5fYXBwbHlTaXplKHNpemUsIHByZXZpb3VzU2l6ZSk7XG5cbiAgICAgICAgaWYgKGNvbXBsZXRlSW1tZWRpYXRlbHkpIHtcbiAgICAgICAgICB0aGlzLl9jb21wbGV0ZVJlc2l6ZU9wZXJhdGlvbigpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIG1lcmdlKHRoaXMucmVzaXplTm90aWZpZXIucmVzaXplQ2FuY2VsZWQsIHRoaXMucmVzaXplTm90aWZpZXIucmVzaXplQ29tcGxldGVkKVxuICAgICAgLnBpcGUodGFrZVVudGlsRGVzdHJveWVkKVxuICAgICAgLnN1YnNjcmliZShjb2x1bW5TaXplID0+IHtcbiAgICAgICAgdGhpcy5fY2xlYW5VcEFmdGVyUmVzaXplKGNvbHVtblNpemUpO1xuICAgICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF9jb21wbGV0ZVJlc2l6ZU9wZXJhdGlvbigpOiB2b2lkIHtcbiAgICB0aGlzLm5nWm9uZS5ydW4oKCkgPT4ge1xuICAgICAgdGhpcy5yZXNpemVOb3RpZmllci5yZXNpemVDb21wbGV0ZWQubmV4dCh7XG4gICAgICAgIGNvbHVtbklkOiB0aGlzLmNvbHVtbkRlZi5uYW1lLFxuICAgICAgICBzaXplOiB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5vZmZzZXRXaWR0aCxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfY2xlYW5VcEFmdGVyUmVzaXplKGNvbHVtblNpemU6IENvbHVtblNpemVBY3Rpb24pOiB2b2lkIHtcbiAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKE9WRVJMQVlfQUNUSVZFX0NMQVNTKTtcblxuICAgIGlmICh0aGlzLm92ZXJsYXlSZWYgJiYgdGhpcy5vdmVybGF5UmVmLmhhc0F0dGFjaGVkKCkpIHtcbiAgICAgIHRoaXMuX3VwZGF0ZU92ZXJsYXlIYW5kbGVIZWlnaHQoKTtcbiAgICAgIHRoaXMub3ZlcmxheVJlZi51cGRhdGVQb3NpdGlvbigpO1xuXG4gICAgICBpZiAoY29sdW1uU2l6ZS5jb2x1bW5JZCA9PT0gdGhpcy5jb2x1bW5EZWYubmFtZSkge1xuICAgICAgICB0aGlzLmlubGluZUhhbmRsZSEuZm9jdXMoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9jcmVhdGVIYW5kbGVQb3J0YWwoKTogQ29tcG9uZW50UG9ydGFsPEhhbmRsZUNvbXBvbmVudD4ge1xuICAgIGNvbnN0IGluamVjdG9yID0gSW5qZWN0b3IuY3JlYXRlKHtcbiAgICAgIHBhcmVudDogdGhpcy5pbmplY3RvcixcbiAgICAgIHByb3ZpZGVyczogW1xuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogUmVzaXplUmVmLFxuICAgICAgICAgIHVzZVZhbHVlOiBuZXcgUmVzaXplUmVmKFxuICAgICAgICAgICAgdGhpcy5lbGVtZW50UmVmLFxuICAgICAgICAgICAgdGhpcy5vdmVybGF5UmVmISxcbiAgICAgICAgICAgIHRoaXMubWluV2lkdGhQeCxcbiAgICAgICAgICAgIHRoaXMubWF4V2lkdGhQeFxuICAgICAgICAgICksXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIG5ldyBDb21wb25lbnRQb3J0YWwoXG4gICAgICB0aGlzLmdldE92ZXJsYXlIYW5kbGVDb21wb25lbnRUeXBlKCksXG4gICAgICB0aGlzLnZpZXdDb250YWluZXJSZWYsXG4gICAgICBpbmplY3RvclxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIF9zaG93SGFuZGxlT3ZlcmxheSgpOiB2b2lkIHtcbiAgICB0aGlzLl91cGRhdGVPdmVybGF5SGFuZGxlSGVpZ2h0KCk7XG4gICAgdGhpcy5vdmVybGF5UmVmIS5hdHRhY2godGhpcy5fY3JlYXRlSGFuZGxlUG9ydGFsKCkpO1xuXG4gICAgLy8gTmVlZGVkIHRvIGVuc3VyZSB0aGF0IGFsbCBvZiB0aGUgbGlmZWN5Y2xlIGhvb2tzIGluc2lkZSB0aGUgb3ZlcmxheSBydW4gaW1tZWRpYXRlbHkuXG4gICAgdGhpcy5jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIHByaXZhdGUgX3VwZGF0ZU92ZXJsYXlIYW5kbGVIZWlnaHQoKSB7XG4gICAgdGhpcy5vdmVybGF5UmVmIS51cGRhdGVTaXplKHsgaGVpZ2h0OiB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5vZmZzZXRIZWlnaHQgfSk7XG4gIH1cblxuICBwcml2YXRlIF9hcHBseVNpemUoc2l6ZUluUGl4ZWxzOiBudW1iZXIsIHByZXZpb3VzU2l6ZT86IG51bWJlcik6IHZvaWQge1xuICAgIGNvbnN0IHNpemVUb0FwcGx5ID0gTWF0aC5taW4oTWF0aC5tYXgoc2l6ZUluUGl4ZWxzLCB0aGlzLm1pbldpZHRoUHgsIDApLCB0aGlzLm1heFdpZHRoUHgpO1xuXG4gICAgdGhpcy5yZXNpemVTdHJhdGVneS5hcHBseUNvbHVtblNpemUoXG4gICAgICB0aGlzLmNvbHVtbkRlZi5jc3NDbGFzc0ZyaWVuZGx5TmFtZSxcbiAgICAgIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LFxuICAgICAgc2l6ZVRvQXBwbHksXG4gICAgICBwcmV2aW91c1NpemVcbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBfYXBwbHlNaW5XaWR0aFB4KCk6IHZvaWQge1xuICAgIHRoaXMucmVzaXplU3RyYXRlZ3kuYXBwbHlNaW5Db2x1bW5TaXplKFxuICAgICAgdGhpcy5jb2x1bW5EZWYuY3NzQ2xhc3NGcmllbmRseU5hbWUsXG4gICAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCxcbiAgICAgIHRoaXMubWluV2lkdGhQeFxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIF9hcHBseU1heFdpZHRoUHgoKTogdm9pZCB7XG4gICAgdGhpcy5yZXNpemVTdHJhdGVneS5hcHBseU1heENvbHVtblNpemUoXG4gICAgICB0aGlzLmNvbHVtbkRlZi5jc3NDbGFzc0ZyaWVuZGx5TmFtZSxcbiAgICAgIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LFxuICAgICAgdGhpcy5tYXhXaWR0aFB4XG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgX2FwcGVuZElubGluZUhhbmRsZSgpOiB2b2lkIHtcbiAgICB0aGlzLnN0eWxlU2NoZWR1bGVyLnNjaGVkdWxlKCgpID0+IHtcbiAgICAgIHRoaXMuaW5saW5lSGFuZGxlID0gdGhpcy5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIHRoaXMuaW5saW5lSGFuZGxlLnRhYkluZGV4ID0gMDtcbiAgICAgIHRoaXMuaW5saW5lSGFuZGxlLmNsYXNzTmFtZSA9IHRoaXMuZ2V0SW5saW5lSGFuZGxlQ3NzQ2xhc3NOYW1lKCk7XG5cbiAgICAgIC8vIFRPRE86IEFwcGx5IGNvcnJlY3QgYXJpYSByb2xlIChwcm9iYWJseSBzbGlkZXIpIGFmdGVyIGExMXkgc3BlYyBxdWVzdGlvbnMgcmVzb2x2ZWQuXG5cbiAgICAgIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuaW5saW5lSGFuZGxlKTtcbiAgICB9KTtcbiAgfVxufVxuIl19