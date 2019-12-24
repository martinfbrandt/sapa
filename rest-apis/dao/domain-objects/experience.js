


class Experience {

    id;
    location;
    description;
    name;
    createdDt;

    getId = () => this.id;

    getLocation = () => this.location;

    getDescription = () => this.description;

    getName = () => this.name;

    getCreatedDate = () => this.createdDt;

    setId = id => this.id = id;

    setLocation = location => this.location = location;

    setDescription = description => this.description = description;

    setName = name => this.name = name;

    setCreatedDate = date => this.createdDt = date;

}

module.exports = Experience;