const express = require('express');
const router = express.Router();
const db = require('../db');
const Game = require('../models/Game');
const games = {};

const controller = require('../controllers/roomsController');

module.exports = (io) => {
  router.get('/rooms', controller.getRooms);
  router.post('/join-room', controller.joinRoom);
  router.post('/create-room', controller.createRoom);

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('createRoom', (roomId) => {
      socket.join(roomId);
      console.log(`Room ${roomId} created, user ${socket.id} joined room`);
    });

    socket.on('joinRoom', async (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);

      const room = io.sockets.adapter.rooms.get(roomId);
      const playersCount = room ? room.size : 0;

      if (playersCount === 2) {
        const playerIds = Array.from(room);

        if (!games[roomId]) {
          const game = new Game(roomId, { id: playerIds[0] }, { id: playerIds[1] });
          games[roomId] = game;
          await game.initGame();
        }

        const game = games[roomId];
        console.log(game);

        const testSock1 = io.sockets.sockets.get(game.players[0].id);
        const testSock2 = io.sockets.sockets.get(game.players[1].id);

        io.to(game.players[0].id).emit('navigate_room', game.roomId);
        io.to(game.players[1].id).emit('navigate_room', game.roomId);
        console.log(`Emitting game_update to player1: ${game.players[0].id}`);
        console.log(`Emitting game_update to player2: ${game.players[1].id}`);

        testSock1.emit('game_update', {
          playerIndex: 0,
          gameState: game,
        });
        testSock2.emit('game_update', {
          playerIndex: 1,
          gameState: game,
        });

        console.log(`Game started in room ${roomId}`);
      }
    });

    socket.on('playCard', async ({ roomId, playerId, cardIndex }) => {
      const game = games[roomId];
      if (game) {
        game.playCard(playerId, cardIndex);

        const testSock1 = io.sockets.sockets.get(game.players[0].id);
        const testSock2 = io.sockets.sockets.get(game.players[1].id);

        testSock1.emit('game_update', {
          playerIndex: 0,
          gameState: game,
        });
        testSock2.emit('game_update', {
          playerIndex: 1,
          gameState: game,
        });

        console.log(`Card played by player: ${playerId}`);
      }
    });
    
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return router;
};
