// Initialize the map
function initMap() {
    const map = L.map('map').setView([51.505, -0.09], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Fetch weather data for the map
    fetchWeatherDataForMap(map);
}

// Fetch weather data for the map
const fetchWeatherDataForMap = async (map) => {
    try {
        const response = await fetch('/api/weather-data');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        updateWeatherLayer(map, data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
};

// Define the updateWeatherLayer function
function updateWeatherLayer(map, data) {
    // Update map with weather data
    console.log('Weather layer updated with:', data);

    // Example logic to update the map with weather data
    data.forEach(weather => {
        const marker = L.marker([weather.coord.lat, weather.coord.lon]).addTo(map);
        marker.bindPopup(`<b>${weather.name}</b><br>Temperature: ${weather.main.temp}°C<br>Weather: ${weather.weather[0].description}`).openPopup();
    });
}

document.addEventListener('DOMContentLoaded', initMap);