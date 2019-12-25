const Experience = require('./experience');


class CalendarExperience extends Experience {


    constructor(scheduledDt, location, description, name) {
        super(location, description, name);
        
        this.scheduledDt = scheduledDt;
    }

    get getOwnerId() { return this.ownerId; }

    get getCalendarId() { return this.calendarId; }

    get getAddedDate() { return this.addedDt; }

    get getScheduledDate() { return this.scheduledDt; }

    set setOwnerId(id) { this.ownerId = id; }

    set setCalendarId(id) { this.calendarId = id; }

    set setAddedDate(date) { this.addedDt = date; }

    set setScheduledDate(date) { this.scheduledDt = date; }

}

module.exports = CalendarExperience;