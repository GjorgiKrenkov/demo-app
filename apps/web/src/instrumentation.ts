import * as Sentry from '@sentry/react';

const DSN = import.meta.env['VITE_GLITCHTIP_DSN'] as string | undefined;

if (DSN) {
  Sentry.init({
    dsn: DSN,
    environment: import.meta.env.MODE,
    tracesSampleRate: import.meta.env.PROD ? 0.2 : 1.0,
    integrations: [Sentry.browserTracingIntegration()],
  });
}
