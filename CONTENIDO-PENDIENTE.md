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
- [x] **Descripción/copy del curso — resuelto 2026-08-16 por Marca y Contenido.** El badge
      "Descripción pendiente" se retiró de `cursos.njk` y de `index.njk`, reemplazado por copy
      real con la fórmula Problema, Contexto, Acción (versión larga en `/cursos/`, corta en la
      home). **Sin ninguna cifra de resultado de cliente**: los casos que sostienen el curso
      miden eficiencia operativa y ninguno mide retención, NPS ni recompra (advertencia de P5
      en ENC-0001). Las únicas afirmaciones factuales del copy — 8 módulos, proceso en cuatro
      pasos, sectores aerolínea de bajo costo y fintech de alto volumen — tienen fuente en
      ENC-0001 y ENC-0004, y respetan la regla de solo sectores (sin nombrar empleadores).
- [ ] Enlace real de Hotmart — el curso no está publicado ahí todavía (pendiente de Academy,
      ver INS-0012). El CTA de la tarjeta enlaza a `/contacto/` ("Escríbenos para inscribirte →")
      con un comentario `{# TODO: reemplazar por el enlace real de Hotmart cuando Academy
      publique el curso #}` junto al enlace.
- [x] **Miniatura/imagen real del curso — resuelta 2026-08-16 por Marca y Contenido (HO-2).**
      El placeholder gris "Miniatura del curso" se reemplazó por la imagen real en `cursos.njk`
      y en `index.njk`: `/assets/img/courses/curso-caos-operativo.png`, 1200×675 (16:9, la
      proporción que exige `.card-thumb`), con `alt`, `width`/`height` y `loading="lazy"`.
      La pieza que va a Hotmart es la variante 1:1 a 600×600 y **no** se usa en el sitio,
      porque un 1:1 dentro de un contenedor 16/9 con `object-fit: cover` le recortaría el
      título. Ambas salen del mismo generador reproducible,
      `execution/generar_miniatura_curso_praxevo.py`.
      **Estado al 2026-08-16 (Tecnología y Datos):** build corrido y **verificado en local**
      — el HTML generado ya no contiene "Miniatura del curso" ni "Descripción pendiente", y
      la imagen se comprobó abriéndola: PNG RGB 1200×675, 85.939 bytes,
      `sha256 9eb86af1…`. Revisado también en navegador: no hay recorte del título.
      **No desplegado:** desplegar a producción es techo duro propio de esta área y además
      pasa por gate `reforzado`; y falta la credencial de Cloudflare (INS-0023). Paquete de
      gate G4 y procedimiento con rollback en ENC-0001.
      Los estilos siguen en línea sobre el markup a propósito: moverlos a `.card-thumb img`
      en `styles.css` es decisión de esta área y no se mezcla con un despliegue de contenido,
      para no complicar el rollback. Queda en backlog.
- [ ] El reproductor nativo de Hotmart (1,49 USD por venta) no se activa en el lanzamiento — es
      configuración dentro de la cuenta de Hotmart de Academy, nada que tocar en código. La
      cuenta de Hotmart de Academy tampoco existe todavía (INS-0012).

## 2. Paquetes de PraxEvo Consulting (`src/consultoria.njk`)
- [ ] Nombres, alcance y duración definitivos de cada paquete.
- [ ] Precios o rango de precios (hoy dice "Cotización por proyecto" sin cifra).
- [ ] Un caso de éxito/testimonio real, con datos verificables (el prototipo original tenía uno
      inventado — "redujimos 32%..." — que **no se incluyó** en esta versión por no ser real).

## 3. Fotos de los fundadores (`src/nosotros.njk`, teaser en Home)

**Sección cerrada desde el 2026-08-04 (ENC-0006). Estaba desactualizada aquí y se corrige el
2026-08-16** tras verificar en vivo con `WebFetch` sobre `https://somospraxevo.com/nosotros/`:
los dos fundadores tienen foto, biografía individual y enlace de LinkedIn publicados.

