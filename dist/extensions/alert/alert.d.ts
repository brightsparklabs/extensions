import { ChangeDetectorRef, EventEmitter } from '@angular/core';
import * as i0 from '@angular/core';
export type MtxAlertType = 'default' | 'info' | 'success' | 'warning' | 'danger';
export declare class MtxAlert {
  private _changeDetectorRef;
  get _hostClassList(): string;
  /** The alert's type. Can be `default`, `info`, `success`, `warning` or `danger`. */
  type: MtxAlertType;
  /** Whether to display an inline close button. */
  dismissible: boolean;
  /** The alert's elevation (0~24). */
  elevation: number;
  /** Event emitted when the alert closed. */
  closed: EventEmitter<MtxAlert>;
  constructor(_changeDetectorRef: ChangeDetectorRef);
  _onClosed(): void;
  static ɵfac: i0.ɵɵFactoryDeclaration<MtxAlert, never>;
  static ɵcmp: i0.ɵɵComponentDeclaration<
    MtxAlert,
    'mtx-alert',
    ['mtxAlert'],
    {
      type: { alias: 'type'; required: false };
      dismissible: { alias: 'dismissible'; required: false };
      elevation: { alias: 'elevation'; required: false };
    },
    { closed: 'closed' },
    never,
    ['*'],
    true,
    never
  >;
  static ngAcceptInputType_dismissible: unknown;
}
