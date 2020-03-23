import { Component, Input, OnInit } from '@angular/core';
import { GroupViewModel } from '../../../view-models/groups/group-types';
import { MockService } from '../../../services/mock.service';
import { AccessType } from '../../../library/app/enums';
import { ProjectService } from '../../../services/projects/project.service';
import { ProjectViewModel } from '../../../view-models/projects/project-types';

@Component({
  selector: 'app-group-projects',
  templateUrl: './group-projects.component.html',
  styleUrls: ['./group-projects.component.scss'],
})
export class GroupProjectsComponent implements OnInit {
  @Input() group: GroupViewModel;
  @Input() permission: AccessType;
  projects: ProjectViewModel[];
  constructor(private readonly projectService: ProjectService) {}

  ngOnInit() {
    this.projects = this.projectService.projects.filter(p => {
      return p.members.find(m => m.isGroup && m.recordId === this.group.id);
    });
  }
}
