import { createSlice } from "@reduxjs/toolkit";
import anecdotesService from "../services/anecdotesService";

const anecdoteSlice = createSlice({
  name: "anecdotes",
  initialState: [],
  reducers: {
    vote: (state, action) => {
      const id = action.payload.id;
      state.find((anecdote) => {
        if (anecdote.id === id) {
          anecdote.votes += 1;
        }
      });
    },
    addAnecdote: (state, action) => {
      state.push(action.payload);
    },
    setAnecdotes: (state, action) => {
      return action.payload;
    },
  },
});

export const { vote, addAnecdote, setAnecdotes } = anecdoteSlice.actions;

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdotesService.getAll();
    dispatch(setAnecdotes(anecdotes));
  };
};

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdotesService.createNew(content);
    dispatch(addAnecdote(newAnecdote));
  };
};

export const voteForAnecdote = (anecdote) => {
  return async (dispatch) => {
    const newObj = await anecdotesService.update(anecdote.id, {
      ...anecdote,
      votes: anecdote.votes + 1,
    });
    dispatch(vote(newObj));
  };
};

export default anecdoteSlice.reducer;
