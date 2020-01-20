const { Database } = require("../dao/Database");
const { hashPassword, hasValidPassword } = require("../utils/passwords");
const { head, __, assoc, dissoc } = require("ramda");
const { createJwt } = require("../utils/auth");
const { interpretError, checkIfExists } = require("../utils/daoError");
const User = require('./../dao/domain-objects/user');
const {
  createUser,
  getUserByEmail,
  getRoles
} = require('./../dao/controllers/userDao');


// method to authenticate a user, check their password against a hash and log them in if valid
module.exports.postUserLogin = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = new User(name, email);

    const foundUser = await getUserByEmail(user);

    const isValid = await hasValidPassword(password, foundUser);

    if (isValid) {
      const successfulUser = dissoc('password_hash',
        assoc('jwt', createJwt(user), foundUser));
      res.json(successfulUser)

    } else {
      res.status(404).send({ error: 'Invalid password' });
    }
  }
  catch (err) {
    interpretError(err, 'user', res)
  }
};

//external role retrieval method, supplied with database
module.exports.retrieveRoles = async userId => {
  try {
    const roles = await getRoles(userId);

    return Promise.resolve(roles);
  }
  catch (err) {
    interpretError(err, 'user', res);
  }
}

//creates a user and any attached user roles
module.exports.createUser = async (user, res) => {
  try {
    const user = new User(req.body.name, req.body.email);

    const userRoles = user.roles;
    //hash the password
    const updatedUser = await hashPassword(user)

    createUser(user, updatedUser.password, userRoles)
  }
  catch (err) {

  }
};

module.exports.patchUser = async (userId, user, res) => {
  try {
  
  }
  catch (err) {

  }
};

module.exports.retrieveUserById = (userId, res) => {
  try {

  }
  catch (err) {

  }
};

module.exports.retrieveUsers = res => {
  try {

  }
  catch (err) {

  }
};

module.exports.deleteUser = async (userId, res) => {
  try {

  }
  catch (err) {

  }
};
