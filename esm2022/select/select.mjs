import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ContentChild, ContentChildren, EventEmitter, Inject, InjectionToken, Input, Optional, Output, Self, TemplateRef, ViewChild, ViewEncapsulation, booleanAttribute, } from '@angular/core';
import { FormsModule, Validators, } from '@angular/forms';
import { _ErrorStateTracker } from '@angular/material/core';
import { MAT_FORM_FIELD, MatFormFieldControl } from '@angular/material/form-field';
import { NgSelectModule } from '@ng-select/ng-select';
import { Subject, merge } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';
import { MtxOption } from './option';
import { MtxSelectFooterTemplate, MtxSelectHeaderTemplate, MtxSelectLabelTemplate, MtxSelectLoadingSpinnerTemplate, MtxSelectLoadingTextTemplate, MtxSelectMultiLabelTemplate, MtxSelectNotFoundTemplate, MtxSelectOptgroupTemplate, MtxSelectOptionTemplate, MtxSelectTagTemplate, MtxSelectTypeToSearchTemplate, } from './templates';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/a11y";
import * as i2 from "@angular/material/core";
import * as i3 from "@angular/forms";
import * as i4 from "@ng-select/ng-select";
import * as i5 from "@angular/material/form-field";
/** Injection token that can be used to specify default select options. */
export const MTX_SELECT_DEFAULT_OPTIONS = new InjectionToken('mtx-select-default-options');
let nextUniqueId = 0;
export class MtxSelect {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvZXh0ZW5zaW9ucy9zZWxlY3Qvc2VsZWN0LnRzIiwiLi4vLi4vLi4vLi4vcHJvamVjdHMvZXh0ZW5zaW9ucy9zZWxlY3Qvc2VsZWN0Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDbkQsT0FBTyxFQUVMLHVCQUF1QixFQUV2QixTQUFTLEVBQ1QsWUFBWSxFQUNaLGVBQWUsRUFHZixZQUFZLEVBQ1osTUFBTSxFQUNOLGNBQWMsRUFDZCxLQUFLLEVBR0wsUUFBUSxFQUNSLE1BQU0sRUFFTixJQUFJLEVBQ0osV0FBVyxFQUNYLFNBQVMsRUFDVCxpQkFBaUIsRUFDakIsZ0JBQWdCLEdBQ2pCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFJTCxXQUFXLEVBR1gsVUFBVSxHQUNYLE1BQU0sZ0JBQWdCLENBQUM7QUFDeEIsT0FBTyxFQUFxQixrQkFBa0IsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQy9FLE9BQU8sRUFBRSxjQUFjLEVBQWdCLG1CQUFtQixFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFDakcsT0FBTyxFQUFxQixjQUFjLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUN6RSxPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUN0QyxPQUFPLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3RELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDckMsT0FBTyxFQUNMLHVCQUF1QixFQUN2Qix1QkFBdUIsRUFDdkIsc0JBQXNCLEVBQ3RCLCtCQUErQixFQUMvQiw0QkFBNEIsRUFDNUIsMkJBQTJCLEVBQzNCLHlCQUF5QixFQUN6Qix5QkFBeUIsRUFDekIsdUJBQXVCLEVBQ3ZCLG9C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U0FBUztzQkFBakIsS0FBSztnQkFFVSxTQUFTO3NCQUF4QixNQUFNO3VCQUFDLE1BQU07Z0JBQ0csVUFBVTtzQkFBMUIsTUFBTTt1QkFBQyxPQUFPO2dCQUNHLFdBQVc7c0JBQTVCLE1BQU07dUJBQUMsUUFBUTtnQkFDQSxTQUFTO3NCQUF4QixNQUFNO3VCQUFDLE1BQU07Z0JBQ0csVUFBVTtzQkFBMUIsTUFBTTt1QkFBQyxPQUFPO2dCQUNHLFdBQVc7c0JBQTVCLE1BQU07dUJBQUMsUUFBUTtnQkFDQyxVQUFVO3NCQUExQixNQUFNO3VCQUFDLE9BQU87Z0JBQ0EsUUFBUTtzQkFBdEIsTUFBTTt1QkFBQyxLQUFLO2dCQUNLLFdBQVc7c0JBQTVCLE1BQU07dUJBQUMsUUFBUTtnQkFDRSxNQUFNO3NCQUF2QixNQUFNO3VCQUFDLFFBQVE7Z0JBQ08sV0FBVztzQkFBakMsTUFBTTt1QkFBQyxhQUFhO2dCQUdqQixnQkFBZ0I7c0JBRG5CLEtBQUs7Z0JBVUYsS0FBSztzQkFEUixLQUFLO2dCQWdCRixLQUFLO3NCQURSLEtBQUs7Z0JBa0JGLEVBQUU7c0JBREwsS0FBSztnQkFlRixXQUFXO3NCQURkLEtBQUs7Z0JBK0JOLFFBQVE7c0JBRFAsS0FBSzt1QkFBQyxFQUFFLFNBQVMsRUFBRSxnQkFBZ0IsRUFBRTtnQkFLbEMsUUFBUTtzQkFEWCxLQUFLO3VCQUFDLEVBQUUsU0FBUyxFQUFFLGdCQUFnQixFQUFFO2dCQVlsQyxpQkFBaUI7c0JBRHBCLEtBQUs7Z0JBU2UsU0FBUztzQkFBN0IsS0FBSzt1QkFBQyxZQUFZO2dCQUdPLGNBQWM7c0JBQXZDLEtBQUs7dUJBQUMsaUJBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRm9jdXNNb25pdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHsgTmdUZW1wbGF0ZU91dGxldCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkLFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIERvQ2hlY2ssXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5qZWN0LFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5wdXQsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPcHRpb25hbCxcbiAgT3V0cHV0LFxuICBRdWVyeUxpc3QsXG4gIFNlbGYsXG4gIFRlbXBsYXRlUmVmLFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBib29sZWFuQXR0cmlidXRlLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIEFic3RyYWN0Q29udHJvbCxcbiAgQ29udHJvbFZhbHVlQWNjZXNzb3IsXG4gIEZvcm1Hcm91cERpcmVjdGl2ZSxcbiAgRm9ybXNNb2R1bGUsXG4gIE5nQ29udHJvbCxcbiAgTmdGb3JtLFxuICBWYWxpZGF0b3JzLFxufSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBFcnJvclN0YXRlTWF0Y2hlciwgX0Vycm9yU3RhdGVUcmFja2VyIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQgeyBNQVRfRk9STV9GSUVMRCwgTWF0Rm9ybUZpZWxkLCBNYXRGb3JtRmllbGRDb250cm9sIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZm9ybS1maWVsZCc7XG5pbXBvcnQgeyBOZ1NlbGVjdENvbXBvbmVudCwgTmdTZWxlY3RNb2R1bGUgfSBmcm9tICdAbmctc2VsZWN0L25nLXNlbGVjdCc7XG5pbXBvcnQgeyBTdWJqZWN0LCBtZXJnZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgc3RhcnRXaXRoLCB0YWtlVW50aWwgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBNdHhPcHRpb24gfSBmcm9tICcuL29wdGlvbic7XG5pbXBvcnQge1xuICBNdHhTZWxlY3RGb290ZXJUZW1wbGF0ZSxcbiAgTXR4U2VsZWN0SGVhZGVyVGVtcGxhdGUsXG4gIE10eFNlbGVjdExhYmVsVGVtcGxhdGUsXG4gIE10eFNlbGVjdExvYWRpbmdTcGlubmVyVGVtcGxhdGUsXG4gIE10eFNlbGVjdExvYWRpbmdUZXh0VGVtcGxhdGUsXG4gIE10eFNlbGVjdE11bHRpTGFiZWxUZW1wbGF0ZSxcbiAgTXR4U2VsZWN0Tm90Rm91bmRUZW1wbGF0ZSxcbiAgTXR4U2VsZWN0T3B0Z3JvdXBUZW1wbGF0ZSxcbiAgTXR4U2VsZWN0T3B0aW9uVGVtcGxhdGUsXG4gIE10eFNlbGVjdFRhZ1RlbXBsYXRlLFxuICBNdHhTZWxlY3RUeXBlVG9TZWFyY2hUZW1wbGF0ZSxcbn0gZnJvbSAnLi90ZW1wbGF0ZXMnO1xuXG5leHBvcnQgdHlwZSBEcm9wZG93blBvc2l0aW9uID0gJ2JvdHRvbScgfCAndG9wJyB8ICdhdXRvJztcbmV4cG9ydCB0eXBlIEFkZFRhZ0ZuID0gKHRlcm06IHN0cmluZykgPT4gYW55O1xuZXhwb3J0IHR5cGUgQ29tcGFyZVdpdGhGbiA9IChhOiBhbnksIGI6IGFueSkgPT4gYm9vbGVhbjtcbmV4cG9ydCB0eXBlIEdyb3VwVmFsdWVGbiA9IChcbiAga2V5OiBzdHJpbmcgfCBSZWNvcmQ8c3RyaW5nLCBhbnk+LFxuICBjaGlsZHJlbjogYW55W11cbikgPT4gc3RyaW5nIHwgUmVjb3JkPHN0cmluZywgYW55PjtcbmV4cG9ydCB0eXBlIFNlYXJjaEZuID0gKHRlcm06IHN0cmluZywgaXRlbTogYW55KSA9PiBib29sZWFuO1xuZXhwb3J0IHR5cGUgVHJhY2tCeUZuID0gKGl0ZW06IGFueSkgPT4gYW55O1xuXG4vKipcbiAqIFJlcHJlc2VudHMgdGhlIGRlZmF1bHQgb3B0aW9ucyBmb3IgdGhlIHNlbGVjdCB0aGF0IGNhbiBiZSBjb25maWd1cmVkXG4gKiB1c2luZyB0aGUgYE1UWF9TRUxFQ1RfREVGQVVMVF9PUFRJT05TYCBpbmplY3Rpb24gdG9rZW4uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTXR4U2VsZWN0RGVmYXVsdE9wdGlvbnMge1xuICBwbGFjZWhvbGRlcj86IHN0cmluZztcbiAgbm90Rm91bmRUZXh0Pzogc3RyaW5nO1xuICB0eXBlVG9TZWFyY2hUZXh0Pzogc3RyaW5nO1xuICBhZGRUYWdUZXh0Pzogc3RyaW5nO1xuICBsb2FkaW5nVGV4dD86IHN0cmluZztcbiAgY2xlYXJBbGxUZXh0Pzogc3RyaW5nO1xuICBhcHBlbmRUbz86IHN0cmluZztcbiAgYmluZFZhbHVlPzogc3RyaW5nO1xuICBiaW5kTGFiZWw/OiBzdHJpbmc7XG4gIG9wZW5PbkVudGVyPzogYm9vbGVhbjtcbiAgY2xlYXJTZWFyY2hPbkFkZD86IGJvb2xlYW47XG59XG5cbi8qKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBjYW4gYmUgdXNlZCB0byBzcGVjaWZ5IGRlZmF1bHQgc2VsZWN0IG9wdGlvbnMuICovXG5leHBvcnQgY29uc3QgTVRYX1NFTEVDVF9ERUZBVUxUX09QVElPTlMgPSBuZXcgSW5qZWN0aW9uVG9rZW48TXR4U2VsZWN0RGVmYXVsdE9wdGlvbnM+KFxuICAnbXR4LXNlbGVjdC1kZWZhdWx0LW9wdGlvbnMnXG4pO1xuXG5sZXQgbmV4dFVuaXF1ZUlkID0gMDtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbXR4LXNlbGVjdCcsXG4gIGV4cG9ydEFzOiAnbXR4U2VsZWN0JyxcbiAgaG9zdDoge1xuICAgICdyb2xlJzogJ2NvbWJvYm94JyxcbiAgICAnYXJpYS1hdXRvY29tcGxldGUnOiAnbm9uZScsXG4gICAgJ1thdHRyLmlkXSc6ICdpZCcsXG4gICAgJ1thdHRyLmFyaWEtZXhwYW5kZWRdJzogJ3BhbmVsT3BlbicsXG4gICAgJ1thdHRyLmFyaWEtbGFiZWxdJzogJ2FyaWFMYWJlbCB8fCBudWxsJyxcbiAgICAnW2F0dHIuYXJpYS1sYWJlbGxlZGJ5XSc6ICdfZ2V0QXJpYUxhYmVsbGVkYnkoKScsXG4gICAgJ1thdHRyLmFyaWEtZGVzY3JpYmVkYnldJzogJ19hcmlhRGVzY3JpYmVkYnkgfHwgbnVsbCcsXG4gICAgJ1thdHRyLmFyaWEtcmVxdWlyZWRdJzogJ3JlcXVpcmVkLnRvU3RyaW5nKCknLFxuICAgICdbYXR0ci5hcmlhLWRpc2FibGVkXSc6ICdkaXNhYmxlZC50b1N0cmluZygpJyxcbiAgICAnW2F0dHIuYXJpYS1pbnZhbGlkXSc6ICdlcnJvclN0YXRlJyxcbiAgICAnW2NsYXNzLm10eC1zZWxlY3QtZmxvYXRpbmddJzogJ3Nob3VsZExhYmVsRmxvYXQnLFxuICAgICdbY2xhc3MubXR4LXNlbGVjdC1kaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICAgICdbY2xhc3MubXR4LXNlbGVjdC1pbnZhbGlkXSc6ICdlcnJvclN0YXRlJyxcbiAgICAnW2NsYXNzLm10eC1zZWxlY3QtcmVxdWlyZWRdJzogJ3JlcXVpcmVkJyxcbiAgICAnW2NsYXNzLm10eC1zZWxlY3QtZW1wdHldJzogJ2VtcHR5JyxcbiAgICAnW2NsYXNzLm10eC1zZWxlY3QtbXVsdGlwbGVdJzogJ211bHRpcGxlJyxcbiAgICAnY2xhc3MnOiAnbXR4LXNlbGVjdCcsXG4gIH0sXG4gIHRlbXBsYXRlVXJsOiAnLi9zZWxlY3QuaHRtbCcsXG4gIHN0eWxlVXJsOiAnLi9zZWxlY3Quc2NzcycsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBwcm92aWRlcnM6IFt7IHByb3ZpZGU6IE1hdEZvcm1GaWVsZENvbnRyb2wsIHVzZUV4aXN0aW5nOiBNdHhTZWxlY3QgfV0sXG4gIHN0YW5kYWxvbmU6IHRydWUsXG4gIGltcG9ydHM6IFtOZ1NlbGVjdE1vZHVsZSwgRm9ybXNNb2R1bGUsIE5nVGVtcGxhdGVPdXRsZXRdLFxufSlcbmV4cG9ydCBjbGFzcyBNdHhTZWxlY3RcbiAgaW1wbGVtZW50c1xuICAgIE9uSW5pdCxcbiAgICBPbkRlc3Ryb3ksXG4gICAgRG9DaGVjayxcbiAgICBBZnRlclZpZXdJbml0LFxuICAgIENvbnRyb2xWYWx1ZUFjY2Vzc29yLFxuICAgIE1hdEZvcm1GaWVsZENvbnRyb2w8YW55Plxue1xuICBAVmlld0NoaWxkKCduZ1NlbGVjdCcsIHsgc3RhdGljOiB0cnVlIH0pIG5nU2VsZWN0ITogTmdTZWxlY3RDb21wb25lbnQ7XG5cbiAgQENvbnRlbnRDaGlsZChNdHhTZWxlY3RPcHRpb25UZW1wbGF0ZSwgeyByZWFkOiBUZW1wbGF0ZVJlZiB9KVxuICBvcHRpb25UZW1wbGF0ZSE6IFRlbXBsYXRlUmVmPGFueT47XG4gIEBDb250ZW50Q2hpbGQoTXR4U2VsZWN0T3B0Z3JvdXBUZW1wbGF0ZSwgeyByZWFkOiBUZW1wbGF0ZVJlZiB9KVxuICBvcHRncm91cFRlbXBsYXRlITogVGVtcGxhdGVSZWY8YW55PjtcbiAgQENvbnRlbnRDaGlsZChNdHhTZWxlY3RMYWJlbFRlbXBsYXRlLCB7IHJlYWQ6IFRlbXBsYXRlUmVmIH0pXG4gIGxhYmVsVGVtcGxhdGUhOiBUZW1wbGF0ZVJlZjxhbnk+O1xuICBAQ29udGVudENoaWxkKE10eFNlbGVjdE11bHRpTGFiZWxUZW1wbGF0ZSwgeyByZWFkOiBUZW1wbGF0ZVJlZiB9KVxuICBtdWx0aUxhYmVsVGVtcGxhdGUhOiBUZW1wbGF0ZVJlZjxhbnk+O1xuICBAQ29udGVudENoaWxkKE10eFNlbGVjdEhlYWRlclRlbXBsYXRlLCB7IHJlYWQ6IFRlbXBsYXRlUmVmIH0pXG4gIGhlYWRlclRlbXBsYXRlITogVGVtcGxhdGVSZWY8YW55PjtcbiAgQENvbnRlbnRDaGlsZChNdHhTZWxlY3RGb290ZXJUZW1wbGF0ZSwgeyByZWFkOiBUZW1wbGF0ZVJlZiB9KVxuICBmb290ZXJUZW1wbGF0ZSE6IFRlbXBsYXRlUmVmPGFueT47XG4gIEBDb250ZW50Q2hpbGQoTXR4U2VsZWN0Tm90Rm91bmRUZW1wbGF0ZSwgeyByZWFkOiBUZW1wbGF0ZVJlZiB9KVxuICBub3RGb3VuZFRlbXBsYXRlITogVGVtcGxhdGVSZWY8YW55PjtcbiAgQENvbnRlbnRDaGlsZChNdHhTZWxlY3RUeXBlVG9TZWFyY2hUZW1wbGF0ZSwgeyByZWFkOiBUZW1wbGF0ZVJlZiB9KVxuICB0eXBlVG9TZWFyY2hUZW1wbGF0ZSE6IFRlbXBsYXRlUmVmPGFueT47XG4gIEBDb250ZW50Q2hpbGQoTXR4U2VsZWN0TG9hZGluZ1RleHRUZW1wbGF0ZSwgeyByZWFkOiBUZW1wbGF0ZVJlZiB9KVxuICBsb2FkaW5nVGV4dFRlbXBsYXRlITogVGVtcGxhdGVSZWY8YW55PjtcbiAgQENvbnRlbnRDaGlsZChNdHhTZWxlY3RUYWdUZW1wbGF0ZSwgeyByZWFkOiBUZW1wbGF0ZVJlZiB9KVxuICB0YWdUZW1wbGF0ZSE6IFRlbXBsYXRlUmVmPGFueT47XG4gIEBDb250ZW50Q2hpbGQoTXR4U2VsZWN0TG9hZGluZ1NwaW5uZXJUZW1wbGF0ZSwgeyByZWFkOiBUZW1wbGF0ZVJlZiB9KVxuICBsb2FkaW5nU3Bpbm5lclRlbXBsYXRlITogVGVtcGxhdGVSZWY8YW55PjtcblxuICBAQ29udGVudENoaWxkcmVuKE10eE9wdGlvbiwgeyBkZXNjZW5kYW50czogdHJ1ZSB9KVxuICBtdHhPcHRpb25zITogUXVlcnlMaXN0PE10eE9wdGlvbj47XG5cbiAgQElucHV0KCkgYWRkVGFnOiBib29sZWFuIHwgQWRkVGFnRm4gPSBmYWxzZTtcbiAgQElucHV0KCkgYWRkVGFnVGV4dCA9IHRoaXMuX2RlZmF1bHRPcHRpb25zPy5hZGRUYWdUZXh0ID8/ICdBZGQgaXRlbSc7XG4gIEBJbnB1dCgpIGFwcGVhcmFuY2UgPSAndW5kZXJsaW5lJztcbiAgQElucHV0KCkgYXBwZW5kVG8gPSB0aGlzLl9kZWZhdWx0T3B0aW9ucz8uYXBwZW5kVG8gPz8gJ2JvZHknO1xuICBASW5wdXQoKSBiaW5kTGFiZWwgPSB0aGlzLl9kZWZhdWx0T3B0aW9ucz8uYmluZExhYmVsO1xuICBASW5wdXQoKSBiaW5kVmFsdWUgPSB0aGlzLl9kZWZhdWx0T3B0aW9ucz8uYmluZFZhbHVlO1xuICBASW5wdXQoeyB0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGUgfSkgY2xvc2VPblNlbGVjdCA9IHRydWU7XG4gIEBJbnB1dCgpIGNsZWFyQWxsVGV4dCA9IHRoaXMuX2RlZmF1bHRPcHRpb25zPy5jbGVhckFsbFRleHQgPz8gJ0NsZWFyIGFsbCc7XG4gIEBJbnB1dCh7IHRyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZSB9KSBjbGVhcmFibGUgPSB0cnVlO1xuICBASW5wdXQoeyB0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGUgfSkgY2xlYXJPbkJhY2tzcGFjZSA9IHRydWU7XG4gIEBJbnB1dCgpIGNvbXBhcmVXaXRoITogQ29tcGFyZVdpdGhGbjtcbiAgQElucHV0KCkgZHJvcGRvd25Qb3NpdGlvbjogRHJvcGRvd25Qb3NpdGlvbiA9ICdhdXRvJztcbiAgQElucHV0KCkgZ3JvdXBCeSE6IHN0cmluZyB8ICgodmFsdWU6IGFueSkgPT4gYW55KTtcbiAgQElucHV0KCkgZ3JvdXBWYWx1ZSE6IEdyb3VwVmFsdWVGbjtcbiAgQElucHV0KCkgYnVmZmVyQW1vdW50ID0gNDtcbiAgQElucHV0KHsgdHJhbnNmb3JtOiBib29sZWFuQXR0cmlidXRlIH0pIHNlbGVjdGFibGVHcm91cCA9IGZhbHNlO1xuICBASW5wdXQoeyB0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGUgfSkgc2VsZWN0YWJsZUdyb3VwQXNNb2RlbCA9IHRydWU7XG4gIEBJbnB1dCh7IHRyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZSB9KSBoaWRlU2VsZWN0ZWQgPSBmYWxzZTtcbiAgQElucHV0KHsgdHJhbnNmb3JtOiBib29sZWFuQXR0cmlidXRlIH0pIGxvYWRpbmcgPSBmYWxzZTtcbiAgQElucHV0KCkgbG9hZGluZ1RleHQgPSB0aGlzLl9kZWZhdWx0T3B0aW9ucz8ubG9hZGluZ1RleHQgPz8gJ0xvYWRpbmcuLi4nO1xuICBASW5wdXQoKSBsYWJlbEZvcklkOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgQElucHV0KHsgdHJhbnNmb3JtOiBib29sZWFuQXR0cmlidXRlIH0pIG1hcmtGaXJzdCA9IHRydWU7XG4gIEBJbnB1dCgpIG1heFNlbGVjdGVkSXRlbXMhOiBudW1iZXI7XG4gIEBJbnB1dCh7IHRyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZSB9KSBtdWx0aXBsZSA9IGZhbHNlO1xuICBASW5wdXQoKSBub3RGb3VuZFRleHQgPSB0aGlzLl9kZWZhdWx0T3B0aW9ucz8ubm90Rm91bmRUZXh0ID8/ICdObyBpdGVtcyBmb3VuZCc7XG4gIEBJbnB1dCh7IHRyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZSB9KSBzZWFyY2hhYmxlID0gdHJ1ZTtcbiAgQElucHV0KHsgdHJhbnNmb3JtOiBib29sZWFuQXR0cmlidXRlIH0pIHJlYWRvbmx5ID0gZmFsc2U7XG4gIEBJbnB1dCgpIHNlYXJjaEZuOiBTZWFyY2hGbiB8IG51bGwgPSBudWxsO1xuICBASW5wdXQoeyB0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGUgfSkgc2VhcmNoV2hpbGVDb21wb3NpbmcgPSB0cnVlO1xuICBASW5wdXQoeyB0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGUgfSkgc2VsZWN0T25UYWIgPSBmYWxzZTtcbiAgQElucHV0KCkgdHJhY2tCeUZuOiBUcmFja0J5Rm4gfCBudWxsID0gbnVsbDtcbiAgQElucHV0KCkgaW5wdXRBdHRyczogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSA9IHt9O1xuICBASW5wdXQoKSB0YWJJbmRleCE6IG51bWJlcjtcbiAgQElucHV0KHsgdHJhbnNmb3JtOiBib29sZWFuQXR0cmlidXRlIH0pIG9wZW5PbkVudGVyID0gdGhpcy5fZGVmYXVsdE9wdGlvbnM/Lm9wZW5PbkVudGVyID8/IHRydWU7XG4gIEBJbnB1dCgpIG1pblRlcm1MZW5ndGggPSAwO1xuICBASW5wdXQoeyB0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGUgfSkgZWRpdGFibGVTZWFyY2hUZXJtID0gZmFsc2U7XG4gIEBJbnB1dCgpIGtleURvd25GbiA9IChfOiBLZXlib2FyZEV2ZW50KSA9PiB0cnVlO1xuICBASW5wdXQoeyB0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGUgfSkgdmlydHVhbFNjcm9sbCA9IGZhbHNlO1xuICBASW5wdXQoKSB0eXBlVG9TZWFyY2hUZXh0ID0gdGhpcy5fZGVmYXVsdE9wdGlvbnM/LnR5cGVUb1NlYXJjaFRleHQgPz8gJ1R5cGUgdG8gc2VhcmNoJztcbiAgQElucHV0KCkgdHlwZWFoZWFkITogU3ViamVjdDxzdHJpbmc+O1xuXG4gIEBPdXRwdXQoJ2JsdXInKSBibHVyRXZlbnQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoJ2ZvY3VzJykgZm9jdXNFdmVudCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgnY2hhbmdlJykgY2hhbmdlRXZlbnQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoJ29wZW4nKSBvcGVuRXZlbnQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoJ2Nsb3NlJykgY2xvc2VFdmVudCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgnc2VhcmNoJykgc2VhcmNoRXZlbnQgPSBuZXcgRXZlbnRFbWl0dGVyPHsgdGVybTogc3RyaW5nOyBpdGVtczogYW55W10gfT4oKTtcbiAgQE91dHB1dCgnY2xlYXInKSBjbGVhckV2ZW50ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCdhZGQnKSBhZGRFdmVudCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgncmVtb3ZlJykgcmVtb3ZlRXZlbnQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoJ3Njcm9sbCcpIHNjcm9sbCA9IG5ldyBFdmVudEVtaXR0ZXI8eyBzdGFydDogbnVtYmVyOyBlbmQ6IG51bWJlciB9PigpO1xuICBAT3V0cHV0KCdzY3JvbGxUb0VuZCcpIHNjcm9sbFRvRW5kID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIEBJbnB1dCgpXG4gIGdldCBjbGVhclNlYXJjaE9uQWRkKCkge1xuICAgIHJldHVybiB0aGlzLl9jbGVhclNlYXJjaE9uQWRkID8/IHRoaXMuY2xvc2VPblNlbGVjdDtcbiAgfVxuICBzZXQgY2xlYXJTZWFyY2hPbkFkZCh2YWx1ZSkge1xuICAgIHRoaXMuX2NsZWFyU2VhcmNoT25BZGQgPSB2YWx1ZTtcbiAgfVxuICBwcml2YXRlIF9jbGVhclNlYXJjaE9uQWRkID0gdGhpcy5fZGVmYXVsdE9wdGlvbnM/LmNsZWFyU2VhcmNoT25BZGQ7XG5cbiAgQElucHV0KClcbiAgZ2V0IGl0ZW1zKCkge1xuICAgIHJldHVybiB0aGlzLl9pdGVtcztcbiAgfVxuICBzZXQgaXRlbXModmFsdWU6IGFueVtdKSB7XG4gICAgdGhpcy5faXRlbXNBcmVVc2VkID0gdHJ1ZTtcbiAgICB0aGlzLl9pdGVtcyA9IHZhbHVlO1xuICB9XG4gIHByaXZhdGUgX2l0ZW1zOiBhbnlbXSA9IFtdO1xuICBwcml2YXRlIF9pdGVtc0FyZVVzZWQgPSBmYWxzZTtcblxuICAvKiogRW1pdHMgd2hlbmV2ZXIgdGhlIGNvbXBvbmVudCBpcyBkZXN0cm95ZWQuICovXG4gIHByaXZhdGUgcmVhZG9ubHkgX2Rlc3Ryb3kkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKiogVmFsdWUgb2YgdGhlIHNlbGVjdCBjb250cm9sLiAqL1xuICBASW5wdXQoKVxuICBnZXQgdmFsdWUoKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWU7XG4gIH1cbiAgc2V0IHZhbHVlKG5ld1ZhbHVlOiBhbnkpIHtcbiAgICBjb25zdCBoYXNBc3NpZ25lZCA9IHRoaXMuX2Fzc2lnblZhbHVlKG5ld1ZhbHVlKTtcblxuICAgIGlmIChoYXNBc3NpZ25lZCkge1xuICAgICAgdGhpcy5fb25DaGFuZ2UobmV3VmFsdWUpO1xuICAgIH1cbiAgfVxuICBwcml2YXRlIF92YWx1ZSA9IG51bGw7XG5cbiAgLyoqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC4gKi9cbiAgcmVhZG9ubHkgc3RhdGVDaGFuZ2VzOiBTdWJqZWN0PHZvaWQ+ID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKiogVW5pcXVlIGlkIG9mIHRoZSBlbGVtZW50LiAqL1xuICBASW5wdXQoKVxuICBnZXQgaWQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5faWQ7XG4gIH1cbiAgc2V0IGlkKHZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9pZCA9IHZhbHVlIHx8IHRoaXMuX3VpZDtcbiAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gIH1cbiAgcHJpdmF0ZSBfaWQhOiBzdHJpbmc7XG5cbiAgLyoqIFVuaXF1ZSBpZCBmb3IgdGhpcyBzZWxlY3QuICovXG4gIHByaXZhdGUgX3VpZCA9IGBtdHgtc2VsZWN0LSR7bmV4dFVuaXF1ZUlkKyt9YDtcblxuICAvKiogUGxhY2Vob2xkZXIgdG8gYmUgc2hvd24gaWYgdmFsdWUgaXMgZW1wdHkuICovXG4gIEBJbnB1dCgpXG4gIGdldCBwbGFjZWhvbGRlcigpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9wbGFjZWhvbGRlciE7XG4gIH1cbiAgc2V0IHBsYWNlaG9sZGVyKHZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9wbGFjZWhvbGRlciA9IHZhbHVlO1xuICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgfVxuICBwcml2YXRlIF9wbGFjZWhvbGRlciA9IHRoaXMuX2RlZmF1bHRPcHRpb25zPy5wbGFjZWhvbGRlcjtcblxuICAvKiogV2hldGhlciB0aGUgc2VsZWN0IGlzIGZvY3VzZWQuICovXG4gIGdldCBmb2N1c2VkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9mb2N1c2VkO1xuICB9XG4gIHByaXZhdGUgX2ZvY3VzZWQgPSBmYWxzZTtcblxuICAvKiogV2hldGhlciB0aGUgc2VsZWN0IGhhcyBhIHZhbHVlLiAqL1xuICBnZXQgZW1wdHkoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMudmFsdWUgPT0gbnVsbCB8fCAoQXJyYXkuaXNBcnJheSh0aGlzLnZhbHVlKSAmJiB0aGlzLnZhbHVlLmxlbmd0aCA9PT0gMCk7XG4gIH1cblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBNYXRGb3JtRmllbGRDb250cm9sLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBnZXQgc2hvdWxkTGFiZWxGbG9hdCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5mb2N1c2VkIHx8ICF0aGlzLmVtcHR5O1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHNlbGVjdCBpcyBkaXNhYmxlZC4gKi9cbiAgQElucHV0KHsgdHJhbnNmb3JtOiBib29sZWFuQXR0cmlidXRlIH0pXG4gIGRpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNvbXBvbmVudCBpcyByZXF1aXJlZC4gKi9cbiAgQElucHV0KHsgdHJhbnNmb3JtOiBib29sZWFuQXR0cmlidXRlIH0pXG4gIGdldCByZXF1aXJlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fcmVxdWlyZWQgPz8gdGhpcy5uZ0NvbnRyb2w/LmNvbnRyb2w/Lmhhc1ZhbGlkYXRvcihWYWxpZGF0b3JzLnJlcXVpcmVkKSA/PyBmYWxzZTtcbiAgfVxuICBzZXQgcmVxdWlyZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9yZXF1aXJlZCA9IHZhbHVlO1xuICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgfVxuICBwcml2YXRlIF9yZXF1aXJlZDogYm9vbGVhbiB8IHVuZGVmaW5lZDtcblxuICAvKiogT2JqZWN0IHVzZWQgdG8gY29udHJvbCB3aGVuIGVycm9yIG1lc3NhZ2VzIGFyZSBzaG93bi4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGVycm9yU3RhdGVNYXRjaGVyKCkge1xuICAgIHJldHVybiB0aGlzLl9lcnJvclN0YXRlVHJhY2tlci5tYXRjaGVyO1xuICB9XG4gIHNldCBlcnJvclN0YXRlTWF0Y2hlcih2YWx1ZTogRXJyb3JTdGF0ZU1hdGNoZXIpIHtcbiAgICB0aGlzLl9lcnJvclN0YXRlVHJhY2tlci5tYXRjaGVyID0gdmFsdWU7XG4gIH1cblxuICAvKiogQXJpYSBsYWJlbCBvZiB0aGUgc2VsZWN0LiAqL1xuICBASW5wdXQoJ2FyaWEtbGFiZWwnKSBhcmlhTGFiZWw6IHN0cmluZyA9ICcnO1xuXG4gIC8qKiBJbnB1dCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNwZWNpZnkgdGhlIGBhcmlhLWxhYmVsbGVkYnlgIGF0dHJpYnV0ZS4gKi9cbiAgQElucHV0KCdhcmlhLWxhYmVsbGVkYnknKSBhcmlhTGFiZWxsZWRieTogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqIFRoZSBhcmlhLWRlc2NyaWJlZGJ5IGF0dHJpYnV0ZSBvbiB0aGUgc2VsZWN0IGZvciBpbXByb3ZlZCBhMTF5LiAqL1xuICBfYXJpYURlc2NyaWJlZGJ5OiBzdHJpbmcgfCBudWxsID0gbnVsbDtcblxuICAvKiogQSBuYW1lIGZvciB0aGlzIGNvbnRyb2wgdGhhdCBjYW4gYmUgdXNlZCBieSBgbWF0LWZvcm0tZmllbGRgLiAqL1xuICBjb250cm9sVHlwZSA9ICdtdHgtc2VsZWN0JztcblxuICAvKiogYFZpZXcgLT4gbW9kZWwgY2FsbGJhY2sgY2FsbGVkIHdoZW4gdmFsdWUgY2hhbmdlc2AgKi9cbiAgX29uQ2hhbmdlOiAodmFsdWU6IGFueSkgPT4gdm9pZCA9ICgpID0+IHt9O1xuXG4gIC8qKiBgVmlldyAtPiBtb2RlbCBjYWxsYmFjayBjYWxsZWQgd2hlbiBzZWxlY3QgaGFzIGJlZW4gdG91Y2hlZGAgKi9cbiAgX29uVG91Y2hlZCA9ICgpID0+IHt9O1xuXG4gIC8qKiBJRCBmb3IgdGhlIERPTSBub2RlIGNvbnRhaW5pbmcgdGhlIHNlbGVjdCdzIHZhbHVlLiAqL1xuICBfdmFsdWVJZCA9IGBtdHgtc2VsZWN0LXZhbHVlLSR7bmV4dFVuaXF1ZUlkKyt9YDtcblxuICAvKiogV2hldGhlciBvciBub3QgdGhlIG92ZXJsYXkgcGFuZWwgaXMgb3Blbi4gKi9cbiAgZ2V0IHBhbmVsT3BlbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gISF0aGlzLm5nU2VsZWN0LmlzT3BlbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBLZWVwcyB0cmFjayBvZiB0aGUgcHJldmlvdXMgZm9ybSBjb250cm9sIGFzc2lnbmVkIHRvIHRoZSBzZWxlY3QuXG4gICAqIFVzZWQgdG8gZGV0ZWN0IGlmIGl0IGhhcyBjaGFuZ2VkLlxuICAgKi9cbiAgcHJpdmF0ZSBfcHJldmlvdXNDb250cm9sOiBBYnN0cmFjdENvbnRyb2wgfCBudWxsIHwgdW5kZWZpbmVkO1xuXG4gIC8qKiBUcmFja3MgdGhlIGVycm9yIHN0YXRlIG9mIHRoZSBzZWxlY3QuICovXG4gIHByaXZhdGUgX2Vycm9yU3RhdGVUcmFja2VyOiBfRXJyb3JTdGF0ZVRyYWNrZXI7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHNlbGVjdCBpcyBpbiBhbiBlcnJvciBzdGF0ZS4gKi9cbiAgZ2V0IGVycm9yU3RhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Vycm9yU3RhdGVUcmFja2VyLmVycm9yU3RhdGU7XG4gIH1cbiAgc2V0IGVycm9yU3RhdGUodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9lcnJvclN0YXRlVHJhY2tlci5lcnJvclN0YXRlID0gdmFsdWU7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcm90ZWN0ZWQgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgcHJvdGVjdGVkIF9mb2N1c01vbml0b3I6IEZvY3VzTW9uaXRvcixcbiAgICBkZWZhdWx0RXJyb3JTdGF0ZU1hdGNoZXI6IEVycm9yU3RhdGVNYXRjaGVyLFxuICAgIEBPcHRpb25hbCgpIHBhcmVudEZvcm06IE5nRm9ybSxcbiAgICBAT3B0aW9uYWwoKSBwYXJlbnRGb3JtR3JvdXA6IEZvcm1Hcm91cERpcmVjdGl2ZSxcbiAgICBAT3B0aW9uYWwoKSBAU2VsZigpIHB1YmxpYyBuZ0NvbnRyb2w6IE5nQ29udHJvbCxcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9GT1JNX0ZJRUxEKSBwcm90ZWN0ZWQgX3BhcmVudEZvcm1GaWVsZD86IE1hdEZvcm1GaWVsZCxcbiAgICBAT3B0aW9uYWwoKVxuICAgIEBJbmplY3QoTVRYX1NFTEVDVF9ERUZBVUxUX09QVElPTlMpXG4gICAgcHJvdGVjdGVkIF9kZWZhdWx0T3B0aW9ucz86IE10eFNlbGVjdERlZmF1bHRPcHRpb25zXG4gICkge1xuICAgIF9mb2N1c01vbml0b3IubW9uaXRvcih0aGlzLl9lbGVtZW50UmVmLCB0cnVlKS5zdWJzY3JpYmUob3JpZ2luID0+IHtcbiAgICAgIGlmICh0aGlzLl9mb2N1c2VkICYmICFvcmlnaW4pIHtcbiAgICAgICAgdGhpcy5fb25Ub3VjaGVkKCk7XG4gICAgICB9XG4gICAgICB0aGlzLl9mb2N1c2VkID0gISFvcmlnaW47XG4gICAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5uZ0NvbnRyb2wpIHtcbiAgICAgIC8vIE5vdGU6IHdlIHByb3ZpZGUgdGhlIHZhbHVlIGFjY2Vzc29yIHRocm91Z2ggaGVyZSwgaW5zdGVhZCBvZlxuICAgICAgLy8gdGhlIGBwcm92aWRlcnNgIHRvIGF2b2lkIHJ1bm5pbmcgaW50byBhIGNpcmN1bGFyIGltcG9ydC5cbiAgICAgIHRoaXMubmdDb250cm9sLnZhbHVlQWNjZXNzb3IgPSB0aGlzO1xuICAgIH1cblxuICAgIHRoaXMuX2Vycm9yU3RhdGVUcmFja2VyID0gbmV3IF9FcnJvclN0YXRlVHJhY2tlcihcbiAgICAgIGRlZmF1bHRFcnJvclN0YXRlTWF0Y2hlcixcbiAgICAgIG5nQ29udHJvbCxcbiAgICAgIHBhcmVudEZvcm1Hcm91cCxcbiAgICAgIHBhcmVudEZvcm0sXG4gICAgICB0aGlzLnN0YXRlQ2hhbmdlc1xuICAgICk7XG5cbiAgICAvLyBGb3JjZSBzZXR0ZXIgdG8gYmUgY2FsbGVkIGluIGNhc2UgaWQgd2FzIG5vdCBzcGVjaWZpZWQuXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNlbGYtYXNzaWduXG4gICAgdGhpcy5pZCA9IHRoaXMuaWQ7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICAvLyBGaXggY29tcGFyZVdpdGggd2FybmluZyBvZiB1bmRlZmluZWQgdmFsdWVcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vbmctc2VsZWN0L25nLXNlbGVjdC9pc3N1ZXMvMTUzN1xuICAgIGlmICh0aGlzLmNvbXBhcmVXaXRoKSB7XG4gICAgICB0aGlzLm5nU2VsZWN0LmNvbXBhcmVXaXRoID0gdGhpcy5jb21wYXJlV2l0aDtcbiAgICB9XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgaWYgKCF0aGlzLl9pdGVtc0FyZVVzZWQpIHtcbiAgICAgIHRoaXMuX3NldEl0ZW1zRnJvbU10eE9wdGlvbnMoKTtcbiAgICB9XG4gIH1cblxuICBuZ0RvQ2hlY2soKTogdm9pZCB7XG4gICAgY29uc3QgbmdDb250cm9sID0gdGhpcy5uZ0NvbnRyb2w7XG4gICAgaWYgKHRoaXMubmdDb250cm9sKSB7XG4gICAgICAvLyBUaGUgZGlzYWJsZWQgc3RhdGUgbWlnaHQgZ28gb3V0IG9mIHN5bmMgaWYgdGhlIGZvcm0gZ3JvdXAgaXMgc3dhcHBlZCBvdXQuIFNlZSAjMTc4NjAuXG4gICAgICBpZiAodGhpcy5fcHJldmlvdXNDb250cm9sICE9PSBuZ0NvbnRyb2wuY29udHJvbCkge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgdGhpcy5fcHJldmlvdXNDb250cm9sICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgICBuZ0NvbnRyb2wuZGlzYWJsZWQgIT09IG51bGwgJiZcbiAgICAgICAgICBuZ0NvbnRyb2wuZGlzYWJsZWQgIT09IHRoaXMuZGlzYWJsZWRcbiAgICAgICAgKSB7XG4gICAgICAgICAgdGhpcy5kaXNhYmxlZCA9IG5nQ29udHJvbC5kaXNhYmxlZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3ByZXZpb3VzQ29udHJvbCA9IG5nQ29udHJvbC5jb250cm9sO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnVwZGF0ZUVycm9yU3RhdGUoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9kZXN0cm95JC5uZXh0KCk7XG4gICAgdGhpcy5fZGVzdHJveSQuY29tcGxldGUoKTtcbiAgICB0aGlzLnN0YXRlQ2hhbmdlcy5jb21wbGV0ZSgpO1xuICAgIHRoaXMuX2ZvY3VzTW9uaXRvci5zdG9wTW9uaXRvcmluZyh0aGlzLl9lbGVtZW50UmVmKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSB2YWx1ZSBmb3IgdGhlIGBhcmlhLWxhYmVsbGVkYnlgIGF0dHJpYnV0ZSBvZiB0aGUgaW5wdXRzLiAqL1xuICBfZ2V0QXJpYUxhYmVsbGVkYnkoKSB7XG4gICAgaWYgKHRoaXMuYXJpYUxhYmVsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBsYWJlbElkID0gdGhpcy5fcGFyZW50Rm9ybUZpZWxkPy5nZXRMYWJlbElkKCk7XG4gICAgbGV0IHZhbHVlID0gKGxhYmVsSWQgPyBsYWJlbElkICsgJyAnIDogJycpICsgdGhpcy5fdmFsdWVJZDtcblxuICAgIGlmICh0aGlzLmFyaWFMYWJlbGxlZGJ5KSB7XG4gICAgICB2YWx1ZSArPSAnICcgKyB0aGlzLmFyaWFMYWJlbGxlZGJ5O1xuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIC8qKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIE1hdEZvcm1GaWVsZENvbnRyb2wuICovXG4gIHNldERlc2NyaWJlZEJ5SWRzKGlkczogc3RyaW5nW10pIHtcbiAgICB0aGlzLl9hcmlhRGVzY3JpYmVkYnkgPSBpZHMubGVuZ3RoID8gaWRzLmpvaW4oJyAnKSA6IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogRGlzYWJsZXMgdGhlIHNlbGVjdC4gUGFydCBvZiB0aGUgQ29udHJvbFZhbHVlQWNjZXNzb3IgaW50ZXJmYWNlIHJlcXVpcmVkXG4gICAqIHRvIGludGVncmF0ZSB3aXRoIEFuZ3VsYXIncyBjb3JlIGZvcm1zIEFQSS5cbiAgICpcbiAgICogQHBhcmFtIGlzRGlzYWJsZWQgU2V0cyB3aGV0aGVyIHRoZSBjb21wb25lbnQgaXMgZGlzYWJsZWQuXG4gICAqL1xuICBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4pIHtcbiAgICB0aGlzLmRpc2FibGVkID0gaXNEaXNhYmxlZDtcbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gIH1cblxuICAvKiogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBNYXRGb3JtRmllbGRDb250cm9sLiAqL1xuICBvbkNvbnRhaW5lckNsaWNrKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgY29uc3QgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0IGFzIEhUTUxFbGVtZW50O1xuICAgIGlmICgvbWF0LW1kYy1mb3JtLWZpZWxkfG10eC1zZWxlY3QvZy50ZXN0KHRhcmdldC5wYXJlbnRFbGVtZW50Py5jbGFzc0xpc3RbMF0gfHwgJycpKSB7XG4gICAgICB0aGlzLmZvY3VzKCk7XG4gICAgICB0aGlzLm9wZW4oKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgc2VsZWN0J3MgdmFsdWUuIFBhcnQgb2YgdGhlIENvbnRyb2xWYWx1ZUFjY2Vzc29yIGludGVyZmFjZVxuICAgKiByZXF1aXJlZCB0byBpbnRlZ3JhdGUgd2l0aCBBbmd1bGFyJ3MgY29yZSBmb3JtcyBBUEkuXG4gICAqXG4gICAqIEBwYXJhbSB2YWx1ZSBOZXcgdmFsdWUgdG8gYmUgd3JpdHRlbiB0byB0aGUgbW9kZWwuXG4gICAqL1xuICB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLl9hc3NpZ25WYWx1ZSh2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogU2F2ZXMgYSBjYWxsYmFjayBmdW5jdGlvbiB0byBiZSBpbnZva2VkIHdoZW4gdGhlIHNlbGVjdCdzIHZhbHVlXG4gICAqIGNoYW5nZXMgZnJvbSB1c2VyIGlucHV0LiBQYXJ0IG9mIHRoZSBDb250cm9sVmFsdWVBY2Nlc3NvciBpbnRlcmZhY2VcbiAgICogcmVxdWlyZWQgdG8gaW50ZWdyYXRlIHdpdGggQW5ndWxhcidzIGNvcmUgZm9ybXMgQVBJLlxuICAgKlxuICAgKiBAcGFyYW0gZm4gQ2FsbGJhY2sgdG8gYmUgdHJpZ2dlcmVkIHdoZW4gdGhlIHZhbHVlIGNoYW5nZXMuXG4gICAqL1xuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLl9vbkNoYW5nZSA9IGZuO1xuICB9XG5cbiAgLyoqXG4gICAqIFNhdmVzIGEgY2FsbGJhY2sgZnVuY3Rpb24gdG8gYmUgaW52b2tlZCB3aGVuIHRoZSBzZWxlY3QgaXMgYmx1cnJlZFxuICAgKiBieSB0aGUgdXNlci4gUGFydCBvZiB0aGUgQ29udHJvbFZhbHVlQWNjZXNzb3IgaW50ZXJmYWNlIHJlcXVpcmVkXG4gICAqIHRvIGludGVncmF0ZSB3aXRoIEFuZ3VsYXIncyBjb3JlIGZvcm1zIEFQSS5cbiAgICpcbiAgICogQHBhcmFtIGZuIENhbGxiYWNrIHRvIGJlIHRyaWdnZXJlZCB3aGVuIHRoZSBjb21wb25lbnQgaGFzIGJlZW4gdG91Y2hlZC5cbiAgICovXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLl9vblRvdWNoZWQgPSBmbjtcbiAgfVxuXG4gIC8qKiBSZWZyZXNoZXMgdGhlIGVycm9yIHN0YXRlIG9mIHRoZSBzZWxlY3QuICovXG4gIHVwZGF0ZUVycm9yU3RhdGUoKSB7XG4gICAgdGhpcy5fZXJyb3JTdGF0ZVRyYWNrZXIudXBkYXRlRXJyb3JTdGF0ZSgpO1xuICB9XG5cbiAgLyoqIEFzc2lnbnMgYSBzcGVjaWZpYyB2YWx1ZSB0byB0aGUgc2VsZWN0LiBSZXR1cm5zIHdoZXRoZXIgdGhlIHZhbHVlIGhhcyBjaGFuZ2VkLiAqL1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXJlZHVuZGFudC10eXBlLWNvbnN0aXR1ZW50c1xuICBwcml2YXRlIF9hc3NpZ25WYWx1ZShuZXdWYWx1ZTogYW55IHwgYW55W10pOiBib29sZWFuIHtcbiAgICAvLyBBbHdheXMgcmUtYXNzaWduIGFuIGFycmF5LCBiZWNhdXNlIGl0IG1pZ2h0IGhhdmUgYmVlbiBtdXRhdGVkLlxuICAgIGlmIChuZXdWYWx1ZSAhPT0gdGhpcy5fdmFsdWUgfHwgKHRoaXMubXVsdGlwbGUgJiYgQXJyYXkuaXNBcnJheShuZXdWYWx1ZSkpKSB7XG4gICAgICB0aGlzLl92YWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqIE5nU2VsZWN0J3MgYF9zZXRJdGVtc0Zyb21OZ09wdGlvbnNgICovXG4gIHByaXZhdGUgX3NldEl0ZW1zRnJvbU10eE9wdGlvbnMoKSB7XG4gICAgY29uc3QgbWFwTXR4T3B0aW9ucyA9IChvcHRpb25zOiBRdWVyeUxpc3Q8TXR4T3B0aW9uPikgPT4ge1xuICAgICAgdGhpcy5pdGVtcyA9IG9wdGlvbnMubWFwKG9wdGlvbiA9PiAoe1xuICAgICAgICAkbmdPcHRpb25WYWx1ZTogb3B0aW9uLnZhbHVlLFxuICAgICAgICAkbmdPcHRpb25MYWJlbDogb3B0aW9uLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5pbm5lckhUTUwsXG4gICAgICAgIGRpc2FibGVkOiBvcHRpb24uZGlzYWJsZWQsXG4gICAgICB9KSk7XG4gICAgICB0aGlzLm5nU2VsZWN0Lml0ZW1zTGlzdC5zZXRJdGVtcyh0aGlzLml0ZW1zKTtcbiAgICAgIGlmICh0aGlzLm5nU2VsZWN0Lmhhc1ZhbHVlKSB7XG4gICAgICAgIHRoaXMubmdTZWxlY3QuaXRlbXNMaXN0Lm1hcFNlbGVjdGVkSXRlbXMoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMubmdTZWxlY3QuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIH07XG5cbiAgICBjb25zdCBoYW5kbGVPcHRpb25DaGFuZ2UgPSAoKSA9PiB7XG4gICAgICBjb25zdCBjaGFuZ2VkT3JEZXN0cm95ZWQgPSBtZXJnZSh0aGlzLm10eE9wdGlvbnMuY2hhbmdlcywgdGhpcy5fZGVzdHJveSQpO1xuICAgICAgbWVyZ2UoLi4udGhpcy5tdHhPcHRpb25zLm1hcChvcHRpb24gPT4gb3B0aW9uLnN0YXRlQ2hhbmdlJCkpXG4gICAgICAgIC5waXBlKHRha2VVbnRpbChjaGFuZ2VkT3JEZXN0cm95ZWQpKVxuICAgICAgICAuc3Vic2NyaWJlKG9wdGlvbiA9PiB7XG4gICAgICAgICAgY29uc3QgaXRlbSA9IHRoaXMubmdTZWxlY3QuaXRlbXNMaXN0LmZpbmRJdGVtKG9wdGlvbi52YWx1ZSk7XG4gICAgICAgICAgaXRlbS5kaXNhYmxlZCA9IG9wdGlvbi5kaXNhYmxlZDtcbiAgICAgICAgICBpdGVtLmxhYmVsID0gb3B0aW9uLmxhYmVsIHx8IGl0ZW0ubGFiZWw7XG4gICAgICAgICAgdGhpcy5uZ1NlbGVjdC5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICB0aGlzLm10eE9wdGlvbnMuY2hhbmdlc1xuICAgICAgLnBpcGUoc3RhcnRXaXRoKHRoaXMubXR4T3B0aW9ucyksIHRha2VVbnRpbCh0aGlzLl9kZXN0cm95JCkpXG4gICAgICAuc3Vic2NyaWJlKG9wdGlvbnMgPT4ge1xuICAgICAgICBtYXBNdHhPcHRpb25zKG9wdGlvbnMpO1xuICAgICAgICBoYW5kbGVPcHRpb25DaGFuZ2UoKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgb3BlbigpIHtcbiAgICB0aGlzLm5nU2VsZWN0Lm9wZW4oKTtcbiAgfVxuXG4gIGNsb3NlKCkge1xuICAgIHRoaXMubmdTZWxlY3QuY2xvc2UoKTtcbiAgfVxuXG4gIGZvY3VzKCkge1xuICAgIHRoaXMubmdTZWxlY3QuZm9jdXMoKTtcbiAgfVxuXG4gIGJsdXIoKSB7XG4gICAgdGhpcy5uZ1NlbGVjdC5ibHVyKCk7XG4gIH1cblxuICBvcGVuQ2hhbmdlKCkge1xuICAgIHRoaXMub3BlbkV2ZW50LmVtaXQoKTtcblxuICAgIC8vIFRPRE86IFRoZSBuZy1zZWxlY3QgaGFzIG5vIGBwYW5lbENsYXNzYCBwcm9wLCBzbyB3ZSBjYW4gYWRkIHRoZSB0aGVtZSBjb2xvciBieSB0aGUgZm9sbG93aW5nIHdheS5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGNvbnN0IGRyb3Bkb3duRWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLm5nU2VsZWN0LmRyb3Bkb3duSWQpIGFzIEhUTUxFbGVtZW50O1xuICAgICAgZHJvcGRvd25FbC5jbGFzc0xpc3QuYWRkKCdtYXQtJyArIHRoaXMuX3BhcmVudEZvcm1GaWVsZD8uY29sb3IpO1xuICAgIH0pO1xuICB9XG59XG4iLCI8bmctc2VsZWN0ICNuZ1NlbGVjdFxuICBbY2xhc3Mubmctc2VsZWN0LWludmFsaWRdPVwiZXJyb3JTdGF0ZVwiXG4gIFsobmdNb2RlbCldPVwidmFsdWVcIlxuICBbbmdNb2RlbE9wdGlvbnNdPVwie3N0YW5kYWxvbmU6IHRydWV9XCJcbiAgW3BsYWNlaG9sZGVyXT1cInBsYWNlaG9sZGVyXCJcbiAgW2l0ZW1zXT1cIml0ZW1zXCJcbiAgW2FkZFRhZ109XCJhZGRUYWdcIlxuICBbYWRkVGFnVGV4dF09XCJhZGRUYWdUZXh0XCJcbiAgW2FwcGVuZFRvXT1cImFwcGVuZFRvXCJcbiAgW2FwcGVhcmFuY2VdPVwiYXBwZWFyYW5jZVwiXG4gIFtiaW5kTGFiZWxdPVwiYmluZExhYmVsIVwiXG4gIFtiaW5kVmFsdWVdPVwiYmluZFZhbHVlIVwiXG4gIFtjbG9zZU9uU2VsZWN0XT1cImNsb3NlT25TZWxlY3RcIlxuICBbY2xlYXJBbGxUZXh0XT1cImNsZWFyQWxsVGV4dFwiXG4gIFtjbGVhcmFibGVdPVwiY2xlYXJhYmxlXCJcbiAgW2NsZWFyT25CYWNrc3BhY2VdPVwiY2xlYXJPbkJhY2tzcGFjZVwiXG4gIFtkcm9wZG93blBvc2l0aW9uXT1cImRyb3Bkb3duUG9zaXRpb25cIlxuICBbZ3JvdXBCeV09XCJncm91cEJ5XCJcbiAgW2dyb3VwVmFsdWVdPVwiZ3JvdXBWYWx1ZVwiXG4gIFtidWZmZXJBbW91bnRdPVwiYnVmZmVyQW1vdW50XCJcbiAgW2hpZGVTZWxlY3RlZF09XCJoaWRlU2VsZWN0ZWRcIlxuICBbaW5wdXRBdHRyc109XCJpbnB1dEF0dHJzXCJcbiAgW2xvYWRpbmddPVwibG9hZGluZ1wiXG4gIFtsb2FkaW5nVGV4dF09XCJsb2FkaW5nVGV4dFwiXG4gIFtsYWJlbEZvcklkXT1cImxhYmVsRm9ySWRcIlxuICBbbWFya0ZpcnN0XT1cIm1hcmtGaXJzdFwiXG4gIFttYXhTZWxlY3RlZEl0ZW1zXT1cIm1heFNlbGVjdGVkSXRlbXNcIlxuICBbbXVsdGlwbGVdPVwibXVsdGlwbGVcIlxuICBbbm90Rm91bmRUZXh0XT1cIm5vdEZvdW5kVGV4dFwiXG4gIFtyZWFkb25seV09XCJyZWFkb25seSB8fCBkaXNhYmxlZFwiXG4gIFt0eXBlYWhlYWRdPVwidHlwZWFoZWFkXCJcbiAgW3R5cGVUb1NlYXJjaFRleHRdPVwidHlwZVRvU2VhcmNoVGV4dFwiXG4gIFt0cmFja0J5Rm5dPVwidHJhY2tCeUZuXCJcbiAgW3NlYXJjaGFibGVdPVwic2VhcmNoYWJsZVwiXG4gIFtzZWFyY2hGbl09XCJzZWFyY2hGblwiXG4gIFtzZWFyY2hXaGlsZUNvbXBvc2luZ109XCJzZWFyY2hXaGlsZUNvbXBvc2luZ1wiXG4gIFtjbGVhclNlYXJjaE9uQWRkXT1cImNsZWFyU2VhcmNoT25BZGRcIlxuICBbc2VsZWN0YWJsZUdyb3VwXT1cInNlbGVjdGFibGVHcm91cFwiXG4gIFtzZWxlY3RhYmxlR3JvdXBBc01vZGVsXT1cInNlbGVjdGFibGVHcm91cEFzTW9kZWxcIlxuICBbc2VsZWN0T25UYWJdPVwic2VsZWN0T25UYWJcIlxuICBbdGFiSW5kZXhdPVwidGFiSW5kZXhcIlxuICBbb3Blbk9uRW50ZXJdPVwib3Blbk9uRW50ZXJcIlxuICBbbWluVGVybUxlbmd0aF09XCJtaW5UZXJtTGVuZ3RoXCJcbiAgW2VkaXRhYmxlU2VhcmNoVGVybV09XCJlZGl0YWJsZVNlYXJjaFRlcm1cIlxuICBba2V5RG93bkZuXT1cImtleURvd25GblwiXG4gIFt2aXJ0dWFsU2Nyb2xsXT1cInZpcnR1YWxTY3JvbGxcIlxuICAoYmx1cik9XCJibHVyRXZlbnQuZW1pdCgkZXZlbnQpXCJcbiAgKGZvY3VzKT1cImZvY3VzRXZlbnQuZW1pdCgkZXZlbnQpXCJcbiAgKGNoYW5nZSk9XCJjaGFuZ2VFdmVudC5lbWl0KCRldmVudClcIlxuICAob3Blbik9XCJvcGVuQ2hhbmdlKClcIlxuICAoY2xvc2UpPVwiY2xvc2VFdmVudC5lbWl0KClcIlxuICAoc2VhcmNoKT1cInNlYXJjaEV2ZW50LmVtaXQoJGV2ZW50KVwiXG4gIChjbGVhcik9XCJjbGVhckV2ZW50LmVtaXQoJGV2ZW50KVwiXG4gIChhZGQpPVwiYWRkRXZlbnQuZW1pdCgkZXZlbnQpXCJcbiAgKHJlbW92ZSk9XCJyZW1vdmVFdmVudC5lbWl0KCRldmVudClcIlxuICAoc2Nyb2xsKT1cInNjcm9sbC5lbWl0KCRldmVudClcIlxuICAoc2Nyb2xsVG9FbmQpPVwic2Nyb2xsVG9FbmQuZW1pdCgpXCI+XG5cbiAgQGlmIChvcHRpb25UZW1wbGF0ZSkge1xuICAgIDxuZy10ZW1wbGF0ZSBuZy1vcHRpb24tdG1wIGxldC1pdGVtPVwiaXRlbVwiIGxldC1pdGVtJD1cIml0ZW0kXCIgbGV0LWluZGV4PVwiaW5kZXhcIlxuICAgICAgbGV0LXNlYXJjaFRlcm09XCJzZWFyY2hUZXJtXCI+XG4gICAgICA8bmctdGVtcGxhdGUgW25nVGVtcGxhdGVPdXRsZXRdPVwib3B0aW9uVGVtcGxhdGVcIlxuICAgICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwieyBpdGVtOiBpdGVtLCBpdGVtJDogaXRlbSQsIGluZGV4OiBpbmRleCwgc2VhcmNoVGVybTogc2VhcmNoVGVybSB9XCI+XG4gICAgICA8L25nLXRlbXBsYXRlPlxuICAgIDwvbmctdGVtcGxhdGU+XG4gIH1cblxuICBAaWYgKG9wdGdyb3VwVGVtcGxhdGUpIHtcbiAgICA8bmctdGVtcGxhdGUgbmctb3B0Z3JvdXAtdG1wIGxldC1pdGVtPVwiaXRlbVwiIGxldC1pdGVtJD1cIml0ZW0kXCIgbGV0LWluZGV4PVwiaW5kZXhcIlxuICAgICAgbGV0LXNlYXJjaFRlcm09XCJzZWFyY2hUZXJtXCI+XG4gICAgICA8bmctdGVtcGxhdGUgW25nVGVtcGxhdGVPdXRsZXRdPVwib3B0Z3JvdXBUZW1wbGF0ZVwiXG4gICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7IGl0ZW06IGl0ZW0sIGl0ZW0kOiBpdGVtJCwgaW5kZXg6IGluZGV4LCBzZWFyY2hUZXJtOiBzZWFyY2hUZXJtIH1cIj5cbiAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgPC9uZy10ZW1wbGF0ZT5cbiAgfVxuXG4gIEBpZiAobGFiZWxUZW1wbGF0ZSkge1xuICAgIDxuZy10ZW1wbGF0ZSBuZy1sYWJlbC10bXAgbGV0LWl0ZW09XCJpdGVtXCIgbGV0LWNsZWFyPVwiY2xlYXJcIiBsZXQtbGFiZWw9XCJsYWJlbFwiPlxuICAgICAgPG5nLXRlbXBsYXRlIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImxhYmVsVGVtcGxhdGVcIlxuICAgICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwieyBpdGVtOiBpdGVtLCBjbGVhcjogY2xlYXIsIGxhYmVsOiBsYWJlbCB9XCI+XG4gICAgICA8L25nLXRlbXBsYXRlPlxuICAgIDwvbmctdGVtcGxhdGU+XG4gIH1cblxuICBAaWYgKG11bHRpTGFiZWxUZW1wbGF0ZSkge1xuICAgIDxuZy10ZW1wbGF0ZSBuZy1tdWx0aS1sYWJlbC10bXAgbGV0LWl0ZW1zPVwiaXRlbXNcIiBsZXQtY2xlYXI9XCJjbGVhclwiPlxuICAgICAgPG5nLXRlbXBsYXRlIFtuZ1RlbXBsYXRlT3V0bGV0XT1cIm11bHRpTGFiZWxUZW1wbGF0ZVwiXG4gICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7IGl0ZW1zOiBpdGVtcywgY2xlYXI6IGNsZWFyIH1cIj5cbiAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgPC9uZy10ZW1wbGF0ZT5cbiAgfVxuXG4gIEBpZiAoaGVhZGVyVGVtcGxhdGUpIHtcbiAgICA8bmctdGVtcGxhdGUgbmctaGVhZGVyLXRtcD5cbiAgICAgIDxuZy10ZW1wbGF0ZSBbbmdUZW1wbGF0ZU91dGxldF09XCJoZWFkZXJUZW1wbGF0ZVwiPjwvbmctdGVtcGxhdGU+XG4gICAgPC9uZy10ZW1wbGF0ZT5cbiAgfVxuXG4gIEBpZiAoZm9vdGVyVGVtcGxhdGUpIHtcbiAgICA8bmctdGVtcGxhdGUgbmctZm9vdGVyLXRtcD5cbiAgICAgIDxuZy10ZW1wbGF0ZSBbbmdUZW1wbGF0ZU91dGxldF09XCJmb290ZXJUZW1wbGF0ZVwiPjwvbmctdGVtcGxhdGU+XG4gICAgPC9uZy10ZW1wbGF0ZT5cbiAgfVxuXG4gIEBpZiAobm90Rm91bmRUZW1wbGF0ZSkge1xuICAgIDxuZy10ZW1wbGF0ZSBuZy1ub3Rmb3VuZC10bXAgbGV0LXNlYXJjaFRlcm09XCJzZWFyY2hUZXJtXCI+XG4gICAgICA8bmctdGVtcGxhdGUgW25nVGVtcGxhdGVPdXRsZXRdPVwibm90Rm91bmRUZW1wbGF0ZVwiXG4gICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7IHNlYXJjaFRlcm06IHNlYXJjaFRlcm0gfVwiPlxuICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICA8L25nLXRlbXBsYXRlPlxuICB9XG5cbiAgQGlmICh0eXBlVG9TZWFyY2hUZW1wbGF0ZSkge1xuICAgIDxuZy10ZW1wbGF0ZSBuZy10eXBldG9zZWFyY2gtdG1wPlxuICAgICAgPG5nLXRlbXBsYXRlIFtuZ1RlbXBsYXRlT3V0bGV0XT1cInR5cGVUb1NlYXJjaFRlbXBsYXRlXCI+PC9uZy10ZW1wbGF0ZT5cbiAgICA8L25nLXRlbXBsYXRlPlxuICB9XG5cbiAgQGlmIChsb2FkaW5nVGV4dFRlbXBsYXRlKSB7XG4gICAgPG5nLXRlbXBsYXRlIG5nLWxvYWRpbmd0ZXh0LXRtcCBsZXQtc2VhcmNoVGVybT1cInNlYXJjaFRlcm1cIj5cbiAgICAgIDxuZy10ZW1wbGF0ZSBbbmdUZW1wbGF0ZU91dGxldF09XCJsb2FkaW5nVGV4dFRlbXBsYXRlXCJcbiAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInsgc2VhcmNoVGVybTogc2VhcmNoVGVybSB9XCI+XG4gICAgICA8L25nLXRlbXBsYXRlPlxuICAgIDwvbmctdGVtcGxhdGU+XG4gIH1cblxuICBAaWYgKHRhZ1RlbXBsYXRlKSB7XG4gICAgPG5nLXRlbXBsYXRlIG5nLXRhZy10bXAgbGV0LXNlYXJjaFRlcm09XCJzZWFyY2hUZXJtXCI+XG4gICAgICA8bmctdGVtcGxhdGUgW25nVGVtcGxhdGVPdXRsZXRdPVwidGFnVGVtcGxhdGVcIlxuICAgICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwieyBzZWFyY2hUZXJtOiBzZWFyY2hUZXJtIH1cIj5cbiAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgPC9uZy10ZW1wbGF0ZT5cbiAgfVxuXG4gIEBpZiAobG9hZGluZ1NwaW5uZXJUZW1wbGF0ZSkge1xuICAgIDxuZy10ZW1wbGF0ZSBuZy1sb2FkaW5nc3Bpbm5lci10bXA+XG4gICAgICA8bmctdGVtcGxhdGUgW25nVGVtcGxhdGVPdXRsZXRdPVwibG9hZGluZ1NwaW5uZXJUZW1wbGF0ZVwiPjwvbmctdGVtcGxhdGU+XG4gICAgPC9uZy10ZW1wbGF0ZT5cbiAgfVxuXG48L25nLXNlbGVjdD5cbiJdfQ==