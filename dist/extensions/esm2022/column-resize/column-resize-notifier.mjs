/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
/**
 * Originating source of column resize events within a table.
 * @docs-private
 */
export class ColumnResizeNotifierSource {
    constructor() {
        /** Emits when an in-progress resize is canceled. */
        this.resizeCanceled = new Subject();
        /** Emits when a resize is applied. */
        this.resizeCompleted = new Subject();
        /** Triggers a resize action. */
        this.triggerResize = new Subject();
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: ColumnResizeNotifierSource, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: ColumnResizeNotifierSource }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: ColumnResizeNotifierSource, decorators: [{
            type: Injectable
        }] });
/** Service for triggering column resizes imperatively or being notified of them. */
export class ColumnResizeNotifier {
    constructor(_source) {
        this._source = _source;
        /** Emits whenever a column is resized. */
        this.resizeCompleted = this._source.resizeCompleted;
    }
    /** Instantly resizes the specified column. */
    resize(columnId, size) {
        this._source.triggerResize.next({
            columnId,
            size,
            completeImmediately: true,
            isStickyColumn: true,
        });
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: ColumnResizeNotifier, deps: [{ token: ColumnResizeNotifierSource }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: ColumnResizeNotifier }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: ColumnResizeNotifier, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: ColumnResizeNotifierSource }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sdW1uLXJlc2l6ZS1ub3RpZmllci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2V4dGVuc2lvbnMvY29sdW1uLXJlc2l6ZS9jb2x1bW4tcmVzaXplLW5vdGlmaWVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFjLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQzs7QUE2QjNDOzs7R0FHRztBQUVILE1BQU0sT0FBTywwQkFBMEI7SUFEdkM7UUFFRSxvREFBb0Q7UUFDM0MsbUJBQWMsR0FBRyxJQUFJLE9BQU8sRUFBb0IsQ0FBQztRQUUxRCxzQ0FBc0M7UUFDN0Isb0JBQWUsR0FBRyxJQUFJLE9BQU8sRUFBYyxDQUFDO1FBRXJELGdDQUFnQztRQUN2QixrQkFBYSxHQUFHLElBQUksT0FBTyxFQUFvQixDQUFDO0tBQzFEO2lJQVRZLDBCQUEwQjtxSUFBMUIsMEJBQTBCOzsyRkFBMUIsMEJBQTBCO2tCQUR0QyxVQUFVOztBQVlYLG9GQUFvRjtBQUVwRixNQUFNLE9BQU8sb0JBQW9CO0lBSS9CLFlBQTZCLE9BQW1DO1FBQW5DLFlBQU8sR0FBUCxPQUFPLENBQTRCO1FBSGhFLDBDQUEwQztRQUNqQyxvQkFBZSxHQUEyQixJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQztJQUViLENBQUM7SUFFcEUsOENBQThDO0lBQzlDLE1BQU0sQ0FBQyxRQUFnQixFQUFFLElBQVk7UUFDbkMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDO1lBQzlCLFFBQVE7WUFDUixJQUFJO1lBQ0osbUJBQW1CLEVBQUUsSUFBSTtZQUN6QixjQUFjLEVBQUUsSUFBSTtTQUNyQixDQUFDLENBQUM7SUFDTCxDQUFDO2lJQWRVLG9CQUFvQjtxSUFBcEIsb0JBQW9COzsyRkFBcEIsb0JBQW9CO2tCQURoQyxVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUsIFN1YmplY3QgfSBmcm9tICdyeGpzJztcblxuLyoqIEluZGljYXRlcyB0aGUgd2lkdGggb2YgYSBjb2x1bW4uICovXG5leHBvcnQgaW50ZXJmYWNlIENvbHVtblNpemUge1xuICAvKiogVGhlIElEL25hbWUgb2YgdGhlIGNvbHVtbiwgYXMgZGVmaW5lZCBpbiBDZGtDb2x1bW5EZWYuICovXG4gIHJlYWRvbmx5IGNvbHVtbklkOiBzdHJpbmc7XG5cbiAgLyoqIFRoZSB3aWR0aCBpbiBwaXhlbHMgb2YgdGhlIGNvbHVtbi4gKi9cbiAgcmVhZG9ubHkgc2l6ZTogbnVtYmVyO1xuXG4gIC8qKiBUaGUgd2lkdGggaW4gcGl4ZWxzIG9mIHRoZSBjb2x1bW4gcHJpb3IgdG8gdGhpcyB1cGRhdGUsIGlmIGtub3duLiAqL1xuICByZWFkb25seSBwcmV2aW91c1NpemU/OiBudW1iZXI7XG59XG5cbi8qKiBJbnRlcmZhY2UgZGVzY3JpYmluZyBjb2x1bW4gc2l6ZSBjaGFuZ2VzLiAqL1xuZXhwb3J0IGludGVyZmFjZSBDb2x1bW5TaXplQWN0aW9uIGV4dGVuZHMgQ29sdW1uU2l6ZSB7XG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSByZXNpemUgYWN0aW9uIHNob3VsZCBiZSBhcHBsaWVkIGluc3RhbnRhbmVvdXNseS4gRmFsc2UgZm9yIGV2ZW50cyB0cmlnZ2VyZWQgZHVyaW5nXG4gICAqIGEgVUktdHJpZ2dlcmVkIHJlc2l6ZSAoc3VjaCBhcyB3aXRoIHRoZSBtb3VzZSkgdW50aWwgdGhlIG1vdXNlIGJ1dHRvbiBpcyByZWxlYXNlZC4gVHJ1ZVxuICAgKiBmb3IgYWxsIHByb2dyYW1tYXRpY2FsbHkgdHJpZ2dlcmVkIHJlc2l6ZXMuXG4gICAqL1xuICByZWFkb25seSBjb21wbGV0ZUltbWVkaWF0ZWx5PzogYm9vbGVhbjtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgcmVzaXplIGFjdGlvbiBpcyBiZWluZyBhcHBsaWVkIHRvIGEgc3RpY2t5L3N0aWNreUVuZCBjb2x1bW4uXG4gICAqL1xuICByZWFkb25seSBpc1N0aWNreUNvbHVtbj86IGJvb2xlYW47XG59XG5cbi8qKlxuICogT3JpZ2luYXRpbmcgc291cmNlIG9mIGNvbHVtbiByZXNpemUgZXZlbnRzIHdpdGhpbiBhIHRhYmxlLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQ29sdW1uUmVzaXplTm90aWZpZXJTb3VyY2Uge1xuICAvKiogRW1pdHMgd2hlbiBhbiBpbi1wcm9ncmVzcyByZXNpemUgaXMgY2FuY2VsZWQuICovXG4gIHJlYWRvbmx5IHJlc2l6ZUNhbmNlbGVkID0gbmV3IFN1YmplY3Q8Q29sdW1uU2l6ZUFjdGlvbj4oKTtcblxuICAvKiogRW1pdHMgd2hlbiBhIHJlc2l6ZSBpcyBhcHBsaWVkLiAqL1xuICByZWFkb25seSByZXNpemVDb21wbGV0ZWQgPSBuZXcgU3ViamVjdDxDb2x1bW5TaXplPigpO1xuXG4gIC8qKiBUcmlnZ2VycyBhIHJlc2l6ZSBhY3Rpb24uICovXG4gIHJlYWRvbmx5IHRyaWdnZXJSZXNpemUgPSBuZXcgU3ViamVjdDxDb2x1bW5TaXplQWN0aW9uPigpO1xufVxuXG4vKiogU2VydmljZSBmb3IgdHJpZ2dlcmluZyBjb2x1bW4gcmVzaXplcyBpbXBlcmF0aXZlbHkgb3IgYmVpbmcgbm90aWZpZWQgb2YgdGhlbS4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBDb2x1bW5SZXNpemVOb3RpZmllciB7XG4gIC8qKiBFbWl0cyB3aGVuZXZlciBhIGNvbHVtbiBpcyByZXNpemVkLiAqL1xuICByZWFkb25seSByZXNpemVDb21wbGV0ZWQ6IE9ic2VydmFibGU8Q29sdW1uU2l6ZT4gPSB0aGlzLl9zb3VyY2UucmVzaXplQ29tcGxldGVkO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgX3NvdXJjZTogQ29sdW1uUmVzaXplTm90aWZpZXJTb3VyY2UpIHt9XG5cbiAgLyoqIEluc3RhbnRseSByZXNpemVzIHRoZSBzcGVjaWZpZWQgY29sdW1uLiAqL1xuICByZXNpemUoY29sdW1uSWQ6IHN0cmluZywgc2l6ZTogbnVtYmVyKTogdm9pZCB7XG4gICAgdGhpcy5fc291cmNlLnRyaWdnZXJSZXNpemUubmV4dCh7XG4gICAgICBjb2x1bW5JZCxcbiAgICAgIHNpemUsXG4gICAgICBjb21wbGV0ZUltbWVkaWF0ZWx5OiB0cnVlLFxuICAgICAgaXNTdGlja3lDb2x1bW46IHRydWUsXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==