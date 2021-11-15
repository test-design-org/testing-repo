import { EXPRESSION_TYPES } from "@babel/types";
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
import { Constraint, ExpressionType, Variable } from "../models/Types";
import Expression from "./Expression";

const theme: ITheme = getTheme();
const { palette, semanticColors, fonts } = theme;

const classNames = mergeStyleSets({
  container: {
    overflow: "auto",
    maxHeight: 500,
  },
  itemCell: [
    getFocusStyle(theme, { inset: -1 }),
    {
      minHeight: 54,
      padding: 10,
      boxSizing: "border-box",
      borderBottom: `1px solid ${semanticColors.bodyDivider}`,
      display: "flex",
      selectors: {
        "&:hover": { background: palette.neutralLight },
      },
    },
  ],
  itemImage: {
    flexShrink: 0,
  },
  itemContent: {
    marginLeft: 10,
    overflow: "hidden",
    flexGrow: 1,
  },
  itemName: [
    fonts.xLarge,
    {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
  ],
  itemIndex: {
    fontSize: fonts.small.fontSize,
    color: palette.neutralTertiary,
    marginBottom: 10,
  },
  chevron: {
    alignSelf: "center",
    marginLeft: 10,
    color: palette.neutralTertiary,
    fontSize: fonts.large.fontSize,
    flexShrink: 0,
  },
});

type ExpressionGroupProps = {
  allConstraints: Constraint[][];
  setConstraints: React.Dispatch<React.SetStateAction<Constraint[][]>>;
  allVariables: Variable[];
  constraintGroupId: number;
};

const ExpressionGroup: React.FunctionComponent<ExpressionGroupProps> = ({
  allConstraints,
  setConstraints,
  allVariables,
  constraintGroupId,
}: ExpressionGroupProps) => {
  return (
    <FocusZone direction={FocusZoneDirection.vertical}>
      <button onClick={() => setConstraints(xs => 
        xs.map((ys,i) => 
          i !== constraintGroupId
            ? ys 
            : [...ys, { type: ExpressionType.EqualTo, variable: allVariables[0] }]))}
      >Add Expression</button>
      <div className={classNames.container} data-is-scrollable>
        <List
          items={allConstraints[constraintGroupId]}
          onRenderCell={(item, index) => (
            <>
              {item !== undefined && index !== undefined && (
                <Expression
                  constraintGroupId={constraintGroupId}
                  constraintId={index}
                  allVariables={allVariables}
                  allConstraints={allConstraints}
                  setConstraints={setConstraints}
                />
              )}
            </>
          )}
        />
      </div>
    </FocusZone>
  );
};

export default ExpressionGroup;
