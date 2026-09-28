import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import {
  DogPlace,
  DogAccess,
  MapBounds,
  OverpassResponse
} from '../models/dog-place.model';

@Injectable({
  providedIn: 'root'
})
export class OverpassService {
  private http = inject(HttpClient);

  private readonly endpoint =
    'https://overpass-api.de/api/interpreter';

  getPlaces(bounds: MapBounds): Observable<DogPlace[]> {
    const { south, west, north, east } = bounds;

    const query = `
      [out:json][timeout:25];
      nwr["dog"~"^(yes|no|outside)$"]
        (${south},${west},${north},${east});
      out center tags;
    `;

    return this.http.post<OverpassResponse>(
      this.endpoint,
      query,
      {
        headers: {
          'Content-Type': 'text/plain'
        }
      }
    ).pipe(
      map(response =>
        response.elements
          .map(element => {
            const lat = element.lat ?? element.center?.lat;
            const lon = element.lon ?? element.center?.lon;
            const dog = element.tags?.dog;

            if (
              lat == null ||
              lon == null ||
              !['yes', 'no', 'outside'].includes(dog ?? '')
            ) {
              return null;
            }

            return {
              id: element.id,
              type: element.type,
              name: element.tags?.name || 'Sin nombre',
              dog: dog as DogAccess,
              openingHours: element.tags?.opening_hours,
              lat,
              lon
            } satisfies DogPlace;
          })
          .filter((place): place is DogPlace => place !== null)
      )
    );
  }
}
