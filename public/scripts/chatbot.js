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
        sendButton.addEventListener('click', async () => {
            const message = chatInput.value.trim();
            if (message) {
                // Handle sending message to chatbot
                const response = await fetch('/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ message })
                });
                const data = await response.json();
                const chatbox = document.getElementById('chatbox');
                chatbox.innerHTML += `<div class="message user">${message}</div>`;
                chatbox.innerHTML += `<div class="message bot">${data.response}</div>`;
                chatInput.value = '';
            } else {
                alert('Please enter a message!');
            }
        });
    }
});
