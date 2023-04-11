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


// POST route to create new URL
app.post("/urls", (req, res) => {
    const longURL = req.body.longURL;
    const newID = generateRandomString();
    urlDatabase[newID] = longURL;
    res.redirect(`/urls`);
  });

// GET route to show all URLs in database
app.get('/urls', (req, res) => {
  const templateVars = { urls: urlDatabase};
  res.render('urls_index', templateVars);
});

  app.get('/urls/new', (req, res) => {
    res.render('urls_new');
  });

  // GET route to show URL resource
  app.get('/urls/:shortURL', (req, res) => {
    const templateVars = { id: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
    res.render('urls_show', templateVars);
  });



  // Add a POST route that removes a URL resource: POST /urls/:id/delete
  app.post('/urls/:id/delete', (req, res) => {
    const id = req.params.id;
    delete urlDatabase[id];
    res.redirect('/urls');
  });

  // Add a POST route to edit the url
  app.post('/urls/:id', (req, res) => {
    const id = req.params.id;
  const newURL = req.body.newURL;
  urlDatabase[id] = newURL;
  res.redirect('/urls');
  });

  // Create Cookie after login
  app.post('/login', (req, res) => {
    const username = req.body;
    res.cookie('username', username);
    res.redirect('/urls');
  })

function generateRandomString() {
    let result = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

app.listen(PORT, () => {
    console.log("Example app listening on port", PORT);
});

// app.get('/', (req, res) => {
//     res.send("Hello!");
// });

// app.get('/hello', (req, res) => {
//     res.send('<html><body>Hello <b>world</b></body></html>\n');
// });

// app.get('/set', (req, res) => {
//     const a = 1;
//     res.send(`a = ${a}`);
// });

// app.get('/fetch', (req, res) => {
//     res.send(`a = ${a}`);
// });
