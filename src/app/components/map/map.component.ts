
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';

import * as L from 'leaflet';
import {
  DogPlace,
  MapBounds
} from '../../core/models/dog-place.model';

@Component({
  selector: 'app-map',
  standalone: true,
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent
  implements AfterViewInit, OnChanges, OnDestroy {

  @ViewChild('mapElement')
  mapElement!: ElementRef<HTMLDivElement>;

  @Input() places: DogPlace[] = [];
  @Input() selectedId: number | null = null;

  @Output() boundsChange = new EventEmitter<MapBounds>();
  @Output() placeSelected = new EventEmitter<DogPlace>();

  private map?: L.Map;
  private markers = L.layerGroup();

  ngAfterViewInit() {
    this.map = L.map(this.mapElement.nativeElement)
      .setView([41.3851, 2.1734], 13);

    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }
    ).addTo(this.map);

    this.markers.addTo(this.map);

    this.map.on('moveend', () => {
      const bounds = this.map!.getBounds();

      this.boundsChange.emit({
        south: bounds.getSouth(),
        west: bounds.getWest(),
        north: bounds.getNorth(),
        east: bounds.getEast()
      });
    });

    this.map.invalidateSize();
    this.emitCurrentBounds();
    this.updateMarkers();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['places'] && this.map) {
      this.updateMarkers();
    }

    if (changes['selectedId'] && this.map) {
      this.openSelectedMarker();
    }
  }

  private emitCurrentBounds() {
    if (!this.map) return;

    const bounds = this.map.getBounds();

    this.boundsChange.emit({
      south: bounds.getSouth(),
      west: bounds.getWest(),
      north: bounds.getNorth(),
      east: bounds.getEast()
    });
  }

  private updateMarkers() {
    if (!this.map) return;

    this.markers.clearLayers();

    for (const place of this.places) {
      const color = {
        yes: '#16a34a',
        no: '#dc2626',
        outside: '#d97706'
      }[place.dog];

      const marker = L.circleMarker(
        [place.lat, place.lon],
        {
          radius: 8,
          color,
          fillColor: color,
          fillOpacity: 0.85,
          weight: 2
        }
      );

      marker.bindPopup(`
        <strong>${this.escapeHtml(place.name)}</strong>
        <br>
        ${this.escapeHtml(place.dog)}
        <br>
        ${this.escapeHtml(place.openingHours ?? 'Horario no disponible')}
      `);

      marker.on('click', () => {
        this.placeSelected.emit(place);
      });

      (marker as any).placeId = place.id;
      this.markers.addLayer(marker);
    }

    this.openSelectedMarker();
  }

  private openSelectedMarker() {
    if (!this.map || this.selectedId == null) return;

    this.markers.eachLayer((layer: any) => {
      if (layer.placeId === this.selectedId) {
        layer.openPopup();
      }
    });
  }

  focusPlace(place: DogPlace) {
    this.map?.setView([place.lat, place.lon], 17);
  }

  private escapeHtml(value: string): string {
    return value.replace(/[&<>"']/g, char => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[char]!);
  }

  ngOnDestroy() {
    this.map?.remove();
  }
}
