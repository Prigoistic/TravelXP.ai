import { useState, useEffect } from 'react';
import '../styles/weather.css';

const WeatherForecast = ({ city, days, startDate }) => {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Clean up city name for API
        const cleanCity = city.split(',')[0].trim();
        
        // Get coordinates
        const geoResponse = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${cleanCity}&limit=1&appid=${API_KEY}`
        );
        const locations = await geoResponse.json();
        
        if (!locations || locations.length === 0) {
          console.error('Location not found');
          setLoading(false);
          return;
        }

        const location = locations[0];

        // Get forecast starting from the selected date
        const startTimestamp = Math.floor(startDate.getTime() / 1000);
        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lon}&units=metric&appid=${API_KEY}`
        );
        const data = await forecastResponse.json();

        // Filter and process forecast data starting from selected date
        const filteredForecasts = data.list.filter(item => 
          item.dt >= startTimestamp
        );

        const dailyForecasts = filteredForecasts.reduce((acc, item) => {
          const date = new Date(item.dt * 1000).toLocaleDateString();
          if (!acc[date]) {
            acc[date] = {
              dt: item.dt,
              temp: {
                max: item.main.temp_max,
                min: item.main.temp_min
              },
              weather: item.weather,
              humidity: item.main.humidity,
              speed: item.wind.speed
            };
          } else {
            acc[date].temp.max = Math.max(acc[date].temp.max, item.main.temp_max);
            acc[date].temp.min = Math.min(acc[date].temp.min, item.main.temp_min);
          }
          return acc;
        }, {});

        setForecast(Object.values(dailyForecasts).slice(0, days));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching weather:', error);
        setLoading(false);
      }
    };

    if (city && startDate) {
      fetchWeather();
    }
  }, [city, days, startDate, API_KEY]);

  if (loading) {
    return (
      <div className="weather-container">
        <div className="weather-loading">
          <div className="loading-spinner"></div>
          <div>Loading weather forecast...</div>
        </div>
      </div>
    );
  }

  if (!forecast) return null;

  return (
    <div className="weather-container">
      <h3>
        <i className="fas fa-cloud-sun"></i>
        Weather Forecast
      </h3>
      <div className="weather-grid-container">
        <div className="weather-grid">
          {forecast.map((day, index) => (
            <div key={index} className="weather-card">
              <div className="weather-date">
                {new Date(day.dt * 1000).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
              <div className="weather-icon">
                <img 
                  src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                  alt={day.weather[0].description}
                />
              </div>
              <div className="weather-temp">
                <span className="max-temp">{Math.round(day.temp.max)}°</span>
                <span className="min-temp">{Math.round(day.temp.min)}°</span>
              </div>
              <div className="weather-desc">
                {day.weather[0].description}
              </div>
              <div className="weather-details">
                <span>
                  <i className="fas fa-tint"></i>
                  {day.humidity}%
                </span>
                <span>
                  <i className="fas fa-wind"></i>
                  {Math.round(day.speed)} m/s
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherForecast; 