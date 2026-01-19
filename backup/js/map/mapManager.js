//Clase Mapa principal
export class MapManager {
  constructor(mapId, options = {}) {
    this.center = options.center || [39.07, -0.25];
    this.zoom = options.zoom || 12;

    this.map = L.map(mapId).setView(this.center, this.zoom);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "Hecho por m :D",
    }).addTo(this.map);

    this.marker = null;
    this.markers = new Set();
  }

  setView(lat, lng, zoom = 12) {
    this.map.setView([lat, lng], zoom);
  }

  fitBounds(latLngs, options = {}) {
    this.map.fitBounds(latLngs, options);
  }

  addMarker(lat, lng, { reuse = true } = {}) {
    if (reuse) {
      if (this.marker) {
        this.marker.setLatLng([lat, lng]);
        return this.marker;
      }
      this.marker = L.marker([lat, lng]).addTo(this.map);
      this.markers.add(this.marker);
      return this.marker;
    }

    const newMarker = L.marker([lat, lng]).addTo(this.map);
    this.markers.add(newMarker);
    return newMarker;
  }

  addMarkers(points = [], options = {}) {
    const { reuse = false, fit = false, fitOptions = { padding: [20, 20], maxZoom: 16 } } = options;
    const added = [];
    points.forEach((p) => {
      if (!p) return;
      const latNum = Number(p.lat);
      const lngNum = Number(p.lng);
      if (Number.isFinite(latNum) && Number.isFinite(lngNum)) {
        added.push(this.addMarker(latNum, lngNum, { reuse }));
      }
    });
    if (fit && added.length) {
      this.fitToMarkers(fitOptions);
    }
    return added;
  }

  fitToMarkers(options = { padding: [20, 20], maxZoom: 16 }) {
    const latLngs = [];
    // Incluye el marcador reutilizable si existe
    if (this.marker) {
      latLngs.push(this.marker.getLatLng());
    }
    // Incluye el resto de marcadores almacenados
    this.markers.forEach((m) => {
      const ll = m.getLatLng();
      if (ll) latLngs.push(ll);
    });

    if (!latLngs.length) return false;

    if (latLngs.length === 1) {
      this.setView(latLngs[0].lat, latLngs[0].lng, options.maxZoom || this.zoom);
      return true;
    }

    this.map.fitBounds(latLngs, options);
    return true;
  }

  clearMarkers() {
    if (this.marker) {
      this.map.removeLayer(this.marker);
      this.marker = null;
    }
    this.markers.forEach((m) => this.map.removeLayer(m));
    this.markers.clear();
  }

  onClick(callback) {
    this.map.on("click", callback);
  }
}
