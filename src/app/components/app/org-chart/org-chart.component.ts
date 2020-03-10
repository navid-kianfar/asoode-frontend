import {Component, Input, OnInit} from '@angular/core';
import {GroupViewModel} from '../../../view-models/groups/group-types';

@Component({
  selector: 'app-org-chart',
  templateUrl: './org-chart.component.html',
  styleUrls: ['./org-chart.component.scss'],
})
export class OrgChartComponent implements OnInit {
  @Input() group: GroupViewModel;

  constructor() {}

  ngOnInit() {}
}
