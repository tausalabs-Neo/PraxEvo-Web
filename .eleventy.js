const turnstile = require("./src/_data/turnstile.json");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets/css": "assets/css" });
  eleventyConfig.addPassthroughCopy({ "src/assets/js": "assets/js" });
  eleventyConfig.addPassthroughCopy({ "src/assets/img": "assets/img" });
  eleventyConfig.addPassthroughCopy({ "public/_headers": "_headers" });
  eleventyConfig.addPassthroughCopy({ "public/_redirects": "_redirects" });

  eleventyConfig.addGlobalData("currentYear", () => new Date().getFullYear());
  // Cache-busting query param for /assets/* (which is served with a 1-year immutable
  // Cache-Control header, see public/_headers). Bump automatically on every build so
  // browsers that already cached an old asset under the same filename fetch the new one.
  eleventyConfig.addGlobalData("assetVersion", () => Date.now());
  // Site key REAL de Turnstile por defecto, versionada en src/_data/turnstile.json.
  // Es una clave PÚBLICA por diseño (docs de Cloudflare Turnstile): va en el HTML del sitio,
  // así que versionarla no expone nada. El secret key NO está aquí ni en el repo.
  //
  // Antes el valor por defecto era la llave de prueba "always passes" y la real llegaba por
  // la variable de entorno TURNSTILE_SITE_KEY. Ese diseño falla abierto: si quien construye
  // olvida exportarla, el sitio sale a producción con el widget que aprueba todo y nadie se
  // entera (pasó el 2026-08-06, regresión de INS-0011). Ahora el olvido produce la clave
  // correcta, y la de prueba hay que pedirla a propósito:
  //   TURNSTILE_SITE_KEY=1x00000000000000000000AA npx @11ty/eleventy
  eleventyConfig.addGlobalData("turnstileSiteKey", () => process.env.TURNSTILE_SITE_KEY || turnstile.siteKey);

  eleventyConfig.setServerOptions({
    port: 8081
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "_site"
    },
    templateFormats: ["njk", "md", "txt"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};
