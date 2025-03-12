// Utility functions for common tasks

// Format temperature from Kelvin to Celsius
export const kelvinToCelsius = (kelvin) => {
    return Math.round(kelvin - 273.15);
};

// Format timestamps into readable time
export const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString();
};

// Capitalize first letter of a string
export const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

// Check if a response from fetch is ok
export const checkResponse = (response) => {
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return response.json();
};

// Simplified fetch wrapper with error handling
export const fetchJSON = async (url, options = {}) => {
    try {
        const response = await fetch(url, options);
        return checkResponse(response);
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};