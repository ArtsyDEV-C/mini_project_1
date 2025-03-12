// Ensure recognition is declared only once
if (typeof recognition === 'undefined') {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.onresult = (event) => {
        const command = event.results[0][0].transcript;
        if (command.includes('weather')) {
            fetchWeather('current location');
        }
    };
}

// Voice Command Button
const voiceCommandButton = document.getElementById('voice-command');
if (voiceCommandButton) {
    voiceCommandButton.addEventListener('click', () => {
        recognition.start();
    });
}