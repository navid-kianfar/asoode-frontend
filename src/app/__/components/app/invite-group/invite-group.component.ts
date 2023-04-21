import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccessType } from 'src/app/shared/lib/enums/enums';
import { GroupService } from '../../../../groups/services/group.service';
import { InviteViewModel } from '../../../../view-models/auth/identity-types';

@Component({
  selector: 'app-invite-group',
  templateUrl: './invite-group.component.html',
  styleUrls: ['./invite-group.component.scss'],
})
export class InviteGroupComponent implements OnInit {
  @Input() exclude: string[];
  @Input() groups: InviteViewModel[];
  @Output() groupsChange = new EventEmitter<InviteViewModel[]>();
  AccessType = AccessType;
  constructor(private readonly groupService: GroupService) {}

  ngOnInit() {
    setTimeout(() => {
      this.groups = this.groupService.groups
        .filter(g => (this.exclude || []).indexOf(g.id) === -1)
        .map(g => {
          return {
            id: g.id,
            model: g,
            access: AccessType.Editor,
            selected: false,
          };
        });
      this.groupsChange.emit(this.groups);
    }, 100);
  }
}
