import React from "react";
import {Outlet} from "react-router-dom";
import TopBar from "../Components/TopBar";
import {AuthenticatedTemplate, UnauthenticatedTemplate} from "@azure/msal-react";
import Typography from "@mui/material/Typography";
import {Box} from "@mui/system";
import {Grid} from "@mui/material";

const Layout = () => {
    return (
        <>
            <TopBar>
                <AuthenticatedTemplate>
                    <Box sx={{padding: 2}}>
                        <Outlet/>
                    </Box>
                </AuthenticatedTemplate>
                <UnauthenticatedTemplate>
                    <Box bgcolor={"lightgray"}
                         sx={{padding: 15, margin: 2, border: 2, borderColor: "grey", borderRadius: "16px"}}>
                        <Typography align={"center"} fontWeight={"bolder"} fontStyle={{color: "grey"}}>
                            Please sign in using your Clave account.
                        </Typography>
                    </Box>

                </UnauthenticatedTemplate>
            </TopBar>
        </>
    );
};


export default Layout;
