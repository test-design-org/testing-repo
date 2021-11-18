import {
  DefaultButton,
  Dropdown,
  IDropdownOption,
  IDropdownStyles,
  MaskedTextField,
  Stack,
  TextField,
} from "@fluentui/react";
import { Interval, lessThan } from "interval-arithmetic";
import * as React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BoolDTO, IInput, InputExpression, IntervalDTO } from "../logic/models/dtos";
import {
  Constraint,
  ExpressionType,
  toInputExpression,
  Variable,
  VariableType,
} from "../models/Types";
import { replaceAt } from "../utils";

const dropdownStyles: Partial<IDropdownStyles> = {
  dropdown: { width: 300 },
};

type DropdownOption = {
  key: ExpressionType | undefined;
  text: string;
};

function createOperatorItems(
  type: VariableType | undefined
): IDropdownOption<DropdownOption>[] {
  if (type === VariableType.BooleanType)
    return [
      {
        key: ExpressionType.EqualTo,
        text: ExpressionType.EqualTo,
      },
      {
        key: ExpressionType.NotEqualTo,
        text: ExpressionType.NotEqualTo,
      },
    ];
  else if (type === VariableType.NumberType)
    return [
      {
        key: ExpressionType.GreaterThan,
        text: ExpressionType.GreaterThan,
      },
      {
        key: ExpressionType.GreaterThanOrEqualTo,
        text: ExpressionType.GreaterThanOrEqualTo,
      },
      {
        key: ExpressionType.LessThan,
        text: ExpressionType.LessThan,
      },
      {
        key: ExpressionType.LessThanOrEqualTo,
        text: ExpressionType.LessThanOrEqualTo,
      },
      {
        key: ExpressionType.EqualTo,
        text: ExpressionType.EqualTo,
      },
      {
        key: ExpressionType.NotEqualTo,
        text: ExpressionType.NotEqualTo,
      },
      {
        key: "Interval",
        text: "In Interval",
      },
    ];
  else return [];
}

function generatePrefix(
  variable: Variable | undefined,
  operatorType: ExpressionType | undefined
): string {
  if (operatorType === "Interval") {
  } else if (operatorType !== undefined) {
    return variable!.name + " " + operatorType;
  }

  return "";
}

function createDtoWithExpression(dto: IInput, expression: ExpressionType): BoolDTO | IntervalDTO {
  if(dto instanceof BoolDTO)
    return new BoolDTO(toInputExpression(expression), dto.boolVal);

  const intervalDto = dto as IntervalDTO;
  const isOpenMapping = {
    [ExpressionType.LessThan]: { lo: true, hi: true },
    [ExpressionType.LessThanOrEqualTo]: { lo: true, hi: false },
    [ExpressionType.GreaterThan]: { lo: true, hi: true },
    [ExpressionType.GreaterThanOrEqualTo]: { lo: false, hi: true },
    [ExpressionType.EqualTo]: { lo: false, hi: false },
    [ExpressionType.NotEqualTo]: { lo: false, hi: false },
    [ExpressionType.BoolFalse]: intervalDto.isOpen,
    [ExpressionType.BoolTrue]: intervalDto.isOpen,
    [ExpressionType.Interval]: intervalDto.isOpen,
  }
  return new IntervalDTO(
    toInputExpression(expression),
    intervalDto.interval,
    intervalDto.precision,
    isOpenMapping[expression]
  );
}

function updateIntervalDtoUnary(num: number, expression: ExpressionType, dto: IntervalDTO): IntervalDTO {
  switch(expression) {
    case ExpressionType.LessThan:
        return new IntervalDTO(dto.expression, new Interval(-Infinity, num), dto.precision, { lo: true, hi: true });

    case ExpressionType.LessThanOrEqualTo:
        return new IntervalDTO(dto.expression, new Interval(-Infinity, num), dto.precision, { lo: true, hi: false });

    case ExpressionType.GreaterThan:
        return new IntervalDTO(dto.expression, new Interval(num, Infinity), dto.precision, { lo: true, hi: true });

    case ExpressionType.GreaterThanOrEqualTo:
        return new IntervalDTO(dto.expression, new Interval(num, Infinity), dto.precision, { lo: false, hi: true });

    case ExpressionType.EqualTo:
        return new IntervalDTO(dto.expression, new Interval(num, num), dto.precision, { lo: false, hi: false });

    case ExpressionType.NotEqualTo:
        return new IntervalDTO(dto.expression, new Interval(num, num), dto.precision, { lo: false, hi: false });

    default:
      return dto;
  }
}

function updateIntervalDtoBinary(left: number, right: number, dto: IntervalDTO): IntervalDTO {
  // TODO: open and closed
  return new IntervalDTO(dto.expression, new Interval(left, right), dto.precision, { lo: false, hi: false });
}

function getLeftNum(dto: IntervalDTO): number {
  switch(dto.expression) {
    case InputExpression.LessThan:
    case InputExpression.LessThanOrEqualTo:
      return dto.interval.hi;

    case InputExpression.GreaterThanOrEqualTo:
    case InputExpression.EqualTo:
    case InputExpression.NotEqualTo:
    default:
      return dto.interval.lo;
  }
}

function getRightNum(dto: IntervalDTO): number {
  switch(dto.expression) {
    case InputExpression.LessThan:
    case InputExpression.LessThanOrEqualTo:
      return dto.interval.lo;
      
    case InputExpression.GreaterThanOrEqualTo:
    case InputExpression.EqualTo:
    case InputExpression.NotEqualTo:
    default:
      return dto.interval.hi;
  }
}

