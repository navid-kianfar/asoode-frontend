import { Component, OnInit } from '@angular/core';
import { SimpleModalComponent } from 'ngx-simple-modal';

@Component({
  selector: 'app-offline',
  templateUrl: './offline.component.html',
  styleUrls: ['./offline.component.scss'],
})
export class OfflineComponent
  extends SimpleModalComponent<
    {
      isConnected: boolean;
      isOnline: boolean;
    },
    string
  >
  implements OnInit {
  isConnected: boolean;
  isOnline: boolean;

  constructor() {
    super();
  }

  ngOnInit() {}

  cancel($event: MouseEvent) {
    $event.stopPropagation();
    $event.preventDefault();
  }

  refresh() {
    window.location.reload();
  }
}
