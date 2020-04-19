import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {ICulture} from '../../../view-models/core/date-types';
import {CulturedDateService} from '../../../services/core/cultured-date.service';
import {PopperContent} from 'ngx-popper';
import {NumberHelpers} from '../../../helpers/number.helpers';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
})
export class DatePickerComponent implements OnInit, OnChanges {
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

  constructor(readonly culturedDateService: CulturedDateService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.model && !changes.model.firstChange) {
      if (!changes.model.currentValue) {
        this.setFormattedDate('');
      }
    }
  }

  ngOnInit() {
    this.formattedDate = '';
    if (this.model) {
      const date = this.culturedDateService.Converter().FromDateTime(new Date(this.model));
      this.formattedDate = `${date.Year}/${NumberHelpers.pad(date.Month, 2)}/${NumberHelpers.pad(date.Day, 2)}`;
    }
    this.dateView = true;
    this.calculateFromTo();
  }

  setFormattedDate(formatted) {
    if (!this.model && formatted) {
      return;
    }
    this.formattedDate = formatted;
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

  update(date: Date, popper: PopperContent) {
    date = new Date(date || this.model || new Date());
    this.model = date;
    this.modelChange.emit(date);
    if (popper) {
      popper.hide();
    }
  }
}
