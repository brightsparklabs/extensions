import { SelectionModel } from '@angular/cdk/collections';
import {
  AfterViewInit,
  ChangeDetectorRef,
  ElementRef,
  EventEmitter,
  InjectionToken,
  KeyValueChangeRecord,
  OnChanges,
  OnDestroy,
  QueryList,
  SimpleChanges,
  TemplateRef,
  TrackByFunction,
} from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort, SortDirection } from '@angular/material/sort';
import {
  MatFooterRowDef,
  MatHeaderRowDef,
  MatRowDef,
  MatTable,
  MatTableDataSource,
} from '@angular/material/table';
import { MtxGridColumnMenu } from './column-menu';
import { MtxGridExpansionToggle } from './expansion-toggle';
import { MtxGridUtils } from './grid-utils';
import {
  MtxGridButtonType,
  MtxGridCellTemplate,
  MtxGridColumn,
  MtxGridColumnPinOption,
  MtxGridDefaultOptions,
  MtxGridRowClassFormatter,
  MtxGridRowSelectionFormatter,
} from './interfaces';
import { MtxGridSelectableCell } from './selectable-cell';
import * as i0 from '@angular/core';
/** Injection token that can be used to specify default grid options. */
export declare const MTX_GRID_DEFAULT_OPTIONS: InjectionToken<MtxGridDefaultOptions>;
export declare class MtxGrid implements OnChanges, AfterViewInit, OnDestroy {
  private _utils;
  private _changeDetectorRef;
  private _defaultOptions?;
  table: MatTable<any>;
  paginator: MatPaginator;
  sort: MatSort;
  rowDefs: QueryList<MatRowDef<any>>;
  headerRowDefs: QueryList<MatHeaderRowDef>;
  footerRowDefs: QueryList<MatFooterRowDef>;
  columnMenu: MtxGridColumnMenu;
  tableContainer: ElementRef<HTMLDivElement>;
  dataSource: MatTableDataSource<unknown, MatPaginator>;
  /** The grid's displayed columns. */
  displayedColumns: string[];
  /** The grid's columns. */
  columns: MtxGridColumn[];
  /** The grid's data. */
  data: any[];
  /** The total number of the data. */
  length: number;
  /** Whether the grid is loading. */
  loading: boolean;
  /** Tracking function that will be used to check the differences in data changes. */
  trackBy: TrackByFunction<any>;
  /** Whether the column is resizable. */
  columnResizable: boolean;
  /** Placeholder for the empty value (`null`, `''`, `[]`). */
  emptyValuePlaceholder: string;
  /** Whether to paginate the data on front end. */
  pageOnFront: boolean;
  /** Whether to show the paginator. */
  showPaginator: boolean;
  /** Whether the paginator is disabled. */
  pageDisabled: boolean;
  /** Whether to show the first/last buttons UI to the user. */
  showFirstLastButtons: boolean;
  /** The zero-based page index of the displayed list of items. */
  pageIndex: number;
  /** Number of items to display on a page. */
  pageSize: number;
  /** The set of provided page size options to display to the user. */
  pageSizeOptions: number[];
  /** Whether to hide the page size selection UI from the user. */
  hidePageSize: boolean;
  /** Event emitted when the paginator changes the page size or page index. */
  page: EventEmitter<PageEvent>;
  /** The template for the pagination. */
  paginationTemplate: TemplateRef<any>;
  /** Whether to sort the data on front end. */
  sortOnFront: boolean;
  /** The id of the most recently sorted MatSortable. */
  sortActive: string;
  /** The sort direction of the currently active MatSortable. */
  sortDirection: SortDirection;
  /**
   * Whether to disable the user from clearing the sort by finishing the sort direction cycle.
   * May be overriden by the column's `disableClear` in `sortProp`.
   */
  sortDisableClear: boolean;
  /** Whether the sort is disabled. */
  sortDisabled: boolean;
  /**
   * The direction to set when an MatSortable is initially sorted.
   * May be overriden by the column's `start` in `sortProp`.
   */
  sortStart: 'asc' | 'desc';
  /** Event emitted when the user changes either the active sort or sort direction. */
  sortChange: EventEmitter<Sort>;
  /** Whether to use the row hover style. */
  rowHover: boolean;
  /** Whether to use the row striped style. */
  rowStriped: boolean;
  /** Event emitted when the user clicks the row. */
  rowClick: EventEmitter<any>;
  /** Event emitted when the user attempts to open a context menu. */
  rowContextMenu: EventEmitter<any>;
  expansionRowStates: any[];
  /** Whether the row is expandable. */
  expandable: boolean;
  /** The template for the expandable row. */
  expansionTemplate: TemplateRef<any>;
  /** Event emitted when the user toggles the expandable row. */
  expansionChange: EventEmitter<any>;
  rowSelection: SelectionModel<any>;
  /** Whether to support multiple row/cell selection. */
  multiSelectable: boolean;
  /** Whether the user can select multiple rows with click. */
  multiSelectionWithClick: boolean;
  /** Whether the row is selectable. */
  rowSelectable: boolean;
  /** Whether to hide the row selection checkbox. */
  hideRowSelectionCheckbox: boolean;
  /** Whether disable rows to be selected when clicked. */
  disableRowClickSelection: boolean;
  /** The formatter to disable the row selection or hide the row's checkbox. */
  rowSelectionFormatter: MtxGridRowSelectionFormatter;
  /** The formatter to set the row's class. */
  rowClassFormatter?: MtxGridRowClassFormatter;
  /** The selected row items. */
  rowSelected: any[];
  /** Event emitted when the row is selected. */
  rowSelectedChange: EventEmitter<any[]>;
  cellSelection: any[];
  /** Whether the cell is selectable. */
  cellSelectable: boolean;
  /** Event emitted when the cell is selected. */
  cellSelectedChange: EventEmitter<any[]>;
  private _selectedCell?;
  /** Whether to show the toolbar. */
  showToolbar: boolean;
  /** The text of the toolbar's title. */
  toolbarTitle: string;
  /** The template for the toolbar. */
  toolbarTemplate: TemplateRef<any>;
  /** Whether the column is hideable. */
  columnHideable: boolean;
  /** Hide or show when the column's checkbox is checked. */
  columnHideableChecked: 'show' | 'hide';
  /** Whether the column is sortable. */
  columnSortable: boolean;
  /** Whether the column is pinnable. */
  columnPinnable: boolean;
  /** Event emitted when the column is hided or is sorted. */
  columnChange: EventEmitter<MtxGridColumn<any>[]>;
  /** The options for the column pin list. */
  columnPinOptions: MtxGridColumnPinOption[];
  /** Whether to show the column menu button. */
  showColumnMenuButton: boolean;
  /** The text for the column menu button. */
  columnMenuButtonText: string;
  /** The type for the column menu button. */
  columnMenuButtonType: MtxGridButtonType;
  /** The color for the column menu button. */
  columnMenuButtonColor: ThemePalette;
  /** The class for the column menu button. */
  columnMenuButtonClass: string;
  /** The icon for the column menu button. */
  columnMenuButtonIcon: string;
  /** Whether to show the column-menu's header. */
  showColumnMenuHeader: boolean;
  /** The text for the column-menu's header. */
  columnMenuHeaderText: string;
  /** The template for the column-menu's header. */
  columnMenuHeaderTemplate: TemplateRef<any>;
  /** Whether to show the the column-menu's footer. */
  showColumnMenuFooter: boolean;
  /** The text for the column-menu's footer. */
  columnMenuFooterText: string;
  /** The template for the column-menu's footer. */
  columnMenuFooterTemplate: TemplateRef<any>;
  /** The displayed text for the empty data. */
  noResultText: string;
  /** The template for the empty data. */
  noResultTemplate: TemplateRef<any>;
  get _hasNoResult(): boolean;
  /** The header's cell template for the grid. */
  headerTemplate: TemplateRef<any> | MtxGridCellTemplate;
  /** The header's cell template for the grid exclude sort. */
  headerExtraTemplate: TemplateRef<any> | MtxGridCellTemplate;
  /** The cell template for the grid. */
  cellTemplate: TemplateRef<any> | MtxGridCellTemplate;
  /** Whether to use custom row template. If true, you should define a matRowDef. */
  useContentRowTemplate: boolean;
  useContentHeaderRowTemplate: boolean;
  useContentFooterRowTemplate: boolean;
  /** Whether to show the summary. */
  showSummary: boolean;
  /** The template for the summary. */
  summaryTemplate: TemplateRef<any> | MtxGridCellTemplate;
  get _whetherShowSummary(): boolean;
  /** Whether to show the sidebar. */
  showSidebar: boolean;
  /** The template for the sidebar. */
  sidebarTemplate: TemplateRef<any>;
  /** Whether to show the status bar. */
  showStatusbar: boolean;
  /** The template for the status bar. */
  statusbarTemplate: TemplateRef<any>;
  /** The changed record of row data. */
  rowChangeRecord?: KeyValueChangeRecord<string, any>;
  constructor(
    _utils: MtxGridUtils,
    _changeDetectorRef: ChangeDetectorRef,
    _defaultOptions?: MtxGridDefaultOptions | undefined
  );
  detectChanges(): void;
  _getColData(data: any[], colDef: MtxGridColumn): any[];
  _isColumnHide(item: MtxGridColumn): boolean;
  ngOnChanges(changes: SimpleChanges): void;
  ngAfterViewInit(): void;
  ngOnDestroy(): void;
  _countPinnedPosition(): void;
  _getIndex(index: number | undefined, dataIndex: number): number;
  _onSortChange(sort: Sort): void;
  _onRowDataChange(record: KeyValueChangeRecord<string, any>): void;
  /** Expansion change event */
  _onExpansionChange(
    expansionRef: MtxGridExpansionToggle,
    rowData: Record<string, any>,
    column: MtxGridColumn,
    index: number
  ): void;
  /** Cell select event */
  _selectCell(
    cellRef: MtxGridSelectableCell,
    rowData: Record<string, any>,
    colDef: MtxGridColumn
  ): void;
  /** Row select event */
  _selectRow(event: MouseEvent, rowData: Record<string, any>, index: number): void;
  /** Whether the number of selected elements matches the total number of rows. */
  _isAllSelected(): boolean;
  /** Select all rows if they are not all selected; otherwise clear selection. */
  _toggleMasterCheckbox(): void;
  /** Select normal row */
  _toggleNormalCheckbox(row: Record<string, any>): void;
  /** Column change event */
  _onColumnChange(columns: MtxGridColumn[]): void;
  getDisplayedColumnFields(columns: MtxGridColumn[]): string[];
  /** Customize expansion event */
  toggleExpansion(index: number): any;
  /** Scroll to top when turn to the next page. */
  _onPage(e: PageEvent): void;
  scrollTop(value?: number): number | void;
  scrollLeft(value?: number): number | void;
  _contextmenu(event: MouseEvent, rowData: Record<string, any>, index: number): void;
  static ɵfac: i0.ɵɵFactoryDeclaration<MtxGrid, [null, null, { optional: true }]>;
  static ɵcmp: i0.ɵɵComponentDeclaration<
    MtxGrid,
    'mtx-grid',
    ['mtxGrid'],
    {
      displayedColumns: { alias: 'displayedColumns'; required: false };
      columns: { alias: 'columns'; required: false };
      data: { alias: 'data'; required: false };
      length: { alias: 'length'; required: false };
      loading: { alias: 'loading'; required: false };
      trackBy: { alias: 'trackBy'; required: false };
      columnResizable: { alias: 'columnResizable'; required: false };
      emptyValuePlaceholder: { alias: 'emptyValuePlaceholder'; required: false };
      pageOnFront: { alias: 'pageOnFront'; required: false };
      showPaginator: { alias: 'showPaginator'; required: false };
      pageDisabled: { alias: 'pageDisabled'; required: false };
      showFirstLastButtons: { alias: 'showFirstLastButtons'; required: false };
      pageIndex: { alias: 'pageIndex'; required: false };
      pageSize: { alias: 'pageSize'; required: false };
      pageSizeOptions: { alias: 'pageSizeOptions'; required: false };
      hidePageSize: { alias: 'hidePageSize'; required: false };
      paginationTemplate: { alias: 'paginationTemplate'; required: false };
      sortOnFront: { alias: 'sortOnFront'; required: false };
      sortActive: { alias: 'sortActive'; required: false };
      sortDirection: { alias: 'sortDirection'; required: false };
      sortDisableClear: { alias: 'sortDisableClear'; required: false };
      sortDisabled: { alias: 'sortDisabled'; required: false };
      sortStart: { alias: 'sortStart'; required: false };
      rowHover: { alias: 'rowHover'; required: false };
      rowStriped: { alias: 'rowStriped'; required: false };
      expandable: { alias: 'expandable'; required: false };
      expansionTemplate: { alias: 'expansionTemplate'; required: false };
      multiSelectable: { alias: 'multiSelectable'; required: false };
      multiSelectionWithClick: { alias: 'multiSelectionWithClick'; required: false };
      rowSelectable: { alias: 'rowSelectable'; required: false };
      hideRowSelectionCheckbox: { alias: 'hideRowSelectionCheckbox'; required: false };
      disableRowClickSelection: { alias: 'disableRowClickSelection'; required: false };
      rowSelectionFormatter: { alias: 'rowSelectionFormatter'; required: false };
      rowClassFormatter: { alias: 'rowClassFormatter'; required: false };
      rowSelected: { alias: 'rowSelected'; required: false };
      cellSelectable: { alias: 'cellSelectable'; required: false };
      showToolbar: { alias: 'showToolbar'; required: false };
      toolbarTitle: { alias: 'toolbarTitle'; required: false };
      toolbarTemplate: { alias: 'toolbarTemplate'; required: false };
      columnHideable: { alias: 'columnHideable'; required: false };
      columnHideableChecked: { alias: 'columnHideableChecked'; required: false };
      columnSortable: { alias: 'columnSortable'; required: false };
      columnPinnable: { alias: 'columnPinnable'; required: false };
      columnPinOptions: { alias: 'columnPinOptions'; required: false };
      showColumnMenuButton: { alias: 'showColumnMenuButton'; required: false };
      columnMenuButtonText: { alias: 'columnMenuButtonText'; required: false };
      columnMenuButtonType: { alias: 'columnMenuButtonType'; required: false };
      columnMenuButtonColor: { alias: 'columnMenuButtonColor'; required: false };
      columnMenuButtonClass: { alias: 'columnMenuButtonClass'; required: false };
      columnMenuButtonIcon: { alias: 'columnMenuButtonIcon'; required: false };
      showColumnMenuHeader: { alias: 'showColumnMenuHeader'; required: false };
      columnMenuHeaderText: { alias: 'columnMenuHeaderText'; required: false };
      columnMenuHeaderTemplate: { alias: 'columnMenuHeaderTemplate'; required: false };
      showColumnMenuFooter: { alias: 'showColumnMenuFooter'; required: false };
      columnMenuFooterText: { alias: 'columnMenuFooterText'; required: false };
      columnMenuFooterTemplate: { alias: 'columnMenuFooterTemplate'; required: false };
      noResultText: { alias: 'noResultText'; required: false };
      noResultTemplate: { alias: 'noResultTemplate'; required: false };
      headerTemplate: { alias: 'headerTemplate'; required: false };
      headerExtraTemplate: { alias: 'headerExtraTemplate'; required: false };
      cellTemplate: { alias: 'cellTemplate'; required: false };
      useContentRowTemplate: { alias: 'useContentRowTemplate'; required: false };
      useContentHeaderRowTemplate: { alias: 'useContentHeaderRowTemplate'; required: false };
      useContentFooterRowTemplate: { alias: 'useContentFooterRowTemplate'; required: false };
      showSummary: { alias: 'showSummary'; required: false };
      summaryTemplate: { alias: 'summaryTemplate'; required: false };
      showSidebar: { alias: 'showSidebar'; required: false };
      sidebarTemplate: { alias: 'sidebarTemplate'; required: false };
      showStatusbar: { alias: 'showStatusbar'; required: false };
      statusbarTemplate: { alias: 'statusbarTemplate'; required: false };
    },
    {
      page: 'page';
      sortChange: 'sortChange';
      rowClick: 'rowClick';
      rowContextMenu: 'rowContextMenu';
      expansionChange: 'expansionChange';
      rowSelectedChange: 'rowSelectedChange';
      cellSelectedChange: 'cellSelectedChange';
      columnChange: 'columnChange';
    },
    ['rowDefs', 'headerRowDefs', 'footerRowDefs'],
    never,
    true,
    never
  >;
  static ngAcceptInputType_loading: unknown;
  static ngAcceptInputType_columnResizable: unknown;
  static ngAcceptInputType_pageOnFront: unknown;
  static ngAcceptInputType_showPaginator: unknown;
  static ngAcceptInputType_pageDisabled: unknown;
  static ngAcceptInputType_showFirstLastButtons: unknown;
  static ngAcceptInputType_hidePageSize: unknown;
  static ngAcceptInputType_sortOnFront: unknown;
  static ngAcceptInputType_sortDisableClear: unknown;
  static ngAcceptInputType_sortDisabled: unknown;
  static ngAcceptInputType_rowHover: unknown;
  static ngAcceptInputType_rowStriped: unknown;
  static ngAcceptInputType_expandable: unknown;
  static ngAcceptInputType_multiSelectable: unknown;
  static ngAcceptInputType_multiSelectionWithClick: unknown;
  static ngAcceptInputType_rowSelectable: unknown;
  static ngAcceptInputType_hideRowSelectionCheckbox: unknown;
  static ngAcceptInputType_disableRowClickSelection: unknown;
  static ngAcceptInputType_cellSelectable: unknown;
  static ngAcceptInputType_showToolbar: unknown;
  static ngAcceptInputType_columnHideable: unknown;
  static ngAcceptInputType_columnSortable: unknown;
  static ngAcceptInputType_columnPinnable: unknown;
  static ngAcceptInputType_showColumnMenuButton: unknown;
  static ngAcceptInputType_showColumnMenuHeader: unknown;
  static ngAcceptInputType_showColumnMenuFooter: unknown;
  static ngAcceptInputType_useContentRowTemplate: unknown;
  static ngAcceptInputType_useContentHeaderRowTemplate: unknown;
  static ngAcceptInputType_useContentFooterRowTemplate: unknown;
  static ngAcceptInputType_showSummary: unknown;
  static ngAcceptInputType_showSidebar: unknown;
  static ngAcceptInputType_showStatusbar: unknown;
}
