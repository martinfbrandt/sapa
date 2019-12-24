const Experience = require('./experience');


class CalendarExperience extends Experience {


    constructor(scheduledDt) {
        this.scheduledDt = scheduledDt;
    }

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