import { FocusMonitor } from '@angular/cdk/a11y';
import {
  AfterViewInit,
  ChangeDetectorRef,
  DoCheck,
  ElementRef,
  EventEmitter,
  InjectionToken,
  OnDestroy,
  OnInit,
  QueryList,
  TemplateRef,
} from '@angular/core';
import { ControlValueAccessor, FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import { NgSelectComponent } from '@ng-select/ng-select';
import { Subject } from 'rxjs';
import { MtxOption } from './option';
import * as i0 from '@angular/core';
export type DropdownPosition = 'bottom' | 'top' | 'auto';
export type AddTagFn = (term: string) => any;
export type CompareWithFn = (a: any, b: any) => boolean;
export type GroupValueFn = (
  key: string | Record<string, any>,
  children: any[]
) => string | Record<string, any>;
export type SearchFn = (term: string, item: any) => boolean;
export type TrackByFn = (item: any) => any;
/**
 * Represents the default options for the select that can be configured
 * using the `MTX_SELECT_DEFAULT_OPTIONS` injection token.
 */
export interface MtxSelectDefaultOptions {
  placeholder?: string;
  notFoundText?: string;
  typeToSearchText?: string;
  addTagText?: string;
  loadingText?: string;
  clearAllText?: string;
  appendTo?: string;
  bindValue?: string;
  bindLabel?: string;
  openOnEnter?: boolean;
  clearSearchOnAdd?: boolean;
}
/** Injection token that can be used to specify default select options. */
export declare const MTX_SELECT_DEFAULT_OPTIONS: InjectionToken<MtxSelectDefaultOptions>;
export declare class MtxSelect
  implements
    OnInit,
    OnDestroy,
    DoCheck,
    AfterViewInit,
    ControlValueAccessor,
    MatFormFieldControl<any>
{
  protected _changeDetectorRef: ChangeDetectorRef;
  protected _elementRef: ElementRef;
  protected _focusMonitor: FocusMonitor;
  ngControl: NgControl;
  protected _parentFormField?: MatFormField | undefined;
  protected _defaultOptions?: MtxSelectDefaultOptions | undefined;
  ngSelect: NgSelectComponent;
  optionTemplate: TemplateRef<any>;
  optgroupTemplate: TemplateRef<any>;
  labelTemplate: TemplateRef<any>;
  multiLabelTemplate: TemplateRef<any>;
  headerTemplate: TemplateRef<any>;
  footerTemplate: TemplateRef<any>;
  notFoundTemplate: TemplateRef<any>;
  typeToSearchTemplate: TemplateRef<any>;
  loadingTextTemplate: TemplateRef<any>;
  tagTemplate: TemplateRef<any>;
  loadingSpinnerTemplate: TemplateRef<any>;
  mtxOptions: QueryList<MtxOption>;
  addTag: boolean | AddTagFn;
  addTagText: string;
  appearance: string;
  appendTo: string;
  bindLabel: string | undefined;
  bindValue: string | undefined;
  closeOnSelect: boolean;
  clearAllText: string;
  clearable: boolean;
  clearOnBackspace: boolean;
  compareWith: CompareWithFn;
  dropdownPosition: DropdownPosition;
  groupBy: string | ((value: any) => any);
  groupValue: GroupValueFn;
  bufferAmount: number;
  selectableGroup: boolean;
  selectableGroupAsModel: boolean;
  hideSelected: boolean;
  loading: boolean;
  loadingText: string;
  labelForId: string | null;
  markFirst: boolean;
  maxSelectedItems: number;
  multiple: boolean;
  notFoundText: string;
  searchable: boolean;
  readonly: boolean;
  searchFn: SearchFn | null;
  searchWhileComposing: boolean;
  selectOnTab: boolean;
  trackByFn: TrackByFn | null;
  inputAttrs: {
    [key: string]: string;
  };
  tabIndex: number;
  openOnEnter: boolean;
  minTermLength: number;
  editableSearchTerm: boolean;
  keyDownFn: (_: KeyboardEvent) => boolean;
  virtualScroll: boolean;
  typeToSearchText: string;
  typeahead: Subject<string>;
  blurEvent: EventEmitter<any>;
  focusEvent: EventEmitter<any>;
  changeEvent: EventEmitter<any>;
  openEvent: EventEmitter<any>;
  closeEvent: EventEmitter<any>;
  searchEvent: EventEmitter<{
    term: string;
    items: any[];
  }>;
  clearEvent: EventEmitter<any>;
  addEvent: EventEmitter<any>;
  removeEvent: EventEmitter<any>;
  scroll: EventEmitter<{
    start: number;
    end: number;
  }>;
  scrollToEnd: EventEmitter<any>;
  get clearSearchOnAdd(): boolean;
  set clearSearchOnAdd(value: boolean);
  private _clearSearchOnAdd;
  get items(): any[];
  set items(value: any[]);
  private _items;
  private _itemsAreUsed;
  /** Emits whenever the component is destroyed. */
  private readonly _destroy$;
  /** Value of the select control. */
  get value(): any;
  set value(newValue: any);
  private _value;
  /** Implemented as part of MatFormFieldControl. */
  readonly stateChanges: Subject<void>;
  /** Unique id of the element. */
  get id(): string;
  set id(value: string);
  private _id;
  /** Unique id for this select. */
  private _uid;
  /** Placeholder to be shown if value is empty. */
  get placeholder(): string;
  set placeholder(value: string);
  private _placeholder;
  /** Whether the select is focused. */
  get focused(): boolean;
  private _focused;
  /** Whether the select has a value. */
  get empty(): boolean;
  /**
   * Implemented as part of MatFormFieldControl.
   * @docs-private
   */
  get shouldLabelFloat(): boolean;
  /** Whether the select is disabled. */
  disabled: boolean;
  /** Whether the component is required. */
  get required(): boolean;
  set required(value: boolean);
  private _required;
  /** Object used to control when error messages are shown. */
  get errorStateMatcher(): ErrorStateMatcher;
  set errorStateMatcher(value: ErrorStateMatcher);
  /** Aria label of the select. */
  ariaLabel: string;
  /** Input that can be used to specify the `aria-labelledby` attribute. */
  ariaLabelledby: string | null;
  /** The aria-describedby attribute on the select for improved a11y. */
  _ariaDescribedby: string | null;
  /** A name for this control that can be used by `mat-form-field`. */
  controlType: string;
  /** `View -> model callback called when value changes` */
  _onChange: (value: any) => void;
  /** `View -> model callback called when select has been touched` */
  _onTouched: () => void;
  /** ID for the DOM node containing the select's value. */
  _valueId: string;
  /** Whether or not the overlay panel is open. */
  get panelOpen(): boolean;
  /**
   * Keeps track of the previous form control assigned to the select.
   * Used to detect if it has changed.
   */
  private _previousControl;
  /** Tracks the error state of the select. */
  private _errorStateTracker;
  /** Whether the select is in an error state. */
  get errorState(): boolean;
  set errorState(value: boolean);
  constructor(
    _changeDetectorRef: ChangeDetectorRef,
    _elementRef: ElementRef,
    _focusMonitor: FocusMonitor,
    defaultErrorStateMatcher: ErrorStateMatcher,
    parentForm: NgForm,
    parentFormGroup: FormGroupDirective,
    ngControl: NgControl,
    _parentFormField?: MatFormField | undefined,
    _defaultOptions?: MtxSelectDefaultOptions | undefined
  );
  ngOnInit(): void;
  ngAfterViewInit(): void;
  ngDoCheck(): void;
  ngOnDestroy(): void;
  /** Gets the value for the `aria-labelledby` attribute of the inputs. */
  _getAriaLabelledby(): string | null;
  /** Implemented as part of MatFormFieldControl. */
  setDescribedByIds(ids: string[]): void;
  /**
   * Disables the select. Part of the ControlValueAccessor interface required
   * to integrate with Angular's core forms API.
   *
   * @param isDisabled Sets whether the component is disabled.
   */
  setDisabledState(isDisabled: boolean): void;
  /** Implemented as part of MatFormFieldControl. */
  onContainerClick(event: MouseEvent): void;
  /**
   * Sets the select's value. Part of the ControlValueAccessor interface
   * required to integrate with Angular's core forms API.
   *
   * @param value New value to be written to the model.
   */
  writeValue(value: any): void;
  /**
   * Saves a callback function to be invoked when the select's value
   * changes from user input. Part of the ControlValueAccessor interface
   * required to integrate with Angular's core forms API.
   *
   * @param fn Callback to be triggered when the value changes.
   */
  registerOnChange(fn: any): void;
  /**
   * Saves a callback function to be invoked when the select is blurred
   * by the user. Part of the ControlValueAccessor interface required
   * to integrate with Angular's core forms API.
   *
   * @param fn Callback to be triggered when the component has been touched.
   */
  registerOnTouched(fn: any): void;
  /** Refreshes the error state of the select. */
  updateErrorState(): void;
  /** Assigns a specific value to the select. Returns whether the value has changed. */
  private _assignValue;
  /** NgSelect's `_setItemsFromNgOptions` */
  private _setItemsFromMtxOptions;
  open(): void;
  close(): void;
  focus(): void;
  blur(): void;
  openChange(): void;
  static ɵfac: i0.ɵɵFactoryDeclaration<
    MtxSelect,
    [
      null,
      null,
      null,
      null,
      { optional: true },
      { optional: true },
      { optional: true; self: true },
      { optional: true },
      { optional: true },
    ]
  >;
  static ɵcmp: i0.ɵɵComponentDeclaration<
    MtxSelect,
    'mtx-select',
    ['mtxSelect'],
    {
      addTag: { alias: 'addTag'; required: false };
      addTagText: { alias: 'addTagText'; required: false };
      appearance: { alias: 'appearance'; required: false };
      appendTo: { alias: 'appendTo'; required: false };
      bindLabel: { alias: 'bindLabel'; required: false };
      bindValue: { alias: 'bindValue'; required: false };
      closeOnSelect: { alias: 'closeOnSelect'; required: false };
      clearAllText: { alias: 'clearAllText'; required: false };
      clearable: { alias: 'clearable'; required: false };
      clearOnBackspace: { alias: 'clearOnBackspace'; required: false };
      compareWith: { alias: 'compareWith'; required: false };
      dropdownPosition: { alias: 'dropdownPosition'; required: false };
      groupBy: { alias: 'groupBy'; required: false };
      groupValue: { alias: 'groupValue'; required: false };
      bufferAmount: { alias: 'bufferAmount'; required: false };
      selectableGroup: { alias: 'selectableGroup'; required: false };
      selectableGroupAsModel: { alias: 'selectableGroupAsModel'; required: false };
      hideSelected: { alias: 'hideSelected'; required: false };
      loading: { alias: 'loading'; required: false };
      loadingText: { alias: 'loadingText'; required: false };
      labelForId: { alias: 'labelForId'; required: false };
      markFirst: { alias: 'markFirst'; required: false };
      maxSelectedItems: { alias: 'maxSelectedItems'; required: false };
      multiple: { alias: 'multiple'; required: false };
      notFoundText: { alias: 'notFoundText'; required: false };
      searchable: { alias: 'searchable'; required: false };
      readonly: { alias: 'readonly'; required: false };
      searchFn: { alias: 'searchFn'; required: false };
      searchWhileComposing: { alias: 'searchWhileComposing'; required: false };
      selectOnTab: { alias: 'selectOnTab'; required: false };
      trackByFn: { alias: 'trackByFn'; required: false };
      inputAttrs: { alias: 'inputAttrs'; required: false };
      tabIndex: { alias: 'tabIndex'; required: false };
      openOnEnter: { alias: 'openOnEnter'; required: false };
      minTermLength: { alias: 'minTermLength'; required: false };
      editableSearchTerm: { alias: 'editableSearchTerm'; required: false };
      keyDownFn: { alias: 'keyDownFn'; required: false };
      virtualScroll: { alias: 'virtualScroll'; required: false };
      typeToSearchText: { alias: 'typeToSearchText'; required: false };
      typeahead: { alias: 'typeahead'; required: false };
      clearSearchOnAdd: { alias: 'clearSearchOnAdd'; required: false };
      items: { alias: 'items'; required: false };
      value: { alias: 'value'; required: false };
      id: { alias: 'id'; required: false };
      placeholder: { alias: 'placeholder'; required: false };
      disabled: { alias: 'disabled'; required: false };
      required: { alias: 'required'; required: false };
      errorStateMatcher: { alias: 'errorStateMatcher'; required: false };
      ariaLabel: { alias: 'aria-label'; required: false };
      ariaLabelledby: { alias: 'aria-labelledby'; required: false };
    },
    {
      blurEvent: 'blur';
      focusEvent: 'focus';
      changeEvent: 'change';
      openEvent: 'open';
      closeEvent: 'close';
      searchEvent: 'search';
      clearEvent: 'clear';
      addEvent: 'add';
      removeEvent: 'remove';
      scroll: 'scroll';
      scrollToEnd: 'scrollToEnd';
    },
    [
      'optionTemplate',
      'optgroupTemplate',
      'labelTemplate',
      'multiLabelTemplate',
      'headerTemplate',
      'footerTemplate',
      'notFoundTemplate',
      'typeToSearchTemplate',
      'loadingTextTemplate',
      'tagTemplate',
      'loadingSpinnerTemplate',
      'mtxOptions',
    ],
    never,
    true,
    never
  >;
  static ngAcceptInputType_closeOnSelect: unknown;
  static ngAcceptInputType_clearable: unknown;
  static ngAcceptInputType_clearOnBackspace: unknown;
  static ngAcceptInputType_selectableGroup: unknown;
  static ngAcceptInputType_selectableGroupAsModel: unknown;
  static ngAcceptInputType_hideSelected: unknown;
  static ngAcceptInputType_loading: unknown;
  static ngAcceptInputType_markFirst: unknown;
  static ngAcceptInputType_multiple: unknown;
  static ngAcceptInputType_searchable: unknown;
  static ngAcceptInputType_readonly: unknown;
  static ngAcceptInputType_searchWhileComposing: unknown;
  static ngAcceptInputType_selectOnTab: unknown;
  static ngAcceptInputType_openOnEnter: unknown;
  static ngAcceptInputType_editableSearchTerm: unknown;
  static ngAcceptInputType_virtualScroll: unknown;
  static ngAcceptInputType_disabled: unknown;
  static ngAcceptInputType_required: unknown;
}
