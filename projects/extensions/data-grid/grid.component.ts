import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ViewChild,
  OnChanges,
  TemplateRef,
} from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';

import { MtxGridColumn, MtxGridColumnSelectionItem } from './grid.interface';
import { MtxGridCellSelectionDirective } from './cell-selection.directive';
import { MtxGridExpansionToggleDirective } from './expansion-toggle.directive';
import { MtxGridService } from './grid.service';

@Component({
  selector: 'mtx-grid',
  exportAs: 'mtxGrid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  host: {
    class: 'mtx-grid',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('expansion', [
      state('collapsed', style({ height: '0', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class MtxGridComponent implements OnInit, OnChanges {
  dataSource: MatTableDataSource<any>;

  @Input() displayedColumns: string[];

  @Input() columns: MtxGridColumn[] = [];

  columnSelectionData: MtxGridColumnSelectionItem[] = [];

  @Input() data = [];

  @Input() summary = [];

  @Input() length = 0;

  @Input() loading = false;

  /** Whether to show tooltip on columns */
  @Input() tooltip = true;

  /** Whether to page on the front end */
  @Input() pageOnFront = true;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  @Input() showPaginator = true;

  @Input() pageDisabled = false;

  @Input() showFirstLastButtons = true;

  @Input() pageIndex = 0;

  @Input() pageSize = 10;

  @Input() pageSizeOptions = [10, 50, 100];

  @Input() hidePageSize = false;

  @Output() page = new EventEmitter<PageEvent>();

  @Output() sortChange = new EventEmitter<Sort>();

  /** Hover & Striped style */

  @Input() rowHover = false;

  @Input() rowStriped = false;

  /** Expandable row */

  @Input() expandable = false;

  @Input() expansionTemplate: TemplateRef<any>;

  @Output() expansionChange = new EventEmitter<any>();

  expansionRowStates = [];

  /** Whether support multiple row/cell selection */
  @Input() multiSelectable = true;

  /** Row selection */

  @Input() rowSelectable = false;

  @Input() hideRowSelectionCheckbox = false;

  private _selectedRow: any;

  @Output() rowSelectionChange = new EventEmitter<any[]>();

  rowSelection: SelectionModel<any>;

  /** Cell selection */

  cellSelection = [];

  @Input() cellSelectable = true;

  @Output() cellSelectionChange = new EventEmitter<any[]>();

  private _selectedCell: MtxGridCellSelectionDirective;

  /** Toolbar */
  @Input() showToolbar = false;

  @Input() columnHideable = true;

  @Input() columnHidingChecked: 'show' | 'hide' = 'show';

  @Input() columnMovable = true;

  @Input() columnPinnable = true;

  @Output() columnHidingChange = new EventEmitter<string[]>();

  @Output() columnMovingChange = new EventEmitter<string[]>();

  @Output() columnPinningChange = new EventEmitter<string[]>();

  constructor(private _dataGridSrv: MtxGridService) { }

  ngOnInit() { }

  // Waiting for async data
  ngOnChanges() {
    this.displayedColumns = this.columns.filter(item => !item.hide).map(item => item.field);

    this.columnSelectionData = this.columns.map(item => {
      return {
        label: item.header,
        field: item.field,
        show: !item.hide,
        hide: item.hide,
        disabled: item.disabled,
      };
    });

    this.countPinnedPosition();

    if (this.rowSelectable && !this.hideRowSelectionCheckbox) {
      this.displayedColumns.unshift('MatCheckboxColumnDef');
    }

    // We should copy each item of data for expansion data
    if (this.expandable) {
      this.expansionRowStates = []; // reset

      this.data.forEach(_ => {
        this.expansionRowStates.push({ expanded: false });
      });
    }

    this.dataSource = new MatTableDataSource<any>(this.data);

    this.rowSelection = new SelectionModel<any>(true, []);

    if (this.pageOnFront) {
      this.dataSource.paginator = this.paginator;
    }
  }

  countPinnedPosition() {
    const count = (acc: number, cur: MtxGridColumn) => acc + parseFloat(cur.width);

    const pinnedLeftCols = this.columns.filter(
      col => col.pinned && col.pinned === 'left' && col.width
    );
    pinnedLeftCols.forEach((item, idx) => {
      item.left = pinnedLeftCols.slice(0, idx).reduce(count, 0) + 'px';
    });

    const pinnedRightCols = this.columns
      .filter(col => col.pinned && col.pinned === 'right' && col.width)
      .reverse();
    pinnedRightCols.forEach((item, idx) => {
      item.right = pinnedRightCols.slice(0, idx).reduce(count, 0) + 'px';
    });
  }

  isOddRow(index: number, dataIndex: number) {
    return typeof index === 'undefined' ? dataIndex % 2 : index % 2;
  }

  getIndex(index: number, dataIndex: number) {
    return typeof index === 'undefined' ? dataIndex : index;
  }

  handleSortChange(sort: Sort) {
    this.sortChange.emit(sort);
  }

  /** Expansion change event */
  handleExpansionChange(
    expansionRef: MtxGridExpansionToggleDirective,
    rowData: any,
    column: any,
    index: number
  ) {
    if (this.expandable) {
      this.expansionRowStates[index].expanded = !this.expansionRowStates[index].expanded;
    }
    this.expansionChange.emit({ opened: expansionRef.expended, data: rowData, index, column });
  }

  /** Cell select event */
  handleCellSelect(cellRef: MtxGridCellSelectionDirective, rowData: any, colDef: any): void {
    // If not the same cell
    if (this._selectedCell !== cellRef) {
      const colValue = this._dataGridSrv.getCellValue(rowData, colDef);
      this.cellSelection = []; // reset
      this.cellSelection.push({ cellData: colValue, rowData, colDef });

      this.cellSelectionChange.emit(this.cellSelection);

      if (this._selectedCell) {
        this._selectedCell.unselect(); // the selectedCell will be undefined
      }
    }

    this._selectedCell = cellRef.selected ? cellRef : undefined;
  }

  /** Row select event */
  handleRowSelect(event: MouseEvent, rowData: any) {
    if (this.rowSelectable) {
      // metaKey -> command key
      if (!event.ctrlKey && !event.metaKey) {
        this.rowSelection.clear();
      }
      this.handleSingleToggle(rowData);
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.rowSelection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  handleMasterToggle() {
    this.isAllSelected()
      ? this.rowSelection.clear()
      : this.dataSource.data.forEach(row => this.rowSelection.select(row));
    this.rowSelectionChange.emit(this.rowSelection.selected);
  }

  /** Select single row */
  handleSingleToggle(row: any) {
    if (!this.multiSelectable) {
      this.rowSelection.clear();
    }

    this.rowSelection.toggle(row);
    this.rowSelectionChange.emit(this.rowSelection.selected);
  }

  /** Column change event */

  handleColumnHidingChange(columns: string[]) {
    this.columnHidingChange.emit(columns);

    this.displayedColumns = Object.assign([], columns);

    if (this.rowSelectable && !this.hideRowSelectionCheckbox) {
      this.displayedColumns.unshift('MatCheckboxColumnDef');
    }
  }

  handleColumnMovingChange(columns: string[]) {
    this.columnMovingChange.emit(columns);

    this.displayedColumns = Object.assign([], columns);

    if (this.rowSelectable && !this.hideRowSelectionCheckbox) {
      this.displayedColumns.unshift('MatCheckboxColumnDef');
    }
  }

  /** Customize expansion event */
  toggleExpansion(index: number) {
    if (!this.expandable) {
      throw new Error('The `expandable` should be set true.');
    }
    this.expansionRowStates[index].expanded = !this.expansionRowStates[index].expanded;
    return this.expansionRowStates[index].expanded;
  }
}
