import { createApp } from './app.js';
import './instrumentation.js';

const PORT = Number(process.env['PORT'] ?? 3001);
const HOST = process.env['HOST'] ?? '0.0.0.0';

const startServer = async (): Promise<void> => {
  const app = await createApp();
  await app.listen({ port: PORT, host: HOST });
  console.warn(`API server running at http://${HOST}:${String(PORT)}`);
};

startServer().catch((err: unknown) => {
  console.error('Fatal: failed to start server', err);
  process.exit(1);
});
