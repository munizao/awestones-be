import { Schema, Context, type, MapSchema, ArraySchema } from "@colyseus/schema";


export class Player extends Schema {
  @type("string") sessionId: string;
  @type("number") playerId: number;
  @type(["number"]) stones = new ArraySchema<number>();

}

export class MyRoomState extends Schema {
  @type([Player]) players = new ArraySchema<Player>();
  @type(["number"]) potStones = new ArraySchema<number>();
  @type(["number"]) dice = new ArraySchema<number>();
  @type("number") currentTurnPlayer: number;
  // @type("string") mySynchronizedProperty: string = "Hello world";

  createPlayer(sessionId: string) {
    const newPlayer = new Player();
    newPlayer.sessionId = sessionId;
    newPlayer.playerId = this.players.length;
    for (let i = 0; i < 6; i++) {
      newPlayer.stones.push(0);
    }
    this.players.push(newPlayer);
    // this.players.set(sessionId, new Player());
  }

  removePlayer(playerId: number) {
    this.players.deleteAt(playerId);
  }

  takeStone(playerId: number, stoneId: number) {
    this.players[playerId].stones[stoneId] += 1
    this.potStones[stoneId] -= 1;
  }
}
