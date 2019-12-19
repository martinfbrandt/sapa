const chakram = require('chakram');
const { concat, assocPath } = require('ramda');
const { mergeAtPath, headers } = require('../../utils/general');
const endpoint = 'http://localhost:3000/api';
const expect = chakram.expect;

const experienceObject = {
  "description": "blah",
  "location": "texas",
  "name": "coolexperience"
}

const createFullHeader = jwt => assocPath(['headers', 'authorization'], jwt, headers)

const adminUserCreds = {
  "email": "admin@sapa.com",
  "password": "admin"
}

const { loginUser } = require('./../utils');

let user, experience;


describe('Calendar item tests', () => {
  // user should be able to add calendar item to their calendar one item owned by them, one by system
  before('Setup', async () => {
    user = await loginUser(adminUserCreds);

    // create experience
    return chakram.post(concat(endpoint, '/experiences'), experienceObject, createFullHeader(user.jwt))
      .then(experienceResp => {
        experience = experienceResp.body
      });
  });

  // user should not be able to add calendar item to another user's calendar
  it('Should associate an experience to a calendar', () => {
    return chakram.post(concat(endpoint, `/calendar/experiences/${experience.id}`),
      { "scheduledDate": "09/09/2019" },
      createFullHeader(user.jwt))
      .then(calendarItemResponse => {
        const { body } = calendarItemResponse;
        expect(calendarItemResponse).to.have.status(200);
        expect(body).to.have.keys('id', 'experience_id', 'calendar_id', 'added_dt', 'scheduled_dt');
        expect(body.experience_id).to.equal(experience.id);
      })
  })
  // calendar item fails to add with invalid date
  // calendar item fails to add if experience doesn't exist

  // user should be able to remove calendar item from their calendar
  it('Should unassociate an experience from a calendar', () => {
    return chakram.delete(concat(endpoint, `/calendar/experiences/${experience.id}`),
      {},
      assocPath(['headers', 'authorization'], user.jwt, headers))
      .then(response => {
        expect(response).to.have.status(200);
      })
      .catch(err => console.log(err));
  })
  // user can't remove item from another users' calendar


});