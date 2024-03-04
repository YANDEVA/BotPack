module.exports = function ({ api, models, Users, Threads, Currencies }) {
    const logger = require("../../utils/log.js")
    return function ({ event }) {
        const { allowInbox } = global.config;
        const { userBanned, threadBanned } = global.data;
        const { commands, eventRegistered } = global.client;
        var { senderID, threadID } = event;
        var senderID = String(senderID);
        var threadID = String(threadID);
        if (userBanned.has(senderID) || threadBanned.has(threadID) || allowInbox == !![] && senderID == threadID) return;
        for (const eventReg of eventRegistered) {
            const cmd = commands.get(eventReg);
            var getText2;

            if (cmd.languages && typeof cmd.languages == 'object') 
                getText2 = (...values) => {
                const commandModule = cmd.languages || {};
                if (!commandModule.hasOwnProperty(global.config.language)) 
                    return api.sendMessage(global.getText('handleCommand','notFoundLanguage', cmd.config.name), threadID, messengeID); 
                var lang = cmd.languages[global.config.language][values[0]] || '';
                for (var i = values.length; i > 0x16c0 + -0x303 + -0x1f * 0xa3; i--) {
                    const expReg = RegExp('%' + i, 'g');
                    lang = lang.replace(expReg, values[i]);
                }
                return lang;
            };
            else getText2 = () => {};
            try {
                const Obj = {};
                Obj.event = event 
                Obj.api = api
                Obj.models = models
                Obj.Users = Users
                Obj.Threads = Threads 
                Obj.Currencies = Currencies 
                Obj.getText = getText2;
                if (cmd) cmd.handleEvent(Obj);
            } catch (error) {
                logger.log(global.getText('handleCommandEvent', 'moduleError', cmd.config.name), 'error');
            }
        }
    };
};