// const users = require('./express_server.js');
const getUserByEmail = (email, users) => {
    for (const userID in users) {
      const user = users[userID];
      if (user.email === email) {
        return user;
      }
    }
    return undefined;
  };

  
  module.exports = getUserByEmail;