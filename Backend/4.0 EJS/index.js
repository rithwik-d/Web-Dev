import express from "express";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
    const today = new Date("March 7, 2026 11:00:00");
    const day = today.getDay();

    let type = "Weekday";
    let advice = "Get back to work!";
    
    if (day === 0 || day === 6) {
        type = "Weekend";
        advice = "Enjoy your weekend!";
    }

  res.render("index.ejs", {
    dayType : type,
    advice : advice
  });  
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});