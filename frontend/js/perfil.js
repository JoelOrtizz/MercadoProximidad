document.addEventListener("DOMContentLoaded", () => {
  cargarPerfil();
});


async function cargarPerfil() {
  try {
    const data = await apiFetch("/usuarios");

    const nicknameGuardado = localStorage.getItem("user_nickname");

    // Buscar el usuario logueado
    const usuario = data.users.find(
      (u) => u.nickname === nicknameGuardado
    );

    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }

    // Rellenar HTML
    document.getElementById("nickname").textContent = usuario.nickname;
    document.getElementById("name_info").textContent = usuario.nombre;
    document.getElementById("email_info").textContent = usuario.email;

    // Teléfono no existe en backend todavía
    document.getElementById("tel_info").textContent = "-";

  } catch (error) {
    console.error("Error cargando perfil:", error);
  }
}

