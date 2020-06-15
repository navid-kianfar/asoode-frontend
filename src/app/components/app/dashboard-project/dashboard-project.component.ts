import { Component, Input, OnInit } from '@angular/core';
import { ProjectService } from '../../../services/projects/project.service';
import { ProjectFilter } from '../../../library/app/enums';
import { ModalService } from '../../../services/core/modal.service';
import { CreateWizardComponent } from '../../../modals/create-wizard/create-wizard.component';

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
    this.modalService.show(CreateWizardComponent, {}).subscribe(() => {});
  }
}
