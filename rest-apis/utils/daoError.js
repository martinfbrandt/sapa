const { isEmpty } = require("ramda");

module.exports.interpretError = (err, type, res) => {
  const errno = err.errno;
  if (errno == 19) {
    res.status(409).send({ error: `The ${type} already exists` });
  } else if (errno == 1) {
    res.status(400).send({ error: "The request was malformed" });
  } else {
    res.status(400).send({ error: err });
  }
};


module.exports.interpretDaoError = (err) => {
  const errno = err.errno;
  if (errno == 19) {
    return new DuplicateError(err);
  } else if (errno == 1) {
    return new BadRequestError(err)
  } else {
    return new BadRequestError(err);
  }
};

module.exports.checkIfExists = (result, response) => {
  if (!result || isEmpty(result)) {
    response
      .status(404)
      .send({ error: "The requested resource does not exist" });
  }
};


class DaoError {
  constructor(err){
    this.error = err;
  }

}

class DuplicateError extends DaoError {
  constructor(err) {
    super(err);
  }
}

class BadRequestError extends DaoError {
  constructor(err) {
    super(err);
  }
}