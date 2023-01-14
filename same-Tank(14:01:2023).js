// ==UserScript==
// @name         same Tank
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  ...
// @author       tariteur
// @match        https://diep.io/
// @require      https://greasyfork.org/scripts/433681-diepapi/code/diepAPI.js?version=1100602
// @require      https://greasyfork.org/scripts/456843-diep-shortcut/code/diep_Shortcut.js?version=1138236
// @icon         https://www.google.com/s2/favicons?sz=64&domain=diep.io
// @grant        none
// ==/UserScript==
//I use DiepAPI by Cazka
const { Canvas } = window.diep_Shortcut.core;
const { CanvasKit } = window.diepAPI.core;
const { player, game } = window.diepAPI.apis;
const { backgroundOverlay } = window.diepAPI.tools;
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const ctx2 = backgroundOverlay.ctx;
const textShadow = 'text-shadow:black 0.18vh 0, black -0.18vh 0, black 0 -0.18vh, black 0 0.18vh, black 0.18vh 0.18vh, black -0.18vh 0.18vh, black 0.18vh -0.18vh, black -0.18vh -0.18vh, black 0.09vh 0.18vh, black -0.09vh 0.18vh, black 0.09vh -0.18vh, black -0.09vh -0.18vh, black 0.18vh 0.09vh, black -0.18vh 0.09vh, black 0.18vh -0.09vh, black -0.18vh -0.09vh'
const colors = ["#E8B18A", "#E666EA", "#9566EA", "#6690EA", "#E7D063", "#EA6666", "#92EA66", "#808080"];
////////////////////rose////////violet/////bleu///////jaune//////rouge//////vert///////bleu clair//gris////

CanvasKit.hookCtx('fillText', (target, thisArg, args) => {
  const text = args[0];
  const addMatch = text.match(/^x\s(\d+)/);
  if (addMatch != null) {
    Players_Stat_Add_Number = parseInt(addMatch[1]);
  }
  const tankMatch = text.match(/^Lvl (\d+) ([\w-]+\s?[\w-]*)$/);
  if (tankMatch != null) {
    Tank = tankMatch[2];
  }
  const ScoreMatch = text.match(/^Score:/);
  if (ScoreMatch != null) {
    Playerscore = parseInt(text.replace(/^Score:/, '').replace(',', ''));
    console.log(Playerscore)
    tankUpgrade._score();
  }
});
const TANK_UPGRADES = {
  //Twin
  Twin: 1,
  Triple_Shot: 1,
  Triplet: 1,
  Penta_Shot: 2,
  Spread_Shot: 3,
  Quad_Tank: 2,
  Octo_Tank: 1,
  Auto_5: 2,
  Twin_Flank: 3,
  Triple_Twin: 1,
  Battleship: 2,
  //Machine Gun
  Machine_Gun: 3,
  Destroyer: 1,
  Hybrid: 1,
  Annihilator: 2,
  Skimmer: 3,
  Rocketeer: 4,
  Gunner: 2,
  Auto_Gunner: 1,
  Gunner_Trapper: 2,
  Streamliner: 3,
  Sprayer: 3,
  //Sniper
  Sniper: 2,
  Assassin: 1,
  Ranger: 1,
  Stalker: 2,
  Overseer: 2,
  Overlord: 1,
  Necromancer: 2,
  Manager: 3,
  Overtrapper: 4,
  Factory: 6,
  Hunter: 3,
  Predator: 1,
  Trapper: 4,
  Tri_Trapper: 1,
  Mega_Trapper: 4,
  Auto_Trapper: 5,
  //Booster
  Flank_Guard: 4,
  Booster: 1,
  Tri_Angle: 1,
  Fighter: 2,
  //Smasher
  Smasher: 5,
  Landmine: 1,
  Auto_Smasher: 2,
  Spike: 3,
};

class TankUpgrade {
  constructor() {
    this.upgradeInProgress = false;
    this._connect();
  }
  _connect() {
    this._socket = new WebSocket(
      "wss://gravel-slender-spectroscope.glitch.me/"
    );
    this._socket.binaryType = "arraybuffer";
    this._socket.addEventListener("message", (e) => this._onmessage(e));
    this._socket.addEventListener("open", (e) => this._onopen(e));
    this._socket.addEventListener("close", (e) =>
      setTimeout(() => this._connect(), 100)
    );
  }
  _onopen() {
    // Send the server our name
    this._socket.send(
      new TextEncoder().encode(
        JSON.stringify({ type: "playerName", playerName: name })
      )
    );
  }
  _score() {
    // Send the server our name
    this._socket.send(
      new TextEncoder().encode(
        JSON.stringify({ type: "Playerscore", Playerscore: Playerscore })
      )
    );
  }
  smiley(emoticon) {
    // Send the server our name
    this._socket.send(
      new TextEncoder().encode(
        JSON.stringify({ type: "chat", playerName: name, chat: emoticon })
      )
    );
  }
  _onmessage(e) {
    const receive = JSON.parse(new TextDecoder().decode(e.data));
    if (receive.type === "playerList") {
      playersList = receive.players;
      playersScore = receive.score;
      // Update the player count GUI element
      Canvas.GUI_changeName("userCount", `User: ${receive.playerCount}`);
      document.getElementById("userCount").click();
      document.getElementById("userCount").click();
    } else if (receive.type === "smyley") {
      displayEmoticon(receive.players, receive.smyley);
    }
  }
  findNearestValue(score) {
    const values = [0, 15, 22, 30, 45];
    let nearestValue = values[0];
    for (const value of values) {
      if (Math.abs(value - score) < Math.abs(nearestValue - score)) {
        nearestValue = value;
      }
    }
    return nearestValue;
  }
  async upgrade_stat(id, level) {
    if (id < 1 || id > 8) throw `diepAPI: ${id} is not a supported stat`;
    window.input.keyDown(85);
    for (let i = 0; i < level; i++) {
      window.input.keyDown(48 + id);
      window.input.keyUp(48 + id);
    }
    window.input.keyUp(85);
  }

