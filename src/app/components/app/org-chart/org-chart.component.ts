import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { GroupViewModel } from '../../../view-models/groups/group-types';
import { MockService } from '../../../services/general/mock.service';
import { GroupService } from '../../../services/groups/group.service';

@Component({
  selector: 'app-org-chart',
  templateUrl: './org-chart.component.html',
  styleUrls: ['./org-chart.component.scss'],
})
export class OrgChartComponent implements OnInit {
  @Input() group: GroupViewModel;

  constructor(readonly groupService: GroupService) {}

  ngOnInit() {}
}
