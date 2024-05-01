'use strict';

const { generateOfflineThreadingID, getCurrentTimestamp } = require('../utils');

function isCallable(func) {
  try {
    Reflect.apply(func, null, []);
    return true;
  } catch (error) {
    return false;
  }
}

const themes = [
    {
      "id": "3650637715209675",
      "name": "Besties"
    },
    {
      "id": "769656934577391",
      "name": "Women's History Month"
    },
    {
      "id": "702099018755409",
      "name": "Dune: Part Two"
    },
    {
      "id": "1480404512543552",
      "name": "Avatar: The Last Airbender"
    },
    {
      "id": "952656233130616",
      "name": "J.Lo"
    },
    {
      "id": "741311439775765",
      "name": "Love"
    },
    {
      "id": "215565958307259",
      "name": "Bob Marley: One Love"
    },
    {
      "id": "194982117007866",
      "name": "Football"
    },
    {
      "id": "1743641112805218",
      "name": "Soccer"
    },
    {
      "id": "730357905262632",
      "name": "Mean Girls"
    },
    {
      "id": "1270466356981452",
      "name": "Wonka"
    },
    {
      "id": "704702021720552",
      "name": "Pizza"
    },
    {
      "id": "1013083536414851",
      "name": "Wish"
    },
    {
      "id": "359537246600743",
      "name": "Trolls"
    },
    {
      "id": "173976782455615",
      "name": "The Marvels"
    },
    {
      "id": "2317258455139234",
      "name": "One Piece"
    },
    {
      "id": "6685081604943977",
      "name": "1989"
    },
    {
      "id": "1508524016651271",
      "name": "Avocado"
    },
    {
      "id": "265997946276694",
      "name": "Loki Season 2"
    },
    {
      "id": "6584393768293861",
      "name": "olivia rodrigo"
    },
    {
      "id": "845097890371902",
      "name": "Baseball"
    },
    {
      "id": "292955489929680",
      "name": "Lollipop"
    },
    {
      "id": "976389323536938",
      "name": "Loops"
    },
    {
      "id": "810978360551741",
      "name": "Parenthood"
    },
    {
      "id": "195296273246380",
      "name": "Bubble Tea"
    },
    {
      "id": "6026716157422736",
      "name": "Basketball"
    },
    {
      "id": "693996545771691",
      "name": "Elephants & Flowers"
    },
    {
      "id": "390127158985345",
      "name": "Chill"
    },
    {
      "id": "365557122117011",
      "name": "Support"
    },
    {
      "id": "339021464972092",
      "name": "Music"
    },
    {
      "id": "1060619084701625",
      "name": "Lo-Fi"
    },
    {
      "id": "3190514984517598",
      "name": "Sky"
    },
    {
      "id": "627144732056021",
      "name": "Celebration"
    },
    {
      "id": "275041734441112",
      "name": "Care"
    },
    {
      "id": "3082966625307060",
      "name": "Astrology"
    },
    {
      "id": "539927563794799",
      "name": "Cottagecore"
    },
    {
      "id": "527564631955494",
      "name": "Ocean"
    },
    {
      "id": "230032715012014",
      "name": "Tie-Dye"
    },
    {
      "id": "788274591712841",
      "name": "Monochrome"
    },
    {
      "id": "3259963564026002",
      "name": "Default"
    },
    {
      "id": "724096885023603",
      "name": "Berry"
    },
    {
      "id": "624266884847972",
      "name": "Candy"
    },
    {
      "id": "273728810607574",
      "name": "Unicorn"
    },
    {
      "id": "262191918210707",
      "name": "Tropical"
    },
    {
      "id": "2533652183614000",
      "name": "Maple"
    },
    {
      "id": "909695489504566",
      "name": "Sushi"
    },
    {
      "id": "582065306070020",
      "name": "Rocket"
    },
    {
      "id": "557344741607350",
      "name": "Citrus"
    },
    {
      "id": "280333826736184",
      "name": "Lollipop"
    },
    {
      "id": "271607034185782",
      "name": "Shadow"
    },
    {
      "id": "1257453361255152",
      "name": "Rose"
    },
    {
      "id": "571193503540759",
      "name": "Lavender"
    },
    {
      "id": "2873642949430623",
      "name": "Tulip"
    },
    {
      "id": "3273938616164733",
      "name": "Classic"
    },
    {
      "id": "403422283881973",
      "name": "Apple"
    },
    {
      "id": "3022526817824329",
      "name": "Peach"
    },
    {
      "id": "672058580051520",
      "name": "Honey"
    },
    {
      "id": "3151463484918004",
      "name": "Kiwi"
    },
    {
      "id": "736591620215564",
      "name": "Ocean"
    },
    {
      "id": "193497045377796",
      "name": "Grape"
    }
  ];

  module.exports = function (defaultFuncs, api, ctx) {
    return function setTheme(themeID, threadID, callback) {
      if (!ctx.mqttClient) {
        throw new Error('Not connected to MQTT');
      }
  
      ctx.wsReqNumber += 1;
      ctx.wsTaskNumber += 1;
  
      let selectedThemeID;
  
      if (!themeID) {
        // If no theme ID is provided, select a random theme from the themes array
        const randomIndex = Math.floor(Math.random() * themes.length);
        selectedThemeID = themes[randomIndex].id;
      } else {
        selectedThemeID = themeID;
      }
  
      const taskPayload = {
        thread_key: threadID,
        theme_fbid: selectedThemeID,
        source: null,
        sync_group: 1,
        payload: null,
      };
  
      const task = {
        failure_count: null,
        label: '43',
        payload: JSON.stringify(taskPayload),
        queue_name: 'thread_theme',
        task_id: ctx.wsTaskNumber,
      };
  
      const content = {
        app_id: '2220391788200892',
        payload: JSON.stringify({
          data_trace_id: null,
          epoch_id: parseInt(generateOfflineThreadingID()),
          tasks: [task],
          version_id: '25095469420099952',
        }),
        request_id: ctx.wsReqNumber,
        type: 3,
      };
  
      if (isCallable(callback)) {
        ctx.reqCallbacks[ctx.wsReqNumber] = callback;
      }
  
      ctx.mqttClient.publish('/ls_req', JSON.stringify(content), { qos: 1, retain: false });
    };
  };
