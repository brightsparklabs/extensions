import * as i0 from '@angular/core';
import { EventEmitter, booleanAttribute, Component, ViewEncapsulation, ChangeDetectionStrategy, HostBinding, Input, Output, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

class MtxAlert {
    get _hostClassList() {
        return `mtx-alert-${this.type} mat-elevation-z${this.elevation}`;
    }
    constructor(_changeDetectorRef) {
        this._changeDetectorRef = _changeDetectorRef;
        /** The alert's type. Can be `default`, `info`, `success`, `warning` or `danger`. */
        this.type = 'default';
        /** Whether to display an inline close button. */
        this.dismissible = false;
        /** The alert's elevation (0~24). */
        this.elevation = 0;
        /** Event emitted when the alert closed. */
        this.closed = new EventEmitter();
    }
    _onClosed() {
        this._changeDetectorRef.markForCheck();
        this.closed.emit(this);
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxAlert, deps: [{ token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component }); }
    /** @nocollapse */ static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.0.1", type: MtxAlert, isStandalone: true, selector: "mtx-alert", inputs: { type: "type", dismissible: ["dismissible", "dismissible", booleanAttribute], elevation: "elevation" }, outputs: { closed: "closed" }, host: { attributes: { "role": "alert" }, properties: { "class.mtx-alert-dismissible": "dismissible", "class": "this._hostClassList" }, classAttribute: "mtx-alert" }, exportAs: ["mtxAlert"], ngImport: i0, template: "<ng-content></ng-content>\n@if (dismissible) {\n  <button type=\"button\" class=\"mtx-alert-close\" aria-label=\"Close\" (click)=\"_onClosed()\">\n    <span aria-hidden=\"true\">&times;</span>\n  </button>\n}\n", styles: [".mtx-alert{position:relative;display:block;padding:12px 20px;margin-bottom:16px;border:1px solid var(--mtx-alert-outline-color);border-radius:var(--mtx-alert-container-shape);background-color:var(--mtx-alert-background-color);color:var(--mtx-alert-text-color)}.mtx-alert.mtx-alert-info{background-color:var(--mtx-alert-info-background-color);color:var(--mtx-alert-info-text-color)}.mtx-alert.mtx-alert-success{background-color:var(--mtx-alert-success-background-color);color:var(--mtx-alert-success-text-color)}.mtx-alert.mtx-alert-warning{background-color:var(--mtx-alert-warning-background-color);color:var(--mtx-alert-warning-text-color)}.mtx-alert.mtx-alert-danger{background-color:var(--mtx-alert-danger-background-color);color:var(--mtx-alert-danger-text-color)}.mtx-alert-close{position:absolute;top:0;bottom:0;right:0;padding:0 1.25rem;font-size:1.5rem;line-height:1;color:inherit;opacity:.5;background-color:transparent;border:0;cursor:pointer}[dir=rtl] .mtx-alert-close{right:auto;left:0}.mtx-alert-close:hover{opacity:.75}.mtx-alert-dismissible{padding-right:4rem}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxAlert, decorators: [{
            type: Component,
            args: [{ selector: 'mtx-alert', exportAs: 'mtxAlert', host: {
                        'class': 'mtx-alert',
                        '[class.mtx-alert-dismissible]': 'dismissible',
                        'role': 'alert',
                    }, encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, standalone: true, template: "<ng-content></ng-content>\n@if (dismissible) {\n  <button type=\"button\" class=\"mtx-alert-close\" aria-label=\"Close\" (click)=\"_onClosed()\">\n    <span aria-hidden=\"true\">&times;</span>\n  </button>\n}\n", styles: [".mtx-alert{position:relative;display:block;padding:12px 20px;margin-bottom:16px;border:1px solid var(--mtx-alert-outline-color);border-radius:var(--mtx-alert-container-shape);background-color:var(--mtx-alert-background-color);color:var(--mtx-alert-text-color)}.mtx-alert.mtx-alert-info{background-color:var(--mtx-alert-info-background-color);color:var(--mtx-alert-info-text-color)}.mtx-alert.mtx-alert-success{background-color:var(--mtx-alert-success-background-color);color:var(--mtx-alert-success-text-color)}.mtx-alert.mtx-alert-warning{background-color:var(--mtx-alert-warning-background-color);color:var(--mtx-alert-warning-text-color)}.mtx-alert.mtx-alert-danger{background-color:var(--mtx-alert-danger-background-color);color:var(--mtx-alert-danger-text-color)}.mtx-alert-close{position:absolute;top:0;bottom:0;right:0;padding:0 1.25rem;font-size:1.5rem;line-height:1;color:inherit;opacity:.5;background-color:transparent;border:0;cursor:pointer}[dir=rtl] .mtx-alert-close{right:auto;left:0}.mtx-alert-close:hover{opacity:.75}.mtx-alert-dismissible{padding-right:4rem}\n"] }]
        }], ctorParameters: () => [{ type: i0.ChangeDetectorRef }], propDecorators: { _hostClassList: [{
                type: HostBinding,
                args: ['class']
            }], type: [{
                type: Input
            }], dismissible: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], elevation: [{
                type: Input
            }], closed: [{
                type: Output
            }] } });

class MtxAlertModule {
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxAlertModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    /** @nocollapse */ static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.0.1", ngImport: i0, type: MtxAlertModule, imports: [CommonModule, MtxAlert], exports: [MtxAlert] }); }
    /** @nocollapse */ static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxAlertModule, imports: [CommonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxAlertModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, MtxAlert],
                    exports: [MtxAlert],
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { MtxAlert, MtxAlertModule };
//# sourceMappingURL=mtxAlert.mjs.map
