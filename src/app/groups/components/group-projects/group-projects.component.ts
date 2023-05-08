import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { GroupViewModel } from '../../../view-models/groups/group-types';
import { AccessType } from '../../../shared/lib/enums/enums';
import { ProjectService } from '../../../project/services/project.service';
import { ProjectViewModel } from '../../../view-models/projects/project-types';
import { ActivityType } from '../../../shared/lib/enums/activity-type';
import { SocketListenerService } from '../../../shared/services/socket-listener.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-group-projects',
  templateUrl: './group-projects.component.html',
  styleUrls: ['./group-projects.component.scss'],
})
export class GroupProjectsComponent implements OnInit, OnDestroy {
  @Input() group: GroupViewModel;
  @Input() permission: AccessType;
  projects: ProjectViewModel[];
  private listener: Subscription;
  constructor(
    private readonly projectService: ProjectService,
    private readonly socket: SocketListenerService,
  ) {}

  ngOnInit() {
    this.find();
    this.listener = this.socket.listener.subscribe((notification: any) => {
      switch (notification.type) {
        case ActivityType.ProjectAdd:
        case ActivityType.ProjectRemove:
          this.find();
          break;
      }
    });
  }
  ngOnDestroy(): void {
    this.listener.unsubscribe();
  }
  find() {
    this.projects = this.projectService.projects.filter(p => {
      return p.members.find(m => m.isGroup && m.recordId === this.group.id);
    });
  }

}
