import {Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import { GroupViewModel } from '../../../view-models/groups/group-types';
import { GroupService } from '../../../services/groups/group.service';
import {CreateWizardComponent} from '../../../modals/create-wizard/create-wizard.component';
import {ModalService} from '../../../services/core/modal.service';
import {CreateModalParameters} from '../../../view-models/modals/modals-types';
import {Socket} from 'ngx-socket-io';
import {Router} from '@angular/router';
import { AccessType } from 'src/app/library/app/enums';

@Component({
  selector: 'app-org-chart-node',
  templateUrl: './org-chart-node.component.html',
  styleUrls: ['./org-chart-node.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class OrgChartNodeComponent implements OnInit, OnDestroy {
  @Input() canAdd: boolean;
  @Input() level: number;
  @Input() groups: GroupViewModel[];
  @Input() group: GroupViewModel;
  @Input() permission: AccessType;
  filtered: GroupViewModel[] = [];
  AccessType = AccessType;
  constructor(
    private readonly modalService: ModalService,
    private readonly groupService: GroupService,
    private readonly socket: Socket,
    private readonly router: Router,
  ) {}

  ngOnInit() {
    this.filtered = this.groups.filter(g => g.parentId === this.group.id);
    this.socket.on('push-notification', this.handleSocket);
  }

  ngOnDestroy() {
    this.socket.removeListener('push-notification', this.handleSocket);
  }

  handleSocket = (notification) => {
    this.filtered = this.groups.filter(g => g.parentId === this.group.id);
  }

  newGroup() {
    this.modalService.show<CreateModalParameters>(CreateWizardComponent, {
      simpleGroup: true,
      parentId: this.group.id
    }).subscribe(() => {});
  }

  attachGroup() {

  }

  openGroup() {
    this.router.navigateByUrl('/group/' + this.group.id);
  }
}
