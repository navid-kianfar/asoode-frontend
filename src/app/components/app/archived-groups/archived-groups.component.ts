import { Component, OnInit } from '@angular/core';
import {GroupViewModel} from '../../../view-models/groups/group-types';
import {GroupService} from '../../../services/groups/group.service';
import {OperationResultStatus} from '../../../library/core/enums';
import {Router} from '@angular/router';

@Component({
  selector: 'app-archived-groups',
  templateUrl: './archived-groups.component.html',
  styleUrls: ['./archived-groups.component.scss']
})
export class ArchivedGroupsComponent implements OnInit {
  waiting: boolean;
  groups: GroupViewModel[];

  constructor(
    private readonly groupService: GroupService,
    private readonly router: Router
  ) { }

  ngOnInit() {
    this.fetch();
  }

  async fetch() {
    this.waiting = true;
    const op = await this.groupService.archived();
    this.waiting = false;
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
    }
    this.groups = op.data || [];
  }

  openGroup(group: GroupViewModel) {
    this.router.navigateByUrl('/group/' + group.id + '/archived');
  }
}
