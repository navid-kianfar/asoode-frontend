import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {CultureService} from '../../../services/core/culture.service';
import {FormService} from '../../../services/core/form.service';

@Component({
  selector: 'app-group-wizard',
  templateUrl: './group-wizard.component.html',
  styleUrls: ['./group-wizard.component.scss']
})
export class GroupWizardComponent implements OnInit {

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
