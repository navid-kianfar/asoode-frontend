import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-number',
  templateUrl: './number.component.html',
  styleUrls: ['./number.component.scss'],
})
export class NumberComponent implements OnInit, OnChanges {
  @Input() placeHolder: string;
  @Input() min: number;
  @Input() max: number;
  @Input() cssClass: string;
  @Input() label: string;
  @Input() autofocus: boolean;
  @Input() disabled: boolean;
  @Input() readonly: boolean;
  @Input() acceptDecimal: boolean;
  @Input() prependIcon: string;
  @Input() model: number;
  @Output() modelChange = new EventEmitter<number>();
  @Output() blur = new EventEmitter<any>();
  @Output() focus = new EventEmitter<any>();
  @ViewChild('numberInput', { static: false }) numberInput;
  focusState: string;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.model && changes.model.currentValue !== undefined) {
      const value = this.validateValue(changes.model.currentValue);
      if (value !== changes.model.currentValue) {
        this.model = value;
        this.modelChange.emit(value);
      }
    }
  }
  ngOnInit() {
    this.focusState = 'no-focus';
  }
  increase() {
    if (this.disabled || this.readonly) {
      return;
    }
    this.model = this.validateValue((this.model || 0) + 1);
    this.modelChange.emit(this.model);
  }
  decrease() {
    if (this.disabled || this.readonly) {
      return;
    }
    this.model = this.validateValue((this.model || 0) - 1);
    this.modelChange.emit(this.model);
  }
  validateValue(model: number): number {
    model = +model || (+model === 0 ? 0 : undefined);
    if (this.min !== undefined && model < this.min) {
      model = this.min;
    }
    if (this.max !== undefined && model > this.max) {
      model = this.max;
    }
    return model;
  }
  updateModel(model: any) {
    const validated = this.validateValue(model);
    if (model !== validated) {
      this.numberInput.nativeElement.value = validated;
    }
    this.model = validated;
    this.modelChange.emit(validated);
  }
  onKeyDown($event: KeyboardEvent) {
    if ($event.key === 'ArrowUp') {
      this.increase();
    } else if ($event.key === 'ArrowDown') {
      this.decrease();
    }
  }
  onFocus() {
    this.focusState = 'focus';
    this.focus.emit();
  }
  onBlur() {
    this.focusState = 'blur';
    this.blur.emit();
  }
  // changeModel($event: string) {
  //   const num = +$event;
  //   if (this.max && num > this.max) {
  //     this.model = this.max;
  //     this.modelChange.emit(this.model);
  //     return;
  //   }
  //   if (this.min && num < this.min) {
  //     this.model = this.min;
  //     this.modelChange.emit(this.model);
  //     return;
  //   }
  //   this.model = num;
  //   this.modelChange.emit(this.model);
  //   console.log(num);
  //   console.log(this.model);
  // }
}
