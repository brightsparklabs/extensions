import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class MtxGridUtils {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC11dGlscy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2V4dGVuc2lvbnMvZ3JpZC9ncmlkLXV0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7O0FBSTNDLE1BQU0sT0FBTyxZQUFZO0lBQ3ZCLGdCQUFlLENBQUM7SUFFaEI7Ozs7O09BS0c7SUFDSCxZQUFZLENBQUMsT0FBNEIsRUFBRSxNQUFxQjtRQUM5RCxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQzNELElBQUksR0FBRyxHQUFRLEVBQUUsQ0FBQztRQUNsQixNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBVyxFQUFFLENBQVMsRUFBRSxFQUFFO1lBQ3hDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO2dCQUNaLEdBQUcsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDckIsQ0FBQztpQkFBTSxDQUFDO2dCQUNOLEdBQUcsR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3hCLENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUNILE9BQU8sR0FBRyxDQUFDO0lBQ2IsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsVUFBVSxDQUFDLElBQVcsRUFBRSxNQUFxQjtRQUMzQyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ2pFLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsT0FBTyxDQUFDLEtBQVU7UUFDaEIsT0FBTyxLQUFLLElBQUksSUFBSSxJQUFJLEtBQUssQ0FBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLENBQUM7SUFDbEQsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxhQUFhLENBQUMsS0FBYTtRQUN6QixPQUFPLG9CQUFvQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMxQyxDQUFDO2lJQWhEVSxZQUFZO3FJQUFaLFlBQVksY0FEQyxNQUFNOzsyRkFDbkIsWUFBWTtrQkFEeEIsVUFBVTttQkFBQyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBNdHhHcmlkQ29sdW1uIH0gZnJvbSAnLi9pbnRlcmZhY2VzJztcblxuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiAncm9vdCcgfSlcbmV4cG9ydCBjbGFzcyBNdHhHcmlkVXRpbHMge1xuICBjb25zdHJ1Y3RvcigpIHt9XG5cbiAgLyoqXG4gICAqIEdldCBjZWxsJ3MgdmFsdWUgYmFzZWQgb24gdGhlIGRhdGEgYW5kIGNvbHVtbidzIGZpZWxkIChlLmcuIGBhLmIuY2ApXG4gICAqIEBwYXJhbSByb3dEYXRhIFJvdyBkYXRhXG4gICAqIEBwYXJhbSBjb2xEZWYgQ29sdW1uIGRlZmluaXRpb25cbiAgICogQHJldHVybnNcbiAgICovXG4gIGdldENlbGxWYWx1ZShyb3dEYXRhOiBSZWNvcmQ8c3RyaW5nLCBhbnk+LCBjb2xEZWY6IE10eEdyaWRDb2x1bW4pOiBzdHJpbmcge1xuICAgIGNvbnN0IGtleUFyciA9IGNvbERlZi5maWVsZCA/IGNvbERlZi5maWVsZC5zcGxpdCgnLicpIDogW107XG4gICAgbGV0IHRtcDogYW55ID0gJyc7XG4gICAga2V5QXJyLmZvckVhY2goKGtleTogc3RyaW5nLCBpOiBudW1iZXIpID0+IHtcbiAgICAgIGlmIChpID09PSAwKSB7XG4gICAgICAgIHRtcCA9IHJvd0RhdGFba2V5XTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRtcCA9IHRtcCAmJiB0bXBba2V5XTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gdG1wO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhbGwgZGF0YSBvZiBhIGNvbFxuICAgKiBAcGFyYW0gZGF0YSBBbGwgZGF0YVxuICAgKiBAcGFyYW0gY29sRGVmIENvbHVtbiBkZWZpbml0aW9uXG4gICAqIEByZXR1cm5zXG4gICAqL1xuICBnZXRDb2xEYXRhKGRhdGE6IGFueVtdLCBjb2xEZWY6IE10eEdyaWRDb2x1bW4pOiBhbnlbXSB7XG4gICAgcmV0dXJuIGRhdGEubWFwKHJvd0RhdGEgPT4gdGhpcy5nZXRDZWxsVmFsdWUocm93RGF0YSwgY29sRGVmKSk7XG4gIH1cblxuICAvKipcbiAgICogV2hldGhlciB0aGUgdmFsdWUgaXMgZW1wdHkgKGBudWxsYCwgYHVuZGVmaW5lZGAsIGAnJ2AsIGBbXWApXG4gICAqIEBwYXJhbSB2YWx1ZVxuICAgKiBAcmV0dXJuc1xuICAgKi9cbiAgaXNFbXB0eSh2YWx1ZTogYW55KSB7XG4gICAgcmV0dXJuIHZhbHVlID09IG51bGwgfHwgdmFsdWUudG9TdHJpbmcoKSA9PT0gJyc7XG4gIH1cblxuICAvKipcbiAgICogV2hldGhlciB0aGUgdmFsdWUgY29udGFpbiBIVE1MXG4gICAqIEBwYXJhbSB2YWx1ZVxuICAgKiBAcmV0dXJuc1xuICAgKi9cbiAgaXNDb250YWluSFRNTCh2YWx1ZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIC88XFwvP1thLXpdW1xcc1xcU10qPi9pLnRlc3QodmFsdWUpO1xuICB9XG59XG4iXX0=