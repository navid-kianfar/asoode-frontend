import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NumberHelpers } from '../../../helpers/number.helpers';

@Component({
  selector: 'app-time-span',
  templateUrl: './time-span.component.html',
  styleUrls: ['./time-span.component.scss'],
})
export class TimeSpanComponent implements OnInit {
  @Input() model: number;
  @Output() modelChange = new EventEmitter<number>();
  @Input() cssClass: string;
  @Input() disabled: boolean;
  day: number;
  hour: number;
  minute: number;
  second: number;

  constructor() {}

  ngOnInit() {
    const model = this.model || 0;
    const parsed = NumberHelpers.ticksToTimeSpan(model);
    this.day = parsed.day;
    this.hour = parsed.hour;
    this.minute = parsed.minute;
  }

  update() {
    const value = NumberHelpers.timespanToTicks(this);
    this.model = value;
    this.modelChange.emit(value);
  }
}
