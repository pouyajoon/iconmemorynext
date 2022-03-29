import React, { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { IRoomPlayer } from "../../server/server/models";
import { createPlayer } from "../../server/server/player_server";
import { userSocket } from "../application/Application";
import { roomAtom } from "./rooms.recoil";

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


export function EditPlayer(props: {
    player: IRoomPlayer;
    roomId: string;
}) {
    const { player, roomId } = props;
    return <div>
        <PlayerNameEdit roomId={roomId} name={player.name} />
        <PlayerColorEdit roomId={roomId} color={player.color} />
    </div>
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
export function getPlayerFromLocalStorage(): IRoomPlayer {
    const name = localStorage?.getItem("playerName") || Math.random().toString();
    const newPlayer = createPlayer(name, "#FF0000");
    const id = localStorage?.getItem("playerId") || newPlayer.id;
    const color = localStorage?.getItem("playerColor") || newPlayer.color;

    localStorage?.setItem("playerId", id);
    localStorage?.setItem("playerName", name);
    localStorage?.setItem("playerColor", color);

    return { ...newPlayer, id, color };
}

function PlayerNameEdit(props: { roomId: string; name: string }) {
    const { name: playerName, roomId } = props;
    const [name, setName] = useState<string>(playerName);

    useEffect(() => {
        localStorage?.setItem("playerName", name);
        userSocket.emit(
            "/players/add",
            getPlayerFromLocalStorage(),
            roomId
        );
    }, [name]);

    return (
        <input
            value={name}
            onChange={(e) => {
                setName(e.target.value);
            }}
        />
    );
}

function PlayerColorEdit(props: { roomId: string; color: string }) {
    const { color: playerColor, roomId } = props;
    // const playerId = localStorage?.getItem('player');
    const [color, setColor] = useState<string>(playerColor);

    useEffect(() => {
        localStorage?.setItem("playerColor", color);
        userSocket.emit(
            "/players/add",
            getPlayerFromLocalStorage(),
            roomId
        );
    }, [color]);

    return (
        <input
            type="color"
            value={playerColor}
            onChange={(e) => {
                setColor(e.target.value);
            }}
        />
    );
}
