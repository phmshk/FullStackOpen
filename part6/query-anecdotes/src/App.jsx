import AnecdoteForm from "./components/AnecdoteForm";
import Notification from "./components/Notification";
import { useNotificationDispatch } from "./contextHooks";

import { getAnecdotes, updateAnecdote } from "./services/requests";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const App = () => {
  const showNotification = useNotificationDispatch();

  const queryClient = useQueryClient();
  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (updatedAnecdote) => {
      const anecdotes = queryClient.getQueryData(["anecdotes"]);
      queryClient.setQueryData(
        ["anecdotes"],
        anecdotes.map((anecdote) =>
          anecdote.id === updatedAnecdote.id ? updatedAnecdote : anecdote
        )
      );
    },
  });

  const result = useQuery({
    queryKey: ["anecdotes"],
    queryFn: getAnecdotes,
  });
  console.log(JSON.parse(JSON.stringify(result)));

  const handleVote = (anecdote) => {
    updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 });
    showNotification(`You voted for '${anecdote.content}'`, 2);
  };

  if (result.isLoading) {
    return <div>loading data...</div>;
  }

  if (result.isError) {
    return (
      <>
        <div>anecdote service is not available due to problems in server</div>
      </>
    );
  }

  const anecdotes = result.data;

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;
