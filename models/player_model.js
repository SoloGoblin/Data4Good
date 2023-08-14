function createPlayer(playerName) {

  let generatedId = ""
  for (let i = 0; i < 50; i++) {
    let rnd = Math.round(Math.random() * 9);
    generatedId += rnd;
  }




  let players = JSON.parse(fs.readFileSync('./data/players.json'));
  let newplayer = {
    "Id": generatedId,
    "name": playerName,
    "win": 0,
    "lose": 0,
    "tie": 0,
    "longestWord": "",
    "games": []
  }
  players[playerName] = newplayer;
  fs.writeFileSync('./data/players.json', JSON.stringify(players));
  return newplayer

}




module.exports = {}