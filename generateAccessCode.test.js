const { generateAccessCode } = require('./app');

describe('generateAccessCode()', () => {
  it('sollte einen Code der Länge 8 zurückgeben (default)', () => {
    const code = generateAccessCode();
    expect(typeof code).toBe('string');
    expect(code).toHaveLength(8);
  });

  it('sollte einen Code mit benutzerdefinierter Länge zurückgeben', () => {
    const code = generateAccessCode(5);
    expect(code).toHaveLength(5);
  });

  it('sollte sich bei mehreren Aufrufen unterscheiden', () => {
    const code1 = generateAccessCode();
    const code2 = generateAccessCode();
    expect(code1).not.toBe(code2);
  });
});
