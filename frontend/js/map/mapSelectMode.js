//Habilita seleccion de coordenada sobre mapa que le pasemos
export function enableSelectMode(mapManager, onSelect) {
  mapManager.map.on("click", async (e) => {
    const { lat, lng } = e.latlng;

    mapManager.addMarker(lat, lng);

    await onSelect({ lat, lng });
  });
}
