const API_URL = "http://localhost:3000/api";

async function apiFetch(endpoint, method = 'GET', body = null){
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include"
    };

    if (body) {
      options.body = JSON.stringify(body); // HTTP solo transporta texto. Convertimos el objeto a String para que
      // el backend (express.json) pueda recibirlo y reconstruirlo.
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, options);
        
        // Hemos quitado la comprobación de status 401/403 y la redirección
        // Ahora pasamos directamente a procesar la respuesta

        const data = await response.json();
        
        if (!response.ok) {
            // Si el backend devuelve error (ej: "Token inválido"), caerá aquí
            throw new Error(data.message || data.error || 'Error en la petición');
        }

        return data;
    } catch (error) {
        console.error("Error de red o lógica:", error);
        alert(`Error: ${error.message}`);
        throw error; // Re-lanzamos el error para que quien llame a apiFetch sepa que falló
    }
}

async function handleLogout() {
  try {
    await apiFetch("/login/logout", "POST"); // Pide al servidor borrar cookie
    localStorage.removeItem("user_nickname");
    window.location.href = "login.html"; // Te devuelve al login
  } catch (e) {
    window.location.href = "login.html";
  }
}