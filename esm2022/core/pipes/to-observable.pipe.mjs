import { Pipe } from '@angular/core';
import { of, isObservable } from 'rxjs';
import * as i0 from "@angular/core";
export class MtxToObservablePipe {
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    transform(value) {
        return isObservable(value) ? value : of(value);
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxToObservablePipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    /** @nocollapse */ static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "18.0.1", ngImport: i0, type: MtxToObservablePipe, isStandalone: true, name: "toObservable" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxToObservablePipe, decorators: [{
            type: Pipe,
            args: [{ name: 'toObservable', standalone: true }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG8tb2JzZXJ2YWJsZS5waXBlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvZXh0ZW5zaW9ucy9jb3JlL3BpcGVzL3RvLW9ic2VydmFibGUucGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsSUFBSSxFQUFpQixNQUFNLGVBQWUsQ0FBQztBQUNwRCxPQUFPLEVBQWMsRUFBRSxFQUFFLFlBQVksRUFBRSxNQUFNLE1BQU0sQ0FBQzs7QUFHcEQsTUFBTSxPQUFPLG1CQUFtQjtJQUM5Qiw2RUFBNkU7SUFDN0UsU0FBUyxDQUFDLEtBQWdDO1FBQ3hDLE9BQU8sWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNqRCxDQUFDO2lJQUpVLG1CQUFtQjsrSEFBbkIsbUJBQW1COzsyRkFBbkIsbUJBQW1CO2tCQUQvQixJQUFJO21CQUFDLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGlwZSwgUGlwZVRyYW5zZm9ybSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgb2YsIGlzT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuXG5AUGlwZSh7IG5hbWU6ICd0b09ic2VydmFibGUnLCBzdGFuZGFsb25lOiB0cnVlIH0pXG5leHBvcnQgY2xhc3MgTXR4VG9PYnNlcnZhYmxlUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXJlZHVuZGFudC10eXBlLWNvbnN0aXR1ZW50c1xuICB0cmFuc2Zvcm0odmFsdWU6IE9ic2VydmFibGU8YW55PiB8IHVua25vd24pOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIHJldHVybiBpc09ic2VydmFibGUodmFsdWUpID8gdmFsdWUgOiBvZih2YWx1ZSk7XG4gIH1cbn1cbiJdfQ==