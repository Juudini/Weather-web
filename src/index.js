import { GetWeatherByCityError } from "./utils/errors.js";
const apiKey = "cbc09ea6bb5712300a024b3ad7a2462f";

async function getWeatherByCity(city) {
    try {
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
        );

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
        return weather;
    } catch (error) {
        throw new GetWeatherByCityError(
            "Error while retrieving weather data",
            error
        );
    }
}

function displayWeatherData(weather) {
    const weatherDataElement = document.getElementById("weather-data");

    const card = document.createElement("div");
    card.className = "card";

    const cardContent = `
        <div class="card-header">
            <h2>${weather.city}</h2>
            <img class="weather-icon" src="http://openweathermap.org/img/wn/${weather.img}.png" alt="Weather Icon" />
        </div>
        <div class="card-body">
            <p class="card-text">Temperature: <span class="temperature">${weather.temp}°C</span></p>
            <p class="card-text">Max Temperature: ${weather.maxTemp}°C</p>
            <p class="card-text">Min Temperature: ${weather.minTemp}°C</p>
            <p class="card-text">Feels Like: ${weather.feelsLike}°C</p>
            <p class="card-text">Weather: ${weather.weather}</p>
            <p class="card-text">Humidity: ${weather.humidity}%</p>
            <p class="card-text">Wind Speed: ${weather.windSpeed} m/s</p>
        </div>
        <div class="card-footer">
            <button class="btn btn-danger delete-button">Delete</button>
        </div>
    `;

    card.innerHTML = cardContent;
    weatherDataElement.appendChild(card);

    const deleteButton = card.querySelector(".delete-button");
    deleteButton.addEventListener("click", () => {
        card.remove();
    });
}

const inputCiudad = document.getElementById("input-ciudad");
inputCiudad.addEventListener("keyup", searchWeather);

async function searchWeather(event) {
    if (event.key === "Enter") {
        const city = inputCiudad.value.trim();

        if (city) {
            try {
                const weather = await getWeatherByCity(city);
                displayWeatherData(weather);
            } catch (error) {
                const errorCard = `
                    <div class="card error-card">
                        <div class="card-body">
                            <p class="card-text">✗ Error al obtener los datos del clima</p>
                        </div>
                    </div>
                `;
                document.getElementById("weather-data").innerHTML = errorCard;
                if (error instanceof GetWeatherByCityError) {
                    throw error;
                }
            }
            inputCiudad.value = "";
        }
    }
}
