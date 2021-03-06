module.exports = (config) => {
  const infoFooter = "([Helios-Trivia-Bot!!!))";

  // TODO: Refactor this mess
  const footerString = `Commands: \` \`,  \`${config.prefix}help\`, \`${config.prefix} \`, \`${config.prefix}stop\`, \`${config.prefix}ping\`
  _Bot by [Helios Protocol ](https://heliosprotocol.io). Powered by discord.js ${require("../package.json").dependencies["discord.js"].replace("^","")}\
  ${config.databaseURL==="heliosprotocol.org"?` \n${infoFooter}`:""}_`;

  return async function(msg, Database) {
    var res = "Let's play trivia! Type 'trivia play' to start a game.";

    global.client.shard.send({stats: { commandHelpCount: 1 }});

    // Question count
    var apiCountGlobal;
    try {
      var json = await Database.getGlobalCounts();
      apiCountGlobal = json.overall.total_num_of_verified_questions;
    }
    catch(err) {
      console.log(`Error while parsing help cmd apiCountGlobal: ${err.message}`);
      apiCountGlobal = "*(unknown)*";
    }
    res = res + `\nThere are ${apiCountGlobal.toLocaleString()} total questions.`;

    // Guild count
    var guildCount;
    try {
      var guildCountArray = await global.client.shard.fetchClientValues("guilds.size");
      guildCount = guildCountArray.reduce((prev, val) => prev + val, 0);
    }
    catch(err) {
      console.log(`Error while parsing help cmd guildCount: ${err.message}`);
      guildCount = "*(unknown)*";
    }
    res = res + ` Currently in ${guildCount.toLocaleString()} guild${guildCount!==1?"s":""}.`;

    // Commands and links
    res = `${res}\n\n${footerString}`;

    return res;
  };
};
