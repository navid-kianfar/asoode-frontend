import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  SearchResultViewModel,
  SearchTaskViewModel,
} from '../../../view-models/general/search-types';
import { ModalService } from '../../../services/core/modal.service';
import { TaskModalComponent } from '../../../modals/task-modal/task-modal.component';
import { ProjectViewModel } from '../../../view-models/projects/project-types';
import { ProjectService } from '../../../services/projects/project.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
})
export class SearchResultComponent implements OnInit {
  @Output() hide = new EventEmitter<any>();
  @Input() results: SearchResultViewModel;
  @Input() loading: boolean;
  @Input() term: string;

  constructor(
    private readonly modalService: ModalService,
    private readonly projectService: ProjectService,
    private readonly router: Router,
  ) {}

  ngOnInit() {}

  openTask(task: SearchTaskViewModel) {
    this.modalService
      .show(TaskModalComponent, {
        id: task.id,
        projectId: task.projectId,
        packageId: task.workPackageId,
      })
      .subscribe(() => {});
  }

  openProject(proj: ProjectViewModel) {
    const project = this.projectService.projects.find(p => p.id === proj.id);
    if (!project) {
      return;
    }
    if (project.complex) {
      this.router.navigateByUrl('/project/' + project.id);
      return;
    }
    this.router.navigateByUrl('/work-package/' + project.workPackages[0].id);
  }
}
