function activateSpeechRecognition() {
  const synthesis = window.speechSynthesis;
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  const defvoices = synthesis.getVoices()[107];
  let voice = null;

  const utterance = new SpeechSynthesisUtterance();

  const openaiApiKey = "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";
  const openaiUrl = "https://api.openai.com/v1/engines/text-davinci-003/completions";

  let conversation = "";
  const userName = "You:  ";
  const botName = "AI:  ";

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

    fetch(openaiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        prompt: conversation,
        temperature: 0.7,
        max_tokens: 4000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      })
    })

    .then(response => response.json())
    .then(data => {
      let responseStr = data.choices[0].text.replace(/\n/g, '');
      responseStr = responseStr.split(`${userName}:`, 1)[0].split(`${botName}:`, 1)[0];
      conversation += `${responseStr}\n`;
      console.log("\n" + responseStr);
      utterance.text = responseStr.replace(/^/gm, "\n");
      synthesis.speak(utterance);

      // Update the output textarea
      const inputTextarea = document.getElementById("output");
      inputTextarea.value += conversation + "\n";
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
    setTimeout(printDone, 8000);
  }

  window.addEventListener("beforeunload", () => {
    synthesis.cancel();
  });
}

function printDone() {
  var button = document.getElementById("status");
  button.value = "Done";
}