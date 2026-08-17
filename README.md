# Sitio web de PraxEvo (somospraxevo.com)

Sitio estático generado con [Eleventy](https://www.11ty.dev/), pensado para desplegarse en
Cloudflare Pages con una única función serverless (Cloudflare Pages Functions) para el
formulario de contacto.

Antes de publicar, revisa **`CONTENIDO-PENDIENTE.md`** — lista todo el contenido de ejemplo
(cursos, precios, paquetes de consultoría, fotos de fundadores) que debe reemplazarse por datos
reales.

## Desarrollo local

```bash
npm install
npm start        # sirve el sitio en http://localhost:8081 con recarga en vivo
npm run build     # genera el sitio de producción en _site/
```

El formulario de contacto llama a `/api/contact`, que **no** existe en `npm start` (Eleventy no
sirve Functions). Para probar el formulario completo en local, usa Wrangler:

```bash
npm run build
npx wrangler pages dev _site --kv CONTACT_RL
```

y define variables de entorno locales en un archivo `.dev.vars` (no se sube a git):

```
RESEND_API_KEY=tu_api_key_de_resend
TURNSTILE_SECRET_KEY=tu_secret_key_de_turnstile
CONTACT_TO_EMAIL=hola@somospraxevo.com
CONTACT_FROM_EMAIL=PraxEvo <no-reply@somospraxevo.com>
```

## Despliegue a Cloudflare Pages — paso a paso

### 1. Crear el proyecto en Cloudflare (lo haces tú)
1. Crea una cuenta gratuita en [cloudflare.com](https://dash.cloudflare.com/sign-up).
2. En el dashboard: **Workers & Pages → Create → Pages → Upload assets** (no necesitas GitHub;
   subimos directo desde este equipo con Wrangler).
3. Cloudflare te asignará un dominio temporal `*.pages.dev`. Anótalo.

### 2. Apuntar el dominio (lo hago yo, con tu confirmación)
1. Añade `somospraxevo.com` como dominio personalizado del proyecto de Pages en el dashboard de
   Cloudflare — te dará dos nameservers (algo como `xxx.ns.cloudflare.com`).
2. Pásame esos nameservers. Yo actualizo el dominio en Hostinger con
   `mcp__hostinger-domains__domains_updateDomainNameserversV1` (te pido confirmación antes de
   ejecutar el cambio, porque afecta el dominio en producción).
3. La propagación puede tardar hasta 24 h, normalmente es cuestión de minutos.

### 3. Crear el namespace de KV para el rate limiting del formulario
```bash
npx wrangler kv namespace create CONTACT_RL
```
Copia el `id` que devuelve y pégalo en `wrangler.toml`. Luego, en el dashboard del proyecto de
Pages → **Settings → Functions → KV namespace bindings**, agrega el binding `CONTACT_RL` (para
Production y Preview) apuntando a ese namespace.

### 4. Variables de entorno y secretos (dashboard de Pages → Settings → Environment variables)

| Variable | Tipo | Valor |
|---|---|---|
| `RESEND_API_KEY` | Secreto | API key de resend.com (verifica el dominio somospraxevo.com allí primero) |
| `TURNSTILE_SECRET_KEY` | Secreto | Secret key del widget de Turnstile |
| `CONTACT_TO_EMAIL` | Variable, en `wrangler.toml` `[vars]` | `hola@somospraxevo.com` |
| `CONTACT_FROM_EMAIL` | Variable, en `wrangler.toml` `[vars]` | `PraxEvo <no-reply@somospraxevo.com>` (dominio verificado en Resend) |

**Ojo con el dashboard.** Como este proyecto tiene `wrangler.toml`, ese archivo es la fuente de
verdad y el dashboard ya no deja editar variables de texto: solo admite secretos. Los dos correos
de arriba se cambian en `wrangler.toml`, no en la pantalla.

#### `TURNSTILE_SITE_KEY` ya no es una variable — corregido el 2026-08-17

La site key vive versionada en [`src/_data/turnstile.json`](src/_data/turnstile.json) y es el valor
**por defecto** del build. No hay que exportar nada.

Se cambió porque el diseño anterior fallaba abierto: la real llegaba por variable de entorno y el
valor por defecto era la llave de prueba de Cloudflare, la que **siempre aprueba**. Quien olvidara
exportarla publicaba el formulario sin protección real y sin ningún aviso (pasó el 2026-08-06).
Ahora el olvido produce la clave correcta y la de prueba hay que pedirla a propósito:

```bash
TURNSTILE_SITE_KEY=1x00000000000000000000AA npx @11ty/eleventy   # solo para pruebas locales
```

Versionarla no expone nada: según la
[documentación de Turnstile](https://developers.cloudflare.com/turnstile/get-started/) el sitekey es
la *"Public key used to invoke the Turnstile widget on your site"* y ya viaja en el HTML público del
sitio. El que nunca se versiona es `TURNSTILE_SECRET_KEY`, que sigue siendo secreto de Pages.

Y no serviría ponerla en `wrangler.toml`: `[vars]` es binding de **runtime** para Functions, no
variable de build, y los secretos del dashboard también son runtime-only. Eleventy la necesita en
build time.

### 5. Cloudflare Email Routing (para que hola@somospraxevo.com funcione)
1. Dashboard → tu dominio → **Email → Email Routing** → Enable.
2. Crea la regla: `hola@somospraxevo.com` → reenviar a `tausa.labs@gmail.com`.
3. Verifica la dirección de destino (Cloudflare envía un correo de confirmación).

### 6. Desplegar
```bash
npm run build
npx wrangler pages deploy _site --project-name=praxevo-site
```
La primera vez, `wrangler` te pedirá autenticarte (`wrangler login`, abre el navegador). Si
prefieres no autenticar interactivamente en este equipo, genera un API token de Cloudflare
(**My Profile → API Tokens → Create Token**, plantilla "Edit Cloudflare Workers") y expórtalo
como `CLOUDFLARE_API_TOKEN` antes de correr el comando.

## Seguridad implementada

- Cabeceras de seguridad en `public/_headers`: CSP, HSTS, X-Frame-Options, Referrer-Policy,
  Permissions-Policy.
- Formulario de contacto protegido con Cloudflare Turnstile + honeypot + rate limiting por IP
  (Cloudflare KV, 5 solicitudes/hora) — ver `functions/api/contact.js`.
- Validación y sanitización de todos los campos en el servidor (no solo en el navegador).
- Secretos (Resend, Turnstile) solo como variables de entorno de Cloudflare, nunca en el código.
- Sin analítica con cookies por defecto (se recomienda Cloudflare Web Analytics, sin cookies).

**Pendiente de endurecer más adelante:** el CSS usa varios estilos inline (`style="..."`) por
velocidad de desarrollo, lo que obliga a mantener `'unsafe-inline'` en `style-src` dentro de la
CSP. Migrar esos estilos a clases en `styles.css` permitiría quitar `'unsafe-inline'` y dejar
una CSP más estricta.

## Estructura

```
site/
  src/                  # páginas y plantillas (Eleventy + Nunjucks)
  functions/api/contact.js  # Cloudflare Pages Function del formulario
  public/_headers       # cabeceras de seguridad
  public/_redirects      # redirecciones de Cloudflare Pages
  wrangler.toml          # config de KV y Functions
```
