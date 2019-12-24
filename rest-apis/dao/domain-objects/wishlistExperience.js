const Experience = require('./experience');


class WishlistExperience extends Experience {

    creatorId;
    wishlistId;
    addedDt;

    getCreatorId = () => this.creatorId;

    getWishlistId = () => this.calendarId;

    getAddedDate = () => this.addedDt;

    setCreatorId = id => this.creatorId = id;

    setWishlistId = id => this.calendarId = id;

    setAddedDate = date => this.addedDt = date;
}

module.exports = WishlistExperience;