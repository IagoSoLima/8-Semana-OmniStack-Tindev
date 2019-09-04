import express from 'express';
import cors from 'cors';
import io from 'socket.io';
import { Server } from 'http';
import routes from './routes';
import './database';

class App {
  constructor() {
    this.app = express();
    this.server = Server(this.app);
    this.socket();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use((req, res, next) => {
      req.io = this.io;
      req.connectedUsers = this.connectedUsers;
      return next();
    });
    this.app.use(cors());
    this.app.use(express.json());
  }

  routes() {
    this.app.use(routes);
  }

  socket() {
    this.io = io(this.server);
    this.connectedUsers = {};
    this.io.on('connection', socket => {
      const { user } = socket.handshake.query;
      this.connectedUsers[user] = socket.id;
    });
  }
}

export default new App().server;
