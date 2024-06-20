import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { A11yModule } from '@angular/cdk/a11y';
import { MtxPopover } from './popover';
import { MtxPopoverTrigger, MTX_POPOVER_SCROLL_STRATEGY_FACTORY_PROVIDER } from './popover-trigger';
import { MtxPopoverTarget } from './popover-target';
import { MtxPopoverContent } from './popover-content';
import * as i0 from "@angular/core";
export class MtxPopoverModule {
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxPopoverModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    /** @nocollapse */ static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.0.1", ngImport: i0, type: MtxPopoverModule, imports: [CommonModule,
            OverlayModule,
            A11yModule,
            MtxPopover,
            MtxPopoverTrigger,
            MtxPopoverTarget,
            MtxPopoverContent], exports: [MtxPopover, MtxPopoverTrigger, MtxPopoverTarget, MtxPopoverContent] }); }
    /** @nocollapse */ static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxPopoverModule, providers: [MTX_POPOVER_SCROLL_STRATEGY_FACTORY_PROVIDER], imports: [CommonModule,
            OverlayModule,
            A11yModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxPopoverModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        OverlayModule,
                        A11yModule,
                        MtxPopover,
                        MtxPopoverTrigger,
                        MtxPopoverTarget,
                        MtxPopoverContent,
                    ],
                    exports: [MtxPopover, MtxPopoverTrigger, MtxPopoverTarget, MtxPopoverContent],
                    providers: [MTX_POPOVER_SCROLL_STRATEGY_FACTORY_PROVIDER],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wb3Zlci1tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9leHRlbnNpb25zL3BvcG92ZXIvcG9wb3Zlci1tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFL0MsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3JELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUUvQyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBQ3ZDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSw0Q0FBNEMsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ3BHLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ3BELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLG1CQUFtQixDQUFDOztBQWV0RCxNQUFNLE9BQU8sZ0JBQWdCO2lJQUFoQixnQkFBZ0I7a0lBQWhCLGdCQUFnQixZQVh6QixZQUFZO1lBQ1osYUFBYTtZQUNiLFVBQVU7WUFDVixVQUFVO1lBQ1YsaUJBQWlCO1lBQ2pCLGdCQUFnQjtZQUNoQixpQkFBaUIsYUFFVCxVQUFVLEVBQUUsaUJBQWlCLEVBQUUsZ0JBQWdCLEVBQUUsaUJBQWlCO2tJQUdqRSxnQkFBZ0IsYUFGaEIsQ0FBQyw0Q0FBNEMsQ0FBQyxZQVR2RCxZQUFZO1lBQ1osYUFBYTtZQUNiLFVBQVU7OzJGQVNELGdCQUFnQjtrQkFiNUIsUUFBUTttQkFBQztvQkFDUixPQUFPLEVBQUU7d0JBQ1AsWUFBWTt3QkFDWixhQUFhO3dCQUNiLFVBQVU7d0JBQ1YsVUFBVTt3QkFDVixpQkFBaUI7d0JBQ2pCLGdCQUFnQjt3QkFDaEIsaUJBQWlCO3FCQUNsQjtvQkFDRCxPQUFPLEVBQUUsQ0FBQyxVQUFVLEVBQUUsaUJBQWlCLEVBQUUsZ0JBQWdCLEVBQUUsaUJBQWlCLENBQUM7b0JBQzdFLFNBQVMsRUFBRSxDQUFDLDRDQUE0QyxDQUFDO2lCQUMxRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG5pbXBvcnQgeyBPdmVybGF5TW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHsgQTExeU1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcblxuaW1wb3J0IHsgTXR4UG9wb3ZlciB9IGZyb20gJy4vcG9wb3Zlcic7XG5pbXBvcnQgeyBNdHhQb3BvdmVyVHJpZ2dlciwgTVRYX1BPUE9WRVJfU0NST0xMX1NUUkFURUdZX0ZBQ1RPUllfUFJPVklERVIgfSBmcm9tICcuL3BvcG92ZXItdHJpZ2dlcic7XG5pbXBvcnQgeyBNdHhQb3BvdmVyVGFyZ2V0IH0gZnJvbSAnLi9wb3BvdmVyLXRhcmdldCc7XG5pbXBvcnQgeyBNdHhQb3BvdmVyQ29udGVudCB9IGZyb20gJy4vcG9wb3Zlci1jb250ZW50JztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW1xuICAgIENvbW1vbk1vZHVsZSxcbiAgICBPdmVybGF5TW9kdWxlLFxuICAgIEExMXlNb2R1bGUsXG4gICAgTXR4UG9wb3ZlcixcbiAgICBNdHhQb3BvdmVyVHJpZ2dlcixcbiAgICBNdHhQb3BvdmVyVGFyZ2V0LFxuICAgIE10eFBvcG92ZXJDb250ZW50LFxuICBdLFxuICBleHBvcnRzOiBbTXR4UG9wb3ZlciwgTXR4UG9wb3ZlclRyaWdnZXIsIE10eFBvcG92ZXJUYXJnZXQsIE10eFBvcG92ZXJDb250ZW50XSxcbiAgcHJvdmlkZXJzOiBbTVRYX1BPUE9WRVJfU0NST0xMX1NUUkFURUdZX0ZBQ1RPUllfUFJPVklERVJdLFxufSlcbmV4cG9ydCBjbGFzcyBNdHhQb3BvdmVyTW9kdWxlIHt9XG4iXX0=