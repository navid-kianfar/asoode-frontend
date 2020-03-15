import { Component, OnInit } from '@angular/core';
import { MessengerService } from '../../../services/communication/messenger.service';
import { GroupService } from '../../../services/groups/group.service';
import { ProjectService } from '../../../services/projects/project.service';
import { FilesService } from '../../../services/storage/files.service';

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
  ) {}
  ngOnInit() {
    this.tab = ViewMode.Mine;
    this.sharedAnyThing =
      this.messengerService.channels.length > 0 ||
      this.projectService.projects.length > 0 ||
      this.groupService.groups.length > 0 ||
      true;
  }

  hide() {}
}
export enum ViewMode {
  Mine = 0,
  SharedByMe = 1,
  SharedByOthers = 2,
}
