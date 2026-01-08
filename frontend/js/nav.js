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

  host.innerHTML = `
    <header class="nav">
      <a class="nav__brand" href="index.html">
        <div class="nav__logo">
          <span class="brand-accent">Terreta</span><br />
          Shop
        </div>
      </a>

      <nav class="nav__menu" aria-label="Principal">
        ${makePill("Comprar", "index.html", page === "index.html")}
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
            ? `<button class="nav__user" type="button" disabled title="Usuario">${nickname}</button>`
            : ""
        }
        <button id="navAuthBtn" class="nav__cta" type="button">
          ${isLoggedIn ? "Logout" : "Login"}
        </button>
      </div>
    </header>
  `;

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

