import { moveItemInArray, CdkDrag, CdkDropList, DragDropModule } from '@angular/cdk/drag-drop';
import { DOCUMENT, AsyncPipe, CurrencyPipe, DatePipe, DecimalPipe, PercentPipe, NgTemplateOutlet, CommonModule } from '@angular/common';
import * as i0 from '@angular/core';
import { CSP_NONCE, Injectable, Inject, Optional, Directive, Component, ChangeDetectionStrategy, ViewEncapsulation, ViewChild, HostBinding, Input, NgModule, Pipe, EventEmitter, Output, HostListener, InjectionToken, booleanAttribute, ContentChildren } from '@angular/core';
import * as i1$2 from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatBadge, MatBadgeModule } from '@angular/material/badge';
import { MatButton, MatIconButton, MatFabButton, MatMiniFabButton, MatButtonModule } from '@angular/material/button';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipListbox, MatChip, MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatMenuTrigger, MatMenu, MatMenuItem, MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBar, MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortHeader, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatRowDef, MatHeaderRowDef, MatFooterRow, MatTable, MatColumnDef, MatHeaderRow, MatRow, MatFooterRowDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatFooterCellDef, MatFooterCell, MatTableModule } from '@angular/material/table';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';
import * as i4 from '@angular/cdk/overlay';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatCommonModule } from '@angular/material/core';
import * as i2 from '@ng-matero/extensions/column-resize';
import { CdkFlexTableResizeStrategy, ResizeStrategy, ColumnResizeNotifier, HeaderRowEventDispatcher, ColumnResizeNotifierSource, TABLE_LAYOUT_FIXED_RESIZE_STRATEGY_PROVIDER, ColumnResize, ResizeOverlayHandle, Resizable } from '@ng-matero/extensions/column-resize';
export { TABLE_LAYOUT_FIXED_RESIZE_STRATEGY_PROVIDER as MAT_TABLE_LAYOUT_FIXED_RESIZE_STRATEGY_PROVIDER } from '@ng-matero/extensions/column-resize';
import * as i1 from '@angular/cdk/table';
import { _COALESCED_STYLE_SCHEDULER } from '@angular/cdk/table';
import * as i3 from '@angular/cdk/bidi';
import { MtxToObservablePipe, MtxIsTemplateRefPipe, MtxPipesModule } from '@ng-matero/extensions/core';
import * as i1$1 from '@ng-matero/extensions/dialog';
import { MtxDialogModule } from '@ng-matero/extensions/dialog';
import { isObservable } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Overrides CdkFlexTableResizeStrategy to match mat-column elements.
 */
class MatFlexTableResizeStrategy extends CdkFlexTableResizeStrategy {
    constructor(columnResize, styleScheduler, table, document, nonce) {
        super(columnResize, styleScheduler, table, document, nonce);
    }
    getColumnCssClass(cssFriendlyColumnName) {
        return `mat-column-${cssFriendlyColumnName}`;
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MatFlexTableResizeStrategy, deps: [{ token: i2.ColumnResize }, { token: _COALESCED_STYLE_SCHEDULER }, { token: i1.CdkTable }, { token: DOCUMENT }, { token: CSP_NONCE, optional: true }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MatFlexTableResizeStrategy }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MatFlexTableResizeStrategy, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i2.ColumnResize }, { type: i1._CoalescedStyleScheduler, decorators: [{
                    type: Inject,
                    args: [_COALESCED_STYLE_SCHEDULER]
                }] }, { type: i1.CdkTable }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [CSP_NONCE]
                }, {
                    type: Optional
                }] }] });
const FLEX_RESIZE_STRATEGY_PROVIDER = {
    provide: ResizeStrategy,
    useClass: MatFlexTableResizeStrategy,
};

const PROVIDERS = [
    ColumnResizeNotifier,
    HeaderRowEventDispatcher,
    ColumnResizeNotifierSource,
];
const TABLE_PROVIDERS = [
    ...PROVIDERS,
    TABLE_LAYOUT_FIXED_RESIZE_STRATEGY_PROVIDER,
];
const FLEX_PROVIDERS = [...PROVIDERS, FLEX_RESIZE_STRATEGY_PROVIDER];
const TABLE_HOST_BINDINGS = {
    class: 'mat-column-resize-table',
};
const FLEX_HOST_BINDINGS = {
    class: 'mat-column-resize-flex',
};
class AbstractMatColumnResize extends ColumnResize {
    getTableHeight() {
        const table = this.elementRef.nativeElement;
        const tableParent = table.parentNode;
        const isTableContainer = tableParent.classList.contains('mat-table-container');
        return isTableContainer ? tableParent.offsetHeight : table.offsetHeight;
    }
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Explicitly enables column resizing for a table-based mat-table.
 * Individual columns must be annotated specifically.
 */
class MatColumnResize extends AbstractMatColumnResize {
    constructor(columnResizeNotifier, elementRef, eventDispatcher, ngZone, notifier) {
        super();
        this.columnResizeNotifier = columnResizeNotifier;
        this.elementRef = elementRef;
        this.eventDispatcher = eventDispatcher;
        this.ngZone = ngZone;
        this.notifier = notifier;
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MatColumnResize, deps: [{ token: i2.ColumnResizeNotifier }, { token: i0.ElementRef }, { token: i2.HeaderRowEventDispatcher }, { token: i0.NgZone }, { token: i2.ColumnResizeNotifierSource }], target: i0.ɵɵFactoryTarget.Directive }); }
    /** @nocollapse */ static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.0.1", type: MatColumnResize, isStandalone: true, selector: "table[mat-table][columnResize]", host: { classAttribute: "mat-column-resize-table" }, providers: [...TABLE_PROVIDERS, { provide: ColumnResize, useExisting: MatColumnResize }], usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MatColumnResize, decorators: [{
            type: Directive,
            args: [{
                    selector: 'table[mat-table][columnResize]',
                    host: TABLE_HOST_BINDINGS,
                    providers: [...TABLE_PROVIDERS, { provide: ColumnResize, useExisting: MatColumnResize }],
                    standalone: true,
                }]
        }], ctorParameters: () => [{ type: i2.ColumnResizeNotifier }, { type: i0.ElementRef }, { type: i2.HeaderRowEventDispatcher }, { type: i0.NgZone }, { type: i2.ColumnResizeNotifierSource }] });

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Explicitly enables column resizing for a flexbox-based mat-table.
 * Individual columns must be annotated specifically.
 */
class MatColumnResizeFlex extends AbstractMatColumnResize {
    constructor(columnResizeNotifier, elementRef, eventDispatcher, ngZone, notifier) {
        super();
        this.columnResizeNotifier = columnResizeNotifier;
        this.elementRef = elementRef;
        this.eventDispatcher = eventDispatcher;
        this.ngZone = ngZone;
        this.notifier = notifier;
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MatColumnResizeFlex, deps: [{ token: i2.ColumnResizeNotifier }, { token: i0.ElementRef }, { token: i2.HeaderRowEventDispatcher }, { token: i0.NgZone }, { token: i2.ColumnResizeNotifierSource }], target: i0.ɵɵFactoryTarget.Directive }); }
    /** @nocollapse */ static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.0.1", type: MatColumnResizeFlex, isStandalone: true, selector: "mat-table[columnResize]", host: { classAttribute: "mat-column-resize-flex" }, providers: [...FLEX_PROVIDERS, { provide: ColumnResize, useExisting: MatColumnResizeFlex }], usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MatColumnResizeFlex, decorators: [{
            type: Directive,
            args: [{
                    selector: 'mat-table[columnResize]',
                    host: FLEX_HOST_BINDINGS,
                    providers: [...FLEX_PROVIDERS, { provide: ColumnResize, useExisting: MatColumnResizeFlex }],
                    standalone: true,
                }]
        }], ctorParameters: () => [{ type: i2.ColumnResizeNotifier }, { type: i0.ElementRef }, { type: i2.HeaderRowEventDispatcher }, { type: i0.NgZone }, { type: i2.ColumnResizeNotifierSource }] });

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Component shown over the edge of a resizable column that is responsible
 * for handling column resize mouse events and displaying a vertical line along the column edge.
 */
class MatColumnResizeOverlayHandle extends ResizeOverlayHandle {
    constructor(columnDef, columnResize, directionality, elementRef, eventDispatcher, ngZone, resizeNotifier, resizeRef, styleScheduler, document) {
        super();
        this.columnDef = columnDef;
        this.columnResize = columnResize;
        this.directionality = directionality;
        this.elementRef = elementRef;
        this.eventDispatcher = eventDispatcher;
        this.ngZone = ngZone;
        this.resizeNotifier = resizeNotifier;
        this.resizeRef = resizeRef;
        this.styleScheduler = styleScheduler;
        this.document = document;
    }
    updateResizeActive(active) {
        super.updateResizeActive(active);
        const originHeight = this.resizeRef.origin.nativeElement.offsetHeight;
        this.topElement.nativeElement.style.height = `${originHeight}px`;
        this.resizeRef.overlayRef.updateSize({
            height: active
                ? this.columnResize.getTableHeight()
                : originHeight,
        });
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MatColumnResizeOverlayHandle, deps: [{ token: i1.CdkColumnDef }, { token: i2.ColumnResize }, { token: i3.Directionality }, { token: i0.ElementRef }, { token: i2.HeaderRowEventDispatcher }, { token: i0.NgZone }, { token: i2.ColumnResizeNotifierSource }, { token: i2.ResizeRef }, { token: _COALESCED_STYLE_SCHEDULER }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Component }); }
    /** @nocollapse */ static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.0.1", type: MatColumnResizeOverlayHandle, isStandalone: true, selector: "ng-component", host: { classAttribute: "mat-column-resize-overlay-thumb" }, viewQueries: [{ propertyName: "topElement", first: true, predicate: ["top"], descendants: true, static: true }], usesInheritance: true, ngImport: i0, template: '<div #top class="mat-column-resize-overlay-thumb-top"></div>', isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MatColumnResizeOverlayHandle, decorators: [{
            type: Component,
            args: [{
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    host: { class: 'mat-column-resize-overlay-thumb' },
                    template: '<div #top class="mat-column-resize-overlay-thumb-top"></div>',
                    standalone: true,
                }]
        }], ctorParameters: () => [{ type: i1.CdkColumnDef }, { type: i2.ColumnResize }, { type: i3.Directionality }, { type: i0.ElementRef }, { type: i2.HeaderRowEventDispatcher }, { type: i0.NgZone }, { type: i2.ColumnResizeNotifierSource }, { type: i2.ResizeRef }, { type: i1._CoalescedStyleScheduler, decorators: [{
                    type: Inject,
                    args: [_COALESCED_STYLE_SCHEDULER]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }], propDecorators: { topElement: [{
                type: ViewChild,
                args: ['top', { static: true }]
            }] } });

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
class AbstractMatResizable extends Resizable {
    constructor() {
        super(...arguments);
        this.minWidthPxInternal = 32;
    }
    getInlineHandleCssClassName() {
        return 'mat-resizable-handle';
    }
    getOverlayHandleComponentType() {
        return MatColumnResizeOverlayHandle;
    }
}
const RESIZABLE_HOST_BINDINGS = {
    class: 'mat-resizable',
};
const RESIZABLE_INPUTS = [
    'minWidthPx: matResizableMinWidthPx',
    'maxWidthPx: matResizableMaxWidthPx',
];

/**
 * Explicitly enables column resizing for a mat-header-cell.
 */
class MatResizable extends AbstractMatResizable {
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

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const ENTRY_COMMON_COMPONENTS = [MatColumnResizeOverlayHandle];
class MatColumnResizeCommonModule {
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
class MatColumnResizeModule {
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

class MtxGridUtils {
    constructor() { }
    /**
     * Get cell's value based on the data and column's field (e.g. `a.b.c`)
     * @param rowData Row data
     * @param colDef Column definition
     * @returns
     */
    getCellValue(rowData, colDef) {
        const keyArr = colDef.field ? colDef.field.split('.') : [];
        let tmp = '';
        keyArr.forEach((key, i) => {
            if (i === 0) {
                tmp = rowData[key];
            }
            else {
                tmp = tmp && tmp[key];
            }
        });
        return tmp;
    }
    /**
     * Get all data of a col
     * @param data All data
     * @param colDef Column definition
     * @returns
     */
    getColData(data, colDef) {
        return data.map(rowData => this.getCellValue(rowData, colDef));
    }
    /**
     * Whether the value is empty (`null`, `undefined`, `''`, `[]`)
     * @param value
     * @returns
     */
    isEmpty(value) {
        return value == null || value.toString() === '';
    }
    /**
     * Whether the value contain HTML
     * @param value
     * @returns
     */
    isContainHTML(value) {
        return /<\/?[a-z][\s\S]*>/i.test(value);
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxGridUtils, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxGridUtils, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxGridUtils, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [] });

class MtxGridColClassPipe {
    transform(colDef, rowData, rowChangeRecord, currentValue) {
        if (typeof colDef.class === 'string') {
            return colDef.class;
        }
        else if (typeof colDef.class === 'function') {
            return colDef.class(rowData, colDef);
        }
        return '';
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxGridColClassPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    /** @nocollapse */ static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "18.0.1", ngImport: i0, type: MtxGridColClassPipe, isStandalone: true, name: "colClass" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxGridColClassPipe, decorators: [{
            type: Pipe,
            args: [{ name: 'colClass', standalone: true }]
        }] });
class MtxGridRowClassPipe {
    transform(rowData, index, dataIndex, rowClassFormatter) {
        const rowIndex = index === undefined ? dataIndex : index;
        const classList = rowIndex % 2 === 1 ? ['mat-row-odd'] : [];
        if (rowClassFormatter) {
            for (const key of Object.keys(rowClassFormatter)) {
                if (rowClassFormatter[key](rowData, rowIndex)) {
                    classList.push(key);
                }
            }
        }
        return classList.join(' ');
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxGridRowClassPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    /** @nocollapse */ static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "18.0.1", ngImport: i0, type: MtxGridRowClassPipe, isStandalone: true, name: "rowClass" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxGridRowClassPipe, decorators: [{
            type: Pipe,
            args: [{ name: 'rowClass', standalone: true }]
        }] });
class MtxGridCellActionsPipe {
    transform(btns, rowData, rowChangeRecord, currentValue) {
        if (typeof btns === 'function') {
            return btns(rowData);
        }
        else if (Array.isArray(btns)) {
            return btns;
        }
        return [];
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxGridCellActionsPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    /** @nocollapse */ static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "18.0.1", ngImport: i0, type: MtxGridCellActionsPipe, isStandalone: true, name: "cellActions" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxGridCellActionsPipe, decorators: [{
            type: Pipe,
            args: [{ name: 'cellActions', standalone: true }]
        }] });
class MtxGridCellActionTooltipPipe {
    transform(btn) {
        if (typeof btn.tooltip === 'string' || isObservable(btn.tooltip)) {
            return { message: btn.tooltip };
        }
        else {
            return btn.tooltip || { message: '' };
        }
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxGridCellActionTooltipPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    /** @nocollapse */ static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "18.0.1", ngImport: i0, type: MtxGridCellActionTooltipPipe, isStandalone: true, name: "cellActionTooltip" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxGridCellActionTooltipPipe, decorators: [{
            type: Pipe,
            args: [{ name: 'cellActionTooltip', standalone: true }]
        }] });
class MtxGridCellActionBadgePipe {
    transform(btn) {
        if (typeof btn.badge === 'number' || typeof btn.badge === 'string' || isObservable(btn.badge)) {
            return { content: btn.badge };
        }
        else {
            return btn.badge || { content: '' };
        }
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxGridCellActionBadgePipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    /** @nocollapse */ static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "18.0.1", ngImport: i0, type: MtxGridCellActionBadgePipe, isStandalone: true, name: "cellActionBadge" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxGridCellActionBadgePipe, decorators: [{
            type: Pipe,
            args: [{ name: 'cellActionBadge', standalone: true }]
        }] });
class MtxGridCellActionDisablePipe {
    transform(btn, rowData, rowChangeRecord, currentValue) {
        if (typeof btn.disabled === 'boolean') {
            return btn.disabled;
        }
        else if (typeof btn.disabled === 'function') {
            return btn.disabled(rowData);
        }
        else {
            return false;
        }
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxGridCellActionDisablePipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    /** @nocollapse */ static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "18.0.1", ngImport: i0, type: MtxGridCellActionDisablePipe, isStandalone: true, name: "cellActionDisable" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxGridCellActionDisablePipe, decorators: [{
            type: Pipe,
            args: [{ name: 'cellActionDisable', standalone: true }]
        }] });
class MtxGridCellSummaryPipe {
    constructor(utils) {
        this.utils = utils;
    }
    transform(data, colDef) {
        if (typeof colDef.summary === 'string') {
            return colDef.summary;
        }
        else if (typeof colDef.summary === 'function') {
            return colDef.summary(this.utils.getColData(data, colDef), colDef);
        }
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxGridCellSummaryPipe, deps: [{ token: MtxGridUtils }], target: i0.ɵɵFactoryTarget.Pipe }); }
    /** @nocollapse */ static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "18.0.1", ngImport: i0, type: MtxGridCellSummaryPipe, isStandalone: true, name: "cellSummary" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxGridCellSummaryPipe, decorators: [{
            type: Pipe,
            args: [{ name: 'cellSummary', standalone: true }]
        }], ctorParameters: () => [{ type: MtxGridUtils }] });