  upgrade(name) {
    if (!this.upgradeInProgress) {
      this.upgradeInProgress = true;
      setTimeout(() => {
        player.upgrade_tank(TANK_UPGRADES[name]);
        this.currentTank = name;
      }, 1400);
      setTimeout(() => {
        player.upgrade_tank(TANK_UPGRADES[name]);
        this.currentTank = name;
        this.upgradeInProgress = false;
      }, 1500);
      setTimeout(() => {
        player.lookAt(player.mouse);
      }, 1700);
    }
  }

  upgradeChain(upgrades) {
    let currentLevel = 0;
    const upgradeLoop = () => {
      this.upgrade(upgrades[currentLevel]);
      currentLevel++;
      if (currentLevel < upgrades.length) {
        setTimeout(upgradeLoop, 1400);
      } else {
        this.currentTank = upgrades[currentLevel - 1];
      }
    };
    upgradeLoop();
  }
}

let tankUpgrade = new TankUpgrade();
let loadscore = 0;
let LVL = 0;
let Playerscore;
let Players_Stat_Add_Number = 0;
let name = "";
let Tank = "Tank";
let TankNeed = "Tank";
let setTankNeed = "Tank";
let max = 7;
let statsNeed = "";
let ONOFF = false;
let setting = false;
let statistics = false;
let intervalID;
let userCountONOFF = false;
let playersList = [];
let playersScore;
let help = false;
let more = false;
let E = false;
let spawn = false;
let Fire = false;
const emoticons = ["😀", "😍", "😎", "😜", "🤪"];


const messageContainer = document.createElement("div");
messageContainer.style.position = "absolute";
messageContainer.style.left = "10px";
messageContainer.style.top = "10px";
document.body.appendChild(messageContainer);

function displayEmoticon(emoticon, playerName) {
    // Create message element
    const emoticonElement = document.createElement("div");
    emoticonElement.innerHTML = `${emoticon}: ${playerName}`;
    emoticonElement.style.textShadow = "2px 2px 0 black,-2px -2px 0 black";;
    emoticonElement.style.color = "white";
    emoticonElement.style.fontSize = "20px";
    emoticonElement.style.marginBottom = "5px";
    emoticonElement.style.transition = "opacity 1s";
    messageContainer.insertBefore(emoticonElement, messageContainer.firstChild);

    // Remove oldest message if container has more than 10 children
    if (messageContainer.childElementCount > 20) {
        messageContainer.removeChild(messageContainer.lastChild);
    }

    // Remove message after 10 seconds
    setTimeout(() => {
        emoticonElement.style.opacity = 0;
        setTimeout(() => emoticonElement.remove(), 1000);
    }, 10000);
}
    emoticons.forEach((emoticon, index) => {
        Canvas.GUI_create(emoticon, "button", emoticon, `${97 - (index * 5)}%`, `${15 + (index * 5)}%`, 6, 3, "#adadad", 2, 1, () => {
            tankUpgrade.smiley(emoticon);
        });
    });

