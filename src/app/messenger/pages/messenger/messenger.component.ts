import { Component, OnInit } from '@angular/core';
import { MessengerService } from '../../services/messenger.service';
import { ChannelViewModel } from '../../../view-models/communication/messenger-types';
import { ModalService } from '../../../shared/services/modal.service';
import { ProjectService } from '../../../project/services/project.service';
import { GroupService } from '../../../groups/services/group.service';
import { GroupViewModel } from '../../../view-models/groups/group-types';
import {
  ProjectViewModel,
  WorkPackageViewModel,
} from '../../../view-models/projects/project-types';
import { MemberInfoViewModel } from '../../../view-models/auth/identity-types';
import { IdentityService } from '../../../auth/services/identity.service';

import { TranslateService } from '../../../shared/services/translate.service';
import { ChannelType } from '../../../shared/lib/enums/channels';

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
    private readonly translateService: TranslateService,
  ) {}

  ngOnInit() {
    const members = [];
    this.groupService.groups.forEach(g => {
      g.members.forEach(m => {
        if (!m.member || members.find(k => k.id === m.member.id)) {
          return;
        }
        members.push(m.member);
      });
    });
    this.projectService.projects.forEach(g => {
      g.members.forEach(m => {
        if (m.isGroup || !m.member || members.find(k => k.id === m.member.id)) {
          return;
        }
        members.push(m.member);
      });
    });
    this.allMembers = members;
    this.showFiles = false;
  }

  openGroup(group: GroupViewModel) {
    this.current = {
      id: group.id,
      messages: [],
      members: [],
      title: group.title,
      type: ChannelType.Group,
    };
    this.currentMembers = group.members.map(m => m.member);
  }
  openProject(project: ProjectViewModel) {
    this.current = {
      id: project.id,
      messages: [],
      members: [],
      title: project.title,
      type: ChannelType.Project,
    };
    this.currentMembers = project.members
      .filter(p => !p.isGroup)
      .map(m => m.member);
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
    };
    this.currentMembers = project.members
      .filter(p => {
        return (
          !p.isGroup &&
          workPackageViewModel.members.find(m => m.id === p.recordId)
        );
      })
      .map(m => m.member);
  }

  toggleFiles() {
    this.showFiles = !this.showFiles;
  }

  openSetting() {
    // this.modalService.show(MessengerSettingComponent, {}).subscribe(() => {});
  }

  openChannels() {
    this.current = undefined;
    this.currentMembers = [];
  }
}
