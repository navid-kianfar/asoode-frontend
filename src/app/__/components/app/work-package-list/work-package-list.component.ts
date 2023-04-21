import { Component, Input, OnInit } from '@angular/core';
import {
  WorkPackageLabelViewModel,
  WorkPackageTaskViewModel,
  WorkPackageViewModel,
} from '../../../../view-models/projects/project-types';
import { AccessType } from '../../../../shared/lib/enums/enums';
import { WorkPackageBoardComponent } from '../work-package-board/work-package-board.component';

@Component({
  selector: 'app-work-package-list',
  templateUrl: './work-package-list.component.html',
  styleUrls: ['./work-package-list.component.scss'],
})
export class WorkPackageListComponent extends WorkPackageBoardComponent {
  isLabelSelected(
    task: WorkPackageTaskViewModel,
    label: WorkPackageLabelViewModel,
  ): boolean {
    return task.labels.findIndex(i => i.labelId === label.id) !== -1;
  }
}
