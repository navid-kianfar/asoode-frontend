import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: 'input[appOnlyNumber]',
})
export class OnlyNumberDirective {
  @Input() appOnlyNumber: boolean;
  constructor(private readonly el: ElementRef) {}

  @HostListener('input', ['$event']) onInputChange(event) {
    if (this.appOnlyNumber === true) {
      const initalValue = this.el.nativeElement.value;
      this.el.nativeElement.value = initalValue.replace(/[^0-9]*/g, '');
      if (initalValue !== this.el.nativeElement.value) {
        event.stopPropagation();
      }
    }
  }
}
