/**
 * @author D-Jukie
 * @warn Do not edit code or edit credits
 * @src Disme Project
 * @bug fixed by @YanMaglinte
 */
module.exports = function ({ api, models, Users, Threads, Currencies }) {
    const logger = require("../../utils/log.js");
    return async function ({ event }) {
        const { threadID, logMessageType, logMessageData } = event;
        const { setData, getData, delData, createData } = Threads;
        try {
            let dataThread = (await getData(threadID)).threadInfo;
            switch (logMessageType) {
                case "log:thread-admins": {
                    if (logMessageData.ADMIN_EVENT == "add_admin") {
                        dataThread.adminIDs.push({
                            id: logMessageData.TARGET_ID
                        })
                    } else if (logMessageData.ADMIN_EVENT == "remove_admin") {
                        dataThread.adminIDs = dataThread.adminIDs.filter(item => item.id != logMessageData.TARGET_ID);
                    }
                    logger('Refresh the list of admins in the group ' + threadID, 'UPDATE DATA')
                    await setData(threadID, { threadInfo: dataThread });
                    break;
                }
                case "log:thread-name": {
                    logger('Update name in group ' + threadID, 'UPDATE DATA')
                    dataThread.threadName = event.logMessageData.name
                    await setData(threadID, { threadInfo: dataThread });
                    break;
                }
                case "log:subscribe": {
                    if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) return
                    for(let i of event.logMessageData.addedParticipants) {
                        dataThread.participantIDs.push(i.userFbId)
                    }
                    var data = await Threads.setData(event.threadID, {threadInfo: dataThread})
                    logger('Perform more group data ' + threadID, 'ADD DATA')
                    break;
                }
                case 'log:unsubscribe': {
                    if (logMessageData.leftParticipantFbId == api.getCurrentUserID()) {
                        logger('Perform group data deletion ' + threadID, 'DELETE DATA')
                        const index = global.data.allThreadID.findIndex(item => item == threadID);
                        global.data.allThreadID.splice(index, 1);
                        await delData(threadID);
                        return
                    } else {
                        const index = dataThread.participantIDs.findIndex(item => item == logMessageData.leftParticipantFbId);
                        dataThread.participantIDs.splice(index, 1);
                        if (dataThread.adminIDs.find(i => i.id == logMessageData.leftParticipantFbId)) {
                            dataThread.adminIDs = dataThread.adminIDs.filter(item => item.id != logMessageData.leftParticipantFbId);
                        }
                        logger('Perform user deletion ' + logMessageData.leftParticipantFbId, 'DELETE DATA')
                        await setData(threadID, { threadInfo: dataThread });
                    }
                    break;
                }
            }
        } catch (e) {
            console.log('There was an error updating data: ' + e)
        }
        return;
    };
}