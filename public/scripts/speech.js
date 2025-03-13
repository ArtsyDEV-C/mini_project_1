document.addEventListener('DOMContentLoaded', () => {
    const speakButton = document.getElementById('speak-btn');

    if (!speakButton || !('speechSynthesis' in window)) {
        console.warn('Speech synthesis not supported or speak button not found.');
        return;
    }

    const speakWeather = () => {
        const weatherDescription = document.getElementById('weather-description').textContent;
        const temperature = document.getElementById('weather-temperature').textContent;
        const cityName = document.getElementById('city-name').textContent;

        const message = `Currently in ${cityName}, the weather is ${weatherDescription} with a temperature of ${temperature}.`;

        const utterance = new SpeechSynthesisUtterance(message);
        utterance.rate = 1;
        utterance.pitch = 1;

        window.speechSynthesis.speak(utterance);
    };

    speakButton.addEventListener('click', speakWeather);

    // Voice recognition for weather search
    if (typeof window !== "undefined" && !window.recognition) {
        window.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        window.recognition.lang = "en-US";

        window.recognition.onresult = (event) => {
            const command = event.results[0][0].transcript;
            console.log("Speech recognized:", command);
            // Add logic to handle the recognized speech command
        };
    }
});
