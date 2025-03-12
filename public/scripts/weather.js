import { fetchJSON, formatTime } from './utils.js';

const API_ENDPOINT = '/api/weather';

const weatherBackgrounds = {
    "clear-day": "images/clear-sky-day.jpg",
    "clear-evening": "images/clear-sky-evening.jpg",
    "clear-night": "images/clear-sky-night.jpg",
    "clouds-day": "images/cloudy-sky-day.jpg",
    "clouds-evening": "images/cloudy-sky-evening.jpg",
    "clouds-night": "images/cloudy-sky-night.jpg",
    "fog-day": "images/foggy-sky-day.jpg",
    "fog-evening": "images/foggy-sky-evening.jpg",
    "fog-night": "images/foggy-sky-night.jpg",
    "haze-day": "images/hazy-sky-day.jpg",
    "haze-evening": "images/hazy-sky-evening.jpg",
    "haze-night": "images/hazy-sky-night.jpg",
    "rain-day": "images/rainy-sky-day.jpg",
    "rain-evening": "images/rainy-sky-evening.jpg",
    "rain-night": "images/rainy-sky-night.jpg",
    "snow-day": "images/snowy-sky-day.jpg",
    "snow-evening": "images/snowy-sky-evening.jpg",
    "snow-night": "images/snowy-sky-night.jpg",
    "thunderstorm-day": "images/thunderstorm-sky-day.jpg",
    "thunderstorm-evening": "images/thunderstorm-sky-evening.jpg",
    "thunderstorm-night": "images/thunderstorm-sky-night.jpg",
    "wind-day": "images/windy-sky-day.jpg",
    "wind-evening": "images/windy-sky-evening.jpg",
    "wind-night": "images/windy-sky-night.jpg",
    "default": "images/default.jpg"
};

const weatherVideos = {
    "clear-day": "videos/clear-day-cat.mp4",
    "clear-evening": "videos/clear-evening-cat.mp4",
    "clear-night": "videos/clear-night-cat.mp4",
    "clouds-day": "videos/cloudy-day-cat.mp4",
    "clouds-evening": "videos/cloudy-evening-cat.mp4",
    "clouds-night": "videos/cloudy-night-cat.mp4",
    "rain-day": "videos/rainy-day-cat.mp4",
    "rain-evening": "videos/rainy-evening-cat.mp4",
    "rain-night": "videos/rainy-night-cat.mp4",
    "snow-day": "videos/snowy-day-cat.mp4",
    "snow-evening": "videos/snowy-evening-cat.mp4",
    "snow-night": "videos/snowy-night-cat.mp4",
    "wind-day": "videos/windy-day-cat.mp4",
    "wind-evening": "videos/windy-evening-cat.mp4",
    "wind-night": "videos/windy-night-cat.mp4",
    "default": "videos/default.mp4"
};

const weatherMusic = {
    "clouds": "music/cloudy.mp3",
    "fog": "music/foggy.mp3",
    "haze": "music/hazy.mp3",
    "rain": "music/rain.mp3",
    "snow": "music/snow.mp3",
    "clear": "music/sunny.mp3",
    "wind": "music/windy.mp3",
    "thunderstorm": "music/thunderstorm.mp3",
    "default": "music/cloudy.mp3"
};

const updateWeatherUI = (data) => {
    const weather = data.weather[0];
    const main = data.main;
    const sys = data.sys;

    document.getElementById('city-name').innerText = `${data.name}, ${sys.country}`;
    document.getElementById('weather-icon').innerHTML = `<img src="https://openweathermap.org/img/wn/${weather.icon}@2x.png" alt="Weather Icon">`;
    document.getElementById('weather-temperature').innerText = `${Math.round(main.temp - 273.15)}°C`;
    document.getElementById('weather-description').innerText = weather.description;
    document.getElementById('humidity').innerText = `${main.humidity}%`;
    document.getElementById('pressure').innerText = `${main.pressure} hPa`;
    document.getElementById('sunrise').innerText = formatTime(sys.sunrise);
    document.getElementById('sunset').innerText = formatTime(sys.sunset);

    const currentHour = new Date().getHours();
    let timeOfDay = "day";
    if (currentHour >= 18 || currentHour < 6) timeOfDay = "night";
    else if (currentHour >= 16) timeOfDay = "evening";

    const conditionKey = `${weather.main.toLowerCase()}-${timeOfDay}`;

    document.body.style.backgroundImage = `url('${weatherBackgrounds[conditionKey] || weatherBackgrounds["default"]}')`;

    const videoSrc = weatherVideos[conditionKey] || weatherVideos["default"];
    document.getElementById('ai-cat-video').innerHTML = `<video src="${videoSrc}" autoplay loop muted></video>`;

    const audioSrc = weatherMusic[weather.main.toLowerCase()] || weatherMusic["default"];
    const audio = new Audio(audioSrc);
    audio.play();

    // Call updateCatMedia function
    updateCatMedia(weather.main.toLowerCase(), currentHour);
};

const updateCatMedia = (weatherCondition, currentHour) => {
    const video = document.getElementById('cat-video');
    const image = document.getElementById('cat-image');

    const timeOfDay = currentHour >= 6 && currentHour < 18 
                      ? 'day'
                      : currentHour >= 18 && currentHour < 21 
                        ? 'evening'
                        : 'night';

    let condition = 'default';

    if(weatherCondition.includes('clear')) condition = 'clear-sky';
    else if(weatherCondition.includes('cloud')) condition = 'cloudy-sky';
    else if(weatherCondition.includes('rain')) condition = 'rainy-sky';
    else if(weatherCondition.includes('snow')) condition = 'snowy-sky';
    else if(weatherCondition.includes('thunderstorm')) condition = 'thunderstorm-sky';
    else if(weatherCondition.includes('fog')) condition = 'foggy-sky';
    else if(weatherCondition.includes('haze')) condition = 'hazy-sky';
    else if(weatherCondition.includes('wind')) condition = 'windy-sky';

    // Setting paths based on your provided image naming convention
    image.src = `/images/${condition}-${timeOfDay}.jpg`;

    // Optionally you can set videos if you have similar named videos
    video.src = `/videos/${condition}-${timeOfDay}.mp4`;
};

export const fetchWeather = async (city) => {
    try {
        const data = await fetchJSON(`${API_ENDPOINT}/${city}`);
        updateWeatherUI(data);
    } catch (error) {
        console.error('Error fetching weather:', error);
    }
};

fetchWeather('Delhi');
