import {Component, OnInit} from '@angular/core';
import {MessengerService} from '../../../services/communication/messenger.service';
import {ChannelViewModel} from '../../../view-models/communication/messenger-types';
import {ChannelType} from '../../../library/app/enums';
import {ModalService} from '../../../services/core/modal.service';
import {MessengerSettingComponent} from '../../../modals/messenger-setting/messenger-setting.component';
import {ProjectService} from '../../../services/projects/project.service';
import {GroupService} from '../../../services/groups/group.service';
import {GroupViewModel} from '../../../view-models/groups/group-types';
import {ProjectViewModel, WorkPackageViewModel} from '../../../view-models/projects/project-types';
import {MemberInfoViewModel} from '../../../view-models/auth/identity-types';

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
  ) {}

  ngOnInit() {
    const members = [];
    this.groupService.groups.forEach(g => {
      g.members.forEach(m => {
        if (!m.member || members.find(k => k.id === m.member.id)) { return; }
        members.push(m.member);
      });
    });
    this.projectService.projects.forEach(g => {
      g.members.forEach(m => {
        console.log(m);
        if (m.isGroup || !m.member || members.find(k => k.id === m.member.id)) { return; }
        members.push(m.member);
      });
    });
    this.allMembers = members;
    this.showFiles = true;
  }

  openGroup(group: GroupViewModel) {
    this.current = {
      recordId: group.id,
      messages: [],
      members: [],
      title: group.title,
      type: ChannelType.Group
    };
    this.currentMembers = group.members.map(m => m.member);
  }
  openProject(project: ProjectViewModel) {
    this.current = {
      recordId: project.id,
      messages: [],
      members: [],
      title: project.title,
      type: ChannelType.Project
    };
    this.currentMembers = project.members.filter(p => !p.isGroup).map(m => m.member);
  }

  openWorkPackage(project: ProjectViewModel, workPackageViewModel: WorkPackageViewModel) {
    this.current = {
      recordId: workPackageViewModel.id,
      messages: [],
      members: [],
      title: workPackageViewModel.title,
      type: ChannelType.WorkPackage
    };
    this.currentMembers = project.members.filter(p => {
      return !p.isGroup && workPackageViewModel.members.find(m => m.id === p.recordId);
    }).map(m => m.member);
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
