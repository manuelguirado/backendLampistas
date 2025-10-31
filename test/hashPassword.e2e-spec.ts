import { hashPassword } from '../src/utils/hash/hashPassword';

describe('hashPassword', () => {
  it('should hash the password correctly', async () => {
    const password = 'mySecurePassword';
    const hashed = await hashPassword(password);

    expect(hashed).not.toBe(password);
    expect(hashed).toMatch(/^\$2[ayb]\$.{56}$/); // bcrypt hash format
  });

  it('should handle empty password', async () => {
    const password = '';
    const hashed = await hashPassword(password);

    expect(hashed).not.toBe(password);
    expect(hashed).toMatch(/^\$2[ayb]\$.{56}$/); // bcrypt hash format
  });

  it('should handle very long password', async () => {
    const password = 'a'.repeat(1000); // 1000 characters long
    const hashed = await hashPassword(password);

    expect(hashed).not.toBe(password);
    expect(hashed).toMatch(/^\$2[ayb]\$.{56}$/); // bcrypt hash format
  });

  it('should produce different hashes for the same password', async () => {
    const password = 'mySecurePassword';
    const hashed1 = await hashPassword(password);
    const hashed2 = await hashPassword(password);

    expect(hashed1).not.toBe(hashed2);
  });
});
