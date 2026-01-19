import { getDireccionFromCoords } from "./map/mapUtils.js";

document.addEventListener("DOMContentLoaded", () => {
  cargarPerfil();
  cargarDireccionSeleccionada();
  wirePuntosEntregaButton();
  wireMisProductos();
  wireVentasActivasScroll();
  loadMyProducts();
});

let categoriasPromise = null;
let categoriasById = new Map();
let categoriasList = [];

function getCategoriaLabel(idCategoria) {
  if (idCategoria == null || idCategoria === "") return "Sin categoria";
  const key = Number(idCategoria);
  if (Number.isFinite(key) && categoriasById.has(key)) return categoriasById.get(key);
  return `Categoria ${idCategoria}`;
}

async function loadCategorias() {
  if (categoriasPromise) return categoriasPromise;
  categoriasPromise = (async () => {
    const cats = await window.apiFetch("/categorias");
    if (!Array.isArray(cats)) {
      categoriasById = new Map();
      categoriasList = [];
      return categoriasList;
    }
    categoriasList = cats.filter((c) => c && c.id != null);
    categoriasById = new Map(
      categoriasList.map((c) => [Number(c.id), String(c.nombre || `Categoria ${c.id}`)])
    );
    return categoriasList;
  })();
  return categoriasPromise;
}

function leerCoordsSeleccionadas() {
  const raw = localStorage.getItem("user_coords");
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    const lat = Number(parsed?.lat);
    const lng = Number(parsed?.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    return { lat, lng };
  } catch {
    return null;
  }
}

function extraerCalle(displayName) {
  if (!displayName || typeof displayName !== "string") return "";
  const first = displayName.split(",")[0] || "";
  return first.trim();
}

async function cargarDireccionSeleccionada() {
  const infoUbi = document.getElementById("info_ubi");
  if (!infoUbi) return;

  const coords = leerCoordsSeleccionadas();
  if (!coords) {
    infoUbi.textContent = "No hay ubicacion seleccionada.";
    return;
  }

  infoUbi.textContent = "Buscando direccion...";

  try {
    const displayName = await getDireccionFromCoords(coords.lat, coords.lng);
    const calle = extraerCalle(displayName);
    infoUbi.textContent = calle || displayName || "Direccion no disponible.";
  } catch {
    infoUbi.textContent = "No se pudo obtener la direccion.";
  }
}

async function cargarPerfil() {
  try {
    if (typeof window.apiFetch !== "function") {
      throw new Error("apiFetch no esta disponible");
    }

    const data = await window.apiFetch("/usuarios");
    const nicknameGuardado = localStorage.getItem("user_nickname");
    const usuario = data?.users?.find?.((u) => u.nickname === nicknameGuardado);

    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }

    document.getElementById("nickname").textContent = usuario.nickname;
    document.getElementById("name_info").textContent = usuario.nombre;
    document.getElementById("email_info").textContent = usuario.email;
    document.getElementById("tel_info").textContent = "-";
  } catch (error) {
    console.error("Error cargando perfil:", error);
  }
}

function wirePuntosEntregaButton() {
  const btn = document.getElementById("pref_change");
  if (!btn) return;
  btn.addEventListener("click", () => {
    window.location.href = "puntosEntrega.html";
  });
}

function wireMisProductos() {
  const btn = document.getElementById("btnMisProductosReload");
  if (!btn) return;
  btn.addEventListener("click", loadMyProducts);
}

