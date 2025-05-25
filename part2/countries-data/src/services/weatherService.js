import axios from "axios";

const api_key = import.meta.env.VITE_WEATHER_KEY;
const baseURL = "http://api.weatherapi.com/v1";

const getCurrentWeatherFor = (city) => {
  const request = axios.get(`${baseURL}/current.json?key=${api_key}&q=${city}`);
  return request.then((response) => response.data);
};

export default { getCurrentWeatherFor };
