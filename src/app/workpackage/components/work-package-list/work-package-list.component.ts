import { Component } from '@angular/core';
import {
  WorkPackageLabelViewModel,
  WorkPackageTaskViewModel,
} from '../../../view-models/projects/project-types';
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
