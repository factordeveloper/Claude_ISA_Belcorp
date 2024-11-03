document.addEventListener('DOMContentLoaded', function() {
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatWindow = document.getElementById('chat-window');
    const closeChat = document.getElementById('close-chat');
    const messageInput = document.getElementById('message-input');
    const sendMessage = document.getElementById('send-message');
    const chatMessages = document.getElementById('chat-messages');
    const recordButton = document.getElementById('record-button');
    let recognition;

    chatbotToggle.addEventListener('click', function() {
        chatWindow.classList.toggle('show');
    });

    closeChat.addEventListener('click', function() {
        chatWindow.classList.remove('show');
    });

    async function sendUserMessage(message) {
        addMessage(message, 'user-message');

        const response = await fetch('https://backendclaude-production.up.railway.app/ask-claude', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message, user_id: "1" }),
        });

        const data = await response.json();
        const botMessage = data.response;
        addMessage(botMessage, 'bot-message');
        speak(botMessage);
    }

    sendMessage.addEventListener('click', function() {
        const message = messageInput.value.trim();
        if (message) {
            sendUserMessage(message);
            messageInput.value = '';
        }
    });

    function addMessage(message, className) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${className}`;
        messageDiv.textContent = message;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function speak(text) {
        const speech = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(speech);
    }

    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        recognition.lang = 'es-ES';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = function(event) {
            const message = event.results[0][0].transcript;
            sendUserMessage(message);
        };

        recognition.onerror = function(event) {
            console.error('Error en el reconocimiento de voz:', event.error);
        };
    } else {
        console.warn('Speech Recognition no es soportado en este navegador.');
    }

    recordButton.addEventListener('click', function() {
        if (recognition) {
            recognition.start();
            recordButton.textContent = "Detener grabación";
        }
    });
});
