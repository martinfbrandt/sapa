const { Database } = require("./../Database");
const { interpretError, interpretDaoError } = require("../../utils/daoError");
const { head, prop } = require('ramda');
const getInsertedRowId = rows => prop('last_insert_rowid()', head(rows));


// only to be used when creating a new user as calendars and users currently have 1-1 relationship
module.exports.createCalendar = function (userId, res) {
    let database = new Database();
    const query = `INSERT INTO calendar (owner_id) VALUES (?)`;

    database
        .runQuery(query, [userId])
        .then(async () => await database.runQuery('SELECT last_insert_rowid()'))
        //retrieve the created calendar
        .then(async rows => {
            const rowId = getInsertedRowId(rows);
            const createdCalendar = await database.runQuery(
                `SELECT * FROM calendar WHERE id = ?`, [rowId]
            );
            //close the database and return the calendar to the service
            await database.close().then(() => res.json(head(createdCalendar)));
        })
        .catch(err => {
            interpretDaoError(err, 'calendar', res);
        });
}



module.exports.addDefaultCalendarExperience = async function (userId, experienceId, experience) {
    try {
        let database = new Database();
        const query = `INSERT INTO calendar_item (experience_id, calendar_id, added_dt, scheduled_dt) 
            VALUES (?, (SELECT id FROM calendar where owner_id = ?), datetime('now'), ?);`

        await database.runQuery(query, [experienceId, userId, experience.getScheduledDate])
        //retrieve the added experience

        let calendarItemId = await database.runQuery('SELECT last_insert_rowid()');
        const newCalendarItem = await database.runQuery(
            `SELECT * FROM calendar_item WHERE id = ?`, [getInsertedRowId(calendarItemId)]
        );
        //close the database and return the calendar item to the service
        await database.close();

        return Promise.resolve(newCalendarItem)

    }
    catch (err) {
        throw interpretDaoError(err);
    }
}
// Method should add an experience for a particular calendar and probably shouldn't be 
// used by anybody but admins for now
module.exports.addCalendarExperience = function (userId, experience, res) {
    let database = new Database();

    const query = `INSERT INTO calendar_item (experience_id, calendar_id, added_dt, scheduled_dt) 
        VALUES (?, (SELECT id FROM calendar where owner_id = ?), datetime('now'), ?);`
    database
        .runQuery(query, [experience.id, userId, experience.scheduledDate])
        //retrieve the added experience
        .then(async () => await database.runQuery('SELECT last_insert_rowid();'))
        .then(async calendarItemId => {
            const newCalendarItem = await database.runQuery(
                `SELECT * FROM calendar_item WHERE id = ?;`, [getInsertedRowId(calendarItemId)]
            );

            //close the database and return the calendar item to the service
            await database.close().then(() => res.json(head(newCalendarItem)));
        })
        .catch(err => {
            interpretError(err, 'calendar item', res);
        });
}

// Method should delete an experience for a particular calendar and probably shouldn't be 
// used by anybody but admins for now
module.exports.removeCalendarExperience = function (userId, calendarId, experienceId, res) {
    let database = new Database();

    const query = `DELETE FROM calendar_item WHERE experience_id = ? AND 
      calendar_id = (SELECT id FROM calendar where owner_id = ?);`

    database
        .runQuery(query, [experienceId, userId])
        .then(() => database.close().then(() => res.status(200).send()))
        .catch(err => {
            interpretError(err, 'calendar item', res);
        });
}

module.exports.removeDefaultCalendarExperience = async function (userId, experienceId) {
    try {
        let database = new Database();

        const query = `DELETE FROM calendar_item WHERE experience_id = ? AND 
          calendar_id = (SELECT id FROM calendar where owner_id = ?);`

        await database.runQuery(query, [experienceId, userId]);

        await database.close();
        Promise.resolve();
    }
    catch (err) {
        interpretDaoError(err);
    };
}

module.exports.getCalendarExperienceById = async function (userId, experienceId) {
    try {
        let database = new Database();

        const query = `SELECT * FROM calendar_item WHERE experience_id = ? AND 
          calendar_id = (SELECT id FROM calendar where owner_id = ?);`

        const experiences = await database.runQuery(query, [experienceId, userId])
        await database.close();
        return Promise.resolve(experiences);
    }
    catch (err) {
        interpretDaoError(err);
    }
}

module.exports.getDefaultCalendarExperiences = async function (userId) {
    try {
        let database = new Database();
        const query = `SELECT * FROM calendar_item where calendar_id = (SELECT id FROM calendar WHERE owner_id = ?)`;

        const calendarItems = await database.runQuery(query, [userId]);
        //close the database and return the calendars to the service
        await database.close();
        return Promise.resolve(calendarItems);
    }
    catch (err) {
        interpretDaoError(err);
    }

}
