import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CultureService} from '../../../services/core/culture.service';
import {ProjectService} from '../../../services/projects/project.service';
import {IdentityService} from '../../../services/auth/identity.service';
import {NotificationService} from '../../../services/core/notification.service';
import {GroupService} from '../../../services/groups/group.service';

@Component({
  selector: 'app-upgrade-wizard',
  templateUrl: './upgrade-wizard.component.html',
  styleUrls: ['./upgrade-wizard.component.scss']
})
export class UpgradeWizardComponent implements OnInit {
  ViewMode = ViewMode;
  mode: ViewMode;
  actionWaiting: boolean;
  @Input() showBack: boolean;
  @Output() exit = new EventEmitter();
  @Output() back = new EventEmitter();
  constructor(
    readonly cultureService: CultureService,
    readonly projectService: ProjectService,
    readonly groupService: GroupService,
    readonly identityService: IdentityService,
    private readonly notificationService: NotificationService,
    ) { }

  ngOnInit() {
    this.mode = ViewMode.Init;
  }
  onBack($event: MouseEvent) {
    $event.stopPropagation();
    $event.preventDefault();
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
  }

}
export enum ViewMode {
  Init = 1
}
