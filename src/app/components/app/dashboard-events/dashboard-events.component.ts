import { Component, Input, OnInit } from '@angular/core';
import { CultureService } from '../../../services/core/culture.service';
import { IDateEvent } from '../../../library/core/date-time/date-contracts';

@Component({
  selector: 'app-dashboard-events',
  templateUrl: './dashboard-events.component.html',
  styleUrls: ['./dashboard-events.component.scss'],
})
export class DashboardEventsComponent implements OnInit {
  @Input() culture: string;
  @Input() model: IDateEvent[];
  dayNames: string[];
  days: any[][];

  constructor(private readonly cultureService: CultureService) {}

  ngOnInit() {}
}
