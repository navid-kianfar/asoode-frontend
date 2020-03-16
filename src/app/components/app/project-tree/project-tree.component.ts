import { Component, Input, OnInit } from '@angular/core';
import { ProjectViewModel } from '../../../view-models/projects/project-types';

@Component({
  selector: 'app-project-tree',
  templateUrl: './project-tree.component.html',
  styleUrls: ['./project-tree.component.scss'],
})
export class ProjectTreeComponent implements OnInit {
  @Input() model: ProjectViewModel;
  constructor() {}

  ngOnInit() {}
}
