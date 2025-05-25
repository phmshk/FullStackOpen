import Part from "./Part";
import Total from "./Total";

const Content = ({ parts }) => {
  return (
    <>
      {parts.map((part) => (
        <Part name={part.name} exercises={part.exercises} key={part.id} />
      ))}
      <Total parts={parts} />
    </>
  );
};

export default Content;
