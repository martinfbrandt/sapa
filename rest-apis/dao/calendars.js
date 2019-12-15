const {Database} = require("./Database");
const { checkIfExists, interpretError } = require("../utils/daoError");
const {head, prop} = require('ramda');


const getInsertedRowId = rows => prop('last_insert_rowid()', head(rows))

module.exports.createCalendar = function(userId, res) {
    let database = new Database();
    const query = `INSERT INTO calendars (location, description, creator_id) VALUES (
          ?, 
          ?,
          ?)`;
  
    database
      .runQuery(query, [wishlist.location, wishlist.description, userId])
      .then(async () => await database.runQuery('SELECT last_insert_rowid()'))
      //retrieve the created experience
      .then(async rows => {
          const rowId = getInsertedRowId(rows);
          const createdWishlists = await database.runQuery(
            `SELECT * FROM wishlists WHERE id = ?`, [rowId]
          );
        //close the database and return the experience to the service
        await database.close().then(() => res.json(head(createdWishlists)));
      })
      .catch(err => {
        interpretError(err, 'wishlist', res);
      });
    }

module.exports.addCalendarExperience = function(userId, experience, res) {
    let database = new Database();

    const query = `INSERT INTO calendar_items (experience_id, calendar_id, added_dt, scheduled_dt) 
        VALUES (?, SELECT id FROM calendar where creator_id = ?, datetime('now'), ?;`
    
    database
        .runQuery(query, [experience.id, userId, experience.scheduledDate])
        //retrieve the created wishlist
        .then(async () => await database.runQuery('SELECT last_insert_rowid()'))
        .then(async calendarItemId => {
            const newCalendarItem = await database.runQuery(
                `SELECT * FROM calendar_items WHERE id = ?`, [getInsertedRowId(calendarItemId)]
            );
            //close the database and return the wishlist to the service
            await database.close().then(() => res.json(head(newCalendarItem)));
        })
        .catch(err => {
            interpretError(err, 'calendar item', res);
        });
    }

  module.exports.removeCalendarExperience = function(userId, experienceId, res) {
      let database = new Database();
  
      const query = `DELETE FROM calendar_items WHERE experience_id = ? AND calendar_id = (SELECT id FROM calendar where creator_id = ?);`
      
      database
          .runQuery(query, [experienceId, userId])
          //retrieve the created wishlist
          .then(async () => {
              //close the database and return the wishlist to the service
              await database.close().then(() => res.status(200).send());
          })
          .catch(err => {
              interpretError(err, 'calendar item', res);
          });
      }

module.exports.getAllUserCalendarExperiences = function(userId, res) {
    let database = new Database();
    const query = `SELECT * FROM calendar_item where calendar_id = (SELECT id FROM calendar WHERE creator_id = ?)`;

    database
        .runQuery(query, [userId])
        .then(async wishlists => {
          //close the database and return the wishlists to the service
          await database.close().then(() => res.json(wishlists));
        })}
