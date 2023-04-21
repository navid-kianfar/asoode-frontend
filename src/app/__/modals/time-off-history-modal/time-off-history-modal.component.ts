import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-time-off-history-modal',
  templateUrl: './time-off-history-modal.component.html',
  styleUrls: ['./time-off-history-modal.component.scss'],
})
export class TimeOffHistoryModalComponent
  extends SimpleModalComponent<{ timeOff: any }, void>
  implements OnInit {
  timeOff: any;
  constructor() {
    super();
  }

  ngOnInit() {}
}
