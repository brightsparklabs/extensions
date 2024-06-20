/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Inject, Injectable, CSP_NONCE, Optional } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { coerceCssPixelValue } from '@angular/cdk/coercion';
import { _COALESCED_STYLE_SCHEDULER } from '@angular/cdk/table';
import * as i0 from "@angular/core";
import * as i1 from "./column-resize";
import * as i2 from "@angular/cdk/table";
/**
 * Provides an implementation for resizing a column.
 * The details of how resizing works for tables for flex mat-tables are quite different.
 */
export class ResizeStrategy {
    constructor() {
        this._pendingResizeDelta = null;
    }
    /** Adjusts the width of the table element by the specified delta. */
    updateTableWidthAndStickyColumns(delta) {
        if (this._pendingResizeDelta === null) {
            const tableElement = this.columnResize.elementRef.nativeElement;
            const tableWidth = getElementWidth(tableElement);
            this.styleScheduler.schedule(() => {
                tableElement.style.width = coerceCssPixelValue(tableWidth + this._pendingResizeDelta);
                this._pendingResizeDelta = null;
            });
            this.styleScheduler.scheduleEnd(() => {
                this.table.updateStickyColumnStyles();
            });
        }
        this._pendingResizeDelta = (this._pendingResizeDelta ?? 0) + delta;
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: ResizeStrategy, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: ResizeStrategy }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: ResizeStrategy, decorators: [{
            type: Injectable
        }] });
/**
 * The optimally performing resize strategy for &lt;table&gt; elements with table-layout: fixed.
 * Tested against and outperformed:
 *   CSS selector
 *   CSS selector w/ CSS variable
 *   Updating all cell nodes
 */
export class TableLayoutFixedResizeStrategy extends ResizeStrategy {
    constructor(columnResize, styleScheduler, table) {
        super();
        this.columnResize = columnResize;
        this.styleScheduler = styleScheduler;
        this.table = table;
    }
    applyColumnSize(_, columnHeader, sizeInPx, previousSizeInPx) {
        const delta = sizeInPx - (previousSizeInPx ?? getElementWidth(columnHeader));
        if (delta === 0) {
            return;
        }
        this.styleScheduler.schedule(() => {
            columnHeader.style.width = coerceCssPixelValue(sizeInPx);
        });
        this.updateTableWidthAndStickyColumns(delta);
    }
    applyMinColumnSize(_, columnHeader, sizeInPx) {
        const currentWidth = getElementWidth(columnHeader);
        const newWidth = Math.max(currentWidth, sizeInPx);
        this.applyColumnSize(_, columnHeader, newWidth, currentWidth);
    }
    applyMaxColumnSize(_, columnHeader, sizeInPx) {
        const currentWidth = getElementWidth(columnHeader);
        const newWidth = Math.min(currentWidth, sizeInPx);
        this.applyColumnSize(_, columnHeader, newWidth, currentWidth);
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: TableLayoutFixedResizeStrategy, deps: [{ token: i1.ColumnResize }, { token: _COALESCED_STYLE_SCHEDULER }, { token: i2.CdkTable }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: TableLayoutFixedResizeStrategy }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: TableLayoutFixedResizeStrategy, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.ColumnResize }, { type: i2._CoalescedStyleScheduler, decorators: [{
                    type: Inject,
                    args: [_COALESCED_STYLE_SCHEDULER]
                }] }, { type: i2.CdkTable }] });
/**
 * The optimally performing resize strategy for flex mat-tables.
 * Tested against and outperformed:
 *   CSS selector w/ CSS variable
 *   Updating all mat-cell nodes
 */
