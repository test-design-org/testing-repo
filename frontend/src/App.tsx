import React, { useState } from "react";
import VariableSetter from "./components/VariableSetter";
import { Variable, VariableType } from "./models/Types";

function App() {
  const [variables, setVariables] = useState<Variable[]>(() => {
    const var1: Variable = {
      name: "X",
      type: VariableType.NumberType,
      value: 2,
    };
    const var2: Variable = {
      name: "Txt",
      type: VariableType.BooleanType,
      value: true,
    };
    const var3: Variable = {
      name: "Test",
      type: VariableType.NumberType,
      value: 12354324.3434,
    };

    return [var1, var2, var3];
  });

  return (
    <>
      <VariableSetter variables={variables} setVariables={setVariables} />
    </>
  );
}

export default App;
