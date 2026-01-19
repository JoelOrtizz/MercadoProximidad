document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('form_producto');
  if (!form) return;

  async function loadCategorias() {
    const select = document.getElementById('categoria');
    if (!select) return;

    if (typeof window.apiFetch !== 'function') {
      select.innerHTML = '<option value="">Seleccione categoria</option>';
      return;
    }

    const previousValue = select.value;
    select.innerHTML = '<option value="">Cargando categorias...</option>';

    try {
      const categorias = await window.apiFetch('/categorias');
      if (!Array.isArray(categorias)) {
        throw new Error('Respuesta inesperada al cargar categorias');
      }

      select.innerHTML = '<option value="">Seleccione categoria</option>';
      categorias.forEach((c) => {
        if (!c || c.id == null) return;
        const opt = document.createElement('option');
        opt.value = String(c.id);
        opt.textContent = String(c.nombre || `Categoria ${c.id}`);
        select.appendChild(opt);
      });

      // Intenta conservar la seleccion previa si coincide con algun id real
      if (previousValue) {
        select.value = previousValue;
      }
    } catch (err) {
      console.error('Error cargando categorias:', err);
      select.innerHTML = '<option value="">No se pudieron cargar categorias</option>';
    }
  }

  await loadCategorias();

  form.addEventListener('submit', async (e) => {
    // Evita que el formulario recargue la pagina
    e.preventDefault();

    // FormData porque incluye imagen (multipart/form-data)
    const formData = new FormData(form);

    try {
      if (typeof window.apiFetch !== 'function') {
        throw new Error('apiFetch no esta disponible (carga primero frontend/js/main.js)');
      }

      const resultado = await window.apiFetch('/productos', 'POST', formData);

      alert('Guardado con exito. ID: ' + resultado.id);
      form.reset();
    } catch (error) {
      // apiFetch ya muestra el error; aqui solo evitamos que el submit navegue
      console.error('Error al publicar producto:', error);
    }
  });
});
