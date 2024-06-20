import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { EventEmitter, TemplateRef } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import {
  MtxGridButtonType,
  MtxGridColumn,
  MtxGridColumnPinOption,
  MtxGridColumnPinValue,
} from './interfaces';
import * as i0 from '@angular/core';
export declare class MtxGridColumnMenu {
  menuPanel: MatMenu;
  menuTrigger: MatMenuTrigger;
  columns: MtxGridColumn[];
  selectable: boolean;
  selectableChecked: 'show' | 'hide';
  sortable: boolean;
  pinnable: boolean;
  get buttonText(): string;
  set buttonText(value: string);
  private _buttonText;
  buttonType: MtxGridButtonType;
  buttonColor: ThemePalette;
  buttonClass: string;
  buttonIcon: string;
  showHeader: boolean;
  headerText: string;
  headerTemplate: TemplateRef<any>;
  showFooter: boolean;
  footerText: string;
  footerTemplate: TemplateRef<any>;
  columnChange: EventEmitter<MtxGridColumn<any>[]>;
  get pinOptions(): MtxGridColumnPinOption[];
  set pinOptions(value: MtxGridColumnPinOption[]);
  private _pinOptions;
  _handleDroped(e: CdkDragDrop<string[]>): void;
  _handleChecked(col: MtxGridColumn): void;
  _handlePinSelect(col: MtxGridColumn, val: MtxGridColumnPinValue): void;
  static ɵfac: i0.ɵɵFactoryDeclaration<MtxGridColumnMenu, never>;
  static ɵcmp: i0.ɵɵComponentDeclaration<
    MtxGridColumnMenu,
    'mtx-grid-column-menu',
    ['mtxGridColumnMenu'],
    {
      columns: { alias: 'columns'; required: false };
      selectable: { alias: 'selectable'; required: false };
      selectableChecked: { alias: 'selectableChecked'; required: false };
      sortable: { alias: 'sortable'; required: false };
      pinnable: { alias: 'pinnable'; required: false };
      buttonText: { alias: 'buttonText'; required: false };
      buttonType: { alias: 'buttonType'; required: false };
      buttonColor: { alias: 'buttonColor'; required: false };
      buttonClass: { alias: 'buttonClass'; required: false };
      buttonIcon: { alias: 'buttonIcon'; required: false };
      showHeader: { alias: 'showHeader'; required: false };
      headerText: { alias: 'headerText'; required: false };
      headerTemplate: { alias: 'headerTemplate'; required: false };
      showFooter: { alias: 'showFooter'; required: false };
      footerText: { alias: 'footerText'; required: false };
      footerTemplate: { alias: 'footerTemplate'; required: false };
      pinOptions: { alias: 'pinOptions'; required: false };
    },
    { columnChange: 'columnChange' },
    never,
    never,
    true,
    never
  >;
}
