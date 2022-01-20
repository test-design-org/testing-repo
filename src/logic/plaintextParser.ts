import { zip } from 'fp-ts/lib/Array';
import { Interval } from 'interval-arithmetic';
import {
  BoolDTO,
  Expression,
  IInput,
  IntervalDTO,
  MissingVariableDTO,
} from './models/dtos';
import { createUnaryIntervalDTO, expressionFromString } from './models/utils';

export class BoolVariable {
  constructor(public name: string) {}
}

export class NumberVariable {
  constructor(public name: string, public precision: number) {}
}

export type Variable = BoolVariable | NumberVariable;

export function parseVariable(varString: string): Variable {
  const boolRegex = /^(.*)\(bool\)$/;
  const intRegex = /^(.*)\(int\)$/;
  const numberRegex = /^(.*)\(num(,([\d.]+))?\)$/;

  const intRegexMatch = intRegex.exec(varString);
  if (intRegexMatch !== null) {
    return new NumberVariable(intRegexMatch[1], 1);
  }

  const boolRegexMatch = boolRegex.exec(varString);
  if (boolRegexMatch !== null) {
    return new BoolVariable(boolRegexMatch[1]);
  }

  const numberRegexMatch = numberRegex.exec(varString);
  if (numberRegexMatch !== null) {
    return new NumberVariable(
      numberRegexMatch[1],
      parseFloat(numberRegexMatch[3] ?? 0.01),
    );
  }

  throw new Error(`Can't parse variable from '${varString}'`);
}

export function parseTestCase(variable: Variable, rawTestCase: string): IInput {
  const missingVariableRegex = /\*/;
  const boolRegex = /^(true|false)$/;
  const unaryOperatorRegex = /^(<|<=|>|>=|=|!=)(-?[\d.]+)$/;
  const intervalRegex = /(\(|\[)(-?\d[\d.]*),(-?\d[\d.]*)(\)|\])/;

  if (missingVariableRegex.test(rawTestCase)) {
    return new MissingVariableDTO();
  }

  const boolRegexMatch = boolRegex.exec(rawTestCase);
  if (boolRegexMatch !== null) {
    if (!(variable instanceof BoolVariable))
      throw new Error('Can only create a BoolDTO if the variable is a Boolean');

    if (boolRegexMatch[1] === 'true')
      return new BoolDTO(Expression.BoolTrue, true);

    return new BoolDTO(Expression.BoolFalse, false);
  }

  const unaryOperatorRegexMatch = unaryOperatorRegex.exec(rawTestCase);
  if (unaryOperatorRegexMatch !== null) {
    if (!(variable instanceof NumberVariable))
      throw new Error(
        'Can only create an IntervalDTO if the variable is a Number',
      );

    const expression = expressionFromString(unaryOperatorRegexMatch[1]);
    const number = parseFloat(unaryOperatorRegexMatch[2]);
    return createUnaryIntervalDTO(expression, number, variable.precision);
  }

  const intervalRegexMatch = intervalRegex.exec(rawTestCase);
  if (intervalRegexMatch !== null) {
    if (!(variable instanceof NumberVariable))
      throw new Error(
        'Can only create an IntervalDTO if the variable is a Number',
      );

    const isOpen = {
      lo: intervalRegexMatch[1] === '(',
      hi: intervalRegexMatch[4] === ')',
    };
    const lo = parseFloat(intervalRegexMatch[2]);
    const hi = parseFloat(intervalRegexMatch[3]);

    return new IntervalDTO(
      Expression.Interval,
      new Interval(lo, hi),
      variable.precision,
      isOpen,
    );
  }

  throw Error(`Cannot parse test case from '${rawTestCase}'`);
}

export function parseTestCases(variables: Variable[], line: string): IInput[] {
  const rawTestCasesWithVariables = zip(
    variables,
    line.split(';').map((x) => x.trim()),
  );

  const inputs = rawTestCasesWithVariables.map(([variable, rawTestCase]) =>
    parseTestCase(variable, rawTestCase),
  );

  return inputs;
}

export function parseInput(input: string): [Variable[], IInput[][]] {
  const lines = input
    .trim()
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => !line.startsWith('//') && line !== '');

  const variables = lines[0]
    .split(';')
    .map((x) => x.trim())
    .map(parseVariable);

  const testCases = lines.slice(1);

  const inputs = testCases.map((x) => parseTestCases(variables, x));

  return [variables, inputs];
}
