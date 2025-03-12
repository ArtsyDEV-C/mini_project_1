document.addEventListener('DOMContentLoaded', () => {
    const mapElement = document.getElementById('map');

    if (!mapElement) return;

    // Initialize map
    const map = L.map('map').setView([20.5937, 78.9629], 5); // Example coordinates (India)

    // Load and display tile layers from OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Fetch and display weather data on the map
    async function fetchWeatherAndUpdateMap(city) {
        try {
            const response = await fetch(`/api/weather/${city}`);
            if (!response.ok) throw new Error('Failed to fetch weather data');

            const data = await response.json();
            const { coord, weather, main, name } = data;

            // Add marker with weather information
            const marker = L.marker([coord.lat, coord.lon]).addTo(map);
            marker.bindPopup(`
                <b>${name}</b><br>
                Weather: ${weather[0].description}<br>
                Temp: ${Math.round(main.temp - 273.15)}°C
            `).openPopup();

            // Center map on the marker
            map.setView([coord.lat, coord.lon], 10);
        } catch (error) {
            console.error('Map Weather Fetch Error:', error);
        }
    }

    // Example city, replace with dynamic input if needed
    fetchWeatherAndUpdateMap('Delhi');
});