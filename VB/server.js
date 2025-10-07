import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = "YOUR_API_KEY"; // keep this safe here
const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

app.post("/api/ask", async (req, res) => {
  try {
    const userInput = req.body.userInput;
    const payload = {
      contents: [{ role: "user", parts: [{ text: userInput }] }]
    };

    const response = await axios.post(URL, payload);
    res.json(response.data);
  } catch (err) {
    console.error("Gemini API Error:", err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

app.listen(3000, () => console.log("🚀 Server running on http://localhost:3000"));
