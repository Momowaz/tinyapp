const { assert } = require('chai');

const {getUserByEmail} = require('../helpers.js');

const testUsers = {
    1: {
        id: 1,
        email: "user@example.com",
        password: "123"
    },
    2: {
        id: 2,
        email: "user2@example.com",
        password: "123"
    }
};

describe('getUserByEmail', function () {
    it('should return a user with valid email', function () {
        const user = getUserByEmail("user@example.com", testUsers)
        const expectedUserID = 1;
        const expectedEmail = "user@example.com";
        // assert statements:
        assert.isObject(user, 'getUserByEmail returns an object');
        assert.equal(user.id, expectedUserID, 'user.id should be equal to expected');
        assert.equal(user.email, expectedEmail, 'user.email shourld be equal to expected email');
    });

    it('should return undefined if user is not existed', function () {
        const user = getUserByEmail("user3@example.com", testUsers)
        assert.isUndefined(user, 'getUserByEmail returns undefined for nonexistent user');

    });
});