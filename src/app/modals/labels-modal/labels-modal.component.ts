import { Component, OnInit } from '@angular/core';
import { SimpleModalComponent } from 'ngx-simple-modal';
import {WorkPackageLabelViewModel, WorkPackageViewModel} from '../../view-models/projects/project-types';
import { WorkPackageService } from '../../services/projects/work-package.service';
import {StringHelpers} from '../../helpers/string.helpers';
import {OperationResultStatus} from '../../library/core/enums';
import {TranslateService} from '../../services/core/translate.service';
import {ModalService} from '../../services/core/modal.service';

@Component({
  selector: 'app-labels-modal',
  templateUrl: './labels-modal.component.html',
  styleUrls: ['./labels-modal.component.scss'],
})
export class LabelsModalComponent
  extends SimpleModalComponent<{ workPackage: WorkPackageViewModel }, void>
  implements OnInit {
  workPackage: WorkPackageViewModel;
  temp: WorkPackageLabelViewModel;
  constructor(
    private readonly workPackageService: WorkPackageService,
    private readonly translateService: TranslateService,
    private readonly modalService: ModalService,
  ) {
    super();
  }

  ngOnInit() {
    this.reset();
  }

  reset() {
    this.temp = {
      title: '',
      color: '#6b3d8d',
      waiting: false,
      packageId: this.workPackage.id,
      createdAt: new Date(),
      id: undefined,
      updatedAt: undefined,
      darkColor: false,
      editting: false,
      tempName: ''
    };
  }

  prepareRenameLabel(label: WorkPackageLabelViewModel, $event: MouseEvent) {
    $event.stopPropagation();
    $event.preventDefault();
    this.workPackage.labels.forEach(l => {
      if (l.waiting) {
        return;
      }
      if (l.editting) {
        l.editting = false;
      }
    });
    label.editting = true;
    label.tempName = label.title;
    label.tempColor = label.color;
  }

  deleteLabel(label: WorkPackageLabelViewModel, $event: MouseEvent) {
    $event.preventDefault();
    $event.stopPropagation();
    const heading = StringHelpers.format(
      this.translateService.fromKey('REMOVE_LABEL_CONFIRM_HEADING'),
      [label.title],
    );
    this.modalService
      .confirm({
        title: 'REMOVE_LABEL',
        message: 'REMOVE_LABEL_CONFIRM',
        heading,
        actionLabel: 'REMOVE_LABEL',
        cancelLabel: 'CANCEL',
        action: async () => {
          return await this.workPackageService.removeLabel(label.id);
        },
      })
      .subscribe(() => {});
  }

  async saveLabelName(label: WorkPackageLabelViewModel, $event) {
    $event.stopPropagation();
    $event.preventDefault();
    const title = label.tempName.trim();
    const color = label.tempColor.trim();
    if (title === label.title && color === label.color) {
      label.editting = false;
      return;
    }
    label.waiting = true;
    const op = await this.workPackageService.renameLabel(label.id, {title, color});
    label.waiting = false;
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
      return;
    }
    label.title = label.tempName;
    label.editting = false;
  }

  handleClick($event: MouseEvent, label: WorkPackageLabelViewModel) {
    if (label.editting) {
      $event.stopPropagation();
      $event.preventDefault();
      return;
    }
  }

  async createLabel(label: WorkPackageLabelViewModel, $event: MouseEvent) {
    $event.stopPropagation();
    $event.preventDefault();
    const title = label.title.trim();
    const color = label.color.trim();
    label.waiting = true;
    const op = await this.workPackageService.createLabel(this.workPackage.id, {title, color});
    label.waiting = false;
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
      return;
    }
    this.reset();
  }
}
