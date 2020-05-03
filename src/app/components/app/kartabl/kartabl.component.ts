import {Component, Input, OnInit} from '@angular/core';
import {KartablViewModel } from '../../../view-models/projects/project-types';

@Component({
  selector: 'app-kartabl',
  templateUrl: './kartabl.component.html',
  styleUrls: ['./kartabl.component.scss']
})
export class KartablComponent implements OnInit {

  @Input() beginDate: Date;
  @Input() endDate: Date;
  @Input() model: KartablViewModel[];
  constructor() { }

  ngOnInit() {
  }

}
