export type DogAccess = 'yes' | 'no' | 'outside';

export type OsmType = 'node' | 'way' | 'relation';

export interface DogPlace {
  id: number;
  type: OsmType;
  name: string;
  dog: DogAccess;
  openingHours?: string;
  lat: number;
  lon: number;
}

export interface OsmElement {
  id: number;
  type: OsmType;
  lat?: number;
  lon?: number;
  center?: {
    lat: number;
    lon: number;
  };
  tags?: {
    name?: string;
    dog?: string;
    opening_hours?: string;
  };
}

export interface OverpassResponse {
  elements: OsmElement[];
}

export interface MapBounds {
  south: number;
  west: number;
  north: number;
  east: number;
}
