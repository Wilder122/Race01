const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

router.post('/game/start', gameController.startGame);
router.post('/game/play', gameController.playCard);
router.get('/game/:roomId/status', gameController.getGameStatus);

module.exports = router;