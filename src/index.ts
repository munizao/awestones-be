import http from 'http';
import express from 'express';
import cors from 'cors';
import {Server, LobbyRoom} from 'colyseus';
import { MyRoom } from './rooms/Awestones';

const port = Number(process.env.PORT || 2567);
const app = express();

// app.use(cors({ credentials: true, origin:['http://localhost:3000'] })); //TODO: add deployed site to origin
app.use(express.json());

const server = http.createServer(app);
const gameServer = new Server({
  server,
});
gameServer.define('awestones', MyRoom);

gameServer.listen(port);
console.log(`Listening on ws://localhost:${ port }`);