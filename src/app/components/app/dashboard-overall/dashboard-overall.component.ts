import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-overall',
  templateUrl: './dashboard-overall.component.html',
  styleUrls: ['./dashboard-overall.component.scss']
})
export class DashboardOverallComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  callback($event: number) {
    console.log($event);
  }
}
