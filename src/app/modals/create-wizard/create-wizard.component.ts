import { Component, OnInit } from '@angular/core';
import {SimpleModalComponent} from 'ngx-simple-modal';
import {CreateModalParameters} from '../../view-models/modals/modals-types';
import {CultureService} from '../../services/core/culture.service';
import {FormViewModel} from '../../components/core/form/contracts';
import {FormService} from '../../services/core/form.service';

@Component({
  selector: 'app-create-wizard',
  templateUrl: './create-wizard.component.html',
  styleUrls: ['./create-wizard.component.scss']
})
export class CreateWizardComponent
  extends SimpleModalComponent<CreateModalParameters, boolean>
  implements OnInit {
  WizardMode = WizardMode;
  mode: WizardMode;
  continueAs: WizardMode;
  actionWaiting: boolean;
  cancelWaiting: boolean;
  groupForm: FormViewModel[];

  constructor(
    readonly cultureService: CultureService,
    private readonly formService: FormService
  ) { super(); }

  ngOnInit() {
    this.mode = WizardMode.Choose;
    this.continueAs = WizardMode.SimpleProject;

    this.groupForm = [{
      elements: [
        this.formService.createInput({
          config: { field: 'title', label: 'GROUP_TITLE' },
          params: { model: '' },
          validation: {
            required: {
              value: true,
              message: 'GROUP_TITLE_REQUIRED'
            }
          }
        }),
        this.formService.createInput({
          config: { field: 'description', label: 'DESCRIPTION' },
          params: { model: '', textArea: true },
        }),
        this.formService.createCheckbox({
          config: { field: 'channel', label: '' },
          params: { model: false, label: 'GROUP_REQUIRE_CHANNEL', summary: 'GROUP_CHANNEL_DESCRIPTION'},
        })
      ]
    }];
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
    this.mode = this.continueAs;
  }

  createGroup($event: MouseEvent) {
    $event.stopPropagation();
    $event.preventDefault();
  }
}
enum WizardMode {
  Choose = 1,
  Group = 2,
  SimpleProject = 3,
  ComplexProject = 4,
  Import = 5
}