Canvas.GUI_create("userCount", "button", "User: 0", 97+"%", 76+"%", 6, 3, "#adadad", 2, 1, () => {
    userCountONOFF = ! userCountONOFF;
    let offset = 2.5;
    let modalHeight = 25;
    let highestScore = 0;
    let highestScorer = "";
    let maxScore = 100000;
    if (userCountONOFF) {
      let playersListSorted = {...playersList};
      playersListSorted = Object.entries(playersListSorted).sort((a, b) => playersScore[b[0]] - playersScore[a[0]]);
      for (let [playerID, player] of playersListSorted) {
          if (playersScore[playerID] > highestScore) {
              highestScore = playersScore[playerID];
              highestScorer = player;
          }
          let scoreRatio = playersScore[playerID] / maxScore;
          let red = 255;
          let green = 255 - (255 * scoreRatio);
          let blue = 255 - (255 * scoreRatio);
          let color = `rgb(${red}, ${green}, ${blue})`;
          Canvas.Text_create(`player-name-${playerID}`, "userCount", 73.5, 7 + offset, `${player}`, player == highestScorer ? "gold" : "#FFFFFF");
          Canvas.Text_create(`player-score-${playerID}`, "userCount", 80, 7 + offset, `${playersScore[playerID]}`, color);
          offset += 2.5;
          modalHeight += 20;
      }
      Canvas.GUI_create_Modal("modal", "userCount", 72.5+"%", 4+"%", 11+"vw", modalHeight+"px", "#33333380","#28282880");
      Canvas.GUI_create_Modal("line", "userCount", 79.65+"%", 4.2+"%", 4+"vw", modalHeight+"px", "white");
    } else {
      Canvas.GUI_delete("class", "userCount")
    }
});
// I will add load📂 save💾
Canvas.GUI_create("Player_Save", "button", "Save  Player", 97+"%", 46+"%", 8, 3, "#FFD700", 2, 1, function() {
    setTankNeed = Tank;
    LVL = tankUpgrade.findNearestValue(player.level);
    if (LVL == 0) {
        loadscore = 0;
    } else if (LVL == 22) {
        loadscore = 1258
    } else if (LVL == 30) {
        loadscore = 4200
    } else if (LVL == 45) {
        loadscore = 23000
    }
});
Canvas.GUI_create("Player_ONOFF", "button", "OFF", 97+"%", 54+"%", 3, 3, "#00FF00", 2, 1, function() {
    ONOFF = !ONOFF;
    if (ONOFF) {
        Canvas.GUI_hide_or_show("class","stats_button", false)
        Canvas.GUI_hide_or_show("id","Player_Save", false)
        this.innerHTML = "ON"
    } else {
        this.innerHTML = "OFF"
        resetStats();
        Canvas.GUI_hide_or_show("class","stats_button", true)
        Canvas.GUI_hide_or_show("id","Player_Save", true)
    }
});
Canvas.GUI_create("Player_+", "button", "+", 97+"%", 57+"%", 6, 3, "#EA6666", 2, 1, function() {
    more = !more;
    if (more) {
        Canvas.GUI_hide_or_show("id","Player_feed", true)
        Canvas.GUI_hide_or_show("id","Player_spawn", true)
    } else {
        Canvas.GUI_hide_or_show("id","Player_feed", false)
        Canvas.GUI_hide_or_show("id","Player_spawn", false)
    }
});
Canvas.GUI_create("Player_feed", "button", "Key E: OFF", 93.5+"%", 57+"%", 6, 3, "#EA6666", 2, 1, function() {
    E = !E;
    if (E) {
        this.innerHTML = "Key E: ON"
    } else {
        this.innerHTML = "Key E: OFF"
    }
});
Canvas.GUI_create("Player_spawn", "button", "Spawn: OFF", 90+"%", 57+"%", 6, 3, "#EA6666", 2, 1, function() {
    spawn = !spawn;
    if (spawn) {
        this.innerHTML = "Spawn: ON"
    } else {
        this.innerHTML = "Spawn: OFF"
    }
});
Canvas.GUI_create("Player_Setting", "button", "⚙️", 97+"%", 43+"%", 3, 3, "#66EAE6", 2, 1, function() {
    setting = !setting;
    if (setting) {
    Canvas.GUI_hide_or_show("id","Player_Setting_Reload", true)
    Canvas.GUI_hide_or_show("id","Player_Setting_help", true)
    Canvas.GUI_hide_or_show("id","Player_Setting_DC", true)
    } else {
    Canvas.GUI_hide_or_show("id","Player_Setting_Reload", false)
    Canvas.GUI_hide_or_show("id","Player_Setting_help", false)
    Canvas.GUI_hide_or_show("id","Player_Setting_DC", false)
    help = false;Canvas.GUI_hide_or_show("class","setting_help_Text", false)
    }
});
Canvas.GUI_create("Player_Setting_Reload", "setting_button", "🔄", 93.5+"%", 43+"%", 3, 3, "#adadad", 2, 1, function() {
    loadscore = 0;
    LVL = 0;
    Playerscore;
    TankNeed = "Tank";
    setTankNeed = "Tank";
    statsNeed = '';
    ONOFF = false;
    setting = false;
    statistics = false;
    userCountONOFF = false;
    help = false;
    more = false;
    E = false;
    spawn = false;
    Fire = false;
    statsString = '';
    stats = {
    Health_Regen: [0, 1],
    Max_Health: [0, 2],
    Body_Damage: [0, 3],
    Bullet_Speed: [0, 4],
    Bullet_Penetration: [0, 5],
    Bullet_Damage: [0, 6],
    Reload: [0, 7],
    Mouvement_Speed: [0, 8]
    };
    Canvas.GUI_hide_or_show("class","stats_button", true)
    Canvas.GUI_changeName("id","Player_ONOFF", "OFF")
    Canvas.GUI_hide_or_show("id","Player_ONOFF", true)
    Canvas.GUI_hide_or_show("id","Player_Save", true)
    Canvas.GUI_hide_or_show("id","Player_Setting", true)
    Canvas.GUI_hide_or_show("id","Player_Setting_Reload", false)
    Canvas.GUI_hide_or_show("id","Player_Setting_help", false)
    Canvas.GUI_hide_or_show("id","Player_Setting_DC", false)
    Canvas.GUI_hide_or_show("id","Player_feed", false)
    Canvas.GUI_hide_or_show("id","Player_spawn", false)
    Canvas.GUI_changeName("id","Player_feed", "Key E: OFF")
    Canvas.GUI_changeName("id","Player_spawn", "Spawn: OFF")
    Canvas.GUI_hide_or_show("class","setting_help_Text", false)
    Canvas.GUI_hide_or_show("class","userCount", false)
});
Canvas.GUI_create_Modal("Player_Setting_help_Modal", "setting_help_Text", 24+"%", 1+"%", 15+"%", 4.5+"%", "#33333380","#28282880")
Canvas.Text_create("Player_Setting_help_Text1", "setting_help_Text", 25, 1, "Help:")
Canvas.Text_create("Player_Setting_help_Text2", "setting_help_Text", 25, 3, "this script allows you to save");
Canvas.Text_create("Player_Setting_help_Text3", "setting_help_Text", 25, 5, "put yourself, if you die it will");
Canvas.Text_create("Player_Setting_help_Text4", "setting_help_Text", 25, 7, "you back as befores");
Canvas.GUI_create_Modal("Player_Setting_help_Modal2", "setting_help_Text", 24+"%", 9+"%", 15+"%", 1+"%", "#33333380","#FF000080")
Canvas.Text_create("Player_Setting_help_Text5", "setting_help_Text", 25, 9, "choose your tank your stats,");
Canvas.Text_create("Player_Setting_help_Text6", "setting_help_Text", 25, 11, "level and save and press on");
Canvas.GUI_create_Modal("Player_Setting_help_Modal3", "setting_help_Text", 24+"%", 13.5+"%", 15+"%", 0.25+"%", "#33333380","#0072CC80")
Canvas.Text_create("Player_Setting_help_Text7", "setting_help_Text", 25, 13, "do not click when placing");
Canvas.Text_create("Player_Setting_help_Text8", "setting_help_Text", 25, 15, "the tank");
Canvas.GUI_create("Player_Setting_help", "setting_button", "❓", 90+"%", 43+"%", 3, 3, "#adadad", 2, 1, function() {
    help = !help
    if (help) {
        Canvas.GUI_hide_or_show("class","setting_help_Text", true)
    } else {
        Canvas.GUI_hide_or_show("class","setting_help_Text", false)
    }
});
Canvas.GUI_create("Player_Setting_DC", "setting_button", "DC", 86.5+"%", 43+"%", 3, 3, "#7289da", 2, 1, function() {
    window.open("https://discord.gg/4Rk3yGSQDp", "_blank");
});
Canvas.GUI_hide_or_show("id","Player_feed", false)
Canvas.GUI_hide_or_show("id","Player_spawn", false)
Canvas.GUI_hide_or_show("id","Player_Setting_Reload", false)
Canvas.GUI_hide_or_show("id","Player_Setting_help", false)
Canvas.GUI_hide_or_show("id","Player_Setting_DC", false)
Canvas.GUI_hide_or_show("class","setting_help_Text", false)

