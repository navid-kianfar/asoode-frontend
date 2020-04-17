import { Component, OnInit } from '@angular/core';
import { SimpleModalComponent } from 'ngx-simple-modal';
import {
  MapMarker,
  MapModalParameters,
} from '../../view-models/general/map-types';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent
  extends SimpleModalComponent<MapModalParameters, MapMarker[]>
  implements OnInit {
  waiting: boolean;
  center: MapMarker;
  markers: MapMarker[];
  mapLocation: string;
  cssClass: string;
  title: string;
  removeTitle: string;
  cancelTitle: string;
  confirmTitle: string;

  constructor() {
    super();
  }

  ngOnInit() {}

  async confirm() {
    this.result = this.markers;
    this.close();
  }

  async remove() {
    this.result = this.markers = [];
    this.close();
  }

  share() {}
}
