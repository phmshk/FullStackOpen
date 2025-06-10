import ReactDOM from "react-dom/client";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AnecdotesContext, { AnecdotesContextProvider } from "./Context";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <AnecdotesContextProvider>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </AnecdotesContextProvider>
);
