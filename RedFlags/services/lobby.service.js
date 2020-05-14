const jwt = require('jsonwebtoken');
const config = require('../config.json');
/**lobby:{
    lobbyCode = String
    rounds: Number
    users: [String_Name]
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
function initLobby(lobby, desiredName, jwt) {
    lobby.lastAccess = Date.now();
    lobby.whiteDeck = [...masterWhiteDeck];
    lobby.redDeck = [...masterRedDeck];//todo randomize order
}
function verifyInputCL(reqBody) {
    if (!reqBody.lobbyCode || typeof(reqBody.lobbyCode)!="string") {
        throw "invalid lobby code input";
    }
}
async function createLobby(reqBody) {
    let response;
    /*reqBody {
        lobbyCode: String
        userName: String
    }*/

    const token = jwt.sign({ sub: reqBody.lobbyCode}, config.secret);

    let lobby = lobbies.find((lobby) => {
        if (lobby.lobbyCode && lobby.lobbyCode == token)//if already exists
            return true;
    });
    if (lobby && Date.now() - lobby.lastAccess > 1800000) { //more than 30 minutes have passed since lobby last accessed

    } else { //cannot join
        return {failure: "already exists"};
    }
    return lobby;
}
/*  lobbyCode = String
    rounds: Number
    users: [String_Name]
    whiteDeck: [String]
    redDeck: [String]
    lastAccess: Number //time
 */
async function joinLobby(lobbyCode) {

}
async function poll() {

}
