import add from '@src/math/add';

describe('Test math functions', () => {
  it('should pass', () => {
    expect(add(1, 2)).toBe(3);
  });
});
