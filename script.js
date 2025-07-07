const speakBtn = document.getElementById("speakBtn");
const transcriptEl = document.getElementById("transcript");


const synth = window.speechSynthesis;
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = "en-US";
recognition.continuous = false;

speakBtn.onclick = () => {
  recognition.start();
  transcriptEl.textContent = "🎧 Listening...";
};

recognition.onresult = (event) => {
  const speech = event.results[0][0].transcript.toLowerCase();
  transcriptEl.textContent = `🗣️ You said: ${speech}`;
  respondToCommand(speech);
};

function cleanText(text) {
  return text
    .replace(/[^a-zA-Z0-9.,?'"!:\-()\s]/g, "")  // allow only normal chars
    .replace(/\s+/g, " ")                      // collapse extra spaces/newlines
    .trim();                                   // remove leading/trailing spaces
}


function speak(text) {
  const clean = cleanText(text);

  const utterance = new SpeechSynthesisUtterance(clean);
  // your voice settings...

  window.speechSynthesis.speak(utterance);

  // Typewriter effect
  const displayElement = document.getElementById("assistantSpeech");
  displayElement.textContent = "🧠 BEAST: ";
  let i = 0;

  function typeWriter() {
    if (i < clean.length) {
      displayElement.textContent += clean.charAt(i);
      i++;
      setTimeout(typeWriter, 30);
    }
  }

  typeWriter();
}




function respondToCommand(cmd) {

  if (cmd.includes("hello") || cmd.includes("hi")) {
    speak("Hey there! I'm BEAST, at your service.");
  }

  // How are you
  else if (cmd.includes("how are you")) {
    speak("I'm feeling sharp and ready to assist you!");
  }

  // What's up
  else if (cmd.includes("what's up") || cmd.includes("what are you doing")) {
    speak("Just chilling in the code. Ready to help!");
  }

  // Time
  else if (cmd.includes("time")) {
    const now = new Date();
    speak(`It's ${now.toLocaleTimeString()}`);
  }

  // Date
  else if (cmd.includes("date") || cmd.includes("day")) {
    const today = new Date();
    speak(`Today is ${today.toDateString()}`);
  } else if (cmd.includes("open google")) {
  speak("Opening Google.");
  window.open("https://www.google.com", "_blank");
  } else if (cmd.includes("open gmail")) {
  speak("Opening Gmail.");
  window.open("https://mail.google.com", "_blank");
  } 



  // Open YouTube
  else if (cmd.includes("open youtube")) {
    speak("Opening YouTube.");
    window.open("https://youtube.com", "_blank");
  }

  // Google Search
  else if (cmd.startsWith("search for")) {
    const query = cmd.replace("search for", "").trim();
    if (query) {
      speak(`Searching Google for ${query}`);
      const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      window.open(url, "_blank");
    } else {
      speak("What do you want me to search?");
    }
  }

  // Tell a joke
  else if (cmd.includes("joke")) {
  const jokes = [
    "Why do programmers prefer dark mode? Because light attracts bugs!",
    "Why was the JavaScript developer sad? Because he didn’t know how to 'null' his feelings.",
    "Why do Python developers wear glasses? Because they can't C.",
    "I would tell you a UDP joke, but you might not get it.",
    "How do you comfort a JavaScript bug? You console it.",
    "What's a programmer's favorite hangout place? The Foo Bar.",
    "Why don’t bachelors like Git? Because they are afraid to commit.",
    "How do you make a website laugh? Give it some good CSS styling.",
    "Why did the programmer quit his job? Because he didn’t get arrays.",
    "Why was the developer broke? Because he used up all his cache.",
    "How do functions break up? They stop calling each other.",
    "A SQL query walks into a bar, walks up to two tables and asks: 'Can I join you?'",
    "Why did the programmer go broke? Because he used up all his resources."
  ];
  const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
  speak(randomJoke);
  } else if (cmd.includes("weather")) {
  speak("Opening weather forecast.");
  window.open("https://www.google.com/search?q=weather", "_blank");
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
    "The longest hiccuping spree lasted 68 years."
  ];

  speak(facts[Math.floor(Math.random() * facts.length)]);
  } else if (cmd.includes("open chat gpt")) {
  speak("Opening ChatGPT.");
  window.open("https://chat.openai.com", "_blank");
  }  // === Open WhatsApp ===
  else if (cmd.includes("open whatsapp")) {
    speak("Opening WhatsApp Web.");
    window.open("https://web.whatsapp.com", "_blank");
  }

  // === Open Instagram ===
  else if (cmd.includes("open instagram")) {
    speak("Opening Instagram.");
    window.open("https://www.instagram.com", "_blank");
  }

  // === Open Facebook ===
  else if (cmd.includes("open facebook")) {
    speak("Opening Facebook.");
    window.open("https://www.facebook.com", "_blank");
  }

  // === Open LinkedIn ===
  else if (cmd.includes("open linkedin")) {
    speak("Opening LinkedIn.");
    window.open("https://www.linkedin.com", "_blank");
  }

  // Something interesting
  else if (cmd.includes("something interesting")) {
    speak("Did you know that octopuses have three hearts?");
  }

  // Do you like me
  else if (cmd.includes("do you like me")) {
    speak("Of course! You're my favorite human.");
  }

  // What's your name
  else if (cmd.includes("your name")) {
    speak("I'm BEAST – Brilliant Executive Assistant with Speech Technology.");
  }

  // Are you intelligent
  else if (cmd.includes("are you intelligent")) {
    speak("I’ve been trained by the best – Google and JavaScript!");
  }

  // Are you real
  else if (cmd.includes("are you real")) {
    speak("As real as your Wi-Fi connection.");
  }

  // What is life
  else if (cmd.includes("what is life")) {
    speak("That’s deep. I’d say... a series of voice commands.");
  }

  // What's the meaning of life
  else if (cmd.includes("meaning of life")) {
    speak("42. At least according to Hitchhiker’s Guide to the Galaxy!");
  }

  // Goodbye / Exit
  else if (cmd.includes("goodbye") || cmd.includes("bye")) {
    speak("Catch you later! Stay awesome.");
  }

  else if (cmd.includes("see you later")) {
    speak("Later, legend!");
  }

  else if (cmd.includes("stop listening") || cmd.includes("exit")) {
    speak("Okay, signing off. Call me when you need me!");
  }

  else if (cmd.startsWith("search about")) {
  const query = cmd.replace("search about", "").trim();

  if (query.length > 0) {
    speak(`Searching Google for ${query}.`);
    const searchURL = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    window.open(searchURL, "_blank");
  } else {
    speak("Please tell me what to search about.");
  }
  }

  else if (cmd.includes("hello") || cmd.includes("hi")) {
    speak("Hey there! I'm BEAST, your voice assistant.");
  } else if (cmd.includes("time")) {
    const now = new Date();
    speak(`It's ${now.toLocaleTimeString()}`);
  } else if (cmd.includes("open whatsapp")) {
  speak("Opening WhatsApp Web.");
  window.open("https://web.whatsapp.com", "_blank");
  } else if (cmd.includes("open youtube")) {
    speak("Opening YouTube");
    window.open("https://youtube.com", "_blank");
  } else if (cmd.includes("search for")) {
    const query = cmd.replace("search for", "").trim();
    speak(`Searching for ${query}`);
    window.open(`https://www.google.com/search?q=${query}`, "_blank");
  } else if (cmd.startsWith("play")) {
  const query = cmd.replace("play", "").trim();
  if (query) {
    const formattedQuery = encodeURIComponent(query + " song");
    const searchUrl = `https://www.youtube.com/results?search_query=${formattedQuery}`;
    speak(`Searching YouTube for ${query}.`);
    window.open(searchUrl, "_blank");
  } else {
    speak("Please tell me which song to search for.");
  }
}

// ------------------------
// ✅ Personal Reminders
// Example: "Remind me to drink water in 5 minutes"
// ------------------------
else if (cmd.includes("remind me to")) {

  // Use regex to extract task and time
  const reminderRegex = /remind me to (.+) in (\d+) (second|seconds|minute|minutes|hour|hours)/;
  const match = cmd.match(reminderRegex);

  if (match) {
    const task = match[1].trim();   // e.g., "drink water"
    const amount = parseInt(match[2]); // e.g., 5
    const unit = match[3];             // e.g., "minutes"

    let delay = 0;

    // Convert time to milliseconds
    if (unit.startsWith("second")) {
      delay = amount * 1000;
    } else if (unit.startsWith("minute")) {
      delay = amount * 60 * 1000;
    } else if (unit.startsWith("hour")) {
      delay = amount * 60 * 60 * 1000;
    }

    // Only set reminder if time is valid
    if (delay > 0) {
      // Confirm to the user
      speak(`Okay! I’ll remind you to ${task} in ${amount} ${unit}.`);

      // Use setTimeout to trigger reminder
      setTimeout(() => {
        speak(`Hey! This is your reminder: ${task}`);
      }, delay);

    } else {
      speak("I didn't catch the time for the reminder.");
    }

  } else {
    // If format is wrong
    speak("Please say something like: Remind me to drink water in 5 minutes.");
  }
  }

// ------------------------
// ✅ News Headlines (Tell me the latest news)
// ------------------------
else if (cmd.includes("news")) {
  // Let the user know BEAST is fetching news
  speak("Getting the latest news for you...");

  const apiKey = "30e012a096854519b39d55e83100f117"; // ✅ Replace with your real NewsAPI key
  const url = `https://newsapi.org/v2/top-headlines?country=in&apiKey=${apiKey}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.status === "ok") {
        const articles = data.articles.slice(0, 5); // Top 5 headlines
        let displayText = "📰 Latest News:\n";

        // 🗣️ This function speaks headlines *one by one*
        function speakHeadlines(index) {
          if (index < articles.length) {
            const headline = articles[index].title;
            displayText += `${index + 1}. ${headline}\n`;

            // Use SpeechSynthesisUtterance directly for better control
            const utterance = new SpeechSynthesisUtterance(`Headline ${index + 1}: ${headline}`);
            utterance.lang = "en-US"; // or "en-IN" if you want an Indian accent
            utterance.rate = 1;

            utterance.onend = () => {
              // When one finishes, speak next
              speakHeadlines(index + 1);
            };

            window.speechSynthesis.speak(utterance);
          } else {
            // Done with all headlines — update display
            const displayElement = document.getElementById("assistantSpeech");
            if (displayElement) {
              displayElement.textContent = displayText;
            }
          }
        }

        // Start speaking from the first headline
        speakHeadlines(0);

      } else {
        speak("Sorry, I couldn't get the news right now.");
      }
    })
    .catch(error => {
      console.error(error);
      speak("Sorry, there was an error fetching the news.");
    });
  }



 else if (cmd.startsWith("who is") || cmd.startsWith("what is")) {
  const topic = cmd.replace("who is", "").replace("what is", "").trim();

  if (topic.length > 0) {
    speak(`Let me check who ${topic} is.`);

    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`)
      .then(response => {
        if (!response.ok) throw new Error("Wikipedia fetch failed");
        return response.json();
      })
      .then(data => {
        if (data.extract) {
          const answer = data.extract;
          document.getElementById("answerBox").style.display = "block";
          document.getElementById("answerText").textContent = answer;

          // ✅ Image
          const img = document.getElementById("answerImage");
          if (data.thumbnail && data.thumbnail.source) {
            img.src = data.thumbnail.source;
            img.style.display = "block";
            img.onclick = () => window.open(data.thumbnail.source, "_blank");
          } else {
            img.style.display = "none";
          }

          // ✅ Link to article
          const link = document.querySelector("#articleLink a");
          link.href = data.content_urls.desktop.page;
          link.textContent = `Read full article on Wikipedia`;

          // ✅ Speak first line
          speak(answer.split(".")[0]);
        } else {
          speak("Sorry, I couldn't find any information.");
        }
      })
      .catch(error => {
        speak("There was an error getting the info.");
        console.error("Wikipedia Error:", error);
      });
  } else {
    speak("Please say who or what you want me to search.");
  }
}



 else if (cmd.includes("clear")) {
  document.getElementById("transcript").textContent = "";
  document.getElementById("assistantSpeech").textContent = "";
  document.getElementById("answerText").textContent = "";
  document.getElementById("answerBox").style.display = "none";
  speak("Screen cleared.");
} else {
    speak("Sorry, I didn't understand that.");
  }
}

