import {
  BoolDTO,
  IInput,
  IntervalDTO,
  MissingVariableDTO,
} from './models/dtos';

export function generateTestValue(
  input: IInput,
): number | 'true' | 'false' | '*' {
  if (input instanceof MissingVariableDTO) return '*';

  if (input instanceof BoolDTO) return input.boolVal ? 'true' : 'false';

  const interval = (input as IntervalDTO).interval;
  if (interval.lo === -Infinity) return interval.hi;

  if (interval.hi === Infinity) return interval.lo;

  return interval.lo;
}
