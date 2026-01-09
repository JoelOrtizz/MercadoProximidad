const form = document.getElementById('form_producto');

form.addEventListener('submit', async (e) => {
    // Aquí evitaremos que el Formulario recargue la página
    e.preventDefault();

    // Recogemos los datos de los inputs, de esta forma hace un paquete con toda la info, ya que hay archivos "file"
    const formData = new FormData(form);

    try {
        // envío de datos al backend
        const respuesta = await fetch('http://localhost:3000/api/productos', {
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