let statsString = '';
let stats = {
  Health_Regen: [0, 1],
  Max_Health: [0, 2],
  Body_Damage: [0, 3],
  Bullet_Speed: [0, 4],
  Bullet_Penetration: [0, 5],
  Bullet_Damage: [0, 6],
  Reload: [0, 7],
  Mouvement_Speed: [0, 8]
};
function resetStats() {
  for (const key of Object.keys(stats)) {
    stats[key][0] = 0;
  }
}
function updateStatsString() {
  let total = 0;
  for (const value of Object.values(stats)) {
    total += value[0];
  }
  if (total > 33) {
    return;
  }
  statsString = "";
  for (const key of Object.keys(stats)) {
    for (let i = 0; i < stats[key][0]; i++) {
      statsString += `${stats[key][1]}`;
    }
  }
  statsString = statsString.substring(0, 33);
}
Canvas.GUI_create("Health_Regen", "stats_button", "+", 162+"px", 168+"px", 2.1, 2, "#EEB690", 2, 1, function() {
  if (stats.Health_Regen[0] !== max) {
    tankUpgrade.upgrade_stat(stats.Health_Regen[1], 1)
    stats.Health_Regen[0] += 1;
    updateStatsString();
  }
});
Canvas.GUI_create("Max_Health", "stats_button", "+", 143+"px", 168+"px", 2.1, 2, "#EC6CF0", 2, 1, function() {
  if (stats.Max_Health[0] !== max) {
    tankUpgrade.upgrade_stat(stats.Max_Health[1], 1)
    stats.Max_Health[0] += 1;
    updateStatsString();
  }
});
Canvas.GUI_create("Body_Damage", "stats_button", "+", 123+"px", 168+"px", 2.1, 2, "#9A6CF0", 2, 1, function() {
  if (stats.Body_Damage[0] !== max) {
    tankUpgrade.upgrade_stat(stats.Body_Damage[1], 1)
    stats.Body_Damage[0] += 1;
    updateStatsString();
  }
});
Canvas.GUI_create("Bullet_Speed", "stats_button", "+", 104+"px", 168+"px", 2.1, 2, "#6C96F0", 2, 1, function() {
  if (stats.Bullet_Speed[0] !== max) {
    tankUpgrade.upgrade_stat(stats.Bullet_Speed[1], 1)
    stats.Bullet_Speed[0] += 1;
    updateStatsString();
  }
});
Canvas.GUI_create("Bullet_Penetration", "stats_button", "+", 84+"px", 168+"px", 2.1, 2, "#F0D96C", 2, 1, function() {
  if (stats.Bullet_Penetration[0] !== max) {
    tankUpgrade.upgrade_stat(stats.Bullet_Penetration[1], 1)
    stats.Bullet_Penetration[0] += 1;
    updateStatsString();
  }
});Canvas.GUI_create("Bullet_Damage", "stats_button", "+", 64.2+"px", 168+"px", 2.1, 2, "#EA6666", 2, 1, function() {
  if (stats.Bullet_Damage[0] !== max) {
    tankUpgrade.upgrade_stat(stats.Bullet_Damage[1], 1)
    stats.Bullet_Damage[0] += 1;
    updateStatsString();
  }
});
Canvas.GUI_create("Reload", "stats_button", "+", 44.8+"px", 168+"px", 2.1, 2, "#92EA66", 2, 1, function() {
  if (stats.Reload[0] !== max) {
    tankUpgrade.upgrade_stat(stats.Reload[1], 1)
    stats.Reload[0] += 1;
    updateStatsString();
  }
});
Canvas.GUI_create("Mouvement_Speed", "stats_button", "+", 25+"px", 168+"px", 2.1, 2, "#66EAE6", 2, 1, function() {
  if (stats.Mouvement_Speed[0] !== max) {
    tankUpgrade.upgrade_stat(stats.Mouvement_Speed[1], 1)
    stats.Mouvement_Speed[0] += 1;
    updateStatsString();
  }
});
document.addEventListener("keydown", (event) => {
      if (event.key === "t") {
          tankUpgrade.smiley();
      }
});
document.addEventListener("keydown", (event) => {
      if (event.key === "l") {
          statistics = true;
      }
});
document.addEventListener("keyup", (event) => {
      if (event.key === "l") {
          statistics = false;
      }
});
game.once('ready', () => {
  game.on('frame', () => {
      if (name !== localStorage.getItem("name")) {
      name = localStorage.getItem("name");
      tankUpgrade._onopen();
      }
      //statistics
      if (statistics) {
      if (ONOFF) {Players_Stat_Add_Number = "? because its ON"}
      if (Players_Stat_Add_Number == 2) {Players_Stat_Add_Number = "2 or 1 or 0"}
      let lvl = tankUpgrade.findNearestValue(player.level);
      ctx.save();
      ctx.textAlign = "left"
      ctx.font = `${20 * window.devicePixelRatio}px Ubuntu`;
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#000000";
      ctx.globalAlpha = 1;
      ctx.fillText("Tank: " + Tank, 20, window.innerHeight * 0.50);
      ctx.strokeText("Tank: " + Tank, 20, window.innerHeight * 0.50);
      ctx.fillText("Active: " + ONOFF, 20, window.innerHeight * 0.50+20);
      ctx.strokeText("Active: " + ONOFF, 20, window.innerHeight * 0.50+20);
      ctx.fillText("Score: " + Playerscore, 20, window.innerHeight * 0.50+40);
      ctx.strokeText("Score: " + Playerscore, 20, window.innerHeight * 0.50+40);
      ctx.fillText("Lvl selection: " + lvl, 20, window.innerHeight * 0.50+60);
      ctx.strokeText("Lvl selection: " + lvl, 20, window.innerHeight * 0.50+60);
      ctx.fillText("Stat: " + statsString, 20, window.innerHeight * 0.50+80)
      ctx.strokeText("Stat: " + statsString, 20, window.innerHeight * 0.50+80)
      ctx.fillText("Stat add number: " + Players_Stat_Add_Number, 20, window.innerHeight * 0.50+100);
      ctx.strokeText("Stat add number: " + Players_Stat_Add_Number, 20, window.innerHeight * 0.50+100);
      ctx.restore();
      }
      if (Tank == "Smasher" || Tank == "Landmine" || Tank == "Spike") {
          max = 10;
          stats.Bullet_Speed[0] = 0;
          stats.Bullet_Penetration[0] = 0;
          stats.Bullet_Damage[0] = 0;
          stats.Reload[0] = 0;
          console.log(stats.Mouvement_Speed[0])
          Canvas.GUI_hide_or_show("class","stats_button", false)
          Canvas.GUI_hide_or_show("id","Health_Regen", true)
          Canvas.GUI_hide_or_show("id","Max_Health", true)
          Canvas.GUI_hide_or_show("id","Body_Damage", true)
          Canvas.GUI_hide_or_show("id","Mouvement_Speed", true)
      } else if (!ONOFF) {
          Canvas.GUI_hide_or_show("class","stats_button", true)
          max = 7;
      }
      if (!ONOFF) return;
    if (player.isDead) {
         statsNeed = statsString;
         tankUpgrade.currentTank = "Tank";
         TankNeed = setTankNeed;
         //spawn
         if (spawn) {
                                                  //avoid deleting everything after a space
             window.input.execute('game_spawn ' + name.replace(/\s+/g, '\u00A0'));
         }
         Fire = true;
    } else {
        //E
        if (E && Fire) {
            setTimeout(() => {
            window.input.keyDown(69); window.input.keyUp(69);
            }, 400);
            Fire = false;
        }
        //level
        if (Playerscore < loadscore) {
        window.input.keyDown(75)
      } else {
        window.input.keyUp(75);
        //stat
        window.input.execute(`game_stats_build ${statsNeed}`);
        //tank
          if (TankNeed == "Tank") {
              return;
        }
        //Twin
        switch (TankNeed) {
  case "Twin":
    if (tankUpgrade.currentTank !== "Twin") {
      tankUpgrade.upgradeChain(["Twin"]);
    }
    break;
  case "Triple Shot":
    if (tankUpgrade.currentTank !== "Twin" && tankUpgrade.currentTank !== "Triple_Shot") {
      tankUpgrade.upgradeChain(["Twin", "Triple_Shot"]);
    }
    break;
  case "Triplet":
    if (tankUpgrade.currentTank !== "Twin" && tankUpgrade.currentTank !== "Triple_Shot" && tankUpgrade.currentTank !== "Triplet") {
      tankUpgrade.upgradeChain(["Twin", "Triple_Shot", "Triplet"]);
    }
    break;
  case "Penta Shot":
    if (tankUpgrade.currentTank !== "Twin" && tankUpgrade.currentTank !== "Triple_Shot" && tankUpgrade.currentTank !== "Penta_Shot") {
      tankUpgrade.upgradeChain(["Twin", "Triple_Shot", "Penta_Shot"]);
    }
    break;
  case "Spread Shot":
    if (tankUpgrade.currentTank !== "Twin" && tankUpgrade.currentTank !== "Triple_Shot" && tankUpgrade.currentTank !== "Spread_Shot") {
      tankUpgrade.upgradeChain(["Twin", "Triple_Shot", "Spread_Shot"]);
    }
    break;
  case "Quad Tank":
    if (tankUpgrade.currentTank !== "Twin" && tankUpgrade.currentTank !== "Quad_Tank") {
      tankUpgrade.upgradeChain(["Twin", "Quad_Tank"]);
    }
    break;
  case "Octo Tank":
    if (tankUpgrade.currentTank !== "Twin" && tankUpgrade.currentTank !== "Quad_Tank" && tankUpgrade.currentTank !== "Octo_Tank") {
      tankUpgrade.upgradeChain(["Twin", "Quad_Tank", "Octo_Tank"]);
    }
    break;
  case "Auto 5":
    if (tankUpgrade.currentTank !== "Twin" && tankUpgrade.currentTank !== "Quad_Tank" && tankUpgrade.currentTank !== "Auto_5") {
      tankUpgrade.upgradeChain(["Twin", "Quad_Tank", "Auto_5"]);
    }
    break;
  case "Twin Flank":
    if (tankUpgrade.currentTank !== "Twin" && tankUpgrade.currentTank !== "Twin_Flank") {
      tankUpgrade.upgradeChain(["Twin", "Twin_Flank"]);
    }
    break;
  case "Triple Twin":
    if (tankUpgrade.currentTank !== "Twin" && tankUpgrade.currentTank !== "Twin_Flank" && tankUpgrade.currentTank !== "Triple_Twin") {
      tankUpgrade.upgradeChain(["Twin", "Twin_Flank", "Triple_Twin"]);
    }
    break;
  case "Battleship":
    if (tankUpgrade.currentTank !== "Twin" && tankUpgrade.currentTank !== "Twin_Flank" && tankUpgrade.currentTank !== "Battleship") {
      tankUpgrade.upgradeChain(["Twin", "Twin_Flank", "Battleship"]);
    }
    break;
        //Sniper
    case "Sniper":
    if (tankUpgrade.currentTank !== "Sniper") {
      tankUpgrade.upgradeChain(["Sniper"]);
    }
    break;
  case "Assassin":
    if (tankUpgrade.currentTank !== "Sniper" && tankUpgrade.currentTank !== "Assassin") {
      tankUpgrade.upgradeChain(["Sniper", "Assassin"]);
    }
    break;
  case "Ranger":
    if (tankUpgrade.currentTank !== "Sniper" && tankUpgrade.currentTank !== "Ranger") {
      tankUpgrade.upgradeChain(["Sniper", "Ranger"]);
    }
    break;
  case "Stalker":
    if (tankUpgrade.currentTank !== "Sniper" && tankUpgrade.currentTank !== "Stalker") {
      tankUpgrade.upgradeChain(["Sniper", "Stalker"]);
    }
    break;
    case "Overseer":
    if (tankUpgrade.currentTank !== "Sniper" && tankUpgrade.currentTank !== "Overseer") {
      tankUpgrade.upgradeChain(["Sniper", "Overseer"])
    }
    break;
  case "Overlord":
    if (tankUpgrade.currentTank !== "Sniper" && tankUpgrade.currentTank !== "Overseer" && tankUpgrade.currentTank !== "Overlord") {
      tankUpgrade.upgradeChain(["Sniper", "Overseer", "Overlord"])
    }
    break;
  case "Necromancer":
    if (tankUpgrade.currentTank !== "Sniper" && tankUpgrade.currentTank !== "Overseer" && tankUpgrade.currentTank !== "Necromancer") {
      tankUpgrade.upgradeChain(["Sniper", "Overseer", "Necromancer"])
    }
    break;
  case "Manager":
    if (tankUpgrade.currentTank !== "Sniper" && tankUpgrade.currentTank !== "Overseer" && tankUpgrade.currentTank !== "Manager") {
      tankUpgrade.upgradeChain(["Sniper", "Overseer", "Manager"])
    }
    break;
  case "Overseer":
    if (tankUpgrade.currentTank !== "Sniper" && tankUpgrade.currentTank !== "Overseer") {
      tankUpgrade.upgradeChain(["Sniper", "Overseer"])
    }
    break;
  case "Overlord":
    if (tankUpgrade.currentTank !== "Sniper" && tankUpgrade.currentTank !== "Overseer" && tankUpgrade.currentTank !== "Overlord") {
      tankUpgrade.upgradeChain(["Sniper", "Overseer", "Overlord"])
    }
    break;
  case "Necromancer":
    if (tankUpgrade.currentTank !== "Sniper" && tankUpgrade.currentTank !== "Overseer" && tankUpgrade.currentTank !== "Necromancer") {
      tankUpgrade.upgradeChain(["Sniper", "Overseer", "Necromancer"])
    }
    break;
  case "Manager":
    if (tankUpgrade.currentTank !== "Sniper" && tankUpgrade.currentTank !== "Overseer" && tankUpgrade.currentTank !== "Manager") {
      tankUpgrade.upgradeChain(["Sniper", "Overseer", "Manager"])
    }
    break;
  case "Overtrapper":
    if (tankUpgrade.currentTank !== "Sniper" && tankUpgrade.currentTank !== "Overseer" && tankUpgrade.currentTank !== "Overtrapper") {
      tankUpgrade.upgradeChain(["Sniper", "Overseer", "Overtrapper"])
    }
    break;
  case "Factory":
    if (tankUpgrade.currentTank !== "Sniper" && tankUpgrade.currentTank !== "Overseer" && tankUpgrade.currentTank !== "Factory") {
      tankUpgrade.upgradeChain(["Sniper", "Overseer", "Factory"])
    }
    break;
  case "Hunter":
    if (tankUpgrade.currentTank !== "Sniper" && tankUpgrade.currentTank !== "Hunter") {
      tankUpgrade.upgradeChain(["Sniper", "Hunter"])
    }
    break;
  case "Predator":
    if (tankUpgrade.currentTank !== "Sniper" && tankUpgrade.currentTank !== "Hunter" && tankUpgrade.currentTank !== "Predator") {
      tankUpgrade.upgradeChain(["Sniper", "Hunter", "Predator"])
    }
    break;
  case "Mothership":
    if (tankUpgrade.currentTank !== "Sniper" && tankUpgrade.currentTank !== "Hunter" && tankUpgrade.currentTank !== "Predator" && tankUpgrade.currentTank !== "Mothership") {
      tankUpgrade.upgradeChain(["Sniper", "Hunter", "Predator"]);
      setTimeout(() => {if (Tank == "Mothership") {window.input.keyDown(220);window.input.keyUp(220)}}, 5000); //Mothership
    }
     break;
  case "Trapper":
    if (tankUpgrade.currentTank !== "Sniper" && tankUpgrade.currentTank !== "Trapper") {
       tankUpgrade.upgradeChain(["Sniper", "Trapper"])
    }
     break;
  case "Tri-Trapper":
    if (tankUpgrade.currentTank !== "Sniper" && tankUpgrade.currentTank !== "Trapper" && tankUpgrade.currentTank !== "Tri_Trapper") {
       tankUpgrade.upgradeChain(["Sniper", "Trapper", "Tri_Trapper"])
    }
     break;
  case "Mega Trapper":
    if (tankUpgrade.currentTank !== "Sniper" && tankUpgrade.currentTank !== "Trapper" && tankUpgrade.currentTank !== "Mega_Trapper") {
       tankUpgrade.upgradeChain(["Sniper", "Trapper", "Mega_Trapper"])
    }
     break;
  case "Auto Trapper":
    if (tankUpgrade.currentTank !== "Sniper" && tankUpgrade.currentTank !== "Trapper" && tankUpgrade.currentTank !== "Auto_Trapper") {
       tankUpgrade.upgradeChain(["Sniper", "Trapper", "Auto_Trapper"])
    }
     break;
        //Machine_Gun
  case "Machine Gun":
    if (tankUpgrade.currentTank !== "Machine_Gun") {
            tankUpgrade.upgradeChain(["Machine_Gun"])
        }
     break;
  case "Destroyer":
    if (tankUpgrade.currentTank !== "Machine_Gun" && tankUpgrade.currentTank !== "Destroyer") {
            tankUpgrade.upgradeChain(["Machine_Gun", "Destroyer"])
        }
     break;
  case "Hybrid":
    if (tankUpgrade.currentTank !== "Machine_Gun" && tankUpgrade.currentTank !== "Destroyer" && tankUpgrade.currentTank !== "Hybrid") {
         tankUpgrade.upgradeChain(["Machine_Gun", "Destroyer", "Hybrid"])
     }
     break;
  case "Annihilator":
    if (tankUpgrade.currentTank !== "Machine_Gun" && tankUpgrade.currentTank !== "Destroyer" && tankUpgrade.currentTank !== "Annihilator") {
         tankUpgrade.upgradeChain(["Machine_Gun", "Destroyer", "Annihilator"])
     }
     break;
  case "Skimmer":
    if (tankUpgrade.currentTank !== "Machine_Gun" && tankUpgrade.currentTank !== "Destroyer" && tankUpgrade.currentTank !== "Skimmer") {
         tankUpgrade.upgradeChain(["Machine_Gun", "Destroyer", "Skimmer"])
     }
     break;
  case "Rocketeer":
     if (tankUpgrade.currentTank !== "Machine_Gun" && tankUpgrade.currentTank !== "Destroyer" && tankUpgrade.currentTank !== "Rocketeer") {
         tankUpgrade.upgradeChain(["Machine_Gun", "Destroyer", "Rocketeer"])
     }
    break;
  case "Gunner":
     if (tankUpgrade.currentTank !== "Machine_Gun" && tankUpgrade.currentTank !== "Gunner") {
         tankUpgrade.upgradeChain(["Machine_Gun", "Gunner"])
     }
     break;
  case "Auto Gunner":
     if (tankUpgrade.currentTank !== "Machine_Gun" && tankUpgrade.currentTank !== "Gunner" && tankUpgrade.currentTank !== "Auto_Gunner") {
            tankUpgrade.upgradeChain(["Machine_Gun", "Gunner", "Auto_Gunner"])
     }
     break;
  case "Gunner Trapper":
     if (tankUpgrade.currentTank !== "Machine_Gun" && tankUpgrade.currentTank !== "Gunner" && tankUpgrade.currentTank !== "Gunner_Trapper") {
        tankUpgrade.upgradeChain(["Machine_Gun", "Gunner", "Gunner_Trapper"])
     }
     break;
  case "Streamliner":
     if (tankUpgrade.currentTank !== "Machine_Gun" && tankUpgrade.currentTank !== "Gunner" && tankUpgrade.currentTank !== "Streamliner") {
        tankUpgrade.upgradeChain(["Machine_Gun", "Gunner", "Streamliner"])
     }
     break;
  case "Sprayer":
     if (tankUpgrade.currentTank !== "Machine_Gun" && tankUpgrade.currentTank !== "Sprayer") {
        tankUpgrade.upgradeChain(["Machine_Gun", "Sprayer"])
     }
     break;
        //Flank_Guard
  case "Flank Guard":
     if (tankUpgrade.currentTank !== "Flank_Guard") {
        tankUpgrade.upgradeChain(["Flank_Guard"])
     }
     break;
  case "Tri Angle":
     if (tankUpgrade.currentTank !== "Flank_Guard" && tankUpgrade.currentTank !== "Tri_Angle") {
        tankUpgrade.upgradeChain(["Flank_Guard", "Tri_Angle"])
     }
     break;
  case "Fighter":
     if (!tankUpgrade.currentTank !== "Flank_Guard" && tankUpgrade.currentTank !== "Tri_Angle" && tankUpgrade.currentTank !== "Fighter") {
        tankUpgrade.upgradeChain(["Flank_Guard", "Tri_Angle", "Fighter"])
     }
     break;
  case "Booster":
     if (tankUpgrade.currentTank !== "Flank_Guard" && tankUpgrade.currentTank !== "Tri_Angle" && tankUpgrade.currentTank !== "Booster") {
        tankUpgrade.upgradeChain(["Flank_Guard", "Tri_Angle", "Booster"])
     }
     break;
        //Smasher
  case "Smasher":
     if (tankUpgrade.currentTank !== "Smasher") {
        tankUpgrade.upgradeChain(["Smasher"])
     }
     break;
  case "Landmine":
     if (tankUpgrade.currentTank !== "Smasher" && tankUpgrade.currentTank !== "Landmine") {
       tankUpgrade.upgradeChain(["Smasher", "Landmine"])
     }
     break;
    case "Auto Smasher":
     if (tankUpgrade.currentTank !== "Smasher" && tankUpgrade.currentTank !== "Auto_Smasher") {
        tankUpgrade.upgradeChain(["Smasher", "Auto_Smasher"])
     }
     break;
  case "Spike":
     if (tankUpgrade.currentTank !== "Smasher" && tankUpgrade.currentTank !== "Spike") {
        tankUpgrade.upgradeChain(["Smasher", "Spike"])
     }
     break;

        }
      }
    }
  });
});
