import { Component, OnInit } from '@angular/core';
import { SimpleModalComponent } from 'ngx-simple-modal';

@Component({
  selector: 'app-upgrade',
  templateUrl: './upgrade.component.html',
  styleUrls: ['./upgrade.component.scss'],
})
export class UpgradeComponent
  extends SimpleModalComponent<void, boolean>
  implements OnInit
{
  constructor() {
    super();
  }

  ngOnInit() {}
}
