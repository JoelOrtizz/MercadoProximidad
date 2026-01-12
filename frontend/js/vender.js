const DEFAULT_API_URL =
  window.location.protocol.startsWith("http") && window.location.hostname
    ? `${window.location.protocol}//${window.location.hostname}:3000/api`
    : "http://localhost:3000/api";

const API_URL = window.API_URL || DEFAULT_API_URL;

const form = document.getElementById('form_producto');

form.addEventListener('submit', async (e) => {
    // Aquí evitaremos que el Formulario recargue la página
    e.preventDefault();

    // Recogemos los datos de los inputs, de esta forma hace un paquete con toda la info, ya que hay archivos "file"
    const formData = new FormData(form);

    try {
        // envío de datos al backend
        const respuesta = await fetch(`${API_URL}/productos`, {
            method: 'POST',

            credentials: 'include',
            
            body: formData
        });

        const resultado = await respuesta.json();

        if (respuesta.ok) {

            alert('Guardado con éxito. ID: ' + resultado.id);

            form.reset();

        }else {

            alert('Error: ' + resultado.mensaje);

        }
    }catch (error) {

        console.error('Error de red: ', error);

        alert('No se puedo conectar con el servidor');

    }
});
