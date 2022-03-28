import { useParams } from "react-router-dom";
import { atomFamily } from "recoil";
import { IRoom } from "../../server/server/models";

export const roomAtom = atomFamily<IRoom | undefined, string>({
    key: 'roomAtom',
    default: undefined
})

export function useRoomId() {
    const { roomId } = useParams();
    if (!roomId) {
        throw new Error(`no room id un query string`);
    }
    return roomId;
}