import { Component, OnInit } from '@angular/core';
import { GroupViewModel } from '../../../../view-models/groups/group-types';
import { GroupService } from '../../../../groups/services/group.service';
import { Router } from '@angular/router';
import { OperationResultStatus } from '../../../../shared/lib/enums/operation-result-status';

@Component({
  selector: 'app-archived-groups',
  templateUrl: './archived-groups.component.html',
  styleUrls: ['./archived-groups.component.scss'],
})
export class ArchivedGroupsComponent implements OnInit {
  waiting: boolean;
  groups: GroupViewModel[];

  constructor(
    private readonly groupService: GroupService,
    private readonly router: Router,
  ) {}

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