type ExpressionProps = {
  allConstraints: Constraint[][];
  setConstraints: React.Dispatch<React.SetStateAction<Constraint[][]>>;
  allVariables: Variable[];
  constraintGroupId: number;
  constraintId: number;
};

const Expression: React.FunctionComponent<ExpressionProps> = ({
  allConstraints,
  setConstraints,
  allVariables,
  constraintGroupId,
  constraintId,
}: ExpressionProps) => {
  const constraint = useMemo(
    () => allConstraints[constraintGroupId][constraintId],
    [allConstraints, constraintGroupId, constraintId]
  );

  const setConstraint = useCallback((constraint: Constraint) => {
    setConstraints(xs => replaceAt(xs, constraintGroupId, 
      replaceAt(xs[constraintGroupId], constraintId, constraint)))
  }, [setConstraints, constraintGroupId, constraintId]);

  const [selectedVariable, setSelectedVariable] = useState<
    Variable | undefined
  >(constraint.variable);

  const [selectedOperator, setSelectedOperator] = useState<
    ExpressionType | undefined
  >(constraint.type);
  
  const [prefix, setPrefix] = useState<string>("");

  const variableDropDownItems: IDropdownOption[] = allVariables.map((v) => ({
    key: v.name,
    text: v.name,
    data: v,
  }));
  const operatorDropDownItems: IDropdownOption[] = createOperatorItems(
    selectedVariable ? selectedVariable.type : undefined
  );

  return (
    <Stack>
      <Dropdown
        placeholder="Select a variable"
        label="Select a variable"
        options={variableDropDownItems}
        styles={dropdownStyles}
        defaultSelectedKey={selectedVariable?.name}
        onChange={(
          event: React.FormEvent<HTMLDivElement>,
          option?: IDropdownOption,
          index?: number
        ) => {
          const variable = allVariables[index!];
          setSelectedVariable(variable);
          setSelectedOperator(undefined);

          const expression = variable.type === VariableType.BooleanType
            ? ExpressionType.BoolTrue
            : ExpressionType.LessThan;

          const dto = variable.type === VariableType.BooleanType
            ? new BoolDTO(InputExpression.BoolTrue, true)
            : new IntervalDTO(InputExpression.LessThan, new Interval(0, 10), variable.precision!, { lo: true, hi: true })
          // setConstraints(xs => replaceAt(xs, constraintGroupId, 
          //   replaceAt(xs[constraintGroupId], constraintId, { ...constraint, variable, dto })))
          console.log(dto);
          setConstraint({ ...constraint, variable, dto, type: expression });
        }}
      />

      {selectedVariable !== undefined && constraint.dto instanceof BoolDTO &&
        <Dropdown
        placeholder="Select an Boolean value"
        options={[{ key: 'True', text: 'True' }, { key: 'False', text: 'False' }]}
        styles={dropdownStyles}
        defaultSelectedKey={constraint.dto.boolVal ? 'True' : 'False'}
        onChange={(
          event: React.FormEvent<HTMLDivElement>,
          option?: IDropdownOption<DropdownOption>,
          index?: number
        ) => {
          if (option === undefined) return;

          const type = option.key === 'True' ? ExpressionType.BoolTrue : ExpressionType.BoolFalse;
          const dto = option.key === 'True'
            ? new BoolDTO(InputExpression.BoolTrue, true)
            : new BoolDTO(InputExpression.BoolFalse, false);

          // setConstraints(xs => replaceAt(xs, constraintGroupId, 
          //     replaceAt(xs[constraintGroupId], constraintId, { ...constraint, type, dto })))
          setConstraint({ ...constraint, type, dto });
        }}
      />}


      {selectedVariable !== undefined &&
       constraint.dto instanceof IntervalDTO &&
        <>
          <Dropdown
            placeholder="Select an operator"
            options={operatorDropDownItems}
            styles={dropdownStyles}
            defaultSelectedKey={selectedOperator}
            onChange={(
              event: React.FormEvent<HTMLDivElement>,
              option?: IDropdownOption<DropdownOption>,
              index?: number
              ) => {
                if (option === undefined) return;

                const expression = option.key as ExpressionType;
                const dto = createDtoWithExpression(constraint.dto, expression);

                setSelectedOperator(expression);
                setPrefix(generatePrefix(selectedVariable, selectedOperator));
                // setConstraints(xs => replaceAt(xs, constraintGroupId, 
                //   replaceAt(xs[constraintGroupId], constraintId, { ...constraint, type: expression, dto })))
                setConstraint({ ...constraint, type: expression, dto });
                }}
            />

          <TextField
            prefix={prefix}
            value={getLeftNum(constraint.dto as IntervalDTO).toString()}
            onChange={(_, value) => {
              if(value === undefined) return;

              setConstraint({ ...constraint, dto: updateIntervalDtoUnary(parseFloat(value), constraint.type, constraint.dto as IntervalDTO) });
            }}
          />

        {constraint.dto.expression === InputExpression.Interval &&
          <TextField 
            suffix={"<= " + selectedVariable?.name}
            value={getRightNum(constraint.dto as IntervalDTO).toString()}
            onChange={(_, value) => {
              if(value === undefined) return;

              
              setConstraint({ ...constraint, dto: updateIntervalDtoBinary(
                getLeftNum(constraint.dto as IntervalDTO), 
                parseFloat(value), 
                constraint.dto as IntervalDTO) 
              });
            }}
            />}

       </>}

      
    </Stack>
  );
};

export default Expression;
