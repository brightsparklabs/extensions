import { Directive, Input, booleanAttribute, } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import * as i0 from "@angular/core";
export class MatButtonLoading {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnV0dG9uLWxvYWRpbmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9leHRlbnNpb25zL2J1dHRvbi9idXR0b24tbG9hZGluZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBRUwsU0FBUyxFQUVULEtBQUssRUFLTCxnQkFBZ0IsR0FDakIsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sb0NBQW9DLENBQUM7O0FBWXhFLE1BQU0sT0FBTyxnQkFBZ0I7SUFTM0IsWUFDVSxXQUEwQyxFQUMxQyxpQkFBbUMsRUFDbkMsU0FBb0I7UUFGcEIsZ0JBQVcsR0FBWCxXQUFXLENBQStCO1FBQzFDLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBa0I7UUFDbkMsY0FBUyxHQUFULFNBQVMsQ0FBVztRQVRVLFlBQU8sR0FBRyxLQUFLLENBQUM7UUFFaEIsYUFBUSxHQUFHLEtBQUssQ0FBQztJQVF0RCxDQUFDO0lBRUosV0FBVyxDQUFDLE9BQXNCO1FBQ2hDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDckIsT0FBTztRQUNULENBQUM7UUFDRCxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDakMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1lBQ25FLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDOUUsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ3ZCLENBQUM7YUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUN4QyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLG9CQUFvQixDQUFDLENBQUM7WUFDdEUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQzdFLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUN4QixDQUFDO0lBQ0gsQ0FBQztJQUVPLGFBQWE7UUFDbkIsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNsQixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxlQUFlLENBQUMsa0JBQWtCLENBQUMsQ0FBQztZQUMxRSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztZQUN6QyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQ3BDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxlQUFlLENBQUM7WUFDN0MsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQ3hCLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxFQUM5QixJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUNoRCxDQUFDO1FBQ0osQ0FBQztJQUNILENBQUM7SUFFTyxjQUFjO1FBQ3BCLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ2pCLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDdkIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFDdEIsQ0FBQztJQUNILENBQUM7aUlBaERVLGdCQUFnQjtxSEFBaEIsZ0JBQWdCLHlWQUdQLGdCQUFnQixzQ0FFaEIsZ0JBQWdCOzsyRkFMekIsZ0JBQWdCO2tCQVY1QixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRTs7Ozs7O3FDQU15QjtvQkFDbkMsVUFBVSxFQUFFLElBQUk7aUJBQ2pCO3NJQUl5QyxPQUFPO3NCQUE5QyxLQUFLO3VCQUFDLEVBQUUsU0FBUyxFQUFFLGdCQUFnQixFQUFFO2dCQUVFLFFBQVE7c0JBQS9DLEtBQUs7dUJBQUMsRUFBRSxTQUFTLEVBQUUsZ0JBQWdCLEVBQUU7Z0JBRTdCLEtBQUs7c0JBQWIsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudFJlZixcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBJbnB1dCxcbiAgT25DaGFuZ2VzLFxuICBSZW5kZXJlcjIsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIFZpZXdDb250YWluZXJSZWYsXG4gIGJvb2xlYW5BdHRyaWJ1dGUsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgVGhlbWVQYWxldHRlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQgeyBNYXRQcm9ncmVzc1NwaW5uZXIgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9wcm9ncmVzcy1zcGlubmVyJztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiBgW21hdC1idXR0b25dW2xvYWRpbmddLFxuICAgICAgICAgICAgIFttYXQtcmFpc2VkLWJ1dHRvbl1bbG9hZGluZ10sXG4gICAgICAgICAgICAgW21hdC1zdHJva2VkLWJ1dHRvbl1bbG9hZGluZ10sXG4gICAgICAgICAgICAgW21hdC1mbGF0LWJ1dHRvbl1bbG9hZGluZ10sXG4gICAgICAgICAgICAgW21hdC1pY29uLWJ1dHRvbl1bbG9hZGluZ10sXG4gICAgICAgICAgICAgW21hdC1mYWJdW2xvYWRpbmddLFxuICAgICAgICAgICAgIFttYXQtbWluaS1mYWJdW2xvYWRpbmddYCxcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0QnV0dG9uTG9hZGluZyBpbXBsZW1lbnRzIE9uQ2hhbmdlcyB7XG4gIHByaXZhdGUgc3Bpbm5lciE6IENvbXBvbmVudFJlZjxNYXRQcm9ncmVzc1NwaW5uZXI+IHwgbnVsbDtcblxuICBASW5wdXQoeyB0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGUgfSkgbG9hZGluZyA9IGZhbHNlO1xuXG4gIEBJbnB1dCh7IHRyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZSB9KSBkaXNhYmxlZCA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpIGNvbG9yOiBUaGVtZVBhbGV0dGU7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MQnV0dG9uRWxlbWVudD4sXG4gICAgcHJpdmF0ZSBfdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZixcbiAgICBwcml2YXRlIF9yZW5kZXJlcjogUmVuZGVyZXIyXG4gICkge31cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgaWYgKCFjaGFuZ2VzLmxvYWRpbmcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGNoYW5nZXMubG9hZGluZy5jdXJyZW50VmFsdWUpIHtcbiAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdtYXQtYnV0dG9uLWxvYWRpbmcnKTtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCAnJykpO1xuICAgICAgdGhpcy5jcmVhdGVTcGlubmVyKCk7XG4gICAgfSBlbHNlIGlmICghY2hhbmdlcy5sb2FkaW5nLmZpcnN0Q2hhbmdlKSB7XG4gICAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnbWF0LWJ1dHRvbi1sb2FkaW5nJyk7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoJ2Rpc2FibGVkJykpO1xuICAgICAgdGhpcy5kZXN0cm95U3Bpbm5lcigpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlU3Bpbm5lcigpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuc3Bpbm5lcikge1xuICAgICAgdGhpcy5zcGlubmVyID0gdGhpcy5fdmlld0NvbnRhaW5lclJlZi5jcmVhdGVDb21wb25lbnQoTWF0UHJvZ3Jlc3NTcGlubmVyKTtcbiAgICAgIHRoaXMuc3Bpbm5lci5pbnN0YW5jZS5jb2xvciA9IHRoaXMuY29sb3I7XG4gICAgICB0aGlzLnNwaW5uZXIuaW5zdGFuY2UuZGlhbWV0ZXIgPSAyNDtcbiAgICAgIHRoaXMuc3Bpbm5lci5pbnN0YW5jZS5tb2RlID0gJ2luZGV0ZXJtaW5hdGUnO1xuICAgICAgdGhpcy5fcmVuZGVyZXIuYXBwZW5kQ2hpbGQoXG4gICAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCxcbiAgICAgICAgdGhpcy5zcGlubmVyLmluc3RhbmNlLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnRcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBkZXN0cm95U3Bpbm5lcigpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5zcGlubmVyKSB7XG4gICAgICB0aGlzLnNwaW5uZXIuZGVzdHJveSgpO1xuICAgICAgdGhpcy5zcGlubmVyID0gbnVsbDtcbiAgICB9XG4gIH1cbn1cbiJdfQ==