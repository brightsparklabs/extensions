import { Directionality } from '@angular/cdk/bidi';
import { OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import { Injectable, Injector, Optional, SkipSelf, TemplateRef, InjectionToken, Inject, InjectFlags, } from '@angular/core';
import { of as observableOf } from 'rxjs';
import { MtxDrawerConfig } from './drawer-config';
import { MtxDrawerContainer } from './drawer-container';
import { MtxDrawerRef } from './drawer-ref';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/overlay";
import * as i2 from "./drawer-config";
/** Injection token that can be used to access the data that was passed in to a drawer. */
export const MTX_DRAWER_DATA = new InjectionToken('MtxDrawerData');
/** Injection token that can be used to specify default drawer options. */
export const MTX_DRAWER_DEFAULT_OPTIONS = new InjectionToken('mtx-drawer-default-options');
/**
 * Service to trigger Material Design bottom sheets.
 */
export class MtxDrawer {
    /** Reference to the currently opened drawer. */
    get _openedDrawerRef() {
        const parent = this._parentDrawer;
        return parent ? parent._openedDrawerRef : this._drawerRefAtThisLevel;
    }
    set _openedDrawerRef(value) {
        if (this._parentDrawer) {
            this._parentDrawer._openedDrawerRef = value;
        }
        else {
            this._drawerRefAtThisLevel = value;
        }
    }
    constructor(_overlay, _injector, _parentDrawer, _defaultOptions) {
        this._overlay = _overlay;
        this._injector = _injector;
        this._parentDrawer = _parentDrawer;
        this._defaultOptions = _defaultOptions;
        this._drawerRefAtThisLevel = null;
    }
    open(componentOrTemplateRef, config) {
        const _config = _applyConfigDefaults(this._defaultOptions || new MtxDrawerConfig(), config);
        const overlayRef = this._createOverlay(_config);
        const container = this._attachContainer(overlayRef, _config);
        const ref = new MtxDrawerRef(container, overlayRef);
        if (componentOrTemplateRef instanceof TemplateRef) {
            container.attachTemplatePortal(new TemplatePortal(componentOrTemplateRef, null, {
                $implicit: _config.data,
                drawerRef: ref,
            }));
        }
        else {
            const portal = new ComponentPortal(componentOrTemplateRef, undefined, this._createInjector(_config, ref));
            const contentRef = container.attachComponentPortal(portal);
            ref.instance = contentRef.instance;
        }
        // When the drawer is dismissed, clear the reference to it.
        ref.afterDismissed().subscribe(() => {
            // Clear the drawer ref if it hasn't already been replaced by a newer one.
            if (this._openedDrawerRef == ref) {
                this._openedDrawerRef = null;
            }
        });
        if (this._openedDrawerRef) {
            // If a drawer is already in view, dismiss it and enter the
            // new drawer after exit animation is complete.
            this._openedDrawerRef.afterDismissed().subscribe(() => ref.containerInstance.enter());
            this._openedDrawerRef.dismiss();
        }
        else {
            // If no drawer is in view, enter the new drawer.
            ref.containerInstance.enter();
        }
        this._openedDrawerRef = ref;
        return ref;
    }
    /**
     * Dismisses the currently-visible drawer.
     * @param result Data to pass to the drawer instance.
     */
    dismiss(result) {
        if (this._openedDrawerRef) {
            this._openedDrawerRef.dismiss(result);
        }
    }
    ngOnDestroy() {
        if (this._drawerRefAtThisLevel) {
            this._drawerRefAtThisLevel.dismiss();
        }
    }
    /**
     * Attaches the drawer container component to the overlay.
     */
    _attachContainer(overlayRef, config) {
        const userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;
        const injector = Injector.create({
            parent: userInjector || this._injector,
            providers: [{ provide: MtxDrawerConfig, useValue: config }],
        });
        const containerPortal = new ComponentPortal(MtxDrawerContainer, config.viewContainerRef, injector);
        const containerRef = overlayRef.attach(containerPortal);
        return containerRef.instance;
    }
    /**
     * Creates a new overlay and places it in the correct location.
     * @param config The user-specified drawer config.
     */
    _createOverlay(config) {
        const overlayConfig = new OverlayConfig({
            direction: config.direction,
            hasBackdrop: config.hasBackdrop,
            disposeOnNavigation: config.closeOnNavigation,
            maxWidth: '100%',
            scrollStrategy: config.scrollStrategy || this._overlay.scrollStrategies.block(),
            positionStrategy: this._overlay.position().global()[config.position]('0'),
        });
        if (config.backdropClass) {
            overlayConfig.backdropClass = config.backdropClass;
        }
        return this._overlay.create(overlayConfig);
    }
    /**
     * Creates an injector to be used inside of a drawer component.
     * @param config Config that was used to create the drawer.
     * @param drawerRef Reference to the drawer.
     */
    _createInjector(config, drawerRef) {
        const userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;
        const providers = [
            { provide: MtxDrawerRef, useValue: drawerRef },
            { provide: MTX_DRAWER_DATA, useValue: config.data },
        ];
        if (config.direction &&
            (!userInjector ||
                !userInjector.get(Directionality, null, InjectFlags.Optional))) {
            providers.push({
                provide: Directionality,
                useValue: { value: config.direction, change: observableOf() },
            });
        }
        return Injector.create({ parent: userInjector || this._injector, providers });
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxDrawer, deps: [{ token: i1.Overlay }, { token: i0.Injector }, { token: MtxDrawer, optional: true, skipSelf: true }, { token: MTX_DRAWER_DEFAULT_OPTIONS, optional: true }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxDrawer, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxDrawer, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: i1.Overlay }, { type: i0.Injector }, { type: MtxDrawer, decorators: [{
                    type: Optional
                }, {
                    type: SkipSelf
                }] }, { type: i2.MtxDrawerConfig, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MTX_DRAWER_DEFAULT_OPTIONS]
                }] }] });
