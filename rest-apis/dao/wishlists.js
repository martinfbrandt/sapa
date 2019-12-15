const {Database} = require("./Database");
const { checkIfExists, interpretError } = require("../utils/daoError");
const {head, prop} = require('ramda');


const getInsertedRowId = rows => prop('last_insert_rowid()', head(rows))

module.exports.createWishlists = function(userId, wishlist, res) {
    let database = new Database();
    const query = `INSERT INTO wishlists (location, description, creator_id) VALUES (
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

module.exports.updateWishlists = function(userId, wishListId, wishlist, res) {
    let database = new Database();

    let updateItems = [];

    let params = [];

    if (wishlist.description) {
        updateItems.push(`description = ?`);
        params.push(wishlist.description)
    }
    if (wishlist.location) {
        updateItems.push(`location = ?`);
        params.push(wishlist.location)
    }

    params.push(wishListId);
    params.push(userId);
  

    const query = `UPDATE wishlists SET
        ${updateItems.join(", ")} 
        where id = ? and creator_id = ?`;
    
    database
        .runQuery(query, params)
        //retrieve the created wishlist
        .then(async () => {
            const updatedWishlists = await database.runQuery(
                `SELECT * FROM wishlists WHERE id = ? and creator_id = ?`, [wishListId, userId]
            );
            //close the database and return the wishlist to the service
            await database.close().then(() => res.json(head(updatedWishlists)));
        })
        .catch(err => {
            interpretError(err, 'wishlist', res);
        });
    }

module.exports.deleteWishlists = function(userId, wishListId, res) {
    let database = new Database();
    const query = `DELETE FROM wishlists where id = ? and creator_id = ?`;
    
    database
        .runQuery(query, [wishListId, userId])
        .then(() => {
            database.close().then(() => res.status(200).send());
          })
          .catch(err => {
            interpretError(err, "wishlist", res);
          });
    }

module.exports.getAllWishlists = function(res) {
    let database = new Database();
    const query = `SELECT * FROM wishlists`;

    database
        .runQuery(query)
        .then(async wishlists => {
          //close the database and return the wishlists to the service
          await database.close().then(() => res.json(wishlists));
        })}


module.exports.getAllUserWishlists = function(userId, res) {
    let database = new Database();
    const query = `SELECT * FROM wishlists WHERE creator_id = ?`;

    database   
        .runQuery(query, [userId])
        .then(async wishlists => {
          //close the databse connection and return the wishlists
          await database.close().then(() => res.json(wishlists))
        })
}