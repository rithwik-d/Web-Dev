import express from 'express';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send("<h1>Welcome to Express Server.</h1>");
    // console.log(req.rawheaders);
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})