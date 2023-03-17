function activateBingRecognition() {
    const synthesis = window.speechSynthesis;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    const defvoices = synthesis.getVoices()[107];
    let voice = null;
    const outputBox = document.getElementById("output");
  
    const utterance = new SpeechSynthesisUtterance();
  
    let conversation = "";
    const userName = "You:  ";
    const botName = "Horizon:  ";
  
    utterance.voice = synthesis.getVoices()[107];
    recognition.lang = 'en-US';
    utterance.lang = 'en-US'; // set the language of the utterance
  
    function getVoice() {
      // Use the stored voice if available
      if (voice !== null) {
        utterance.voice = defvoices;
        return;
      }
  
      // Find the desired voice in the list of available voices
      const voices = synthesis.getVoices();
      for (let i = 0; i < voices.length; i++) {
        const v = voices[i];
        if (v.name === "Microsoft Ryan Online (Natural) - English (United Kingdom)") {
          voice = v;
          utterance.voice = voice;
          break;
        }
      }
    }
  
    synthesis.onvoiceschanged = () => { // listen for the voiceschanged event
      getVoice();
    };
  
    recognition.onresult = (event) => {
      const userInput = event.results[0][0].transcript;
      const prompt = `${userName}${userInput}\n${botName}`;
      conversation += prompt;
  
      const encodedParams = new URLSearchParams();
  encodedParams.append("bing_u_cookie", "1ViU_94ARH9X_0SGsD0maUBaWo80QCfcSI6DOjdalGlNqEG_ypfw69c3B97y5iT3ustvZSXm-suuJjyFDW60DbC0cyHEhDpl8OnAJazXmVcLu9zsfoiE3GUHwHBpLxjIKQj1USFFRONAg2L6cBMLEI9--AA0-hkzFvqfdIffUdETR9vSfnk6G8parHAfqkgMnzSBUjMA16yKkFB6FvkEBA789P7catraRVZSax8-uLck");
  encodedParams.append("question", `${userInput}`);

  const options = {
    method: 'POST',
    url: 'https://chatgpt-4-bing-ai-chat-api.p.rapidapi.com/chatgpt-4-bing-ai-chat-api/0.2/send-message/',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'X-RapidAPI-Key': '73ca85ca5fmsha9e8f26bfaa9215p1ed500jsn0fe03b356675',
      'X-RapidAPI-Host': 'chatgpt-4-bing-ai-chat-api.p.rapidapi.com'
    },
    data: encodedParams
  };

  axios.request(options).then(function (response) {
    var message = `${userName}${userInput}\n${botName}`;
    console.log(response.data);
    console.log(response.data[0].text_response); // prints the "text_response" part only
    const cleanedText = response.data[0].text_response.replace(/\[\^[\d]+\^\]/g, "");
    const cleanedText1 = cleanedText.replace(/\*/g, "");
    console.log(cleanedText1);
    message += `${cleanedText1}`;
    outputBox.value += message + "\n";
    utterance.text = cleanedText1 + "\n" + "And here are a few additional online sources, if you want to have a look at.";
    synthesis.speak(utterance);
    saveToLocalStorage(outputBox.value);
  
        // Update the output textarea
        const inputTextarea = document.getElementById("output");
        saveToLocalStorage(inputTextarea.value);
  
         // Fetch response from GoogleSearchAPI
         fetch(`https://www.googleapis.com/customsearch/v1?key=AIzaSyBoLC8MJEULWEmgOLPZKWjWfcohYpigr8M&cx=56469cba6f5504b7d&q=${userInput}`)
         .then(response => response.json())
         .then(data => {
           let items = data.items;
           let message = `[🕸️]4 Sources:\n`;
           for (let i = 0; i < 4; i++) {
             let result = items[i];
             let link = result.link;
             let title = result.title;
             message += `  ${i+1}. ${title}: ${link}\n`;
             console.log(`${title}: ${link}`);
           }
           inputTextarea.value += message + "\n";
           saveToLocalStorage(inputTextarea.value);
         })
  
      })
      .catch(error => {
        console.error(error);
      });
    };
  
    recognition.onstart = () => {
      console.log('Listening...');
      var button = document.getElementById("status");
        button.value = "Listening?";
    };
  
    recognition.onend = () => {
      console.log('No longer listening');
      if(fetch){
        console.log("Thinking?");
        var button = document.getElementById("status");
        button.value = "Thinking?";
      }
    };
  
    recognition.start();
  
    if(fetch){
      setTimeout(printDone, 15000);
    }
  
    window.addEventListener("beforeunload", () => {
      synthesis.cancel();
    });
  }
  
  function printDone() {
    var button = document.getElementById("status");
    button.value = "Done";
  }
  
  function saveToLocalStorage(output) {
    localStorage.setItem("output", output);
  }
  
  function loadFromLocalStorage() {
    const outputTextarea = document.getElementById("output");
    const output = localStorage.getItem("output");
    if (output) {
      outputTextarea.value = output;
    }
  }
  
  window.onload = loadFromLocalStorage;