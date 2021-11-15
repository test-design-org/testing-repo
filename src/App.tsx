import React, { useState } from "react";
import AllExpressions from "./components/AllExpressions";
import VariableSetter from "./components/VariableSetter";
import {
  Constraint,
  ExpressionType,
  Variable,
  VariableType,
} from "./models/Types";

function App() {
  const [variables, setVariables] = useState<Variable[]>(() => {
    const var1: Variable = {
      name: "X",
      type: VariableType.NumberType,
      precision: 0.2,
    };
    const var2: Variable = {
      name: "Txt",
      type: VariableType.BooleanType,
      precision: undefined,
    };
    const var3: Variable = {
      name: "Test",
      type: VariableType.NumberType,
      precision: 1,
    };

    return [var1, var2, var3];
  });

  const [constraints, setConstraints] = useState<Constraint[][]>([
    [
      {
        variable: variables[0],
        type: ExpressionType.LessThan,
      },
      {
        variable: variables[1],
        type: ExpressionType.EqualTo,
      },
    ],
    [
      {
        variable: variables[0],
        type: ExpressionType.GreaterThan,
      },
      {
        variable: variables[1],
        type: ExpressionType.NotEqualTo,
      },
    ],
  ]);

  return (
    <>
      <VariableSetter variables={variables} setVariables={setVariables} />
      <AllExpressions
        allVariables={variables}
        allConstraints={constraints}
        setConstraints={setConstraints}
      />
    </>
  );
}

export default App;
