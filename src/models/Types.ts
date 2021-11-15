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

export interface Constraint {
  variable: Variable;
  type: ExpressionType;
}
