import { useState, useEffect } from 'react';

const useWeatherWidget = (lat, lon) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Open-Meteo API endpoint for current weather with Celsius units
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=celsius`;
        const response = await fetch(url);
        const data = await response.json();
        // data.current_weather contains current weather info
        setWeather(data.current_weather);
      } catch (err) {
        setError(err.message || 'Failed to fetch weather');
      } finally {
        setLoading(false);
      }
    };

    if (lat && lon) {
      fetchWeather();
    }
  }, [lat, lon]);

  return { weather, loading, error };
};

export default useWeatherWidget;
