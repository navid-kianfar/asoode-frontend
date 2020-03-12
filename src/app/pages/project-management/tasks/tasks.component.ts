import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit {
  TaskTab = TaskTab;
  tab: number;
  constructor() {}

  ngOnInit() {
    this.tab = TaskTab.Calendar;
  }
}
export enum TaskTab {
  Calendar = 0,
  TimeSpent = 1,
  Kartabl = 2,
}
