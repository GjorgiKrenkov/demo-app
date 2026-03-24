import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@demo-app/api/router';

export const trpc = createTRPCReact<AppRouter>();
