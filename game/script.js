const randomQuoteApiUrl = "https://api.quotable.io/random";
const quoteDisplayElement = document.getElementById("quoteDisplay");
const quoteInputElement = document.getElementById("quoteInput");
const timerElement = document.getElementById("timer");
const wpmElement = document.getElementById("wpm");
const errorsElement = document.getElementById("errors");

let errors;
let minutes;
let words;
let wpm;
let startTime;

// checks at each input and performs neccesary operation
quoteInputElement.addEventListener("input", () => {
  const arrayQuote = quoteDisplayElement.querySelectorAll("span");
  const arrayValue = quoteInputElement.value.split("");

  let correct = true;
  arrayQuote.forEach((characterSpan, index) => {
    const character = arrayValue[index];
    if (character == null) {
      characterSpan.classList.remove("correct");
      characterSpan.classList.remove("incorrect");
      correct = false;
    } else if (character === characterSpan.innerText) {
      characterSpan.classList.add("correct");
      characterSpan.classList.remove("incorrect");
      addLength();
    } else {
      characterSpan.classList.add("incorrect");
      characterSpan.classList.remove("correct");
      correct = false;
      removeLength();
    }
  });
  if (correct) renderNewQuote();
});
// gets a new quote from randomQuoteApi
function getRandomQuote() {
  return fetch(randomQuoteApiUrl)
    .then(response => response.json())
    .then(data => data.content);
}
// resets all elements and gets a new quote
async function renderNewQuote() {
  const quote = await getRandomQuote();
  quoteInputElement.maxLength = "1";
  errors = 0;
  quoteDisplayElement.innerHTML = "";
  quoteInputElement.value = null;
  quote.split("").forEach(character => {
    const characterSpan = document.createElement("span");
    characterSpan.innerText = character;
    quoteDisplayElement.appendChild(characterSpan);
  });
  startTimer();
  startTracking();
}
function addLength() {
  quoteInputElement.maxLength = quoteInputElement.value.length + 1;
}
function removeLength() {
  if (quoteInputElement.maxLength >= 2) {
    quoteInputElement.maxLength = quoteInputElement.value.length - 1;
  }
  errors++;
}

// begins the timer
function startTimer() {
  timerElement.innerText = 0;
  startTime = new Date();
  setInterval(() => {
    timerElement.innerText = "Time in seconds: " + parseInt(getTimerTime());
  }, 1000);
}
//gets the timer
function getTimerTime() {
  return (new Date() - startTime) / 1000;
}
//begins the tracking of words per minute and errors
function startTracking() {
  wpm = 0;
  minutes = getTimerTime() / 60;
  setInterval(() => {
    words = quoteInputElement.value.length / 5;
    minutes = getTimerTime() / 60;
    wpm = words / minutes;
    wpmElement.innerText = "WPM:" + parseInt(wpm);
    errorsElement.innerText = "Errors: " + errors;
  }, 100);
}

renderNewQuote();
