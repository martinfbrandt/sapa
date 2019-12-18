const chakram = require('chakram');
const { concat, prop, propEq, find } = require('ramda');
const endpoint = 'http://localhost:3000/api';

const expect = chakram.expect;

const headers = {
    'headers': { 'content-type': 'application/json' }
}

const adminUserCreds = {
    "email": "admin@sapa.com",
    "password": "admin"
}


describe('User tests', () => {
    before('Remove user', () => {
        let jwt;
        return chakram.post(concat(endpoint, '/login'), adminUserCreds, headers)
            .then(loggedInUserResponse => {
                jwt = loggedInUserResponse.body.jwt;
                //returns the user id of the user to delete
                return chakram.get(concat(endpoint, '/users'), { headers: { 'authorization': jwt } })
                    .then(users => prop('id', find(propEq('email', 'barry@sapa.com'), users.body)))
            })
            .then(id => chakram.delete(concat(endpoint, `/users/${id}`), {}, { headers: { 'authorization': jwt } }))
    });



    it("Should create a user successfully", () => {
        return chakram.post(concat(endpoint, '/signup'),
            {
                "name": "barry goldwater",
                "email": "barry@sapa.com",
                "password": "barrylost",
                "roles": ["user"]
            }, headers)
            .then(response => {
                expect(response).to.have.status(200)
                expect(response).to.have.header('access-control-allow-methods')
            })
            .catch(err => {
                throw new Error(err)
            })
    })

    it("Should fail to create a user without a password", () => {
        return chakram.post(concat(endpoint, '/signup'),
            {
                "name": "barry goldwater",
                "email": "barry@blah.com",
                "password": "",
                "roles": ["user"]
            }, headers)
            .then(response => {
                expect(response).to.have.status(400)
                expect(response.body.error).to.equal('A user password must be provided')
            })
            .catch(err => {
                throw new Error(err)
            })
    })


    it("Should fail to create a user without a name", () => {
        return chakram.post(concat(endpoint, '/signup'),
            {
                "email": "barry@blah.com",
                "password": "1233456",
                "roles": ["user"]
            }, headers)
            .then(response => {
                expect(response).to.have.status(400)
                expect(response.body.error).to.equal('A user name must be provided')
            })
            .catch(err => {
                throw new Error(err)
            })
    })


    // check to see user can be created without roles field and gets default user role
    

    // check to see that the user can't assign themselves admin privileges using payload

    
});