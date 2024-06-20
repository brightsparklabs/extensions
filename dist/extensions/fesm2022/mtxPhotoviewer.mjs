import * as i0 from '@angular/core';
import { booleanAttribute, Directive, Input, HostListener, NgModule } from '@angular/core';
import PhotoViewer from 'photoviewer';

class MtxPhotoviewer {
    constructor(_elementRef) {
        this._elementRef = _elementRef;
        this.images = [];
        this.embed = false;
    }
    ngOnInit() {
        const { nativeElement } = this._elementRef;
        if (this.embed) {
            this.options = {
                appendTo: nativeElement,
                positionFixed: false,
                modalWidth: nativeElement.clientWidth,
                modalHeight: nativeElement.clientHeight,
                ...this.options,
            };
            this.initPhotoViewer();
        }
        else {
            if (this.images.length === 0 && nativeElement.nodeName === 'IMG') {
                const img = nativeElement;
                this.images = [{ title: img.title || img.alt, src: img.src }];
            }
        }
    }
    ngOnDestroy() {
        this.photoviewerInstance?.close();
    }
    onClick(event) {
        event.preventDefault();
        if (!this.embed) {
            this.initPhotoViewer();
        }
    }
    initPhotoViewer() {
        this.photoviewerInstance = new PhotoViewer(this.images, this.options);
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxPhotoviewer, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    /** @nocollapse */ static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "16.1.0", version: "18.0.1", type: MtxPhotoviewer, isStandalone: true, selector: "[mtxPhotoviewer]", inputs: { images: ["mtxPhotoviewerItems", "images"], options: ["mtxPhotoviewerOptions", "options"], embed: ["mtxPhotoviewerEmbed", "embed", booleanAttribute] }, host: { listeners: { "click": "onClick($event)" } }, exportAs: ["mtxPhotoviewer"], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxPhotoviewer, decorators: [{
            type: Directive,
            args: [{
                    selector: '[mtxPhotoviewer]',
                    exportAs: 'mtxPhotoviewer',
                    standalone: true,
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }], propDecorators: { images: [{
                type: Input,
                args: ['mtxPhotoviewerItems']
            }], options: [{
                type: Input,
                args: ['mtxPhotoviewerOptions']
            }], embed: [{
                type: Input,
                args: [{ alias: 'mtxPhotoviewerEmbed', transform: booleanAttribute }]
            }], onClick: [{
                type: HostListener,
                args: ['click', ['$event']]
            }] } });

class MtxPhotoviewerModule {
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxPhotoviewerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    /** @nocollapse */ static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.0.1", ngImport: i0, type: MtxPhotoviewerModule, imports: [MtxPhotoviewer], exports: [MtxPhotoviewer] }); }
    /** @nocollapse */ static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxPhotoviewerModule }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxPhotoviewerModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [MtxPhotoviewer],
                    exports: [MtxPhotoviewer],
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { MtxPhotoviewer, MtxPhotoviewerModule };
//# sourceMappingURL=mtxPhotoviewer.mjs.map
