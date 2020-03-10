import {Component, Input, OnInit} from '@angular/core';
import {GroupViewModel} from '../../../view-models/groups/group-types';
import {MockService} from '../../../services/mock.service';

@Component({
  selector: 'app-group-projects',
  templateUrl: './group-projects.component.html',
  styleUrls: ['./group-projects.component.scss']
})
export class GroupProjectsComponent implements OnInit {

  @Input() group: GroupViewModel;
  constructor(readonly mockService: MockService) { }

  ngOnInit() {
  }

}
