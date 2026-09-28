
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DogPlace } from '../../core/models/dog-place.model';
import { PlaceCardComponent } from '../place-card/place-card.component';

@Component({
  selector: 'app-places-list',
  standalone: true,
  imports: [PlaceCardComponent],
  templateUrl: './places-list.component.html',
  styleUrl: './places-list.component.css'
})
export class PlacesListComponent {
  @Input() places: DogPlace[] = [];
  @Input() selectedId: number | null = null;

  @Output() placeSelected = new EventEmitter<DogPlace>();
}
