import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";

function WeatherCard() {
  const [city, setCity] = useState("Mumbai");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState("");

  const apiKey = "aba6300d11b40b9c59f39d6d7c0cf682";

  useEffect(() => {
    fetchWeather(city);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleChange(event) {
    setCity(event.target.value);
  }

  function fetchWeather(city) {
    setError("");
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      )
      .then((response) => setWeather(response.data))
      .catch(() => setError("City not found"));

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
      )
      .then((response) => {
        const today = new Date().getDate();
        const forecastData = response.data.list.filter((reading) => {
          const date = new Date(reading.dt_txt);
          return date.getDate() !== today && date.getHours() === 12;
        });
        setForecast(forecastData.slice(0, 5));
      })
      .catch(() => setError("Unable to fetch forecast data"));
  }

  function handleSubmit(event) {
    event.preventDefault();
    fetchWeather(city);
  }

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    const options = { weekday: "long", day: "numeric", month: "long" };
    return date.toLocaleDateString("en-US", options);
  }

  return (
    <div className="weather-app">
      <h1 className="title">Weather Forecast</h1>
      <div className="search-container">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={city}
            onChange={handleChange}
            placeholder="Enter city"
            className="city-input"
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </form>
      </div>
      {error && <p className="error-message">{error}</p>}

      <div className="main-weather-container">
        {weather && (
          <div className="current-weather">
            <h2>{formatDate(new Date().toISOString())}</h2>
            <h2>{weather.name}</h2>
            <img
              src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
              className="weather-icon"
            />
            <h1>{Math.round(weather.main.temp)}°C</h1>
            <p>{weather.weather[0].description}</p>
          </div>
        )}

        <div className="right-weather-container">
          {weather && (
            <div className="weather-details">
              <p>PREDICTABILITY: N/A</p>
              <p>HUMIDITY: {weather.main.humidity}%</p>
              <p>WIND: {weather.wind.speed} km/h</p>
              <p>AIR PRESSURE: {weather.main.pressure} mb</p>
              <p>MAX TEMP: {Math.round(weather.main.temp_max)}°C</p>
              <p>MIN TEMP: {Math.round(weather.main.temp_min)}°C</p>
            </div>
          )}

          {forecast.length > 0 && (
            <div className="forecast">
              {forecast.map((day, index) => (
                <div key={index} className="forecast-day">
                  <p>{formatDate(day.dt_txt).split(",")[0]}</p>
                  <img
                    src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                    alt={day.weather[0].description}
                  />
                  <p>{Math.round(day.main.temp)}°C</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WeatherCard;
