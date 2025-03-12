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
async function fetchWeatherDataForMap(map) {
    const response = await fetch('/api/weather-data');
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    // Add weather data to the map
    data.forEach((weather) => {
        const marker = L.marker([weather.coord.lat, weather.coord.lon]).addTo(map);
        marker.bindPopup(`<b>${weather.name}</b><br>${weather.weather[0].description}`);
    });
}

document.addEventListener('DOMContentLoaded', initMap);