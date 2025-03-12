// Declare recognition only once globally
if (typeof window.recognition === 'undefined') {
    window.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    
    // Enable continuous listening and auto restart
    window.recognition.continuous = false;
    window.recognition.interimResults = false;
    
    window.recognition.onresult = (event) => {
        const command = event.results[0][0].transcript.toLowerCase();
        console.log("Voice Command:", command);

        if (command.includes('weather')) {
            fetchWeather('current location'); // Replace with actual location fetching logic
        }
    };

    window.recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
    };
}

// Voice Command Button
const voiceCommandButton = document.getElementById('voice-command');
if (voiceCommandButton) {
    voiceCommandButton.addEventListener('click', () => {
        window.recognition.start();
    });
}
