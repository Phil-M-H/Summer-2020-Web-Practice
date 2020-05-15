const jwt = require('jsonwebtoken');
const config = require('../config.json');
const bcrypt = require('bcryptjs');
/**lobby:{
    lobbyName = String
    hash: lobby password hash
    rounds: Number
    users: [{username: String, wins: Number}]
    whiteDeck: [String]
    redDeck: [String]
    lastAccess: Number //time
}**/
const masterWhiteDeck = ["White1", "White2", "White3"];
const masterRedDeck = ["Red1", "Red2", "Red3"];
let lobbies = [];
module.exports = {
    createLobby,
    joinLobby,
    poll
}

async function initLobby(lobby, lobbyName, username, lobbyPassword, rounds) {
    lobby.lobbyName = lobbyName;
    lobby.users = [{username: username, wins: 0}];
    lobby.rounds = rounds;
    lobby.redDeck = [...masterRedDeck];//todo randomize order
    lobby.whiteDeck = [...masterWhiteDeck];
    lobby.lastAccess = Date.now();
    await bcrypt.hash(lobbyPassword, 10, function(err, hash) {
        console.log("HASHING COMPLETE------------------");
        console.log(hash);
        lobby.hash = hash;
        console.log("Lobby hash: ", lobby.hash);
    });
    console.log(lobby.hash);
}
function verifyInputCL(reqBody) {
    // console.log(typeof(reqBody.lobbyCode),
    //     typeof(reqBody.username),
    //     typeof(reqBody.lobbyPassword),
    //     typeof(reqBody.rounds));
    if (typeof(reqBody.lobbyName) != "string"
        || typeof(reqBody.username) != "string"
        || typeof(reqBody.lobbyPassword) != "string"
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
    await initLobby(lobby, reqBody.lobbyName, reqBody.username, reqBody.password, reqBody.rounds);

    const jwtPayload = {sub: reqBody.lobbyName, username: reqBody.username};
    const token = jwt.sign(jwtPayload, config.secret);

    return {lobby, token};
}
async function joinLobby(reqBody) {
// {lobbyCode, desiredName}
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
    if (!(typeof(given.sub)=="string") || !(typeof(given.username)=="string")) {
        throw "Invalid decoded token";
    }
    let lobby = lobbies.find(element => {
        if (element.lobbyName == given.sub) {
            console.log(element);
            if (element.users.find(user => user.username ==given.username)) {
                return true;
            }
        }
    });
    if (lobby) {
        console.log("lobby found", lobby);
    }
    return 1;
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
