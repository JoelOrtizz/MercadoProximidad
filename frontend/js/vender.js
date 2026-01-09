const form = document.getElementById('form_producto');

form.addEventListener('submit', async (e) => {
    // Aquí evitaremos que el Formulario recargue la página
    e.preventDefault();

    // Recogemos los datos de los inputs
    const datosProductos = {
        nombre: document.getElementById('nombre').value,
        precio: document.getElementById('precio').value,
        stock: document.getElementById('stock').value,
        tipo: document.getElementById('unidad').value,
        duracion: document.getElementById('duracion').value,
        categoria: document.getElementById('categoria').value,
        descripcion: document.getElementById('descripcion').value,
        imagen: document.getElementById('imagen').value
    }

    try {
        // envío de datos al backend
        const respuesta = await fetch('http://localhost:3000/api/productos', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(datosProductos)
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