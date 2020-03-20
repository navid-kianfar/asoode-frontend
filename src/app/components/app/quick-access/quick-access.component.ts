import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ProjectService } from '../../../services/projects/project.service';
import { GroupService } from '../../../services/groups/group.service';
import { MockService } from '../../../services/mock.service';
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
    this.router.navigateByUrl(project.complex ? 'project' : 'work-package');
    this.hide.emit();
  }
}
