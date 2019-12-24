

class Wishlist {
    constructor(description, location) {
        this.description = description;
        this.location = location;
    }

    getId = () => this.id;

    getCreatorId = () => this.ownerId;

    getLocation = () => this.location;

    getDescription = () => this.description;

    setId = id => this.id = id;

    setCreatorId = id => this.id = id;

    setLocation = location => this.location = location;

    setDescription = description => this.description = description;

}

module.exports = Wishlist;