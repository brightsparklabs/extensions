/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Injectable } from '@angular/core';
import { combineLatest, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map, share, skip, startWith } from 'rxjs/operators';
import { closest } from './polyfill';
import { HEADER_ROW_SELECTOR } from './selectors';
import * as i0 from "@angular/core";
/** Coordinates events between the column resize directives. */
export class HeaderRowEventDispatcher {
    constructor(_ngZone) {
        this._ngZone = _ngZone;
        /**
         * Emits the currently hovered header cell or null when no header cells are hovered.
         * Exposed publicly for events to feed in, but subscribers should use headerCellHoveredDistinct,
         * defined below.
         */
        this.headerCellHovered = new Subject();
        /**
         * Emits the header cell for which a user-triggered resize is active or null
         * when no resize is in progress.
         */
        this.overlayHandleActiveForCell = new Subject();
        /** Distinct and shared version of headerCellHovered. */
        this.headerCellHoveredDistinct = this.headerCellHovered.pipe(distinctUntilChanged(), share());
        /**
         * Emits the header that is currently hovered or hosting an active resize event (with active
         * taking precedence).
         */
        this.headerRowHoveredOrActiveDistinct = combineLatest([
            this.headerCellHoveredDistinct.pipe(map(cell => closest(cell, HEADER_ROW_SELECTOR)), startWith(null), distinctUntilChanged()),
            this.overlayHandleActiveForCell.pipe(map(cell => closest(cell, HEADER_ROW_SELECTOR)), startWith(null), distinctUntilChanged()),
        ]).pipe(skip(1), // Ignore initial [null, null] emission.
        map(([hovered, active]) => active || hovered), distinctUntilChanged(), share());
        this._headerRowHoveredOrActiveDistinctReenterZone = this.headerRowHoveredOrActiveDistinct.pipe(this._enterZone(), share());
        // Optimization: Share row events observable with subsequent callers.
        // At startup, calls will be sequential by row (and typically there's only one).
        this._lastSeenRow = null;
        this._lastSeenRowHover = null;
    }
    /**
     * Emits whether the specified row should show its overlay controls.
     * Emission occurs within the NgZone.
     */
    resizeOverlayVisibleForHeaderRow(row) {
        if (row !== this._lastSeenRow) {
            this._lastSeenRow = row;
            this._lastSeenRowHover = this._headerRowHoveredOrActiveDistinctReenterZone.pipe(map(hoveredRow => hoveredRow === row), distinctUntilChanged(), share());
        }
        return this._lastSeenRowHover;
    }
    _enterZone() {
        return (source) => new Observable(observer => source.subscribe({
            next: value => this._ngZone.run(() => observer.next(value)),
            error: err => observer.error(err),
            complete: () => observer.complete(),
        }));
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: HeaderRowEventDispatcher, deps: [{ token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: HeaderRowEventDispatcher }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: HeaderRowEventDispatcher, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i0.NgZone }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnQtZGlzcGF0Y2hlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2V4dGVuc2lvbnMvY29sdW1uLXJlc2l6ZS9ldmVudC1kaXNwYXRjaGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBRSxVQUFVLEVBQVUsTUFBTSxlQUFlLENBQUM7QUFDbkQsT0FBTyxFQUFFLGFBQWEsRUFBNEIsVUFBVSxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNwRixPQUFPLEVBQUUsb0JBQW9CLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDbkYsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLFlBQVksQ0FBQztBQUVyQyxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxhQUFhLENBQUM7O0FBRWxELCtEQUErRDtBQUUvRCxNQUFNLE9BQU8sd0JBQXdCO0lBY25DLFlBQTZCLE9BQWU7UUFBZixZQUFPLEdBQVAsT0FBTyxDQUFRO1FBYjVDOzs7O1dBSUc7UUFDTSxzQkFBaUIsR0FBRyxJQUFJLE9BQU8sRUFBa0IsQ0FBQztRQUUzRDs7O1dBR0c7UUFDTSwrQkFBMEIsR0FBRyxJQUFJLE9BQU8sRUFBa0IsQ0FBQztRQUlwRSx3REFBd0Q7UUFDL0MsOEJBQXlCLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7UUFFbEc7OztXQUdHO1FBQ00scUNBQWdDLEdBQUcsYUFBYSxDQUFDO1lBQ3hELElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLENBQ2pDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsbUJBQW1CLENBQUMsQ0FBQyxFQUMvQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQ2Ysb0JBQW9CLEVBQUUsQ0FDdkI7WUFDRCxJQUFJLENBQUMsMEJBQTBCLENBQUMsSUFBSSxDQUNsQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLG1CQUFtQixDQUFDLENBQUMsRUFDL0MsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUNmLG9CQUFvQixFQUFFLENBQ3ZCO1NBQ0YsQ0FBQyxDQUFDLElBQUksQ0FDTCxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsd0NBQXdDO1FBQ2pELEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxFQUFFLEVBQUUsQ0FBQyxNQUFNLElBQUksT0FBTyxDQUFDLEVBQzdDLG9CQUFvQixFQUFFLEVBQ3RCLEtBQUssRUFBRSxDQUNSLENBQUM7UUFFZSxpREFBNEMsR0FDM0QsSUFBSSxDQUFDLGdDQUFnQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUV6RSxxRUFBcUU7UUFDckUsZ0ZBQWdGO1FBQ3hFLGlCQUFZLEdBQW1CLElBQUksQ0FBQztRQUNwQyxzQkFBaUIsR0FBK0IsSUFBSSxDQUFDO0lBakNkLENBQUM7SUFtQ2hEOzs7T0FHRztJQUNILGdDQUFnQyxDQUFDLEdBQVk7UUFDM0MsSUFBSSxHQUFHLEtBQUssSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQzlCLElBQUksQ0FBQyxZQUFZLEdBQUcsR0FBRyxDQUFDO1lBQ3hCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsNENBQTRDLENBQUMsSUFBSSxDQUM3RSxHQUFHLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxVQUFVLEtBQUssR0FBRyxDQUFDLEVBQ3JDLG9CQUFvQixFQUFFLEVBQ3RCLEtBQUssRUFBRSxDQUNSLENBQUM7UUFDSixDQUFDO1FBRUQsT0FBTyxJQUFJLENBQUMsaUJBQWtCLENBQUM7SUFDakMsQ0FBQztJQUVPLFVBQVU7UUFDaEIsT0FBTyxDQUFDLE1BQXFCLEVBQUUsRUFBRSxDQUMvQixJQUFJLFVBQVUsQ0FBSSxRQUFRLENBQUMsRUFBRSxDQUMzQixNQUFNLENBQUMsU0FBUyxDQUFDO1lBQ2YsSUFBSSxFQUFFLEtBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMzRCxLQUFLLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQztZQUNqQyxRQUFRLEVBQUUsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRTtTQUNwQyxDQUFDLENBQ0gsQ0FBQztJQUNOLENBQUM7aUlBM0VVLHdCQUF3QjtxSUFBeEIsd0JBQXdCOzsyRkFBeEIsd0JBQXdCO2tCQURwQyxVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7IEluamVjdGFibGUsIE5nWm9uZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgY29tYmluZUxhdGVzdCwgTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uLCBPYnNlcnZhYmxlLCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBkaXN0aW5jdFVudGlsQ2hhbmdlZCwgbWFwLCBzaGFyZSwgc2tpcCwgc3RhcnRXaXRoIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgY2xvc2VzdCB9IGZyb20gJy4vcG9seWZpbGwnO1xuXG5pbXBvcnQgeyBIRUFERVJfUk9XX1NFTEVDVE9SIH0gZnJvbSAnLi9zZWxlY3RvcnMnO1xuXG4vKiogQ29vcmRpbmF0ZXMgZXZlbnRzIGJldHdlZW4gdGhlIGNvbHVtbiByZXNpemUgZGlyZWN0aXZlcy4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBIZWFkZXJSb3dFdmVudERpc3BhdGNoZXIge1xuICAvKipcbiAgICogRW1pdHMgdGhlIGN1cnJlbnRseSBob3ZlcmVkIGhlYWRlciBjZWxsIG9yIG51bGwgd2hlbiBubyBoZWFkZXIgY2VsbHMgYXJlIGhvdmVyZWQuXG4gICAqIEV4cG9zZWQgcHVibGljbHkgZm9yIGV2ZW50cyB0byBmZWVkIGluLCBidXQgc3Vic2NyaWJlcnMgc2hvdWxkIHVzZSBoZWFkZXJDZWxsSG92ZXJlZERpc3RpbmN0LFxuICAgKiBkZWZpbmVkIGJlbG93LlxuICAgKi9cbiAgcmVhZG9ubHkgaGVhZGVyQ2VsbEhvdmVyZWQgPSBuZXcgU3ViamVjdDxFbGVtZW50IHwgbnVsbD4oKTtcblxuICAvKipcbiAgICogRW1pdHMgdGhlIGhlYWRlciBjZWxsIGZvciB3aGljaCBhIHVzZXItdHJpZ2dlcmVkIHJlc2l6ZSBpcyBhY3RpdmUgb3IgbnVsbFxuICAgKiB3aGVuIG5vIHJlc2l6ZSBpcyBpbiBwcm9ncmVzcy5cbiAgICovXG4gIHJlYWRvbmx5IG92ZXJsYXlIYW5kbGVBY3RpdmVGb3JDZWxsID0gbmV3IFN1YmplY3Q8RWxlbWVudCB8IG51bGw+KCk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBfbmdab25lOiBOZ1pvbmUpIHt9XG5cbiAgLyoqIERpc3RpbmN0IGFuZCBzaGFyZWQgdmVyc2lvbiBvZiBoZWFkZXJDZWxsSG92ZXJlZC4gKi9cbiAgcmVhZG9ubHkgaGVhZGVyQ2VsbEhvdmVyZWREaXN0aW5jdCA9IHRoaXMuaGVhZGVyQ2VsbEhvdmVyZWQucGlwZShkaXN0aW5jdFVudGlsQ2hhbmdlZCgpLCBzaGFyZSgpKTtcblxuICAvKipcbiAgICogRW1pdHMgdGhlIGhlYWRlciB0aGF0IGlzIGN1cnJlbnRseSBob3ZlcmVkIG9yIGhvc3RpbmcgYW4gYWN0aXZlIHJlc2l6ZSBldmVudCAod2l0aCBhY3RpdmVcbiAgICogdGFraW5nIHByZWNlZGVuY2UpLlxuICAgKi9cbiAgcmVhZG9ubHkgaGVhZGVyUm93SG92ZXJlZE9yQWN0aXZlRGlzdGluY3QgPSBjb21iaW5lTGF0ZXN0KFtcbiAgICB0aGlzLmhlYWRlckNlbGxIb3ZlcmVkRGlzdGluY3QucGlwZShcbiAgICAgIG1hcChjZWxsID0+IGNsb3Nlc3QoY2VsbCwgSEVBREVSX1JPV19TRUxFQ1RPUikpLFxuICAgICAgc3RhcnRXaXRoKG51bGwpLFxuICAgICAgZGlzdGluY3RVbnRpbENoYW5nZWQoKVxuICAgICksXG4gICAgdGhpcy5vdmVybGF5SGFuZGxlQWN0aXZlRm9yQ2VsbC5waXBlKFxuICAgICAgbWFwKGNlbGwgPT4gY2xvc2VzdChjZWxsLCBIRUFERVJfUk9XX1NFTEVDVE9SKSksXG4gICAgICBzdGFydFdpdGgobnVsbCksXG4gICAgICBkaXN0aW5jdFVudGlsQ2hhbmdlZCgpXG4gICAgKSxcbiAgXSkucGlwZShcbiAgICBza2lwKDEpLCAvLyBJZ25vcmUgaW5pdGlhbCBbbnVsbCwgbnVsbF0gZW1pc3Npb24uXG4gICAgbWFwKChbaG92ZXJlZCwgYWN0aXZlXSkgPT4gYWN0aXZlIHx8IGhvdmVyZWQpLFxuICAgIGRpc3RpbmN0VW50aWxDaGFuZ2VkKCksXG4gICAgc2hhcmUoKVxuICApO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgX2hlYWRlclJvd0hvdmVyZWRPckFjdGl2ZURpc3RpbmN0UmVlbnRlclpvbmUgPVxuICAgIHRoaXMuaGVhZGVyUm93SG92ZXJlZE9yQWN0aXZlRGlzdGluY3QucGlwZSh0aGlzLl9lbnRlclpvbmUoKSwgc2hhcmUoKSk7XG5cbiAgLy8gT3B0aW1pemF0aW9uOiBTaGFyZSByb3cgZXZlbnRzIG9ic2VydmFibGUgd2l0aCBzdWJzZXF1ZW50IGNhbGxlcnMuXG4gIC8vIEF0IHN0YXJ0dXAsIGNhbGxzIHdpbGwgYmUgc2VxdWVudGlhbCBieSByb3cgKGFuZCB0eXBpY2FsbHkgdGhlcmUncyBvbmx5IG9uZSkuXG4gIHByaXZhdGUgX2xhc3RTZWVuUm93OiBFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgX2xhc3RTZWVuUm93SG92ZXI6IE9ic2VydmFibGU8Ym9vbGVhbj4gfCBudWxsID0gbnVsbDtcblxuICAvKipcbiAgICogRW1pdHMgd2hldGhlciB0aGUgc3BlY2lmaWVkIHJvdyBzaG91bGQgc2hvdyBpdHMgb3ZlcmxheSBjb250cm9scy5cbiAgICogRW1pc3Npb24gb2NjdXJzIHdpdGhpbiB0aGUgTmdab25lLlxuICAgKi9cbiAgcmVzaXplT3ZlcmxheVZpc2libGVGb3JIZWFkZXJSb3cocm93OiBFbGVtZW50KTogT2JzZXJ2YWJsZTxib29sZWFuPiB7XG4gICAgaWYgKHJvdyAhPT0gdGhpcy5fbGFzdFNlZW5Sb3cpIHtcbiAgICAgIHRoaXMuX2xhc3RTZWVuUm93ID0gcm93O1xuICAgICAgdGhpcy5fbGFzdFNlZW5Sb3dIb3ZlciA9IHRoaXMuX2hlYWRlclJvd0hvdmVyZWRPckFjdGl2ZURpc3RpbmN0UmVlbnRlclpvbmUucGlwZShcbiAgICAgICAgbWFwKGhvdmVyZWRSb3cgPT4gaG92ZXJlZFJvdyA9PT0gcm93KSxcbiAgICAgICAgZGlzdGluY3RVbnRpbENoYW5nZWQoKSxcbiAgICAgICAgc2hhcmUoKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fbGFzdFNlZW5Sb3dIb3ZlciE7XG4gIH1cblxuICBwcml2YXRlIF9lbnRlclpvbmU8VD4oKTogTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uPFQ+IHtcbiAgICByZXR1cm4gKHNvdXJjZTogT2JzZXJ2YWJsZTxUPikgPT5cbiAgICAgIG5ldyBPYnNlcnZhYmxlPFQ+KG9ic2VydmVyID0+XG4gICAgICAgIHNvdXJjZS5zdWJzY3JpYmUoe1xuICAgICAgICAgIG5leHQ6IHZhbHVlID0+IHRoaXMuX25nWm9uZS5ydW4oKCkgPT4gb2JzZXJ2ZXIubmV4dCh2YWx1ZSkpLFxuICAgICAgICAgIGVycm9yOiBlcnIgPT4gb2JzZXJ2ZXIuZXJyb3IoZXJyKSxcbiAgICAgICAgICBjb21wbGV0ZTogKCkgPT4gb2JzZXJ2ZXIuY29tcGxldGUoKSxcbiAgICAgICAgfSlcbiAgICAgICk7XG4gIH1cbn1cbiJdfQ==