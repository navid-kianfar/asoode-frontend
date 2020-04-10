import { Component, Input, OnInit } from '@angular/core';
import { GroupViewModel } from '../../../view-models/groups/group-types';
import { GroupService } from '../../../services/groups/group.service';

@Component({
  selector: 'app-group-info',
  templateUrl: './group-info.component.html',
  styleUrls: ['./group-info.component.scss'],
})
export class GroupInfoComponent implements OnInit {
  @Input() id: string;
  @Input() cssClass: string;
  @Input() small: boolean;
  @Input() selected: boolean;
  @Input() model: GroupViewModel;
  constructor(private readonly groupService: GroupService) {}

  ngOnInit() {
    if (this.id) {
      this.model = this.groupService.groups.find(g => g.id === this.id);
    }
  }
}
