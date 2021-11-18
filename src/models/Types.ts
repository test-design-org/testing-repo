import { BoolDTO, InputExpression, IntervalDTO } from '../logic/models/dtos';

export enum VariableType {
  NumberType = "Number",
  BooleanType = "Boolean",
}

export interface Variable {
  name: string;
  type: VariableType;
  precision: number | undefined;
}

export enum ExpressionType {
  LessThan = "<",
  LessThanOrEqualTo = "<=",
  GreaterThan = ">",
  GreaterThanOrEqualTo = ">=",
  EqualTo = "=",
  NotEqualTo = "!=",
  BoolTrue = "True",
  BoolFalse = "False",
  Interval = "Interval",
}

export function toInputExpression(expr: ExpressionType): InputExpression {
  const mapping = {
    [ExpressionType.LessThan]: InputExpression.LessThan,
    [ExpressionType.LessThanOrEqualTo]: InputExpression.LessThanOrEqualTo,
    [ExpressionType.GreaterThan]: InputExpression.GreaterThan,
    [ExpressionType.GreaterThanOrEqualTo]: InputExpression.GreaterThanOrEqualTo,
    [ExpressionType.EqualTo]: InputExpression.EqualTo,
    [ExpressionType.NotEqualTo]: InputExpression.NotEqualTo,
    [ExpressionType.BoolTrue]: InputExpression.BoolTrue,
    [ExpressionType.BoolFalse]: InputExpression.BoolFalse,
    [ExpressionType.Interval]: InputExpression.Interval,
  }

  return mapping[expr];
}

export interface Constraint {
  variable: Variable;
  type: ExpressionType;
  dto: BoolDTO | IntervalDTO;
}
