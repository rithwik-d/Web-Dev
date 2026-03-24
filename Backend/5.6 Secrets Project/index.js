// HINTS:
// 1. Import express and axios
import express from "express";
import axios from "axios";
// 2. Create an express app and set the port number.
const app = express();
const port = 3000;
// 3. Use the public folder for static files.
app.use(express.static('public'));
// 4. When the user goes to the home page it should render the index.ejs file.
app.set("view engine", "ejs");
// 5. Use axios to get a random secret and pass it to index.ejs to display the
// secret and the username of the secret.
const API_URL = "https://secrets-api.appbrewery.com";
const bearerToken = "645cb707-c1ef-4bc4-bcce-41bf72cb807f";
app.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/random`, {
        headers: {  Authorization: `Bearer ${bearerToken}` },
    });
    const secret = response.data;
    res.render("index.ejs", { 
        secret: response.data.secret, 
        user: response.data.username 
    });
  } catch (error) {
    console.error("Error fetching random secret:", error);
    res.status(500).send("Error fetching random secret");
  }
});
// 6. Listen on your predefined port and start the server.
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
