const { Database } = require("../Database");
const { head, prop } = require('ramda');
const { interpretDaoError } = require('../../utils/daoError')


const getInsertedRowId = rows => prop('last_insert_rowid()', head(rows))

module.exports.createWishlists = async function (userId, wishlist) {
    try {
        let database = new Database();
        const query = `INSERT INTO wishlists (location, description, creator_id) VALUES (
          ?, 
          ?,
          ?)`;

        await database.runQuery(query, [wishlist.location, wishlist.description, userId]);

        const createdRows = await database.runQuery('SELECT last_insert_rowid()');
        //retrieve the created wishlist

        const rowId = getInsertedRowId(createdRows);
        const createdWishlists = await database.runQuery(
            `SELECT * FROM wishlists WHERE id = ?`, [rowId]
        );

        //close the database and return the wishlist to the service
        await database.close();
        return Promise.resolve(head(createdWishlists));

    }
    catch (err) {
        interpretDaoError(err);
    }
}

module.exports.getWishlistById = async function (userId, wishlistId) {
    try {
        let database = new Database();

        const query = `SELECT * FROM wishlists WHERE id = ? AND creator_id = ?;`

        const wishlists = await database.runQuery(query, [wishlistId, userId])
        await database.close();
        return Promise.resolve(head(wishlists));

    }
    catch (err) {
        interpretDaoError(err);

    };
}


module.exports.addWishlistExperience = async function (userId, wishListId, experienceId) {
    try {
        let database = new Database();

        const query = `INSERT INTO wishlist_item (experience_id, wishlist_id, added_dt) 
        VALUES (?, (SELECT id FROM wishlists WHERE id = ? AND creator_id = ?), datetime('now'));`

        await database.runQuery(query, [experienceId, wishListId, userId])
        //retrieve the added experience
        const createdExperienceIds = await database.runQuery('SELECT last_insert_rowid();');

        const newWishlistItems = await database.runQuery(
            `SELECT * FROM wishlist_item WHERE id = ?;`, [getInsertedRowId(createdExperienceIds)]
        );

        //close the database and return the wishlist item to the service
        await database.close();

        return Promise.resolve(head(newWishlistItems));

    }
    catch (err) {
        interpretDaoError(err);
    }
}

module.exports.removeWishlistExperience = async function (userId, wishlistId, experienceId) {
    try {
        let database = new Database();

        const query = `DELETE FROM wishlist_item WHERE experience_id = ? AND 
      wishlist_id = (SELECT id FROM wishlists WHERE id = ? AND creator_id = ?);`

        await database.runQuery(query, [experienceId, wishlistId, userId])

        await database.close();
        return Promise.resolve();
    } catch (err) {
        interpretDaoError(err);
    }
}

module.exports.getWishlistExperienceById = async function (wishlistId, experienceId, userId) {
    try {
        let database = new Database();
        const query = `SELECT * FROM wishlist_item WHERE experience_id = ? AND wishlist_id = (SELECT id FROM wishlists WHERE id = ? AND creator_id = ?)`;

        const wishlistExperiences = await database
            .runQuery(query, [experienceId, wishlistId, userId]);
        //close the databse connection and return the wishlist items
        await database.close();
        return Promise.resolve(head(wishlistExperiences));
    } catch (err) {
        interpretDaoError(err);

    }
}

module.exports.getAllWishlistExperiences = async function (wishlistId, userId) {
    try {
        let database = new Database();
        const query = `SELECT * FROM wishlist_item WHERE wishlist_id = (SELECT id FROM wishlists WHERE id = ? AND creator_id = ?)`;

        const wishlistItems = await database.runQuery(query, [wishlistId, userId])

        //close the databse connection and return the wishlist items
        await database.close();

        return Promise.resolve(wishlistItems);

    } catch (err) {
        interpretDaoError(err);

    }
}


module.exports.updateWishlists = async function (userId, wishListId, wishlist) {
    try {
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

        await database.runQuery(query, params)
        //retrieve the created wishlist

        const updatedWishlists = await database.runQuery(
            `SELECT * FROM wishlists WHERE id = ? and creator_id = ?`, [wishListId, userId]
        );
        //close the database and return the wishlist to the service
        await database.close()
        return Promise.resolve(head(updatedWishlists));

    }
    catch (err) {
        interpretDaoError(err);

    }
}

module.exports.deleteWishlists = async function (userId, wishListId) {
    try {
        let database = new Database();
        const query = `DELETE FROM wishlists where id = ? and creator_id = ?`;

        await database.runQuery(query, [wishListId, userId]);
        await database.close();

        return Promise.resolve();
    }
    catch (err) {
        interpretDaoError(err);
    };

}

module.exports.getAllWishlists = async function () {
    try {
        let database = new Database();
        const query = `SELECT * FROM wishlists`;

        const wishlists = await database.runQuery(query)
        await database.close()
        return Promise.resolve(wishlists)
    } catch (err) {
        interpretDaoError(err);
    }
}


module.exports.getAllUserWishlists = async function (userId) {
    try {
        let database = new Database();
        const query = `SELECT * FROM wishlists WHERE creator_id = ?`;

        const wishlists = await database.runQuery(query, [userId])

        await database.close();

        return Promise.resolve(wishlists);

    } catch (err) {
        interpretDaoError(err);
    }
}