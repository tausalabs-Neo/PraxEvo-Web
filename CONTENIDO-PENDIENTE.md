# Contenido pendiente antes de publicar

**El sitio ya está publicado y en vivo en https://somospraxevo.com** (Cloudflare Pages, SSL
activo). Sigue siendo funcional para visitar hoy mismo, pero **no debe promocionarse ampliamente**
hasta reemplazar lo siguiente. Todo lo listado aquí aparece también marcado en la página correspondiente con una
nota naranja ("Contenido de ejemplo — pendiente de reemplazo") o un badge "Precio pendiente" /
"Fotos pendientes", para que nadie lo confunda con un dato real.

## 1. Catálogo de PraxEvo Academy (`src/cursos.njk`, sección de Home)
- [x] **Título y estructura reales — resuelto 2026-08-06 (TEC-0011, cita [[ENC-0001 — Catálogo y precio real de Academy|ENC-0001]]).**
      Se bajaron los 6 cursos de ejemplo. Publicado el único curso real: "Del caos operativo al
      cliente fidelizado", 8 módulos, 100% digital, pago único, a ritmo del alumno, sin
      acompañamiento en vivo, sin certificación reconocida por universidad.
- [x] **Precio real — resuelto 2026-08-06 (TEC-0011, cita ENC-0001, gate techo-duro firmado por
      Steve 2026-08-03).** USD 97 y COP 299.000, con 12 cuotas de COP 24.917/mes habilitadas
      (solo aplica al precio en pesos). Regla de revisión cambiaria escrita en comentario
      Nunjucks junto al precio en `cursos.njk` e `index.njk`: revisar si la TRM del Banco de la
      República supera 3.785 COP/USD.
- [ ] **Descripción/copy del curso** — pendiente de Marca y Contenido. No se inventó copy;
      la tarjeta muestra el badge honesto "Descripción pendiente — Marca y Contenido"
      (`.pending-badge`).
- [ ] Enlace real de Hotmart — el curso no está publicado ahí todavía (pendiente de Academy,
      ver INS-0012). El CTA de la tarjeta enlaza a `/contacto/` ("Escríbenos para inscribirte →")
      con un comentario `{# TODO: reemplazar por el enlace real de Hotmart cuando Academy
      publique el curso #}` junto al enlace.
- [ ] Miniatura/imagen real del curso — pendiente de Marca y Contenido (handoff HO-2 en
      ENC-0001). Se dejó el placeholder gris "Miniatura del curso" que ya existía en el markup;
      no se generó ninguna imagen.
- [ ] El reproductor nativo de Hotmart (1,49 USD por venta) no se activa en el lanzamiento — es
      configuración dentro de la cuenta de Hotmart de Academy, nada que tocar en código. La
      cuenta de Hotmart de Academy tampoco existe todavía (INS-0012).

## 2. Paquetes de PraxEvo Consulting (`src/consultoria.njk`)
- [ ] Nombres, alcance y duración definitivos de cada paquete.
- [ ] Precios o rango de precios (hoy dice "Cotización por proyecto" sin cifra).
- [ ] Un caso de éxito/testimonio real, con datos verificables (el prototipo original tenía uno
      inventado — "redujimos 32%..." — que **no se incluyó** en esta versión por no ser real).

## 3. Fotos de los fundadores (`src/nosotros.njk`, teaser en Home)
- [ ] Foto de John Steven Santana → guardar en `src/assets/img/founders/john-santana.jpg`
- [ ] Foto de Viviana Ricardo → guardar en `src/assets/img/founders/viviana-ricardo.jpg`
- [ ] Una vez agregadas, reemplazar el marcador de iniciales en `nosotros.njk` (busca
      `founder-photo`) por `<img src="/assets/img/founders/....jpg" alt="...">`.
- Nota: el manual de marca dice "marca sin rostro" (sin fotos de personas) para redes/video.
  Se decidió conscientemente **romper esa regla en el sitio web** para humanizar la marca —
  confirmar que ambos fundadores están de acuerdo con tener su foto pública en el sitio.

