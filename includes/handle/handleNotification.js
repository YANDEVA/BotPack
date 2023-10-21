/**
 * @warn Do not edit code or edit credits
 * @author D-Jukie
 * @source Disme Project
 * @bug fixed by @YanMaglinte
 */

module.exports = function ({ api }) {
    const moment = require("moment");
    const botID = api.getCurrentUserID();
    const form = {
        av: botID,
        fb_api_req_friendly_name: "CometNotificationsDropdownQuery",
        fb_api_caller_class: "RelayModern",
        doc_id: "5025284284225032",
        variables: JSON.stringify({
            "count": 5,
            "environment": "MAIN_SURFACE",
            "menuUseEntryPoint": true,
            "scale": 1
        })
    };
    try {
        api.httpPost("https://www.facebook.com/api/graphql/", form, (e, i) => {
            var a = JSON.parse(i);
            var data = a.data.viewer
            const get_minutes_of_time = (d1, d2) => {
                let ms1 = d1.getTime();
                let ms2 = d2.getTime();
                return Math.ceil((ms2 - ms1) / (60 * 1000));
            };
            for (let i of data.notifications_page.edges) {
                if (i.node.row_type !== 'NOTIFICATION') continue
                var audio = data.notifications_sound_path[1];
                var count = data.notifications_unseen_count
                var body = i.node.notif.body.text
                var link = i.node.notif.url
                var timestemp = i.node.notif.creation_time.timestamp
                var time = moment.tz("Asia/Manila").format("HH:mm:ss DD/MM/YYYY")
                if (get_minutes_of_time(new Date(timestemp * 1000), new Date()) <= 1) {
                    var msg = "" + 
                        "=== [🔔 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 🔔] ===" +
                        "\n⏱️ 𝗧𝗶𝗺𝗲: " + time + 
                        "\n💬 𝗠𝗲𝘀𝘀𝗮𝗴𝗲: " + body +
                        "\n🔗 𝗟𝗶𝗻𝗸: " + link
                    api.sendMessage(msg, global.config.ADMINBOT[0])
                }
            }
        });
    }
    catch(e) {
        console.log(`An error occurred while sending the notification: ${e}`)
    }
}
