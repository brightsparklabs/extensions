import * as i0 from '@angular/core';
import { Component, ViewEncapsulation, ChangeDetectionStrategy, Inject, Injectable, NgModule } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import * as i1 from '@angular/material/dialog';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButton, MatIconButton, MatFabButton, MatMiniFabButton, MatButtonModule } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MtxToObservablePipe, MtxPipesModule } from '@ng-matero/extensions/core';

class MtxDialogContainer {
    constructor(dialogRef, data) {
        this.dialogRef = dialogRef;
        this.data = data;
    }
    _onClick(fn) {
        if (fn) {
            fn.call(this);
        }
        this._onClose();
    }
    _onClose() {
        this.dialogRef.close();
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxDialogContainer, deps: [{ token: i1.MatDialogRef }, { token: MAT_DIALOG_DATA }], target: i0.ɵɵFactoryTarget.Component }); }
    /** @nocollapse */ static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.0.1", type: MtxDialogContainer, isStandalone: true, selector: "mtx-dialog-container", host: { classAttribute: "mtx-dialog-container" }, exportAs: ["mtxDialogContainer"], ngImport: i0, template: "@if (data.title) {\n  <h1 class=\"mtx-dialog-title\">\n    <span>{{data.title | toObservable | async}}</span>\n    @if (data.showCloseIcon) {\n      <button mat-icon-button (click)=\"_onClose()\">\n        <mat-icon>close</mat-icon>\n      </button>\n    }\n  </h1>\n}\n@if (data.description) {\n  <div class=\"mtx-dialog-content\">\n    <p>{{data.description | toObservable | async}}</p>\n  </div>\n}\n<div class=\"mtx-dialog-actions\">\n  @for (btn of data.buttons; track btn) {\n    @switch (btn.type) {\n      @case ('raised') {\n        @if (btn.focusInitial) {\n          <button mat-raised-button cdkFocusInitial\n            [color]=\"btn.color\" [class]=\"btn.class\" (click)=\"_onClick(btn.onClick!)\">\n            {{btn.text | toObservable | async}}\n          </button>\n        } @else {\n          <button mat-raised-button\n            [color]=\"btn.color\" [class]=\"btn.class\" (click)=\"_onClick(btn.onClick!)\">\n            {{btn.text | toObservable | async}}\n          </button>\n        }\n      }\n      @case ('stroked') {\n        @if (btn.focusInitial) {\n          <button mat-stroked-button cdkFocusInitial\n            [color]=\"btn.color\" [class]=\"btn.class\" (click)=\"_onClick(btn.onClick!)\">\n            {{btn.text | toObservable | async}}\n          </button>\n        } @else {\n          <button mat-stroked-button\n            [color]=\"btn.color\" [class]=\"btn.class\" (click)=\"_onClick(btn.onClick!)\">\n            {{btn.text | toObservable | async}}\n          </button>\n        }\n      }\n      @case ('flat') {\n        @if (btn.focusInitial) {\n          <button mat-flat-button cdkFocusInitial\n            [color]=\"btn.color\" [class]=\"btn.class\" (click)=\"_onClick(btn.onClick!)\">\n            {{btn.text | toObservable | async}}\n          </button>\n        } @else {\n          <button mat-flat-button\n            [color]=\"btn.color\" [class]=\"btn.class\" (click)=\"_onClick(btn.onClick!)\">\n            {{btn.text | toObservable | async}}\n          </button>\n        }\n      }\n      @default {\n        @if (btn.focusInitial) {\n          <button mat-button cdkFocusInitial\n            [color]=\"btn.color\" [class]=\"btn.class\" (click)=\"_onClick(btn.onClick!)\">\n            {{btn.text | toObservable | async}}\n          </button>\n        } @else {\n          <button mat-button\n            [color]=\"btn.color\" [class]=\"btn.class\" (click)=\"_onClick(btn.onClick!)\">\n            {{btn.text | toObservable | async}}\n          </button>\n        }\n      }\n    }\n  }\n</div>\n", styles: [".mtx-dialog-title{display:flex;justify-content:space-between;align-items:center;padding:8px 24px;margin:0;line-height:48px;font-weight:500;font-size:20px}.mtx-dialog-title .mat-mdc-button-base{margin-right:-16px}[dir=rtl] .mtx-dialog-title .mat-mdc-button-base{margin-right:0;margin-left:-16px}.mtx-dialog-content{display:block;max-height:65vh;padding:0 24px;overflow:auto;-webkit-overflow-scrolling:touch}.mtx-dialog-content p{margin-top:0}.mtx-dialog-actions{display:flex;flex-wrap:wrap;align-items:center;justify-content:flex-end;padding:8px}.mtx-dialog-actions .mat-mdc-button-base{margin-left:8px}[dir=rtl] .mtx-dialog-actions .mat-mdc-button-base{margin-left:0;margin-right:8px}\n"], dependencies: [{ kind: "pipe", type: AsyncPipe, name: "async" }, { kind: "component", type: MatButton, selector: "    button[mat-button], button[mat-raised-button], button[mat-flat-button],    button[mat-stroked-button]  ", exportAs: ["matButton"] }, { kind: "component", type: MatIconButton, selector: "button[mat-icon-button]", exportAs: ["matButton"] }, { kind: "component", type: MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }, { kind: "pipe", type: MtxToObservablePipe, name: "toObservable" }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxDialogContainer, decorators: [{
            type: Component,
            args: [{ selector: 'mtx-dialog-container', exportAs: 'mtxDialogContainer', host: {
                        class: 'mtx-dialog-container',
                    }, encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, standalone: true, imports: [
                        AsyncPipe,
                        MatButton,
                        MatIconButton,
                        MatFabButton,
                        MatMiniFabButton,
                        MatIcon,
                        MtxToObservablePipe,
                    ], template: "@if (data.title) {\n  <h1 class=\"mtx-dialog-title\">\n    <span>{{data.title | toObservable | async}}</span>\n    @if (data.showCloseIcon) {\n      <button mat-icon-button (click)=\"_onClose()\">\n        <mat-icon>close</mat-icon>\n      </button>\n    }\n  </h1>\n}\n@if (data.description) {\n  <div class=\"mtx-dialog-content\">\n    <p>{{data.description | toObservable | async}}</p>\n  </div>\n}\n<div class=\"mtx-dialog-actions\">\n  @for (btn of data.buttons; track btn) {\n    @switch (btn.type) {\n      @case ('raised') {\n        @if (btn.focusInitial) {\n          <button mat-raised-button cdkFocusInitial\n            [color]=\"btn.color\" [class]=\"btn.class\" (click)=\"_onClick(btn.onClick!)\">\n            {{btn.text | toObservable | async}}\n          </button>\n        } @else {\n          <button mat-raised-button\n            [color]=\"btn.color\" [class]=\"btn.class\" (click)=\"_onClick(btn.onClick!)\">\n            {{btn.text | toObservable | async}}\n          </button>\n        }\n      }\n      @case ('stroked') {\n        @if (btn.focusInitial) {\n          <button mat-stroked-button cdkFocusInitial\n            [color]=\"btn.color\" [class]=\"btn.class\" (click)=\"_onClick(btn.onClick!)\">\n            {{btn.text | toObservable | async}}\n          </button>\n        } @else {\n          <button mat-stroked-button\n            [color]=\"btn.color\" [class]=\"btn.class\" (click)=\"_onClick(btn.onClick!)\">\n            {{btn.text | toObservable | async}}\n          </button>\n        }\n      }\n      @case ('flat') {\n        @if (btn.focusInitial) {\n          <button mat-flat-button cdkFocusInitial\n            [color]=\"btn.color\" [class]=\"btn.class\" (click)=\"_onClick(btn.onClick!)\">\n            {{btn.text | toObservable | async}}\n          </button>\n        } @else {\n          <button mat-flat-button\n            [color]=\"btn.color\" [class]=\"btn.class\" (click)=\"_onClick(btn.onClick!)\">\n            {{btn.text | toObservable | async}}\n          </button>\n        }\n      }\n      @default {\n        @if (btn.focusInitial) {\n          <button mat-button cdkFocusInitial\n            [color]=\"btn.color\" [class]=\"btn.class\" (click)=\"_onClick(btn.onClick!)\">\n            {{btn.text | toObservable | async}}\n          </button>\n        } @else {\n          <button mat-button\n            [color]=\"btn.color\" [class]=\"btn.class\" (click)=\"_onClick(btn.onClick!)\">\n            {{btn.text | toObservable | async}}\n          </button>\n        }\n      }\n    }\n  }\n</div>\n", styles: [".mtx-dialog-title{display:flex;justify-content:space-between;align-items:center;padding:8px 24px;margin:0;line-height:48px;font-weight:500;font-size:20px}.mtx-dialog-title .mat-mdc-button-base{margin-right:-16px}[dir=rtl] .mtx-dialog-title .mat-mdc-button-base{margin-right:0;margin-left:-16px}.mtx-dialog-content{display:block;max-height:65vh;padding:0 24px;overflow:auto;-webkit-overflow-scrolling:touch}.mtx-dialog-content p{margin-top:0}.mtx-dialog-actions{display:flex;flex-wrap:wrap;align-items:center;justify-content:flex-end;padding:8px}.mtx-dialog-actions .mat-mdc-button-base{margin-left:8px}[dir=rtl] .mtx-dialog-actions .mat-mdc-button-base{margin-left:0;margin-right:8px}\n"] }]
        }], ctorParameters: () => [{ type: i1.MatDialogRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_DIALOG_DATA]
                }] }] });