class MtxGridCell {
    get _value() {
        return this._utils.getCellValue(this.rowData, this.colDef);
    }
    constructor(_dialog, _utils, _differs, _changeDetectorRef) {
        this._dialog = _dialog;
        this._utils = _utils;
        this._differs = _differs;
        this._changeDetectorRef = _changeDetectorRef;
        /** Row data */
        this.rowData = {};
        /** Table data */
        this.data = [];
        /** Whether show summary */
        this.summary = false;
        /** Placeholder for the empty value (`null`, `''`, `[]`) */
        this.placeholder = '--';
        this.rowDataChange = new EventEmitter();
    }
    ngOnInit() {
        this.rowDataDiffer = this._differs.find(this.rowData).create();
    }
    ngDoCheck() {
        const changes = this.rowDataDiffer?.diff(this.rowData);
        if (changes) {
            this._applyChanges(changes);
        }
    }
    _applyChanges(changes) {
        changes.forEachChangedItem(record => {
            this.rowChangeRecord = record;
            this.rowDataChange.emit(record);
            this._changeDetectorRef.markForCheck();
        });
    }
    _getText(value) {
        return value === undefined ? '' : this._utils.isEmpty(value) ? this.placeholder : value;
    }
    _getTooltip(value) {
        return this._utils.isEmpty(value) ? '' : value;
    }
    _getFormatterTooltip(value) {
        return this._utils.isContainHTML(value) || this._utils.isEmpty(value) ? '' : value;
    }
    _onActionClick(event, btn, rowData) {
        event.preventDefault();
        event.stopPropagation();
        if (typeof btn.pop === 'string' || isObservable(btn.pop)) {
            this._dialog.open({
                title: btn.pop,
                buttons: [
                    { color: 'primary', text: 'OK', onClick: () => btn.click?.(rowData) || {} },
                    { text: 'CLOSE' },
                ],
            });
        }
        else if (typeof btn.pop === 'object') {
            this._dialog.open({
                title: btn.pop?.title,
                description: btn.pop?.description,
                buttons: [
                    {
                        color: btn.pop?.okColor || 'primary',
                        text: btn.pop?.okText || 'OK',
                        onClick: () => btn.click?.(rowData) || {},
                    },
                    {
                        color: btn.pop?.closeColor,
                        text: btn.pop?.closeText || 'CLOSE',
                    },
                ],
            });
        }
        else {
            btn.click?.(rowData);
        }
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxGridCell, deps: [{ token: i1$1.MtxDialog }, { token: MtxGridUtils }, { token: i0.KeyValueDiffers }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component }); }
    /** @nocollapse */ static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.0.1", type: MtxGridCell, isStandalone: true, selector: "mtx-grid-cell", inputs: { rowData: "rowData", colDef: "colDef", data: "data", summary: "summary", placeholder: "placeholder" }, outputs: { rowDataChange: "rowDataChange" }, exportAs: ["mtxGridCell"], ngImport: i0, template: "@if (summary) {\n  <span\n    [title]=\"_getFormatterTooltip((data | cellSummary: colDef))\"\n    [innerHTML]=\"_getText((data | cellSummary: colDef))\">\n  </span>\n} @else {\n  <!-- Custom formatting -->\n  @if (colDef.formatter) {\n    <span\n      [title]=\"_getFormatterTooltip(colDef.formatter(rowData, colDef))\"\n      [innerHTML]=\"_getText(colDef.formatter(rowData, colDef))\">\n    </span>\n  } @else {\n    <!-- Default formatting -->\n    @switch (colDef.type) {\n      <!-- Buttons -->\n      @case ('button') {\n        @for (btn of colDef.buttons | cellActions: rowData: rowChangeRecord: rowChangeRecord?.currentValue; track btn) {\n          @if (!btn.iif || btn.iif(rowData)) {\n            @switch (btn.type) {\n              @case ('raised') {\n                <button mat-raised-button [color]=\"btn.color || 'primary'\" type=\"button\"\n                  class=\"mtx-grid-action-button\" [class]=\"btn.class\"\n                  [disabled]=\"btn | cellActionDisable: rowData: rowChangeRecord: rowChangeRecord?.currentValue\"\n                  [matTooltip]=\"(btn | cellActionTooltip).message | toObservable | async\"\n                  [matTooltipClass]=\"(btn | cellActionTooltip).class\"\n                  [matTooltipHideDelay]=\"(btn | cellActionTooltip).hideDelay\"\n                  [matTooltipShowDelay]=\"(btn | cellActionTooltip).showDelay\"\n                  [matTooltipPosition]=\"(btn | cellActionTooltip).position || 'below'\"\n                  [matTooltipPositionAtOrigin]=\"(btn | cellActionTooltip).positionAtOrigin\"\n                  [matTooltipTouchGestures]=\"(btn | cellActionTooltip).touchGestures || 'auto'\"\n                  [matTooltipDisabled]=\"(btn | cellActionTooltip).disabled\"\n                  [matBadge]=\"(btn | cellActionBadge).content | toObservable | async\"\n                  [matBadgeDescription]=\"(btn | cellActionBadge).description | toObservable | async\"\n                  [matBadgeColor]=\"(btn | cellActionBadge).color\"\n                  [matBadgePosition]=\"(btn | cellActionBadge).position || 'above after'\"\n                  [matBadgeSize]=\"(btn | cellActionBadge).size || 'medium'\"\n                  [matBadgeOverlap]=\"(btn | cellActionBadge).overlap\"\n                  [matBadgeDisabled]=\"(btn | cellActionBadge).disabled\"\n                  [matBadgeHidden]=\"(btn | cellActionBadge).hidden\"\n                  (click)=\"_onActionClick($event, btn, rowData)\">\n                  @if (btn.icon) {\n                    <mat-icon class=\"mtx-grid-icon\">{{btn.icon}}</mat-icon>\n                  }\n                  <span>{{btn.text | toObservable | async}}</span>\n                </button>\n              }\n              @case ('stroked') {\n                <button mat-stroked-button [color]=\"btn.color || 'primary'\" type=\"button\"\n                  class=\"mtx-grid-action-button\" [class]=\"btn.class\"\n                  [disabled]=\"btn | cellActionDisable: rowData: rowChangeRecord: rowChangeRecord?.currentValue\"\n                  [matTooltip]=\"(btn | cellActionTooltip).message | toObservable | async\"\n                  [matTooltipClass]=\"(btn | cellActionTooltip).class\"\n                  [matTooltipHideDelay]=\"(btn | cellActionTooltip).hideDelay\"\n                  [matTooltipShowDelay]=\"(btn | cellActionTooltip).showDelay\"\n                  [matTooltipPosition]=\"(btn | cellActionTooltip).position || 'below'\"\n                  [matTooltipPositionAtOrigin]=\"(btn | cellActionTooltip).positionAtOrigin\"\n                  [matTooltipTouchGestures]=\"(btn | cellActionTooltip).touchGestures || 'auto'\"\n                  [matTooltipDisabled]=\"(btn | cellActionTooltip).disabled\"\n                  [matBadge]=\"(btn | cellActionBadge).content | toObservable | async\"\n                  [matBadgeDescription]=\"(btn | cellActionBadge).description | toObservable | async\"\n                  [matBadgeColor]=\"(btn | cellActionBadge).color\"\n                  [matBadgePosition]=\"(btn | cellActionBadge).position || 'above after'\"\n                  [matBadgeSize]=\"(btn | cellActionBadge).size || 'medium'\"\n                  [matBadgeOverlap]=\"(btn | cellActionBadge).overlap\"\n                  [matBadgeDisabled]=\"(btn | cellActionBadge).disabled\"\n                  [matBadgeHidden]=\"(btn | cellActionBadge).hidden\"\n                  (click)=\"_onActionClick($event, btn, rowData)\">\n                  @if (btn.icon) {\n                    <mat-icon class=\"mtx-grid-icon\">{{btn.icon}}</mat-icon>\n                  }\n                  <span>{{btn.text | toObservable | async}}</span>\n                </button>\n              }\n              @case ('flat') {\n                <button mat-flat-button [color]=\"btn.color || 'primary'\" type=\"button\"\n                  class=\"mtx-grid-action-button\" [class]=\"btn.class\"\n                  [disabled]=\"btn | cellActionDisable: rowData: rowChangeRecord: rowChangeRecord?.currentValue\"\n                  [matTooltip]=\"(btn | cellActionTooltip).message | toObservable | async\"\n                  [matTooltipClass]=\"(btn | cellActionTooltip).class\"\n                  [matTooltipHideDelay]=\"(btn | cellActionTooltip).hideDelay\"\n                  [matTooltipShowDelay]=\"(btn | cellActionTooltip).showDelay\"\n                  [matTooltipPosition]=\"(btn | cellActionTooltip).position || 'below'\"\n                  [matTooltipPositionAtOrigin]=\"(btn | cellActionTooltip).positionAtOrigin\"\n                  [matTooltipTouchGestures]=\"(btn | cellActionTooltip).touchGestures || 'auto'\"\n                  [matTooltipDisabled]=\"(btn | cellActionTooltip).disabled\"\n                  [matBadge]=\"(btn | cellActionBadge).content | toObservable | async\"\n                  [matBadgeDescription]=\"(btn | cellActionBadge).description | toObservable | async\"\n                  [matBadgeColor]=\"(btn | cellActionBadge).color\"\n                  [matBadgePosition]=\"(btn | cellActionBadge).position || 'above after'\"\n                  [matBadgeSize]=\"(btn | cellActionBadge).size || 'medium'\"\n                  [matBadgeOverlap]=\"(btn | cellActionBadge).overlap\"\n                  [matBadgeDisabled]=\"(btn | cellActionBadge).disabled\"\n                  [matBadgeHidden]=\"(btn | cellActionBadge).hidden\"\n                  (click)=\"_onActionClick($event, btn, rowData)\">\n                  @if (btn.icon) {\n                    <mat-icon class=\"mtx-grid-icon\">{{btn.icon}}</mat-icon>\n                  }\n                  <span>{{btn.text | toObservable | async}}</span>\n                </button>\n              }\n              @case ('icon') {\n                <button mat-icon-button [color]=\"btn.color || 'primary'\" type=\"button\"\n                  class=\"mtx-grid-action-button\" [class]=\"btn.class\"\n                  [disabled]=\"btn | cellActionDisable: rowData: rowChangeRecord: rowChangeRecord?.currentValue\"\n                  [matTooltip]=\"(btn | cellActionTooltip).message | toObservable | async\"\n                  [matTooltipClass]=\"(btn | cellActionTooltip).class\"\n                  [matTooltipHideDelay]=\"(btn | cellActionTooltip).hideDelay\"\n                  [matTooltipShowDelay]=\"(btn | cellActionTooltip).showDelay\"\n                  [matTooltipPosition]=\"(btn | cellActionTooltip).position || 'below'\"\n                  [matTooltipPositionAtOrigin]=\"(btn | cellActionTooltip).positionAtOrigin\"\n                  [matTooltipTouchGestures]=\"(btn | cellActionTooltip).touchGestures || 'auto'\"\n                  [matTooltipDisabled]=\"(btn | cellActionTooltip).disabled\"\n                  [matBadge]=\"(btn | cellActionBadge).content | toObservable | async\"\n                  [matBadgeDescription]=\"(btn | cellActionBadge).description | toObservable | async\"\n                  [matBadgeColor]=\"(btn | cellActionBadge).color\"\n                  [matBadgePosition]=\"(btn | cellActionBadge).position || 'above after'\"\n                  [matBadgeSize]=\"(btn | cellActionBadge).size || 'medium'\"\n                  [matBadgeOverlap]=\"(btn | cellActionBadge).overlap\"\n                  [matBadgeDisabled]=\"(btn | cellActionBadge).disabled\"\n                  [matBadgeHidden]=\"(btn | cellActionBadge).hidden\"\n                  (click)=\"_onActionClick($event, btn, rowData)\">\n                  <mat-icon class=\"mtx-grid-icon\">{{btn.icon}}</mat-icon>\n                </button>\n              }\n              @case ('fab') {\n                <button mat-fab [color]=\"btn.color || 'primary'\" type=\"button\"\n                  class=\"mtx-grid-action-button\" [class]=\"btn.class\"\n                  [disabled]=\"btn | cellActionDisable: rowData: rowChangeRecord: rowChangeRecord?.currentValue\"\n                  [matTooltip]=\"(btn | cellActionTooltip).message | toObservable | async\"\n                  [matTooltipClass]=\"(btn | cellActionTooltip).class\"\n                  [matTooltipHideDelay]=\"(btn | cellActionTooltip).hideDelay\"\n                  [matTooltipShowDelay]=\"(btn | cellActionTooltip).showDelay\"\n                  [matTooltipPosition]=\"(btn | cellActionTooltip).position || 'below'\"\n                  [matTooltipPositionAtOrigin]=\"(btn | cellActionTooltip).positionAtOrigin\"\n                  [matTooltipTouchGestures]=\"(btn | cellActionTooltip).touchGestures || 'auto'\"\n                  [matTooltipDisabled]=\"(btn | cellActionTooltip).disabled\"\n                  [matBadge]=\"(btn | cellActionBadge).content | toObservable | async\"\n                  [matBadgeDescription]=\"(btn | cellActionBadge).description | toObservable | async\"\n                  [matBadgeColor]=\"(btn | cellActionBadge).color\"\n                  [matBadgePosition]=\"(btn | cellActionBadge).position || 'above after'\"\n                  [matBadgeSize]=\"(btn | cellActionBadge).size || 'medium'\"\n                  [matBadgeOverlap]=\"(btn | cellActionBadge).overlap\"\n                  [matBadgeDisabled]=\"(btn | cellActionBadge).disabled\"\n                  [matBadgeHidden]=\"(btn | cellActionBadge).hidden\"\n                  (click)=\"_onActionClick($event, btn, rowData)\">\n                  <mat-icon class=\"mtx-grid-icon\">{{btn.icon}}</mat-icon>\n                </button>\n              }\n              @case ('mini-fab') {\n                <button mat-mini-fab [color]=\"btn.color || 'primary'\" type=\"button\"\n                  class=\"mtx-grid-action-button\" [class]=\"btn.class\"\n                  [disabled]=\"btn | cellActionDisable: rowData: rowChangeRecord: rowChangeRecord?.currentValue\"\n                  [matTooltip]=\"(btn | cellActionTooltip).message | toObservable | async\"\n                  [matTooltipClass]=\"(btn | cellActionTooltip).class\"\n                  [matTooltipHideDelay]=\"(btn | cellActionTooltip).hideDelay\"\n                  [matTooltipShowDelay]=\"(btn | cellActionTooltip).showDelay\"\n                  [matTooltipPosition]=\"(btn | cellActionTooltip).position || 'below'\"\n                  [matTooltipPositionAtOrigin]=\"(btn | cellActionTooltip).positionAtOrigin\"\n                  [matTooltipTouchGestures]=\"(btn | cellActionTooltip).touchGestures || 'auto'\"\n                  [matTooltipDisabled]=\"(btn | cellActionTooltip).disabled\"\n                  [matBadge]=\"(btn | cellActionBadge).content | toObservable | async\"\n                  [matBadgeDescription]=\"(btn | cellActionBadge).description | toObservable | async\"\n                  [matBadgeColor]=\"(btn | cellActionBadge).color\"\n                  [matBadgePosition]=\"(btn | cellActionBadge).position || 'above after'\"\n                  [matBadgeSize]=\"(btn | cellActionBadge).size || 'medium'\"\n                  [matBadgeOverlap]=\"(btn | cellActionBadge).overlap\"\n                  [matBadgeDisabled]=\"(btn | cellActionBadge).disabled\"\n                  [matBadgeHidden]=\"(btn | cellActionBadge).hidden\"\n                  (click)=\"_onActionClick($event, btn, rowData)\">\n                  <mat-icon class=\"mtx-grid-icon\">{{btn.icon}}</mat-icon>\n                </button>\n              }\n              @default {\n                <button mat-button [color]=\"btn.color || 'primary'\" type=\"button\"\n                  class=\"mtx-grid-action-button\" [class]=\"btn.class\"\n                  [disabled]=\"btn | cellActionDisable: rowData: rowChangeRecord: rowChangeRecord?.currentValue\"\n                  [matTooltip]=\"(btn | cellActionTooltip).message | toObservable | async\"\n                  [matTooltipClass]=\"(btn | cellActionTooltip).class\"\n                  [matTooltipHideDelay]=\"(btn | cellActionTooltip).hideDelay\"\n                  [matTooltipShowDelay]=\"(btn | cellActionTooltip).showDelay\"\n                  [matTooltipPosition]=\"(btn | cellActionTooltip).position || 'below'\"\n                  [matTooltipPositionAtOrigin]=\"(btn | cellActionTooltip).positionAtOrigin\"\n                  [matTooltipTouchGestures]=\"(btn | cellActionTooltip).touchGestures || 'auto'\"\n                  [matTooltipDisabled]=\"(btn | cellActionTooltip).disabled\"\n                  [matBadge]=\"(btn | cellActionBadge).content | toObservable | async\"\n                  [matBadgeDescription]=\"(btn | cellActionBadge).description | toObservable | async\"\n                  [matBadgeColor]=\"(btn | cellActionBadge).color\"\n                  [matBadgePosition]=\"(btn | cellActionBadge).position || 'above after'\"\n                  [matBadgeSize]=\"(btn | cellActionBadge).size || 'medium'\"\n                  [matBadgeOverlap]=\"(btn | cellActionBadge).overlap\"\n                  [matBadgeDisabled]=\"(btn | cellActionBadge).disabled\"\n                  [matBadgeHidden]=\"(btn | cellActionBadge).hidden\"\n                  (click)=\"_onActionClick($event, btn, rowData)\">\n                  @if (btn.icon) {\n                    <mat-icon class=\"mtx-grid-icon\">{{btn.icon}}</mat-icon>\n                  }\n                  <span>{{btn.text | toObservable | async}}</span>\n                </button>\n              }\n            }\n          }\n        }\n      }\n      <!-- Tag -->\n      @case ('tag') {\n        @if (colDef.tag && colDef.tag[_value]) {\n          <mat-chip-listbox>\n            <mat-chip color=\"primary\" [class]=\"'bg-' + colDef.tag[_value].color\">\n              {{colDef.tag[_value].text}}\n            </mat-chip>\n          </mat-chip-listbox>\n        } @else {\n          {{_value}}\n        }\n      }\n      <!-- Link -->\n      @case ('link') {\n        <a [href]=\"_value\" target=\"_blank\">{{_value}}</a>\n      }\n      <!-- Image -->\n      @case ('image') {\n        <img class=\"mtx-grid-img\" [src]=\"_value\">\n      }\n      <!-- Boolean -->\n      @case ('boolean') {\n        <span [title]=\"_getTooltip(_value)\">{{_getText(_value)}}</span>\n      }\n      <!-- Number -->\n      @case ('number') {\n        <span [title]=\"_getTooltip(_value | number: colDef.typeParameter?.digitsInfo: colDef.typeParameter?.locale)\">\n          {{_getText(_value | number: colDef.typeParameter?.digitsInfo: colDef.typeParameter?.locale)}}\n        </span>\n      }\n      <!-- Currency -->\n      @case ('currency') {\n        <span [title]=\"_getTooltip(_value | currency: colDef.typeParameter?.currencyCode: colDef.typeParameter?.display: colDef.typeParameter?.digitsInfo: colDef.typeParameter?.locale)\">\n          {{_getText(_value | currency: colDef.typeParameter?.currencyCode: colDef.typeParameter?.display: colDef.typeParameter?.digitsInfo: colDef.typeParameter?.locale)}}\n        </span>\n      }\n      <!-- Percent -->\n      @case ('percent') {\n        <span [title]=\"_getTooltip(_value | percent: colDef.typeParameter?.digitsInfo: colDef.typeParameter?.locale)\">\n          {{_getText(_value | percent: colDef.typeParameter?.digitsInfo: colDef.typeParameter?.locale)}}\n        </span>\n      }\n      <!-- Date -->\n      @case ('date') {\n        <span [title]=\"_getTooltip(_value | date: colDef.typeParameter?.format: colDef.typeParameter?.timezone: colDef.typeParameter?.locale)\">\n          {{_getText(_value | date: colDef.typeParameter?.format: colDef.typeParameter?.timezone: colDef.typeParameter?.locale)}}\n        </span>\n      }\n      <!-- Default -->\n      @default {\n        <span [title]=\"_getTooltip(_value)\">{{_getText(_value)}}</span>\n      }\n    }\n  }\n}\n", styles: [".mtx-grid-img{display:inline-block;width:32px;border-radius:4px;vertical-align:middle}\n"], dependencies: [{ kind: "pipe", type: AsyncPipe, name: "async" }, { kind: "pipe", type: CurrencyPipe, name: "currency" }, { kind: "pipe", type: DatePipe, name: "date" }, { kind: "pipe", type: DecimalPipe, name: "number" }, { kind: "pipe", type: PercentPipe, name: "percent" }, { kind: "component", type: MatButton, selector: "    button[mat-button], button[mat-raised-button], button[mat-flat-button],    button[mat-stroked-button]  ", exportAs: ["matButton"] }, { kind: "component", type: MatIconButton, selector: "button[mat-icon-button]", exportAs: ["matButton"] }, { kind: "component", type: MatFabButton, selector: "button[mat-fab]", inputs: ["extended"], exportAs: ["matButton"] }, { kind: "component", type: MatMiniFabButton, selector: "button[mat-mini-fab]", exportAs: ["matButton"] }, { kind: "component", type: MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }, { kind: "component", type: MatChipListbox, selector: "mat-chip-listbox", inputs: ["multiple", "aria-orientation", "selectable", "compareWith", "required", "hideSingleSelectionIndicator", "value"], outputs: ["change"] }, { kind: "component", type: MatChip, selector: "mat-basic-chip, [mat-basic-chip], mat-chip, [mat-chip]", inputs: ["role", "id", "aria-label", "aria-description", "value", "color", "removable", "highlighted", "disableRipple", "disabled", "tabIndex"], outputs: ["removed", "destroyed"], exportAs: ["matChip"] }, { kind: "directive", type: MatTooltip, selector: "[matTooltip]", inputs: ["matTooltipPosition", "matTooltipPositionAtOrigin", "matTooltipDisabled", "matTooltipShowDelay", "matTooltipHideDelay", "matTooltipTouchGestures", "matTooltip", "matTooltipClass"], exportAs: ["matTooltip"] }, { kind: "directive", type: MatBadge, selector: "[matBadge]", inputs: ["matBadgeColor", "matBadgeOverlap", "matBadgeDisabled", "matBadgePosition", "matBadge", "matBadgeDescription", "matBadgeSize", "matBadgeHidden"] }, { kind: "pipe", type: MtxToObservablePipe, name: "toObservable" }, { kind: "pipe", type: MtxGridCellActionsPipe, name: "cellActions" }, { kind: "pipe", type: MtxGridCellSummaryPipe, name: "cellSummary" }, { kind: "pipe", type: MtxGridCellActionDisablePipe, name: "cellActionDisable" }, { kind: "pipe", type: MtxGridCellActionTooltipPipe, name: "cellActionTooltip" }, { kind: "pipe", type: MtxGridCellActionBadgePipe, name: "cellActionBadge" }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxGridCell, decorators: [{
            type: Component,
            args: [{ selector: 'mtx-grid-cell', exportAs: 'mtxGridCell', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, standalone: true, imports: [
                        AsyncPipe,
                        CurrencyPipe,
                        DatePipe,
                        DecimalPipe,
                        PercentPipe,
                        MatButton,
                        MatIconButton,
                        MatFabButton,
                        MatMiniFabButton,
                        MatIcon,
                        MatChipListbox,
                        MatChip,
                        MatTooltip,
                        MatBadge,
                        MtxToObservablePipe,
                        MtxGridCellActionsPipe,
                        MtxGridCellSummaryPipe,
                        MtxGridCellActionDisablePipe,
                        MtxGridCellActionTooltipPipe,
                        MtxGridCellActionBadgePipe,
                    ], template: "@if (summary) {\n  <span\n    [title]=\"_getFormatterTooltip((data | cellSummary: colDef))\"\n    [innerHTML]=\"_getText((data | cellSummary: colDef))\">\n  </span>\n} @else {\n  <!-- Custom formatting -->\n  @if (colDef.formatter) {\n    <span\n      [title]=\"_getFormatterTooltip(colDef.formatter(rowData, colDef))\"\n      [innerHTML]=\"_getText(colDef.formatter(rowData, colDef))\">\n    </span>\n  } @else {\n    <!-- Default formatting -->\n    @switch (colDef.type) {\n      <!-- Buttons -->\n      @case ('button') {\n        @for (btn of colDef.buttons | cellActions: rowData: rowChangeRecord: rowChangeRecord?.currentValue; track btn) {\n          @if (!btn.iif || btn.iif(rowData)) {\n            @switch (btn.type) {\n              @case ('raised') {\n                <button mat-raised-button [color]=\"btn.color || 'primary'\" type=\"button\"\n                  class=\"mtx-grid-action-button\" [class]=\"btn.class\"\n                  [disabled]=\"btn | cellActionDisable: rowData: rowChangeRecord: rowChangeRecord?.currentValue\"\n                  [matTooltip]=\"(btn | cellActionTooltip).message | toObservable | async\"\n                  [matTooltipClass]=\"(btn | cellActionTooltip).class\"\n                  [matTooltipHideDelay]=\"(btn | cellActionTooltip).hideDelay\"\n                  [matTooltipShowDelay]=\"(btn | cellActionTooltip).showDelay\"\n                  [matTooltipPosition]=\"(btn | cellActionTooltip).position || 'below'\"\n                  [matTooltipPositionAtOrigin]=\"(btn | cellActionTooltip).positionAtOrigin\"\n                  [matTooltipTouchGestures]=\"(btn | cellActionTooltip).touchGestures || 'auto'\"\n                  [matTooltipDisabled]=\"(btn | cellActionTooltip).disabled\"\n                  [matBadge]=\"(btn | cellActionBadge).content | toObservable | async\"\n                  [matBadgeDescription]=\"(btn | cellActionBadge).description | toObservable | async\"\n                  [matBadgeColor]=\"(btn | cellActionBadge).color\"\n                  [matBadgePosition]=\"(btn | cellActionBadge).position || 'above after'\"\n                  [matBadgeSize]=\"(btn | cellActionBadge).size || 'medium'\"\n                  [matBadgeOverlap]=\"(btn | cellActionBadge).overlap\"\n                  [matBadgeDisabled]=\"(btn | cellActionBadge).disabled\"\n                  [matBadgeHidden]=\"(btn | cellActionBadge).hidden\"\n                  (click)=\"_onActionClick($event, btn, rowData)\">\n                  @if (btn.icon) {\n                    <mat-icon class=\"mtx-grid-icon\">{{btn.icon}}</mat-icon>\n                  }\n                  <span>{{btn.text | toObservable | async}}</span>\n                </button>\n              }\n              @case ('stroked') {\n                <button mat-stroked-button [color]=\"btn.color || 'primary'\" type=\"button\"\n                  class=\"mtx-grid-action-button\" [class]=\"btn.class\"\n                  [disabled]=\"btn | cellActionDisable: rowData: rowChangeRecord: rowChangeRecord?.currentValue\"\n                  [matTooltip]=\"(btn | cellActionTooltip).message | toObservable | async\"\n                  [matTooltipClass]=\"(btn | cellActionTooltip).class\"\n                  [matTooltipHideDelay]=\"(btn | cellActionTooltip).hideDelay\"\n                  [matTooltipShowDelay]=\"(btn | cellActionTooltip).showDelay\"\n                  [matTooltipPosition]=\"(btn | cellActionTooltip).position || 'below'\"\n                  [matTooltipPositionAtOrigin]=\"(btn | cellActionTooltip).positionAtOrigin\"\n                  [matTooltipTouchGestures]=\"(btn | cellActionTooltip).touchGestures || 'auto'\"\n                  [matTooltipDisabled]=\"(btn | cellActionTooltip).disabled\"\n                  [matBadge]=\"(btn | cellActionBadge).content | toObservable | async\"\n                  [matBadgeDescription]=\"(btn | cellActionBadge).description | toObservable | async\"\n                  [matBadgeColor]=\"(btn | cellActionBadge).color\"\n                  [matBadgePosition]=\"(btn | cellActionBadge).position || 'above after'\"\n                  [matBadgeSize]=\"(btn | cellActionBadge).size || 'medium'\"\n                  [matBadgeOverlap]=\"(btn | cellActionBadge).overlap\"\n                  [matBadgeDisabled]=\"(btn | cellActionBadge).disabled\"\n                  [matBadgeHidden]=\"(btn | cellActionBadge).hidden\"\n                  (click)=\"_onActionClick($event, btn, rowData)\">\n                  @if (btn.icon) {\n                    <mat-icon class=\"mtx-grid-icon\">{{btn.icon}}</mat-icon>\n                  }\n                  <span>{{btn.text | toObservable | async}}</span>\n                </button>\n              }\n              @case ('flat') {\n                <button mat-flat-button [color]=\"btn.color || 'primary'\" type=\"button\"\n                  class=\"mtx-grid-action-button\" [class]=\"btn.class\"\n                  [disabled]=\"btn | cellActionDisable: rowData: rowChangeRecord: rowChangeRecord?.currentValue\"\n                  [matTooltip]=\"(btn | cellActionTooltip).message | toObservable | async\"\n                  [matTooltipClass]=\"(btn | cellActionTooltip).class\"\n                  [matTooltipHideDelay]=\"(btn | cellActionTooltip).hideDelay\"\n                  [matTooltipShowDelay]=\"(btn | cellActionTooltip).showDelay\"\n                  [matTooltipPosition]=\"(btn | cellActionTooltip).position || 'below'\"\n                  [matTooltipPositionAtOrigin]=\"(btn | cellActionTooltip).positionAtOrigin\"\n                  [matTooltipTouchGestures]=\"(btn | cellActionTooltip).touchGestures || 'auto'\"\n                  [matTooltipDisabled]=\"(btn | cellActionTooltip).disabled\"\n                  [matBadge]=\"(btn | cellActionBadge).content | toObservable | async\"\n                  [matBadgeDescription]=\"(btn | cellActionBadge).description | toObservable | async\"\n                  [matBadgeColor]=\"(btn | cellActionBadge).color\"\n                  [matBadgePosition]=\"(btn | cellActionBadge).position || 'above after'\"\n                  [matBadgeSize]=\"(btn | cellActionBadge).size || 'medium'\"\n                  [matBadgeOverlap]=\"(btn | cellActionBadge).overlap\"\n                  [matBadgeDisabled]=\"(btn | cellActionBadge).disabled\"\n                  [matBadgeHidden]=\"(btn | cellActionBadge).hidden\"\n                  (click)=\"_onActionClick($event, btn, rowData)\">\n                  @if (btn.icon) {\n                    <mat-icon class=\"mtx-grid-icon\">{{btn.icon}}</mat-icon>\n                  }\n                  <span>{{btn.text | toObservable | async}}</span>\n                </button>\n              }\n              @case ('icon') {\n                <button mat-icon-button [color]=\"btn.color || 'primary'\" type=\"button\"\n                  class=\"mtx-grid-action-button\" [class]=\"btn.class\"\n                  [disabled]=\"btn | cellActionDisable: rowData: rowChangeRecord: rowChangeRecord?.currentValue\"\n                  [matTooltip]=\"(btn | cellActionTooltip).message | toObservable | async\"\n                  [matTooltipClass]=\"(btn | cellActionTooltip).class\"\n                  [matTooltipHideDelay]=\"(btn | cellActionTooltip).hideDelay\"\n                  [matTooltipShowDelay]=\"(btn | cellActionTooltip).showDelay\"\n                  [matTooltipPosition]=\"(btn | cellActionTooltip).position || 'below'\"\n                  [matTooltipPositionAtOrigin]=\"(btn | cellActionTooltip).positionAtOrigin\"\n                  [matTooltipTouchGestures]=\"(btn | cellActionTooltip).touchGestures || 'auto'\"\n                  [matTooltipDisabled]=\"(btn | cellActionTooltip).disabled\"\n                  [matBadge]=\"(btn | cellActionBadge).content | toObservable | async\"\n                  [matBadgeDescription]=\"(btn | cellActionBadge).description | toObservable | async\"\n                  [matBadgeColor]=\"(btn | cellActionBadge).color\"\n                  [matBadgePosition]=\"(btn | cellActionBadge).position || 'above after'\"\n                  [matBadgeSize]=\"(btn | cellActionBadge).size || 'medium'\"\n                  [matBadgeOverlap]=\"(btn | cellActionBadge).overlap\"\n                  [matBadgeDisabled]=\"(btn | cellActionBadge).disabled\"\n                  [matBadgeHidden]=\"(btn | cellActionBadge).hidden\"\n                  (click)=\"_onActionClick($event, btn, rowData)\">\n                  <mat-icon class=\"mtx-grid-icon\">{{btn.icon}}</mat-icon>\n                </button>\n              }\n              @case ('fab') {\n                <button mat-fab [color]=\"btn.color || 'primary'\" type=\"button\"\n                  class=\"mtx-grid-action-button\" [class]=\"btn.class\"\n                  [disabled]=\"btn | cellActionDisable: rowData: rowChangeRecord: rowChangeRecord?.currentValue\"\n                  [matTooltip]=\"(btn | cellActionTooltip).message | toObservable | async\"\n                  [matTooltipClass]=\"(btn | cellActionTooltip).class\"\n                  [matTooltipHideDelay]=\"(btn | cellActionTooltip).hideDelay\"\n                  [matTooltipShowDelay]=\"(btn | cellActionTooltip).showDelay\"\n                  [matTooltipPosition]=\"(btn | cellActionTooltip).position || 'below'\"\n                  [matTooltipPositionAtOrigin]=\"(btn | cellActionTooltip).positionAtOrigin\"\n                  [matTooltipTouchGestures]=\"(btn | cellActionTooltip).touchGestures || 'auto'\"\n                  [matTooltipDisabled]=\"(btn | cellActionTooltip).disabled\"\n                  [matBadge]=\"(btn | cellActionBadge).content | toObservable | async\"\n                  [matBadgeDescription]=\"(btn | cellActionBadge).description | toObservable | async\"\n                  [matBadgeColor]=\"(btn | cellActionBadge).color\"\n                  [matBadgePosition]=\"(btn | cellActionBadge).position || 'above after'\"\n                  [matBadgeSize]=\"(btn | cellActionBadge).size || 'medium'\"\n                  [matBadgeOverlap]=\"(btn | cellActionBadge).overlap\"\n                  [matBadgeDisabled]=\"(btn | cellActionBadge).disabled\"\n                  [matBadgeHidden]=\"(btn | cellActionBadge).hidden\"\n                  (click)=\"_onActionClick($event, btn, rowData)\">\n                  <mat-icon class=\"mtx-grid-icon\">{{btn.icon}}</mat-icon>\n                </button>\n              }\n              @case ('mini-fab') {\n                <button mat-mini-fab [color]=\"btn.color || 'primary'\" type=\"button\"\n                  class=\"mtx-grid-action-button\" [class]=\"btn.class\"\n                  [disabled]=\"btn | cellActionDisable: rowData: rowChangeRecord: rowChangeRecord?.currentValue\"\n                  [matTooltip]=\"(btn | cellActionTooltip).message | toObservable | async\"\n                  [matTooltipClass]=\"(btn | cellActionTooltip).class\"\n                  [matTooltipHideDelay]=\"(btn | cellActionTooltip).hideDelay\"\n                  [matTooltipShowDelay]=\"(btn | cellActionTooltip).showDelay\"\n                  [matTooltipPosition]=\"(btn | cellActionTooltip).position || 'below'\"\n                  [matTooltipPositionAtOrigin]=\"(btn | cellActionTooltip).positionAtOrigin\"\n                  [matTooltipTouchGestures]=\"(btn | cellActionTooltip).touchGestures || 'auto'\"\n                  [matTooltipDisabled]=\"(btn | cellActionTooltip).disabled\"\n                  [matBadge]=\"(btn | cellActionBadge).content | toObservable | async\"\n                  [matBadgeDescription]=\"(btn | cellActionBadge).description | toObservable | async\"\n                  [matBadgeColor]=\"(btn | cellActionBadge).color\"\n                  [matBadgePosition]=\"(btn | cellActionBadge).position || 'above after'\"\n                  [matBadgeSize]=\"(btn | cellActionBadge).size || 'medium'\"\n                  [matBadgeOverlap]=\"(btn | cellActionBadge).overlap\"\n                  [matBadgeDisabled]=\"(btn | cellActionBadge).disabled\"\n                  [matBadgeHidden]=\"(btn | cellActionBadge).hidden\"\n                  (click)=\"_onActionClick($event, btn, rowData)\">\n                  <mat-icon class=\"mtx-grid-icon\">{{btn.icon}}</mat-icon>\n                </button>\n              }\n              @default {\n                <button mat-button [color]=\"btn.color || 'primary'\" type=\"button\"\n                  class=\"mtx-grid-action-button\" [class]=\"btn.class\"\n                  [disabled]=\"btn | cellActionDisable: rowData: rowChangeRecord: rowChangeRecord?.currentValue\"\n                  [matTooltip]=\"(btn | cellActionTooltip).message | toObservable | async\"\n                  [matTooltipClass]=\"(btn | cellActionTooltip).class\"\n                  [matTooltipHideDelay]=\"(btn | cellActionTooltip).hideDelay\"\n                  [matTooltipShowDelay]=\"(btn | cellActionTooltip).showDelay\"\n                  [matTooltipPosition]=\"(btn | cellActionTooltip).position || 'below'\"\n                  [matTooltipPositionAtOrigin]=\"(btn | cellActionTooltip).positionAtOrigin\"\n                  [matTooltipTouchGestures]=\"(btn | cellActionTooltip).touchGestures || 'auto'\"\n                  [matTooltipDisabled]=\"(btn | cellActionTooltip).disabled\"\n                  [matBadge]=\"(btn | cellActionBadge).content | toObservable | async\"\n                  [matBadgeDescription]=\"(btn | cellActionBadge).description | toObservable | async\"\n                  [matBadgeColor]=\"(btn | cellActionBadge).color\"\n                  [matBadgePosition]=\"(btn | cellActionBadge).position || 'above after'\"\n                  [matBadgeSize]=\"(btn | cellActionBadge).size || 'medium'\"\n                  [matBadgeOverlap]=\"(btn | cellActionBadge).overlap\"\n                  [matBadgeDisabled]=\"(btn | cellActionBadge).disabled\"\n                  [matBadgeHidden]=\"(btn | cellActionBadge).hidden\"\n                  (click)=\"_onActionClick($event, btn, rowData)\">\n                  @if (btn.icon) {\n                    <mat-icon class=\"mtx-grid-icon\">{{btn.icon}}</mat-icon>\n                  }\n                  <span>{{btn.text | toObservable | async}}</span>\n                </button>\n              }\n            }\n          }\n        }\n      }\n      <!-- Tag -->\n      @case ('tag') {\n        @if (colDef.tag && colDef.tag[_value]) {\n          <mat-chip-listbox>\n            <mat-chip color=\"primary\" [class]=\"'bg-' + colDef.tag[_value].color\">\n              {{colDef.tag[_value].text}}\n            </mat-chip>\n          </mat-chip-listbox>\n        } @else {\n          {{_value}}\n        }\n      }\n      <!-- Link -->\n      @case ('link') {\n        <a [href]=\"_value\" target=\"_blank\">{{_value}}</a>\n      }\n      <!-- Image -->\n      @case ('image') {\n        <img class=\"mtx-grid-img\" [src]=\"_value\">\n      }\n      <!-- Boolean -->\n      @case ('boolean') {\n        <span [title]=\"_getTooltip(_value)\">{{_getText(_value)}}</span>\n      }\n      <!-- Number -->\n      @case ('number') {\n        <span [title]=\"_getTooltip(_value | number: colDef.typeParameter?.digitsInfo: colDef.typeParameter?.locale)\">\n          {{_getText(_value | number: colDef.typeParameter?.digitsInfo: colDef.typeParameter?.locale)}}\n        </span>\n      }\n      <!-- Currency -->\n      @case ('currency') {\n        <span [title]=\"_getTooltip(_value | currency: colDef.typeParameter?.currencyCode: colDef.typeParameter?.display: colDef.typeParameter?.digitsInfo: colDef.typeParameter?.locale)\">\n          {{_getText(_value | currency: colDef.typeParameter?.currencyCode: colDef.typeParameter?.display: colDef.typeParameter?.digitsInfo: colDef.typeParameter?.locale)}}\n        </span>\n      }\n      <!-- Percent -->\n      @case ('percent') {\n        <span [title]=\"_getTooltip(_value | percent: colDef.typeParameter?.digitsInfo: colDef.typeParameter?.locale)\">\n          {{_getText(_value | percent: colDef.typeParameter?.digitsInfo: colDef.typeParameter?.locale)}}\n        </span>\n      }\n      <!-- Date -->\n      @case ('date') {\n        <span [title]=\"_getTooltip(_value | date: colDef.typeParameter?.format: colDef.typeParameter?.timezone: colDef.typeParameter?.locale)\">\n          {{_getText(_value | date: colDef.typeParameter?.format: colDef.typeParameter?.timezone: colDef.typeParameter?.locale)}}\n        </span>\n      }\n      <!-- Default -->\n      @default {\n        <span [title]=\"_getTooltip(_value)\">{{_getText(_value)}}</span>\n      }\n    }\n  }\n}\n", styles: [".mtx-grid-img{display:inline-block;width:32px;border-radius:4px;vertical-align:middle}\n"] }]
        }], ctorParameters: () => [{ type: i1$1.MtxDialog }, { type: MtxGridUtils }, { type: i0.KeyValueDiffers }, { type: i0.ChangeDetectorRef }], propDecorators: { rowData: [{
                type: Input
            }], colDef: [{
                type: Input
            }], data: [{
                type: Input
            }], summary: [{
                type: Input
            }], placeholder: [{
                type: Input
            }], rowDataChange: [{
                type: Output
            }] } });

