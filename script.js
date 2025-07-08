class BeastVoiceAssistant {
  constructor() {
    this.isListening = false
    this.isSpeaking = false
    this.recognition = null
    this.synth = window.speechSynthesis
    this.audioContext = null
    this.analyser = null
    this.animationFrame = null

    this.initializeElements()
    this.initializeSpeechRecognition()
    this.initializeEventListeners()
    this.startClock()
    this.createBackgroundParticles()
    this.setupCleanup()
  }

  initializeElements() {
    this.speakBtn = document.getElementById("speakBtn")
    this.stopSpeakingBtn = document.getElementById("stopSpeakingBtn")
    this.transcript = document.getElementById("transcript")
    this.statusBadge = document.getElementById("statusBadge")
    this.voiceCircle = document.getElementById("voiceCircle")
    this.micIcon = document.getElementById("micIcon")
    this.audioBars = document.getElementById("audioBars")
    this.answerBox = document.getElementById("answerBox")
    this.answerText = document.getElementById("answerText")
    this.answerImage = document.getElementById("answerImage")
    this.articleLink = document.getElementById("articleLink")
    this.currentTime = document.getElementById("currentTime")
    this.currentDate = document.getElementById("currentDate")
  }

  initializeSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition()
      this.recognition.lang = "en-US"
      this.recognition.continuous = false
      this.recognition.interimResults = false

      this.recognition.onresult = (event) => {
        const speech = event.results[0][0].transcript.toLowerCase()
        this.transcript.textContent = `🗣️ You said: ${speech}`
        this.stopListening()
        this.respondToCommand(speech)
      }

      this.recognition.onerror = (event) => {
        this.stopListening()
        console.error("Speech recognition error:", event.error)
        this.transcript.textContent = "❌ Error occurred. Try again."
      }

      this.recognition.onend = () => {
        this.stopListening()
      }
    }
  }

  initializeEventListeners() {
    this.speakBtn.addEventListener("click", () => {
      if (this.isListening) {
        this.stopListening()
      } else {
        this.startListening()
      }
    })

    this.stopSpeakingBtn.addEventListener("click", () => {
      this.stopSpeaking()
    })

    // Quick command buttons
    document.querySelectorAll(".command-item").forEach((item) => {
      item.addEventListener("click", () => {
        const command = item.getAttribute("data-command")
        this.respondToCommand(command)
      })
    })

    // Keyboard shortcuts
    document.addEventListener("keydown", (event) => {
      if (event.key === " " && event.ctrlKey) {
        event.preventDefault()
        if (this.isListening) {
          this.stopListening()
        } else {
          this.startListening()
        }
      }
      if (event.key === "Escape") {
        this.stopSpeaking()
        this.stopListening()
      }
    })
  }

  async startListening() {
    if (!this.recognition) {
      this.transcript.textContent = "❌ Speech recognition not supported"
      return
    }

    try {
      // Request microphone access for audio visualization
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      this.setupAudioVisualization(stream)

      this.isListening = true
      this.updateUI()
      this.transcript.textContent = "🎧 Listening..."
      this.recognition.start()
    } catch (error) {
      console.error("Microphone access denied:", error)
      this.transcript.textContent = "❌ Microphone access required"
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop()
    }
    this.isListening = false
    this.updateUI()
    this.stopAudioVisualization()
  }

  setupAudioVisualization(stream) {
    try {
      this.audioContext = new AudioContext()
      this.analyser = this.audioContext.createAnalyser()
      const source = this.audioContext.createMediaStreamSource(stream)
      source.connect(this.analyser)

      this.analyser.fftSize = 256
      const bufferLength = this.analyser.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)

      const updateAudioLevel = () => {
        if (this.analyser && this.isListening) {
          this.analyser.getByteFrequencyData(dataArray)
          const average = dataArray.reduce((a, b) => a + b) / bufferLength
          this.updateAudioBars(average)
          this.animationFrame = requestAnimationFrame(updateAudioLevel)
        }
      }

      updateAudioLevel()
    } catch (error) {
      console.error("Audio visualization setup failed:", error)
    }
  }

  updateAudioBars(level) {
    const bars = this.audioBars.querySelectorAll(".bar")
    bars.forEach((bar, index) => {
      const height = Math.max(8, (level / 255) * 48 + Math.random() * 12)
      bar.style.height = `${height}px`
      bar.style.animationDelay = `${index * 0.1}s`
    })
  }

  stopAudioVisualization() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame)
    }
    if (this.audioContext && this.audioContext.state !== "closed") {
      this.audioContext.close()
    }
  }

  speak(text) {
    if (!this.synth) {
      console.error("Speech synthesis not supported")
      return
    }

    const cleanText = text
      .replace(/[^a-zA-Z0-9.,?'"!:\-()\s]/g, "")
      .replace(/\s+/g, " ")
      .trim()

    if (!cleanText) return

    const utterance = new SpeechSynthesisUtterance(cleanText)
    utterance.lang = "en-US"
    utterance.rate = 1
    utterance.pitch = 1

    utterance.onstart = () => {
      this.isSpeaking = true
      this.updateUI()
      this.showStopSpeakingButton()
    }

    utterance.onend = () => {
      this.isSpeaking = false
      this.updateUI()
      this.hideStopSpeakingButton()
    }

    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event.error)
      this.isSpeaking = false
      this.updateUI()
      this.hideStopSpeakingButton()
    }

    this.synth.speak(utterance)
  }

  stopSpeaking() {
    if (this.synth) {
      this.synth.cancel()
    }
    this.isSpeaking = false
    this.updateUI()
    this.hideStopSpeakingButton()
  }

  updateUI() {
    // Update voice circle
    this.voiceCircle.className = "voice-circle"
    if (this.isListening) {
      this.voiceCircle.classList.add("listening")
      this.micIcon.className = "fas fa-microphone"
    } else if (this.isSpeaking) {
      this.voiceCircle.classList.add("speaking")
      this.micIcon.className = "fas fa-volume-up"
    } else {
      this.micIcon.className = "fas fa-microphone-slash"
    }

    // Update status badge
    if (this.isListening) {
      this.statusBadge.textContent = "🎧 Listening..."
      this.statusBadge.className = "status-badge listening"
    } else if (this.isSpeaking) {
      this.statusBadge.textContent = "🗣️ Speaking..."
      this.statusBadge.className = "status-badge speaking"
    } else {
      this.statusBadge.textContent = "💤 Idle"
      this.statusBadge.className = "status-badge"
    }

    // Update button
    if (this.isListening) {
      this.speakBtn.innerHTML = '<i class="fas fa-microphone-slash"></i><span>Stop Listening</span>'
      this.speakBtn.className = "primary-btn listening"
    } else {
      this.speakBtn.innerHTML = '<i class="fas fa-microphone"></i><span>Start Listening</span>'
      this.speakBtn.className = "primary-btn"
    }

    this.speakBtn.disabled = this.isSpeaking
  }

  showStopSpeakingButton() {
    this.stopSpeakingBtn.style.display = "flex"
  }

  hideStopSpeakingButton() {
    this.stopSpeakingBtn.style.display = "none"
  }

  respondToCommand(cmd) {
    this.hideAnswerBox()

    if (cmd.includes("hello") || cmd.includes("hi")) {
      this.speak("Hey there! I'm BEAST, your advanced voice assistant. How can I help you today?")
    } else if (cmd.includes("how are you")) {
      this.speak("I'm feeling sharp and ready to assist you!")
    } else if (cmd.includes("what's up") || cmd.includes("what are you doing")) {
      this.speak("Just chilling in the code. Ready to help!")
    } else if (cmd.includes("time")) {
      const now = new Date()
      this.speak(`It's ${now.toLocaleTimeString()}`)
    } else if (cmd.includes("date") || cmd.includes("day")) {
      const today = new Date()
      this.speak(`Today is ${today.toDateString()}`)
    } else if (cmd.includes("open google")) {
      this.speak("Opening Google for you.")
      window.open("https://www.google.com", "_blank")
    } else if (cmd.includes("open gmail")) {
      this.speak("Opening Gmail.")
      window.open("https://mail.google.com", "_blank")
    } else if (cmd.includes("open youtube")) {
      this.speak("Opening YouTube.")
      window.open("https://youtube.com", "_blank")
    } else if (cmd.includes("open whatsapp")) {
      this.speak("Opening WhatsApp Web.")
      window.open("https://web.whatsapp.com", "_blank")
    } else if (cmd.includes("open instagram")) {
      this.speak("Opening Instagram.")
      window.open("https://www.instagram.com", "_blank")
    } else if (cmd.includes("open facebook")) {
      this.speak("Opening Facebook.")
      window.open("https://www.facebook.com", "_blank")
    } else if (cmd.includes("open linkedin")) {
      this.speak("Opening LinkedIn.")
      window.open("https://www.linkedin.com", "_blank")
    } else if (cmd.includes("open chat gpt") || cmd.includes("open chatgpt")) {
      this.speak("Opening ChatGPT.")
      window.open("https://chat.openai.com", "_blank")
    } else if (cmd.includes("open twitter") || cmd.includes("open x")) {
      this.speak("Opening Twitter.")
      window.open("https://twitter.com", "_blank")
    } else if (cmd.startsWith("search for")) {
      const query = cmd.replace("search for", "").trim()
      if (query) {
        this.speak(`Searching Google for ${query}`)
        window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, "_blank")
      } else {
        this.speak("What do you want me to search?")
      }
    } else if (cmd.startsWith("search about")) {
      const query = cmd.replace("search about", "").trim()
      if (query.length > 0) {
        this.speak(`Searching Google for ${query}.`)
        window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, "_blank")
      } else {
        this.speak("Please tell me what to search about.")
      }
    } else if (cmd.startsWith("play")) {
      const query = cmd.replace("play", "").trim()
      if (query) {
        const formattedQuery = encodeURIComponent(query + " song")
        const searchUrl = `https://www.youtube.com/results?search_query=${formattedQuery}`
        this.speak(`Searching YouTube for ${query}.`)
        window.open(searchUrl, "_blank")
      } else {
        this.speak("Please tell me which song to search for.")
      }
    } else if (cmd.includes("joke")) {
      const jokes = [
        "Why do programmers prefer dark mode? Because light attracts bugs!",
        "Why was the JavaScript developer sad? Because he didn't know how to 'null' his feelings.",
        "Why do Python developers wear glasses? Because they can't C.",
        "I would tell you a UDP joke, but you might not get it.",
        "How do you comfort a JavaScript bug? You console it.",
        "What's a programmer's favorite hangout place? The Foo Bar.",
        "Why don't bachelors like Git? Because they are afraid to commit.",
        "How do you make a website laugh? Give it some good CSS styling.",
        "Why did the programmer quit his job? Because he didn't get arrays.",
        "Why was the developer broke? Because he used up all his cache.",
        "How do functions break up? They stop calling each other.",
        "A SQL query walks into a bar, walks up to two tables and asks: 'Can I join you?'",
      ]
      const randomJoke = jokes[Math.floor(Math.random() * jokes.length)]
      this.speak(randomJoke)
    } else if (cmd.includes("weather")) {
      this.speak("Opening weather forecast.")
      window.open("https://www.google.com/search?q=weather", "_blank")
    } else if (cmd.includes("fact")) {
      const facts = [
        "Honey never spoils. Archaeologists have found edible honey in ancient Egyptian tombs.",
        "Bananas are berries, but strawberries are not.",
        "Octopuses have three hearts and blue blood.",
        "The Eiffel Tower can grow more than 6 inches during hot days.",
        "You blink about 20 times per minute, over 10 million times a year.",
        "The moon has moonquakes.",
        "A group of flamingos is called a 'flamboyance'.",
        "Sharks existed before trees.",
        "Hot water freezes faster than cold water. It's called the Mpemba effect.",
        "Wombat poop is cube-shaped.",
        "Oxford University is older than the Aztec Empire.",
        "There are more stars in the universe than grains of sand on Earth.",
        "The heart of a blue whale is as big as a small car.",
        "Human DNA is about 60% the same as a banana.",
      ]
      this.speak(facts[Math.floor(Math.random() * facts.length)])
    } else if (cmd.startsWith("who is") || cmd.startsWith("what is")) {
      const topic = cmd.replace("who is", "").replace("what is", "").trim()
      if (topic.length > 0) {
        this.speak(`Let me search for information about ${topic}.`)
        this.searchWikipedia(topic)
      } else {
        this.speak("Please say who or what you want me to search.")
      }
    } else if (cmd.includes("your name")) {
      this.speak("I'm BEAST – Brilliant Executive Assistant with Speech Technology.")
    } else if (cmd.includes("are you intelligent")) {
      this.speak("I've been trained by the best – Google and JavaScript!")
    } else if (cmd.includes("are you real")) {
      this.speak("As real as your Wi-Fi connection.")
    } else if (cmd.includes("what is life")) {
      this.speak("That's deep. I'd say... a series of voice commands.")
    } else if (cmd.includes("meaning of life")) {
      this.speak("42. At least according to Hitchhiker's Guide to the Galaxy!")
    } else if (cmd.includes("do you like me")) {
      this.speak("Of course! You're my favorite human.")
    } else if (cmd.includes("something interesting")) {
      this.speak("Did you know that octopuses have three hearts?")
    } else if (cmd.includes("goodbye") || cmd.includes("bye")) {
      this.speak("Catch you later! Stay awesome.")
    } else if (cmd.includes("see you later")) {
      this.speak("Later, legend!")
    } else if (cmd.includes("stop listening") || cmd.includes("exit")) {
      this.speak("Okay, signing off. Call me when you need me!")
    } else if (cmd.includes("clear")) {
      this.clearScreen()
      this.speak("Screen cleared.")
    } else if (cmd.includes("help") || cmd.includes("what can you do")) {
      this.speak(
        "I can tell you the time, date, jokes, facts, open websites, search Google, play music on YouTube, and answer questions using Wikipedia. Just ask me!",
      )
    } else if (cmd.includes("volume up")) {
      this.speak("I can't control system volume, but you can adjust it in your device settings.")
    } else if (cmd.includes("volume down")) {
      this.speak("I can't control system volume, but you can adjust it in your device settings.")
    } else {
      this.speak("I didn't quite understand that. Try asking me about the time, weather, or say 'tell me a joke'!")
    }
  }

  searchWikipedia(topic) {
    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`)
      .then((response) => {
        if (!response.ok) throw new Error("Wikipedia fetch failed")
        return response.json()
      })
      .then((data) => {
        if (data.extract) {
          this.showAnswerBox(data.extract, data.thumbnail?.source, data.content_urls?.desktop?.page)
          this.speak(data.extract.split(".")[0])
        } else {
          this.speak("Sorry, I couldn't find any information about that.")
        }
      })
      .catch((error) => {
        this.speak("There was an error getting the information.")
        console.error("Wikipedia Error:", error)
      })
  }

  showAnswerBox(text, imageUrl, articleUrl) {
    this.answerText.textContent = text

    if (imageUrl) {
      this.answerImage.src = imageUrl
      this.answerImage.style.display = "block"
      this.answerImage.onclick = () => {
        if (articleUrl) window.open(articleUrl, "_blank")
      }
    } else {
      this.answerImage.style.display = "none"
    }

    if (articleUrl) {
      const link = this.articleLink.querySelector("a")
      link.href = articleUrl
      this.articleLink.style.display = "block"
    } else {
      this.articleLink.style.display = "none"
    }

    this.answerBox.style.display = "block"
  }

  hideAnswerBox() {
    this.answerBox.style.display = "none"
  }

  clearScreen() {
    this.transcript.textContent = "Say something..."
    this.hideAnswerBox()
  }

  startClock() {
    const updateTime = () => {
      const now = new Date()
      this.currentTime.textContent = now.toLocaleTimeString()
      this.currentDate.textContent = now.toLocaleDateString()
    }

    updateTime()
    setInterval(updateTime, 1000)
  }

  createBackgroundParticles() {
    const particlesContainer = document.querySelector(".background-particles")

    for (let i = 0; i < 15; i++) {
      const particle = document.createElement("div")
      particle.style.position = "absolute"
      particle.style.width = "6px"
      particle.style.height = "6px"
      particle.style.background = "#60a5fa"
      particle.style.borderRadius = "50%"
      particle.style.left = Math.random() * 100 + "%"
      particle.style.top = Math.random() * 100 + "%"
      particle.style.animation = `float ${2 + Math.random() * 3}s ease-in-out infinite`
      particle.style.animationDelay = Math.random() * 2 + "s"
      particle.style.opacity = "0.7"

      particlesContainer.appendChild(particle)
    }
  }

  setupCleanup() {
    // Cleanup on page unload to prevent memory leaks
    window.addEventListener("beforeunload", () => {
      this.stopListening()
      this.stopSpeaking()
      this.stopAudioVisualization()
    })

    // Handle visibility change to pause when tab is not active
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.stopListening()
      }
    })
  }
}

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new BeastVoiceAssistant()
})
