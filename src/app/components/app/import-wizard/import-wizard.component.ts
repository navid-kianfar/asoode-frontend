import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormViewModel} from '../../core/form/contracts';
import {CultureService} from '../../../services/core/culture.service';
import {FormService} from '../../../services/core/form.service';
import {ValidationService} from '../../../services/core/validation.service';

@Component({
  selector: 'app-import-wizard',
  templateUrl: './import-wizard.component.html',
  styleUrls: ['./import-wizard.component.scss']
})
export class ImportWizardComponent implements OnInit {

  @Input() complex: boolean;
  @Output() back = new EventEmitter();
  @Output() exit = new EventEmitter();
  mapForm: FormViewModel[];
  requireMapMembers: boolean;
  actionWaiting: boolean;
  uploading: boolean;

  constructor(
    readonly cultureService: CultureService,
    private readonly formService: FormService,
  ) { }

  ngOnInit() {
  }
  onBack($event: MouseEvent) {
    $event.stopPropagation();
    $event.preventDefault();
    if (this.requireMapMembers) {
      this.requireMapMembers = false;
      return;
    }
    this.back.emit();
  }
  async onCancel($event: MouseEvent) {
    $event.stopPropagation();
    $event.preventDefault();
    this.exit.emit();
  }
  importFromTrello() {
    this.requireMapMembers = true;
    this.mapForm = [
      {
        elements: [
          this.formService.createLabel({
            config: { field: '', label: 'IMPORT_USERNAME' },
            params: { label: 'IMPORT_USER_MAPPED_EMAIL' },
          }),
          ...[
            { id: '1', username: 'Navid Kianfar' },
            { id: '2', username: 'Saba Kianfar' },
            { id: '3', username: 'Hamid Siahpoosh' },
            { id: '4', username: 'Pouya Faridi' },
            { id: '5', username: 'Neda Toussi' },
          ].map(user => {
            return this.formService.createInput({
              config: { field: user.id, label: user.username },
              params: { model: '' },
              validation: {
                required: {
                  value: true,
                  message: 'EMAIL_REQUIRED',
                },
                pattern: {
                  value: ValidationService.emailRegex,
                  message: 'EMAIL_INVALID',
                },
              },
            });
          }),
        ],
      },
    ];
  }

  importFromTaskWorld() {}

  importFromMonday() {}

  importFromTaskulu() {}

  importTrelloMapped($event: MouseEvent) {
    const model = this.formService.prepare(this.mapForm);
    console.log(model);
  }

}
