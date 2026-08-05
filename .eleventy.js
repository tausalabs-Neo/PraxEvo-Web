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
  // Cloudflare Turnstile "always passes" test key as a safe local/dev default.
  // Set the TURNSTILE_SITE_KEY env var at Cloudflare Pages build time to the real site key.
  eleventyConfig.addGlobalData("turnstileSiteKey", () => process.env.TURNSTILE_SITE_KEY || "1x00000000000000000000AA");

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
