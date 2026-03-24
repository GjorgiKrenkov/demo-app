/**
 * @module @demo-app/validators
 *
 * SINGLE SOURCE OF TRUTH for all domain models, Zod schemas, and inferred types.
 * Import from this package in BOTH frontend and backend to ensure consistency.
 *
 * Usage:
 *   import { userSchema, type User } from '@demo-app/validators';
 *   import { createUserSchema } from '@demo-app/validators/user';
 */
export * from './schemas/common.schema.js';
export * from './schemas/user.schema.js';
