# PraxEvo — Sitio web

Sitio estático (HTML/CSS/JS, sin build ni dependencias) para PraxEvo Academy y PraxEvo Consulting, con la identidad del [Manual de Marca PraxEvo](https://claude.ai/design/p/afe2c038-99d3-40ce-9aaf-c13874d7f290).

## Estructura

```
index.html            Inicio
nosotros.html          Propósito, audiencia, voz de marca
cursos.html             PraxEvo Academy (enlaza a Hotmart)
consultoria.html        PraxEvo Consulting
blog.html               Artículos de marca
contacto.html           Formulario de contacto
legal/privacidad.html   Política de Tratamiento de Datos Personales (Ley 1581/2012)
legal/terminos.html     Términos y Condiciones (Ley 1480/2011)
legal/cookies.html      Política de Cookies
404.html                Página de error
assets/css/styles.css   Sistema de diseño (colores, tipografías, componentes)
assets/js/main.js       Menú móvil, banner de cookies, validación del formulario
netlify.toml, vercel.json   Cabeceras de seguridad (CSP, HSTS, etc.)
robots.txt, sitemap.xml SEO
```

## Cómo desplegar

Es un sitio 100% estático — no requiere build ni Node.js. Cualquiera de estas opciones funciona:

- **Netlify**: arrastra la carpeta o conecta el repo. Ya incluye `netlify.toml` con cabeceras de seguridad.
- **Vercel**: importa el repo como proyecto estático. Ya incluye `vercel.json` con las mismas cabeceras.
- **GitHub Pages**: sirve el contenido de la raíz directamente (recuerda ajustar `robots.txt`/`sitemap.xml` con el dominio real).

## Antes de publicar — checklist pendiente

### 1. Datos legales (obligatorio)
Reemplaza los placeholders marcados en amarillo/naranja en `legal/privacidad.html` y `legal/terminos.html`:
- `[RAZÓN SOCIAL DE LA EMPRESA]`, `[NIT]`, `[DIRECCIÓN, CIUDAD, COLOMBIA]`, `[EMAIL DE CONTACTO]`, `[TELÉFONO]`, `[FECHA]`, `[CIUDAD]` (jurisdicción).

Recomendado: que un abogado revise ambos documentos antes de publicar, especialmente si PraxEvo ya está constituida como sociedad formal.

### 2. Formulario de contacto (obligatorio para que funcione)
El sitio es estático y **no tiene backend propio**. En `contacto.html`, el `<form>` tiene `action="REEMPLAZAR_ENDPOINT_FORMULARIO"` — mientras no lo cambies, `main.js` bloqueará el envío y mostrará un aviso en pantalla en vez de fallar en silencio. Opciones simples:
- **Netlify Forms**: agrega `data-netlify="true"` al `<form>` y despliega en Netlify (gratis, sin backend propio que mantener).
- **Formspree** (formspree.io): crea un formulario gratuito y usa el endpoint que te den como `action`.
- Backend propio si más adelante necesitas lógica custom.

Si usas un servicio externo, actualiza también el `form-action` de la CSP en `netlify.toml`/`vercel.json` para incluir ese dominio (ya se dejó `formspree.io` como ejemplo).

### 3. Registro de bases de datos (RNBD) ante la SIC
Con formularios básicos de contacto, la mayoría de pymes **no está obligada** a registrarse en el Registro Nacional de Bases de Datos. Aplica principalmente si superan cierto tamaño de activos o manejan bases de más de 10,000 titulares. Revisar con un asesor legal cuando el negocio crezca.

### 4. Analítica / cookies
Si en el futuro agregas Google Analytics u otra herramienta de tracking, cárgala **solo** después de que el usuario acepte el banner de cookies (ver el evento `praxevo:cookie-consent` en `assets/js/main.js`), y añade su dominio a la CSP.

### 5. Dominio propio
Reemplaza `REEMPLAZAR-CON-TU-DOMINIO.com` en `robots.txt` y `sitemap.xml` una vez tengas el dominio definitivo.

## Seguridad ya incluida

- HTTPS forzado vía hosting (Netlify/Vercel lo dan automáticamente).
- Content-Security-Policy estricta (sin `unsafe-inline`), HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy y Permissions-Policy en `netlify.toml`/`vercel.json`.
- Formulario con honeypot anti-spam y validación de campos en el cliente.
- No se recolectan ni almacenan datos de tarjetas/pagos — los cursos se compran en Hotmart.
- Sin dependencias de terceros con acceso a datos salvo las fuentes de Google Fonts (solo CSS, no scripts).
