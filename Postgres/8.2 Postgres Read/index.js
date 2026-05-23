import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import stringSimilarity from "string-similarity";


const app = express();
const port = 3000;

let totalCorrect = 0;

const db = new pg.Client({ 
  user: "postgres",
  host: "127.0.0.1",
  database: "world",
  password: "#Rkspvn@123",
  port: 5433,
});

db.connect();

let quiz = [];

db.query('SELECT * FROM flags', (err, res) => {
  if (err) {
    console.error("Error executing query", err.stack);
  } else {
    quiz = res.rows;
  }
  db.end();
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentQuestion = {};

function normalizeString(str) {
    return str
    .toLowerCase()
    .replace(/[().,']/g, "")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  }

function isAnswerCorrect(userAnswer, correctAnswer) {    
  const normalizedUserAnswer = normalizeString(userAnswer);
  const normalizedCorrectAnswer = normalizeString(correctAnswer);

  if (normalizedCorrectAnswer.includes(normalizedUserAnswer) || normalizedUserAnswer.includes(normalizedCorrectAnswer)) {
    return true;
  }
  const similarity = stringSimilarity.compareTwoStrings(normalizedUserAnswer, normalizedCorrectAnswer);
  console.log(similarity);
  return similarity >= 0.8;
}

function nextQuestion() {
  const randomCountry = quiz[Math.floor(Math.random() * quiz.length)];
  currentQuestion = randomCountry;
}

// GET home page
app.get("/", (req, res) => {
  totalCorrect = 0;
  nextQuestion();
  console.log(currentQuestion);
  res.render("index.ejs", { question: currentQuestion });
});

// POST a new post
app.post("/submit", (req, res) => {
  let answer = req.body.answer.trim();
  let isCorrect = false;

  if(isAnswerCorrect(answer, currentQuestion.name)) {
  totalCorrect++;
  isCorrect = true;
}

  nextQuestion();
  res.render("index.ejs", {
    question: currentQuestion,
    wasCorrect: isCorrect,
    totalScore: totalCorrect,
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
