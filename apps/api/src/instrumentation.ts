import * as Sentry from '@sentry/node';

const DSN = process.env['GLITCHTIP_DSN'];

if (DSN) {
  Sentry.init({
    dsn: DSN,
    environment: process.env['NODE_ENV'] ?? 'development',
    tracesSampleRate: process.env['NODE_ENV'] === 'production' ? 0.2 : 1.0,
    integrations: [Sentry.httpIntegration()],
  });
}
