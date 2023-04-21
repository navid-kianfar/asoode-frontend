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
import { MatDatepicker } from '@angular/material/datepicker';

@Component({
  selector: 'app-native-date-picker',
  templateUrl: './native-date-picker.component.html',
  styleUrls: ['./native-date-picker.component.scss'],
  providers: [],
})
export class NativeDatePickerComponent implements OnInit, AfterViewInit {
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
