import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatColumnResizeModule } from './column-resize/column-resize-module';
import { MtxPipesModule } from '@ng-matero/extensions/core';
import { MtxDialogModule } from '@ng-matero/extensions/dialog';
import { MtxGridCell } from './cell';
import { MtxGridColumnMenu } from './column-menu';
import { MtxGridExpansionToggle } from './expansion-toggle';
import { MtxGrid } from './grid';
import { MtxGridCellActionBadgePipe, MtxGridCellActionDisablePipe, MtxGridCellActionTooltipPipe, MtxGridCellActionsPipe, MtxGridCellSummaryPipe, MtxGridColClassPipe, MtxGridRowClassPipe, } from './grid-pipes';
import { MtxGridUtils } from './grid-utils';
import { MtxGridSelectableCell } from './selectable-cell';
import * as i0 from "@angular/core";
export class MtxGridModule {
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxGridModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    /** @nocollapse */ static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.0.1", ngImport: i0, type: MtxGridModule, imports: [CommonModule,
            FormsModule,
            MatTableModule,
            MatSortModule,
            MatPaginatorModule,
            MatCheckboxModule,
            MatButtonModule,
            MatProgressBarModule,
            MatChipsModule,
            MatTooltipModule,
            MatBadgeModule,
            MatIconModule,
            MatSelectModule,
            MatFormFieldModule,
            MatMenuModule,
            DragDropModule,
            MtxDialogModule,
            MtxPipesModule,
            MatColumnResizeModule,
            MtxGrid,
            MtxGridCell,
            MtxGridColumnMenu,
            MtxGridExpansionToggle,
            MtxGridSelectableCell,
            MtxGridRowClassPipe,
            MtxGridColClassPipe,
            MtxGridCellActionsPipe,
            MtxGridCellActionTooltipPipe,
            MtxGridCellActionBadgePipe,
            MtxGridCellActionDisablePipe,
            MtxGridCellSummaryPipe], exports: [MatColumnResizeModule,
            MtxGrid,
            MtxGridCell,
            MtxGridColumnMenu,
            MtxGridExpansionToggle,
            MtxGridSelectableCell,
            MtxGridRowClassPipe,
            MtxGridColClassPipe,
            MtxGridCellActionsPipe,
            MtxGridCellActionTooltipPipe,
            MtxGridCellActionBadgePipe,
            MtxGridCellActionDisablePipe,
            MtxGridCellSummaryPipe] }); }
    /** @nocollapse */ static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxGridModule, providers: [MtxGridUtils], imports: [CommonModule,
            FormsModule,
            MatTableModule,
            MatSortModule,
            MatPaginatorModule,
            MatCheckboxModule,
            MatButtonModule,
            MatProgressBarModule,
            MatChipsModule,
            MatTooltipModule,
            MatBadgeModule,
            MatIconModule,
            MatSelectModule,
            MatFormFieldModule,
            MatMenuModule,
            DragDropModule,
            MtxDialogModule,
            MtxPipesModule,
            MatColumnResizeModule,
            MtxGrid,
            MtxGridCell,
            MtxGridColumnMenu, MatColumnResizeModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxGridModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        FormsModule,
                        MatTableModule,
                        MatSortModule,
                        MatPaginatorModule,
                        MatCheckboxModule,
                        MatButtonModule,
                        MatProgressBarModule,
                        MatChipsModule,
                        MatTooltipModule,
                        MatBadgeModule,
                        MatIconModule,
                        MatSelectModule,
                        MatFormFieldModule,
                        MatMenuModule,
                        DragDropModule,
                        MtxDialogModule,
                        MtxPipesModule,
                        MatColumnResizeModule,
                        MtxGrid,
                        MtxGridCell,
                        MtxGridColumnMenu,
                        MtxGridExpansionToggle,
                        MtxGridSelectableCell,
                        MtxGridRowClassPipe,
                        MtxGridColClassPipe,
                        MtxGridCellActionsPipe,
                        MtxGridCellActionTooltipPipe,
                        MtxGridCellActionBadgePipe,
                        MtxGridCellActionDisablePipe,
                        MtxGridCellSummaryPipe,
                    ],
                    exports: [
                        MatColumnResizeModule,
                        MtxGrid,
                        MtxGridCell,
                        MtxGridColumnMenu,
                        MtxGridExpansionToggle,
                        MtxGridSelectableCell,
                        MtxGridRowClassPipe,
                        MtxGridColClassPipe,
                        MtxGridCellActionsPipe,
                        MtxGridCellActionTooltipPipe,
                        MtxGridCellActionBadgePipe,
                        MtxGridCellActionDisablePipe,
                        MtxGridCellSummaryPipe,
                    ],
                    providers: [MtxGridUtils],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC1tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9leHRlbnNpb25zL2dyaWQvZ3JpZC1tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ3hELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM3QyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDekQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQzNELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQy9ELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUN6RCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUNsRSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDdkQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQ2pFLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQ3RFLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUMzRCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDdkQsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQ3pELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQzdELE9BQU8sRUFBRSxxQkFB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O3dCQUNQLHFCQUFxQjt3QkFDckIsT0FBTzt3QkFDUCxXQUFXO3dCQUNYLGlCQUFpQjt3QkFDakIsc0JBQXNCO3dCQUN0QixxQkFBcUI7d0JBQ3JCLG1CQUFtQjt3QkFDbkIsbUJBQW1CO3dCQUNuQixzQkFBc0I7d0JBQ3RCLDRCQUE0Qjt3QkFDNUIsMEJBQTBCO3dCQUMxQiw0QkFBNEI7d0JBQzVCLHNCQUFzQjtxQkFDdkI7b0JBQ0QsU0FBUyxFQUFFLENBQUMsWUFBWSxDQUFDO2lCQUMxQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERyYWdEcm9wTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2RyYWctZHJvcCc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEZvcm1zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgTWF0QmFkZ2VNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9iYWRnZSc7XG5pbXBvcnQgeyBNYXRCdXR0b25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9idXR0b24nO1xuaW1wb3J0IHsgTWF0Q2hlY2tib3hNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jaGVja2JveCc7XG5pbXBvcnQgeyBNYXRDaGlwc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NoaXBzJztcbmltcG9ydCB7IE1hdEZvcm1GaWVsZE1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2Zvcm0tZmllbGQnO1xuaW1wb3J0IHsgTWF0SWNvbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2ljb24nO1xuaW1wb3J0IHsgTWF0TWVudU1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL21lbnUnO1xuaW1wb3J0IHsgTWF0UGFnaW5hdG9yTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvcGFnaW5hdG9yJztcbmltcG9ydCB7IE1hdFByb2dyZXNzQmFyTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvcHJvZ3Jlc3MtYmFyJztcbmltcG9ydCB7IE1hdFNlbGVjdE1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL3NlbGVjdCc7XG5pbXBvcnQgeyBNYXRTb3J0TW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvc29ydCc7XG5pbXBvcnQgeyBNYXRUYWJsZU1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL3RhYmxlJztcbmltcG9ydCB7IE1hdFRvb2x0aXBNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC90b29sdGlwJztcbmltcG9ydCB7IE1hdENvbHVtblJlc2l6ZU1vZHVsZSB9IGZyb20gJy4vY29sdW1uLXJlc2l6ZS9jb2x1bW4tcmVzaXplLW1vZHVsZSc7XG5cbmltcG9ydCB7IE10eFBpcGVzTW9kdWxlIH0gZnJvbSAnQG5nLW1hdGVyby9leHRlbnNpb25zL2NvcmUnO1xuaW1wb3J0IHsgTXR4RGlhbG9nTW9kdWxlIH0gZnJvbSAnQG5nLW1hdGVyby9leHRlbnNpb25zL2RpYWxvZyc7XG5pbXBvcnQgeyBNdHhHcmlkQ2VsbCB9IGZyb20gJy4vY2VsbCc7XG5pbXBvcnQgeyBNdHhHcmlkQ29sdW1uTWVudSB9IGZyb20gJy4vY29sdW1uLW1lbnUnO1xuaW1wb3J0IHsgTXR4R3JpZEV4cGFuc2lvblRvZ2dsZSB9IGZyb20gJy4vZXhwYW5zaW9uLXRvZ2dsZSc7XG5pbXBvcnQgeyBNdHhHcmlkIH0gZnJvbSAnLi9ncmlkJztcbmltcG9ydCB7XG4gIE10eEdyaWRDZWxsQWN0aW9uQmFkZ2VQaXBlLFxuICBNdHhHcmlkQ2VsbEFjdGlvbkRpc2FibGVQaXBlLFxuICBNdHhHcmlkQ2VsbEFjdGlvblRvb2x0aXBQaXBlLFxuICBNdHhHcmlkQ2VsbEFjdGlvbnNQaXBlLFxuICBNdHhHcmlkQ2VsbFN1bW1hcnlQaXBlLFxuICBNdHhHcmlkQ29sQ2xhc3NQaXBlLFxuICBNdHhHcmlkUm93Q2xhc3NQaXBlLFxufSBmcm9tICcuL2dyaWQtcGlwZXMnO1xuaW1wb3J0IHsgTXR4R3JpZFV0aWxzIH0gZnJvbSAnLi9ncmlkLXV0aWxzJztcbmltcG9ydCB7IE10eEdyaWRTZWxlY3RhYmxlQ2VsbCB9IGZyb20gJy4vc2VsZWN0YWJsZS1jZWxsJztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW1xuICAgIENvbW1vbk1vZHVsZSxcbiAgICBGb3Jtc01vZHVsZSxcbiAgICBNYXRUYWJsZU1vZHVsZSxcbiAgICBNYXRTb3J0TW9kdWxlLFxuICAgIE1hdFBhZ2luYXRvck1vZHVsZSxcbiAgICBNYXRDaGVja2JveE1vZHVsZSxcbiAgICBNYXRCdXR0b25Nb2R1bGUsXG4gICAgTWF0UHJvZ3Jlc3NCYXJNb2R1bGUsXG4gICAgTWF0Q2hpcHNNb2R1bGUsXG4gICAgTWF0VG9vbHRpcE1vZHVsZSxcbiAgICBNYXRCYWRnZU1vZHVsZSxcbiAgICBNYXRJY29uTW9kdWxlLFxuICAgIE1hdFNlbGVjdE1vZHVsZSxcbiAgICBNYXRGb3JtRmllbGRNb2R1bGUsXG4gICAgTWF0TWVudU1vZHVsZSxcbiAgICBEcmFnRHJvcE1vZHVsZSxcbiAgICBNdHhEaWFsb2dNb2R1bGUsXG4gICAgTXR4UGlwZXNNb2R1bGUsXG4gICAgTWF0Q29sdW1uUmVzaXplTW9kdWxlLFxuICAgIE10eEdyaWQsXG4gICAgTXR4R3JpZENlbGwsXG4gICAgTXR4R3JpZENvbHVtbk1lbnUsXG4gICAgTXR4R3JpZEV4cGFuc2lvblRvZ2dsZSxcbiAgICBNdHhHcmlkU2VsZWN0YWJsZUNlbGwsXG4gICAgTXR4R3JpZFJvd0NsYXNzUGlwZSxcbiAgICBNdHhHcmlkQ29sQ2xhc3NQaXBlLFxuICAgIE10eEdyaWRDZWxsQWN0aW9uc1BpcGUsXG4gICAgTXR4R3JpZENlbGxBY3Rpb25Ub29sdGlwUGlwZSxcbiAgICBNdHhHcmlkQ2VsbEFjdGlvbkJhZGdlUGlwZSxcbiAgICBNdHhHcmlkQ2VsbEFjdGlvbkRpc2FibGVQaXBlLFxuICAgIE10eEdyaWRDZWxsU3VtbWFyeVBpcGUsXG4gIF0sXG4gIGV4cG9ydHM6IFtcbiAgICBNYXRDb2x1bW5SZXNpemVNb2R1bGUsXG4gICAgTXR4R3JpZCxcbiAgICBNdHhHcmlkQ2VsbCxcbiAgICBNdHhHcmlkQ29sdW1uTWVudSxcbiAgICBNdHhHcmlkRXhwYW5zaW9uVG9nZ2xlLFxuICAgIE10eEdyaWRTZWxlY3RhYmxlQ2VsbCxcbiAgICBNdHhHcmlkUm93Q2xhc3NQaXBlLFxuICAgIE10eEdyaWRDb2xDbGFzc1BpcGUsXG4gICAgTXR4R3JpZENlbGxBY3Rpb25zUGlwZSxcbiAgICBNdHhHcmlkQ2VsbEFjdGlvblRvb2x0aXBQaXBlLFxuICAgIE10eEdyaWRDZWxsQWN0aW9uQmFkZ2VQaXBlLFxuICAgIE10eEdyaWRDZWxsQWN0aW9uRGlzYWJsZVBpcGUsXG4gICAgTXR4R3JpZENlbGxTdW1tYXJ5UGlwZSxcbiAgXSxcbiAgcHJvdmlkZXJzOiBbTXR4R3JpZFV0aWxzXSxcbn0pXG5leHBvcnQgY2xhc3MgTXR4R3JpZE1vZHVsZSB7fVxuIl19