import { Component, OnInit } from '@angular/core';
import {ProjectTreeComponent} from '../project-tree/project-tree.component';
import {SubProjectViewModel} from '../../../view-models/projects/project-types';

@Component({
  selector: 'app-project-tree-animation',
  templateUrl: './project-tree-animation.component.html',
  styleUrls: ['./project-tree-animation.component.scss']
})
export class ProjectTreeAnimationComponent extends ProjectTreeComponent {
  crumbs: SubProjectViewModel[] = [];

  openSubProject($event: SubProjectViewModel) {
    this.crumbs.push($event);
    this.createTree($event);
  }

  crumbPath(): string {
    return this.crumbs.map(c => c.title).join(' / ');
  }

  goUp() {
    this.crumbs.pop();
    this.createTree(this.current());
  }

  current() {
    return !this.crumbs.length ? null : this.crumbs[this.crumbs.length - 1];
  }
}
