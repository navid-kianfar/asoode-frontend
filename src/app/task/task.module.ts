import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { TasksRoutingModule } from './tasks-routing.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TasksRoutingModule,
    SharedModule,
  ]
})
export class TaskModule { }
