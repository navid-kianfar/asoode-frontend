import { Component, OnInit } from '@angular/core';
import { SimpleModalComponent } from 'ngx-simple-modal';
import { GroupViewModel } from '../../view-models/groups/group-types';
import { InviteViewModel } from '../../view-models/auth/identity-types';
import { GroupService } from '../../services/groups/group.service';

@Component({
  selector: 'app-invite-modal',
  templateUrl: './invite-modal.component.html',
  styleUrls: ['./invite-modal.component.scss'],
})
export class InviteModalComponent
  extends SimpleModalComponent<{ existing: any[]; exclude: string[] }, boolean>
  implements OnInit {
  constructor(private readonly groupService: GroupService) {
    super();
  }
  actionWaiting: boolean;
  members: InviteViewModel[];
  groups: InviteViewModel[];
  exclude: string[];
  existing: any[];

  ngOnInit() {
    this.exclude = [...this.exclude, ...this.existing.map(e => e.recordId)];
  }
  async onCancel($event: MouseEvent) {
    $event.stopPropagation();
    $event.preventDefault();
    this.close();
  }

  invite($event: MouseEvent) {
    $event.stopPropagation();
    $event.preventDefault();
  }
}
