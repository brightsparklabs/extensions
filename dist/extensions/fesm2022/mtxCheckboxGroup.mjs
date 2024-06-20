import * as i0 from '@angular/core';
import { EventEmitter, booleanAttribute, forwardRef, Component, ViewEncapsulation, ChangeDetectionStrategy, ContentChildren, Input, Output, NgModule } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import * as i2 from '@angular/forms';
import { NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { MtxToObservablePipe, MtxPipesModule } from '@ng-matero/extensions/core';
import * as i1 from '@angular/cdk/a11y';

class MtxCheckboxBase {
    constructor(label, value) {
        this.label = label;
        this.value = value;
    }
}
class MtxCheckboxGroup {
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

class MtxCheckboxGroupModule {
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxCheckboxGroupModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    /** @nocollapse */ static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.0.1", ngImport: i0, type: MtxCheckboxGroupModule, imports: [CommonModule, FormsModule, MatCheckboxModule, MtxPipesModule, MtxCheckboxGroup], exports: [MtxCheckboxGroup, MtxPipesModule] }); }
    /** @nocollapse */ static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxCheckboxGroupModule, imports: [CommonModule, FormsModule, MatCheckboxModule, MtxPipesModule, MtxCheckboxGroup, MtxPipesModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxCheckboxGroupModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, FormsModule, MatCheckboxModule, MtxPipesModule, MtxCheckboxGroup],
                    exports: [MtxCheckboxGroup, MtxPipesModule],
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { MtxCheckboxBase, MtxCheckboxGroup, MtxCheckboxGroupModule };
//# sourceMappingURL=mtxCheckboxGroup.mjs.map
