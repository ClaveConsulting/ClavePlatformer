import React from "react";
import { useMsal } from "@azure/msal-react";
import Button from "@mui/material/Button";
import {IPublicClientApplication} from "@azure/msal-browser";

function handleLogout(instance:IPublicClientApplication) {
    instance.logoutPopup().catch(e => {
        console.error(e);
    });
}

export const SignOutButton = () => {
    const { instance } = useMsal();

    return (
        <Button variant="contained" color="info" onClick={() => handleLogout(instance)}>Sign out</Button>
    );
}