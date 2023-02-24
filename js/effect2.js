const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

let interval = null;

function animateHeading() {
  const heading = document.querySelector("h1");
  let iteration = 0;

  clearInterval(interval);

  interval = setInterval(() => {
    heading.innerText = heading.dataset.value
      .split("")
      .map((letter, index) => {
        if (index < iteration) {
          return heading.dataset.value[index];
        }

        return letters[Math.floor(Math.random() * 26)];
      })
      .join("");

    if (iteration >= heading.dataset.value.length) {
      clearInterval(interval);
    }

    iteration += 1 / 15;
  }, 30);
}

// Call the function when the page loads
window.onload = animateHeading;
