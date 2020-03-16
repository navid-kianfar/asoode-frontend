import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CultureService } from '../../../services/core/culture.service';
import { FormService } from '../../../services/core/form.service';
import { FormViewModel } from '../../core/form/contracts';

@Component({
  selector: 'app-group-wizard',
  templateUrl: './group-wizard.component.html',
  styleUrls: ['./group-wizard.component.scss'],
})
export class GroupWizardComponent implements OnInit {
  @Output() back = new EventEmitter();
  @Output() exit = new EventEmitter();
  ViewMode = ViewMode;
  mode: ViewMode;
  groupForm: FormViewModel[];
  actionWaiting: boolean;
  constructor(
    readonly cultureService: CultureService,
    private readonly formService: FormService,
  ) {}

  ngOnInit() {
    this.mode = ViewMode.Form;
    this.groupForm = [
      {
        elements: [
          this.formService.createInput({
            config: {
              field: 'title',
              label: '',
              cssClass: 'group-title',
              hideLabel: true,
            },
            params: { model: '', placeHolder: 'GROUP_TITLE' },
            validation: {
              required: {
                value: true,
                message: 'GROUP_TITLE_REQUIRED',
              },
            },
          }),
          this.formService.createInput({
            config: { field: 'description', label: '', hideLabel: true },
            params: { model: '', textArea: true, placeHolder: 'DESCRIPTION' },
          }),
          this.formService.createCheckbox({
            config: { field: 'channel', label: '' },
            params: {
              model: true,
              label: 'GROUP_REQUIRE_CHANNEL',
              summary: 'GROUP_CHANNEL_DESCRIPTION',
            },
          }),
        ],
      },
    ];
  }
  onBack($event: MouseEvent) {
    $event.stopPropagation();
    $event.preventDefault();
    if (this.mode === ViewMode.Invite) {
      this.mode = ViewMode.Form;
      return;
    }
    this.back.emit();
  }
  async onCancel($event: MouseEvent) {
    $event.stopPropagation();
    $event.preventDefault();
    this.exit.emit();
  }
  createGroup($event: MouseEvent) {
    $event.stopPropagation();
    $event.preventDefault();
  }

  inviteToGroup($event: MouseEvent) {
    const model = this.formService.prepare(this.groupForm);
    console.log(model);
    if (!model) {
      return;
    }
    this.mode = ViewMode.Invite;
  }
}
export enum ViewMode {
  Form = 1,
  Invite = 2,
}
