import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
})
export class DatePickerComponent implements OnInit {
  @Input() placeholder: string;
  @Input() cssClass: string;
  @Input() culture: string;
  @Input() disabled: boolean;
  @Input() allowNull: boolean;
  @Input() pickButton: boolean;
  @Input() plateOpen: boolean;
  @Input() min: Date | string;
  @Input() max: Date | string;
  @Input() model: Date;
  @Input() minDays: number;
  @Input() minMonths: number;
  @Input() minYears: number;
  @Input() maxDays: number;
  @Input() maxMonths: number;
  @Input() maxYears: number;
  @Input() fromToday: boolean;
  @Input() tillToday: boolean;
  @Output() modelChange = new EventEmitter<Date>();

  constructor() {}

  ngOnInit() {
    this.calculateFromTo();
    this.culture = this.culture || environment.lang;
  }

  calculateFromTo() {
    const now = new Date();
    if (this.tillToday) {
      this.max = now;
    }
    if (this.fromToday) {
      this.min = now;
    }
    if (this.minDays) {
      this.min = new Date();
      this.min.setDate(this.min.getDate() + this.minDays);
    }
    if (this.minMonths) {
      this.min = new Date();
      this.min.setMonth(this.min.getMonth() + this.minMonths);
    }
    if (this.minYears) {
      this.min = new Date();
      this.min.setFullYear(this.min.getFullYear() + this.minYears);
    }
    if (this.maxDays) {
      this.max = new Date();
      this.max.setDate(this.max.getDate() + this.maxDays);
    }
    if (this.maxMonths) {
      this.max = new Date();
      this.max.setMonth(this.max.getMonth() + this.maxMonths);
    }
    if (this.maxYears) {
      this.max = new Date();
      this.max.setFullYear(this.max.getFullYear() + this.maxYears);
    }
    if (this.min && typeof this.min === 'string') {
      this.min = new Date(this.min);
    }
    if (this.max && typeof this.max === 'string') {
      this.max = new Date(this.max);
    }
  }

  update($event: Date) {
    const obj = $event as any;
    if (obj.toDate) {
      this.model = obj.toDate();
    } else {
      this.model = $event;
    }
    this.modelChange.emit(this.model);
  }

  cultureChange($event: string) {
    this.culture = $event;
    this.plateOpen = true;
  }
}
