import { Component, OnInit } from '@angular/core';
import {ProjectService} from '../../../services/projects/project.service';
import {GroupService} from '../../../services/groups/group.service';
import {MockService} from '../../../services/mock.service';

@Component({
  selector: 'app-quick-access',
  templateUrl: './quick-access.component.html',
  styleUrls: ['./quick-access.component.scss'],
})
export class QuickAccessComponent implements OnInit {
  constructor(
    readonly projectService: ProjectService,
    readonly groupService: GroupService,
    readonly mockService: MockService,
  ) {}

  ngOnInit() {}
}
