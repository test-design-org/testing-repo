import IOps, { Interval } from 'interval-arithmetic';

export enum Expression {
    LessThan,
    LessThanOrEqualTo,
    GreaterThan,
    GreaterThanOrEqualTo,
    EqualTo,
    NotEqualTo,
    BoolTrue,
    BoolFalse,
    Interval,
}

export interface IInput {
    expression: Expression;
    intersectsWith(other: IInput): boolean;
    intersect(other: IInput): IInput;
}

export class BoolDTO implements IInput {
    expression: Expression;
    boolVal: boolean;

    constructor(expression: Expression, boolVal: boolean) {
        this.expression = expression;
        this.boolVal = boolVal;
    }

    intersectsWith(other: IInput): boolean {
        if(other instanceof BoolDTO)
            return other.boolVal === this.boolVal;

        return false;
    }

    intersect(other: IInput): IInput {
        if(!this.intersectsWith(other))
            throw new Error(`Cannot intersect types ${this} ${other}`);

        return new BoolDTO(this.expression, this.boolVal);
    }

    toString(): string {
        return `${this.boolVal}`;
    }
}

export class IntervalDTO implements IInput {
    expression: Expression;
    interval: Interval;

    constructor(expression: Expression, interval: Interval) {
        this.expression = expression;
        this.interval = interval;
    }

    intersectsWith(other: IInput): boolean {
        if(other instanceof IntervalDTO)
            return IOps.intervalsOverlap(this.interval, other.interval);

        return false;
    }

    intersect(other: IInput): IInput {
        if(!this.intersectsWith(other))
            throw new Error(`Cannot intersect types ${this} ${other}`);

        const that = other as IntervalDTO;
        return new IntervalDTO(this.expression, IOps.intersection(this.interval, that.interval));
    }

    toString(): string {
        return `${this.interval}`;
    }
}
