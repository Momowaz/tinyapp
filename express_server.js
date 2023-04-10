const express = require('express');
const app = express();
const PORT = 8080;

//This tells the Express app to use EJS as its templating engine
app.set('view engine', 'ejs');

// This is middleware from Express, which will translate, or parse the body.
/* The body-parser library will convert the request body from .. 
    .. a Buffer into string that we can read.  */
app.use(express.urlencoded({ extended: true }));

const urlDatabase = {
    "b2xVn2": "http://www.lighthouselabs.ca",
    "9sm5xK": "http://www.google.com"
};


app.get('/urls', (req, res) => {
    const templateVars = { urls: urlDatabase};
    res.render('urls_index', templateVars);
});

app.post("/urls", (req, res) => {
    console.log(req.body); // Log the POST request body to the console
    res.send("Ok"); // Respond with 'Ok' (we will replace this)
  });

app.get('/urls/new', (req, res) => {
    res.render('urls_new');
});

app.get('/urls/:id', (req, res) => {
    const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
    res.render('urls_show', templateVars);
});


app.get('/', (req, res) => {
    res.send("Hello!");
});

app.listen(PORT, () => {
    console.log("Example app listening on port", PORT);
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
