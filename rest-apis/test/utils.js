const chakram = require('chakram');
const {prop, pipe} = require('ramda');


// logs in provided user and returns user
module.exports.loginUser = pipe(async user => await chakram.post('http://localhost:3000/api/login', user, {headers:{
    'content-type': 'application/json'
}}), async stuff => prop('body')(await stuff))