import * as i0 from '@angular/core';
import { booleanAttribute, Component, ChangeDetectionStrategy, Input, Directive, InjectionToken, EventEmitter, TemplateRef, ViewEncapsulation, Optional, Self, Inject, ViewChild, ContentChild, ContentChildren, Output, NgModule } from '@angular/core';
import { NgTemplateOutlet, CommonModule } from '@angular/common';
import * as i3 from '@angular/forms';
import { Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as i4 from '@ng-select/ng-select';
import { NgSelectModule } from '@ng-select/ng-select';
import * as i2 from '@angular/material/core';
import { _ErrorStateTracker } from '@angular/material/core';
import * as i5 from '@angular/material/form-field';
import { MAT_FORM_FIELD, MatFormFieldControl } from '@angular/material/form-field';
import { Subject, merge } from 'rxjs';
import { takeUntil, startWith } from 'rxjs/operators';
import * as i1 from '@angular/cdk/a11y';

class MtxOption {
    get label() {
        return (this.elementRef.nativeElement.textContent || '').trim();
    }
    constructor(elementRef) {
        this.elementRef = elementRef;
        this.disabled = false;
        this.stateChange$ = new Subject();
    }
    ngOnChanges(changes) {
        if (changes.disabled) {
            this.stateChange$.next({
                value: this.value,
                disabled: this.disabled,
            });
        }
    }
    ngAfterViewChecked() {
        if (this.label !== this._previousLabel) {
            this._previousLabel = this.label;
            this.stateChange$.next({
                value: this.value,
                disabled: this.disabled,
                label: this.elementRef.nativeElement.innerHTML,
            });
        }
    }
    ngOnDestroy() {
        this.stateChange$.complete();
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxOption, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component }); }
    /** @nocollapse */ static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "16.1.0", version: "18.0.1", type: MtxOption, isStandalone: true, selector: "mtx-option", inputs: { value: "value", disabled: ["disabled", "disabled", booleanAttribute] }, exportAs: ["mtxOption"], usesOnChanges: true, ngImport: i0, template: `<ng-content></ng-content>`, isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxOption, decorators: [{
            type: Component,
            args: [{
                    selector: 'mtx-option',
                    exportAs: 'mtxOption',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    template: `<ng-content></ng-content>`,
                    standalone: true,
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }], propDecorators: { value: [{
                type: Input
            }], disabled: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }] } });

class MtxSelectOptionTemplate {
    constructor(template) {
        this.template = template;
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxSelectOptionTemplate, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    /** @nocollapse */ static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.0.1", type: MtxSelectOptionTemplate, isStandalone: true, selector: "[ng-option-tmp]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxSelectOptionTemplate, decorators: [{
            type: Directive,
            args: [{ selector: '[ng-option-tmp]', standalone: true }]
        }], ctorParameters: () => [{ type: i0.TemplateRef }] });
class MtxSelectOptgroupTemplate {
    constructor(template) {
        this.template = template;
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxSelectOptgroupTemplate, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    /** @nocollapse */ static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.0.1", type: MtxSelectOptgroupTemplate, isStandalone: true, selector: "[ng-optgroup-tmp]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxSelectOptgroupTemplate, decorators: [{
            type: Directive,
            args: [{ selector: '[ng-optgroup-tmp]', standalone: true }]
        }], ctorParameters: () => [{ type: i0.TemplateRef }] });
class MtxSelectLabelTemplate {
    constructor(template) {
        this.template = template;
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxSelectLabelTemplate, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    /** @nocollapse */ static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.0.1", type: MtxSelectLabelTemplate, isStandalone: true, selector: "[ng-label-tmp]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxSelectLabelTemplate, decorators: [{
            type: Directive,
            args: [{ selector: '[ng-label-tmp]', standalone: true }]
        }], ctorParameters: () => [{ type: i0.TemplateRef }] });
class MtxSelectMultiLabelTemplate {
    constructor(template) {
        this.template = template;
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxSelectMultiLabelTemplate, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    /** @nocollapse */ static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.0.1", type: MtxSelectMultiLabelTemplate, isStandalone: true, selector: "[ng-multi-label-tmp]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxSelectMultiLabelTemplate, decorators: [{
            type: Directive,
            args: [{ selector: '[ng-multi-label-tmp]', standalone: true }]
        }], ctorParameters: () => [{ type: i0.TemplateRef }] });
class MtxSelectHeaderTemplate {
    constructor(template) {
        this.template = template;
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxSelectHeaderTemplate, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    /** @nocollapse */ static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.0.1", type: MtxSelectHeaderTemplate, isStandalone: true, selector: "[ng-header-tmp]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxSelectHeaderTemplate, decorators: [{
            type: Directive,
            args: [{ selector: '[ng-header-tmp]', standalone: true }]
        }], ctorParameters: () => [{ type: i0.TemplateRef }] });
class MtxSelectFooterTemplate {
    constructor(template) {
        this.template = template;
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxSelectFooterTemplate, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    /** @nocollapse */ static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.0.1", type: MtxSelectFooterTemplate, isStandalone: true, selector: "[ng-footer-tmp]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxSelectFooterTemplate, decorators: [{
            type: Directive,
            args: [{ selector: '[ng-footer-tmp]', standalone: true }]
        }], ctorParameters: () => [{ type: i0.TemplateRef }] });
class MtxSelectNotFoundTemplate {
    constructor(template) {
        this.template = template;
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxSelectNotFoundTemplate, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    /** @nocollapse */ static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.0.1", type: MtxSelectNotFoundTemplate, isStandalone: true, selector: "[ng-notfound-tmp]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxSelectNotFoundTemplate, decorators: [{
            type: Directive,
            args: [{ selector: '[ng-notfound-tmp]', standalone: true }]
        }], ctorParameters: () => [{ type: i0.TemplateRef }] });
class MtxSelectTypeToSearchTemplate {
    constructor(template) {
        this.template = template;
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxSelectTypeToSearchTemplate, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    /** @nocollapse */ static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.0.1", type: MtxSelectTypeToSearchTemplate, isStandalone: true, selector: "[ng-typetosearch-tmp]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxSelectTypeToSearchTemplate, decorators: [{
            type: Directive,
            args: [{ selector: '[ng-typetosearch-tmp]', standalone: true }]
        }], ctorParameters: () => [{ type: i0.TemplateRef }] });
class MtxSelectLoadingTextTemplate {
    constructor(template) {
        this.template = template;
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxSelectLoadingTextTemplate, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    /** @nocollapse */ static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.0.1", type: MtxSelectLoadingTextTemplate, isStandalone: true, selector: "[ng-loadingtext-tmp]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxSelectLoadingTextTemplate, decorators: [{
            type: Directive,
            args: [{ selector: '[ng-loadingtext-tmp]', standalone: true }]
        }], ctorParameters: () => [{ type: i0.TemplateRef }] });
class MtxSelectTagTemplate {
    constructor(template) {
        this.template = template;
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxSelectTagTemplate, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    /** @nocollapse */ static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.0.1", type: MtxSelectTagTemplate, isStandalone: true, selector: "[ng-tag-tmp]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxSelectTagTemplate, decorators: [{
            type: Directive,
            args: [{ selector: '[ng-tag-tmp]', standalone: true }]
        }], ctorParameters: () => [{ type: i0.TemplateRef }] });
class MtxSelectLoadingSpinnerTemplate {
    constructor(template) {
        this.template = template;
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxSelectLoadingSpinnerTemplate, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    /** @nocollapse */ static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.0.1", type: MtxSelectLoadingSpinnerTemplate, isStandalone: true, selector: "[ng-loadingspinner-tmp]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxSelectLoadingSpinnerTemplate, decorators: [{
            type: Directive,
            args: [{ selector: '[ng-loadingspinner-tmp]', standalone: true }]
        }], ctorParameters: () => [{ type: i0.TemplateRef }] });

