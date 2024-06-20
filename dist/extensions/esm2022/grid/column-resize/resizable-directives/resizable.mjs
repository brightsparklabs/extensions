import { Directive, Inject, Input, HostBinding, } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { _COALESCED_STYLE_SCHEDULER, } from '@angular/cdk/table';
import { AbstractMatResizable, RESIZABLE_HOST_BINDINGS, RESIZABLE_INPUTS } from './common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/table";
import * as i2 from "@ng-matero/extensions/column-resize";
import * as i3 from "@angular/cdk/bidi";
import * as i4 from "@angular/cdk/overlay";
/**
 * Explicitly enables column resizing for a mat-header-cell.
 */
export class MatResizable extends AbstractMatResizable {
    get hasResizableClass() {
        return this.isResizable ? RESIZABLE_HOST_BINDINGS.class : '';
    }
    get resizable() {
        return this.isResizable;
    }
    set resizable(newValue) {
        this.isResizable = newValue == null || newValue === '' || newValue;
    }
    constructor(columnDef, columnResize, directionality, document, elementRef, eventDispatcher, injector, ngZone, overlay, resizeNotifier, resizeStrategy, styleScheduler, viewContainerRef, changeDetectorRef) {
        super();
        this.columnDef = columnDef;
        this.columnResize = columnResize;
        this.directionality = directionality;
        this.elementRef = elementRef;
        this.eventDispatcher = eventDispatcher;
        this.injector = injector;
        this.ngZone = ngZone;
        this.overlay = overlay;
        this.resizeNotifier = resizeNotifier;
        this.resizeStrategy = resizeStrategy;
        this.styleScheduler = styleScheduler;
        this.viewContainerRef = viewContainerRef;
        this.changeDetectorRef = changeDetectorRef;
        this.isResizable = true;
        this.document = document;
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MatResizable, deps: [{ token: i1.CdkColumnDef }, { token: i2.ColumnResize }, { token: i3.Directionality }, { token: DOCUMENT }, { token: i0.ElementRef }, { token: i2.HeaderRowEventDispatcher }, { token: i0.Injector }, { token: i0.NgZone }, { token: i4.Overlay }, { token: i2.ColumnResizeNotifierSource }, { token: i2.ResizeStrategy }, { token: _COALESCED_STYLE_SCHEDULER }, { token: i0.ViewContainerRef }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    /** @nocollapse */ static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.0.1", type: MatResizable, isStandalone: true, selector: "mat-header-cell[resizable], th[mat-header-cell][resizable]", inputs: { minWidthPx: ["matResizableMinWidthPx", "minWidthPx"], maxWidthPx: ["matResizableMaxWidthPx", "maxWidthPx"], resizable: "resizable" }, host: { properties: { "class": "this.hasResizableClass" }, classAttribute: "mat-resizable" }, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MatResizable, decorators: [{
            type: Directive,
            args: [{
                    selector: 'mat-header-cell[resizable], th[mat-header-cell][resizable]',
                    host: RESIZABLE_HOST_BINDINGS,
                    inputs: RESIZABLE_INPUTS,
                    standalone: true,
                }]
        }], ctorParameters: () => [{ type: i1.CdkColumnDef }, { type: i2.ColumnResize }, { type: i3.Directionality }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i0.ElementRef }, { type: i2.HeaderRowEventDispatcher }, { type: i0.Injector }, { type: i0.NgZone }, { type: i4.Overlay }, { type: i2.ColumnResizeNotifierSource }, { type: i2.ResizeStrategy }, { type: i1._CoalescedStyleScheduler, decorators: [{
                    type: Inject,
                    args: [_COALESCED_STYLE_SCHEDULER]
                }] }, { type: i0.ViewContainerRef }, { type: i0.ChangeDetectorRef }], propDecorators: { hasResizableClass: [{
                type: HostBinding,
                args: ['class']
            }], resizable: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzaXphYmxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvZXh0ZW5zaW9ucy9ncmlkL2NvbHVtbi1yZXNpemUvcmVzaXphYmxlLWRpcmVjdGl2ZXMvcmVzaXphYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxTQUFTLEVBRVQsTUFBTSxFQUtOLEtBQUssRUFDTCxXQUFXLEdBQ1osTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRzNDLE9BQU8sRUFHTCwwQkFBMEIsR0FDM0IsTUFBTSxvQkFBb0IsQ0FBQztBQVE1QixPQUFPLEVBQUUsb0JBQW9CLEVBQUUsdUJBQXVCLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxVQUFVLENBQUM7Ozs7OztBQUUzRjs7R0FFRztBQU9ILE1BQU0sT0FBTyxZQUFhLFNBQVEsb0JBQW9CO0lBR3BELElBQTBCLGlCQUFpQjtRQUN6QyxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLHVCQUF1QixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQy9ELENBQUM7SUFFRCxJQUNJLFNBQVM7UUFDWCxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDMUIsQ0FBQztJQUNELElBQUksU0FBUyxDQUFDLFFBQWE7UUFDekIsSUFBSSxDQUFDLFdBQVcsR0FBRyxRQUFRLElBQUksSUFBSSxJQUFJLFFBQVEsS0FBSyxFQUFFLElBQUksUUFBUSxDQUFDO0lBQ3JFLENBQUM7SUFJRCxZQUNxQixTQUF1QixFQUN2QixZQUEwQixFQUMxQixjQUE4QixFQUMvQixRQUFhLEVBQ1osVUFBc0IsRUFDdEIsZUFBeUMsRUFDekMsUUFBa0IsRUFDbEIsTUFBYyxFQUNkLE9BQWdCLEVBQ2hCLGNBQTBDLEVBQzFDLGNBQThCLEVBRTlCLGNBQXdDLEVBQ3hDLGdCQUFrQyxFQUNsQyxpQkFBb0M7UUFFdkQsS0FBSyxFQUFFLENBQUM7UUFoQlcsY0FBUyxHQUFULFNBQVMsQ0FBYztRQUN2QixpQkFBWSxHQUFaLFlBQVksQ0FBYztRQUMxQixtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUFFOUIsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUN0QixvQkFBZSxHQUFmLGVBQWUsQ0FBMEI7UUFDekMsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUNsQixXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2QsWUFBTyxHQUFQLE9BQU8sQ0FBUztRQUNoQixtQkFBYyxHQUFkLGNBQWMsQ0FBNEI7UUFDMUMsbUJBQWMsR0FBZCxjQUFjLENBQWdCO1FBRTlCLG1CQUFjLEdBQWQsY0FBYyxDQUEwQjtRQUN4QyxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQ2xDLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBbUI7UUEvQnpELGdCQUFXLEdBQUcsSUFBSSxDQUFDO1FBa0NqQixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztJQUMzQixDQUFDO2lJQXBDVSxZQUFZLHdHQXFCYixRQUFRLDROQVFSLDBCQUEwQjtxSEE3QnpCLFlBQVk7OzJGQUFaLFlBQVk7a0JBTnhCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLDREQUE0RDtvQkFDdEUsSUFBSSxFQUFFLHVCQUF1QjtvQkFDN0IsTUFBTSxFQUFFLGdCQUFnQjtvQkFDeEIsVUFBVSxFQUFFLElBQUk7aUJBQ2pCOzswQkFzQkksTUFBTTsyQkFBQyxRQUFROzswQkFRZixNQUFNOzJCQUFDLDBCQUEwQjt3R0ExQlYsaUJBQWlCO3NCQUExQyxXQUFXO3VCQUFDLE9BQU87Z0JBS2hCLFNBQVM7c0JBRFosS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgSW5qZWN0LFxuICBJbmplY3RvcixcbiAgTmdab25lLFxuICBWaWV3Q29udGFpbmVyUmVmLFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgSW5wdXQsXG4gIEhvc3RCaW5kaW5nLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IERpcmVjdGlvbmFsaXR5IH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2JpZGknO1xuaW1wb3J0IHsgT3ZlcmxheSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7XG4gIENka0NvbHVtbkRlZixcbiAgX0NvYWxlc2NlZFN0eWxlU2NoZWR1bGVyLFxuICBfQ09BTEVTQ0VEX1NUWUxFX1NDSEVEVUxFUixcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3RhYmxlJztcbmltcG9ydCB7XG4gIENvbHVtblJlc2l6ZSxcbiAgQ29sdW1uUmVzaXplTm90aWZpZXJTb3VyY2UsXG4gIEhlYWRlclJvd0V2ZW50RGlzcGF0Y2hlcixcbiAgUmVzaXplU3RyYXRlZ3ksXG59IGZyb20gJ0BuZy1tYXRlcm8vZXh0ZW5zaW9ucy9jb2x1bW4tcmVzaXplJztcblxuaW1wb3J0IHsgQWJzdHJhY3RNYXRSZXNpemFibGUsIFJFU0laQUJMRV9IT1NUX0JJTkRJTkdTLCBSRVNJWkFCTEVfSU5QVVRTIH0gZnJvbSAnLi9jb21tb24nO1xuXG4vKipcbiAqIEV4cGxpY2l0bHkgZW5hYmxlcyBjb2x1bW4gcmVzaXppbmcgZm9yIGEgbWF0LWhlYWRlci1jZWxsLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXQtaGVhZGVyLWNlbGxbcmVzaXphYmxlXSwgdGhbbWF0LWhlYWRlci1jZWxsXVtyZXNpemFibGVdJyxcbiAgaG9zdDogUkVTSVpBQkxFX0hPU1RfQklORElOR1MsXG4gIGlucHV0czogUkVTSVpBQkxFX0lOUFVUUyxcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0UmVzaXphYmxlIGV4dGVuZHMgQWJzdHJhY3RNYXRSZXNpemFibGUge1xuICBpc1Jlc2l6YWJsZSA9IHRydWU7XG5cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcycpIGdldCBoYXNSZXNpemFibGVDbGFzcygpIHtcbiAgICByZXR1cm4gdGhpcy5pc1Jlc2l6YWJsZSA/IFJFU0laQUJMRV9IT1NUX0JJTkRJTkdTLmNsYXNzIDogJyc7XG4gIH1cblxuICBASW5wdXQoKVxuICBnZXQgcmVzaXphYmxlKCkge1xuICAgIHJldHVybiB0aGlzLmlzUmVzaXphYmxlO1xuICB9XG4gIHNldCByZXNpemFibGUobmV3VmFsdWU6IGFueSkge1xuICAgIHRoaXMuaXNSZXNpemFibGUgPSBuZXdWYWx1ZSA9PSBudWxsIHx8IG5ld1ZhbHVlID09PSAnJyB8fCBuZXdWYWx1ZTtcbiAgfVxuXG4gIHByb3RlY3RlZCByZWFkb25seSBkb2N1bWVudDogRG9jdW1lbnQ7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IGNvbHVtbkRlZjogQ2RrQ29sdW1uRGVmLFxuICAgIHByb3RlY3RlZCByZWFkb25seSBjb2x1bW5SZXNpemU6IENvbHVtblJlc2l6ZSxcbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgZGlyZWN0aW9uYWxpdHk6IERpcmVjdGlvbmFsaXR5LFxuICAgIEBJbmplY3QoRE9DVU1FTlQpIGRvY3VtZW50OiBhbnksXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IGV2ZW50RGlzcGF0Y2hlcjogSGVhZGVyUm93RXZlbnREaXNwYXRjaGVyLFxuICAgIHByb3RlY3RlZCByZWFkb25seSBpbmplY3RvcjogSW5qZWN0b3IsXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IG5nWm9uZTogTmdab25lLFxuICAgIHByb3RlY3RlZCByZWFkb25seSBvdmVybGF5OiBPdmVybGF5LFxuICAgIHByb3RlY3RlZCByZWFkb25seSByZXNpemVOb3RpZmllcjogQ29sdW1uUmVzaXplTm90aWZpZXJTb3VyY2UsXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IHJlc2l6ZVN0cmF0ZWd5OiBSZXNpemVTdHJhdGVneSxcbiAgICBASW5qZWN0KF9DT0FMRVNDRURfU1RZTEVfU0NIRURVTEVSKVxuICAgIHByb3RlY3RlZCByZWFkb25seSBzdHlsZVNjaGVkdWxlcjogX0NvYWxlc2NlZFN0eWxlU2NoZWR1bGVyLFxuICAgIHByb3RlY3RlZCByZWFkb25seSB2aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgIHByb3RlY3RlZCByZWFkb25seSBjaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWZcbiAgKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmRvY3VtZW50ID0gZG9jdW1lbnQ7XG4gIH1cbn1cbiJdfQ==