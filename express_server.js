const {
  getUserByEmail,
  generateRandomString,
  urlsForUser,
} = require("./helpers.js");
const { urlDatabase, usersDatabase } = require("./database.js");
const express = require("express");
// const cookieParser = require("cookie-parser"); // not used anymore
const cookieSession = require("cookie-session");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const app = express();
const PORT = 8080;

//This tells the Express app to use EJS as its templating engine
app.set("view engine", "ejs");

// This is middleware from Express, which will translate, or parse the body.
/* The body-parser library will convert the request body from .. 
    .. a Buffer into string that we can read.  */
app.use(express.urlencoded({ extended: true }));

// we are generating encrypted key for our cookie session
const key = crypto.randomBytes(32).toString("hex");

// app.use(cookieParser()); // when we used cookie to store data in plain text

// but now we are using encrypted cookies
app.use(
  cookieSession({
    name: "session",
    keys: [key],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);

////////////////< GET >////////////////

app.get("/", (req, res) => {
  const userId = req.session.userId;
  const user = usersDatabase[userId];

  if (user) {
    res.redirect("/urls");
  } else {
    res.redirect("/login");
    return;
  }
});

app.get("/urls", (req, res) => {
  const templateVars = {
    user: usersDatabase[req.session.userId],
    urlDatabase: urlsForUser(req.session.userId),
  };
  res.render("urls_index", templateVars);
});

app.get("/login", (req, res) => {
  const userId = req.session.userId;
  const user = usersDatabase[userId];
  if (user) {
    res.redirect("/urls");
  } else {
    const templateVars = { user: null };
    res.render("login", templateVars);
  }
});

app.get("/register", (req, res) => {
  const userId = req.session.userId;
  const user = usersDatabase[userId];
  if (user) {
    res.redirect("/urls");
  } else {
    res.render("register", { user });
  }
});

app.get("/urls/new", (req, res) => {
  const userId = req.session.userId;
  const user = usersDatabase[userId];
  if (user) {
    const templateVars = {
      user: usersDatabase[req.session.userId],
      urlDatabase: urlsForUser(req.session.userId),
    };
    res.render("urls_new", templateVars);
  } else {
    const templateVars = { user: null };
    res.render("login", templateVars);
  }
});

// GET route to show URL resource
app.get("/urls/:id", (req, res) => {
  const id = req.params.id;
  if (req.session.userId) {
    if (!urlDatabase[id]) {
      res.status(404).send("This short URL does not exist.");
    } else if (urlDatabase[id].userTrackingID !== req.session.userId) {
      res.status(403).send("This URL doesn't belong to you");
    } else if (urlDatabase[id].longURL === "") {
      res.status(403).send("The long URL is empty");
    } else {
      const templateVars = {
        user: usersDatabase[req.session.userId],
        id: id,
        longURL: urlDatabase[id].longURL,
        urlDatabase: urlsForUser(req.session.userId),
      };
      res.render("urls_show", templateVars);
    }
  } else {
    res.status(403).send("Please login to edit the url");
  }
});

app.get("/u/:id", (req, res) => {
  const id = req.params.id;
  if (!urlDatabase[id]) {
    res.status(404).send("This URL does not exist.");
  } else {
    res.redirect(urlDatabase[id].longURL);
  }
});

////////////////< POSTS >////////////////

// POST route to create new URL
app.post("/urls", (req, res) => {
  const userId = req.session.userId;
  const user = usersDatabase[userId];
  if (user) {
    const newLongURL = req.body.longURL;
    const newID = generateRandomString();
    const userTrackingID = req.session.userId;
    urlDatabase[newID] = {
      longURL: newLongURL,
      userTrackingID: userTrackingID,
    };
    res.redirect(`/urls/${newID}`);
  } else {
    const templateVars = { user: null };
    res.render("login", templateVars);
  }
});

// POST delete url
app.post("/urls/:id/delete", (req, res) => {
  const userId = req.session.userId;
  const user = usersDatabase[userId];
  if (user) {
    const id = req.params.id;
    delete urlDatabase[id];
    res.redirect("/urls");
  } else if (!urlDatabase[id]) {
    res.status(404).send("This URL does not exist.");
  } else {
    const templateVars = { user: null };
    res.render("login", templateVars);
  }
});

// POST edit the url
app.post("/urls/:id", (req, res) => {
  const userId = req.session.userId;
  const user = usersDatabase[userId];

  if (user) {
    const id = req.params.id;
    const newURL = req.body.UpdatedURL;
    urlDatabase[id].longURL = newURL;
    res.redirect("/urls");
  } else if (!urlDatabase[id]) {
    res.status(404).send("This URL does not exist.");
  } else {
    const templateVars = { user: null };
    res.render("login", templateVars);
  }
});

// POST New user registration
app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    res.status(400).send("Email and password cannot be empty");
    return;
  }
  const user = getUserByEmail(email, usersDatabase);

  if (user) {
    res.status(400).send("Email already exists");
    return;
  }

  const newUserID = generateRandomString();
  const hashedPassword = bcrypt.hashSync(password, 10);

  usersDatabase[newUserID] = { id: newUserID, email, password: hashedPassword };
  req.session.userId = newUserID;
  res.redirect("/urls");
});

// POST login
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    res.status(400).send("Email and password cannot be empty");
    return;
  }

  const user = getUserByEmail(email, usersDatabase);

  // Check if account is invalid
  if (!user) {
    return res.status(403).send("Invalid email");
  }

  const passwordMatch = bcrypt.compareSync(password, user.password);

  if (!passwordMatch) {
    return res.status(403).send("Invalid password");
  }

  req.session.userId = user.id;
  res.redirect("/urls");
});

// Create Cookie after login
app.post("/logout", (req, res) => {
  // res.clearCookie("userId");
  req.session = null;
  res.redirect("/login");
});

app.listen(PORT, () => {
  console.log("Example app listening on port", PORT);
});
