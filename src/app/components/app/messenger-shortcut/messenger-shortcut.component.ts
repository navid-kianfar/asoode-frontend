import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {ModalService} from '../../../services/core/modal.service';
import {MessengerSettingComponent} from '../../../modals/messenger-setting/messenger-setting.component';
import {ChannelViewModel} from '../../../view-models/communication/messenger-types';
import {MessengerService} from '../../../services/communication/messenger.service';
import {ProjectService} from '../../../services/projects/project.service';
import {GroupService} from '../../../services/groups/group.service';
import {IdentityService} from '../../../services/auth/identity.service';
import {ChannelType} from '../../../library/app/enums';
import {ProjectViewModel, WorkPackageViewModel} from '../../../view-models/projects/project-types';
import {GroupViewModel} from '../../../view-models/groups/group-types';

const STORAGE_KEY = 'dashboard_bot_visible';

@Component({
  selector: 'app-messenger-shortcut',
  templateUrl: './messenger-shortcut.component.html',
  styleUrls: ['./messenger-shortcut.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MessengerShortcutComponent implements OnInit {
  @Input() dashboard: boolean;
  @Input() groupId: string;
  @Input() packageId: string;
  @Input() projectId: string;
  @Input() group: GroupViewModel;
  @Input() project: ProjectViewModel;
  @Input() workPackage: WorkPackageViewModel;
  showMessages: boolean;
  current: ChannelViewModel;
  unread: number;

  constructor(
    private readonly router: Router,
    readonly modalService: ModalService,
    readonly messengerService: MessengerService,
    readonly projectService: ProjectService,
    readonly identityService: IdentityService,
    readonly groupService: GroupService,
  ) {}

  ngOnInit() {

    if (this.project) {
      this.current = {
        id: this.project.id,
        members: this.project.members.map(m => m.member),
        messages: [],
        title: this.project.title,
        type: ChannelType.Project
      };
    } else if (this.projectId) {
      const project = this.projectService.projects.find(p => p.id === this.projectId);
      this.current = {
        id: this.projectId,
        members: project.members.map(m => m.member),
        messages: [],
        title: project.title,
        type: ChannelType.Project
      };
    } else if (this.workPackage) {
      const project = this.projectService.projects.find(p => p.id === this.workPackage.projectId);
      this.current = {
        id: this.workPackage.id,
        members: project.members.filter(m => {
          return this.workPackage.members.find(wm => wm.recordId === m.recordId);
        }).map(m => m.member),
        messages: [],
        title: this.workPackage.title,
        type: ChannelType.WorkPackage
      };
    } else if (this.packageId) {
      let found: WorkPackageViewModel;
      let project: ProjectViewModel;
      this.projectService.projects.forEach(p => {
        p.workPackages.forEach(w => {
          if (w.id === this.packageId) {
            found = w;
            project = p;
          }
        });
      });
      this.current = {
        id: this.packageId,
        members: project.members.filter(m => {
          return found.members.find(wm => wm.recordId === m.recordId);
        }).map(m => m.member),
        messages: [],
        title: found.title,
        type: ChannelType.WorkPackage
      };
    } else if (this.group) {
      this.current = {
        id: this.group.id,
        members: this.group.members.map(m => m.member),
        messages: [],
        title: this.group.title,
        type: ChannelType.Group
      };
    } else if (this.groupId) {
      const found = this.groupService.groups.find(g => g.id === this.groupId);
      this.current = {
        id: this.groupId,
        members: found.members.map(m => m.member),
        messages: [],
        title: found.title,
        type: ChannelType.Group
      };
    } else if (this.dashboard) {
      this.current = this.messengerService.channels.directs[0];
      const closed = localStorage.getItem(STORAGE_KEY);
      if (!closed && this.dashboard) {
        this.showMessages = true;
      }
    } else if (
      !this.projectService.projects.length &&
      !this.groupService.groups.length
    ) {
      this.dashboard = true;
    }
  }

  open() {
    if (this.dashboard) {
      this.showMessages = true;
      return;
    }

    if (
      this.project || this.projectId ||
      this.workPackage || this.packageId ||
      this.group || this.groupId
    ) {
      this.showMessages = true;
      return;
    }

    this.router.navigateByUrl('/messenger');
  }

  goToMessenger() {
    this.showMessages = false;
    this.router.navigateByUrl('/messenger');
  }

  hide() {
    if (this.dashboard) {
      localStorage.setItem(STORAGE_KEY, '1');
    }
    this.showMessages = false;
  }

  setting() {
    this.modalService.show(MessengerSettingComponent, {}).subscribe(() => {});
  }
}
