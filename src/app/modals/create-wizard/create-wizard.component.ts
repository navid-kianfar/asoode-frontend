import { Component, OnInit } from '@angular/core';
import {SimpleModalComponent} from 'ngx-simple-modal';
import {CreateModalParameters} from '../../view-models/modals/modals-types';
import {CultureService} from '../../services/core/culture.service';

@Component({
  selector: 'app-create-wizard',
  templateUrl: './create-wizard.component.html',
  styleUrls: ['./create-wizard.component.scss']
})
export class CreateWizardComponent
  extends SimpleModalComponent<CreateModalParameters, boolean>
  implements OnInit {
  WizardMode = WizardMode;
  actionWaiting: boolean;
  cancelWaiting: boolean;
  mode: WizardMode;
  continueAs: WizardMode;

  constructor(readonly cultureService: CultureService) { super(); }

  ngOnInit() {
    this.mode = WizardMode.Choose;
    this.continueAs = WizardMode.SimpleProject;
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
}
enum WizardMode {
  Choose = 1,
  Group = 2,
  SimpleProject = 3,
  ComplexProject = 4,
  Import = 5
}
