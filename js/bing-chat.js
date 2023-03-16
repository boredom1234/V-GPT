function chatWithGPT4() {
  const questionInput = document.getElementById("input-field");
  const outputBox = document.getElementById("output");
  let message = "";
  const userName = "You:  ";
  const botName = "Horizon: ";
  let input = questionInput.value;
  message += input;

  const encodedParams = new URLSearchParams();
  encodedParams.append("bing_u_cookie", "1ViU_94ARH9X_0SGsD0maUBaWo80QCfcSI6DOjdalGlNqEG_ypfw69c3B97y5iT3ustvZSXm-suuJjyFDW60DbC0cyHEhDpl8OnAJazXmVcLu9zsfoiE3GUHwHBpLxjIKQj1USFFRONAg2L6cBMLEI9--AA0-hkzFvqfdIffUdETR9vSfnk6G8parHAfqkgMnzSBUjMA16yKkFB6FvkEBA789P7catraRVZSax8-uLck");
  encodedParams.append("question", questionInput.value);

  const options = {
    method: 'POST',
    url: 'https://chatgpt-4-bing-ai-chat-api.p.rapidapi.com/chatgpt-4-bing-ai-chat-api/0.1/send-message/',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'X-RapidAPI-Key': '73ca85ca5fmsha9e8f26bfaa9215p1ed500jsn0fe03b356675',
      'X-RapidAPI-Host': 'chatgpt-4-bing-ai-chat-api.p.rapidapi.com'
    },
    data: encodedParams
  };

  axios.request(options).then(function (response) {
    var message = `${userName}${input}\n${botName}`;
    console.log(response.data);
    console.log(response.data[0].text_response); // prints the "text_response" part only
    const cleanedText = response.data[0].text_response.replace(/\[\^[\d]+\^\]/g, "");
    let cleanedText1 = cleanedText.replace(/\*/g, "");
    if (cleanedText1.includes("Bing")) {
      cleanedText1 = cleanedText1.replace("Bing", "Horizon");
    }
    console.log(cleanedText1);
    message += `${cleanedText1}`;
    outputBox.value += message + "\n";
    saveToLocalStorage(outputBox.value);

    // Fetch from Google Custom Search API
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
        outputBox.value += `\n${message}\n`;
        saveToLocalStorage(outputBox.value);
      })
      .catch((error) => console.error(error));
  }).catch(function (error) {
    console.error(error);
  });

  if(fetch){
    console.log("Thinking?");
    var button = document.getElementById("status");
    button.value = "Thinking?";
    questionInput.value="";
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