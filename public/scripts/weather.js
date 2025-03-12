const weatherBackgrounds = {
    "clear-day": "images/clear-sky-day.jpg",
    "clear-night": "images/clear-sky-night.jpg",
    "clear-evening": "images/clear-sky-evening.jpg",
    "cloudy-day": "images/cloudy-sky-day.jpg",
    "cloudy-night": "images/cloudy-sky-night.jpg",
    "cloudy-evening": "images/cloudy-sky-evening.jpg",
    "sunny-day": "images/sunny-sky-day.jpg",
    "sunny-night": "images/sunny-sky-night.jpg",
    "rainy-day": "images/rainy-sky-day.jpg",
    "rainy-night": "images/rainy-sky-night.jpg",
    "rainy-evening": "images/rainy-sky-evening.jpg",
    "snowy-day": "images/snowy-sky-day.jpg",
    "snowy-night": "images/snowy-sky-night.jpg",
    "snowy-evening": "images/snowy-sky-evening.jpg",
    "thunderstorm-day": "images/thunderstorm-sky-day.jpg",
    "thunderstorm-night": "images/thunderstorm-sky-night.jpg",
    "thunderstorm-evening": "images/thunderstorm-sky-evening.jpg",
    "hazy-day": "images/hazy-sky-day.jpg",
    "hazy-night": "images/hazy-sky-night.jpg",
    "foggy-morning": "images/foggy-sky-day.jpg",
    "foggy-night": "images/foggy-sky-night.jpg",
    "foggy-evening": "images/foggy-sky-evening.jpg",
    "windy-morning": "images/windy-sky-day.jpg",
    "windy-night": "images/windy-sky-night.jpg",
    "windy-evening": "images/windy-sky-evening.jpg",
};

const weatherVideos = {
    "clear-morning": "videos/clear-morning-cat.mp4",
    "clear-evening": "videos/clear-evening-cat.mp4",
    "clear-night": "videos/clear-night-cat.mp4",
    "cloudy-morning": "videos/cloudy-morning-cat.mp4",
    "cloudy-evening": "videos/cloudy-evening-cat.mp4",
    "cloudy-night": "videos/cloudy-night-cat.mp4",
    "foggy-morning": "videos/foggy-morning-cat.mp4",
    "foggy-evening": "videos/foggy-evening-cat.mp4",
    "foggy-night": "videos/foggy-night-cat.mp4",
    "rain-morning": "videos/rainy-morning-cat.mp4",
    "rain-evening": "videos/rainy-evening-cat.mp4",
    "rain-night": "videos/rainy-night-cat.mp4",
    "snowy-morning": "videos/snowy-morning-cat.mp4",
    "snowy-evening": "videos/snowy-evening-cat.mp4",
    "snowy-night": "videos/snowy-night-cat.mp4",
    "sunny-morning": "videos/sunny-morning-cat.mp4",
    "sunny-evening": "videos/sunny-evening-cat.mp4",
    "sunny-night": "videos/sunny-night-cat.mp4",
    "thunderstorm-morning": "videos/thunderstorm-morning-cat.mp4",
    "thunderstorm-evening": "videos/thunderstorm-evening-cat.mp4",
    "thunderstorm-night": "videos/thunderstorm-night-cat.mp4",
    "windy-morning": "videos/windy-morning-cat.mp4",
    "windy-evening": "videos/windy-evening-cat.mp4",
    "windy-night": "videos/windy-night-cat.mp4",
    "default": "videos/default.mp4"
};

const weatherMusic = {
    "clear": "music/sunny.mp3",
    "cloudy": "music/cloudy.mp3",
    "rainy": "music/rain.mp3",
    "snowy": "music/snow.mp3",
    "thunderstorm": "music/thunderstorm.mp3",
    "hazy": "music/hazy.mp3",
    "foggy": "music/foggy.mp3",
    "windy": "music/windy.mp3"
};

const API_KEY = '2149cbc5da7384b8ef7bcccf62b0bf68';

// Function to fetch weather data
async function fetchWeather(city) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    updateWeatherUI(data);
}

// Function to update weather data on the page
function updateWeatherUI(data) {
    const weather = data.weather[0];
    const main = data.main;
    const wind = data.wind;
    const sys = data.sys;

    // City name
    const cityElement = document.getElementById('city-name');
    if (cityElement) {
        cityElement.innerText = `${data.name}, ${data.sys.country}`;
    }

    // Weather icon
    const weatherIcon = document.getElementById('weather-icon');
    if (weatherIcon) {
        weatherIcon.innerHTML = `<img src="https://openweathermap.org/img/wn/${weather.icon}.png" alt="Weather Icon">`;
    }

    // Temperature
    const temperatureElement = document.getElementById('weather-temperature');
    if (temperatureElement) {
        temperatureElement.innerText = `${Math.round(main.temp - 273.15)}°C`;
    }

    // Weather description
    const weatherDescription = document.getElementById('weather-description');
    if (weatherDescription) {
        weatherDescription.innerText = weather.description;
    }

    // Other weather stats
    const humidityElement = document.getElementById('humidity');
    if (humidityElement) {
        humidityElement.innerText = `${main.humidity}%`;
    }

    const uvIndexElement = document.getElementById('uv-index');
    if (uvIndexElement) {
        uvIndexElement.innerText = 'N/A'; // UV index is not available in this API call
    }

    const pressureElement = document.getElementById('pressure');
    if (pressureElement) {
        pressureElement.innerText = `${main.pressure} hPa`;
    }

    const sunriseElement = document.getElementById('sunrise');
    if (sunriseElement) {
        sunriseElement.innerText = new Date(sys.sunrise * 1000).toLocaleTimeString();
    }

    const sunsetElement = document.getElementById('sunset');
    if (sunsetElement) {
        sunsetElement.innerText = new Date(sys.sunset * 1000).toLocaleTimeString();
    }

    const localTimeElement = document.getElementById('local-time');
    if (localTimeElement) {
        localTimeElement.innerText = new Date().toLocaleTimeString();
    }

    const istTimeElement = document.getElementById('ist-time');
    if (istTimeElement) {
        const now = new Date();
        const istOffset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds
        const istTime = new Date(now.getTime() + istOffset);
        istTimeElement.innerText = istTime.toLocaleTimeString();
    }
}

// Example usage
document.addEventListener('DOMContentLoaded', () => {
    fetchWeather('New York');
});

navigator.geolocation.getCurrentPosition(async (position) => {
    const { latitude, longitude } = position.coords;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    updateWeatherUI(data);
});

// Function to provide recommendations based on weather
const provideRecommendations = (weather) => {
    const recommendations = [];
    if (weather.main.temp < 15) {
        recommendations.push('Wear warm clothes');
    } else if (weather.main.temp > 30) {
        recommendations.push('Wear light clothes');
    }
    if (weather.weather[0].main === 'Rain') {
        recommendations.push('Carry an umbrella');
    }
    // Display recommendations
    document.getElementById('recommendations').innerHTML = recommendations.join(', ');
};

// Function to display disaster warnings
const displayDisasterWarnings = (warnings) => {
    const warningContainer = document.getElementById('disaster-warnings');
    warningContainer.innerHTML = warnings.map(warning => `<div>${warning}</div>`).join('');
};

// Example function to fetch weather data and update map
const fetchWeatherDataForMap = async () => {
    const response = await fetch('/api/weather-data');
    const data = await response.json();
    updateWeatherLayer(data);
};

// Call the function to fetch weather data and update map
fetchWeatherDataForMap();