const chakram = require('chakram');
const { concat, head } = require('ramda');
const { addJsonHeaders, addAuthHeaders } = require('../../utils/general');
const endpoint = 'http://localhost:3000/api';
const experienceObject = require('./objects/experience.object.json')
const { loginUser } = require('./../utils');

const expect = chakram.expect;

const createFullHeader = jwt => addJsonHeaders(addAuthHeaders({}, jwt));

const adminUserCreds = {
  "email": "admin@sapa.com",
  "password": "admin"
}

let user, adminUser, experience;

describe('Calendar item tests', () => {
  // user should be able to add calendar item to their calendar one item owned by them, one by system
  before('Setup', async () => {
    adminUser = await loginUser(adminUserCreds);
    // create experience
    return chakram.post(concat(endpoint, '/experiences'), experienceObject, createFullHeader(adminUser.jwt))
      .then(experienceResp => {
        experience = experienceResp.body
      });
  });

  // user should not be able to add calendar item to another user's calendar
  it('Should associate an experience to a calendar', () => {
    return chakram.post(concat(endpoint, `/calendar/experiences/${experience.id}`),
      { "scheduledDate": "09/09/2019" },
      createFullHeader(adminUser.jwt))
      .then(calendarItemResponse => {
        const { body } = calendarItemResponse;
        expect(calendarItemResponse).to.have.status(200);
        expect(body).to.have.keys('id', 'experience_id', 'calendar_id', 'added_dt', 'scheduled_dt');
        expect(body.experience_id).to.equal(experience.id);
      })
  });

    // User can retrieve experience by ID
    it('Should return calendar experience by ID', () => {
      return chakram.get(concat(endpoint, `/calendar/experiences/${experience.id}`), addAuthHeaders({}, adminUser.jwt))
      .then(response => {
        expect(response).to.have.status(200);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.keys('id', 'experience_id', 'calendar_id', 'added_dt', 'scheduled_dt')
      });
    });

  // User can retrieve all experiences for their caledar
  it('Should return all experiences associated with a user calendar', () => {
    return chakram.get(concat(endpoint, '/calendar/experiences'), addAuthHeaders({}, adminUser.jwt))
    .then(response => {
      expect(response).to.have.status(200);
      expect(response.body).to.be.an('array');
      expect(head(response.body)).to.have.keys('id', 'experience_id', 'calendar_id', 'added_dt', 'scheduled_dt')
    });
  });
  // calendar item fails to add with invalid date
  // calendar item fails to add if experience doesn't exist

  // user should be able to remove calendar item from their calendar
  it('Should unassociate an experience from a calendar', () => {
    return chakram.delete(concat(endpoint, `/calendar/experiences/${experience.id}`),
      {},
      addAuthHeaders({}, adminUser.jwt))
      .then(response => {
        expect(response).to.have.status(200);
      })
      .catch(err => console.log(err));
  })
  // user can't remove item from another users' calendar


});