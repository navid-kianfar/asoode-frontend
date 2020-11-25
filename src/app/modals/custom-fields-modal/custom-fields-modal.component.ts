import { Component, OnInit } from '@angular/core';
import { SimpleModalComponent } from 'ngx-simple-modal';
import { WorkPackageViewModel } from '../../view-models/projects/project-types';
import { WorkPackageService } from '../../services/projects/work-package.service';

@Component({
  selector: 'app-custom-fields-modal',
  templateUrl: './custom-fields-modal.component.html',
  styleUrls: ['./custom-fields-modal.component.scss'],
})
export class CustomFieldsModalComponent
  extends SimpleModalComponent<{ workPackage: WorkPackageViewModel }, void>
  implements OnInit {
  ViewMode = ViewMode;
  workPackage: WorkPackageViewModel;
  mode: ViewMode;
  constructor(private readonly workPackageService: WorkPackageService) {
    super();
  }

  ngOnInit() {
    this.mode = ViewMode.Init;
  }
}
enum ViewMode {
  Init = 0,
  Create = 1,
}
