import { Room, Client } from "colyseus";
import { AwestonesState } from "./schema/AwestonesState";
import { matches, actions } from "./data/Dice";

export class MyRoom extends Room<AwestonesState> {

  onCreate (options: any) {
    this.setState(new AwestonesState());

    this.onMessage("select-die", (client, data) => {
      const actionDie = data;
      const matchesDie = (data + 1) % 2;
      this.state.selectedDie = data;
      this.state.action = actions[this.state.dice[actionDie]];
      this.state.matches.push(...matches[matchesDie][this.state.dice[matchesDie]]);
      this.state.setupAction();
    });

    this.onMessage("select-stones", (client, data) => {
      const stoneSpecies = data;
      this.state.handleStep(stoneSpecies);
      if (this.state.stepQueue.length === 0) {
        this.state.advanceTurn();
      }
    });

    this.onMessage("abandon", (client, data) => {
      this.disconnect();
      console.log("game abandoned");
    });
  }

  onJoin (client: Client, options: any) {
    console.log(client.sessionId, "joined!");
    this.state.createPlayer(client.sessionId);
  }

  async onLeave (client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
    await this.allowReconnection(client, 180);
    //any more code we might need post reconnection goes here?

    //this.state.removePlayer(client.userData.playerId);
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}
