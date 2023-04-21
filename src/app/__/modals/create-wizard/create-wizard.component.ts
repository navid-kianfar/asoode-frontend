import { Component, OnInit } from '@angular/core';

import { CreateModalParameters } from '../../../view-models/modals/modals-types';
import { CultureService } from '../../../shared/services/culture.service';
import { IdentityService } from '../../../auth/services/identity.service';

@Component({
  selector: 'app-create-wizard',
  templateUrl: './create-wizard.component.html',
  styleUrls: ['./create-wizard.component.scss'],
})
export class CreateWizardComponent
  extends SimpleModalComponent<CreateModalParameters, boolean>
  implements OnInit {
  WizardMode = WizardMode;
  mode: WizardMode;
  continueAs: WizardMode;
  actionWaiting: boolean;
  uploading: boolean;
  premium?: boolean;
  simpleProject?: boolean;
  simpleGroup?: boolean;
  complexProject?: boolean;
  complexGroup?: boolean;
  canCreateGroup: boolean;
  canCreateWorkPackage: boolean;
  canCreateProject: boolean;
  parentId?: string;

  constructor(
    readonly cultureService: CultureService,
    readonly identityService: IdentityService,
  ) {
    super();
  }

  ngOnInit() {

    this.mode = WizardMode.Choose;
    this.continueAs = WizardMode.SimpleProject;

    if (this.simpleGroup) {
      this.mode = WizardMode.Group;
      this.continueAs = WizardMode.Group;
    }
    if (this.simpleProject) {
      this.mode = WizardMode.SimpleProject;
      this.continueAs = WizardMode.SimpleProject;
    }
    if (this.simpleGroup) {
      this.mode = WizardMode.Group;
      this.continueAs = WizardMode.Group;
    }
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
enum WizardMode {
  Choose = 1,
  Group = 2,
  SimpleProject = 3,
  ComplexProject = 4,
  Import = 5,
}
