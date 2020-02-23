import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: 'input[appOnlyNumber]'
})
export class OnlyNumberDirective {
  constructor(private readonly el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event) {
    const initalValue = this.el.nativeElement.value;
    this.el.nativeElement.value = initalValue.replace(/[^0-9]*/g, '');
    if ( initalValue !== this.el.nativeElement.value) {
      event.stopPropagation();
    }
  }

}
