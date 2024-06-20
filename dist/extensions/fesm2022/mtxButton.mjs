import * as i0 from '@angular/core';
import { booleanAttribute, Directive, Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinner, MatProgressSpinnerModule } from '@angular/material/progress-spinner';

class MatButtonLoading {
    constructor(_elementRef, _viewContainerRef, _renderer) {
        this._elementRef = _elementRef;
        this._viewContainerRef = _viewContainerRef;
        this._renderer = _renderer;
        this.loading = false;
        this.disabled = false;
    }
    ngOnChanges(changes) {
        if (!changes.loading) {
            return;
        }
        if (changes.loading.currentValue) {
            this._elementRef.nativeElement.classList.add('mat-button-loading');
            setTimeout(() => this._elementRef.nativeElement.setAttribute('disabled', ''));
            this.createSpinner();
        }
        else if (!changes.loading.firstChange) {
            this._elementRef.nativeElement.classList.remove('mat-button-loading');
            setTimeout(() => this._elementRef.nativeElement.removeAttribute('disabled'));
            this.destroySpinner();
        }
    }
    createSpinner() {
        if (!this.spinner) {
            this.spinner = this._viewContainerRef.createComponent(MatProgressSpinner);
            this.spinner.instance.color = this.color;
            this.spinner.instance.diameter = 24;
            this.spinner.instance.mode = 'indeterminate';
            this._renderer.appendChild(this._elementRef.nativeElement, this.spinner.instance._elementRef.nativeElement);
        }
    }
    destroySpinner() {
        if (this.spinner) {
            this.spinner.destroy();
            this.spinner = null;
        }
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MatButtonLoading, deps: [{ token: i0.ElementRef }, { token: i0.ViewContainerRef }, { token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Directive }); }
    /** @nocollapse */ static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "16.1.0", version: "18.0.1", type: MatButtonLoading, isStandalone: true, selector: "[mat-button][loading],\n             [mat-raised-button][loading],\n             [mat-stroked-button][loading],\n             [mat-flat-button][loading],\n             [mat-icon-button][loading],\n             [mat-fab][loading],\n             [mat-mini-fab][loading]", inputs: { loading: ["loading", "loading", booleanAttribute], disabled: ["disabled", "disabled", booleanAttribute], color: "color" }, usesOnChanges: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MatButtonLoading, decorators: [{
            type: Directive,
            args: [{
                    selector: `[mat-button][loading],
             [mat-raised-button][loading],
             [mat-stroked-button][loading],
             [mat-flat-button][loading],
             [mat-icon-button][loading],
             [mat-fab][loading],
             [mat-mini-fab][loading]`,
                    standalone: true,
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i0.ViewContainerRef }, { type: i0.Renderer2 }], propDecorators: { loading: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], disabled: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], color: [{
                type: Input
            }] } });

class MtxButtonModule {
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxButtonModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    /** @nocollapse */ static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.0.1", ngImport: i0, type: MtxButtonModule, imports: [CommonModule, MatButtonModule, MatProgressSpinnerModule, MatButtonLoading], exports: [MatButtonLoading] }); }
    /** @nocollapse */ static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxButtonModule, imports: [CommonModule, MatButtonModule, MatProgressSpinnerModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxButtonModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, MatButtonModule, MatProgressSpinnerModule, MatButtonLoading],
                    exports: [MatButtonLoading],
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { MatButtonLoading, MtxButtonModule };
//# sourceMappingURL=mtxButton.mjs.map
