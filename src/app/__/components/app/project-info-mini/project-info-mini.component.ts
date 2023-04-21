import { Component, Input, OnInit } from '@angular/core';
import { ProjectViewModel } from '../../../../view-models/projects/project-types';

@Component({
  selector: 'app-project-info-mini',
  templateUrl: './project-info-mini.component.html',
  styleUrls: ['./project-info-mini.component.scss'],
})
export class ProjectInfoMiniComponent implements OnInit {
  @Input() model: ProjectViewModel;
  constructor() {}

  ngOnInit() {}
}
