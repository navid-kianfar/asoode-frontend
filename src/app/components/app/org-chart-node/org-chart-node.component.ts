import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { GroupViewModel } from '../../../view-models/groups/group-types';
import { GroupService } from '../../../services/groups/group.service';
import { CreateWizardComponent } from '../../../modals/create-wizard/create-wizard.component';
import { ModalService } from '../../../services/core/modal.service';
import { CreateModalParameters } from '../../../view-models/modals/modals-types';
import { Socket } from 'ngx-socket-io';
import { Router } from '@angular/router';
import { AccessType, ActivityType } from 'src/app/library/app/enums';
import { PromptComponent } from '../../../modals/prompt/prompt.component';
import { OperationResultStatus } from '../../../library/core/enums';
import { PromptModalParameters } from '../../../view-models/core/modal-types';
import { FormService } from '../../../services/core/form.service';

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
    private readonly formService: FormService,
    private readonly socket: Socket,
    private readonly router: Router,
  ) {}

  ngOnInit() {
    this.filtered = this.groups.filter((g) => g.parentId === this.group.id);
    this.socket.on('push-notification', this.handleSocket);
  }

  ngOnDestroy() {
    this.socket.removeListener('push-notification', this.handleSocket);
  }

  handleSocket = (notification) => {
    switch (notification.type) {
      case ActivityType.GroupAdd:
      case ActivityType.GroupEdit:
      case ActivityType.GroupRemove:
      case ActivityType.GroupArchive:
        this.filtered = this.groups.filter((g) => g.parentId === this.group.id);
        break;
    }
  };

  newGroup() {
    this.modalService
      .show<CreateModalParameters>(CreateWizardComponent, {
        simpleGroup: true,
        parentId: this.group.id,
      })
      .subscribe(() => {});
  }

  attachGroup() {
    this.modalService
      .show(PromptComponent, {
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
      } as PromptModalParameters)
      .subscribe(() => {});
  }

  openGroup() {
    this.router.navigateByUrl('/group/' + this.group.id);
  }
}
