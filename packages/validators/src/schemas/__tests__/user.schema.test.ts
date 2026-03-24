import { describe, it, expect } from 'vitest';
import { createUserSchema, updateUserSchema, userSchema } from '../schemas/user.schema.js';

describe('createUserSchema', () => {
  describe('email validation', () => {
    it('accepts valid email', () => {
      const result = createUserSchema.parse({ email: 'user@example.com', name: 'Alice' });
      expect(result.email).toBe('user@example.com');
    });

    it('normalises email to lowercase', () => {
      const result = createUserSchema.parse({ email: 'USER@EXAMPLE.COM', name: 'Alice' });
      expect(result.email).toBe('user@example.com');
    });

    it('trims email whitespace', () => {
      const result = createUserSchema.parse({ email: '  user@example.com  ', name: 'Alice' });
      expect(result.email).toBe('user@example.com');
    });

    it('rejects invalid email format', () => {
      expect(() => createUserSchema.parse({ email: 'not-an-email', name: 'Alice' })).toThrow();
    });

    it('rejects email over 255 characters', () => {
      const longEmail = 'a'.repeat(250) + '@x.com';
      expect(() => createUserSchema.parse({ email: longEmail, name: 'Alice' })).toThrow();
    });
  });

  describe('name validation', () => {
    it('accepts valid name', () => {
      const result = createUserSchema.parse({ email: 'a@b.com', name: 'Alice Smith' });
      expect(result.name).toBe('Alice Smith');
    });

    it('rejects empty name', () => {
      expect(() => createUserSchema.parse({ email: 'a@b.com', name: '' })).toThrow();
    });

    it('rejects name over 100 characters', () => {
      expect(() => createUserSchema.parse({ email: 'a@b.com', name: 'x'.repeat(101) })).toThrow();
    });
  });

  describe('role', () => {
    it('defaults to member when not provided', () => {
      const result = userSchema.parse({
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'a@b.com',
        name: 'Alice',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      expect(result.role).toBe('member');
    });

    it('rejects unknown role', () => {
      expect(() => createUserSchema.parse({ email: 'a@b.com', name: 'Alice', role: 'superadmin' })).toThrow();
    });
  });
});

describe('updateUserSchema', () => {
  it('accepts partial update', () => {
    const result = updateUserSchema.parse({ name: 'New Name' });
    expect(result.name).toBe('New Name');
    expect(result.email).toBeUndefined();
  });

  it('accepts empty object', () => {
    expect(() => updateUserSchema.parse({})).not.toThrow();
  });
});
