const chakram = require('chakram');
const { concat, head } = require('ramda');
const endpoint = 'http://localhost:3000/api';
const { addJsonHeaders, addAuthHeaders } = require('../../utils/general');
const experienceObject = require('./objects/experience.object.json')
const { loginUser } = require('./../utils');

const expect = chakram.expect;

const createFullHeader = jwt => addJsonHeaders(addAuthHeaders({}, jwt));

const adminUserCreds = {
  "email": "admin@sapa.com",
  "password": "admin"
}

let wishlist;


describe('Wishlist tests', () => {
  // create a wishlist if provided description/location
  // fail to create a wishlist if not provided with location
  // fail to create wishlist with duplicate location

  // delete a wishlist successfully if owner of wishlist
  // fail to delete if not owner of wishlist
  before('Setup', async () => {
    //login
    adminUser = await loginUser(adminUserCreds);
  });

  it('Can create a new wishlist', () => {
    //create wishlist
    return chakram.post(concat(endpoint, '/wishlists'),
      { "location": "texas" },
      createFullHeader(adminUser.jwt)
    )
      .then(wishlistRes => {
        expect(wishlistRes).to.have.status(200);

        wishlist = wishlistRes.body;
        expect(wishlist).to.have.keys('id', 'location', 'description', 'creator_id');
      });
  })


    // retrieve wishlist by id
    it('Can retrieve wishlist by ID', () => {
      return chakram.get(concat(endpoint, `/wishlists/${wishlist.id}`),
        addAuthHeaders({}, adminUser.jwt))
        .then(wishlistResp => {
          expect(wishlistResp.body).to.be.an('object');
          const foundWishlist = wishlistResp.body;
          expect(foundWishlist).to.have.keys('id', 'location', 'description', 'creator_id');
  
        });
    });


  // retrieve all wishlists
  it('Can retrieve list of wishlists', () => {
    return chakram.get(concat(endpoint, `/wishlists`),
      addAuthHeaders({}, adminUser.jwt))
      .then(wishlistResp => {
        expect(wishlistResp.body).to.be.an('array');
        const wishlist = head(wishlistResp.body);
        expect(wishlist).to.have.keys('id', 'location', 'description', 'creator_id');

      });
  });


  it('Can delete a wishlist', () => {
    //create wishlist
    return chakram.delete(concat(endpoint, `/wishlists/${wishlist.id}`),
      {},
      addAuthHeaders({}, adminUser.jwt)
    )
      .then(deleteRes => {
        expect(deleteRes).to.have.status(200);
      });
  })

  // successfully update wishlist if provided location and not duplicate
  // fail to update withlist if not wishlist owner
  // fail to update wishlist if not valid description

});