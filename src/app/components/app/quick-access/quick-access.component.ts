import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ProjectService } from '../../../services/projects/project.service';
import { GroupService } from '../../../services/groups/group.service';
import { MockService } from '../../../services/general/mock.service';
import { GroupViewModel } from '../../../view-models/groups/group-types';
import { ProjectViewModel } from '../../../view-models/projects/project-types';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quick-access',
  templateUrl: './quick-access.component.html',
  styleUrls: ['./quick-access.component.scss'],
})
export class QuickAccessComponent implements OnInit {
  @Output() hide = new EventEmitter<any>();
  showMoreProjects: boolean;
  showMoreGroups: boolean;

  constructor(
    readonly projectService: ProjectService,
    readonly groupService: GroupService,
    private readonly router: Router,
  ) {}

  ngOnInit() {}

  openGroup(group: GroupViewModel) {
    this.router.navigateByUrl('group/' + group.id);
    this.hide.emit();
  }

  openProject(project: ProjectViewModel) {
    if (project.complex) {
      this.router.navigateByUrl('project/' + project.id);
      this.hide.emit();
      return;
    }
    this.router.navigateByUrl('work-package/' + project.workPackages[0].id);
    this.hide.emit();
  }

  moreProjects() {
    this.showMoreProjects = true;
  }

  moreGroups() {
    this.showMoreGroups = true;
  }
}
