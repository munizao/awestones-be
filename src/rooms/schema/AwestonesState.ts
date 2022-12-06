import { Schema, Context, type, MapSchema, ArraySchema } from "@colyseus/schema";
import { matches } from "../data/Dice";


export class Player extends Schema {
  @type("string") sessionId: string;
  @type("uint8") playerId: number;
  @type(["uint8"]) stones = new ArraySchema<number>(0, 0, 0, 0, 0, 0);

}

class Step extends Schema {
  @type("uint8") playerId: number;
  @type("string") direction: "put" | "take";
}

export class AwestonesState extends Schema {
  @type({ map: Player }) playerSessionMap = new MapSchema<Player>();
  @type([Player]) players = new ArraySchema<Player>();
  @type(["uint8"]) potStones = new ArraySchema<number>(3, 3, 3, 4, 4, 4);
  @type(["uint8"]) dice = new ArraySchema<number>(0, 0);
  @type("uint8") selectedDie: number;
  @type("uint8") currentTurnPlayer: number = 0;
  @type("string") action: string;
  @type(["uint8"]) matches = new ArraySchema<number>();
  @type([Step]) stepQueue = new ArraySchema<Step>();
  @type("boolean") gameActive: boolean = false;

  createPlayer(sessionId: string) {
    const newPlayer = new Player();
    newPlayer.sessionId = sessionId;
    newPlayer.playerId = this.players.length;
    this.players.push(newPlayer);
    this.playerSessionMap.set(sessionId, newPlayer);
    if (this.players.length === 2) {
      this.gameActive = true;
      this.rollDice();
    }
    // this.players.set(sessionId, new Player());
  }

  removePlayer(playerId: number) {
    this.players.deleteAt(playerId);
  }

  setupAction() {
    switch(this.action) {
      case "put-1":
        this.stepQueue.push(new Step({playerId: this.currentTurnPlayer, direction: "put"}));
        break;
      case "take-1": 
        this.stepQueue.push(new Step({playerId: this.currentTurnPlayer, direction: "take"}));
        break;
    }
  }

  handleStep(stoneSpecies: number) {
    const step = this.stepQueue.shift();
    switch (step.direction) {
      case "put":
        this.putStone(step.playerId, stoneSpecies);
        break;
      case "take":
        this.takeStone(step.playerId, stoneSpecies);
        break;
      default:
        console.log("Invalid step type");
        break;
    }
    if (!this.stepQueue.length) {
      this.advanceTurn();
    }
  }

  takeStone(playerId: number, stoneSpecies: number) {
    this.players[playerId].stones[stoneSpecies] += 1
    this.potStones[stoneSpecies] -= 1;
  }

  putStone(playerId: number, stoneSpecies: number) {
    this.players[playerId].stones[stoneSpecies] -= 1
    this.potStones[stoneSpecies] += 1;
  }

  rollDice() {
    this.dice.forEach(d => {
      d = Math.floor(Math.random() * 6);
    });
  }

  advanceTurn() {
    this.currentTurnPlayer = (this.currentTurnPlayer + 1) % 2;
    this.rollDice();
  }
}
