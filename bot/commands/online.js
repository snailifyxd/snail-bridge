const readability = {
  'farming_1': 'Barn Islands',
  'foraging_1': 'Park',
  'mining_1': 'Gold Mine',
  'mining_2': 'Deep Caverns',
  'mining_3': 'Dwarven Mines',
  'combat_1': "Spider's Den",
  'combat_3': 'End',
  'dynamic': 'Private Island'
}

export default async function(bot, requestedPlayer) {
  let uuid;
  try {
      const response1 = await fetch(`https://api.mojang.com/users/profiles/minecraft/${requestedPlayer}`);
      const json1 = await response1.json();
      uuid = json1.id;
      const response2 = await fetch(`https://api.hypixel.net/status?key=${process.env.apiKey}&uuid=${uuid}`);
      const json2 = await response2.json();
      if (json2.success === true) {
          let online = json2.session.online;
          let gameType = json2.session.gameType;
          let mode = json2.session.mode;
          if (readability[mode]) {
              mode = readability[mode];
          }
          mode = mode.replaceAll('_', ' ');
          let modeParts = mode.split(' ');
          for (let part in modeParts) {
              modeParts[part] = modeParts[part][0].toUpperCase() + modeParts[part].slice(1);
          }
          mode = modeParts.join(' ');
          bot.chat(online ? `/gc ${requestedPlayer} is in ${gameType} - ${mode}` : `${requestedPlayer} is offline.`);
          global.lastMessage = (online ? `/gc ${requestedPlayer} is in ${gameType} - ${mode}` : `${requestedPlayer} is offline.`);
      }
  } catch (error) {
      console.error('Error:', error);
  }
}
