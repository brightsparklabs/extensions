import { Directive, EventEmitter, HostBinding, HostListener, Input, Output, } from '@angular/core';
import * as i0 from "@angular/core";
export class MtxGridExpansionToggle {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwYW5zaW9uLXRvZ2dsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2V4dGVuc2lvbnMvZ3JpZC9leHBhbnNpb24tdG9nZ2xlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsWUFBWSxFQUNaLFdBQVcsRUFDWCxZQUFZLEVBQ1osS0FBSyxFQUNMLE1BQU0sR0FFUCxNQUFNLGVBQWUsQ0FBQzs7QUFNdkIsTUFBTSxPQUFPLHNCQUFzQjtJQUtqQyxJQUNJLE1BQU07UUFDUixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7SUFDdEIsQ0FBQztJQUNELElBQUksTUFBTSxDQUFDLFFBQWlCO1FBQzFCLElBQUksQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFHRCxJQUNJLFFBQVE7UUFDVixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7SUFDdEIsQ0FBQztJQUVELElBQ0ksYUFBYSxDQUFDLEtBQVU7UUFDMUIsSUFBSSxLQUFLLEtBQUssSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ3hCLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDO1FBQ3BCLENBQUM7SUFDSCxDQUFDO0lBRUQsSUFDSSxRQUFRLENBQUMsS0FBdUI7UUFDbEMsSUFBSSxLQUFLLEtBQUssSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQzNCLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLENBQUM7SUFDSCxDQUFDO0lBSUQ7UUFuQ1EsWUFBTyxHQUFHLEtBQUssQ0FBQztRQVlkLGlCQUFZLEdBQUcsSUFBSSxZQUFZLEVBQVcsQ0FBQztRQXFCM0MsaUJBQVksR0FBRyxJQUFJLFlBQVksRUFBMEIsQ0FBQztJQUVyRCxDQUFDO0lBR2hCLE9BQU8sQ0FBQyxLQUFpQjtRQUN2QixLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDdkIsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNoQixDQUFDO0lBRUQsTUFBTTtRQUNKLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQzNCLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQy9CLENBQUM7aUlBaERVLHNCQUFzQjtxSEFBdEIsc0JBQXNCOzsyRkFBdEIsc0JBQXNCO2tCQUpsQyxTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSw2QkFBNkI7b0JBQ3ZDLFVBQVUsRUFBRSxJQUFJO2lCQUNqQjt3REFPSyxNQUFNO3NCQURULEtBQUs7Z0JBUUksWUFBWTtzQkFBckIsTUFBTTtnQkFHSCxRQUFRO3NCQURYLFdBQVc7dUJBQUMsZ0JBQWdCO2dCQU16QixhQUFhO3NCQURoQixLQUFLO2dCQVFGLFFBQVE7c0JBRFgsS0FBSzt1QkFBQyxpQkFBaUI7Z0JBT2QsWUFBWTtzQkFBckIsTUFBTTtnQkFLUCxPQUFPO3NCQUROLFlBQVk7dUJBQUMsT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBFdmVudEVtaXR0ZXIsXG4gIEhvc3RCaW5kaW5nLFxuICBIb3N0TGlzdGVuZXIsXG4gIElucHV0LFxuICBPdXRwdXQsXG4gIFRlbXBsYXRlUmVmLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW210eC1ncmlkLWV4cGFuc2lvbi10b2dnbGVdJyxcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbn0pXG5leHBvcnQgY2xhc3MgTXR4R3JpZEV4cGFuc2lvblRvZ2dsZSB7XG4gIHByaXZhdGUgX29wZW5lZCA9IGZhbHNlO1xuICBwcml2YXRlIF9yb3c6IGFueTtcbiAgcHJpdmF0ZSBfdHBsUmVmITogVGVtcGxhdGVSZWY8YW55PjtcblxuICBASW5wdXQoKVxuICBnZXQgb3BlbmVkKCkge1xuICAgIHJldHVybiB0aGlzLl9vcGVuZWQ7XG4gIH1cbiAgc2V0IG9wZW5lZChuZXdWYWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX29wZW5lZCA9IG5ld1ZhbHVlO1xuICAgIHRoaXMub3BlbmVkQ2hhbmdlLmVtaXQobmV3VmFsdWUpO1xuICB9XG4gIEBPdXRwdXQoKSBvcGVuZWRDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KCk7XG5cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5leHBhbmRlZCcpXG4gIGdldCBleHBhbmRlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fb3BlbmVkO1xuICB9XG5cbiAgQElucHV0KClcbiAgc2V0IGV4cGFuZGFibGVSb3codmFsdWU6IGFueSkge1xuICAgIGlmICh2YWx1ZSAhPT0gdGhpcy5fcm93KSB7XG4gICAgICB0aGlzLl9yb3cgPSB2YWx1ZTtcbiAgICB9XG4gIH1cblxuICBASW5wdXQoJ2V4cGFuc2lvblJvd1RwbCcpXG4gIHNldCB0ZW1wbGF0ZSh2YWx1ZTogVGVtcGxhdGVSZWY8YW55Pikge1xuICAgIGlmICh2YWx1ZSAhPT0gdGhpcy5fdHBsUmVmKSB7XG4gICAgICB0aGlzLl90cGxSZWYgPSB2YWx1ZTtcbiAgICB9XG4gIH1cblxuICBAT3V0cHV0KCkgdG9nZ2xlQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxNdHhHcmlkRXhwYW5zaW9uVG9nZ2xlPigpO1xuXG4gIGNvbnN0cnVjdG9yKCkge31cblxuICBASG9zdExpc3RlbmVyKCdjbGljaycsIFsnJGV2ZW50J10pXG4gIG9uQ2xpY2soZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIHRoaXMudG9nZ2xlKCk7XG4gIH1cblxuICB0b2dnbGUoKTogdm9pZCB7XG4gICAgdGhpcy5vcGVuZWQgPSAhdGhpcy5vcGVuZWQ7XG4gICAgdGhpcy50b2dnbGVDaGFuZ2UuZW1pdCh0aGlzKTtcbiAgfVxufVxuIl19