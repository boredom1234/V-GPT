function sendMessage() {
  let status = false;
  let message = "";
  const userName = "You:  ";
  const botName = "Horizon: ";
  const inputField = document.getElementById("input-field");
  let input = inputField.value;
  message += input;

  // Fetch response from OpenAI
  fetch("https://api.openai.com/v1/engines/text-davinci-003/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer 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",
    },
    body: JSON.stringify({
      prompt: message,
      temperature: 0.6,
      max_tokens: 4000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      var message = `${userName}${input}\n${botName}`;
      let responseStr = data.choices[0].text.replace(/\n/g, '');
      responseStr = responseStr.split(`You:`, 1)[0].split(`AI:`, 1)[0];
      message += `${responseStr}\n`;
      console.log("\n" + responseStr);

      const outputTextarea = document.getElementById("output");
      outputTextarea.value += message + "\n";
      saveToLocalStorage(outputTextarea.value);

      // Fetch response from GoogleSearchAPI
      fetch(`https://www.googleapis.com/customsearch/v1?key=AIzaSyBoLC8MJEULWEmgOLPZKWjWfcohYpigr8M&cx=56469cba6f5504b7d&q=${input}`)
        .then((response) => response.json())
        .then((data) => {
          let items = data.items;
          let message = `[🕸️]4 Sources:\n`;
          for (let i = 0; i < 4; i++) {
            let result = items[i];
            let link = result.link;
            let title = result.title;
            message += `  ${i+1}. ${title}: ${link}\n`;
            console.log(`${title}: ${link}`);
          }
          outputTextarea.value += message + "\n";
          saveToLocalStorage(outputTextarea.value);
        })
        .catch((error) => {
          console.error(error);
        });
    })
    .catch((error) => {
      console.error(error);
    });

  if(fetch){
    console.log("Thinking?");
    var button = document.getElementById("status");
    button.value = "Thinking?";
    inputField.value="";
  }
  setTimeout(printDone, 10000);
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