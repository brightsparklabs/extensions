import { Injectable } from '@angular/core';
import { MtxDialogContainer } from './dialog-container';
import * as i0 from "@angular/core";
import * as i1 from "@angular/material/dialog";
const defaults = {
    title: '',
    description: '',
    buttons: [
        {
            color: 'warn',
            text: 'OK',
            focusInitial: true,
            onClick: () => { },
        },
        {
            text: 'CLOSE',
            onClick: () => { },
        },
    ],
    showCloseIcon: false,
    disableClose: true,
    width: '300px',
};
export class MtxDialog {
    constructor(dialog) {
        this.dialog = dialog;
    }
    originalOpen(componentOrTemplateRef = MtxDialogContainer, config) {
        return this.dialog.open(componentOrTemplateRef, config);
    }
    open(config, componentOrTemplateRef = MtxDialogContainer) {
        const data = Object.assign({}, defaults, config);
        return this.dialog.open(componentOrTemplateRef, {
            ...data,
            data,
        });
    }
    alert(title, description = '', onOk = () => { }) {
        this.open({
            title,
            description,
            buttons: [
                {
                    color: 'warn',
                    text: 'OK',
                    onClick: () => onOk(),
                },
            ],
        });
    }
    confirm(title, description = '', onOk = () => { }, onClose = () => { }) {
        this.open({
            title,
            description,
            buttons: [
                {
                    color: 'warn',
                    text: 'OK',
                    onClick: () => onOk(),
                },
                {
                    text: 'CLOSE',
                    onClick: () => onClose(),
                },
            ],
        });
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxDialog, deps: [{ token: i1.MatDialog }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxDialog, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxDialog, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: i1.MatDialog }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvZXh0ZW5zaW9ucy9kaWFsb2cvZGlhbG9nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQWUsTUFBTSxlQUFlLENBQUM7QUFLeEQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sb0JBQW9CLENBQUM7OztBQUd4RCxNQUFNLFFBQVEsR0FBa0I7SUFDOUIsS0FBSyxFQUFFLEVBQUU7SUFDVCxXQUFXLEVBQUUsRUFBRTtJQUNmLE9BQU8sRUFBRTtRQUNQO1lBQ0UsS0FBSyxFQUFFLE1BQU07WUFDYixJQUFJLEVBQUUsSUFBSTtZQUNWLFlBQVksRUFBRSxJQUFJO1lBQ2xCLE9BQU8sRUFBRSxHQUFHLEVBQUUsR0FBRSxDQUFDO1NBQ2xCO1FBQ0Q7WUFDRSxJQUFJLEVBQUUsT0FBTztZQUNiLE9BQU8sRUFBRSxHQUFHLEVBQUUsR0FBRSxDQUFDO1NBQ2xCO0tBQ0Y7SUFDRCxhQUFhLEVBQUUsS0FBSztJQUNwQixZQUFZLEVBQUUsSUFBSTtJQUNsQixLQUFLLEVBQUUsT0FBTztDQUNmLENBQUM7QUFHRixNQUFNLE9BQU8sU0FBUztJQUNwQixZQUFtQixNQUFpQjtRQUFqQixXQUFNLEdBQU4sTUFBTSxDQUFXO0lBQUcsQ0FBQztJQUV4QyxZQUFZLENBQ1YseUJBQWdFLGtCQUFrQixFQUNsRixNQUFXO1FBRVgsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUMxRCxDQUFDO0lBRUQsSUFBSSxDQUNGLE1BQXFCLEVBQ3JCLHlCQUFnRSxrQkFBa0I7UUFFbEYsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ2pELE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsc0JBQXNCLEVBQUU7WUFDOUMsR0FBRyxJQUFJO1lBQ1AsSUFBSTtTQUNMLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxLQUFLLENBQ0gsS0FBa0MsRUFDbEMsY0FBMkMsRUFBRSxFQUM3QyxJQUFJLEdBQUcsR0FBRyxFQUFFLEdBQUUsQ0FBQztRQUVmLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDUixLQUFLO1lBQ0wsV0FBVztZQUNYLE9BQU8sRUFBRTtnQkFDUDtvQkFDRSxLQUFLLEVBQUUsTUFBTTtvQkFDYixJQUFJLEVBQUUsSUFBSTtvQkFDVixPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxFQUFFO2lCQUN0QjthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELE9BQU8sQ0FDTCxLQUFrQyxFQUNsQyxjQUEyQyxFQUFFLEVBQzdDLElBQUksR0FBRyxHQUFHLEVBQUUsR0FBRSxDQUFDLEVBQ2YsT0FBTyxHQUFHLEdBQUcsRUFBRSxHQUFFLENBQUM7UUFFbEIsSUFBSSxDQUFDLElBQUksQ0FBQztZQUNSLEtBQUs7WUFDTCxXQUFXO1lBQ1gsT0FBTyxFQUFFO2dCQUNQO29CQUNFLEtBQUssRUFBRSxNQUFNO29CQUNiLElBQUksRUFBRSxJQUFJO29CQUNWLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLEVBQUU7aUJBQ3RCO2dCQUNEO29CQUNFLElBQUksRUFBRSxPQUFPO29CQUNiLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxPQUFPLEVBQUU7aUJBQ3pCO2FBQ0Y7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDO2lJQTVEVSxTQUFTO3FJQUFULFNBQVMsY0FESSxNQUFNOzsyRkFDbkIsU0FBUztrQkFEckIsVUFBVTttQkFBQyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBUZW1wbGF0ZVJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29tcG9uZW50VHlwZSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wb3J0YWwnO1xuaW1wb3J0IHsgTWF0RGlhbG9nIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZGlhbG9nJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgTXR4RGlhbG9nQ29udGFpbmVyIH0gZnJvbSAnLi9kaWFsb2ctY29udGFpbmVyJztcbmltcG9ydCB7IE10eERpYWxvZ0RhdGEgfSBmcm9tICcuL2RpYWxvZy1jb25maWcnO1xuXG5jb25zdCBkZWZhdWx0czogTXR4RGlhbG9nRGF0YSA9IHtcbiAgdGl0bGU6ICcnLFxuICBkZXNjcmlwdGlvbjogJycsXG4gIGJ1dHRvbnM6IFtcbiAgICB7XG4gICAgICBjb2xvcjogJ3dhcm4nLFxuICAgICAgdGV4dDogJ09LJyxcbiAgICAgIGZvY3VzSW5pdGlhbDogdHJ1ZSxcbiAgICAgIG9uQ2xpY2s6ICgpID0+IHt9LFxuICAgIH0sXG4gICAge1xuICAgICAgdGV4dDogJ0NMT1NFJyxcbiAgICAgIG9uQ2xpY2s6ICgpID0+IHt9LFxuICAgIH0sXG4gIF0sXG4gIHNob3dDbG9zZUljb246IGZhbHNlLFxuICBkaXNhYmxlQ2xvc2U6IHRydWUsXG4gIHdpZHRoOiAnMzAwcHgnLFxufTtcblxuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiAncm9vdCcgfSlcbmV4cG9ydCBjbGFzcyBNdHhEaWFsb2cge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgZGlhbG9nOiBNYXREaWFsb2cpIHt9XG5cbiAgb3JpZ2luYWxPcGVuKFxuICAgIGNvbXBvbmVudE9yVGVtcGxhdGVSZWY6IENvbXBvbmVudFR5cGU8YW55PiB8IFRlbXBsYXRlUmVmPGFueT4gPSBNdHhEaWFsb2dDb250YWluZXIsXG4gICAgY29uZmlnOiBhbnlcbiAgKSB7XG4gICAgcmV0dXJuIHRoaXMuZGlhbG9nLm9wZW4oY29tcG9uZW50T3JUZW1wbGF0ZVJlZiwgY29uZmlnKTtcbiAgfVxuXG4gIG9wZW4oXG4gICAgY29uZmlnOiBNdHhEaWFsb2dEYXRhLFxuICAgIGNvbXBvbmVudE9yVGVtcGxhdGVSZWY6IENvbXBvbmVudFR5cGU8YW55PiB8IFRlbXBsYXRlUmVmPGFueT4gPSBNdHhEaWFsb2dDb250YWluZXJcbiAgKSB7XG4gICAgY29uc3QgZGF0YSA9IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRzLCBjb25maWcpO1xuICAgIHJldHVybiB0aGlzLmRpYWxvZy5vcGVuKGNvbXBvbmVudE9yVGVtcGxhdGVSZWYsIHtcbiAgICAgIC4uLmRhdGEsXG4gICAgICBkYXRhLFxuICAgIH0pO1xuICB9XG5cbiAgYWxlcnQoXG4gICAgdGl0bGU6IHN0cmluZyB8IE9ic2VydmFibGU8c3RyaW5nPixcbiAgICBkZXNjcmlwdGlvbjogc3RyaW5nIHwgT2JzZXJ2YWJsZTxzdHJpbmc+ID0gJycsXG4gICAgb25PayA9ICgpID0+IHt9XG4gICkge1xuICAgIHRoaXMub3Blbih7XG4gICAgICB0aXRsZSxcbiAgICAgIGRlc2NyaXB0aW9uLFxuICAgICAgYnV0dG9uczogW1xuICAgICAgICB7XG4gICAgICAgICAgY29sb3I6ICd3YXJuJyxcbiAgICAgICAgICB0ZXh0OiAnT0snLFxuICAgICAgICAgIG9uQ2xpY2s6ICgpID0+IG9uT2soKSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH1cblxuICBjb25maXJtKFxuICAgIHRpdGxlOiBzdHJpbmcgfCBPYnNlcnZhYmxlPHN0cmluZz4sXG4gICAgZGVzY3JpcHRpb246IHN0cmluZyB8IE9ic2VydmFibGU8c3RyaW5nPiA9ICcnLFxuICAgIG9uT2sgPSAoKSA9PiB7fSxcbiAgICBvbkNsb3NlID0gKCkgPT4ge31cbiAgKSB7XG4gICAgdGhpcy5vcGVuKHtcbiAgICAgIHRpdGxlLFxuICAgICAgZGVzY3JpcHRpb24sXG4gICAgICBidXR0b25zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBjb2xvcjogJ3dhcm4nLFxuICAgICAgICAgIHRleHQ6ICdPSycsXG4gICAgICAgICAgb25DbGljazogKCkgPT4gb25PaygpLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdGV4dDogJ0NMT1NFJyxcbiAgICAgICAgICBvbkNsaWNrOiAoKSA9PiBvbkNsb3NlKCksXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9XG59XG4iXX0=