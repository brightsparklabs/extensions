import * as i0 from '@angular/core';
import { booleanAttribute, Component, ViewEncapsulation, ChangeDetectionStrategy, Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

class MtxProgress {
    constructor() {
        /** The progress's type. Can be `default`, `info`, `success`, `warning` or `danger`. */
        this.type = 'default';
        /** The value of the progress. */
        this.value = 0;
        /** Whether to apply the striped class. */
        this.striped = false;
        /** Whether to apply the animated class. */
        this.animate = false;
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxProgress, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    /** @nocollapse */ static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "16.1.0", version: "18.0.1", type: MtxProgress, isStandalone: true, selector: "mtx-progress", inputs: { type: "type", value: "value", height: "height", color: "color", foreground: "foreground", background: "background", striped: ["striped", "striped", booleanAttribute], animate: ["animate", "animate", booleanAttribute] }, host: { properties: { "style.height": "height", "style.backgroundColor": "background" }, classAttribute: "mtx-progress" }, exportAs: ["mtxProgress"], ngImport: i0, template: "<div class=\"mtx-progress-fill\"\n     [class]=\"'mtx-progress-fill-' + type\"\n     [class.mtx-progress-fill-striped]=\"striped\"\n     [class.mtx-progress-fill-animated]=\"animate\"\n     [style.width.%]=\"value\"\n     [style.background-color]=\"foreground\"\n     [style.color]=\"color\"\n     role=\"progress-fill\">\n  <ng-content></ng-content>\n</div>\n", styles: [".mtx-progress{display:flex;height:16px;margin:8px 0;overflow:hidden;font-size:var(--mtx-progress-text-size);border-radius:var(--mtx-progress-container-shape);background-color:var(--mtx-progress-track-color)}.mtx-progress-fill{display:flex;flex-direction:column;justify-content:center;text-align:center;transition:width .6s ease;background-color:var(--mtx-progress-indicator-color);color:var(--mtx-progress-text-color)}.mtx-progress-fill-info{background-color:var(--mtx-progress-info-indicator-color);color:var(--mtx-progress-info-text-color)}.mtx-progress-fill-success{background-color:var(--mtx-progress-success-indicator-color);color:var(--mtx-progress-success-text-color)}.mtx-progress-fill-warning{background-color:var(--mtx-progress-warning-indicator-color);color:var(--mtx-progress-warning-text-color)}.mtx-progress-fill-danger{background-color:var(--mtx-progress-danger-indicator-color);color:var(--mtx-progress-danger-text-color)}.mtx-progress-fill-striped{background-image:linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);background-size:16px 16px}.mtx-progress-fill-animated{animation:mtx-progress-fill-stripes 1s linear infinite}@media (prefers-reduced-motion: reduce){.mtx-progress-fill-animated{animation:none}}@keyframes mtx-progress-fill-stripes{0%{background-position:16px 0}to{background-position:0 0}}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxProgress, decorators: [{
            type: Component,
            args: [{ selector: 'mtx-progress', exportAs: 'mtxProgress', host: {
                        'class': 'mtx-progress',
                        '[style.height]': 'height',
                        '[style.backgroundColor]': 'background',
                    }, encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, standalone: true, template: "<div class=\"mtx-progress-fill\"\n     [class]=\"'mtx-progress-fill-' + type\"\n     [class.mtx-progress-fill-striped]=\"striped\"\n     [class.mtx-progress-fill-animated]=\"animate\"\n     [style.width.%]=\"value\"\n     [style.background-color]=\"foreground\"\n     [style.color]=\"color\"\n     role=\"progress-fill\">\n  <ng-content></ng-content>\n</div>\n", styles: [".mtx-progress{display:flex;height:16px;margin:8px 0;overflow:hidden;font-size:var(--mtx-progress-text-size);border-radius:var(--mtx-progress-container-shape);background-color:var(--mtx-progress-track-color)}.mtx-progress-fill{display:flex;flex-direction:column;justify-content:center;text-align:center;transition:width .6s ease;background-color:var(--mtx-progress-indicator-color);color:var(--mtx-progress-text-color)}.mtx-progress-fill-info{background-color:var(--mtx-progress-info-indicator-color);color:var(--mtx-progress-info-text-color)}.mtx-progress-fill-success{background-color:var(--mtx-progress-success-indicator-color);color:var(--mtx-progress-success-text-color)}.mtx-progress-fill-warning{background-color:var(--mtx-progress-warning-indicator-color);color:var(--mtx-progress-warning-text-color)}.mtx-progress-fill-danger{background-color:var(--mtx-progress-danger-indicator-color);color:var(--mtx-progress-danger-text-color)}.mtx-progress-fill-striped{background-image:linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);background-size:16px 16px}.mtx-progress-fill-animated{animation:mtx-progress-fill-stripes 1s linear infinite}@media (prefers-reduced-motion: reduce){.mtx-progress-fill-animated{animation:none}}@keyframes mtx-progress-fill-stripes{0%{background-position:16px 0}to{background-position:0 0}}\n"] }]
        }], propDecorators: { type: [{
                type: Input
            }], value: [{
                type: Input
            }], height: [{
                type: Input
            }], color: [{
                type: Input
            }], foreground: [{
                type: Input
            }], background: [{
                type: Input
            }], striped: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], animate: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }] } });

class MtxProgressModule {
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxProgressModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    /** @nocollapse */ static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.0.1", ngImport: i0, type: MtxProgressModule, imports: [CommonModule, MtxProgress], exports: [MtxProgress] }); }
    /** @nocollapse */ static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxProgressModule, imports: [CommonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxProgressModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, MtxProgress],
                    exports: [MtxProgress],
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { MtxProgress, MtxProgressModule };
//# sourceMappingURL=mtxProgress.mjs.map
