/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive } from '@angular/core';
import { ColumnResize } from '../column-resize';
import { FLEX_PROVIDERS } from './constants';
import * as i0 from "@angular/core";
import * as i1 from "../column-resize-notifier";
import * as i2 from "../event-dispatcher";
import * as i3 from "@angular/cdk/table";
/**
 * Explicitly enables column resizing for a flexbox-based cdk-table.
 * Individual columns must be annotated specifically.
 */
export class CdkColumnResizeFlex extends ColumnResize {
    constructor(columnResizeNotifier, elementRef, eventDispatcher, ngZone, notifier, table) {
        super();
        this.columnResizeNotifier = columnResizeNotifier;
        this.elementRef = elementRef;
        this.eventDispatcher = eventDispatcher;
        this.ngZone = ngZone;
        this.notifier = notifier;
        this.table = table;
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: CdkColumnResizeFlex, deps: [{ token: i1.ColumnResizeNotifier }, { token: i0.ElementRef }, { token: i2.HeaderRowEventDispatcher }, { token: i0.NgZone }, { token: i1.ColumnResizeNotifierSource }, { token: i3.CdkTable }], target: i0.ɵɵFactoryTarget.Directive }); }
    /** @nocollapse */ static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.0.1", type: CdkColumnResizeFlex, isStandalone: true, selector: "cdk-table[columnResize]", providers: [...FLEX_PROVIDERS, { provide: ColumnResize, useExisting: CdkColumnResizeFlex }], usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: CdkColumnResizeFlex, decorators: [{
            type: Directive,
            args: [{
                    selector: 'cdk-table[columnResize]',
                    providers: [...FLEX_PROVIDERS, { provide: ColumnResize, useExisting: CdkColumnResizeFlex }],
                    standalone: true,
                }]
        }], ctorParameters: () => [{ type: i1.ColumnResizeNotifier }, { type: i0.ElementRef }, { type: i2.HeaderRowEventDispatcher }, { type: i0.NgZone }, { type: i1.ColumnResizeNotifierSource }, { type: i3.CdkTable }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sdW1uLXJlc2l6ZS1mbGV4LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvZXh0ZW5zaW9ucy9jb2x1bW4tcmVzaXplL2NvbHVtbi1yZXNpemUtZGlyZWN0aXZlcy9jb2x1bW4tcmVzaXplLWZsZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFFLFNBQVMsRUFBc0IsTUFBTSxlQUFlLENBQUM7QUFHOUQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBR2hELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxhQUFhLENBQUM7Ozs7O0FBRTdDOzs7R0FHRztBQU1ILE1BQU0sT0FBTyxtQkFBb0IsU0FBUSxZQUFZO0lBQ25ELFlBQ1csb0JBQTBDLEVBQzFDLFVBQW1DLEVBQ3pCLGVBQXlDLEVBQ3pDLE1BQWMsRUFDZCxRQUFvQyxFQUNwQyxLQUF3QjtRQUUzQyxLQUFLLEVBQUUsQ0FBQztRQVBDLHlCQUFvQixHQUFwQixvQkFBb0IsQ0FBc0I7UUFDMUMsZUFBVSxHQUFWLFVBQVUsQ0FBeUI7UUFDekIsb0JBQWUsR0FBZixlQUFlLENBQTBCO1FBQ3pDLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZCxhQUFRLEdBQVIsUUFBUSxDQUE0QjtRQUNwQyxVQUFLLEdBQUwsS0FBSyxDQUFtQjtJQUc3QyxDQUFDO2lJQVZVLG1CQUFtQjtxSEFBbkIsbUJBQW1CLHNFQUhuQixDQUFDLEdBQUcsY0FBYyxFQUFFLEVBQUUsT0FBTyxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUUsbUJBQW1CLEVBQUUsQ0FBQzs7MkZBR2hGLG1CQUFtQjtrQkFML0IsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUseUJBQXlCO29CQUNuQyxTQUFTLEVBQUUsQ0FBQyxHQUFHLGNBQWMsRUFBRSxFQUFFLE9BQU8sRUFBRSxZQUFZLEVBQUUsV0FBVyxxQkFBcUIsRUFBRSxDQUFDO29CQUMzRixVQUFVLEVBQUUsSUFBSTtpQkFDakIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHsgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBOZ1pvbmUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENka1RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3RhYmxlJztcblxuaW1wb3J0IHsgQ29sdW1uUmVzaXplIH0gZnJvbSAnLi4vY29sdW1uLXJlc2l6ZSc7XG5pbXBvcnQgeyBDb2x1bW5SZXNpemVOb3RpZmllciwgQ29sdW1uUmVzaXplTm90aWZpZXJTb3VyY2UgfSBmcm9tICcuLi9jb2x1bW4tcmVzaXplLW5vdGlmaWVyJztcbmltcG9ydCB7IEhlYWRlclJvd0V2ZW50RGlzcGF0Y2hlciB9IGZyb20gJy4uL2V2ZW50LWRpc3BhdGNoZXInO1xuaW1wb3J0IHsgRkxFWF9QUk9WSURFUlMgfSBmcm9tICcuL2NvbnN0YW50cyc7XG5cbi8qKlxuICogRXhwbGljaXRseSBlbmFibGVzIGNvbHVtbiByZXNpemluZyBmb3IgYSBmbGV4Ym94LWJhc2VkIGNkay10YWJsZS5cbiAqIEluZGl2aWR1YWwgY29sdW1ucyBtdXN0IGJlIGFubm90YXRlZCBzcGVjaWZpY2FsbHkuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ2Nkay10YWJsZVtjb2x1bW5SZXNpemVdJyxcbiAgcHJvdmlkZXJzOiBbLi4uRkxFWF9QUk9WSURFUlMsIHsgcHJvdmlkZTogQ29sdW1uUmVzaXplLCB1c2VFeGlzdGluZzogQ2RrQ29sdW1uUmVzaXplRmxleCB9XSxcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbn0pXG5leHBvcnQgY2xhc3MgQ2RrQ29sdW1uUmVzaXplRmxleCBleHRlbmRzIENvbHVtblJlc2l6ZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHJlYWRvbmx5IGNvbHVtblJlc2l6ZU5vdGlmaWVyOiBDb2x1bW5SZXNpemVOb3RpZmllcixcbiAgICByZWFkb25seSBlbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgZXZlbnREaXNwYXRjaGVyOiBIZWFkZXJSb3dFdmVudERpc3BhdGNoZXIsXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IG5nWm9uZTogTmdab25lLFxuICAgIHByb3RlY3RlZCByZWFkb25seSBub3RpZmllcjogQ29sdW1uUmVzaXplTm90aWZpZXJTb3VyY2UsXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IHRhYmxlOiBDZGtUYWJsZTx1bmtub3duPlxuICApIHtcbiAgICBzdXBlcigpO1xuICB9XG59XG4iXX0=