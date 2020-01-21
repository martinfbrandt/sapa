

class UserRole {
    constructor(key) {
        this.key = key;
    }

    get getKey() { return this.key; }

    set setKey(key) { this.key = key; }
}

module.exports = UserRole;