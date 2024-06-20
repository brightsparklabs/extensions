import { Provider } from '@angular/core';
import { ColumnResize } from '@ng-matero/extensions/column-resize';
export declare const TABLE_PROVIDERS: Provider[];
export declare const FLEX_PROVIDERS: Provider[];
export declare const TABLE_HOST_BINDINGS: {
  class: string;
};
export declare const FLEX_HOST_BINDINGS: {
  class: string;
};
export declare abstract class AbstractMatColumnResize extends ColumnResize {
  getTableHeight(): number;
}
