import React, { useEffect, useState } from "react";
import weatherService from "../services/weatherService";

const Country = ({ country }) => {
  const [currentWeather, setCurrentWeather] = useState(null);

  useEffect(() => {
    weatherService
      .getCurrentWeatherFor(country.capital[0])
      .then((data) => setCurrentWeather(data.current))
      .catch((e) => console.error("No API key provided. Error: ", e));
  }, []);

  return (
    <div>
      <h2>
        {country.name.official} ({country.name.common})
      </h2>
      <p>Capital: {country.capital[0]}</p>
      <p>Area: {country.area}</p>
      <h2>Languages</h2>
      <ul>
        {Object.values(country.languages).map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={country.flags.alt} />
      <h2>Weather in {country.capital[0]}</h2>
      {currentWeather ? (
        <div>
          <p>Temperature: {`${currentWeather.temp_c}`} Celsius</p>
          <img
            src={`https:${currentWeather.condition.icon}`}
            alt={`https:${currentWeather.condition.text}`}
          />
          <p>Wind: {`${(currentWeather.wind_kph / 3.6).toFixed(2)}`} m/s</p>
        </div>
      ) : (
        <p>Loading weather...</p>
      )}
      Powered by{" "}
      <a href="https://www.weatherapi.com/" title="Free Weather API">
        WeatherAPI.com
      </a>
      <a href="https://www.weatherapi.com/" title="Free Weather API">
        <img
          src="//cdn.weatherapi.com/v4/images/weatherapi_logo.png"
          alt="Weather data by WeatherAPI.com"
          border="0"
        />
      </a>
    </div>
  );
};

export default Country;
