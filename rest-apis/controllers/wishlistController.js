const { interpretError } = require("../utils/daoError");
const { pathOr } = require('ramda');
const Wishlist = require('../dao/domain-objects/wishlist')
const {
    createWishlists,
    getWishlistById,
    addWishlistExperience,
    removeWishlistExperience,
    getWishlistExperienceById,
    updateWishlists,
    getAllWishlistExperiences,
    deleteWishlists,
    getAllWishlists,
    getAllUserWishlists
} = require('../dao/controllers/wishlistDao')


const getUserId = pathOr(0, ["decoded", "data", "id"]);



module.exports.postWishlists = async function (req, res, next) {
    try {
        const userId = getUserId(req);

        const wishlist = new Wishlist(req.body.description, req.body.location);

        const createdWishlist = await createWishlists(userId, wishlist);
        res.json(createdWishlist);

    } catch (err) {
        interpretError(err, 'wishlist', res)
    }

}

module.exports.retrieveWishlistById = async function (req, res, next) {
    try {
        const userId = getUserId(req);

        const wishlist = await getWishlistById(userId, req.params.wishlistId);

        res.json(wishlist);

    } catch (err) {
        interpretError(err, 'wishlist', res)
    }
}


module.exports.postWishlistExperience = async function (req, res, next) {
    try {
        const userId = getUserId(req);

        const { wishlistId, experienceId } = req.params;

        const wishlistExperience = await addWishlistExperience(userId, wishlistId, experienceId);
        res.json(wishlistExperience);

    } catch (err) {
        interpretError(err, 'wishlist', res)
    }
}

module.exports.deleteWishlistExperience = async function (req, res, next) {
    try {
        const userId = getUserId(req);

        const { wishlistId, experienceId } = req.params;

        await removeWishlistExperience(userId, wishlistId, experienceId);

        res.status(200).send();

    } catch (err) {
        interpretError(err, 'wishlist', res)
    }
}

module.exports.retrieveWishlistExperienceById = async function (req, res, next) {
    try {
        const userId = getUserId(req);

        const { wishlistId, experienceId } = req.params;

        const wishlistExperience = await getWishlistExperienceById(wishlistId, experienceId, userId);
        res.json(wishlistExperience);

    } catch (err) {
        interpretError(err, 'wishlist', res)
    }
}

module.exports.retrieveAllWishlistExperiences = async function (req, res, next) {
    try {
        const userId = getUserId(req);

        const { wishlistId } = req.params;

        const wishlistExperiences = await getAllWishlistExperiences(wishlistId, userId);

        res.json(wishlistExperiences);

    } catch (err) {
        interpretError(err, 'wishlist', res)
    }
}


module.exports.patchWishlists = async function (req, res, next) {
    try {
        const userId = getUserId(req);

        const { wishlistId } = req.params;

        const wishlist = new Wishlist(req.params.description, req.params.location);

        const updatedWishlist = await updateWishlists(userId, wishlistId, wishlist);

        res.json(updatedWishlist);

    } catch (err) {
        interpretError(err, 'wishlist', res)
    }
}

module.exports.deleteWishlist = async function (req, res, next) {
    try {
        const userId = getUserId(req);

        const { wishlistId } = req.params;

        await deleteWishlists(userId, wishlistId);

        res.status(200).send();

    } catch (err) {
        interpretError(err, 'wishlist', res)
    }
}

// admin only
module.exports.retrieveWishlists = async function (req, res, next) {
    try {

        const wishlists = await getAllWishlists();

        res.json(wishlists);

    } catch (err) {
        interpretError(err, 'wishlist', res)
    }
}


module.exports.retrieveUserWishlists = async function (req, res, next) {
    try {
        const userId = getUserId(req);

        const userWishlists = await getAllUserWishlists(userId);

        res.json(userWishlists);

    } catch (err) {
        interpretError(err, 'wishlist', res)
    }
}