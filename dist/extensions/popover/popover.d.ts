import { AnimationEvent } from '@angular/animations';
import { Direction } from '@angular/cdk/bidi';
import {
  ElementRef,
  EventEmitter,
  InjectionToken,
  NgZone,
  OnDestroy,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { Subject } from 'rxjs';
import { MtxPopoverContent } from './popover-content';
import { MtxPopoverDefaultOptions, MtxPopoverPanel } from './popover-interfaces';
import { MtxPopoverPosition, MtxPopoverTriggerEvent, PopoverCloseReason } from './popover-types';
import * as i0 from '@angular/core';
/** Injection token to be used to override the default options for `mtx-popover`. */
export declare const MTX_POPOVER_DEFAULT_OPTIONS: InjectionToken<MtxPopoverDefaultOptions>;
/** @docs-private */
export declare function MTX_POPOVER_DEFAULT_OPTIONS_FACTORY(): MtxPopoverDefaultOptions;
export declare class MtxPopover implements MtxPopoverPanel, OnInit, OnDestroy {
  private _elementRef;
  private _unusedNgZone;
  private _defaultOptions;
  private _previousElevation?;
  private _elevationPrefix;
  /** Config object to be passed into the popover's class. */
  _classList: {
    [key: string]: boolean;
  };
  /** Current state of the panel animation. */
  _panelAnimationState: 'void' | 'enter';
  /** Emits whenever an animation on the popover completes. */
  readonly _animationDone: Subject<AnimationEvent>;
  /** Whether the popover is animating. */
  _isAnimating: boolean;
  /** Closing disabled on popover */
  closeDisabled: boolean;
  /** Config object to be passed into the popover's arrow style */
  arrowStyles?: Record<string, unknown>;
  /** Layout direction of the popover. */
  direction?: Direction;
  /** Class or list of classes to be added to the overlay panel. */
  overlayPanelClass: string | string[];
  /** Class to be added to the backdrop element. */
  backdropClass: string | undefined;
  /** aria-label for the popover panel. */
  ariaLabel?: string;
  /** aria-labelledby for the popover panel. */
  ariaLabelledby?: string;
  /** aria-describedby for the popover panel. */
  ariaDescribedby?: string;
  /** Popover's trigger event. */
  triggerEvent: MtxPopoverTriggerEvent;
  /** Popover's enter delay. */
  enterDelay: number;
  /** Popover's leave delay. */
  leaveDelay: number;
  /** Popover's position. */
  get position(): MtxPopoverPosition;
  set position(value: MtxPopoverPosition);
  private _position;
  /** Popover-panel's X offset. */
  xOffset: number;
  /** Popover-panel's Y offset. */
  yOffset: number;
  /** Popover-arrow's width. */
  arrowWidth: number;
  /** Popover-arrow's height. */
  arrowHeight: number;
  /** Popover-arrow's X offset. */
  arrowOffsetX: number;
  /** Popover-arrow's Y offset. */
  arrowOffsetY: number;
  /** Whether the popover arrow should be hidden. */
  hideArrow: boolean;
  /** Whether popover can be closed when click the popover-panel. */
  closeOnPanelClick: boolean;
  /** Whether popover can be closed when click the backdrop. */
  closeOnBackdropClick: boolean;
  /** Whether enable focus trap using `cdkTrapFocus`. */
  focusTrapEnabled: boolean;
  /** Whether enable focus trap auto capture using `cdkTrapFocusAutoCapture`. */
  focusTrapAutoCaptureEnabled: boolean;
  /** Whether the popover has a backdrop. It will always be false if the trigger event is hover. */
  hasBackdrop: boolean | undefined;
  /** Popover-panel's elevation (0~24). */
  get elevation(): number;
  set elevation(value: number);
  private _elevation;
  /**
   * This method takes classes set on the host mtx-popover element and applies them on the
   * popover template that displays in the overlay container. Otherwise, it's difficult
   * to style the containing popover from outside the component.
   * @param classes list of class names
   */
  set panelClass(classes: string);
  private _previousPanelClass?;
  /**
   * This method takes classes set on the host mtx-popover element and applies them on the
   * popover template that displays in the overlay container. Otherwise, it's difficult
   * to style the containing popover from outside the component.
   * @deprecated Use `panelClass` instead.
   * @breaking-change 8.0.0
   */
  get classList(): string;
  set classList(classes: string);
  /** Event emitted when the popover is closed. */
  closed: EventEmitter<PopoverCloseReason>;
  /** @docs-private */
  templateRef: TemplateRef<any>;
  /**
   * Popover content that will be rendered lazily.
   * @docs-private
   */
  lazyContent?: MtxPopoverContent;
  readonly panelId: string;
  constructor(
    _elementRef: ElementRef,
    _unusedNgZone: NgZone,
    _defaultOptions: MtxPopoverDefaultOptions
  );
  ngOnInit(): void;
  ngOnDestroy(): void;
  /** Handle a keyboard event from the popover, delegating to the appropriate action. */
  _handleKeydown(event: KeyboardEvent): void;
  /** Close popover on click if `closeOnPanelClick` is true. */
  _handleClick(): void;
  /** Disables close of popover when leaving trigger element and mouse over the popover. */
  _handleMouseOver(): void;
  /** Enables close of popover when mouse leaving popover element. */
  _handleMouseLeave(): void;
  /** Sets the current styles for the popover to allow for dynamically changing settings. */
  setCurrentStyles(pos?: MtxPopoverPosition): void;
  /**
   * It's necessary to set position-based classes to ensure the popover panel animation
   * folds out from the correct direction.
   */
  setPositionClasses(pos?: MtxPopoverPosition): void;
  /** Sets the popover-panel's elevation. */
  setElevation(): void;
  /** Starts the enter animation. */
  _startAnimation(): void;
  /** Resets the panel animation to its initial state. */
  _resetAnimation(): void;
  /** Callback that is invoked when the panel animation completes. */
  _onAnimationDone(event: AnimationEvent): void;
  _onAnimationStart(event: AnimationEvent): void;
  static ɵfac: i0.ɵɵFactoryDeclaration<MtxPopover, never>;
  static ɵcmp: i0.ɵɵComponentDeclaration<
    MtxPopover,
    'mtx-popover',
    ['mtxPopover'],
    {
      backdropClass: { alias: 'backdropClass'; required: false };
      ariaLabel: { alias: 'aria-label'; required: false };
      ariaLabelledby: { alias: 'aria-labelledby'; required: false };
      ariaDescribedby: { alias: 'aria-describedby'; required: false };
      triggerEvent: { alias: 'triggerEvent'; required: false };
      enterDelay: { alias: 'enterDelay'; required: false };
      leaveDelay: { alias: 'leaveDelay'; required: false };
      position: { alias: 'position'; required: false };
      xOffset: { alias: 'xOffset'; required: false };
      yOffset: { alias: 'yOffset'; required: false };
      arrowWidth: { alias: 'arrowWidth'; required: false };
      arrowHeight: { alias: 'arrowHeight'; required: false };
      arrowOffsetX: { alias: 'arrowOffsetX'; required: false };
      arrowOffsetY: { alias: 'arrowOffsetY'; required: false };
      hideArrow: { alias: 'hideArrow'; required: false };
      closeOnPanelClick: { alias: 'closeOnPanelClick'; required: false };
      closeOnBackdropClick: { alias: 'closeOnBackdropClick'; required: false };
      focusTrapEnabled: { alias: 'focusTrapEnabled'; required: false };
      focusTrapAutoCaptureEnabled: { alias: 'focusTrapAutoCaptureEnabled'; required: false };
      hasBackdrop: { alias: 'hasBackdrop'; required: false };
      elevation: { alias: 'elevation'; required: false };
      panelClass: { alias: 'class'; required: false };
      classList: { alias: 'classList'; required: false };
    },
    { closed: 'closed' },
    ['lazyContent'],
    ['*'],
    true,
    never
  >;
  static ngAcceptInputType_hideArrow: unknown;
  static ngAcceptInputType_closeOnPanelClick: unknown;
  static ngAcceptInputType_closeOnBackdropClick: unknown;
  static ngAcceptInputType_focusTrapEnabled: unknown;
  static ngAcceptInputType_focusTrapAutoCaptureEnabled: unknown;
  static ngAcceptInputType_hasBackdrop: unknown;
}
