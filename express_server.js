const express = require("express");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const app = express();
const PORT = 8080;

//This tells the Express app to use EJS as its templating engine
app.set("view engine", "ejs");

// This is middleware from Express, which will translate, or parse the body.
/* The body-parser library will convert the request body from .. 
    .. a Buffer into string that we can read.  */
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

////////////////< DATABASE >////////////////

const urlDatabase = {
  b2xVn2: { 
    longURL: "http://www.lighthouselabs.ca",
    userTrackingID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "http://www.lighthouselabs",
    usersTrackingID: "aJ48lW"
  } 
};

const users = {
  1: {
    id: 1,
    email: "user@example.com",
    password: "123",
  },
  2: {
    id: 2,
    email: "user2@example.com",
    password: "123",
  },
};

const findUser = (email) => {
  for (const userID in users) {
    const user = users[userID];
    if (user.email === email) {
      return user;
    }
  }
  return null;
};

////////////////< GET >////////////////

app.get("/", (req, res) => {
  const userID = req.cookies.userId;

  if (!userID) {
    res.redirect("/urls/login");
    return;
  }
});

app.get("/urls", (req, res) => {
  const templateVars = { user: users[req.cookies.userId], urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/login", (req, res) => {
  if (req.cookies.userId) {
    res.redirect("/urls");
  } else {
    const templateVars = { user: null };
    res.render("login", templateVars);
  }
});

app.get("/register", (req, res) => {
  if (req.cookies.userId) {
    res.redirect("/urls");
  } else {
    res.render("register");
  }
});

app.get("/urls/new", (req, res) => {
  const templateVars = { user: users[req.cookies.userId], urlDatabase };
  res.render("urls_new", templateVars);
});

// GET route to show URL resource
app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;

  if (req.cookies.userId) {
    if (!urlDatabase[shortURL]) {
      res.status(404).send("This short URL does not exist.");
    } else {
      const templateVars = {
        user: users[req.cookies.userId],
        id: shortURL,
        longURL: urlDatabase[shortURL].longURL,
        urlDatabase: urlDatabase
      };
      res.render("urls_show", templateVars);
    }
  } else {
    res.status(403).send("Please login to edit the url");
  }
});

app.get("/urls/:shortURL/edit", (req, res) => {
  const shortURL = req.params.shortURL;
  const templateVars = {
    user: users[req.cookies.userId],
    id: shortURL,
    longURL: urlDatabase[shortURL],
  };
  res.render("urls_show", templateVars);
});

////////////////< POSTS >////////////////

// POST route to create new URL
app.post("/urls", (req, res) => {
  const newLongURL = req.body.longURL;
  const newID = generateRandomString();
  urlDatabase[newID] = {longURL: newLongURL};
  res.redirect(`/urls`);
});

// POST delete url
app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;
  delete urlDatabase[id];
  res.redirect("/urls");
});

// POST edit the url
app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  const newURL = req.body.UpdatedURL;
    urlDatabase[id].longURL = newURL;
    res.redirect("/urls");
});

// POST login
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = findUser(email);

  // Check if account is invalid
  if (user && password === user.password) {
    res.cookie("userId", user.id);
    res.redirect("/urls");
  } else {
    res.status(403).send("Invalid email or password");
  }
});

// POST New user registration
app.post("/register", (req, res) => {
  const newUserID = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    res.status(400).send("Email and password cannot be empty");
    return;
  }
  const user = findUser(email);
  if (user) {
    res.status(400).send("Email already exists");
    return;
  } else {
    users[newUserID] = { id: newUserID, email, password };
    res.cookie("userId", newUserID);
    res.redirect("/urls");
  }
});

// Create Cookie after login
app.post("/logout", (req, res) => {
  res.clearCookie("userId");
  res.redirect("/login");
});

// Create random ID
function generateRandomString() {
  let result = "";
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

app.listen(PORT, () => {
  console.log("Example app listening on port", PORT);
});
