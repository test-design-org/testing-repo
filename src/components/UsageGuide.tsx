import React from 'react';

const UsageGuide = ({ className }: { className: string }) => (
  <div className={className}>
    <h2>Usage guide</h2>
    <div>
      <p>
        The first line should be the variable list, separated by semicolons{' '}
        <b>;</b>
        <br />
        You can only put whitespace between expressions (before or after
        semicolons, beginning or end of a line), but not in the middle of
        expressions!
      </p>
      <p>
        Floating point numbers use a dot <b>.</b>
      </p>
      <p>
        You can leave lines empty, or create a whole commented line by starting
        it with <code>//</code>
      </p>
      <p>
        One variable has this strucutre:
        <ul>
          <li>
            <code>variableName(bool)</code>
            <br />
            Boolean
          </li>
          <li>
            <code>variableName(int)</code>
            <br />
            Integer
          </li>
          <li>
            <code>variableName(num)</code>
            <br />
            Number, where the precision defaults to 0.01
          </li>
          <li>
            <code>variableName(num,0.02)</code>
            <br />
            Number, where the precision is 0.02
          </li>
        </ul>
      </p>
      <p>
        From the second line on, the test cases are listed line by line.
        <br />
        The test cases are separated with a semicolon <b>;</b>
        <br />
        One test case can be:
        <ul>
          <li>
            *<br />
            if there is no constraint on this variable in this test case
          </li>
          <li>
            <code>true</code> or <code>false</code>
            <br />
            if the variable is boolean
          </li>
          <li>
            <code>&lt;30</code> or <code>!=12.62</code>
            <br />
            This consists of a uniry operator followed by a number. <br />
            Unary operators: <code>&lt; &lt;= &gt; &gt;= = !=</code>
          </li>
          <li>
            <code>[-2,10.3]</code> or <code>[4,10)</code> or{' '}
            <code>(-2.2,10.3)</code>
            <br />
            Intervals
          </li>
        </ul>
        Example: You want to write a test case for the following:
        <br />
        <code>
          IF isVIP = true AND price &gt; 100 AND price &lt;= 199.99 AND discount
          &gt; 20
        </code>
        <br />
        It will be: <code>true; (100,199.99]; &gt;20</code>
      </p>
      <p>
        Another, complete example:
        <pre>
          <code>
            // Vacation example from
            https://exercises.test-design.org/paid-vacation-days/
            <br />
            age(int); service(int)
            <br />
            &lt;18; *
            <br />
            [18,45); &lt;15
            <br />
            [18,45); [15,30)
            <br />
            [18,60); &gt;=30
            <br />
            [45,60); &lt;30
            <br />
            &gt;=60; &lt;30
            <br />
            &gt;=60; &gt;=30
            <br />
          </code>
        </pre>
      </p>
    </div>
  </div>
);

export default UsageGuide;
