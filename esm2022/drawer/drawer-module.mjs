import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { NgModule } from '@angular/core';
import { MatCommonModule } from '@angular/material/core';
import { MtxDrawer } from './drawer';
import { MtxDrawerContainer } from './drawer-container';
import * as i0 from "@angular/core";
export class MtxDrawerModule {
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxDrawerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    /** @nocollapse */ static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.0.1", ngImport: i0, type: MtxDrawerModule, imports: [OverlayModule, PortalModule, MatCommonModule, MtxDrawerContainer], exports: [MtxDrawerContainer, MatCommonModule] }); }
    /** @nocollapse */ static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxDrawerModule, providers: [MtxDrawer], imports: [OverlayModule, PortalModule, MatCommonModule, MatCommonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxDrawerModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [OverlayModule, PortalModule, MatCommonModule, MtxDrawerContainer],
                    exports: [MtxDrawerContainer, MatCommonModule],
                    providers: [MtxDrawer],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhd2VyLW1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2V4dGVuc2lvbnMvZHJhd2VyL2RyYXdlci1tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3JELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUNuRCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUN6RCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQ3JDLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLG9CQUFvQixDQUFDOztBQU94RCxNQUFNLE9BQU8sZUFBZTtpSUFBZixlQUFlO2tJQUFmLGVBQWUsWUFKaEIsYUFBYSxFQUFFLFlBQVksRUFBRSxlQUFlLEVBQUUsa0JBQWtCLGFBQ2hFLGtCQUFrQixFQUFFLGVBQWU7a0lBR2xDLGVBQWUsYUFGZixDQUFDLFNBQVMsQ0FBQyxZQUZaLGFBQWEsRUFBRSxZQUFZLEVBQUUsZUFBZSxFQUN4QixlQUFlOzsyRkFHbEMsZUFBZTtrQkFMM0IsUUFBUTttQkFBQztvQkFDUixPQUFPLEVBQUUsQ0FBQyxhQUFhLEVBQUUsWUFBWSxFQUFFLGVBQWUsRUFBRSxrQkFBa0IsQ0FBQztvQkFDM0UsT0FBTyxFQUFFLENBQUMsa0JBQWtCLEVBQUUsZUFBZSxDQUFDO29CQUM5QyxTQUFTLEVBQUUsQ0FBQyxTQUFTLENBQUM7aUJBQ3ZCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT3ZlcmxheU1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7IFBvcnRhbE1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wb3J0YWwnO1xuaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1hdENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHsgTXR4RHJhd2VyIH0gZnJvbSAnLi9kcmF3ZXInO1xuaW1wb3J0IHsgTXR4RHJhd2VyQ29udGFpbmVyIH0gZnJvbSAnLi9kcmF3ZXItY29udGFpbmVyJztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW092ZXJsYXlNb2R1bGUsIFBvcnRhbE1vZHVsZSwgTWF0Q29tbW9uTW9kdWxlLCBNdHhEcmF3ZXJDb250YWluZXJdLFxuICBleHBvcnRzOiBbTXR4RHJhd2VyQ29udGFpbmVyLCBNYXRDb21tb25Nb2R1bGVdLFxuICBwcm92aWRlcnM6IFtNdHhEcmF3ZXJdLFxufSlcbmV4cG9ydCBjbGFzcyBNdHhEcmF3ZXJNb2R1bGUge31cbiJdfQ==