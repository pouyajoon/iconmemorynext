import { v4 as uuidv4 } from "uuid";
import * as v from "validator";
import { IRoom, IRoomPlayer } from "./models";

export function getPlayerNewId() {
  return uuidv4();
}

export function setPlayerName(room: IRoom, playerId: string, name: string) {
  const player = room.players[playerId];
  if (!player) {
    throw new Error("Player not found");
  }
  player.name = name;
}

export function setPlayerColor(room: IRoom, playerId: string, color: string) {
  const player = room.players[playerId];
  if (!player) {
    throw new Error("Player not found");
  }
  player.color = color;
}

export function generatePlayerName(room: IRoom, playerId: string): string {
  let name = "Player 1";
  let i = 1;
  while (
    Object.values(room.players).filter(
      (p) => p.name === name && p.id != playerId
    ).length > 0
  ) {
    i++;
    name = `Player ${i}`;
  }
  return name;
}

export function generatePlayerColor(room: IRoom, playerId: string): string {
  const colors = ["#8D8E96", "#9497E3", "#595FDE", "#D6A592", "#823A1E"];
  let i = 0;
  let color = colors[0];
  while (
    Object.values(room.players).filter(
      (p) => p.color === color && p.id != playerId
    ).length > 0
  ) {
    i++;
    color = colors[i];
  }
  return color;
}
