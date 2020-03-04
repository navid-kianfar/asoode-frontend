import {Component, Input, OnInit} from '@angular/core';
import {ProjectViewModel} from '../../../view-models/projects/project-types';

@Component({
  selector: 'app-project-info',
  templateUrl: './project-info.component.html',
  styleUrls: ['./project-info.component.scss']
})
export class ProjectInfoComponent implements OnInit {

  @Input() project: ProjectViewModel;
  @Input() template: boolean;

  constructor() { }

  ngOnInit() {
  }

}
