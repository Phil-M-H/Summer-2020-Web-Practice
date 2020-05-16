const jwt = require('jsonwebtoken');
const config = require('../config.json');
const bcrypt = require('bcrypt');

module.exports = {
    createLobby,
    joinLobby,
    poll,
    setLobbyState
}
/**lobby:{
    lobbyName = String
    rounds: Number
    users: [{username: String, wins: Number}]
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

async function initLobby(lobby, lobbyName, password, username, rounds, token) {
    lobby.lobbyName = lobbyName;
    lobby.users = [{username: username, wins: 0}];
    lobby.rounds = rounds;
    lobby.redDeck = [...masterRedDeck];//todo randomize order
    lobby.whiteDeck = [...masterWhiteDeck];
    lobby.lastAccess = Date.now();
    lobby.hash = await bcrypt.hash(password, 10);
    lobby.admin = token;
}
function verifyInputCL(reqBody) {
    // console.log(typeof(reqBody.lobbyCode),
    //     typeof(reqBody.username),
    //     typeof(reqBody.lobbyPassword),
    //     typeof(reqBody.rounds));
    if (typeof(reqBody.lobbyName) != "string"
        || typeof(reqBody.username) != "string"
        || typeof(reqBody.password) != "string"
        || typeof(reqBody.rounds) != "number") {
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

    await initLobby(lobby, reqBody.lobbyName, reqBody.password, reqBody.username, reqBody.rounds, token);

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
    lobby.users.push({username: reqBody.desiredusername, wins: 0});
    lobby.lastAccess = Date.now();
    const jwtPayload = {sub: reqBody.lobbyName, username: reqBody.desiredusername};
    const token = jwt.sign(jwtPayload, config.secret);

    const {hash, admin, whiteDeck, redDeck, ...retLobby} = lobby;
    return {retLobby, token};
}
async function setLobbyState(req, gamestate) {
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


}
async function poll(req) {//use jwt.verify
    let token;
    try {
        token = req.headers.authorization.split(' ')[1];
    } catch(err){
        throw "Invalid jwt token format";
    }
    let given;
    await jwt.verify(token, config.secret, function(err, decoded) {
        if (err) {
            throw "Invalid token received.";
        }
        given = decoded;
    });
    let lobby = lobbies.find(element => {
        if (element.lobbyName == given.sub) {
            if (element.users.find(user => user.username == given.username)) {
                return true;
            }
        }
    });
    if (!lobby) {
        throw "Could not poll lobby: Does Not Exist, or you have been kicked from it.";
    }

    lobby.lastAccess = Date.now();
    const {hash, admin, whiteDeck, redDeck, ...retLobby} = lobby;
    return retLobby;
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
