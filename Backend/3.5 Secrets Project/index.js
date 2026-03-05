//To see how the final website should work, run "node solution.js".
//Make sure you have installed all the dependencies with "npm i".
//The password is ILoveProgramming
import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

function passwordChecker(req, res, next) {
  if (req.body.password === "Anvi") {
    next();
    } else {
    res.sendFile(__dirname + "/public/index.html");
  }
}

app.use(passwordChecker);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post('/check', passwordChecker, (req, res) => {
  res.sendFile(__dirname + "/public/secret.html");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

