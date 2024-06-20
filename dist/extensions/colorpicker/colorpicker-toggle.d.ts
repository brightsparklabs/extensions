import {
  AfterContentInit,
  ChangeDetectorRef,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MtxColorpicker } from './colorpicker';
import * as i0 from '@angular/core';
/** Can be used to override the icon of a `mtxColorpickerToggle`. */
export declare class MtxColorpickerToggleIcon {
  static ɵfac: i0.ɵɵFactoryDeclaration<MtxColorpickerToggleIcon, never>;
  static ɵdir: i0.ɵɵDirectiveDeclaration<
    MtxColorpickerToggleIcon,
    '[mtxColorpickerToggleIcon]',
    never,
    {},
    {},
    never,
    never,
    true,
    never
  >;
}
export declare class MtxColorpickerToggle implements AfterContentInit, OnChanges, OnDestroy {
  private _changeDetectorRef;
  private _stateChanges;
  /** Colorpicker instance that the button will toggle. */
  picker: MtxColorpicker;
  /** Tabindex for the toggle. */
  tabIndex: number | null;
  /** Screen-reader label for the button. */
  ariaLabel: string;
  /** Whether the toggle button is disabled. */
  get disabled(): boolean;
  set disabled(value: boolean);
  private _disabled;
  /** Whether ripples on the toggle should be disabled. */
  disableRipple: boolean;
  /** Custom icon set by the consumer. */
  _customIcon: MtxColorpickerToggleIcon;
  /** Underlying button element. */
  _button: MatButton;
  constructor(_changeDetectorRef: ChangeDetectorRef, defaultTabIndex: string);
  ngOnChanges(changes: SimpleChanges): void;
  ngOnDestroy(): void;
  ngAfterContentInit(): void;
  _open(event: Event): void;
  private _watchStateChanges;
  static ɵfac: i0.ɵɵFactoryDeclaration<MtxColorpickerToggle, [null, { attribute: 'tabindex' }]>;
  static ɵcmp: i0.ɵɵComponentDeclaration<
    MtxColorpickerToggle,
    'mtx-colorpicker-toggle',
    ['mtxColorpickerToggle'],
    {
      picker: { alias: 'for'; required: false };
      tabIndex: { alias: 'tabIndex'; required: false };
      ariaLabel: { alias: 'aria-label'; required: false };
      disabled: { alias: 'disabled'; required: false };
      disableRipple: { alias: 'disableRipple'; required: false };
    },
    {},
    ['_customIcon'],
    ['[mtxColorpickerToggleIcon]'],
    true,
    never
  >;
  static ngAcceptInputType_disabled: unknown;
  static ngAcceptInputType_disableRipple: unknown;
}
