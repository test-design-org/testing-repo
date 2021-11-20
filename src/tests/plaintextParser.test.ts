import {
  BoolDTO,
  Expression,
  IntervalDTO,
  MissingVariableDTO,
} from '../logic/models/dtos';
import {
  BoolVariable,
  NumberVariable,
  parseInput,
  parseTestCase,
  parseVariable,
} from '../logic/plaintextParser';

describe('parseVariable', () => {
  it('parses a boolVariable', () => {
    const result = parseVariable('varName(boolean)');

    expect(result).toBeInstanceOf(BoolVariable);
    expect(result.name).toBe('varName');
  });

  it('parses a numberVariable with int precision', () => {
    const result = parseVariable('x(number,1)');

    expect(result).toBeInstanceOf(NumberVariable);
    expect(result).toEqual({ name: 'x', precision: 1 });
  });

  it('parses a numberVariable with float precision', () => {
    const result = parseVariable('x(number,0.01)');

    expect(result).toBeInstanceOf(NumberVariable);
    expect(result).toEqual({ name: 'x', precision: 0.01 });
  });

  it('throws an error on undefined pattern', () => {
    const testCases = [
      'x(number,0.01,)',
      'x(number,)',
      'x(number)',
      'asd',
      'asd()',
      'asd(boolean,)',
      'asd(bool,)',
      'asd(bool)',
    ];

    for (const testCase of testCases) {
      expect(() => parseVariable(testCase)).toThrow(Error);
    }
  });
});

describe('parseTestCase', () => {
  describe('bool test case', () => {
    it('should parse true', () => {
      const result = parseTestCase(new BoolVariable('x'), 'true');

      expect(result).toBeInstanceOf(BoolDTO);
      const dto = result as BoolDTO;
      expect(dto.boolVal).toBe(true);
      expect(dto.expression).toBe(Expression.BoolTrue);
    });

    it('should parse false', () => {
      const result = parseTestCase(new BoolVariable('x'), 'false');

      expect(result).toBeInstanceOf(BoolDTO);
      const dto = result as BoolDTO;
      expect(dto.boolVal).toBe(false);
      expect(dto.expression).toBe(Expression.BoolFalse);
    });

    it('should throw on variable mismatch', () => {
      expect(() =>
        parseTestCase(new NumberVariable('x', 1), 'false'),
      ).toThrowError();
      expect(() =>
        parseTestCase(new NumberVariable('x', 1), 'true'),
      ).toThrowError();
    });
  });

  describe('unary operator case', () => {
    it('should parse <', () => {
      const result = parseTestCase(new NumberVariable('x', 0.1), '<30');

      expect(result).toBeInstanceOf(IntervalDTO);
      const dto = result as IntervalDTO;
      expect(dto.expression).toBe(Expression.LessThan);
      expect(dto.interval.lo).toBe(-Infinity);
      expect(dto.interval.hi).toBe(30);
      expect(dto.isOpen).toEqual({ lo: true, hi: true });
    });

    it('should parse <=', () => {
      const result = parseTestCase(new NumberVariable('x', 0.1), '<=30');

      expect(result).toBeInstanceOf(IntervalDTO);
      const dto = result as IntervalDTO;
      expect(dto.expression).toBe(Expression.LessThanOrEqualTo);
      expect(dto.interval.lo).toBe(-Infinity);
      expect(dto.interval.hi).toBe(30);
      expect(dto.isOpen).toEqual({ lo: true, hi: false });
    });

    it('should parse >', () => {
      const result = parseTestCase(new NumberVariable('x', 0.1), '>30');

      expect(result).toBeInstanceOf(IntervalDTO);
      const dto = result as IntervalDTO;
      expect(dto.expression).toBe(Expression.GreaterThan);
      expect(dto.interval.lo).toBe(30);
      expect(dto.interval.hi).toBe(Infinity);
      expect(dto.isOpen).toEqual({ lo: true, hi: true });
    });

    it('should parse >=', () => {
      const result = parseTestCase(new NumberVariable('x', 0.1), '>=30');

      expect(result).toBeInstanceOf(IntervalDTO);
      const dto = result as IntervalDTO;
      expect(dto.expression).toBe(Expression.GreaterThanOrEqualTo);
      expect(dto.interval.lo).toBe(30);
      expect(dto.interval.hi).toBe(Infinity);
      expect(dto.isOpen).toEqual({ lo: false, hi: true });
    });

    it('should parse =', () => {
      const result = parseTestCase(new NumberVariable('x', 0.1), '=30');

      expect(result).toBeInstanceOf(IntervalDTO);
      const dto = result as IntervalDTO;
      expect(dto.expression).toBe(Expression.EqualTo);
      expect(dto.interval.lo).toBe(30);
      expect(dto.interval.hi).toBe(30);
      expect(dto.isOpen).toEqual({ lo: false, hi: false });
    });

    it('should parse !=', () => {
      const result = parseTestCase(new NumberVariable('x', 0.1), '!=30');

      expect(result).toBeInstanceOf(IntervalDTO);
      const dto = result as IntervalDTO;
      expect(dto.expression).toBe(Expression.NotEqualTo);
      expect(dto.interval.lo).toBe(30);
      expect(dto.interval.hi).toBe(30);
      expect(dto.isOpen).toEqual({ lo: false, hi: false });
    });
  });

  describe('interval case', () => {
    it('should parse (10,22.3]', () => {
      const result = parseTestCase(new NumberVariable('x', 0.1), '(10,22.3]');

      expect(result).toBeInstanceOf(IntervalDTO);
      const dto = result as IntervalDTO;
      expect(dto.expression).toBe(Expression.Interval);
      expect(dto.interval.lo).toBe(10);
      expect(dto.interval.hi).toBe(22.3);
      expect(dto.isOpen).toEqual({ lo: true, hi: false });
    });

    it('should parse [10.12,22)', () => {
      const result = parseTestCase(new NumberVariable('x', 0.1), '[10.12,22)');

      expect(result).toBeInstanceOf(IntervalDTO);
      const dto = result as IntervalDTO;
      expect(dto.expression).toBe(Expression.Interval);
      expect(dto.interval.lo).toBe(10.12);
      expect(dto.interval.hi).toBe(22);
      expect(dto.isOpen).toEqual({ lo: false, hi: true });
    });
  });

  describe('wrong input', () => {
    it('should throw error on wrong input', () => {
      expect(() =>
        parseTestCase(new BoolVariable('x'), 'adsqwe'),
      ).toThrowError();
      expect(() =>
        parseTestCase(new NumberVariable('x', 1), '>='),
      ).toThrowError();
      expect(() =>
        parseTestCase(new NumberVariable('x', 1), '>=asd'),
      ).toThrowError();
      expect(() =>
        parseTestCase(new NumberVariable('x', 1), '>=56asd'),
      ).toThrowError();
      expect(() =>
        parseTestCase(new NumberVariable('x', 1), '>=56asd'),
      ).toThrowError();
      expect(() =>
        parseTestCase(new NumberVariable('x', 1), '56>=56'),
      ).toThrowError();
      expect(() =>
        parseTestCase(new NumberVariable('x', 1), '56='),
      ).toThrowError();
      expect(() =>
        parseTestCase(new NumberVariable('x', 1), '56'),
      ).toThrowError();
    });
  });
});

