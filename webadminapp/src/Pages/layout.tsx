import React from "react";
import { Outlet } from "react-router-dom";
import TopBar from "../Components/TopBar";

const Layout = () => {
    return (
        <>
            <TopBar>
                <Outlet />
            </TopBar>
        </>
    );
};

export default Layout;
