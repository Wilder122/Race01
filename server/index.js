const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path')

const authRouter = require('./routes/authRouter');
const roomsRouter = require('./routes/roomsRouter');

const PORT = process.env.PORT || 5000;
const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'public')));

app.use(authRouter);
app.use(roomsRouter(io));

const start = () => {
  try {
    server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
