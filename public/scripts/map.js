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
const fetchWeatherDataForMap = async () => {
    try {
        const response = await fetch('/api/weather-data');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        updateWeatherLayer(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
};

// Call the function to fetch weather data and update map
fetchWeatherDataForMap();

document.addEventListener('DOMContentLoaded', initMap);