import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import {
  MaterialPersianDateAdapter,
  PERSIAN_DATE_FORMATS,
} from '../../lib/date-time/persian-date-adapter';
import { MatDatepicker } from '@angular/material/datepicker';

@Component({
  selector: 'app-persian-date-picker',
  templateUrl: './persian-date-picker.component.html',
  styleUrls: ['./persian-date-picker.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MaterialPersianDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: PERSIAN_DATE_FORMATS },
  ],
})
export class PersianDatePickerComponent implements OnInit, AfterViewInit {
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
  @Output() cultureChange = new EventEmitter<string>();

  @ViewChild('datepickerFooter', { static: false })
  datepickerFooter: ElementRef;
  @ViewChild('picker', { static: false }) datepicker: MatDatepicker<any>;
  constructor() {}

  ngAfterViewInit(): void {
    if (this.plateOpen) {
      setTimeout(() => this.datepicker.open(), 200);
    }
  }

  ngOnInit(): void {}

  onOpen() {
    // this.appendFooter();
  }

  // private appendFooter() {
  //   const matCalendar = document.getElementsByClassName(
  //     'mat-datepicker-content'
  //   )[0] as HTMLElement;
  //   matCalendar.prepend(this.datepickerFooter.nativeElement);
  // }

  onFocus($event: any, picker: any) {
    // $event.target.scrollIntoView({
    //   behavior: 'auto',
    //   block: 'center',
    //   inline: 'center'
    // });
    picker.open();
  }

  switchCulture() {
    this.culture = this.culture === 'fa' ? 'en' : 'fa';
    this.cultureChange.emit(this.culture);
  }

  forceCulture(culture) {
    this.culture = culture;
    this.cultureChange.emit(culture);
  }
}
