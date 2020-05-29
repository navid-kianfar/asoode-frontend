import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnInit,
} from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import {NumberHelpers} from '../../helpers/number.helpers';

@Directive({
  selector: 'input[appOnlyNumber]',
})
export class OnlyNumberDirective implements OnInit {
  constructor(
    readonly elementRef: ElementRef,
    readonly detector: DeviceDetectorService,
  ) {}

  @Input() appOnlyNumber: boolean;
  @Input() appDecimalNumber: boolean;

  ngOnInit(): void {
    if (!this.detector.isDesktop() && this.appOnlyNumber) {
      this.elementRef.nativeElement.setAttribute('pattern', '[0-9]*');
      this.elementRef.nativeElement.setAttribute('inputmode', 'numeric');
      // this.elementRef.nativeElement.setAttribute('type', 'number');
    }

    // this.setInputFilter(this.elementRef.nativeElement, (value) => {
    //   return /^-?\d*[.,]?\d*$/.test(value) || /[٠-٩]|\./.test(value) || /[۰-۹]|\./.test(value);
    // });
  }
  //
  // setInputFilter(textbox, inputFilter) {
  //   ['input', 'keydown', 'keyup', 'mousedown', 'mouseup', 'select', 'contextmenu', 'drop']
  //     .forEach((event) => {
  //     textbox.addEventListener(event, function() {
  //       if (inputFilter(this.value)) {
  //         this.oldValue = NumberHelpers.clearNumbers(this.value);
  //         this.oldSelectionStart = this.selectionStart;
  //         this.oldSelectionEnd = this.selectionEnd;
  //       } else if (this.hasOwnProperty('oldValue')) {
  //         this.value = this.oldValue;
  //         this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
  //       } else {
  //         this.value = '';
  //       }
  //     });
  //   });
  // }

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
      : (/^-?\d*[.,]?\d*$/.test(e.key) || /[٠-٩]|\./.test(e.key) || /[۰-۹]|\./.test(e.key));
  }
}
