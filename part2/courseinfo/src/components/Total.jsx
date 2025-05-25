const Total = ({ parts }) => {
  const totalNumber = parts.reduce((acc, curr) => (acc += curr.exercises), 0);
  return <p style={{ fontWeight: 600 }}>Total of {totalNumber} exercises</p>;
};

export default Total;