/**
 * Applies default options to the drawer config.
 * @param defaults Object containing the default values to which to fall back.
 * @param config The configuration to which the defaults will be applied.
 * @returns The new configuration object with defaults applied.
 */
function _applyConfigDefaults(defaults, config) {
    return { ...defaults, ...config };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhd2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvZXh0ZW5zaW9ucy9kcmF3ZXIvZHJhd2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUNuRCxPQUFPLEVBQVcsYUFBYSxFQUFjLE1BQU0sc0JBQXNCLENBQUM7QUFDMUUsT0FBTyxFQUFFLGVBQWUsRUFBaUIsY0FBYyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDckYsT0FBTyxFQUVMLFVBQVUsRUFDVixRQUFRLEVBQ1IsUUFBUSxFQUNSLFFBQVEsRUFDUixXQUFXLEVBQ1gsY0FBYyxFQUNkLE1BQU0sRUFHTixXQUFXLEdBQ1osTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLEVBQUUsSUFBSSxZQUFZLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDMUMsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ2xELE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ3hELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxjQUFjLENBQUM7Ozs7QUFFNUMsMEZBQTBGO0FBQzFGLE1BQU0sQ0FBQyxNQUFNLGVBQWUsR0FBRyxJQUFJLGNBQWMsQ0FBTSxlQUFlLENBQUMsQ0FBQztBQUV4RSwwRUFBMEU7QUFDMUUsTUFBTSxDQUFDLE1BQU0sMEJBQTBCLEdBQUcsSUFBSSxjQUFjLENBQzFELDRCQUE0QixDQUM3QixDQUFDO0FBRUY7O0dBRUc7QUFFSCxNQUFNLE9BQU8sU0FBUztJQUdwQixnREFBZ0Q7SUFDaEQsSUFBSSxnQkFBZ0I7UUFDbEIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQztRQUNsQyxPQUFPLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUM7SUFDdkUsQ0FBQztJQUVELElBQUksZ0JBQWdCLENBQUMsS0FBK0I7UUFDbEQsSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDdkIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsR0FBRyxLQUFLLENBQUM7UUFDOUMsQ0FBQzthQUFNLENBQUM7WUFDTixJQUFJLENBQUMscUJBQXFCLEdBQUcsS0FBSyxDQUFDO1FBQ3JDLENBQUM7SUFDSCxDQUFDO0lBRUQsWUFDVSxRQUFpQixFQUNqQixTQUFtQixFQUNLLGFBQXdCLEVBR2hELGVBQWlDO1FBTGpDLGFBQVEsR0FBUixRQUFRLENBQVM7UUFDakIsY0FBUyxHQUFULFNBQVMsQ0FBVTtRQUNLLGtCQUFhLEdBQWIsYUFBYSxDQUFXO1FBR2hELG9CQUFlLEdBQWYsZUFBZSxDQUFrQjtRQXRCbkMsMEJBQXFCLEdBQTZCLElBQUksQ0FBQztJQXVCNUQsQ0FBQztJQXdCSixJQUFJLENBQ0Ysc0JBQXlELEVBQ3pELE1BQTJCO1FBRTNCLE1BQU0sT0FBTyxHQUFHLG9CQUFvQixDQUFDLElBQUksQ0FBQyxlQUFlLElBQUksSUFBSSxlQUFlLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUM1RixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2hELE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDN0QsTUFBTSxHQUFHLEdBQUcsSUFBSSxZQUFZLENBQU8sU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBRTFELElBQUksc0JBQXNCLFlBQVksV0FBVyxFQUFFLENBQUM7WUFDbEQsU0FBUyxDQUFDLG9CQUFvQixDQUM1QixJQUFJLGNBQWMsQ0FBSSxzQkFBc0IsRUFBRSxJQUFLLEVBQUU7Z0JBQ25ELFNBQVMsRUFBRSxPQUFPLENBQUMsSUFBSTtnQkFDdkIsU0FBUyxFQUFFLEdBQUc7YUFDUixDQUFDLENBQ1YsQ0FBQztRQUNKLENBQUM7YUFBTSxDQUFDO1lBQ04sTUFBTSxNQUFNLEdBQUcsSUFBSSxlQUFlLENBQ2hDLHNCQUFzQixFQUN0QixTQUFTLEVBQ1QsSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQ25DLENBQUM7WUFDRixNQUFNLFVBQVUsR0FBRyxTQUFTLENBQUMscUJBQXFCLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDM0QsR0FBRyxDQUFDLFFBQVEsR0FBRyxVQUFVLENBQUMsUUFBUSxDQUFDO1FBQ3JDLENBQUM7UUFFRCwyREFBMkQ7UUFDM0QsR0FBRyxDQUFDLGNBQWMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUU7WUFDbEMsMEVBQTBFO1lBQzFFLElBQUksSUFBSSxDQUFDLGdCQUFnQixJQUFJLEdBQUcsRUFBRSxDQUFDO2dCQUNqQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO1lBQy9CLENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7WUFDMUIsMkRBQTJEO1lBQzNELCtDQUErQztZQUMvQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsY0FBYyxFQUFFLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQ3RGLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNsQyxDQUFDO2FBQU0sQ0FBQztZQUNOLGlEQUFpRDtZQUNqRCxHQUFHLENBQUMsaUJBQWlCLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDaEMsQ0FBQztRQUVELElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxHQUFHLENBQUM7UUFFNUIsT0FBTyxHQUFHLENBQUM7SUFDYixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsT0FBTyxDQUFVLE1BQVU7UUFDekIsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztZQUMxQixJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3hDLENBQUM7SUFDSCxDQUFDO0lBRUQsV0FBVztRQUNULElBQUksSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7WUFDL0IsSUFBSSxDQUFDLHFCQUFxQixDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3ZDLENBQUM7SUFDSCxDQUFDO0lBRUQ7O09BRUc7SUFDSyxnQkFBZ0IsQ0FBQyxVQUFzQixFQUFFLE1BQXVCO1FBQ3RFLE1BQU0sWUFBWSxHQUFHLE1BQU0sSUFBSSxNQUFNLENBQUMsZ0JBQWdCLElBQUksTUFBTSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQztRQUMzRixNQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDO1lBQy9CLE1BQU0sRUFBRSxZQUFZLElBQUksSUFBSSxDQUFDLFNBQVM7WUFDdEMsU0FBUyxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsZUFBZSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsQ0FBQztTQUM1RCxDQUFDLENBQUM7UUFFSCxNQUFNLGVBQWUsR0FBRyxJQUFJLGVBQWUsQ0FDekMsa0JBQWtCLEVBQ2xCLE1BQU0sQ0FBQyxnQkFBZ0IsRUFDdkIsUUFBUSxDQUNULENBQUM7UUFDRixNQUFNLFlBQVksR0FBcUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUMxRixPQUFPLFlBQVksQ0FBQyxRQUFRLENBQUM7SUFDL0IsQ0FBQztJQUVEOzs7T0FHRztJQUNLLGNBQWMsQ0FBQyxNQUF1QjtRQUM1QyxNQUFNLGFBQWEsR0FBRyxJQUFJLGFBQWEsQ0FBQztZQUN0QyxTQUFTLEVBQUUsTUFBTSxDQUFDLFNBQVM7WUFDM0IsV0FBVyxFQUFFLE1BQU0sQ0FBQyxXQUFXO1lBQy9CLG1CQUFtQixFQUFFLE1BQU0sQ0FBQyxpQkFBaUI7WUFDN0MsUUFBUSxFQUFFLE1BQU07WUFDaEIsY0FBYyxFQUFFLE1BQU0sQ0FBQyxjQUFjLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUU7WUFDL0UsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxNQUFNLENBQUMsUUFBUyxDQUFDLENBQUMsR0FBRyxDQUFDO1NBQzNFLENBQUMsQ0FBQztRQUVILElBQUksTUFBTSxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQ3pCLGFBQWEsQ0FBQyxhQUFhLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQztRQUNyRCxDQUFDO1FBRUQsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNLLGVBQWUsQ0FBSSxNQUF1QixFQUFFLFNBQTBCO1FBQzVFLE1BQU0sWUFBWSxHQUFHLE1BQU0sSUFBSSxNQUFNLENBQUMsZ0JBQWdCLElBQUksTUFBTSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQztRQUMzRixNQUFNLFNBQVMsR0FBcUI7WUFDbEMsRUFBRSxPQUFPLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUU7WUFDOUMsRUFBRSxPQUFPLEVBQUUsZUFBZSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsSUFBSSxFQUFFO1NBQ3BELENBQUM7UUFFRixJQUNFLE1BQU0sQ0FBQyxTQUFTO1lBQ2hCLENBQUMsQ0FBQyxZQUFZO2dCQUNaLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBd0IsY0FBYyxFQUFFLElBQUksRUFBRSxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUMsRUFDdkYsQ0FBQztZQUNELFNBQVMsQ0FBQyxJQUFJLENBQUM7Z0JBQ2IsT0FBTyxFQUFFLGNBQWM7Z0JBQ3ZCLFFBQVEsRUFBRSxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsU0FBUyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsRUFBRTthQUM5RCxDQUFDLENBQUM7UUFDTCxDQUFDO1FBRUQsT0FBTyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUUsTUFBTSxFQUFFLFlBQVksSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUM7SUFDaEYsQ0FBQztpSUFqTFUsU0FBUyx1SEFzQlYsMEJBQTBCO3FJQXRCekIsU0FBUyxjQURJLE1BQU07OzJGQUNuQixTQUFTO2tCQURyQixVQUFVO21CQUFDLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRTs7MEJBcUI3QixRQUFROzswQkFBSSxRQUFROzswQkFDcEIsUUFBUTs7MEJBQ1IsTUFBTTsyQkFBQywwQkFBMEI7O0FBOEp0Qzs7Ozs7R0FLRztBQUNILFNBQVMsb0JBQW9CLENBQzNCLFFBQXlCLEVBQ3pCLE1BQXdCO0lBRXhCLE9BQU8sRUFBRSxHQUFHLFFBQVEsRUFBRSxHQUFHLE1BQU0sRUFBRSxDQUFDO0FBQ3BDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3Rpb25hbGl0eSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7IE92ZXJsYXksIE92ZXJsYXlDb25maWcsIE92ZXJsYXlSZWYgfSBmcm9tICdAYW5ndWxhci9jZGsvb3ZlcmxheSc7XG5pbXBvcnQgeyBDb21wb25lbnRQb3J0YWwsIENvbXBvbmVudFR5cGUsIFRlbXBsYXRlUG9ydGFsIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5pbXBvcnQge1xuICBDb21wb25lbnRSZWYsXG4gIEluamVjdGFibGUsXG4gIEluamVjdG9yLFxuICBPcHRpb25hbCxcbiAgU2tpcFNlbGYsXG4gIFRlbXBsYXRlUmVmLFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5qZWN0LFxuICBPbkRlc3Ryb3ksXG4gIFN0YXRpY1Byb3ZpZGVyLFxuICBJbmplY3RGbGFncyxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBvZiBhcyBvYnNlcnZhYmxlT2YgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IE10eERyYXdlckNvbmZpZyB9IGZyb20gJy4vZHJhd2VyLWNvbmZpZyc7XG5pbXBvcnQgeyBNdHhEcmF3ZXJDb250YWluZXIgfSBmcm9tICcuL2RyYXdlci1jb250YWluZXInO1xuaW1wb3J0IHsgTXR4RHJhd2VyUmVmIH0gZnJvbSAnLi9kcmF3ZXItcmVmJztcblxuLyoqIEluamVjdGlvbiB0b2tlbiB0aGF0IGNhbiBiZSB1c2VkIHRvIGFjY2VzcyB0aGUgZGF0YSB0aGF0IHdhcyBwYXNzZWQgaW4gdG8gYSBkcmF3ZXIuICovXG5leHBvcnQgY29uc3QgTVRYX0RSQVdFUl9EQVRBID0gbmV3IEluamVjdGlvblRva2VuPGFueT4oJ010eERyYXdlckRhdGEnKTtcblxuLyoqIEluamVjdGlvbiB0b2tlbiB0aGF0IGNhbiBiZSB1c2VkIHRvIHNwZWNpZnkgZGVmYXVsdCBkcmF3ZXIgb3B0aW9ucy4gKi9cbmV4cG9ydCBjb25zdCBNVFhfRFJBV0VSX0RFRkFVTFRfT1BUSU9OUyA9IG5ldyBJbmplY3Rpb25Ub2tlbjxNdHhEcmF3ZXJDb25maWc+KFxuICAnbXR4LWRyYXdlci1kZWZhdWx0LW9wdGlvbnMnXG4pO1xuXG4vKipcbiAqIFNlcnZpY2UgdG8gdHJpZ2dlciBNYXRlcmlhbCBEZXNpZ24gYm90dG9tIHNoZWV0cy5cbiAqL1xuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiAncm9vdCcgfSlcbmV4cG9ydCBjbGFzcyBNdHhEcmF3ZXIgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICBwcml2YXRlIF9kcmF3ZXJSZWZBdFRoaXNMZXZlbDogTXR4RHJhd2VyUmVmPGFueT4gfCBudWxsID0gbnVsbDtcblxuICAvKiogUmVmZXJlbmNlIHRvIHRoZSBjdXJyZW50bHkgb3BlbmVkIGRyYXdlci4gKi9cbiAgZ2V0IF9vcGVuZWREcmF3ZXJSZWYoKTogTXR4RHJhd2VyUmVmPGFueT4gfCBudWxsIHtcbiAgICBjb25zdCBwYXJlbnQgPSB0aGlzLl9wYXJlbnREcmF3ZXI7XG4gICAgcmV0dXJuIHBhcmVudCA/IHBhcmVudC5fb3BlbmVkRHJhd2VyUmVmIDogdGhpcy5fZHJhd2VyUmVmQXRUaGlzTGV2ZWw7XG4gIH1cblxuICBzZXQgX29wZW5lZERyYXdlclJlZih2YWx1ZTogTXR4RHJhd2VyUmVmPGFueT4gfCBudWxsKSB7XG4gICAgaWYgKHRoaXMuX3BhcmVudERyYXdlcikge1xuICAgICAgdGhpcy5fcGFyZW50RHJhd2VyLl9vcGVuZWREcmF3ZXJSZWYgPSB2YWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fZHJhd2VyUmVmQXRUaGlzTGV2ZWwgPSB2YWx1ZTtcbiAgICB9XG4gIH1cblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9vdmVybGF5OiBPdmVybGF5LFxuICAgIHByaXZhdGUgX2luamVjdG9yOiBJbmplY3RvcixcbiAgICBAT3B0aW9uYWwoKSBAU2tpcFNlbGYoKSBwcml2YXRlIF9wYXJlbnREcmF3ZXI6IE10eERyYXdlcixcbiAgICBAT3B0aW9uYWwoKVxuICAgIEBJbmplY3QoTVRYX0RSQVdFUl9ERUZBVUxUX09QVElPTlMpXG4gICAgcHJpdmF0ZSBfZGVmYXVsdE9wdGlvbnM/OiBNdHhEcmF3ZXJDb25maWdcbiAgKSB7fVxuXG4gIC8qKlxuICAgKiBPcGVucyBhIGRyYXdlciBjb250YWluaW5nIHRoZSBnaXZlbiBjb21wb25lbnQuXG4gICAqIEBwYXJhbSBjb21wb25lbnQgVHlwZSBvZiB0aGUgY29tcG9uZW50IHRvIGxvYWQgaW50byB0aGUgZHJhd2VyLlxuICAgKiBAcGFyYW0gY29uZmlnIEV4dHJhIGNvbmZpZ3VyYXRpb24gb3B0aW9ucy5cbiAgICogQHJldHVybnMgUmVmZXJlbmNlIHRvIHRoZSBuZXdseS1vcGVuZWQgZHJhd2VyLlxuICAgKi9cbiAgb3BlbjxULCBEID0gYW55LCBSID0gYW55PihcbiAgICBjb21wb25lbnQ6IENvbXBvbmVudFR5cGU8VD4sXG4gICAgY29uZmlnPzogTXR4RHJhd2VyQ29uZmlnPEQ+XG4gICk6IE10eERyYXdlclJlZjxULCBSPjtcblxuICAvKipcbiAgICogT3BlbnMgYSBkcmF3ZXIgY29udGFpbmluZyB0aGUgZ2l2ZW4gdGVtcGxhdGUuXG4gICAqIEBwYXJhbSB0ZW1wbGF0ZSBUZW1wbGF0ZVJlZiB0byBpbnN0YW50aWF0ZSBhcyB0aGUgZHJhd2VyIGNvbnRlbnQuXG4gICAqIEBwYXJhbSBjb25maWcgRXh0cmEgY29uZmlndXJhdGlvbiBvcHRpb25zLlxuICAgKiBAcmV0dXJucyBSZWZlcmVuY2UgdG8gdGhlIG5ld2x5LW9wZW5lZCBkcmF3ZXIuXG4gICAqL1xuICBvcGVuPFQsIEQgPSBhbnksIFIgPSBhbnk+KFxuICAgIHRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxUPixcbiAgICBjb25maWc/OiBNdHhEcmF3ZXJDb25maWc8RD5cbiAgKTogTXR4RHJhd2VyUmVmPFQsIFI+O1xuXG4gIG9wZW48VCwgRCA9IGFueSwgUiA9IGFueT4oXG4gICAgY29tcG9uZW50T3JUZW1wbGF0ZVJlZjogQ29tcG9uZW50VHlwZTxUPiB8IFRlbXBsYXRlUmVmPFQ+LFxuICAgIGNvbmZpZz86IE10eERyYXdlckNvbmZpZzxEPlxuICApOiBNdHhEcmF3ZXJSZWY8VCwgUj4ge1xuICAgIGNvbnN0IF9jb25maWcgPSBfYXBwbHlDb25maWdEZWZhdWx0cyh0aGlzLl9kZWZhdWx0T3B0aW9ucyB8fCBuZXcgTXR4RHJhd2VyQ29uZmlnKCksIGNvbmZpZyk7XG4gICAgY29uc3Qgb3ZlcmxheVJlZiA9IHRoaXMuX2NyZWF0ZU92ZXJsYXkoX2NvbmZpZyk7XG4gICAgY29uc3QgY29udGFpbmVyID0gdGhpcy5fYXR0YWNoQ29udGFpbmVyKG92ZXJsYXlSZWYsIF9jb25maWcpO1xuICAgIGNvbnN0IHJlZiA9IG5ldyBNdHhEcmF3ZXJSZWY8VCwgUj4oY29udGFpbmVyLCBvdmVybGF5UmVmKTtcblxuICAgIGlmIChjb21wb25lbnRPclRlbXBsYXRlUmVmIGluc3RhbmNlb2YgVGVtcGxhdGVSZWYpIHtcbiAgICAgIGNvbnRhaW5lci5hdHRhY2hUZW1wbGF0ZVBvcnRhbChcbiAgICAgICAgbmV3IFRlbXBsYXRlUG9ydGFsPFQ+KGNvbXBvbmVudE9yVGVtcGxhdGVSZWYsIG51bGwhLCB7XG4gICAgICAgICAgJGltcGxpY2l0OiBfY29uZmlnLmRhdGEsXG4gICAgICAgICAgZHJhd2VyUmVmOiByZWYsXG4gICAgICAgIH0gYXMgYW55KVxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgcG9ydGFsID0gbmV3IENvbXBvbmVudFBvcnRhbChcbiAgICAgICAgY29tcG9uZW50T3JUZW1wbGF0ZVJlZixcbiAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICB0aGlzLl9jcmVhdGVJbmplY3RvcihfY29uZmlnLCByZWYpXG4gICAgICApO1xuICAgICAgY29uc3QgY29udGVudFJlZiA9IGNvbnRhaW5lci5hdHRhY2hDb21wb25lbnRQb3J0YWwocG9ydGFsKTtcbiAgICAgIHJlZi5pbnN0YW5jZSA9IGNvbnRlbnRSZWYuaW5zdGFuY2U7XG4gICAgfVxuXG4gICAgLy8gV2hlbiB0aGUgZHJhd2VyIGlzIGRpc21pc3NlZCwgY2xlYXIgdGhlIHJlZmVyZW5jZSB0byBpdC5cbiAgICByZWYuYWZ0ZXJEaXNtaXNzZWQoKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgLy8gQ2xlYXIgdGhlIGRyYXdlciByZWYgaWYgaXQgaGFzbid0IGFscmVhZHkgYmVlbiByZXBsYWNlZCBieSBhIG5ld2VyIG9uZS5cbiAgICAgIGlmICh0aGlzLl9vcGVuZWREcmF3ZXJSZWYgPT0gcmVmKSB7XG4gICAgICAgIHRoaXMuX29wZW5lZERyYXdlclJlZiA9IG51bGw7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5fb3BlbmVkRHJhd2VyUmVmKSB7XG4gICAgICAvLyBJZiBhIGRyYXdlciBpcyBhbHJlYWR5IGluIHZpZXcsIGRpc21pc3MgaXQgYW5kIGVudGVyIHRoZVxuICAgICAgLy8gbmV3IGRyYXdlciBhZnRlciBleGl0IGFuaW1hdGlvbiBpcyBjb21wbGV0ZS5cbiAgICAgIHRoaXMuX29wZW5lZERyYXdlclJlZi5hZnRlckRpc21pc3NlZCgpLnN1YnNjcmliZSgoKSA9PiByZWYuY29udGFpbmVySW5zdGFuY2UuZW50ZXIoKSk7XG4gICAgICB0aGlzLl9vcGVuZWREcmF3ZXJSZWYuZGlzbWlzcygpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBJZiBubyBkcmF3ZXIgaXMgaW4gdmlldywgZW50ZXIgdGhlIG5ldyBkcmF3ZXIuXG4gICAgICByZWYuY29udGFpbmVySW5zdGFuY2UuZW50ZXIoKTtcbiAgICB9XG5cbiAgICB0aGlzLl9vcGVuZWREcmF3ZXJSZWYgPSByZWY7XG5cbiAgICByZXR1cm4gcmVmO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc21pc3NlcyB0aGUgY3VycmVudGx5LXZpc2libGUgZHJhd2VyLlxuICAgKiBAcGFyYW0gcmVzdWx0IERhdGEgdG8gcGFzcyB0byB0aGUgZHJhd2VyIGluc3RhbmNlLlxuICAgKi9cbiAgZGlzbWlzczxSID0gYW55PihyZXN1bHQ/OiBSKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX29wZW5lZERyYXdlclJlZikge1xuICAgICAgdGhpcy5fb3BlbmVkRHJhd2VyUmVmLmRpc21pc3MocmVzdWx0KTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5fZHJhd2VyUmVmQXRUaGlzTGV2ZWwpIHtcbiAgICAgIHRoaXMuX2RyYXdlclJlZkF0VGhpc0xldmVsLmRpc21pc3MoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQXR0YWNoZXMgdGhlIGRyYXdlciBjb250YWluZXIgY29tcG9uZW50IHRvIHRoZSBvdmVybGF5LlxuICAgKi9cbiAgcHJpdmF0ZSBfYXR0YWNoQ29udGFpbmVyKG92ZXJsYXlSZWY6IE92ZXJsYXlSZWYsIGNvbmZpZzogTXR4RHJhd2VyQ29uZmlnKTogTXR4RHJhd2VyQ29udGFpbmVyIHtcbiAgICBjb25zdCB1c2VySW5qZWN0b3IgPSBjb25maWcgJiYgY29uZmlnLnZpZXdDb250YWluZXJSZWYgJiYgY29uZmlnLnZpZXdDb250YWluZXJSZWYuaW5qZWN0b3I7XG4gICAgY29uc3QgaW5qZWN0b3IgPSBJbmplY3Rvci5jcmVhdGUoe1xuICAgICAgcGFyZW50OiB1c2VySW5qZWN0b3IgfHwgdGhpcy5faW5qZWN0b3IsXG4gICAgICBwcm92aWRlcnM6IFt7IHByb3ZpZGU6IE10eERyYXdlckNvbmZpZywgdXNlVmFsdWU6IGNvbmZpZyB9XSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGNvbnRhaW5lclBvcnRhbCA9IG5ldyBDb21wb25lbnRQb3J0YWwoXG4gICAgICBNdHhEcmF3ZXJDb250YWluZXIsXG4gICAgICBjb25maWcudmlld0NvbnRhaW5lclJlZixcbiAgICAgIGluamVjdG9yXG4gICAgKTtcbiAgICBjb25zdCBjb250YWluZXJSZWY6IENvbXBvbmVudFJlZjxNdHhEcmF3ZXJDb250YWluZXI+ID0gb3ZlcmxheVJlZi5hdHRhY2goY29udGFpbmVyUG9ydGFsKTtcbiAgICByZXR1cm4gY29udGFpbmVyUmVmLmluc3RhbmNlO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgb3ZlcmxheSBhbmQgcGxhY2VzIGl0IGluIHRoZSBjb3JyZWN0IGxvY2F0aW9uLlxuICAgKiBAcGFyYW0gY29uZmlnIFRoZSB1c2VyLXNwZWNpZmllZCBkcmF3ZXIgY29uZmlnLlxuICAgKi9cbiAgcHJpdmF0ZSBfY3JlYXRlT3ZlcmxheShjb25maWc6IE10eERyYXdlckNvbmZpZyk6IE92ZXJsYXlSZWYge1xuICAgIGNvbnN0IG92ZXJsYXlDb25maWcgPSBuZXcgT3ZlcmxheUNvbmZpZyh7XG4gICAgICBkaXJlY3Rpb246IGNvbmZpZy5kaXJlY3Rpb24sXG4gICAgICBoYXNCYWNrZHJvcDogY29uZmlnLmhhc0JhY2tkcm9wLFxuICAgICAgZGlzcG9zZU9uTmF2aWdhdGlvbjogY29uZmlnLmNsb3NlT25OYXZpZ2F0aW9uLFxuICAgICAgbWF4V2lkdGg6ICcxMDAlJyxcbiAgICAgIHNjcm9sbFN0cmF0ZWd5OiBjb25maWcuc2Nyb2xsU3RyYXRlZ3kgfHwgdGhpcy5fb3ZlcmxheS5zY3JvbGxTdHJhdGVnaWVzLmJsb2NrKCksXG4gICAgICBwb3NpdGlvblN0cmF0ZWd5OiB0aGlzLl9vdmVybGF5LnBvc2l0aW9uKCkuZ2xvYmFsKClbY29uZmlnLnBvc2l0aW9uIV0oJzAnKSxcbiAgICB9KTtcblxuICAgIGlmIChjb25maWcuYmFja2Ryb3BDbGFzcykge1xuICAgICAgb3ZlcmxheUNvbmZpZy5iYWNrZHJvcENsYXNzID0gY29uZmlnLmJhY2tkcm9wQ2xhc3M7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX292ZXJsYXkuY3JlYXRlKG92ZXJsYXlDb25maWcpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gaW5qZWN0b3IgdG8gYmUgdXNlZCBpbnNpZGUgb2YgYSBkcmF3ZXIgY29tcG9uZW50LlxuICAgKiBAcGFyYW0gY29uZmlnIENvbmZpZyB0aGF0IHdhcyB1c2VkIHRvIGNyZWF0ZSB0aGUgZHJhd2VyLlxuICAgKiBAcGFyYW0gZHJhd2VyUmVmIFJlZmVyZW5jZSB0byB0aGUgZHJhd2VyLlxuICAgKi9cbiAgcHJpdmF0ZSBfY3JlYXRlSW5qZWN0b3I8VD4oY29uZmlnOiBNdHhEcmF3ZXJDb25maWcsIGRyYXdlclJlZjogTXR4RHJhd2VyUmVmPFQ+KTogSW5qZWN0b3Ige1xuICAgIGNvbnN0IHVzZXJJbmplY3RvciA9IGNvbmZpZyAmJiBjb25maWcudmlld0NvbnRhaW5lclJlZiAmJiBjb25maWcudmlld0NvbnRhaW5lclJlZi5pbmplY3RvcjtcbiAgICBjb25zdCBwcm92aWRlcnM6IFN0YXRpY1Byb3ZpZGVyW10gPSBbXG4gICAgICB7IHByb3ZpZGU6IE10eERyYXdlclJlZiwgdXNlVmFsdWU6IGRyYXdlclJlZiB9LFxuICAgICAgeyBwcm92aWRlOiBNVFhfRFJBV0VSX0RBVEEsIHVzZVZhbHVlOiBjb25maWcuZGF0YSB9LFxuICAgIF07XG5cbiAgICBpZiAoXG4gICAgICBjb25maWcuZGlyZWN0aW9uICYmXG4gICAgICAoIXVzZXJJbmplY3RvciB8fFxuICAgICAgICAhdXNlckluamVjdG9yLmdldDxEaXJlY3Rpb25hbGl0eSB8IG51bGw+KERpcmVjdGlvbmFsaXR5LCBudWxsLCBJbmplY3RGbGFncy5PcHRpb25hbCkpXG4gICAgKSB7XG4gICAgICBwcm92aWRlcnMucHVzaCh7XG4gICAgICAgIHByb3ZpZGU6IERpcmVjdGlvbmFsaXR5LFxuICAgICAgICB1c2VWYWx1ZTogeyB2YWx1ZTogY29uZmlnLmRpcmVjdGlvbiwgY2hhbmdlOiBvYnNlcnZhYmxlT2YoKSB9LFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIEluamVjdG9yLmNyZWF0ZSh7IHBhcmVudDogdXNlckluamVjdG9yIHx8IHRoaXMuX2luamVjdG9yLCBwcm92aWRlcnMgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBBcHBsaWVzIGRlZmF1bHQgb3B0aW9ucyB0byB0aGUgZHJhd2VyIGNvbmZpZy5cbiAqIEBwYXJhbSBkZWZhdWx0cyBPYmplY3QgY29udGFpbmluZyB0aGUgZGVmYXVsdCB2YWx1ZXMgdG8gd2hpY2ggdG8gZmFsbCBiYWNrLlxuICogQHBhcmFtIGNvbmZpZyBUaGUgY29uZmlndXJhdGlvbiB0byB3aGljaCB0aGUgZGVmYXVsdHMgd2lsbCBiZSBhcHBsaWVkLlxuICogQHJldHVybnMgVGhlIG5ldyBjb25maWd1cmF0aW9uIG9iamVjdCB3aXRoIGRlZmF1bHRzIGFwcGxpZWQuXG4gKi9cbmZ1bmN0aW9uIF9hcHBseUNvbmZpZ0RlZmF1bHRzKFxuICBkZWZhdWx0czogTXR4RHJhd2VyQ29uZmlnLFxuICBjb25maWc/OiBNdHhEcmF3ZXJDb25maWdcbik6IE10eERyYXdlckNvbmZpZyB7XG4gIHJldHVybiB7IC4uLmRlZmF1bHRzLCAuLi5jb25maWcgfTtcbn1cbiJdfQ==