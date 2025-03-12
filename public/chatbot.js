document.addEventListener('DOMContentLoaded', () => {
    const chatBubble = document.getElementById('chat-bubble');
    const chatContainer = document.getElementById('chat-container');
    const sendButton = document.getElementById('send-btn');
    const chatInput = document.getElementById('chat-input');

    if (chatBubble) {
        chatBubble.addEventListener('click', () => {
            chatContainer.classList.toggle('active');
        });
    }

    if (sendButton) {
        sendButton.addEventListener('click', () => {
            const message = chatInput.value.trim();
            if (message) {
                // Handle sending message to chatbot
                chatInput.value = '';
            } else {
                alert('Please enter a message!');
            }
        });
    }
});
