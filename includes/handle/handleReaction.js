module.exports = function ({ api, models, Users, Threads, Currencies, ...rest }) {
    return function ({ event, ...rest2 }) {
        const { handleReaction, commands } = global.client;
        const { messageID, threadID } = event;
        if (handleReaction.length !== 0) {
            const indexOfHandle = handleReaction.findIndex(e => e.messageID == messageID);
            if (indexOfHandle < 0) return;
            const indexOfMessage = handleReaction[indexOfHandle];
            const handleNeedExec = commands.get(indexOfMessage.name);

            if (!handleNeedExec) return api.sendMessage(global.getText('handleReaction', 'missingValue'), threadID, messageID);
            try {
                var getText2;
                if (handleNeedExec.languages && typeof handleNeedExec.languages == 'object') 
                	getText2 = (...value) => {
                    const react = handleNeedExec.languages || {};
                    if (!react.hasOwnProperty(global.config.language)) 
                    	return api.sendMessage(global.getText('handleCommand', 'notFoundLanguage', handleNeedExec.config.name), threadID, messageID);
                    var lang = handleNeedExec.languages[global.config.language][value[0]] || '';
                    for (var i = value.length; i > 0x2 * -0xb7d + 0x2111 * 0x1 + -0xa17; i--) {
                        const expReg = RegExp('%' + i, 'g');
                        lang = lang.replace(expReg, value[i]);
                    }
                    return lang;
                };
                else getText2 = () => {};
                const Obj = {
                    ...rest,
                    ...rest2
                };
                Obj.api= api 
                Obj.event = event 
                Obj.models = models
                Obj.Users = Users
                Obj.Threads = Threads
                Obj.Currencies = Currencies
                Obj.handleReaction = indexOfMessage
                Obj.models= models 
                Obj.getText = getText2
                handleNeedExec.handleReaction(Obj);
                return;
            } catch (error) {
                return api.sendMessage(global.getText('handleReaction', 'executeError', error), threadID, messageID);
            }
        }
    };
};
