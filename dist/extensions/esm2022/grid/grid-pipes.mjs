import { Pipe } from '@angular/core';
import { isObservable } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "./grid-utils";
export class MtxGridColClassPipe {
    transform(colDef, rowData, rowChangeRecord, currentValue) {
        if (typeof colDef.class === 'string') {
            return colDef.class;
        }
        else if (typeof colDef.class === 'function') {
            return colDef.class(rowData, colDef);
        }
        return '';
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxGridColClassPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    /** @nocollapse */ static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "18.0.1", ngImport: i0, type: MtxGridColClassPipe, isStandalone: true, name: "colClass" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxGridColClassPipe, decorators: [{
            type: Pipe,
            args: [{ name: 'colClass', standalone: true }]
        }] });
export class MtxGridRowClassPipe {
    transform(rowData, index, dataIndex, rowClassFormatter) {
        const rowIndex = index === undefined ? dataIndex : index;
        const classList = rowIndex % 2 === 1 ? ['mat-row-odd'] : [];
        if (rowClassFormatter) {
            for (const key of Object.keys(rowClassFormatter)) {
                if (rowClassFormatter[key](rowData, rowIndex)) {
                    classList.push(key);
                }
            }
        }
        return classList.join(' ');
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxGridRowClassPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    /** @nocollapse */ static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "18.0.1", ngImport: i0, type: MtxGridRowClassPipe, isStandalone: true, name: "rowClass" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxGridRowClassPipe, decorators: [{
            type: Pipe,
            args: [{ name: 'rowClass', standalone: true }]
        }] });
export class MtxGridCellActionsPipe {
    transform(btns, rowData, rowChangeRecord, currentValue) {
        if (typeof btns === 'function') {
            return btns(rowData);
        }
        else if (Array.isArray(btns)) {
            return btns;
        }
        return [];
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxGridCellActionsPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    /** @nocollapse */ static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "18.0.1", ngImport: i0, type: MtxGridCellActionsPipe, isStandalone: true, name: "cellActions" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxGridCellActionsPipe, decorators: [{
            type: Pipe,
            args: [{ name: 'cellActions', standalone: true }]
        }] });
export class MtxGridCellActionTooltipPipe {
    transform(btn) {
        if (typeof btn.tooltip === 'string' || isObservable(btn.tooltip)) {
            return { message: btn.tooltip };
        }
        else {
            return btn.tooltip || { message: '' };
        }
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxGridCellActionTooltipPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    /** @nocollapse */ static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "18.0.1", ngImport: i0, type: MtxGridCellActionTooltipPipe, isStandalone: true, name: "cellActionTooltip" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxGridCellActionTooltipPipe, decorators: [{
            type: Pipe,
            args: [{ name: 'cellActionTooltip', standalone: true }]
        }] });
export class MtxGridCellActionBadgePipe {
    transform(btn) {
        if (typeof btn.badge === 'number' || typeof btn.badge === 'string' || isObservable(btn.badge)) {
            return { content: btn.badge };
        }
        else {
            return btn.badge || { content: '' };
        }
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxGridCellActionBadgePipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    /** @nocollapse */ static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "18.0.1", ngImport: i0, type: MtxGridCellActionBadgePipe, isStandalone: true, name: "cellActionBadge" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxGridCellActionBadgePipe, decorators: [{
            type: Pipe,
            args: [{ name: 'cellActionBadge', standalone: true }]
        }] });
export class MtxGridCellActionDisablePipe {
    transform(btn, rowData, rowChangeRecord, currentValue) {
        if (typeof btn.disabled === 'boolean') {
            return btn.disabled;
        }
        else if (typeof btn.disabled === 'function') {
            return btn.disabled(rowData);
        }
        else {
            return false;
        }
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxGridCellActionDisablePipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    /** @nocollapse */ static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "18.0.1", ngImport: i0, type: MtxGridCellActionDisablePipe, isStandalone: true, name: "cellActionDisable" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxGridCellActionDisablePipe, decorators: [{
            type: Pipe,
            args: [{ name: 'cellActionDisable', standalone: true }]
        }] });
