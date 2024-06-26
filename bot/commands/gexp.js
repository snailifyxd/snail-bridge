const ranks = ['Member', 'Danger Noodle', 'Elite', 'Ironman', 'Bot', 'Guild Master']; //make " 'Ironman', 'Contributor', 'Bot' " @snailifyxd

export default async function(bot, requestedPlayer) {
  requestedPlayer = requestedPlayer.split(" ")[0];
  let inactiveList = [];
  if (requestedPlayer == 'all') {
    const response = await fetch(`https://api.hypixel.net/v2/guild?key=${process.env.apiKey}&name=Nope%20Ropes`);
    const json = await response.json();
    let members = json.guild.members;
    for (let member in members) {
      member = members[member];
      let rank = member.rank;
      let totalGEXP = 0;
      for (let day in member.expHistory) {
        totalGEXP += member.expHistory[day];
      }
      if (rank != 'Ironman') {
        let newRank;
        if (totalGEXP >= 100000) {
          if (totalGEXP >= 200000) {
            newRank = 'Elite';
          }
          else {
            newRank = 'Danger Noodle';
          }
         }
         else {
          newRank = 'Member';
          if (totalGEXP == 0) {
            const response0 = await fetch(`https://api.mojang.com/user/profile/${member.uuid}`);
            const json0 = await response0.json();
            inactiveList.push(json0.name);
          }
         }
         if (newRank != rank) {
          const response0 = await fetch(`https://api.mojang.com/user/profile/${member.uuid}`);
          const json0 = await response0.json();
          let requestedUsername = json0.name;
          bot.chat(`/g setrank ${requestedUsername} ${newRank}`);
        }
         const response1 = await fetch(`https://api.hypixel.net/v2/skyblock/profiles?key=${process.env.apiKey}&uuid=${member.uuid}`);
         const json1 = await response1.json();
         if (json1.success == true) {
           for (let profile in json1.profiles) {
             if (profile.game_mode == 'ironman') {
               const response0 = await fetch(`https://api.mojang.com/user/profile/${member.uuid}`);
               const json0 = await response0.json();
               let name = json0.name;
               bot.chat(`/g setrank ${name} ironman`);
             }
           }
         }
        }
    }
    bot.chat('Inactive members: ' + inactiveList.join(' '));
    global.lastMessage = ('Inactive members: ' + inactiveList.join(' '));
  }
  else {
  const response0 = await fetch(`https://api.mojang.com/users/profiles/minecraft/${requestedPlayer}`);
  const json0 = await response0.json();
  let uuid = json0.id;
  requestedPlayer = json0.name;
  const response = await fetch(`https://api.hypixel.net/v2/guild?key=${process.env.apiKey}&name=Nope%20Ropes`);
  const json = await response.json();
  let members = json.guild.members;
  let totalGEXP = 0;
  let rank;
  let joinDate;
  for (let member in members) {
    member = members[member];
    if (member.uuid == uuid) {
    joinDate = new Date(member.joined).toLocaleDateString();
    rank = member.rank;
    for (let day in member.expHistory) {
      totalGEXP += member.expHistory[day];
    }
   }
  }
  if (rank !== 'Ironman') {
  let newRank;
  if (totalGEXP >= 100000) {
    if (totalGEXP >= 200000) {
      newRank = 'Elite';
    }
    else {
      newRank = 'Danger Noodle';
    }
    if (ranks.indexOf(newRank) > ranks.indexOf(rank)) {
      bot.chat(`/g setrank ${requestedPlayer} ${newRank}`);
    }
   }
  }
  setTimeout(() => {
    bot.chat(`/gc  ${requestedPlayer} joined ${joinDate}. 100k gexp for danger noodle, 200k for elite. Their gexp this week is ${totalGEXP.toLocaleString()}.`);
    global.lastMessage = (`/gc  ${requestedPlayer} joined ${joinDate}. 100k gexp for danger noodle, 200k for elite. Their gexp this week is ${totalGEXP.toLocaleString()}.`);
  }, 250);
 }
}
