import {Component, OnInit} from '@angular/core';
import {GroupViewModel} from '../../../view-models/groups/group-types';
import {ActivatedRoute, Router} from '@angular/router';
import {GroupService} from '../../../services/groups/group.service';
import {ModalService} from '../../../services/core/modal.service';
import {GroupDetailComponent} from '../../../modals/group-detail/group-detail.component';
import {AccessType} from '../../../library/app/enums';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss'],
})
export class GroupComponent implements OnInit {
  group: GroupViewModel;
  showDetail: boolean;
  permission: AccessType;
  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly groupService: GroupService,
    private readonly modalService: ModalService,
  ) {}

  ngOnInit() {
    this.showDetail = true;
    const id = this.activatedRoute.snapshot.params.id;
    this.group = this.groupService.groups.find(g => g.id === id);
    if (!this.group) {
      this.router.navigateByUrl('dashboard');
      return;
    }
    this.permission = this.groupService.getPermission(id);
  }

  detail() {
    this.modalService.show(GroupDetailComponent, {
      group: this.group,
      canEdit: (this.permission === AccessType.Admin) || (this.permission ===  AccessType.Owner)
    }).subscribe(() => {});
  }
}
