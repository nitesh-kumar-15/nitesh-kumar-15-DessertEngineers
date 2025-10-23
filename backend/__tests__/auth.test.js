import { checkLogin } from '../logic.js';

describe('checkLogin (success/fail)', () => {
  const users = [
    { email: 'a@a.com', password: 'p1' },
    { email: 'b@b.com', password: 'p2' },
  ];

  test('login success', () => {
    expect(checkLogin(users, 'a@a.com', 'p1')).toBe(true);
  });

  test('login fail - wrong password', () => {
    expect(checkLogin(users, 'a@a.com', 'nope')).toBe(false);
  });

  test('login fail - no such user', () => {
    expect(checkLogin(users, 'x@x.com', 'p')).toBe(false);
  });

  test('login fail - missing fields', () => {
    expect(checkLogin(users, '', '')).toBe(false);
  });
});
