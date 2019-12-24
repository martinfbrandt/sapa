const { decodeJwt } = require("./../utils/auth");
const { getRoles } = require("./users");
const {
  filter,
  flip,
  contains,
  prop,
  map,
  complement,
  isEmpty,
  pathOr,
} = require("ramda");
// method to validate request authorization JWT
// returns decoded JWT as req.decoded for client to use if needed
module.exports.authValidation = async (req, res, next) => {
  var token = req.headers["authorization"];
  if (token) {
    // verifies secret
    await decodeJwt(token)
      .then(decoded => {
        req.decoded = decoded;
        next();
      })
      .catch(err => {
        let errMessage;
        if (err.name === "TokenExpiredError") {
          errMessage = "The authorization token has expired";
        } else {
          errMessage = "The authorization token is invalid";
        }
        res
          .status(401)
          .json({ message: errMessage })
          .send();
      });
  } else {
    // if there is no token
    // return an error
    return res.status(403).send({
      message: "No authorization header provided"
    });
  }
};

module.exports.hasRole = allowedRoles => async (req, res, next) => {
  const decodedJwt = req.decoded;
  const userRoles = await getRoles(decodedJwt.data.id);
  const userRoleList = map(prop("key"))(userRoles);
  const isDelete = req.method === 'DELETE'
  const isUserReq = contains('/api/users', req.path);
  const isOwnerUser =  !isDelete && isUserReq && String(pathOr(0, ['decoded', 'data', 'id'], req)) === req.params.id

  //check if the user is editing themself
  if(isOwnerUser){
    next();
    return;
  }

  const userHasRole = complement(isEmpty)(
    filter(flip(contains)(allowedRoles))(userRoleList)
  );
  if (userHasRole) {
    next();
    return;
  } else {
    res
      .status(403)
      .json({ message: "User is not authorized for this api" })
      .send();
  }
};