export class CdkFlexTableResizeStrategy extends ResizeStrategy {
    constructor(columnResize, styleScheduler, table, document, _nonce) {
        super();
        this.columnResize = columnResize;
        this.styleScheduler = styleScheduler;
        this.table = table;
        this._nonce = _nonce;
        this._columnIndexes = new Map();
        this._columnProperties = new Map();
        this._indexSequence = 0;
        this.defaultMinSize = 0;
        this.defaultMaxSize = Number.MAX_SAFE_INTEGER;
        this._document = document;
    }
    applyColumnSize(cssFriendlyColumnName, columnHeader, sizeInPx, previousSizeInPx) {
        // Optimization: Check applied width first as we probably set it already before reading
        // offsetWidth which triggers layout.
        const delta = sizeInPx -
            (previousSizeInPx ??
                (this._getAppliedWidth(cssFriendlyColumnName) || columnHeader.offsetWidth));
        if (delta === 0) {
            return;
        }
        const cssSize = coerceCssPixelValue(sizeInPx);
        this._applyProperty(cssFriendlyColumnName, 'flex', `0 0.01 ${cssSize}`);
        this.updateTableWidthAndStickyColumns(delta);
    }
    applyMinColumnSize(cssFriendlyColumnName, _, sizeInPx) {
        const cssSize = coerceCssPixelValue(sizeInPx);
        this._applyProperty(cssFriendlyColumnName, 'min-width', cssSize, sizeInPx !== this.defaultMinSize);
        this.updateTableWidthAndStickyColumns(0);
    }
    applyMaxColumnSize(cssFriendlyColumnName, _, sizeInPx) {
        const cssSize = coerceCssPixelValue(sizeInPx);
        this._applyProperty(cssFriendlyColumnName, 'max-width', cssSize, sizeInPx !== this.defaultMaxSize);
        this.updateTableWidthAndStickyColumns(0);
    }
    getColumnCssClass(cssFriendlyColumnName) {
        return `cdk-column-${cssFriendlyColumnName}`;
    }
    ngOnDestroy() {
        this._styleElement?.remove();
        this._styleElement = undefined;
    }
    _getPropertyValue(cssFriendlyColumnName, key) {
        const properties = this._getColumnPropertiesMap(cssFriendlyColumnName);
        return properties.get(key);
    }
    _getAppliedWidth(cssFriendslyColumnName) {
        return coercePixelsFromFlexValue(this._getPropertyValue(cssFriendslyColumnName, 'flex'));
    }
    _applyProperty(cssFriendlyColumnName, key, value, enable = true) {
        const properties = this._getColumnPropertiesMap(cssFriendlyColumnName);
        this.styleScheduler.schedule(() => {
            if (enable) {
                properties.set(key, value);
            }
            else {
                properties.delete(key);
            }
            this._applySizeCss(cssFriendlyColumnName);
        });
    }
    _getStyleSheet() {
        if (!this._styleElement) {
            this._styleElement = this._document.createElement('style');
            if (this._nonce) {
                this._styleElement.nonce = this._nonce;
            }
            this._styleElement.appendChild(this._document.createTextNode(''));
            this._document.head.appendChild(this._styleElement);
        }
        return this._styleElement.sheet;
    }
    _getColumnPropertiesMap(cssFriendlyColumnName) {
        let properties = this._columnProperties.get(cssFriendlyColumnName);
        if (properties === undefined) {
            properties = new Map();
            this._columnProperties.set(cssFriendlyColumnName, properties);
        }
        return properties;
    }
    _applySizeCss(cssFriendlyColumnName) {
        const properties = this._getColumnPropertiesMap(cssFriendlyColumnName);
        const propertyKeys = Array.from(properties.keys());
        let index = this._columnIndexes.get(cssFriendlyColumnName);
        if (index === undefined) {
            if (!propertyKeys.length) {
                // Nothing to set or unset.
                return;
            }
            index = this._indexSequence++;
            this._columnIndexes.set(cssFriendlyColumnName, index);
        }
        else {
            this._getStyleSheet().deleteRule(index);
        }
        const columnClassName = this.getColumnCssClass(cssFriendlyColumnName);
        const tableClassName = this.columnResize.getUniqueCssClass();
        const selector = `.${tableClassName} .${columnClassName}`;
        const body = propertyKeys.map(key => `${key}:${properties.get(key)}`).join(';');
        this._getStyleSheet().insertRule(`${selector} {${body}}`, index);
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: CdkFlexTableResizeStrategy, deps: [{ token: i1.ColumnResize }, { token: _COALESCED_STYLE_SCHEDULER }, { token: i2.CdkTable }, { token: DOCUMENT }, { token: CSP_NONCE, optional: true }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: CdkFlexTableResizeStrategy }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: CdkFlexTableResizeStrategy, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.ColumnResize }, { type: i2._CoalescedStyleScheduler, decorators: [{
                    type: Inject,
                    args: [_COALESCED_STYLE_SCHEDULER]
                }] }, { type: i2.CdkTable }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [CSP_NONCE]
                }, {
                    type: Optional
                }] }] });
/** Converts CSS pixel values to numbers, eg "123px" to 123. Returns NaN for non pixel values. */
function coercePixelsFromCssValue(cssValue) {
    return Number(cssValue.match(/(\d+)px/)?.[1]);
}
/** Gets the style.width pixels on the specified element if present, otherwise its offsetWidth. */
function getElementWidth(element) {
    // Optimization: Check style.width first as we probably set it already before reading
    // offsetWidth which triggers layout.
    return coercePixelsFromCssValue(element.style.width) || element.offsetWidth;
}
/**
 * Converts CSS flex values as set in CdkFlexTableResizeStrategy to numbers,
 * eg "0 0.01 123px" to 123.
 */
