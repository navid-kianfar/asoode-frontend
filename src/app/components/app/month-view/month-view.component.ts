import { Component, OnInit } from '@angular/core';
import {CultureService} from '../../../services/core/culture.service';

@Component({
  selector: 'app-month-view',
  templateUrl: './month-view.component.html',
  styleUrls: ['./month-view.component.scss']
})
export class MonthViewComponent implements OnInit {
  dayNames: string[];
  days: any[][];

  constructor(private readonly cultureService: CultureService) { }

  ngOnInit() {
    this.dayNames = this.cultureService.cultures.Item('fa').dayNamesShort;
    const days = [];
    let k = 1;
    for (let i = 0; i < 5; i++) {
      days[i] = days[i] || [];
      for (let j = 0; j < 7; j++) {
        days[i][j] = {
          day: k++,
          past: k % 13 === 0,
          inTime: k % 8 === 0,
          upcoming: k % 16 === 0,
          today: k === 23
        };
      }
    }
    this.days = days;
  }

}
