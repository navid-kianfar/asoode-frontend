import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupsRoutingModule } from './groups-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ArchivedGroupsComponent } from './components/archived-groups/archived-groups.component';
import { GroupChartComponent } from './components/group-chart/group-chart.component';
import { GroupMembersComponent } from './components/group-members/group-members.component';
import { GroupProjectsComponent } from './components/group-projects/group-projects.component';
import { GroupSettingsComponent } from './components/group-settings/group-settings.component';
import { GroupTimespentComponent } from './components/group-timespent/group-timespent.component';
import { OrgChartComponent } from './components/org-chart/org-chart.component';
import { OrgChartNodeComponent } from './components/org-chart-node/org-chart-node.component';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { GroupReportsComponent } from './components/group-reports/group-reports.component';
import { MatMenuModule } from '@angular/material/menu';
import { GroupComponent } from './pages/group/group.component';
import { MatTabsModule } from '@angular/material/tabs';


@NgModule({
  declarations: [
    ArchivedGroupsComponent,
    GroupChartComponent,
    GroupMembersComponent,
    GroupProjectsComponent,
    GroupSettingsComponent,
    GroupTimespentComponent,
    OrgChartComponent,
    OrgChartNodeComponent,
    GroupReportsComponent,
    GroupComponent
  ],
  imports: [
    CommonModule,
    GroupsRoutingModule,
    SharedModule,
    FormsModule,
    MatButtonModule,
    MatMenuModule,
    MatTabsModule
  ],
  exports: [
    ArchivedGroupsComponent,
    GroupChartComponent,
    GroupMembersComponent,
    GroupProjectsComponent,
    GroupSettingsComponent,
    GroupTimespentComponent,
    OrgChartComponent,
    OrgChartNodeComponent,
    GroupReportsComponent,
    GroupComponent
  ],
})
export class GroupsModule { }
