import { Component, OnInit } from '@angular/core';
import {SimpleModalComponent} from 'ngx-simple-modal';
import {WorkPackageViewModel} from '../../view-models/projects/project-types';

@Component({
  selector: 'app-upgrade-work-package',
  templateUrl: './upgrade-work-package.component.html',
  styleUrls: ['./upgrade-work-package.component.scss']
})
export class UpgradeWorkPackageComponent
  extends SimpleModalComponent<{ workPackage: WorkPackageViewModel }, any>
  implements OnInit {
  WizardMode = WizardMode;
  mode: WizardMode;
  continueAs: WizardMode;
  workPackage: WorkPackageViewModel;
  constructor() { super(); }

  ngOnInit() {
    this.mode = WizardMode.Choose;
    this.continueAs = WizardMode.Upgrade;
  }

  async onCancel($event: MouseEvent) {
    $event.stopPropagation();
    $event.preventDefault();
    this.result = false;
    this.close();
  }

  next($event: MouseEvent) {
    $event.stopPropagation();
    $event.preventDefault();
    this.mode = this.continueAs;
  }
}
export enum WizardMode {
  Choose = 1,
  Upgrade = 2,
  Connect = 3,
  Merge = 4
}
