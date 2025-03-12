document.addEventListener('DOMContentLoaded', () => {
    const chatBubble = document.getElementById('chat-bubble');
    const chatContainer = document.getElementById('chat-container');
    const sendButton = document.getElementById('send-btn');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');

    // Toggle chat window visibility
    chatBubble.addEventListener('click', () => {
        chatContainer.classList.toggle('active');
    });

    // Send message on click or Enter key
    const sendMessage = async () => {
        const message = chatInput.value.trim();
        if (!message) return;

        // Display user message
        const userMessage = document.createElement('div');
        userMessage.className = 'message user';
        userMessage.textContent = message;
        chatMessages.appendChild(userMessage);

        chatInput.value = '';

        // Fetch response from chatbot backend
        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });
            const data = await response.json();

            const botMessage = document.createElement('div');
            botMessage.className = 'message bot';
            botMessage.textContent = data.response;
            chatMessages.appendChild(botMessage);

            chatMessages.scrollTop = chatMessages.scrollHeight;
        } catch (error) {
            console.error('Error fetching chatbot response:', error);
        }
    };

    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
});
