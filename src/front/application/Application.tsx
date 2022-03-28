import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from '../home/Home';
import { Room } from '../room/Room';
import openSocket from "socket.io-client";
import { RecoilRoot } from 'recoil';

export const userSocket = openSocket('/', { transports: ['websocket'] });

export function Application() {
    return <RecoilRoot>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/rooms/:roomId" element={<Room />} />
                <Route path="*" element={<Misc />} />
            </Routes>
        </BrowserRouter>
    </RecoilRoot>
}

function Misc() {
    return <div>Misc</div>;
}
