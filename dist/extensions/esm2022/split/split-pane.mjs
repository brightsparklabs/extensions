import { Directive, Input, booleanAttribute, } from '@angular/core';
import { getInputPositiveNumber } from './utils';
import * as i0 from "@angular/core";
import * as i1 from "./split";
export class MtxSplitPane {
    /**
     * Order of the area. Used to maintain the order of areas when toggling their visibility.
     * Toggling area visibility without specifying an `order` leads to weird behavior.
     */
    get order() {
        return this._order;
    }
    set order(v) {
        this._order = getInputPositiveNumber(v, null);
        this.split.updateArea(this, true, false);
    }
    /**
     * Size of the area in selected unit (percent/pixel).
     * - Percent: All areas sizes should equal to `100`, If not, all areas will have the same size.
     * - Pixel: An area with wildcard size (`size="*"`) is mandatory (only one) and
     *   can't have `visible="false"` or `minSize`/`maxSize`/`lockSize` properties.
     */
    get size() {
        return this._size;
    }
    set size(v) {
        this._size = getInputPositiveNumber(v, null);
        this.split.updateArea(this, false, true);
    }
    /** Minimum pixel or percent size, should be equal to or smaller than provided `size`. */
    get minSize() {
        return this._minSize;
    }
    set minSize(v) {
        this._minSize = getInputPositiveNumber(v, null);
        this.split.updateArea(this, false, true);
    }
    /** Maximum pixel or percent size, should be equal to or larger than provided `size`. */
    get maxSize() {
        return this._maxSize;
    }
    set maxSize(v) {
        this._maxSize = getInputPositiveNumber(v, null);
        this.split.updateArea(this, false, true);
    }
    /** Lock area size, same as `minSize`=`maxSize`=`size`. */
    get lockSize() {
        return this._lockSize;
    }
    set lockSize(v) {
        this.split.updateArea(this, false, true);
    }
    /** Hide area visually but still present in the DOM, use `ngIf` to completely remove it. */
    get visible() {
        return this._visible;
    }
    set visible(v) {
        if (this._visible) {
            this.split.showArea(this);
            this.renderer.removeClass(this.elRef.nativeElement, 'mtx-split-pane-hidden');
        }
        else {
            this.split.hideArea(this);
            this.renderer.addClass(this.elRef.nativeElement, 'mtx-split-pane-hidden');
        }
    }
    constructor(ngZone, elRef, renderer, split) {
        this.ngZone = ngZone;
        this.elRef = elRef;
        this.renderer = renderer;
        this.split = split;
        this._order = null;
        this._size = null;
        this._minSize = null;
        this._maxSize = null;
        this._lockSize = false;
        this._visible = true;
        this.lockListeners = [];
        this.renderer.addClass(this.elRef.nativeElement, 'mtx-split-pane');
    }
    ngOnInit() {
        this.split.addArea(this);
        this.ngZone.runOutsideAngular(() => {
            this.transitionListener = this.renderer.listen(this.elRef.nativeElement, 'transitionend', (event) => {
                // Limit only flex-basis transition to trigger the event
                if (event.propertyName === 'flex-basis') {
                    this.split.notify('transitionEnd', -1);
                }
            });
        });
    }
    setStyleOrder(value) {
        this.renderer.setStyle(this.elRef.nativeElement, 'order', value);
    }
    setStyleFlex(grow, shrink, basis, isMin, isMax) {
        // Need 3 separated properties to work on IE11 (https://github.com/angular/flex-layout/issues/323)
        this.renderer.setStyle(this.elRef.nativeElement, 'flex-grow', grow);
        this.renderer.setStyle(this.elRef.nativeElement, 'flex-shrink', shrink);
        this.renderer.setStyle(this.elRef.nativeElement, 'flex-basis', basis);
        if (isMin === true) {
            this.renderer.addClass(this.elRef.nativeElement, 'mtx-min');
        }
        else {
            this.renderer.removeClass(this.elRef.nativeElement, 'mtx-min');
        }
        if (isMax === true) {
            this.renderer.addClass(this.elRef.nativeElement, 'mtx-max');
        }
        else {
            this.renderer.removeClass(this.elRef.nativeElement, 'mtx-max');
        }
    }
    lockEvents() {
        this.ngZone.runOutsideAngular(() => {
            this.lockListeners.push(this.renderer.listen(this.elRef.nativeElement, 'selectstart', (e) => false));
            this.lockListeners.push(this.renderer.listen(this.elRef.nativeElement, 'dragstart', (e) => false));
        });
    }
    unlockEvents() {
        while (this.lockListeners.length > 0) {
            const fct = this.lockListeners.pop();
            if (fct) {
                fct();
            }
        }
    }
    ngOnDestroy() {
        this.unlockEvents();
        if (this.transitionListener) {
            this.transitionListener();
        }
        this.split.removeArea(this);
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxSplitPane, deps: [{ token: i0.NgZone }, { token: i0.ElementRef }, { token: i0.Renderer2 }, { token: i1.MtxSplit }], target: i0.ɵɵFactoryTarget.Directive }); }
    /** @nocollapse */ static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "16.1.0", version: "18.0.1", type: MtxSplitPane, isStandalone: true, selector: "mtx-split-pane, [mtx-split-pane]", inputs: { order: "order", size: "size", minSize: "minSize", maxSize: "maxSize", lockSize: ["lockSize", "lockSize", booleanAttribute], visible: ["visible", "visible", booleanAttribute] }, exportAs: ["mtxSplitPane"], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxSplitPane, decorators: [{
            type: Directive,
            args: [{
                    selector: 'mtx-split-pane, [mtx-split-pane]',
                    exportAs: 'mtxSplitPane',
                    standalone: true,
                }]
        }], ctorParameters: () => [{ type: i0.NgZone }, { type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i1.MtxSplit }], propDecorators: { order: [{
                type: Input
            }], size: [{
                type: Input
            }], minSize: [{
                type: Input
            }], maxSize: [{
                type: Input
            }], lockSize: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], visible: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BsaXQtcGFuZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2V4dGVuc2lvbnMvc3BsaXQvc3BsaXQtcGFuZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUVULEtBQUssRUFLTCxnQkFBZ0IsR0FDakIsTUFBTSxlQUFlLENBQUM7QUFHdkIsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sU0FBUyxDQUFDOzs7QUFPakQsTUFBTSxPQUFPLFlBQVk7SUFDdkI7OztPQUdHO0lBQ0gsSUFDSSxLQUFLO1FBQ1AsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3JCLENBQUM7SUFDRCxJQUFJLEtBQUssQ0FBQyxDQUFnQjtRQUN4QixJQUFJLENBQUMsTUFBTSxHQUFHLHNCQUFzQixDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUU5QyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFHRDs7Ozs7T0FLRztJQUNILElBQ0ksSUFBSTtRQUNOLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztJQUNwQixDQUFDO0lBQ0QsSUFBSSxJQUFJLENBQUMsQ0FBZ0I7UUFDdkIsSUFBSSxDQUFDLEtBQUssR0FBRyxzQkFBc0IsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFN0MsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBR0QseUZBQXlGO0lBQ3pGLElBQ0ksT0FBTztRQUNULE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUN2QixDQUFDO0lBQ0QsSUFBSSxPQUFPLENBQUMsQ0FBZ0I7UUFDMUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxzQkFBc0IsQ0FBQyxDQUFDLEVBQUUsSUFBSSxD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USxFQUFFLGtDQUFrQztvQkFDNUMsUUFBUSxFQUFFLGNBQWM7b0JBQ3hCLFVBQVUsRUFBRSxJQUFJO2lCQUNqQjttSkFPSyxLQUFLO3NCQURSLEtBQUs7Z0JBa0JGLElBQUk7c0JBRFAsS0FBSztnQkFhRixPQUFPO3NCQURWLEtBQUs7Z0JBYUYsT0FBTztzQkFEVixLQUFLO2dCQWFGLFFBQVE7c0JBRFgsS0FBSzt1QkFBQyxFQUFFLFNBQVMsRUFBRSxnQkFBZ0IsRUFBRTtnQkFXbEMsT0FBTztzQkFEVixLQUFLO3VCQUFDLEVBQUUsU0FBUyxFQUFFLGdCQUFnQixFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgUmVuZGVyZXIyLFxuICBib29sZWFuQXR0cmlidXRlLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgTXR4U3BsaXQgfSBmcm9tICcuL3NwbGl0JztcbmltcG9ydCB7IGdldElucHV0UG9zaXRpdmVOdW1iZXIgfSBmcm9tICcuL3V0aWxzJztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbXR4LXNwbGl0LXBhbmUsIFttdHgtc3BsaXQtcGFuZV0nLFxuICBleHBvcnRBczogJ210eFNwbGl0UGFuZScsXG4gIHN0YW5kYWxvbmU6IHRydWUsXG59KVxuZXhwb3J0IGNsYXNzIE10eFNwbGl0UGFuZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgLyoqXG4gICAqIE9yZGVyIG9mIHRoZSBhcmVhLiBVc2VkIHRvIG1haW50YWluIHRoZSBvcmRlciBvZiBhcmVhcyB3aGVuIHRvZ2dsaW5nIHRoZWlyIHZpc2liaWxpdHkuXG4gICAqIFRvZ2dsaW5nIGFyZWEgdmlzaWJpbGl0eSB3aXRob3V0IHNwZWNpZnlpbmcgYW4gYG9yZGVyYCBsZWFkcyB0byB3ZWlyZCBiZWhhdmlvci5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCBvcmRlcigpIHtcbiAgICByZXR1cm4gdGhpcy5fb3JkZXI7XG4gIH1cbiAgc2V0IG9yZGVyKHY6IG51bWJlciB8IG51bGwpIHtcbiAgICB0aGlzLl9vcmRlciA9IGdldElucHV0UG9zaXRpdmVOdW1iZXIodiwgbnVsbCk7XG5cbiAgICB0aGlzLnNwbGl0LnVwZGF0ZUFyZWEodGhpcywgdHJ1ZSwgZmFsc2UpO1xuICB9XG4gIHByaXZhdGUgX29yZGVyOiBudW1iZXIgfCBudWxsID0gbnVsbDtcblxuICAvKipcbiAgICogU2l6ZSBvZiB0aGUgYXJlYSBpbiBzZWxlY3RlZCB1bml0IChwZXJjZW50L3BpeGVsKS5cbiAgICogLSBQZXJjZW50OiBBbGwgYXJlYXMgc2l6ZXMgc2hvdWxkIGVxdWFsIHRvIGAxMDBgLCBJZiBub3QsIGFsbCBhcmVhcyB3aWxsIGhhdmUgdGhlIHNhbWUgc2l6ZS5cbiAgICogLSBQaXhlbDogQW4gYXJlYSB3aXRoIHdpbGRjYXJkIHNpemUgKGBzaXplPVwiKlwiYCkgaXMgbWFuZGF0b3J5IChvbmx5IG9uZSkgYW5kXG4gICAqICAgY2FuJ3QgaGF2ZSBgdmlzaWJsZT1cImZhbHNlXCJgIG9yIGBtaW5TaXplYC9gbWF4U2l6ZWAvYGxvY2tTaXplYCBwcm9wZXJ0aWVzLlxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IHNpemUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NpemU7XG4gIH1cbiAgc2V0IHNpemUodjogbnVtYmVyIHwgbnVsbCkge1xuICAgIHRoaXMuX3NpemUgPSBnZXRJbnB1dFBvc2l0aXZlTnVtYmVyKHYsIG51bGwpO1xuXG4gICAgdGhpcy5zcGxpdC51cGRhdGVBcmVhKHRoaXMsIGZhbHNlLCB0cnVlKTtcbiAgfVxuICBwcml2YXRlIF9zaXplOiBudW1iZXIgfCBudWxsID0gbnVsbDtcblxuICAvKiogTWluaW11bSBwaXhlbCBvciBwZXJjZW50IHNpemUsIHNob3VsZCBiZSBlcXVhbCB0byBvciBzbWFsbGVyIHRoYW4gcHJvdmlkZWQgYHNpemVgLiAqL1xuICBASW5wdXQoKVxuICBnZXQgbWluU2l6ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fbWluU2l6ZTtcbiAgfVxuICBzZXQgbWluU2l6ZSh2OiBudW1iZXIgfCBudWxsKSB7XG4gICAgdGhpcy5fbWluU2l6ZSA9IGdldElucHV0UG9zaXRpdmVOdW1iZXIodiwgbnVsbCk7XG5cbiAgICB0aGlzLnNwbGl0LnVwZGF0ZUFyZWEodGhpcywgZmFsc2UsIHRydWUpO1xuICB9XG4gIHByaXZhdGUgX21pblNpemU6IG51bWJlciB8IG51bGwgPSBudWxsO1xuXG4gIC8qKiBNYXhpbXVtIHBpeGVsIG9yIHBlcmNlbnQgc2l6ZSwgc2hvdWxkIGJlIGVxdWFsIHRvIG9yIGxhcmdlciB0aGFuIHByb3ZpZGVkIGBzaXplYC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IG1heFNpemUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX21heFNpemU7XG4gIH1cbiAgc2V0IG1heFNpemUodjogbnVtYmVyIHwgbnVsbCkge1xuICAgIHRoaXMuX21heFNpemUgPSBnZXRJbnB1dFBvc2l0aXZlTnVtYmVyKHYsIG51bGwpO1xuXG4gICAgdGhpcy5zcGxpdC51cGRhdGVBcmVhKHRoaXMsIGZhbHNlLCB0cnVlKTtcbiAgfVxuICBwcml2YXRlIF9tYXhTaXplOiBudW1iZXIgfCBudWxsID0gbnVsbDtcblxuICAvKiogTG9jayBhcmVhIHNpemUsIHNhbWUgYXMgYG1pblNpemVgPWBtYXhTaXplYD1gc2l6ZWAuICovXG4gIEBJbnB1dCh7IHRyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZSB9KVxuICBnZXQgbG9ja1NpemUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2xvY2tTaXplO1xuICB9XG4gIHNldCBsb2NrU2l6ZSh2OiBib29sZWFuKSB7XG4gICAgdGhpcy5zcGxpdC51cGRhdGVBcmVhKHRoaXMsIGZhbHNlLCB0cnVlKTtcbiAgfVxuICBwcml2YXRlIF9sb2NrU2l6ZSA9IGZhbHNlO1xuXG4gIC8qKiBIaWRlIGFyZWEgdmlzdWFsbHkgYnV0IHN0aWxsIHByZXNlbnQgaW4gdGhlIERPTSwgdXNlIGBuZ0lmYCB0byBjb21wbGV0ZWx5IHJlbW92ZSBpdC4gKi9cbiAgQElucHV0KHsgdHJhbnNmb3JtOiBib29sZWFuQXR0cmlidXRlIH0pXG4gIGdldCB2aXNpYmxlKCkge1xuICAgIHJldHVybiB0aGlzLl92aXNpYmxlO1xuICB9XG4gIHNldCB2aXNpYmxlKHY6IGJvb2xlYW4pIHtcbiAgICBpZiAodGhpcy5fdmlzaWJsZSkge1xuICAgICAgdGhpcy5zcGxpdC5zaG93QXJlYSh0aGlzKTtcbiAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2xhc3ModGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50LCAnbXR4LXNwbGl0LXBhbmUtaGlkZGVuJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc3BsaXQuaGlkZUFyZWEodGhpcyk7XG4gICAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKHRoaXMuZWxSZWYubmF0aXZlRWxlbWVudCwgJ210eC1zcGxpdC1wYW5lLWhpZGRlbicpO1xuICAgIH1cbiAgfVxuICBwcml2YXRlIF92aXNpYmxlID0gdHJ1ZTtcblxuICBwcml2YXRlIHRyYW5zaXRpb25MaXN0ZW5lciE6ICgpID0+IHZvaWQ7XG4gIHByaXZhdGUgcmVhZG9ubHkgbG9ja0xpc3RlbmVyczogQXJyYXk8KCkgPT4gdm9pZD4gPSBbXTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIG5nWm9uZTogTmdab25lLFxuICAgIHB1YmxpYyBlbFJlZjogRWxlbWVudFJlZixcbiAgICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgcHJpdmF0ZSBzcGxpdDogTXR4U3BsaXRcbiAgKSB7XG4gICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyh0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQsICdtdHgtc3BsaXQtcGFuZScpO1xuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5zcGxpdC5hZGRBcmVhKHRoaXMpO1xuXG4gICAgdGhpcy5uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgdGhpcy50cmFuc2l0aW9uTGlzdGVuZXIgPSB0aGlzLnJlbmRlcmVyLmxpc3RlbihcbiAgICAgICAgdGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50LFxuICAgICAgICAndHJhbnNpdGlvbmVuZCcsXG4gICAgICAgIChldmVudDogVHJhbnNpdGlvbkV2ZW50KSA9PiB7XG4gICAgICAgICAgLy8gTGltaXQgb25seSBmbGV4LWJhc2lzIHRyYW5zaXRpb24gdG8gdHJpZ2dlciB0aGUgZXZlbnRcbiAgICAgICAgICBpZiAoZXZlbnQucHJvcGVydHlOYW1lID09PSAnZmxleC1iYXNpcycpIHtcbiAgICAgICAgICAgIHRoaXMuc3BsaXQubm90aWZ5KCd0cmFuc2l0aW9uRW5kJywgLTEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgKTtcbiAgICB9KTtcbiAgfVxuXG4gIHNldFN0eWxlT3JkZXIodmFsdWU6IG51bWJlcik6IHZvaWQge1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50LCAnb3JkZXInLCB2YWx1ZSk7XG4gIH1cblxuICBzZXRTdHlsZUZsZXgoZ3JvdzogbnVtYmVyLCBzaHJpbms6IG51bWJlciwgYmFzaXM6IHN0cmluZywgaXNNaW46IGJvb2xlYW4sIGlzTWF4OiBib29sZWFuKTogdm9pZCB7XG4gICAgLy8gTmVlZCAzIHNlcGFyYXRlZCBwcm9wZXJ0aWVzIHRvIHdvcmsgb24gSUUxMSAoaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvZmxleC1sYXlvdXQvaXNzdWVzLzMyMylcbiAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZWxSZWYubmF0aXZlRWxlbWVudCwgJ2ZsZXgtZ3JvdycsIGdyb3cpO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50LCAnZmxleC1zaHJpbmsnLCBzaHJpbmspO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50LCAnZmxleC1iYXNpcycsIGJhc2lzKTtcblxuICAgIGlmIChpc01pbiA9PT0gdHJ1ZSkge1xuICAgICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyh0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQsICdtdHgtbWluJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2xhc3ModGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50LCAnbXR4LW1pbicpO1xuICAgIH1cblxuICAgIGlmIChpc01heCA9PT0gdHJ1ZSkge1xuICAgICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyh0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQsICdtdHgtbWF4Jyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2xhc3ModGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50LCAnbXR4LW1heCcpO1xuICAgIH1cbiAgfVxuXG4gIGxvY2tFdmVudHMoKTogdm9pZCB7XG4gICAgdGhpcy5uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgdGhpcy5sb2NrTGlzdGVuZXJzLnB1c2goXG4gICAgICAgIHRoaXMucmVuZGVyZXIubGlzdGVuKHRoaXMuZWxSZWYubmF0aXZlRWxlbWVudCwgJ3NlbGVjdHN0YXJ0JywgKGU6IEV2ZW50KSA9PiBmYWxzZSlcbiAgICAgICk7XG4gICAgICB0aGlzLmxvY2tMaXN0ZW5lcnMucHVzaChcbiAgICAgICAgdGhpcy5yZW5kZXJlci5saXN0ZW4odGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50LCAnZHJhZ3N0YXJ0JywgKGU6IEV2ZW50KSA9PiBmYWxzZSlcbiAgICAgICk7XG4gICAgfSk7XG4gIH1cblxuICB1bmxvY2tFdmVudHMoKTogdm9pZCB7XG4gICAgd2hpbGUgKHRoaXMubG9ja0xpc3RlbmVycy5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCBmY3QgPSB0aGlzLmxvY2tMaXN0ZW5lcnMucG9wKCk7XG4gICAgICBpZiAoZmN0KSB7XG4gICAgICAgIGZjdCgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMudW5sb2NrRXZlbnRzKCk7XG5cbiAgICBpZiAodGhpcy50cmFuc2l0aW9uTGlzdGVuZXIpIHtcbiAgICAgIHRoaXMudHJhbnNpdGlvbkxpc3RlbmVyKCk7XG4gICAgfVxuXG4gICAgdGhpcy5zcGxpdC5yZW1vdmVBcmVhKHRoaXMpO1xuICB9XG59XG4iXX0=