function coercePixelsFromFlexValue(flexValue) {
    return Number(flexValue?.match(/0 0\.01 (\d+)px/)?.[1]);
}
export const TABLE_LAYOUT_FIXED_RESIZE_STRATEGY_PROVIDER = {
    provide: ResizeStrategy,
    useClass: TableLayoutFixedResizeStrategy,
};
export const FLEX_RESIZE_STRATEGY_PROVIDER = {
    provide: ResizeStrategy,
    useClass: CdkFlexTableResizeStrategy,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzaXplLXN0cmF0ZWd5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvZXh0ZW5zaW9ucy9jb2x1bW4tcmVzaXplL3Jlc2l6ZS1zdHJhdGVneS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBdUIsU0FBUyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM3RixPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDM0MsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDNUQsT0FBTyxFQUFzQywwQkFBMEIsRUFBRSxNQUFNLG9CQUFvQixDQUFDOzs7O0FBSXBHOzs7R0FHRztBQUVILE1BQU0sT0FBZ0IsY0FBYztJQURwQztRQU1VLHdCQUFtQixHQUFrQixJQUFJLENBQUM7S0EyQ25EO0lBbkJDLHFFQUFxRTtJQUMzRCxnQ0FBZ0MsQ0FBQyxLQUFhO1FBQ3RELElBQUksSUFBSSxDQUFDLG1CQUFtQixLQUFLLElBQUksRUFBRSxDQUFDO1lBQ3RDLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQztZQUNoRSxNQUFNLFVBQVUsR0FBRyxlQUFlLENBQUMsWUFBWSxDQUFDLENBQUM7WUFFakQsSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFO2dCQUNoQyxZQUFZLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxtQkFBbUIsQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLG1CQUFvQixDQUFDLENBQUM7Z0JBRXZGLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUM7WUFDbEMsQ0FBQyxDQUFDLENBQUM7WUFFSCxJQUFJLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUU7Z0JBQ25DLElBQUksQ0FB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Uyx3QkFBd0IsQ0FBQyxRQUFnQjtJQUNoRCxPQUFPLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNoRCxDQUFDO0FBRUQsa0dBQWtHO0FBQ2xHLFNBQVMsZUFBZSxDQUFDLE9BQW9CO0lBQzNDLHFGQUFxRjtJQUNyRixxQ0FBcUM7SUFDckMsT0FBTyx3QkFBd0IsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLE9BQU8sQ0FBQyxXQUFXLENBQUM7QUFDOUUsQ0FBQztBQUVEOzs7R0FHRztBQUNILFNBQVMseUJBQXlCLENBQUMsU0FBNkI7SUFDOUQsT0FBTyxNQUFNLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxRCxDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sMkNBQTJDLEdBQWE7SUFDbkUsT0FBTyxFQUFFLGNBQWM7SUFDdkIsUUFBUSxFQUFFLDhCQUE4QjtDQUN6QyxDQUFDO0FBQ0YsTUFBTSxDQUFDLE1BQU0sNkJBQTZCLEdBQWE7SUFDckQsT0FBTyxFQUFFLGNBQWM7SUFDdkIsUUFBUSxFQUFFLDBCQUEwQjtDQUNyQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7IEluamVjdCwgSW5qZWN0YWJsZSwgT25EZXN0cm95LCBQcm92aWRlciwgQ1NQX05PTkNFLCBPcHRpb25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRE9DVU1FTlQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgY29lcmNlQ3NzUGl4ZWxWYWx1ZSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQgeyBDZGtUYWJsZSwgX0NvYWxlc2NlZFN0eWxlU2NoZWR1bGVyLCBfQ09BTEVTQ0VEX1NUWUxFX1NDSEVEVUxFUiB9IGZyb20gJ0Bhbmd1bGFyL2Nkay90YWJsZSc7XG5cbmltcG9ydCB7IENvbHVtblJlc2l6ZSB9IGZyb20gJy4vY29sdW1uLXJlc2l6ZSc7XG5cbi8qKlxuICogUHJvdmlkZXMgYW4gaW1wbGVtZW50YXRpb24gZm9yIHJlc2l6aW5nIGEgY29sdW1uLlxuICogVGhlIGRldGFpbHMgb2YgaG93IHJlc2l6aW5nIHdvcmtzIGZvciB0YWJsZXMgZm9yIGZsZXggbWF0LXRhYmxlcyBhcmUgcXVpdGUgZGlmZmVyZW50LlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgUmVzaXplU3RyYXRlZ3kge1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgcmVhZG9ubHkgY29sdW1uUmVzaXplOiBDb2x1bW5SZXNpemU7XG4gIHByb3RlY3RlZCBhYnN0cmFjdCByZWFkb25seSBzdHlsZVNjaGVkdWxlcjogX0NvYWxlc2NlZFN0eWxlU2NoZWR1bGVyO1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgcmVhZG9ubHkgdGFibGU6IENka1RhYmxlPHVua25vd24+O1xuXG4gIHByaXZhdGUgX3BlbmRpbmdSZXNpemVEZWx0YTogbnVtYmVyIHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqIFVwZGF0ZXMgdGhlIHdpZHRoIG9mIHRoZSBzcGVjaWZpZWQgY29sdW1uLiAqL1xuICBhYnN0cmFjdCBhcHBseUNvbHVtblNpemUoXG4gICAgY3NzRnJpZW5kbHlDb2x1bW5OYW1lOiBzdHJpbmcsXG4gICAgY29sdW1uSGVhZGVyOiBIVE1MRWxlbWVudCxcbiAgICBzaXplSW5QeDogbnVtYmVyLFxuICAgIHByZXZpb3VzU2l6ZUluUHg/OiBudW1iZXJcbiAgKTogdm9pZDtcblxuICAvKiogQXBwbGllcyBhIG1pbmltdW0gd2lkdGggdG8gdGhlIHNwZWNpZmllZCBjb2x1bW4sIHVwZGF0aW5nIGl0cyBjdXJyZW50IHdpZHRoIGFzIG5lZWRlZC4gKi9cbiAgYWJzdHJhY3QgYXBwbHlNaW5Db2x1bW5TaXplKFxuICAgIGNzc0ZyaWVuZGx5Q29sdW1uTmFtZTogc3RyaW5nLFxuICAgIGNvbHVtbkhlYWRlcjogSFRNTEVsZW1lbnQsXG4gICAgbWluU2l6ZUluUHg6IG51bWJlclxuICApOiB2b2lkO1xuXG4gIC8qKiBBcHBsaWVzIGEgbWF4aW11bSB3aWR0aCB0byB0aGUgc3BlY2lmaWVkIGNvbHVtbiwgdXBkYXRpbmcgaXRzIGN1cnJlbnQgd2lkdGggYXMgbmVlZGVkLiAqL1xuICBhYnN0cmFjdCBhcHBseU1heENvbHVtblNpemUoXG4gICAgY3NzRnJpZW5kbHlDb2x1bW5OYW1lOiBzdHJpbmcsXG4gICAgY29sdW1uSGVhZGVyOiBIVE1MRWxlbWVudCxcbiAgICBtaW5TaXplSW5QeDogbnVtYmVyXG4gICk6IHZvaWQ7XG5cbiAgLyoqIEFkanVzdHMgdGhlIHdpZHRoIG9mIHRoZSB0YWJsZSBlbGVtZW50IGJ5IHRoZSBzcGVjaWZpZWQgZGVsdGEuICovXG4gIHByb3RlY3RlZCB1cGRhdGVUYWJsZVdpZHRoQW5kU3RpY2t5Q29sdW1ucyhkZWx0YTogbnVtYmVyKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX3BlbmRpbmdSZXNpemVEZWx0YSA9PT0gbnVsbCkge1xuICAgICAgY29uc3QgdGFibGVFbGVtZW50ID0gdGhpcy5jb2x1bW5SZXNpemUuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICAgICAgY29uc3QgdGFibGVXaWR0aCA9IGdldEVsZW1lbnRXaWR0aCh0YWJsZUVsZW1lbnQpO1xuXG4gICAgICB0aGlzLnN0eWxlU2NoZWR1bGVyLnNjaGVkdWxlKCgpID0+IHtcbiAgICAgICAgdGFibGVFbGVtZW50LnN0eWxlLndpZHRoID0gY29lcmNlQ3NzUGl4ZWxWYWx1ZSh0YWJsZVdpZHRoICsgdGhpcy5fcGVuZGluZ1Jlc2l6ZURlbHRhISk7XG5cbiAgICAgICAgdGhpcy5fcGVuZGluZ1Jlc2l6ZURlbHRhID0gbnVsbDtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLnN0eWxlU2NoZWR1bGVyLnNjaGVkdWxlRW5kKCgpID0+IHtcbiAgICAgICAgdGhpcy50YWJsZS51cGRhdGVTdGlja3lDb2x1bW5TdHlsZXMoKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMuX3BlbmRpbmdSZXNpemVEZWx0YSA9ICh0aGlzLl9wZW5kaW5nUmVzaXplRGVsdGEgPz8gMCkgKyBkZWx0YTtcbiAgfVxufVxuXG4vKipcbiAqIFRoZSBvcHRpbWFsbHkgcGVyZm9ybWluZyByZXNpemUgc3RyYXRlZ3kgZm9yICZsdDt0YWJsZSZndDsgZWxlbWVudHMgd2l0aCB0YWJsZS1sYXlvdXQ6IGZpeGVkLlxuICogVGVzdGVkIGFnYWluc3QgYW5kIG91dHBlcmZvcm1lZDpcbiAqICAgQ1NTIHNlbGVjdG9yXG4gKiAgIENTUyBzZWxlY3RvciB3LyBDU1MgdmFyaWFibGVcbiAqICAgVXBkYXRpbmcgYWxsIGNlbGwgbm9kZXNcbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFRhYmxlTGF5b3V0Rml4ZWRSZXNpemVTdHJhdGVneSBleHRlbmRzIFJlc2l6ZVN0cmF0ZWd5IHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IGNvbHVtblJlc2l6ZTogQ29sdW1uUmVzaXplLFxuICAgIEBJbmplY3QoX0NPQUxFU0NFRF9TVFlMRV9TQ0hFRFVMRVIpXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IHN0eWxlU2NoZWR1bGVyOiBfQ29hbGVzY2VkU3R5bGVTY2hlZHVsZXIsXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IHRhYmxlOiBDZGtUYWJsZTx1bmtub3duPlxuICApIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgYXBwbHlDb2x1bW5TaXplKFxuICAgIF86IHN0cmluZyxcbiAgICBjb2x1bW5IZWFkZXI6IEhUTUxFbGVtZW50LFxuICAgIHNpemVJblB4OiBudW1iZXIsXG4gICAgcHJldmlvdXNTaXplSW5QeD86IG51bWJlclxuICApOiB2b2lkIHtcbiAgICBjb25zdCBkZWx0YSA9IHNpemVJblB4IC0gKHByZXZpb3VzU2l6ZUluUHggPz8gZ2V0RWxlbWVudFdpZHRoKGNvbHVtbkhlYWRlcikpO1xuXG4gICAgaWYgKGRlbHRhID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5zdHlsZVNjaGVkdWxlci5zY2hlZHVsZSgoKSA9PiB7XG4gICAgICBjb2x1bW5IZWFkZXIuc3R5bGUud2lkdGggPSBjb2VyY2VDc3NQaXhlbFZhbHVlKHNpemVJblB4KTtcbiAgICB9KTtcblxuICAgIHRoaXMudXBkYXRlVGFibGVXaWR0aEFuZFN0aWNreUNvbHVtbnMoZGVsdGEpO1xuICB9XG5cbiAgYXBwbHlNaW5Db2x1bW5TaXplKF86IHN0cmluZywgY29sdW1uSGVhZGVyOiBIVE1MRWxlbWVudCwgc2l6ZUluUHg6IG51bWJlcik6IHZvaWQge1xuICAgIGNvbnN0IGN1cnJlbnRXaWR0aCA9IGdldEVsZW1lbnRXaWR0aChjb2x1bW5IZWFkZXIpO1xuICAgIGNvbnN0IG5ld1dpZHRoID0gTWF0aC5tYXgoY3VycmVudFdpZHRoLCBzaXplSW5QeCk7XG5cbiAgICB0aGlzLmFwcGx5Q29sdW1uU2l6ZShfLCBjb2x1bW5IZWFkZXIsIG5ld1dpZHRoLCBjdXJyZW50V2lkdGgpO1xuICB9XG5cbiAgYXBwbHlNYXhDb2x1bW5TaXplKF86IHN0cmluZywgY29sdW1uSGVhZGVyOiBIVE1MRWxlbWVudCwgc2l6ZUluUHg6IG51bWJlcik6IHZvaWQge1xuICAgIGNvbnN0IGN1cnJlbnRXaWR0aCA9IGdldEVsZW1lbnRXaWR0aChjb2x1bW5IZWFkZXIpO1xuICAgIGNvbnN0IG5ld1dpZHRoID0gTWF0aC5taW4oY3VycmVudFdpZHRoLCBzaXplSW5QeCk7XG5cbiAgICB0aGlzLmFwcGx5Q29sdW1uU2l6ZShfLCBjb2x1bW5IZWFkZXIsIG5ld1dpZHRoLCBjdXJyZW50V2lkdGgpO1xuICB9XG59XG5cbi8qKlxuICogVGhlIG9wdGltYWxseSBwZXJmb3JtaW5nIHJlc2l6ZSBzdHJhdGVneSBmb3IgZmxleCBtYXQtdGFibGVzLlxuICogVGVzdGVkIGFnYWluc3QgYW5kIG91dHBlcmZvcm1lZDpcbiAqICAgQ1NTIHNlbGVjdG9yIHcvIENTUyB2YXJpYWJsZVxuICogICBVcGRhdGluZyBhbGwgbWF0LWNlbGwgbm9kZXNcbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIENka0ZsZXhUYWJsZVJlc2l6ZVN0cmF0ZWd5IGV4dGVuZHMgUmVzaXplU3RyYXRlZ3kgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICBwcml2YXRlIHJlYWRvbmx5IF9kb2N1bWVudDogRG9jdW1lbnQ7XG4gIHByaXZhdGUgcmVhZG9ubHkgX2NvbHVtbkluZGV4ZXMgPSBuZXcgTWFwPHN0cmluZywgbnVtYmVyPigpO1xuICBwcml2YXRlIHJlYWRvbmx5IF9jb2x1bW5Qcm9wZXJ0aWVzID0gbmV3IE1hcDxzdHJpbmcsIE1hcDxzdHJpbmcsIHN0cmluZz4+KCk7XG5cbiAgcHJpdmF0ZSBfc3R5bGVFbGVtZW50PzogSFRNTFN0eWxlRWxlbWVudDtcbiAgcHJpdmF0ZSBfaW5kZXhTZXF1ZW5jZSA9IDA7XG5cbiAgcHJvdGVjdGVkIHJlYWRvbmx5IGRlZmF1bHRNaW5TaXplID0gMDtcbiAgcHJvdGVjdGVkIHJlYWRvbmx5IGRlZmF1bHRNYXhTaXplID0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IGNvbHVtblJlc2l6ZTogQ29sdW1uUmVzaXplLFxuICAgIEBJbmplY3QoX0NPQUxFU0NFRF9TVFlMRV9TQ0hFRFVMRVIpXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IHN0eWxlU2NoZWR1bGVyOiBfQ29hbGVzY2VkU3R5bGVTY2hlZHVsZXIsXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IHRhYmxlOiBDZGtUYWJsZTx1bmtub3duPixcbiAgICBASW5qZWN0KERPQ1VNRU5UKSBkb2N1bWVudDogYW55LFxuICAgIEBJbmplY3QoQ1NQX05PTkNFKSBAT3B0aW9uYWwoKSBwcml2YXRlIHJlYWRvbmx5IF9ub25jZT86IHN0cmluZyB8IG51bGxcbiAgKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl9kb2N1bWVudCA9IGRvY3VtZW50O1xuICB9XG5cbiAgYXBwbHlDb2x1bW5TaXplKFxuICAgIGNzc0ZyaWVuZGx5Q29sdW1uTmFtZTogc3RyaW5nLFxuICAgIGNvbHVtbkhlYWRlcjogSFRNTEVsZW1lbnQsXG4gICAgc2l6ZUluUHg6IG51bWJlcixcbiAgICBwcmV2aW91c1NpemVJblB4PzogbnVtYmVyXG4gICk6IHZvaWQge1xuICAgIC8vIE9wdGltaXphdGlvbjogQ2hlY2sgYXBwbGllZCB3aWR0aCBmaXJzdCBhcyB3ZSBwcm9iYWJseSBzZXQgaXQgYWxyZWFkeSBiZWZvcmUgcmVhZGluZ1xuICAgIC8vIG9mZnNldFdpZHRoIHdoaWNoIHRyaWdnZXJzIGxheW91dC5cbiAgICBjb25zdCBkZWx0YSA9XG4gICAgICBzaXplSW5QeCAtXG4gICAgICAocHJldmlvdXNTaXplSW5QeCA/P1xuICAgICAgICAodGhpcy5fZ2V0QXBwbGllZFdpZHRoKGNzc0ZyaWVuZGx5Q29sdW1uTmFtZSkgfHwgY29sdW1uSGVhZGVyLm9mZnNldFdpZHRoKSk7XG5cbiAgICBpZiAoZGVsdGEgPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBjc3NTaXplID0gY29lcmNlQ3NzUGl4ZWxWYWx1ZShzaXplSW5QeCk7XG5cbiAgICB0aGlzLl9hcHBseVByb3BlcnR5KGNzc0ZyaWVuZGx5Q29sdW1uTmFtZSwgJ2ZsZXgnLCBgMCAwLjAxICR7Y3NzU2l6ZX1gKTtcbiAgICB0aGlzLnVwZGF0ZVRhYmxlV2lkdGhBbmRTdGlja3lDb2x1bW5zKGRlbHRhKTtcbiAgfVxuXG4gIGFwcGx5TWluQ29sdW1uU2l6ZShjc3NGcmllbmRseUNvbHVtbk5hbWU6IHN0cmluZywgXzogSFRNTEVsZW1lbnQsIHNpemVJblB4OiBudW1iZXIpOiB2b2lkIHtcbiAgICBjb25zdCBjc3NTaXplID0gY29lcmNlQ3NzUGl4ZWxWYWx1ZShzaXplSW5QeCk7XG5cbiAgICB0aGlzLl9hcHBseVByb3BlcnR5KFxuICAgICAgY3NzRnJpZW5kbHlDb2x1bW5OYW1lLFxuICAgICAgJ21pbi13aWR0aCcsXG4gICAgICBjc3NTaXplLFxuICAgICAgc2l6ZUluUHggIT09IHRoaXMuZGVmYXVsdE1pblNpemVcbiAgICApO1xuICAgIHRoaXMudXBkYXRlVGFibGVXaWR0aEFuZFN0aWNreUNvbHVtbnMoMCk7XG4gIH1cblxuICBhcHBseU1heENvbHVtblNpemUoY3NzRnJpZW5kbHlDb2x1bW5OYW1lOiBzdHJpbmcsIF86IEhUTUxFbGVtZW50LCBzaXplSW5QeDogbnVtYmVyKTogdm9pZCB7XG4gICAgY29uc3QgY3NzU2l6ZSA9IGNvZXJjZUNzc1BpeGVsVmFsdWUoc2l6ZUluUHgpO1xuXG4gICAgdGhpcy5fYXBwbHlQcm9wZXJ0eShcbiAgICAgIGNzc0ZyaWVuZGx5Q29sdW1uTmFtZSxcbiAgICAgICdtYXgtd2lkdGgnLFxuICAgICAgY3NzU2l6ZSxcbiAgICAgIHNpemVJblB4ICE9PSB0aGlzLmRlZmF1bHRNYXhTaXplXG4gICAgKTtcbiAgICB0aGlzLnVwZGF0ZVRhYmxlV2lkdGhBbmRTdGlja3lDb2x1bW5zKDApO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldENvbHVtbkNzc0NsYXNzKGNzc0ZyaWVuZGx5Q29sdW1uTmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gYGNkay1jb2x1bW4tJHtjc3NGcmllbmRseUNvbHVtbk5hbWV9YDtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuX3N0eWxlRWxlbWVudD8ucmVtb3ZlKCk7XG4gICAgdGhpcy5fc3R5bGVFbGVtZW50ID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0UHJvcGVydHlWYWx1ZShjc3NGcmllbmRseUNvbHVtbk5hbWU6IHN0cmluZywga2V5OiBzdHJpbmcpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgIGNvbnN0IHByb3BlcnRpZXMgPSB0aGlzLl9nZXRDb2x1bW5Qcm9wZXJ0aWVzTWFwKGNzc0ZyaWVuZGx5Q29sdW1uTmFtZSk7XG4gICAgcmV0dXJuIHByb3BlcnRpZXMuZ2V0KGtleSk7XG4gIH1cblxuICBwcml2YXRlIF9nZXRBcHBsaWVkV2lkdGgoY3NzRnJpZW5kc2x5Q29sdW1uTmFtZTogc3RyaW5nKTogbnVtYmVyIHtcbiAgICByZXR1cm4gY29lcmNlUGl4ZWxzRnJvbUZsZXhWYWx1ZSh0aGlzLl9nZXRQcm9wZXJ0eVZhbHVlKGNzc0ZyaWVuZHNseUNvbHVtbk5hbWUsICdmbGV4JykpO1xuICB9XG5cbiAgcHJpdmF0ZSBfYXBwbHlQcm9wZXJ0eShcbiAgICBjc3NGcmllbmRseUNvbHVtbk5hbWU6IHN0cmluZyxcbiAgICBrZXk6IHN0cmluZyxcbiAgICB2YWx1ZTogc3RyaW5nLFxuICAgIGVuYWJsZSA9IHRydWVcbiAgKTogdm9pZCB7XG4gICAgY29uc3QgcHJvcGVydGllcyA9IHRoaXMuX2dldENvbHVtblByb3BlcnRpZXNNYXAoY3NzRnJpZW5kbHlDb2x1bW5OYW1lKTtcblxuICAgIHRoaXMuc3R5bGVTY2hlZHVsZXIuc2NoZWR1bGUoKCkgPT4ge1xuICAgICAgaWYgKGVuYWJsZSkge1xuICAgICAgICBwcm9wZXJ0aWVzLnNldChrZXksIHZhbHVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHByb3BlcnRpZXMuZGVsZXRlKGtleSk7XG4gICAgICB9XG4gICAgICB0aGlzLl9hcHBseVNpemVDc3MoY3NzRnJpZW5kbHlDb2x1bW5OYW1lKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX2dldFN0eWxlU2hlZXQoKTogQ1NTU3R5bGVTaGVldCB7XG4gICAgaWYgKCF0aGlzLl9zdHlsZUVsZW1lbnQpIHtcbiAgICAgIHRoaXMuX3N0eWxlRWxlbWVudCA9IHRoaXMuX2RvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG5cbiAgICAgIGlmICh0aGlzLl9ub25jZSkge1xuICAgICAgICB0aGlzLl9zdHlsZUVsZW1lbnQubm9uY2UgPSB0aGlzLl9ub25jZTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fc3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuX2RvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKSk7XG4gICAgICB0aGlzLl9kb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHRoaXMuX3N0eWxlRWxlbWVudCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3N0eWxlRWxlbWVudC5zaGVldCBhcyBDU1NTdHlsZVNoZWV0O1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0Q29sdW1uUHJvcGVydGllc01hcChjc3NGcmllbmRseUNvbHVtbk5hbWU6IHN0cmluZyk6IE1hcDxzdHJpbmcsIHN0cmluZz4ge1xuICAgIGxldCBwcm9wZXJ0aWVzID0gdGhpcy5fY29sdW1uUHJvcGVydGllcy5nZXQoY3NzRnJpZW5kbHlDb2x1bW5OYW1lKTtcbiAgICBpZiAocHJvcGVydGllcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBwcm9wZXJ0aWVzID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTtcbiAgICAgIHRoaXMuX2NvbHVtblByb3BlcnRpZXMuc2V0KGNzc0ZyaWVuZGx5Q29sdW1uTmFtZSwgcHJvcGVydGllcyk7XG4gICAgfVxuICAgIHJldHVybiBwcm9wZXJ0aWVzO1xuICB9XG5cbiAgcHJpdmF0ZSBfYXBwbHlTaXplQ3NzKGNzc0ZyaWVuZGx5Q29sdW1uTmFtZTogc3RyaW5nKSB7XG4gICAgY29uc3QgcHJvcGVydGllcyA9IHRoaXMuX2dldENvbHVtblByb3BlcnRpZXNNYXAoY3NzRnJpZW5kbHlDb2x1bW5OYW1lKTtcbiAgICBjb25zdCBwcm9wZXJ0eUtleXMgPSBBcnJheS5mcm9tKHByb3BlcnRpZXMua2V5cygpKTtcblxuICAgIGxldCBpbmRleCA9IHRoaXMuX2NvbHVtbkluZGV4ZXMuZ2V0KGNzc0ZyaWVuZGx5Q29sdW1uTmFtZSk7XG4gICAgaWYgKGluZGV4ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmICghcHJvcGVydHlLZXlzLmxlbmd0aCkge1xuICAgICAgICAvLyBOb3RoaW5nIHRvIHNldCBvciB1bnNldC5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpbmRleCA9IHRoaXMuX2luZGV4U2VxdWVuY2UrKztcbiAgICAgIHRoaXMuX2NvbHVtbkluZGV4ZXMuc2V0KGNzc0ZyaWVuZGx5Q29sdW1uTmFtZSwgaW5kZXgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9nZXRTdHlsZVNoZWV0KCkuZGVsZXRlUnVsZShpbmRleCk7XG4gICAgfVxuXG4gICAgY29uc3QgY29sdW1uQ2xhc3NOYW1lID0gdGhpcy5nZXRDb2x1bW5Dc3NDbGFzcyhjc3NGcmllbmRseUNvbHVtbk5hbWUpO1xuICAgIGNvbnN0IHRhYmxlQ2xhc3NOYW1lID0gdGhpcy5jb2x1bW5SZXNpemUuZ2V0VW5pcXVlQ3NzQ2xhc3MoKTtcblxuICAgIGNvbnN0IHNlbGVjdG9yID0gYC4ke3RhYmxlQ2xhc3NOYW1lfSAuJHtjb2x1bW5DbGFzc05hbWV9YDtcbiAgICBjb25zdCBib2R5ID0gcHJvcGVydHlLZXlzLm1hcChrZXkgPT4gYCR7a2V5fToke3Byb3BlcnRpZXMuZ2V0KGtleSl9YCkuam9pbignOycpO1xuXG4gICAgdGhpcy5fZ2V0U3R5bGVTaGVldCgpLmluc2VydFJ1bGUoYCR7c2VsZWN0b3J9IHske2JvZHl9fWAsIGluZGV4KTtcbiAgfVxufVxuXG4vKiogQ29udmVydHMgQ1NTIHBpeGVsIHZhbHVlcyB0byBudW1iZXJzLCBlZyBcIjEyM3B4XCIgdG8gMTIzLiBSZXR1cm5zIE5hTiBmb3Igbm9uIHBpeGVsIHZhbHVlcy4gKi9cbmZ1bmN0aW9uIGNvZXJjZVBpeGVsc0Zyb21Dc3NWYWx1ZShjc3NWYWx1ZTogc3RyaW5nKTogbnVtYmVyIHtcbiAgcmV0dXJuIE51bWJlcihjc3NWYWx1ZS5tYXRjaCgvKFxcZCspcHgvKT8uWzFdKTtcbn1cblxuLyoqIEdldHMgdGhlIHN0eWxlLndpZHRoIHBpeGVscyBvbiB0aGUgc3BlY2lmaWVkIGVsZW1lbnQgaWYgcHJlc2VudCwgb3RoZXJ3aXNlIGl0cyBvZmZzZXRXaWR0aC4gKi9cbmZ1bmN0aW9uIGdldEVsZW1lbnRXaWR0aChlbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICAvLyBPcHRpbWl6YXRpb246IENoZWNrIHN0eWxlLndpZHRoIGZpcnN0IGFzIHdlIHByb2JhYmx5IHNldCBpdCBhbHJlYWR5IGJlZm9yZSByZWFkaW5nXG4gIC8vIG9mZnNldFdpZHRoIHdoaWNoIHRyaWdnZXJzIGxheW91dC5cbiAgcmV0dXJuIGNvZXJjZVBpeGVsc0Zyb21Dc3NWYWx1ZShlbGVtZW50LnN0eWxlLndpZHRoKSB8fCBlbGVtZW50Lm9mZnNldFdpZHRoO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIENTUyBmbGV4IHZhbHVlcyBhcyBzZXQgaW4gQ2RrRmxleFRhYmxlUmVzaXplU3RyYXRlZ3kgdG8gbnVtYmVycyxcbiAqIGVnIFwiMCAwLjAxIDEyM3B4XCIgdG8gMTIzLlxuICovXG5mdW5jdGlvbiBjb2VyY2VQaXhlbHNGcm9tRmxleFZhbHVlKGZsZXhWYWx1ZTogc3RyaW5nIHwgdW5kZWZpbmVkKTogbnVtYmVyIHtcbiAgcmV0dXJuIE51bWJlcihmbGV4VmFsdWU/Lm1hdGNoKC8wIDBcXC4wMSAoXFxkKylweC8pPy5bMV0pO1xufVxuXG5leHBvcnQgY29uc3QgVEFCTEVfTEFZT1VUX0ZJWEVEX1JFU0laRV9TVFJBVEVHWV9QUk9WSURFUjogUHJvdmlkZXIgPSB7XG4gIHByb3ZpZGU6IFJlc2l6ZVN0cmF0ZWd5LFxuICB1c2VDbGFzczogVGFibGVMYXlvdXRGaXhlZFJlc2l6ZVN0cmF0ZWd5LFxufTtcbmV4cG9ydCBjb25zdCBGTEVYX1JFU0laRV9TVFJBVEVHWV9QUk9WSURFUjogUHJvdmlkZXIgPSB7XG4gIHByb3ZpZGU6IFJlc2l6ZVN0cmF0ZWd5LFxuICB1c2VDbGFzczogQ2RrRmxleFRhYmxlUmVzaXplU3RyYXRlZ3ksXG59O1xuIl19