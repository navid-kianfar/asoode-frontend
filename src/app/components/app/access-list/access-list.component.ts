import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ListViewModel} from '../../../view-models/core/list-types';
import {AccessType} from 'src/app/library/app/enums';

@Component({
  selector: 'app-access-list',
  templateUrl: './access-list.component.html',
  styleUrls: ['./access-list.component.scss'],
})
export class AccessListComponent implements OnInit {
  AccessType = AccessType;
  roles: ListViewModel[];
  @Input() access: AccessType;
  @Output() accessChange = new EventEmitter<AccessType>();
  constructor() {}

  ngOnInit() {
    this.roles = [
      {
        text: 'ENUMS_ACCESS_TYPE_ADMIN',
        value: AccessType.Admin,
        description: 'ACCESS_TYPE_ADMIN_DESCRIPTION',
      },
      {
        text: 'ENUMS_ACCESS_TYPE_EDITOR',
        value: AccessType.Editor,
        description: 'ACCESS_TYPE_EDITOR_DESCRIPTION',
      },
      {
        text: 'ENUMS_ACCESS_TYPE_HIDDEN_EDITOR',
        value: AccessType.HiddenEditor,
        description: 'ACCESS_TYPE_HIDDEN_EDITOR_DESCRIPTION',
      },
      {
        text: 'ENUMS_ACCESS_TYPE_VISITOR',
        value: AccessType.Visitor,
        description: 'ACCESS_TYPE_VISITOR_DESCRIPTION',
      },
    ];
    if (this.access === AccessType.Owner) {
      this.roles.unshift({
        text: 'ENUMS_ACCESS_TYPE_OWNER',
        value: AccessType.Owner,
        description: 'ACCESS_TYPE_OWNER_DESCRIPTION',
      });
    }
  }
}
