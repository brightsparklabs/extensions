/**
 * Configuration used when opening a drawer.
 */
export class MtxDrawerConfig {
    constructor() {
        /** Data being injected into the child component. */
        this.data = null;
        /** Whether the drawer has a backdrop. */
        this.hasBackdrop = true;
        /** Whether the user can use escape or clicking outside to close the drawer. */
        this.disableClose = false;
        /** Aria label to assign to the drawer element. */
        this.ariaLabel = null;
        /**
         * Whether the drawer should close when the user goes backwards/forwards in history.
         * Note that this usually doesn't include clicking on links (unless the user is using
         * the `HashLocationStrategy`).
         */
        this.closeOnNavigation = true;
        /**
         * Where the drawer should focus on open.
         * @breaking-change 14.0.0 Remove boolean option from autoFocus. Use string or
         * AutoFocusTarget instead.
         */
        // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
        this.autoFocus = 'first-tabbable';
        /**
         * Whether the drawer should restore focus to the
         * previously-focused element, after it's closed.
         */
        this.restoreFocus = true;
        /** Position of the drawer */
        this.position = 'right';
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhd2VyLWNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2V4dGVuc2lvbnMvZHJhd2VyL2RyYXdlci1jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBVUE7O0dBRUc7QUFDSCxNQUFNLE9BQU8sZUFBZTtJQUE1QjtRQVVFLG9EQUFvRDtRQUNwRCxTQUFJLEdBQWMsSUFBSSxDQUFDO1FBRXZCLHlDQUF5QztRQUN6QyxnQkFBVyxHQUFhLElBQUksQ0FBQztRQUs3QiwrRUFBK0U7UUFDL0UsaUJBQVksR0FBYSxLQUFLLENBQUM7UUFFL0Isa0RBQWtEO1FBQ2xELGNBQVMsR0FBbUIsSUFBSSxDQUFDO1FBRWpDOzs7O1dBSUc7UUFDSCxzQkFBaUIsR0FBYSxJQUFJLENBQUM7UUFFbkM7Ozs7V0FJRztRQUNILDZFQUE2RTtRQUM3RSxjQUFTLEdBQXdDLGdCQUFnQixDQUFDO1FBRWxFOzs7V0FHRztRQUNILGlCQUFZLEdBQWEsSUFBSSxDQUFDO1FBSzlCLDZCQUE2QjtRQUM3QixhQUFRLEdBQW9CLE9BQU8sQ0FBQztJQW1CdEMsQ0FBQztDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2JpZGknO1xuaW1wb3J0IHsgU2Nyb2xsU3RyYXRlZ3kgfSBmcm9tICdAYW5ndWxhci9jZGsvb3ZlcmxheSc7XG5pbXBvcnQgeyBWaWV3Q29udGFpbmVyUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbi8qKiBPcHRpb25zIGZvciB3aGVyZSB0byBzZXQgZm9jdXMgdG8gYXV0b21hdGljYWxseSBvbiBkaWFsb2cgb3BlbiAqL1xuZXhwb3J0IHR5cGUgQXV0b0ZvY3VzVGFyZ2V0ID0gJ2RpYWxvZycgfCAnZmlyc3QtdGFiYmFibGUnIHwgJ2ZpcnN0LWhlYWRpbmcnO1xuXG4vKiogUG9zc2libGUgb3ZlcnJpZGVzIGZvciBhIGRyYXdlcidzIHBvc2l0aW9uLiAqL1xuZXhwb3J0IHR5cGUgRHJhd2VyUG9zaXRpb24gPSAndG9wJyB8ICdib3R0b20nIHwgJ2xlZnQnIHwgJ3JpZ2h0JztcblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIHVzZWQgd2hlbiBvcGVuaW5nIGEgZHJhd2VyLlxuICovXG5leHBvcnQgY2xhc3MgTXR4RHJhd2VyQ29uZmlnPEQgPSBhbnk+IHtcbiAgLyoqIFRoZSB2aWV3IGNvbnRhaW5lciB0byBwbGFjZSB0aGUgb3ZlcmxheSBmb3IgdGhlIGRyYXdlciBpbnRvLiAqL1xuICB2aWV3Q29udGFpbmVyUmVmPzogVmlld0NvbnRhaW5lclJlZjtcblxuICAvKiogRXh0cmEgQ1NTIGNsYXNzZXMgdG8gYmUgYWRkZWQgdG8gdGhlIGRyYXdlciBjb250YWluZXIuICovXG4gIHBhbmVsQ2xhc3M/OiBzdHJpbmcgfCBzdHJpbmdbXTtcblxuICAvKiogVGV4dCBsYXlvdXQgZGlyZWN0aW9uIGZvciB0aGUgZHJhd2VyLiAqL1xuICBkaXJlY3Rpb24/OiBEaXJlY3Rpb247XG5cbiAgLyoqIERhdGEgYmVpbmcgaW5qZWN0ZWQgaW50byB0aGUgY2hpbGQgY29tcG9uZW50LiAqL1xuICBkYXRhPzogRCB8IG51bGwgPSBudWxsO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBkcmF3ZXIgaGFzIGEgYmFja2Ryb3AuICovXG4gIGhhc0JhY2tkcm9wPzogYm9vbGVhbiA9IHRydWU7XG5cbiAgLyoqIEN1c3RvbSBjbGFzcyBmb3IgdGhlIGJhY2tkcm9wLiAqL1xuICBiYWNrZHJvcENsYXNzPzogc3RyaW5nO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSB1c2VyIGNhbiB1c2UgZXNjYXBlIG9yIGNsaWNraW5nIG91dHNpZGUgdG8gY2xvc2UgdGhlIGRyYXdlci4gKi9cbiAgZGlzYWJsZUNsb3NlPzogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBBcmlhIGxhYmVsIHRvIGFzc2lnbiB0byB0aGUgZHJhd2VyIGVsZW1lbnQuICovXG4gIGFyaWFMYWJlbD86IHN0cmluZyB8IG51bGwgPSBudWxsO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBkcmF3ZXIgc2hvdWxkIGNsb3NlIHdoZW4gdGhlIHVzZXIgZ29lcyBiYWNrd2FyZHMvZm9yd2FyZHMgaW4gaGlzdG9yeS5cbiAgICogTm90ZSB0aGF0IHRoaXMgdXN1YWxseSBkb2Vzbid0IGluY2x1ZGUgY2xpY2tpbmcgb24gbGlua3MgKHVubGVzcyB0aGUgdXNlciBpcyB1c2luZ1xuICAgKiB0aGUgYEhhc2hMb2NhdGlvblN0cmF0ZWd5YCkuXG4gICAqL1xuICBjbG9zZU9uTmF2aWdhdGlvbj86IGJvb2xlYW4gPSB0cnVlO1xuXG4gIC8qKlxuICAgKiBXaGVyZSB0aGUgZHJhd2VyIHNob3VsZCBmb2N1cyBvbiBvcGVuLlxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDE0LjAuMCBSZW1vdmUgYm9vbGVhbiBvcHRpb24gZnJvbSBhdXRvRm9jdXMuIFVzZSBzdHJpbmcgb3JcbiAgICogQXV0b0ZvY3VzVGFyZ2V0IGluc3RlYWQuXG4gICAqL1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXJlZHVuZGFudC10eXBlLWNvbnN0aXR1ZW50c1xuICBhdXRvRm9jdXM/OiBBdXRvRm9jdXNUYXJnZXQgfCBzdHJpbmcgfCBib29sZWFuID0gJ2ZpcnN0LXRhYmJhYmxlJztcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgZHJhd2VyIHNob3VsZCByZXN0b3JlIGZvY3VzIHRvIHRoZVxuICAgKiBwcmV2aW91c2x5LWZvY3VzZWQgZWxlbWVudCwgYWZ0ZXIgaXQncyBjbG9zZWQuXG4gICAqL1xuICByZXN0b3JlRm9jdXM/OiBib29sZWFuID0gdHJ1ZTtcblxuICAvKiogU2Nyb2xsIHN0cmF0ZWd5IHRvIGJlIHVzZWQgZm9yIHRoZSBkcmF3ZXIuICovXG4gIHNjcm9sbFN0cmF0ZWd5PzogU2Nyb2xsU3RyYXRlZ3k7XG5cbiAgLyoqIFBvc2l0aW9uIG9mIHRoZSBkcmF3ZXIgKi9cbiAgcG9zaXRpb24/OiBEcmF3ZXJQb3NpdGlvbiA9ICdyaWdodCc7XG5cbiAgLyoqIFdpZHRoIG9mIHRoZSBkcmF3ZXIuIElmIGEgbnVtYmVyIGlzIHByb3ZpZGVkLCBhc3N1bWVzIHBpeGVsIHVuaXRzLiAqL1xuICB3aWR0aD86IG51bWJlciB8IHN0cmluZztcblxuICAvKiogSGVpZ2h0IG9mIHRoZSBkcmF3ZXIuIElmIGEgbnVtYmVyIGlzIHByb3ZpZGVkLCBhc3N1bWVzIHBpeGVsIHVuaXRzLiAqL1xuICBoZWlnaHQ/OiBudW1iZXIgfCBzdHJpbmc7XG5cbiAgLyoqIE1pbi13aWR0aCBvZiB0aGUgZHJhd2VyLiBJZiBhIG51bWJlciBpcyBwcm92aWRlZCwgYXNzdW1lcyBwaXhlbCB1bml0cy4gKi9cbiAgbWluV2lkdGg/OiBudW1iZXIgfCBzdHJpbmc7XG5cbiAgLyoqIE1pbi1oZWlnaHQgb2YgdGhlIGRyYXdlci4gSWYgYSBudW1iZXIgaXMgcHJvdmlkZWQsIGFzc3VtZXMgcGl4ZWwgdW5pdHMuICovXG4gIG1pbkhlaWdodD86IG51bWJlciB8IHN0cmluZztcblxuICAvKiogTWF4LXdpZHRoIG9mIHRoZSBkcmF3ZXIuIElmIGEgbnVtYmVyIGlzIHByb3ZpZGVkLCBhc3N1bWVzIHBpeGVsIHVuaXRzLiAqL1xuICBtYXhXaWR0aD86IG51bWJlciB8IHN0cmluZztcblxuICAvKiogTWF4LWhlaWdodCBvZiB0aGUgZHJhd2VyLiBJZiBhIG51bWJlciBpcyBwcm92aWRlZCwgYXNzdW1lcyBwaXhlbCB1bml0cy4gKi9cbiAgbWF4SGVpZ2h0PzogbnVtYmVyIHwgc3RyaW5nO1xufVxuIl19