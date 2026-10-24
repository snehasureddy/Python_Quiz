const questions = [
  {
    prompt: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Mercury"],
    answerIndex: 1,
    explanation: "Mars looks red because iron minerals in its soil have rusted.",
  },
  {
    prompt: "What is the largest ocean on Earth?",
    options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
    answerIndex: 3,
    explanation: "The Pacific Ocean is the largest and deepest ocean on Earth.",
  },
  {
    prompt: "Which language runs natively in web browsers?",
    options: ["Python", "Java", "JavaScript", "C#"],
    answerIndex: 2,
    explanation: "JavaScript is supported natively by all modern web browsers.",
  },
  {
    prompt: "How many sides does a hexagon have?",
    options: ["Five", "Six", "Seven", "Eight"],
    answerIndex: 1,
    explanation: "A hexagon is a polygon with six sides.",
  },
  {
    prompt: "What is the chemical symbol for water?",
    options: ["CO2", "O2", "NaCl", "H2O"],
    answerIndex: 3,
    explanation: "A water molecule contains two hydrogen atoms and one oxygen atom.",
  },
];

const questionNumber = document.querySelector("#question-number");
const questionHeading = document.querySelector("#question");
const answerOptions = document.querySelector("#answer-options");
const scoreDisplay = document.querySelector("#score");
const feedback = document.querySelector("#feedback");
const nextButton = document.querySelector("#next-question");
const restartButton = document.querySelector("#restart-quiz");

if (
  !questionNumber ||
  !questionHeading ||
  !answerOptions ||
  !scoreDisplay ||
  !feedback ||
  !nextButton ||
  !restartButton
) {
  throw new Error("The quiz page is missing one or more required elements.");
}

let currentQuestionIndex = 0;
let score = 0;
let hasAnswered = false;

function updateScore() {
  scoreDisplay.textContent = `Score: ${score} / ${questions.length}`;
}

function renderQuestion() {
  const currentQuestion = questions[currentQuestionIndex];

  questionNumber.textContent = `Question ${currentQuestionIndex + 1} of ${
    questions.length
  }`;
  questionHeading.textContent = currentQuestion.prompt;
  answerOptions.replaceChildren();

  currentQuestion.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = "quiz__answer";
    button.type = "button";
    button.dataset.answer = String(index);
    button.setAttribute("aria-pressed", "false");
    button.textContent = option;
    answerOptions.append(button);
  });

  feedback.textContent = "";
  feedback.removeAttribute("data-state");
  nextButton.disabled = true;
  nextButton.textContent =
    currentQuestionIndex === questions.length - 1 ? "See Results" : "Next Question";
  nextButton.hidden = false;
  answerOptions.hidden = false;
  hasAnswered = false;
}

function selectAnswer(selectedIndex) {
  if (hasAnswered) {
    return;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const answerButtons = answerOptions.querySelectorAll(".quiz__answer");
  const isCorrect = selectedIndex === currentQuestion.answerIndex;

  hasAnswered = true;
  if (isCorrect) {
    score += 1;
  }
  updateScore();

  answerButtons.forEach((button, index) => {
    button.disabled = true;
    button.setAttribute("aria-pressed", String(index === selectedIndex));
    if (index === currentQuestion.answerIndex) {
      button.classList.add("is-correct");
    } else if (index === selectedIndex) {
      button.classList.add("is-incorrect");
    }
  });

  if (isCorrect) {
    feedback.textContent = `Correct! ${currentQuestion.explanation}`;
    feedback.dataset.state = "correct";
  } else {
    const correctAnswer = currentQuestion.options[currentQuestion.answerIndex];
    feedback.textContent = `Not quite. The correct answer is ${correctAnswer}. ${currentQuestion.explanation}`;
    feedback.dataset.state = "incorrect";
  }

  nextButton.disabled = false;
}

function showResults() {
  questionNumber.textContent = "Quiz complete";
  questionHeading.textContent = `You scored ${score} out of ${questions.length}`;
  answerOptions.hidden = true;
  nextButton.hidden = true;
  feedback.removeAttribute("data-state");
  feedback.textContent =
    score === questions.length
      ? "Perfect score! Excellent work."
      : `You got ${score} of ${questions.length} questions correct. Restart to try again.`;
}

answerOptions.addEventListener("click", (event) => {
  const answerButton = event.target.closest(".quiz__answer");
  if (!answerButton || !answerOptions.contains(answerButton)) {
    return;
  }

  selectAnswer(Number(answerButton.dataset.answer));
});

nextButton.addEventListener("click", () => {
  if (!hasAnswered) {
    return;
  }

  if (currentQuestionIndex === questions.length - 1) {
    showResults();
    return;
  }

  currentQuestionIndex += 1;
  renderQuestion();
});

restartButton.addEventListener("click", () => {
  currentQuestionIndex = 0;
  score = 0;
  updateScore();
  renderQuestion();
});

updateScore();
renderQuestion();