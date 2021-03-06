

const { isNil } = require('ramda');

class User {

    constructor(name, email, password) {
        this.name = name;
        this.email = email;
        this.password = password;
    }

    set setRolesroles(roles) { this.roles = roles; }

    set setIdid(id) { this.id = id; }

    set setEmailemail(email) { this.email = email; }

    set setNamename(name) { this.name = name; }

    get getId() { return this.id; }

    get getEmail() { return this.email; }

    get getName() { return this.name; }

    get getRoles() { return isNil(this.roles) ? [] : this.roles; }
}

module.exports = User;
