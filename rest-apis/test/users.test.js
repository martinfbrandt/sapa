const chakram = require('chakram');
const {concat, prop, propEq, find} = require('ramda');
const endpoint = 'http://localhost:3000/api';

const expect = chakram.expect; 

const headers = {
    'headers': {'content-type': 'application/json'}
}

const adminUserCreds = {
    "email": "admin@sapa.com",
    "password": "admin"
}


describe('Runs through user tests', () => {
    before('Remove user', () => {
        let jwt;
        return chakram.post(concat(endpoint, '/login'), adminUserCreds, headers)
            .then(loggedInUserResponse => {
                jwt = loggedInUserResponse.body.jwt;
                //returns the user id of the user to delete
                return chakram.get(concat(endpoint, '/users'), {headers: {'authorization': jwt}})
                    .then(users => prop('id', find(propEq('email', 'barry@sapa.com'), users.body)))})
                        .then(id => chakram.delete(concat(endpoint, `/users/${id}`),{}, {headers: {'authorization': jwt}}))
                
    });



    it("Should create a user successfully", () => {
      return chakram.post(concat(endpoint, '/signup'), 
        {
            "name":"barry goldwater",
            "email":"barry@sapa.com",
            "password":"barrylost",
            "roles":["user"]
        }, headers)
        .then(response => {
            expect(response).to.have.status(200)
            expect(response).to.have.header('access-control-allow-methods')
        })
        .catch(err => {
            throw new Error(err)
        })
    })
})