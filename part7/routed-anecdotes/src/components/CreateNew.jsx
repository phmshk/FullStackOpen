import { useNavigate } from "react-router";
import { useField } from "../hooks";

const CreateNew = (props) => {
  const content = useField("text");
  const author = useField("text");
  const info = useField("text");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    props.addNew({
      content: content.value,
      authot: author.value,
      info: info.value,
      votes: 0,
    });
    handleReset();
    navigate("/");
    props.setNotification(`a new anecdote '${content.value}' created!`);
    setTimeout(() => {
      props.setNotification(null);
    }, 2000);
  };

  const handleReset = () => {
    content.reset();
    author.reset();
    info.reset();
  };

  const { reset: contentReset, ...contentProps } = content;
  const { reset: authorReset, ...authorProps } = author;
  const { reset: infoReset, ...infoProps } = info;

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...contentProps} name="content" required />
        </div>
        <div>
          author
          <input {...authorProps} name="author" required />
        </div>
        <div>
          url for more info
          <input {...infoProps} name="info" required />
        </div>
        <button>create</button>
        <button onClick={handleReset}>reset</button>
      </form>
    </div>
  );
};

export default CreateNew;
