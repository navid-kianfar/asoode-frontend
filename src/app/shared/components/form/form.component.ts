import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormViewModel } from './contracts';
import { FormElementType } from '../../lib/enums/enums';
import { ModalProgress } from '../../../view-models/core/modal-types';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  @Input() elements: FormViewModel[];
  @Input() cssClass: string;
  @Input() standalone?: boolean;
  @Input() uploading?: ModalProgress;
  @Input() disabled: boolean;
  @Input() readonly: boolean;
  @Input() inline: boolean;
  @Input() actionWaiting: boolean;
  @Input() actionLabel: string;
  @Input() allowCancel: boolean;
  @Output() action = new EventEmitter();
  @Input() cancelWaiting: boolean;
  @Input() cancelLabel: string;
  @Output() cancel = new EventEmitter();

  FormElementType = FormElementType;
  constructor() {}

  ngOnInit() {}

  checkDisabled(group: FormViewModel, element: any) {
    return (
      this.cancelWaiting ||
      this.actionWaiting ||
      this.disabled ||
      group.disabled ||
      element.disabled ||
      element.params.disabled
    );
  }

  // labelContent(params: any) {
  //   let pipe = params.pipe;
  //   if (params.enum) {
  //     pipe = 'enum';
  //   }
  //   switch (pipe) {
  //     case 'enum':
  //       return this.enumPipe.transform(params.model, params.enum);
  //     case 'translate':
  //       return this.translatePipe.transform(params.model, true);
  //     case 'cultured_date':
  //       return this.culturedDatePipe.transform(params.model, true);
  //     case 'number':
  //       return this.numberPipe.transform(params.model);
  //     case 'humanSize':
  //       return this.humanSizePipe.transform(params.model);
  //     default:
  //       return params.model;
  //   }
  // }

  columnSize(group: FormViewModel): string {
    if (!group.size) {
      return 'col-sm-12';
    }
    if (typeof group.size === 'number') {
      return 'col-sm-' + group.size;
    }
    return group.size;
  }
}
