import { Component, Input, OnInit } from '@angular/core';
import { CultureService } from '../../../shared/services/culture.service';
import { IDateEvent } from '../../../shared/lib/date-time/date-contracts';

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
