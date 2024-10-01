const weatherForm = document.querySelector("form");
const search = document.querySelector("input");
const searchResults = document.getElementById("search-results");
const weatherIcon = document.getElementById("weather-icon");
const weatherCondition = document.getElementById("weather-condition");
const currentTemp = document.getElementById("current-temp");
const minMaxTemp = document.getElementById("min-max-temp");
const chanceOfRain = document.getElementById("chance-of-rain");
const chanceOfSnow = document.getElementById("chance-of-snow");
const windSpeed = document.getElementById("wind-speed");
const forecastDaysContainer = document.getElementById("forecast-days");
const currentWeatherSection = document.querySelector(".current-weather");
const forecastSection = document.querySelector(".forecast");

search.addEventListener("input", function () {
  const query = search.value.trim().toLowerCase();
  searchResults.innerHTML = "";
  selectedIndex = -1;

  if (query) {
    fetchResults(query);
  } else {
    searchResults.style.display = "none";
  }
});

async function fetchResults(query) {
  try {
    const response = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=e13d980a72709b1de5e81b9ae2cd729d`
    );
    const data = await response.json();
    displayResults(data);
  } catch (error) {
    console.error("Error fetching search results:", error);
  }
}

function displayResults(results) {
  if (results.length) {
    searchResults.style.display = "block";
    results.forEach((result) => {
      const li = document.createElement("li");
      li.textContent = result.name;
      li.addEventListener("click", function () {
        search.value = result.name;
        searchResults.style.display = "none";
        fetchWeatherData(search.value);
      });
      searchResults.appendChild(li);
    });
  } else {
    searchResults.style.display = "none";
  }
}

weatherForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const location = search.value;
  fetchWeatherData(location);
});

function fetchWeatherData(location) {
  fetch(`/weather?address=${location}`).then((response) => {
    response.json().then((data) => {
      if (data.error) {
        weatherCondition.textContent = data.error;
      } else {
        const current = data.current;
        const forecast = data.forecast;

        // Show weather container
        document.getElementById("weather-container").style.display = "block";

        // Update current weather
        weatherIcon.src = current.condition.icon;
        weatherCondition.textContent = current.condition.text;
        currentTemp.textContent = `Current: ${current.temp_c}°C`;
        minMaxTemp.textContent = `Min: ${forecast[0].day.mintemp_c}°C / Max: ${forecast[0].day.maxtemp_c}°C`;
        chanceOfRain.textContent = `Today Chance of Rain: ${forecast[0].day.daily_chance_of_rain}%`;
        chanceOfSnow.textContent = `Today Chance of Snow: ${forecast[0].day.daily_chance_of_snow}%`;
        windSpeed.textContent = `Wind: Max ${forecast[0].day.maxwind_kph} kph`;

        // Update 3-day forecast
        forecastDaysContainer.innerHTML = ""; // Clear previous forecast
        forecast.forEach((day) => {
          const forecastDay = document.createElement("div");
          forecastDay.classList.add("forecast-day");
          forecastDay.innerHTML = `
                      <h3>${new Date(day.date).toLocaleDateString()}</h3>
                      <img src="${day.day.condition.icon}" alt="Weather Icon">
                      <p>${day.day.condition.text}</p>
                      <p>Min: ${day.day.mintemp_c}°C / Max: ${
            day.day.maxtemp_c
          }°C</p>
                      <p>Chance of Rain: ${day.day.daily_chance_of_rain}%</p>
                      <p>Chance of Snow: ${day.day.daily_chance_of_snow}%</p>
                  `;
          forecastDaysContainer.appendChild(forecastDay);
        });
      }
    });
  });
}
