import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NumberHelpers } from '../../../helpers/number.helpers';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss'],
})
export class TimePickerComponent implements OnInit {
  @Input() hour: number;
  @Input() minute: number;
  @Output() hourChange = new EventEmitter<number>();
  @Output() minuteChange = new EventEmitter<number>();
  @Input() cssClass: string;
  @Input() disabled: boolean;

  constructor() {}

  ngOnInit() {
    if (!this.hour) {
      this.hour = 12;
      this.hourChange.emit(12);
    }
    if (!this.minute) {
      this.minute = 0;
      this.minuteChange.emit(0);
    }
  }

  update() {}
}
