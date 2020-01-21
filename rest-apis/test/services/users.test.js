const chakram = require('chakram');
const { concat, prop, propEq, find } = require('ramda');
const endpoint = 'http://localhost:3000/api';
const { loginUser } = require('./../utils');
const { addJsonHeaders, addAuthHeaders } = require('../../utils/general');

const expect = chakram.expect;

const headers = {
    'headers': { 'content-type': 'application/json' }
}

const adminUserCreds = {
    "email": "admin@sapa.com",
    "password": "admin"
}

let adminUser;

describe('User tests', () => {
    before('Remove user', async () => {
        adminUser = await loginUser(adminUserCreds);
        return chakram.get(concat(endpoint, '/users'), addAuthHeaders({}, adminUser.jwt))
            .then(users => {
                return prop('id', find(propEq('email', 'barry@sapa.com'), users.body))
            })
            .then(id => {
                return chakram.delete(concat(endpoint, `/users/${id}`), {}, addAuthHeaders({}, adminUser.jwt))
            })

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
                return response.id;
            })
            .then(id => chakram.delete(concat(endpoint, `/users/${id}`), {}, addAuthHeaders({}, adminUserCreds.jwt)))
            .catch(err => {
                throw new Error(err)
            })
    })

    it("Should fail to create a user without a password", () => {
        return chakram.post(concat(endpoint, '/signup'),
            {
                "name": "barry goldwater",
                "email": "barry@sapa.com",
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
                "email": "barry@sapa.com",
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
});


    // check to see user can be created without roles field and gets default user role


    // check to see that the user can't assign themselves admin privileges using payload

