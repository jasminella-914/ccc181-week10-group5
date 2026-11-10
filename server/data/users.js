const bcrypt = require('bcryptjs');

const users = [
  {
    id: 1,
    name: 'Demo Student',
    email: 'student@campusconnect.test',
    passwordHash: bcrypt.hashSync('Campus26', 10),
  },
];

function findByEmail(email) {
  return users.find((user) => user.email === email);
}

function toPublic(user) {
  return { id: user.id, name: user.name, email: user.email };
}

module.exports = { findByEmail, toPublic};

