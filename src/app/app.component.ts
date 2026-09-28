
import {
  Component,
  ViewChild,
  inject
} from '@angular/core';

import { HeaderComponent } from './components/header/header.component';
import { FiltersComponent } from './components/filters/filters.component';
import { MapComponent } from './components/map/map.component';
import { PlacesListComponent } from './components/places-list/places-list.component';

import { OverpassService } from './core/services/overpass.service';
import {
  DogPlace,
  DogAccess,
  MapBounds
} from './core/models/dog-place.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    FiltersComponent,
    MapComponent,
    PlacesListComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private overpass = inject(OverpassService);

  @ViewChild(MapComponent) mapComponent?: MapComponent;

  places: DogPlace[] = [];
  filteredPlaces: DogPlace[] = [];

  selectedDogs: DogAccess[] = ['yes', 'no', 'outside'];
  search = '';

  selectedId: number | null = null;
  loading = false;
  error = '';

  private lastBounds = '';

  onBoundsChange(bounds: MapBounds) {
    const key = [
      bounds.south.toFixed(4),
      bounds.west.toFixed(4),
      bounds.north.toFixed(4),
      bounds.east.toFixed(4)
    ].join(',');

    if (key === this.lastBounds) return;

    this.lastBounds = key;
    this.loading = true;
    this.error = '';

    this.overpass.getPlaces(bounds).subscribe({
      next: places => {
        this.places = places;
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.error = 'No se han podido cargar los lugares.';
        this.loading = false;
      }
    });
  }

  onFiltersChange(filters: {
    dogs: DogAccess[];
    search: string;
  }) {
    this.selectedDogs = filters.dogs;
    this.search = filters.search;
    this.applyFilters();
  }

  applyFilters() {
    const search = this.search.trim().toLowerCase();

    this.filteredPlaces = this.places.filter(place =>
      this.selectedDogs.includes(place.dog) &&
      place.name.toLowerCase().includes(search)
    );

    if (
      this.selectedId !== null &&
      !this.filteredPlaces.some(p => p.id === this.selectedId)
    ) {
      this.selectedId = null;
    }
  }

  onPlaceSelected(place: DogPlace) {
    this.selectedId = place.id;
    this.mapComponent?.focusPlace(place);
  }
}
