import fs from 'fs';

export default async function info(bot, player) {
    if (player == 'top') {
        fs.readFile('bot/playerData.json', 'utf8', function (err, data) {
            if (err) throw err;
    
            let json = JSON.parse(data);

            const entries = Object.entries(json);
            const sortedEntries = entries.sort((a, b) => b[1].coins - a[1].coins);
            const top3Users = sortedEntries.slice(0, 3);

            let message = [];
            for (const i in top3Users) {
                message.push(`${Number(i) + 1}. ${top3Users[i][1].username} $${top3Users[i][1].coins}, ${top3Users[i][1].messageCount} msgs`);
            }
            bot.chat(message.join(', '));
            global.lastMessage = (message.join(', '));
        });
        return;
    }
    fs.readFile('bot/playerData.json', 'utf8', function (err, data) {
        if (err) throw err;

        let json = JSON.parse(data);

        if (!json[player.toLowerCase()]) { 
            bot.chat('Invalid player.');
            global.lastMessage =('Invalid player.');
            return;
        }

        bot.chat(`${json[player.toLowerCase()].username} has ${json[player.toLowerCase()].coins.toLocaleString()} coins and has sent ${json[player.toLowerCase()].messageCount.toLocaleString()} messages`);
        global.lastMessage = (`${json[player.toLowerCase()].username} has ${json[player.toLowerCase()].coins.toLocaleString()} coins and has sent ${json[player.toLowerCase()].messageCount.toLocaleString()} messages`);
    });
}