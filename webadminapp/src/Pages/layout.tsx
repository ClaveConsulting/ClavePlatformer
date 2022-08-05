import React from "react";
import {Outlet} from "react-router-dom";
import TopBar from "../Components/TopBar";
import {AuthenticatedTemplate, UnauthenticatedTemplate} from "@azure/msal-react";
import Typography from "@mui/material/Typography";

const Layout = () => {
    return (
        <>
            <TopBar>
                <AuthenticatedTemplate>
                    <Outlet/>
                </AuthenticatedTemplate>
                <UnauthenticatedTemplate>
                    <Typography align={"center"} >
                        Please sign in using your Clave account.
                    </Typography>
                </UnauthenticatedTemplate>
            </TopBar>
        </>
    );
};

export default Layout;