- [x] Foto de John Steven Santana → `src/assets/img/steven-santana.jpg` (352×480), en vivo.
- [x] Foto de Viviana Ricardo → `src/assets/img/viviana-ricardo.jpg` (291×480), en vivo.
- [x] Marcador de iniciales reemplazado por las fotos reales en `nosotros.njk`.
- [x] Biografía individual de cada uno, con fuente en su propio LinkedIn autenticado vía
      Composio (`LINKEDIN_GET_MY_INFO`), no deducida. La de Viviana no nombra sector porque su
      titular no lo nombra: no se le asignó aviación ni fintech por asociación (P5).
      Consentimiento de foto autorizado en INS-0005; INS-0010 resuelto.
- Nota: el manual de marca dice "marca sin rostro" (sin fotos de personas) para redes/video.
  Se decidió conscientemente **romper esa regla en el sitio web** para humanizar la marca —
  confirmar que ambos fundadores están de acuerdo con tener su foto pública en el sitio.

## 4. Cuentas externas — estado

- [x] **Cloudflare**: cuenta creada, dominio `somospraxevo.com` migrado (nameservers en
      Cloudflare), sitio desplegado y sirviendo en https://somospraxevo.com (SSL activo).
- [x] **Cloudflare Turnstile**: widget creado, site key y secret key configurados en el sitio
      y en el proyecto de Pages.
- [x] **Cloudflare Email Routing**: activo. `hola@somospraxevo.com` reenvía a
      **`somospraxevo@gmail.com`** — el destino se cambió el 2026-08-03 (ver ENC-0003,
      entrada de Trabajo de esa fecha). Esta línea decía `tausa.labs@gmail.com` hasta el
      2026-08-16 y estaba desactualizada; importa porque decide en qué bandeja se busca un
      formulario que llegó. MX de la raíz verificado el 2026-08-16 por DNS-over-HTTPS:
      `route1/route2/route3.mx.cloudflare.net`.
- [x] **Cloudflare Workers KV**: namespace `praxevo_contact_rl` creado y enlazado para el
      rate limiting del formulario.
- [x] **Resend** (resend.com, gratis hasta 3.000 correos/mes) — **resuelto el 2026-08-04
      (ENC-0003, cerrado con veredicto `aprobado`).** Esta entrada dijo "pendiente, no creada
      aún" hasta el **2026-08-16**, doce días después de que dejara de ser cierto, y Marca y
      Contenido la citó de buena fe para levantar el handoff HO-13 y para escribir la
      dependencia más grave de su calendario editorial del trimestre. Se corrige y se deja
      dicho por qué, en vez de reescribirla en silencio.
      Lo que ENC-0003 registra: cuenta creada con `tausa.labs@gmail.com`, dominio
      `somospraxevo.com` verificado en Resend (región `sa-east-1`, `Domain verified`
      2026-08-03 22:30), API key `praxevo-site-contact-form` con permiso `Sending access`
      restringida a ese dominio, configurada como secreto `RESEND_API_KEY` en el proyecto de
      Pages, y prueba real de extremo a extremo con el correo abierto en la bandeja de
      destino. El secreto está inventariado como ACC-0024, por referencia y nunca por valor.
      **Verificado de nuevo el 2026-08-16 por DNS-over-HTTPS**, no heredado del registro:
      `TXT resend._domainkey.somospraxevo.com` (DKIM) presente,
      `MX send.somospraxevo.com` → `10 feedback-smtp.sa-east-1.amazonses.com`,
      `TXT send.somospraxevo.com` → `v=spf1 include:amazonses.com ~all`. El MX de Resend
      quedó sobre el subdominio `send.`, así que **no choca** con el de Cloudflare Email
      Routing en la raíz — el riesgo que ENC-0003 dejó abierto no se materializó.
