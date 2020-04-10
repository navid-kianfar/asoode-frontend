import { Component, OnInit } from '@angular/core';
import {SimpleModalComponent} from 'ngx-simple-modal';
import { TaskModalParameters } from '../../view-models/core/modal-types';

@Component({
  selector: 'app-task-modal',
  templateUrl: './task-modal.component.html',
  styleUrls: ['./task-modal.component.scss']
})
export class TaskModalComponent
  extends SimpleModalComponent<TaskModalParameters, void>
  implements OnInit {
  id: string;

  constructor() { super(); }

  ngOnInit() {
    console.log(this.id);
  }

}
