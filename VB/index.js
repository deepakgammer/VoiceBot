// ============================
// Gemini Voice Assistant Script
// ============================

// Gemini API setup
const API_KEY = "YOUR_API_KEY"; // 🔒 replace with your real key if you want to test
const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

// Payload template
const payload = {
  contents: [
    { parts: [{ text: "" }] }
  ]
};

// Function to call Gemini API
async function getData(userInput) {
  try {
    payload.contents[0].parts[0].text = userInput;
    const res = await axios.post(URL, payload);
    const aiText = res.data.candidates[0].content.parts[0].text;
    console.log("🤖 AI says:", aiText);
    document.querySelector(".output").innerText = aiText;
    speak(aiText);
  } catch (err) {
    console.error("Error from Gemini:", err);
  }
}

// ============================
// Speech Recognition Setup
// ============================

let recognize = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognize.lang = "en-US";
recognize.interimResults = false;
recognize.maxAlternatives = 1;

// When the mic hears your voice:
recognize.onresult = (event) => {
  const userInput = event.results[0][0].transcript;
  console.log("🎤 You said:", userInput);
  document.querySelector(".output").innerText = "You: " + userInput;
  getData(userInput);
};

// If error occurs:
recognize.onerror = (e) => {
  console.error("Speech error:", e.error);
};

// ============================
// Voice Output Function
// ============================
function speak(text) {
  const utterance = new SpeechSynthesisUtterance();
  utterance.text = text;
  utterance.lang = "en-IN"; // Indian English accent
  window.speechSynthesis.speak(utterance);
}

// ============================
// Button click → Start listening
// ============================
function startListening() {
  console.log("🎙️ Listening...");
  recognize.start();
}
