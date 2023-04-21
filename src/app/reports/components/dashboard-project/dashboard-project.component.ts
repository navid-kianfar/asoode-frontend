import { Component, Input, OnInit } from '@angular/core';
import { ProjectService } from '../../../project/services/project.service';
import { ModalService } from '../../../shared/services/modal.service';
import { ProjectFilter } from '../../../shared/lib/enums/projects';

@Component({
  selector: 'app-dashboard-project',
  templateUrl: './dashboard-project.component.html',
  styleUrls: ['./dashboard-project.component.scss'],
})
export class DashboardProjectComponent implements OnInit {
  @Input() filter: ProjectFilter;
  ProjectFilter = ProjectFilter;
  constructor(
    readonly projectService: ProjectService,
    private readonly modalService: ModalService,
  ) {}

  ngOnInit() {}

  openModal() {
    // this.modalService.show(CreateWizardComponent, {}).subscribe(() => {});
  }
}
