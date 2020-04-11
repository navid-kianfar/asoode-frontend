import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {
  ProjectViewModel, WorkPackageLabelViewModel,
  WorkPackageListViewModel, WorkPackageMemberViewModel,
  WorkPackageTaskLabelViewModel,
  WorkPackageTaskViewModel,
  WorkPackageViewModel
} from '../../../view-models/projects/project-types';
import {IdentityService} from '../../../services/auth/identity.service';
import {WorkPackageTaskVoteNecessity} from '../../../library/app/enums';
import {MemberInfoViewModel} from '../../../view-models/auth/identity-types';

@Component({
  selector: 'app-work-package-task',
  templateUrl: './work-package-task.component.html',
  styleUrls: ['./work-package-task.component.scss']
})
export class WorkPackageTaskComponent implements OnInit {
  @Input() project: ProjectViewModel;
  @Input() workPackage: WorkPackageViewModel;
  @Input() model: WorkPackageTaskViewModel;
  @Input() list: WorkPackageListViewModel;

  allWatching: string[];
  WorkPackageTaskVoteNecessity = WorkPackageTaskVoteNecessity;
  constructor(private readonly identityService: IdentityService) { }

  ngOnInit() {
    this.allWatching = this.model.members
      .filter(m => m.recordId === this.identityService.identity.userId && m.watching)
      .map(m => m.taskId);
  }

  isLabelSelected(label: WorkPackageLabelViewModel): boolean {
    return this.model.labels.findIndex(i => i.labelId === label.id) !== -1;
  }
}
