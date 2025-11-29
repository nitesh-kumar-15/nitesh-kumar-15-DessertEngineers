import { validateRequestStatus, parseBearer } from '../logic.js';

describe('validateRequestStatus', () => {
  test('valid statuses', () => {
    for (const s of ['pending','approved','declined','completed']) {
      expect(validateRequestStatus(s)).toBe(true);
    }
  });

  test('invalid status', () => {
    expect(validateRequestStatus('weird')).toBe(false);
  });
});

describe('parseBearer', () => {
  test('extracts token', () => {
    expect(parseBearer('Bearer abc123')).toBe('abc123');
  });

  test('returns null when not Bearer', () => {
    expect(parseBearer('Token abc')).toBeNull();
    expect(parseBearer('')).toBeNull();
    expect(parseBearer(null)).toBeNull();
  });
});