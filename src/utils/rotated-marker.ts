import { Marker } from '@neshan-maps-platform/mapbox-gl';

// ----------------------------------------------------------------------

export interface RotatedMarkerOptions {
  element?: HTMLElement;
  anchor?: string;
  rotation?: number;
  rotationAlignment?: string;
  popup?: string;
}

export class RotatedMarker extends Marker {
  private rotation: number;
  private rotationAlignment: string;

  constructor(options: RotatedMarkerOptions = {}) {
    // Create car icon element if not provided
    const element = options.element || RotatedMarker.createCarElement();

    super({
      element,
      anchor: 'center',
    });

    this.rotation = options.rotation || 0;
    this.rotationAlignment = options.rotationAlignment || 'map';

    // Initialize rotation
    this.updateRotation();
  }

  static createCarElement(): HTMLElement {
    const el = document.createElement('div');
    el.className = 'car-marker';
    el.style.width = '32px';
    el.style.height = '32px';
    el.style.backgroundImage = 'url(/assets/icons/ic-car-marker.svg)';
    el.style.backgroundSize = 'contain';
    el.style.backgroundRepeat = 'no-repeat';
    el.style.backgroundPosition = 'center';
    el.style.cursor = 'pointer';
    el.style.transformOrigin = 'center center';

    return el;
  }

  setRotation(rotation: number): this {
    this.rotation = rotation;
    this.updateRotation();
    return this;
  }

  private updateRotation(): void {
    const element = this.getElement();
    if (element) {
      element.style.transform = `rotate(${this.rotation}deg)`;
    }
  }

  setLngLat(lngLat: any): this {
    super.setLngLat(lngLat);
    // Ensure rotation is maintained after position update
    this.updateRotation();
    return this;
  }

  // Calculate bearing between two points
  static calculateBearing(from: [number, number], to: [number, number]): number {
    const [lat1, lng1] = from;
    const [lat2, lng2] = to;

    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const lat1Rad = (lat1 * Math.PI) / 180;
    const lat2Rad = (lat2 * Math.PI) / 180;

    const y = Math.sin(dLng) * Math.cos(lat2Rad);
    const x =
      Math.cos(lat1Rad) * Math.sin(lat2Rad) -
      Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLng);

    const bearing = (Math.atan2(y, x) * 180) / Math.PI;

    // Normalize to 0-360 degrees
    return (bearing + 360) % 360;
  }
}
