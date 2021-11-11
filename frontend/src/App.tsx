<<<<<<< HEAD
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

=======
import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import logo from './logo.png';
import './App.css';
import { Interval } from 'interval-arithmetic';

function App() {
  // Create the count state.
  const [count, setCount] = useState(0);
  // Create the counter (+1 every second).
  useEffect(() => {
    const timer = setTimeout(() => setCount(count + 1), 1000);
    return () => clearTimeout(timer);
  }, [count, setCount]);

  useEffect(() => {
    console.log(new Interval(1,2));
  }, []);

  // Return the App component.
>>>>>>> a54b098... Start working on logic in frontend
  return (
    <>
      <VariableSetter variables={variables} setVariables={setVariables} />
    </>
  );
}

export default App;
