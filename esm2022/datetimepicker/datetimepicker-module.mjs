import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MtxCalendar } from './calendar';
import { MtxCalendarBody } from './calendar-body';
import { MtxClock } from './clock';
import { MTX_DATETIMEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER, MtxDatetimepicker, MtxDatetimepickerContent, } from './datetimepicker';
import { MtxDatetimepickerInput } from './datetimepicker-input';
import { MtxDatetimepickerToggle, MtxDatetimepickerToggleIcon } from './datetimepicker-toggle';
import { MtxMonthView } from './month-view';
import { MtxMultiYearView } from './multi-year-view';
import { MtxTime, MtxTimeInput } from './time';
import { MtxYearView } from './year-view';
import * as i0 from "@angular/core";
export class MtxDatetimepickerModule {
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxDatetimepickerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    /** @nocollapse */ static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.0.1", ngImport: i0, type: MtxDatetimepickerModule, imports: [CommonModule,
            OverlayModule,
            A11yModule,
            PortalModule,
            MatButtonModule,
            MtxCalendar,
            MtxCalendarBody,
            MtxClock,
            MtxTime,
            MtxTimeInput,
            MtxDatetimepicker,
            MtxDatetimepickerToggle,
            MtxDatetimepickerToggleIcon,
            MtxDatetimepickerInput,
            MtxDatetimepickerContent,
            MtxMonthView,
            MtxYearView,
            MtxMultiYearView], exports: [MtxCalendar,
            MtxCalendarBody,
            MtxClock,
            MtxTime,
            MtxDatetimepicker,
            MtxDatetimepickerToggle,
            MtxDatetimepickerToggleIcon,
            MtxDatetimepickerInput,
            MtxDatetimepickerContent,
            MtxMonthView,
            MtxYearView,
            MtxMultiYearView] }); }
    /** @nocollapse */ static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxDatetimepickerModule, providers: [MTX_DATETIMEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER], imports: [CommonModule,
            OverlayModule,
            A11yModule,
            PortalModule,
            MatButtonModule,
            MtxCalendar,
            MtxTime,
            MtxDatetimepickerToggle,
            MtxDatetimepickerContent] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxDatetimepickerModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        OverlayModule,
                        A11yModule,
                        PortalModule,
                        MatButtonModule,
                        MtxCalendar,
                        MtxCalendarBody,
                        MtxClock,
                        MtxTime,
                        MtxTimeInput,
                        MtxDatetimepicker,
                        MtxDatetimepickerToggle,
                        MtxDatetimepickerToggleIcon,
                        MtxDatetimepickerInput,
                        MtxDatetimepickerContent,
                        MtxMonthView,
                        MtxYearView,
                        MtxMultiYearView,
                    ],
                    exports: [
                        MtxCalendar,
                        MtxCalendarBody,
                        MtxClock,
                        MtxTime,
                        MtxDatetimepicker,
                        MtxDatetimepickerToggle,
                        MtxDatetimepickerToggleIcon,
                        MtxDatetimepickerInput,
                        MtxDatetimepickerContent,
                        MtxMonthView,
                        MtxYearView,
                        MtxMultiYearView,
                    ],
                    providers: [MTX_DATETIMEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXRpbWVwaWNrZXItbW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvZXh0ZW5zaW9ucy9kYXRldGltZXBpY2tlci9kYXRldGltZXBpY2tlci1tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUNyRCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDbkQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBRTNELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFDekMsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ2xELE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFDbkMsT0FBTyxFQUNMLG1EQUFtRCxFQUNuRCxpQkFBaUIsRUFDakIsd0JBQXdCLEdBQ3pCLE1BQU0sa0JBQWtCLENBQUM7QUFDMUIsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDaEUsT0FBTyxFQUFFLHVCQUF1QixFQUFFLDJCQUEyQixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDL0YsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUM1QyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUNyRCxPQUFPLEVBQUUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLFFBQVEsQ0FBQztBQUMvQyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sYUFBYSxDQUFDOztBQXVDMUMsTUFBTSxPQUFPLHVCQUF1QjtpSUFBdkIsdUJBQXVCO2tJQUF2Qix1QkFBdUIsWUFuQ2hDLFlBQVk7WUFDWixhQUFhO1lBQ2IsVUFBVTtZQUNWLFlBQVk7WUFDWixlQUFlO1lBQ2YsV0FBVztZQUNYLGVBQWU7WUFDZixRQUFRO1lBQ1IsT0FBTztZQUNQLFlBQVk7WUFDWixpQkFBaUI7WUFDakIsdUJBQXVCO1lBQ3ZCLDJCQUEyQjtZQUMzQixzQkFBc0I7WUFDdEIsd0JBQXdCO1lBQ3hCLFlBQVk7WUFDWixXQUFXO1lBQ1gsZ0JBQWdCLGFBR2hCLFdBQVc7WUFDWCxlQUFlO1lBQ2YsUUFBUTtZQUNSLE9BQU87WUFDUCxpQkFBaUI7WUFDakIsdUJBQXVCO1lBQ3ZCLDJCQUEyQjtZQUMzQixzQkFBc0I7WUFDdEIsd0JBQXdCO1lBQ3hCLFlBQVk7WUFDWixXQUFXO1lBQ1gsZ0JBQWdCO2tJQUlQLHVCQUF1QixhQUZ2QixDQUFDLG1EQUFtRCxDQUFDLFlBakM5RCxZQUFZO1lBQ1osYUFBYTtZQUNiLFVBQVU7WUFDVixZQUFZO1lBQ1osZUFBZTtZQUNmLFdBQVc7WUFHWCxPQUFPO1lBR1AsdUJBQXVCO1lBR3ZCLHdCQUF3Qjs7MkZBcUJmLHVCQUF1QjtrQkFyQ25DLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFO3dCQUNQLFlBQVk7d0JBQ1osYUFBYTt3QkFDYixVQUFVO3dCQUNWLFlBQVk7d0JBQ1osZUFBZTt3QkFDZixXQUFXO3dCQUNYLGVBQWU7d0JBQ2YsUUFBUTt3QkFDUixPQUFPO3dCQUNQLFlBQVk7d0JBQ1osaUJBQWlCO3dCQUNqQix1QkFBdUI7d0JBQ3ZCLDJCQUEyQjt3QkFDM0Isc0JBQXNCO3dCQUN0Qix3QkFBd0I7d0JBQ3hCLFlBQVk7d0JBQ1osV0FBVzt3QkFDWCxnQkFBZ0I7cUJBQ2pCO29CQUNELE9BQU8sRUFBRTt3QkFDUCxXQUFXO3dCQUNYLGVBQWU7d0JBQ2YsUUFBUTt3QkFDUixPQUFPO3dCQUNQLGlCQUFpQjt3QkFDakIsdUJBQXVCO3dCQUN2QiwyQkFBMkI7d0JBQzNCLHNCQUFzQjt3QkFDdEIsd0JBQXdCO3dCQUN4QixZQUFZO3dCQUNaLFdBQVc7d0JBQ1gsZ0JBQWdCO3FCQUNqQjtvQkFDRCxTQUFTLEVBQUUsQ0FBQyxtREFBbUQsQ0FBQztpQkFDakUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBMTF5TW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHsgT3ZlcmxheU1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7IFBvcnRhbE1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wb3J0YWwnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBNYXRCdXR0b25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9idXR0b24nO1xuXG5pbXBvcnQgeyBNdHhDYWxlbmRhciB9IGZyb20gJy4vY2FsZW5kYXInO1xuaW1wb3J0IHsgTXR4Q2FsZW5kYXJCb2R5IH0gZnJvbSAnLi9jYWxlbmRhci1ib2R5JztcbmltcG9ydCB7IE10eENsb2NrIH0gZnJvbSAnLi9jbG9jayc7XG5pbXBvcnQge1xuICBNVFhfREFURVRJTUVQSUNLRVJfU0NST0xMX1NUUkFURUdZX0ZBQ1RPUllfUFJPVklERVIsXG4gIE10eERhdGV0aW1lcGlja2VyLFxuICBNdHhEYXRldGltZXBpY2tlckNvbnRlbnQsXG59IGZyb20gJy4vZGF0ZXRpbWVwaWNrZXInO1xuaW1wb3J0IHsgTXR4RGF0ZXRpbWVwaWNrZXJJbnB1dCB9IGZyb20gJy4vZGF0ZXRpbWVwaWNrZXItaW5wdXQnO1xuaW1wb3J0IHsgTXR4RGF0ZXRpbWVwaWNrZXJUb2dnbGUsIE10eERhdGV0aW1lcGlja2VyVG9nZ2xlSWNvbiB9IGZyb20gJy4vZGF0ZXRpbWVwaWNrZXItdG9nZ2xlJztcbmltcG9ydCB7IE10eE1vbnRoVmlldyB9IGZyb20gJy4vbW9udGgtdmlldyc7XG5pbXBvcnQgeyBNdHhNdWx0aVllYXJWaWV3IH0gZnJvbSAnLi9tdWx0aS15ZWFyLXZpZXcnO1xuaW1wb3J0IHsgTXR4VGltZSwgTXR4VGltZUlucHV0IH0gZnJvbSAnLi90aW1lJztcbmltcG9ydCB7IE10eFllYXJWaWV3IH0gZnJvbSAnLi95ZWFyLXZpZXcnO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbXG4gICAgQ29tbW9uTW9kdWxlLFxuICAgIE92ZXJsYXlNb2R1bGUsXG4gICAgQTExeU1vZHVsZSxcbiAgICBQb3J0YWxNb2R1bGUsXG4gICAgTWF0QnV0dG9uTW9kdWxlLFxuICAgIE10eENhbGVuZGFyLFxuICAgIE10eENhbGVuZGFyQm9keSxcbiAgICBNdHhDbG9jayxcbiAgICBNdHhUaW1lLFxuICAgIE10eFRpbWVJbnB1dCxcbiAgICBNdHhEYXRldGltZXBpY2tlcixcbiAgICBNdHhEYXRldGltZXBpY2tlclRvZ2dsZSxcbiAgICBNdHhEYXRldGltZXBpY2tlclRvZ2dsZUljb24sXG4gICAgTXR4RGF0ZXRpbWVwaWNrZXJJbnB1dCxcbiAgICBNdHhEYXRldGltZXBpY2tlckNvbnRlbnQsXG4gICAgTXR4TW9udGhWaWV3LFxuICAgIE10eFllYXJWaWV3LFxuICAgIE10eE11bHRpWWVhclZpZXcsXG4gIF0sXG4gIGV4cG9ydHM6IFtcbiAgICBNdHhDYWxlbmRhcixcbiAgICBNdHhDYWxlbmRhckJvZHksXG4gICAgTXR4Q2xvY2ssXG4gICAgTXR4VGltZSxcbiAgICBNdHhEYXRldGltZXBpY2tlcixcbiAgICBNdHhEYXRldGltZXBpY2tlclRvZ2dsZSxcbiAgICBNdHhEYXRldGltZXBpY2tlclRvZ2dsZUljb24sXG4gICAgTXR4RGF0ZXRpbWVwaWNrZXJJbnB1dCxcbiAgICBNdHhEYXRldGltZXBpY2tlckNvbnRlbnQsXG4gICAgTXR4TW9udGhWaWV3LFxuICAgIE10eFllYXJWaWV3LFxuICAgIE10eE11bHRpWWVhclZpZXcsXG4gIF0sXG4gIHByb3ZpZGVyczogW01UWF9EQVRFVElNRVBJQ0tFUl9TQ1JPTExfU1RSQVRFR1lfRkFDVE9SWV9QUk9WSURFUl0sXG59KVxuZXhwb3J0IGNsYXNzIE10eERhdGV0aW1lcGlja2VyTW9kdWxlIHt9XG4iXX0=