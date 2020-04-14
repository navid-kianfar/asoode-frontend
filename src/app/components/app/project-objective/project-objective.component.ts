import { Component, Input, OnInit } from '@angular/core';
import {
  ProjectObjectiveEstimatedPriceViewModel,
  WorkPackageObjectiveViewModel,
  ProjectViewModel,
} from '../../../view-models/projects/project-types';
import { MockService } from '../../../services/general/mock.service';
import { AccessType } from '../../../library/app/enums';

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
  estimatedTotalTime: number;
  estimatedTotalAmount: number;
  constructor(readonly mockService: MockService) {}

  ngOnInit() {
    this.estimated = [
      {
        date: new Date(),
        amount: 100000,
        time: 1000000,
        group: 'Development',
        user: 'Navid Kianfar',
      },
      {
        date: new Date(),
        amount: 100000,
        time: 1000000,
        group: 'Development',
        user: 'Navid Kianfar',
      },
      {
        date: new Date(),
        amount: 100000,
        time: 1000000,
        group: 'Development',
        user: 'Navid Kianfar',
      },
      {
        date: new Date(),
        amount: 100000,
        time: 1000000,
        group: 'Development',
        user: 'Navid Kianfar',
      },
      {
        date: new Date(),
        amount: 100000,
        time: 1000000,
        group: 'Development',
        user: 'Navid Kianfar',
      },
      {
        date: new Date(),
        amount: 100000,
        time: 1000000,
        group: 'Development',
        user: 'Navid Kianfar',
      },
      {
        date: new Date(),
        amount: 100000,
        time: 1000000,
        group: 'Development',
        user: 'Navid Kianfar',
      },
    ];
    this.estimatedTotalAmount = this.estimated
      .map(e => e.amount)
      .reduce((p, c) => p + c, 0);
    this.estimatedTotalTime = this.estimated
      .map(e => e.time)
      .reduce((p, c) => p + c, 0);
  }
}
