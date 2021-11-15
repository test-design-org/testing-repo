import {
  DefaultButton,
  FocusZone,
  FocusZoneDirection,
  getFocusStyle,
  getTheme,
  ImageFit,
  ITheme,
  List,
  mergeStyleSets,
} from "@fluentui/react";
import * as React from "react";
import { useState } from "react";
import { Constraint, Variable } from "../models/Types";
import { useId } from "@fluentui/react-hooks";
import Expression from "./Expression";
import ExpressionGroup from "./ExpressionGroup";
import { v4 as uuidv4 } from "uuid";

const theme: ITheme = getTheme();

type AllExpressionsProps = {
  allVariables: Variable[];
  allConstraints: Constraint[][];
  setConstraints: React.Dispatch<React.SetStateAction<Constraint[][]>>;
};

const AllExpressions = ({
  allVariables,
  allConstraints,
  setConstraints,
}: AllExpressionsProps) => {
  return (
    <>
      {allConstraints.map((constraints, index) => (
        <div key={uuidv4()} style={{ boxShadow: theme.effects.elevation8 }}>
          <ExpressionGroup
            allConstraints={allConstraints}
            setConstraints={setConstraints}
            allVariables={allVariables}
            constraintGroupId={index}
          />
        </div>
      ))}
    </>
  );
};

export default AllExpressions;
