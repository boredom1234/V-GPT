//DOESN'T WORK 😭😭😭😭😭😭😭😭😭
const OpenAI = require('openai-api');
const prompt = require('prompt-sync')();

// Load your key from an environment variable or secret management service
// (do not include your key directly in your code)
const OPENAI_API_KEY = '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';

const openai = new OpenAI(OPENAI_API_KEY);
const imageApi = openai['davinci-codex'].images;

// Get input from the user
const input = prompt('Enter a text prompt: ');

// Call the DALL-E 2 API to generate an image
imageApi.generate({
  prompt: input,
  size: '256x256', // Change the size of the output image if needed
}).then((response) => {
  // Save the generated image to a file or display it in the console
  console.log(response.data);
}).catch((err) => {
  console.error(err);
});
