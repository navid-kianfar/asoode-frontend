import { Component, OnInit } from '@angular/core';
import {SimpleModalComponent} from 'ngx-simple-modal';

@Component({
  selector: 'app-document-modal',
  templateUrl: './document-modal.component.html',
  styleUrls: ['./document-modal.component.scss']
})
export class DocumentModalComponent
  extends SimpleModalComponent<{path: string}, void>
  implements OnInit {

  path: string;
  waiting: boolean;
  constructor() { super(); }

  ngOnInit() {
    this.waiting = true;
  }

}
