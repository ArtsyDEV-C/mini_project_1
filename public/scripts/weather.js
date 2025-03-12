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
    "default": "images/default.jpg"
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
    "windy": "music/windy.mp3",
    "default": "music/default.mp3"
};

let API_KEY = '';

// Fetch the API key from the backend
async function fetchApiKey() {
    try {
        const response = await fetch('/api/get-api-key');
        const data = await response.json();
        API_KEY = data.apiKey;
    } catch (error) {
        console.error('Error fetching API key:', error);
    }
}

// Fetch weather data
export async function fetchWeather(city) {
    try {
        if (!API_KEY) {
            await fetchApiKey();
        }
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        updateWeatherUI(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

// Function to update the UI
function updateWeatherUI(data) {
    const weather = data.weather[0];
    const main = data.main;
    const sys = data.sys;

    document.getElementById('city-name').innerText = `${data.name}, ${sys.country}`;
    document.getElementById('weather-icon').innerHTML = `<img src="https://openweathermap.org/img/wn/${weather.icon}.png" alt="Weather Icon">`;
    document.getElementById('weather-temperature').innerText = `${Math.round(main.temp - 273.15)}°C`;
    document.getElementById('weather-description').innerText = weather.description;
    document.getElementById('humidity').innerText = `${main.humidity}%`;
    document.getElementById('pressure').innerText = `${main.pressure} hPa`;
    document.getElementById('sunrise').innerText = new Date(sys.sunrise * 1000).toLocaleTimeString();
    document.getElementById('sunset').innerText = new Date(sys.sunset * 1000).toLocaleTimeString();

    const currentTime = new Date().getHours();
    let timeOfDay = "day";
    if (currentTime >= 18 || currentTime < 6) timeOfDay = "night";
    else if (currentTime >= 16 && currentTime < 18) timeOfDay = "evening";

    const weatherBackground = weatherBackgrounds[`${weather.main.toLowerCase()}-${timeOfDay}`] || weatherBackgrounds["default"];
    document.body.style.backgroundImage = `url(${weatherBackground})`;

    const weatherVideo = weatherVideos[`${weather.main.toLowerCase()}-${timeOfDay}`] || weatherVideos["default"];
    document.getElementById('ai-cat-video').innerHTML = `<video src="${weatherVideo}" autoplay loop muted></video>`;

    const weatherMusicFile = weatherMusic[weather.main.toLowerCase()] || weatherMusic["default"];
    const audioElement = document.getElementById('weather-music');
    audioElement.src = weatherMusicFile;
    audioElement.play();
}

document.addEventListener('DOMContentLoaded', () => {
    fetchWeather('New York');
});

navigator.geolocation.getCurrentPosition(async (position) => {
    try {
        if (!API_KEY) {
            await fetchApiKey();
        }
        const { latitude, longitude } = position.coords;
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        updateWeatherUI(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
});
