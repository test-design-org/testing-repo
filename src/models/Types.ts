export enum VariableType {
  NumberType = "Number",
  BooleanType = "Boolean",
}

export interface Variable {
  name: string;
  type: VariableType;
  value: number | boolean;
}

export enum RelationalOperator {
  LessThan = "<",
  LessThanEquals = "<=",
  GreaterThan = ">",
  GreaterThanEquals = ">=",
}

export interface UnaryNumberConstraint {
  value: number;
  operator: RelationalOperator;
}

export interface BinaryNumberConstraint {
  low: UnaryNumberConstraint;
  high: UnaryNumberConstraint;
}

export enum EqualityOperator {
  Equals = "=",
  NotEquals = "!=",
}

export interface EqualityConstraint<T = number | boolean> {
  value: T;
  operator: EqualityOperator;
}

export interface Constraint<T = number | boolean> {
  variable: Variable;
  type: BinaryNumberConstraint | UnaryNumberConstraint | EqualityConstraint<T>;
}
