import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "https://secrets-api.appbrewery.com/";

const yourUsername = "rithwik";
const yourPassword = "rkspvn";
const yourAPIKey = "rithwik-api-key";
const yourBearerToken = "rithwik-bearer-token";

app.get("/", (req, res) => {
  res.render("index.ejs", { content: "API Response." });
});

app.get("/noAuth", (req, res) => {
  axios.get(`${API_URL}random`)
    .then((response) => {
      res.render("index.ejs", { content: JSON.stringify(response.data) });
    })
    .catch((error) => {
      console.error(error);
      res.render("index.ejs", { content: "Error fetching data." });
    });
});

app.get("/basicAuth", (req, res) => {
  axios.get(`${API_URL}all?page=2`, {
    auth: {
      username: "rithwik",
      password: "rkspvn",
    },
  })
    .then((response) => {
      res.render("index.ejs", { content: JSON.stringify(response.data) });
    })
    .catch((error) => {
      console.error(error);
      res.render("index.ejs", { content: "Error fetching data." });
    });
});

app.get("/apiKey", (req, res) => {
  axios.get(`${API_URL}filter`, {
    params: {
      score: 5,
      apiKey: yourAPIKey,
    },
  })
    .then((response) => {
      res.render("index.ejs", { content: JSON.stringify(response.data) });
    })
    .catch((error) => {
      console.error(error);
      res.render("index.ejs", { content: "Error fetching data." });
    });
});

app.get("/bearerToken", (req, res) => {
  axios.get(`${API_URL}secrets/2`, {
    headers: { 
      Authorization: `Bearer ${yourBearerToken}` 
    },
  })
    .then((response) => {
      res.render("index.ejs", { content: JSON.stringify(response.data) });
    })
    .catch((error) => {
      console.error(error);
      res.render("index.ejs", { content: "Error fetching data." });
    });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
