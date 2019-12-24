const Experience = require('./experience');


class WishlistExperience extends Experience {

    get creatorId() {
        return this.creatorId;
    }

    get wishlistId() {
        return this.calendarId;
    }

    get addedDate() {
        return this.addedDt;
    }

    set creatorId(id) {
        this.creatorId = id;
    }

    set wishlistId(id) {
        this.calendarId = id;
    }

    set addedDate(date) {
        this.addedDt = date;
    }
}

module.exports = WishlistExperience;