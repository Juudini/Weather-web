const apiKey = "95ec01f8b61f542bd3d75bc4a0bf4394";

function getWeatherByCity(city) {
    return axios
        .get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
        )
        .then((response) => {
            const weatherData = response.data;
            const weather = {
                city: weatherData.name,
                temp: Math.round(weatherData.main.temp),
                maxTemp: Math.round(weatherData.main.temp_max),
                minTemp: Math.round(weatherData.main.temp_min),
                feelsLike: Math.round(weatherData.main.feels_like),
                weather: weatherData.weather[0].main,
                img: weatherData.weather[0].icon,
                humidity: weatherData.main.humidity,
                windSpeed: weatherData.wind.speed,
            };
            console.log(weatherData);
            return weather;
        })
        .catch((error) => {
            console.log(error);
            throw new Error("Error al obtener los datos del clima");
        });
}

function displayWeatherData(weather) {
    const weatherDataElement = document.getElementById("weather-data");

    const weatherHtml = `
    <div class="card">
      <h2>${weather.city}</h2>
      <p>Temperature: ${weather.temp}°C</p>
      <p>Max Temperature: ${weather.maxTemp}°C</p>
      <p>Min Temperature: ${weather.minTemp}°C</p>
      <p>Feels Like: ${weather.feelsLike}°C</p>
      <p>Weather: ${weather.weather}</p>
      <p>Humidity: ${weather.humidity}%</p>
      <p>Wind Speed: ${weather.windSpeed} m/s</p>
    </div>
  `;

    weatherDataElement.innerHTML = weatherHtml;
}

function searchWeather() {
    const inputCiudad = document.getElementById("input-ciudad");
    const city = inputCiudad.value.trim();

    if (city) {
        getWeatherByCity(city)
            .then((weather) => {
                displayWeatherData(weather);
            })
            .catch((error) => {
                console.log(error);
                document.getElementById("weather-data").innerHTML =
                    "Error al obtener los datos del clima";
            });
    }
}
