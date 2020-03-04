import { Component, OnInit } from '@angular/core';
import {SimpleModalComponent} from 'ngx-simple-modal';
import {CreateModalParameters} from '../../view-models/modals/modals-types';

@Component({
  selector: 'app-create-wizard',
  templateUrl: './create-wizard.component.html',
  styleUrls: ['./create-wizard.component.scss']
})
export class CreateWizardComponent
  extends SimpleModalComponent<CreateModalParameters, boolean>
  implements OnInit {

  constructor() { super(); }

  ngOnInit() {
  }

}
