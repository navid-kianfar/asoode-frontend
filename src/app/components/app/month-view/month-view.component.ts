import { Component, Input, OnInit } from '@angular/core';
import { CultureService } from '../../../services/core/culture.service';
import { IDateEvent } from '../../../library/core/date-time/date-contracts';

@Component({
  selector: 'app-month-view',
  templateUrl: './month-view.component.html',
  styleUrls: ['./month-view.component.scss'],
})
export class MonthViewComponent implements OnInit {
  @Input() culture: string;
  @Input() model: IDateEvent[];
  dayNames: string[];
  days: any[][];

  constructor(private readonly cultureService: CultureService) {}

  ngOnInit() {}
}
