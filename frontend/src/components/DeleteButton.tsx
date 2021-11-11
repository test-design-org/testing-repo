import { DefaultButton } from "@fluentui/react";
import * as React from "react";
import { Variable } from "../models/Types";

type DeleteButtonProps = {
  variableName: string;
  setVariables: React.Dispatch<React.SetStateAction<Variable[]>>;
};

const DeleteButton: React.FunctionComponent<DeleteButtonProps> = ({
  variableName,
  setVariables,
}: DeleteButtonProps) => {
  return (
    <DefaultButton
      text="Delete"
      styles={{
        root: {
          backgroundColor: "#f00",
          color: "#fff",
        },
      }}
      onClick={() =>
        setVariables((variables) =>
          variables.filter((variable) => variable.name !== variableName)
        )
      }
    />
  );
};

export default DeleteButton;
