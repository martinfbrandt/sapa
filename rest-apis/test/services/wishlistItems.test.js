const chakram = require('chakram');
const { concat, assocPath } = require('ramda');
const expect = chakram.expect;
const endpoint = 'http://localhost:3000/api';
const { mergeAtPath, headers } = require('../../utils/general');


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

let user, wishlist, experience;

describe('Wishlist Item tests', () => {
   // before block creates a wishlist and an experience
   before('Setup', async () => {
      //login
      user = await loginUser(adminUserCreds);

      //create wishlist
      return chakram.post(concat(endpoint, '/wishlists'),
         { "location": "texas" },
         createFullHeader(user.jwt)
      )
         .then(wishlistRes => {
            wishlist = wishlistRes.body;

            //create experience
            return chakram.post(concat(endpoint, '/experiences'), experienceObject, createFullHeader(user.jwt))
               .then(experienceRes => {
                  experience = experienceRes.body
               })
         });

   });

   it('Can associate experience to wishlist', () => {
      return chakram.post(concat(endpoint, `/wishlists/${wishlist.id}/experiences/${experience.id}`),
        {"scheduled_dt": "6/6/2019"},
          createFullHeader(user.jwt))
        .then(addResponse => {
           expect(addResponse).to.have.status(200);
        });
   })

   // allows user to associate valid experience to a wishlist
   // blocks user from associating experience to wishlist that's not theirs
   // blocks user from associating other users' non-system experiences
   // blocks user from associating duplicate experiences to wishlist

   // allows user to remove experience from wishlist
   // disallows user from removing experience from another users' wishlist

})