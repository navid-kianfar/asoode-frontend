import {
  Directive,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[ctrl-click]',
})
export class CtrlClickDirective implements OnInit, OnDestroy {
  private unsubscribe: any;

  // tslint:disable-next-line:no-output-rename
  @Output('ctrl-click') ctrlClickEvent = new EventEmitter();

  constructor(
    private readonly renderer: Renderer2,
    private readonly element: ElementRef,
  ) {}

  ngOnInit() {
    this.unsubscribe = this.renderer.listen(
      this.element.nativeElement,
      'click',
      (event) => {
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          event.stopPropagation();
          // unselect accidentally selected text (browser default behaviour)
          document.getSelection().removeAllRanges();

          this.ctrlClickEvent.emit(event);
        }
      },
    );
  }

  ngOnDestroy() {
    if (!this.unsubscribe) {
      return;
    }
    this.unsubscribe();
  }
}
