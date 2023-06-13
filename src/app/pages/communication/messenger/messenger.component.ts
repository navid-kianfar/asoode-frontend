import { Component, OnInit } from '@angular/core';
import { MessengerService } from '../../../services/communication/messenger.service';
import { ChannelViewModel } from '../../../view-models/communication/messenger-types';
import { ChannelType } from '../../../library/app/enums';
import { ModalService } from '../../../services/core/modal.service';
import { MessengerSettingComponent } from '../../../modals/messenger-setting/messenger-setting.component';
import { ProjectService } from '../../../services/projects/project.service';
import { GroupService } from '../../../services/groups/group.service';
import { GroupViewModel } from '../../../view-models/groups/group-types';
import {
  ProjectViewModel,
  WorkPackageViewModel,
} from '../../../view-models/projects/project-types';
import { MemberInfoViewModel } from '../../../view-models/auth/identity-types';
import { IdentityService } from '../../../services/auth/identity.service';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { TranslateService } from '../../../services/core/translate.service';

@Component({
  selector: 'app-messenger',
  templateUrl: './messenger.component.html',
  styleUrls: ['./messenger.component.scss'],
})
export class MessengerComponent implements OnInit {
  current: ChannelViewModel;
  ChannelType = ChannelType;
  showFiles: boolean;
  filter: string;
  currentMembers: MemberInfoViewModel[];
  allMembers: MemberInfoViewModel[];
  constructor(
    private readonly messengerService: MessengerService,
    readonly projectService: ProjectService,
    readonly groupService: GroupService,
    readonly modalService: ModalService,
    readonly identityService: IdentityService,
    private readonly gaService: GoogleAnalyticsService,
    private readonly translateService: TranslateService,
  ) {}

  ngOnInit() {
    const members = [];
    this.groupService.groups.forEach((g) => {
      g.members.forEach((m) => {
        if (!m.member || members.find((k) => k.id === m.member.id)) {
          return;
        }
        members.push(m.member);
      });
    });
    this.projectService.projects.forEach((g) => {
      g.members.forEach((m) => {
        if (
          m.isGroup ||
          !m.member ||
          members.find((k) => k.id === m.member.id)
        ) {
          return;
        }
        members.push(m.member);
      });
    });
    this.allMembers = members;
    this.showFiles = false;

    this.gaService.pageView(
      window.location.pathname,
      this.translateService.fromKey('MESSENGER'),
      undefined,
      { user_id: this.identityService.identity.userId },
    );
  }

  openGroup(group: GroupViewModel) {
    this.current = {
      id: group.id,
      messages: [],
      members: [],
      title: group.title,
      type: ChannelType.Group,
      attachmentSize: group.attachmentSize,
    };
    this.currentMembers = group.members.map((m) => m.member);
  }
  openProject(project: ProjectViewModel) {
    this.current = {
      id: project.id,
      messages: [],
      members: [],
      title: project.title,
      type: ChannelType.Project,
      attachmentSize: project.attachmentSize,
    };
    this.currentMembers = project.members
      .filter((p) => !p.isGroup)
      .map((m) => m.member);
  }

  openWorkPackage(
    project: ProjectViewModel,
    workPackageViewModel: WorkPackageViewModel,
  ) {
    this.current = {
      id: workPackageViewModel.id,
      messages: [],
      members: [],
      title: workPackageViewModel.title,
      type: ChannelType.WorkPackage,
      attachmentSize: project.attachmentSize,
    };
    this.currentMembers = project.members
      .filter((p) => {
        return (
          !p.isGroup &&
          workPackageViewModel.members.find((m) => m.id === p.recordId)
        );
      })
      .map((m) => m.member);
  }

  toggleFiles() {
    this.showFiles = !this.showFiles;
  }

  openSetting() {
    this.modalService.show(MessengerSettingComponent, {}).subscribe(() => {});
  }

  openChannels() {
    this.current = undefined;
    this.currentMembers = [];
  }
}
