const jwt = require('jsonwebtoken');
const config = require('../config.json');
const bcrypt = require('bcrypt');

module.exports = {
    createLobby,
    joinLobby,
    poll,
    advanceLobbyState
}
/**lobby:{
    lobbyName = String
    rounds: Number
    users: [{username: String, wins: Number, played: [String], hand: [String]}]
**  hash: lobby password hash
**  admin: token
    *paused: Boolean
    whiteDeck: [String]
    redDeck: [String]
    gameState: Number
    lastAccess: Number //time
}**/
const masterWhiteDeck = ["White1", "White2", "White3"];
const masterRedDeck = ["Red1", "Red2", "Red3"];
let lobbies = [];

function randomize(arr) {
    for (let i = 0; i < arr.length; i++) {
        const randy = Math.floor(Math.random()*arr.length);
        [arr[i], arr[randy]] = [arr[randy], arr[i]];
    }
}

async function initLobby(lobby, lobbyName, password, username, token) {
    lobby.lobbyName = lobbyName;
    lobby.users = [{username: username, wins: 0, played: [], hand: []}];

    lobby.redDeck = [...masterRedDeck];
    lobby.whiteDeck = [...masterWhiteDeck];
    randomize(lobby.redDeck);
    randomize(lobby.whiteDeck);

    lobby.lastAccess = Date.now();
    lobby.hash = await bcrypt.hash(password, 10);
    lobby.admin = token;
    lobby.gamestate = 0;
}
function verifyInputCL(reqBody) {
    // console.log(typeof(reqBody.lobbyCode),
    //     typeof(reqBody.username),
    //     typeof(reqBody.lobbyPassword),
    //     typeof(reqBody.rounds));
    if (typeof(reqBody.lobbyName) != "string"
        || typeof(reqBody.username) != "string"
        || typeof(reqBody.password) != "string") {
        throw "Invalid lobby input"
    }
}
async function createLobby(reqBody) {
    verifyInputCL(reqBody);
    let response;
    let lobby = lobbies.find((lobby) => {
        if (lobby.lobbyName && lobby.lobbyName == reqBody.lobbyName)
            return true;
    });
    if (lobby) {//lobby name already exists
        if (Date.now() - lobby.lastAccess < 600000) {//lobby in use recently
            throw "Lobby already exists";
        }
    } else {
        lobby = {}
        lobbies.push(lobby);
    }
    const jwtPayload = {sub: reqBody.lobbyName, username: reqBody.username};
    const token = jwt.sign(jwtPayload, config.secret);

    await initLobby(lobby, reqBody.lobbyName, reqBody.password, reqBody.username, token);

    const {hash, admin, whiteDeck, redDeck, ...retLobby} = lobby;
    return {retLobby, token};
}
async function joinLobby(reqBody) {
// {lobbyName, desiredusername, password}
    if (!reqBody.lobbyName || !reqBody.desiredusername || !reqBody.password) {
        throw "Invalid lobby input";
    }
    let err;
    let lobby = lobbies.find(element => {
        if (element.lobbyName == reqBody.lobbyName) {
            if (element.users.find(user => user.username == reqBody.desiredusername)) {
                err = "Username already taken";
            }
            return true;
        }
    });
    if (err) {
        throw err;
    }
    if (!lobby) {
        throw "Attempted to join a lobby that does not exist.";
    }
    if (!await bcrypt.compare(reqBody.password, lobby.hash)) {
        throw "Invalid password to join the lobby.";
    }
    lobby.users.push({username: reqBody.desiredusername, wins: 0, hand: [], played: []});
    lobby.lastAccess = Date.now();
    const jwtPayload = {sub: reqBody.lobbyName, username: reqBody.desiredusername};
    const token = jwt.sign(jwtPayload, config.secret);

    const {hash, admin, whiteDeck, redDeck, ...retLobby} = lobby;
    return {retLobby, token};
}
async function advanceLobbyState(req) {
    let receivedToken;
    try {
        receivedToken = req.headers.authorization.split(' ')[1];
    } catch (err) {
        throw "Improperly formatted jwt token";
    }
    let theirLobby = lobbies.find(lobby => receivedToken == lobby.admin);
    if (!theirLobby) {
        throw "You don't own a lobby";
    }

    //modify lobby data for the new gamestate
    const gamestate = theirLobby.gamestate;
    if (gamestate == 3) {
        resetLobby(theirLobby);
        theirLobby.gamestate = 0;
    } else if (gamestate == 0) {
        distributeDecks(theirLobby);
        theirLobby.gamestate += 1;
    } else {
        theirLobby.gamestate = 2;

    }
    //advance gamestate
}
function distributeDecks(lobby) {
    function distributeSingleDeck(deck, lobby, cardsPerPerson) {
        lobby.users.forEach(user => {
            user.hand = [];
            for (let i = 0; i < cardsPerPerson; i++) {
                user.hand.push(deck.pop());
            }
        });
    }
    if (!Array.isArray(lobby.whiteDeck) || !Array.isArray(lobby.redDeck) ) {
        throw "Decks not initialized";
    }
    const wCPP = Math.floor(lobby.whiteDeck.length / lobby.users.length);
    const rCPP = Math.floor(lobby.redDeck.length / lobby.users.length);
    if (wCPP < 3 || rCPP < 2) {
        lobby.redDeck = [...masterRedDeck];
        lobby.whiteDeck = [...masterWhiteDeck];
        randomize(lobby.redDeck);
        randomize(lobby.whiteDeck);
    }
    if (wCPP < 3 || rCPP < 2) {throw "Not enough cards created in the game!";}

    distributeSingleDeck(lobby.whiteDeck, lobby, wCPP);
    distributeSingleDeck(lobby.redDeck, lobby, wCPP);

}
function resetLobby(lobby) {
    lobby.redDeck = [...masterRedDeck];
    lobby.whiteDeck = [...masterWhiteDeck];
    randomize(lobby.redDeck);
    randomize(lobby.whiteDeck);

    lobby.lastAccess = Date.now();
    lobby.users.forEach(user => {
        user.wins = 0;
        user.hand = [];
    })
}
async function playWhiteCard(req) {
    let {lobby, user} = await findLobbyOfUser(req);
    if (lobby.gamestate !== 1) {
        throw "Cannot play white cards during this gamestate";
    }
    let played = req.body.played;
    if (!played || !Array.isArray(played) || played.length !== 2 || typeof(played[0]) != 'string' || typeof(played[1]) != 'string') {
        throw "Invalid plays received.";
    }

    //verify the cards they are playing are something they have
    let blanks = 0;
    user.hand.forEach(card => {
        if (card == "blank") {
            blanks += 1;
        }
    });
    let hits = 0; //counter for cards they are playing that are derived from their hand
    hits += user.hand.includes(played[0]) ? 1 : 0;
    hits += user.hand.includes(played[1]) ? 1 : 0;
    if (hits + blanks < 2) {
        throw "Invalid plays.";
    }
    
}
async function poll(req) {//use jwt.verify
    let {lobby, user} = await findLobbyOfUser(req);
    lobby.lastAccess = Date.now();
    const {hash, admin, whiteDeck, redDeck, ...retLobby} = lobby;
    return retLobby;
}
async function findLobbyOfUser(req) {
    let token;
    try {
        token = req.headers.authorization.split(' ')[1];
    } catch (err) {
        throw "Invalid jwt token format";
    }
    let given;
    await jwt.verify(token, config.secret, function (err, decoded) {
        if (err) {
            throw "Invalid token received.";
        }
        given = decoded;
    });
    let user;
    let lobby = lobbies.find(element => {
        if (element.lobbyName == given.sub) {
            user = element.users.find(user => user.username == given.username)
            if (user) {
                return true;
            }
        }
    });
    if (!lobby) {
        throw "Could not poll lobby: Does Not Exist, or you have been kicked from it.";
    }
    return {lobby, user};
}
/* {
    lastStateChange: Number
        a Date.now() when state last changed
    gamestate: Number
        if 0:
            lobby waiting
        if 1:
            whiteCards: [String]
            redCards: [String]
            targetUser: String //user to play cards for
        if 3:
            total results score

} */