class MtxGridColumnMenu {
    constructor() {
        this.columns = [];
        this.selectable = true;
        this.selectableChecked = 'show';
        this.sortable = true;
        this.pinnable = true;
        this._buttonText = '';
        this.buttonType = 'stroked';
        this.buttonClass = '';
        this.buttonIcon = '';
        this.showHeader = false;
        this.headerText = 'Columns Header';
        this.showFooter = false;
        this.footerText = 'Columns Footer';
        this.columnChange = new EventEmitter();
        this._pinOptions = [
            { label: 'Pin Left', value: 'left' },
            { label: 'Pin Right', value: 'right' },
            { label: 'No Pin', value: null },
        ];
    }
    get buttonText() {
        const defaultText = `Columns ${this.selectableChecked === 'show' ? 'Shown' : 'Hidden'}`;
        return this._buttonText ? this._buttonText : defaultText;
    }
    set buttonText(value) {
        this._buttonText = value;
    }
    get pinOptions() {
        return this._pinOptions;
    }
    set pinOptions(value) {
        if (value.length > 0) {
            this._pinOptions = value;
        }
    }
    _handleDroped(e) {
        moveItemInArray(this.columns, e.previousIndex, e.currentIndex);
        this.columnChange.emit(this.columns);
    }
    _handleChecked(col) {
        if (this.selectableChecked === 'show') {
            col.hide = !col.show;
        }
        else {
            col.show = !col.hide;
        }
        this.columnChange.emit(this.columns);
    }
    _handlePinSelect(col, val) {
        if (col.pinned != val) {
            col.pinned = val;
            this.columnChange.emit(this.columns);
        }
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxGridColumnMenu, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    /** @nocollapse */ static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.0.1", type: MtxGridColumnMenu, isStandalone: true, selector: "mtx-grid-column-menu", inputs: { columns: "columns", selectable: "selectable", selectableChecked: "selectableChecked", sortable: "sortable", pinnable: "pinnable", buttonText: "buttonText", buttonType: "buttonType", buttonColor: "buttonColor", buttonClass: "buttonClass", buttonIcon: "buttonIcon", showHeader: "showHeader", headerText: "headerText", headerTemplate: "headerTemplate", showFooter: "showFooter", footerText: "footerText", footerTemplate: "footerTemplate", pinOptions: "pinOptions" }, outputs: { columnChange: "columnChange" }, viewQueries: [{ propertyName: "menuPanel", first: true, predicate: ["menu"], descendants: true, static: true }, { propertyName: "menuTrigger", first: true, predicate: MatMenuTrigger, descendants: true }], exportAs: ["mtxGridColumnMenu"], ngImport: i0, template: "@switch (buttonType) {\n  @case ('raised') {\n    <button [class]=\"buttonClass\" mat-raised-button type=\"button\" [color]=\"buttonColor\"\n      [matMenuTriggerFor]=\"menu\">\n      @if (buttonIcon) {\n        <mat-icon>{{buttonIcon}}</mat-icon>\n      }\n      {{buttonText}}\n    </button>\n  }\n  @case ('stroked') {\n    <button [class]=\"buttonClass\" mat-stroked-button type=\"button\" [color]=\"buttonColor\"\n      [matMenuTriggerFor]=\"menu\">\n      @if (buttonIcon) {\n        <mat-icon>{{buttonIcon}}</mat-icon>\n      }\n      {{buttonText}}\n    </button>\n  }\n  @case ('flat') {\n    <button [class]=\"buttonClass\" mat-flat-button type=\"button\" [color]=\"buttonColor\"\n      [matMenuTriggerFor]=\"menu\">\n      @if (buttonIcon) {\n        <mat-icon>{{buttonIcon}}</mat-icon>\n      }\n      {{buttonText}}\n    </button>\n    }\n  @case ('icon') {\n    <button [class]=\"buttonClass\" mat-icon-button type=\"button\" [color]=\"buttonColor\"\n      [matMenuTriggerFor]=\"menu\">\n      @if (buttonIcon) {\n        <mat-icon>{{buttonIcon}}</mat-icon>\n      }\n    </button>\n  }\n  @case ('fab') {\n    <button [class]=\"buttonClass\" mat-fab type=\"button\" [color]=\"buttonColor\"\n      [matMenuTriggerFor]=\"menu\">\n      @if (buttonIcon) {\n        <mat-icon>{{buttonIcon}}</mat-icon>\n      }\n      {{buttonText}}\n    </button>\n  }\n  @case ('mini-fab') {\n    <button [class]=\"buttonClass\" mat-mini-fab type=\"button\" [color]=\"buttonColor\"\n      [matMenuTriggerFor]=\"menu\">\n      @if (buttonIcon) {\n        <mat-icon>{{buttonIcon}}</mat-icon>\n      }\n      {{buttonText}}\n    </button>\n  }\n  @default {\n    <button [class]=\"buttonClass\" mat-button type=\"button\" [color]=\"buttonColor\"\n      [matMenuTriggerFor]=\"menu\">\n      @if (buttonIcon) {\n        <mat-icon>{{buttonIcon}}</mat-icon>\n      }\n      {{buttonText}}\n    </button>\n  }\n}\n\n<mat-menu #menu=\"matMenu\" class=\"mtx-grid-column-menu\">\n  <div class=\"mtx-grid-column-menu-content\"\n    (click)=\"$event.stopPropagation()\" (keydown)=\"$event.stopPropagation()\">\n    @if (showHeader) {\n      <div class=\"mtx-grid-column-menu-header\">\n        @if (headerTemplate) {\n          <ng-template [ngTemplateOutlet]=\"headerTemplate\"></ng-template>\n        } @else {\n          {{headerText}}\n        }\n      </div>\n    }\n\n    <div class=\"mtx-grid-column-menu-body\">\n      @if (sortable) {\n        <div class=\"mtx-grid-column-menu-list\"\n          cdkDropList (cdkDropListDropped)=\"_handleDroped($event)\">\n          @for (col of columns; track col) {\n            <div class=\"mtx-grid-column-menu-item\"\n              cdkDrag [cdkDragDisabled]=\"selectableChecked === 'show'? !col.show : col.hide\">\n              <svg class=\"mtx-grid-icon mtx-grid-column-drag-handle-icon\" viewBox=\"0 0 24 24\"\n                width=\"24px\" height=\"24px\" fill=\"currentColor\" focusable=\"false\">\n                <path d=\"M7,19V17H9V19H7M11,19V17H13V19H11M15,19V17H17V19H15M7,15V13H9V15H7M11,15V13H13V15H11M15,15V13H17V15H15M7,11V9H9V11H7M11,11V9H13V11H11M15,11V9H17V11H15M7,7V5H9V7H7M11,7V5H13V7H11M15,7V5H17V7H15Z\" />\n              </svg>\n              <ng-template [ngTemplateOutlet]=\"checkboxList\"\n                [ngTemplateOutletContext]=\"{ $implicit: col }\">\n              </ng-template>\n            </div>\n          }\n        </div>\n      }\n\n      @if (!sortable) {\n        <div class=\"mtx-grid-column-menu-list\">\n          @for (col of columns; track col) {\n            <div class=\"mtx-grid-column-menu-item\">\n              <ng-template [ngTemplateOutlet]=\"checkboxList\"\n                [ngTemplateOutletContext]=\"{ $implicit: col }\">\n              </ng-template>\n            </div>\n          }\n        </div>\n      }\n    </div>\n\n    @if (showFooter) {\n      <div class=\"mtx-grid-column-menu-footer\">\n        @if (footerTemplate) {\n          <ng-template [ngTemplateOutlet]=\"footerTemplate\"></ng-template>\n        } @else {\n          {{footerText}}\n        }\n      </div>\n    }\n  </div>\n</mat-menu>\n\n<ng-template #checkboxList let-col>\n  @if (pinnable) {\n    <button class=\"mtx-grid-column-pin-button\" mat-icon-button type=\"button\"\n      [matMenuTriggerFor]=\"pinList\">\n      @if (col.pinned) {\n        <svg class=\"mtx-grid-icon mtx-grid-column-pin-icon\"\n          viewBox=\"0 0 24 24\" width=\"24px\" height=\"24px\" fill=\"currentColor\" focusable=\"false\">\n          <path d=\"M16,12V4H17V2H7V4H8V12L6,14V16H11.2V22H12.8V16H18V14L16,12Z\" />\n        </svg>\n      }\n      @if (!col.pinned) {\n        <svg class=\"mtx-grid-icon mtx-grid-column-pin-off-icon\"\n          viewBox=\"0 0 24 24\" width=\"24px\" height=\"24px\" fill=\"currentColor\" focusable=\"false\">\n          <path d=\"M2,5.27L3.28,4L20,20.72L18.73,22L12.8,16.07V22H11.2V16H6V14L8,12V11.27L2,5.27M16,12L18,14V16H17.82L8,6.18V4H7V2H17V4H16V12Z\" />\n        </svg>\n      }\n      </button>\n      <mat-menu #pinList=\"matMenu\" class=\"mtx-grid-column-pin-list\">\n        @for (item of pinOptions; track item) {\n          <button class=\"mtx-grid-column-pin-option\" type=\"button\"\n            mat-menu-item\n            (click)=\"_handlePinSelect(col, item.value)\">\n            <span class=\"mtx-grid-column-pin-option-placeholder\">\n              <!-- eslint-disable-next-line @angular-eslint/template/eqeqeq -->\n              @if (col.pinned==item.value) {\n                <svg class=\"mtx-grid-icon mtx-grid-column-pin-check-icon\"\n                  viewBox=\"0 0 24 24\" width=\"24px\" height=\"24px\" fill=\"currentColor\" focusable=\"false\">\n                  <path d=\"M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z\" />\n                </svg>\n              }\n            </span>\n            <span class=\"mtx-grid-column-pin-option-text\">{{item.label | toObservable | async}}</span>\n          </button>\n        }\n      </mat-menu>\n  }\n\n  @if (selectable) {\n    <mat-checkbox class=\"mtx-grid-column-menu-item-label\"\n      [(ngModel)]=\"col[selectableChecked]\" [disabled]=\"col.disabled\"\n      (change)=\"_handleChecked(col)\">{{col.header | toObservable | async}}</mat-checkbox>\n  } @else {\n    <span class=\"mtx-grid-column-menu-item-label\">{{col.header | toObservable | async}}</span>\n  }\n</ng-template>\n", styles: [".mtx-grid-column-menu,.mtx-grid-column-pin-list{color:var(--mtx-grid-column-menu-text-color);box-shadow:var(--mtx-grid-column-menu-elevation-shadow)}.mtx-grid-column-menu .mat-mdc-menu-content{padding:0}.mtx-grid-column-menu-body{max-height:65vh;padding:8px 16px;overflow:auto}.mtx-grid-column-menu-header,.mtx-grid-column-menu-footer{position:sticky;z-index:1;padding:8px 16px}.mtx-grid-column-menu-header{top:0;border-bottom:1px solid var(--mtx-grid-column-menu-divider-color)}.mtx-grid-column-menu-footer{bottom:0;border-top:1px solid var(--mtx-grid-column-menu-divider-color)}.mtx-grid-column-menu-list{display:block;max-width:100%}.mtx-grid-column-menu-list.cdk-drop-list-dragging .mtx-grid-column-menu-item:not(.cdk-drag-placeholder){transition:transform .25s cubic-bezier(0,0,.2,1)}.mtx-grid-column-menu-item{display:flex;flex-direction:row;align-items:center}.mtx-grid-column-menu-item.cdk-drag-disabled .cdk-drag-handle{opacity:.35;cursor:no-drop}.mtx-grid-column-menu-item .cdk-drag-handle{cursor:move}.mtx-grid-column-menu-item.cdk-drag-preview{border-radius:4px;box-shadow:0 0 0 1px var(--mtx-grid-outline-color)}.mtx-grid-column-menu-item.cdk-drag-placeholder{opacity:0}.mtx-grid-column-menu-item.cdk-drag-animating{transition:transform .25s cubic-bezier(0,0,.2,1)}.mtx-grid-column-pin-button.mat-mdc-icon-button .mat-mdc-button-touch-target{width:100%;height:100%}.mtx-grid-column-pin-option.mat-menu-item{display:flex;align-items:center;height:32px}.mtx-grid-column-pin-option-placeholder{display:inline-block;width:20px;height:20px;line-height:20px;vertical-align:middle}.mtx-grid-column-pin-option-text{padding:0 8px;vertical-align:middle}.mtx-grid-column-drag-handle-icon:hover{cursor:move}.mtx-grid-column-menu-item-label.mat-mdc-checkbox .mat-mdc-checkbox-touch-target{width:100%;height:100%}\n"], dependencies: [{ kind: "pipe", type: AsyncPipe, name: "async" }, { kind: "directive", type: NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "ngmodule", type: FormsModule }, { kind: "directive", type: i1$2.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i1$2.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: MatButton, selector: "    button[mat-button], button[mat-raised-button], button[mat-flat-button],    button[mat-stroked-button]  ", exportAs: ["matButton"] }, { kind: "component", type: MatIconButton, selector: "button[mat-icon-button]", exportAs: ["matButton"] }, { kind: "component", type: MatFabButton, selector: "button[mat-fab]", inputs: ["extended"], exportAs: ["matButton"] }, { kind: "component", type: MatMiniFabButton, selector: "button[mat-mini-fab]", exportAs: ["matButton"] }, { kind: "component", type: MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }, { kind: "component", type: MatMenu, selector: "mat-menu", inputs: ["backdropClass", "aria-label", "aria-labelledby", "aria-describedby", "xPosition", "yPosition", "overlapTrigger", "hasBackdrop", "class", "classList"], outputs: ["closed", "close"], exportAs: ["matMenu"] }, { kind: "directive", type: MatMenuTrigger, selector: "[mat-menu-trigger-for], [matMenuTriggerFor]", inputs: ["mat-menu-trigger-for", "matMenuTriggerFor", "matMenuTriggerData", "matMenuTriggerRestoreFocus"], outputs: ["menuOpened", "onMenuOpen", "menuClosed", "onMenuClose"], exportAs: ["matMenuTrigger"] }, { kind: "component", type: MatMenuItem, selector: "[mat-menu-item]", inputs: ["role", "disabled", "disableRipple"], exportAs: ["matMenuItem"] }, { kind: "component", type: MatCheckbox, selector: "mat-checkbox", inputs: ["aria-label", "aria-labelledby", "aria-describedby", "id", "required", "labelPosition", "name", "value", "disableRipple", "tabIndex", "color", "checked", "disabled", "indeterminate"], outputs: ["change", "indeterminateChange"], exportAs: ["matCheckbox"] }, { kind: "directive", type: CdkDrag, selector: "[cdkDrag]", inputs: ["cdkDragData", "cdkDragLockAxis", "cdkDragRootElement", "cdkDragBoundary", "cdkDragStartDelay", "cdkDragFreeDragPosition", "cdkDragDisabled", "cdkDragConstrainPosition", "cdkDragPreviewClass", "cdkDragPreviewContainer"], outputs: ["cdkDragStarted", "cdkDragReleased", "cdkDragEnded", "cdkDragEntered", "cdkDragExited", "cdkDragDropped", "cdkDragMoved"], exportAs: ["cdkDrag"] }, { kind: "directive", type: CdkDropList, selector: "[cdkDropList], cdk-drop-list", inputs: ["cdkDropListConnectedTo", "cdkDropListData", "cdkDropListOrientation", "id", "cdkDropListLockAxis", "cdkDropListDisabled", "cdkDropListSortingDisabled", "cdkDropListEnterPredicate", "cdkDropListSortPredicate", "cdkDropListAutoScrollDisabled", "cdkDropListAutoScrollStep"], outputs: ["cdkDropListDropped", "cdkDropListEntered", "cdkDropListExited", "cdkDropListSorted"], exportAs: ["cdkDropList"] }, { kind: "pipe", type: MtxToObservablePipe, name: "toObservable" }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxGridColumnMenu, decorators: [{
            type: Component,
            args: [{ selector: 'mtx-grid-column-menu', exportAs: 'mtxGridColumnMenu', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, standalone: true, imports: [
                        AsyncPipe,
                        NgTemplateOutlet,
                        FormsModule,
                        MatButton,
                        MatIconButton,
                        MatFabButton,
                        MatMiniFabButton,
                        MatIcon,
                        MatMenu,
                        MatMenuTrigger,
                        MatMenuItem,
                        MatCheckbox,
                        CdkDrag,
                        CdkDropList,
                        MtxToObservablePipe,
                    ], template: "@switch (buttonType) {\n  @case ('raised') {\n    <button [class]=\"buttonClass\" mat-raised-button type=\"button\" [color]=\"buttonColor\"\n      [matMenuTriggerFor]=\"menu\">\n      @if (buttonIcon) {\n        <mat-icon>{{buttonIcon}}</mat-icon>\n      }\n      {{buttonText}}\n    </button>\n  }\n  @case ('stroked') {\n    <button [class]=\"buttonClass\" mat-stroked-button type=\"button\" [color]=\"buttonColor\"\n      [matMenuTriggerFor]=\"menu\">\n      @if (buttonIcon) {\n        <mat-icon>{{buttonIcon}}</mat-icon>\n      }\n      {{buttonText}}\n    </button>\n  }\n  @case ('flat') {\n    <button [class]=\"buttonClass\" mat-flat-button type=\"button\" [color]=\"buttonColor\"\n      [matMenuTriggerFor]=\"menu\">\n      @if (buttonIcon) {\n        <mat-icon>{{buttonIcon}}</mat-icon>\n      }\n      {{buttonText}}\n    </button>\n    }\n  @case ('icon') {\n    <button [class]=\"buttonClass\" mat-icon-button type=\"button\" [color]=\"buttonColor\"\n      [matMenuTriggerFor]=\"menu\">\n      @if (buttonIcon) {\n        <mat-icon>{{buttonIcon}}</mat-icon>\n      }\n    </button>\n  }\n  @case ('fab') {\n    <button [class]=\"buttonClass\" mat-fab type=\"button\" [color]=\"buttonColor\"\n      [matMenuTriggerFor]=\"menu\">\n      @if (buttonIcon) {\n        <mat-icon>{{buttonIcon}}</mat-icon>\n      }\n      {{buttonText}}\n    </button>\n  }\n  @case ('mini-fab') {\n    <button [class]=\"buttonClass\" mat-mini-fab type=\"button\" [color]=\"buttonColor\"\n      [matMenuTriggerFor]=\"menu\">\n      @if (buttonIcon) {\n        <mat-icon>{{buttonIcon}}</mat-icon>\n      }\n      {{buttonText}}\n    </button>\n  }\n  @default {\n    <button [class]=\"buttonClass\" mat-button type=\"button\" [color]=\"buttonColor\"\n      [matMenuTriggerFor]=\"menu\">\n      @if (buttonIcon) {\n        <mat-icon>{{buttonIcon}}</mat-icon>\n      }\n      {{buttonText}}\n    </button>\n  }\n}\n\n<mat-menu #menu=\"matMenu\" class=\"mtx-grid-column-menu\">\n  <div class=\"mtx-grid-column-menu-content\"\n    (click)=\"$event.stopPropagation()\" (keydown)=\"$event.stopPropagation()\">\n    @if (showHeader) {\n      <div class=\"mtx-grid-column-menu-header\">\n        @if (headerTemplate) {\n          <ng-template [ngTemplateOutlet]=\"headerTemplate\"></ng-template>\n        } @else {\n          {{headerText}}\n        }\n      </div>\n    }\n\n    <div class=\"mtx-grid-column-menu-body\">\n      @if (sortable) {\n        <div class=\"mtx-grid-column-menu-list\"\n          cdkDropList (cdkDropListDropped)=\"_handleDroped($event)\">\n          @for (col of columns; track col) {\n            <div class=\"mtx-grid-column-menu-item\"\n              cdkDrag [cdkDragDisabled]=\"selectableChecked === 'show'? !col.show : col.hide\">\n              <svg class=\"mtx-grid-icon mtx-grid-column-drag-handle-icon\" viewBox=\"0 0 24 24\"\n                width=\"24px\" height=\"24px\" fill=\"currentColor\" focusable=\"false\">\n                <path d=\"M7,19V17H9V19H7M11,19V17H13V19H11M15,19V17H17V19H15M7,15V13H9V15H7M11,15V13H13V15H11M15,15V13H17V15H15M7,11V9H9V11H7M11,11V9H13V11H11M15,11V9H17V11H15M7,7V5H9V7H7M11,7V5H13V7H11M15,7V5H17V7H15Z\" />\n              </svg>\n              <ng-template [ngTemplateOutlet]=\"checkboxList\"\n                [ngTemplateOutletContext]=\"{ $implicit: col }\">\n              </ng-template>\n            </div>\n          }\n        </div>\n      }\n\n      @if (!sortable) {\n        <div class=\"mtx-grid-column-menu-list\">\n          @for (col of columns; track col) {\n            <div class=\"mtx-grid-column-menu-item\">\n              <ng-template [ngTemplateOutlet]=\"checkboxList\"\n                [ngTemplateOutletContext]=\"{ $implicit: col }\">\n              </ng-template>\n            </div>\n          }\n        </div>\n      }\n    </div>\n\n    @if (showFooter) {\n      <div class=\"mtx-grid-column-menu-footer\">\n        @if (footerTemplate) {\n          <ng-template [ngTemplateOutlet]=\"footerTemplate\"></ng-template>\n        } @else {\n          {{footerText}}\n        }\n      </div>\n    }\n  </div>\n</mat-menu>\n\n<ng-template #checkboxList let-col>\n  @if (pinnable) {\n    <button class=\"mtx-grid-column-pin-button\" mat-icon-button type=\"button\"\n      [matMenuTriggerFor]=\"pinList\">\n      @if (col.pinned) {\n        <svg class=\"mtx-grid-icon mtx-grid-column-pin-icon\"\n          viewBox=\"0 0 24 24\" width=\"24px\" height=\"24px\" fill=\"currentColor\" focusable=\"false\">\n          <path d=\"M16,12V4H17V2H7V4H8V12L6,14V16H11.2V22H12.8V16H18V14L16,12Z\" />\n        </svg>\n      }\n      @if (!col.pinned) {\n        <svg class=\"mtx-grid-icon mtx-grid-column-pin-off-icon\"\n          viewBox=\"0 0 24 24\" width=\"24px\" height=\"24px\" fill=\"currentColor\" focusable=\"false\">\n          <path d=\"M2,5.27L3.28,4L20,20.72L18.73,22L12.8,16.07V22H11.2V16H6V14L8,12V11.27L2,5.27M16,12L18,14V16H17.82L8,6.18V4H7V2H17V4H16V12Z\" />\n        </svg>\n      }\n      </button>\n      <mat-menu #pinList=\"matMenu\" class=\"mtx-grid-column-pin-list\">\n        @for (item of pinOptions; track item) {\n          <button class=\"mtx-grid-column-pin-option\" type=\"button\"\n            mat-menu-item\n            (click)=\"_handlePinSelect(col, item.value)\">\n            <span class=\"mtx-grid-column-pin-option-placeholder\">\n              <!-- eslint-disable-next-line @angular-eslint/template/eqeqeq -->\n              @if (col.pinned==item.value) {\n                <svg class=\"mtx-grid-icon mtx-grid-column-pin-check-icon\"\n                  viewBox=\"0 0 24 24\" width=\"24px\" height=\"24px\" fill=\"currentColor\" focusable=\"false\">\n                  <path d=\"M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z\" />\n                </svg>\n              }\n            </span>\n            <span class=\"mtx-grid-column-pin-option-text\">{{item.label | toObservable | async}}</span>\n          </button>\n        }\n      </mat-menu>\n  }\n\n  @if (selectable) {\n    <mat-checkbox class=\"mtx-grid-column-menu-item-label\"\n      [(ngModel)]=\"col[selectableChecked]\" [disabled]=\"col.disabled\"\n      (change)=\"_handleChecked(col)\">{{col.header | toObservable | async}}</mat-checkbox>\n  } @else {\n    <span class=\"mtx-grid-column-menu-item-label\">{{col.header | toObservable | async}}</span>\n  }\n</ng-template>\n", styles: [".mtx-grid-column-menu,.mtx-grid-column-pin-list{color:var(--mtx-grid-column-menu-text-color);box-shadow:var(--mtx-grid-column-menu-elevation-shadow)}.mtx-grid-column-menu .mat-mdc-menu-content{padding:0}.mtx-grid-column-menu-body{max-height:65vh;padding:8px 16px;overflow:auto}.mtx-grid-column-menu-header,.mtx-grid-column-menu-footer{position:sticky;z-index:1;padding:8px 16px}.mtx-grid-column-menu-header{top:0;border-bottom:1px solid var(--mtx-grid-column-menu-divider-color)}.mtx-grid-column-menu-footer{bottom:0;border-top:1px solid var(--mtx-grid-column-menu-divider-color)}.mtx-grid-column-menu-list{display:block;max-width:100%}.mtx-grid-column-menu-list.cdk-drop-list-dragging .mtx-grid-column-menu-item:not(.cdk-drag-placeholder){transition:transform .25s cubic-bezier(0,0,.2,1)}.mtx-grid-column-menu-item{display:flex;flex-direction:row;align-items:center}.mtx-grid-column-menu-item.cdk-drag-disabled .cdk-drag-handle{opacity:.35;cursor:no-drop}.mtx-grid-column-menu-item .cdk-drag-handle{cursor:move}.mtx-grid-column-menu-item.cdk-drag-preview{border-radius:4px;box-shadow:0 0 0 1px var(--mtx-grid-outline-color)}.mtx-grid-column-menu-item.cdk-drag-placeholder{opacity:0}.mtx-grid-column-menu-item.cdk-drag-animating{transition:transform .25s cubic-bezier(0,0,.2,1)}.mtx-grid-column-pin-button.mat-mdc-icon-button .mat-mdc-button-touch-target{width:100%;height:100%}.mtx-grid-column-pin-option.mat-menu-item{display:flex;align-items:center;height:32px}.mtx-grid-column-pin-option-placeholder{display:inline-block;width:20px;height:20px;line-height:20px;vertical-align:middle}.mtx-grid-column-pin-option-text{padding:0 8px;vertical-align:middle}.mtx-grid-column-drag-handle-icon:hover{cursor:move}.mtx-grid-column-menu-item-label.mat-mdc-checkbox .mat-mdc-checkbox-touch-target{width:100%;height:100%}\n"] }]
        }], propDecorators: { menuPanel: [{
                type: ViewChild,
                args: ['menu', { static: true }]
            }], menuTrigger: [{
                type: ViewChild,
                args: [MatMenuTrigger]
            }], columns: [{
                type: Input
            }], selectable: [{
                type: Input
            }], selectableChecked: [{
                type: Input
            }], sortable: [{
                type: Input
            }], pinnable: [{
                type: Input
            }], buttonText: [{
                type: Input
            }], buttonType: [{
                type: Input
            }], buttonColor: [{
                type: Input
            }], buttonClass: [{
                type: Input
            }], buttonIcon: [{
                type: Input
            }], showHeader: [{
                type: Input
            }], headerText: [{
                type: Input
            }], headerTemplate: [{
                type: Input
            }], showFooter: [{
                type: Input
            }], footerText: [{
                type: Input
            }], footerTemplate: [{
                type: Input
            }], columnChange: [{
                type: Output
            }], pinOptions: [{
                type: Input
            }] } });

class MtxGridExpansionToggle {
    get opened() {
        return this._opened;
    }
    set opened(newValue) {
        this._opened = newValue;
        this.openedChange.emit(newValue);
    }
    get expanded() {
        return this._opened;
    }
    set expandableRow(value) {
        if (value !== this._row) {
            this._row = value;
        }
    }
    set template(value) {
        if (value !== this._tplRef) {
            this._tplRef = value;
        }
    }
    constructor() {
        this._opened = false;
        this.openedChange = new EventEmitter();
        this.toggleChange = new EventEmitter();
    }
    onClick(event) {
        event.preventDefault();
        event.stopPropagation();
        this.toggle();
    }
    toggle() {
        this.opened = !this.opened;
        this.toggleChange.emit(this);
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxGridExpansionToggle, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    /** @nocollapse */ static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.0.1", type: MtxGridExpansionToggle, isStandalone: true, selector: "[mtx-grid-expansion-toggle]", inputs: { opened: "opened", expandableRow: "expandableRow", template: ["expansionRowTpl", "template"] }, outputs: { openedChange: "openedChange", toggleChange: "toggleChange" }, host: { listeners: { "click": "onClick($event)" }, properties: { "class.expanded": "this.expanded" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxGridExpansionToggle, decorators: [{
            type: Directive,
            args: [{
                    selector: '[mtx-grid-expansion-toggle]',
                    standalone: true,
                }]
        }], ctorParameters: () => [], propDecorators: { opened: [{
                type: Input
            }], openedChange: [{
                type: Output
            }], expanded: [{
                type: HostBinding,
                args: ['class.expanded']
            }], expandableRow: [{
                type: Input
            }], template: [{
                type: Input,
                args: ['expansionRowTpl']
            }], toggleChange: [{
                type: Output
            }], onClick: [{
                type: HostListener,
                args: ['click', ['$event']]
            }] } });

class MtxGridSelectableCell {
    constructor() {
        this.ctrlKeyPressed = false;
        this.shiftKeyPressed = false;
        this._selected = false;
        this.cellSelectable = true;
        this.cellSelectedChange = new EventEmitter();
    }
    get selected() {
        return this._selected;
    }
    onClick(event) {
        this.ctrlKeyPressed = event.ctrlKey;
        this.shiftKeyPressed = event.shiftKey;
        if (this.cellSelectable) {
            this.select();
        }
    }
    select() {
        this._selected = true;
        this.cellSelectedChange.emit(this);
    }
    deselect() {
        this._selected = false;
        this.cellSelectedChange.emit(this);
    }
    toggle() {
        this._selected = !this._selected;
        this.cellSelectedChange.emit(this);
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxGridSelectableCell, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    /** @nocollapse */ static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.0.1", type: MtxGridSelectableCell, isStandalone: true, selector: "[mtx-grid-selectable-cell]", inputs: { cellSelectable: "cellSelectable" }, outputs: { cellSelectedChange: "cellSelectedChange" }, host: { listeners: { "click": "onClick($event)" }, properties: { "class.selected": "this.selected" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxGridSelectableCell, decorators: [{
            type: Directive,
            args: [{
                    selector: '[mtx-grid-selectable-cell]',
                    standalone: true,
                }]
        }], propDecorators: { selected: [{
                type: HostBinding,
                args: ['class.selected']
            }], cellSelectable: [{
                type: Input
            }], cellSelectedChange: [{
                type: Output
            }], onClick: [{
                type: HostListener,
                args: ['click', ['$event']]
            }] } });

