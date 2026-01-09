const DEFAULT_API_URL =
  window.location.protocol.startsWith("http") && window.location.hostname
    ? `${window.location.protocol}//${window.location.hostname}:3000/api`
    : "http://localhost:3000/api";

const API_URL = window.API_URL || DEFAULT_API_URL;

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

// Expose helpers explicitly (useful when mixing classic scripts and ES modules)
window.apiFetch = apiFetch;
window.handleLogout = handleLogout;
