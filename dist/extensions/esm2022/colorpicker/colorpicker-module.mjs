import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ColorChromeModule } from 'ngx-color/chrome';
import { MTX_COLORPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER, MtxColorpicker, MtxColorpickerContent, } from './colorpicker';
import { MtxColorpickerInput } from './colorpicker-input';
import { MtxColorpickerToggle, MtxColorpickerToggleIcon } from './colorpicker-toggle';
import * as i0 from "@angular/core";
export class MtxColorpickerModule {
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxColorpickerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    /** @nocollapse */ static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.0.1", ngImport: i0, type: MtxColorpickerModule, imports: [CommonModule,
            OverlayModule,
            A11yModule,
            PortalModule,
            MatButtonModule,
            ColorChromeModule,
            MtxColorpicker,
            MtxColorpickerContent,
            MtxColorpickerInput,
            MtxColorpickerToggle,
            MtxColorpickerToggleIcon], exports: [MtxColorpicker,
            MtxColorpickerContent,
            MtxColorpickerInput,
            MtxColorpickerToggle,
            MtxColorpickerToggleIcon] }); }
    /** @nocollapse */ static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxColorpickerModule, providers: [MTX_COLORPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER], imports: [CommonModule,
            OverlayModule,
            A11yModule,
            PortalModule,
            MatButtonModule,
            ColorChromeModule,
            MtxColorpickerContent,
            MtxColorpickerToggle] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxColorpickerModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        OverlayModule,
                        A11yModule,
                        PortalModule,
                        MatButtonModule,
                        ColorChromeModule,
                        MtxColorpicker,
                        MtxColorpickerContent,
                        MtxColorpickerInput,
                        MtxColorpickerToggle,
                        MtxColorpickerToggleIcon,
                    ],
                    exports: [
                        MtxColorpicker,
                        MtxColorpickerContent,
                        MtxColorpickerInput,
                        MtxColorpickerToggle,
                        MtxColorpickerToggleIcon,
                    ],
                    providers: [MTX_COLORPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3JwaWNrZXItbW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvZXh0ZW5zaW9ucy9jb2xvcnBpY2tlci9jb2xvcnBpY2tlci1tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUNyRCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDbkQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBRTNELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ3JELE9BQU8sRUFDTCxnREFBZ0QsRUFDaEQsY0FBYyxFQUNkLHFCQUFxQixHQUN0QixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUMxRCxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQzs7QUF5QnRGLE1BQU0sT0FBTyxvQkFBb0I7aUlBQXBCLG9CQUFvQjtrSUFBcEIsb0JBQW9CLFlBckI3QixZQUFZO1lBQ1osYUFBYTtZQUNiLFVBQVU7WUFDVixZQUFZO1lBQ1osZUFBZTtZQUNmLGlCQUFpQjtZQUNqQixjQUFjO1lBQ2QscUJBQXFCO1lBQ3JCLG1CQUFtQjtZQUNuQixvQkFBb0I7WUFDcEIsd0JBQXdCLGFBR3hCLGNBQWM7WUFDZCxxQkFBcUI7WUFDckIsbUJBQW1CO1lBQ25CLG9CQUFvQjtZQUNwQix3QkFBd0I7a0lBSWYsb0JBQW9CLGFBRnBCLENBQUMsZ0RBQWdELENBQUMsWUFuQjNELFlBQVk7WUFDWixhQUFhO1lBQ2IsVUFBVTtZQUNWLFlBQVk7WUFDWixlQUFlO1lBQ2YsaUJBQWlCO1lBRWpCLHFCQUFxQjtZQUVyQixvQkFBb0I7OzJGQVlYLG9CQUFvQjtrQkF2QmhDLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFO3dCQUNQLFlBQVk7d0JBQ1osYUFBYTt3QkFDYixVQUFVO3dCQUNWLFlBQVk7d0JBQ1osZUFBZTt3QkFDZixpQkFBaUI7d0JBQ2pCLGNBQWM7d0JBQ2QscUJBQXFCO3dCQUNyQixtQkFBbUI7d0JBQ25CLG9CQUFvQjt3QkFDcEIsd0JBQXdCO3FCQUN6QjtvQkFDRCxPQUFPLEVBQUU7d0JBQ1AsY0FBYzt3QkFDZCxxQkFBcUI7d0JBQ3JCLG1CQUFtQjt3QkFDbkIsb0JBQW9CO3dCQUNwQix3QkFBd0I7cUJBQ3pCO29CQUNELFNBQVMsRUFBRSxDQUFDLGdEQUFnRCxDQUFDO2lCQUM5RCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEExMXlNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQgeyBPdmVybGF5TW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHsgUG9ydGFsTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1hdEJ1dHRvbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2J1dHRvbic7XG5cbmltcG9ydCB7IENvbG9yQ2hyb21lTW9kdWxlIH0gZnJvbSAnbmd4LWNvbG9yL2Nocm9tZSc7XG5pbXBvcnQge1xuICBNVFhfQ09MT1JQSUNLRVJfU0NST0xMX1NUUkFURUdZX0ZBQ1RPUllfUFJPVklERVIsXG4gIE10eENvbG9ycGlja2VyLFxuICBNdHhDb2xvcnBpY2tlckNvbnRlbnQsXG59IGZyb20gJy4vY29sb3JwaWNrZXInO1xuaW1wb3J0IHsgTXR4Q29sb3JwaWNrZXJJbnB1dCB9IGZyb20gJy4vY29sb3JwaWNrZXItaW5wdXQnO1xuaW1wb3J0IHsgTXR4Q29sb3JwaWNrZXJUb2dnbGUsIE10eENvbG9ycGlja2VyVG9nZ2xlSWNvbiB9IGZyb20gJy4vY29sb3JwaWNrZXItdG9nZ2xlJztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW1xuICAgIENvbW1vbk1vZHVsZSxcbiAgICBPdmVybGF5TW9kdWxlLFxuICAgIEExMXlNb2R1bGUsXG4gICAgUG9ydGFsTW9kdWxlLFxuICAgIE1hdEJ1dHRvbk1vZHVsZSxcbiAgICBDb2xvckNocm9tZU1vZHVsZSxcbiAgICBNdHhDb2xvcnBpY2tlcixcbiAgICBNdHhDb2xvcnBpY2tlckNvbnRlbnQsXG4gICAgTXR4Q29sb3JwaWNrZXJJbnB1dCxcbiAgICBNdHhDb2xvcnBpY2tlclRvZ2dsZSxcbiAgICBNdHhDb2xvcnBpY2tlclRvZ2dsZUljb24sXG4gIF0sXG4gIGV4cG9ydHM6IFtcbiAgICBNdHhDb2xvcnBpY2tlcixcbiAgICBNdHhDb2xvcnBpY2tlckNvbnRlbnQsXG4gICAgTXR4Q29sb3JwaWNrZXJJbnB1dCxcbiAgICBNdHhDb2xvcnBpY2tlclRvZ2dsZSxcbiAgICBNdHhDb2xvcnBpY2tlclRvZ2dsZUljb24sXG4gIF0sXG4gIHByb3ZpZGVyczogW01UWF9DT0xPUlBJQ0tFUl9TQ1JPTExfU1RSQVRFR1lfRkFDVE9SWV9QUk9WSURFUl0sXG59KVxuZXhwb3J0IGNsYXNzIE10eENvbG9ycGlja2VyTW9kdWxlIHt9XG4iXX0=