export class MtxGridCellSummaryPipe {
    constructor(utils) {
        this.utils = utils;
    }
    transform(data, colDef) {
        if (typeof colDef.summary === 'string') {
            return colDef.summary;
        }
        else if (typeof colDef.summary === 'function') {
            return colDef.summary(this.utils.getColData(data, colDef), colDef);
        }
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxGridCellSummaryPipe, deps: [{ token: i1.MtxGridUtils }], target: i0.ɵɵFactoryTarget.Pipe }); }
    /** @nocollapse */ static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "18.0.1", ngImport: i0, type: MtxGridCellSummaryPipe, isStandalone: true, name: "cellSummary" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MtxGridCellSummaryPipe, decorators: [{
            type: Pipe,
            args: [{ name: 'cellSummary', standalone: true }]
        }], ctorParameters: () => [{ type: i1.MtxGridUtils }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC1waXBlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2V4dGVuc2lvbnMvZ3JpZC9ncmlkLXBpcGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBd0IsSUFBSSxFQUFpQixNQUFNLGVBQWUsQ0FBQztBQUMxRSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sTUFBTSxDQUFDOzs7QUFLcEMsTUFBTSxPQUFPLG1CQUFtQjtJQUM5QixTQUFTLENBQ1AsTUFBcUIsRUFDckIsT0FBNkIsRUFDN0IsZUFBbUQsRUFDbkQsWUFBa0I7UUFFbEIsSUFBSSxPQUFPLE1BQU0sQ0FBQyxLQUFLLEtBQUssUUFBUSxFQUFFLENBQUM7WUFDckMsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ3RCLENBQUM7YUFBTSxJQUFJLE9BQU8sTUFBTSxDQUFDLEtBQUssS0FBSyxVQUFVLEVBQUUsQ0FBQztZQUM5QyxPQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZDLENBQUM7UUFDRCxPQUFPLEVBQUUsQ0FBQztJQUNaLENBQUM7aUlBYlUsbUJBQW1COytIQUFuQixtQkFBbUI7OzJGQUFuQixtQkFBbUI7a0JBRC9CLElBQUk7bUJBQUMsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUU7O0FBa0I1QyxNQUFNLE9BQU8sbUJBQW1CO0lBQzlCLFNBQVMsQ0FDUCxPQUE0QixFQUM1QixLQUF5QixFQUN6QixTQUFpQixFQUNqQixpQkFBNEM7UUFFNUMsTUFBTSxRQUFRLEdBQUcsS0FBSyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFDekQsTUFBTSxTQUFTLEdBQWEsUUFBUSxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FB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YUFBTSxJQUFJLE9BQU8sR0FBRyxDQUFDLFFBQVEsS0FBSyxVQUFVLEVBQUUsQ0FBQztZQUM5QyxPQUFPLEdBQUcsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDL0IsQ0FBQzthQUFNLENBQUM7WUFDTixPQUFPLEtBQUssQ0FBQztRQUNmLENBQUM7SUFDSCxDQUFDO2lJQWRVLDRCQUE0QjsrSEFBNUIsNEJBQTRCOzsyRkFBNUIsNEJBQTRCO2tCQUR4QyxJQUFJO21CQUFDLEVBQUUsSUFBSSxFQUFFLG1CQUFtQixFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUU7O0FBbUJyRCxNQUFNLE9BQU8sc0JBQXNCO0lBQ2pDLFlBQW9CLEtBQW1CO1FBQW5CLFVBQUssR0FBTCxLQUFLLENBQWM7SUFBRyxDQUFDO0lBQzNDLFNBQVMsQ0FBQyxJQUFXLEVBQUUsTUFBcUI7UUFDMUMsSUFBSSxPQUFPLE1BQU0sQ0FBQyxPQUFPLEtBQUssUUFBUSxFQUFFLENBQUM7WUFDdkMsT0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDO1FBQ3hCLENBQUM7YUFBTSxJQUFJLE9BQU8sTUFBTSxDQUFDLE9BQU8sS0FBSyxVQUFVLEVBQUUsQ0FBQztZQUNoRCxPQUFRLE1BQU0sQ0FBQyxPQUF3RCxDQUNyRSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLEVBQ25DLE1BQU0sQ0FDUCxDQUFDO1FBQ0osQ0FBQztJQUNILENBQUM7aUlBWFUsc0JBQXNCOytIQUF0QixzQkFBc0I7OzJGQUF0QixzQkFBc0I7a0JBRGxDLElBQUk7bUJBQUMsRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBLZXlWYWx1ZUNoYW5nZVJlY29yZCwgUGlwZSwgUGlwZVRyYW5zZm9ybSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgaXNPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBNdHhHcmlkVXRpbHMgfSBmcm9tICcuL2dyaWQtdXRpbHMnO1xuaW1wb3J0IHsgTXR4R3JpZENvbHVtbiwgTXR4R3JpZENvbHVtbkJ1dHRvbiwgTXR4R3JpZFJvd0NsYXNzRm9ybWF0dGVyIH0gZnJvbSAnLi9pbnRlcmZhY2VzJztcblxuQFBpcGUoeyBuYW1lOiAnY29sQ2xhc3MnLCBzdGFuZGFsb25lOiB0cnVlIH0pXG5leHBvcnQgY2xhc3MgTXR4R3JpZENvbENsYXNzUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xuICB0cmFuc2Zvcm0oXG4gICAgY29sRGVmOiBNdHhHcmlkQ29sdW1uLFxuICAgIHJvd0RhdGE/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+LFxuICAgIHJvd0NoYW5nZVJlY29yZD86IEtleVZhbHVlQ2hhbmdlUmVjb3JkPHN0cmluZywgYW55PixcbiAgICBjdXJyZW50VmFsdWU/OiBhbnlcbiAgKSB7XG4gICAgaWYgKHR5cGVvZiBjb2xEZWYuY2xhc3MgPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gY29sRGVmLmNsYXNzO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGNvbERlZi5jbGFzcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIGNvbERlZi5jbGFzcyhyb3dEYXRhLCBjb2xEZWYpO1xuICAgIH1cbiAgICByZXR1cm4gJyc7XG4gIH1cbn1cblxuQFBpcGUoeyBuYW1lOiAncm93Q2xhc3MnLCBzdGFuZGFsb25lOiB0cnVlIH0pXG5leHBvcnQgY2xhc3MgTXR4R3JpZFJvd0NsYXNzUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xuICB0cmFuc2Zvcm0oXG4gICAgcm93RGF0YTogUmVjb3JkPHN0cmluZywgYW55PixcbiAgICBpbmRleDogbnVtYmVyIHwgdW5kZWZpbmVkLFxuICAgIGRhdGFJbmRleDogbnVtYmVyLFxuICAgIHJvd0NsYXNzRm9ybWF0dGVyPzogTXR4R3JpZFJvd0NsYXNzRm9ybWF0dGVyXG4gICkge1xuICAgIGNvbnN0IHJvd0luZGV4ID0gaW5kZXggPT09IHVuZGVmaW5lZCA/IGRhdGFJbmRleCA6IGluZGV4O1xuICAgIGNvbnN0IGNsYXNzTGlzdDogc3RyaW5nW10gPSByb3dJbmRleCAlIDIgPT09IDEgPyBbJ21hdC1yb3ctb2RkJ10gOiBbXTtcbiAgICBpZiAocm93Q2xhc3NGb3JtYXR0ZXIpIHtcbiAgICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKHJvd0NsYXNzRm9ybWF0dGVyKSkge1xuICAgICAgICBpZiAocm93Q2xhc3NGb3JtYXR0ZXJba2V5XShyb3dEYXRhLCByb3dJbmRleCkpIHtcbiAgICAgICAgICBjbGFzc0xpc3QucHVzaChrZXkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjbGFzc0xpc3Quam9pbignICcpO1xuICB9XG59XG5cbkBQaXBlKHsgbmFtZTogJ2NlbGxBY3Rpb25zJywgc3RhbmRhbG9uZTogdHJ1ZSB9KVxuZXhwb3J0IGNsYXNzIE10eEdyaWRDZWxsQWN0aW9uc1BpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcbiAgdHJhbnNmb3JtKFxuICAgIGJ0bnM/OiBNdHhHcmlkQ29sdW1uQnV0dG9uW10gfCAoKHJvd0RhdGE6IGFueSkgPT4gTXR4R3JpZENvbHVtbkJ1dHRvbltdKSxcbiAgICByb3dEYXRhPzogUmVjb3JkPHN0cmluZywgYW55PixcbiAgICByb3dDaGFuZ2VSZWNvcmQ/OiBLZXlWYWx1ZUNoYW5nZVJlY29yZDxzdHJpbmcsIGFueT4sXG4gICAgY3VycmVudFZhbHVlPzogYW55XG4gICkge1xuICAgIGlmICh0eXBlb2YgYnRucyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIGJ0bnMocm93RGF0YSk7XG4gICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGJ0bnMpKSB7XG4gICAgICByZXR1cm4gYnRucztcbiAgICB9XG4gICAgcmV0dXJuIFtdO1xuICB9XG59XG5cbkBQaXBlKHsgbmFtZTogJ2NlbGxBY3Rpb25Ub29sdGlwJywgc3RhbmRhbG9uZTogdHJ1ZSB9KVxuZXhwb3J0IGNsYXNzIE10eEdyaWRDZWxsQWN0aW9uVG9vbHRpcFBpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcbiAgdHJhbnNmb3JtKGJ0bjogTXR4R3JpZENvbHVtbkJ1dHRvbikge1xuICAgIGlmICh0eXBlb2YgYnRuLnRvb2x0aXAgPT09ICdzdHJpbmcnIHx8IGlzT2JzZXJ2YWJsZShidG4udG9vbHRpcCkpIHtcbiAgICAgIHJldHVybiB7IG1lc3NhZ2U6IGJ0bi50b29sdGlwIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBidG4udG9vbHRpcCB8fCB7IG1lc3NhZ2U6ICcnIH07XG4gICAgfVxuICB9XG59XG5cbkBQaXBlKHsgbmFtZTogJ2NlbGxBY3Rpb25CYWRnZScsIHN0YW5kYWxvbmU6IHRydWUgfSlcbmV4cG9ydCBjbGFzcyBNdHhHcmlkQ2VsbEFjdGlvbkJhZGdlUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xuICB0cmFuc2Zvcm0oYnRuOiBNdHhHcmlkQ29sdW1uQnV0dG9uKSB7XG4gICAgaWYgKHR5cGVvZiBidG4uYmFkZ2UgPT09ICdudW1iZXInIHx8IHR5cGVvZiBidG4uYmFkZ2UgPT09ICdzdHJpbmcnIHx8IGlzT2JzZXJ2YWJsZShidG4uYmFkZ2UpKSB7XG4gICAgICByZXR1cm4geyBjb250ZW50OiBidG4uYmFkZ2UgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGJ0bi5iYWRnZSB8fCB7IGNvbnRlbnQ6ICcnIH07XG4gICAgfVxuICB9XG59XG5cbkBQaXBlKHsgbmFtZTogJ2NlbGxBY3Rpb25EaXNhYmxlJywgc3RhbmRhbG9uZTogdHJ1ZSB9KVxuZXhwb3J0IGNsYXNzIE10eEdyaWRDZWxsQWN0aW9uRGlzYWJsZVBpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcbiAgdHJhbnNmb3JtKFxuICAgIGJ0bjogTXR4R3JpZENvbHVtbkJ1dHRvbixcbiAgICByb3dEYXRhOiBSZWNvcmQ8c3RyaW5nLCBhbnk+LFxuICAgIHJvd0NoYW5nZVJlY29yZD86IEtleVZhbHVlQ2hhbmdlUmVjb3JkPHN0cmluZywgYW55PixcbiAgICBjdXJyZW50VmFsdWU/OiBhbnlcbiAgKSB7XG4gICAgaWYgKHR5cGVvZiBidG4uZGlzYWJsZWQgPT09ICdib29sZWFuJykge1xuICAgICAgcmV0dXJuIGJ0bi5kaXNhYmxlZDtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBidG4uZGlzYWJsZWQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiBidG4uZGlzYWJsZWQocm93RGF0YSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbn1cblxuQFBpcGUoeyBuYW1lOiAnY2VsbFN1bW1hcnknLCBzdGFuZGFsb25lOiB0cnVlIH0pXG5leHBvcnQgY2xhc3MgTXR4R3JpZENlbGxTdW1tYXJ5UGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHV0aWxzOiBNdHhHcmlkVXRpbHMpIHt9XG4gIHRyYW5zZm9ybShkYXRhOiBhbnlbXSwgY29sRGVmOiBNdHhHcmlkQ29sdW1uKSB7XG4gICAgaWYgKHR5cGVvZiBjb2xEZWYuc3VtbWFyeSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBjb2xEZWYuc3VtbWFyeTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBjb2xEZWYuc3VtbWFyeSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIChjb2xEZWYuc3VtbWFyeSBhcyAoZGF0YTogYW55W10sIGNvbERlZj86IE10eEdyaWRDb2x1bW4pID0+IGFueSkoXG4gICAgICAgIHRoaXMudXRpbHMuZ2V0Q29sRGF0YShkYXRhLCBjb2xEZWYpLFxuICAgICAgICBjb2xEZWZcbiAgICAgICk7XG4gICAgfVxuICB9XG59XG4iXX0=