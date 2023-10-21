## Dan/Simv3 - A Chatbot with Word and Response Management

![Dan](https://i.postimg.cc/fbXXzdzZ/Picsart-23-06-13-14-19-47-911.jpg)

Dan/Simv3 is a homemade AI custom chatbot code that functions similarly to Simsimi, allowing you to engage in conversation and manage the word and response database. With Dan, you can teach it by using add, delete words, and customize its responses based on your preferences.

## Instructions

### Deleting Responses and Words

You can use the symbols "=!" and "=>" to manage the word and response database.

- To delete a specific response from a word:
  - Syntax: `sim [word] =! [response]`
  - Example: `sim hi =! Hello There!`
    - This will remove the response "Hello There!" from the word "hi" if it exists.

- To delete an entire word and its associated responses:
  - Syntax: `sim [word] =!`
  - Example: `sim hi =!`
    - This will remove the word "hi" and all its associated responses from the `dan.json` file if it exists.

### Adding New Words and Responses

- To add a new word with its associated response(s):
  - Syntax: `sim [word] => [response]`
  - Example: `sim hi => Hello!`
    - This will add the word "hi" with the response "Hello!" to the `dan.json` file.

- To add multiple responses to an existing word:
  - Syntax: `sim [word] => [response1] => [response2] => ...`
  - Example: `sim hi => Hey! => Hi! => Hello!`
    - This will add the responses "Hey!", "Hi!", and "Hello!" to the existing word "hi" in the `dan.json` file.

Note: Make sure to separate the word, response, and any additional responses with the "=>" symbol. You can use these functions to teach them by using add, and delete words and responses as you prefer. Enjoy interacting with Dan!

## Function Activation and Deactivation

You can activate or deactivate certain functions using the commands "add =" and "del =".

- To activate or deactivate the "Add Function":
  - Syntax: `Dan add = [on/off]`
  - Example: `Dan add = on`
    - This will activate the "Add Function" in Dan, allowing you to add new words and responses.

- To activate or deactivate the "Delete Function":
  - Syntax: `sim del = [on/off]`
  - Example: `sim del = off`
    - This will deactivate the "Delete Function" in Dan, preventing you from deleting words and responses.

Note: These commands require administrative privileges. Only users specified in the global.config.ADMINBOT array can use these commands to control the functions. Use these commands wisely to manage and customize Dan's behavior as per your preferences.

## Credits

> Dan/Simv3 is developed by Yan Maglinte and inspired by Simsimi.