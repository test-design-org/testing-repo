import {
  DefaultButton,
  Dropdown,
  IDropdownOption,
  IDropdownStyles,
  MaskedTextField,
  Stack,
  TextField,
} from "@fluentui/react";
import * as React from "react";
import { useMemo, useState } from "react";
import {
  Constraint,
  ExpressionType,
  Variable,
  VariableType,
} from "../models/Types";

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
          setSelectedVariable(allVariables[index!]);
          setSelectedOperator(undefined);
        }}
      />

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
          if (option?.data === undefined) return;
          setSelectedOperator(option.data.key);
          setPrefix(generatePrefix(selectedVariable!, selectedOperator));
        }}
      />

      <TextField
        prefix={prefix}
        readOnly={
          selectedVariable !== undefined &&
          selectedVariable.type === VariableType.BooleanType
        }
      />

      {selectedOperator === "Interval" && (
        <TextField suffix={"<= " + selectedVariable?.name} />
      )}
    </Stack>
  );
};

export default Expression;
