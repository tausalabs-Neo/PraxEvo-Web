(() => {
  "use strict";

  /* ---------- Mobile navigation ---------- */
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.getElementById("mobile-menu");

  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Abrir menú" : "Cerrar menú");
      menu.hidden = isOpen;
    });

    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Abrir menú");
        menu.hidden = true;
      });
    });
  }

  /* ---------- Course/category filter chips (Cursos page) ---------- */
  const chipRow = document.querySelector("[data-filter-chips]");
  if (chipRow) {
    const cards = document.querySelectorAll("[data-course-card]");
    chipRow.querySelectorAll(".chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        chipRow.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", "false"));
        chip.setAttribute("aria-pressed", "true");
        const category = chip.dataset.category;
        cards.forEach((card) => {
          const match = category === "Todos" || card.dataset.category === category;
          card.style.display = match ? "" : "none";
        });
      });
    });
  }

  /* ---------- Contact form ---------- */
  const form = document.querySelector("#contact-form");
  if (form) {
    const statusBox = document.querySelector("#form-status");
    const submitBtn = form.querySelector("button[type=submit]");

    const setStatus = (kind, message) => {
      statusBox.className = "form-status is-visible " + kind;
      statusBox.textContent = message;
      statusBox.setAttribute("role", "status");
    };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      statusBox.className = "form-status";

      // Honeypot: if filled, silently pretend success (bot trap)
      const honeypot = form.querySelector("input[name='website']");
      if (honeypot && honeypot.value.trim() !== "") {
        form.reset();
        setStatus("success", "¡Gracias! Te escribimos pronto.");
        return;
      }

      const data = Object.fromEntries(new FormData(form).entries());

      if (!data.nombre || !data.correo || !data.mensaje) {
        setStatus("error", "Por favor completa los campos requeridos.");
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = "Enviando...";

      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });

        const payload = await res.json().catch(() => ({}));

        if (res.ok && payload.ok) {
          form.reset();
          if (window.turnstile) window.turnstile.reset();
          setStatus("success", "¡Gracias! Un miembro del equipo de PraxEvo te contactará en menos de 48 horas hábiles.");
        } else {
          setStatus("error", payload.error || "No pudimos enviar tu mensaje. Intenta de nuevo o escríbenos a hola@praxevo.com.");
        }
      } catch (err) {
        setStatus("error", "Error de conexión. Intenta de nuevo o escríbenos a hola@praxevo.com.");
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Enviar mensaje";
      }
    });
  }
})();
