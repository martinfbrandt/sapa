const {decodeJwt, createJwt} = require('../../utils/auth');
var assert = require('assert');

describe('JWT auth', () => {
    describe('testing all jwt functionality', () => {
        it('should decode the jwt', () => {
            //uses non base 64 encoded secret
            const encodedjwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.1FkNy5lGVuq0pA2knc44KLEL6vAJBK5Zu28A3TidgpM'
             decodeJwt(encodedjwt).then(decoded => {
                 assert.equal(decoded.name, 'John Doe');
                 assert.equal(decoded.sub, '1234567890');
                 assert.equal(decoded.iat, '1516239022');

             });
        });

        it('should create a jwt', () => {
            //uses non base 64 encoded secret
            const jwt = createJwt({
                sessionData: {
                    email: `bobloblaw@loblaw.com`,
                    name: `bobloblaw`

                }, 
                maxAge:3600
            });
            decodeJwt(jwt).then(decoded => {
                assert.equal(decoded.data.name, 'bobloblaw');
                assert.equal(decoded.data.email, 'bobloblaw@loblaw.com');
            })

        });
    })
})
