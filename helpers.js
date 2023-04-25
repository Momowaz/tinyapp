const { urlDatabase, usersDatabase } = require('./database.js')
const getUserByEmail = (email, users) => {
    for (const userID in users) {
        const user = users[userID];
        if (user.email === email) {
            return user;
        }
    }
    return undefined;
};

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

const urlsForUser = (id) => {
    const result = {}
    for (let shortURL in urlDatabase) {
        // id matches the tracking id 
        if (urlDatabase[shortURL].userTrackingID === id) {
            // add to result object
            result[shortURL] = urlDatabase[shortURL];
        }
    }
    return result
}

module.exports = { getUserByEmail, generateRandomString, urlsForUser };