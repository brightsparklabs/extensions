import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MtxSelect } from './select';
import { MtxSelectFooterTemplate, MtxSelectHeaderTemplate, MtxSelectLabelTemplate, MtxSelectLoadingSpinnerTemplate, MtxSelectLoadingTextTemplate, MtxSelectMultiLabelTemplate, MtxSelectNotFoundTemplate, MtxSelectOptgroupTemplate, MtxSelectOptionTemplate, MtxSelectTagTemplate, MtxSelectTypeToSearchTemplate, } from './templates';
import { MtxOption } from './option';
import * as i0 from "@angular/core";
export class MtxSelectModule {
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxSelectModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    /** @nocollapse */ static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.0.1", ngImport: i0, type: MtxSelectModule, imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,
            NgSelectModule,
            MtxSelect,
            MtxOption,
            MtxSelectOptgroupTemplate,
            MtxSelectOptionTemplate,
            MtxSelectLabelTemplate,
            MtxSelectMultiLabelTemplate,
            MtxSelectHeaderTemplate,
            MtxSelectFooterTemplate,
            MtxSelectNotFoundTemplate,
            MtxSelectTypeToSearchTemplate,
            MtxSelectLoadingTextTemplate,
            MtxSelectTagTemplate,
            MtxSelectLoadingSpinnerTemplate], exports: [MtxSelect,
            MtxOption,
            MtxSelectOptgroupTemplate,
            MtxSelectOptionTemplate,
            MtxSelectLabelTemplate,
            MtxSelectMultiLabelTemplate,
            MtxSelectHeaderTemplate,
            MtxSelectFooterTemplate,
            MtxSelectNotFoundTemplate,
            MtxSelectTypeToSearchTemplate,
            MtxSelectLoadingTextTemplate,
            MtxSelectTagTemplate,
            MtxSelectLoadingSpinnerTemplate] }); }
    /** @nocollapse */ static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxSelectModule, imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,
            NgSelectModule,
            MtxSelect] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxSelectModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        FormsModule,
                        ReactiveFormsModule,
                        NgSelectModule,
                        MtxSelect,
                        MtxOption,
                        MtxSelectOptgroupTemplate,
                        MtxSelectOptionTemplate,
                        MtxSelectLabelTemplate,
                        MtxSelectMultiLabelTemplate,
                        MtxSelectHeaderTemplate,
                        MtxSelectFooterTemplate,
                        MtxSelectNotFoundTemplate,
                        MtxSelectTypeToSearchTemplate,
                        MtxSelectLoadingTextTemplate,
                        MtxSelectTagTemplate,
                        MtxSelectLoadingSpinnerTemplate,
                    ],
                    exports: [
                        MtxSelect,
                        MtxOption,
                        MtxSelectOptgroupTemplate,
                        MtxSelectOptionTemplate,
                        MtxSelectLabelTemplate,
                        MtxSelectMultiLabelTemplate,
                        MtxSelectHeaderTemplate,
                        MtxSelectFooterTemplate,
                        MtxSelectNotFoundTemplate,
                        MtxSelectTypeToSearchTemplate,
                        MtxSelectLoadingTextTemplate,
                        MtxSelectTagTemplate,
                        MtxSelectLoadingSpinnerTemplate,
                    ],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LW1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2V4dGVuc2lvbnMvc2VsZWN0L3NlbGVjdC1tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLFdBQVcsRUFBRSxtQkFBbUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ2xFLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUV0RCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQ3JDLE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsdUJBQXVCLEVBQ3ZCLHNCQUFzQixFQUN0QiwrQkFBK0IsRUFDL0IsNEJBQTRCLEVBQzVCLDJCQUEyQixFQUMzQix5QkFBeUIsRUFDekIseUJBQXlCLEVBQ3pCLHVCQUF1QixFQUN2QixvQkFBb0IsRUFDcEIsNkJBQTZCLEdBQzlCLE1BQU0sYUFBYSxDQUFDO0FBQ3JCLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxVQUFVLENBQUM7O0FBc0NyQyxNQUFNLE9BQU8sZUFBZTtpSUFBZixlQUFlO2tJQUFmLGVBQWUsWUFsQ3hCLFlBQVk7WUFDWixXQUFXO1lBQ1gsbUJBQW1CO1lBQ25CLGNBQWM7WUFDZCxTQUFTO1lBQ1QsU0FBUztZQUNULHlCQUF5QjtZQUN6Qix1QkFBdUI7WUFDdkIsc0JBQXNCO1lBQ3RCLDJCQUEyQjtZQUMzQix1QkFBdUI7WUFDdkIsdUJBQXVCO1lBQ3ZCLHlCQUF5QjtZQUN6Qiw2QkFBNkI7WUFDN0IsNEJBQTRCO1lBQzVCLG9CQUFvQjtZQUNwQiwrQkFBK0IsYUFHL0IsU0FBUztZQUNULFNBQVM7WUFDVCx5QkFBeUI7WUFDekIsdUJBQXVCO1lBQ3ZCLHNCQUFzQjtZQUN0QiwyQkFBMkI7WUFDM0IsdUJBQXVCO1lBQ3ZCLHVCQUF1QjtZQUN2Qix5QkFBeUI7WUFDekIsNkJBQTZCO1lBQzdCLDRCQUE0QjtZQUM1QixvQkFBb0I7WUFDcEIsK0JBQStCO2tJQUd0QixlQUFlLFlBbEN4QixZQUFZO1lBQ1osV0FBVztZQUNYLG1CQUFtQjtZQUNuQixjQUFjO1lBQ2QsU0FBUzs7MkZBOEJBLGVBQWU7a0JBcEMzQixRQUFRO21CQUFDO29CQUNSLE9BQU8sRUFBRTt3QkFDUCxZQUFZO3dCQUNaLFdBQVc7d0JBQ1gsbUJBQW1CO3dCQUNuQixjQUFjO3dCQUNkLFNBQVM7d0JBQ1QsU0FBUzt3QkFDVCx5QkFBeUI7d0JBQ3pCLHVCQUF1Qjt3QkFDdkIsc0JBQXNCO3dCQUN0QiwyQkFBMkI7d0JBQzNCLHVCQUF1Qjt3QkFDdkIsdUJBQXVCO3dCQUN2Qix5QkFBeUI7d0JBQ3pCLDZCQUE2Qjt3QkFDN0IsNEJBQTRCO3dCQUM1QixvQkFBb0I7d0JBQ3BCLCtCQUErQjtxQkFDaEM7b0JBQ0QsT0FBTyxFQUFFO3dCQUNQLFNBQVM7d0JBQ1QsU0FBUzt3QkFDVCx5QkFBeUI7d0JBQ3pCLHVCQUF1Qjt3QkFDdkIsc0JBQXNCO3dCQUN0QiwyQkFBMkI7d0JBQzNCLHVCQUF1Qjt3QkFDdkIsdUJBQXVCO3dCQUN2Qix5QkFBeUI7d0JBQ3pCLDZCQUE2Qjt3QkFDN0IsNEJBQTRCO3dCQUM1QixvQkFBb0I7d0JBQ3BCLCtCQUErQjtxQkFDaEM7aUJBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IEZvcm1zTW9kdWxlLCBSZWFjdGl2ZUZvcm1zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgTmdTZWxlY3RNb2R1bGUgfSBmcm9tICdAbmctc2VsZWN0L25nLXNlbGVjdCc7XG5cbmltcG9ydCB7IE10eFNlbGVjdCB9IGZyb20gJy4vc2VsZWN0JztcbmltcG9ydCB7XG4gIE10eFNlbGVjdEZvb3RlclRlbXBsYXRlLFxuICBNdHhTZWxlY3RIZWFkZXJUZW1wbGF0ZSxcbiAgTXR4U2VsZWN0TGFiZWxUZW1wbGF0ZSxcbiAgTXR4U2VsZWN0TG9hZGluZ1NwaW5uZXJUZW1wbGF0ZSxcbiAgTXR4U2VsZWN0TG9hZGluZ1RleHRUZW1wbGF0ZSxcbiAgTXR4U2VsZWN0TXVsdGlMYWJlbFRlbXBsYXRlLFxuICBNdHhTZWxlY3ROb3RGb3VuZFRlbXBsYXRlLFxuICBNdHhTZWxlY3RPcHRncm91cFRlbXBsYXRlLFxuICBNdHhTZWxlY3RPcHRpb25UZW1wbGF0ZSxcbiAgTXR4U2VsZWN0VGFnVGVtcGxhdGUsXG4gIE10eFNlbGVjdFR5cGVUb1NlYXJjaFRlbXBsYXRlLFxufSBmcm9tICcuL3RlbXBsYXRlcyc7XG5pbXBvcnQgeyBNdHhPcHRpb24gfSBmcm9tICcuL29wdGlvbic7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgICBDb21tb25Nb2R1bGUsXG4gICAgRm9ybXNNb2R1bGUsXG4gICAgUmVhY3RpdmVGb3Jtc01vZHVsZSxcbiAgICBOZ1NlbGVjdE1vZHVsZSxcbiAgICBNdHhTZWxlY3QsXG4gICAgTXR4T3B0aW9uLFxuICAgIE10eFNlbGVjdE9wdGdyb3VwVGVtcGxhdGUsXG4gICAgTXR4U2VsZWN0T3B0aW9uVGVtcGxhdGUsXG4gICAgTXR4U2VsZWN0TGFiZWxUZW1wbGF0ZSxcbiAgICBNdHhTZWxlY3RNdWx0aUxhYmVsVGVtcGxhdGUsXG4gICAgTXR4U2VsZWN0SGVhZGVyVGVtcGxhdGUsXG4gICAgTXR4U2VsZWN0Rm9vdGVyVGVtcGxhdGUsXG4gICAgTXR4U2VsZWN0Tm90Rm91bmRUZW1wbGF0ZSxcbiAgICBNdHhTZWxlY3RUeXBlVG9TZWFyY2hUZW1wbGF0ZSxcbiAgICBNdHhTZWxlY3RMb2FkaW5nVGV4dFRlbXBsYXRlLFxuICAgIE10eFNlbGVjdFRhZ1RlbXBsYXRlLFxuICAgIE10eFNlbGVjdExvYWRpbmdTcGlubmVyVGVtcGxhdGUsXG4gIF0sXG4gIGV4cG9ydHM6IFtcbiAgICBNdHhTZWxlY3QsXG4gICAgTXR4T3B0aW9uLFxuICAgIE10eFNlbGVjdE9wdGdyb3VwVGVtcGxhdGUsXG4gICAgTXR4U2VsZWN0T3B0aW9uVGVtcGxhdGUsXG4gICAgTXR4U2VsZWN0TGFiZWxUZW1wbGF0ZSxcbiAgICBNdHhTZWxlY3RNdWx0aUxhYmVsVGVtcGxhdGUsXG4gICAgTXR4U2VsZWN0SGVhZGVyVGVtcGxhdGUsXG4gICAgTXR4U2VsZWN0Rm9vdGVyVGVtcGxhdGUsXG4gICAgTXR4U2VsZWN0Tm90Rm91bmRUZW1wbGF0ZSxcbiAgICBNdHhTZWxlY3RUeXBlVG9TZWFyY2hUZW1wbGF0ZSxcbiAgICBNdHhTZWxlY3RMb2FkaW5nVGV4dFRlbXBsYXRlLFxuICAgIE10eFNlbGVjdFRhZ1RlbXBsYXRlLFxuICAgIE10eFNlbGVjdExvYWRpbmdTcGlubmVyVGVtcGxhdGUsXG4gIF0sXG59KVxuZXhwb3J0IGNsYXNzIE10eFNlbGVjdE1vZHVsZSB7fVxuIl19