import { Interval } from 'interval-arithmetic';
import {
  BoolDTO,
  InputExpression,
  IInput,
  IntervalDTO,
  MissingVariableDTO,
} from './models/dtos';

export const BookStore: IInput[][] = [
  // VIP true && price < 50
  [
    new BoolDTO(InputExpression.BoolTrue, true),
    new IntervalDTO(
      InputExpression.LessThan,
      new Interval().open(-Infinity, 50),
      0.01,
      { lo: true, hi: true },
    ),
    new MissingVariableDTO(),
  ],
  // price >= 50 && VIP false
  [
    new BoolDTO(InputExpression.BoolFalse, false),
    new IntervalDTO(
      InputExpression.GreaterThanOrEqualTo,
      new Interval().halfOpenRight(50, Infinity),
      0.01,
      { lo: false, hi: true },
    ),
    new MissingVariableDTO(),
  ],
  // VIP true && price >= 50
  [
    new BoolDTO(InputExpression.BoolTrue, true),
    new IntervalDTO(
      InputExpression.GreaterThanOrEqualTo,
      new Interval().halfOpenRight(50, Infinity),
      0.01,
      { lo: false, hi: true },
    ),
    new MissingVariableDTO(),
  ],
  // price > 30 && second-hand-price > 60
  [
    new MissingVariableDTO(),
    new IntervalDTO(
      InputExpression.GreaterThan,
      new Interval().open(30, Infinity),
      0.01,
      { lo: true, hi: true },
    ),
    new IntervalDTO(
      InputExpression.GreaterThan,
      new Interval().open(60, Infinity),
      0.01,
      { lo: true, hi: true },
    ),
  ],
];
