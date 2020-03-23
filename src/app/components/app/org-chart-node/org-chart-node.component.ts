import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { GroupViewModel } from '../../../view-models/groups/group-types';
import { GroupService } from '../../../services/groups/group.service';

@Component({
  selector: 'app-org-chart-node',
  templateUrl: './org-chart-node.component.html',
  styleUrls: ['./org-chart-node.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class OrgChartNodeComponent implements OnInit {
  @Input() canAdd: boolean;
  @Input() level: number;
  @Input() groups: GroupViewModel[];
  @Input() group: GroupViewModel;
  filtered: GroupViewModel[] = [];
  constructor() {}

  ngOnInit() {
    this.filtered = this.groups.filter(g => g.parentId === this.group.id);
  }
}
