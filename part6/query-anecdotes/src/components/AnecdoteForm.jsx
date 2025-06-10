import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAnecdote } from "../services/requests";
import { useNotificationDispatch } from "../contextHooks";

const AnecdoteForm = () => {
  const showNotification = useNotificationDispatch();
  const newAnecdotesMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(["anecdotes"]);
      queryClient.setQueryData(["anecdotes"], anecdotes.concat(newAnecdote));
    },
    onError: () => {
      showNotification(
        "too short anecdote, must have length of 5 characters or more",
        2
      );
    },
  });
  const queryClient = useQueryClient();

  const onCreate = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = "";
    console.log("new anecdote");
    newAnecdotesMutation.mutate({ content, votes: 0 });
    showNotification(`You added '${content}'`, 2);
  };

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
