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

      const consiento = form.querySelector("#consiento");
      if (!consiento || !consiento.checked) {
        setStatus("error", "Debes autorizar el tratamiento de tus datos personales para continuar.");
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
          setStatus("error", payload.error || "No pudimos enviar tu mensaje. Intenta de nuevo o escríbenos a hola@somospraxevo.com.");
        }
      } catch (err) {
        setStatus("error", "Error de conexión. Intenta de nuevo o escríbenos a hola@somospraxevo.com.");
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Enviar mensaje";
      }
    });
  }

  /* ==========================================================
     Movimiento — ENC-0031/ENC-0032. Solo APIs nativas del
     navegador (IntersectionObserver, requestAnimationFrame).
     Cero librerías externas de animación, condición dura sin
     excepción. Costo de performance medido y sostenido por ENC-0030.
     ========================================================== */
  const prefersReducedMotion = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

  /* ---------- Reveal de sección al entrar en viewport ---------- */
  /* Moderado en las cinco páginas, incluida la sección nueva de Capa 3.
     Fade + desplazamiento ya definidos en CSS ([data-reveal]/.is-visible);
     aquí solo se decide CUÁNDO se agrega la clase. Si el navegador no
     soporta IntersectionObserver, el contenido se muestra de inmediato:
     nunca se deja una sección invisible por falta de soporte. */
  const revealTargets = document.querySelectorAll("[data-reveal]");
  if (revealTargets.length) {
    if ("IntersectionObserver" in window) {
      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
      );
      revealTargets.forEach((el) => revealObserver.observe(el));
    } else {
      revealTargets.forEach((el) => el.classList.add("is-visible"));
    }
  }

  /* ---------- Contador animado sobre la cifra real del hero ---------- */
  /* Moderado. Única celda numérica verdadera del sitio (franja de prueba
     de Home, "15" años) — ver ENC-0031, Parte A: ninguna otra página tiene
     hoy una cifra propia que anime, así que no se generaliza el mecanismo. */
  const counter = document.querySelector("[data-counter]");
  if (counter) {
    const target = parseInt(counter.dataset.counter, 10);
    if (Number.isFinite(target)) {
      const runCounter = () => {
        if (prefersReducedMotion) {
          counter.textContent = String(target);
          return;
        }
        const start = performance.now();
        const duration = 900;
        let lastValue = -1;
        const step = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          // Solo escribe al DOM cuando el valor entero cambia (a lo sumo
          // `target` escrituras, no una por frame) — evita forzar
          // recalculo de estilo/layout en cada tick de rAF sin necesidad.
          const value = Math.round(progress * target);
          if (value !== lastValue) {
            counter.textContent = String(value);
            lastValue = value;
          }
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      };
      if ("IntersectionObserver" in window) {
        const counterObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                runCounter();
                counterObserver.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.5 }
        );
        counterObserver.observe(counter);
      } else {
        counter.textContent = String(target);
      }
    }
  }

  /* ---------- Header que se compacta al hacer scroll ---------- */
  /* Moderado, las cinco páginas (nav.njk es parcial compartido, el
     mecanismo vive una sola vez aquí). Throttle por requestAnimationFrame,
     patrón verificado en vivo en Archos Advisors (ENC-0029) y ya probado
     en la prueba aislada de ENC-0030. */
  const header = document.querySelector(".site-header");
  if (header) {
    let ticking = false;
    const applyScrollState = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(applyScrollState);
        ticking = true;
      }
    };
    document.addEventListener("scroll", onScroll, { passive: true });
    applyScrollState();
  }

  /* ---------- Tipografía cinética del H1 del hero ---------- */
  /* Alto, exclusivo de Home. El hero está sobre el pliegue (no depende
     de scroll): la clase se agrega al cargar. Como el script tiene
     `defer`, ya corre después de que el DOM terminó de parsearse, así
     que no hace falta esperar DOMContentLoaded aparte. Progressive
     enhancement: sin esta clase el H1 se ve completo (ver CSS). */
  const kineticH1 = document.querySelector("[data-kinetic]");
  if (kineticH1) {
    kineticH1.classList.add("is-kinetic");
  }
})();
