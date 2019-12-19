const chakram = require('chakram');
const endpoint = 'http://localhost:3000/api';
const { concat } = require('ramda');
const { addJsonHeaders, addAuthHeaders } = require('../../utils/general');
const experienceSchema = require('./schemas/experience.schema.json')
const experienceObject = require('./objects/experience.object.json')
const { loginUser } = require('./../utils');

const expect = chakram.expect;

const adminUserCreds = {
    "email": "admin@sapa.com",
    "password": "admin"
}

let adminUser, experience

describe('Experience tests', () => {
    before('Login user', async () => {
        adminUser = await loginUser(adminUserCreds);
    });
    // create an experience with valid data
    it('Can create experience', () => {

        return chakram.post(concat(endpoint, '/experiences'),
            experienceObject,
              addJsonHeaders(addAuthHeaders({}, adminUser.jwt))
        )
            .then(experienceRes => {
                experience = experienceRes.body;
                expect(experienceRes).to.have.status(200);
                expect(experienceRes).to.have.schema(experienceSchema)
            });
    });
    // fail to create experience without description
    // fail to create system experience without location, description


    // update an experience if owned by user
    it('Can update experience', () => {
        return chakram.patch(concat(endpoint, `/experiences/${experience.id}`),
            { "location": "china" },
            addJsonHeaders(addAuthHeaders({}, adminUser.jwt)))
            .then(updatedRes => {
                expect(updatedRes).to.have.status(200);
                expect(updatedRes.body.location).to.equal('china');
            });
    });
    // update any experience if user is admin
    // fail to update if user isn't owner of experience and not admin


    // delete an experience if user is owner
    it('Can delete experience', () => {
        return chakram.delete(concat(endpoint, `/experiences/${experience.id}`),
            {}, addAuthHeaders({}, adminUser.jwt))
            .then(deleteResponse => {
                expect(deleteResponse).to.have.status(200);
            });
    });
    // delete system experience if user is admin
    // fail to delete system experience if user is not admin



});