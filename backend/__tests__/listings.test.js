import { canEditListing, canRequestBook } from '../logic.js';

describe('canEditListing (owner check)', () => {
  const book = { id: '1', ownerId: 'u1' };

  test('owner can edit', () => {
    expect(canEditListing(book, 'u1')).toBe(true);
  });

  test('non-owner cannot edit', () => {
    expect(canEditListing(book, 'u2')).toBe(false);
  });

  test('missing inputs -> false', () => {
    expect(canEditListing(null, 'u1')).toBe(false);
    expect(canEditListing(book, null)).toBe(false);
  });
});

describe('canRequestBook (cannot request own book)', () => {
  const book = { id: '1', ownerId: 'u1' };

  test('different user can request', () => {
    expect(canRequestBook(book, 'u2')).toBe(true);
  });

  test('owner cannot request', () => {
    expect(canRequestBook(book, 'u1')).toBe(false);
  });

  test('missing inputs -> false', () => {
    expect(canRequestBook(null, 'u1')).toBe(false);
    expect(canRequestBook(book, null)).toBe(false);
  });
});