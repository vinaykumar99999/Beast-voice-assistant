# 🎙️ BEAST - Browser-Based Voice Assistant

BEAST is an interactive **browser-based voice assistant** built with **HTML**, **CSS**, and **JavaScript**. It uses the **Web Speech API** for speech recognition and text-to-speech, allowing you to control tasks and search information with simple voice commands.

---
## 🌐 Live Demo

👉 [Try BEAST here!](https://beast-voice-assistant.netlify.app/)

---

## 🧩 **Project Overview**

This project demonstrates how modern browsers can be turned into an intelligent personal assistant without any external server or heavy backend. BEAST listens to your commands, performs actions like opening websites, telling you the time, telling jokes or facts, searching Wikipedia, and displays results in a clean, responsive UI — with a modern background image.

---

## 🔍 **Key Features**

✅ Voice recognition with the **Web Speech API**  
✅ Natural speech responses with **Speech Synthesis**  
✅ Search Wikipedia summaries with images and display them in a card  
✅ Open popular websites like **YouTube**, **WhatsApp**, **Facebook**, **Instagram**, **LinkedIn**  
✅ Search songs on YouTube directly  
✅ Tell jokes and interesting facts  
✅ Display the spoken text with a typing effect  
✅ Set alarms (basic placeholder logic)  
✅ Clean, simple UI with background image and overlay for readability

---

## 🗣️ **Supported Voice Commands**

Here are some examples of what you can say:

### 🔹 **General Commands**
- **“What’s the time?”** — Tells the current time.
- **“Tell me a joke”** — Tells a random joke.
- **“Tell me a fact”** — Shares a fun fact.

### 🔹 **Wikipedia Search**
- **“Who is [person]?”** — Searches for the person on Wikipedia, shows their image and summary.
  - E.g., “Who is Albert Einstein?”

(*By design, Wikipedia results are displayed on screen but NOT spoken.*)

### 🔹 **YouTube & Google Search**
- **“Play [song]”** — Searches the song on YouTube.
  - E.g., “Play Shape of You”
- **“Search for [query]”** — Searches your query on Google.

### 🔹 **Open Popular Websites**
- **“Open YouTube”**
- **“Open WhatsApp”**
- **“Open Facebook”**
- **“Open Instagram”**
- **“Open LinkedIn”**
- **“Open Chrome”** (opens your Chrome app if used in desktop environment)

### 🔹 **Other**
- **“Set alarm for [time]”** — Sets a simple alarm (placeholder in JS).
- **“Stop” or “Exit”** — Ends the assistant session.

---

## ⚙️ **How It Works**

- **Speech Recognition**: Uses the **Web Speech API** to capture your microphone input and convert it into text in real-time.
- **Command Handler**: The spoken text is matched against a set of `if/else` conditions to detect what task you want.
- **Actions**: Depending on the command, it:
  - Speaks a response using `SpeechSynthesisUtterance`
  - Opens a new browser tab for sites like YouTube, WhatsApp, Facebook, etc.
  - Fetches Wikipedia summary using the MediaWiki API (or `fetch`) and shows it in a custom card with an image and a link to the full article.
- **Typing Effect**: For every spoken response, the same text appears on screen with a typing animation for a more human-like feel.
- **Background**: A static background image with a semi-transparent overlay to keep text readable.

---

## 🛠️ **Technologies Used**

- ✅ **HTML5**
- ✅ **CSS3** (for styling and background image)
- ✅ **JavaScript (Vanilla)** (for logic, speech recognition, API calls)
- ✅ **Web Speech API** (Speech Recognition + Speech Synthesis)
- ✅ **Wikipedia REST API** (fetching summaries and images)

---

## 📂 **Project Structure**

```plaintext
/beast-voice-assistant
 ├── index.html          # Main HTML file
 ├── style.css           # Stylesheet (background image, layout)
 ├── script.js           # Core logic and command handler
 ├── images/
 │    └── background.jpg # Background image
