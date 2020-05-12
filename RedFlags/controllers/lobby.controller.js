
module.exports = {
    createLobby,
    joinLobby
};
// TO create a lobby
function createLobby(req, res, next) {
    console.log("createLobby in lobby controller");
    res.json({message: "Lobby created!"})
}
// join lobby
function joinLobby() {
    console.log("joinLobby controller called");
}
