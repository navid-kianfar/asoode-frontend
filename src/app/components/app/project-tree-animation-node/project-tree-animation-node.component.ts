import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ProjectTreeNodeComponent } from '../project-tree-node/project-tree-node.component';
import { SubProjectViewModel } from '../../../view-models/projects/project-types';

@Component({
  selector: 'app-project-tree-animation-node',
  templateUrl: './project-tree-animation-node.component.html',
  styleUrls: ['./project-tree-animation-node.component.scss'],
})
export class ProjectTreeAnimationNodeComponent extends ProjectTreeNodeComponent {
  @Output() subProjectSelect = new EventEmitter<SubProjectViewModel>();

  onNodeSelect() {
    if (this.workPackage) {
      this.openWorkPackage(this.workPackage);
      return;
    }
    this.subProjectSelect.emit(this.subProject);
  }
}
