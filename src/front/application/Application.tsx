import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from '../home/Home';
import { Room } from '../room/Room';

export function Application() {
    return <div>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/rooms/:id" element={<Room />} />
            </Routes>
        </BrowserRouter>
    </div>
}