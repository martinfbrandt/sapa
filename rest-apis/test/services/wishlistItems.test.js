const chakram = require('chakram');
const { concat, head, assocPath } = require('ramda');
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

   // allows user to associate valid experience to a wishlist
   it('Can associate experience to wishlist', () => {
      return chakram.post(concat(endpoint, `/wishlists/${wishlist.id}/experiences/${experience.id}`),
         {},
         createFullHeader(user.jwt))
         .then(addResponse => {
            const { body } = addResponse;
            expect(addResponse).to.have.status(200);
            expect(body.experience_id).to.equal(experience.id);
            expect(body.wishlist_id).to.equal(wishlist.id)
         });
   });

   // retrieve all wishlist items for a wishlist
   it('Can retrieve list of wishlist items for a wishlist', () => {
      return chakram.get(concat(endpoint, `/wishlists/${wishlist.id}/experiences`),
         assocPath(['headers', 'authorization'], user.jwt, {}))
         .then(wishlistResp => {
            expect(wishlistResp.body).to.have.lengthOf(1);
            const wishlistItem = head(wishlistResp.body);
            expect(wishlistItem.wishlist_id).to.equal(wishlist.id);
            expect(wishlistItem.experience_id).to.equal(experience.id);

         });
   });

   // blocks user from associating experience to wishlist that's not theirs
   // blocks user from associating other users' non-system experiences
   // blocks user from associating duplicate experiences to wishlist

   // allows user to remove experience from wishlist
   it('Can unassociate experience to wishlist', () => {
      return chakram.delete(concat(endpoint, `/wishlists/${wishlist.id}/experiences/${experience.id}`),
         {},
         assocPath(['headers', 'authorization'], user.jwt, {}))
         .then(removeResponse => {
            expect(removeResponse).to.have.status(200);
         });
   });

   // disallows user from removing experience from another users' wishlist

})