// 🔰 Import all quiz questions
import { questions as question } from "./question.js";

// 🔗 Get UI elements
const paraElement = document.querySelector(".paragraph");
const compTask = document.querySelector(".text");
const time = document.querySelector(".text .time-status");
const answerOption = document.querySelector(".answer-option");
const MusicBtn = document.querySelector('.music-play');
const quizMusic = document.querySelector('.quizMusic');
const nextBtn = document.querySelector(".next");
const backcolor = document.querySelector(".question-conf");
const selectElement = document.querySelector('.select-category select');

//  Quiz state tracking variables
let result;
let allQuestion = null;
let score = 0;
let category;
let taskcomplet;
let setTimeId;
let currentTime = 30;
let quizz = currentTime;
const questionIndex = [];

// Load last selected category from local storage
const savedValue = localStorage.getItem('selectOption');

if (savedValue) {
  selectElement.value = savedValue;
  category = savedValue.toLowerCase();
}

// Handle category selection change
function changeQuestion() {
  selectElement.addEventListener('change', function (e) {
    localStorage.setItem('selectOption', e.target.value);
    category = e.target.value.toLowerCase();
    nextbtnRander(); // reload quiz for new category
  });
}
changeQuestion();

// Music play/pause toggle
MusicBtn.addEventListener('click', () => {
  MusicBtn.classList.toggle('muted');
  if (quizMusic.paused) {
    quizMusic.play();
  } else {
    quizMusic.pause();
  }
});

// ⏱ Start countdown timer for each question
const startTime = () => {
  clearInterval(setTimeId); // stop previous timer
  quizz = currentTime;
  time.innerText = `00:${quizz}`;

  setTimeId = setInterval(() => {
    quizz--;
    time.innerText = `00:${String(quizz).padStart(2, '0')}`;

    // Change colors based on time left
    if (quizz === 15) {
      nextBtn.style = 'color:#C58800';
      time.style = "background-color:#C5B1006E";
      backcolor.style = "background-color: #D4D69F8C";
    }
    if (quizz <= 5) {
      nextBtn.style = 'color:#C50000';
      time.style = "background-color:#C50C006E";
      backcolor.style = "background-color: #DBADAD";
    }

    // Time up – auto move to next
    if (quizz <= 0) {
      clearInterval(setTimeId);
      HighlightAnswer();
      setTimeout(() => nextBtn.click(), 5000);
      score++;
    }
  }, 1000);
};

//  Reset timer display
const resetTime = () => {
  quizz = currentTime;
  time.innerText = `00:${quizz}`;
};

//  Redirect to result page
const complited = (score, allQuestion) => {
  location.replace(`result.html?score=${score}&total=${allQuestion.length}`);
};

// Load next question from selected category
const categoryQuestion = () => {
  const categoryData = question.find(cat => cat.category === category);

  if (!categoryData) {
    allQuestion = [];
    return null;
  }

  allQuestion = categoryData.questions || [];

  if (questionIndex.length >= allQuestion.length) {
    complited(score, allQuestion);
    return null;
  }

  const availableQuestion = allQuestion.filter((_, index) => !questionIndex.includes(index));
  const rendomQuestion = availableQuestion[Math.floor(Math.random() * availableQuestion.length)];
  taskcomplet = questionIndex.push(allQuestion.indexOf(rendomQuestion));

  return rendomQuestion;
};

// ✅ Show correct answer when time up or wrong
const HighlightAnswer = () => {
  const eleOptions = answerOption.querySelectorAll(".option")[result.correctAnswer];
  eleOptions.classList.add("correct");
  const iconHTML = `<img src="/images/rightCorrect.svg" width="20">`;
  eleOptions.insertAdjacentHTML("beforeend", iconHTML);

  // Disable all options
  answerOption.querySelectorAll(".option").forEach(opt => opt.style.pointerEvents = "none");
};

// ✅ Handle user answer selection
const handleAnswer = (btn, index) => {
  const isCorrect = result.correctAnswer === index;
  btn.classList.add(isCorrect ? "correct" : "incorrect");

  // Disable all options
  const allOptions = answerOption.querySelectorAll(".option");
  allOptions.forEach(opt => opt.style.pointerEvents = "none");
  nextBtn.style.pointerEvents = "visible";

  if (!isCorrect) HighlightAnswer();
  if (isCorrect) score++;

  const iconHTML = `<img src="${isCorrect ? `/images/rightCorrect.svg` : `/images/wrong.svg`}" width="20">`;
  btn.insertAdjacentHTML("beforeend", iconHTML);

  clearInterval(setTimeId);
};

// ✅ Render next question and options
const nextbtnRander = () => {
  // Reset styles and time
  nextBtn.style = 'color:#01AB08';
  nextBtn.style.pointerEvents = "none";
  time.style = "background-color:#02A4096E";
  backcolor.style = "background-color: #CCE2C2";

  startTime();
  resetTime();

  result = categoryQuestion();

  //  Fix: stop execution if no more questions
  if (!result) return;

  // Update task counter
  compTask.innerHTML = `<span>${taskcomplet}/${allQuestion.length}</span>`;
  paraElement.innerHTML = result?.question;
  answerOption.innerText = "";

  result?.options.forEach((element, index) => {
    const btn = document.createElement("button");
    btn.innerText = element;
    btn.classList.add("option");
    answerOption.appendChild(btn);
    btn.addEventListener("click", () => handleAnswer(btn, index));
  });
};

// Start the quiz
nextbtnRander();

//  Next button click loads next question
nextBtn.addEventListener("click", nextbtnRander);
