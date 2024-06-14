document.getElementById('send-btn').addEventListener('click', async function() {
    sendMessage();
});

document.getElementById('chat-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

document.getElementById('open-chatbot-btn').addEventListener('click', function() {
    document.getElementById('chatbot-container').style.display = 'flex';
    document.getElementById('open-chatbot-btn').style.display = 'none';
});

document.getElementById('close-chatbot-btn').addEventListener('click', function() {
    document.getElementById('chatbot-container').style.display = 'none';
    document.getElementById('open-chatbot-btn').style.display = 'block';
});

async function sendMessage() {
    const chatInput = document.getElementById('chat-input');
    const messageText = chatInput.value;

    if (messageText.trim() !== "") {
        // Display user message
        addMessageToChat('user-message', messageText);
        chatInput.value = '';

        // Fetch bot response from Flask server
        const botResponseText = await getChatbotResponse(messageText);

        // Display bot response
        addMessageToChat('bot-message', botResponseText);
    }
}

async function getChatbotResponse(message) {
    const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
    });

    const data = await response.json();
    return data;
}

function addMessageToChat(className, message) {
    const messageContainer = document.createElement('div');
    messageContainer.className = `message ${className}`;

    if (className === 'user-message') {
        const userMessageContainer = document.createElement('div');
        userMessageContainer.className = 'user-message-container';
        messageContainer.innerHTML = message;
        userMessageContainer.appendChild(messageContainer);
        document.querySelector('.chat-body').appendChild(userMessageContainer);
    } else {
        messageContainer.innerHTML = message;
        document.querySelector('.chat-body').appendChild(messageContainer);
    }

    // Auto-scroll to the bottom of the chat
    const chatBody = document.querySelector('.chat-body');
    chatBody.scrollTop = chatBody.scrollHeight;
}
