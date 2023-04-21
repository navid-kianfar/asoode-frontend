import { Component, Inject, OnInit } from '@angular/core';
import { DIALOG_DATA } from '@angular/cdk/dialog';

@Component({
  selector: 'app-offline-modal',
  templateUrl: './offline-modal.component.html',
  styleUrls: ['./offline-modal.component.scss'],
})
export class OfflineModalComponent implements OnInit {
  constructor(
    @Inject(DIALOG_DATA) public data: any
  ) {
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