describe('parseInput', () => {
  it('should parse the input correctly', () => {
    const testInput = `
      VIP(boolean);price(number,1);second_hand_price(number,0.2)
      true;<50;*
      *;>30;<=60
      `;

    const result = parseInput(testInput);

    expect(result.length).toBe(2);

    const firstCase = result[0];

    expect(firstCase[0]).toBeInstanceOf(BoolDTO);
    expect(firstCase[0]).toEqual({
      expression: Expression.BoolTrue,
      boolVal: true,
    });

    expect(firstCase[1]).toBeInstanceOf(IntervalDTO);
    const interval1 = firstCase[1] as IntervalDTO;
    expect(interval1.expression).toBe(Expression.LessThan);
    expect(interval1.interval.lo).toBe(-Infinity);
    expect(interval1.interval.hi).toBe(50);
    expect(interval1.isOpen).toEqual({ lo: true, hi: true });

    expect(firstCase[2]).toBeInstanceOf(MissingVariableDTO);

    const secondCase = result[1];
    expect(secondCase[0]).toBeInstanceOf(MissingVariableDTO);

    expect(secondCase[1]).toBeInstanceOf(IntervalDTO);
    const interval2 = secondCase[1] as IntervalDTO;
    expect(interval2.expression).toBe(Expression.GreaterThan);
    expect(interval2.interval.lo).toBe(30);
    expect(interval2.interval.hi).toBe(Infinity);
    expect(interval2.isOpen).toEqual({ lo: true, hi: true });

    expect(secondCase[2]).toBeInstanceOf(IntervalDTO);
    const interval3 = secondCase[2] as IntervalDTO;
    expect(interval3.expression).toBe(Expression.LessThanOrEqualTo);
    expect(interval3.interval.lo).toBe(-Infinity);
    expect(interval3.interval.hi).toBe(60);
    expect(interval3.isOpen).toEqual({ lo: true, hi: false });
  });
});

export {};
