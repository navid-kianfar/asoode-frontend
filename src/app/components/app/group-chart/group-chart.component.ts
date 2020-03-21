import { Component, Input, OnInit } from '@angular/core';
import { GroupViewModel } from '../../../view-models/groups/group-types';
import {GroupService} from '../../../services/groups/group.service';

@Component({
  selector: 'app-group-chart',
  templateUrl: './group-chart.component.html',
  styleUrls: ['./group-chart.component.scss'],
})
export class GroupChartComponent implements OnInit {
  @Input() group: GroupViewModel;
  constructor(readonly groupService: GroupService) {}

  ngOnInit() {}
}
