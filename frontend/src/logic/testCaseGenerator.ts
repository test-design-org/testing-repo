import IOps, { Interval } from 'interval-arithmetic';
import { BoolDTO, Expression, IInput, IntervalDTO } from './models/dtos';
import type { NTuple } from './models/ntuple';

export function generateTestCases(inputs: IInput[]): NTuple[] {
    return [];
}

const calculateInOnPatterns1 = (inputs: IInput[]): IInput[] =>
  inputs.map((input) => {
    switch (input.expression) {
      case Expression.LessThan:
      case Expression.LessThanOrEqualTo:
        return InIn(input, 1);

      case Expression.GreaterThan:
      case Expression.GreaterThanOrEqualTo:
        return InIn(input, 2);

      case Expression.NotEqualTo:
        return In(input, 2);

      case Expression.EqualTo:
        return On(input);

      case Expression.BoolTrue:
      case Expression.BoolFalse:
        return input;

      case Expression.Interval:
        return On(input, 2);
    }
  });

const calculateInOnPatterns2 = (inputs: IInput[]): IInput[] =>
  inputs.map((input) => {
    switch (input.expression) {
      case Expression.LessThan:
      case Expression.LessThanOrEqualTo:
        return On(input, 1);

      case Expression.EqualTo:
        return On(input);

      case Expression.GreaterThan:
      case Expression.GreaterThanOrEqualTo:
        return On(input, 2);

      case Expression.NotEqualTo:
        return In(input, 1);

      case Expression.BoolTrue:
      case Expression.BoolFalse:
        return input;

      case Expression.Interval:
        return On(input, 1);
    }
  });

const baseline = (inputs: IInput[]): IInput[] =>
  inputs.map((input) => {
    switch (input.expression) {
      case Expression.LessThan:
      case Expression.LessThanOrEqualTo:
        return In(input, 1);

      case Expression.GreaterThan:
      case Expression.GreaterThanOrEqualTo:
      case Expression.NotEqualTo:
        return In(input, 2);

      case Expression.EqualTo:
        return On(input);

      case Expression.BoolTrue:
      case Expression.BoolFalse:
        return input;

      case Expression.Interval:
        return In(input, 3);
    }
  });

function OffOut(inputs: IInput[]): IInput[][] {
  const output = [];

  for (let i = 0; i < inputs.length; ++i) {
    var based1 = baseline(inputs);
    var based2 = baseline(inputs);

    switch (inputs[i].expression) {
      case Expression.LessThan:
      case Expression.LessThanOrEqualTo:
        based1[i] = Out(inputs[i], 1);
        based2[i] = Off(inputs[i], 1);

        output.push(based1);
        output.push(based2);
        break;

      case Expression.GreaterThan:
      case Expression.GreaterThanOrEqualTo:
        based1[i] = Out(inputs[i], 2);
        based2[i] = Off(inputs[i], 2);

        output.push(based1);
        output.push(based2);
        break;

      case Expression.EqualTo:
        based1[i] = Out(inputs[i], 3);
        based2[i] = Out(inputs[i], 4);

        output.push(based1);
        output.push(based2);
        break;

      case Expression.NotEqualTo:
        based1[i] = Off(inputs[i]);

        output.push(based1);
        break;

      case Expression.BoolTrue:
        based1[i] = new BoolDTO(inputs[i].expression, false);
        output.push(based1);
        break;

      case Expression.BoolFalse:
        based1[i] = new BoolDTO(inputs[i].expression, true);
        output.push(based1);
        break;

      case Expression.Interval:
        var based3 = baseline(inputs);
        var based4 = baseline(inputs);

        based1[i] = Out(inputs[i], 1);
        based2[i] = Out(inputs[i], 2);
        based3[i] = Off(inputs[i], 1);
        based4[i] = Off(inputs[i], 2);

        output.push(based1);
        output.push(based4);
        output.push(based3);
        output.push(based2);
        break;
    }
  }

  return output;
}

function On(input: IInput, version: number = 0): IInput {
    if(!(input instanceof IntervalDTO))
        throw new Error("On's argument must be an IntervalDTO");

    // switch(version) {
    //     case 1:
    //         return new IntervalDTO(
    //             input.expression,
    //             new Interval(
    //                 (input.interval.hi - (input.interval. ? 1 : 0) * input.Precision
    //                 input.Interval.IntervalData.High - (input.Interval.IsOpen.High ? 1 : 0) * input.Precision)
    //             )
    //         )
    // }
    return new BoolDTO(Expression.BoolFalse, true);
}


function InIn(input: IInput, version: number = 0): IInput {
    return new BoolDTO(Expression.BoolFalse, true);
}

function In(input: IInput, version: number = 0): IInput {
    return new BoolDTO(Expression.BoolFalse, true);

}

function Out(input: IInput, version: number = 0): IInput {
    return new BoolDTO(Expression.BoolFalse, true);

}
function Off(input: IInput, version: number = 0): IInput {
    return new BoolDTO(Expression.BoolFalse, true);

}
