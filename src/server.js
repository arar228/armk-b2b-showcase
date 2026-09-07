import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { catalog } from './catalog.js';
import { searchCatalog } from './search.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const port = Number.parseInt(process.env.PORT ?? '3100', 10);
const staticRoutes = new Map([
  ['/', ['public/index.html', 'text/html; charset=utf-8']],
  ['/app.js', ['public/app.js', 'text/javascript; charset=utf-8']],
  ['/styles.css', ['public/styles.css', 'text/css; charset=utf-8']],
  ['/images/catalog-display.png', ['public/images/catalog-display.png', 'image/png']],
  ['/images/catalog-workspace.png', ['public/images/catalog-workspace.png', 'image/png']],
  ['/images/catalog-network.png', ['public/images/catalog-network.png', 'image/png']],
]);

function applyHeaders(response, contentType) {
  response.setHeader('Content-Type', contentType);
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('Content-Security-Policy', "default-src 'self'; connect-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'");
  response.setHeader('Referrer-Policy', 'no-referrer');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('X-Frame-Options', 'DENY');
}

function sendJson(response, statusCode, payload) {
  applyHeaders(response, 'application/json; charset=utf-8');
  response.statusCode = statusCode;
  response.end(JSON.stringify(payload));
}

const server = createServer(async (request, response) => {
  try {
    if (!request.url || !['GET', 'HEAD'].includes(request.method ?? '')) {
      return sendJson(response, 405, { error: 'Method not allowed' });
    }

    const url = new URL(request.url, 'http://localhost');

    if (url.pathname === '/health') {
      return sendJson(response, 200, { status: 'ok', source: 'synthetic' });
    }

    if (url.pathname === '/api/catalog') {
      const items = searchCatalog(
        catalog,
        url.searchParams.get('q'),
        url.searchParams.get('limit'),
      );
      return sendJson(response, 200, {
        items,
        count: items.length,
        dataClassification: 'synthetic',
      });
    }

    if (url.pathname.startsWith('/api/catalog/')) {
      const id = decodeURIComponent(url.pathname.slice('/api/catalog/'.length));
      const item = catalog.find((candidate) => candidate.id === id);
      return item
        ? sendJson(response, 200, { item, dataClassification: 'synthetic' })
        : sendJson(response, 404, { error: 'Product not found' });
    }

    const staticAsset = staticRoutes.get(url.pathname);
    if (staticAsset) {
      const [relativePath, contentType] = staticAsset;
      const content = await readFile(join(root, relativePath));
      applyHeaders(response, contentType);
      response.statusCode = 200;
      return response.end(request.method === 'HEAD' ? undefined : content);
    }

    return sendJson(response, 404, { error: 'Route not found' });
  } catch {
    return sendJson(response, 400, { error: 'Invalid request' });
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`ARMK B2B Showcase: http://127.0.0.1:${port}`);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
