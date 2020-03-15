import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CultureService} from '../../../services/core/culture.service';
import {FormService} from '../../../services/core/form.service';

@Component({
  selector: 'app-project-wizard',
  templateUrl: './project-wizard.component.html',
  styleUrls: ['./project-wizard.component.scss']
})
export class ProjectWizardComponent implements OnInit {

  @Input() complex: boolean;
  @Output() back = new EventEmitter();
  @Output() exit = new EventEmitter();
  constructor(
    readonly cultureService: CultureService,
    private readonly formService: FormService,
  ) { }

  ngOnInit() {
  }
  onBack($event: MouseEvent) {
    $event.stopPropagation();
    $event.preventDefault();

  }
  async onCancel($event: MouseEvent) {
    $event.stopPropagation();
    $event.preventDefault();
    this.exit.emit();
  }

}
