import { Component, OnInit } from '@angular/core';
import { GroupViewModel } from '../../../view-models/groups/group-types';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupService } from '../../../services/groups/group.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss'],
})
export class GroupComponent implements OnInit {
  group: GroupViewModel;
  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly groupService: GroupService,
  ) {}

  ngOnInit() {
    const id = this.activatedRoute.snapshot.params.id;
    this.group = this.groupService.groups.find(g => g.id === id);
    if (!this.group) {
      this.router.navigateByUrl('dashboard');
      return;
    }
  }

  detail() {}
}
