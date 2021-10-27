enum VariableType {
    NumberType, BooleanType
}

interface Variable {
    name: string;
    type: VariableType;
}

enum RelationalOperator {
    LessThan = "<", 
    LessThanEquals = "<=",
    GreaterThan = ">",
    GreaterThanEquals = ">=",
}

interface UnaryNumberConstraint {
    value: number;
    operator: RelationalOperator;
}

interface BinaryNumberConstraint {
    low: UnaryNumberConstraint;
    high: UnaryNumberConstraint;
}

enum EqualityOperator {
    Equals = "=",
    NotEquals = "!=",
}

interface EqualityConstraint<T = number | boolean> {
    value: T;
    operator: EqualityOperator;
}

interface Constraint<T = number | boolean> {
    variable: Variable;
    type: BinaryNumberConstraint | UnaryNumberConstraint | EqualityConstraint<T>;
}
