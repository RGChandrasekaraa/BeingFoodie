const axios = require("axios");

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

async function fetchWeatherInfo(lat, lon) {
  const endpoint = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`;

  try {
    const response = await axios.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("Error fetching weather information:", error);
    throw error;
  }
}

async function weatherLookup(data) {
  for (let i = 0; i < data.length; i++) {
    let place = data[i];
    let weatherData = await fetchWeatherInfo(place.lat, place.lng);
    console.log(weatherData);
    data[i].weather = weatherData.weather[0].description;
    data[i].temp = weatherData.main.temp;
    data[i].weatherIcon = weatherData.weather[0].icon;
  }
  return data;
}

module.exports = { fetchWeatherInfo, weatherLookup };
