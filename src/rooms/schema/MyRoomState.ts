import { Schema, Context, type, MapSchema, ArraySchema } from "@colyseus/schema";

export class StoneBucket extends Schema {
  @type(["number"]) stones = new ArraySchema<"number">()
}

export class Player extends Schema {
  @type(StoneBucket) stones: StoneBucket = new StoneBucket;
}

export class MyRoomState extends Schema {
  @type(StoneBucket) pot: StoneBucket = new StoneBucket;
  @type({ map: Player }) players = new MapSchema<Player>();
  @type(["number"]) dice = new ArraySchema<"number">()
  // @type("string") mySynchronizedProperty: string = "Hello world";

  createPlayer(sessionId: string) {
    this.players.set(sessionId, new Player());
  }

  removePlayer(sessionId: string) {
    this.players.delete(sessionId);
  }

}
