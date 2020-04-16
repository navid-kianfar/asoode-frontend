import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import * as ol from 'openlayers';
import {MapMarker} from '../../../view-models/general/map-types';
import {LocationService} from '../../../services/general/location.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, OnChanges {
  constructor(readonly locationService: LocationService) {
  }

  initialized: boolean;
  waiting: boolean;
  instance: any;
  markerSource: ol.source.Vector;
  markerStyle: ol.style.Style;
  internalMarkers = [];
  currentWaiting: boolean;
  @ViewChild('container', {static: false}) container;
  @Input() model: string;
  @Input() cssClass: string;
  @Input() center: MapMarker;
  @Input() markers: MapMarker[];
  @Input() delay: number;
  @Input() zoom: number;
  @Input() disabled: boolean;
  @Input() allowZoom: boolean;
  @Input() allowMove: boolean;
  @Output() markersChange = new EventEmitter<MapMarker[]>();

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.model &&
      !changes.model.firstChange &&
      changes.model.currentValue
    ) {
      const location = this.model.split(',');
      this.center = {
        location: {
          latitude: +location[0],
          longitude: +location[1],
        },
      };
      this.markers = [this.center];
      if (!this.instance || !this.markerSource) {
        return;
      }
      if (this.internalMarkers.length) {
        this.markerSource.removeFeature(this.internalMarkers[0]);
      }
      this.internalMarkers = (this.markers || []).map(m => {
        const l: [number, number] = [m.location.longitude, m.location.latitude];
        return new ol.Feature({
          geometry: new ol.geom.Point(
            ol.proj.transform(l, 'EPSG:4326', 'EPSG:3857'),
          ),
        });
      });
      this.internalMarkers.forEach(m => {
        this.markerSource.addFeature(m);
      });
      this.goToCenter();
    }
  }

  ngOnInit() {
    if (this.model) {
      const location = this.model.split(',');
      this.center = {
        location: {
          latitude: +location[0],
          longitude: +location[1],
        },
      };
      this.markers = [this.center];
    }
    if (!this.center) {
      this.center = {
        location: {
          latitude: 35.7562791,
          longitude: 51.3404073,
        },
      };
    }
    this.zoom = this.zoom || 15;
    this.mapMarkers();
    this.markerSource = new ol.source.Vector();
    this.markerStyle = new ol.style.Style({
      image: new ol.style.Icon({
        anchor: [0.5, 30],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        opacity: 0.75,
        src: '/assets/images/pin.png',
      }),
    });
    setTimeout(() => this.setInstance(), this.delay || 0);
  }

  mapMarkers() {
    this.internalMarkers = (this.markers || []).map(m => {
      const location: [number, number] = [
        m.location.longitude,
        m.location.latitude,
      ];
      return new ol.Feature({
        geometry: new ol.geom.Point(
          ol.proj.transform(location, 'EPSG:4326', 'EPSG:3857'),
        ),
      });
    });
  }

  setInstance() {
    this.instance = new ol.Map({
      controls: [],
      target: this.container.nativeElement,
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM(),
        }),
        new ol.layer.Vector({
          source: this.markerSource,
          style: this.markerStyle,
        }),
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([
          this.center.location.longitude,
          this.center.location.latitude,
        ]),
        zoom: this.zoom,
      }),
    });
    this.instance.on('singleclick', event => {
      if (this.disabled) {
        return;
      }
      if (this.internalMarkers.length) {
        this.markerSource.removeFeature(this.internalMarkers[0]);
        this.internalMarkers = [];
      }
      const location = ol.proj.toLonLat(event.coordinate);
      this.internalMarkers.push(
        new ol.Feature({
          geometry: new ol.geom.Point(
            ol.proj.transform(location, 'EPSG:4326', 'EPSG:3857'),
          ),
        }),
      );
      this.markerSource.addFeature(this.internalMarkers[0]);
      this.markersChange.emit([
        {
          location: {
            latitude: location[1],
            longitude: location[0],
          },
        },
      ]);
    });
    this.instance.on('mousewheel', e => {
      if (this.allowMove === false || this.disabled) {
        e.browserEvent.preventDefault();
      }
    });
    this.instance.once('postrender', () => {
      this.initialized = true;
      this.internalMarkers.forEach(m => {
        this.markerSource.addFeature(m);
      });
    });
    this.instance.getInteractions().forEach(interaction => {
      if (
        this.disabled ||
        this.allowZoom === false ||
        this.allowMove === false
      ) {
        interaction.setActive(false);
        return;
      }
    });
  }

  async setCurrentLocation() {
    if (!this.instance || !this.markerSource) {
      return;
    }
    const location = await this.locationService.getCurrent();
    if (!location) {
      return;
    }
    this.center = {
      location: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
    };
    this.goToCenter();
  }

  goToCenter() {
    this.instance
      .getView()
      .setCenter(
        ol.proj.transform(
          [this.center.location.longitude, this.center.location.latitude],
          'EPSG:4326',
          'EPSG:3857',
        ),
      );
  }
}
