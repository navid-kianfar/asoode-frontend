import { Component, OnInit } from '@angular/core';
import { SimpleModalComponent } from 'ngx-simple-modal';
import { CreateModalParameters } from '../../view-models/modals/modals-types';
import { CultureService } from '../../services/core/culture.service';
import { FormViewModel } from '../../components/core/form/contracts';
import { FormService } from '../../services/core/form.service';
import { ValidationService } from '../../services/core/validation.service';

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
  cancelWaiting: boolean;
  requireMapMembers: boolean;
  uploading: boolean;
  mapForm: FormViewModel[];

  constructor(
    readonly cultureService: CultureService,
    private readonly formService: FormService,
  ) {
    super();
  }

  ngOnInit() {
    this.mode = WizardMode.Choose;
    this.continueAs = WizardMode.SimpleProject;
    this.mapForm = [];
  }
  async onAction($event: MouseEvent) {
    $event.stopPropagation();
    $event.preventDefault();
    // this.actionWaiting = true;
  }

  async onCancel($event: MouseEvent) {
    $event.stopPropagation();
    $event.preventDefault();
    this.result = false;
    this.close();
  }

  onBack($event: MouseEvent) {
    $event.stopPropagation();
    $event.preventDefault();
    this.mode = WizardMode.Choose;
  }

  next($event: MouseEvent) {
    $event.stopPropagation();
    $event.preventDefault();

    // RESET ALL
    // this.formService.clean(this.groupForm);
    // this.requireMapMembers = false;
    // this.inviteGroupMembers = false;
    //
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
