import React from "react";
import { IRoomPlayer } from "../../server/server/models";

export function PlayersList(props: { players: Record<string, IRoomPlayer> }) {
    const { players } = props;
    if (Object.keys(players).length > 0) {
        return <ul>
            {Object.values(players).map((player, i) => <li key={i}><Player player={player} /></li>)}
        </ul>
    }
    return null;
}

export function Player(props: { player: IRoomPlayer }) {
    const { player } = props;
    return <span>{player.id} {player.name}</span>
}
