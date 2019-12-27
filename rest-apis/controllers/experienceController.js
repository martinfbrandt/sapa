const { pathOr } = require("ramda");
const { interpretError, checkIfExists } = require("../utils/daoError");
const {
  createExperience,
  updateExperience,
  getExperienceById,
  getExperiences,
  removeExperience
} = require('../dao/controllers/experienceDao')

const Experience = require('../dao/domain-objects/experience');

const getUserIdFromRequest = req => pathOr(0, ["decoded", "data", "id"], req);


//creates a user and any attached user roles
module.exports.postExperience = async function (req, res, next) {
  try {
    const userId = getUserIdFromRequest(req);

    const experience = new Experience(req.body.location, req.body.description, req.body.name);

    const createdExperience = await createExperience(userId, experience);
    res.json(createdExperience);
  }
  catch (err) {
    interpretError(err);
  }

};

module.exports.patchExperience = async function (req, res, next) {
  try {
    const userId = getUserIdFromRequest(req);
    const { experienceId } = req.params;

    const experience = new Experience(req.body.location, req.body.description, req.body.name);

    const updatedExperience = await updateExperience(userId, experienceId, experience);
    console.log(updatedExperience)
    checkIfExists(updatedExperience, res);

    res.json(updatedExperience);
  }
  catch (err) {
    console.log(err)
    interpretError(err);
  }

};

module.exports.retrieveExperienceById = async function (req, res, next) {
  try {
    const userId = getUserIdFromRequest(req);
    const { experienceId } = req.params;

    const experience = await getExperienceById(userId, experienceId);
    checkIfExists(experience, res);

    res.json(experience);

  }
  catch (err) {
    interpretError(err);
  }

};

module.exports.retrieveExperiences = async function (req, res, next) {

  try {
    const userId = getUserIdFromRequest(req);

    const experiences = await getExperiences(userId);

    res.json(experiences);

  }
  catch (err) {
    interpretError(err);
  }

};

module.exports.deleteExperience = async function (req, res, next) {

  try {
    const userId = getUserIdFromRequest(req);
    const { experienceId } = req.params;

    removeExperience(userId, experienceId);
    res.status(200).send();
  }
  catch (err) {
    interpretError(err);
  }

};
