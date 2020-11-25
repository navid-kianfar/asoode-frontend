import { Component, OnInit } from '@angular/core';
import { MessengerService } from '../../../services/communication/messenger.service';
import { GroupService } from '../../../services/groups/group.service';
import { ProjectService } from '../../../services/projects/project.service';
import { FilesService } from '../../../services/storage/files.service';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { TranslateService } from '../../../services/core/translate.service';
import { IdentityService } from '../../../services/auth/identity.service';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss'],
})
export class FilesComponent implements OnInit {
  ViewMode = ViewMode;
  tab: ViewMode;
  sharedAnyThing: boolean;
  constructor(
    private readonly messengerService: MessengerService,
    private readonly groupService: GroupService,
    private readonly projectService: ProjectService,
    readonly filesService: FilesService,
    private readonly gaService: GoogleAnalyticsService,
    private readonly translateService: TranslateService,
    readonly identityService: IdentityService,
  ) {}
  ngOnInit() {
    this.tab = ViewMode.Mine;
    this.sharedAnyThing =
      this.messengerService.channels.directs.length > 0 ||
      this.projectService.projects.length > 0 ||
      this.groupService.groups.length > 0 ||
      true;

    this.gaService.pageView(
      window.location.pathname,
      this.translateService.fromKey('FILES'),
      undefined,
      { user_id: this.identityService.identity.userId },
    );
  }

  hide() {
    this.filesService.hidePlate = true;
  }
}
export enum ViewMode {
  Mine = 0,
  SharedByMe = 1,
  SharedByOthers = 2,
}
