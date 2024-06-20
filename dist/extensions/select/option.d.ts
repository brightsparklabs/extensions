import { AfterViewChecked, ElementRef, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import * as i0 from '@angular/core';
export declare class MtxOption implements OnChanges, AfterViewChecked, OnDestroy {
  elementRef: ElementRef<HTMLElement>;
  value: any;
  disabled: boolean;
  get label(): string;
  private _previousLabel?;
  readonly stateChange$: Subject<{
    value: any;
    disabled: boolean;
    label?: string | undefined;
  }>;
  constructor(elementRef: ElementRef<HTMLElement>);
  ngOnChanges(changes: SimpleChanges): void;
  ngAfterViewChecked(): void;
  ngOnDestroy(): void;
  static ɵfac: i0.ɵɵFactoryDeclaration<MtxOption, never>;
  static ɵcmp: i0.ɵɵComponentDeclaration<
    MtxOption,
    'mtx-option',
    ['mtxOption'],
    {
      value: { alias: 'value'; required: false };
      disabled: { alias: 'disabled'; required: false };
    },
    {},
    never,
    ['*'],
    true,
    never
  >;
  static ngAcceptInputType_disabled: unknown;
}
