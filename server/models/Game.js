const db = require('../db');

class Game {
  constructor(roomId, player1, player2) {
    this.roomId = roomId;
    this.players = [
      { id: player1.id, health: 70, totalCost: 0, hand: [], deck: [], card: null, login: null }, // Player 1
      { id: player2.id, health: 70, totalCost: 0, hand: [], deck: [], card: null, login: null }  // Player 2
    ];
    this.roundInProgress = false;
  }

  async initGame() {
    const nicknames = await this.getUserNicknames(this.roomId);
    this.players[0].login = nicknames[0];
    this.players[1].login = nicknames[1];

    const shuffledDeck = await this.generateDeck();

    this.players[0].deck = shuffledDeck.slice(0, 10);
    this.players[1].deck = shuffledDeck.slice(10, 20);

    this.players[0].hand = this.players[0].deck.splice(0, 5);
    this.players[1].hand = this.players[1].deck.splice(0, 5);
  }

  async generateDeck() {
    const cards = await this.fetchCardsFromDB();
    return this.shuffleDeck(cards);
  }

  fetchCardsFromDB() {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM cards', (error, results) => {
        if (error) {
          console.error('Error fetching cards from DB:', error);
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }

  async getUserNicknames(roomId) {
    try {
      const roomQuery = 'SELECT player1_id, player2_id FROM rooms WHERE id = ?';
      const roomResult = await new Promise((resolve, reject) => {
        db.query(roomQuery, [roomId], (error, results) => {
          if (error) return reject(error);
          resolve(results);
        });
      });

      if (roomResult.length === 0) {
        throw new Error('Room not found');
      }

      const { player1_id, player2_id } = roomResult[0];
      const userQuery = 'SELECT login FROM users WHERE id IN (?, ?)';
      const userResult = await new Promise((resolve, reject) => {
        db.query(userQuery, [player1_id, player2_id], (error, results) => {
          if (error) return reject(error);
          resolve(results);
        });
      });
      return userResult.map(user => user.login);
    } catch (error) {
      console.error('Error getting user nicknames:', error);
      throw error;
    }
  }

  shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }

  playCard(playerId, cardIndex) {
    const player = this.players.find(p => p.id === playerId);

    if (player && player.hand[cardIndex]) {
      player.card = player.hand[cardIndex];
      player.hand.splice(cardIndex, 1);

      if (player.deck.length > 0) {
        player.hand.push(player.deck.shift());
      }
    }

    if (this.players[0].card && this.players[1].card) {
      this.endRound();
    }
  }

  endRound() {
    const player1 = this.players[0];
    const player2 = this.players[1];

    const player1Damage = Math.max(0, player2.card.attack - player1.card.defense);
    const player2Damage = Math.max(0, player1.card.attack - player2.card.defense);

    player1.health -= player1Damage;
    player2.health -= player2Damage;

    player1.card = null;
    player2.card = null;

    if (player1.health <= 0 || player2.health <= 0) {
      this.endGame();
    } else {
      this.roundInProgress = false;
    }
  }

  endGame() {
    const winner = this.players[0].health > 0 ? 'player1' : 'player2';
    console.log(`Game over! Winner: ${winner}`);
  }
}

module.exports = Game;
