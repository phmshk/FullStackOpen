import { useSelector, useDispatch } from "react-redux";
import { voteForAnecdote } from "../reducers/anecdoteReducer";
import { setNotificationWithTimeout } from "../reducers/notificationReducer";
const AnecdoteList = () => {
  const anecdotes = useSelector(({ anecdotes, filter }) => {
    if (!filter) {
      return anecdotes;
    } else {
      return anecdotes.filter((anecdote) =>
        anecdote.content
          .toLocaleLowerCase()
          .includes(filter.toLocaleLowerCase())
      );
    }
  });

  const dispatch = useDispatch();

  const vote = (anecdote) => {
    dispatch(voteForAnecdote(anecdote));
    dispatch(setNotificationWithTimeout(`you voted '${anecdote.content}'`, 2));
  };

  return (
    <>
      {[...anecdotes]
        .sort((a, b) => b.votes - a.votes)
        .map((anecdote) => (
          <div key={anecdote.id}>
            <div>{anecdote.content}</div>
            <div>
              has {anecdote.votes}
              <button onClick={() => vote(anecdote)}>vote</button>
            </div>
          </div>
        ))}
    </>
  );
};

export default AnecdoteList;
