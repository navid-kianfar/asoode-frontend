import {Component, Input, OnInit} from '@angular/core';
import {GroupViewModel} from '../../../view-models/groups/group-types';

@Component({
  selector: 'app-group-timespent',
  templateUrl: './group-timespent.component.html',
  styleUrls: ['./group-timespent.component.scss']
})
export class GroupTimespentComponent implements OnInit {

  @Input() group: GroupViewModel;
  constructor() { }

  ngOnInit() {
  }

}
