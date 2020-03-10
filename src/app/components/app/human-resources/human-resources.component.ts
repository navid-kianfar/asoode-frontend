import { Component, Input, OnInit } from '@angular/core';
import { GroupViewModel } from '../../../view-models/groups/group-types';

@Component({
  selector: 'app-human-resources',
  templateUrl: './human-resources.component.html',
  styleUrls: ['./human-resources.component.scss'],
})
export class HumanResourcesComponent implements OnInit {
  @Input() group: GroupViewModel;
  constructor() {}

  ngOnInit() {}
}
