import React from "react";
import { Link } from "react-router-dom";
import { IRoom } from "../../server/server/models";
import { PlayersList } from "./PlayersList";

export function RoomItem(props: { room: IRoom }) {
    const { room } = props;
    return <Link to={`/rooms/${room.id}`}>
        {room.id} ({room.players.length} players)
    </Link>
}