/** Injection token that can be used to specify default grid options. */
const MTX_GRID_DEFAULT_OPTIONS = new InjectionToken('mtx-grid-default-options');
class MtxGrid {
    get _hasNoResult() {
        return (!this.dataSource.data || this.dataSource.data.length === 0) && !this.loading;
    }
    // TODO: Summary display conditions
    get _whetherShowSummary() {
        return this.showSummary;
    }
    constructor(_utils, _changeDetectorRef, _defaultOptions) {
        this._utils = _utils;
        this._changeDetectorRef = _changeDetectorRef;
        this._defaultOptions = _defaultOptions;
        this.dataSource = new MatTableDataSource();
        /** The grid's displayed columns. */
        this.displayedColumns = [];
        /** The grid's columns. */
        this.columns = [];
        /** The grid's data. */
        this.data = [];
        /** The total number of the data. */
        this.length = 0;
        /** Whether the grid is loading. */
        this.loading = false;
        /** Whether the column is resizable. */
        this.columnResizable = this._defaultOptions?.columnResizable ?? false;
        /** Placeholder for the empty value (`null`, `''`, `[]`). */
        this.emptyValuePlaceholder = this._defaultOptions?.emptyValuePlaceholder ?? '--';
        // ===== Page =====
        /** Whether to paginate the data on front end. */
        this.pageOnFront = this._defaultOptions?.pageOnFront ?? true;
        /** Whether to show the paginator. */
        this.showPaginator = this._defaultOptions?.showPaginator ?? true;
        /** Whether the paginator is disabled. */
        this.pageDisabled = this._defaultOptions?.pageDisabled ?? false;
        /** Whether to show the first/last buttons UI to the user. */
        this.showFirstLastButtons = this._defaultOptions?.showFirstLastButtons ?? true;
        /** The zero-based page index of the displayed list of items. */
        this.pageIndex = this._defaultOptions?.pageIndex ?? 0;
        /** Number of items to display on a page. */
        this.pageSize = this._defaultOptions?.pageSize ?? 10;
        /** The set of provided page size options to display to the user. */
        this.pageSizeOptions = this._defaultOptions?.pageSizeOptions ?? [10, 50, 100];
        /** Whether to hide the page size selection UI from the user. */
        this.hidePageSize = this._defaultOptions?.hidePageSize ?? false;
        /** Event emitted when the paginator changes the page size or page index. */
        this.page = new EventEmitter();
        // ===== Sort =====
        /** Whether to sort the data on front end. */
        this.sortOnFront = this._defaultOptions?.sortOnFront ?? true;
        /** The id of the most recently sorted MatSortable. */
        this.sortActive = this._defaultOptions?.sortActive ?? '';
        /** The sort direction of the currently active MatSortable. */
        this.sortDirection = this._defaultOptions?.sortDirection ?? '';
        /**
         * Whether to disable the user from clearing the sort by finishing the sort direction cycle.
         * May be overriden by the column's `disableClear` in `sortProp`.
         */
        this.sortDisableClear = this._defaultOptions?.sortDisableClear ?? false;
        /** Whether the sort is disabled. */
        this.sortDisabled = this._defaultOptions?.sortDisabled ?? false;
        /**
         * The direction to set when an MatSortable is initially sorted.
         * May be overriden by the column's `start` in `sortProp`.
         */
        this.sortStart = this._defaultOptions?.sortStart ?? 'asc';
        /** Event emitted when the user changes either the active sort or sort direction. */
        this.sortChange = new EventEmitter();
        // ===== Row =====
        /** Whether to use the row hover style. */
        this.rowHover = this._defaultOptions?.rowHover ?? false;
        /** Whether to use the row striped style. */
        this.rowStriped = this._defaultOptions?.rowStriped ?? false;
        /** Event emitted when the user clicks the row. */
        this.rowClick = new EventEmitter();
        /** Event emitted when the user attempts to open a context menu. */
        this.rowContextMenu = new EventEmitter();
        // ===== Expandable Row =====
        this.expansionRowStates = [];
        /** Whether the row is expandable. */
        this.expandable = false;
        /** Event emitted when the user toggles the expandable row. */
        this.expansionChange = new EventEmitter();
        // ===== Row Selection =====
        this.rowSelection = new SelectionModel(true, []);
        /** Whether to support multiple row/cell selection. */
        this.multiSelectable = this._defaultOptions?.multiSelectable ?? true;
        /** Whether the user can select multiple rows with click. */
        this.multiSelectionWithClick = this._defaultOptions?.multiSelectionWithClick ?? false;
        /** Whether the row is selectable. */
        this.rowSelectable = this._defaultOptions?.rowSelectable ?? false;
        /** Whether to hide the row selection checkbox. */
        this.hideRowSelectionCheckbox = this._defaultOptions?.hideRowSelectionCheckbox ?? false;
        /** Whether disable rows to be selected when clicked. */
        this.disableRowClickSelection = this._defaultOptions?.disableRowClickSelection ?? false;
        /** The formatter to disable the row selection or hide the row's checkbox. */
        this.rowSelectionFormatter = {};
        /** The selected row items. */
        this.rowSelected = [];
        /** Event emitted when the row is selected. */
        this.rowSelectedChange = new EventEmitter();
        // ===== Cell Selection =====
        this.cellSelection = [];
        /** Whether the cell is selectable. */
        this.cellSelectable = this._defaultOptions?.cellSelectable ?? true;
        /** Event emitted when the cell is selected. */
        this.cellSelectedChange = new EventEmitter();
        // ===== Toolbar =====
        /** Whether to show the toolbar. */
        this.showToolbar = this._defaultOptions?.showToolbar ?? false;
        /** The text of the toolbar's title. */
        this.toolbarTitle = this._defaultOptions?.toolbarTitle ?? '';
        // ===== Column Menu =====
        /** Whether the column is hideable. */
        this.columnHideable = this._defaultOptions?.columnHideable ?? true;
        /** Hide or show when the column's checkbox is checked. */
        this.columnHideableChecked = this._defaultOptions?.columnHideableChecked ?? 'show';
        /** Whether the column is sortable. */
        this.columnSortable = this._defaultOptions?.columnSortable ?? true;
        /** Whether the column is pinnable. */
        this.columnPinnable = this._defaultOptions?.columnPinnable ?? true;
        /** Event emitted when the column is hided or is sorted. */
        this.columnChange = new EventEmitter();
        /** The options for the column pin list. */
        this.columnPinOptions = this._defaultOptions?.columnPinOptions ?? [];
        /** Whether to show the column menu button. */
        this.showColumnMenuButton = this._defaultOptions?.showColumnMenuButton ?? true;
        /** The text for the column menu button. */
        this.columnMenuButtonText = this._defaultOptions?.columnMenuButtonText ?? '';
        /** The type for the column menu button. */
        this.columnMenuButtonType = this._defaultOptions?.columnMenuButtonType ?? 'stroked';
        /** The color for the column menu button. */
        this.columnMenuButtonColor = this._defaultOptions?.columnMenuButtonColor;
        /** The class for the column menu button. */
        this.columnMenuButtonClass = this._defaultOptions?.columnMenuButtonClass ?? '';
        /** The icon for the column menu button. */
        this.columnMenuButtonIcon = this._defaultOptions?.columnMenuButtonIcon ?? '';
        /** Whether to show the column-menu's header. */
        this.showColumnMenuHeader = this._defaultOptions?.showColumnMenuHeader ?? false;
        /** The text for the column-menu's header. */
        this.columnMenuHeaderText = this._defaultOptions?.columnMenuHeaderText ?? 'Columns Header';
        /** Whether to show the the column-menu's footer. */
        this.showColumnMenuFooter = this._defaultOptions?.showColumnMenuFooter ?? false;
        /** The text for the column-menu's footer. */
        this.columnMenuFooterText = this._defaultOptions?.columnMenuFooterText ?? 'Columns Footer';
        // ===== No Result =====
        /** The displayed text for the empty data. */
        this.noResultText = this._defaultOptions?.noResultText ?? 'No records found';
        // ===== Row Templates =====
        /** Whether to use custom row template. If true, you should define a matRowDef. */
        this.useContentRowTemplate = false;
        // TODO: It can't use together with `useContentRowTemplate`
        this.useContentHeaderRowTemplate = false;
        // TODO: It's not working
        this.useContentFooterRowTemplate = false;
        // ===== Summary =====
        /** Whether to show the summary. */
        this.showSummary = false;
        // ===== Side Bar =====
        /** Whether to show the sidebar. */
        this.showSidebar = false;
        // ===== Status Bar =====
        /** Whether to show the status bar. */
        this.showStatusbar = false;
    }
    detectChanges() {
        this._changeDetectorRef.detectChanges();
    }
    _getColData(data, colDef) {
        return this._utils.getColData(data, colDef);
    }
    _isColumnHide(item) {
        return item.hide !== undefined ? item.hide : item.show !== undefined ? !item.show : false;
    }
    // Waiting for async data
    ngOnChanges(changes) {
        this._countPinnedPosition();
        this.displayedColumns = this.columns
            .filter(item => !this._isColumnHide(item))
            .map(item => item.field);
        if (this.showColumnMenuButton) {
            this.columns.forEach(item => {
                item.hide = this._isColumnHide(item);
                item.show = !item.hide;
            });
        }
        if (this.rowSelectable && !this.hideRowSelectionCheckbox) {
            this.displayedColumns.unshift('MtxGridCheckboxColumnDef');
        }
        // We should copy each item of data for expansion data
        if (this.expandable) {
            this.expansionRowStates = []; // reset
            this.data?.forEach(_ => {
                this.expansionRowStates.push({ expanded: false });
            });
        }
        if (this.rowSelectable) {
            this.rowSelection = new SelectionModel(this.multiSelectable, this.rowSelected);
        }
        this.dataSource = new MatTableDataSource(this.data);
        this.dataSource.paginator = this.pageOnFront ? this.paginator : null;
        this.dataSource.sort = this.sortOnFront ? this.sort : null;
        // Only scroll top with data change
        if (changes.data) {
            this.scrollTop(0);
        }
    }
    ngAfterViewInit() {
        if (this.pageOnFront) {
            this.dataSource.paginator = this.paginator;
        }
        if (this.sortOnFront) {
            this.dataSource.sort = this.sort;
        }
        if (this.rowDefs?.length > 0 && this.useContentRowTemplate) {
            this.rowDefs.forEach(rowDef => this.table.addRowDef(rowDef));
        }
        if (this.headerRowDefs?.length > 0 && this.useContentHeaderRowTemplate) {
            this.headerRowDefs.forEach(headerRowDef => this.table.addHeaderRowDef(headerRowDef));
        }
        if (this.footerRowDefs?.length > 0 && this.useContentFooterRowTemplate) {
            this.footerRowDefs.forEach(footerRowDef => this.table.addFooterRowDef(footerRowDef));
        }
    }
    ngOnDestroy() { }
    _countPinnedPosition() {
        const count = (acc, cur) => acc + parseFloat(cur.width || '80px');
        const pinnedLeftCols = this.columns.filter(col => col.pinned && col.pinned === 'left');
        pinnedLeftCols.forEach((item, idx) => {
            item.left = pinnedLeftCols.slice(0, idx).reduce(count, 0) + 'px';
        });
        const pinnedRightCols = this.columns
            .filter(col => col.pinned && col.pinned === 'right')
            .reverse();
        pinnedRightCols.forEach((item, idx) => {
            item.right = pinnedRightCols.slice(0, idx).reduce(count, 0) + 'px';
        });
    }
    _getIndex(index, dataIndex) {
        return index === undefined ? dataIndex : index;
    }
    _onSortChange(sort) {
        this.sortChange.emit(sort);
    }
    _onRowDataChange(record) {
        this.rowChangeRecord = record;
        this._changeDetectorRef.markForCheck();
    }
    /** Expansion change event */
    _onExpansionChange(expansionRef, rowData, column, index) {
        this.expansionChange.emit({ expanded: expansionRef.expanded, data: rowData, index, column });
    }
    /** Cell select event */
    _selectCell(cellRef, rowData, colDef) {
        // If not the same cell
        if (this._selectedCell !== cellRef) {
            const colValue = this._utils.getCellValue(rowData, colDef);
            this.cellSelection = []; // reset
            this.cellSelection.push({ cellData: colValue, rowData, colDef });
            this.cellSelectedChange.emit(this.cellSelection);
            if (this._selectedCell) {
                this._selectedCell.deselect(); // the selectedCell will be undefined
            }
        }
        this._selectedCell = cellRef.selected ? cellRef : undefined;
    }
    /** Row select event */
    _selectRow(event, rowData, index) {
        if (this.rowSelectable &&
            !this.rowSelectionFormatter.disabled?.(rowData, index) &&
            !this.rowSelectionFormatter.hideCheckbox?.(rowData, index) &&
            !this.disableRowClickSelection) {
            // metaKey -> command key
            if (!this.multiSelectionWithClick && !event.ctrlKey && !event.metaKey) {
                this.rowSelection.clear();
            }
            this._toggleNormalCheckbox(rowData);
        }
        this.rowClick.emit({ event, rowData, index });
    }
    /** Whether the number of selected elements matches the total number of rows. */
    _isAllSelected() {
        const numSelected = this.rowSelection.selected.length;
        const numRows = this.dataSource.data.filter((row, index) => !this.rowSelectionFormatter.disabled?.(row, index)).length;
        return numSelected === numRows;
    }
    /** Select all rows if they are not all selected; otherwise clear selection. */
    _toggleMasterCheckbox() {
        this._isAllSelected()
            ? this.rowSelection.clear()
            : this.dataSource.data.forEach((row, index) => {
                if (!this.rowSelectionFormatter.disabled?.(row, index)) {
                    this.rowSelection.select(row);
                }
            });
        this.rowSelectedChange.emit(this.rowSelection.selected);
    }
    /** Select normal row */
    _toggleNormalCheckbox(row) {
        this.rowSelection.toggle(row);
        this.rowSelectedChange.emit(this.rowSelection.selected);
    }
    /** Column change event */
    _onColumnChange(columns) {
        this.columnChange.emit(columns);
        this.displayedColumns = Object.assign([], this.getDisplayedColumnFields(columns));
        if (this.rowSelectable && !this.hideRowSelectionCheckbox) {
            this.displayedColumns.unshift('MtxGridCheckboxColumnDef');
        }
    }
    getDisplayedColumnFields(columns) {
        const fields = columns
            .filter(item => (this.columnHideableChecked === 'show' ? item.show : !item.hide))
            .map(item => item.field);
        return fields;
    }
    /** Customize expansion event */
    toggleExpansion(index) {
        if (!this.expandable) {
            throw new Error('The `expandable` should be set true.');
        }
        this.expansionRowStates[index].expanded = !this.expansionRowStates[index].expanded;
        return this.expansionRowStates[index].expanded;
    }
    /** Scroll to top when turn to the next page. */
    _onPage(e) {
        if (this.pageOnFront) {
            this.scrollTop(0);
        }
        this.page.emit(e);
    }
    scrollTop(value) {
        if (value == null) {
            return this.tableContainer?.nativeElement.scrollTop;
        }
        if (this.tableContainer && !this.loading) {
            this.tableContainer.nativeElement.scrollTop = value;
        }
    }
    scrollLeft(value) {
        if (value == null) {
            return this.tableContainer?.nativeElement.scrollLeft;
        }
        if (this.tableContainer && !this.loading) {
            this.tableContainer.nativeElement.scrollLeft = value;
        }
    }
    _contextmenu(event, rowData, index) {
        this.rowContextMenu.emit({ event, rowData, index });
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxGrid, deps: [{ token: MtxGridUtils }, { token: i0.ChangeDetectorRef }, { token: MTX_GRID_DEFAULT_OPTIONS, optional: true }], target: i0.ɵɵFactoryTarget.Component }); }
    /** @nocollapse */ static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.0.1", type: MtxGrid, isStandalone: true, selector: "mtx-grid", inputs: { displayedColumns: "displayedColumns", columns: "columns", data: "data", length: "length", loading: ["loading", "loading", booleanAttribute], trackBy: "trackBy", columnResizable: ["columnResizable", "columnResizable", booleanAttribute], emptyValuePlaceholder: "emptyValuePlaceholder", pageOnFront: ["pageOnFront", "pageOnFront", booleanAttribute], showPaginator: ["showPaginator", "showPaginator", booleanAttribute], pageDisabled: ["pageDisabled", "pageDisabled", booleanAttribute], showFirstLastButtons: ["showFirstLastButtons", "showFirstLastButtons", booleanAttribute], pageIndex: "pageIndex", pageSize: "pageSize", pageSizeOptions: "pageSizeOptions", hidePageSize: ["hidePageSize", "hidePageSize", booleanAttribute], paginationTemplate: "paginationTemplate", sortOnFront: ["sortOnFront", "sortOnFront", booleanAttribute], sortActive: "sortActive", sortDirection: "sortDirection", sortDisableClear: ["sortDisableClear", "sortDisableClear", booleanAttribute], sortDisabled: ["sortDisabled", "sortDisabled", booleanAttribute], sortStart: "sortStart", rowHover: ["rowHover", "rowHover", booleanAttribute], rowStriped: ["rowStriped", "rowStriped", booleanAttribute], expandable: ["expandable", "expandable", booleanAttribute], expansionTemplate: "expansionTemplate", multiSelectable: ["multiSelectable", "multiSelectable", booleanAttribute], multiSelectionWithClick: ["multiSelectionWithClick", "multiSelectionWithClick", booleanAttribute], rowSelectable: ["rowSelectable", "rowSelectable", booleanAttribute], hideRowSelectionCheckbox: ["hideRowSelectionCheckbox", "hideRowSelectionCheckbox", booleanAttribute], disableRowClickSelection: ["disableRowClickSelection", "disableRowClickSelection", booleanAttribute], rowSelectionFormatter: "rowSelectionFormatter", rowClassFormatter: "rowClassFormatter", rowSelected: "rowSelected", cellSelectable: ["cellSelectable", "cellSelectable", booleanAttribute], showToolbar: ["showToolbar", "showToolbar", booleanAttribute], toolbarTitle: "toolbarTitle", toolbarTemplate: "toolbarTemplate", columnHideable: ["columnHideable", "columnHideable", booleanAttribute], columnHideableChecked: "columnHideableChecked", columnSortable: ["columnSortable", "columnSortable", booleanAttribute], columnPinnable: ["columnPinnable", "columnPinnable", booleanAttribute], columnPinOptions: "columnPinOptions", showColumnMenuButton: ["showColumnMenuButton", "showColumnMenuButton", booleanAttribute], columnMenuButtonText: "columnMenuButtonText", columnMenuButtonType: "columnMenuButtonType", columnMenuButtonColor: "columnMenuButtonColor", columnMenuButtonClass: "columnMenuButtonClass", columnMenuButtonIcon: "columnMenuButtonIcon", showColumnMenuHeader: ["showColumnMenuHeader", "showColumnMenuHeader", booleanAttribute], columnMenuHeaderText: "columnMenuHeaderText", columnMenuHeaderTemplate: "columnMenuHeaderTemplate", showColumnMenuFooter: ["showColumnMenuFooter", "showColumnMenuFooter", booleanAttribute], columnMenuFooterText: "columnMenuFooterText", columnMenuFooterTemplate: "columnMenuFooterTemplate", noResultText: "noResultText", noResultTemplate: "noResultTemplate", headerTemplate: "headerTemplate", headerExtraTemplate: "headerExtraTemplate", cellTemplate: "cellTemplate", useContentRowTemplate: ["useContentRowTemplate", "useContentRowTemplate", booleanAttribute], useContentHeaderRowTemplate: ["useContentHeaderRowTemplate", "useContentHeaderRowTemplate", booleanAttribute], useContentFooterRowTemplate: ["useContentFooterRowTemplate", "useContentFooterRowTemplate", booleanAttribute], showSummary: ["showSummary", "showSummary", booleanAttribute], summaryTemplate: "summaryTemplate", showSidebar: ["showSidebar", "showSidebar", booleanAttribute], sidebarTemplate: "sidebarTemplate", showStatusbar: ["showStatusbar", "showStatusbar", booleanAttribute], statusbarTemplate: "statusbarTemplate" }, outputs: { page: "page", sortChange: "sortChange", rowClick: "rowClick", rowContextMenu: "rowContextMenu", expansionChange: "expansionChange", rowSelectedChange: "rowSelectedChange", cellSelectedChange: "cellSelectedChange", columnChange: "columnChange" }, host: { classAttribute: "mtx-grid" }, queries: [{ propertyName: "rowDefs", predicate: MatRowDef }, { propertyName: "headerRowDefs", predicate: MatHeaderRowDef }, { propertyName: "footerRowDefs", predicate: MatFooterRow }], viewQueries: [{ propertyName: "table", first: true, predicate: MatTable, descendants: true }, { propertyName: "paginator", first: true, predicate: MatPaginator, descendants: true }, { propertyName: "sort", first: true, predicate: MatSort, descendants: true }, { propertyName: "columnMenu", first: true, predicate: ["columnMenu"], descendants: true }, { propertyName: "tableContainer", first: true, predicate: ["tableContainer"], descendants: true }], exportAs: ["mtxGrid"], usesOnChanges: true, ngImport: i0, template: "<!-- Progress bar-->\n@if (loading) {\n  <div class=\"mtx-grid-progress\">\n    <mat-progress-bar mode=\"indeterminate\"></mat-progress-bar>\n  </div>\n}\n\n<!-- Toolbar -->\n@if (showToolbar) {\n  <div class=\"mtx-grid-toolbar\">\n    <div class=\"mtx-grid-toolbar-content\">\n      @if (toolbarTemplate) {\n        <ng-template [ngTemplateOutlet]=\"toolbarTemplate\"></ng-template>\n      } @else {\n        @if (toolbarTitle) {\n          <div class=\"mtx-grid-toolbar-title\">{{toolbarTitle}}</div>\n        }\n      }\n    </div>\n    <div class=\"mtx-grid-toolbar-actions\">\n      @if (showColumnMenuButton) {\n        <mtx-grid-column-menu #columnMenu\n          [columns]=\"columns\"\n          [buttonText]=\"columnMenuButtonText\"\n          [buttonType]=\"columnMenuButtonType\"\n          [buttonColor]=\"columnMenuButtonColor\"\n          [buttonClass]=\"columnMenuButtonClass\"\n          [buttonIcon]=\"columnMenuButtonIcon\"\n          [selectable]=\"columnHideable\"\n          [selectableChecked]=\"columnHideableChecked\"\n          [sortable]=\"columnSortable\"\n          [pinnable]=\"columnPinnable\"\n          [showHeader]=\"showColumnMenuHeader\"\n          [headerText]=\"columnMenuHeaderText\"\n          [headerTemplate]=\"columnMenuHeaderTemplate\"\n          [showFooter]=\"showColumnMenuFooter\"\n          [footerText]=\"columnMenuFooterText\"\n          [footerTemplate]=\"columnMenuFooterTemplate\"\n          [pinOptions]=\"columnPinOptions\"\n          (columnChange)=\"_onColumnChange($event)\">\n        </mtx-grid-column-menu>\n      }\n    </div>\n  </div>\n}\n\n<div class=\"mtx-grid-main mtx-grid-layout\">\n  <!-- Table content -->\n  <div class=\"mtx-grid-content mtx-grid-layout\">\n    <div #tableContainer class=\"mat-table-container\" [class.mat-table-with-data]=\"!_hasNoResult\">\n      @if (!columnResizable) {\n        <table mat-table\n          [class]=\"{'mat-table-hover': rowHover, 'mat-table-striped': rowStriped, 'mat-table-expandable': expandable}\"\n          [dataSource]=\"dataSource\" [multiTemplateDataRows]=\"expandable\"\n          matSort\n          [matSortActive]=\"sortActive\"\n          [matSortDirection]=\"sortDirection\"\n          [matSortDisableClear]=\"sortDisableClear\"\n          [matSortDisabled]=\"sortDisabled\"\n          [matSortStart]=\"sortStart\"\n          (matSortChange)=\"_onSortChange($event)\"\n          [trackBy]=\"trackBy\">\n          @if (rowSelectable && !hideRowSelectionCheckbox) {\n            <ng-container matColumnDef=\"MtxGridCheckboxColumnDef\">\n              <th mat-header-cell *matHeaderCellDef class=\"mtx-grid-checkbox-cell\">\n                @if (multiSelectable) {\n                  <mat-checkbox\n                    [checked]=\"rowSelection.hasValue() && _isAllSelected()\"\n                    [indeterminate]=\"rowSelection.hasValue() && !_isAllSelected()\"\n                    (change)=\"$event ? _toggleMasterCheckbox() : null\">\n                  </mat-checkbox>\n                }\n              </th>\n              <td mat-cell *matCellDef=\"let row; let index = index; let dataIndex = dataIndex;\"\n                class=\"mtx-grid-checkbox-cell\">\n                @if (!(rowSelectionFormatter.hideCheckbox && rowSelectionFormatter.hideCheckbox(row, _getIndex(index, dataIndex)))) {\n                  <mat-checkbox\n                    [disabled]=\"rowSelectionFormatter.disabled && rowSelectionFormatter.disabled(row, _getIndex(index, dataIndex))\"\n                    [checked]=\"rowSelection.isSelected(row)\"\n                    (click)=\"$event.stopPropagation()\"\n                    (change)=\"$event ? _toggleNormalCheckbox(row) : null\">\n                  </mat-checkbox>\n                }\n              </td>\n              <td mat-footer-cell *matFooterCellDef class=\"mtx-grid-checkbox-cell\"></td>\n            </ng-container>\n          }\n          @for (col of columns; track col) {\n            <ng-container [matColumnDef]=\"col.field\"\n              [sticky]=\"col.pinned==='left'\" [stickyEnd]=\"col.pinned==='right'\">\n              <th mat-header-cell *matHeaderCellDef\n                [class]=\"col | colClass\"\n                [class.mat-table-sticky-left]=\"col.pinned === 'left'\"\n                [class.mat-table-sticky-right]=\"col.pinned === 'right'\"\n                [style]=\"{'width': col.width, 'min-width': col.width, 'left': col.left, 'right': col.right}\">\n                <div class=\"mat-header-cell-inner\">\n                  @if (headerTemplate | isTemplateRef) {\n                    <ng-template [ngTemplateOutlet]=\"$any(headerTemplate)\"\n                      [ngTemplateOutletContext]=\"{ $implicit: col, colDef: col }\">\n                    </ng-template>\n                  } @else {\n                    @if ($any(headerTemplate)?.[col.field] | isTemplateRef) {\n                      <ng-template [ngTemplateOutlet]=\"$any(headerTemplate)[col.field]\"\n                        [ngTemplateOutletContext]=\"{ $implicit: col, colDef: col }\">\n                      </ng-template>\n                    } @else {\n                      <div [mat-sort-header]=\"col.sortProp?.id || col.field\"\n                        [disabled]=\"!col.sortable\"\n                        [disableClear]=\"col.sortProp?.disableClear ?? sortDisableClear\"\n                        [arrowPosition]=\"col.sortProp?.arrowPosition!\"\n                        [start]=\"col.sortProp?.start!\">\n                        @if (col.showExpand) {\n                          <span class=\"mtx-grid-expansion-placeholder\"></span>\n                        }\n                        <span>{{col.header | toObservable | async}}</span>\n                        @if (col.sortable) {\n                          <svg class=\"mtx-grid-icon mat-sort-header-icon\" viewBox=\"0 0 24 24\"\n                            width=\"24px\" height=\"24px\" fill=\"currentColor\" focusable=\"false\">\n                            <path d=\"M3,13H15V11H3M3,6V8H21V6M3,18H9V16H3V18Z\" />\n                          </svg>\n                        }\n                      </div>\n                      <ng-template [ngTemplateOutlet]=\"headerExtraTplBase\"\n                        [ngTemplateOutletContext]=\"{ $implicit: headerExtraTemplate, colDef: col }\">\n                      </ng-template>\n                    }\n                  }\n                </div>\n              </th>\n              <td mat-cell *matCellDef=\"let row; let index = index; let dataIndex = dataIndex;\"\n                [class]=\"col | colClass: row: rowChangeRecord: rowChangeRecord?.currentValue\"\n                [class.mat-table-sticky-left]=\"col.pinned === 'left'\"\n                [class.mat-table-sticky-right]=\"col.pinned === 'right'\"\n                [style]=\"{'width': col.width, 'min-width': col.width, 'left': col.left, 'right': col.right}\"\n                mtx-grid-selectable-cell [cellSelectable]=\"cellSelectable\"\n                (cellSelectedChange)=\"_selectCell($event, row, col)\">\n                @if (cellTemplate | isTemplateRef) {\n                  <ng-template [ngTemplateOutlet]=\"$any(cellTemplate)\"\n                    [ngTemplateOutletContext]=\"{ $implicit: row, rowData: row, index: _getIndex(index, dataIndex), colDef: col }\">\n                  </ng-template>\n                } @else {\n                  @if ($any(cellTemplate)?.[col.field] | isTemplateRef) {\n                    <ng-template [ngTemplateOutlet]=\"$any(cellTemplate)[col.field]\"\n                      [ngTemplateOutletContext]=\"{ $implicit: row, rowData: row, index: _getIndex(index, dataIndex), colDef: col }\">\n                    </ng-template>\n                  } @else {\n                    @if (col.cellTemplate) {\n                      <ng-template\n                        [ngTemplateOutlet]=\"col.cellTemplate!\"\n                        [ngTemplateOutletContext]=\"{ $implicit: row, rowData: row, index: _getIndex(index, dataIndex), colDef: col }\">\n                      </ng-template>\n                    } @else {\n                      @if (col.showExpand) {\n                        <button class=\"mtx-grid-row-expand-button\"\n                          mat-icon-button mtx-grid-expansion-toggle type=\"button\"\n                          [(opened)]=\"expansionRowStates[dataIndex].expanded\"\n                          (toggleChange)=\"_onExpansionChange($event, row, col, dataIndex);\">\n                          <svg class=\"mtx-grid-icon mtx-grid-row-expand-icon\" viewBox=\"0 0 24 24\"\n                            width=\"24px\" height=\"24px\" fill=\"currentColor\" focusable=\"false\">\n                            <path d=\"M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z\" />\n                          </svg>\n                        </button>\n                      }\n                      <mtx-grid-cell [rowData]=\"row\" [colDef]=\"col\" [placeholder]=\"emptyValuePlaceholder\"\n                        (rowDataChange)=\"_onRowDataChange($event)\"></mtx-grid-cell>\n                    }\n                  }\n                }\n              </td>\n              <td mat-footer-cell *matFooterCellDef\n                [class.mat-table-sticky-left]=\"col.pinned === 'left'\"\n                [class.mat-table-sticky-right]=\"col.pinned === 'right'\"\n                [style]=\"{'width': col.width, 'min-width': col.width, 'left': col.left, 'right': col.right}\">\n                @if (col.showExpand) {\n                  <span class=\"mtx-grid-expansion-placeholder\"></span>\n                }\n                @if (summaryTemplate | isTemplateRef) {\n                  <ng-template [ngTemplateOutlet]=\"$any(summaryTemplate)\"\n                    [ngTemplateOutletContext]=\"{ $implicit: col, colDef: col, data: data }\">\n                  </ng-template>\n                } @else {\n                  @if ($any(summaryTemplate)?.[col.field] | isTemplateRef) {\n                    <ng-template [ngTemplateOutlet]=\"$any(summaryTemplate)[col.field]\"\n                      [ngTemplateOutletContext]=\"{ $implicit: _getColData(data, col), colData: _getColData(data, col), colDef: col }\">\n                    </ng-template>\n                  } @else {\n                    <mtx-grid-cell [summary]=\"true\" [data]=\"data\" [colDef]=\"col\"\n                      [placeholder]=\"emptyValuePlaceholder\"></mtx-grid-cell>\n                  }\n                }\n              </td>\n            </ng-container>\n          }\n          @if (!useContentHeaderRowTemplate) {\n            <tr mat-header-row *matHeaderRowDef=\"displayedColumns; sticky: true\"></tr>\n          }\n          @if (!useContentRowTemplate) {\n            <tr mat-row\n              *matRowDef=\"let row; let index = index; let dataIndex = dataIndex; columns: displayedColumns;\"\n              [class]=\"row | rowClass: index: dataIndex: rowClassFormatter\"\n              [class.selected]=\"rowSelection.isSelected(row)\"\n              (click)=\"_selectRow($event, row, _getIndex(index, dataIndex))\"\n              (contextmenu)=\"_contextmenu($event, row, _getIndex(index, dataIndex))\">\n            </tr>\n          }\n          @if (_whetherShowSummary) {\n            <tr mat-footer-row *matFooterRowDef=\"displayedColumns; sticky: true\"></tr>\n          }\n          @if (expandable) {\n            <!-- Expanded Content Column - The expandable row is made up of this one column that spans across all columns -->\n            <ng-container matColumnDef=\"MtxGridExpansionColumnDef\">\n              <td mat-cell *matCellDef=\"let row; let dataIndex = dataIndex\"\n                [attr.colspan]=\"displayedColumns.length\">\n                <div class=\"mtx-grid-expansion-detail\"\n                  [@expansion]=\"expansionRowStates[dataIndex].expanded ? 'expanded' : 'collapsed'\">\n                  <ng-template [ngTemplateOutlet]=\"expansionTemplate\"\n                    [ngTemplateOutletContext]=\"{ $implicit: row, rowData: row, index: dataIndex, expanded: expansionRowStates[dataIndex].expanded }\">\n                  </ng-template>\n                </div>\n              </td>\n            </ng-container>\n            <tr mat-row\n              *matRowDef=\"let row; columns: ['MtxGridExpansionColumnDef']; let dataIndex = dataIndex\"\n              class=\"mtx-grid-expansion\"\n              [class]=\"expansionRowStates[dataIndex].expanded ? 'expanded' : 'collapsed'\">\n            </tr>\n          }\n        </table>\n      } @else {\n        <!-- TODO: Use flexbox-based mat-table -->\n        <table mat-table\n          columnResize\n          [class]=\"{'mat-table-hover': rowHover, 'mat-table-striped': rowStriped, 'mat-table-expandable': expandable}\"\n          [dataSource]=\"dataSource\" [multiTemplateDataRows]=\"expandable\"\n          matSort\n          [matSortActive]=\"sortActive\"\n          [matSortDirection]=\"sortDirection\"\n          [matSortDisableClear]=\"sortDisableClear\"\n          [matSortDisabled]=\"sortDisabled\"\n          [matSortStart]=\"sortStart\"\n          (matSortChange)=\"_onSortChange($event)\"\n          [trackBy]=\"trackBy\">\n          @if (rowSelectable && !hideRowSelectionCheckbox) {\n            <ng-container matColumnDef=\"MtxGridCheckboxColumnDef\">\n              <th mat-header-cell *matHeaderCellDef class=\"mtx-grid-checkbox-cell\">\n                @if (multiSelectable) {\n                  <mat-checkbox\n                    [checked]=\"rowSelection.hasValue() && _isAllSelected()\"\n                    [indeterminate]=\"rowSelection.hasValue() && !_isAllSelected()\"\n                    (change)=\"$event ? _toggleMasterCheckbox() : null\">\n                  </mat-checkbox>\n                }\n              </th>\n              <td mat-cell *matCellDef=\"let row; let index = index; let dataIndex = dataIndex;\"\n                class=\"mtx-grid-checkbox-cell\">\n                @if (!(rowSelectionFormatter.hideCheckbox && rowSelectionFormatter.hideCheckbox(row, _getIndex(index, dataIndex)))) {\n                  <mat-checkbox\n                    [disabled]=\"rowSelectionFormatter.disabled && rowSelectionFormatter.disabled(row, _getIndex(index, dataIndex))\"\n                    [checked]=\"rowSelection.isSelected(row)\"\n                    (click)=\"$event.stopPropagation()\"\n                    (change)=\"$event ? _toggleNormalCheckbox(row) : null\">\n                  </mat-checkbox>\n                }\n              </td>\n              <td mat-footer-cell *matFooterCellDef class=\"mtx-grid-checkbox-cell\"></td>\n            </ng-container>\n          }\n          @for (col of columns; track col) {\n            <ng-container [matColumnDef]=\"col.field\"\n              [sticky]=\"col.pinned==='left'\" [stickyEnd]=\"col.pinned==='right'\">\n              <th mat-header-cell *matHeaderCellDef\n                [class]=\"col | colClass\"\n                [class.mat-table-sticky-left]=\"col.pinned === 'left'\"\n                [class.mat-table-sticky-right]=\"col.pinned === 'right'\"\n                [style]=\"{'width': col.width, 'left': col.left, 'right': col.right}\"\n                [resizable]=\"col.resizable\"\n                [matResizableMinWidthPx]=\"col.minWidth\" [matResizableMaxWidthPx]=\"col.maxWidth\">\n                <div class=\"mat-header-cell-inner\">\n                  @if (headerTemplate | isTemplateRef) {\n                    <ng-template [ngTemplateOutlet]=\"$any(headerTemplate)\"\n                      [ngTemplateOutletContext]=\"{ $implicit: col, colDef: col }\">\n                    </ng-template>\n                  } @else {\n                    @if ($any(headerTemplate)?.[col.field] | isTemplateRef) {\n                      <ng-template [ngTemplateOutlet]=\"$any(headerTemplate)[col.field]\"\n                        [ngTemplateOutletContext]=\"{ $implicit: col, colDef: col }\">\n                      </ng-template>\n                    } @else {\n                      <div [mat-sort-header]=\"col.sortProp?.id || col.field\"\n                        [disabled]=\"!col.sortable\"\n                        [disableClear]=\"col.sortProp?.disableClear ?? sortDisableClear\"\n                        [arrowPosition]=\"col.sortProp?.arrowPosition!\"\n                        [start]=\"col.sortProp?.start!\">\n                        @if (col.showExpand) {\n                          <span class=\"mtx-grid-expansion-placeholder\"></span>\n                        }\n                        <span>{{col.header | toObservable | async}}</span>\n                        @if (col.sortable) {\n                          <svg class=\"mtx-grid-icon mat-sort-header-icon\" viewBox=\"0 0 24 24\"\n                            width=\"24px\" height=\"24px\" fill=\"currentColor\" focusable=\"false\">\n                            <path d=\"M3,13H15V11H3M3,6V8H21V6M3,18H9V16H3V18Z\" />\n                          </svg>\n                        }\n                      </div>\n                      <ng-template [ngTemplateOutlet]=\"headerExtraTplBase\"\n                        [ngTemplateOutletContext]=\"{ $implicit: headerExtraTemplate, colDef: col }\">\n                      </ng-template>\n                    }\n                  }\n                </div>\n              </th>\n              <td mat-cell *matCellDef=\"let row; let index = index; let dataIndex = dataIndex;\"\n                [class]=\"col | colClass: row: rowChangeRecord :rowChangeRecord?.currentValue\"\n                [class.mat-table-sticky-left]=\"col.pinned === 'left'\"\n                [class.mat-table-sticky-right]=\"col.pinned === 'right'\"\n                [style]=\"{'width': col.width, 'left': col.left, 'right': col.right}\"\n                mtx-grid-selectable-cell [cellSelectable]=\"cellSelectable\"\n                (cellSelectedChange)=\"_selectCell($event, row, col)\">\n                @if (cellTemplate | isTemplateRef) {\n                  <ng-template [ngTemplateOutlet]=\"$any(cellTemplate)\"\n                    [ngTemplateOutletContext]=\"{ $implicit: row, rowData: row, index: _getIndex(index, dataIndex), colDef: col }\">\n                  </ng-template>\n                } @else {\n                  @if ($any(cellTemplate)?.[col.field] | isTemplateRef) {\n                    <ng-template [ngTemplateOutlet]=\"$any(cellTemplate)[col.field]\"\n                      [ngTemplateOutletContext]=\"{ $implicit: row, rowData: row, index: _getIndex(index, dataIndex), colDef: col }\">\n                    </ng-template>\n                  } @else {\n                    @if (col.cellTemplate) {\n                      <ng-template\n                        [ngTemplateOutlet]=\"col.cellTemplate!\"\n                        [ngTemplateOutletContext]=\"{ $implicit: row, rowData: row, index: _getIndex(index, dataIndex), colDef: col }\">\n                      </ng-template>\n                    } @else {\n                      @if (col.showExpand) {\n                        <button class=\"mtx-grid-row-expand-button\"\n                          mat-icon-button mtx-grid-expansion-toggle type=\"button\"\n                          [(opened)]=\"expansionRowStates[dataIndex].expanded\"\n                          (toggleChange)=\"_onExpansionChange($event, row, col, dataIndex);\">\n                          <svg class=\"mtx-grid-icon mtx-grid-row-expand-icon\" viewBox=\"0 0 24 24\"\n                            width=\"24px\" height=\"24px\" fill=\"currentColor\" focusable=\"false\">\n                            <path d=\"M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z\" />\n                          </svg>\n                        </button>\n                      }\n                      <mtx-grid-cell [rowData]=\"row\" [colDef]=\"col\" [placeholder]=\"emptyValuePlaceholder\"\n                        (rowDataChange)=\"_onRowDataChange($event)\"></mtx-grid-cell>\n                    }\n                  }\n                }\n              </td>\n              <td mat-footer-cell *matFooterCellDef\n                [class.mat-table-sticky-left]=\"col.pinned === 'left'\"\n                [class.mat-table-sticky-right]=\"col.pinned === 'right'\"\n                [style]=\"{'width': col.width, 'left': col.left, 'right': col.right}\">\n                @if (col.showExpand) {\n                  <span class=\"mtx-grid-expansion-placeholder\"></span>\n                }\n                @if (summaryTemplate | isTemplateRef) {\n                  <ng-template [ngTemplateOutlet]=\"$any(summaryTemplate)\"\n                    [ngTemplateOutletContext]=\"{ $implicit: col, colDef: col, data: data }\">\n                  </ng-template>\n                } @else {\n                  @if ($any(summaryTemplate)?.[col.field] | isTemplateRef) {\n                    <ng-template [ngTemplateOutlet]=\"$any(summaryTemplate)[col.field]\"\n                      [ngTemplateOutletContext]=\"{ $implicit: _getColData(data, col), colData: _getColData(data, col), colDef: col }\">\n                    </ng-template>\n                  } @else {\n                    <mtx-grid-cell [summary]=\"true\" [data]=\"data\" [colDef]=\"col\"\n                      [placeholder]=\"emptyValuePlaceholder\"></mtx-grid-cell>\n                  }\n                }\n              </td>\n            </ng-container>\n          }\n          @if (!useContentHeaderRowTemplate) {\n            <tr mat-header-row *matHeaderRowDef=\"displayedColumns; sticky: true\"></tr>\n          }\n          @if (!useContentRowTemplate) {\n            <tr mat-row\n              *matRowDef=\"let row; let index = index; let dataIndex = dataIndex; columns: displayedColumns;\"\n              [class]=\"row | rowClass: index: dataIndex: rowClassFormatter\"\n              [class.selected]=\"rowSelection.isSelected(row)\"\n              (click)=\"_selectRow($event, row, _getIndex(index, dataIndex))\"\n              (contextmenu)=\"_contextmenu($event, row, _getIndex(index, dataIndex))\">\n            </tr>\n          }\n          @if (_whetherShowSummary) {\n            <tr mat-footer-row *matFooterRowDef=\"displayedColumns; sticky: true\"></tr>\n          }\n          @if (expandable) {\n            <!-- Expanded Content Column - The expandable row is made up of this one column that spans across all columns -->\n            <ng-container matColumnDef=\"MtxGridExpansionColumnDef\">\n              <td mat-cell *matCellDef=\"let row; let dataIndex = dataIndex\"\n                [attr.colspan]=\"displayedColumns.length\">\n                <div class=\"mtx-grid-expansion-detail\"\n                  [@expansion]=\"expansionRowStates[dataIndex].expanded ? 'expanded' : 'collapsed'\">\n                  <ng-template [ngTemplateOutlet]=\"expansionTemplate\"\n                    [ngTemplateOutletContext]=\"{ $implicit: row, rowData: row, index: dataIndex, expanded: expansionRowStates[dataIndex].expanded }\">\n                  </ng-template>\n                </div>\n              </td>\n            </ng-container>\n            <tr mat-row\n              *matRowDef=\"let row; columns: ['MtxGridExpansionColumnDef']; let dataIndex = dataIndex\"\n              class=\"mtx-grid-expansion\"\n              [class]=\"expansionRowStates[dataIndex].expanded ? 'expanded' : 'collapsed'\">\n            </tr>\n          }\n        </table>\n      }\n    </div>\n\n    <!-- No result -->\n    @if (_hasNoResult) {\n      <div class=\"mtx-grid-no-result\">\n        @if (noResultTemplate) {\n          <ng-template [ngTemplateOutlet]=\"noResultTemplate\"></ng-template>\n        } @else {\n          {{noResultText}}\n        }\n      </div>\n    }\n  </div>\n\n  <!-- Tool sidebar -->\n  @if (showSidebar) {\n    <div class=\"mtx-grid-sidebar\">\n      @if (sidebarTemplate) {\n        <ng-template [ngTemplateOutlet]=\"sidebarTemplate\"></ng-template>\n      }\n    </div>\n  }\n</div>\n\n<div class=\"mtx-grid-footer\">\n  <!-- Status Bar -->\n  @if (showStatusbar) {\n    <div class=\"mtx-grid-statusbar\">\n      @if (statusbarTemplate) {\n        <ng-template [ngTemplateOutlet]=\"statusbarTemplate\"></ng-template>\n      }\n    </div>\n  }\n\n  <!-- Pagination -->\n  <div class=\"mtx-grid-pagination\">\n    @if (paginationTemplate) {\n      <ng-template [ngTemplateOutlet]=\"paginationTemplate\"></ng-template>\n    } @else {\n      <mat-paginator [class.mat-paginator-hidden]=\"!showPaginator\"\n        [showFirstLastButtons]=\"showFirstLastButtons\"\n        [length]=\"length\"\n        [pageIndex]=\"pageIndex\"\n        [pageSize]=\"pageSize\"\n        [pageSizeOptions]=\"pageSizeOptions\"\n        [hidePageSize]=\"hidePageSize\"\n        (page)=\"_onPage($event)\"\n        [disabled]=\"pageDisabled\">\n      </mat-paginator>\n    }\n  </div>\n</div>\n\n<!-- Header template for extra content -->\n<ng-template #headerExtraTplBase let-headerExtraTemplate let-col=\"colDef\">\n  @if (headerExtraTemplate | isTemplateRef) {\n    <ng-template [ngTemplateOutlet]=\"headerExtraTemplate\"\n      [ngTemplateOutletContext]=\"{ $implicit: col, colDef: col }\">\n    </ng-template>\n  } @else {\n    @if ($any(headerExtraTemplate)?.[col.field] | isTemplateRef) {\n      <ng-template [ngTemplateOutlet]=\"headerExtraTemplate[col.field]\"\n        [ngTemplateOutletContext]=\"{ $implicit: col, colDef: col }\">\n      </ng-template>\n    }\n  }\n</ng-template>\n", styles: [".mtx-grid{position:relative;display:flex;flex-direction:column;width:100%;overflow:hidden;border:1px solid var(--mtx-grid-outline-color);border-radius:var(--mtx-grid-container-shape)}.mtx-grid .mat-mdc-table.mat-table-striped .mat-row-odd{background-color:var(--mtx-grid-table-row-striped-background-color)}.mtx-grid .mat-mdc-table.mat-table-hover .mat-mdc-row:hover{background-color:var(--mtx-grid-table-row-hover-background-color)}.mtx-grid .mat-mdc-table.mat-table-hover .mat-mdc-row.selected:hover{background-color:var(--mtx-grid-table-row-selected-hover-background-color)}.mtx-grid .mat-mdc-table .mat-mdc-row.selected{background-color:var(--mtx-grid-table-row-selected-background-color)}.mtx-grid .mat-mdc-table .mat-mdc-cell.selected{box-shadow:inset 0 0 0 1px var(--mtx-grid-table-cell-selected-outline-color)}.mtx-grid .mat-table-container{overflow:auto}.mtx-grid .mat-table-container.mat-table-with-data{flex:1}.mtx-grid .mat-mdc-table:not(.mat-column-resize-table){min-width:100%;border-collapse:separate}.mtx-grid .mat-mdc-table:not(.mat-column-resize-table) .mat-mdc-header-cell:not(.mtx-grid-checkbox-cell),.mtx-grid .mat-mdc-table:not(.mat-column-resize-table) .mat-mdc-footer-cell:not(.mtx-grid-checkbox-cell),.mtx-grid .mat-mdc-table:not(.mat-column-resize-table) .mat-mdc-cell:not(.mtx-grid-checkbox-cell){min-width:var(--mtx-grid-table-cell-min-width)}.mtx-grid .mat-table-sticky-left{border-right:1px solid var(--mat-table-row-item-outline-color)}[dir=rtl] .mtx-grid .mat-table-sticky-left{border-right-width:0;border-left:1px solid var(--mat-table-row-item-outline-color)}.mtx-grid .mat-table-sticky-right{border-left:1px solid var(--mat-table-row-item-outline-color)}[dir=rtl] .mtx-grid .mat-table-sticky-right{border-left-width:0;border-right:1px solid var(--mat-table-row-item-outline-color)}.mtx-grid .mat-mdc-footer-cell{border-top:1px solid var(--mat-table-row-item-outline-color);background-color:var(--mtx-grid-table-footer-background-color)}.mtx-grid .mat-mdc-row.mtx-grid-expansion{height:0;overflow:hidden}.mtx-grid .mat-mdc-row.mtx-grid-expansion .mat-mdc-cell{padding-top:0;padding-bottom:0}.mtx-grid .mat-mdc-row.mtx-grid-expansion.collapsed .mat-mdc-cell{border-bottom-width:0}.mtx-grid .mat-sort-header-icon{margin:0 4px}.mtx-grid .mat-header-cell-inner{display:inline-flex;align-items:center;vertical-align:middle}.mtx-grid .mat-mdc-paginator{border-top:1px solid var(--mtx-grid-outline-color);border-bottom-left-radius:var(--mtx-grid-container-shape);border-bottom-right-radius:var(--mtx-grid-container-shape)}.mtx-grid .mat-paginator-hidden{display:none}.mtx-grid .mtx-grid-checkbox-cell{width:60px;min-width:60px;padding:0 calc((60px - var(--mdc-checkbox-state-layer-size)) / 2)}.mtx-grid-progress{position:absolute;top:0;z-index:120;width:100%}.mtx-grid-toolbar{display:flex;justify-content:space-between;align-items:center;min-height:var(--mat-table-header-container-height);padding:8px;box-sizing:border-box;border-bottom:1px solid var(--mtx-grid-outline-color)}.mtx-grid-toolbar-content{flex:1;width:0;padding:0 8px}.mtx-grid-layout{display:flex;flex:1 1 auto;overflow:auto}.mtx-grid-content{flex-direction:column;width:0}.mtx-grid-sidebar{max-width:50%;border-left:1px solid var(--mtx-grid-outline-color)}[dir=rtl] .mtx-grid-sidebar{border-left-width:0;border-right:1px solid var(--mtx-grid-outline-color)}.mtx-grid-footer{position:relative;z-index:1}.mtx-grid-statusbar{display:flex;align-items:center;min-height:var(--mat-table-header-container-height);padding:8px;box-sizing:border-box;border-top:1px solid var(--mtx-grid-outline-color)}.mtx-grid-no-result{display:flex;justify-content:center;align-items:center;flex:1;min-height:150px}.mtx-grid-expansion-placeholder{display:inline-block;vertical-align:middle;width:var(--mdc-icon-button-state-layer-size, var(--mtx-grid-row-expand-button-size));height:var(--mdc-icon-button-state-layer-size, var(--mtx-grid-row-expand-button-size))}.mtx-grid-expansion-detail{display:flex;align-items:center;min-height:var(--mat-table-row-item-container-height);overflow:hidden}.mtx-grid-row-expand-button.expanded .mtx-grid-row-expand-icon{transform:rotate(90deg)}.mtx-grid-row-expand-button.mat-mdc-icon-button,.mtx-grid-row-expand-button+mtx-grid-cell{vertical-align:middle}.mtx-grid-icon{width:20px;height:20px;font-size:20px}\n"], dependencies: [{ kind: "pipe", type: AsyncPipe, name: "async" }, { kind: "directive", type: NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: MatProgressBar, selector: "mat-progress-bar", inputs: ["color", "value", "bufferValue", "mode"], outputs: ["animationEnd"], exportAs: ["matProgressBar"] }, { kind: "component", type: MatIconButton, selector: "button[mat-icon-button]", exportAs: ["matButton"] }, { kind: "component", type: MatCheckbox, selector: "mat-checkbox", inputs: ["aria-label", "aria-labelledby", "aria-describedby", "id", "required", "labelPosition", "name", "value", "disableRipple", "tabIndex", "color", "checked", "disabled", "indeterminate"], outputs: ["change", "indeterminateChange"], exportAs: ["matCheckbox"] }, { kind: "component", type: MatTable, selector: "mat-table, table[mat-table]", exportAs: ["matTable"] }, { kind: "directive", type: MatColumnDef, selector: "[matColumnDef]", inputs: ["matColumnDef"] }, { kind: "directive", type: MatHeaderRowDef, selector: "[matHeaderRowDef]", inputs: ["matHeaderRowDef", "matHeaderRowDefSticky"] }, { kind: "component", type: MatHeaderRow, selector: "mat-header-row, tr[mat-header-row]", exportAs: ["matHeaderRow"] }, { kind: "directive", type: MatRowDef, selector: "[matRowDef]", inputs: ["matRowDefColumns", "matRowDefWhen"] }, { kind: "component", type: MatRow, selector: "mat-row, tr[mat-row]", exportAs: ["matRow"] }, { kind: "directive", type: MatFooterRowDef, selector: "[matFooterRowDef]", inputs: ["matFooterRowDef", "matFooterRowDefSticky"] }, { kind: "component", type: MatFooterRow, selector: "mat-footer-row, tr[mat-footer-row]", exportAs: ["matFooterRow"] }, { kind: "directive", type: MatHeaderCellDef, selector: "[matHeaderCellDef]" }, { kind: "directive", type: MatHeaderCell, selector: "mat-header-cell, th[mat-header-cell]" }, { kind: "directive", type: MatCellDef, selector: "[matCellDef]" }, { kind: "directive", type: MatCell, selector: "mat-cell, td[mat-cell]" }, { kind: "directive", type: MatFooterCellDef, selector: "[matFooterCellDef]" }, { kind: "directive", type: MatFooterCell, selector: "mat-footer-cell, td[mat-footer-cell]" }, { kind: "directive", type: MatSort, selector: "[matSort]", inputs: ["matSortActive", "matSortStart", "matSortDirection", "matSortDisableClear", "matSortDisabled"], outputs: ["matSortChange"], exportAs: ["matSort"] }, { kind: "component", type: MatSortHeader, selector: "[mat-sort-header]", inputs: ["mat-sort-header", "arrowPosition", "start", "disabled", "sortActionDescription", "disableClear"], exportAs: ["matSortHeader"] }, { kind: "component", type: MatPaginator, selector: "mat-paginator", inputs: ["color", "pageIndex", "length", "pageSize", "pageSizeOptions", "hidePageSize", "showFirstLastButtons", "selectConfig", "disabled"], outputs: ["page"], exportAs: ["matPaginator"] }, { kind: "directive", type: MatResizable, selector: "mat-header-cell[resizable], th[mat-header-cell][resizable]", inputs: ["matResizableMinWidthPx", "matResizableMaxWidthPx", "resizable"] }, { kind: "directive", type: MatColumnResize, selector: "table[mat-table][columnResize]" }, { kind: "component", type: MtxGridCell, selector: "mtx-grid-cell", inputs: ["rowData", "colDef", "data", "summary", "placeholder"], outputs: ["rowDataChange"], exportAs: ["mtxGridCell"] }, { kind: "component", type: MtxGridColumnMenu, selector: "mtx-grid-column-menu", inputs: ["columns", "selectable", "selectableChecked", "sortable", "pinnable", "buttonText", "buttonType", "buttonColor", "buttonClass", "buttonIcon", "showHeader", "headerText", "headerTemplate", "showFooter", "footerText", "footerTemplate", "pinOptions"], outputs: ["columnChange"], exportAs: ["mtxGridColumnMenu"] }, { kind: "directive", type: MtxGridSelectableCell, selector: "[mtx-grid-selectable-cell]", inputs: ["cellSelectable"], outputs: ["cellSelectedChange"] }, { kind: "directive", type: MtxGridExpansionToggle, selector: "[mtx-grid-expansion-toggle]", inputs: ["opened", "expandableRow", "expansionRowTpl"], outputs: ["openedChange", "toggleChange"] }, { kind: "pipe", type: MtxIsTemplateRefPipe, name: "isTemplateRef" }, { kind: "pipe", type: MtxGridColClassPipe, name: "colClass" }, { kind: "pipe", type: MtxGridRowClassPipe, name: "rowClass" }, { kind: "pipe", type: MtxToObservablePipe, name: "toObservable" }], animations: [
            trigger('expansion', [
                state('collapsed, void', style({ height: '0', minHeight: '0', visibility: 'hidden' })),
                state('expanded', style({ height: '*', visibility: 'visible' })),
                transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
                transition('expanded <=> void', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
            ]),
        ], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxGrid, decorators: [{
            type: Component,
            args: [{ selector: 'mtx-grid', exportAs: 'mtxGrid', host: {
                        class: 'mtx-grid',
                    }, encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, animations: [
                        trigger('expansion', [
                            state('collapsed, void', style({ height: '0', minHeight: '0', visibility: 'hidden' })),
                            state('expanded', style({ height: '*', visibility: 'visible' })),
                            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
                            transition('expanded <=> void', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
                        ]),
                    ], standalone: true, imports: [
                        AsyncPipe,
                        NgTemplateOutlet,
                        MatProgressBar,
                        MatIconButton,
                        MatCheckbox,
                        MatTable,
                        MatColumnDef,
                        MatHeaderRowDef,
                        MatHeaderRow,
                        MatRowDef,
                        MatRow,
                        MatFooterRowDef,
                        MatFooterRow,
                        MatHeaderCellDef,
                        MatHeaderCell,
                        MatCellDef,
                        MatCell,
                        MatFooterCellDef,
                        MatFooterCell,
                        MatSort,
                        MatSortHeader,
                        MatPaginator,
                        MatResizable,
                        MatColumnResize,
                        MtxGridCell,
                        MtxGridColumnMenu,
                        MtxGridSelectableCell,
                        MtxGridExpansionToggle,
                        MtxIsTemplateRefPipe,
                        MtxGridColClassPipe,
                        MtxGridRowClassPipe,
                        MtxToObservablePipe,
                    ], template: "<!-- Progress bar-->\n@if (loading) {\n  <div class=\"mtx-grid-progress\">\n    <mat-progress-bar mode=\"indeterminate\"></mat-progress-bar>\n  </div>\n}\n\n<!-- Toolbar -->\n@if (showToolbar) {\n  <div class=\"mtx-grid-toolbar\">\n    <div class=\"mtx-grid-toolbar-content\">\n      @if (toolbarTemplate) {\n        <ng-template [ngTemplateOutlet]=\"toolbarTemplate\"></ng-template>\n      } @else {\n        @if (toolbarTitle) {\n          <div class=\"mtx-grid-toolbar-title\">{{toolbarTitle}}</div>\n        }\n      }\n    </div>\n    <div class=\"mtx-grid-toolbar-actions\">\n      @if (showColumnMenuButton) {\n        <mtx-grid-column-menu #columnMenu\n          [columns]=\"columns\"\n          [buttonText]=\"columnMenuButtonText\"\n          [buttonType]=\"columnMenuButtonType\"\n          [buttonColor]=\"columnMenuButtonColor\"\n          [buttonClass]=\"columnMenuButtonClass\"\n          [buttonIcon]=\"columnMenuButtonIcon\"\n          [selectable]=\"columnHideable\"\n          [selectableChecked]=\"columnHideableChecked\"\n          [sortable]=\"columnSortable\"\n          [pinnable]=\"columnPinnable\"\n          [showHeader]=\"showColumnMenuHeader\"\n          [headerText]=\"columnMenuHeaderText\"\n          [headerTemplate]=\"columnMenuHeaderTemplate\"\n          [showFooter]=\"showColumnMenuFooter\"\n          [footerText]=\"columnMenuFooterText\"\n          [footerTemplate]=\"columnMenuFooterTemplate\"\n          [pinOptions]=\"columnPinOptions\"\n          (columnChange)=\"_onColumnChange($event)\">\n        </mtx-grid-column-menu>\n      }\n    </div>\n  </div>\n}\n\n<div class=\"mtx-grid-main mtx-grid-layout\">\n  <!-- Table content -->\n  <div class=\"mtx-grid-content mtx-grid-layout\">\n    <div #tableContainer class=\"mat-table-container\" [class.mat-table-with-data]=\"!_hasNoResult\">\n      @if (!columnResizable) {\n        <table mat-table\n          [class]=\"{'mat-table-hover': rowHover, 'mat-table-striped': rowStriped, 'mat-table-expandable': expandable}\"\n          [dataSource]=\"dataSource\" [multiTemplateDataRows]=\"expandable\"\n          matSort\n          [matSortActive]=\"sortActive\"\n          [matSortDirection]=\"sortDirection\"\n          [matSortDisableClear]=\"sortDisableClear\"\n          [matSortDisabled]=\"sortDisabled\"\n          [matSortStart]=\"sortStart\"\n          (matSortChange)=\"_onSortChange($event)\"\n          [trackBy]=\"trackBy\">\n          @if (rowSelectable && !hideRowSelectionCheckbox) {\n            <ng-container matColumnDef=\"MtxGridCheckboxColumnDef\">\n              <th mat-header-cell *matHeaderCellDef class=\"mtx-grid-checkbox-cell\">\n                @if (multiSelectable) {\n                  <mat-checkbox\n                    [checked]=\"rowSelection.hasValue() && _isAllSelected()\"\n                    [indeterminate]=\"rowSelection.hasValue() && !_isAllSelected()\"\n                    (change)=\"$event ? _toggleMasterCheckbox() : null\">\n                  </mat-checkbox>\n                }\n              </th>\n              <td mat-cell *matCellDef=\"let row; let index = index; let dataIndex = dataIndex;\"\n                class=\"mtx-grid-checkbox-cell\">\n                @if (!(rowSelectionFormatter.hideCheckbox && rowSelectionFormatter.hideCheckbox(row, _getIndex(index, dataIndex)))) {\n                  <mat-checkbox\n                    [disabled]=\"rowSelectionFormatter.disabled && rowSelectionFormatter.disabled(row, _getIndex(index, dataIndex))\"\n                    [checked]=\"rowSelection.isSelected(row)\"\n                    (click)=\"$event.stopPropagation()\"\n                    (change)=\"$event ? _toggleNormalCheckbox(row) : null\">\n                  </mat-checkbox>\n                }\n              </td>\n              <td mat-footer-cell *matFooterCellDef class=\"mtx-grid-checkbox-cell\"></td>\n            </ng-container>\n          }\n          @for (col of columns; track col) {\n            <ng-container [matColumnDef]=\"col.field\"\n              [sticky]=\"col.pinned==='left'\" [stickyEnd]=\"col.pinned==='right'\">\n              <th mat-header-cell *matHeaderCellDef\n                [class]=\"col | colClass\"\n                [class.mat-table-sticky-left]=\"col.pinned === 'left'\"\n                [class.mat-table-sticky-right]=\"col.pinned === 'right'\"\n                [style]=\"{'width': col.width, 'min-width': col.width, 'left': col.left, 'right': col.right}\">\n                <div class=\"mat-header-cell-inner\">\n                  @if (headerTemplate | isTemplateRef) {\n                    <ng-template [ngTemplateOutlet]=\"$any(headerTemplate)\"\n                      [ngTemplateOutletContext]=\"{ $implicit: col, colDef: col }\">\n                    </ng-template>\n                  } @else {\n                    @if ($any(headerTemplate)?.[col.field] | isTemplateRef) {\n                      <ng-template [ngTemplateOutlet]=\"$any(headerTemplate)[col.field]\"\n                        [ngTemplateOutletContext]=\"{ $implicit: col, colDef: col }\">\n                      </ng-template>\n                    } @else {\n                      <div [mat-sort-header]=\"col.sortProp?.id || col.field\"\n                        [disabled]=\"!col.sortable\"\n                        [disableClear]=\"col.sortProp?.disableClear ?? sortDisableClear\"\n                        [arrowPosition]=\"col.sortProp?.arrowPosition!\"\n                        [start]=\"col.sortProp?.start!\">\n                        @if (col.showExpand) {\n                          <span class=\"mtx-grid-expansion-placeholder\"></span>\n                        }\n                        <span>{{col.header | toObservable | async}}</span>\n                        @if (col.sortable) {\n                          <svg class=\"mtx-grid-icon mat-sort-header-icon\" viewBox=\"0 0 24 24\"\n                            width=\"24px\" height=\"24px\" fill=\"currentColor\" focusable=\"false\">\n                            <path d=\"M3,13H15V11H3M3,6V8H21V6M3,18H9V16H3V18Z\" />\n                          </svg>\n                        }\n                      </div>\n                      <ng-template [ngTemplateOutlet]=\"headerExtraTplBase\"\n                        [ngTemplateOutletContext]=\"{ $implicit: headerExtraTemplate, colDef: col }\">\n                      </ng-template>\n                    }\n                  }\n                </div>\n              </th>\n              <td mat-cell *matCellDef=\"let row; let index = index; let dataIndex = dataIndex;\"\n                [class]=\"col | colClass: row: rowChangeRecord: rowChangeRecord?.currentValue\"\n                [class.mat-table-sticky-left]=\"col.pinned === 'left'\"\n                [class.mat-table-sticky-right]=\"col.pinned === 'right'\"\n                [style]=\"{'width': col.width, 'min-width': col.width, 'left': col.left, 'right': col.right}\"\n                mtx-grid-selectable-cell [cellSelectable]=\"cellSelectable\"\n                (cellSelectedChange)=\"_selectCell($event, row, col)\">\n                @if (cellTemplate | isTemplateRef) {\n                  <ng-template [ngTemplateOutlet]=\"$any(cellTemplate)\"\n                    [ngTemplateOutletContext]=\"{ $implicit: row, rowData: row, index: _getIndex(index, dataIndex), colDef: col }\">\n                  </ng-template>\n                } @else {\n                  @if ($any(cellTemplate)?.[col.field] | isTemplateRef) {\n                    <ng-template [ngTemplateOutlet]=\"$any(cellTemplate)[col.field]\"\n                      [ngTemplateOutletContext]=\"{ $implicit: row, rowData: row, index: _getIndex(index, dataIndex), colDef: col }\">\n                    </ng-template>\n                  } @else {\n                    @if (col.cellTemplate) {\n                      <ng-template\n                        [ngTemplateOutlet]=\"col.cellTemplate!\"\n                        [ngTemplateOutletContext]=\"{ $implicit: row, rowData: row, index: _getIndex(index, dataIndex), colDef: col }\">\n                      </ng-template>\n                    } @else {\n                      @if (col.showExpand) {\n                        <button class=\"mtx-grid-row-expand-button\"\n                          mat-icon-button mtx-grid-expansion-toggle type=\"button\"\n                          [(opened)]=\"expansionRowStates[dataIndex].expanded\"\n                          (toggleChange)=\"_onExpansionChange($event, row, col, dataIndex);\">\n                          <svg class=\"mtx-grid-icon mtx-grid-row-expand-icon\" viewBox=\"0 0 24 24\"\n                            width=\"24px\" height=\"24px\" fill=\"currentColor\" focusable=\"false\">\n                            <path d=\"M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z\" />\n                          </svg>\n                        </button>\n                      }\n                      <mtx-grid-cell [rowData]=\"row\" [colDef]=\"col\" [placeholder]=\"emptyValuePlaceholder\"\n                        (rowDataChange)=\"_onRowDataChange($event)\"></mtx-grid-cell>\n                    }\n                  }\n                }\n              </td>\n              <td mat-footer-cell *matFooterCellDef\n                [class.mat-table-sticky-left]=\"col.pinned === 'left'\"\n                [class.mat-table-sticky-right]=\"col.pinned === 'right'\"\n                [style]=\"{'width': col.width, 'min-width': col.width, 'left': col.left, 'right': col.right}\">\n                @if (col.showExpand) {\n                  <span class=\"mtx-grid-expansion-placeholder\"></span>\n                }\n                @if (summaryTemplate | isTemplateRef) {\n                  <ng-template [ngTemplateOutlet]=\"$any(summaryTemplate)\"\n                    [ngTemplateOutletContext]=\"{ $implicit: col, colDef: col, data: data }\">\n                  </ng-template>\n                } @else {\n                  @if ($any(summaryTemplate)?.[col.field] | isTemplateRef) {\n                    <ng-template [ngTemplateOutlet]=\"$any(summaryTemplate)[col.field]\"\n                      [ngTemplateOutletContext]=\"{ $implicit: _getColData(data, col), colData: _getColData(data, col), colDef: col }\">\n                    </ng-template>\n                  } @else {\n                    <mtx-grid-cell [summary]=\"true\" [data]=\"data\" [colDef]=\"col\"\n                      [placeholder]=\"emptyValuePlaceholder\"></mtx-grid-cell>\n                  }\n                }\n              </td>\n            </ng-container>\n          }\n          @if (!useContentHeaderRowTemplate) {\n            <tr mat-header-row *matHeaderRowDef=\"displayedColumns; sticky: true\"></tr>\n          }\n          @if (!useContentRowTemplate) {\n            <tr mat-row\n              *matRowDef=\"let row; let index = index; let dataIndex = dataIndex; columns: displayedColumns;\"\n              [class]=\"row | rowClass: index: dataIndex: rowClassFormatter\"\n              [class.selected]=\"rowSelection.isSelected(row)\"\n              (click)=\"_selectRow($event, row, _getIndex(index, dataIndex))\"\n              (contextmenu)=\"_contextmenu($event, row, _getIndex(index, dataIndex))\">\n            </tr>\n          }\n          @if (_whetherShowSummary) {\n            <tr mat-footer-row *matFooterRowDef=\"displayedColumns; sticky: true\"></tr>\n          }\n          @if (expandable) {\n            <!-- Expanded Content Column - The expandable row is made up of this one column that spans across all columns -->\n            <ng-container matColumnDef=\"MtxGridExpansionColumnDef\">\n              <td mat-cell *matCellDef=\"let row; let dataIndex = dataIndex\"\n                [attr.colspan]=\"displayedColumns.length\">\n                <div class=\"mtx-grid-expansion-detail\"\n                  [@expansion]=\"expansionRowStates[dataIndex].expanded ? 'expanded' : 'collapsed'\">\n                  <ng-template [ngTemplateOutlet]=\"expansionTemplate\"\n                    [ngTemplateOutletContext]=\"{ $implicit: row, rowData: row, index: dataIndex, expanded: expansionRowStates[dataIndex].expanded }\">\n                  </ng-template>\n                </div>\n              </td>\n            </ng-container>\n            <tr mat-row\n              *matRowDef=\"let row; columns: ['MtxGridExpansionColumnDef']; let dataIndex = dataIndex\"\n              class=\"mtx-grid-expansion\"\n              [class]=\"expansionRowStates[dataIndex].expanded ? 'expanded' : 'collapsed'\">\n            </tr>\n          }\n        </table>\n      } @else {\n        <!-- TODO: Use flexbox-based mat-table -->\n        <table mat-table\n          columnResize\n          [class]=\"{'mat-table-hover': rowHover, 'mat-table-striped': rowStriped, 'mat-table-expandable': expandable}\"\n          [dataSource]=\"dataSource\" [multiTemplateDataRows]=\"expandable\"\n          matSort\n          [matSortActive]=\"sortActive\"\n          [matSortDirection]=\"sortDirection\"\n          [matSortDisableClear]=\"sortDisableClear\"\n          [matSortDisabled]=\"sortDisabled\"\n          [matSortStart]=\"sortStart\"\n          (matSortChange)=\"_onSortChange($event)\"\n          [trackBy]=\"trackBy\">\n          @if (rowSelectable && !hideRowSelectionCheckbox) {\n            <ng-container matColumnDef=\"MtxGridCheckboxColumnDef\">\n              <th mat-header-cell *matHeaderCellDef class=\"mtx-grid-checkbox-cell\">\n                @if (multiSelectable) {\n                  <mat-checkbox\n                    [checked]=\"rowSelection.hasValue() && _isAllSelected()\"\n                    [indeterminate]=\"rowSelection.hasValue() && !_isAllSelected()\"\n                    (change)=\"$event ? _toggleMasterCheckbox() : null\">\n                  </mat-checkbox>\n                }\n              </th>\n              <td mat-cell *matCellDef=\"let row; let index = index; let dataIndex = dataIndex;\"\n                class=\"mtx-grid-checkbox-cell\">\n                @if (!(rowSelectionFormatter.hideCheckbox && rowSelectionFormatter.hideCheckbox(row, _getIndex(index, dataIndex)))) {\n                  <mat-checkbox\n                    [disabled]=\"rowSelectionFormatter.disabled && rowSelectionFormatter.disabled(row, _getIndex(index, dataIndex))\"\n                    [checked]=\"rowSelection.isSelected(row)\"\n                    (click)=\"$event.stopPropagation()\"\n                    (change)=\"$event ? _toggleNormalCheckbox(row) : null\">\n                  </mat-checkbox>\n                }\n              </td>\n              <td mat-footer-cell *matFooterCellDef class=\"mtx-grid-checkbox-cell\"></td>\n            </ng-container>\n          }\n          @for (col of columns; track col) {\n            <ng-container [matColumnDef]=\"col.field\"\n              [sticky]=\"col.pinned==='left'\" [stickyEnd]=\"col.pinned==='right'\">\n              <th mat-header-cell *matHeaderCellDef\n                [class]=\"col | colClass\"\n                [class.mat-table-sticky-left]=\"col.pinned === 'left'\"\n                [class.mat-table-sticky-right]=\"col.pinned === 'right'\"\n                [style]=\"{'width': col.width, 'left': col.left, 'right': col.right}\"\n                [resizable]=\"col.resizable\"\n                [matResizableMinWidthPx]=\"col.minWidth\" [matResizableMaxWidthPx]=\"col.maxWidth\">\n                <div class=\"mat-header-cell-inner\">\n                  @if (headerTemplate | isTemplateRef) {\n                    <ng-template [ngTemplateOutlet]=\"$any(headerTemplate)\"\n                      [ngTemplateOutletContext]=\"{ $implicit: col, colDef: col }\">\n                    </ng-template>\n                  } @else {\n                    @if ($any(headerTemplate)?.[col.field] | isTemplateRef) {\n                      <ng-template [ngTemplateOutlet]=\"$any(headerTemplate)[col.field]\"\n                        [ngTemplateOutletContext]=\"{ $implicit: col, colDef: col }\">\n                      </ng-template>\n                    } @else {\n                      <div [mat-sort-header]=\"col.sortProp?.id || col.field\"\n                        [disabled]=\"!col.sortable\"\n                        [disableClear]=\"col.sortProp?.disableClear ?? sortDisableClear\"\n                        [arrowPosition]=\"col.sortProp?.arrowPosition!\"\n                        [start]=\"col.sortProp?.start!\">\n                        @if (col.showExpand) {\n                          <span class=\"mtx-grid-expansion-placeholder\"></span>\n                        }\n                        <span>{{col.header | toObservable | async}}</span>\n                        @if (col.sortable) {\n                          <svg class=\"mtx-grid-icon mat-sort-header-icon\" viewBox=\"0 0 24 24\"\n                            width=\"24px\" height=\"24px\" fill=\"currentColor\" focusable=\"false\">\n                            <path d=\"M3,13H15V11H3M3,6V8H21V6M3,18H9V16H3V18Z\" />\n                          </svg>\n                        }\n                      </div>\n                      <ng-template [ngTemplateOutlet]=\"headerExtraTplBase\"\n                        [ngTemplateOutletContext]=\"{ $implicit: headerExtraTemplate, colDef: col }\">\n                      </ng-template>\n                    }\n                  }\n                </div>\n              </th>\n              <td mat-cell *matCellDef=\"let row; let index = index; let dataIndex = dataIndex;\"\n                [class]=\"col | colClass: row: rowChangeRecord :rowChangeRecord?.currentValue\"\n                [class.mat-table-sticky-left]=\"col.pinned === 'left'\"\n                [class.mat-table-sticky-right]=\"col.pinned === 'right'\"\n                [style]=\"{'width': col.width, 'left': col.left, 'right': col.right}\"\n                mtx-grid-selectable-cell [cellSelectable]=\"cellSelectable\"\n                (cellSelectedChange)=\"_selectCell($event, row, col)\">\n                @if (cellTemplate | isTemplateRef) {\n                  <ng-template [ngTemplateOutlet]=\"$any(cellTemplate)\"\n                    [ngTemplateOutletContext]=\"{ $implicit: row, rowData: row, index: _getIndex(index, dataIndex), colDef: col }\">\n                  </ng-template>\n                } @else {\n                  @if ($any(cellTemplate)?.[col.field] | isTemplateRef) {\n                    <ng-template [ngTemplateOutlet]=\"$any(cellTemplate)[col.field]\"\n                      [ngTemplateOutletContext]=\"{ $implicit: row, rowData: row, index: _getIndex(index, dataIndex), colDef: col }\">\n                    </ng-template>\n                  } @else {\n                    @if (col.cellTemplate) {\n                      <ng-template\n                        [ngTemplateOutlet]=\"col.cellTemplate!\"\n                        [ngTemplateOutletContext]=\"{ $implicit: row, rowData: row, index: _getIndex(index, dataIndex), colDef: col }\">\n                      </ng-template>\n                    } @else {\n                      @if (col.showExpand) {\n                        <button class=\"mtx-grid-row-expand-button\"\n                          mat-icon-button mtx-grid-expansion-toggle type=\"button\"\n                          [(opened)]=\"expansionRowStates[dataIndex].expanded\"\n                          (toggleChange)=\"_onExpansionChange($event, row, col, dataIndex);\">\n                          <svg class=\"mtx-grid-icon mtx-grid-row-expand-icon\" viewBox=\"0 0 24 24\"\n                            width=\"24px\" height=\"24px\" fill=\"currentColor\" focusable=\"false\">\n                            <path d=\"M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z\" />\n                          </svg>\n                        </button>\n                      }\n                      <mtx-grid-cell [rowData]=\"row\" [colDef]=\"col\" [placeholder]=\"emptyValuePlaceholder\"\n                        (rowDataChange)=\"_onRowDataChange($event)\"></mtx-grid-cell>\n                    }\n                  }\n                }\n              </td>\n              <td mat-footer-cell *matFooterCellDef\n                [class.mat-table-sticky-left]=\"col.pinned === 'left'\"\n                [class.mat-table-sticky-right]=\"col.pinned === 'right'\"\n                [style]=\"{'width': col.width, 'left': col.left, 'right': col.right}\">\n                @if (col.showExpand) {\n                  <span class=\"mtx-grid-expansion-placeholder\"></span>\n                }\n                @if (summaryTemplate | isTemplateRef) {\n                  <ng-template [ngTemplateOutlet]=\"$any(summaryTemplate)\"\n                    [ngTemplateOutletContext]=\"{ $implicit: col, colDef: col, data: data }\">\n                  </ng-template>\n                } @else {\n                  @if ($any(summaryTemplate)?.[col.field] | isTemplateRef) {\n                    <ng-template [ngTemplateOutlet]=\"$any(summaryTemplate)[col.field]\"\n                      [ngTemplateOutletContext]=\"{ $implicit: _getColData(data, col), colData: _getColData(data, col), colDef: col }\">\n                    </ng-template>\n                  } @else {\n                    <mtx-grid-cell [summary]=\"true\" [data]=\"data\" [colDef]=\"col\"\n                      [placeholder]=\"emptyValuePlaceholder\"></mtx-grid-cell>\n                  }\n                }\n              </td>\n            </ng-container>\n          }\n          @if (!useContentHeaderRowTemplate) {\n            <tr mat-header-row *matHeaderRowDef=\"displayedColumns; sticky: true\"></tr>\n          }\n          @if (!useContentRowTemplate) {\n            <tr mat-row\n              *matRowDef=\"let row; let index = index; let dataIndex = dataIndex; columns: displayedColumns;\"\n              [class]=\"row | rowClass: index: dataIndex: rowClassFormatter\"\n              [class.selected]=\"rowSelection.isSelected(row)\"\n              (click)=\"_selectRow($event, row, _getIndex(index, dataIndex))\"\n              (contextmenu)=\"_contextmenu($event, row, _getIndex(index, dataIndex))\">\n            </tr>\n          }\n          @if (_whetherShowSummary) {\n            <tr mat-footer-row *matFooterRowDef=\"displayedColumns; sticky: true\"></tr>\n          }\n          @if (expandable) {\n            <!-- Expanded Content Column - The expandable row is made up of this one column that spans across all columns -->\n            <ng-container matColumnDef=\"MtxGridExpansionColumnDef\">\n              <td mat-cell *matCellDef=\"let row; let dataIndex = dataIndex\"\n                [attr.colspan]=\"displayedColumns.length\">\n                <div class=\"mtx-grid-expansion-detail\"\n                  [@expansion]=\"expansionRowStates[dataIndex].expanded ? 'expanded' : 'collapsed'\">\n                  <ng-template [ngTemplateOutlet]=\"expansionTemplate\"\n                    [ngTemplateOutletContext]=\"{ $implicit: row, rowData: row, index: dataIndex, expanded: expansionRowStates[dataIndex].expanded }\">\n                  </ng-template>\n                </div>\n              </td>\n            </ng-container>\n            <tr mat-row\n              *matRowDef=\"let row; columns: ['MtxGridExpansionColumnDef']; let dataIndex = dataIndex\"\n              class=\"mtx-grid-expansion\"\n              [class]=\"expansionRowStates[dataIndex].expanded ? 'expanded' : 'collapsed'\">\n            </tr>\n          }\n        </table>\n      }\n    </div>\n\n    <!-- No result -->\n    @if (_hasNoResult) {\n      <div class=\"mtx-grid-no-result\">\n        @if (noResultTemplate) {\n          <ng-template [ngTemplateOutlet]=\"noResultTemplate\"></ng-template>\n        } @else {\n          {{noResultText}}\n        }\n      </div>\n    }\n  </div>\n\n  <!-- Tool sidebar -->\n  @if (showSidebar) {\n    <div class=\"mtx-grid-sidebar\">\n      @if (sidebarTemplate) {\n        <ng-template [ngTemplateOutlet]=\"sidebarTemplate\"></ng-template>\n      }\n    </div>\n  }\n</div>\n\n<div class=\"mtx-grid-footer\">\n  <!-- Status Bar -->\n  @if (showStatusbar) {\n    <div class=\"mtx-grid-statusbar\">\n      @if (statusbarTemplate) {\n        <ng-template [ngTemplateOutlet]=\"statusbarTemplate\"></ng-template>\n      }\n    </div>\n  }\n\n  <!-- Pagination -->\n  <div class=\"mtx-grid-pagination\">\n    @if (paginationTemplate) {\n      <ng-template [ngTemplateOutlet]=\"paginationTemplate\"></ng-template>\n    } @else {\n      <mat-paginator [class.mat-paginator-hidden]=\"!showPaginator\"\n        [showFirstLastButtons]=\"showFirstLastButtons\"\n        [length]=\"length\"\n        [pageIndex]=\"pageIndex\"\n        [pageSize]=\"pageSize\"\n        [pageSizeOptions]=\"pageSizeOptions\"\n        [hidePageSize]=\"hidePageSize\"\n        (page)=\"_onPage($event)\"\n        [disabled]=\"pageDisabled\">\n      </mat-paginator>\n    }\n  </div>\n</div>\n\n<!-- Header template for extra content -->\n<ng-template #headerExtraTplBase let-headerExtraTemplate let-col=\"colDef\">\n  @if (headerExtraTemplate | isTemplateRef) {\n    <ng-template [ngTemplateOutlet]=\"headerExtraTemplate\"\n      [ngTemplateOutletContext]=\"{ $implicit: col, colDef: col }\">\n    </ng-template>\n  } @else {\n    @if ($any(headerExtraTemplate)?.[col.field] | isTemplateRef) {\n      <ng-template [ngTemplateOutlet]=\"headerExtraTemplate[col.field]\"\n        [ngTemplateOutletContext]=\"{ $implicit: col, colDef: col }\">\n      </ng-template>\n    }\n  }\n</ng-template>\n", styles: [".mtx-grid{position:relative;display:flex;flex-direction:column;width:100%;overflow:hidden;border:1px solid var(--mtx-grid-outline-color);border-radius:var(--mtx-grid-container-shape)}.mtx-grid .mat-mdc-table.mat-table-striped .mat-row-odd{background-color:var(--mtx-grid-table-row-striped-background-color)}.mtx-grid .mat-mdc-table.mat-table-hover .mat-mdc-row:hover{background-color:var(--mtx-grid-table-row-hover-background-color)}.mtx-grid .mat-mdc-table.mat-table-hover .mat-mdc-row.selected:hover{background-color:var(--mtx-grid-table-row-selected-hover-background-color)}.mtx-grid .mat-mdc-table .mat-mdc-row.selected{background-color:var(--mtx-grid-table-row-selected-background-color)}.mtx-grid .mat-mdc-table .mat-mdc-cell.selected{box-shadow:inset 0 0 0 1px var(--mtx-grid-table-cell-selected-outline-color)}.mtx-grid .mat-table-container{overflow:auto}.mtx-grid .mat-table-container.mat-table-with-data{flex:1}.mtx-grid .mat-mdc-table:not(.mat-column-resize-table){min-width:100%;border-collapse:separate}.mtx-grid .mat-mdc-table:not(.mat-column-resize-table) .mat-mdc-header-cell:not(.mtx-grid-checkbox-cell),.mtx-grid .mat-mdc-table:not(.mat-column-resize-table) .mat-mdc-footer-cell:not(.mtx-grid-checkbox-cell),.mtx-grid .mat-mdc-table:not(.mat-column-resize-table) .mat-mdc-cell:not(.mtx-grid-checkbox-cell){min-width:var(--mtx-grid-table-cell-min-width)}.mtx-grid .mat-table-sticky-left{border-right:1px solid var(--mat-table-row-item-outline-color)}[dir=rtl] .mtx-grid .mat-table-sticky-left{border-right-width:0;border-left:1px solid var(--mat-table-row-item-outline-color)}.mtx-grid .mat-table-sticky-right{border-left:1px solid var(--mat-table-row-item-outline-color)}[dir=rtl] .mtx-grid .mat-table-sticky-right{border-left-width:0;border-right:1px solid var(--mat-table-row-item-outline-color)}.mtx-grid .mat-mdc-footer-cell{border-top:1px solid var(--mat-table-row-item-outline-color);background-color:var(--mtx-grid-table-footer-background-color)}.mtx-grid .mat-mdc-row.mtx-grid-expansion{height:0;overflow:hidden}.mtx-grid .mat-mdc-row.mtx-grid-expansion .mat-mdc-cell{padding-top:0;padding-bottom:0}.mtx-grid .mat-mdc-row.mtx-grid-expansion.collapsed .mat-mdc-cell{border-bottom-width:0}.mtx-grid .mat-sort-header-icon{margin:0 4px}.mtx-grid .mat-header-cell-inner{display:inline-flex;align-items:center;vertical-align:middle}.mtx-grid .mat-mdc-paginator{border-top:1px solid var(--mtx-grid-outline-color);border-bottom-left-radius:var(--mtx-grid-container-shape);border-bottom-right-radius:var(--mtx-grid-container-shape)}.mtx-grid .mat-paginator-hidden{display:none}.mtx-grid .mtx-grid-checkbox-cell{width:60px;min-width:60px;padding:0 calc((60px - var(--mdc-checkbox-state-layer-size)) / 2)}.mtx-grid-progress{position:absolute;top:0;z-index:120;width:100%}.mtx-grid-toolbar{display:flex;justify-content:space-between;align-items:center;min-height:var(--mat-table-header-container-height);padding:8px;box-sizing:border-box;border-bottom:1px solid var(--mtx-grid-outline-color)}.mtx-grid-toolbar-content{flex:1;width:0;padding:0 8px}.mtx-grid-layout{display:flex;flex:1 1 auto;overflow:auto}.mtx-grid-content{flex-direction:column;width:0}.mtx-grid-sidebar{max-width:50%;border-left:1px solid var(--mtx-grid-outline-color)}[dir=rtl] .mtx-grid-sidebar{border-left-width:0;border-right:1px solid var(--mtx-grid-outline-color)}.mtx-grid-footer{position:relative;z-index:1}.mtx-grid-statusbar{display:flex;align-items:center;min-height:var(--mat-table-header-container-height);padding:8px;box-sizing:border-box;border-top:1px solid var(--mtx-grid-outline-color)}.mtx-grid-no-result{display:flex;justify-content:center;align-items:center;flex:1;min-height:150px}.mtx-grid-expansion-placeholder{display:inline-block;vertical-align:middle;width:var(--mdc-icon-button-state-layer-size, var(--mtx-grid-row-expand-button-size));height:var(--mdc-icon-button-state-layer-size, var(--mtx-grid-row-expand-button-size))}.mtx-grid-expansion-detail{display:flex;align-items:center;min-height:var(--mat-table-row-item-container-height);overflow:hidden}.mtx-grid-row-expand-button.expanded .mtx-grid-row-expand-icon{transform:rotate(90deg)}.mtx-grid-row-expand-button.mat-mdc-icon-button,.mtx-grid-row-expand-button+mtx-grid-cell{vertical-align:middle}.mtx-grid-icon{width:20px;height:20px;font-size:20px}\n"] }]
        }], ctorParameters: () => [{ type: MtxGridUtils }, { type: i0.ChangeDetectorRef }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MTX_GRID_DEFAULT_OPTIONS]
                }] }], propDecorators: { table: [{
                type: ViewChild,
                args: [MatTable]
            }], paginator: [{
                type: ViewChild,
                args: [MatPaginator]
            }], sort: [{
                type: ViewChild,
                args: [MatSort]
            }], rowDefs: [{
                type: ContentChildren,
                args: [MatRowDef]
            }], headerRowDefs: [{
                type: ContentChildren,
                args: [MatHeaderRowDef]
            }], footerRowDefs: [{
                type: ContentChildren,
                args: [MatFooterRow]
            }], columnMenu: [{
                type: ViewChild,
                args: ['columnMenu']
            }], tableContainer: [{
                type: ViewChild,
                args: ['tableContainer']
            }], displayedColumns: [{
                type: Input
            }], columns: [{
                type: Input
            }], data: [{
                type: Input
            }], length: [{
                type: Input
            }], loading: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], trackBy: [{
                type: Input
            }], columnResizable: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], emptyValuePlaceholder: [{
                type: Input
            }], pageOnFront: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], showPaginator: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], pageDisabled: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], showFirstLastButtons: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], pageIndex: [{
                type: Input
            }], pageSize: [{
                type: Input
            }], pageSizeOptions: [{
                type: Input
            }], hidePageSize: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], page: [{
                type: Output
            }], paginationTemplate: [{
                type: Input
            }], sortOnFront: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], sortActive: [{
                type: Input
            }], sortDirection: [{
                type: Input
            }], sortDisableClear: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], sortDisabled: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], sortStart: [{
                type: Input
            }], sortChange: [{
                type: Output
            }], rowHover: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], rowStriped: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], rowClick: [{
                type: Output
            }], rowContextMenu: [{
                type: Output
            }], expandable: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], expansionTemplate: [{
                type: Input
            }], expansionChange: [{
                type: Output
            }], multiSelectable: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], multiSelectionWithClick: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], rowSelectable: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], hideRowSelectionCheckbox: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], disableRowClickSelection: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], rowSelectionFormatter: [{
                type: Input
            }], rowClassFormatter: [{
                type: Input
            }], rowSelected: [{
                type: Input
            }], rowSelectedChange: [{
                type: Output
            }], cellSelectable: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], cellSelectedChange: [{
                type: Output
            }], showToolbar: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], toolbarTitle: [{
                type: Input
            }], toolbarTemplate: [{
                type: Input
            }], columnHideable: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], columnHideableChecked: [{
                type: Input
            }], columnSortable: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], columnPinnable: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], columnChange: [{
                type: Output
            }], columnPinOptions: [{
                type: Input
            }], showColumnMenuButton: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], columnMenuButtonText: [{
                type: Input
            }], columnMenuButtonType: [{
                type: Input
            }], columnMenuButtonColor: [{
                type: Input
            }], columnMenuButtonClass: [{
                type: Input
            }], columnMenuButtonIcon: [{
                type: Input
            }], showColumnMenuHeader: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], columnMenuHeaderText: [{
                type: Input
            }], columnMenuHeaderTemplate: [{
                type: Input
            }], showColumnMenuFooter: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], columnMenuFooterText: [{
                type: Input
            }], columnMenuFooterTemplate: [{
                type: Input
            }], noResultText: [{
                type: Input
            }], noResultTemplate: [{
                type: Input
            }], headerTemplate: [{
                type: Input
            }], headerExtraTemplate: [{
                type: Input
            }], cellTemplate: [{
                type: Input
            }], useContentRowTemplate: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], useContentHeaderRowTemplate: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], useContentFooterRowTemplate: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], showSummary: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], summaryTemplate: [{
                type: Input
            }], showSidebar: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], sidebarTemplate: [{
                type: Input
            }], showStatusbar: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], statusbarTemplate: [{
                type: Input
            }] } });

