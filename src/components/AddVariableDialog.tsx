import React, { useState } from "react";
import { Label } from "@fluentui/react/lib/Label";
import { TextField } from "@fluentui/react/lib/TextField";
import { useId } from "@fluentui/react-hooks";
import { Dialog, DialogType, DialogFooter } from "@fluentui/react/lib/Dialog";
import { PrimaryButton, DefaultButton } from "@fluentui/react/lib/Button";
import {
  ChoiceGroup,
  IChoiceGroupOption,
} from "@fluentui/react/lib/ChoiceGroup";
import { useBoolean } from "@fluentui/react-hooks";
import { Variable, VariableType } from "../models/Types";

const typeOptions: IChoiceGroupOption[] = [
  { key: "Number", text: "Number" },
  { key: "Boolean", text: "Boolean" },
];
const modelProps = {
  isBlocking: false,
  styles: { main: { maxWidth: 450 } },
};
const dialogContentProps = {
  type: DialogType.largeHeader,
  title: "Add New Variable",
  subText:
    "Please fill out the form and if you are done press Save button. If you don't want add new variable press Cancel button",
};

type AddVariableDialogProps = {
  hideDialog: boolean;
  toggleHideDialog: () => void;
  variables: Variable[];
  setVariables: React.Dispatch<React.SetStateAction<Variable[]>>;
};

export const AddVariableDialog: React.FunctionComponent<AddVariableDialogProps> =
  ({
    hideDialog,
    toggleHideDialog,
    variables,
    setVariables,
  }: AddVariableDialogProps) => {
    const nameTextFieldId = useId("nameInput");
    const precisionTextFieldId = useId("precisionInput");
    const [errorDialog, { toggle: toggleErrorDialog }] = useBoolean(false);
    const [name, setName] = useState<string>("");
    const [precision, setPrecision] = useState<number>(0);
    const [type, setType] = useState<VariableType>(VariableType.NumberType);
    const errorMessage = <Label> Some variables are bad.</Label>;

    return (
      <>
        <Dialog
          hidden={hideDialog}
          onDismiss={toggleHideDialog}
          dialogContentProps={dialogContentProps}
          modalProps={modelProps}
        >
          {errorDialog ? errorMessage : ""}

          <Label required>Set variable name</Label>
          <TextField
            id={nameTextFieldId}
            value={name}
            onChange={(
              event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
              newValue?: string
            ) => {
              setName(newValue!);
            }}
          />

          <ChoiceGroup
            defaultSelectedKey="Number"
            options={typeOptions}
            onChange={(
              ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
              option?: IChoiceGroupOption
            ) => {
              setType(
                option!.key === "Number"
                  ? VariableType.NumberType
                  : VariableType.BooleanType
              );
            }}
          />

          {type === VariableType.NumberType && (
            <>
              <Label required>Set precision</Label>

              <TextField
                id={precisionTextFieldId}
                type="number"
                value={String(precision!)}
                onChange={(
                  event: React.FormEvent<
                    HTMLInputElement | HTMLTextAreaElement
                  >,
                  newValue?: string
                ) => {
                  setPrecision(Number(newValue!));
                }}
              />
            </>
          )}

          <DialogFooter>
            <PrimaryButton
              onClick={() => {
                if (name) {
                  const newVar: Variable = {
                    name: name,
                    type: type,
                    precision:
                      type === VariableType.NumberType ? precision : undefined,
                  };
                  if (variables.some((v) => v.name === newVar.name)) {
                    alert("Variable with this name already exist");
                    return;
                  }
                  setVariables([...variables, newVar]);
                  setType(VariableType.NumberType);
                  toggleHideDialog();
                } else {
                  if (!errorDialog) toggleErrorDialog();
                }
              }}
              text="Save"
            />
            <DefaultButton
              onClick={() => {
                setType(VariableType.NumberType);
                toggleHideDialog();
              }}
              text="Cancel"
            />
          </DialogFooter>
        </Dialog>
      </>
    );
  };
