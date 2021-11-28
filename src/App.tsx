import React from 'react';
import ManualTester from './components/ManualTester';

import './App.scss';

function App() {
  return (
    <>
      <a
        href="https://test-design.org/practical-exercises/"
        className="backLink"
      >
        Back to Test Design Exercises
      </a>
      <ManualTester />
    </>
  );
}

export default App;
