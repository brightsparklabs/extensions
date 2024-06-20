import { AriaDescriber, FocusMonitor } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import { BooleanInput, NumberInput } from '@angular/cdk/coercion';
import {
  ConnectedPosition,
  OriginConnectionPosition,
  Overlay,
  OverlayConnectionPosition,
  OverlayRef,
  ScrollDispatcher,
  ScrollStrategy,
} from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import {
  AfterViewInit,
  ChangeDetectorRef,
  ElementRef,
  InjectionToken,
  NgZone,
  OnDestroy,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { Observable } from 'rxjs';
import * as i0 from '@angular/core';
/** Possible positions for a tooltip. */
export type TooltipPosition = 'left' | 'right' | 'above' | 'below' | 'before' | 'after';
/**
 * Options for how the tooltip trigger should handle touch gestures.
 * See `MtxTooltip.touchGestures` for more information.
 */
export type TooltipTouchGestures = 'auto' | 'on' | 'off';
/** Possible visibility states of a tooltip. */
export type TooltipVisibility = 'initial' | 'visible' | 'hidden';
/** Time in ms to throttle repositioning after scroll events. */
export declare const SCROLL_THROTTLE_MS = 20;
/**
 * Creates an error to be thrown if the user supplied an invalid tooltip position.
 * @docs-private
 */
export declare function getMtxTooltipInvalidPositionError(position: string): Error;
/** Injection token that determines the scroll handling while a tooltip is visible. */
export declare const MTX_TOOLTIP_SCROLL_STRATEGY: InjectionToken<() => ScrollStrategy>;
/** @docs-private */
export declare function MTX_TOOLTIP_SCROLL_STRATEGY_FACTORY(overlay: Overlay): () => ScrollStrategy;
/** @docs-private */
export declare const MTX_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER: {
  provide: InjectionToken<() => ScrollStrategy>;
  deps: (typeof Overlay)[];
  useFactory: typeof MTX_TOOLTIP_SCROLL_STRATEGY_FACTORY;
};
/** @docs-private */
export declare function MTX_TOOLTIP_DEFAULT_OPTIONS_FACTORY(): MtxTooltipDefaultOptions;
/** Injection token to be used to override the default options for `mtxTooltip`. */
export declare const MTX_TOOLTIP_DEFAULT_OPTIONS: InjectionToken<MtxTooltipDefaultOptions>;
/** Default `mtxTooltip` options that can be overridden. */
export interface MtxTooltipDefaultOptions {
  /** Default delay when the tooltip is shown. */
  showDelay: number;
  /** Default delay when the tooltip is hidden. */
  hideDelay: number;
  /** Default delay when hiding the tooltip on a touch device. */
  touchendHideDelay: number;
  /** Default touch gesture handling for tooltips. */
  touchGestures?: TooltipTouchGestures;
  /** Default position for tooltips. */
  position?: TooltipPosition;
  /**
   * Default value for whether tooltips should be positioned near the click or touch origin
   * instead of outside the element bounding box.
   */
  positionAtOrigin?: boolean;
  /** Disables the ability for the user to interact with the tooltip element. */
  disableTooltipInteractivity?: boolean;
}
/**
 * CSS class that will be attached to the overlay panel.
 * @deprecated
 * @breaking-change 13.0.0 remove this variable
 */
export declare const TOOLTIP_PANEL_CLASS = 'mtx-mdc-tooltip-panel';
/**
 * Directive that attaches a material design tooltip to the host element. Animates the showing and
 * hiding of a tooltip provided position (defaults to below the element).
 *
 * https://material.io/design/components/tooltips.html
 */
export declare class MtxTooltip implements OnDestroy, AfterViewInit {
  private _overlay;
  private _elementRef;
  private _scrollDispatcher;
  private _viewContainerRef;
  private _ngZone;
  private _platform;
  private _ariaDescriber;
  private _focusMonitor;
  protected _dir: Directionality;
  private _defaultOptions;
  _overlayRef: OverlayRef | null;
  _tooltipInstance: TooltipComponent | null;
  private _portal;
  private _position;
  private _positionAtOrigin;
  private _disabled;
  private _tooltipClass;
  private _scrollStrategy;
  private _viewInitialized;
  private _pointerExitEventsInitialized;
  private readonly _tooltipComponent;
  private _viewportMargin;
  private _currentPosition;
  private readonly _cssClassPrefix;
  /** Allows the user to define the position of the tooltip relative to the parent element */
  get position(): TooltipPosition;
  set position(value: TooltipPosition);
  /**
   * Whether tooltip should be relative to the click or touch origin
   * instead of outside the element bounding box.
   */
  get positionAtOrigin(): boolean;
  set positionAtOrigin(value: BooleanInput);
  /** Disables the display of the tooltip. */
  get disabled(): boolean;
  set disabled(value: BooleanInput);
  /** The default delay in ms before showing the tooltip after show is called */
  get showDelay(): number;
  set showDelay(value: NumberInput);
  private _showDelay;
  /** The default delay in ms before hiding the tooltip after hide is called */
  get hideDelay(): number;
  set hideDelay(value: NumberInput);
  private _hideDelay;
  /**
   * How touch gestures should be handled by the tooltip. On touch devices the tooltip directive
   * uses a long press gesture to show and hide, however it can conflict with the native browser
   * gestures. To work around the conflict, Angular Material disables native gestures on the
   * trigger, but that might not be desirable on particular elements (e.g. inputs and draggable
   * elements). The different values for this option configure the touch event handling as follows:
   * - `auto` - Enables touch gestures for all elements, but tries to avoid conflicts with native
   *   browser gestures on particular elements. In particular, it allows text selection on inputs
   *   and textareas, and preserves the native browser dragging on elements marked as `draggable`.
   * - `on` - Enables touch gestures for all elements and disables native
   *   browser gestures with no exceptions.
   * - `off` - Disables touch gestures. Note that this will prevent the tooltip from
   *   showing on touch devices.
   */
  touchGestures: TooltipTouchGestures;
  /** The message to be displayed in the tooltip */
  get message(): string | TemplateRef<any>;
  set message(value: string | TemplateRef<any>);
  private _message;
  /** Context to be passed to the tooltip. */
  get tooltipContext(): any;
  set tooltipContext(value: any);
  private _tooltipContext;
  /** Classes to be passed to the tooltip. Supports the same syntax as `ngClass`. */
  get tooltipClass():
    | string
    | string[]
    | Set<string>
    | {
        [key: string]: any;
      };
  set tooltipClass(
    value:
      | string
      | string[]
      | Set<string>
      | {
          [key: string]: any;
        }
  );
  /** Manually-bound passive event listeners. */
  private readonly _passiveListeners;
  /** Reference to the current document. */
  private _document;
  /** Timer started at the last `touchstart` event. */
  private _touchstartTimeout;
  /** Emits when the component is destroyed. */
  private readonly _destroyed;
  constructor(
    _overlay: Overlay,
    _elementRef: ElementRef<HTMLElement>,
    _scrollDispatcher: ScrollDispatcher,
    _viewContainerRef: ViewContainerRef,
    _ngZone: NgZone,
    _platform: Platform,
    _ariaDescriber: AriaDescriber,
    _focusMonitor: FocusMonitor,
    scrollStrategy: any,
    _dir: Directionality,
    _defaultOptions: MtxTooltipDefaultOptions,
    _document: any
  );
  ngAfterViewInit(): void;
  /**
   * Dispose the tooltip when destroyed.
   */
  ngOnDestroy(): void;
  /** Shows the tooltip after the delay in ms, defaults to tooltip-delay-show or 0ms if no input */
  show(
    delay?: number,
    origin?: {
      x: number;
      y: number;
    }
  ): void;
  /** Hides the tooltip after the delay in ms, defaults to tooltip-delay-hide or 0ms if no input */
  hide(delay?: number): void;
  /** Shows/hides the tooltip */
  toggle(origin?: { x: number; y: number }): void;
  /** Returns true if the tooltip is currently visible to the user */
  _isTooltipVisible(): boolean;
  /** Create the overlay config and position strategy */
  private _createOverlay;
  /** Detaches the currently-attached tooltip. */
  private _detach;
  /** Updates the position of the current tooltip. */
  private _updatePosition;
  /** Adds the configured offset to a position. Used as a hook for child classes. */
  protected _addOffset(position: ConnectedPosition): ConnectedPosition;
  /**
   * Returns the origin position and a fallback position based on the user's position preference.
   * The fallback position is the inverse of the origin (e.g. `'below' -> 'above'`).
   */
  _getOrigin(): {
    main: OriginConnectionPosition;
    fallback: OriginConnectionPosition;
  };
  /** Returns the overlay position and a fallback position based on the user's preference */
  _getOverlayPosition(): {
    main: OverlayConnectionPosition;
    fallback: OverlayConnectionPosition;
  };
  /** Updates the tooltip message and repositions the overlay according to the new message length */
  private _updateTooltipMessage;
  /** Updates the tooltip context */
  private _setTooltipContext;
  /** Updates the tooltip class */
  private _setTooltipClass;
  /** Inverts an overlay position. */
  private _invertPosition;
  /** Updates the class on the overlay panel based on the current position of the tooltip. */
  private _updateCurrentPositionClass;
  /** Binds the pointer events to the tooltip trigger. */
  private _setupPointerEnterEventsIfNeeded;
  private _setupPointerExitEventsIfNeeded;
  private _addListeners;
  private _platformSupportsMouseEvents;
  /** Listener for the `wheel` event on the element. */
  private _wheelListener;
  /** Disables the native browser gestures, based on how the tooltip has been configured. */
  private _disableNativeGesturesIfNecessary;
  static ɵfac: i0.ɵɵFactoryDeclaration<
    MtxTooltip,
    [null, null, null, null, null, null, null, null, null, null, { optional: true }, null]
  >;
  static ɵdir: i0.ɵɵDirectiveDeclaration<
    MtxTooltip,
    '[mtxTooltip]',
    ['mtxTooltip'],
    {
      position: { alias: 'mtxTooltipPosition'; required: false };
      positionAtOrigin: { alias: 'mtxTooltipPositionAtOrigin'; required: false };
      disabled: { alias: 'mtxTooltipDisabled'; required: false };
      showDelay: { alias: 'mtxTooltipShowDelay'; required: false };
      hideDelay: { alias: 'mtxTooltipHideDelay'; required: false };
      touchGestures: { alias: 'mtxTooltipTouchGestures'; required: false };
      message: { alias: 'mtxTooltip'; required: false };
      tooltipContext: { alias: 'mtxTooltipContext'; required: false };
      tooltipClass: { alias: 'mtxTooltipClass'; required: false };
    },
    {},
    never,
    never,
    true,
    never
  >;
}
/**
 * Internal component that wraps the tooltip's content.
 * @docs-private
 */
export declare class TooltipComponent implements OnDestroy {
  private _changeDetectorRef;
  protected _elementRef: ElementRef<HTMLElement>;
  _isMultiline: boolean;
  /** Message to display in the tooltip */
  message: string | TemplateRef<any>;
  /** Context to be added to the tooltip */
  tooltipContext: any;
  /** Classes to be added to the tooltip. Supports the same syntax as `ngClass`. */
  tooltipClass:
    | string
    | string[]
    | Set<string>
    | {
        [key: string]: any;
      };
  /** The timeout ID of any current timer set to show the tooltip */
  private _showTimeoutId;
  /** The timeout ID of any current timer set to hide the tooltip */
  private _hideTimeoutId;
  /** Element that caused the tooltip to open. */
  _triggerElement: HTMLElement;
  /** Amount of milliseconds to delay the closing sequence. */
  _mouseLeaveHideDelay: number;
  /** Whether animations are currently disabled. */
  private _animationsDisabled;
  /** Reference to the internal tooltip element. */
  _tooltip: ElementRef<HTMLElement>;
  /** Whether interactions on the page should close the tooltip */
  private _closeOnInteraction;
  /** Whether the tooltip is currently visible. */
  private _isVisible;
  /** Subject for notifying that the tooltip has been hidden from the view */
  private readonly _onHide;
  /** Name of the show animation and the class that toggles it. */
  private readonly _showAnimation;
  /** Name of the hide animation and the class that toggles it. */
  private readonly _hideAnimation;
  constructor(
    _changeDetectorRef: ChangeDetectorRef,
    _elementRef: ElementRef<HTMLElement>,
    animationMode?: string
  );
  /**
   * Shows the tooltip with an animation originating from the provided origin
   * @param delay Amount of milliseconds to the delay showing the tooltip.
   */
  show(delay: number): void;
  /**
   * Begins the animation to hide the tooltip after the provided delay in ms.
   * @param delay Amount of milliseconds to delay showing the tooltip.
   */
  hide(delay: number): void;
  /** Returns an observable that notifies when the tooltip has been hidden from view. */
  afterHidden(): Observable<void>;
  /** Whether the tooltip is being displayed. */
  isVisible(): boolean;
  ngOnDestroy(): void;
  /**
   * Interactions on the HTML body should close the tooltip immediately as defined in the
   * material design spec.
   * https://material.io/design/components/tooltips.html#behavior
   */
  _handleBodyInteraction(): void;
  /**
   * Marks that the tooltip needs to be checked in the next change detection run.
   * Mainly used for rendering the initial text before positioning a tooltip, which
   * can be problematic in components with OnPush change detection.
   */
  _markForCheck(): void;
  _handleMouseLeave({ relatedTarget }: MouseEvent): void;
  /**
   * Callback for when the timeout in this.show() gets completed.
   * This method is only needed by the mdc-tooltip, and so it is only implemented
   * in the mdc-tooltip, not here.
   */
  protected _onShow(): void;
  /** Whether the tooltip text has overflown to the next line */
  private _isTooltipMultiline;
  /** Event listener dispatched when an animation on the tooltip finishes. */
  _handleAnimationEnd({ animationName }: AnimationEvent): void;
  /** Cancels any pending animation sequences. */
  _cancelPendingAnimations(): void;
  /** Handles the cleanup after an animation has finished. */
  private _finalizeAnimation;
  /** Toggles the visibility of the tooltip element. */
  private _toggleVisibility;
  static ɵfac: i0.ɵɵFactoryDeclaration<TooltipComponent, [null, null, { optional: true }]>;
  static ɵcmp: i0.ɵɵComponentDeclaration<
    TooltipComponent,
    'mtx-tooltip-component',
    never,
    {},
    {},
    never,
    never,
    true,
    never
  >;
}
