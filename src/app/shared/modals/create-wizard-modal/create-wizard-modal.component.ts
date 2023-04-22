import { Component, Inject, OnInit } from '@angular/core';

import { CreateModalParameters } from '../../../view-models/modals/modals-types';
import { CultureService } from '../../services/culture.service';
import { IdentityService } from '../../../auth/services/identity.service';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-create-wizard-modal',
  templateUrl: './create-wizard-modal.component.html',
  styleUrls: ['./create-wizard-modal.component.scss'],
})
export class CreateWizardModalComponent implements OnInit {
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
  parentId?: string;

  constructor(
    readonly cultureService: CultureService,
    readonly identityService: IdentityService,
    public dialogRef: DialogRef<boolean>,
    @Inject(DIALOG_DATA) public data: CreateModalParameters
  ) { }

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
  async onCancel($event: MouseEvent = null) {
    $event?.stopPropagation();
    $event?.preventDefault();
    this.dialogRef.close(false);
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
