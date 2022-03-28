import React from "react";

export function PlayersList(props: { players: IRoomPlayer[] }) {
    const { players } = props;
    if (players.length > 0) {
        return <ul>
            {players.map((player, i) => <li key={i}>{player.id} {player.name}</li>)}
        </ul>
    }
    return null;
}