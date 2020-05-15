const lobbyService = require("../services/lobby.service");
module.exports = {
    createLobby,
    joinLobby,
    pollLobby
};
// TO create a lobby
function createLobby(req, res, next) {
    console.log("createLobby in lobby controller");
    // console.log(Date.now());
    lobbyService.createLobby(req.body)
        .then((lobbyInfo) => {
            // console.log(lobbyInfo);
            res.json(lobbyInfo);
        }).catch((err) => {
            next(err);
    });
}
// join lobby
function joinLobby(req, res, next) {
    console.log("joinLobby controller called");
}
// polling / update lobby state
function pollLobby(req, res, next) {
    lobbyService.poll(req)
        .then((retVal) => {
            res.json(retVal);
        }).catch(err => {
            next(err);
    });
}
