// Lokale Vorschau wie auf Cloudflare Pages (saubere URLs, /ordner/ → /ordner/index.html, 404.html)
// Aufruf: node tools/seo/serve.mjs [port]   → http://localhost:8765
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const PORT = Number(process.argv[2] || 8765);
const TYP = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".xml": "application/xml", ".txt": "text/plain; charset=utf-8" };

createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (p.includes("..")) { res.writeHead(400); return res.end(); }
  let f = join(ROOT, p);
  try { if ((await stat(f)).isDirectory()) f = join(f, "index.html"); } catch { if (!extname(f)) f += ".html"; }
  try { const b = await readFile(f); res.writeHead(200, { "Content-Type": TYP[extname(f)] || "application/octet-stream" }); res.end(b); }
  catch { const b = await readFile(join(ROOT, "404.html")).catch(() => "404"); res.writeHead(404, { "Content-Type": TYP[".html"] }); res.end(b); }
}).listen(PORT, () => console.log(`Vorschau: http://localhost:${PORT}`));
