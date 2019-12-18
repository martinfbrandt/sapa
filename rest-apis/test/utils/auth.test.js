const {decodeJwt, createJwt} = require('../../utils/auth');
var assert = require('assert');

describe('Testing all jwt functionality', () => {
    it('should decode the jwt', () => {
        //uses non base 64 encoded secret
        const encodedjwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.1FkNy5lGVuq0pA2knc44KLEL6vAJBK5Zu28A3TidgpM'
            decodeJwt(encodedjwt).then(decoded => {
                assert.equal(decoded.name, 'John Doe');
                assert.equal(decoded.sub, '1234567890');
                assert.equal(decoded.iat, '1516239022');

            }).catch(err => console.log('error with decode: ', err));
    });

    it('should create a jwt', () => {
        //uses non base 64 encoded secret
        const jwt = createJwt({
            email: `bobloblaw@loblaw.com`,
            id: 1
        });
        decodeJwt(jwt).then(decoded => {
            assert.equal(decoded.data.id, 1);
            assert.equal(decoded.data.email, 'bobloblaw@loblaw.com');
        }).catch(err => console.log('error with decode: ', err));

    });
})

