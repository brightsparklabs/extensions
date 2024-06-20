import { FocusMonitor } from '@angular/cdk/a11y';
import {
  AfterViewInit,
  ChangeDetectorRef,
  ElementRef,
  EventEmitter,
  OnDestroy,
  QueryList,
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { MtxCheckboxGroupOption } from './interfaces';
import * as i0 from '@angular/core';
export declare class MtxCheckboxBase {
  label?: any;
  value?: any;
  constructor(label?: any, value?: any);
}
export declare class MtxCheckboxGroup implements AfterViewInit, OnDestroy, ControlValueAccessor {
  private _changeDetectorRef;
  private _focusMonitor;
  private _elementRef;
  _checkboxes: QueryList<MatCheckbox>;
  get items(): any[];
  set items(value: any[]);
  private _items;
  private _originalItems;
  bindLabel: string;
  bindValue: string;
  showSelectAll: boolean;
  selectAllLabel: string;
  get compareWith(): ((o1: any, o2: any) => boolean) | undefined;
  set compareWith(fn: ((o1: any, o2: any) => boolean) | undefined);
  private _compareWith?;
  disabled: boolean;
  change: EventEmitter<{
    model: MtxCheckboxGroupOption[];
    index: number;
  }>;
  selectAll: boolean;
  selectAllIndeterminate: boolean;
  selectedItems: MtxCheckboxGroupOption[];
  _onChange: (value: MtxCheckboxGroupOption[]) => void;
  _onTouched: () => void;
  constructor(
    _changeDetectorRef: ChangeDetectorRef,
    _focusMonitor: FocusMonitor,
    _elementRef: ElementRef<HTMLElement>
  );
  ngAfterViewInit(): void;
  ngOnDestroy(): void;
  /**
   * Finds and selects and option based on its value.
   * @returns Option that has the corresponding value.
   */
  private _selectValue;
  /**
   * Sets the model value. Implemented as part of ControlValueAccessor.
   * @param value New value to be written to the model.
   */
  writeValue(value: any[]): void;
  /**
   * Registers a callback to be triggered when the model value changes.
   * Implemented as part of ControlValueAccessor.
   * @param fn Callback to be registered.
   */
  registerOnChange(fn: (value: MtxCheckboxGroupOption[]) => Record<string, unknown>): void;
  /**
   * Registers a callback to be triggered when the control is touched.
   * Implemented as part of ControlValueAccessor.
   * @param fn Callback to be registered.
   */
  registerOnTouched(fn: () => Record<string, unknown>): void;
  /**
   * Sets the disabled state of the control. Implemented as a part of ControlValueAccessor.
   * @param isDisabled Whether the control should be disabled.
   */
  setDisabledState(isDisabled: boolean): void;
  private _checkMasterCheckboxState;
  private _getSelectedItems;
  /** Handle normal checkbox toggle */
  _updateNormalCheckboxState(e: MatCheckboxChange, index: number): void;
  /** Handle master checkbox toggle */
  _updateMasterCheckboxState(e: MatCheckboxChange, index: number): void;
  static ɵfac: i0.ɵɵFactoryDeclaration<MtxCheckboxGroup, never>;
  static ɵcmp: i0.ɵɵComponentDeclaration<
    MtxCheckboxGroup,
    'mtx-checkbox-group',
    ['mtxCheckboxGroup'],
    {
      items: { alias: 'items'; required: false };
      bindLabel: { alias: 'bindLabel'; required: false };
      bindValue: { alias: 'bindValue'; required: false };
      showSelectAll: { alias: 'showSelectAll'; required: false };
      selectAllLabel: { alias: 'selectAllLabel'; required: false };
      compareWith: { alias: 'compareWith'; required: false };
      disabled: { alias: 'disabled'; required: false };
    },
    { change: 'change' },
    ['_checkboxes'],
    never,
    true,
    never
  >;
  static ngAcceptInputType_showSelectAll: unknown;
  static ngAcceptInputType_disabled: unknown;
}
