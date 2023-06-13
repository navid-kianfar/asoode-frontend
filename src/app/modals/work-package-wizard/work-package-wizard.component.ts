import { Component, OnInit } from '@angular/core';
import { SimpleModalComponent } from 'ngx-simple-modal';
import { MemberInfoViewModel } from '../../view-models/auth/identity-types';

@Component({
  selector: 'app-work-package-wizard',
  templateUrl: './work-package-wizard.component.html',
  styleUrls: ['./work-package-wizard.component.scss'],
})
export class WorkPackageWizardComponent
  extends SimpleModalComponent<
    {
      projectId: string;
      parentId?: string;
    },
    boolean
  >
  implements OnInit
{
  projectId: string;
  parentId: string;

  constructor() {
    super();
  }

  ngOnInit() {}
}
