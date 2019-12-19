const { Database } = require("./Database");
const { interpretError } = require("../utils/daoError");
const { head, prop } = require('ramda');


const getInsertedRowId = rows => prop('last_insert_rowid()', head(rows))

// only to be used when creating a new user as calendars and users currently have 1-1 relationship
module.exports.createCalendar = function (userId, res) {
    let database = new Database();
    const query = `INSERT INTO calendar (creator_id) VALUES (?)`;

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
            interpretError(err, 'calendar', res);
        });
}



module.exports.addDefaultCalendarExperience = function (userId, experienceId, experience, res) {
    let database = new Database();

    const query = `INSERT INTO calendar_item (experience_id, calendar_id, added_dt, scheduled_dt) 
            VALUES (?, (SELECT id FROM calendar where creator_id = ?), datetime('now'), ?);`

    database
        .runQuery(query, [experienceId, userId, experience.scheduledDate])
        //retrieve the added experience
        .then(async () => await database.runQuery('SELECT last_insert_rowid()'))
        .then(async calendarItemId => {
            const newCalendarItem = await database.runQuery(
                `SELECT * FROM calendar_item WHERE id = ?`, [getInsertedRowId(calendarItemId)]
            );
            //close the database and return the calendar item to the service
            await database.close().then(() => res.json(head(newCalendarItem)));
        })
        .catch(err => {
            interpretError(err, 'calendar item', res);
        });
}
// Method should add an experience for a particular calendar and probably shouldn't be 
// used by anybody but admins for now
module.exports.addCalendarExperience = function (userId, experience, res) {
    let database = new Database();

    const query = `INSERT INTO calendar_item (experience_id, calendar_id, added_dt, scheduled_dt) 
        VALUES (?, (SELECT id FROM calendar where creator_id = ?), datetime('now'), ?);`
    console.log(query);
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
      calendar_id = (SELECT id FROM calendar where creator_id = ?);`

    database
        .runQuery(query, [experienceId, userId])
        .then(() => database.close().then(() => res.status(200).send()))
        .catch(err => {
            interpretError(err, 'calendar item', res);
        });
}

module.exports.removeDefaultCalendarExperience = function (userId, experienceId, res) {
    let database = new Database();

    const query = `DELETE FROM calendar_item WHERE experience_id = ? AND 
      calendar_id = (SELECT id FROM calendar where creator_id = ?);`

    database
        .runQuery(query, [experienceId, userId])
        .then(() => database.close().then(() => res.status(200).send()))
        .catch(err => {
            interpretError(err, 'calendar item', res);
        });
}

module.exports.getAllUserCalendarExperiences = function (userId, res) {
    let database = new Database();
    const query = `SELECT * FROM calendar_item where calendar_id = (SELECT id FROM calendar WHERE creator_id = ?)`;

    database
        .runQuery(query, [userId])
        .then(async calendarItems => {
            //close the database and return the calendars to the service
            await database.close().then(() => res.json(calendarItems));
        })
}
