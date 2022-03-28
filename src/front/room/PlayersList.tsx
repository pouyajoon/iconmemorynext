import React from "react";
import { IRoomPlayer } from "../../server/server/models";

export function PlayersList(props: { players: IRoomPlayer[] }) {
    const { players } = props;
    if (players.length > 0) {
        return <ul>
            {players.map((player, i) => <li key={i}><Player player={player} /></li>)}
        </ul>
    }
    return null;
}

export function Player(props: { player: IRoomPlayer }) {
    const { player } = props;
    return <span>{player.id} {player.name}</span>
}