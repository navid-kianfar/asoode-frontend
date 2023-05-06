import { Component, Inject, OnInit } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { WorkPackageWizardDto } from '../../../view-models/work-package/work-package.dtos';

@Component({
  selector: 'app-work-package-wizard',
  templateUrl: './work-package-wizard.component.html',
  styleUrls: ['./work-package-wizard.component.scss'],
})
export class WorkPackageWizardComponent implements OnInit {

  constructor(
    public dialogRef: DialogRef<boolean>,
    @Inject(DIALOG_DATA) public data: WorkPackageWizardDto,
  ) {
  }

  ngOnInit() {}
}
