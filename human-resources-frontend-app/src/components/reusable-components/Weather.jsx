import React from 'react';
import useWeatherWidget from '../custom-hooks/useWeatherWidget';
import ReactAnimatedWeather from 'react-animated-weather';

const weatherIcons = {
  // Mapping of Open-Meteo weather codes to react-animated-weather icons
  0: "CLEAR_DAY",            // Clear sky
  1: "PARTLY_CLOUDY_DAY",    // Mainly clear
  2: "PARTLY_CLOUDY_DAY",    // Partly cloudy
  3: "CLOUDY",               // Overcast
  45: "FOG",                 // Fog
  48: "FOG",                 // Depositing rime fog
  51: "RAIN",                // Drizzle: Light
  53: "RAIN",                // Drizzle: Moderate
  55: "RAIN",                // Drizzle: Dense intensity
  61: "RAIN",                // Rain: Slight
  63: "RAIN",                // Rain: Moderate
  65: "RAIN",                // Rain: Heavy intensity
  66: "SNOW",                // Freezing Rain: Light
  67: "SNOW",                // Freezing Rain: Heavy
  71: "SNOW",                // Snow fall: Slight
  73: "SNOW",                // Snow fall: Moderate
  75: "SNOW",                // Snow fall: Heavy intensity
  80: "RAIN",                // Rain showers: Slight
  81: "RAIN",                // Rain showers: Moderate
  82: "RAIN",                // Rain showers: Violent
  95: "WIND",                // Thunderstorm: Slight or moderate\n  96: "WIND",\n  99: "WIND"\n};
}

const Weather = ({ latitude, longitude }) => {
  const { weather, loading, error } = useWeatherWidget(latitude, longitude);

  if (loading) return <div className="small-weather">Loading...</div>;
  if (error) return <div className="small-weather">Error</div>;
  if (!weather) return null;

  // Open-Meteo returns current weather with temperature and weathercode
  const { temperature, weathercode } = weather;
  const icon = weatherIcons[weathercode] || "CLOUDY";

  return (
    <div className="small-weather">
      <ReactAnimatedWeather
        icon={icon}
        color="#FFD700"
        size={32}
        animate={true}
      />
      <span className="temp">{Math.round(temperature)}°C</span>
      <span className="temp"> Belgrade, Serbia</span>
    </div>
  );
};

export default Weather;
