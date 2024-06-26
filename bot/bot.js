import regexes from './regexes.js';
import commands from './commandHandler.js';
import { gameHandler, checkAnswer } from './gameHandler.js';
import { onlineHandler } from './onlineHandler.js';
import { levelHandler } from './levelHandler.js';

export async function minecraft(bot, client, bridgeWebhook, logWebhook, punishWebhook) {
  //initialize game handler
  gameHandler(bot);

  //check for patch notes
  let lastPatchNotes = '';
  setInterval(async () => {
    const response = await fetch(`https://api.hypixel.net/v2/skyblock/news?key=${process.env.apiKey}`);
    const json = await response.json();
    if (json.success == true) {
      if (lastPatchNotes == '') {
        lastPatchNotes = json.items[0].link;
      }
      else if (lastPatchNotes != json.items[0].link) {
        bot.chat('/gc NEW UPDATE! ' + json.items[0].link);
        global.lastMessage = ('/gc NEW UPDATE! ' + json.items[0].link);
        lastPatchNotes = json.items[0].link;
      }
    }
  }, 5 * 60 * 1000);

  bot.on('login', () => {
    console.log('Joined as ' + bot.username);
    bot.chat("§"); // send self to limbo
    bot.chat("/g online");
  })

  bot.on('message', (message) => {
    console.log(message.toAnsi()); //make message colourful!!!
  })

  bot.on('messagestr', async (jsonMsg) => {
    if (jsonMsg.trim() == '') return;
    logWebhook.send(jsonMsg);

    let match;

    //levels
    if (match = jsonMsg.match(new RegExp("^Guild > (?:\\[(\\S+)\\])? " + process.env.botUsername + " \\[\\S+\\]: \\b(\\w+)\\b \\S (.+)"))) {
      const player = match[2];
      for (const user of global.usersData) {
        if (user.username == player) {
          levelHandler(bot, player);
          break;
        }
      }
    }
    else if (match = jsonMsg.match(/^Guild > (?:\[(\S+)\])? (\S+) \[(\S+)\]: (.+)/)) {
      const player = match[2];
      if (player != process.env.botUsername) levelHandler(bot, player);
    }

    //check if the message was blocked
    if (jsonMsg == 'You cannot say the same message twice!' || jsonMsg == 'You are sending commands too fast! Please slow down.') {
      bot.chat(global.lastMessage + ' \\\\\\\\');
      global.lastMessage = (global.lastMessage + ' \\\\\\\\');
      return;
    }
    if (jsonMsg == 'Advertising is against the rules. You will receive a punishment on the server if you attempt to advertise.') {
      bridgeWebhook.send('Hypixel Message: ' + jsonMsg);
      return;
    }

    //check if the message is from the /g online command
    onlineHandler(jsonMsg);
    
    //check for commands
    commands(bot, jsonMsg, match);

    //check for chat games answers
    checkAnswer(bot, jsonMsg);

    //minecraft -> discord handling
    const regex1 = new RegExp("^Guild > (?:\\[(\\S+)\\])? " + process.env.botUsername + " \\[\\S+\\]: \\b(\\w+)\\b \\S (.+)");
    if (match = jsonMsg.match(regex1)) {
      for (const user of global.usersData) {
        if (user.username == match[2]) {
          return;
        }
      }
    }
    for (const { regex, func } of regexes) {
      if (match = jsonMsg.match(regex)) {
        func(match, bridgeWebhook, punishWebhook, bot);
        break;
      }
    };
  })
}