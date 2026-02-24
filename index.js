const chatInput = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");
const messagesDiv = document.getElementById("messages");

// Replace with your Render backend URL
const BACKEND_URL = "https://friend-ai-backend.onrender.com/";

function addMessage(text, className) {
  const div = document.createElement("div");
  div.className = `message ${className}`;
  div.textContent = text;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

async function sendMessage() {
  const msg = chatInput.value.trim();
  if (!msg) return;

  addMessage(msg, "user-msg");
  chatInput.value = "";

  try {
    const res = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg })
    });

    const data = await res.json();
    addMessage(data.reply, "ai-msg");

    if (data.media && data.mediaType) {
      const mediaEl = document.createElement(data.mediaType);
      mediaEl.src = data.media;
      mediaEl.style.maxWidth = "100%";
      messagesDiv.appendChild(mediaEl);
    }

  } catch (err) {
    addMessage("Connection problem", "ai-msg");
  }
}

sendBtn.addEventListener("click", sendMessage);
chatInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});
