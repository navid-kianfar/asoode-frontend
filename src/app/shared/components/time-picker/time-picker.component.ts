import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NumberHelpers } from '../../helpers/number.helpers';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss'],
})
export class TimePickerComponent implements OnInit {
  @Input() hour: number;
  @Input() minute: number;
  @Input() model: string;
  @Output() hourChange = new EventEmitter<number>();
  @Output() minuteChange = new EventEmitter<number>();
  @Output() modelChange = new EventEmitter<string>();
  @Input() cssClass: string;
  @Input() disabled: boolean;

  constructor() {}

  ngOnInit() {
    if (this.model) {
      const parts = this.model.split(':');
      this.hour = +parts[0];
      this.minute = +parts[1];
    }

    if (this.hour === undefined || this.hour === null) {
      this.hour = 12;
      this.hourChange.emit(12);
    }
    if (this.minute === undefined || this.minute === null) {
      this.minute = 0;
      this.minuteChange.emit(0);
    }
  }

  update() {
    const model =
      NumberHelpers.pad(this.hour, 2) + ':' + NumberHelpers.pad(this.minute, 2);
    this.modelChange.emit(model);
  }

  updateHour($event: number) {
    this.hourChange.emit($event);
    this.update();
  }

  updateMinute($event: number) {
    this.minuteChange.emit($event);
    this.update();
  }
}
