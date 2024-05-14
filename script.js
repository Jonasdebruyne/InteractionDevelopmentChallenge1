// Function to shuffle an array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Define your quiz array with questions and answers
var quiz = [
  {
    question:
      "What famous UNESCO World Heritage Site can be found in Mechelen, known for its stunning architecture and rich history?",
    answers: shuffleArray([
      "St. Rumbold's Cathedral",
      "The Belfry of Mechelen",
      "The Grand Beguinage of Mechelen",
      "The Palace of Margaret of Austria",
    ]),
    correctAnswer: "The Grand Beguinage of Mechelen",
  },
  {
    question:
      "Which river flows through Mechelen, contributing to its scenic charm and historical significance?",
    answers: shuffleArray(["Dijle", "Scheldt", "Lys", "Meuse"]),
    correctAnswer: "Dijle",
  },
  {
    question:
      "Mechelen is often referred to as the 'City of ___________', filling in the blank with a notable characteristic or aspect of the city.",
    answers: shuffleArray(["Bells", "Beguines", "Flemish Art", "Carillons"]),
    correctAnswer: "Bells",
  },
  {
    question:
      "Which renowned painter, born in Mechelen in the 16th century, is known for his influential works during the Northern Renaissance?",
    answers: shuffleArray([
      "Pieter Bruegel the Elder",
      "Peter Paul Rubens",
      "Jan van Eyck",
      "Hans Memling",
    ]),
    correctAnswer: "Peter Paul Rubens",
  },
  {
    question:
      "What iconic Mechelen landmark serves as a symbol of the city's resilience and determination, having survived fires and wars throughout its history?",
    answers: shuffleArray([
      "St. Rumbold's Tower",
      "The Belfry of Mechelen",
      "The Grand Beguinage of Mechelen",
      "The Palace of Margaret of Austria",
    ]),
    correctAnswer: "St. Rumbold's Tower",
  },
  {
    question:
      "Mechelen's Grote Markt (Grand Market Square) is famous for its picturesque medieval buildings and vibrant atmosphere. What historic event took place on this square in 1567?",
    answers: shuffleArray([
      "The Burning of Heretics",
      "The Oath of Allegiance",
      "The Iconoclasm Riots",
      "The Presentation of the Augsburg Confession",
    ]),
    correctAnswer: "The Oath of Allegiance",
  },
  {
    question:
      "The St. Rumbold's Tower, a prominent feature of the Mechelen skyline, offers panoramic views of the city. How many steps lead to the top of this iconic tower?",
    answers: shuffleArray(["538", "620", "405", "712"]),
    correctAnswer: "538",
  },
  {
    question:
      "Mechelen is known for its rich cultural scene. Which annual event brings together artists, musicians, and performers from around the world to showcase their talents in the city?",
    answers: shuffleArray([
      "Maanrock",
      "Mechelen Cultural Festival",
      "Art in Mechelen",
      "Mechelen Music Expo",
    ]),
    correctAnswer: "Maanrock",
  },
  {
    question:
      "Mechelen is home to several museums, preserving the city's heritage and showcasing its artistic achievements. Which museum is dedicated to the life and works of the famous Flemish painter Peter Paul Rubens?",
    answers: shuffleArray([
      "Rubenshuis",
      "Museum Hof van Busleyden",
      "Mechelen City Museum",
      "Mechelen Cultural Center",
    ]),
    correctAnswer: "Rubenshuis",
  },
  {
    question:
      "Mechelen's culinary scene is celebrated for its delicious specialties. What traditional dish, originating from Mechelen, features stewed beef or veal cooked in beer and seasoned with spices?",
    answers: shuffleArray([
      "Mechels Stoofvlees",
      "Vlaamse Stoverij",
      "Belgian Carbonade",
      "Bourgondische Braadpan",
    ]),
    correctAnswer: "Mechels Stoofvlees",
  },
];

// Return the quiz array
quiz;

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
// var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
// var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;
const speakBtn = document.querySelector("#speakBtn");
const confirmBtn = document.querySelector("#confirmBtn");
const readBtn = document.querySelector("#readBtn");
const nextBtn = document.querySelector("#nextBtn");

const progressInd = document.querySelector(".progressIndicator");
const currentQNr = document.querySelector(".currentQuestionNumber");
const TotalQNr = document.querySelector(".totalQuestionNumber");

const questionContainer = document.querySelector(".question");
const answersContainer = document.querySelectorAll(".answersContainer ul");
let answers = document.querySelectorAll(".answersContainer ul li");

const playerAnswer = document.querySelector(".output .answer");

let questionCounter = 0;

let playerCurrentAnswer;

// ===== BEGIN SETUP ===== //

const synth = window.speechSynthesis;

let utterance = new SpeechSynthesisUtterance("");
utterance.lang = "en-US";

const recognition = new SpeechRecognition();
recognition.lang = "en-US";

synth.onvoiceschanged = () => {
  let voices = synth.getVoices().filter(matchVoiceToLang);
  console.log(voices);
  // utterance.voice = voices[49];
};

function matchVoiceToLang(voice) {
  if (voice.lang == utterance.lang) {
    return true;
  }
  return false;
}

currentQNr.innerText = questionCounter + 1;
TotalQNr.innerHTML = quiz.length;
setProgress();

