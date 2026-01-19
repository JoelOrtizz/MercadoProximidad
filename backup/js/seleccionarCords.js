import { MapManager } from "./map/mapManager.js";
import { enableSelectMode } from "./map/mapSelectMode.js";
import { getDireccionFromCoords, tryGeolocation } from "./map/mapUtils.js";

const latValue = document.getElementById("latValue");
const lngValue = document.getElementById("lngValue");
const addrValue = document.getElementById("addrValue");
const btnSave = document.getElementById("btnSave");
const btnMyLocation = document.getElementById("btnMyLocation");

let selected = null;

function setSelected({ lat, lng }) {
  selected = { lat, lng };
  latValue.textContent = lat.toFixed(6);
  lngValue.textContent = lng.toFixed(6);
  btnSave.disabled = false;
}

async function setAddress({ lat, lng }) {
  addrValue.textContent = "Buscando direccion...";
  try {
    const address = await getDireccionFromCoords(lat, lng);
    addrValue.textContent = address || "Direccion no disponible.";
  } catch {
    addrValue.textContent = "No se pudo obtener la direccion.";
  }
}

function createMap() {
  // Tavernes de la Valldigna (Safor)
  const mapManager = new MapManager("map", { center: [39.0717, -0.2668], zoom: 13 });

  enableSelectMode(mapManager, async ({ lat, lng }) => {
    setSelected({ lat, lng });
    await setAddress({ lat, lng });
  });

  btnMyLocation.addEventListener("click", () => {
    tryGeolocation(mapManager, { zoom: 14 });
  });

  btnSave.addEventListener("click", async () => {
    if (!selected) return;
    btnSave.disabled = true;
    btnSave.textContent = "Guardando...";

    try {
      await window.apiFetch("/map/me", "PATCH", selected);
      localStorage.setItem("user_coords", JSON.stringify(selected));
      window.location.href = "comprar.html";
    } finally {
      btnSave.textContent = "Guardar";
      btnSave.disabled = false;
    }
  });
}

createMap();
