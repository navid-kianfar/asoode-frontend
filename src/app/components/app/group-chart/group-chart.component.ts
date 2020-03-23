import { Component, Input, OnInit } from '@angular/core';
import { GroupViewModel } from '../../../view-models/groups/group-types';
import {GroupService} from '../../../services/groups/group.service';
import {AccessType} from '../../../library/app/enums';

@Component({
  selector: 'app-group-chart',
  templateUrl: './group-chart.component.html',
  styleUrls: ['./group-chart.component.scss'],
})
export class GroupChartComponent implements OnInit {
  @Input() group: GroupViewModel;
  @Input() permission: AccessType;
  AccessType = AccessType;
  constructor(readonly groupService: GroupService) {}

  ngOnInit() {}
}
