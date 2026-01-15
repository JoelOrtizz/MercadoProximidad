function getActivePage() {
  const current = window.location.pathname.split("/").pop() || "";
  return current.toLowerCase();
}

function makePill(label, href, isActive) {
  const cls = `nav__pill${isActive ? " is-active" : ""}`;
  return `<a class="${cls}" href="${href}">${label}</a>`;
}

function renderNav() {
  const host = document.getElementById("globalNav");
  if (!host) return;

  const page = getActivePage();
  const nickname = localStorage.getItem("user_nickname") || "";
  const isLoggedIn = Boolean(nickname);
  const isComprar = page === "index.html" || page === "comprar.html" || page === "";
  const isPerfil = page === "perfil.html" || page === "puntosentrega.html";

  host.innerHTML = `
    <header class="nav">
      <div class="nav__inner">
        <a class="nav__brand" href="comprar.html">
          <img class="nav__logo-img" src="../assets/logo.jpeg" alt="TerretaShop" />
        </a>

        <nav class="nav__menu" aria-label="Principal">
          ${makePill("Comprar", "comprar.html", isComprar)}
          ${makePill("Vender", "vender.html", page === "vender.html")}
          ${makePill("Reservas", "#", false)}
          ${makePill("Mensajes", "#", false)}
          ${makePill("Valoraciones", "#", false)}
        </nav>

        <div class="nav__actions">
          <button class="nav__icon" type="button" title="Notificaciones" aria-label="Notificaciones">
            &#128276;
          </button>
          ${
            isLoggedIn
              ? `<button id="navProfileBtn" class="nav__user${isPerfil ? " is-active" : ""}" type="button" title="Perfil">${nickname}</button>`
              : ""
          }
          <button id="navAuthBtn" class="nav__cta" type="button">
            ${isLoggedIn ? "Logout" : "Login"}
          </button>
        </div>
      </div>
    </header>
  `;

  const profileBtn = document.getElementById("navProfileBtn");
  if (profileBtn) {
    profileBtn.addEventListener("click", () => {
      window.location.href = "perfil.html";
    });
  }

  const btn = document.getElementById("navAuthBtn");
  if (!btn) return;

  btn.addEventListener("click", async () => {
    if (isLoggedIn) {
      await handleLogout();
      return;
    }
    window.location.href = "login.html";
  });
}

document.addEventListener("DOMContentLoaded", renderNav);
