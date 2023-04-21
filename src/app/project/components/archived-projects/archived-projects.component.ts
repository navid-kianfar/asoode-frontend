import { Component, OnInit } from '@angular/core';
import { ProjectViewModel } from '../../../view-models/projects/project-types';
import { ProjectService } from '../../services/project.service';
import { OperationResultStatus } from '../../../shared/lib/enums/operation-result-status';

@Component({
  selector: 'app-archived-projects',
  templateUrl: './archived-projects.component.html',
  styleUrls: ['./archived-projects.component.scss'],
})
export class ArchivedProjectsComponent implements OnInit {
  waiting: boolean;
  projects: ProjectViewModel[];

  constructor(private readonly projectService: ProjectService) {}

  ngOnInit() {
    this.fetch();
  }

  async fetch() {
    this.waiting = true;
    const op = await this.projectService.archived();
    this.waiting = false;
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
    }
    this.projects = op.data || [];
  }
}
