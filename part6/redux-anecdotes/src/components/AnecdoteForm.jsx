import { useDispatch } from "react-redux";
import { setNotificationWithTimeout } from "../reducers/notificationReducer";
import { createAnecdote } from "../reducers/anecdoteReducer";

const AnecdoteForm = () => {
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const content = e.target.anecdote.value;

    e.target.anecdote.value = "";

    dispatch(createAnecdote(content));
    dispatch(setNotificationWithTimeout(`you added '${content}'`, 2));
  };

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input name="anecdote" />
        </div>
        <button>create</button>
      </form>
    </>
  );
};

export default AnecdoteForm;
