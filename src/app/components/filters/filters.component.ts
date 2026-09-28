
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DogAccess } from '../../core/models/dog-place.model';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.css'
})
export class FiltersComponent {
  @Output() filtersChange = new EventEmitter<{
    dogs: DogAccess[];
    search: string;
  }>();

  selectedDogs: DogAccess[] = ['yes', 'no', 'outside'];
  search = '';

  toggleDog(dog: DogAccess, checked: boolean) {
    if (checked && !this.selectedDogs.includes(dog)) {
      this.selectedDogs = [...this.selectedDogs, dog];
    } else if (!checked) {
      this.selectedDogs =
        this.selectedDogs.filter(value => value !== dog);
    }

    this.emitFilters();
  }

  onSearchChange() {
    this.emitFilters();
  }

  emitFilters() {
    this.filtersChange.emit({
      dogs: [...this.selectedDogs],
      search: this.search
    });
  }
}
