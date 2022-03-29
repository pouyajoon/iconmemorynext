import React, { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { IRoomPlayer } from "../../server/server/models";
import { userSocket } from "../application/Application";
import { roomAtom } from "./rooms.recoil";
import { v4 as uuidv4 } from 'uuid';

export function PlayerOptions(props: {
    playerId: string;
    playerName: string;
    playerColor: string;
    roomId: string;
}) {
    const { playerId, playerName, playerColor, roomId } = props;

    return (
        <div style={{ color: playerColor }}>
            <span>
                <PlayerNameEdit roomId={roomId} playerId={playerId} name={playerName} />
            </span>
                <PlayerColorEdit roomId={roomId} playerId={playerId} color={playerColor} />
        </div>
    );
}

function PlayerNameEdit(props: { roomId: string; playerId: string, name: string }) {
    const { name: playerName, roomId, playerId } = props;
    const [name, setName] = useState<string>(playerName);

    useEffect(() => {
        localStorage?.setItem("playerName", name);
        userSocket.emit(
            "/rooms/players/set-name",
            roomId,
            playerId,
            name
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

function PlayerColorEdit(props: { roomId: string; playerId: string, color: string }) {
    const { color: playerColor, roomId, playerId } = props;
    const [color, setColor] = useState<string>(playerColor);

    useEffect(() => {
        localStorage?.setItem("playerColor", color);
        userSocket.emit(
            "/rooms/players/set-color",
            roomId,
            playerId,
            color
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

export function getColorFromLocalStorage() {
    return localStorage?.getItem("playerColor");
}

export function getNameFromLocalStorage() {
    return localStorage?.getItem("playerName");
}
