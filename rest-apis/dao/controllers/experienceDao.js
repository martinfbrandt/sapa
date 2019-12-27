const { Database } = require("../Database");
const { head, prop } = require("ramda");
const { checkIfExists, interpretDaoError } = require("../../utils/daoError");
const getInsertedRowId = rows => prop('last_insert_rowid()', head(rows))


//creates a user and any attached user roles
module.exports.createExperience = async function (userId, experience, res) {
    try {
        let database = new Database();

        const query = `INSERT INTO experiences (description, name, location, created_dt, owner_id) VALUES (
        ?, 
        ?, 
        ?,
        datetime('now'), 
        ?)`;
        await database.runQuery(query, [experience.description, experience.name, experience.location, userId])
        
        const createdRows = await database.runQuery('SELECT last_insert_rowid()')
        const createdExperiences = await database.runQuery(
            `SELECT * FROM experiences WHERE id = ?`, [getInsertedRowId(createdRows)]
        );
        //close the database and return the experience to the service
        await database.close();
        return Promise.resolve(head(createdExperiences));

    } catch (err) {
        interpretDaoError(err);
    }
};

module.exports.updateExperience = async (userId, experienceId, experience) => {
    try {
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
        if (experience.location) {
            updateItems.push(`location = ?`);
            params.push(experience.location)
        }

        params.push(experienceId);
        params.push(userId);

        let updateScript =
            "UPDATE experiences " +
            `SET ${updateItems.join(", ")}` +
            ` WHERE id = ? and owner_id = ?;`;
        await database.runQuery(updateScript, params);
        
        const experiences = await database.runQuery(
            `SELECT * FROM experiences WHERE id = ? and owner_id = ?`, [experienceId, userId]
        );

        await database.close();

        return Promise.resolve(head(experiences));

    } catch (err) {
        interpretDaoError(err);
    }
};

module.exports.getExperienceById = async (userId, experienceId, res) => {
    try {
        let database = new Database();
        const experiences = await database.runQuery(
            `SELECT * FROM experiences WHERE id = ? and owner_id = ?;`, [experienceId, userId]
        )
        await database.close();
        return Promise.resolve(head(experiences));

    } catch (err) {
        interpretDaoError(err);
    }
};

module.exports.getExperiences = async (userId, res) => {
    try {
        let database = new Database();

        const experiences = database.runQuery(`SELECT * FROM experiences WHERE owner_id = ?`, [userId]);
        await database.close();
        return Promise.resolve(experiences);

    } catch (err) {
        interpretDaoError(err);
    }
};

module.exports.removeExperience = async (userId, experienceId, res) => {
    try {
        let database = new Database();

        let experiences = await database.runQuery(
            `SELECT * FROM experiences WHERE id = ? and owner_id = ?;`, [experienceId, userId]
        );

        // TODO add logic to check if exists and throw 404 if it doesnt 



        await database
            .runQuery(`DELETE FROM experiences WHERE id = ? and owner_id = ?`, [experienceId, userId]);

        await database.close();
        return Promise.resolve();

    } catch (err) {
        interpretDaoError(err);
    }

};
