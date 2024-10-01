require("dotenv").config();

async function weather(location) {
  const url = `http://api.weatherapi.com/v1/forecast.json?key=${process.env.API_KEY}&q&q=${location}&days=3&aqi=no&alerts=no`;

  const response = await fetch(url);
  const data = await response.json();

  //console.log(data);

  if (data.error) {
    return {
      error: data.error.message,
    };
  }

  return {
    current: data.current,
    forecast: data.forecast.forecastday,
  };
}

module.exports = weather;
