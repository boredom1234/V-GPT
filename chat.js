function sendMessage() {
    let message = "";
    const userName = "You:  ";
    const botName = "AI:  ";
    const inputField = document.getElementById("input-field");
    let input = inputField.value;
    message += input;

    fetch("https://api.openai.com/v1/engines/text-davinci-003/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer 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",
      },
      body: JSON.stringify({
        prompt: message,
        temperature: 0.7,
        max_tokens: 2080,
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

        const inputTextarea = document.getElementById("output");
        inputTextarea.value += message + "\n";
    })
      .catch((error) => {
        console.error(error);
    });
}