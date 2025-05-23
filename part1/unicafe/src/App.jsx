import { useState } from "react";

const Button = ({ onClick, text }) => {
  return <button onClick={() => onClick()}>{text}</button>;
};

const StatisticLine = ({ text, metric }) => {
  if (text === "Positive")
    return (
      <tr>
        <td>{text}:</td>
        <td>{metric}%</td>
      </tr>
    );

  return (
    <tr>
      <td>{text}:</td>
      <td>{metric}</td>
    </tr>
  );
};

const Statistics = ({ stats }) => {
  const { good, neutral, bad } = stats;
  const total = good + neutral + bad;
  const average = (good * 1 + bad * -1) / total || 0;
  const positivePercent = (good / total) * 100 || 0;

  if (!good && !neutral && !bad) {
    return <p>No feedback given</p>;
  }

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>
              <h2>Statistics</h2>
            </th>
          </tr>
        </thead>
        <tbody>
          <StatisticLine text="Good" metric={good} />
          <StatisticLine text="Neutral" metric={neutral} />
          <StatisticLine text="Bad" metric={bad} />
          <StatisticLine text="All" metric={total} />
          <StatisticLine text="Average" metric={average} />
          <StatisticLine text="Positive" metric={positivePercent} />
        </tbody>
      </table>
    </>
  );
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const handleReview = (type) => {
    return () => {
      switch (type) {
        case "good":
          setGood(good + 1);
          break;
        case "neutral":
          setNeutral(neutral + 1);
          break;
        case "bad":
          setBad(bad + 1);
          break;
        default:
          return;
      }
    };
  };

  return (
    <>
      <h1>Give Feedback</h1>

      <Button onClick={handleReview("good")} text="good" />
      <Button onClick={handleReview("neutral")} text="neutral" />
      <Button onClick={handleReview("bad")} text="bad" />

      <Statistics stats={{ good, neutral, bad }} />
    </>
  );
};

export default App;
