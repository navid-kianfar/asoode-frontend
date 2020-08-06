import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { CultureService } from '../../../services/core/culture.service';
import { FormService } from '../../../services/core/form.service';
import { FormViewModel } from '../../core/form/contracts';
import { InviteViewModel } from '../../../view-models/auth/identity-types';
import { GroupService } from '../../../services/groups/group.service';
import { OperationResultStatus } from '../../../library/core/enums';
import { NotificationService } from '../../../services/core/notification.service';
import { ValidationService } from '../../../services/core/validation.service';
import { IdentityService } from '../../../services/auth/identity.service';

@Component({
  selector: 'app-group-wizard',
  templateUrl: './group-wizard.component.html',
  styleUrls: ['./group-wizard.component.scss'],
})
export class GroupWizardComponent implements OnInit {
  @Output() back = new EventEmitter();
  @Output() exit = new EventEmitter();
  @Input() parentId: string;
  ViewMode = ViewMode;
  mode: ViewMode;
  groupForm: FormViewModel[];
  actionWaiting: boolean;
  members: InviteViewModel[];
  groups: InviteViewModel[];
  model: any = {};
  exclude: string[];
  constructor(
    readonly cultureService: CultureService,
    private readonly formService: FormService,
    private readonly groupService: GroupService,
    readonly identityService: IdentityService,
    private readonly notificationService: NotificationService,
  ) {}

  ngOnInit() {
    this.exclude = [
      this.identityService.identity.userId,
      this.identityService.profile.email,
    ];
    this.members = [];
    this.groups = [];
    this.mode = ViewMode.Form;
    this.groupForm = [
      {
        elements: [
          this.formService.createInput({
            config: {
              field: 'title',
              label: '',
              cssClass: 'group-title',
              hideLabel: true,
            },
            params: { model: '', placeHolder: 'GROUP_TITLE' },
            validation: {
              required: {
                value: true,
                message: 'GROUP_TITLE_REQUIRED',
              },
            },
          }),
          this.formService.createInput({
            config: { field: 'description', label: '', hideLabel: true },
            params: { model: '', textArea: true, placeHolder: 'DESCRIPTION' },
          }),
          this.formService.createCheckbox({
            config: { field: 'channel', label: '' },
            params: {
              model: true,
              label: 'GROUP_REQUIRE_CHANNEL',
              summary: 'GROUP_CHANNEL_DESCRIPTION',
              disabled: true,
            },
          }),
        ],
      },
    ];
  }
  onBack($event: MouseEvent) {
    $event.stopPropagation();
    $event.preventDefault();
    if (this.mode === ViewMode.Invite) {
      this.mode = ViewMode.Form;
      return;
    }
    this.back.emit();
  }
  async onCancel($event: MouseEvent) {
    $event.stopPropagation();
    $event.preventDefault();
    this.exit.emit();
  }
  async createGroup($event: MouseEvent) {
    $event.stopPropagation();
    $event.preventDefault();
    this.model.groups = (this.groups || [])
      .filter(g => g.selected)
      .map(g => {
        return {
          id: g.id,
          access: g.access,
        };
      });
    this.model.members = (this.members || []).map(m => {
      return {
        id: m.id,
        access: m.access,
      };
    });
    this.actionWaiting = true;
    const op = await this.groupService.create({
      ...this.model,
      parentId: this.parentId
    });
    this.actionWaiting = false;
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
      return;
    }
    this.notificationService.success('GROUP_CREATED');
    this.exit.emit();
  }
  inviteToGroup($event: MouseEvent) {
    this.model = this.formService.prepare(this.groupForm);
    if (!this.model) {
      return;
    }
    this.mode = ViewMode.Invite;
  }
}
export enum ViewMode {
  Form = 1,
  Invite = 2,
}
