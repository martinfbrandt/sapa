const { Database } = require("../dao/Database");
const { hashPassword, hasValidPassword } = require("./passwords");
const { head, __, assoc, dissoc } = require("ramda");
const { createJwt } = require("./../utils/auth");
const { interpretError, checkIfExists } = require("./../utils/daoError");

// method to authenticate a user, check their password against a hash and log them in if valid
module.exports.loginUser = (login, res) => {
  //retrieve password hash via email
  let database = new Database();

  return database
    .runQuery(`SELECT * FROM users WHERE email = ?;`, [login.email])
    .then(users => {
      const user = head(users);
      checkIfExists(user, res)
      hasValidPassword(login.password, user).then(
        isValid =>
          isValid ? res.send(dissoc('password_hash', assoc('jwt', createJwt(user), user))) : res.status(404).send({ error: 'Invalid password' }),
        err => interpretError(err, "user", res)
      );
    });

  //check password hash, if valid, return jwt
};

const putRoles = function (userId, roles, database) {
  return new Promise((res, rej) =>
    database
      .runQuery(`DELETE FROM user_roles WHERE user_id = ?`, [userId])
      .then(() => {
        let promiseArray = [];
        for (const role of roles) {
          //add all the promises to an array
          promiseArray.push(
            database.runQuery(
              `INSERT INTO user_roles ('key', 'user_id') VALUES (?, ?)`, [role, userId]
            )
          );
        }
        //execute the array of promises
        Promise.all(promiseArray).then(() =>
          //once the promises resolve, return the new roles
          getRoles(userId, database).then(newRoles => res(newRoles))
        );
      })
      .catch(err => rej(err))
  );
};

//returns array of role keys
const getRoles = (userId, database) =>
  database.runQuery(`SELECT key FROM user_roles where user_id = ?`, [userId]);

//external role retrieval method, supplied with database
module.exports.getRoles = userId => getRoles(userId, new Database());

//creates a user and any attached user roles
module.exports.createUser = async (user, res) => {
  let database = new Database();

  const userRoles = user.roles;
  //hash the password
  const updatedUser = await hashPassword(user)
  //insert the new user with their hashed password
  database
    .runQuery(
      `INSERT INTO users ('name', 'email', 'password_hash') 
      VALUES (
      ?,
      ?,
      ?
  );`, [updatedUser.name, updatedUser.email, updatedUser.password]
    )
    //retrieve the created user
    .then(() =>
      database
        .runQuery("SELECT id, name, email FROM users ORDER BY id DESC LIMIT 1")
        //save the user's roles, set the updated user's roles
        .then(savedUsers => {
          //check for 404
          checkIfExists(savedUsers, res);

          const savedUser = head(savedUsers);
          putRoles(savedUser.id, userRoles, database)
            .then(newRoles => {
              savedUser.roles = newRoles;

              return savedUser;
            })
            //close the database and return the user to the service
            .then(user => database.close().then(() => res.json(user)));
        })
    )

    .catch(err => {
      console.log(err)
      interpretError(err, "user", res);
    });
};

module.exports.patchUser = async (userId, user, res) => {
  let database = new Database();

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

  return database
    .runQuery(updateScript, params)
    .then(async () => {
      const users = await database.runQuery(
        `SELECT id, name, email FROM users WHERE id = ?`, [userId]
      );
      const updatedUser = head(users);

      //check for 404
      checkIfExists(updatedUser, res);

      const updatedRoles = await getRoles(userId, database);

      database
        .close()
        .then(() => res.json(combineUserWithRoles(updatedUser, updatedRoles)));
    })
    .catch(err => interpretError(err, "user", res));
};

const combineUserWithRoles = (user, roles) => assoc("roles", roles, user);

module.exports.retrieveUser = (userId, res) => {
  let database = new Database();
  database
    .runQuery(`SELECT id, name, email FROM users WHERE id = ?;`, [userId])
    .then(users => {
      const user = head(users);

      checkIfExists(user, res);


      return getRoles(user.id, database).then(roles =>
        database.close().then(() => {

          res.json(combineUserWithRoles(user, roles));
        })
      )
    })
    .catch(err => {
      interpretError(err, "user", res);
    });
};

module.exports.getUsers = res => {
  let database = new Database();

  return database
    .runQuery(`SELECT id, name, email FROM users`)
    .then(async users => {
      let updatedUsers = [];
      for (const user of users) {
        const userRoles = await getRoles(user.id, database);
        updatedUsers.push(combineUserWithRoles(user, userRoles));
      }

      //YOU WERE WORKING ON THIS AND THEN YOU GOT REALLY REALLY SLEEPY
      await database.close().then(() => res.json(updatedUsers));
    })
    .catch(err => {
      interpretError(err, "user", res);
    });
};

module.exports.deleteUser = async (userId, res) => {
  let database = new Database();

  let users = await database.runQuery(`SELECT * FROM users WHERE id = ?`, [userId])

  checkIfExists(head(users), res);

  return database
    .runQuery(`DELETE FROM users WHERE id = ?`, [userId])
    .then(() => database.close().then(() => res.status(200).send()))
    .catch(err => {
      interpretError(err, "user", res);
    });
};
