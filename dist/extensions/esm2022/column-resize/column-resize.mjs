/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive } from '@angular/core';
import { fromEvent, merge, Subject } from 'rxjs';
import { filter, map, mapTo, pairwise, startWith, take, takeUntil } from 'rxjs/operators';
import { HEADER_CELL_SELECTOR, RESIZE_OVERLAY_SELECTOR } from './selectors';
import { closest } from './polyfill';
import * as i0 from "@angular/core";
const HOVER_OR_ACTIVE_CLASS = 'cdk-column-resize-hover-or-active';
const WITH_RESIZED_COLUMN_CLASS = 'cdk-column-resize-with-resized-column';
let nextId = 0;
/**
 * Base class for ColumnResize directives which attach to mat-table elements to
 * provide common events and services for column resizing.
 */
export class ColumnResize {
    constructor() {
        this.destroyed = new Subject();
        /** Unique ID for this table instance. */
        this.selectorId = `${++nextId}`;
    }
    ngAfterViewInit() {
        this.elementRef.nativeElement.classList.add(this.getUniqueCssClass());
        this._listenForRowHoverEvents();
        this._listenForResizeActivity();
        this._listenForHoverActivity();
    }
    ngOnDestroy() {
        this.destroyed.next();
        this.destroyed.complete();
    }
    /** Gets the unique CSS class name for this table instance. */
    getUniqueCssClass() {
        return `cdk-column-resize-${this.selectorId}`;
    }
    /** Called when a column in the table is resized. Applies a css class to the table element. */
    setResized() {
        this.elementRef.nativeElement.classList.add(WITH_RESIZED_COLUMN_CLASS);
    }
    _listenForRowHoverEvents() {
        this.ngZone.runOutsideAngular(() => {
            const element = this.elementRef.nativeElement;
            fromEvent(element, 'mouseover')
                .pipe(map(event => closest(event.target, HEADER_CELL_SELECTOR)), takeUntil(this.destroyed))
                .subscribe(this.eventDispatcher.headerCellHovered);
            fromEvent(element, 'mouseleave')
                .pipe(filter(event => !!event.relatedTarget &&
                !event.relatedTarget.matches(RESIZE_OVERLAY_SELECTOR)), mapTo(null), takeUntil(this.destroyed))
                .subscribe(this.eventDispatcher.headerCellHovered);
        });
    }
    _listenForResizeActivity() {
        merge(this.eventDispatcher.overlayHandleActiveForCell.pipe(mapTo(undefined)), this.notifier.triggerResize.pipe(mapTo(undefined)), this.notifier.resizeCompleted.pipe(mapTo(undefined)))
            .pipe(take(1), takeUntil(this.destroyed))
            .subscribe(() => {
            this.setResized();
        });
    }
    _listenForHoverActivity() {
        this.eventDispatcher.headerRowHoveredOrActiveDistinct
            .pipe(startWith(null), pairwise(), takeUntil(this.destroyed))
            .subscribe(([previousRow, hoveredRow]) => {
            if (hoveredRow) {
                hoveredRow.classList.add(HOVER_OR_ACTIVE_CLASS);
            }
            if (previousRow) {
                previousRow.classList.remove(HOVER_OR_ACTIVE_CLASS);
            }
        });
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: ColumnResize, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    /** @nocollapse */ static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.0.1", type: ColumnResize, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: ColumnResize, decorators: [{
            type: Directive
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sdW1uLXJlc2l6ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2V4dGVuc2lvbnMvY29sdW1uLXJlc2l6ZS9jb2x1bW4tcmVzaXplLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBaUIsU0FBUyxFQUFpQyxNQUFNLGVBQWUsQ0FBQztBQUN4RixPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDakQsT0FBTyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRzFGLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSx1QkFBdUIsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUU1RSxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sWUFBWSxDQUFDOztBQUVyQyxNQUFNLHFCQUFxQixHQUFHLG1DQUFtQyxDQUFDO0FBQ2xFLE1BQU0seUJBQXlCLEdBQUcsdUNBQXVDLENBQUM7QUFFMUUsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBRWY7OztHQUdHO0FBRUgsTUFBTSxPQUFnQixZQUFZO0lBRGxDO1FBRXFCLGNBQVMsR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDO1FBWW5ELHlDQUF5QztRQUN0QixlQUFVLEdBQUcsR0FBRyxFQUFFLE1BQU0sRUFBRSxDQUFDO0tBNEUvQztJQXZFQyxlQUFlO1FBQ2IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDO1FBRXRFLElBQUksQ0FBQyx3QkFBd0IsRUFBRSxDQUFDO1FBQ2hDLElBQUksQ0FBQyx3QkFBd0IsRUFBRSxDQUFDO1FBQ2hDLElBQUksQ0FBQyx1QkFBdUIsRUFB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WTtrQkFEakMsU0FBUyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgeyBBZnRlclZpZXdJbml0LCBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIE5nWm9uZSwgT25EZXN0cm95IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBmcm9tRXZlbnQsIG1lcmdlLCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBmaWx0ZXIsIG1hcCwgbWFwVG8sIHBhaXJ3aXNlLCBzdGFydFdpdGgsIHRha2UsIHRha2VVbnRpbCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgQ29sdW1uUmVzaXplTm90aWZpZXIsIENvbHVtblJlc2l6ZU5vdGlmaWVyU291cmNlIH0gZnJvbSAnLi9jb2x1bW4tcmVzaXplLW5vdGlmaWVyJztcbmltcG9ydCB7IEhFQURFUl9DRUxMX1NFTEVDVE9SLCBSRVNJWkVfT1ZFUkxBWV9TRUxFQ1RPUiB9IGZyb20gJy4vc2VsZWN0b3JzJztcbmltcG9ydCB7IEhlYWRlclJvd0V2ZW50RGlzcGF0Y2hlciB9IGZyb20gJy4vZXZlbnQtZGlzcGF0Y2hlcic7XG5pbXBvcnQgeyBjbG9zZXN0IH0gZnJvbSAnLi9wb2x5ZmlsbCc7XG5cbmNvbnN0IEhPVkVSX09SX0FDVElWRV9DTEFTUyA9ICdjZGstY29sdW1uLXJlc2l6ZS1ob3Zlci1vci1hY3RpdmUnO1xuY29uc3QgV0lUSF9SRVNJWkVEX0NPTFVNTl9DTEFTUyA9ICdjZGstY29sdW1uLXJlc2l6ZS13aXRoLXJlc2l6ZWQtY29sdW1uJztcblxubGV0IG5leHRJZCA9IDA7XG5cbi8qKlxuICogQmFzZSBjbGFzcyBmb3IgQ29sdW1uUmVzaXplIGRpcmVjdGl2ZXMgd2hpY2ggYXR0YWNoIHRvIG1hdC10YWJsZSBlbGVtZW50cyB0b1xuICogcHJvdmlkZSBjb21tb24gZXZlbnRzIGFuZCBzZXJ2aWNlcyBmb3IgY29sdW1uIHJlc2l6aW5nLlxuICovXG5ARGlyZWN0aXZlKClcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBDb2x1bW5SZXNpemUgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3kge1xuICBwcm90ZWN0ZWQgcmVhZG9ubHkgZGVzdHJveWVkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKiBQdWJsaWNseSBhY2Nlc3NpYmxlIGludGVyZmFjZSBmb3IgdHJpZ2dlcmluZyBhbmQgYmVpbmcgbm90aWZpZWQgb2YgcmVzaXplcy4gKi9cbiAgYWJzdHJhY3QgcmVhZG9ubHkgY29sdW1uUmVzaXplTm90aWZpZXI6IENvbHVtblJlc2l6ZU5vdGlmaWVyO1xuXG4gIC8qIEVsZW1lbnRSZWYgdGhhdCB0aGlzIGRpcmVjdGl2ZSBpcyBhdHRhY2hlZCB0by4gRXhwb3NlZCBGb3IgdXNlIGJ5IGNvbHVtbi1sZXZlbCBkaXJlY3RpdmVzICovXG4gIGFic3RyYWN0IHJlYWRvbmx5IGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xuXG4gIHByb3RlY3RlZCBhYnN0cmFjdCByZWFkb25seSBldmVudERpc3BhdGNoZXI6IEhlYWRlclJvd0V2ZW50RGlzcGF0Y2hlcjtcbiAgcHJvdGVjdGVkIGFic3RyYWN0IHJlYWRvbmx5IG5nWm9uZTogTmdab25lO1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgcmVhZG9ubHkgbm90aWZpZXI6IENvbHVtblJlc2l6ZU5vdGlmaWVyU291cmNlO1xuXG4gIC8qKiBVbmlxdWUgSUQgZm9yIHRoaXMgdGFibGUgaW5zdGFuY2UuICovXG4gIHByb3RlY3RlZCByZWFkb25seSBzZWxlY3RvcklkID0gYCR7KytuZXh0SWR9YDtcblxuICAvKiogVGhlIGlkIGF0dHJpYnV0ZSBvZiB0aGUgdGFibGUsIGlmIHNwZWNpZmllZC4gKi9cbiAgaWQ/OiBzdHJpbmc7XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNsYXNzTGlzdC5hZGQodGhpcy5nZXRVbmlxdWVDc3NDbGFzcygpKTtcblxuICAgIHRoaXMuX2xpc3RlbkZvclJvd0hvdmVyRXZlbnRzKCk7XG4gICAgdGhpcy5fbGlzdGVuRm9yUmVzaXplQWN0aXZpdHkoKTtcbiAgICB0aGlzLl9saXN0ZW5Gb3JIb3ZlckFjdGl2aXR5KCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLmRlc3Ryb3llZC5uZXh0KCk7XG4gICAgdGhpcy5kZXN0cm95ZWQuY29tcGxldGUoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSB1bmlxdWUgQ1NTIGNsYXNzIG5hbWUgZm9yIHRoaXMgdGFibGUgaW5zdGFuY2UuICovXG4gIGdldFVuaXF1ZUNzc0NsYXNzKCkge1xuICAgIHJldHVybiBgY2RrLWNvbHVtbi1yZXNpemUtJHt0aGlzLnNlbGVjdG9ySWR9YDtcbiAgfVxuXG4gIC8qKiBDYWxsZWQgd2hlbiBhIGNvbHVtbiBpbiB0aGUgdGFibGUgaXMgcmVzaXplZC4gQXBwbGllcyBhIGNzcyBjbGFzcyB0byB0aGUgdGFibGUgZWxlbWVudC4gKi9cbiAgc2V0UmVzaXplZCgpIHtcbiAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jbGFzc0xpc3QuYWRkKFdJVEhfUkVTSVpFRF9DT0xVTU5fQ0xBU1MpO1xuICB9XG5cbiAgcHJpdmF0ZSBfbGlzdGVuRm9yUm93SG92ZXJFdmVudHMoKSB7XG4gICAgdGhpcy5uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgY29uc3QgZWxlbWVudCA9IHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuXG4gICAgICBmcm9tRXZlbnQ8TW91c2VFdmVudD4oZWxlbWVudCwgJ21vdXNlb3ZlcicpXG4gICAgICAgIC5waXBlKFxuICAgICAgICAgIG1hcChldmVudCA9PiBjbG9zZXN0KGV2ZW50LnRhcmdldCwgSEVBREVSX0NFTExfU0VMRUNUT1IpKSxcbiAgICAgICAgICB0YWtlVW50aWwodGhpcy5kZXN0cm95ZWQpXG4gICAgICAgIClcbiAgICAgICAgLnN1YnNjcmliZSh0aGlzLmV2ZW50RGlzcGF0Y2hlci5oZWFkZXJDZWxsSG92ZXJlZCk7XG4gICAgICBmcm9tRXZlbnQ8TW91c2VFdmVudD4oZWxlbWVudCwgJ21vdXNlbGVhdmUnKVxuICAgICAgICAucGlwZShcbiAgICAgICAgICBmaWx0ZXIoXG4gICAgICAgICAgICBldmVudCA9PlxuICAgICAgICAgICAgICAhIWV2ZW50LnJlbGF0ZWRUYXJnZXQgJiZcbiAgICAgICAgICAgICAgIShldmVudC5yZWxhdGVkVGFyZ2V0IGFzIEVsZW1lbnQpLm1hdGNoZXMoUkVTSVpFX09WRVJMQVlfU0VMRUNUT1IpXG4gICAgICAgICAgKSxcbiAgICAgICAgICBtYXBUbyhudWxsKSxcbiAgICAgICAgICB0YWtlVW50aWwodGhpcy5kZXN0cm95ZWQpXG4gICAgICAgIClcbiAgICAgICAgLnN1YnNjcmliZSh0aGlzLmV2ZW50RGlzcGF0Y2hlci5oZWFkZXJDZWxsSG92ZXJlZCk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF9saXN0ZW5Gb3JSZXNpemVBY3Rpdml0eSgpIHtcbiAgICBtZXJnZShcbiAgICAgIHRoaXMuZXZlbnREaXNwYXRjaGVyLm92ZXJsYXlIYW5kbGVBY3RpdmVGb3JDZWxsLnBpcGUobWFwVG8odW5kZWZpbmVkKSksXG4gICAgICB0aGlzLm5vdGlmaWVyLnRyaWdnZXJSZXNpemUucGlwZShtYXBUbyh1bmRlZmluZWQpKSxcbiAgICAgIHRoaXMubm90aWZpZXIucmVzaXplQ29tcGxldGVkLnBpcGUobWFwVG8odW5kZWZpbmVkKSlcbiAgICApXG4gICAgICAucGlwZSh0YWtlKDEpLCB0YWtlVW50aWwodGhpcy5kZXN0cm95ZWQpKVxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIHRoaXMuc2V0UmVzaXplZCgpO1xuICAgICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF9saXN0ZW5Gb3JIb3ZlckFjdGl2aXR5KCkge1xuICAgIHRoaXMuZXZlbnREaXNwYXRjaGVyLmhlYWRlclJvd0hvdmVyZWRPckFjdGl2ZURpc3RpbmN0XG4gICAgICAucGlwZShzdGFydFdpdGgobnVsbCksIHBhaXJ3aXNlKCksIHRha2VVbnRpbCh0aGlzLmRlc3Ryb3llZCkpXG4gICAgICAuc3Vic2NyaWJlKChbcHJldmlvdXNSb3csIGhvdmVyZWRSb3ddKSA9PiB7XG4gICAgICAgIGlmIChob3ZlcmVkUm93KSB7XG4gICAgICAgICAgaG92ZXJlZFJvdy5jbGFzc0xpc3QuYWRkKEhPVkVSX09SX0FDVElWRV9DTEFTUyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByZXZpb3VzUm93KSB7XG4gICAgICAgICAgcHJldmlvdXNSb3cuY2xhc3NMaXN0LnJlbW92ZShIT1ZFUl9PUl9BQ1RJVkVfQ0xBU1MpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfVxufVxuIl19