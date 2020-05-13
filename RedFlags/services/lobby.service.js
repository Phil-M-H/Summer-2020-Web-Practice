/** {users: []}**/
/*{
    lobbyName: String
    hostName: String
    players: [{name: String, score: Number}]
    rounds: Number
    cardsUsed: {whites: [String], reds: [String]}
    dateCreated: Number
}*/
let lobbies = {

};
module.exports = {
    createLobby,
    joinLobby,
    poll
}
async function createLobby(reqBody) {
    if (!reqBody.lobbyCode || typeof(reqBody.lobbyCode)!="string")
        throw "invalid lobby code input"

    return {test: "Ret val"};
}

async function joinLobby(lobbyCode) {

}
async function poll() {

}
