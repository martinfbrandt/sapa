

class Wishlist {
    constructor(description, location) {
        this.description = description;
        this.location = location;
    }

    get getId() { return this.id; }

    get getCreatorId() { return this.ownerId; }

    get getLocation() { return this.location; }

    get getDescription() { return this.description; }

    set setId(id) { this.id = id; }

    set setCreatorId(id) { this.id = id; }

    set setLocation(location) { this.location = location; }

    set setDescription(description) { this.description = description; }

}

module.exports = Wishlist;