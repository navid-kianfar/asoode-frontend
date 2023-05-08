import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { GroupViewModel } from '../../../view-models/groups/group-types';
import { GroupService } from '../../services/group.service';
import { ModalService } from '../../../shared/services/modal.service';
import { Router } from '@angular/router';
import { AccessType } from 'src/app/shared/lib/enums/enums';
import { PromptModalParameters } from '../../../view-models/core/modal-types';
import { FormService } from '../../../shared/services/form.service';
import { ActivityType } from '../../../shared/lib/enums/activity-type';
import { OperationResultStatus } from '../../../shared/lib/enums/operation-result-status';
import { PromptModalComponent } from '../../../shared/modals/prompt-modal/prompt-modal.component';
import { SocketListenerService } from '../../../shared/services/socket-listener.service';
import { Subscription } from 'rxjs';
import { CreateWizardModalComponent } from '../../../shared/modals/create-wizard-modal/create-wizard-modal.component';

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
  private listener: Subscription;
  constructor(
    private readonly modalService: ModalService,
    private readonly groupService: GroupService,
    private readonly formService: FormService,
    private readonly socket: SocketListenerService,
    private readonly router: Router,
  ) {}

  ngOnInit() {
    this.filtered = this.groups.filter(g => g.parentId === this.group.id);
    this.listener = this.socket.listener.subscribe((notification) => {
      switch (notification.type) {
        case ActivityType.GroupAdd:
        case ActivityType.GroupEdit:
        case ActivityType.GroupRemove:
        case ActivityType.GroupArchive:
          this.filtered = this.groups.filter(g => g.parentId === this.group.id);
          break;
      }
    });
  }

  ngOnDestroy() {
    this.listener.unsubscribe();
  }

  newGroup() {
    this.modalService.show(CreateWizardModalComponent, {
        simpleGroup: true,
        parentId: this.group.id,
      });
  }

  attachGroup() {
    this.modalService
      .show(PromptModalComponent, {
        icon: 'icon-link',
        title: 'ATTACH_GROUP',
        form: [
          {
            elements: [
              this.formService.createDropDown({
                config: { field: 'id', label: '' },
                params: {
                  model: undefined,
                  items: [],
                  backend: `/groups/${this.group.id}/non-attached`,
                },
                validation: {
                  required: {
                    value: true,
                    message: 'PARENT_REQUIRED',
                  },
                },
              }),
            ],
          },
        ],
        action: async (params, form) => {
          const op = await this.groupService.connect(this.group.id, params.id);
          if (op.status !== OperationResultStatus.Success) {
            // TODO: handle error
            return;
          }
        },
        actionLabel: 'CONNECT_GROUP',
        actionColor: 'primary',
      } as PromptModalParameters);
  }

  openGroup() {
    this.router.navigateByUrl('/group/' + this.group.id);
  }
}
