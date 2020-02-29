import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ProjectService} from '../../../services/projects/project.service';
import {GroupService} from '../../../services/groups/group.service';
import {MockService} from '../../../services/mock.service';
import {GroupViewModel} from '../../../view-models/groups/group-types';
import {ProjectViewModel} from '../../../view-models/projects/project-types';

@Component({
  selector: 'app-quick-access',
  templateUrl: './quick-access.component.html',
  styleUrls: ['./quick-access.component.scss'],
})
export class QuickAccessComponent implements OnInit {

  @Output() hide = new EventEmitter<any>();

  constructor(
    readonly projectService: ProjectService,
    readonly groupService: GroupService,
    readonly mockService: MockService,
  ) {}

  ngOnInit() {}

  openGroup(group: GroupViewModel) {
    console.log('open-group', group);
    this.hide.emit();
  }

  openProject(project: ProjectViewModel) {
    console.log('open-project', project);
    this.hide.emit();
  }
}
