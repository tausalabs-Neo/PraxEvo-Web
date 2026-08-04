// Cloudflare Pages Function — POST /api/contact
//
// Bindings expected (set in Cloudflare Pages dashboard → Settings → Environment variables / KV):
//   RESEND_API_KEY        (secret)  — api key from resend.com
//   TURNSTILE_SECRET_KEY  (secret)  — secret key from the Turnstile widget
//   CONTACT_TO_EMAIL      (env var) — destination inbox, e.g. hola@somospraxevo.com
//   CONTACT_FROM_EMAIL    (env var) — verified sender, e.g. "PraxEvo <no-reply@somospraxevo.com>"
//   CONTACT_RL            (KV namespace binding) — used for per-IP rate limiting
//
// Only POST is handled; Cloudflare Pages returns 405 automatically for any other method
// on this route because no other onRequest* export exists here.

const MAX_BODY_BYTES = 20_000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const RATE_LIMIT_WINDOW_SECONDS = 60 * 60; // 1 hour

const FIELD_LIMITS = {
  nombre: 120,
  empresa: 160,
  correo: 200,
  interes: 60,
  mensaje: 5000,
  website: 200 // honeypot
};

const ALLOWED_INTERESTS = new Set([
  "Un curso de la Academy",
  "Consultoría para mi empresa",
  "Otro"
]);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function jsonResponse(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" }
  });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Strip control/newline characters from single-line fields (defense in depth).
function cleanLine(value, maxLen) {
  return String(value ?? "")
    .replace(/[\r\n\t\0]/g, " ")
    .trim()
    .slice(0, maxLen);
}

async function verifyTurnstile(token, secretKey, ip) {
  if (!token) return false;
  const form = new URLSearchParams();
  form.append("secret", secretKey);
  form.append("response", token);
  if (ip) form.append("remoteip", ip);

  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: form
  });
  if (!res.ok) return false;
  const data = await res.json().catch(() => ({}));
  return data.success === true;
}

async function checkRateLimit(kv, ip) {
  if (!kv) return true; // fail-open if KV isn't bound yet (e.g. first deploy)
  const key = `rl:${ip}`;
  const now = Math.floor(Date.now() / 1000);
  const raw = await kv.get(key);
  let record = raw ? JSON.parse(raw) : { count: 0, resetAt: now + RATE_LIMIT_WINDOW_SECONDS };

  if (now > record.resetAt) {
    record = { count: 0, resetAt: now + RATE_LIMIT_WINDOW_SECONDS };
  }

  record.count += 1;
  const allowed = record.count <= RATE_LIMIT_MAX_REQUESTS;
  const ttl = Math.max(record.resetAt - now, 60);
  await kv.put(key, JSON.stringify(record), { expirationTtl: ttl });
  return allowed;
}

export async function onRequestPost({ request, env }) {
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_BODY_BYTES) {
    return jsonResponse(413, { ok: false, error: "Solicitud demasiado grande." });
  }

  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return jsonResponse(400, { ok: false, error: "Tipo de contenido inválido." });
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse(400, { ok: false, error: "JSON inválido." });
  }

  // Honeypot: bots that fill hidden fields get a fake success, no email sent.
  const honeypot = cleanLine(payload.website, FIELD_LIMITS.website);
  if (honeypot !== "") {
    return jsonResponse(200, { ok: true });
  }

  const allowed = await checkRateLimit(env.CONTACT_RL, ip);
  if (!allowed) {
    return jsonResponse(429, { ok: false, error: "Demasiadas solicitudes. Intenta de nuevo más tarde." });
  }

  const turnstileToken = payload["cf-turnstile-response"];
  const turnstileOk = await verifyTurnstile(turnstileToken, env.TURNSTILE_SECRET_KEY, ip);
  if (!turnstileOk) {
    return jsonResponse(400, { ok: false, error: "Verificación anti-spam fallida. Intenta de nuevo." });
  }

  const nombre = cleanLine(payload.nombre, FIELD_LIMITS.nombre);
  const empresa = cleanLine(payload.empresa, FIELD_LIMITS.empresa);
  const correo = cleanLine(payload.correo, FIELD_LIMITS.correo);
  let interes = cleanLine(payload.interes, FIELD_LIMITS.interes);
  const mensaje = cleanLine(payload.mensaje, FIELD_LIMITS.mensaje);

  if (!nombre || !correo || !mensaje) {
    return jsonResponse(400, { ok: false, error: "Nombre, correo y mensaje son obligatorios." });
  }
  if (payload.consiento !== "on") {
    return jsonResponse(400, { ok: false, error: "Debes autorizar el tratamiento de tus datos personales para continuar." });
  }
  if (!EMAIL_RE.test(correo)) {
    return jsonResponse(400, { ok: false, error: "El correo no tiene un formato válido." });
  }
  if (!ALLOWED_INTERESTS.has(interes)) {
    interes = "Otro";
  }

  const html = `
    <div style="font-family:Arial,sans-serif;font-size:14px;color:#0D2B4E;">
      <h2 style="color:#0D2B4E;">Nuevo mensaje de contacto — PraxEvo</h2>
      <p><strong>Nombre:</strong> ${escapeHtml(nombre)}</p>
      <p><strong>Empresa:</strong> ${escapeHtml(empresa || "—")}</p>
      <p><strong>Correo:</strong> ${escapeHtml(correo)}</p>
      <p><strong>Interés:</strong> ${escapeHtml(interes)}</p>
      <p><strong>Mensaje:</strong></p>
      <p style="white-space:pre-wrap;">${escapeHtml(mensaje)}</p>
    </div>
  `;

  try {
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: env.CONTACT_FROM_EMAIL,
        to: [env.CONTACT_TO_EMAIL],
        reply_to: correo,
        subject: `Nuevo contacto — ${interes}`,
        html
      })
    });

    if (!resendRes.ok) {
      return jsonResponse(502, { ok: false, error: "No pudimos enviar tu mensaje. Intenta de nuevo más tarde." });
    }
  } catch {
    return jsonResponse(502, { ok: false, error: "No pudimos enviar tu mensaje. Intenta de nuevo más tarde." });
  }

  return jsonResponse(200, { ok: true });
}