class MtxGridModule {
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxGridModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    /** @nocollapse */ static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.0.1", ngImport: i0, type: MtxGridModule, imports: [CommonModule,
            FormsModule,
            MatTableModule,
            MatSortModule,
            MatPaginatorModule,
            MatCheckboxModule,
            MatButtonModule,
            MatProgressBarModule,
            MatChipsModule,
            MatTooltipModule,
            MatBadgeModule,
            MatIconModule,
            MatSelectModule,
            MatFormFieldModule,
            MatMenuModule,
            DragDropModule,
            MtxDialogModule,
            MtxPipesModule,
            MatColumnResizeModule,
            MtxGrid,
            MtxGridCell,
            MtxGridColumnMenu,
            MtxGridExpansionToggle,
            MtxGridSelectableCell,
            MtxGridRowClassPipe,
            MtxGridColClassPipe,
            MtxGridCellActionsPipe,
            MtxGridCellActionTooltipPipe,
            MtxGridCellActionBadgePipe,
            MtxGridCellActionDisablePipe,
            MtxGridCellSummaryPipe], exports: [MatColumnResizeModule,
            MtxGrid,
            MtxGridCell,
            MtxGridColumnMenu,
            MtxGridExpansionToggle,
            MtxGridSelectableCell,
            MtxGridRowClassPipe,
            MtxGridColClassPipe,
            MtxGridCellActionsPipe,
            MtxGridCellActionTooltipPipe,
            MtxGridCellActionBadgePipe,
            MtxGridCellActionDisablePipe,
            MtxGridCellSummaryPipe] }); }
    /** @nocollapse */ static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxGridModule, providers: [MtxGridUtils], imports: [CommonModule,
            FormsModule,
            MatTableModule,
            MatSortModule,
            MatPaginatorModule,
            MatCheckboxModule,
            MatButtonModule,
            MatProgressBarModule,
            MatChipsModule,
            MatTooltipModule,
            MatBadgeModule,
            MatIconModule,
            MatSelectModule,
            MatFormFieldModule,
            MatMenuModule,
            DragDropModule,
            MtxDialogModule,
            MtxPipesModule,
            MatColumnResizeModule,
            MtxGrid,
            MtxGridCell,
            MtxGridColumnMenu, MatColumnResizeModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxGridModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        FormsModule,
                        MatTableModule,
                        MatSortModule,
                        MatPaginatorModule,
                        MatCheckboxModule,
                        MatButtonModule,
                        MatProgressBarModule,
                        MatChipsModule,
                        MatTooltipModule,
                        MatBadgeModule,
                        MatIconModule,
                        MatSelectModule,
                        MatFormFieldModule,
                        MatMenuModule,
                        DragDropModule,
                        MtxDialogModule,
                        MtxPipesModule,
                        MatColumnResizeModule,
                        MtxGrid,
                        MtxGridCell,
                        MtxGridColumnMenu,
                        MtxGridExpansionToggle,
                        MtxGridSelectableCell,
                        MtxGridRowClassPipe,
                        MtxGridColClassPipe,
                        MtxGridCellActionsPipe,
                        MtxGridCellActionTooltipPipe,
                        MtxGridCellActionBadgePipe,
                        MtxGridCellActionDisablePipe,
                        MtxGridCellSummaryPipe,
                    ],
                    exports: [
                        MatColumnResizeModule,
                        MtxGrid,
                        MtxGridCell,
                        MtxGridColumnMenu,
                        MtxGridExpansionToggle,
                        MtxGridSelectableCell,
                        MtxGridRowClassPipe,
                        MtxGridColClassPipe,
                        MtxGridCellActionsPipe,
                        MtxGridCellActionTooltipPipe,
                        MtxGridCellActionBadgePipe,
                        MtxGridCellActionDisablePipe,
                        MtxGridCellSummaryPipe,
                    ],
                    providers: [MtxGridUtils],
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { AbstractMatColumnResize, AbstractMatResizable, FLEX_HOST_BINDINGS as MAT_FLEX_HOST_BINDINGS, FLEX_PROVIDERS as MAT_FLEX_PROVIDERS, FLEX_RESIZE_STRATEGY_PROVIDER as MAT_FLEX_RESIZE_STRATEGY_PROVIDER, RESIZABLE_HOST_BINDINGS as MAT_RESIZABLE_HOST_BINDINGS, RESIZABLE_INPUTS as MAT_RESIZABLE_INPUTS, TABLE_HOST_BINDINGS as MAT_TABLE_HOST_BINDINGS, TABLE_PROVIDERS as MAT_TABLE_PROVIDERS, MTX_GRID_DEFAULT_OPTIONS, MatColumnResize, MatColumnResizeCommonModule, MatColumnResizeFlex, MatColumnResizeModule, MatColumnResizeOverlayHandle, MatFlexTableResizeStrategy, MatResizable, MtxGrid, MtxGridCell, MtxGridCellActionBadgePipe, MtxGridCellActionDisablePipe, MtxGridCellActionTooltipPipe, MtxGridCellActionsPipe, MtxGridCellSummaryPipe, MtxGridColClassPipe, MtxGridColumnMenu, MtxGridExpansionToggle, MtxGridModule, MtxGridRowClassPipe, MtxGridSelectableCell, MtxGridUtils };
//# sourceMappingURL=mtxGrid.mjs.map
