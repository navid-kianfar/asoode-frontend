import { Component, OnInit } from '@angular/core';
import {MessengerService} from '../../../services/communication/messenger.service';
import {GroupService} from '../../../services/groups/group.service';
import {ProjectService} from '../../../services/projects/project.service';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss'],
})
export class FilesComponent implements OnInit {
  constructor(
    private readonly messengerService: MessengerService,
    private readonly groupService: GroupService,
    private readonly projectService: ProjectService,
  ) {
  }
  ngOnInit() { }
}
