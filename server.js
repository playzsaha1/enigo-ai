const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = "AIzaSyDvgb2GdskkoWwPxDw5mnbW5U1MAZW73bg";

app.post("/chat", async (req, res) => {
    const userMessage = req.body.message;

    try {
        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + API_KEY,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [{ text: userMessage }]
                        }
                    ]
                })
            }
        );

        const data = await response.json();
        const reply =
            data.candidates?.[0]?.content?.parts?.[0]?.text ||
            "Sorry, I couldn't understand that.";

        res.json({ reply });
    } catch (err) {
        console.error(err);
        res.status(500).json({ reply: "Error talking to Gemini API." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
