const { isEmpty } = require("ramda");

module.exports.interpretError = (err, type, res) => {
  const errno = err.errno;
  console.log(err)
  if (errno == 19) {
    res.status(409).send({ error: `The ${type} already exists` });
  } else if (errno == 1) {
    res.status(400).send({ error: "The request was malformed" });
  } else {
    res.status(400).send({ error: err });
  }
};

module.exports.checkIfExists = (result, response) => {
  if (!result || isEmpty(result)) {
    response
      .status(404)
      .send({ error: "The requested resource does not exist" });
  }
};
