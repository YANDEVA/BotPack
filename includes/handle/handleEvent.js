module.exports = function ({api ,models, Users, Threads, Currencies }) {
    const logger = require("../../utils/log.js");
   	const moment = require("moment");
    return function ({ event }) {
        const timeStart = Date.now()
        const time = moment.tz("Asia/Manila").format("HH:MM:ss L");
        const { userBanned, threadBanned } = global.data;
        const { events } = global.client;
        const { allowInbox, DeveloperMode } = global.config;
        var { senderID, threadID } = event;
        senderID = String(senderID);
        threadID = String(threadID);
        if (userBanned.has(senderID)|| threadBanned.has(threadID) || allowInbox == ![] && senderID == threadID) return;
        for (const [key, value] of events.entries()) {
            if (value.config.eventType.indexOf(event.logMessageType) !== -1) {
                const eventRun = events.get(key);
                try {
                    const Obj = {};
                    Obj.api = api
                    Obj.event = event
                    Obj.models= models 
                    Obj.Users= Users 
                    Obj.Threads = Threads
                    Obj.Currencies = Currencies 
                    eventRun.run(Obj);
                    if (DeveloperMode == !![]) 
                    	logger.log(global.getText('handleEvent', 'executeEvent', time, eventRun.config.name, threadID, Date.now() - timeStart), 'Event');
                } catch (error) {
                    logger.log(global.getText('handleEvent', 'eventError', eventRun.config.name, JSON.stringify(error)), "error");
                }
            }
        }
        return;
    };
}