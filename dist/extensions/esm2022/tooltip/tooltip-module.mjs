import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { MatCommonModule } from '@angular/material/core';
import { MtxPipesModule } from '@ng-matero/extensions/core';
import { MtxTooltip, TooltipComponent, MTX_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER, } from './tooltip';
import * as i0 from "@angular/core";
export class MtxTooltipModule {
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxTooltipModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    /** @nocollapse */ static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.0.1", ngImport: i0, type: MtxTooltipModule, imports: [A11yModule,
            CommonModule,
            OverlayModule,
            MatCommonModule,
            MtxPipesModule,
            MtxTooltip,
            TooltipComponent], exports: [MtxTooltip, TooltipComponent, MatCommonModule, CdkScrollableModule] }); }
    /** @nocollapse */ static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxTooltipModule, providers: [MTX_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER], imports: [A11yModule,
            CommonModule,
            OverlayModule,
            MatCommonModule,
            MtxPipesModule, MatCommonModule, CdkScrollableModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxTooltipModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        A11yModule,
                        CommonModule,
                        OverlayModule,
                        MatCommonModule,
                        MtxPipesModule,
                        MtxTooltip,
                        TooltipComponent,
                    ],
                    exports: [MtxTooltip, TooltipComponent, MatCommonModule, CdkScrollableModule],
                    providers: [MTX_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHRpcC1tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9leHRlbnNpb25zL3Rvb2x0aXAvdG9vbHRpcC1tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUNyRCxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUM3RCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDekQsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQzVELE9BQU8sRUFDTCxVQUFVLEVBQ1YsZ0JBQWdCLEVBQ2hCLDRDQUE0QyxHQUM3QyxNQUFNLFdBQVcsQ0FBQzs7QUFlbkIsTUFBTSxPQUFPLGdCQUFnQjtpSUFBaEIsZ0JBQWdCO2tJQUFoQixnQkFBZ0IsWUFYekIsVUFBVTtZQUNWLFlBQVk7WUFDWixhQUFhO1lBQ2IsZUFBZTtZQUNmLGNBQWM7WUFDZCxVQUFVO1lBQ1YsZ0JBQWdCLGFBRVIsVUFBVSxFQUFFLGdCQUFnQixFQUFFLGVBQWUsRUFBRSxtQkFBbUI7a0lBR2pFLGdCQUFnQixhQUZoQixDQUFDLDRDQUE0QyxDQUFDLFlBVHZELFVBQVU7WUFDVixZQUFZO1lBQ1osYUFBYTtZQUNiLGVBQWU7WUFDZixjQUFjLEVBSXdCLGVBQWUsRUFBRSxtQkFBbUI7OzJGQUdqRSxnQkFBZ0I7a0JBYjVCLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFO3dCQUNQLFVBQVU7d0JBQ1YsWUFBWTt3QkFDWixhQUFhO3dCQUNiLGVBQWU7d0JBQ2YsY0FBYzt3QkFDZCxVQUFVO3dCQUNWLGdCQUFnQjtxQkFDakI7b0JBQ0QsT0FBTyxFQUFFLENBQUMsVUFBVSxFQUFFLGdCQUFnQixFQUFFLGVBQWUsRUFBRSxtQkFBbUIsQ0FBQztvQkFDN0UsU0FBUyxFQUFFLENBQUMsNENBQTRDLENBQUM7aUJBQzFEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBBMTF5TW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHsgT3ZlcmxheU1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7IENka1Njcm9sbGFibGVNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jZGsvc2Nyb2xsaW5nJztcbmltcG9ydCB7IE1hdENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHsgTXR4UGlwZXNNb2R1bGUgfSBmcm9tICdAbmctbWF0ZXJvL2V4dGVuc2lvbnMvY29yZSc7XG5pbXBvcnQge1xuICBNdHhUb29sdGlwLFxuICBUb29sdGlwQ29tcG9uZW50LFxuICBNVFhfVE9PTFRJUF9TQ1JPTExfU1RSQVRFR1lfRkFDVE9SWV9QUk9WSURFUixcbn0gZnJvbSAnLi90b29sdGlwJztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW1xuICAgIEExMXlNb2R1bGUsXG4gICAgQ29tbW9uTW9kdWxlLFxuICAgIE92ZXJsYXlNb2R1bGUsXG4gICAgTWF0Q29tbW9uTW9kdWxlLFxuICAgIE10eFBpcGVzTW9kdWxlLFxuICAgIE10eFRvb2x0aXAsXG4gICAgVG9vbHRpcENvbXBvbmVudCxcbiAgXSxcbiAgZXhwb3J0czogW010eFRvb2x0aXAsIFRvb2x0aXBDb21wb25lbnQsIE1hdENvbW1vbk1vZHVsZSwgQ2RrU2Nyb2xsYWJsZU1vZHVsZV0sXG4gIHByb3ZpZGVyczogW01UWF9UT09MVElQX1NDUk9MTF9TVFJBVEVHWV9GQUNUT1JZX1BST1ZJREVSXSxcbn0pXG5leHBvcnQgY2xhc3MgTXR4VG9vbHRpcE1vZHVsZSB7fVxuIl19