/** Injection token that can be used to specify default select options. */
const MTX_SELECT_DEFAULT_OPTIONS = new InjectionToken('mtx-select-default-options');
let nextUniqueId = 0;
class MtxSelect {
    get clearSearchOnAdd() {
        return this._clearSearchOnAdd ?? this.closeOnSelect;
    }
    set clearSearchOnAdd(value) {
        this._clearSearchOnAdd = value;
    }
    get items() {
        return this._items;
    }
    set items(value) {
        this._itemsAreUsed = true;
        this._items = value;
    }
    /** Value of the select control. */
    get value() {
        return this._value;
    }
    set value(newValue) {
        const hasAssigned = this._assignValue(newValue);
        if (hasAssigned) {
            this._onChange(newValue);
        }
    }
    /** Unique id of the element. */
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value || this._uid;
        this.stateChanges.next();
    }
    /** Placeholder to be shown if value is empty. */
    get placeholder() {
        return this._placeholder;
    }
    set placeholder(value) {
        this._placeholder = value;
        this.stateChanges.next();
    }
    /** Whether the select is focused. */
    get focused() {
        return this._focused;
    }
    /** Whether the select has a value. */
    get empty() {
        return this.value == null || (Array.isArray(this.value) && this.value.length === 0);
    }
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    get shouldLabelFloat() {
        return this.focused || !this.empty;
    }
    /** Whether the component is required. */
    get required() {
        return this._required ?? this.ngControl?.control?.hasValidator(Validators.required) ?? false;
    }
    set required(value) {
        this._required = value;
        this.stateChanges.next();
    }
    /** Object used to control when error messages are shown. */
    get errorStateMatcher() {
        return this._errorStateTracker.matcher;
    }
    set errorStateMatcher(value) {
        this._errorStateTracker.matcher = value;
    }
    /** Whether or not the overlay panel is open. */
    get panelOpen() {
        return !!this.ngSelect.isOpen;
    }
    /** Whether the select is in an error state. */
    get errorState() {
        return this._errorStateTracker.errorState;
    }
    set errorState(value) {
        this._errorStateTracker.errorState = value;
    }
    constructor(_changeDetectorRef, _elementRef, _focusMonitor, defaultErrorStateMatcher, parentForm, parentFormGroup, ngControl, _parentFormField, _defaultOptions) {
        this._changeDetectorRef = _changeDetectorRef;
        this._elementRef = _elementRef;
        this._focusMonitor = _focusMonitor;
        this.ngControl = ngControl;
        this._parentFormField = _parentFormField;
        this._defaultOptions = _defaultOptions;
        this.addTag = false;
        this.addTagText = this._defaultOptions?.addTagText ?? 'Add item';
        this.appearance = 'underline';
        this.appendTo = this._defaultOptions?.appendTo ?? 'body';
        this.bindLabel = this._defaultOptions?.bindLabel;
        this.bindValue = this._defaultOptions?.bindValue;
        this.closeOnSelect = true;
        this.clearAllText = this._defaultOptions?.clearAllText ?? 'Clear all';
        this.clearable = true;
        this.clearOnBackspace = true;
        this.dropdownPosition = 'auto';
        this.bufferAmount = 4;
        this.selectableGroup = false;
        this.selectableGroupAsModel = true;
        this.hideSelected = false;
        this.loading = false;
        this.loadingText = this._defaultOptions?.loadingText ?? 'Loading...';
        this.labelForId = null;
        this.markFirst = true;
        this.multiple = false;
        this.notFoundText = this._defaultOptions?.notFoundText ?? 'No items found';
        this.searchable = true;
        this.readonly = false;
        this.searchFn = null;
        this.searchWhileComposing = true;
        this.selectOnTab = false;
        this.trackByFn = null;
        this.inputAttrs = {};
        this.openOnEnter = this._defaultOptions?.openOnEnter ?? true;
        this.minTermLength = 0;
        this.editableSearchTerm = false;
        this.keyDownFn = (_) => true;
        this.virtualScroll = false;
        this.typeToSearchText = this._defaultOptions?.typeToSearchText ?? 'Type to search';
        this.blurEvent = new EventEmitter();
        this.focusEvent = new EventEmitter();
        this.changeEvent = new EventEmitter();
        this.openEvent = new EventEmitter();
        this.closeEvent = new EventEmitter();
        this.searchEvent = new EventEmitter();
        this.clearEvent = new EventEmitter();
        this.addEvent = new EventEmitter();
        this.removeEvent = new EventEmitter();
        this.scroll = new EventEmitter();
        this.scrollToEnd = new EventEmitter();
        this._clearSearchOnAdd = this._defaultOptions?.clearSearchOnAdd;
        this._items = [];
        this._itemsAreUsed = false;
        /** Emits whenever the component is destroyed. */
        this._destroy$ = new Subject();
        this._value = null;
        /** Implemented as part of MatFormFieldControl. */
        this.stateChanges = new Subject();
        /** Unique id for this select. */
        this._uid = `mtx-select-${nextUniqueId++}`;
        this._placeholder = this._defaultOptions?.placeholder;
        this._focused = false;
        /** Whether the select is disabled. */
        this.disabled = false;
        /** Aria label of the select. */
        this.ariaLabel = '';
        /** Input that can be used to specify the `aria-labelledby` attribute. */
        this.ariaLabelledby = null;
        /** The aria-describedby attribute on the select for improved a11y. */
        this._ariaDescribedby = null;
        /** A name for this control that can be used by `mat-form-field`. */
        this.controlType = 'mtx-select';
        /** `View -> model callback called when value changes` */
        this._onChange = () => { };
        /** `View -> model callback called when select has been touched` */
        this._onTouched = () => { };
        /** ID for the DOM node containing the select's value. */
        this._valueId = `mtx-select-value-${nextUniqueId++}`;
        _focusMonitor.monitor(this._elementRef, true).subscribe(origin => {
            if (this._focused && !origin) {
                this._onTouched();
            }
            this._focused = !!origin;
            this.stateChanges.next();
        });
        if (this.ngControl) {
            // Note: we provide the value accessor through here, instead of
            // the `providers` to avoid running into a circular import.
            this.ngControl.valueAccessor = this;
        }
        this._errorStateTracker = new _ErrorStateTracker(defaultErrorStateMatcher, ngControl, parentFormGroup, parentForm, this.stateChanges);
        // Force setter to be called in case id was not specified.
        // eslint-disable-next-line no-self-assign
        this.id = this.id;
    }
    ngOnInit() {
        // Fix compareWith warning of undefined value
        // https://github.com/ng-select/ng-select/issues/1537
        if (this.compareWith) {
            this.ngSelect.compareWith = this.compareWith;
        }
    }
    ngAfterViewInit() {
        if (!this._itemsAreUsed) {
            this._setItemsFromMtxOptions();
        }
    }
    ngDoCheck() {
        const ngControl = this.ngControl;
        if (this.ngControl) {
            // The disabled state might go out of sync if the form group is swapped out. See #17860.
            if (this._previousControl !== ngControl.control) {
                if (this._previousControl !== undefined &&
                    ngControl.disabled !== null &&
                    ngControl.disabled !== this.disabled) {
                    this.disabled = ngControl.disabled;
                }
                this._previousControl = ngControl.control;
            }
            this.updateErrorState();
        }
    }
    ngOnDestroy() {
        this._destroy$.next();
        this._destroy$.complete();
        this.stateChanges.complete();
        this._focusMonitor.stopMonitoring(this._elementRef);
    }
    /** Gets the value for the `aria-labelledby` attribute of the inputs. */
    _getAriaLabelledby() {
        if (this.ariaLabel) {
            return null;
        }
        const labelId = this._parentFormField?.getLabelId();
        let value = (labelId ? labelId + ' ' : '') + this._valueId;
        if (this.ariaLabelledby) {
            value += ' ' + this.ariaLabelledby;
        }
        return value;
    }
    /** Implemented as part of MatFormFieldControl. */
    setDescribedByIds(ids) {
        this._ariaDescribedby = ids.length ? ids.join(' ') : null;
    }
    /**
     * Disables the select. Part of the ControlValueAccessor interface required
     * to integrate with Angular's core forms API.
     *
     * @param isDisabled Sets whether the component is disabled.
     */
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
        this._changeDetectorRef.markForCheck();
        this.stateChanges.next();
    }
    /** Implemented as part of MatFormFieldControl. */
    onContainerClick(event) {
        const target = event.target;
        if (/mat-mdc-form-field|mtx-select/g.test(target.parentElement?.classList[0] || '')) {
            this.focus();
            this.open();
        }
    }
    /**
     * Sets the select's value. Part of the ControlValueAccessor interface
     * required to integrate with Angular's core forms API.
     *
     * @param value New value to be written to the model.
     */
    writeValue(value) {
        this._assignValue(value);
    }
    /**
     * Saves a callback function to be invoked when the select's value
     * changes from user input. Part of the ControlValueAccessor interface
     * required to integrate with Angular's core forms API.
     *
     * @param fn Callback to be triggered when the value changes.
     */
    registerOnChange(fn) {
        this._onChange = fn;
    }
    /**
     * Saves a callback function to be invoked when the select is blurred
     * by the user. Part of the ControlValueAccessor interface required
     * to integrate with Angular's core forms API.
     *
     * @param fn Callback to be triggered when the component has been touched.
     */
    registerOnTouched(fn) {
        this._onTouched = fn;
    }
    /** Refreshes the error state of the select. */
    updateErrorState() {
        this._errorStateTracker.updateErrorState();
    }
    /** Assigns a specific value to the select. Returns whether the value has changed. */
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    _assignValue(newValue) {
        // Always re-assign an array, because it might have been mutated.
        if (newValue !== this._value || (this.multiple && Array.isArray(newValue))) {
            this._value = newValue;
            this._changeDetectorRef.markForCheck();
            return true;
        }
        return false;
    }
    /** NgSelect's `_setItemsFromNgOptions` */
    _setItemsFromMtxOptions() {
        const mapMtxOptions = (options) => {
            this.items = options.map(option => ({
                $ngOptionValue: option.value,
                $ngOptionLabel: option.elementRef.nativeElement.innerHTML,
                disabled: option.disabled,
            }));
            this.ngSelect.itemsList.setItems(this.items);
            if (this.ngSelect.hasValue) {
                this.ngSelect.itemsList.mapSelectedItems();
            }
            this.ngSelect.detectChanges();
        };
        const handleOptionChange = () => {
            const changedOrDestroyed = merge(this.mtxOptions.changes, this._destroy$);
            merge(...this.mtxOptions.map(option => option.stateChange$))
                .pipe(takeUntil(changedOrDestroyed))
                .subscribe(option => {
                const item = this.ngSelect.itemsList.findItem(option.value);
                item.disabled = option.disabled;
                item.label = option.label || item.label;
                this.ngSelect.detectChanges();
            });
        };
        this.mtxOptions.changes
            .pipe(startWith(this.mtxOptions), takeUntil(this._destroy$))
            .subscribe(options => {
            mapMtxOptions(options);
            handleOptionChange();
        });
    }
    open() {
        this.ngSelect.open();
    }
    close() {
        this.ngSelect.close();
    }
    focus() {
        this.ngSelect.focus();
    }
    blur() {
        this.ngSelect.blur();
    }
    openChange() {
        this.openEvent.emit();
        // TODO: The ng-select has no `panelClass` prop, so we can add the theme color by the following way.
        setTimeout(() => {
            const dropdownEl = document.getElementById(this.ngSelect.dropdownId);
            dropdownEl.classList.add('mat-' + this._parentFormField?.color);
        });
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxSelect, deps: [{ token: i0.ChangeDetectorRef }, { token: i0.ElementRef }, { token: i1.FocusMonitor }, { token: i2.ErrorStateMatcher }, { token: i3.NgForm, optional: true }, { token: i3.FormGroupDirective, optional: true }, { token: i3.NgControl, optional: true, self: true }, { token: MAT_FORM_FIELD, optional: true }, { token: MTX_SELECT_DEFAULT_OPTIONS, optional: true }], target: i0.ɵɵFactoryTarget.Component }); }
    /** @nocollapse */ static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.0.1", type: MtxSelect, isStandalone: true, selector: "mtx-select", inputs: { addTag: "addTag", addTagText: "addTagText", appearance: "appearance", appendTo: "appendTo", bindLabel: "bindLabel", bindValue: "bindValue", closeOnSelect: ["closeOnSelect", "closeOnSelect", booleanAttribute], clearAllText: "clearAllText", clearable: ["clearable", "clearable", booleanAttribute], clearOnBackspace: ["clearOnBackspace", "clearOnBackspace", booleanAttribute], compareWith: "compareWith", dropdownPosition: "dropdownPosition", groupBy: "groupBy", groupValue: "groupValue", bufferAmount: "bufferAmount", selectableGroup: ["selectableGroup", "selectableGroup", booleanAttribute], selectableGroupAsModel: ["selectableGroupAsModel", "selectableGroupAsModel", booleanAttribute], hideSelected: ["hideSelected", "hideSelected", booleanAttribute], loading: ["loading", "loading", booleanAttribute], loadingText: "loadingText", labelForId: "labelForId", markFirst: ["markFirst", "markFirst", booleanAttribute], maxSelectedItems: "maxSelectedItems", multiple: ["multiple", "multiple", booleanAttribute], notFoundText: "notFoundText", searchable: ["searchable", "searchable", booleanAttribute], readonly: ["readonly", "readonly", booleanAttribute], searchFn: "searchFn", searchWhileComposing: ["searchWhileComposing", "searchWhileComposing", booleanAttribute], selectOnTab: ["selectOnTab", "selectOnTab", booleanAttribute], trackByFn: "trackByFn", inputAttrs: "inputAttrs", tabIndex: "tabIndex", openOnEnter: ["openOnEnter", "openOnEnter", booleanAttribute], minTermLength: "minTermLength", editableSearchTerm: ["editableSearchTerm", "editableSearchTerm", booleanAttribute], keyDownFn: "keyDownFn", virtualScroll: ["virtualScroll", "virtualScroll", booleanAttribute], typeToSearchText: "typeToSearchText", typeahead: "typeahead", clearSearchOnAdd: "clearSearchOnAdd", items: "items", value: "value", id: "id", placeholder: "placeholder", disabled: ["disabled", "disabled", booleanAttribute], required: ["required", "required", booleanAttribute], errorStateMatcher: "errorStateMatcher", ariaLabel: ["aria-label", "ariaLabel"], ariaLabelledby: ["aria-labelledby", "ariaLabelledby"] }, outputs: { blurEvent: "blur", focusEvent: "focus", changeEvent: "change", openEvent: "open", closeEvent: "close", searchEvent: "search", clearEvent: "clear", addEvent: "add", removeEvent: "remove", scroll: "scroll", scrollToEnd: "scrollToEnd" }, host: { attributes: { "role": "combobox", "aria-autocomplete": "none" }, properties: { "attr.id": "id", "attr.aria-expanded": "panelOpen", "attr.aria-label": "ariaLabel || null", "attr.aria-labelledby": "_getAriaLabelledby()", "attr.aria-describedby": "_ariaDescribedby || null", "attr.aria-required": "required.toString()", "attr.aria-disabled": "disabled.toString()", "attr.aria-invalid": "errorState", "class.mtx-select-floating": "shouldLabelFloat", "class.mtx-select-disabled": "disabled", "class.mtx-select-invalid": "errorState", "class.mtx-select-required": "required", "class.mtx-select-empty": "empty", "class.mtx-select-multiple": "multiple" }, classAttribute: "mtx-select" }, providers: [{ provide: MatFormFieldControl, useExisting: MtxSelect }], queries: [{ propertyName: "optionTemplate", first: true, predicate: MtxSelectOptionTemplate, descendants: true, read: TemplateRef }, { propertyName: "optgroupTemplate", first: true, predicate: MtxSelectOptgroupTemplate, descendants: true, read: TemplateRef }, { propertyName: "labelTemplate", first: true, predicate: MtxSelectLabelTemplate, descendants: true, read: TemplateRef }, { propertyName: "multiLabelTemplate", first: true, predicate: MtxSelectMultiLabelTemplate, descendants: true, read: TemplateRef }, { propertyName: "headerTemplate", first: true, predicate: MtxSelectHeaderTemplate, descendants: true, read: TemplateRef }, { propertyName: "footerTemplate", first: true, predicate: MtxSelectFooterTemplate, descendants: true, read: TemplateRef }, { propertyName: "notFoundTemplate", first: true, predicate: MtxSelectNotFoundTemplate, descendants: true, read: TemplateRef }, { propertyName: "typeToSearchTemplate", first: true, predicate: MtxSelectTypeToSearchTemplate, descendants: true, read: TemplateRef }, { propertyName: "loadingTextTemplate", first: true, predicate: MtxSelectLoadingTextTemplate, descendants: true, read: TemplateRef }, { propertyName: "tagTemplate", first: true, predicate: MtxSelectTagTemplate, descendants: true, read: TemplateRef }, { propertyName: "loadingSpinnerTemplate", first: true, predicate: MtxSelectLoadingSpinnerTemplate, descendants: true, read: TemplateRef }, { propertyName: "mtxOptions", predicate: MtxOption, descendants: true }], viewQueries: [{ propertyName: "ngSelect", first: true, predicate: ["ngSelect"], descendants: true, static: true }], exportAs: ["mtxSelect"], ngImport: i0, template: "<ng-select #ngSelect\n  [class.ng-select-invalid]=\"errorState\"\n  [(ngModel)]=\"value\"\n  [ngModelOptions]=\"{standalone: true}\"\n  [placeholder]=\"placeholder\"\n  [items]=\"items\"\n  [addTag]=\"addTag\"\n  [addTagText]=\"addTagText\"\n  [appendTo]=\"appendTo\"\n  [appearance]=\"appearance\"\n  [bindLabel]=\"bindLabel!\"\n  [bindValue]=\"bindValue!\"\n  [closeOnSelect]=\"closeOnSelect\"\n  [clearAllText]=\"clearAllText\"\n  [clearable]=\"clearable\"\n  [clearOnBackspace]=\"clearOnBackspace\"\n  [dropdownPosition]=\"dropdownPosition\"\n  [groupBy]=\"groupBy\"\n  [groupValue]=\"groupValue\"\n  [bufferAmount]=\"bufferAmount\"\n  [hideSelected]=\"hideSelected\"\n  [inputAttrs]=\"inputAttrs\"\n  [loading]=\"loading\"\n  [loadingText]=\"loadingText\"\n  [labelForId]=\"labelForId\"\n  [markFirst]=\"markFirst\"\n  [maxSelectedItems]=\"maxSelectedItems\"\n  [multiple]=\"multiple\"\n  [notFoundText]=\"notFoundText\"\n  [readonly]=\"readonly || disabled\"\n  [typeahead]=\"typeahead\"\n  [typeToSearchText]=\"typeToSearchText\"\n  [trackByFn]=\"trackByFn\"\n  [searchable]=\"searchable\"\n  [searchFn]=\"searchFn\"\n  [searchWhileComposing]=\"searchWhileComposing\"\n  [clearSearchOnAdd]=\"clearSearchOnAdd\"\n  [selectableGroup]=\"selectableGroup\"\n  [selectableGroupAsModel]=\"selectableGroupAsModel\"\n  [selectOnTab]=\"selectOnTab\"\n  [tabIndex]=\"tabIndex\"\n  [openOnEnter]=\"openOnEnter\"\n  [minTermLength]=\"minTermLength\"\n  [editableSearchTerm]=\"editableSearchTerm\"\n  [keyDownFn]=\"keyDownFn\"\n  [virtualScroll]=\"virtualScroll\"\n  (blur)=\"blurEvent.emit($event)\"\n  (focus)=\"focusEvent.emit($event)\"\n  (change)=\"changeEvent.emit($event)\"\n  (open)=\"openChange()\"\n  (close)=\"closeEvent.emit()\"\n  (search)=\"searchEvent.emit($event)\"\n  (clear)=\"clearEvent.emit($event)\"\n  (add)=\"addEvent.emit($event)\"\n  (remove)=\"removeEvent.emit($event)\"\n  (scroll)=\"scroll.emit($event)\"\n  (scrollToEnd)=\"scrollToEnd.emit()\">\n\n  @if (optionTemplate) {\n    <ng-template ng-option-tmp let-item=\"item\" let-item$=\"item$\" let-index=\"index\"\n      let-searchTerm=\"searchTerm\">\n      <ng-template [ngTemplateOutlet]=\"optionTemplate\"\n        [ngTemplateOutletContext]=\"{ item: item, item$: item$, index: index, searchTerm: searchTerm }\">\n      </ng-template>\n    </ng-template>\n  }\n\n  @if (optgroupTemplate) {\n    <ng-template ng-optgroup-tmp let-item=\"item\" let-item$=\"item$\" let-index=\"index\"\n      let-searchTerm=\"searchTerm\">\n      <ng-template [ngTemplateOutlet]=\"optgroupTemplate\"\n        [ngTemplateOutletContext]=\"{ item: item, item$: item$, index: index, searchTerm: searchTerm }\">\n      </ng-template>\n    </ng-template>\n  }\n\n  @if (labelTemplate) {\n    <ng-template ng-label-tmp let-item=\"item\" let-clear=\"clear\" let-label=\"label\">\n      <ng-template [ngTemplateOutlet]=\"labelTemplate\"\n        [ngTemplateOutletContext]=\"{ item: item, clear: clear, label: label }\">\n      </ng-template>\n    </ng-template>\n  }\n\n  @if (multiLabelTemplate) {\n    <ng-template ng-multi-label-tmp let-items=\"items\" let-clear=\"clear\">\n      <ng-template [ngTemplateOutlet]=\"multiLabelTemplate\"\n        [ngTemplateOutletContext]=\"{ items: items, clear: clear }\">\n      </ng-template>\n    </ng-template>\n  }\n\n  @if (headerTemplate) {\n    <ng-template ng-header-tmp>\n      <ng-template [ngTemplateOutlet]=\"headerTemplate\"></ng-template>\n    </ng-template>\n  }\n\n  @if (footerTemplate) {\n    <ng-template ng-footer-tmp>\n      <ng-template [ngTemplateOutlet]=\"footerTemplate\"></ng-template>\n    </ng-template>\n  }\n\n  @if (notFoundTemplate) {\n    <ng-template ng-notfound-tmp let-searchTerm=\"searchTerm\">\n      <ng-template [ngTemplateOutlet]=\"notFoundTemplate\"\n        [ngTemplateOutletContext]=\"{ searchTerm: searchTerm }\">\n      </ng-template>\n    </ng-template>\n  }\n\n  @if (typeToSearchTemplate) {\n    <ng-template ng-typetosearch-tmp>\n      <ng-template [ngTemplateOutlet]=\"typeToSearchTemplate\"></ng-template>\n    </ng-template>\n  }\n\n  @if (loadingTextTemplate) {\n    <ng-template ng-loadingtext-tmp let-searchTerm=\"searchTerm\">\n      <ng-template [ngTemplateOutlet]=\"loadingTextTemplate\"\n        [ngTemplateOutletContext]=\"{ searchTerm: searchTerm }\">\n      </ng-template>\n    </ng-template>\n  }\n\n  @if (tagTemplate) {\n    <ng-template ng-tag-tmp let-searchTerm=\"searchTerm\">\n      <ng-template [ngTemplateOutlet]=\"tagTemplate\"\n        [ngTemplateOutletContext]=\"{ searchTerm: searchTerm }\">\n      </ng-template>\n    </ng-template>\n  }\n\n  @if (loadingSpinnerTemplate) {\n    <ng-template ng-loadingspinner-tmp>\n      <ng-template [ngTemplateOutlet]=\"loadingSpinnerTemplate\"></ng-template>\n    </ng-template>\n  }\n\n</ng-select>\n", styles: [".ng-select{padding:var(--mat-form-field-filled-with-label-container-padding-top) 16px var(--mat-form-field-filled-with-label-container-padding-bottom);margin:calc(var(--mat-form-field-filled-with-label-container-padding-top) * -1) -16px calc(var(--mat-form-field-filled-with-label-container-padding-bottom) * -1)}.mdc-text-field--outlined .ng-select,.mdc-text-field--no-label .ng-select{padding-top:var(--mat-form-field-container-vertical-padding);padding-bottom:var(--mat-form-field-container-vertical-padding);margin-top:calc(var(--mat-form-field-container-vertical-padding) * -1);margin-bottom:calc(var(--mat-form-field-container-vertical-padding) * -1)}.ng-select .ng-select-container{align-items:center;color:var(--mtx-select-container-text-color)}.ng-select .ng-select-container .ng-value-container{align-items:center}.ng-select .ng-select-container .ng-value-container .ng-input>input{padding:0;color:inherit;font:inherit}.ng-select .ng-select-container .ng-clear-wrapper{width:24px;text-align:center}.ng-select .ng-placeholder{transition:opacity .2s;opacity:1;color:var(--mtx-select-placeholder-text-color)}.mat-form-field-hide-placeholder .ng-select .ng-placeholder{opacity:0}.ng-select .ng-has-value .ng-placeholder{display:none}.ng-select .ng-clear-wrapper{color:var(--mtx-select-clear-icon-color)}.ng-select .ng-clear-wrapper:hover .ng-clear{color:var(--mtx-select-clear-icon-hover-color)}.ng-select.ng-select-disabled .ng-value{color:var(--mtx-select-disabled-text-color)}.ng-select.ng-select-opened .ng-arrow-wrapper .ng-arrow{top:-2px;border-width:0 5px 5px}.ng-select.ng-select-single.ng-select-filtered .ng-placeholder{display:initial;visibility:hidden}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value{margin:2px 4px 2px 0;border-radius:16px;font-size:.875em;line-height:18px;background-color:var(--mtx-select-multiple-value-background-color);border:1px solid var(--mtx-select-multiple-value-outline-color)}[dir=rtl] .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value{margin-right:auto;margin-left:4px}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value.ng-value-disabled{opacity:.4}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value .ng-value-label{display:inline-block;margin:0 8px}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value .ng-value-icon{display:inline-block;width:18px;height:18px;border-radius:100%;text-align:center}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value .ng-value-icon.left{margin-right:-4px}[dir=rtl] .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value .ng-value-icon.left{margin-left:-4px;margin-right:auto}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value .ng-value-icon.right{margin-left:-4px}[dir=rtl] .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value .ng-value-icon.right{margin-right:-4px;margin-left:auto}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value .ng-value-icon:hover{background-color:var(--mtx-select-multiple-value-icon-hover-background-color)}.ng-select .ng-arrow-wrapper{width:10px}.ng-select .ng-arrow{border-width:5px 5px 2px;border-style:solid;border-color:var(--mtx-select-enabled-arrow-color) transparent transparent}.ng-select.ng-select-disabled .ng-arrow{border-color:var(--mtx-select-disabled-arrow-color) transparent transparent}.ng-select.ng-select-invalid .ng-arrow{border-color:var(--mtx-select-invalid-arrow-color) transparent transparent}.ng-select.ng-select-opened .ng-arrow{border-color:transparent transparent var(--mtx-select-enabled-arrow-color)}.ng-select.ng-select-opened.ng-select-invalid .ng-arrow{border-color:transparent transparent var(--mtx-select-invalid-arrow-color)}.ng-dropdown-panel{background-color:var(--mtx-select-panel-background-color)}.ng-dropdown-panel.ng-select-bottom{top:100%;border-bottom-left-radius:var(--mtx-select-container-shape);border-bottom-right-radius:var(--mtx-select-container-shape);box-shadow:var(--mtx-select-container-elevation-shadow)}.ng-dropdown-panel.ng-select-top{bottom:100%;border-top-left-radius:var(--mtx-select-container-shape);border-top-right-radius:var(--mtx-select-container-shape);box-shadow:var(--mtx-select-container-elevation-shadow)}.ng-dropdown-panel .ng-dropdown-header,.ng-dropdown-panel .ng-dropdown-footer{padding:14px 16px}.ng-dropdown-panel .ng-dropdown-header{border-bottom:1px solid var(--mtx-select-panel-divider-color)}.ng-dropdown-panel .ng-dropdown-footer{border-top:1px solid var(--mtx-select-panel-divider-color)}.ng-dropdown-panel .ng-dropdown-panel-items .ng-optgroup{padding:14px 16px;font-weight:500;-webkit-user-select:none;user-select:none;cursor:pointer;color:var(--mtx-select-optgroup-label-text-color)}.ng-dropdown-panel .ng-dropdown-panel-items .ng-optgroup.ng-option-disabled{cursor:default}.ng-dropdown-panel .ng-dropdown-panel-items .ng-optgroup.ng-option-marked{background-color:var(--mtx-select-option-hover-state-background-color)}.ng-dropdown-panel .ng-dropdown-panel-items .ng-optgroup.ng-option-selected{background-color:var(--mtx-select-option-selected-state-background-color);color:var(--mtx-select-option-selected-state-text-color)}.ng-dropdown-panel .ng-dropdown-panel-items .ng-option{position:relative;padding:14px 16px;text-overflow:ellipsis;text-decoration:none;text-align:left;white-space:nowrap;overflow:hidden;color:var(--mtx-select-option-label-text-color)}.ng-dropdown-panel .ng-dropdown-panel-items .ng-option.ng-option-marked{background-color:var(--mtx-select-option-hover-state-background-color)}.ng-dropdown-panel .ng-dropdown-panel-items .ng-option.ng-option-selected{background-color:var(--mtx-select-option-selected-state-background-color);color:var(--mtx-select-option-selected-state-text-color)}.ng-dropdown-panel .ng-dropdown-panel-items .ng-option.ng-option-disabled{color:var(--mtx-select-option-disabled-state-text-color)}[dir=rtl] .ng-dropdown-panel .ng-dropdown-panel-items .ng-option{text-align:right}.ng-dropdown-panel .ng-dropdown-panel-items .ng-option.ng-option-child{padding-left:32px}[dir=rtl] .ng-dropdown-panel .ng-dropdown-panel-items .ng-option.ng-option-child{padding-right:32px;padding-left:0}.ng-dropdown-panel .ng-dropdown-panel-items .ng-option .ng-tag-label{margin-right:6px;font-size:80%}[dir=rtl] .ng-dropdown-panel .ng-dropdown-panel-items .ng-option .ng-tag-label{margin-left:6px;margin-right:0}\n"], dependencies: [{ kind: "ngmodule", type: NgSelectModule }, { kind: "component", type: i4.NgSelectComponent, selector: "ng-select", inputs: ["bindLabel", "bindValue", "markFirst", "placeholder", "notFoundText", "typeToSearchText", "addTagText", "loadingText", "clearAllText", "appearance", "dropdownPosition", "appendTo", "loading", "closeOnSelect", "hideSelected", "selectOnTab", "openOnEnter", "maxSelectedItems", "groupBy", "groupValue", "bufferAmount", "virtualScroll", "selectableGroup", "selectableGroupAsModel", "searchFn", "trackByFn", "clearOnBackspace", "labelForId", "inputAttrs", "tabIndex", "readonly", "searchWhileComposing", "minTermLength", "editableSearchTerm", "keyDownFn", "typeahead", "multiple", "addTag", "searchable", "clearable", "isOpen", "items", "compareWith", "clearSearchOnAdd", "deselectOnClick"], outputs: ["blur", "focus", "change", "open", "close", "search", "clear", "add", "remove", "scroll", "scrollToEnd"] }, { kind: "directive", type: i4.NgOptgroupTemplateDirective, selector: "[ng-optgroup-tmp]" }, { kind: "directive", type: i4.NgOptionTemplateDirective, selector: "[ng-option-tmp]" }, { kind: "directive", type: i4.NgLabelTemplateDirective, selector: "[ng-label-tmp]" }, { kind: "directive", type: i4.NgMultiLabelTemplateDirective, selector: "[ng-multi-label-tmp]" }, { kind: "directive", type: i4.NgHeaderTemplateDirective, selector: "[ng-header-tmp]" }, { kind: "directive", type: i4.NgFooterTemplateDirective, selector: "[ng-footer-tmp]" }, { kind: "directive", type: i4.NgNotFoundTemplateDirective, selector: "[ng-notfound-tmp]" }, { kind: "directive", type: i4.NgTypeToSearchTemplateDirective, selector: "[ng-typetosearch-tmp]" }, { kind: "directive", type: i4.NgLoadingTextTemplateDirective, selector: "[ng-loadingtext-tmp]" }, { kind: "directive", type: i4.NgTagTemplateDirective, selector: "[ng-tag-tmp]" }, { kind: "directive", type: i4.NgLoadingSpinnerTemplateDirective, selector: "[ng-loadingspinner-tmp]" }, { kind: "ngmodule", type: FormsModule }, { kind: "directive", type: i3.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i3.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "directive", type: NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxSelect, decorators: [{
            type: Component,
            args: [{ selector: 'mtx-select', exportAs: 'mtxSelect', host: {
                        'role': 'combobox',
                        'aria-autocomplete': 'none',
                        '[attr.id]': 'id',
                        '[attr.aria-expanded]': 'panelOpen',
                        '[attr.aria-label]': 'ariaLabel || null',
                        '[attr.aria-labelledby]': '_getAriaLabelledby()',
                        '[attr.aria-describedby]': '_ariaDescribedby || null',
                        '[attr.aria-required]': 'required.toString()',
                        '[attr.aria-disabled]': 'disabled.toString()',
                        '[attr.aria-invalid]': 'errorState',
                        '[class.mtx-select-floating]': 'shouldLabelFloat',
                        '[class.mtx-select-disabled]': 'disabled',
                        '[class.mtx-select-invalid]': 'errorState',
                        '[class.mtx-select-required]': 'required',
                        '[class.mtx-select-empty]': 'empty',
                        '[class.mtx-select-multiple]': 'multiple',
                        'class': 'mtx-select',
                    }, encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, providers: [{ provide: MatFormFieldControl, useExisting: MtxSelect }], standalone: true, imports: [NgSelectModule, FormsModule, NgTemplateOutlet], template: "<ng-select #ngSelect\n  [class.ng-select-invalid]=\"errorState\"\n  [(ngModel)]=\"value\"\n  [ngModelOptions]=\"{standalone: true}\"\n  [placeholder]=\"placeholder\"\n  [items]=\"items\"\n  [addTag]=\"addTag\"\n  [addTagText]=\"addTagText\"\n  [appendTo]=\"appendTo\"\n  [appearance]=\"appearance\"\n  [bindLabel]=\"bindLabel!\"\n  [bindValue]=\"bindValue!\"\n  [closeOnSelect]=\"closeOnSelect\"\n  [clearAllText]=\"clearAllText\"\n  [clearable]=\"clearable\"\n  [clearOnBackspace]=\"clearOnBackspace\"\n  [dropdownPosition]=\"dropdownPosition\"\n  [groupBy]=\"groupBy\"\n  [groupValue]=\"groupValue\"\n  [bufferAmount]=\"bufferAmount\"\n  [hideSelected]=\"hideSelected\"\n  [inputAttrs]=\"inputAttrs\"\n  [loading]=\"loading\"\n  [loadingText]=\"loadingText\"\n  [labelForId]=\"labelForId\"\n  [markFirst]=\"markFirst\"\n  [maxSelectedItems]=\"maxSelectedItems\"\n  [multiple]=\"multiple\"\n  [notFoundText]=\"notFoundText\"\n  [readonly]=\"readonly || disabled\"\n  [typeahead]=\"typeahead\"\n  [typeToSearchText]=\"typeToSearchText\"\n  [trackByFn]=\"trackByFn\"\n  [searchable]=\"searchable\"\n  [searchFn]=\"searchFn\"\n  [searchWhileComposing]=\"searchWhileComposing\"\n  [clearSearchOnAdd]=\"clearSearchOnAdd\"\n  [selectableGroup]=\"selectableGroup\"\n  [selectableGroupAsModel]=\"selectableGroupAsModel\"\n  [selectOnTab]=\"selectOnTab\"\n  [tabIndex]=\"tabIndex\"\n  [openOnEnter]=\"openOnEnter\"\n  [minTermLength]=\"minTermLength\"\n  [editableSearchTerm]=\"editableSearchTerm\"\n  [keyDownFn]=\"keyDownFn\"\n  [virtualScroll]=\"virtualScroll\"\n  (blur)=\"blurEvent.emit($event)\"\n  (focus)=\"focusEvent.emit($event)\"\n  (change)=\"changeEvent.emit($event)\"\n  (open)=\"openChange()\"\n  (close)=\"closeEvent.emit()\"\n  (search)=\"searchEvent.emit($event)\"\n  (clear)=\"clearEvent.emit($event)\"\n  (add)=\"addEvent.emit($event)\"\n  (remove)=\"removeEvent.emit($event)\"\n  (scroll)=\"scroll.emit($event)\"\n  (scrollToEnd)=\"scrollToEnd.emit()\">\n\n  @if (optionTemplate) {\n    <ng-template ng-option-tmp let-item=\"item\" let-item$=\"item$\" let-index=\"index\"\n      let-searchTerm=\"searchTerm\">\n      <ng-template [ngTemplateOutlet]=\"optionTemplate\"\n        [ngTemplateOutletContext]=\"{ item: item, item$: item$, index: index, searchTerm: searchTerm }\">\n      </ng-template>\n    </ng-template>\n  }\n\n  @if (optgroupTemplate) {\n    <ng-template ng-optgroup-tmp let-item=\"item\" let-item$=\"item$\" let-index=\"index\"\n      let-searchTerm=\"searchTerm\">\n      <ng-template [ngTemplateOutlet]=\"optgroupTemplate\"\n        [ngTemplateOutletContext]=\"{ item: item, item$: item$, index: index, searchTerm: searchTerm }\">\n      </ng-template>\n    </ng-template>\n  }\n\n  @if (labelTemplate) {\n    <ng-template ng-label-tmp let-item=\"item\" let-clear=\"clear\" let-label=\"label\">\n      <ng-template [ngTemplateOutlet]=\"labelTemplate\"\n        [ngTemplateOutletContext]=\"{ item: item, clear: clear, label: label }\">\n      </ng-template>\n    </ng-template>\n  }\n\n  @if (multiLabelTemplate) {\n    <ng-template ng-multi-label-tmp let-items=\"items\" let-clear=\"clear\">\n      <ng-template [ngTemplateOutlet]=\"multiLabelTemplate\"\n        [ngTemplateOutletContext]=\"{ items: items, clear: clear }\">\n      </ng-template>\n    </ng-template>\n  }\n\n  @if (headerTemplate) {\n    <ng-template ng-header-tmp>\n      <ng-template [ngTemplateOutlet]=\"headerTemplate\"></ng-template>\n    </ng-template>\n  }\n\n  @if (footerTemplate) {\n    <ng-template ng-footer-tmp>\n      <ng-template [ngTemplateOutlet]=\"footerTemplate\"></ng-template>\n    </ng-template>\n  }\n\n  @if (notFoundTemplate) {\n    <ng-template ng-notfound-tmp let-searchTerm=\"searchTerm\">\n      <ng-template [ngTemplateOutlet]=\"notFoundTemplate\"\n        [ngTemplateOutletContext]=\"{ searchTerm: searchTerm }\">\n      </ng-template>\n    </ng-template>\n  }\n\n  @if (typeToSearchTemplate) {\n    <ng-template ng-typetosearch-tmp>\n      <ng-template [ngTemplateOutlet]=\"typeToSearchTemplate\"></ng-template>\n    </ng-template>\n  }\n\n  @if (loadingTextTemplate) {\n    <ng-template ng-loadingtext-tmp let-searchTerm=\"searchTerm\">\n      <ng-template [ngTemplateOutlet]=\"loadingTextTemplate\"\n        [ngTemplateOutletContext]=\"{ searchTerm: searchTerm }\">\n      </ng-template>\n    </ng-template>\n  }\n\n  @if (tagTemplate) {\n    <ng-template ng-tag-tmp let-searchTerm=\"searchTerm\">\n      <ng-template [ngTemplateOutlet]=\"tagTemplate\"\n        [ngTemplateOutletContext]=\"{ searchTerm: searchTerm }\">\n      </ng-template>\n    </ng-template>\n  }\n\n  @if (loadingSpinnerTemplate) {\n    <ng-template ng-loadingspinner-tmp>\n      <ng-template [ngTemplateOutlet]=\"loadingSpinnerTemplate\"></ng-template>\n    </ng-template>\n  }\n\n</ng-select>\n", styles: [".ng-select{padding:var(--mat-form-field-filled-with-label-container-padding-top) 16px var(--mat-form-field-filled-with-label-container-padding-bottom);margin:calc(var(--mat-form-field-filled-with-label-container-padding-top) * -1) -16px calc(var(--mat-form-field-filled-with-label-container-padding-bottom) * -1)}.mdc-text-field--outlined .ng-select,.mdc-text-field--no-label .ng-select{padding-top:var(--mat-form-field-container-vertical-padding);padding-bottom:var(--mat-form-field-container-vertical-padding);margin-top:calc(var(--mat-form-field-container-vertical-padding) * -1);margin-bottom:calc(var(--mat-form-field-container-vertical-padding) * -1)}.ng-select .ng-select-container{align-items:center;color:var(--mtx-select-container-text-color)}.ng-select .ng-select-container .ng-value-container{align-items:center}.ng-select .ng-select-container .ng-value-container .ng-input>input{padding:0;color:inherit;font:inherit}.ng-select .ng-select-container .ng-clear-wrapper{width:24px;text-align:center}.ng-select .ng-placeholder{transition:opacity .2s;opacity:1;color:var(--mtx-select-placeholder-text-color)}.mat-form-field-hide-placeholder .ng-select .ng-placeholder{opacity:0}.ng-select .ng-has-value .ng-placeholder{display:none}.ng-select .ng-clear-wrapper{color:var(--mtx-select-clear-icon-color)}.ng-select .ng-clear-wrapper:hover .ng-clear{color:var(--mtx-select-clear-icon-hover-color)}.ng-select.ng-select-disabled .ng-value{color:var(--mtx-select-disabled-text-color)}.ng-select.ng-select-opened .ng-arrow-wrapper .ng-arrow{top:-2px;border-width:0 5px 5px}.ng-select.ng-select-single.ng-select-filtered .ng-placeholder{display:initial;visibility:hidden}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value{margin:2px 4px 2px 0;border-radius:16px;font-size:.875em;line-height:18px;background-color:var(--mtx-select-multiple-value-background-color);border:1px solid var(--mtx-select-multiple-value-outline-color)}[dir=rtl] .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value{margin-right:auto;margin-left:4px}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value.ng-value-disabled{opacity:.4}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value .ng-value-label{display:inline-block;margin:0 8px}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value .ng-value-icon{display:inline-block;width:18px;height:18px;border-radius:100%;text-align:center}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value .ng-value-icon.left{margin-right:-4px}[dir=rtl] .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value .ng-value-icon.left{margin-left:-4px;margin-right:auto}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value .ng-value-icon.right{margin-left:-4px}[dir=rtl] .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value .ng-value-icon.right{margin-right:-4px;margin-left:auto}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value .ng-value-icon:hover{background-color:var(--mtx-select-multiple-value-icon-hover-background-color)}.ng-select .ng-arrow-wrapper{width:10px}.ng-select .ng-arrow{border-width:5px 5px 2px;border-style:solid;border-color:var(--mtx-select-enabled-arrow-color) transparent transparent}.ng-select.ng-select-disabled .ng-arrow{border-color:var(--mtx-select-disabled-arrow-color) transparent transparent}.ng-select.ng-select-invalid .ng-arrow{border-color:var(--mtx-select-invalid-arrow-color) transparent transparent}.ng-select.ng-select-opened .ng-arrow{border-color:transparent transparent var(--mtx-select-enabled-arrow-color)}.ng-select.ng-select-opened.ng-select-invalid .ng-arrow{border-color:transparent transparent var(--mtx-select-invalid-arrow-color)}.ng-dropdown-panel{background-color:var(--mtx-select-panel-background-color)}.ng-dropdown-panel.ng-select-bottom{top:100%;border-bottom-left-radius:var(--mtx-select-container-shape);border-bottom-right-radius:var(--mtx-select-container-shape);box-shadow:var(--mtx-select-container-elevation-shadow)}.ng-dropdown-panel.ng-select-top{bottom:100%;border-top-left-radius:var(--mtx-select-container-shape);border-top-right-radius:var(--mtx-select-container-shape);box-shadow:var(--mtx-select-container-elevation-shadow)}.ng-dropdown-panel .ng-dropdown-header,.ng-dropdown-panel .ng-dropdown-footer{padding:14px 16px}.ng-dropdown-panel .ng-dropdown-header{border-bottom:1px solid var(--mtx-select-panel-divider-color)}.ng-dropdown-panel .ng-dropdown-footer{border-top:1px solid var(--mtx-select-panel-divider-color)}.ng-dropdown-panel .ng-dropdown-panel-items .ng-optgroup{padding:14px 16px;font-weight:500;-webkit-user-select:none;user-select:none;cursor:pointer;color:var(--mtx-select-optgroup-label-text-color)}.ng-dropdown-panel .ng-dropdown-panel-items .ng-optgroup.ng-option-disabled{cursor:default}.ng-dropdown-panel .ng-dropdown-panel-items .ng-optgroup.ng-option-marked{background-color:var(--mtx-select-option-hover-state-background-color)}.ng-dropdown-panel .ng-dropdown-panel-items .ng-optgroup.ng-option-selected{background-color:var(--mtx-select-option-selected-state-background-color);color:var(--mtx-select-option-selected-state-text-color)}.ng-dropdown-panel .ng-dropdown-panel-items .ng-option{position:relative;padding:14px 16px;text-overflow:ellipsis;text-decoration:none;text-align:left;white-space:nowrap;overflow:hidden;color:var(--mtx-select-option-label-text-color)}.ng-dropdown-panel .ng-dropdown-panel-items .ng-option.ng-option-marked{background-color:var(--mtx-select-option-hover-state-background-color)}.ng-dropdown-panel .ng-dropdown-panel-items .ng-option.ng-option-selected{background-color:var(--mtx-select-option-selected-state-background-color);color:var(--mtx-select-option-selected-state-text-color)}.ng-dropdown-panel .ng-dropdown-panel-items .ng-option.ng-option-disabled{color:var(--mtx-select-option-disabled-state-text-color)}[dir=rtl] .ng-dropdown-panel .ng-dropdown-panel-items .ng-option{text-align:right}.ng-dropdown-panel .ng-dropdown-panel-items .ng-option.ng-option-child{padding-left:32px}[dir=rtl] .ng-dropdown-panel .ng-dropdown-panel-items .ng-option.ng-option-child{padding-right:32px;padding-left:0}.ng-dropdown-panel .ng-dropdown-panel-items .ng-option .ng-tag-label{margin-right:6px;font-size:80%}[dir=rtl] .ng-dropdown-panel .ng-dropdown-panel-items .ng-option .ng-tag-label{margin-left:6px;margin-right:0}\n"] }]
        }], ctorParameters: () => [{ type: i0.ChangeDetectorRef }, { type: i0.ElementRef }, { type: i1.FocusMonitor }, { type: i2.ErrorStateMatcher }, { type: i3.NgForm, decorators: [{
                    type: Optional
                }] }, { type: i3.FormGroupDirective, decorators: [{
                    type: Optional
                }] }, { type: i3.NgControl, decorators: [{
                    type: Optional
                }, {
                    type: Self
                }] }, { type: i5.MatFormField, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_FORM_FIELD]
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MTX_SELECT_DEFAULT_OPTIONS]
                }] }], propDecorators: { ngSelect: [{
                type: ViewChild,
                args: ['ngSelect', { static: true }]
            }], optionTemplate: [{
                type: ContentChild,
                args: [MtxSelectOptionTemplate, { read: TemplateRef }]
            }], optgroupTemplate: [{
                type: ContentChild,
                args: [MtxSelectOptgroupTemplate, { read: TemplateRef }]
            }], labelTemplate: [{
                type: ContentChild,
                args: [MtxSelectLabelTemplate, { read: TemplateRef }]
            }], multiLabelTemplate: [{
                type: ContentChild,
                args: [MtxSelectMultiLabelTemplate, { read: TemplateRef }]
            }], headerTemplate: [{
                type: ContentChild,
                args: [MtxSelectHeaderTemplate, { read: TemplateRef }]
            }], footerTemplate: [{
                type: ContentChild,
                args: [MtxSelectFooterTemplate, { read: TemplateRef }]
            }], notFoundTemplate: [{
                type: ContentChild,
                args: [MtxSelectNotFoundTemplate, { read: TemplateRef }]
            }], typeToSearchTemplate: [{
                type: ContentChild,
                args: [MtxSelectTypeToSearchTemplate, { read: TemplateRef }]
            }], loadingTextTemplate: [{
                type: ContentChild,
                args: [MtxSelectLoadingTextTemplate, { read: TemplateRef }]
            }], tagTemplate: [{
                type: ContentChild,
                args: [MtxSelectTagTemplate, { read: TemplateRef }]
            }], loadingSpinnerTemplate: [{
                type: ContentChild,
                args: [MtxSelectLoadingSpinnerTemplate, { read: TemplateRef }]
            }], mtxOptions: [{
                type: ContentChildren,
                args: [MtxOption, { descendants: true }]
            }], addTag: [{
                type: Input
            }], addTagText: [{
                type: Input
            }], appearance: [{
                type: Input
            }], appendTo: [{
                type: Input
            }], bindLabel: [{
                type: Input
            }], bindValue: [{
                type: Input
            }], closeOnSelect: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], clearAllText: [{
                type: Input
            }], clearable: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], clearOnBackspace: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], compareWith: [{
                type: Input
            }], dropdownPosition: [{
                type: Input
            }], groupBy: [{
                type: Input
            }], groupValue: [{
                type: Input
            }], bufferAmount: [{
                type: Input
            }], selectableGroup: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], selectableGroupAsModel: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], hideSelected: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], loading: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], loadingText: [{
                type: Input
            }], labelForId: [{
                type: Input
            }], markFirst: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], maxSelectedItems: [{
                type: Input
            }], multiple: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], notFoundText: [{
                type: Input
            }], searchable: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], readonly: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], searchFn: [{
                type: Input
            }], searchWhileComposing: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], selectOnTab: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], trackByFn: [{
                type: Input
            }], inputAttrs: [{
                type: Input
            }], tabIndex: [{
                type: Input
            }], openOnEnter: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], minTermLength: [{
                type: Input
            }], editableSearchTerm: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], keyDownFn: [{
                type: Input
            }], virtualScroll: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], typeToSearchText: [{
                type: Input
            }], typeahead: [{
                type: Input
            }], blurEvent: [{
                type: Output,
                args: ['blur']
            }], focusEvent: [{
                type: Output,
                args: ['focus']
            }], changeEvent: [{
                type: Output,
                args: ['change']
            }], openEvent: [{
                type: Output,
                args: ['open']
            }], closeEvent: [{
                type: Output,
                args: ['close']
            }], searchEvent: [{
                type: Output,
                args: ['search']
            }], clearEvent: [{
                type: Output,
                args: ['clear']
            }], addEvent: [{
                type: Output,
                args: ['add']
            }], removeEvent: [{
                type: Output,
                args: ['remove']
            }], scroll: [{
                type: Output,
                args: ['scroll']
            }], scrollToEnd: [{
                type: Output,
                args: ['scrollToEnd']
            }], clearSearchOnAdd: [{
                type: Input
            }], items: [{
                type: Input
            }], value: [{
                type: Input
            }], id: [{
                type: Input
            }], placeholder: [{
                type: Input
            }], disabled: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], required: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], errorStateMatcher: [{
                type: Input
            }], ariaLabel: [{
                type: Input,
                args: ['aria-label']
            }], ariaLabelledby: [{
                type: Input,
                args: ['aria-labelledby']
            }] } });

