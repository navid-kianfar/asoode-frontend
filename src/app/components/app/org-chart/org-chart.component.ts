import { Component, Input, OnInit } from '@angular/core';
import { GroupViewModel } from '../../../view-models/groups/group-types';
import { GroupService } from '../../../services/groups/group.service';
import { AccessType } from 'src/app/library/app/enums';

@Component({
  selector: 'app-org-chart',
  templateUrl: './org-chart.component.html',
  styleUrls: ['./org-chart.component.scss'],
})
export class OrgChartComponent implements OnInit {
  AccessType = AccessType;
  @Input() group: GroupViewModel;
  @Input() permission: AccessType;

  constructor(readonly groupService: GroupService) {}

  ngOnInit() {}
}
