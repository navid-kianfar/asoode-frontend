import { Component, Input, OnInit } from '@angular/core';
import { GroupViewModel } from '../../../view-models/groups/group-types';
import {AccessType} from '../../../library/app/enums';

@Component({
  selector: 'app-group-reports',
  templateUrl: './group-reports.component.html',
  styleUrls: ['./group-reports.component.scss'],
})
export class GroupReportsComponent implements OnInit {
  @Input() group: GroupViewModel;
  @Input() permission: AccessType;
  constructor() {}

  ngOnInit() {}
}
