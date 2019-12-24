const Experience = require('./experience');


class CalendarExperience extends Experience {

    ownerId;
    calendarId;
    addedDt;
    scheduledDt;

    getOwnerId = () => this.ownerId;

    getCalendarId = () => this.calendarId;

    getAddedDate = () => this.addedDt;

    getScheduledDate = () => this.scheduledDt;

    setOwnerId = id => this.ownerId = id;

    setCalendarId = id => this.calendarId = id;

    setAddedDate = date => this.addedDt = date;

    setScheduledDate = date => this.scheduledDt = date;

}

module.exports = CalendarExperience;