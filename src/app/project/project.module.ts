import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectRoutingModule } from './project-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ProjectComponent } from './pages/project/project.component';
import { TrendModule } from 'ngx-trend';
import { ProjectInfoComponent } from './components/project-info/project-info.component';
import { ProjectObjectiveComponent } from './components/project-objective/project-objective.component';
import { ProjectRoadMapComponent } from './components/project-road-map/project-road-map.component';
import { ProjectSeasonComponent } from './components/project-season/project-season.component';
import { ProjectSettingComponent } from './components/project-setting/project-setting.component';
import { ProjectTreeComponent } from './components/project-tree/project-tree.component';
import { ProjectTreeNodeComponent } from './components/project-tree-node/project-tree-node.component';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ArchivedProjectsComponent } from './components/archived-projects/archived-projects.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';


@NgModule({
  declarations: [
    ProjectComponent,
    ProjectInfoComponent,
    ProjectObjectiveComponent,
    ProjectRoadMapComponent,
    ProjectSeasonComponent,
    ProjectSettingComponent,
    ProjectTreeComponent,
    ProjectTreeNodeComponent,
    ArchivedProjectsComponent
  ],
  imports: [
    CommonModule,
    ProjectRoutingModule,
    TrendModule,
    MatButtonModule,
    MatMenuModule,
    DragDropModule,
    MatProgressBarModule,
    SharedModule,
  ],
  exports: [
    ProjectInfoComponent,
    ProjectObjectiveComponent,
    ProjectRoadMapComponent,
    ProjectSeasonComponent,
    ProjectSettingComponent,
    ProjectTreeComponent,
    ProjectTreeNodeComponent,
    ArchivedProjectsComponent
  ]
})
export class ProjectModule { }
