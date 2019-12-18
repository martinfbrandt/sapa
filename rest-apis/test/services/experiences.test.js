const chakram = require('chakram');
const endpoint = 'http://localhost:3000/api';
const {concat, assocPath} = require('ramda');
const {mergeAtPath} = require('../../utils/general');

const expect = chakram.expect;

const headers = {
    'headers': { 'content-type': 'application/json' }
}

const {loginUser} = require('./../utils');

const adminUserCreds = {
    "email": "admin@sapa.com",
    "password": "admin"
}

let user, adminUser

//const headersWAdminCreds =  mergeAtPath(['headers'], headers, adminUserCreds)

describe('Experience tests', () => {
    before('Login user', async () => {
        user = await loginUser(adminUserCreds);
    });
    // create an experience with valid data
    it('Can create experience', () => {
        return chakram.post(concat(endpoint, '/experiences'), {
          'description': 'blah'
        }, assocPath(['headers', 'authorization'], user.jwt, headers))
        .then(experienceRes => console.log(experienceRes.body))
        .catch(err => console.log(err))
    });
    // fail to create experience without description
    // fail to create system experience without location, description

    // delete an experience if user is owner
    // delete system experience if user is admin
    // fail to delete system experience if user is not admin
    
    // update an experience if owned by user
    // update any experience if user is admin
    // fail to update if user isn't owner of experience and not admin


});