function wireVentasActivasScroll() {
  const ventasEl = document.getElementById("vent_act");
  if (!ventasEl) return;
  const card = ventasEl.closest(".content_vendedor");
  if (!card) return;

  card.style.cursor = "pointer";
  card.addEventListener("click", () => {
    const target =
      document.getElementById("productos_header") || document.getElementById("productos_me");
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function backendOrigin() {
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

function renderEmptyMyProducts(container) {
  container.innerHTML = `<div class="product-muted">No tienes productos publicados.</div>`;
}

function createLabeledInput(label, inputEl) {
  const wrap = document.createElement("div");
  const lab = document.createElement("label");
  lab.textContent = label;
  wrap.appendChild(lab);
  wrap.appendChild(inputEl);
  return wrap;
}

function createProductCard(product, { onRefresh } = {}) {
  const card = document.createElement("article");
  card.className = "product-row";

  function renderView() {
    card.innerHTML = "";
    card.classList.remove("is-editing");

    const img = document.createElement("img");
    img.className = "product-row__img";
    img.alt = `Imagen de ${product.nombre || "producto"}`;
    img.loading = "lazy";
    img.src = product.imagen ? resolveImageSrc(product.imagen) : "";
    if (!product.imagen) img.style.visibility = "hidden";
    card.appendChild(img);

    const main = document.createElement("div");
    main.className = "product-row__main";

    const title = document.createElement("div");
    title.className = "product-row__title";
    title.textContent = product.nombre || "Producto";
    main.appendChild(title);

    const desc = document.createElement("div");
    desc.className = "product-row__desc";
    desc.textContent = product.descripcion || "Sin descripcion.";
    main.appendChild(desc);

    const meta = document.createElement("div");
    meta.className = "product-row__meta";
    meta.textContent = `Stock: ${formatStock(product.stock, product.tipo)} · ${getCategoriaLabel(
      product.id_categoria
    )}`;
    main.appendChild(meta);

    card.appendChild(main);

    const side = document.createElement("div");
    side.className = "product-row__side";

    const price = document.createElement("div");
    price.className = "product-row__price";
    price.textContent = formatPrice(product.precio);
    side.appendChild(price);

    const actions = document.createElement("div");
    actions.className = "product-actions";

    const btnEdit = document.createElement("button");
    btnEdit.type = "button";
    btnEdit.className = "btn";
    btnEdit.textContent = "Editar";
    btnEdit.addEventListener("click", renderEdit);

    actions.appendChild(btnEdit);
    side.appendChild(actions);
    card.appendChild(side);
  }

  function renderEdit() {
    card.innerHTML = "";
    card.classList.add("is-editing");

    const form = document.createElement("div");
    form.className = "product-form";

    const nombre = document.createElement("input");
    nombre.type = "text";
    nombre.value = product.nombre || "";

    const categoria = document.createElement("select");
    categoria.disabled = true;
    categoria.innerHTML = `<option value="">Cargando categorias...</option>`;

    const tipo = document.createElement("input");
    tipo.type = "text";
    tipo.value = product.tipo || "";

    const stock = document.createElement("input");
    stock.type = "number";
    stock.step = "0.01";
    stock.value = product.stock ?? "";

    const precio = document.createElement("input");
    precio.type = "number";
    precio.step = "0.01";
    precio.value = product.precio ?? "";

    const descripcion = document.createElement("textarea");
    descripcion.value = product.descripcion || "";

    const imgPreview = document.createElement("img");
    imgPreview.className = "product-edit__preview";
    imgPreview.alt = "Previsualizacion de imagen";
    imgPreview.src = product.imagen ? resolveImageSrc(product.imagen) : "";
    if (!product.imagen) imgPreview.style.display = "none";

    const imagen = document.createElement("input");
    imagen.type = "file";
    imagen.accept = "image/*";
    imagen.addEventListener("change", () => {
      const f = imagen.files && imagen.files[0];
      if (!f) return;
      imgPreview.style.display = "block";
      imgPreview.src = URL.createObjectURL(f);
    });

    form.appendChild(createLabeledInput("Nombre", nombre));
    form.appendChild(createLabeledInput("Categoria", categoria));
    form.appendChild(createLabeledInput("Tipo (kg, L, unidad...)", tipo));
    form.appendChild(createLabeledInput("Stock", stock));
    form.appendChild(createLabeledInput("Precio", precio));
    form.appendChild(createLabeledInput("Descripcion", descripcion));
    form.appendChild(createLabeledInput("Cambiar imagen", imagen));
    form.appendChild(imgPreview);

    // Cargar categorias y seleccionar la actual
    loadCategorias()
      .then((cats) => {
        categoria.disabled = false;
        categoria.innerHTML = `<option value="">Sin categoria</option>`;
        cats.forEach((c) => {
          const opt = document.createElement("option");
          opt.value = String(c.id);
          opt.textContent = String(c.nombre || `Categoria ${c.id}`);
          categoria.appendChild(opt);
        });
        categoria.value = product.id_categoria == null ? "" : String(product.id_categoria);
      })
      .catch(() => {
        categoria.disabled = false;
        categoria.innerHTML = `<option value="">Sin categoria</option>`;
        categoria.value = product.id_categoria == null ? "" : String(product.id_categoria);
      });

    const actions = document.createElement("div");
    actions.className = "product-actions";

    const btnCancel = document.createElement("button");
    btnCancel.type = "button";
    btnCancel.className = "btn";
    btnCancel.textContent = "Cancelar";
    btnCancel.addEventListener("click", renderView);

    const btnSave = document.createElement("button");
    btnSave.type = "button";
    btnSave.className = "btn btn-primary";
    btnSave.textContent = "Guardar";
    btnSave.addEventListener("click", async () => {
      try {
        btnSave.disabled = true;
        btnCancel.disabled = true;

        const fd = new FormData();
        fd.append("nombre", nombre.value);
        fd.append("id_categoria", categoria.value);
        fd.append("tipo", tipo.value);
        fd.append("stock", stock.value);
        fd.append("precio", precio.value);
        fd.append("descripcion", descripcion.value);

        const file = imagen.files && imagen.files[0];
        if (file) {
          fd.append("imagen", file);
        } else if (product.imagen) {
          fd.append("imagen_anterior", product.imagen);
        }

        await window.apiFetch(`/productos/${product.id}`, "PUT", fd);

        // Recarga para reflejar cambios (y posible nueva imagen)
        if (typeof onRefresh === "function") onRefresh();
      } catch (err) {
        console.error("Error guardando producto:", err);
      } finally {
        btnSave.disabled = false;
        btnCancel.disabled = false;
      }
    });

    actions.appendChild(btnCancel);
    actions.appendChild(btnSave);

    const editWrap = document.createElement("div");
    editWrap.className = "product-edit";
    editWrap.appendChild(form);
    editWrap.appendChild(actions);
    card.appendChild(editWrap);
  }

  renderView();
  return card;
}

async function loadMyProducts() {
  const container = document.getElementById("productos_me");
  if (!container) return;

  try {
    if (typeof window.apiFetch !== "function") {
      throw new Error("apiFetch no esta disponible");
    }

    container.innerHTML = `<div class="product-muted">Cargando productos...</div>`;
    const [products] = await Promise.all([window.apiFetch("/productos/me"), loadCategorias()]);

    if (!Array.isArray(products) || products.length === 0) {
      const ventasAct = document.getElementById("vent_act");
      if (ventasAct) ventasAct.textContent = "0";
      renderEmptyMyProducts(container);
      return;
    }

    const ventasCount = products.reduce((acc, p) => {
      const stock = Number(p?.stock);
      return acc + (Number.isFinite(stock) && stock > 0 ? 1 : 0);
    }, 0);
    const ventasAct = document.getElementById("vent_act");
    if (ventasAct) ventasAct.textContent = String(ventasCount);

    container.innerHTML = "";
    products.forEach((p) => {
      container.appendChild(
        createProductCard(p, {
          onRefresh: loadMyProducts,
        })
      );
    });
  } catch (error) {
    console.error("Error cargando mis productos:", error);
    container.innerHTML = `<div class="product-muted">No se pudieron cargar tus productos.</div>`;
  }
}
