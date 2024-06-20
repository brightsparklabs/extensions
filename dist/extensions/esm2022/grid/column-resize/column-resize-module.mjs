/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgModule } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatCommonModule } from '@angular/material/core';
import { MatColumnResize } from './column-resize-directives/column-resize';
import { MatColumnResizeFlex } from './column-resize-directives/column-resize-flex';
import { MatColumnResizeOverlayHandle } from './overlay-handle';
import { MatResizable } from './resizable-directives/resizable';
import * as i0 from "@angular/core";
const ENTRY_COMMON_COMPONENTS = [MatColumnResizeOverlayHandle];
export class MatColumnResizeCommonModule {
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MatColumnResizeCommonModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    /** @nocollapse */ static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.0.1", ngImport: i0, type: MatColumnResizeCommonModule, imports: [MatColumnResizeOverlayHandle], exports: [MatColumnResizeOverlayHandle] }); }
    /** @nocollapse */ static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MatColumnResizeCommonModule }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MatColumnResizeCommonModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: ENTRY_COMMON_COMPONENTS,
                    exports: ENTRY_COMMON_COMPONENTS,
                }]
        }] });
const IMPORTS = [MatCommonModule, OverlayModule, MatColumnResizeCommonModule];
export class MatColumnResizeModule {
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MatColumnResizeModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    /** @nocollapse */ static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.0.1", ngImport: i0, type: MatColumnResizeModule, imports: [MatCommonModule, OverlayModule, MatColumnResizeCommonModule, MatColumnResize, MatColumnResizeFlex, MatResizable], exports: [MatColumnResize, MatColumnResizeFlex, MatResizable] }); }
    /** @nocollapse */ static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MatColumnResizeModule, imports: [IMPORTS] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MatColumnResizeModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [...IMPORTS, MatColumnResize, MatColumnResizeFlex, MatResizable],
                    exports: [MatColumnResize, MatColumnResizeFlex, MatResizable],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sdW1uLXJlc2l6ZS1tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9leHRlbnNpb25zL2dyaWQvY29sdW1uLXJlc2l6ZS9jb2x1bW4tcmVzaXplLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUNyRCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFFekQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDBDQUEwQyxDQUFDO0FBQzNFLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLCtDQUErQyxDQUFDO0FBQ3BGLE9BQU8sRUFBRSw0QkFBNEIsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ2hFLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQzs7QUFFaEUsTUFBTSx1QkFBdUIsR0FBRyxDQUFDLDRCQUE0QixDQUFDLENBQUM7QUFNL0QsTUFBTSxPQUFPLDJCQUEyQjtpSUFBM0IsMkJBQTJCO2tJQUEzQiwyQkFBMkIsWUFOUCw0QkFBNEIsYUFBNUIsNEJBQTRCO2tJQU1oRCwyQkFBMkI7OzJGQUEzQiwyQkFBMkI7a0JBSnZDLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLHVCQUF1QjtvQkFDaEMsT0FBTyxFQUFFLHVCQUF1QjtpQkFDakM7O0FBR0QsTUFBTSxPQUFPLEdBQUcsQ0FBQyxlQUFlLEVBQUUsYUFBYSxFQUFFLDJCQUEyQixDQUFDLENBQUM7QUFNOUUsTUFBTSxPQUFPLHFCQUFxQjtpSUFBckIscUJBQXFCO2tJQUFyQixxQkFBcUIsWUFOakIsZUFBZSxFQUFFLGFBQWEsRUFGbEMsMkJBQTJCLEVBS2hCLGVBQWUsRUFBRSxtQkFBbUIsRUFBRSxZQUFZLGFBQzlELGVBQWUsRUFBRSxtQkFBbUIsRUFBRSxZQUFZO2tJQUVqRCxxQkFBcUIsWUFIbkIsT0FBTzs7MkZBR1QscUJBQXFCO2tCQUpqQyxRQUFRO21CQUFDO29CQUNSLE9BQU8sRUFBRSxDQUFDLEdBQUcsT0FBTyxFQUFFLGVBQWUsRUFBRSxtQkFBbUIsRUFBRSxZQUFZLENBQUM7b0JBQ3pFLE9BQU8sRUFBRSxDQUFDLGVBQWUsRUFBRSxtQkFBbUIsRUFBRSxZQUFZLENBQUM7aUJBQzlEIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPdmVybGF5TW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHsgTWF0Q29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5cbmltcG9ydCB7IE1hdENvbHVtblJlc2l6ZSB9IGZyb20gJy4vY29sdW1uLXJlc2l6ZS1kaXJlY3RpdmVzL2NvbHVtbi1yZXNpemUnO1xuaW1wb3J0IHsgTWF0Q29sdW1uUmVzaXplRmxleCB9IGZyb20gJy4vY29sdW1uLXJlc2l6ZS1kaXJlY3RpdmVzL2NvbHVtbi1yZXNpemUtZmxleCc7XG5pbXBvcnQgeyBNYXRDb2x1bW5SZXNpemVPdmVybGF5SGFuZGxlIH0gZnJvbSAnLi9vdmVybGF5LWhhbmRsZSc7XG5pbXBvcnQgeyBNYXRSZXNpemFibGUgfSBmcm9tICcuL3Jlc2l6YWJsZS1kaXJlY3RpdmVzL3Jlc2l6YWJsZSc7XG5cbmNvbnN0IEVOVFJZX0NPTU1PTl9DT01QT05FTlRTID0gW01hdENvbHVtblJlc2l6ZU92ZXJsYXlIYW5kbGVdO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBFTlRSWV9DT01NT05fQ09NUE9ORU5UUyxcbiAgZXhwb3J0czogRU5UUllfQ09NTU9OX0NPTVBPTkVOVFMsXG59KVxuZXhwb3J0IGNsYXNzIE1hdENvbHVtblJlc2l6ZUNvbW1vbk1vZHVsZSB7fVxuXG5jb25zdCBJTVBPUlRTID0gW01hdENvbW1vbk1vZHVsZSwgT3ZlcmxheU1vZHVsZSwgTWF0Q29sdW1uUmVzaXplQ29tbW9uTW9kdWxlXTtcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogWy4uLklNUE9SVFMsIE1hdENvbHVtblJlc2l6ZSwgTWF0Q29sdW1uUmVzaXplRmxleCwgTWF0UmVzaXphYmxlXSxcbiAgZXhwb3J0czogW01hdENvbHVtblJlc2l6ZSwgTWF0Q29sdW1uUmVzaXplRmxleCwgTWF0UmVzaXphYmxlXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0Q29sdW1uUmVzaXplTW9kdWxlIHt9XG4iXX0=