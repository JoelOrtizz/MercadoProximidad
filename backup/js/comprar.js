function backendOrigin() {
  // Mantiene la misma idea que main.js (mismo host, puerto 3000)
  if (window.location.protocol.startsWith("http") && window.location.hostname) {
    return `${window.location.protocol}//${window.location.hostname}:3000`;
  }
  return "http://localhost:3000";
}

function resolveImageSrc(value) {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  return `${backendOrigin()}/uploads/${encodeURIComponent(value)}`;
}

function formatPrice(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "-";
  return `${n.toFixed(2)} €`;
}

function formatStock(stock, tipo) {
  const s = stock == null ? "-" : String(stock);
  const t = tipo ? String(tipo) : "";
  return t ? `${s} ${t}` : s;
}

function renderProductCard(p) {
  const card = document.createElement("article");
  card.className = "product-card";

  const top = document.createElement("div");
  top.className = "product-top";

  const h3 = document.createElement("h3");
  h3.textContent = p?.nombre || "Producto";

  const price = document.createElement("div");
  price.className = "price";
  price.textContent = formatPrice(p?.precio);

  top.appendChild(h3);
  top.appendChild(price);
  card.appendChild(top);

  const imgValue = p?.imagen;
  if (imgValue) {
    const media = document.createElement("div");
    media.className = "product-media";

    const img = document.createElement("img");
    img.alt = `Imagen de ${p?.nombre || "producto"}`;
    img.loading = "lazy";
    img.src = resolveImageSrc(imgValue);

    media.appendChild(img);
    card.appendChild(media);
  }

  const desc = document.createElement("p");
  desc.className = "desc";
  desc.textContent = p?.descripcion || "Sin descripcion.";
  card.appendChild(desc);

  const meta = document.createElement("div");
  meta.className = "meta";
  meta.textContent = `Stock: ${formatStock(p?.stock, p?.tipo)}`;
  card.appendChild(meta);

  return card;
}

function setActiveCategory(chipsEl, activeValue) {
  chipsEl.querySelectorAll(".chip[data-cat]").forEach((btn) => {
    const isActive = btn.dataset.cat === String(activeValue);
    btn.classList.toggle("is-active", isActive);
  });
}

function renderCategoryChip(cat, chipsEl) {
  const btn = document.createElement("button");
  btn.className = "chip";
  btn.type = "button";
  btn.dataset.cat = String(cat.id);
  btn.textContent = cat.nombre || `Categoria ${cat.id}`;
  btn.title = "Filtro pendiente de implementar";
  btn.addEventListener("click", () => {
    setActiveCategory(chipsEl, btn.dataset.cat);
  });
  return btn;
}

async function loadCategorias() {
  const chipsEl = document.getElementById("categoryChips");
  if (!chipsEl) return;

  try {
    const categorias = await window.apiFetch("/categorias");
    if (!Array.isArray(categorias)) return;

    // Mantener "Todas" y añadir las categorias del backend
    categorias.forEach((c) => {
      if (!c || c.id == null) return;
      chipsEl.appendChild(renderCategoryChip(c, chipsEl));
    });
  } catch {
    // Si falla, se queda solo "Todas"
  }
}

async function loadProducts() {
  const grid = document.getElementById("productGrid");
  const subtitle = document.getElementById("productsSubtitle");

  if (!grid || !subtitle) return;
  grid.innerHTML = "";
  subtitle.textContent = "Cargando productos...";

  try {
    const products = await window.apiFetch("/productos");
    if (!Array.isArray(products)) {
      throw new Error("Respuesta inesperada al listar productos");
    }

    if (products.length === 0) {
      subtitle.textContent = "No hay productos publicados todavia.";
      return;
    }

    subtitle.textContent = `${products.length} producto(s)`;
    products.forEach((p) => grid.appendChild(renderProductCard(p)));
  } catch (err) {
    subtitle.textContent = "No se pudieron cargar los productos.";
    const msg = err?.message ? String(err.message) : "Error desconocido";
    grid.textContent = msg;
    grid.style.color = "#b91c1c";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btnReload");
  if (btn) btn.addEventListener("click", loadProducts);
  loadCategorias();
  loadProducts();
});
