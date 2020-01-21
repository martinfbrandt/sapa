


class Experience {

    constructor(location, description, name) {
        this.location = location;
        this.description = description;
        this.name = name;
    }

    get getId() { return this.id; }

    get getLocation() { return this.location; }

    get getDescription() { return this.description; }

    get getName() { return this.name; }

    get getCreatedDate() { return this.createdDt; }

    set setId(id) { this.id = id; }

    set setLocation(location) { this.location = location; }

    set setDescription(description) { this.description = description; }

    set setName(name) { this.name = name; }

    set setCreatedDate(date) { this.createdDt = date; }

}

module.exports = Experience;