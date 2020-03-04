import { Component, OnInit } from '@angular/core';
import { IdentityService } from '../../../services/auth/identity.service';
import {ModalService} from '../../../services/core/modal.service';
import {CreateWizardComponent} from '../../../modals/create-wizard/create-wizard.component';
import {CreateModalParameters} from '../../../view-models/modals/modals-types';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(
    public readonly identityService: IdentityService,
    private readonly modalService: ModalService
  ) {}
  ngOnInit() {}

  prepareCreate() {
    this.modalService.show(CreateWizardComponent, {

    } as CreateModalParameters).subscribe(() => {});
  }
}
