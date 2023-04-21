import { Component, OnInit } from '@angular/core';
import { WorkPackageViewModel } from '../../../view-models/projects/project-types';

import {
  MapMarker,
  MapModalParameters,
} from '../../../view-models/general/map-types';
import { WorkPackageService } from '../../../workpackage/services/work-package.service';

import { OperationResultStatus } from '../../../shared/lib/enums/operation-result-status';

@Component({
  selector: 'app-work-package-permission',
  templateUrl: './work-package-permission.component.html',
  styleUrls: ['./work-package-permission.component.scss'],
})
export class WorkPackagePermissionComponent
  extends SimpleModalComponent<{ workPackage: WorkPackageViewModel }, void>
  implements OnInit {
  workPackage: WorkPackageViewModel;
  waiting: boolean;
  cssClass: string;
  title: string;

  constructor(private readonly packageService: WorkPackageService) {
    super();
  }

  ngOnInit() {}

  async save() {
    this.waiting = true;
    const op = await this.packageService.changePermissions(
      this.workPackage.id,
      {
        permissionComment: this.workPackage.permissionComment,
        permissionEditAttachment: this.workPackage.permissionEditAttachment,
        permissionCreateAttachment: this.workPackage.permissionCreateAttachment,
        permissionAssignMembers: this.workPackage.permissionAssignMembers,
        permissionAssignLabels: this.workPackage.permissionAssignLabels,
        permissionChangeTaskState: this.workPackage.permissionChangeTaskState,
        permissionEditTask: this.workPackage.permissionEditTask,
        permissionArchiveTask: this.workPackage.permissionArchiveTask,
        permissionCreateTask: this.workPackage.permissionCreateTask,
        permissionArchiveList: this.workPackage.permissionArchiveList,
        permissionEditList: this.workPackage.permissionEditList,
        permissionCreateList: this.workPackage.permissionCreateList,
      },
    );
    this.waiting = false;
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error;
      return;
    }
    this.close();
  }
}
