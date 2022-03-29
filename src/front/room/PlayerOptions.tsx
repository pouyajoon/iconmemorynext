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
        <div>
            <div>
                Name:&nbsp;
                <PlayerNameEdit roomId={roomId} playerId={playerId} name={playerName} />
            </div>
            <div>
                Color:&nbsp;
                <PlayerColorEdit roomId={roomId} playerId={playerId} color={playerColor} />
            </div>
        </div>
    );
}

function PlayerNameEdit(props: { roomId: string; playerId: string, name: string }) {
    const { name, roomId, playerId } = props;

    return (
        <input
            value={name}
            onChange={(e) => {
                const newName = e.target.value;
                localStorage?.setItem("player.name", newName);
                userSocket.emit(
                    "/rooms/players/set-name",
                    roomId,
                    playerId,
                    newName
                );
            }}
        />
    );
}

function PlayerColorEdit(props: { roomId: string; playerId: string, color: string }) {
    const { color, roomId, playerId } = props;

    return (
        <input
            type="color"
            value={color}
            onChange={(e) => {
                const newColor = e.target.value;
                localStorage?.setItem("player.color", newColor);
                userSocket.emit(
                    "/rooms/players/set-color",
                    roomId,
                    playerId,
                    newColor
                );
            }}
        />
    );
}

export function getColorFromLocalStorage() {
    return localStorage?.getItem("player.color");
}

export function getNameFromLocalStorage() {
    return localStorage?.getItem("player.name");
}
