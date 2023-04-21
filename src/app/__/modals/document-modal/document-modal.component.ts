import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-document-modal',
  templateUrl: './document-modal.component.html',
  styleUrls: ['./document-modal.component.scss'],
})
export class DocumentModalComponent
  extends SimpleModalComponent<{ path: string }, void>
  implements OnInit {
  path: string;
  constructor() {
    super();
  }

  ngOnInit() {
  }
}
