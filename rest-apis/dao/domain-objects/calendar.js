

class Calendar {
    id;
    ownerId;

    getId = () => this.id;

    getOwnerId = () => this.ownerId;

    setId = id => this.id = id;

    setOwnerId = id => this.id = id;
}

module.exports = Calendar;