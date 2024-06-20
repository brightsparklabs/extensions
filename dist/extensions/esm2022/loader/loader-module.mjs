import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MtxLoader } from './loader';
import * as i0 from "@angular/core";
export class MtxLoaderModule {
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxLoaderModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    /** @nocollapse */ static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.0.1", ngImport: i0, type: MtxLoaderModule, imports: [CommonModule, MatProgressSpinnerModule, MatProgressBarModule, MtxLoader], exports: [MtxLoader] }); }
    /** @nocollapse */ static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxLoaderModule, imports: [CommonModule, MatProgressSpinnerModule, MatProgressBarModule, MtxLoader] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxLoaderModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, MatProgressSpinnerModule, MatProgressBarModule, MtxLoader],
                    exports: [MtxLoader],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hZGVyLW1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2V4dGVuc2lvbnMvbG9hZGVyL2xvYWRlci1tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDdEUsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sb0NBQW9DLENBQUM7QUFFOUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLFVBQVUsQ0FBQzs7QUFNckMsTUFBTSxPQUFPLGVBQWU7aUlBQWYsZUFBZTtrSUFBZixlQUFlLFlBSGhCLFlBQVksRUFBRSx3QkFBd0IsRUFBRSxvQkFBb0IsRUFBRSxTQUFTLGFBQ3ZFLFNBQVM7a0lBRVIsZUFBZSxZQUhoQixZQUFZLEVBQUUsd0JBQXdCLEVBQUUsb0JBQW9CLEVBQUUsU0FBUzs7MkZBR3RFLGVBQWU7a0JBSjNCLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLHdCQUF3QixFQUFFLG9CQUFvQixFQUFFLFNBQVMsQ0FBQztvQkFDbEYsT0FBTyxFQUFFLENBQUMsU0FBUyxDQUFDO2lCQUNyQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgTWF0UHJvZ3Jlc3NCYXJNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9wcm9ncmVzcy1iYXInO1xuaW1wb3J0IHsgTWF0UHJvZ3Jlc3NTcGlubmVyTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvcHJvZ3Jlc3Mtc3Bpbm5lcic7XG5cbmltcG9ydCB7IE10eExvYWRlciB9IGZyb20gJy4vbG9hZGVyJztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgTWF0UHJvZ3Jlc3NTcGlubmVyTW9kdWxlLCBNYXRQcm9ncmVzc0Jhck1vZHVsZSwgTXR4TG9hZGVyXSxcbiAgZXhwb3J0czogW010eExvYWRlcl0sXG59KVxuZXhwb3J0IGNsYXNzIE10eExvYWRlck1vZHVsZSB7fVxuIl19