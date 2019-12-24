const {hash, compare} = require('bcrypt');
const {isNil, isEmpty, assoc} = require('ramda');

module.exports.hashPassword = async user => {
    if (!isNil(user.password) && !isEmpty(user.password)) {
        try {
            const passHash = await new Promise((res, rej) => hash(user.password, 
                                                                parseInt(process.env.APP_SALT_ROUNDS, 10), 
                                                                    (err, hash) => {
                                                                        if(err) {
                                                                            rej(err);
                                                                        }
                                                                        res(hash);
                                                                    }));                                           
            return assoc('password', passHash, user);
        } catch (error) {
            throw new Error(`Unable to hash user's (id: ${user.id}, email: ${user.email}) password`);
        }
    }
}

module.exports.hasValidPassword = async (password, user) => {
    if (!isNil(password) && !isEmpty(password)) {
        try {
            return await compare(password, user.password_hash);
        } catch (error) {
            throw new Error(`Unable to compare user's (id: ${user.id}, email: ${user.email}) password`);
        }
    }

    return Promise.resolve(false);
};
