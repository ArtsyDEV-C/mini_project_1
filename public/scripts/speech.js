// Example using Web Speech API
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.onresult = (event) => {
    const command = event.results[0][0].transcript;
    if (command.includes('weather')) {
        fetchWeather('current location');
    }
};

const voiceCommandButton = document.getElementById('voice-command');
if (voiceCommandButton) {
    voiceCommandButton.addEventListener('click', () => {
        recognition.start();
    });
}