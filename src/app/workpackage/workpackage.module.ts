import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkpackageRoutingModule } from './workpackage-routing.module';
import { WorkPackageBoardComponent } from './components/work-package-board/work-package-board.component';
import { WorkPackageCalendarComponent } from './components/work-package-calendar/work-package-calendar.component';
import { WorkPackageListComponent } from './components/work-package-list/work-package-list.component';
import { WorkPackageTimeSpanComponent } from './components/work-package-time-span/work-package-time-span.component';
import { SharedModule } from '../shared/shared.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';
import { WorkPackageTaskComponent } from './components/work-package-task/work-package-task.component';
import { MatButtonModule } from '@angular/material/button';
import { TasksComponent } from './pages/tasks/tasks.component';
import { MatTabsModule } from '@angular/material/tabs';
import { KartablComponent } from './components/kartabl/kartabl.component';
import { WorkPackageComponent } from './pages/work-package/work-package.component';
import { NgxPopperModule } from 'ngx-popper';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatRippleModule } from '@angular/material/core';


@NgModule({
  declarations: [
    WorkPackageBoardComponent,
    WorkPackageCalendarComponent,
    WorkPackageListComponent,
    WorkPackageTimeSpanComponent,
    WorkPackageTaskComponent,
    TasksComponent,
    KartablComponent,
    WorkPackageComponent
  ],
  imports: [
    CommonModule,
    WorkpackageRoutingModule,
    SharedModule,
    DragDropModule,
    MatMenuModule,
    FormsModule,
    MatButtonModule,
    MatTabsModule,
    NgxPopperModule.forRoot({ placement: 'bottom' }),
    RoundProgressModule,
    MatProgressBarModule,
    MatRadioModule,
    MatRippleModule,
  ],
  exports: [
    WorkPackageBoardComponent,
    WorkPackageCalendarComponent,
    WorkPackageListComponent,
    WorkPackageTimeSpanComponent,
    WorkPackageTaskComponent,
    TasksComponent,
    KartablComponent,
    WorkPackageComponent
  ],
})
export class WorkpackageModule { }
