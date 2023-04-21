import { Component, Input, OnInit } from '@angular/core';
import { GroupViewModel } from '../../../../view-models/groups/group-types';
import { AccessType } from '../../../../shared/lib/enums/enums';
import { ProjectService } from '../../../../project/services/project.service';
import { ProjectViewModel } from '../../../../view-models/projects/project-types';
import { Socket } from 'ngx-socket-io';
import { ActivityType } from '../../../../shared/lib/enums/activity-type';

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
