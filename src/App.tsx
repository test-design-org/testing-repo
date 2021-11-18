import { Interval } from "interval-arithmetic";
import React, { useCallback, useEffect, useState } from "react";
import AllExpressions from "./components/AllExpressions";
import VariableSetter from "./components/VariableSetter";
import { runLeastLosingComponents } from "./logic/algotithms/leastLosingComponents";
import { runLeastLosingNodesReachable } from "./logic/algotithms/leastLosingNodesReachable";
import { runMONKE } from "./logic/algotithms/MONKE";
import { Graph } from "./logic/graph";
import { createGraphUrl, generateGraph } from "./logic/graphGenerator";
import { BoolDTO, InputExpression, IntervalDTO } from "./logic/models/dtos";
import {
  Constraint,
  ExpressionType,
  Variable,
  VariableType,
} from "./models/Types";

interface Graphs {
  original: Graph;
  MONKE: Graph;
  leastComponents: Graph,
  leastNodes: Graph;
}

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
        dto: new IntervalDTO(InputExpression.LessThan, new Interval(-Infinity, 3), variables[0].precision!, { lo: true, hi: true })
      },
      {
        variable: variables[1],
        type: ExpressionType.BoolTrue,
        dto: new BoolDTO(InputExpression.BoolTrue, true)
      },
    ],
    [
      {
        variable: variables[0],
        type: ExpressionType.GreaterThan,
        dto: new IntervalDTO(InputExpression.GreaterThan, new Interval(4, Infinity), variables[0].precision!, { lo: true, hi: true })
      },
      {
        variable: variables[1],
        type: ExpressionType.BoolFalse,
        dto: new BoolDTO(InputExpression.BoolFalse, false)
      },
    ],
  ]);

  const [graphs, setGraphs] = useState<Graphs>(() => {
    const graph = generateGraph(constraints.map(x => x.map(y => y.dto)));

    const monkeGraph = runMONKE(graph);
    const leastLosingComponentsGraph = runLeastLosingComponents(graph);
    const leastLosingNodesGraph = runLeastLosingNodesReachable(graph);

    return {
      original: graph,
      MONKE: monkeGraph,
      leastComponents: leastLosingComponentsGraph,
      leastNodes: leastLosingNodesGraph,
    }
  });

  const generateGraphs = useCallback(() => {
    const graph = generateGraph(constraints.map(x => x.map(y => y.dto)));

    const monkeGraph = runMONKE(graph);
    const leastLosingComponentsGraph = runLeastLosingComponents(graph);
    const leastLosingNodesGraph = runLeastLosingNodesReachable(graph);

    setGraphs({
      original: graph,
      MONKE: monkeGraph,
      leastComponents: leastLosingComponentsGraph,
      leastNodes: leastLosingNodesGraph,
    })
  }, [constraints]);

  return (
    <>
      <VariableSetter variables={variables} setVariables={setVariables} />
      <AllExpressions
        allVariables={variables}
        allConstraints={constraints}
        setConstraints={setConstraints}
      />

      <div>
        <button onClick={_ => generateGraphs()}>Regenerate Graphs</button>
        <p>Original graph nodes: {graphs.original.nodes.length} <a href={createGraphUrl(graphs.original)} target="_blank">link</a></p>
        <p>MONKE graph nodes: {graphs.MONKE.nodes.length} <a href={createGraphUrl(graphs.MONKE)} target="_blank">link</a></p>
        <p>Least Losing Component Count graph nodes: {graphs.leastComponents.nodes.length} <a href={createGraphUrl(graphs.leastComponents)} target="_blank">link</a></p>
        <p>Least Losing Connected Nodes graph nodes: {graphs.leastNodes.nodes.length} <a href={createGraphUrl(graphs.leastNodes)} target="_blank">link</a></p>
      </div>
    </>
  );
}

export default App;
