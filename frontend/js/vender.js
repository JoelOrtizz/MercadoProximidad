document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form_producto');
  if (!form) return;

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
