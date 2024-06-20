import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, ContentChildren, EventEmitter, Input, Output, ViewEncapsulation, booleanAttribute, forwardRef, } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MtxToObservablePipe } from '@ng-matero/extensions/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/a11y";
import * as i2 from "@angular/forms";
export class MtxCheckboxBase {
    constructor(label, value) {
        this.label = label;
        this.value = value;
    }
}
export class MtxCheckboxGroup {
    get items() {
        return this._items;
    }
    set items(value) {
        // store the original data with deep clone
        this._originalItems = JSON.parse(JSON.stringify(value));
        this._items = value.map(option => {
            return option instanceof Object ? { ...option } : new MtxCheckboxBase(option, option);
        });
    }
    get compareWith() {
        return this._compareWith;
    }
    set compareWith(fn) {
        if (fn != null && typeof fn !== 'function') {
            throw Error('`compareWith` must be a function.');
        }
        this._compareWith = fn;
    }
    constructor(_changeDetectorRef, _focusMonitor, _elementRef) {
        this._changeDetectorRef = _changeDetectorRef;
        this._focusMonitor = _focusMonitor;
        this._elementRef = _elementRef;
        this._items = [];
        this._originalItems = [];
        this.bindLabel = 'label';
        this.bindValue = 'value';
        this.showSelectAll = false;
        this.selectAllLabel = 'Select All';
        this.disabled = false;
        this.change = new EventEmitter();
        this.selectAll = false;
        this.selectAllIndeterminate = false;
        this.selectedItems = [];
        this._onChange = () => null;
        this._onTouched = () => null;
    }
    ngAfterViewInit() {
        this._focusMonitor.monitor(this._elementRef, true).subscribe(focusOrigin => {
            if (!focusOrigin) {
                // When a focused element becomes disabled, the browser *immediately* fires a blur event.
                // Angular does not expect events to be raised during change detection, so any state change
                // (such as a form control's 'ng-touched') will cause a changed-after-checked error.
                // See https://github.com/angular/angular/issues/17793. To work around this, we defer
                // telling the form control it has been touched until the next tick.
                Promise.resolve().then(() => {
                    this._onTouched();
                    this._changeDetectorRef.markForCheck();
                });
            }
        });
    }
    ngOnDestroy() {
        this._focusMonitor.stopMonitoring(this._elementRef);
    }
    /**
     * Finds and selects and option based on its value.
     * @returns Option that has the corresponding value.
     */
    _selectValue(value) {
        const correspondingOption = this.items.find(option => {
            try {
                const compareValue = option[this.bindValue] === value;
                return this._compareWith ? this._compareWith(option, value) : compareValue;
            }
            catch (error) {
                console.warn(error);
                return false;
            }
        });
        if (correspondingOption) {
            correspondingOption.checked = true;
        }
        return correspondingOption;
    }
    /**
     * Sets the model value. Implemented as part of ControlValueAccessor.
     * @param value New value to be written to the model.
     */
    writeValue(value) {
        this.items.forEach(item => (item.checked = false));
        if (value) {
            if (!Array.isArray(value)) {
                throw Error('Value must be an array.');
            }
            value.forEach(currentValue => this._selectValue(currentValue));
            this.selectedItems = value;
        }
        this._checkMasterCheckboxState();
        this._changeDetectorRef.markForCheck();
    }
    /**
     * Registers a callback to be triggered when the model value changes.
     * Implemented as part of ControlValueAccessor.
     * @param fn Callback to be registered.
     */
    registerOnChange(fn) {
        this._onChange = fn;
    }
    /**
     * Registers a callback to be triggered when the control is touched.
     * Implemented as part of ControlValueAccessor.
     * @param fn Callback to be registered.
     */
    registerOnTouched(fn) {
        this._onTouched = fn;
    }
    /**
     * Sets the disabled state of the control. Implemented as a part of ControlValueAccessor.
     * @param isDisabled Whether the control should be disabled.
     */
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
        this._changeDetectorRef.markForCheck();
    }
    _checkMasterCheckboxState() {
        if (this.items
            .filter(option => option.checked || !option.disabled)
            .every(option => !option.checked)) {
            this.selectAll = false;
            this.selectAllIndeterminate = false;
        }
        else if (this.items
            .filter(option => option.checked || !option.disabled)
            .every(option => option.checked)) {
            this.selectAll = true;
            this.selectAllIndeterminate = false;
        }
        else {
            this.selectAllIndeterminate = true;
        }
    }
    _getSelectedItems(index) {
        this.selectedItems = this.items.filter(option => option.checked);
        if (this._compareWith) {
            this.selectedItems = this._originalItems.filter(option => this.selectedItems.find(selectedOption => this._compareWith(option, selectedOption)));
        }
        else {
            this.selectedItems = this.selectedItems.map(option => option[this.bindValue]);
        }
        this._onChange(this.selectedItems);
        this.change.emit({ model: this.selectedItems, index });
    }
    /** Handle normal checkbox toggle */
    _updateNormalCheckboxState(e, index) {
        this._checkMasterCheckboxState();
        this._getSelectedItems(index);
    }
    /** Handle master checkbox toggle */
    _updateMasterCheckboxState(e, index) {
        this.selectAll = !this.selectAll;
        this.selectAllIndeterminate = false;
        if (this.selectAll) {
            this.items
                .filter(option => option.checked || !option.disabled)
                .forEach(option => (option.checked = true));
        }
        else {
            this.items
                .filter(option => option.checked || !option.disabled)
                .forEach(option => (option.checked = !!option.disabled));
        }
        this._getSelectedItems(index);
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxCheckboxGroup, deps: [{ token: i0.ChangeDetectorRef }, { token: i1.FocusMonitor }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component }); }
    /** @nocollapse */ static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.0.1", type: MtxCheckboxGroup, isStandalone: true, selector: "mtx-checkbox-group", inputs: { items: "items", bindLabel: "bindLabel", bindValue: "bindValue", showSelectAll: ["showSelectAll", "showSelectAll", booleanAttribute], selectAllLabel: "selectAllLabel", compareWith: "compareWith", disabled: ["disabled", "disabled", booleanAttribute] }, outputs: { change: "change" }, host: { classAttribute: "mtx-checkbox-group" }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef((() => MtxCheckboxGroup)),
                multi: true,
            },
        ], queries: [{ propertyName: "_checkboxes", predicate: i0.forwardRef(() => MatCheckbox), descendants: true }], exportAs: ["mtxCheckboxGroup"], ngImport: i0, template: "@if (showSelectAll) {\n  <mat-checkbox class=\"mtx-checkbox-master\"\n    [checked]=\"selectAll\"\n    [(indeterminate)]=\"selectAllIndeterminate\"\n    [disabled]=\"disabled\"\n    (change)=\"_updateMasterCheckboxState($event, -1)\">{{selectAllLabel}}</mat-checkbox>\n}\n\n@for (option of items; track option; let i = $index) {\n  <mat-checkbox class=\"mtx-checkbox-normal\"\n    [(ngModel)]=\"option.checked\"\n    [ngModelOptions]=\"{standalone: true}\"\n    [aria-describedby]=\"option.ariaDescribedby\"\n    [aria-label]=\"option.ariaLabel\"\n    [aria-labelledby]=\"option.ariaLabelledby\"\n    [color]=\"option.color\"\n    [disabled]=\"option.disabled || disabled\"\n    [disableRipple]=\"option.disableRipple\"\n    [labelPosition]=\"option.labelPosition\"\n    [required]=\"option.required\"\n    (change)=\"_updateNormalCheckboxState($event, i)\"\n  >{{option[bindLabel] | toObservable | async}}</mat-checkbox>\n}\n", styles: [""], dependencies: [{ kind: "ngmodule", type: FormsModule }, { kind: "directive", type: i2.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i2.RequiredValidator, selector: ":not([type=checkbox])[required][formControlName],:not([type=checkbox])[required][formControl],:not([type=checkbox])[required][ngModel]", inputs: ["required"] }, { kind: "directive", type: i2.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: MatCheckbox, selector: "mat-checkbox", inputs: ["aria-label", "aria-labelledby", "aria-describedby", "id", "required", "labelPosition", "name", "value", "disableRipple", "tabIndex", "color", "checked", "disabled", "indeterminate"], outputs: ["change", "indeterminateChange"], exportAs: ["matCheckbox"] }, { kind: "pipe", type: MtxToObservablePipe, name: "toObservable" }, { kind: "pipe", type: AsyncPipe, name: "async" }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxCheckboxGroup, decorators: [{
            type: Component,
            args: [{ selector: 'mtx-checkbox-group', exportAs: 'mtxCheckboxGroup', host: {
                        class: 'mtx-checkbox-group',
                    }, encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef((() => MtxCheckboxGroup)),
                            multi: true,
                        },
                    ], standalone: true, imports: [FormsModule, MatCheckbox, MtxToObservablePipe, AsyncPipe], template: "@if (showSelectAll) {\n  <mat-checkbox class=\"mtx-checkbox-master\"\n    [checked]=\"selectAll\"\n    [(indeterminate)]=\"selectAllIndeterminate\"\n    [disabled]=\"disabled\"\n    (change)=\"_updateMasterCheckboxState($event, -1)\">{{selectAllLabel}}</mat-checkbox>\n}\n\n@for (option of items; track option; let i = $index) {\n  <mat-checkbox class=\"mtx-checkbox-normal\"\n    [(ngModel)]=\"option.checked\"\n    [ngModelOptions]=\"{standalone: true}\"\n    [aria-describedby]=\"option.ariaDescribedby\"\n    [aria-label]=\"option.ariaLabel\"\n    [aria-labelledby]=\"option.ariaLabelledby\"\n    [color]=\"option.color\"\n    [disabled]=\"option.disabled || disabled\"\n    [disableRipple]=\"option.disableRipple\"\n    [labelPosition]=\"option.labelPosition\"\n    [required]=\"option.required\"\n    (change)=\"_updateNormalCheckboxState($event, i)\"\n  >{{option[bindLabel] | toObservable | async}}</mat-checkbox>\n}\n" }]
        }], ctorParameters: () => [{ type: i0.ChangeDetectorRef }, { type: i1.FocusMonitor }, { type: i0.ElementRef }], propDecorators: { _checkboxes: [{
                type: ContentChildren,
                args: [forwardRef(() => MatCheckbox), { descendants: true }]
            }], items: [{
                type: Input
            }], bindLabel: [{
                type: Input
            }], bindValue: [{
                type: Input
            }], showSelectAll: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], selectAllLabel: [{
                type: Input
            }], compareWith: [{
                type: Input
            }], disabled: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], change: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tib3gtZ3JvdXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9leHRlbnNpb25zL2NoZWNrYm94LWdyb3VwL2NoZWNrYm94LWdyb3VwLnRzIiwiLi4vLi4vLi4vLi4vcHJvamVjdHMvZXh0ZW5zaW9ucy9jaGVja2JveC1ncm91cC9jaGVja2JveC1ncm91cC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUM1QyxPQUFPLEVBRUwsdUJBQXVCLEVBRXZCLFNBQVMsRUFDVCxlQUFlLEVBRWYsWUFBWSxFQUNaLEtBQUssRUFFTCxNQUFNLEVBRU4saUJBQWlCLEVBQ2pCLGdCQUFnQixFQUNoQixVQUFVLEdBQ1gsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUF3QixXQUFXLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUN0RixPQUFPLEVBQUUsV0FBVyxFQUFxQixNQUFNLDRCQUE0QixDQUFDO0FBRTVFLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLDRCQUE0QixDQUFDOzs7O0FBR2pFLE1BQU0sT0FBTyxlQUFlO0lBQzFCLFlBQ1MsS0FBVyxFQUNYLEtBQVc7UUFEWCxVQUFLLEdBQUwsS0FBSyxDQUFNO1FBQ1gsVUFBSyxHQUFMLEtBQUssQ0FBTTtJQUNqQixDQUFDO0NBQ0w7QUFzQkQsTUFBTSxPQUFPLGdCQUFnQjtJQUkzQixJQUNJLEtBQUs7UUFDUCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDckIsQ0FBQztJQUNELElBQUksS0FBSyxDQUFDLEtBQVk7UUFDcEIsMENBQTBDO1FBQzFDLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDeEQsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMs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QUFFO2dCQUlqRSxLQUFLO3NCQURSLEtBQUs7Z0JBY0csU0FBUztzQkFBakIsS0FBSztnQkFFRyxTQUFTO3NCQUFqQixLQUFLO2dCQUVrQyxhQUFhO3NCQUFwRCxLQUFLO3VCQUFDLEVBQUUsU0FBUyxFQUFFLGdCQUFnQixFQUFFO2dCQUU3QixjQUFjO3NCQUF0QixLQUFLO2dCQUdGLFdBQVc7c0JBRGQsS0FBSztnQkFha0MsUUFBUTtzQkFBL0MsS0FBSzt1QkFBQyxFQUFFLFNBQVMsRUFBRSxnQkFBZ0IsRUFBRTtnQkFFNUIsTUFBTTtzQkFBZixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRm9jdXNNb25pdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHsgQXN5bmNQaXBlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5wdXQsXG4gIE9uRGVzdHJveSxcbiAgT3V0cHV0LFxuICBRdWVyeUxpc3QsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBib29sZWFuQXR0cmlidXRlLFxuICBmb3J3YXJkUmVmLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBGb3Jtc01vZHVsZSwgTkdfVkFMVUVfQUNDRVNTT1IgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBNYXRDaGVja2JveCwgTWF0Q2hlY2tib3hDaGFuZ2UgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jaGVja2JveCc7XG5cbmltcG9ydCB7IE10eFRvT2JzZXJ2YWJsZVBpcGUgfSBmcm9tICdAbmctbWF0ZXJvL2V4dGVuc2lvbnMvY29yZSc7XG5pbXBvcnQgeyBNdHhDaGVja2JveEdyb3VwT3B0aW9uIH0gZnJvbSAnLi9pbnRlcmZhY2VzJztcblxuZXhwb3J0IGNsYXNzIE10eENoZWNrYm94QmFzZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBsYWJlbD86IGFueSxcbiAgICBwdWJsaWMgdmFsdWU/OiBhbnlcbiAgKSB7fVxufVxuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtdHgtY2hlY2tib3gtZ3JvdXAnLFxuICBleHBvcnRBczogJ210eENoZWNrYm94R3JvdXAnLFxuICBob3N0OiB7XG4gICAgY2xhc3M6ICdtdHgtY2hlY2tib3gtZ3JvdXAnLFxuICB9LFxuICB0ZW1wbGF0ZVVybDogJy4vY2hlY2tib3gtZ3JvdXAuaHRtbCcsXG4gIHN0eWxlVXJsOiAnLi9jaGVja2JveC1ncm91cC5zY3NzJyxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIHByb3ZpZGVyczogW1xuICAgIHtcbiAgICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTXR4Q2hlY2tib3hHcm91cCksXG4gICAgICBtdWx0aTogdHJ1ZSxcbiAgICB9LFxuICBdLFxuICBzdGFuZGFsb25lOiB0cnVlLFxuICBpbXBvcnRzOiBbRm9ybXNNb2R1bGUsIE1hdENoZWNrYm94LCBNdHhUb09ic2VydmFibGVQaXBlLCBBc3luY1BpcGVdLFxufSlcbmV4cG9ydCBjbGFzcyBNdHhDaGVja2JveEdyb3VwIGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95LCBDb250cm9sVmFsdWVBY2Nlc3NvciB7XG4gIEBDb250ZW50Q2hpbGRyZW4oZm9yd2FyZFJlZigoKSA9PiBNYXRDaGVja2JveCksIHsgZGVzY2VuZGFudHM6IHRydWUgfSlcbiAgX2NoZWNrYm94ZXMhOiBRdWVyeUxpc3Q8TWF0Q2hlY2tib3g+O1xuXG4gIEBJbnB1dCgpXG4gIGdldCBpdGVtcygpIHtcbiAgICByZXR1cm4gdGhpcy5faXRlbXM7XG4gIH1cbiAgc2V0IGl0ZW1zKHZhbHVlOiBhbnlbXSkge1xuICAgIC8vIHN0b3JlIHRoZSBvcmlnaW5hbCBkYXRhIHdpdGggZGVlcCBjbG9uZVxuICAgIHRoaXMuX29yaWdpbmFsSXRlbXMgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHZhbHVlKSk7XG4gICAgdGhpcy5faXRlbXMgPSB2YWx1ZS5tYXAob3B0aW9uID0+IHtcbiAgICAgIHJldHVybiBvcHRpb24gaW5zdGFuY2VvZiBPYmplY3QgPyB7IC4uLm9wdGlvbiB9IDogbmV3IE10eENoZWNrYm94QmFzZShvcHRpb24sIG9wdGlvbik7XG4gICAgfSk7XG4gIH1cbiAgcHJpdmF0ZSBfaXRlbXM6IGFueVtdID0gW107XG4gIHByaXZhdGUgX29yaWdpbmFsSXRlbXM6IGFueVtdID0gW107XG5cbiAgQElucHV0KCkgYmluZExhYmVsID0gJ2xhYmVsJztcblxuICBASW5wdXQoKSBiaW5kVmFsdWUgPSAndmFsdWUnO1xuXG4gIEBJbnB1dCh7IHRyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZSB9KSBzaG93U2VsZWN0QWxsID0gZmFsc2U7XG5cbiAgQElucHV0KCkgc2VsZWN0QWxsTGFiZWwgPSAnU2VsZWN0IEFsbCc7XG5cbiAgQElucHV0KClcbiAgZ2V0IGNvbXBhcmVXaXRoKCkge1xuICAgIHJldHVybiB0aGlzLl9jb21wYXJlV2l0aDtcbiAgfVxuICBzZXQgY29tcGFyZVdpdGgoZm46ICgobzE6IGFueSwgbzI6IGFueSkgPT4gYm9vbGVhbikgfCB1bmRlZmluZWQpIHtcbiAgICBpZiAoZm4gIT0gbnVsbCAmJiB0eXBlb2YgZm4gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRocm93IEVycm9yKCdgY29tcGFyZVdpdGhgIG11c3QgYmUgYSBmdW5jdGlvbi4nKTtcbiAgICB9XG5cbiAgICB0aGlzLl9jb21wYXJlV2l0aCA9IGZuO1xuICB9XG4gIHByaXZhdGUgX2NvbXBhcmVXaXRoPzogKG8xOiBhbnksIG8yOiBhbnkpID0+IGJvb2xlYW47XG5cbiAgQElucHV0KHsgdHJhbnNmb3JtOiBib29sZWFuQXR0cmlidXRlIH0pIGRpc2FibGVkID0gZmFsc2U7XG5cbiAgQE91dHB1dCgpIGNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8eyBtb2RlbDogTXR4Q2hlY2tib3hHcm91cE9wdGlvbltdOyBpbmRleDogbnVtYmVyIH0+KCk7XG5cbiAgc2VsZWN0QWxsID0gZmFsc2U7XG4gIHNlbGVjdEFsbEluZGV0ZXJtaW5hdGUgPSBmYWxzZTtcblxuICBzZWxlY3RlZEl0ZW1zOiBNdHhDaGVja2JveEdyb3VwT3B0aW9uW10gPSBbXTtcblxuICBfb25DaGFuZ2U6ICh2YWx1ZTogTXR4Q2hlY2tib3hHcm91cE9wdGlvbltdKSA9PiB2b2lkID0gKCkgPT4gbnVsbDtcbiAgX29uVG91Y2hlZDogKCkgPT4gdm9pZCA9ICgpID0+IG51bGw7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIHByaXZhdGUgX2ZvY3VzTW9uaXRvcjogRm9jdXNNb25pdG9yLFxuICAgIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+XG4gICkge31cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgdGhpcy5fZm9jdXNNb25pdG9yLm1vbml0b3IodGhpcy5fZWxlbWVudFJlZiwgdHJ1ZSkuc3Vic2NyaWJlKGZvY3VzT3JpZ2luID0+IHtcbiAgICAgIGlmICghZm9jdXNPcmlnaW4pIHtcbiAgICAgICAgLy8gV2hlbiBhIGZvY3VzZWQgZWxlbWVudCBiZWNvbWVzIGRpc2FibGVkLCB0aGUgYnJvd3NlciAqaW1tZWRpYXRlbHkqIGZpcmVzIGEgYmx1ciBldmVudC5cbiAgICAgICAgLy8gQW5ndWxhciBkb2VzIG5vdCBleHBlY3QgZXZlbnRzIHRvIGJlIHJhaXNlZCBkdXJpbmcgY2hhbmdlIGRldGVjdGlvbiwgc28gYW55IHN0YXRlIGNoYW5nZVxuICAgICAgICAvLyAoc3VjaCBhcyBhIGZvcm0gY29udHJvbCdzICduZy10b3VjaGVkJykgd2lsbCBjYXVzZSBhIGNoYW5nZWQtYWZ0ZXItY2hlY2tlZCBlcnJvci5cbiAgICAgICAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvaXNzdWVzLzE3NzkzLiBUbyB3b3JrIGFyb3VuZCB0aGlzLCB3ZSBkZWZlclxuICAgICAgICAvLyB0ZWxsaW5nIHRoZSBmb3JtIGNvbnRyb2wgaXQgaGFzIGJlZW4gdG91Y2hlZCB1bnRpbCB0aGUgbmV4dCB0aWNrLlxuICAgICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICB0aGlzLl9vblRvdWNoZWQoKTtcbiAgICAgICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9mb2N1c01vbml0b3Iuc3RvcE1vbml0b3JpbmcodGhpcy5fZWxlbWVudFJlZik7XG4gIH1cblxuICAvKipcbiAgICogRmluZHMgYW5kIHNlbGVjdHMgYW5kIG9wdGlvbiBiYXNlZCBvbiBpdHMgdmFsdWUuXG4gICAqIEByZXR1cm5zIE9wdGlvbiB0aGF0IGhhcyB0aGUgY29ycmVzcG9uZGluZyB2YWx1ZS5cbiAgICovXG4gIHByaXZhdGUgX3NlbGVjdFZhbHVlKHZhbHVlOiBNdHhDaGVja2JveEdyb3VwT3B0aW9uKSB7XG4gICAgY29uc3QgY29ycmVzcG9uZGluZ09wdGlvbiA9ICh0aGlzLml0ZW1zIGFzIE10eENoZWNrYm94R3JvdXBPcHRpb25bXSkuZmluZChvcHRpb24gPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgY29tcGFyZVZhbHVlID0gb3B0aW9uW3RoaXMuYmluZFZhbHVlXSA9PT0gdmFsdWU7XG4gICAgICAgIHJldHVybiB0aGlzLl9jb21wYXJlV2l0aCA/IHRoaXMuX2NvbXBhcmVXaXRoKG9wdGlvbiwgdmFsdWUpIDogY29tcGFyZVZhbHVlO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS53YXJuKGVycm9yKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKGNvcnJlc3BvbmRpbmdPcHRpb24pIHtcbiAgICAgIGNvcnJlc3BvbmRpbmdPcHRpb24uY2hlY2tlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvcnJlc3BvbmRpbmdPcHRpb247XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgbW9kZWwgdmFsdWUuIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gICAqIEBwYXJhbSB2YWx1ZSBOZXcgdmFsdWUgdG8gYmUgd3JpdHRlbiB0byB0aGUgbW9kZWwuXG4gICAqL1xuICB3cml0ZVZhbHVlKHZhbHVlOiBhbnlbXSk6IHZvaWQge1xuICAgIHRoaXMuaXRlbXMuZm9yRWFjaChpdGVtID0+IChpdGVtLmNoZWNrZWQgPSBmYWxzZSkpO1xuXG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICBpZiAoIUFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgIHRocm93IEVycm9yKCdWYWx1ZSBtdXN0IGJlIGFuIGFycmF5LicpO1xuICAgICAgfVxuXG4gICAgICB2YWx1ZS5mb3JFYWNoKGN1cnJlbnRWYWx1ZSA9PiB0aGlzLl9zZWxlY3RWYWx1ZShjdXJyZW50VmFsdWUpKTtcbiAgICAgIHRoaXMuc2VsZWN0ZWRJdGVtcyA9IHZhbHVlO1xuICAgIH1cblxuICAgIHRoaXMuX2NoZWNrTWFzdGVyQ2hlY2tib3hTdGF0ZSgpO1xuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIGNhbGxiYWNrIHRvIGJlIHRyaWdnZXJlZCB3aGVuIHRoZSBtb2RlbCB2YWx1ZSBjaGFuZ2VzLlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICAgKiBAcGFyYW0gZm4gQ2FsbGJhY2sgdG8gYmUgcmVnaXN0ZXJlZC5cbiAgICovXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46ICh2YWx1ZTogTXR4Q2hlY2tib3hHcm91cE9wdGlvbltdKSA9PiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPik6IHZvaWQge1xuICAgIHRoaXMuX29uQ2hhbmdlID0gZm47XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGEgY2FsbGJhY2sgdG8gYmUgdHJpZ2dlcmVkIHdoZW4gdGhlIGNvbnRyb2wgaXMgdG91Y2hlZC5cbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgICogQHBhcmFtIGZuIENhbGxiYWNrIHRvIGJlIHJlZ2lzdGVyZWQuXG4gICAqL1xuICByZWdpc3Rlck9uVG91Y2hlZChmbjogKCkgPT4gUmVjb3JkPHN0cmluZywgdW5rbm93bj4pOiB2b2lkIHtcbiAgICB0aGlzLl9vblRvdWNoZWQgPSBmbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBkaXNhYmxlZCBzdGF0ZSBvZiB0aGUgY29udHJvbC4gSW1wbGVtZW50ZWQgYXMgYSBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICAgKiBAcGFyYW0gaXNEaXNhYmxlZCBXaGV0aGVyIHRoZSBjb250cm9sIHNob3VsZCBiZSBkaXNhYmxlZC5cbiAgICovXG4gIHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbikge1xuICAgIHRoaXMuZGlzYWJsZWQgPSBpc0Rpc2FibGVkO1xuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgcHJpdmF0ZSBfY2hlY2tNYXN0ZXJDaGVja2JveFN0YXRlKCkge1xuICAgIGlmIChcbiAgICAgICh0aGlzLml0ZW1zIGFzIE10eENoZWNrYm94R3JvdXBPcHRpb25bXSlcbiAgICAgICAgLmZpbHRlcihvcHRpb24gPT4gb3B0aW9uLmNoZWNrZWQgfHwgIW9wdGlvbi5kaXNhYmxlZClcbiAgICAgICAgLmV2ZXJ5KG9wdGlvbiA9PiAhb3B0aW9uLmNoZWNrZWQpXG4gICAgKSB7XG4gICAgICB0aGlzLnNlbGVjdEFsbCA9IGZhbHNlO1xuICAgICAgdGhpcy5zZWxlY3RBbGxJbmRldGVybWluYXRlID0gZmFsc2U7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgICh0aGlzLml0ZW1zIGFzIE10eENoZWNrYm94R3JvdXBPcHRpb25bXSlcbiAgICAgICAgLmZpbHRlcihvcHRpb24gPT4gb3B0aW9uLmNoZWNrZWQgfHwgIW9wdGlvbi5kaXNhYmxlZClcbiAgICAgICAgLmV2ZXJ5KG9wdGlvbiA9PiBvcHRpb24uY2hlY2tlZClcbiAgICApIHtcbiAgICAgIHRoaXMuc2VsZWN0QWxsID0gdHJ1ZTtcbiAgICAgIHRoaXMuc2VsZWN0QWxsSW5kZXRlcm1pbmF0ZSA9IGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNlbGVjdEFsbEluZGV0ZXJtaW5hdGUgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2dldFNlbGVjdGVkSXRlbXMoaW5kZXg6IG51bWJlcikge1xuICAgIHRoaXMuc2VsZWN0ZWRJdGVtcyA9ICh0aGlzLml0ZW1zIGFzIE10eENoZWNrYm94R3JvdXBPcHRpb25bXSkuZmlsdGVyKG9wdGlvbiA9PiBvcHRpb24uY2hlY2tlZCk7XG5cbiAgICBpZiAodGhpcy5fY29tcGFyZVdpdGgpIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWRJdGVtcyA9ICh0aGlzLl9vcmlnaW5hbEl0ZW1zIGFzIE10eENoZWNrYm94R3JvdXBPcHRpb25bXSkuZmlsdGVyKG9wdGlvbiA9PlxuICAgICAgICB0aGlzLnNlbGVjdGVkSXRlbXMuZmluZChzZWxlY3RlZE9wdGlvbiA9PiB0aGlzLl9jb21wYXJlV2l0aCEob3B0aW9uLCBzZWxlY3RlZE9wdGlvbikpXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNlbGVjdGVkSXRlbXMgPSB0aGlzLnNlbGVjdGVkSXRlbXMubWFwKG9wdGlvbiA9PiBvcHRpb25bdGhpcy5iaW5kVmFsdWVdKTtcbiAgICB9XG5cbiAgICB0aGlzLl9vbkNoYW5nZSh0aGlzLnNlbGVjdGVkSXRlbXMpO1xuXG4gICAgdGhpcy5jaGFuZ2UuZW1pdCh7IG1vZGVsOiB0aGlzLnNlbGVjdGVkSXRlbXMsIGluZGV4IH0pO1xuICB9XG5cbiAgLyoqIEhhbmRsZSBub3JtYWwgY2hlY2tib3ggdG9nZ2xlICovXG4gIF91cGRhdGVOb3JtYWxDaGVja2JveFN0YXRlKGU6IE1hdENoZWNrYm94Q2hhbmdlLCBpbmRleDogbnVtYmVyKTogdm9pZCB7XG4gICAgdGhpcy5fY2hlY2tNYXN0ZXJDaGVja2JveFN0YXRlKCk7XG4gICAgdGhpcy5fZ2V0U2VsZWN0ZWRJdGVtcyhpbmRleCk7XG4gIH1cblxuICAvKiogSGFuZGxlIG1hc3RlciBjaGVja2JveCB0b2dnbGUgKi9cbiAgX3VwZGF0ZU1hc3RlckNoZWNrYm94U3RhdGUoZTogTWF0Q2hlY2tib3hDaGFuZ2UsIGluZGV4OiBudW1iZXIpOiB2b2lkIHtcbiAgICB0aGlzLnNlbGVjdEFsbCA9ICF0aGlzLnNlbGVjdEFsbDtcbiAgICB0aGlzLnNlbGVjdEFsbEluZGV0ZXJtaW5hdGUgPSBmYWxzZTtcblxuICAgIGlmICh0aGlzLnNlbGVjdEFsbCkge1xuICAgICAgKHRoaXMuaXRlbXMgYXMgTXR4Q2hlY2tib3hHcm91cE9wdGlvbltdKVxuICAgICAgICAuZmlsdGVyKG9wdGlvbiA9PiBvcHRpb24uY2hlY2tlZCB8fCAhb3B0aW9uLmRpc2FibGVkKVxuICAgICAgICAuZm9yRWFjaChvcHRpb24gPT4gKG9wdGlvbi5jaGVja2VkID0gdHJ1ZSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICAodGhpcy5pdGVtcyBhcyBNdHhDaGVja2JveEdyb3VwT3B0aW9uW10pXG4gICAgICAgIC5maWx0ZXIob3B0aW9uID0+IG9wdGlvbi5jaGVja2VkIHx8ICFvcHRpb24uZGlzYWJsZWQpXG4gICAgICAgIC5mb3JFYWNoKG9wdGlvbiA9PiAob3B0aW9uLmNoZWNrZWQgPSAhIW9wdGlvbi5kaXNhYmxlZCkpO1xuICAgIH1cblxuICAgIHRoaXMuX2dldFNlbGVjdGVkSXRlbXMoaW5kZXgpO1xuICB9XG59XG4iLCJAaWYgKHNob3dTZWxlY3RBbGwpIHtcbiAgPG1hdC1jaGVja2JveCBjbGFzcz1cIm10eC1jaGVja2JveC1tYXN0ZXJcIlxuICAgIFtjaGVja2VkXT1cInNlbGVjdEFsbFwiXG4gICAgWyhpbmRldGVybWluYXRlKV09XCJzZWxlY3RBbGxJbmRldGVybWluYXRlXCJcbiAgICBbZGlzYWJsZWRdPVwiZGlzYWJsZWRcIlxuICAgIChjaGFuZ2UpPVwiX3VwZGF0ZU1hc3RlckNoZWNrYm94U3RhdGUoJGV2ZW50LCAtMSlcIj57e3NlbGVjdEFsbExhYmVsfX08L21hdC1jaGVja2JveD5cbn1cblxuQGZvciAob3B0aW9uIG9mIGl0ZW1zOyB0cmFjayBvcHRpb247IGxldCBpID0gJGluZGV4KSB7XG4gIDxtYXQtY2hlY2tib3ggY2xhc3M9XCJtdHgtY2hlY2tib3gtbm9ybWFsXCJcbiAgICBbKG5nTW9kZWwpXT1cIm9wdGlvbi5jaGVja2VkXCJcbiAgICBbbmdNb2RlbE9wdGlvbnNdPVwie3N0YW5kYWxvbmU6IHRydWV9XCJcbiAgICBbYXJpYS1kZXNjcmliZWRieV09XCJvcHRpb24uYXJpYURlc2NyaWJlZGJ5XCJcbiAgICBbYXJpYS1sYWJlbF09XCJvcHRpb24uYXJpYUxhYmVsXCJcbiAgICBbYXJpYS1sYWJlbGxlZGJ5XT1cIm9wdGlvbi5hcmlhTGFiZWxsZWRieVwiXG4gICAgW2NvbG9yXT1cIm9wdGlvbi5jb2xvclwiXG4gICAgW2Rpc2FibGVkXT1cIm9wdGlvbi5kaXNhYmxlZCB8fCBkaXNhYmxlZFwiXG4gICAgW2Rpc2FibGVSaXBwbGVdPVwib3B0aW9uLmRpc2FibGVSaXBwbGVcIlxuICAgIFtsYWJlbFBvc2l0aW9uXT1cIm9wdGlvbi5sYWJlbFBvc2l0aW9uXCJcbiAgICBbcmVxdWlyZWRdPVwib3B0aW9uLnJlcXVpcmVkXCJcbiAgICAoY2hhbmdlKT1cIl91cGRhdGVOb3JtYWxDaGVja2JveFN0YXRlKCRldmVudCwgaSlcIlxuICA+e3tvcHRpb25bYmluZExhYmVsXSB8IHRvT2JzZXJ2YWJsZSB8IGFzeW5jfX08L21hdC1jaGVja2JveD5cbn1cbiJdfQ==