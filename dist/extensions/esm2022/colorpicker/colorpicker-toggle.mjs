import { Attribute, ChangeDetectionStrategy, Component, ContentChild, Directive, Input, ViewChild, ViewEncapsulation, booleanAttribute, } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { Subscription, merge, of as observableOf } from 'rxjs';
import * as i0 from "@angular/core";
/** Can be used to override the icon of a `mtxColorpickerToggle`. */
export class MtxColorpickerToggleIcon {
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxColorpickerToggleIcon, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    /** @nocollapse */ static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.0.1", type: MtxColorpickerToggleIcon, isStandalone: true, selector: "[mtxColorpickerToggleIcon]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxColorpickerToggleIcon, decorators: [{
            type: Directive,
            args: [{
                    selector: '[mtxColorpickerToggleIcon]',
                    standalone: true,
                }]
        }] });
export class MtxColorpickerToggle {
    /** Whether the toggle button is disabled. */
    get disabled() {
        if (this._disabled == null && this.picker) {
            return this.picker.disabled;
        }
        return !!this._disabled;
    }
    set disabled(value) {
        this._disabled = value;
    }
    constructor(_changeDetectorRef, defaultTabIndex) {
        this._changeDetectorRef = _changeDetectorRef;
        this._stateChanges = Subscription.EMPTY;
        const parsedTabIndex = Number(defaultTabIndex);
        this.tabIndex = parsedTabIndex || parsedTabIndex === 0 ? parsedTabIndex : null;
    }
    ngOnChanges(changes) {
        if (changes.picker) {
            this._watchStateChanges();
        }
    }
    ngOnDestroy() {
        this._stateChanges.unsubscribe();
    }
    ngAfterContentInit() {
        this._watchStateChanges();
    }
    _open(event) {
        if (this.picker && !this.disabled) {
            this.picker.open();
            event.stopPropagation();
        }
    }
    _watchStateChanges() {
        const pickerDisabled = this.picker ? this.picker._disabledChange : observableOf();
        const inputDisabled = this.picker && this.picker.pickerInput
            ? this.picker.pickerInput._disabledChange
            : observableOf();
        const pickerToggled = this.picker
            ? merge(this.picker.openedStream, this.picker.closedStream)
            : observableOf();
        this._stateChanges.unsubscribe();
        this._stateChanges = merge(pickerDisabled, inputDisabled, pickerToggled).subscribe(() => this._changeDetectorRef.markForCheck());
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxColorpickerToggle, deps: [{ token: i0.ChangeDetectorRef }, { token: 'tabindex', attribute: true }], target: i0.ɵɵFactoryTarget.Component }); }
    /** @nocollapse */ static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.0.1", type: MtxColorpickerToggle, isStandalone: true, selector: "mtx-colorpicker-toggle", inputs: { picker: ["for", "picker"], tabIndex: "tabIndex", ariaLabel: ["aria-label", "ariaLabel"], disabled: ["disabled", "disabled", booleanAttribute], disableRipple: ["disableRipple", "disableRipple", booleanAttribute] }, host: { listeners: { "click": "_open($event)" }, properties: { "attr.tabindex": "null", "class.mtx-colorpicker-toggle-active": "picker && picker.opened", "class.mat-accent": "picker && picker.color === \"accent\"", "class.mat-warn": "picker && picker.color === \"warn\"" }, classAttribute: "mtx-colorpicker-toggle" }, queries: [{ propertyName: "_customIcon", first: true, predicate: MtxColorpickerToggleIcon, descendants: true }], viewQueries: [{ propertyName: "_button", first: true, predicate: ["button"], descendants: true }], exportAs: ["mtxColorpickerToggle"], usesOnChanges: true, ngImport: i0, template: "<button #button\n  mat-icon-button\n  type=\"button\"\n  [attr.aria-haspopup]=\"picker ? 'dialog' : null\"\n  [attr.aria-label]=\"ariaLabel\"\n  [attr.tabindex]=\"disabled ? -1 : tabIndex\"\n  [disabled]=\"disabled\"\n  [disableRipple]=\"disableRipple\">\n\n  @if (!_customIcon) {\n    <svg\n      class=\"mtx-colorpicker-toggle-default-icon\"\n      viewBox=\"0 0 24 24\"\n      width=\"24px\"\n      height=\"24px\"\n      fill=\"currentColor\"\n      focusable=\"false\">\n      <path d=\"M17.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,9A1.5,1.5 0 0,1 19,10.5A1.5,1.5 0 0,1 17.5,12M14.5,8A1.5,1.5 0 0,1 13,6.5A1.5,1.5 0 0,1 14.5,5A1.5,1.5 0 0,1 16,6.5A1.5,1.5 0 0,1 14.5,8M9.5,8A1.5,1.5 0 0,1 8,6.5A1.5,1.5 0 0,1 9.5,5A1.5,1.5 0 0,1 11,6.5A1.5,1.5 0 0,1 9.5,8M6.5,12A1.5,1.5 0 0,1 5,10.5A1.5,1.5 0 0,1 6.5,9A1.5,1.5 0 0,1 8,10.5A1.5,1.5 0 0,1 6.5,12M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A1.5,1.5 0 0,0 13.5,19.5C13.5,19.11 13.35,18.76 13.11,18.5C12.88,18.23 12.73,17.88 12.73,17.5A1.5,1.5 0 0,1 14.23,16H16A5,5 0 0,0 21,11C21,6.58 16.97,3 12,3Z\" />\n    </svg>\n  }\n\n  <ng-content select=\"[mtxColorpickerToggleIcon]\"></ng-content>\n</button>\n", styles: [".mtx-colorpicker-toggle{pointer-events:auto;color:var(--mtx-colorpicker-toggle-icon-color)}.mtx-colorpicker-toggle-active{color:var(--mtx-colorpicker-toggle-active-state-icon-color)}.cdk-high-contrast-active .mtx-colorpicker-toggle-default-icon{color:CanvasText}\n"], dependencies: [{ kind: "component", type: MatIconButton, selector: "button[mat-icon-button]", exportAs: ["matButton"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxColorpickerToggle, decorators: [{
            type: Component,
            args: [{ selector: 'mtx-colorpicker-toggle', host: {
                        'class': 'mtx-colorpicker-toggle',
                        '[attr.tabindex]': 'null',
                        '[class.mtx-colorpicker-toggle-active]': 'picker && picker.opened',
                        '[class.mat-accent]': 'picker && picker.color === "accent"',
                        '[class.mat-warn]': 'picker && picker.color === "warn"',
                        // Bind the `click` on the host, rather than the inner `button`, so that we can call
                        // `stopPropagation` on it without affecting the user's `click` handlers. We need to stop
                        // it so that the input doesn't get focused automatically by the form field (See #21836).
                        '(click)': '_open($event)',
                    }, exportAs: 'mtxColorpickerToggle', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, standalone: true, imports: [MatIconButton], template: "<button #button\n  mat-icon-button\n  type=\"button\"\n  [attr.aria-haspopup]=\"picker ? 'dialog' : null\"\n  [attr.aria-label]=\"ariaLabel\"\n  [attr.tabindex]=\"disabled ? -1 : tabIndex\"\n  [disabled]=\"disabled\"\n  [disableRipple]=\"disableRipple\">\n\n  @if (!_customIcon) {\n    <svg\n      class=\"mtx-colorpicker-toggle-default-icon\"\n      viewBox=\"0 0 24 24\"\n      width=\"24px\"\n      height=\"24px\"\n      fill=\"currentColor\"\n      focusable=\"false\">\n      <path d=\"M17.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,9A1.5,1.5 0 0,1 19,10.5A1.5,1.5 0 0,1 17.5,12M14.5,8A1.5,1.5 0 0,1 13,6.5A1.5,1.5 0 0,1 14.5,5A1.5,1.5 0 0,1 16,6.5A1.5,1.5 0 0,1 14.5,8M9.5,8A1.5,1.5 0 0,1 8,6.5A1.5,1.5 0 0,1 9.5,5A1.5,1.5 0 0,1 11,6.5A1.5,1.5 0 0,1 9.5,8M6.5,12A1.5,1.5 0 0,1 5,10.5A1.5,1.5 0 0,1 6.5,9A1.5,1.5 0 0,1 8,10.5A1.5,1.5 0 0,1 6.5,12M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A1.5,1.5 0 0,0 13.5,19.5C13.5,19.11 13.35,18.76 13.11,18.5C12.88,18.23 12.73,17.88 12.73,17.5A1.5,1.5 0 0,1 14.23,16H16A5,5 0 0,0 21,11C21,6.58 16.97,3 12,3Z\" />\n    </svg>\n  }\n\n  <ng-content select=\"[mtxColorpickerToggleIcon]\"></ng-content>\n</button>\n", styles: [".mtx-colorpicker-toggle{pointer-events:auto;color:var(--mtx-colorpicker-toggle-icon-color)}.mtx-colorpicker-toggle-active{color:var(--mtx-colorpicker-toggle-active-state-icon-color)}.cdk-high-contrast-active .mtx-colorpicker-toggle-default-icon{color:CanvasText}\n"] }]
        }], ctorParameters: () => [{ type: i0.ChangeDetectorRef }, { type: undefined, decorators: [{
                    type: Attribute,
                    args: ['tabindex']
                }] }], propDecorators: { picker: [{
                type: Input,
                args: ['for']
            }], tabIndex: [{
                type: Input
            }], ariaLabel: [{
                type: Input,
                args: ['aria-label']
            }], disabled: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], disableRipple: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], _customIcon: [{
                type: ContentChild,
                args: [MtxColorpickerToggleIcon]
            }], _button: [{
                type: ViewChild,
                args: ['button']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3JwaWNrZXItdG9nZ2xlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvZXh0ZW5zaW9ucy9jb2xvcnBpY2tlci9jb2xvcnBpY2tlci10b2dnbGUudHMiLCIuLi8uLi8uLi8uLi9wcm9qZWN0cy9leHRlbnNpb25zL2NvbG9ycGlja2VyL2NvbG9ycGlja2VyLXRvZ2dsZS5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFFTCxTQUFTLEVBQ1QsdUJBQXVCLEVBRXZCLFNBQVMsRUFDVCxZQUFZLEVBQ1osU0FBUyxFQUNULEtBQUssRUFJTCxTQUFTLEVBQ1QsaUJBQWlCLEVBQ2pCLGdCQUFnQixHQUNqQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQWEsYUFBYSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDcEUsT0FBTyxFQUFjLFlBQVksRUFBRSxLQUFLLEVBQUUsRUFBRSxJQUFJLFlBQVksRUFBRSxNQUFNLE1BQU0sQ0FBQzs7QUFJM0Usb0VBQW9FO0FBS3BFLE1BQU0sT0FBTyx3QkFBd0I7aUlBQXhCLHdCQUF3QjtxSEFBeEIsd0JBQXdCOzsyRkFBeEIsd0JBQXdCO2tCQUpwQyxTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSw0QkFBNEI7b0JBQ3RDLFVBQVUsRUFBRSxJQUFJO2lCQUNqQjs7QUF3QkQsTUFBTSxPQUFPLG9CQUFvQjtJQVkvQiw2Q0FBNkM7SUFDN0MsSUFDSSxRQUFRO1FBQ1YsSUFBSSxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDMUMsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUM5QixDQUFDO1FBRUQsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUMxQixDQUFDO0lBQ0QsSUFBSSxRQUFRLENBQUMsS0FBYztRQUN6QixJQUFJLENBQUMsU0FBUyxHQUFHLEtB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QVE7c0JBQWhCLEtBQUs7Z0JBR2UsU0FBUztzQkFBN0IsS0FBSzt1QkFBQyxZQUFZO2dCQUlmLFFBQVE7c0JBRFgsS0FBSzt1QkFBQyxFQUFFLFNBQVMsRUFBRSxnQkFBZ0IsRUFBRTtnQkFjRSxhQUFhO3NCQUFwRCxLQUFLO3VCQUFDLEVBQUUsU0FBUyxFQUFFLGdCQUFnQixFQUFFO2dCQUdFLFdBQVc7c0JBQWxELFlBQVk7dUJBQUMsd0JBQXdCO2dCQUdqQixPQUFPO3NCQUEzQixTQUFTO3VCQUFDLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBBZnRlckNvbnRlbnRJbml0LFxuICBBdHRyaWJ1dGUsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGQsXG4gIERpcmVjdGl2ZSxcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBTaW1wbGVDaGFuZ2VzLFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBib29sZWFuQXR0cmlidXRlLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1hdEJ1dHRvbiwgTWF0SWNvbkJ1dHRvbiB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2J1dHRvbic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBTdWJzY3JpcHRpb24sIG1lcmdlLCBvZiBhcyBvYnNlcnZhYmxlT2YgfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgTXR4Q29sb3JwaWNrZXIgfSBmcm9tICcuL2NvbG9ycGlja2VyJztcblxuLyoqIENhbiBiZSB1c2VkIHRvIG92ZXJyaWRlIHRoZSBpY29uIG9mIGEgYG10eENvbG9ycGlja2VyVG9nZ2xlYC4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttdHhDb2xvcnBpY2tlclRvZ2dsZUljb25dJyxcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbn0pXG5leHBvcnQgY2xhc3MgTXR4Q29sb3JwaWNrZXJUb2dnbGVJY29uIHt9XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ210eC1jb2xvcnBpY2tlci10b2dnbGUnLFxuICB0ZW1wbGF0ZVVybDogJy4vY29sb3JwaWNrZXItdG9nZ2xlLmh0bWwnLFxuICBzdHlsZVVybDogJy4vY29sb3JwaWNrZXItdG9nZ2xlLnNjc3MnLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ210eC1jb2xvcnBpY2tlci10b2dnbGUnLFxuICAgICdbYXR0ci50YWJpbmRleF0nOiAnbnVsbCcsXG4gICAgJ1tjbGFzcy5tdHgtY29sb3JwaWNrZXItdG9nZ2xlLWFjdGl2ZV0nOiAncGlja2VyICYmIHBpY2tlci5vcGVuZWQnLFxuICAgICdbY2xhc3MubWF0LWFjY2VudF0nOiAncGlja2VyICYmIHBpY2tlci5jb2xvciA9PT0gXCJhY2NlbnRcIicsXG4gICAgJ1tjbGFzcy5tYXQtd2Fybl0nOiAncGlja2VyICYmIHBpY2tlci5jb2xvciA9PT0gXCJ3YXJuXCInLFxuICAgIC8vIEJpbmQgdGhlIGBjbGlja2Agb24gdGhlIGhvc3QsIHJhdGhlciB0aGFuIHRoZSBpbm5lciBgYnV0dG9uYCwgc28gdGhhdCB3ZSBjYW4gY2FsbFxuICAgIC8vIGBzdG9wUHJvcGFnYXRpb25gIG9uIGl0IHdpdGhvdXQgYWZmZWN0aW5nIHRoZSB1c2VyJ3MgYGNsaWNrYCBoYW5kbGVycy4gV2UgbmVlZCB0byBzdG9wXG4gICAgLy8gaXQgc28gdGhhdCB0aGUgaW5wdXQgZG9lc24ndCBnZXQgZm9jdXNlZCBhdXRvbWF0aWNhbGx5IGJ5IHRoZSBmb3JtIGZpZWxkIChTZWUgIzIxODM2KS5cbiAgICAnKGNsaWNrKSc6ICdfb3BlbigkZXZlbnQpJyxcbiAgfSxcbiAgZXhwb3J0QXM6ICdtdHhDb2xvcnBpY2tlclRvZ2dsZScsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBzdGFuZGFsb25lOiB0cnVlLFxuICBpbXBvcnRzOiBbTWF0SWNvbkJ1dHRvbl0sXG59KVxuZXhwb3J0IGNsYXNzIE10eENvbG9ycGlja2VyVG9nZ2xlIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xuICBwcml2YXRlIF9zdGF0ZUNoYW5nZXMgPSBTdWJzY3JpcHRpb24uRU1QVFk7XG5cbiAgLyoqIENvbG9ycGlja2VyIGluc3RhbmNlIHRoYXQgdGhlIGJ1dHRvbiB3aWxsIHRvZ2dsZS4gKi9cbiAgQElucHV0KCdmb3InKSBwaWNrZXIhOiBNdHhDb2xvcnBpY2tlcjtcblxuICAvKiogVGFiaW5kZXggZm9yIHRoZSB0b2dnbGUuICovXG4gIEBJbnB1dCgpIHRhYkluZGV4OiBudW1iZXIgfCBudWxsO1xuXG4gIC8qKiBTY3JlZW4tcmVhZGVyIGxhYmVsIGZvciB0aGUgYnV0dG9uLiAqL1xuICBASW5wdXQoJ2FyaWEtbGFiZWwnKSBhcmlhTGFiZWwhOiBzdHJpbmc7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHRvZ2dsZSBidXR0b24gaXMgZGlzYWJsZWQuICovXG4gIEBJbnB1dCh7IHRyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZSB9KVxuICBnZXQgZGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMuX2Rpc2FibGVkID09IG51bGwgJiYgdGhpcy5waWNrZXIpIHtcbiAgICAgIHJldHVybiB0aGlzLnBpY2tlci5kaXNhYmxlZDtcbiAgICB9XG5cbiAgICByZXR1cm4gISF0aGlzLl9kaXNhYmxlZDtcbiAgfVxuICBzZXQgZGlzYWJsZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9kaXNhYmxlZCA9IHZhbHVlO1xuICB9XG4gIHByaXZhdGUgX2Rpc2FibGVkITogYm9vbGVhbjtcblxuICAvKiogV2hldGhlciByaXBwbGVzIG9uIHRoZSB0b2dnbGUgc2hvdWxkIGJlIGRpc2FibGVkLiAqL1xuICBASW5wdXQoeyB0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGUgfSkgZGlzYWJsZVJpcHBsZSE6IGJvb2xlYW47XG5cbiAgLyoqIEN1c3RvbSBpY29uIHNldCBieSB0aGUgY29uc3VtZXIuICovXG4gIEBDb250ZW50Q2hpbGQoTXR4Q29sb3JwaWNrZXJUb2dnbGVJY29uKSBfY3VzdG9tSWNvbiE6IE10eENvbG9ycGlja2VyVG9nZ2xlSWNvbjtcblxuICAvKiogVW5kZXJseWluZyBidXR0b24gZWxlbWVudC4gKi9cbiAgQFZpZXdDaGlsZCgnYnV0dG9uJykgX2J1dHRvbiE6IE1hdEJ1dHRvbjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgQEF0dHJpYnV0ZSgndGFiaW5kZXgnKSBkZWZhdWx0VGFiSW5kZXg6IHN0cmluZ1xuICApIHtcbiAgICBjb25zdCBwYXJzZWRUYWJJbmRleCA9IE51bWJlcihkZWZhdWx0VGFiSW5kZXgpO1xuICAgIHRoaXMudGFiSW5kZXggPSBwYXJzZWRUYWJJbmRleCB8fCBwYXJzZWRUYWJJbmRleCA9PT0gMCA/IHBhcnNlZFRhYkluZGV4IDogbnVsbDtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBpZiAoY2hhbmdlcy5waWNrZXIpIHtcbiAgICAgIHRoaXMuX3dhdGNoU3RhdGVDaGFuZ2VzKCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fc3RhdGVDaGFuZ2VzLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgdGhpcy5fd2F0Y2hTdGF0ZUNoYW5nZXMoKTtcbiAgfVxuXG4gIF9vcGVuKGV2ZW50OiBFdmVudCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnBpY2tlciAmJiAhdGhpcy5kaXNhYmxlZCkge1xuICAgICAgdGhpcy5waWNrZXIub3BlbigpO1xuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfd2F0Y2hTdGF0ZUNoYW5nZXMoKSB7XG4gICAgY29uc3QgcGlja2VyRGlzYWJsZWQgPSB0aGlzLnBpY2tlciA/IHRoaXMucGlja2VyLl9kaXNhYmxlZENoYW5nZSA6IG9ic2VydmFibGVPZigpO1xuICAgIGNvbnN0IGlucHV0RGlzYWJsZWQgPVxuICAgICAgdGhpcy5waWNrZXIgJiYgdGhpcy5waWNrZXIucGlja2VySW5wdXRcbiAgICAgICAgPyB0aGlzLnBpY2tlci5waWNrZXJJbnB1dC5fZGlzYWJsZWRDaGFuZ2VcbiAgICAgICAgOiBvYnNlcnZhYmxlT2YoKTtcbiAgICBjb25zdCBwaWNrZXJUb2dnbGVkID0gdGhpcy5waWNrZXJcbiAgICAgID8gbWVyZ2UodGhpcy5waWNrZXIub3BlbmVkU3RyZWFtLCB0aGlzLnBpY2tlci5jbG9zZWRTdHJlYW0pXG4gICAgICA6IG9ic2VydmFibGVPZigpO1xuXG4gICAgdGhpcy5fc3RhdGVDaGFuZ2VzLnVuc3Vic2NyaWJlKCk7XG4gICAgdGhpcy5fc3RhdGVDaGFuZ2VzID0gbWVyZ2UoXG4gICAgICBwaWNrZXJEaXNhYmxlZCBhcyBPYnNlcnZhYmxlPHZvaWQ+LFxuICAgICAgaW5wdXREaXNhYmxlZCBhcyBPYnNlcnZhYmxlPHZvaWQ+LFxuICAgICAgcGlja2VyVG9nZ2xlZFxuICAgICkuc3Vic2NyaWJlKCgpID0+IHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpKTtcbiAgfVxufVxuIiwiPGJ1dHRvbiAjYnV0dG9uXG4gIG1hdC1pY29uLWJ1dHRvblxuICB0eXBlPVwiYnV0dG9uXCJcbiAgW2F0dHIuYXJpYS1oYXNwb3B1cF09XCJwaWNrZXIgPyAnZGlhbG9nJyA6IG51bGxcIlxuICBbYXR0ci5hcmlhLWxhYmVsXT1cImFyaWFMYWJlbFwiXG4gIFthdHRyLnRhYmluZGV4XT1cImRpc2FibGVkID8gLTEgOiB0YWJJbmRleFwiXG4gIFtkaXNhYmxlZF09XCJkaXNhYmxlZFwiXG4gIFtkaXNhYmxlUmlwcGxlXT1cImRpc2FibGVSaXBwbGVcIj5cblxuICBAaWYgKCFfY3VzdG9tSWNvbikge1xuICAgIDxzdmdcbiAgICAgIGNsYXNzPVwibXR4LWNvbG9ycGlja2VyLXRvZ2dsZS1kZWZhdWx0LWljb25cIlxuICAgICAgdmlld0JveD1cIjAgMCAyNCAyNFwiXG4gICAgICB3aWR0aD1cIjI0cHhcIlxuICAgICAgaGVpZ2h0PVwiMjRweFwiXG4gICAgICBmaWxsPVwiY3VycmVudENvbG9yXCJcbiAgICAgIGZvY3VzYWJsZT1cImZhbHNlXCI+XG4gICAgICA8cGF0aCBkPVwiTTE3LjUsMTJBMS41LDEuNSAwIDAsMSAxNiwxMC41QTEuNSwxLjUgMCAwLDEgMTcuNSw5QTEuNSwxLjUgMCAwLDEgMTksMTAuNUExLjUsMS41IDAgMCwxIDE3LjUsMTJNMTQuNSw4QTEuNSwxLjUgMCAwLDEgMTMsNi41QTEuNSwxLjUgMCAwLDEgMTQuNSw1QTEuNSwxLjUgMCAwLDEgMTYsNi41QTEuNSwxLjUgMCAwLDEgMTQuNSw4TTkuNSw4QTEuNSwxLjUgMCAwLDEgOCw2LjVBMS41LDEuNSAwIDAsMSA5LjUsNUExLjUsMS41IDAgMCwxIDExLDYuNUExLjUsMS41IDAgMCwxIDkuNSw4TTYuNSwxMkExLjUsMS41IDAgMCwxIDUsMTAuNUExLjUsMS41IDAgMCwxIDYuNSw5QTEuNSwxLjUgMCAwLDEgOCwxMC41QTEuNSwxLjUgMCAwLDEgNi41LDEyTTEyLDNBOSw5IDAgMCwwIDMsMTJBOSw5IDAgMCwwIDEyLDIxQTEuNSwxLjUgMCAwLDAgMTMuNSwxOS41QzEzLjUsMTkuMTEgMTMuMzUsMTguNzYgMTMuMTEsMTguNUMxMi44OCwxOC4yMyAxMi43MywxNy44OCAxMi43MywxNy41QTEuNSwxLjUgMCAwLDEgMTQuMjMsMTZIMTZBNSw1IDAgMCwwIDIxLDExQzIxLDYuNTggMTYuOTcsMyAxMiwzWlwiIC8+XG4gICAgPC9zdmc+XG4gIH1cblxuICA8bmctY29udGVudCBzZWxlY3Q9XCJbbXR4Q29sb3JwaWNrZXJUb2dnbGVJY29uXVwiPjwvbmctY29udGVudD5cbjwvYnV0dG9uPlxuIl19