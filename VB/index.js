// ============================
// Gemini Voice Assistant Script
// ============================

// Gemini API setup
const API_KEY = "YOUR_API_KEY"; // 🔒 Replace this with your real API key
const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

// ============================
// Function to call Gemini API
// ============================
async function getData(userInput) {
  try {
    const payload = {
      contents: [
        {
          role: "user", // ✅ Important: Gemini expects a role field
          parts: [{ text: userInput }]
        }
      ]
    };

    // Call Gemini API
    const res = await axios.post(URL, payload);

    // Extract AI response text
    const aiText = res.data.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI.";

    console.log("🤖 AI says:", aiText);

    // Display it on the webpage
    document.querySelector(".output").innerText = "🤖 " + aiText;

    // Speak out loud
    speak(aiText);

  } catch (err) {
    console.error("Error from Gemini:", err.response?.data || err);
    document.querySelector(".output").innerText = "⚠️ Error: " + (err.response?.data?.error?.message || "Something went wrong!");
  }
}

// ============================
// Speech Recognition Setup
// ============================
let recognize = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

// Default language (you can change via dropdown)
recognize.lang = "en-US";
recognize.interimResults = false;
recognize.maxAlternatives = 1;

// When mic hears your voice
recognize.onresult = (event) => {
  const userInput = event.results[0][0].transcript;
  console.log("🎤 You said:", userInput);
  document.querySelector(".output").innerText = "🗣️ You: " + userInput;
  getData(userInput);
};

// On speech recognition error
recognize.onerror = (e) => {
  console.error("Speech error:", e.error);
  document.querySelector(".output").innerText = "⚠️ Speech error: " + e.error;
};

// ============================
// Voice Output Function
// ============================
function speak(text) {
  const utterance = new SpeechSynthesisUtterance();
  utterance.text = text;
  utterance.lang = "en-IN"; // Indian English accent (smooth & clear)
  utterance.rate = 1;       // Normal speed
  utterance.pitch = 1;      // Normal tone
  window.speechSynthesis.speak(utterance);
}

// ============================
// Button click → Start listening
// ============================
function startListening() {
  console.log("🎙️ Listening...");
  document.querySelector(".output").innerText = "🎙️ Listening...";
  recognize.start();
}

// ============================
// Language selector dropdown
// ============================
const languageSelector = document.getElementById("language");
if (languageSelector) {
  languageSelector.addEventListener("change", (e) => {
    recognize.lang = e.target.value;
    console.log("🌐 Language changed to:", recognize.lang);
    document.querySelector(".output").innerText = `🌐 Language set to: ${recognize.lang}`;
  });
}

// ✅ Make startListening available to HTML button
window.startListening = startListening;
