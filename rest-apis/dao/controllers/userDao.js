const { Database } = require("../Database");
const { head, __, assoc, isNil, isEmpty } = require("ramda");
const { interpretDaoError, NotFountError } = require("../../utils/daoError");


const isNullOrEmpty = isNil || isEmpty;

module.exports.getUserByEmail = async (loginUser) => {
  try { //retrieve password hash via email
    let database = new Database();

    const loggingInUsers = await database.runQuery(`SELECT * FROM users WHERE email = ?;`, [loginUser.email]);
   
    if (isNullOrEmpty(loggingInUsers)) {
      throw NotFountError("The user does not exist");
    }    
    return Promise.resolve(head(loggingInUsers));
  } catch (err) {
    interpretDaoError(err);
  }



  //check password hash, if valid, return jwt
};

const updateRoles = async (userId, roles, database) => {
  try {
    await database
      .runQuery(`DELETE FROM user_roles WHERE user_id = ?`, [userId])

    for (const role of roles) {
      //insert each updated role
      await database.runQuery(
        `INSERT INTO user_roles ('key', 'user_id') VALUES (?, ?)`, [role, userId]
      )

    }

    const newRoles = await getRoles(userId, database)

    Promise.resolve(newRoles);

  }
  catch (err) {
    interpretDaoError(err);
  }
};

//returns array of role keys
const getRoles = async (userId, database) =>
  database.runQuery(`SELECT key FROM user_roles where user_id = ?`, [userId]);

//external role retrieval method, supplied with database
module.exports.getRoles = async userId => getRoles(userId, new Database());
  

//creates a user and any attached user roles
module.exports.createUser = async (user, hashedPassword, userRoles) => {
  try {
    let database = new Database();

    //insert the new user with their hashed password
    await database.runQuery(
      `INSERT INTO users ('name', 'email', 'password_hash') 
        VALUES (
        ?,
        ?,
        ?
      );`, [user.name, user.email, hashedPassword]
    );
    //retrieve the created user

    const updatedUsers = await database.runQuery("SELECT id, name, email FROM users ORDER BY id DESC LIMIT 1")


    // TODO make this actually work
    if (isNullOrEmpty(savedUsers)) {
      throw NotFountError("The user does not exist");
    }
    let updatedUser = head(updatedUsers);

    updatedUser.roles = await updateRoles(updatedUser.id, userRoles, database);
    //close the database and return the user to the service
    await database.close()

    return Promise.resolve(updatedUser);

  } catch (err) {
    interpretDaoError(err);
  }
};

module.exports.updateUser = async (userId, user) => {
  try {
    let database = new Database();

    // fail fast, look for user first
    const users = await database.runQuery(
      `SELECT id, name, email FROM users WHERE id = ?`, [userId]
    );
    const updatedUser = head(users);

    //check for 404
    if(isNullOrEmpty(updatedUser)){
      throw new NotFountError("The user does not exist")
    }


    let updateItems = [];

    let params = []

    if (user.name) {
      updateItems.push(`name = ?`);
      params.push(user.name)
    }
    if (user.email) {
      updateItems.push(`email = ?`);
      params.push(user.email)
    }

    if (user.roles) await putRoles(userId, user.roles, database);

    params.push(userId)

    let updateScript =
      "UPDATE users " +
      `SET ${updateItems.join(", ")}` +
      ` WHERE id = ?;`;

    await database
      .runQuery(updateScript, params)

    const updatedRoles = await getRoles(userId, database);

    await database.close()
    Promise.resolve(combineUserWithRoles(updatedUser, updatedRoles));

  }
  catch (err) {

    interpretDaoError(err);
  }
};

const combineUserWithRoles = (user, roles) => assoc("roles", roles, user);

module.exports.getUserById = async (userId) => {
  try {
    let database = new Database();
    const users = await database.runQuery(`SELECT id, name, email FROM users WHERE id = ?;`, [userId])
    const user = head(users);

    if(isNullOrEmpty(user)){
      throw new NotFountError("User does not exist");
    }

    const roles = await getRoles(user.id, database);
    await database.close();

    Promise.resolve(combineUserWithRoles(user, roles));
  }
  catch (err) {
    interpretDaoError(err);
  }
};

module.exports.getUsers = async () => {
  try {
    let database = new Database();

    const users = await database
      .runQuery(`SELECT id, name, email FROM users`);

    let updatedUsers = [];
    for (const user of users) {
      const userRoles = await getRoles(user.id, database);
      updatedUsers.push(combineUserWithRoles(user, userRoles));
    }

    await database.close();
    Promise.resolve(updatedUsers);

  } catch (err) {
    interpretDaoError(err);
  }
};

module.exports.removeUser = async (userId) => {
  try {
    let database = new Database();

    let users = await database.runQuery(`SELECT * FROM users WHERE id = ?`, [userId])

    if(isNullOrEmpty(head(users))){
      throw new NotFountError("User does not exist");
    }
    await database.runQuery(`DELETE FROM users WHERE id = ?`, [userId])
    await database.close();

    Promise.resolve();

  } catch (err) {
    interpretDaoError(err);
  }
};