class MtxSelectModule {
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxSelectModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    /** @nocollapse */ static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.0.1", ngImport: i0, type: MtxSelectModule, imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,
            NgSelectModule,
            MtxSelect,
            MtxOption,
            MtxSelectOptgroupTemplate,
            MtxSelectOptionTemplate,
            MtxSelectLabelTemplate,
            MtxSelectMultiLabelTemplate,
            MtxSelectHeaderTemplate,
            MtxSelectFooterTemplate,
            MtxSelectNotFoundTemplate,
            MtxSelectTypeToSearchTemplate,
            MtxSelectLoadingTextTemplate,
            MtxSelectTagTemplate,
            MtxSelectLoadingSpinnerTemplate], exports: [MtxSelect,
            MtxOption,
            MtxSelectOptgroupTemplate,
            MtxSelectOptionTemplate,
            MtxSelectLabelTemplate,
            MtxSelectMultiLabelTemplate,
            MtxSelectHeaderTemplate,
            MtxSelectFooterTemplate,
            MtxSelectNotFoundTemplate,
            MtxSelectTypeToSearchTemplate,
            MtxSelectLoadingTextTemplate,
            MtxSelectTagTemplate,
            MtxSelectLoadingSpinnerTemplate] }); }
    /** @nocollapse */ static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxSelectModule, imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,
            NgSelectModule,
            MtxSelect] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxSelectModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        FormsModule,
                        ReactiveFormsModule,
                        NgSelectModule,
                        MtxSelect,
                        MtxOption,
                        MtxSelectOptgroupTemplate,
                        MtxSelectOptionTemplate,
                        MtxSelectLabelTemplate,
                        MtxSelectMultiLabelTemplate,
                        MtxSelectHeaderTemplate,
                        MtxSelectFooterTemplate,
                        MtxSelectNotFoundTemplate,
                        MtxSelectTypeToSearchTemplate,
                        MtxSelectLoadingTextTemplate,
                        MtxSelectTagTemplate,
                        MtxSelectLoadingSpinnerTemplate,
                    ],
                    exports: [
                        MtxSelect,
                        MtxOption,
                        MtxSelectOptgroupTemplate,
                        MtxSelectOptionTemplate,
                        MtxSelectLabelTemplate,
                        MtxSelectMultiLabelTemplate,
                        MtxSelectHeaderTemplate,
                        MtxSelectFooterTemplate,
                        MtxSelectNotFoundTemplate,
                        MtxSelectTypeToSearchTemplate,
                        MtxSelectLoadingTextTemplate,
                        MtxSelectTagTemplate,
                        MtxSelectLoadingSpinnerTemplate,
                    ],
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { MTX_SELECT_DEFAULT_OPTIONS, MtxOption, MtxSelect, MtxSelectFooterTemplate, MtxSelectHeaderTemplate, MtxSelectLabelTemplate, MtxSelectLoadingSpinnerTemplate, MtxSelectLoadingTextTemplate, MtxSelectModule, MtxSelectMultiLabelTemplate, MtxSelectNotFoundTemplate, MtxSelectOptgroupTemplate, MtxSelectOptionTemplate, MtxSelectTagTemplate, MtxSelectTypeToSearchTemplate };
//# sourceMappingURL=mtxSelect.mjs.map
