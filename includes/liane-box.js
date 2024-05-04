/**
 * Represents a utility class for abstracting the api methods.
 * @class
 * @author Nealiana Kaye Cagara <https://github.com/lianecagara>
 * @license MIT
 */
class Box {
  /**
   * Creates an instance of MessengerAPI.
   * @constructor
   * @param {object} api - The Facebook Messenger API instance.
   * @param {object} event - The event object containing message details.
   */
  constructor(api, event) {
    this.api = api;
    this.event = event;
    this.lastID = null;
  }
  /**
   * Sends a reply message to the specified thread.
   * @param {string | object} msg - The message content.
   * @param {string | number} [thread] - The thread ID to send the message to. Defaults to the current thread.
   * @param {function} [callback] - Optional callback function to execute after sending the message.
   * @returns {Promise<object>} - A promise resolving to the message info.
   */
  reply(msg, thread, callback) {
    return new Promise((r) => {
      this.api.sendMessage(
        msg,
        thread || this.event.threadID,
        async (err, info) => {
          if (typeof callback === "function") {
            await callback(err, info);
          }
          this.lastID = info?.messageID;
          r(info);
        },
      );
    }, this.event.messageID);
  }
  /**
   * Sends a message to the specified thread.
   * @param {string | object} msg - The message content.
   * @param {string | number} [thread] - The thread ID to send the message to. Defaults to the current thread.
   * @param {function} [callback] - Optional callback function to execute after sending the message.
   * @returns {Promise<object>} - A promise resolving to the message info.
   */
  send(msg, thread, callback) {
    return new Promise((r) => {
      this.api.sendMessage(
        msg,
        thread || this.event.threadID,
        async (err, info) => {
          if (typeof callback === "function") {
            await callback(err, info);
          }
          this.lastID = info?.messageID;
          r(info);
        },
      );
    });
  }

  /**
   * Reacts to a message with the specified emoji.
   * @param {string} emoji - The emoji to react with.
   * @param {string} [id] - The message ID to react to. Defaults to the current message ID.
   * @param {function} [callback] - Optional callback function to execute after reacting.
   * @returns {Promise<boolean>} - A promise resolving to true if the reaction is successful.
   */
  react(emoji, id, callback) {
    return new Promise((r) => {
      this.api.setMessageReaction(
        emoji,
        id || this.event.messageID,
        async (err, ...args) => {
          if (typeof callback === "function") {
            await callback(err, ...args);
          }
          r(true);
        },
        true,
      );
    });
  }
  /**
   * Edits a message with the specified content.
   * @param {string} msg - The new message content.
   * @param {string} [id] - The message ID to edit. Defaults to the last sent message ID.
   * @param {function} [callback] - Optional callback function to execute after editing.
   * @returns {Promise<boolean>} - A promise resolving to true if the edit is successful.
   */
  edit(msg, id, callback) {
    return new Promise((r) => {
      this.api.editMessage(msg, id || this.lastID, async (err, ...args) => {
        if (typeof callback === "function") {
          await callback(err, ...args);
        }
        r(true);
      });
    });
  }
}
module.exports = Box;
