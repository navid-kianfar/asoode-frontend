import { Component, Input, OnInit } from '@angular/core';
import { OverallViewModel } from '../../../../view-models/general/report-types';

@Component({
  selector: 'app-dashboard-overall',
  templateUrl: './dashboard-overall.component.html',
  styleUrls: ['./dashboard-overall.component.scss'],
})
export class DashboardOverallComponent implements OnInit {
  @Input() model: OverallViewModel;
  constructor() {}

  ngOnInit() {}
}
