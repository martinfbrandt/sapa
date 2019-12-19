const chakram = require('chakram');
const endpoint = 'http://localhost:3000/api';
const { concat, assocPath } = require('ramda');
const { mergeAtPath, headers } = require('../../utils/general');
const experienceSchema = require('./schemas/experience.schema.json')
const expect = chakram.expect;

const experienceObject = {
    "description": "blah",
    "location": "texas",
    "name": "coolexperience"
};

const { loginUser } = require('./../utils');

const adminUserCreds = {
    "email": "admin@sapa.com",
    "password": "admin"
}

let user, adminUser, experience

//const headersWAdminCreds =  mergeAtPath(['headers'], headers, adminUserCreds)

describe('Experience tests', () => {
    before('Login user', async () => {
        user = await loginUser(adminUserCreds);
    });
    // create an experience with valid data
    it('Can create experience', () => {

        return chakram.post(concat(endpoint, '/experiences'),
            experienceObject,
            assocPath(['headers', 'authorization'], user.jwt, headers)
        )
            .then(experienceRes => {
                experience = experienceRes.body;
                expect(experienceRes).to.have.status(200);
                expect(experienceRes).to.have.schema(experienceSchema)
            })
    });
    // fail to create experience without description
    // fail to create system experience without location, description


    // update an experience if owned by user
    it('Can update experience', () => {
        return chakram.patch(concat(endpoint, `/experiences/${experience.id}`),
            { "location": "china" },
            assocPath(['headers', 'authorization'], user.jwt, headers))
            .then(updatedRes => {
                expect(updatedRes).to.have.status(200);
                expect(updatedRes.body.location).to.equal('china');
            })
    })
    // update any experience if user is admin
    // fail to update if user isn't owner of experience and not admin


    // delete an experience if user is owner
    it('Can delete experience', () => {
        return chakram.delete(concat(endpoint, `/experiences/${experience.id}`),
            {}, assocPath(['headers', 'authorization'], user.jwt, {}))
            .then(deleteResponse => {
                expect(deleteResponse).to.have.status(200);
            });
    });
    // delete system experience if user is admin
    // fail to delete system experience if user is not admin



});