## 4. Cuentas externas — estado

- [x] **Cloudflare**: cuenta creada, dominio `somospraxevo.com` migrado (nameservers en
      Cloudflare), sitio desplegado y sirviendo en https://somospraxevo.com (SSL activo).
- [x] **Cloudflare Turnstile**: widget creado, site key y secret key configurados en el sitio
      y en el proyecto de Pages.
- [x] **Cloudflare Email Routing**: activo. `hola@somospraxevo.com` reenvía a
      `tausa.labs@gmail.com`.
- [x] **Cloudflare Workers KV**: namespace `praxevo_contact_rl` creado y enlazado para el
      rate limiting del formulario.
- [ ] **Resend** (resend.com, gratis hasta 3,000 correos/mes) — **pendiente, no creada aún**.
      Sin esto, el formulario de contacto valida todo correctamente pero **no puede enviar el
      correo final** (falla con un mensaje de error genérico al intentar enviar). Pasos:
      1. Crear cuenta en resend.com.
      2. Verificar el dominio `somospraxevo.com` allí (agrega registros DNS — como el dominio
         ya está en Cloudflare, se agregan fácilmente desde el dashboard de DNS).
      3. Generar una API key y dármela para configurarla como secreto `RESEND_API_KEY` en el
         proyecto de Pages (`praxevo-site` → Settings → Variables and secrets).

## 5. Revisión legal
- [ ] Un abogado debe revisar `src/privacidad.njk` y `src/terminos.njk` antes de publicar —
      son un borrador razonable basado en la Ley 1581 de 2012, no asesoría legal certificada.

## 6. Opcional / a decidir más adelante
- [ ] ¿Analítica? Se recomienda Cloudflare Web Analytics (sin cookies, sin banner necesario) —
      se activa desde el dashboard de Cloudflare una vez el dominio esté ahí, sin tocar código.
- [ ] Redes sociales: confirmar que @praxevo es el handle correcto en Instagram/TikTok/YouTube
      antes de que alguien haga clic desde el sitio (hoy son solo texto, no están linkeados).

## 7. Backlog de performance/accesibilidad (auditoría Lighthouse 2026-07-27)

Auditoría real (Lighthouse 13.4.1, mobile) contra la Home en producción: Performance 86,
Accessibility 94, Best Practices 100, SEO 100. Retomar en la próxima sesión de desarrollo:

- [ ] **[Alto impacto] Fuentes de Google Fonts bloquean el render (~1.3s de FCP/LCP).**
      `src/_includes/base.njk` carga `fonts.googleapis.com/css2?...` que encadena a 3 archivos
      `.woff2` en `fonts.gstatic.com` (cadena crítica de 3 niveles, ~1,211ms). Esto es lo único
      que explica que FCP = LCP = Speed Index = TTI estén los cuatro clavados en 3.3s.
      Fix propuesto: auto-hospedar Inter/Space Grotesk/Bebas Neue como `.woff2` locales con
      `@font-face { font-display: swap }` en `styles.css`, y quitar el `<link>` +
      `preconnect` a Google Fonts de `base.njk`.
- [ ] **[Medio] Contraste insuficiente en `.hero .proof .t`** (`src/assets/css/styles.css`).
      Texto de las cifras del hero ("+15 años", "VIVA", "Nequi") usa `--white-40` sobre navy,
      contraste 3.4–3.52:1 (se necesita 4.5:1). Fix: subir a `--white-70` o similar.
- [ ] **[Medio] Salto de nivel de encabezado h2 → h4** en
      `src/_includes/partials/footer.njk`. Los `<h4>Academy</h4>` / `Consulting` / `Empresa`
      deberían ser `<h3>`.
- [ ] Re-auditar Cursos/Consultoría/Nosotros/Contacto (esta corrida solo cubrió Home), y
      volver a correr Lighthouse después de aplicar los fixes de arriba — deberían llevar el
      score de Performance de 86 a mediados/altos 90s.