const defaults = {
    title: '',
    description: '',
    buttons: [
        {
            color: 'warn',
            text: 'OK',
            focusInitial: true,
            onClick: () => { },
        },
        {
            text: 'CLOSE',
            onClick: () => { },
        },
    ],
    showCloseIcon: false,
    disableClose: true,
    width: '300px',
};
class MtxDialog {
    constructor(dialog) {
        this.dialog = dialog;
    }
    originalOpen(componentOrTemplateRef = MtxDialogContainer, config) {
        return this.dialog.open(componentOrTemplateRef, config);
    }
    open(config, componentOrTemplateRef = MtxDialogContainer) {
        const data = Object.assign({}, defaults, config);
        return this.dialog.open(componentOrTemplateRef, {
            ...data,
            data,
        });
    }
    alert(title, description = '', onOk = () => { }) {
        this.open({
            title,
            description,
            buttons: [
                {
                    color: 'warn',
                    text: 'OK',
                    onClick: () => onOk(),
                },
            ],
        });
    }
    confirm(title, description = '', onOk = () => { }, onClose = () => { }) {
        this.open({
            title,
            description,
            buttons: [
                {
                    color: 'warn',
                    text: 'OK',
                    onClick: () => onOk(),
                },
                {
                    text: 'CLOSE',
                    onClick: () => onClose(),
                },
            ],
        });
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxDialog, deps: [{ token: i1.MatDialog }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxDialog, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxDialog, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: i1.MatDialog }] });

class MtxDialogModule {
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxDialogModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    /** @nocollapse */ static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.0.1", ngImport: i0, type: MtxDialogModule, imports: [CommonModule,
            MatDialogModule,
            MatButtonModule,
            MatIconModule,
            MtxPipesModule,
            MtxDialogContainer], exports: [MtxDialogContainer] }); }
    /** @nocollapse */ static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxDialogModule, providers: [MtxDialog], imports: [CommonModule,
            MatDialogModule,
            MatButtonModule,
            MatIconModule,
            MtxPipesModule,
            MtxDialogContainer] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxDialogModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        MatDialogModule,
                        MatButtonModule,
                        MatIconModule,
                        MtxPipesModule,
                        MtxDialogContainer,
                    ],
                    exports: [MtxDialogContainer],
                    providers: [MtxDialog],
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { MtxDialog, MtxDialogContainer, MtxDialogModule };
//# sourceMappingURL=mtxDialog.mjs.map
