import { Component, OnInit } from '@angular/core';
import { GroupViewModel } from '../../../view-models/groups/group-types';
import { MockService } from '../../../services/mock.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss'],
})
export class GroupComponent implements OnInit {
  group: GroupViewModel;
  constructor(private readonly mockService: MockService) {}

  ngOnInit() {
    this.group = this.mockService.groups[0];
  }

  detail() {}
}
