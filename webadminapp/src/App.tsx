import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import "./App.css";

import Layout from "./Pages/layout";
import {Leaderboard} from "./Pages/Leaderboard";
import {Search} from "./Pages/Search";
import {Add} from "./Pages/Add";
import {Home} from "./Pages/Home";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout/>}>
                    <Route path="" element={<Home/>}/>
                    <Route path="search" element={<Search/>}/>
                    <Route path="leaderboard" element={<Leaderboard/>}/>{" "}
                    <Route path="add" element={<Add/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
