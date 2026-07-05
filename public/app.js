// FAQBot - Azure OpenAI
// Smart FAQ Assistant

const chatForm = document.getElementById('chatForm');
const sendBtn = document.getElementById('sendBtn');
const userInput = document.getElementById('userInput');
const chatBox = document.getElementById('chatBox');
const systemPrompt = document.getElementById('systemPrompt');

// The markup's first message (the bot greeting) is already line "01",
// so new messages start counting up from there.
let lineCount = 1;

function nextLine() {
    lineCount += 1;
    return String(lineCount).padStart(2, '0');
}

// Add message to chat — builds the gutter (line number) + bubble structure
// used by the editor-style chat log.
function addMessage(text, type) {
    const msg = document.createElement('div');
    msg.classList.add('message', type);
    msg.dataset.line = nextLine();

    const gutter = document.createElement('span');
    gutter.classList.add('gutter');
    gutter.textContent = msg.dataset.line;

    const bubble = document.createElement('span');
    bubble.classList.add('bubble');
    if (type === 'loading') bubble.classList.add('dot-flicker');
    bubble.textContent = text;

    msg.appendChild(gutter);
    msg.appendChild(bubble);
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
    return msg;
}

// Send message to Azure OpenAI
async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    // Show user message
    addMessage(message, 'user');
    userInput.value = '';
    sendBtn.disabled = true;

    // Show loading (dots animate via CSS, so no literal "..." here)
    const loadingMsg = addMessage('Thinking', 'loading');

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: message,
                systemPrompt: systemPrompt.value
            })
        });

        const data = await response.json();

        // Remove loading message and reclaim its line number
        chatBox.removeChild(loadingMsg);
        lineCount -= 1;

        if (data.reply) {
            addMessage(data.reply, 'bot');
        } else {
            addMessage('Sorry, something went wrong. Please try again.', 'bot');
        }

    } catch (error) {
        chatBox.removeChild(loadingMsg);
        lineCount -= 1;
        addMessage('Error connecting to server. Please refresh.', 'bot');
    }

    sendBtn.disabled = false;
}

// The Send button and Enter key both submit the form — one listener
// covers both cases and stops the page from reloading on submit.
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    sendMessage();
});