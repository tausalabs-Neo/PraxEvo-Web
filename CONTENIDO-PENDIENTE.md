# Contenido pendiente antes de publicar

**El sitio ya está publicado y en vivo en https://somospraxevo.com** (Cloudflare Pages, SSL
activo). Sigue siendo funcional para visitar hoy mismo, pero **no debe promocionarse ampliamente**
hasta reemplazar lo siguiente. Todo lo listado aquí aparece también marcado en la página correspondiente con una
nota naranja ("Contenido de ejemplo — pendiente de reemplazo") o un badge "Precio pendiente" /
"Fotos pendientes", para que nadie lo confunda con un dato real.

## 1. Catálogo de PraxEvo Academy (`src/cursos.njk`, sección de Home)
- [ ] Títulos y descripciones reales de cada curso (hoy hay 6 de ejemplo).
- [ ] Precio real de cada curso (se sabe que el precio ancla de lanzamiento es **USD $97**,
      sin bajar de $79, según el manual de marca — pero no hay precios por curso individual).
- [ ] Enlace real de Hotmart para cada curso (el botón "Ver en Hotmart →" no enlaza a nada aún).
- [ ] Miniatura/imagen real de cada curso (hoy es un bloque gris con texto "Miniatura del curso").

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
