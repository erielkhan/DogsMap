
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DogPlace } from '../../core/models/dog-place.model';

@Component({
  selector: 'app-place-card',
  standalone: true,
  templateUrl: './place-card.component.html',
  styleUrl: './place-card.component.css'
})
export class PlaceCardComponent {
  @Input({ required: true }) place!: DogPlace;
  @Input() selected = false;

  @Output() placeSelected = new EventEmitter<DogPlace>();

  get dogLabel(): string {
    switch (this.place.dog) {
      case 'yes': return 'Se permiten perros';
      case 'no': return 'No se permiten perros';
      case 'outside': return 'Solo en el exterior';
    }
  }

  get osmUrl(): string {
    return `https://www.openstreetmap.org/${this.place.type}/${this.place.id}`;
  }

  selectPlace() {
    this.placeSelected.emit(this.place);
  }
}
