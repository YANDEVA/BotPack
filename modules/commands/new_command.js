module.exports.config = {
  name: "<command_name>",
  version: "1.0.0",
  hasPermission: 0,
  credits: "<Author>",
  description: "<Command Description>",
  usePrefix: true, // Set to true to enable the use of prefix while false if not.
  commandCategory: "other",
  cooldowns: 5 // seconds to activate again
};

module.exports.run = function ({ api, event }) {
  // Your command logic here
  // You can access the event object (event) and the api object (api) within the function.
  // You can use the api object to send messages, get user information, and perform other actions.
}