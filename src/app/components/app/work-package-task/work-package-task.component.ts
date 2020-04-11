import {Component, Input, OnInit} from '@angular/core';
import {
  ProjectViewModel,
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
  allLabels: WorkPackageTaskLabelViewModel[];
  WorkPackageTaskVoteNecessity = WorkPackageTaskVoteNecessity;
  allMembers: string[];
  constructor(private readonly identityService: IdentityService) { }

  ngOnInit() {
    this.allWatching = this.model.members
      .filter(m => m.recordId === this.identityService.identity.userId && m.watching)
      .map(m => m.taskId);
    this.allLabels = this.model.labels
      .filter(m => m.taskId === this.model.id)
      .map(m => {
        const color = this.workPackage.labels.find(l => l.id === m.labelId);
        return {
          labelId: m.labelId,
          id: m.id,
          taskId: m.taskId,
          packageId: m.packageId,
          color: color.color,
          title: color.title,
          dark: color.darkColor
        } as WorkPackageTaskLabelViewModel;
      });
    this.allMembers = this.model.members.map(m => m.recordId);
  }

}
