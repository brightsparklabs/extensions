import * as i0 from '@angular/core';
import { booleanAttribute, Component, ViewEncapsulation, ChangeDetectionStrategy, Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBar, MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinner, MatProgressSpinnerModule } from '@angular/material/progress-spinner';

class MtxLoader {
    constructor(_changeDetectorRef) {
        this._changeDetectorRef = _changeDetectorRef;
        /** The loader's type. Can be `spinner` or `progressbar` */
        this.type = 'spinner';
        /** Theme color palette for the component. */
        this.color = 'primary';
        /** Mode of the progress circle or the progress bar. */
        this.mode = 'indeterminate';
        /** Stroke width of the spinner loader. */
        this.strokeWidth = 4;
        /** The diameter of the spinner loader (will set width and height of svg). */
        this.diameter = 48;
        /** Buffer value of the progressbar loader. */
        this.bufferValue = 0;
        /** Value of the progress circle or the progress bar. */
        this.value = 0;
        /** Whether the loader is loading. */
        this.loading = true;
        /** Whether the loader has a backdrop. */
        this.hasBackdrop = true;
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxLoader, deps: [{ token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component }); }
    /** @nocollapse */ static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.0.1", type: MtxLoader, isStandalone: true, selector: "mtx-loader", inputs: { type: "type", color: "color", mode: "mode", strokeWidth: "strokeWidth", diameter: "diameter", bufferValue: "bufferValue", value: "value", loading: ["loading", "loading", booleanAttribute], hasBackdrop: ["hasBackdrop", "hasBackdrop", booleanAttribute] }, host: { properties: { "class.mtx-loader-loading": "loading" }, classAttribute: "mtx-loader" }, exportAs: ["mtxLoader"], ngImport: i0, template: "@if (loading && hasBackdrop) {\n  <div class=\"mtx-loader-backdrop\"></div>\n}\n@if (loading) {\n  <div class=\"mtx-loader-main\">\n    @if (type==='spinner') {\n      <mat-spinner\n        [color]=\"color\"\n        [strokeWidth]=\"strokeWidth\"\n        [diameter]=\"diameter\"\n        [mode]=\"$any(mode)\"\n        [value]=\"value\">\n      </mat-spinner>\n    }\n    @if (type==='progressbar') {\n      <mat-progress-bar\n        [color]=\"color\"\n        [mode]=\"$any(mode)\"\n        [value]=\"value\"\n        [bufferValue]=\"bufferValue\">\n      </mat-progress-bar>\n    }\n  </div>\n}\n<ng-content></ng-content>\n", styles: [".mtx-loader{position:relative;display:block;width:100%;height:100%}.mtx-loader-main{position:absolute;top:0;left:0;z-index:2;display:flex;justify-content:center;align-items:center;width:100%;height:100%}.mtx-loader-main .mat-mdc-spinner{position:relative}.mtx-loader-main .mat-mdc-progress-bar{position:absolute;top:0;left:0;width:100%}.mtx-loader-backdrop{position:absolute;top:0;left:0;z-index:1;display:block;width:100%;height:100%;content:\"\";background-color:var(--mtx-loader-backdrop-background-color)}\n"], dependencies: [{ kind: "component", type: MatProgressSpinner, selector: "mat-progress-spinner, mat-spinner", inputs: ["color", "mode", "value", "diameter", "strokeWidth"], exportAs: ["matProgressSpinner"] }, { kind: "component", type: MatProgressBar, selector: "mat-progress-bar", inputs: ["color", "value", "bufferValue", "mode"], outputs: ["animationEnd"], exportAs: ["matProgressBar"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxLoader, decorators: [{
            type: Component,
            args: [{ selector: 'mtx-loader', exportAs: 'mtxLoader', host: {
                        'class': 'mtx-loader',
                        '[class.mtx-loader-loading]': 'loading',
                    }, encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, standalone: true, imports: [MatProgressSpinner, MatProgressBar], template: "@if (loading && hasBackdrop) {\n  <div class=\"mtx-loader-backdrop\"></div>\n}\n@if (loading) {\n  <div class=\"mtx-loader-main\">\n    @if (type==='spinner') {\n      <mat-spinner\n        [color]=\"color\"\n        [strokeWidth]=\"strokeWidth\"\n        [diameter]=\"diameter\"\n        [mode]=\"$any(mode)\"\n        [value]=\"value\">\n      </mat-spinner>\n    }\n    @if (type==='progressbar') {\n      <mat-progress-bar\n        [color]=\"color\"\n        [mode]=\"$any(mode)\"\n        [value]=\"value\"\n        [bufferValue]=\"bufferValue\">\n      </mat-progress-bar>\n    }\n  </div>\n}\n<ng-content></ng-content>\n", styles: [".mtx-loader{position:relative;display:block;width:100%;height:100%}.mtx-loader-main{position:absolute;top:0;left:0;z-index:2;display:flex;justify-content:center;align-items:center;width:100%;height:100%}.mtx-loader-main .mat-mdc-spinner{position:relative}.mtx-loader-main .mat-mdc-progress-bar{position:absolute;top:0;left:0;width:100%}.mtx-loader-backdrop{position:absolute;top:0;left:0;z-index:1;display:block;width:100%;height:100%;content:\"\";background-color:var(--mtx-loader-backdrop-background-color)}\n"] }]
        }], ctorParameters: () => [{ type: i0.ChangeDetectorRef }], propDecorators: { type: [{
                type: Input
            }], color: [{
                type: Input
            }], mode: [{
                type: Input
            }], strokeWidth: [{
                type: Input
            }], diameter: [{
                type: Input
            }], bufferValue: [{
                type: Input
            }], value: [{
                type: Input
            }], loading: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], hasBackdrop: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }] } });

class MtxLoaderModule {
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxLoaderModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    /** @nocollapse */ static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.0.1", ngImport: i0, type: MtxLoaderModule, imports: [CommonModule, MatProgressSpinnerModule, MatProgressBarModule, MtxLoader], exports: [MtxLoader] }); }
    /** @nocollapse */ static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxLoaderModule, imports: [CommonModule, MatProgressSpinnerModule, MatProgressBarModule, MtxLoader] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxLoaderModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, MatProgressSpinnerModule, MatProgressBarModule, MtxLoader],
                    exports: [MtxLoader],
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { MtxLoader, MtxLoaderModule };
//# sourceMappingURL=mtxLoader.mjs.map
