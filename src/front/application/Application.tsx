import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from '../home/Home';
import { Room } from '../room/Room';

export function Application() {
    return <div>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/a" element={<A />} />
                <Route path="/a/a" element={<A />} />
                <Route path="/rooms/:id" element={<Room />} />
                <Route path="*" element={<Misc />} />
            </Routes>
        </BrowserRouter>
    </div>
}

function A() {
    return 'AA';
}

function Misc() {
    return 'Misc';
}