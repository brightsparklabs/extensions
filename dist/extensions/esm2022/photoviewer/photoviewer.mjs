import { Directive, HostListener, Input, booleanAttribute, } from '@angular/core';
import PhotoViewer from 'photoviewer';
import * as i0 from "@angular/core";
export class MtxPhotoviewer {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGhvdG92aWV3ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9leHRlbnNpb25zL3Bob3Rvdmlld2VyL3Bob3Rvdmlld2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxTQUFTLEVBRVQsWUFBWSxFQUNaLEtBQUssRUFHTCxnQkFBZ0IsR0FDakIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxXQUFXLE1BQU0sYUFBYSxDQUFDOztBQU90QyxNQUFNLE9BQU8sY0FBYztJQVl6QixZQUFvQixXQUFnQztRQUFoQyxnQkFBVyxHQUFYLFdBQVcsQ0FBcUI7UUFWcEQsV0FBTSxHQUFzQixFQUFFLENBQUM7UUFNL0IsVUFBSyxHQUFHLEtBQUssQ0FBQztJQUl5QyxDQUFDO0lBRXhELFFBQVE7UUFDTixNQUFNLEVBQUUsYUFBYSxFQUFFLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztRQUUzQyxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNmLElBQUksQ0FBQyxPQUFPLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLGFBQWE7Z0JBQ3ZCLGFBQWEsRUFBRSxLQUFLO2dCQUNwQixVQUFVLEVBQUUsYUFBYSxDQUFDLFdBQVc7Z0JBQ3JDLFdBQVcsRUFBRSxhQUFhLENBQUMsWUFBWTtnQkFDdkMsR0FBRyxJQUFJLENBQUMsT0FBTzthQUNoQixDQUFDO1lBQ0YsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQ3pCLENBQUM7YUFBTSxDQUFDO1lBQ04sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksYUFBYSxDQUFDLFFBQVEsS0FBSyxLQUFLLEVBQUUsQ0FBQztnQkFDakUsTUFBTSxHQUFHLEdBQUcsYUFBaUMsQ0FBQztnQkFDOUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxLQUFLLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDaEUsQ0FBQztRQUNILENBQUM7SUFDSCxDQUFDO0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxtQkFBbUIsRUFBRSxLQUFLLEVBQUUsQ0FBQztJQUNwQyxDQUFDO0lBR0QsT0FBTyxDQUFDLEtBQWlCO1FBQ3ZCLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUV2QixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2hCLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUN6QixDQUFDO0lBQ0gsQ0FBQztJQUVELGVBQWU7UUFDYixJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDeEUsQ0FBQztpSUFqRFUsY0FBYztxSEFBZCxjQUFjLGdNQU95QixnQkFBZ0I7OzJGQVB2RCxjQUFjO2tCQUwxQixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxrQkFBa0I7b0JBQzVCLFFBQVEsRUFBRSxnQkFBZ0I7b0JBQzFCLFVBQVUsRUFBRSxJQUFJO2lCQUNqQjsrRUFHQyxNQUFNO3NCQURMLEtBQUs7dUJBQUMscUJBQXFCO2dCQUk1QixPQUFPO3NCQUROLEtBQUs7dUJBQUMsdUJBQXVCO2dCQUk5QixLQUFLO3NCQURKLEtBQUs7dUJBQUMsRUFBRSxLQUFLLEVBQUUscUJBQXFCLEVBQUUsU0FBUyxFQUFFLGdCQUFnQixFQUFFO2dCQWdDcEUsT0FBTztzQkFETixZQUFZO3VCQUFDLE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgSG9zdExpc3RlbmVyLFxuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIGJvb2xlYW5BdHRyaWJ1dGUsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IFBob3RvVmlld2VyIGZyb20gJ3Bob3Rvdmlld2VyJztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW210eFBob3Rvdmlld2VyXScsXG4gIGV4cG9ydEFzOiAnbXR4UGhvdG92aWV3ZXInLFxuICBzdGFuZGFsb25lOiB0cnVlLFxufSlcbmV4cG9ydCBjbGFzcyBNdHhQaG90b3ZpZXdlciBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgQElucHV0KCdtdHhQaG90b3ZpZXdlckl0ZW1zJylcbiAgaW1hZ2VzOiBQaG90b1ZpZXdlci5JbWdbXSA9IFtdO1xuXG4gIEBJbnB1dCgnbXR4UGhvdG92aWV3ZXJPcHRpb25zJylcbiAgb3B0aW9ucz86IFBob3RvVmlld2VyLk9wdGlvbnM7XG5cbiAgQElucHV0KHsgYWxpYXM6ICdtdHhQaG90b3ZpZXdlckVtYmVkJywgdHJhbnNmb3JtOiBib29sZWFuQXR0cmlidXRlIH0pXG4gIGVtYmVkID0gZmFsc2U7XG5cbiAgcGhvdG92aWV3ZXJJbnN0YW5jZT86IFBob3RvVmlld2VyO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8RWxlbWVudD4pIHt9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgY29uc3QgeyBuYXRpdmVFbGVtZW50IH0gPSB0aGlzLl9lbGVtZW50UmVmO1xuXG4gICAgaWYgKHRoaXMuZW1iZWQpIHtcbiAgICAgIHRoaXMub3B0aW9ucyA9IHtcbiAgICAgICAgYXBwZW5kVG86IG5hdGl2ZUVsZW1lbnQsXG4gICAgICAgIHBvc2l0aW9uRml4ZWQ6IGZhbHNlLFxuICAgICAgICBtb2RhbFdpZHRoOiBuYXRpdmVFbGVtZW50LmNsaWVudFdpZHRoLFxuICAgICAgICBtb2RhbEhlaWdodDogbmF0aXZlRWxlbWVudC5jbGllbnRIZWlnaHQsXG4gICAgICAgIC4uLnRoaXMub3B0aW9ucyxcbiAgICAgIH07XG4gICAgICB0aGlzLmluaXRQaG90b1ZpZXdlcigpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy5pbWFnZXMubGVuZ3RoID09PSAwICYmIG5hdGl2ZUVsZW1lbnQubm9kZU5hbWUgPT09ICdJTUcnKSB7XG4gICAgICAgIGNvbnN0IGltZyA9IG5hdGl2ZUVsZW1lbnQgYXMgSFRNTEltYWdlRWxlbWVudDtcbiAgICAgICAgdGhpcy5pbWFnZXMgPSBbeyB0aXRsZTogaW1nLnRpdGxlIHx8IGltZy5hbHQsIHNyYzogaW1nLnNyYyB9XTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLnBob3Rvdmlld2VySW5zdGFuY2U/LmNsb3NlKCk7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdjbGljaycsIFsnJGV2ZW50J10pXG4gIG9uQ2xpY2soZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgaWYgKCF0aGlzLmVtYmVkKSB7XG4gICAgICB0aGlzLmluaXRQaG90b1ZpZXdlcigpO1xuICAgIH1cbiAgfVxuXG4gIGluaXRQaG90b1ZpZXdlcigpIHtcbiAgICB0aGlzLnBob3Rvdmlld2VySW5zdGFuY2UgPSBuZXcgUGhvdG9WaWV3ZXIodGhpcy5pbWFnZXMsIHRoaXMub3B0aW9ucyk7XG4gIH1cbn1cbiJdfQ==