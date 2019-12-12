const { Database } = require("./Database");
const { head, __, assoc } = require("ramda");
const { checkIfExists, interpretError } = require("../utils/daoError");

//creates a user and any attached user roles
module.exports.createExperience = function(userId, experience, res) {
  let database = new Database();

  const query = `INSERT INTO experiences (description, name, created_dt, user_id) VALUES (
        ?, 
        ?, 
        datetime('now'), 
        ?)`;

  database
    .runQuery(query, [experience.description, experience.name, userId])
    
    //retrieve the created experience
    .then(async () => {
      const createdExperiences = await database.runQuery(
        `SELECT * FROM experiences WHERE user_id = ? ORDER BY id DESC LIMIT 1`, [userId]
      );
      //close the database and return the experience to the service
      await database.close().then(() => res.json(head(createdExperiences)));
    })
    .catch(err => {
      interpretError(err, 'experience', res);
    });
};

module.exports.patchExperience = async (userId, experienceId, experience, res) => {
  let database = new Database();

  let updateItems = [];

  let params = [];

  if (experience.description) {
    updateItems.push(`description = ?`);
    params.push(experience.description)
  }
  if (experience.name) {
    updateItems.push(`name = ?`);
    params.push(experience.name)
  }

  params.push(experienceId);
  params.push(userId);

  let updateScript =
    "UPDATE experiences " +
    `SET ${updateItems.join(", ")}` +
    ` WHERE id = ? and user_id = ?;`;
  return database
    .runQuery(updateScript, params)
    .then(async () => {
      const experiences = await database.runQuery(
        `SELECT * FROM experiences WHERE id = ? and user_id = ?`, [experienceId, userId]
      );
      const updatedExperience = head(experiences);

      //throw 404 if empty
      checkIfExists(updatedExperience, res);

      database.close().then(() => res.json(updatedExperience));
    })
    .catch(err => interpretError(err, 'experience', res)
    );
};

module.exports.retrieveExperience = (userId, experienceId, res) => {
  let database = new Database();
  database
    .runQuery(
      `SELECT * FROM experiences WHERE id = ? and user_id = ?;`, [experienceId, userId]
    )
    .then(experiences =>
      database.close().then(() => {
        const experience = head(experiences)
        //throw 404 if empty
        checkIfExists(experience, res);

        res.json(experience);
      })
    )
    .catch(err => {
      interpretError(err, 'experience', res);
    });
};

module.exports.getExperiences = (userId, res) => {
  let database = new Database();

  return database
    .runQuery(`SELECT * FROM experiences WHERE user_id = ?`, [userId])
    .then(async experiences => {
      await database.close().then(() => res.json(experiences));
    })
    .catch(err => {
      interpretError(err, 'experience', res);
    });
};

module.exports.deleteExperience = async (userId, experienceId, res) => {
  let database = new Database();

  let experiences = await database.runQuery(
    `SELECT * FROM experiences WHERE id = ? and user_id = ?;`, [experienceId, userId]
  );

  checkIfExists(head(experiences), res);

  return database
    .runQuery(`DELETE FROM experiences WHERE id = ? and user_id = ?`, [experienceId, userId])
    .then(() => {
      database.close().then(() => res.status(200).send());
    })
    .catch(err => {
      interpretError(err, "experience", res);
    });
};
