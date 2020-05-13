const lobbyService = require("../services/lobby.service");
module.exports = {
    createLobby,
    joinLobby
};
// TO create a lobby
function createLobby(req, res, next) {
    console.log("createLobby in lobby controller");
    lobbyService.createLobby(req.body)
        .then((lobbyInfo) => {
            console.log(lobbyInfo);
            res.json(lobbyInfo);
        }).catch((err) => {
            next(err);
    });
}
// join lobby
function joinLobby() {
    console.log("joinLobby controller called");
}
