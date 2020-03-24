import { Component, Input, OnInit } from '@angular/core';
import { GroupViewModel } from '../../../view-models/groups/group-types';
import { AccessType } from '../../../library/app/enums';

@Component({
  selector: 'app-group-settings',
  templateUrl: './group-settings.component.html',
  styleUrls: ['./group-settings.component.scss'],
})
export class GroupSettingsComponent implements OnInit {
  @Input() group: GroupViewModel;
  @Input() permission: AccessType;
  constructor() {}

  ngOnInit() {}
}
