let messages = JSON.parse(localStorage.getItem("messages")) || [];
let recentSearches = JSON.parse(localStorage.getItem("recent")) || [];

const PROXY_URL = "https://your-proxy-url.com/chat"; // change this after deploy

window.onload = () => {
    renderMessages();
    renderRecent();

    document.getElementById("sendBtn").addEventListener("click", sendMessage);
    document.getElementById("userInput").addEventListener("keydown", (e) => {
        if (e.key === "Enter") sendMessage();
    });
};

async function sendMessage() {
    const input = document.getElementById("userInput");
    const text = input.value.trim();
    if (text === "") return;

    addMessage("user", text);
    addRecent(text);
    input.value = "";

    addMessage("bot", "Thinking...");

    try {
        const reply = await getAIResponse(text);
        messages[messages.length - 1].text = reply;
        localStorage.setItem("messages", JSON.stringify(messages));
        renderMessages();
    } catch (e) {
        messages[messages.length - 1].text = "Error talking to AI.";
        localStorage.setItem("messages", JSON.stringify(messages));
        renderMessages();
    }
}

function addMessage(sender, text) {
    messages.push({ sender, text });
    localStorage.setItem("messages", JSON.stringify(messages));
    renderMessages();
}

function renderMessages() {
    const msgBox = document.getElementById("messages");
    msgBox.innerHTML = "";

    messages.forEach(msg => {
        const div = document.createElement("div");
        div.className = `message ${msg.sender}`;
        div.textContent = msg.text;
        msgBox.appendChild(div);
    });

    msgBox.scrollTop = msgBox.scrollHeight;
}

function addRecent(text) {
    recentSearches.unshift(text);
    recentSearches = recentSearches.slice(0, 10);
    localStorage.setItem("recent", JSON.stringify(recentSearches));
    renderRecent();
}

function renderRecent() {
    const list = document.getElementById("recentList");
    list.innerHTML = "";

    recentSearches.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        list.appendChild(li);
    });
}

async function getAIResponse(prompt) {
    const res = await fetch(PROXY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt })
    });

    const data = await res.json();
    return data.reply;
}
