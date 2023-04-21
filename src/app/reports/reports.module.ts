import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { SharedModule } from '../shared/shared.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthModule } from '../auth/auth.module';
import { MatTabsModule } from '@angular/material/tabs';
import { DashboardActivityComponent } from './components/dashboard-activity/dashboard-activity.component';
import { DashboardEventsComponent } from './components/dashboard-events/dashboard-events.component';
import { DashboardOverallComponent } from './components/dashboard-overall/dashboard-overall.component';
import { DashboardProjectComponent } from './components/dashboard-project/dashboard-project.component';
import {
  DashboardProjectTemplatesComponent
} from './components/dashboard-project-templates/dashboard-project-templates.component';
import { DashboardProgressComponent } from './components/dashboard-progress/dashboard-progress.component';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { ProjectModule } from '../project/project.module';
import { WorkpackageModule } from '../workpackage/workpackage.module';


@NgModule({
  declarations: [
    DashboardComponent,
    DashboardActivityComponent,
    DashboardEventsComponent,
    DashboardOverallComponent,
    DashboardProjectComponent,
    DashboardProjectTemplatesComponent,
    DashboardProgressComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    MatTabsModule,
    RoundProgressModule,
    SharedModule,
    AuthModule,
    ProjectModule,
    WorkpackageModule
  ]
})
export class ReportsModule { }
