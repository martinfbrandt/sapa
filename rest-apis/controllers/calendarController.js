
const { pathOr, head } = require('ramda');
const { DuplicateError, BadRequestError } = require('./../utils/daoError');
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
    const userId = getUserIdFromRequest(req);
    createCalendar(userId).then(calendars => {
        res.json(head(calendars));
    })
        .catch(err => interpretError(err, type, res));
    next();
}

const findCalendarExperienceById = async (req, res, next) => { }

const postCalendarExperience = async (req, res, next) => { }

const deleteCalendarExperience = async (req, res, next) => { }

const deleteDefaultCalendarExperience = async (req, res, next) => { }

module.exports.postDefaultCalendarExperience = async (req, res, next) => {
    try {
        const userId = getUserIdFromRequest(req);

        let experience = new CalendarExperience(
            req.body.scheduledDt,
            req.body.location,
            req.body.description,
            req.body.name
        );
        console.log(experience)
        const experiences = await addDefaultCalendarExperience(userId, req.params.experienceId, experience)
        res.json(head(experiences));
    }
    catch (err) {
        interpretError(err, 'experience', res);
    };
}

const findDefaultCalendarExperiences = async (req, res, next) => { }


const interpretError = (err, type, res) => {
    if (err.isPrototypeOf(DuplicateError)) {
        res.status(409).send({ error: `The ${type} already exists` });
    } else if (err.isPrototypeOf(BadRequestError)) {
        res.status(400).send({ error: "The request was malformed" });
    } else {
        res.status(400).send({ error: err });
    }
};