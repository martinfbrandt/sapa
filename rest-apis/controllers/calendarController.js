
const { pathOr } = require('ramda');
const { DuplicateError, BadRequestError } = require('../utils/daoError');
const {
    createCalendar,
    addCalendarExperience,
    addDefaultCalendarExperience,
    removeCalendarExperience,
    removeDefaultCalendarExperience,
    getCalendarExperienceById,
    getDefaultCalendarExperiences
} = require('./../dao/controllers/calendarDao')

const Calendar = require('./../dao/domain-objects/calendar');
const CalendarExperience = require('./../dao/domain-objects/calendarExperience');


const getUserIdFromRequest = req => pathOr(0, ["decoded", "data", "id"], req);

module.exports.postCalendar = async (req, res, next) => {
    try {
        const userId = getUserIdFromRequest(req);
        const calendar = await createCalendar(userId);

        res.json(calendar);
    }
    catch (err) {
        interpretError(err, type, res);
    }
}

module.exports.findCalendarExperienceById = async (req, res, next) => {
    try {
        const userId = getUserIdFromRequest(req);

        const experience = await getCalendarExperienceById(userId, req.params.experienceId);
        res.json(experience);
    }
    catch (err) {
        interpretError(err, 'experience', res);
    }
}

module.exports.postCalendarExperience = async (req, res, next) => {
    try {
        const userId = getUserIdFromRequest(req);

        const experience = await addCalendarExperience(userId);

        res.json(experience);
    }
    catch (err) {
        interpretError(err, 'experience', res)
    }
}

module.exports.deleteCalendarExperience = async (req, res, next) => {
    try {
        await removeCalendarExperience(userId, req.params.calendarId, req.params.experienceId);
        res.status(200).send();
    }
    catch (err) {
        interpretError(err, 'experience', res)
    }
}

module.exports.deleteDefaultCalendarExperience = async (req, res, next) => {
    try {

        const userId = getUserIdFromRequest(req);

        await removeDefaultCalendarExperience(userId, req.params.experienceId);

        res.status(200).send();
    }
    catch (err) {
        interpretError(err, 'experience', res);
    }
}


module.exports.postDefaultCalendarExperience = async (req, res, next) => {
    try {
        const userId = getUserIdFromRequest(req);

        let experience = new CalendarExperience(
            req.body.scheduledDt,
            req.body.location,
            req.body.description,
            req.body.name
        );
        const createdExperience = await addDefaultCalendarExperience(userId, req.params.experienceId, experience)
        res.json(createdExperience);
    }
    catch (err) {
        interpretError(err, 'experience', res);
    };
}

module.exports.findDefaultCalendarExperiences = async (req, res, next) => {
    try {
        const userId = getUserIdFromRequest(req);

        const experiences = await getDefaultCalendarExperiences(userId);

        res.json(experiences);
    }
    catch (err) {
        interpretError(err, 'experiences', res)
    }
}


const interpretError = (err, type, res) => {
    if (err.isPrototypeOf(DuplicateError)) {
        res.status(409).send({ error: `The ${type} already exists` });
    } else if (err.isPrototypeOf(BadRequestError)) {
        res.status(400).send({ error: "The request was malformed" });
    } else {
        res.status(400).send({ error: err });
    }
};