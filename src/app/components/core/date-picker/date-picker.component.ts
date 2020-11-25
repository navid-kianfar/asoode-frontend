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
import { ICulture } from '../../../view-models/core/date-types';
import { CulturedDateService } from '../../../services/core/cultured-date.service';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
})
export class DatePickerComponent implements OnInit {
  formattedDate: string;
  dateView: any;
  calendar: ICulture;

  @Input() cssClass: string;
  @Input() culture: string;
  @Input() disabled: boolean;
  @Input() allowNull: boolean;
  @Input() pickButton: boolean;
  @Input() plateOpen: boolean;
  @Input() model: Date;
  @Input() from: Date;
  @Input() to: Date;
  @Input() minDays: number;
  @Input() minMonths: number;
  @Input() minYears: number;
  @Input() maxDays: number;
  @Input() maxMonths: number;
  @Input() maxYears: number;
  @Input() fromToday: boolean;
  @Input() tillToday: boolean;
  @Output() modelChange = new EventEmitter<Date>();

  constructor(readonly culturedDateService: CulturedDateService) {}

  ngOnInit() {
    this.calculateFromTo();
  }

  calculateFromTo() {
    const now = new Date();
    if (this.tillToday) {
      this.to = now;
    }
    if (this.minDays) {
      this.to = new Date();
      this.to.setDate(this.to.getDate() - this.minDays);
    }
    if (this.minMonths) {
      this.to = new Date();
      this.to.setMonth(this.to.getMonth() - this.minMonths);
    }
    if (this.minYears) {
      this.to = new Date();
      this.to.setFullYear(this.to.getFullYear() - this.minYears);
    }
    if (this.fromToday) {
      this.from = now;
    }
    if (this.maxDays) {
      this.from = new Date();
      this.from.setDate(this.from.getDate() - this.maxDays);
    }
    if (this.maxMonths) {
      this.from = new Date();
      this.from.setMonth(this.from.getMonth() - this.maxMonths);
    }
    if (this.maxYears) {
      this.from = new Date();
      this.from.setFullYear(this.from.getFullYear() - this.maxYears);
    }
  }

  dateChange($event: Event, dateInput: HTMLInputElement, picker: any) {
    console.log($event, dateInput, picker);
  }
}
