const {type, complement, equals, contains} = require('ramda');

const notEquals = complement(equals)

module.exports.validateUserUpdate = (req, res, next) => {
    if(req.body){
        //put some user validation in here
        next();
    } else {
        return res.status(400).send({error: "A valid JSON body must be provided"})
    }
}

const validRoles = ['user', 'admin', 'user-manager']

module.exports.validateUserRoles = (req, res, next) => {
    const roles = req.body.roles;
    if(roles && type(roles) === "Array"){
        roles.forEach(role => {
            if(!contains(role, validRoles)){
                return res.status(400).send({error: "The role value must be one of: user, user-manager, admin"});
            }
            
        });
        next();
    } else {
        return res.status(400).send({error: "A valid array of role key objects must be present"})
    }
}

module.exports.validateUserCreate = (req, res, next) => {
    if(req.body){
        if(!req.body.name) {
            return res.status(400).send({error: "A user name must be provided"});
        }
        if(!req.body.email) {
            return res.status(400).send({error: "A user email must be provided"});
        }
        if(!req.body.password) {
            return res.status(400).send({error: "A user password must be provided"});
        }
        next();
    } else {
        return res.status(400).send({error: "A valid JSON body must be provided"})
    }
}
