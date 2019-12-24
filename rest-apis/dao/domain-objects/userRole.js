

class UserRole {
    constructor(key) {
        this.key = key;
    }

    getKey = () => this.key;

    setKey = key => this.key = key;
}

module.exports = UserRole;