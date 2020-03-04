import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-activity',
  templateUrl: './dashboard-activity.component.html',
  styleUrls: ['./dashboard-activity.component.scss'],
})
export class DashboardActivityComponent implements OnInit {
  @Input() groupId: string;
  constructor() {}

  ngOnInit() {}
}
