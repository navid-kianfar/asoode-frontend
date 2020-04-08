import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CultureService} from '../../../services/core/culture.service';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss'],
})
export class ColorPickerComponent implements OnInit {
  @Input() cssClass: string;
  @Input() model: string;
  @Input() autofocus: boolean;
  @Input() disabled: boolean;
  @Input() placeHolder: string;
  @Input() readonly: boolean;
  @Input() focusState: string;
  @Input() label: string;

  @Output() modelChange = new EventEmitter<string>();
  @Output() onEnter = new EventEmitter();
  @Output() blur = new EventEmitter();
  @Output() focus = new EventEmitter();

  constructor(readonly cultureService: CultureService) {}

  ngOnInit() {}

  onFocus() {
    this.focusState = 'focus';
    this.focus.emit();
  }

  onBlur() {
    this.focusState = 'blur';
    this.blur.emit();
  }

  onModelChange(model: any) {
    this.model = model;
    this.modelChange.emit(model);
  }
}
