import { Component, OnInit } from '@angular/core';
import {SimpleModalComponent} from 'ngx-simple-modal';
import {ModalParameters} from '../../view-models/core/modal-types';

@Component({
  selector: 'app-request-time-off',
  templateUrl: './request-time-off.component.html',
  styleUrls: ['./request-time-off.component.scss']
})
export class RequestTimeOffComponent
  extends SimpleModalComponent<{groupId}, boolean>
  implements OnInit {

  constructor() { super(); }

  ngOnInit() {
  }

}
