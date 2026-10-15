import { mkdir, readdir, copyFile } from 'node:fs/promises';
import { readFile, writeFile } from 'node:fs/promises';
import { invitation as config } from '../config.js';
const root = new URL('../', import.meta.url);
const output = new URL('dist/', root);
await mkdir(new URL('assets/web/', output), { recursive: true });
await mkdir(new URL('assets/videos/', output), { recursive: true });
for (const name of ['index.html', 'styles.css', 'app.js', 'config.js', 'domain.js']) {
  await copyFile(new URL(name, root), new URL(name, output));
}
for (const name of await readdir(new URL('assets/web/', root))) {
  if (/\.(webp|ttf|woff2|css|svg|jpg)$/.test(name)) await copyFile(new URL(`assets/web/${name}`, root), new URL(`assets/web/${name}`, output));
}
await copyFile(new URL('assets/videos/1.mp4', root), new URL('assets/videos/1.mp4', output));
if (config.publicUrl) {
  const escape = text => text.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
  const url = new URL(config.publicUrl);
  if (url.protocol !== 'https:') throw new Error('publicUrl must use HTTPS.');
  let html = await readFile(new URL('index.html', output), 'utf8');
  html = html.replace('content="assets/web/social-preview.jpg"', `content="${escape(new URL('assets/web/social-preview.jpg', url).href)}"`);
  html = html.replace('</head>', `  <link rel="canonical" href="${escape(url.href)}">\n  <meta property="og:url" content="${escape(url.href)}">\n</head>`);
  await writeFile(new URL('index.html', output), html);
}
console.log('Static website packaged in dist/. No backend or build runtime is required.');
