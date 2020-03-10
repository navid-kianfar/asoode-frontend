import {Component, Input, OnInit} from '@angular/core';
import {GroupViewModel} from '../../../view-models/groups/group-types';

@Component({
  selector: 'app-org-chart-node',
  templateUrl: './org-chart-node.component.html',
  styleUrls: ['./org-chart-node.component.scss']
})
export class OrgChartNodeComponent implements OnInit {

  @Input() canAdd: boolean;
  @Input() group: GroupViewModel;
  constructor() { }

  ngOnInit() {
  }

}
