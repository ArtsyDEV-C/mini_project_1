// Initialize map
const map = L.map('map').setView([51.505, -0.09], 13);

// Add tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Add weather data layer
const weatherLayer = L.layerGroup().addTo(map);

// Function to update weather layer
const updateWeatherLayer = (data) => {
    weatherLayer.clearLayers();
    data.forEach(point => {
        L.marker([point.lat, point.lon]).addTo(weatherLayer)
          .bindPopup(`<b>${point.weather}</b><br>${point.temp}°C`);
    });
};

// Example function to fetch weather data and update map
const fetchWeatherDataForMap = async () => {
    const response = await fetch('/api/weather-data');
    const data = await response.json();
    updateWeatherLayer(data);
};

// Call the function to fetch weather data and update map
fetchWeatherDataForMap();