showQuestion(questionCounter, false);
showAnswers(questionCounter, false);

// ===== END SETUP ===== //

readBtn.addEventListener("click", () => {
  readBtn.disabled = true;
  const answersLength = quiz[questionCounter].answers.length;
  let answerOptions;

  quizSpeak(quiz[questionCounter].question);

  showQuestion(questionCounter, true);

  utterance.rate = 0.9;

  answerOptions = "The options are: ";

  for (let i = 0; i < answersLength; i++) {
    if (i + 1 < answersLength) {
      answerOptions += quiz[questionCounter].answers[i] + ", ";
    } else {
      answerOptions += "and " + quiz[questionCounter].answers[i];
    }
  }

  console.log(answerOptions);

  quizSpeak(answerOptions);

  utterance.onend = function () {
    showAnswers(questionCounter, true);

    utterance.onend = function () {
      readBtn.style.display = "none";
      confirmBtn.style.display = "block";
      speakBtn.style.display = "block";

      utterance.rate = 1;
    };
  };
});

// ===== //

speakBtn.addEventListener("click", () => {
  console.log("start met luisteren");
  recognition.start();

  answers.forEach((answer) => {
    answer.classList.remove("answered");
  });

  speakBtn.disabled = true;
});

recognition.onresult = function (event) {
  console.log(event);
  const transcript = event.results[0][0].transcript;
  playerCurrentAnswer = transcript;

  // document.querySelector("#output").innerHTML += transcript + "<br>";
  console.log(playerCurrentAnswer);
  playerAnswer.innerText = transcript;

  // Iterate through the list of answers
  answers.forEach((answer, index) => {
    // Get the text content of the answer
    const answerText = answer.textContent.trim();

    // Compare the answer with the given answer
    if (answerText.toLowerCase() === playerCurrentAnswer.toLowerCase()) {
      // Change the background color of the corresponding list item to green
      answer.classList.add("answered");
    }
  });

  speakBtn.disabled = false;
  readBtn.disabled = false;
  // questionCounter++;
};

confirmBtn.addEventListener("click", () => {
  console.log(quiz[questionCounter].correctAnswer);

  if (
    playerCurrentAnswer.toLowerCase() ===
    quiz[questionCounter].correctAnswer.toLowerCase()
  ) {
    quizSpeak("Correct!");
  } else {
    quizSpeak(
      "Wrong, the right answer is: " + quiz[questionCounter].correctAnswer
    );

    // Iterate through the list of answers
    answers.forEach((answer, index) => {
      // Get the text content of the answer
      const answerText = answer.textContent.trim();

      if (answerText.toLowerCase() === playerCurrentAnswer.toLowerCase()) {
        answer.classList.remove("answered");
        answer.classList.add("wrong");
      }

      if (answerText === quiz[questionCounter].correctAnswer) {
        // Change the background color of the corresponding list item to green
        answer.classList.add("answered");
      }
    });
  }

  utterance.onend = function () {
    confirmBtn.style.display = "none";
    speakBtn.style.display = "none";
    nextBtn.style.display = "block";
  };
});

nextBtn.addEventListener("click", () => {
  questionCounter++;

  if (questionCounter < quiz.length) {
    showQuestion(questionCounter, false);
    showAnswers(questionCounter, false);
    playerAnswer.innerText = "...";
    readBtn.style.display = "block";
    nextBtn.style.display = "none";
    setProgress();
    speakBtn.disabled = false;
    readBtn.disabled = false;
    readBtn.click();
  } else {
    // Alle vragen zijn beantwoord, toon een bericht dat de quiz is afgelopen
    questionContainer.innerText = "End of Quiz";
    answersContainer[0].innerHTML = "";
    playerAnswer.innerText = "";
    readBtn.style.display = "none";
    speakBtn.style.display = "none";
    confirmBtn.style.display = "none";
    nextBtn.style.display = "none";
    progressInd.style.display = "none";
    document.querySelector(".progressText").style.display = "none";
    document.querySelector(".output p").style.display = "none";
    currentQNr.innerText = "";
    TotalQNr.innerText = "";
  }
});

// ===== FUNCTIONS =====

function showAnswers(currentQuestionNr, filled) {
  answersContainer[0].innerHTML = " ";

  for (let i = 0; i < quiz[currentQuestionNr].answers.length; i++) {
    const liEl = document.createElement("li");

    if (filled) {
      liEl.innerText = quiz[currentQuestionNr].answers[i];
    } else {
      liEl.innerText = "?";
    }

    answersContainer[0].appendChild(liEl);
  }

  answers = document.querySelectorAll(".answersContainer ul li");
}

function showQuestion(currentQuestionNr, filled) {
  if (filled) {
    questionContainer.innerText = quiz[currentQuestionNr].question;
  } else {
    questionContainer.innerText = "Press the 'Read Question' button";
  }
}

function quizSpeak(text) {
  utterance.text = text;

  console.log(utterance);

  synth.speak(utterance);
}

function setProgress() {
  const percentageFinished = ((questionCounter + 1) / quiz.length) * 100;
  progressInd.style.width = percentageFinished + "%";

  currentQNr.innerText = questionCounter + 1;

  console.log(percentageFinished + "% finished");
}
