import { MapManager } from "./map/mapManager.js";
import { getDireccionDetalleFromCoords, tryGeolocation } from "./map/mapUtils.js";

const pointsBody = document.getElementById("pointsBody");
const btnSaveAll = document.getElementById("btnSaveAll");
const btnMyLocation = document.getElementById("btnMyLocation");
const statusEl = document.getElementById("status");
const btnBackPerfil = document.getElementById("btnBackPerfil");

const MAX_PUNTOS = 5;

const points = [];

function setStatus(text) {
  if (!statusEl) return;
  statusEl.textContent = text || "";
}

function pickTown(detail) {
  return (
    detail.town ||
    detail.city ||
    detail.village ||
    detail.municipality ||
    detail.suburb ||
    ""
  );
}

function updateSaveButton() {
  if (!btnSaveAll) return;
  btnSaveAll.disabled = points.length === 0;
}

function renderTable() {
  if (!pointsBody) return;
  pointsBody.innerHTML = "";

  points.forEach((p, idx) => {
    const tr = document.createElement("tr");

    const tdIdx = document.createElement("td");
    tdIdx.textContent = String(idx + 1);
    tr.appendChild(tdIdx);

    const tdStreet = document.createElement("td");
    tdStreet.textContent = p.road || "Buscando...";
    tr.appendChild(tdStreet);

    const tdNumber = document.createElement("td");
    tdNumber.textContent = p.houseNumber || "-";
    tr.appendChild(tdNumber);

    const tdTown = document.createElement("td");
    tdTown.textContent = p.town || "-";
    tr.appendChild(tdTown);

    const tdActions = document.createElement("td");
    const btnDel = document.createElement("button");
    btnDel.type = "button";
    btnDel.className = "btn btn-danger";
    btnDel.textContent = "Eliminar";
    btnDel.addEventListener("click", () => {
      if (p.marker) {
        mapManager.map.removeLayer(p.marker);
        mapManager.markers.delete(p.marker);
      }
      const index = points.indexOf(p);
      if (index >= 0) points.splice(index, 1);
      renderTable();
      updateSaveButton();
      setStatus("");
      mapManager.fitToMarkers({ padding: [20, 20], maxZoom: 16 });
    });
    tdActions.appendChild(btnDel);
    tr.appendChild(tdActions);

    pointsBody.appendChild(tr);
  });
}

async function addPoint({ lat, lng }) {
  if (points.length >= MAX_PUNTOS) {
    setStatus(`Maximo ${MAX_PUNTOS} puntos de entrega.`);
    return;
  }

  const marker = mapManager.addMarker(lat, lng, { reuse: false });
  const point = { lat, lng, marker, road: "", houseNumber: "", town: "", displayName: "" };
  points.push(point);
  renderTable();
  updateSaveButton();
  mapManager.fitToMarkers({ padding: [20, 20], maxZoom: 16 });

  try {
    const detail = await getDireccionDetalleFromCoords(lat, lng);
    point.displayName = detail.displayName || "";
    point.road = detail.road || "";
    point.houseNumber = detail.houseNumber || "";
    point.town = pickTown(detail);
  } catch {
    point.road = "Direccion no disponible";
  } finally {
    renderTable();
  }
}

async function saveAll() {
  if (typeof window.apiFetch !== "function") {
    setStatus("apiFetch no esta disponible (revisa main.js)");
    return;
  }

  if (points.length === 0) return;
  if (points.length > MAX_PUNTOS) {
    setStatus(`Maximo ${MAX_PUNTOS} puntos de entrega.`);
    return;
  }

  btnSaveAll.disabled = true;
  btnSaveAll.textContent = "Guardando...";
  setStatus("");

  try {
    const payload = points.map((p) => {
      const labelParts = [];
      if (p.road) {
        labelParts.push(p.road + (p.houseNumber ? ` ${p.houseNumber}` : ""));
      }
      if (p.town) labelParts.push(p.town);
      const descripcion = labelParts.join(", ") || p.displayName || null;

      return { lat: p.lat, lng: p.lng, descripcion };
    });

    const result = await window.apiFetch("/puntos-entrega/bulk", "POST", { puntos: payload });
    const inserted = Number(result?.inserted) || payload.length;

    setStatus(`Guardados ${inserted} punto(s).`);
  } catch (err) {
    const msg = err?.message ? String(err.message) : "No se pudieron guardar los puntos.";
    setStatus(`Error: ${msg}`);
  } finally {
    btnSaveAll.textContent = "Guardar todo";
    updateSaveButton();
  }
}

async function loadMyPuntosEntrega() {
  if (typeof window.apiFetch !== "function") return;

  setStatus("Cargando puntos...");

  try {
    const rows = await window.apiFetch("/puntos-entrega/me");
    points.splice(0, points.length);
    mapManager.clearMarkers();

    if (Array.isArray(rows)) {
      rows.slice(0, MAX_PUNTOS).forEach((r) => {
        const lat = Number(r?.lat);
        const lng = Number(r?.lng);
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
        const marker = mapManager.addMarker(lat, lng, { reuse: false });
        points.push({ lat, lng, marker, road: "", houseNumber: "", town: "", displayName: "" });
      });
    }

    renderTable();
    updateSaveButton();
    mapManager.fitToMarkers({ padding: [20, 20], maxZoom: 16 });

    // Resolve direcciones en segundo plano
    await Promise.all(
      points.map(async (p) => {
        try {
          const detail = await getDireccionDetalleFromCoords(p.lat, p.lng);
          p.displayName = detail.displayName || "";
          p.road = detail.road || "";
          p.houseNumber = detail.houseNumber || "";
          p.town = pickTown(detail);
        } catch {
          p.road = "Direccion no disponible";
        }
      })
    );

    renderTable();
    setStatus(points.length ? "" : "No tienes puntos de entrega guardados.");
  } catch (err) {
    const msg = err?.message ? String(err.message) : "No se pudieron cargar los puntos.";
    setStatus(`Error: ${msg}`);
  }
}

// Tavernes de la Valldigna (Safor)
const mapManager = new MapManager("map", { center: [39.0717, -0.2668], zoom: 13 });

mapManager.onClick(async (e) => {
  const { lat, lng } = e.latlng || {};
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
  setStatus("");
  await addPoint({ lat, lng });
});

btnMyLocation?.addEventListener("click", () => {
  tryGeolocation(mapManager, { zoom: 14 });
});

btnBackPerfil?.addEventListener("click", () => {
  window.location.href = "perfil.html";
});

btnSaveAll?.addEventListener("click", saveAll);
updateSaveButton();
loadMyPuntosEntrega();
