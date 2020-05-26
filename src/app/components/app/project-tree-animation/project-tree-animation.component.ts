import { Component, OnInit } from '@angular/core';
import {ProjectTreeComponent} from '../project-tree/project-tree.component';
import {SubProjectViewModel} from '../../../view-models/projects/project-types';
import {ActivityType, ProjectTemplate} from '../../../library/app/enums';

@Component({
  selector: 'app-project-tree-animation',
  templateUrl: './project-tree-animation.component.html',
  styleUrls: ['./project-tree-animation.component.scss']
})
export class ProjectTreeAnimationComponent extends ProjectTreeComponent {
  crumbs: SubProjectViewModel[] = [];

  bind() {
    this.socket.on('push-notification', (notification: any) => {
      switch (notification.type) {
        case ActivityType.WorkPackageAdd:
        case ActivityType.WorkPackageEdit:
        case ActivityType.ProjectAdd:
        case ActivityType.ProjectSubAdd:
        case ActivityType.ProjectSubRemove:
        case ActivityType.ProjectSubEdit:
          if (notification.data.projectId === this.model.id) {
            setTimeout(() => {
              this.createTree(this.current());
            }, 500);
          }
          break;
      }
    });
  }

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
