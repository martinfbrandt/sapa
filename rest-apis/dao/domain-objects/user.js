

const {isNil} = require('ramda');

class User {
    id;
    name;
    email;
    roles;


    setRoles = roles => this.roles = roles;

    setId = id => this.id = id;

    setEmail = email => this.email = email;

    setName = name => this.name = name;

    getId = () => this.id;

    getEmail = () => this.email;

    getName = () => this.name;

    getRoles = () => isNil(this.roles) ? [] : this.roles;
}

module.exports = User;
