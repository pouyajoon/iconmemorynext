import React, { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { IRoomPlayer } from "../../server/server/models";
import { userSocket } from "../application/Application";
import { roomAtom } from "./rooms.recoil";
import { v4 as uuidv4 } from 'uuid';
import { PlayerOptions } from "./PlayerOptions";

export function PlayersList(props: { players: Record<string, IRoomPlayer> }) {
    const { players } = props;
    const list = Object.values(players).sort((p1, p2) => p2.score - p1.score);
    if (list.length > 0) {
        return (
            <table width={200}>
                <tr>
                    <td>Username</td>
                    <td>Score</td>
                </tr>
                {list.map((player, i) => <PlayerRow key={i} player={player} />)}
            </table>
        );
    }
    return null;
}

export function PlayerRow(props: {
    player: IRoomPlayer;
    roomId?: string;
}) {
    const { player, roomId } = props;
    return (
        <tr style={{ color: player.color, borderBottom: '1px solid #efefef' }}>
            <td style={{ fontSize: 24 }}>{player.name}</td>
            <td style={{ fontSize: 24 }}>{player.score}</td>
        </tr>
    );
}
