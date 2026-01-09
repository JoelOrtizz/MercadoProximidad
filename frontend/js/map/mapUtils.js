export function tryGeolocation(mapManager, { maxAccuracy = 10000, zoom = 12 } = {}) {
  if (!("geolocation" in navigator)) {
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude, accuracy } = pos.coords;
      if (accuracy && accuracy < maxAccuracy) {
        mapManager.setView(latitude, longitude, zoom);
      } else {
        console.log("Geolocalizacion imprecisa, se mantiene centro por defecto");
      }
    },
    (err) => {
      console.log("Geolocalizacion no disponible:", err.message);
    },
    {
      enableHighAccuracy: true,
      timeout: 8000,
      maximumAge: 60000,
    }
  );
}

export async function getDireccionFromCoords(lat, lng) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;

  // Nota: en navegador no se puede establecer el header User-Agent (es un "forbidden header").
  // Mantenemos la llamada simple y manejamos fallos en el caller.
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Error obteniendo direccion");
  }

  const data = await response.json();
  return data.display_name;
}

