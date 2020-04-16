export interface MapMarker {
  icon?: string;
  image?: string;
  title?: string;
  summary?: string;
  onClick?: () => any;
  location: GeoLocation;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
}
export interface MapModalParameters {
  markers?: MapMarker[];
  center?: MapMarker;
  mapLocation?: string;
}
