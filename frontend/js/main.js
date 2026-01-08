const API_URL = window.API_URL || "http://localhost:3000/api";

async function apiFetch(endpoint, method = "GET", body = null) {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);

    let data = null;
    try {
      data = await response.json();
    } catch {
      // respuesta no JSON
    }

    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem("user_nickname");
      if (!window.location.pathname.endsWith("/login.html")) {
        window.location.href = "login.html";
      }
      throw new Error((data && (data.message || data.error)) || "No autorizado");
    }

    if (!response.ok) {
      throw new Error((data && (data.message || data.error)) || "Error en la peticion");
    }

    return data;
  } catch (error) {
    console.error("Error de red o logica:", error);
    alert(`Error: ${error.message}`);
    throw error;
  }
}

async function handleLogout() {
  try {
    await apiFetch("/login/logout", "POST");
  } finally {
    localStorage.removeItem("user_nickname");
    window.location.href = "login.html";
  }
}

