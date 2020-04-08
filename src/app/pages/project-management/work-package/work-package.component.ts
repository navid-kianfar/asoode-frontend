import { Component, OnInit } from '@angular/core';
import {
  ProjectViewModel, WorkPackageMemberViewModel,
  WorkPackageViewModel,
} from '../../../view-models/projects/project-types';
import { ProjectService } from '../../../services/projects/project.service';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkPackageService } from '../../../services/projects/work-package.service';
import { OperationResultStatus } from '../../../library/core/enums';
import {MemberInfoViewModel} from '../../../view-models/auth/identity-types';
import {PopperContent} from 'ngx-popper';
import {InviteModalComponent} from '../../../modals/invite-modal/invite-modal.component';
import {ModalService} from '../../../services/core/modal.service';
import {CultureService} from '../../../services/core/culture.service';

@Component({
  selector: 'app-work-package',
  templateUrl: './work-package.component.html',
  styleUrls: ['./work-package.component.scss'],
})
export class WorkPackageComponent implements OnInit {
  ViewMode = ViewMode;
  mode: ViewMode;
  project: ProjectViewModel;
  workPackage: WorkPackageViewModel;
  waiting: boolean;
  filters: {
    mine: boolean,
    archived: boolean,
    active: boolean
  };
  currentMember: WorkPackageMemberViewModel;
  toggleSetting: boolean;
  constructor(
    readonly cultureService: CultureService,
    private readonly modalService: ModalService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly projectService: ProjectService,
    private readonly workPackageService: WorkPackageService,
  ) {}

  ngOnInit() {
    this.toggleSetting = false;
    this.filters = {
      mine: false,
      archived: false,
      active: false
    };
    this.mode = ViewMode.Board;
    const id = this.activatedRoute.snapshot.params.id;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.projectService.projects.length; i++) {
      this.workPackage = this.projectService.projects[i].workPackages.find(
        w => w.id === id,
      );
      if (this.workPackage) {
        this.project = this.projectService.projects[i];
        break;
      }
    }
    if (!this.workPackage) {
      this.router.navigateByUrl('dashboard');
      return;
    }
    if (this.workPackage.progress === undefined) {
      this.workPackage.progress = 0;
    }
    console.log(this.project.members, this.workPackage.members);
    this.fetch();
  }

  async fetch() {
    this.waiting = true;
    const op = await this.workPackageService.fetch(this.workPackage.id);
    if (op.status !== OperationResultStatus.Success) {
      this.router.navigateByUrl('dashboard');
      return;
    }
    this.workPackage = op.data;
    this.waiting = false;
  }

  findMember(recordId: string): MemberInfoViewModel {
    const access = this.project.members.find(m => m.recordId === recordId);
    return access.member;
  }

  showMemberInfo(member: WorkPackageMemberViewModel, popper: PopperContent) {
    this.currentMember = member;
    // setTimeout(() => {
    //   if (!popper.state) {
    //     debugger;
    //     popper.toggleVisibility(true);
    //   }
    // }, 300);
  }

  prepareInvite() {
    this.modalService.show(InviteModalComponent, {

    }).subscribe(() => {});
  }
}
export enum ViewMode {
  Board = 1,
  List = 2,
  TimeSpan = 3,
  Calendar = 4,
}