- [x] **CONFIRMADO el 2026-08-17: el secreto `RESEND_API_KEY` está presente.** Steve abrió el
      dashboard y se leyó con él `praxevo-site` → Settings → Variables and secrets, entorno
      Production: `RESEND_API_KEY` y `TURNSTILE_SECRET_KEY` presentes como secretos, y los dos
      correos como texto con los valores correctos. **Confirmado además por una vía
      independiente**: la bandeja de `somospraxevo@gmail.com` contiene **dos envíos reales del
      formulario** (2026-08-04 y 2026-08-06), de `no-reply@somospraxevo.com` a
      `hola@somospraxevo.com`. No hizo falta ejecutar el gate G2. Cierra **HO-13** de Marca y
      Contenido y la parte (a) de **INS-0023**.
      *Salvedad que se mantiene escrita:* presente no es lo mismo que **válida** del lado de
      Resend — una key revocada se vería idéntica en esa pantalla. No hay indicio de que lo
      esté, y los dos correos entregados lo desmienten en la práctica.

- [x] **`TURNSTILE_SITE_KEY` dejó de ser una variable — 2026-08-17, cierra INS-0011.**
      Ya **no hay que exportar nada** antes del build. La clave vive versionada en
      `src/_data/turnstile.json` y es el valor **por defecto** de `.eleventy.js`.
      Se cambió porque la vía anterior era irrealizable en este proyecto: los secretos de
      Pages son runtime-only, `[vars]` de `wrangler.toml` también es runtime, y como
      `wrangler.toml` es fuente de verdad el dashboard **bloquea** las variables de texto,
      que es donde se configuran las de build. Versionarla no expone nada: el sitekey de
      Turnstile es público por diseño y ya viaja en el HTML del sitio.
      **Lo importante es el cambio de modo de falla:** antes fallaba **abierto** (olvidar
      exportar dejaba el antibot apagado sin ningún síntoma, lo que pasó el 2026-08-06);
      ahora falla **cerrado**. Ver README, sección 4.

## 5. Revisión legal
- [ ] Un abogado debe revisar `src/privacidad.njk` y `src/terminos.njk` antes de publicar —
      son un borrador razonable basado en la Ley 1581 de 2012, no asesoría legal certificada.
- [x] **Garantía y derecho de retracto — construido el 2026-08-16 (handoff HO-7 de Legal y
      Riesgo, ENC-0001).** Texto escrito por Legal y desplegado sin reescribir por Tecnología:
      `src/_includes/partials/garantia.njk`, incluido en `/cursos/` **antes** del CTA (el art.
      46 num. 4 de la Ley 1480 exige informar el retracto antes de la adquisición, no después)
      y en `/terminos/` en su versión larga. Plazo publicado: 15 días calendario, el mismo que
      Academy dejó guardado en Hotmart el 2026-08-16. Verificado sobre el HTML generado y en
      navegador. **Pendiente de desplegar**, mismo gate que el punto 1.
- [x] **Identidad del vendedor (art. 50 lit. a de la Ley 1480) — construida, parcial y
      declarada como parcial.** `src/_includes/partials/identidad-vendedor.njk` publica el
      nombre real del titular. **Falta el número de identificación (INS-0024):** no existe en
      ninguna nota de la vault y publicarlo es una decisión del titular sobre su propio dato
      personal. Mientras no llegue, la plantilla **no imprime nada en su lugar** — ni un guion
      ni la palabra "pendiente".
- [ ] **Confirmar el correo de atención con Cliente (handoff HO-18).** El bloque publica
      `hola@somospraxevo.com`, que existe y funciona, pero la ley exige un canal **atendido**
      con plazos reales (consulta 10 días hábiles, reclamo 15). Que exista lo puede afirmar
      esta área; que alguien lo atienda, no. Configurado en `src/_data/legal.json`, a una
      línea de cambiarlo.
- [ ] **Antes de la primera venta** (Legal y Riesgo, ENC-0001, punto 8): autorización de
      tratamiento en el momento de la compra, política de tratamiento que cubra a los
      compradores de Hotmart —hoy la del sitio solo cubre el formulario de contacto— y canal
      de atención de consultas y reclamos. Los redacta Legal; los publica esta área.

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
