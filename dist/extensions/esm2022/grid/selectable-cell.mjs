import { Directive, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';
import * as i0 from "@angular/core";
export class MtxGridSelectableCell {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0YWJsZS1jZWxsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvZXh0ZW5zaW9ucy9ncmlkL3NlbGVjdGFibGUtY2VsbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7O0FBTWxHLE1BQU0sT0FBTyxxQkFBcUI7SUFKbEM7UUFLRSxtQkFBYyxHQUFHLEtBQUssQ0FBQztRQUN2QixvQkFBZSxHQUFHLEtBQUssQ0FBQztRQU1oQixjQUFTLEdBQUcsS0FBSyxDQUFDO1FBRWpCLG1CQUFjLEdBQUcsSUFBSSxDQUFDO1FBRXJCLHVCQUFrQixHQUFHLElBQUksWUFBWSxFQUF5QixDQUFDO0tBMEIxRTtJQWxDQyxJQUNJLFFBQVE7UUFDVixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7SUFDeEIsQ0FBQztJQVFELE9BQU8sQ0FBQyxLQUFpQjtRQUN2QixJQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7UUFDcEMsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDO1FBRXRDLElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ3hCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNoQixDQUFDO0lBQ0gsQ0FBQztJQUVELE1BQU07UUFDSixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztRQUN0QixJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFFRCxRQUFRO1FBQ04sSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7UUFDdkIsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBRUQsTUFBTTtRQUNKLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDckMsQ0FBQztpSUFyQ1UscUJBQXFCO3FIQUFyQixxQkFBcUI7OzJGQUFyQixxQkFBcUI7a0JBSmpDLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLDRCQUE0QjtvQkFDdEMsVUFBVSxFQUFFLElBQUk7aUJBQ2pCOzhCQU1LLFFBQVE7c0JBRFgsV0FBVzt1QkFBQyxnQkFBZ0I7Z0JBTXBCLGNBQWM7c0JBQXRCLEtBQUs7Z0JBRUksa0JBQWtCO3NCQUEzQixNQUFNO2dCQUdQLE9BQU87c0JBRE4sWUFBWTt1QkFBQyxPQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIEV2ZW50RW1pdHRlciwgSG9zdEJpbmRpbmcsIEhvc3RMaXN0ZW5lciwgSW5wdXQsIE91dHB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbXR4LWdyaWQtc2VsZWN0YWJsZS1jZWxsXScsXG4gIHN0YW5kYWxvbmU6IHRydWUsXG59KVxuZXhwb3J0IGNsYXNzIE10eEdyaWRTZWxlY3RhYmxlQ2VsbCB7XG4gIGN0cmxLZXlQcmVzc2VkID0gZmFsc2U7XG4gIHNoaWZ0S2V5UHJlc3NlZCA9IGZhbHNlO1xuXG4gIEBIb3N0QmluZGluZygnY2xhc3Muc2VsZWN0ZWQnKVxuICBnZXQgc2VsZWN0ZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NlbGVjdGVkO1xuICB9XG4gIHByaXZhdGUgX3NlbGVjdGVkID0gZmFsc2U7XG5cbiAgQElucHV0KCkgY2VsbFNlbGVjdGFibGUgPSB0cnVlO1xuXG4gIEBPdXRwdXQoKSBjZWxsU2VsZWN0ZWRDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPE10eEdyaWRTZWxlY3RhYmxlQ2VsbD4oKTtcblxuICBASG9zdExpc3RlbmVyKCdjbGljaycsIFsnJGV2ZW50J10pXG4gIG9uQ2xpY2soZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICB0aGlzLmN0cmxLZXlQcmVzc2VkID0gZXZlbnQuY3RybEtleTtcbiAgICB0aGlzLnNoaWZ0S2V5UHJlc3NlZCA9IGV2ZW50LnNoaWZ0S2V5O1xuXG4gICAgaWYgKHRoaXMuY2VsbFNlbGVjdGFibGUpIHtcbiAgICAgIHRoaXMuc2VsZWN0KCk7XG4gICAgfVxuICB9XG5cbiAgc2VsZWN0KCk6IHZvaWQge1xuICAgIHRoaXMuX3NlbGVjdGVkID0gdHJ1ZTtcbiAgICB0aGlzLmNlbGxTZWxlY3RlZENoYW5nZS5lbWl0KHRoaXMpO1xuICB9XG5cbiAgZGVzZWxlY3QoKTogdm9pZCB7XG4gICAgdGhpcy5fc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICB0aGlzLmNlbGxTZWxlY3RlZENoYW5nZS5lbWl0KHRoaXMpO1xuICB9XG5cbiAgdG9nZ2xlKCk6IHZvaWQge1xuICAgIHRoaXMuX3NlbGVjdGVkID0gIXRoaXMuX3NlbGVjdGVkO1xuICAgIHRoaXMuY2VsbFNlbGVjdGVkQ2hhbmdlLmVtaXQodGhpcyk7XG4gIH1cbn1cbiJdfQ==