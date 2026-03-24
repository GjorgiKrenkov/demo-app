import { describe, expect, it } from 'vitest';

import { apiErrorSchema, idSchema, paginationQuerySchema } from '../common.schema.js';

describe('paginationQuerySchema', () => {
  describe('defaults', () => {
    it('sets page to 1 when not provided', () => {
      const result = paginationQuerySchema.parse({});
      expect(result.page).toBe(1);
    });

    it('sets limit to 20 when not provided', () => {
      const result = paginationQuerySchema.parse({});
      expect(result.limit).toBe(20);
    });

    it('sets sortOrder to desc when not provided', () => {
      const result = paginationQuerySchema.parse({});
      expect(result.sortOrder).toBe('desc');
    });
  });

  describe('validation', () => {
    it('rejects page < 1', () => {
      expect(() => paginationQuerySchema.parse({ page: 0 })).toThrow();
    });

    it('rejects limit > 100', () => {
      expect(() => paginationQuerySchema.parse({ limit: 101 })).toThrow();
    });

    it('coerces string numbers to integers', () => {
      const result = paginationQuerySchema.parse({ page: '3', limit: '10' });
      expect(result.page).toBe(3);
    });
  });
});

describe('idSchema', () => {
  it('accepts valid UUID', () => {
    expect(() => idSchema.parse('550e8400-e29b-41d4-a716-446655440000')).not.toThrow();
  });

  it('rejects non-UUID string', () => {
    expect(() => idSchema.parse('not-a-uuid')).toThrow();
  });

  it('rejects empty string', () => {
    expect(() => idSchema.parse('')).toThrow();
  });
});

describe('apiErrorSchema', () => {
  it('parses valid error object', () => {
    const result = apiErrorSchema.parse({ code: 'NOT_FOUND', message: 'User not found' });
    expect(result.code).toBe('NOT_FOUND');
  });

  it('accepts optional details field', () => {
    const result = apiErrorSchema.parse({
      code: 'BAD_REQUEST',
      message: 'Invalid',
      details: { field: 'email' },
    });
    expect(result.details).toEqual({ field: 'email' });
  });
});
