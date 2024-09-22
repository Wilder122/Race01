const db = require('../db');

class RoomController {
  static getRooms(req, res) {
    const query = 'SELECT * FROM rooms WHERE status = "waiting"';
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching rooms:', err);
        return res.status(500).json({ message: 'Server error' });
      }
      res.status(200).json(results);
    });
  }

  static async joinRoom(req, res) {
    const { roomId, player2Id } = req.body;
    const query = 'UPDATE rooms SET player2_id = ?, status = "in_progress" WHERE id = ?';

    try {
        const result = await new Promise((resolve, reject) => {
            db.query(query, [player2Id, roomId], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: 'Room is already full or in progress' });
        }

        res.status(200).json({ message: 'Joined room successfully' });
    } catch (err) {
        console.error('Error joining room:', err);
        return res.status(500).json({ message: 'Server error' });
    }
}

  static createRoom(req, res) {
    const { roomName, player1_id } = req.body;
    const query = 'INSERT INTO rooms (room_name, player1_id, status) VALUES (?, ?, ?)';

    db.query(query, [roomName, player1_id, 'waiting'], (err, result) => {
      if (err) {
        console.error('Error creating room:', err);
        return res.status(500).json({ message: 'Error creating room' });
      }

      res.status(201).json({ id: result.insertId, room_name: roomName, status: 'waiting' });
    });
  }
}

module.exports = RoomController;
