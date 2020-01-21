const {type, complement, equals, isEmpty} = require('ramda');
const Experience = require('../dao/domain-objects/experience')
const notEquals = complement(equals)

module.exports.validateExperience = (req, res, next) => {
    if(req.body){
        if(req.body.name && notEquals(type(req.body.name), "String")) {
            return res.status(400).send({error: "An experience must have a name"});
        }
        if(isEmpty(req.body.location)){
            return res.status(400).send({error: "An experience must have a location"});
        }
        if(isEmpty(req.body.description)){
            return res.status(400).send({error: "An experience must have a description"});
        }

        // success, create object
        req.experience = Object.assign(new Experience, req.body);
        next();
    } else {
        return res.status(400).send({error: "A valid JSON body must be provided"})
    }
}

