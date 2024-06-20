import { NgModule } from '@angular/core';
import { DateAdapter, NativeDateAdapter, NativeDateModule } from '@angular/material/core';
import { DatetimeAdapter } from './datetime-adapter';
import { MTX_DATETIME_FORMATS } from './datetime-formats';
import { NativeDatetimeAdapter } from './native-datetime-adapter';
import { MTX_NATIVE_DATETIME_FORMATS } from './native-datetime-formats';
import * as i0 from "@angular/core";
export class NativeDatetimeModule {
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: NativeDatetimeModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    /** @nocollapse */ static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.0.1", ngImport: i0, type: NativeDatetimeModule, imports: [NativeDateModule] }); }
    /** @nocollapse */ static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: NativeDatetimeModule, providers: [{ provide: DatetimeAdapter, useClass: NativeDatetimeAdapter }], imports: [NativeDateModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: NativeDatetimeModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [NativeDateModule],
                    providers: [{ provide: DatetimeAdapter, useClass: NativeDatetimeAdapter }],
                }]
        }] });
export function provideNativeDatetimeAdapter(formats = MTX_NATIVE_DATETIME_FORMATS) {
    return [
        { provide: DateAdapter, useClass: NativeDateAdapter },
        { provide: DatetimeAdapter, useClass: NativeDatetimeAdapter },
        { provide: MTX_DATETIME_FORMATS, useValue: formats },
    ];
}
export class MtxNativeDatetimeModule {
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxNativeDatetimeModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    /** @nocollapse */ static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.0.1", ngImport: i0, type: MtxNativeDatetimeModule }); }
    /** @nocollapse */ static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxNativeDatetimeModule, providers: [provideNativeDatetimeAdapter()] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxNativeDatetimeModule, decorators: [{
            type: NgModule,
            args: [{
                    providers: [provideNativeDatetimeAdapter()],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXRpbWUubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvZXh0ZW5zaW9ucy9jb3JlL2RhdGV0aW1lL2RhdGV0aW1lLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFZLE1BQU0sZUFBZSxDQUFDO0FBQ25ELE9BQU8sRUFBRSxXQUFXLEVBQUUsaUJBQWlCLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUMxRixPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDckQsT0FBTyxFQUFFLG9CQUFvQixFQUFzQixNQUFNLG9CQUFvQixDQUFDO0FBQzlFLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ2xFLE9BQU8sRUFBRSwyQkFBMkIsRUFBRSxNQUFNLDJCQUEyQixDQUFDOztBQU14RSxNQUFNLE9BQU8sb0JBQW9CO2lJQUFwQixvQkFBb0I7a0lBQXBCLG9CQUFvQixZQUhyQixnQkFBZ0I7a0lBR2Ysb0JBQW9CLGFBRnBCLENBQUMsRUFBRSxPQUFPLEVBQUUsZUFBZSxFQUFFLFFBQVEsRUFBRSxxQkFBcUIsRUFBRSxDQUFDLFlBRGhFLGdCQUFnQjs7MkZBR2Ysb0JBQW9CO2tCQUpoQyxRQUFRO21CQUFDO29CQUNSLE9BQU8sRUFBRSxDQUFDLGdCQUFnQixDQUFDO29CQUMzQixTQUFTLEVBQUUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxlQUFlLEVBQUUsUUFBUSxFQUFFLHFCQUFxQixFQUFFLENBQUM7aUJBQzNFOztBQUdELE1BQU0sVUFBVSw0QkFBNEIsQ0FDMUMsVUFBOEIsMkJBQTJCO0lBRXpELE9BQU87UUFDTCxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFFLGlCQUFpQixFQUFFO1FBQ3JELEVBQUUsT0FBTyxFQUFFLGVBQWUsRUFBRSxRQUFRLEVBQUUscUJBQXFCLEVBQUU7UUFDN0QsRUFBRSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRTtLQUNyRCxDQUFDO0FBQ0osQ0FBQztBQUtELE1BQU0sT0FBTyx1QkFBdUI7aUlBQXZCLHVCQUF1QjtrSUFBdkIsdUJBQXVCO2tJQUF2Qix1QkFBdUIsYUFGdkIsQ0FBQyw0QkFBNEIsRUFBRSxDQUFDOzsyRkFFaEMsdUJBQXVCO2tCQUhuQyxRQUFRO21CQUFDO29CQUNSLFNBQVMsRUFBRSxDQUFDLDRCQUE0QixFQUFFLENBQUM7aUJBQzVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUsIFByb3ZpZGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBEYXRlQWRhcHRlciwgTmF0aXZlRGF0ZUFkYXB0ZXIsIE5hdGl2ZURhdGVNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7IERhdGV0aW1lQWRhcHRlciB9IGZyb20gJy4vZGF0ZXRpbWUtYWRhcHRlcic7XG5pbXBvcnQgeyBNVFhfREFURVRJTUVfRk9STUFUUywgTXR4RGF0ZXRpbWVGb3JtYXRzIH0gZnJvbSAnLi9kYXRldGltZS1mb3JtYXRzJztcbmltcG9ydCB7IE5hdGl2ZURhdGV0aW1lQWRhcHRlciB9IGZyb20gJy4vbmF0aXZlLWRhdGV0aW1lLWFkYXB0ZXInO1xuaW1wb3J0IHsgTVRYX05BVElWRV9EQVRFVElNRV9GT1JNQVRTIH0gZnJvbSAnLi9uYXRpdmUtZGF0ZXRpbWUtZm9ybWF0cyc7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtOYXRpdmVEYXRlTW9kdWxlXSxcbiAgcHJvdmlkZXJzOiBbeyBwcm92aWRlOiBEYXRldGltZUFkYXB0ZXIsIHVzZUNsYXNzOiBOYXRpdmVEYXRldGltZUFkYXB0ZXIgfV0sXG59KVxuZXhwb3J0IGNsYXNzIE5hdGl2ZURhdGV0aW1lTW9kdWxlIHt9XG5cbmV4cG9ydCBmdW5jdGlvbiBwcm92aWRlTmF0aXZlRGF0ZXRpbWVBZGFwdGVyKFxuICBmb3JtYXRzOiBNdHhEYXRldGltZUZvcm1hdHMgPSBNVFhfTkFUSVZFX0RBVEVUSU1FX0ZPUk1BVFNcbik6IFByb3ZpZGVyW10ge1xuICByZXR1cm4gW1xuICAgIHsgcHJvdmlkZTogRGF0ZUFkYXB0ZXIsIHVzZUNsYXNzOiBOYXRpdmVEYXRlQWRhcHRlciB9LFxuICAgIHsgcHJvdmlkZTogRGF0ZXRpbWVBZGFwdGVyLCB1c2VDbGFzczogTmF0aXZlRGF0ZXRpbWVBZGFwdGVyIH0sXG4gICAgeyBwcm92aWRlOiBNVFhfREFURVRJTUVfRk9STUFUUywgdXNlVmFsdWU6IGZvcm1hdHMgfSxcbiAgXTtcbn1cblxuQE5nTW9kdWxlKHtcbiAgcHJvdmlkZXJzOiBbcHJvdmlkZU5hdGl2ZURhdGV0aW1lQWRhcHRlcigpXSxcbn0pXG5leHBvcnQgY2xhc3MgTXR4TmF0aXZlRGF0ZXRpbWVNb2R1bGUge31cbiJdfQ==