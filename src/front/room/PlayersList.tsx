import React, { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { IRoomPlayer } from "../../server/server/models";
import { createPlayer } from "../../server/server/player_server";
import { userSocket } from "../application/Application";
import { roomAtom } from "./rooms.recoil";

export function PlayersList(props: { players: Record<string, IRoomPlayer> }) {
    const { players } = props;
    if (Object.keys(players).length > 0) {
        return (
            <ul>
                {Object.values(players).map((player, i) => (
                    <li key={i}>
                        <Player edit={false} player={player} />
                    </li>
                ))}
            </ul>
        );
    }
    return null;
}

export function Player(props: {
    player: IRoomPlayer;
    roomId?: string;
    edit: boolean;
}) {
    const { player, edit, roomId } = props;
    return (
        <div style={{ color: player.color }}>
            <span>
                {/* {player.id} */}
                {roomId && edit ? (
                    <PlayerNameEdit roomId={roomId} name={player.name} />
                ) : (
                    player.name
                )}
            </span>
            {edit && roomId && (
                <PlayerColorEdit roomId={roomId} color={player.color} />
            )}
        </div>
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

    // if (!id) {
    // }

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
                console.log(e.target.value);
                setColor(e.target.value);
            }}
        />
    );
}
