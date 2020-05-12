let express = require('express');
let router = express.Router();
let lobbyController = require('../controllers/lobby.controller');

//create lobby
router.put('/lobby', lobbyController.createLobby);
//join lobby
router.post('/lobby', lobbyController.joinLobby);


module.exports = router;
