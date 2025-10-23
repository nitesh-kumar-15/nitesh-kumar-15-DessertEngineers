import { filterBooks, findListingById } from '../logic.js';

describe('filterBooks (listing found / not found)', () => {
  const rows = [
    { id: '1', title: 'Atomic Habits', author: 'James Clear', tags: ['self-help'] },
    { id: '2', title: 'Clean Code', author: 'Robert C. Martin', tags: ['programming', 'best-practices'] },
    { id: '3', title: 'Educated', author: 'Tara Westover', tags: ['memoir'] },
  ];

  test('empty query returns all', () => {
    expect(filterBooks(rows, '').length).toBe(3);        //  should pass
  });

  test('match by title (case-insensitive) — INTENTIONAL FAIL', () => {
    // Real result should be [rows[0]] for "habit"
    // We intentionally expect the wrong book to force a failure.
    expect(filterBooks(rows, 'habit')).toEqual([rows[1]]); //  will fail
  });

  test('match by author', () => {
    expect(filterBooks(rows, 'martin')).toEqual([rows[1]]); //  should pass
  });

  test('match by tags — INTENTIONAL FAIL', () => {
    // Real result should be [rows[1]] for 'programming'
    // We intentionally expect 2 results to force a failure.
    expect(filterBooks(rows, 'programming').length).toBe(2); //  will fail
  });

  test('not found', () => {
    expect(filterBooks(rows, 'nonexistent')).toEqual([]);  //  should pass
  });
});

describe('findListingById', () => {
  const rows = [{ id: 'a' }, { id: 'b' }];

  test('found', () => {
    expect(findListingById(rows, 'b')).toEqual({ id: 'b' }); //  should pass
  });

  test('not found', () => {
    expect(findListingById(rows, 'x')).toBeNull();           //  should pass
  });
});
