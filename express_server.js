const express = require('express');
const app = express();
const PORT = 8080;

//This tells the Express app to use EJS as its templating engine
app.set('view engine', 'ejs');

const urlDatabase = {
    "b2xVn2": "http://www.lighthouselabs.ca",
    "9sm5xK": "http://www.google.com"
};

app.get('/', (req, res) => {
    res.send("Hello!");
});

app.listen(PORT, () => {
    console.log("Example app listening on port", PORT);
});

app.get('/urls.json', (req, res) => {
    res.json(urlDatabase);
});

app.get('/hello', (req, res) => {
    res.send('<html><body>Hello <b>world</b></body></html>\n');
});

app.get('/set', (req, res) => {
    const a = 1;
    res.send(`a = ${a}`);
});

app.get('/fetch', (req, res) => {
    res.send(`a = ${a}`);
});