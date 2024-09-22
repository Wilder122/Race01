const Game = require('../models/Game');
const games = {};

class GameController {
    static startGame(req, res) {
        const { roomId, player1Id, player2Id } = req.body;
        const game = new Game(roomId, player1Id, player2Id);
        games[roomId] = game;
        game.status = 'in_progress';
        res.status(200).json({ message: 'Game started', game });
    }

    static playCard(req, res) {
        const { roomId, playerId, cardId } = req.body;
        const game = games[roomId];

        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        game.playCard(playerId, cardId);
        game.switchTurn();

        res.status(200).json({ message: 'Card played', game });
    }

    static getGameStatus(req, res) {
        const { roomId } = req.params;
        const game = games[roomId];

        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        res.status(200).json(game);
    }
}

module.exports = GameController;