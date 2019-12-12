const {verify, sign} = require('jsonwebtoken');
const {jwtExpirationSeconds} = require('./../config');

const decodeJwt = token => {
    return new Promise((res, rej) => {
        verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if(err){
                rej(err);
            }
            res(decodedToken);
        })
    })
}

module.exports.decodeJwt = decodeJwt;

module.exports.createJwt = details => {
    return sign({
        data: {
            id: details.id,
            email: details.email
        }
       }, process.env.JWT_SECRET, {
         expiresIn: jwtExpirationSeconds,
         algorithm: 'HS256'
     })
}
