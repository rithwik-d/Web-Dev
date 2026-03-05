import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index.ejs", { totalLetters: null });
});

app.post("/submit", (req, res) => {
  const { fName, lName } = req.body;
  const totalLetters = fName.length + lName.length;
  res.render("index.ejs", {totalLetters: totalLetters});
  });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
