import axios from "axios";

const baseURL = "http://localhost:3001/persons";

const getAll = () => {
  const request = axios.get(baseURL);
  return request.then((response) => response.data);
};

const create = (newItem) => {
  const request = axios.post(baseURL, newItem);
  return request.then((response) => response.data);
};

const deleteItem = (itemId) => {
  axios.delete(`${baseURL}/${itemId}`);
};

const update = (itemId, newItem) => {
  const request = axios.put(`${baseURL}/${itemId}`, newItem);
  return request.then((response) => response.data);
};

export default { getAll, create, deleteItem, update };
