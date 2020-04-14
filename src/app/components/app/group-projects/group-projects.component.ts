import { Component, Input, OnInit } from '@angular/core';
import { GroupViewModel } from '../../../view-models/groups/group-types';
import { MockService } from '../../../services/general/mock.service';
import {AccessType, ActivityType} from '../../../library/app/enums';
import { ProjectService } from '../../../services/projects/project.service';
import { ProjectViewModel } from '../../../view-models/projects/project-types';
import {Socket} from 'ngx-socket-io';

@Component({
  selector: 'app-group-projects',
  templateUrl: './group-projects.component.html',
  styleUrls: ['./group-projects.component.scss'],
})
export class GroupProjectsComponent implements OnInit {
  @Input() group: GroupViewModel;
  @Input() permission: AccessType;
  projects: ProjectViewModel[];
  constructor(
    private readonly projectService: ProjectService,
    private readonly socket: Socket,
  ) {}

  ngOnInit() {
    this.find();
    this.socket.on('push-notification', (notification: any) => {
      switch (notification.type) {
        case ActivityType.ProjectAdd:
        case ActivityType.ProjectRemove:
          this.find();
          break;
      }
    });
  }
  find() {
    this.projects = this.projectService.projects.filter(p => {
      return p.members.find(m => m.isGroup && m.recordId === this.group.id);
    });
  }
}
