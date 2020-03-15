import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CultureService} from '../../../services/core/culture.service';
import {FormService} from '../../../services/core/form.service';
import {FormViewModel} from '../../core/form/contracts';
import {MockService} from '../../../services/mock.service';
import {ProjectTemplateViewModel} from '../../../view-models/projects/project-types';

@Component({
  selector: 'app-project-wizard',
  templateUrl: './project-wizard.component.html',
  styleUrls: ['./project-wizard.component.scss']
})
export class ProjectWizardComponent implements OnInit {
  ViewMode = ViewMode;
  @Input() complex: boolean;
  @Output() back = new EventEmitter();
  @Output() exit = new EventEmitter();
  mode: ViewMode;
  projectForm: FormViewModel[];
  template: ProjectTemplateViewModel;
  constructor(
    readonly cultureService: CultureService,
    private readonly formService: FormService,
    readonly mockService: MockService,
  ) { }

  ngOnInit() {
    this.mode = ViewMode.Template;
    // this.mode = ViewMode.Form;
    this.projectForm = [
      {
        elements: [
          this.formService.createInput({
            config: {
              field: 'title',
              label: '',
              cssClass: 'project-title',
              hideLabel: true
            },
            params: { model: '', placeHolder: 'PROJECT_TITLE' },
            validation: {
              required: {
                value: true,
                message: 'PROJECT_TITLE_REQUIRED',
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
              label: 'PROJECT_REQUIRE_CHANNEL',
              summary: 'PROJECT_CHANNEL_DESCRIPTION',
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
    if (this.mode === ViewMode.Template) {
      this.mode = ViewMode.Invite;
      return;
    }
    this.back.emit();
  }
  async onCancel($event: MouseEvent) {
    $event.stopPropagation();
    $event.preventDefault();
    this.exit.emit();
  }
  next($event: MouseEvent) {
    $event.stopPropagation();
    $event.preventDefault();
    if (this.mode === ViewMode.Form) {
      this.mode = ViewMode.Invite;
      return;
    }
    if (this.mode === ViewMode.Invite) {
      this.mode = ViewMode.Template;
      return;
    }
  }

  createProject($event: MouseEvent) {

  }
}

export enum ViewMode {
  Form = 1,
  Invite = 2,
  Template = 3
}
