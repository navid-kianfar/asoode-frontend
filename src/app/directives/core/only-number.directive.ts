import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

@Directive({
  selector: 'input[appOnlyNumber]',
})
export class OnlyNumberDirective {
  constructor(
    readonly elementRef: ElementRef,
    readonly detector: DeviceDetectorService,
  ) {
    if (!this.detector.isDesktop()) {
      this.elementRef.nativeElement.setAttribute('pattern', '[0-9]*');
      this.elementRef.nativeElement.setAttribute('inputmode', 'numeric');
      // this.elementRef.nativeElement.setAttribute('type', 'number');
    }
  }

  @Input() appOnlyNumber: boolean;
  @Input() appDecimalNumber: boolean;

  @HostListener('keydown', ['$event'])
  onKeyDown(e: KeyboardEvent): boolean {
    if (!this.appOnlyNumber) {
      return true;
    }
    return e.keyCode === 8 ||
      e.keyCode === 37 ||
      e.keyCode === 39 ||
      (this.appDecimalNumber && e.key === '.')
      ? true
      : new RegExp('^\\d+$').test(e.key);
  }
}
