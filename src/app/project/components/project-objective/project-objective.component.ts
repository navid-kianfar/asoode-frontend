import { Component, Input, OnInit } from '@angular/core';
import {
  ProjectObjectiveEstimatedPriceViewModel,
  ProjectViewModel,
  WorkPackageObjectiveViewModel,
} from '../../../view-models/projects/project-types';
import { AccessType } from '../../../shared/lib/enums/enums';
import { ProjectService } from '../../services/project.service';

import { OperationResultStatus } from '../../../shared/lib/enums/operation-result-status';

@Component({
  selector: 'app-project-objective',
  templateUrl: './project-objective.component.html',
  styleUrls: ['./project-objective.component.scss'],
})
export class ProjectObjectiveComponent implements OnInit {
  @Input() model: ProjectViewModel;
  @Input() permission: AccessType;
  selected: WorkPackageObjectiveViewModel;
  estimated: ProjectObjectiveEstimatedPriceViewModel[];
  objectives: WorkPackageObjectiveViewModel[];
  estimatedTotalTime: number;
  estimatedTotalAmount: number;
  waiting: boolean;
  detailWaiting: boolean;
  constructor(private readonly projectService: ProjectService) {}

  ngOnInit() {
    this.fetch();
  }

  async fetch() {
    this.objectives = [];
    this.estimated = [];
    this.waiting = true;
    const op = await this.projectService.objectives(this.model.id);
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
      return;
    }
    this.waiting = false;
    this.objectives = op.data;
  }

  async pickObjective(objective: WorkPackageObjectiveViewModel) {
    this.selected = objective;

    this.detailWaiting = true;
    const op = await this.projectService.objectiveDetails(objective.id);
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
      return;
    }
    this.detailWaiting = false;
    this.estimated = op.data;
    this.estimatedTotalAmount = this.estimated
      .map(e => e.amount)
      .reduce((p, c) => p + c, 0);
    this.estimatedTotalTime = this.estimated
      .map(e => e.time)
      .reduce((p, c) => p + c, 0);
  }
}
