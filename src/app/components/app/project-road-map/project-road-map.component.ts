import {Component, Input, OnInit} from '@angular/core';
import {ProjectViewModel} from '../../../view-models/projects/project-types';

@Component({
  selector: 'app-project-road-map',
  templateUrl: './project-road-map.component.html',
  styleUrls: ['./project-road-map.component.scss']
})
export class ProjectRoadMapComponent implements OnInit {

  @Input() model: ProjectViewModel;
  constructor() { }

  ngOnInit() {
  }

}
