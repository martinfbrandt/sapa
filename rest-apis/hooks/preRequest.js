const { assoc } = require('ramda');


module.exports.processSignup = (req, res, next) => {
    // Preprocessor will give new user a default role
    // TODO Might want to refactor to use a new signup controller in the future once user 
    // gets more complex
    try {
        const userWithRole = assoc('roles', ["user"], req.body)
        req.body = userWithRole;
        next();
    }
    catch (err) {
        return res.status(400).send({error: "The user cannot be processed"});
    }
}