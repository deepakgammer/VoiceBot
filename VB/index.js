// ============================
// Gemini Voice Assistant Script (with backend proxy)
// ============================

// Function to call your Node.js backend (which talks to Gemini)
async function getData(userInput) {
  try {
    // Send to your local server
    const res = await axios.post("http://localhost:3000/api/ask", { userInput });

    // Extract the AI's text response safely
    const aiText =
      res.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from AI.";

    console.log("🤖 AI says:", aiText);

    // Display on page
    document.querySelector(".output").innerText = "🤖 " + aiText;

    // Speak the AI response
    speak(aiText);

  } catch (err) {
    console.error("Error from backend:", err.response?.data || err);
    document.querySelector(".output").innerText =
      "⚠️ Error: " +
      (err.response?.data?.error?.message || "Something went wrong!");
  }
}

// ============================
// Speech Recognition Setup
// ============================

let recognize = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

// Default language (English)
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

// When speech recognition ends automatically
recognize.onend = () => {
  console.log("🎙️ Speech recognition stopped.");
};

// On recognition error
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
  utterance.lang = "en-IN"; // Indian English accent
  utterance.rate = 1;
  utterance.pitch = 1;
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
    document.querySelector(".output").innerText =
      `🌐 Language set to: ${recognize.lang}`;
  });
}

// ✅ Expose startListening() to HTML button
window.startListening = startListening;
