const { hashPassword, hasValidPassword } = require("../utils/passwords");
const { assoc, dissoc } = require("ramda");
const { createJwt } = require("../utils/auth");
const { interpretError } = require("../utils/daoError");
const User = require('./../dao/domain-objects/user');
const {
  createUser,
  getUserByEmail,
  getRoles,
  updateUser,
  getUserById,
  getUsers,
  removeUser
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
        assoc('jwt', createJwt(foundUser), foundUser));
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
module.exports.createUser = async (req, res, next) => {
  try {
    const user = new User(req.body.name, req.body.email, req.body.password);
    const userRoles = req.body.roles;
    //hash the password
    const updatedUser = await hashPassword(user);

    const createdUser = await createUser(user, updatedUser.password, userRoles)
    res.json(createdUser);
  }
  catch (err) {
    interpretError(err, 'user', res);
  }
};

module.exports.patchUser = async (req, res, next) => {
  try {
    const user = new User(req.body.name, req.body.email);

    const updatedUser = await updateUser(req.params.id, user);

    res.json(updatedUser);
  }
  catch (err) {
    interpretError(err, 'user', res);
  }
};

module.exports.retrieveUserById = async (req, res, next) => {
  try {
    const user = await retrieveUserById(req.params.id);

    res.json(user);
  }
  catch (err) {
    interpretError(err, 'user', res);
  }
};

module.exports.retrieveUsers = async (req, res, next) => {
  try {
    const users = await getUsers();
    res.json(users);

  }
  catch (err) {
    interpretError(err, 'user', res);
  }
};

module.exports.deleteUser = async (req, res, next) => {
  try {

    await removeUser(req.params.id);

    res.status(200).send();

  }
  catch (err) {
    interpretError(err, 'user', res);
  }
};
